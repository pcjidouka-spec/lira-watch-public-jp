/**
 * 0 を実値として扱うかの通貨ペア x 方向ポリシー (dataProcessor.isZeroRealValue)。
 *
 * ★背景: これまで 0 は一律「取得失敗/取扱なし」とみなして除外していた。
 *   クロスペアの買だけは例外扱いが入っていたが、CHF/JPY では
 *   invast (トライオートFX) が売 0.0 を**方針として実際に提示している**
 *   (tryuniondata_chf/master_history_chf.csv: invast,CHF/JPY,3.0,-30.0,0.0,success)。
 *   除外したままだと売ランキングから invast が黙って消える。
 *
 * ★このテストは「0 が残ること」と「残らないこと」の両方を固定する。
 *   カーブアウトを外せば CHF のテストが落ち、全通貨に広げれば TRY のテストが落ちる。
 */
import { describe, expect, it } from 'vitest';

import { getBuyRanking, getSellRanking, isZeroRealValue, parseCSVData } from './dataProcessor';
import { getProviderChartData } from './providerChartData';

const HEADER =
  'target_date,provider_id,currency_pair,name,days,swap_buy,swap_sell,settlement_date,status,actual_date';

function csv(rows: string[]): string {
  return [HEADER, ...rows].join('\n');
}

/** 直近 14 日の窓に入るよう、今日から n 日前の日付を作る */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/** master_history_chf.csv の実データ (2026-09-10) を 1 日分そのまま並べたもの */
function chfRows(date: string): string[] {
  return [
    `${date},dmm,CHF/JPY,DMM FX,1,-33.0,30.0,,success,`,
    `${date},gaitame,CHF/JPY,外為どっとコム,3,-40.0,20.0,,success,`,
    `${date},gmo,CHF/JPY,GMO外貨,3,-20.0,20.0,,success,`,
    `${date},gmo_click,CHF/JPY,GMOクリック証券,3,-30.0,30.0,,success,`,
    // ★invast は売 0.0 を方針として提示している (取得失敗ではない)
    `${date},invast,CHF/JPY,トライオートFX,3,-30.0,0.0,,success,`,
    `${date},traders_light,CHF/JPY,LIGHT FX,3,-20.0,20.0,,success,`,
    `${date},traders_min,CHF/JPY,みんなのFX,3,-20.0,20.0,,success,`,
  ];
}

describe('isZeroRealValue (0 の扱いの唯一の定義)', () => {
  it('CHF/JPY は売だけ 0 を実値として扱う', () => {
    expect(isZeroRealValue('CHF/JPY', 'sell')).toBe(true);
    expect(isZeroRealValue('CHF/JPY', 'buy')).toBe(false);
  });

  it('クロスペアは買だけ 0 を実値として扱う', () => {
    expect(isZeroRealValue('EUR/USD', 'buy')).toBe(true);
    expect(isZeroRealValue('EUR/USD', 'sell')).toBe(false);
  });

  it('通常の JPY ペアはどちらも 0 を実値として扱わない', () => {
    expect(isZeroRealValue('TRY/JPY', 'buy')).toBe(false);
    expect(isZeroRealValue('TRY/JPY', 'sell')).toBe(false);
  });
});

describe('CHF/JPY: 売 0.0 の業者が消えない', () => {
  it('売ランキングに invast が残る', () => {
    const data = parseCSVData(csv([...chfRows(daysAgo(2)), ...chfRows(daysAgo(1))]));
    const ranking = getSellRanking(data, undefined, 'CHF/JPY');

    const ids = ranking.map((r) => r.provider_id);
    expect(ids).toContain('invast');
    expect(ids).toHaveLength(7);

    const invast = ranking.find((r) => r.provider_id === 'invast')!;
    expect(invast.swap_sell).toBe(0);
    expect(invast.latest_sell).toBe(0);
    // 値の大きい順ソートなので、売 0 (支払いゼロ) は受取り組より下・支払い組より上
    expect(ids[ids.length - 1]).toBe('invast');
  });

  it('売ランキングの平均に 0 が母数として入る', () => {
    // ★0 が除外されると -10 の日だけで平均が -10 になる。母数に入れば -5。
    const data = parseCSVData(
      csv([
        `${daysAgo(2)},invast,CHF/JPY,トライオートFX,1,-30.0,0.0,,success,`,
        `${daysAgo(1)},invast,CHF/JPY,トライオートFX,1,-30.0,-10.0,,success,`,
      ])
    );
    const invast = getSellRanking(data, undefined, 'CHF/JPY')[0];
    expect(invast.swap_sell).toBe(-5);
  });

  it('買ランキングの売カラムにも 0 が母数として入る', () => {
    const data = parseCSVData(
      csv([
        `${daysAgo(2)},invast,CHF/JPY,トライオートFX,1,-30.0,0.0,,success,`,
        `${daysAgo(1)},invast,CHF/JPY,トライオートFX,1,-30.0,-10.0,,success,`,
      ])
    );
    const invast = getBuyRanking(data, undefined, 'CHF/JPY')[0];
    expect(invast.swap_buy).toBe(-30);
    expect(invast.swap_sell).toBe(-5);
  });

  it('買 0 は CHF/JPY でも従来どおり除外する (方向ごとに効く)', () => {
    const data = parseCSVData(
      csv([
        `${daysAgo(2)},dmm,CHF/JPY,DMM FX,1,-33.0,30.0,,success,`,
        `${daysAgo(1)},dmm,CHF/JPY,DMM FX,1,-33.0,30.0,,success,`,
        `${daysAgo(2)},broken,CHF/JPY,取得失敗業者,1,0.0,30.0,,success,`,
        `${daysAgo(1)},broken,CHF/JPY,取得失敗業者,1,0.0,30.0,,success,`,
      ])
    );
    const ids = getBuyRanking(data, undefined, 'CHF/JPY').map((r) => r.provider_id);
    expect(ids).not.toContain('broken');
  });
});

describe('カーブアウトの無い通貨ペアは従来どおり 0 を落とす', () => {
  const tryData = () =>
    parseCSVData(
      csv([
        `${daysAgo(2)},dmm,TRY/JPY,DMM FX,1,24.0,-24.0,,success,`,
        `${daysAgo(1)},dmm,TRY/JPY,DMM FX,1,26.0,-26.0,,success,`,
        `${daysAgo(2)},zeroco,TRY/JPY,ゼロ社,1,0.0,0.0,,success,`,
        `${daysAgo(1)},zeroco,TRY/JPY,ゼロ社,1,0.0,0.0,,success,`,
      ])
    );

  it('TRY/JPY の 0 は売ランキングから落ちる', () => {
    const ids = getSellRanking(tryData(), undefined, 'TRY/JPY').map((r) => r.provider_id);
    expect(ids).toEqual(['dmm']);
  });

  it('TRY/JPY の 0 は買ランキングから落ちる', () => {
    const ids = getBuyRanking(tryData(), undefined, 'TRY/JPY').map((r) => r.provider_id);
    expect(ids).toEqual(['dmm']);
  });
});

describe('クロスペアの挙動は変わらない', () => {
  const eurData = () =>
    parseCSVData(
      csv([
        `${daysAgo(2)},dmm,EUR/USD,DMM FX,1,0.0,12.0,,success,`,
        `${daysAgo(1)},dmm,EUR/USD,DMM FX,1,0.0,12.0,,success,`,
        `${daysAgo(2)},zeroco,EUR/USD,ゼロ社,1,-5.0,0.0,,success,`,
        `${daysAgo(1)},zeroco,EUR/USD,ゼロ社,1,-5.0,0.0,,success,`,
      ])
    );

  it('買 0 は買ランキングに残る', () => {
    const ranking = getBuyRanking(eurData(), undefined, 'EUR/USD');
    const dmm = ranking.find((r) => r.provider_id === 'dmm');
    expect(dmm?.swap_buy).toBe(0);
  });

  it('売 0 は売ランキングから落ちたまま', () => {
    const ids = getSellRanking(eurData(), undefined, 'EUR/USD').map((r) => r.provider_id);
    expect(ids).toEqual(['dmm']);
  });
});

describe('グラフ (getProviderChartData)', () => {
  it('CHF/JPY の売 0 は描画される', () => {
    const data = parseCSVData(csv([...chfRows(daysAgo(2)), ...chfRows(daysAgo(1))]));
    const map = getProviderChartData(data, 'sell', undefined, 'CHF/JPY');
    expect(map.has('invast')).toBe(true);
    expect(map.get('invast')!.data.map((d) => d.value)).toEqual([0, 0]);
  });

  it('CHF/JPY の買 0 は描画されない', () => {
    const data = parseCSVData(
      csv([`${daysAgo(1)},broken,CHF/JPY,取得失敗業者,1,0.0,30.0,,success,`])
    );
    expect(getProviderChartData(data, 'buy', undefined, 'CHF/JPY').has('broken')).toBe(false);
  });

  it('TRY/JPY の 0 は描画されない', () => {
    const data = parseCSVData(
      csv([`${daysAgo(1)},zeroco,TRY/JPY,ゼロ社,1,0.0,0.0,,success,`])
    );
    expect(getProviderChartData(data, 'sell', undefined, 'TRY/JPY').has('zeroco')).toBe(false);
  });
});

/**
 * ★不変条件: 同じ業者の買平均は、買ランキングと売ランキングで一致する。
 *
 * 0 の除外は 7 箇所に散っていたものを isZeroRealValue 1 つに集約して直した。
 * ★次に誰かが片方の箇所だけ触ると、同じ食い違いが黙って復活する。
 *   それを検出できるのはこの不変条件だけなので、ここで固定する。
 *
 * 実際に起きていた食い違い (2026-09-11 に master_history_gbpusd.csv で実測):
 *   GBP/USD traders_light は 2026-05-18 に買スワップが 4.7 から 0.0 に変わった。
 *   買ランキング (0 を母数に含む) は 2.826 を出し、
 *   売ランキング (0 を母数から外していた) は同じ業者に 4.710 を出していた。
 *   ★最大 4.4 円ずれていたが、画面はどちらも普通に見えるので人間は気づけない。
 *   過去 253 窓の総なめでは、値が動いた窓 9 = 食い違っていた窓 9 で完全に一致した。
 *
 * ★予測が外れた点の記録: 買 0 が多いのは gaitame (104 行) と central_tanshi (83 行)
 *   なので影響が大きいと見ていたが、この 2 社は**全期間すべて 0** で混在が無く、
 *   before/after で値が変わらない。実際に混在していたのは traders_light だけ
 *   (0 が 72 行 / 非 0 が 22 行)。★全ゼロのデータでは判別力が出ないので、
 *   このテストは必ず混在データで検証すること。
 */
describe('不変条件: 買平均が買ランキングと売ランキングで一致する', () => {
  /**
   * ★fixture は master_history_gbpusd.csv の実データをそのまま写したもの
   *   (2026-05-07 〜 2026-05-20 の窓。traders_light の買が途中で 4.7 -> 0.0 に変わる)。
   *   ファイルを読まずリテラルで持つのは、public/data/** が上流の日次更新で
   *   上書きされる生成物であり、テストが外部の可変ファイルに依存しないようにするため。
   */
  const GBPUSD_REAL_MIXED = [
    '2026-05-07,dmm,GBP/USD,DMM FX,3,1.0,-4.0,,success,',
    '2026-05-07,traders_light,GBP/USD,LIGHT FX,1,4.7,-4.8,,success,',
    '2026-05-08,dmm,GBP/USD,DMM FX,1,1.0,-4.0,,success,',
    '2026-05-08,traders_light,GBP/USD,LIGHT FX,1,4.7,-4.8,,success,',
    '2026-05-11,dmm,GBP/USD,DMM FX,1,2.0,-5.0,,success,',
    '2026-05-11,traders_light,GBP/USD,LIGHT FX,1,4.7,-4.8,,success,',
    '2026-05-12,dmm,GBP/USD,DMM FX,1,2.0,-5.0,,success,',
    '2026-05-12,traders_light,GBP/USD,LIGHT FX,1,4.7,-4.8,,success,',
    '2026-05-13,dmm,GBP/USD,DMM FX,1,2.0,-5.0,,success,',
    '2026-05-13,traders_light,GBP/USD,LIGHT FX,3,4.73,-4.77,,success,',
    '2026-05-14,dmm,GBP/USD,DMM FX,3,2.0,-5.0,,success,',
    '2026-05-14,traders_light,GBP/USD,LIGHT FX,1,4.7,-4.8,,success,',
    '2026-05-15,dmm,GBP/USD,DMM FX,1,2.0,-5.0,,success,',
    '2026-05-15,traders_light,GBP/USD,LIGHT FX,1,4.7,-4.8,,success,',
    // ★ここから買が 0.0 に変わる (取得失敗ではなく業者の提示値)
    '2026-05-18,dmm,GBP/USD,DMM FX,1,2.0,-5.0,,success,',
    '2026-05-18,traders_light,GBP/USD,LIGHT FX,1,0.0,0.0,,success,',
    '2026-05-19,dmm,GBP/USD,DMM FX,1,2.0,-5.0,,success,',
    '2026-05-19,traders_light,GBP/USD,LIGHT FX,1,0.0,0.0,,success,',
    '2026-05-20,dmm,GBP/USD,DMM FX,1,1.0,-4.0,,success,',
    '2026-05-20,traders_light,GBP/USD,LIGHT FX,4,0.0,0.0,,success,',
  ];

  /**
   * 上の実データと同じ形 (買が途中で 0 になる / 売は非 0 のまま) の合成データ。
   * EUR/USD と CHF/TRY には実データ上 0 と非 0 の混在が存在しないため合成する。
   */
  function syntheticMixed(pair: string): string[] {
    const rows: string[] = [];
    for (let i = 9; i >= 5; i--) {
      rows.push(`${daysAgo(i)},mixedco,${pair},混在社,1,8.0,-3.0,,success,`);
      rows.push(`${daysAgo(i)},steadyco,${pair},通常社,1,5.0,-2.0,,success,`);
    }
    for (let i = 4; i >= 1; i--) {
      // ★買だけ 0 になる。売は非 0 なので売ランキングには残り続ける
      rows.push(`${daysAgo(i)},mixedco,${pair},混在社,1,0.0,-3.0,,success,`);
      rows.push(`${daysAgo(i)},steadyco,${pair},通常社,1,5.0,-2.0,,success,`);
    }
    return rows;
  }

  /** 両ランキングを突き合わせて、買平均が食い違う業者を返す */
  function mismatches(data: ReturnType<typeof parseCSVData>, pair: string): string[] {
    const buy = getBuyRanking(data, undefined, pair);
    const sell = getSellRanking(data, undefined, pair);
    return sell
      .filter((s) => {
        const b = buy.find((x) => x.provider_id === s.provider_id);
        return !b || Math.abs(b.swap_buy - s.swap_buy) > 1e-9;
      })
      .map((s) => {
        const b = buy.find((x) => x.provider_id === s.provider_id);
        return `${s.provider_id}: sell=${s.swap_buy} buy=${b ? b.swap_buy : 'ABSENT'}`;
      });
  }

  it('GBP/USD (実データの混在期) で一致する', () => {
    const data = parseCSVData(csv(GBPUSD_REAL_MIXED));
    expect(mismatches(data, 'GBP/USD')).toEqual([]);

    // ★判別力の確認: 0 を母数に含めた加重平均 42.39/15 = 2.826。
    //   0 を落とすと 42.39/9 = 4.71 になり、これが以前の売ランキングの値だった。
    const sell = getSellRanking(data, undefined, 'GBP/USD');
    const tl = sell.find((r) => r.provider_id === 'traders_light')!;
    expect(tl.swap_buy).toBeCloseTo(2.826, 6);
    expect(tl.swap_buy).not.toBeCloseTo(4.71, 6);
  });

  it('EUR/USD (混在を模した合成データ) で一致する', () => {
    const data = parseCSVData(csv(syntheticMixed('EUR/USD')));
    expect(mismatches(data, 'EUR/USD')).toEqual([]);
    const mixed = getSellRanking(data, undefined, 'EUR/USD').find((r) => r.provider_id === 'mixedco')!;
    // 0 を含めれば 40/9、落とせば 8.0
    expect(mixed.swap_buy).toBeCloseTo(40 / 9, 6);
  });

  it('CHF/TRY (混在を模した合成データ) で一致する', () => {
    const data = parseCSVData(csv(syntheticMixed('CHF/TRY')));
    expect(mismatches(data, 'CHF/TRY')).toEqual([]);
    const mixed = getSellRanking(data, undefined, 'CHF/TRY').find((r) => r.provider_id === 'mixedco')!;
    expect(mixed.swap_buy).toBeCloseTo(40 / 9, 6);
  });

  it('CHF/JPY (売 0 が実値のペア) でも売平均が両ランキングで一致する', () => {
    const data = parseCSVData(
      csv([
        `${daysAgo(4)},invast,CHF/JPY,トライオートFX,1,-30.0,-10.0,,success,`,
        `${daysAgo(3)},invast,CHF/JPY,トライオートFX,1,-30.0,0.0,,success,`,
        `${daysAgo(2)},invast,CHF/JPY,トライオートFX,1,-30.0,0.0,,success,`,
        `${daysAgo(1)},invast,CHF/JPY,トライオートFX,1,-30.0,0.0,,success,`,
      ])
    );
    const buy = getBuyRanking(data, undefined, 'CHF/JPY').find((r) => r.provider_id === 'invast')!;
    const sell = getSellRanking(data, undefined, 'CHF/JPY').find((r) => r.provider_id === 'invast')!;
    expect(buy.swap_sell).toBe(sell.swap_sell);
    // 0 を含めれば -10/4 = -2.5、落とせば -10
    expect(sell.swap_sell).toBeCloseTo(-2.5, 6);
  });
});
