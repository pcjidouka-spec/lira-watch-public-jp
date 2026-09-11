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
