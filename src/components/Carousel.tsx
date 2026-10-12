"use client";

import { useRef } from "react";
import type { ProjectMedia } from "@/lib/types";
import Media from "./Media";
import styles from "./Carousel.module.css";

/**
 * 한 줄 가로 갤러리 — 모든 카드 같은 폭·비율, 화면 끝에서 다음 카드가 반쯤 보인다.
 * 탐색: 트랙패드 / Shift+휠 / 마우스 드래그 / 키보드 ← →
 */
export default function Carousel({ media, label }: { media: ProjectMedia[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });

  const step = () => {
    const el = track.current;
    const cell = el?.firstElementChild as HTMLElement | null;
    if (!el || !cell) return 1;
    return cell.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
  };

  const snapTo = (index: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: index * step(), behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const el = track.current;
    if (!el) return;
    snapTo(Math.round(el.scrollLeft / step()) + (e.key === "ArrowRight" ? 1 : -1));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    drag.current = { active: true, moved: false, x: e.clientX, left: track.current.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = track.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      el.classList.add(styles.dragging);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const el = track.current;
    if (!drag.current.active || !el) return;
    drag.current.active = false;
    if (drag.current.moved) {
      el.classList.remove(styles.dragging);
      snapTo(Math.round(el.scrollLeft / step())); // 놓은 위치에서 가까운 카드에 맞춤
    }
  };

  return (
    <ul
      ref={track}
      className={styles.track}
      tabIndex={0}
      data-cursor="drag"
      aria-label={`${label} gallery, ${media.length} items. Use arrow keys to browse.`}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={(e) => {
        if (drag.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {media.map((item) => (
        <li key={item.src} className={styles.card}>
          <Media item={item} sizes="(max-width: 680px) 90vw, (max-width: 1024px) 40vw, 25vw" />
        </li>
      ))}
    </ul>
  );
}
