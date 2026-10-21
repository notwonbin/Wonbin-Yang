/**
 * CSS 변수의 실제 px 값.
 * clamp() 같은 계산식이 들어간 변수도 브라우저가 계산한 결과를 돌려줌
 * (getPropertyValue 는 계산식 글자 그대로를 줘서 parseFloat 로는 못 읽음)
 */
export function cssPx(name: string, fallback = 0): number {
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:0;height:var(${name})`;
  document.body.appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return h || fallback;
}
