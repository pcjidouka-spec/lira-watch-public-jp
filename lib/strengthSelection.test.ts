import { describe, expect, it } from 'vitest';
import {
  HIDDEN_STORAGE_KEY,
  loadHidden,
  presetHidden,
  saveHidden,
  toggleHidden,
  strengthView,
  visibleCodes,
  yDomain,
} from './strengthSelection';

// 強弱グラフの線の絞り込み (tryrogger の spec 2026-11-12-usdchf-replaces-usdtry の改訂 2026-11-13・REQ-USDCHF-070〜074)

const CODES = ['JPY', 'USD', 'TRY', 'CHFTRY_S', 'USDCHF_B'];
const REFS = ['CHFTRY_S', 'USDCHF_B'];

function memoryStorage(initial: Record<string, string> = {}) {
  const m = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    setItem: (k: string, v: string) => {
      m.set(k, v);
    },
    dump: () => Object.fromEntries(m),
  };
}

describe('toggleHidden (凡例を押す)', () => {
  it('表示中を押すと非表示に、もう一度押すと表示に戻る', () => {
    const a = toggleHidden([], 'USD');
    expect(a).toEqual(['USD']);
    expect(visibleCodes(CODES, a)).not.toContain('USD');
    const b = toggleHidden(a, 'USD');
    expect(b).toEqual([]);
    expect(visibleCodes(CODES, b)).toContain('USD');
  });

  it('元の配列を書き換えない', () => {
    const before = ['TRY'];
    toggleHidden(before, 'USD');
    expect(before).toEqual(['TRY']);
  });
});

describe('presetHidden (すべて・通貨だけ・参照だけ)', () => {
  it('すべて: 何も隠さない', () => {
    expect(visibleCodes(CODES, presetHidden('all', CODES, REFS))).toEqual(CODES);
  });

  it('通貨だけ: 参照系列だけを隠す (基準の JPY は残る)', () => {
    expect(visibleCodes(CODES, presetHidden('currencies', CODES, REFS))).toEqual(['JPY', 'USD', 'TRY']);
  });

  it('参照だけ: 参照系列だけを残す', () => {
    expect(visibleCodes(CODES, presetHidden('references', CODES, REFS))).toEqual(['CHFTRY_S', 'USDCHF_B']);
  });

  it('すべて: 別の期間で隠した系列も含めて非表示を空にする (REQ-USDCHF-071)', () => {
    expect(presetHidden('all', CODES, REFS, ['GBP', 'USD'])).toEqual([]);
  });

  it('通貨だけ・参照だけ: いまの期間に無い系列の非表示は保つ (期間を替えて戻っても続く)', () => {
    const h = presetHidden('currencies', CODES, REFS, ['GBP', 'USD']);
    expect(h).toContain('GBP');
    expect(h).not.toContain('USD'); // 通貨だけ = いまの期間の通貨は表示にする
  });
});

describe('yDomain (Y 軸は表示中の線だけで決める)', () => {
  const series = {
    USD: [1.0, 1.01, 1.02],
    TRY: [0.98, 0.99, null],
    USDCHF_B: [1.0, 1.5, 2.0], // 大きく離れた線
  };

  it('非表示の線は範囲に入らない', () => {
    const [lo, hi] = yDomain(series, null, ['USD', 'TRY']);
    expect(hi).toBeLessThan(1.1);
    expect(lo).toBeGreaterThan(0.9);
    const [, hiAll] = yDomain(series, null, ['USD', 'TRY', 'USDCHF_B']);
    expect(hiAll).toBeGreaterThan(2.0);
  });

  it('暫定の点も表示中の線のものだけを入れる', () => {
    const [, hi] = yDomain(series, { USD: 1.02, USDCHF_B: 9.0 }, ['USD']);
    expect(hi).toBeLessThan(1.1);
  });

  it('表示する線が無いときは既定の幅', () => {
    expect(yDomain(series, null, [])).toEqual([0.95, 1.05]);
  });
});

describe('loadHidden / saveHidden (選んだ内容をブラウザに覚える)', () => {
  it('非表示の一覧を保存し、次に読める', () => {
    const s = memoryStorage();
    saveHidden(() => s, ['USD', 'CHFTRY_S']);
    expect(JSON.parse(s.dump()[HIDDEN_STORAGE_KEY])).toEqual(['USD', 'CHFTRY_S']);
    expect(loadHidden(() => s)).toEqual(['USD', 'CHFTRY_S']);
  });

  it('保存が無ければ全部表示 (空の一覧)', () => {
    expect(loadHidden(() => memoryStorage())).toEqual([]);
  });

  it('覚えるのは非表示の側なので、あとから足した系列は表示になる', () => {
    const s = memoryStorage({ [HIDDEN_STORAGE_KEY]: JSON.stringify(['USD']) });
    const visible = visibleCodes([...CODES, 'NEW_REF'], loadHidden(() => s));
    expect(visible).toContain('NEW_REF');
    expect(visible).not.toContain('USD');
  });

  it.each([
    ['壊れた JSON', '{not json'],
    ['配列でない', '{"USD":true}'],
    ['配列でない文字列', '"USD"'],
    ['文字列でない要素だけ', '[1, null, {}]'],
  ])('%s は全部表示から始める', (_name, raw) => {
    expect(loadHidden(() => memoryStorage({ [HIDDEN_STORAGE_KEY]: raw }))).toEqual([]);
  });

  it('文字列でない要素は捨て、文字列だけを使う', () => {
    expect(loadHidden(() => memoryStorage({ [HIDDEN_STORAGE_KEY]: '["USD", 3, "TRY"]' }))).toEqual(['USD', 'TRY']);
  });

  it('localStorage に触れると例外になる環境でも落ちない', () => {
    const boom = () => {
      throw new Error('SecurityError');
    };
    expect(loadHidden(boom)).toEqual([]);
    expect(() => saveHidden(boom, ['USD'])).not.toThrow();
    const throwing = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(loadHidden(() => throwing)).toEqual([]);
    expect(() => saveHidden(() => throwing, ['USD'])).not.toThrow();
  });
});

describe('strengthView (部品が描くもの・REQ-USDCHF-075)', () => {
  const series = {
    JPY: [1.0, 0.99],
    USD: [1.0, 1.02],
    TRY: [1.0, null],
    USDCHF_B: [1.0, 1.6],
  };
  const codes = ['JPY', 'USD', 'TRY', 'USDCHF_B'];

  it('非表示の系列は線にならず、Y 軸にも入らない', () => {
    const v = strengthView(codes, ['USDCHF_B'], series, null);
    expect(v.lines).toEqual(['JPY', 'USD', 'TRY']);
    expect(v.domain[1]).toBeLessThan(1.1);
    expect(v.showNone).toBe(false);
    const all = strengthView(codes, [], series, null);
    expect(all.lines).toEqual(codes);
    expect(all.domain[1]).toBeGreaterThan(1.6);
  });

  it('凡例は非表示も残し、押した状態を返す。並びは現在値の高い順', () => {
    const v = strengthView(codes, ['USDCHF_B'], series, null);
    expect(v.legend.map((e) => e.code)).toEqual(['USDCHF_B', 'USD', 'TRY', 'JPY']);
    expect(v.legend.find((e) => e.code === 'USDCHF_B')).toEqual({ code: 'USDCHF_B', value: 1.6, pressed: false });
    expect(v.legend.find((e) => e.code === 'USD')?.pressed).toBe(true);
    // 最後が null の系列は、その前の確定値を出す
    expect(v.legend.find((e) => e.code === 'TRY')?.value).toBe(1.0);
  });

  it('暫定の点があれば凡例の値と並びはそれで決まる', () => {
    const v = strengthView(codes, [], series, { JPY: 1.9, USD: null });
    expect(v.legend[0]).toEqual({ code: 'JPY', value: 1.9, pressed: true });
    expect(v.legend.find((e) => e.code === 'USD')?.value).toBe(1.02);
  });

  it('全部を非表示にすると線は無く、文言を出し、Y 軸は既定の幅', () => {
    const v = strengthView(codes, [...codes], series, null);
    expect(v.lines).toEqual([]);
    expect(v.showNone).toBe(true);
    expect(v.domain).toEqual([0.95, 1.05]);
    expect(v.legend.every((e) => !e.pressed)).toBe(true);
  });

  it('知らないコードはその要素だけ無視する (ほかの要素は効く)', () => {
    const v = strengthView(codes, ['GONE_S', 'USD'], series, null);
    expect(v.lines).toEqual(['JPY', 'TRY', 'USDCHF_B']);
    expect(v.legend.map((e) => e.code)).not.toContain('GONE_S');
  });
});
