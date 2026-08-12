import React from 'react';

/**
 * 通貨コード -> 国旗の小さな SVG。
 *
 * 絵文字の地域表示記号 (🇯🇵 等) は Windows に旗のグリフが無く「JP」という
 * 2文字に化けるため使えない。外部画像も足したくないので、24x16 で潰れない
 * 程度に簡略化した SVG をここに直接持つ。
 */
const FLAGS: Record<string, React.ReactNode> = {
  JPY: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <circle cx="12" cy="8" r="4.6" fill="#bc002d" />
    </>
  ),
  USD: (
    <>
      <rect width="24" height="16" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y * (16 / 13)} width="24" height={16 / 13} fill="#b22234" />
      ))}
      <rect width="10" height={(16 / 13) * 7} fill="#3c3b6e" />
      {[1.2, 3.5, 5.8].map((cy) =>
        [1.6, 4, 6.4, 8.8].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.5" fill="#fff" />
        )),
      )}
    </>
  ),
  TRY: (
    <>
      <rect width="24" height="16" fill="#e30a17" />
      <circle cx="9" cy="8" r="4" fill="#fff" />
      <circle cx="10.6" cy="8" r="3.2" fill="#e30a17" />
      <path d="M14.4 8 L16.8 7.2 L15.3 9.2 L15.3 6.8 L16.8 8.8 Z" fill="#fff" />
    </>
  ),
  MXN: (
    <>
      <rect width="8" height="16" fill="#006847" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#ce1126" />
      <ellipse cx="12" cy="8" rx="1.8" ry="2.2" fill="none" stroke="#8b5a2b" strokeWidth="0.9" />
    </>
  ),
  ZAR: (
    <>
      <rect width="24" height="16" fill="#002395" />
      <path d="M0 0 H24 V6.4 H0 Z" fill="#de3831" />
      <path d="M0 5.2 H24 V10.8 H0 Z" fill="#fff" />
      <path d="M0 6.4 H24 V9.6 H0 Z" fill="#007a4d" />
      <path d="M0 0 L10 8 L0 16 Z" fill="#fff" />
      <path d="M0 1.6 L8.4 8 L0 14.4 Z" fill="#ffb612" />
      <path d="M0 3.4 L6.4 8 L0 12.6 Z" fill="#000" />
    </>
  ),
  HUF: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.34" fill="#ce2939" />
      <rect y="10.66" width="24" height="5.34" fill="#477050" />
    </>
  ),
};

interface Props {
  code: string;
  size?: number;
}

export const CurrencyFlag: React.FC<Props> = ({ code, size = 24 }) => {
  const flag = FLAGS[code];
  if (!flag) return null;
  return (
    <svg
      width={size}
      height={(size * 2) / 3}
      viewBox="0 0 24 16"
      role="img"
      aria-label={code}
      style={{ display: 'block', borderRadius: 2 }}
    >
      {flag}
      <rect width="24" height="16" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </svg>
  );
};
