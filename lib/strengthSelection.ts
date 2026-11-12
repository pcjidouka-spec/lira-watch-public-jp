// 強弱グラフの線の絞り込み (2026-11-13 オーナー依頼「表示する通貨を選択して絞れるようにしたい」)。
// 要件の正本: tryrogger の docs/superpowers/specs/2026-11-12-usdchf-replaces-usdtry-design.md
// の改訂 2026-11-13 (REQ-USDCHF-070〜074)。
// 判断はここに置き、components/StrengthChart.tsx はこれを呼ぶだけにする (部品を描くテストの道具が無いため)。

/** 非表示の系列のコードの一覧を JSON の配列で覚えるキー */
export const HIDDEN_STORAGE_KEY = 'lira-watch.strength.hidden.v1';

export type SelectionPreset = 'all' | 'currencies' | 'references';

type ReadStorage = { getItem(key: string): string | null };
type WriteStorage = { setItem(key: string, value: string): void };

/** 凡例を押したとき: 非表示なら表示に、表示なら非表示にする */
export function toggleHidden(hidden: readonly string[], code: string): string[] {
  return hidden.includes(code) ? hidden.filter((c) => c !== code) : [...hidden, code];
}

/**
 * 「すべて」は非表示の一覧を空にする (どの期間の系列も全部表示に戻る。REQ-USDCHF-071)。
 * 「通貨だけ」「参照だけ」は、いまの期間の系列 (codes) だけを決め直し、
 * いまの期間に無い系列の非表示 (別の期間で選んだもの) は保つ。
 */
export function presetHidden(
  preset: SelectionPreset,
  codes: readonly string[],
  references: readonly string[],
  prevHidden: readonly string[] = [],
): string[] {
  if (preset === 'all') return [];
  const kept = prevHidden.filter((c) => !codes.includes(c));
  const hideNow = codes.filter((c) => {
    const isRef = references.includes(c);
    if (preset === 'currencies') return isRef;
    return !isRef; // 'references'
  });
  return [...kept, ...hideNow];
}

/** 表示する系列。並びは codes のまま */
export function visibleCodes(codes: readonly string[], hidden: readonly string[]): string[] {
  return codes.filter((c) => !hidden.includes(c));
}

/**
 * Y 軸の範囲。表示中の系列 (と、その暫定の点) だけから決める。
 * 起点=1.0 からの乖離が小さいので、実データ幅に合わせて詰める。
 */
export function yDomain(
  series: Record<string, readonly (number | null)[]>,
  provisional: Record<string, number | null> | null,
  visible: readonly string[],
): [number, number] {
  const vals = visible.flatMap((c) =>
    [...(series[c] ?? []), provisional ? provisional[c] ?? null : null].filter(
      (v): v is number => v !== null && v !== undefined,
    ),
  );
  if (!vals.length) return [0.95, 1.05];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = Math.max((hi - lo) * 0.12, 0.002);
  return [lo - pad, hi + pad];
}

export type LegendEntry = { code: string; value: number | null; pressed: boolean };

/** 部品が描くものすべて (REQ-USDCHF-075)。部品はこれ以外から線・軸・凡例を選び直さない */
export type StrengthView = {
  /** 描く線。並びは codes のまま */
  lines: string[];
  /** Y 軸の範囲。表示中の線だけで決める */
  domain: [number, number];
  /** 凡例。現在値 (暫定の点があればそれ、無ければ最後の確定値) の高い順。非表示も残す */
  legend: LegendEntry[];
  /** 全部を非表示にしたときの文言を出すか */
  showNone: boolean;
};

export function strengthView(
  codes: readonly string[],
  hidden: readonly string[],
  series: Record<string, readonly (number | null)[]>,
  provisional: Record<string, number | null> | null,
): StrengthView {
  const lines = visibleCodes(codes, hidden);
  const latest = (c: string): number | null => {
    const pv = provisional?.[c];
    if (pv !== undefined && pv !== null) return pv;
    const s = series[c] ?? [];
    for (let i = s.length - 1; i >= 0; i--) if (s[i] !== null) return s[i] as number;
    return null;
  };
  const legend = codes
    .map((c) => ({ code: c, value: latest(c), pressed: !hidden.includes(c) }))
    .sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity));
  return { lines, domain: yDomain(series, provisional, lines), legend, showNone: lines.length === 0 };
}

/**
 * 覚えた非表示の一覧を読む。localStorage に触れると例外になる環境 (プライベートモード等)・
 * 壊れた値・配列でない値は、全部表示 (空の一覧) から始める。文字列でない要素は捨てる。
 */
export function loadHidden(getStorage: () => ReadStorage | null | undefined): string[] {
  try {
    const raw = getStorage()?.getItem(HIDDEN_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((c): c is string => typeof c === 'string');
  } catch {
    return [];
  }
}

/** 非表示の一覧を覚える。書けなくても (容量・拒否) 表示は続ける */
export function saveHidden(getStorage: () => WriteStorage | null | undefined, hidden: readonly string[]): void {
  try {
    getStorage()?.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(hidden));
  } catch {
    // 覚えられないだけで、いまの表示には効いている
  }
}
