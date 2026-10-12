import styles from "./Secret.module.css";

/**
 * 숨은 글자: 평소엔 거의 투명, 커서 렌즈(Cursor.tsx)를 대면 렌즈 안에서만 또렷하게 보인다.
 * 터치 기기에서는 렌즈가 없으므로 아예 숨김.
 */
export default function Secret({ text, x, y, className = "" }: { text: string; x?: number; y?: number; className?: string }) {
  if (!text) return null;
  return (
    <span
      className={`${styles.secret} ${className}`}
      style={{ ...(x !== undefined && { "--x": `${x}%` }), ...(y !== undefined && { "--y": `${y}px` }) } as React.CSSProperties}
      data-secret=""
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
