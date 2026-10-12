/**
 * 숨은 글자 — 평소엔 거의 안 보이고, 커서 렌즈를 갖다 대야 읽히는 한마디.
 * 아래 문구들을 돌려 쓰면서 각 프로젝트 아래 여백(다음 프로젝트 전)에 COPIES 개씩 흩뿌립니다.
 * 위치는 매번 같은 자리에 나오도록 정해진 규칙으로 섞여요 (새로고침해도 그대로).
 */
export const phrases = [
  "(•_•) hi, you found me",
  "(°o°) yes, it's a lens",
  "enjoying this? (˘▽˘)",
  "(¬‿¬) good eye",
  "made with lots of coffee c[_]",
  "(⊙_⊙) still here?",
  "(•‿•) almost there",
  "(^_^)/ thanks for scrolling",
];

/** 프로젝트 하나 아래에 뿌릴 개수 — 늘리면 더 자주 발견됨 */
export const COPIES = 3;

/** 사이드바 Works 와 About 사이 빈 곳 */
export const sidebarSecret = "psst (•_•) hover the cards";

// 0–1 사이의 고정된 '무작위' 값 (같은 seed → 같은 값)
const rand = (seed: number) => {
  const s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
};

/**
 * index 번째 프로젝트 아래의 숨은 글자들.
 *   x: 가로 위치(콘텐츠 폭 대비 %) — 겹치지 않게 칸을 나눠 그 안에서 흩어짐
 *   y: 여백 한가운데에서 위아래로 벗어나는 정도(px)
 */
export function secretsFor(index: number) {
  return Array.from({ length: COPIES }, (_, j) => {
    const n = index * COPIES + j;
    const lane = 92 / COPIES; // 문구가 오른쪽 끝을 넘지 않게 92%까지만 씀
    return {
      text: phrases[n % phrases.length],
      x: Math.round(j * lane + rand(n) * (lane - 12)),
      y: Math.round((rand(n + 101) - 0.5) * 70),
    };
  });
}
