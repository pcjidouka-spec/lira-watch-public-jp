/**
 * status=success なのに swap が null の行を、HP が正しく扱うこと (tryrogger-4e1)。
 *
 * ★master には status=success なのに swap が null の行が全通貨で 277 行ある。
 *   取得タイミングと業者の公表タイミングのズレによる欠測で、業者グループごとに
 *   日が入れ替わる (実測 2026-09-06):
 *       central_tanshi / gmo / gmo_click : 09-03 が null (09-02・09-04 は値あり)
 *       dmm / gaitame / hirose / click365: 09-04 が null (09-02・09-03 は値あり)
 *
 * ★同じデータでパイプライン側 (arbitrage.load_legs) は壊れていた。
 *   「業者ごとに最新 1 行」を採るとき null 行で確定させ、値のある古い行を
 *   見ずに業者ごと落としていた (全ペア合計 68 -> 98 社)。
 *   HP 側は偶然そうなっていないだけかもしれないので、ここで固定する。
 */
import { describe, expect, it } from 'vitest';

import { getBuyRanking, parseCSVData } from './dataProcessor';

const HEADER =
  'target_date,provider_id,currency_pair,name,days,swap_buy,swap_sell,settlement_date,status,actual_date';

function csv(rows: string[]): string {
  return [HEADER, ...rows].join('\n');
}

/** 直近 30 日の窓に入るよう、今日から n 日前の日付を作る */
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

describe('status=success なのに swap が null の行', () => {
  it('平均に 0 として混ざらない', () => {
    const data = parseCSVData(
      csv([
        `${daysAgo(3)},dmm,TRY/JPY,DMM FX,1,24.0,-24.0,,success,`,
        `${daysAgo(2)},dmm,TRY/JPY,DMM FX,1,26.0,-26.0,,success,`,
        // ★最新日が null。0 として混ざると平均が 16.7 に落ちる
        `${daysAgo(1)},dmm,TRY/JPY,DMM FX,1,None,None,,success,`,
      ]),
    );
    const ranking = getBuyRanking(data);
    const dmm = ranking.find((r) => r.provider_id === 'dmm');

    expect(dmm).toBeDefined();
    expect(dmm!.swap_buy).toBeCloseTo(25.0, 5);
  });

  it('最新値は「値のある最新日」から取る', () => {
    const data = parseCSVData(
      csv([
        `${daysAgo(2)},gaitame,TRY/JPY,外為どっとコム,1,23.0,-33.0,,success,`,
        `${daysAgo(1)},gaitame,TRY/JPY,外為どっとコム,1,None,None,,success,`,
      ]),
    );
    const ranking = getBuyRanking(data);
    const g = ranking.find((r) => r.provider_id === 'gaitame');

    // ★ここが null になると HP の「最新」欄が空になる。
    //   パイプライン側 (load_legs) はまさにこれで業者ごと落としていた。
    expect(g).toBeDefined();
    expect(g!.latest_buy).toBe(23.0);
    expect(g!.latest_date).toBe(daysAgo(2));
  });

  it('値のある行が 1 つも無い業者はランキングに出さない', () => {
    const data = parseCSVData(
      csv([
        `${daysAgo(2)},sbi,TRY/JPY,SBI FXトレード,1,None,None,,success,`,
        `${daysAgo(1)},sbi,TRY/JPY,SBI FXトレード,1,None,None,,success,`,
        `${daysAgo(1)},gmo,TRY/JPY,GMO外貨,1,25.0,-25.0,,success,`,
      ]),
    );
    const ranking = getBuyRanking(data);

    expect(ranking.find((r) => r.provider_id === 'sbi')).toBeUndefined();
    // ★比較用の業者まで巻き添えにしていないこと
    expect(ranking.find((r) => r.provider_id === 'gmo')).toBeDefined();
  });

  it('業者ごとに null の日がずれても、双方が正しい平均を持つ', () => {
    // ★実データのパターンそのもの。A 群と B 群で null の日が入れ替わる。
    const data = parseCSVData(
      csv([
        `${daysAgo(3)},gmo_click,TRY/JPY,GMOクリック,1,25.0,-25.0,,success,`,
        `${daysAgo(2)},gmo_click,TRY/JPY,GMOクリック,1,None,None,,success,`,
        `${daysAgo(1)},gmo_click,TRY/JPY,GMOクリック,1,25.0,-25.0,,success,`,
        `${daysAgo(3)},hirose,TRY/JPY,ヒロセ通商,1,23.0,-28.0,,success,`,
        `${daysAgo(2)},hirose,TRY/JPY,ヒロセ通商,1,23.0,-28.0,,success,`,
        `${daysAgo(1)},hirose,TRY/JPY,ヒロセ通商,1,None,None,,success,`,
      ]),
    );
    const ranking = getBuyRanking(data);

    expect(ranking.find((r) => r.provider_id === 'gmo_click')!.swap_buy).toBeCloseTo(25.0, 5);
    expect(ranking.find((r) => r.provider_id === 'hirose')!.swap_buy).toBeCloseTo(23.0, 5);
    // ★どちらも最新値を持てること (片方だけ空欄にならない)
    expect(ranking.find((r) => r.provider_id === 'gmo_click')!.latest_buy).toBe(25.0);
    expect(ranking.find((r) => r.provider_id === 'hirose')!.latest_buy).toBe(23.0);
  });

  it('status=error は今までどおり無視する', () => {
    const data = parseCSVData(
      csv([
        `${daysAgo(2)},jfx,TRY/JPY,JFX,1,22.0,-30.0,,success,`,
        `${daysAgo(1)},jfx,TRY/JPY,JFX,1,,,,error,`,
      ]),
    );
    const ranking = getBuyRanking(data);
    const jfx = ranking.find((r) => r.provider_id === 'jfx');

    expect(jfx).toBeDefined();
    expect(jfx!.swap_buy).toBeCloseTo(22.0, 5);
  });
});
