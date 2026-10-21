"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

/**
 * 커스텀 커서 — 작은 먹색 점이 마우스를 부드럽게 따라온다.
 * 갤러리 카드·링크(Works 목록, 이름, About 링크 등) 위에서는 같은 볼록렌즈로 바뀌고,
 * 그 밖에서는 작은 점 그대로.
 *  - 렌즈 안에는 바로 아래 화면(이미지·영상·글자)이 그대로 비치고,
 *    SVG 필터로 가운데가 부풀어 오르듯 휘어진다 (가장자리는 원래 크기 → 테두리 없이 이어짐)
 *  - 누르고 있는 동안: 살짝 작아짐
 *  - 마우스가 창 밖으로 나가면 사라짐
 * 마우스가 있는 기기(hover + 정밀 포인터)에서만 켜지고, 터치 기기에서는 기본 동작.
 * '동작 줄이기' 설정이면 지연 없이 바로 따라간다.
 */

const LENS_ZOOM = 1.8;   // 가운데 확대 배율 (1 = 확대 없음)
const FOLLOW = 0.28;     // 따라오는 속도 (0–1, 클수록 빠름)

const HOVER_TARGET = 'a, button, [role="button"], [data-cursor]';
const CARD = "[data-cursor] li";
const CONTEXT = "aside, footer, section"; // 링크 위에서 렌즈에 비출 범위
const LINK_PAD = 4;      // 링크 글자 둘레 이만큼(px)까지 반응
const OFF_DELAY = 80;    // 링크·카드에서 벗어난 뒤 렌즈가 꺼지기까지(ms) — 목록 줄 사이에서 깜빡임 방지
const FILTER_ID = "cursor-lens";

type Src = HTMLImageElement | HTMLVideoElement;

/**
 * 볼록렌즈 변위 지도. 각 점을 가운데 쪽에서 가져오게 해서 가운데가 커 보이게 한다.
 * 가져오는 위치 = 점 − d·a·(1 − r²)  (d: 중심에서의 거리, r: 0 가운데 → 1 가장자리)
 * 가운데 배율 = 1 / (1 − a)
 */
const DISP_SCALE = 0.25; // 필터의 최대 이동량 (렌즈 폭 대비)
function lensMap(size = 256) {
  const a = 1 - 1 / LENS_ZOOM;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const img = g.createImageData(size, size);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const dx = (i + 0.5) / size - 0.5;
      const dy = (j + 0.5) / size - 0.5;
      const r2 = Math.min(1, (dx * dx + dy * dy) / 0.25);
      const k = -a * (1 - r2);
      const o = (j * size + i) * 4;
      img.data[o] = Math.round((0.5 + (dx * k) / DISP_SCALE) * 255);
      img.data[o + 1] = Math.round((0.5 + (dy * k) / DISP_SCALE) * 255);
      img.data[o + 2] = 128;
      img.data[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL();
}

// 복제본이 원래 모습 그대로 보이도록 화면에 계산된 글자 스타일을 옮겨 적음
const COPY = [
  "color", "font-family", "font-size", "font-weight", "font-style", "line-height",
  "letter-spacing", "font-feature-settings", "text-transform", "opacity", "transform",
  // 컨테이너 단위(cqw)로 잡힌 칸 너비도 화면의 px 값 그대로 고정
  "grid-template-columns", "column-gap", "row-gap",
  "padding-top", "padding-right", "padding-bottom", "padding-left",
] as const;
function cloneWithStyles(src: Element) {
  const out = src.cloneNode(true) as HTMLElement;
  const a = [src, ...src.querySelectorAll("*")];
  const b = [out, ...out.querySelectorAll("*")];
  a.forEach((el, i) => {
    const cs = getComputedStyle(el);
    const t = b[i] as HTMLElement;
    for (const p of COPY) t.style.setProperty(p, cs.getPropertyValue(p));
    t.removeAttribute("id");
    t.style.setProperty("animation", "none");
    t.style.setProperty("transition", "none");
    // 숨은 글자는 렌즈 안에서만 또렷하게
    if ((el as HTMLElement).dataset?.secret !== undefined) {
      t.style.setProperty("opacity", "1");
      t.style.setProperty("filter", "none");
    }
  });
  out.setAttribute("aria-hidden", "true");
  return out;
}

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const feImage = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || !dot.current || !ring.current || !view.current || !canvas.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = dot.current;
    const rg = ring.current; // 렌즈 테두리 (아래 색을 한 톤 진하게 — multiply)
    const vw = view.current;
    const cv = canvas.current;
    const g = cv.getContext("2d");
    const root = document.documentElement;
    root.classList.add("has-cursor");
    feImage.current?.setAttribute("href", lensMap());
    const paper = getComputedStyle(root).getPropertyValue("--paper").trim() || "#ffffff";

    let mx = -100, my = -100;   // 마우스 위치
    let x = mx, y = my;         // 점 위치
    let raf = 0;
    let shown = false;
    let active = false;
    let offTimer = 0;
    let key: Element | null = null;          // 지금 비추는 글자 기준 (링크 또는 글자 묶음)
    let ctxEl: HTMLElement | null = null;    // 글자 렌즈: 비출 범위(원본)
    let clone: HTMLElement | null = null;    // 글자 렌즈: 그 복제본

    /*
     * 렌즈 안 이미지는 확대되므로 화면용(작은) 이미지 대신 가장 큰 해상도 사본을 따로 불러 씀.
     * (srcset 이미지는 naturalWidth 가 실제 픽셀과 다를 수 있어서 같은 주소의 사본을 씀)
     * 큰 사본이 아직 로드 전이면 화면용 사본으로 대신 그림.
     */
    const hi = new WeakMap<HTMLImageElement, HTMLImageElement>();
    const lo = new WeakMap<HTMLImageElement, HTMLImageElement>();
    const load = (map: WeakMap<HTMLImageElement, HTMLImageElement>, im: HTMLImageElement, src: string) => {
      let c = map.get(im);
      if (!c || c.src !== new URL(src, location.href).href) {
        c = new Image();
        c.decoding = "async";
        c.src = src;
        map.set(im, c);
      }
      return c.complete && c.naturalWidth ? c : null;
    };
    const bitmap = (im: HTMLImageElement) =>
      load(hi, im, im.src) ?? load(lo, im, im.currentSrc || im.src);

    // 렌즈 화면은 SS배 크기로 그린 뒤 줄여서 보여줌 → 확대·휘기에서 생기는 계단 현상을 줄임 (CSS .view 와 같은 값)
    const SS = 2;
    const size = () => vw.offsetWidth / SS; // 렌즈 크기(px) = --cursor-lens-size

    /** 렌즈 아래 영역의 이미지·영상을 그대로 캔버스에 옮겨 그림 (휘는 건 필터가) */
    const drawMedia = () => {
      if (!g) return;
      const W = size();
      const d = Math.min(window.devicePixelRatio || 1, 2) * SS;
      const P = Math.round(W * d);
      if (cv.width !== P) { cv.width = P; cv.height = P; }
      g.setTransform(d, 0, 0, d, 0, 0);
      g.imageSmoothingQuality = "high";
      g.fillStyle = getComputedStyle(root).getPropertyValue("--paper").trim() || paper; // 배경색이 프로젝트마다 살짝 바뀌므로 매번 읽음
      g.fillRect(0, 0, W, W);
      const L = x - W / 2, T = y - W / 2;
      for (const m of document.querySelectorAll<Src>("[data-cursor] img, [data-cursor] video")) {
        const b = m.getBoundingClientRect();
        if (b.right < L || b.left > L + W || b.bottom < T || b.top > T + W) continue;
        const isVid = m instanceof HTMLVideoElement;
        const pic = isVid ? m : bitmap(m);
        const nw = isVid ? m.videoWidth : (pic as HTMLImageElement | null)?.naturalWidth ?? 0;
        const nh = isVid ? m.videoHeight : (pic as HTMLImageElement | null)?.naturalHeight ?? 0;
        if (!pic || !nw || !nh || (isVid && m.readyState < 2)) continue;
        const card = m.closest("li") ?? m;
        const frame = card.getBoundingClientRect();                  // 카드 영역
        const radius = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 0; // 카드 모서리 (--radius-media)
        const s = Math.max(b.width / nw, b.height / nh);             // object-fit: cover
        const ox = b.left + (b.width - nw * s) / 2;
        const oy = b.top + (b.height - nh * s) / 2;
        g.save();
        g.beginPath();
        g.roundRect(frame.left - L, frame.top - T, frame.width, frame.height, radius);
        g.clip();
        g.drawImage(pic, ox - L, oy - T, nw * s, nh * s);
        g.restore();
      }
    };

    /** 글자 렌즈: 복제본을 원본과 같은 자리에 맞춰 둠 */
    const placeClone = () => {
      if (!clone || !ctxEl) return;
      const b = ctxEl.getBoundingClientRect();
      const W = size();
      clone.style.left = `${(b.left - (x - W / 2)) * SS}px`;
      clone.style.top = `${(b.top - (y - W / 2)) * SS}px`;
    };

    /**
     * 링크 칸이 글자보다 넓을 수 있어서(블록 링크), 실제 글자 위에 있을 때만 반응
     * (예: 이름 링크는 사이드바 폭 전체지만 'Wonbin Yang' 글자 위에서만)
     */
    const onText = (link: Element, px: number, py: number) => {
      const r = document.createRange();
      const walk = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (!n.textContent?.trim()) continue;
        r.selectNodeContents(n); // 글자 자체의 상자 (블록 칸 말고)
        for (const b of r.getClientRects()) {
          if (px >= b.left - LINK_PAD && px <= b.right + LINK_PAD && py >= b.top - LINK_PAD && py <= b.bottom + LINK_PAD) return true;
        }
      }
      return false;
    };

    /** 글자를 비출 범위: 글자에서 위로 올라가되 갤러리가 든 곳 직전, 또는 사이드바·섹션·푸터에서 멈춤 */
    const pickContext = (start: Element): HTMLElement => {
      let best = start as HTMLElement;
      let cur: Element = start;
      while (cur.parentElement && cur.parentElement !== document.body) {
        const p = cur.parentElement;
        if (p.querySelector("[data-cursor]")) break;
        best = p;
        if (p.matches(CONTEXT)) break;
        cur = p;
      }
      return best;
    };

    const setKey = (next: Element | null, ctx: HTMLElement | null) => {
      if (next === key) return;
      key = next;
      ctxEl = ctx;
      if (!next || !ctx) { clone?.remove(); clone = null; return; }
      // 호버 상태가 반영된 뒤 복제, 색 전환(transition)이 끝난 뒤 한 번 더
      const snap = () => {
        if (key !== next || !ctxEl) return;
        clone?.remove();
        clone = cloneWithStyles(ctxEl);
        clone.className += ` ${styles.clone}`;
        clone.style.width = `${ctxEl.getBoundingClientRect().width}px`;
        clone.style.transform = `scale(${SS})`;   // 렌즈 화면이 SS배라 글자도 SS배로
        clone.style.transformOrigin = "0 0";
        vw.appendChild(clone);
        placeClone();
      };
      requestAnimationFrame(snap);
      window.setTimeout(snap, 280);
    };

    const setActive = (on: boolean) => {
      if (on) {
        window.clearTimeout(offTimer);
        offTimer = 0;
        active = true;
        el.dataset.hover = "";
      } else if (active && !offTimer) {
        // 글자 사이 틈에서 깜빡이지 않도록 잠깐 기다렸다가 끔
        // (마우스가 계속 움직여도 타이머를 다시 미루지 않음)
        offTimer = window.setTimeout(() => {
          offTimer = 0;
          active = false;
          delete el.dataset.hover;
          setKey(null, null);
          kick(); // 테두리도 같이 끄도록 한 번 더 그림
        }, OFF_DELAY);
      }
    };

    /** 갤러리 카드·링크(Works 목록, 이름, About 링크 등) 위에서만 렌즈를 켬 */
    const update = (target: Element | null) => {
      if (!shown || !target) { setActive(false); return; }
      const card = target.closest(CARD) ?? target.closest("[data-cursor]"); // 카드 사이 틈 포함
      const secret = card ? null : target.closest("[data-secret]");
      const hit = card || secret ? null : target.closest(HOVER_TARGET);
      const link = hit && onText(hit, mx, my) ? hit : null;
      if (card) {
        setKey(null, null);
        setActive(true);
      } else if (secret) {
        setKey(secret, pickContext(secret));
        setActive(true);
      } else if (link) {
        setKey(link, pickContext(link));
        setActive(true);
      } else {
        setActive(false);
      }
    };

    const loop = () => {
      const k = reduce ? 1 : FOLLOW;
      x += (mx - x) * k;
      y += (my - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rg.style.transform = el.style.transform;
      for (const k of ["visible", "hover", "down"] as const) {
        if (k in el.dataset) rg.dataset[k] = ""; else delete rg.dataset[k];
      }
      if (active) { drawMedia(); placeClone(); }
      const moving = Math.abs(mx - x) + Math.abs(my - y) > 0.1;
      // 영상은 계속 바뀌므로 렌즈가 켜져 있는 동안 계속 그림
      raf = moving || active ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        x = mx; y = my;           // 처음 나타날 때는 그 자리에서 바로
        shown = true;
        el.dataset.visible = "";
      }
      update(e.target as Element | null);
      kick();
    };
    const onScroll = () => { if (shown) { update(document.elementFromPoint(mx, my)); kick(); } };
    const onDown = () => { el.dataset.down = ""; kick(); };
    const onUp = () => { delete el.dataset.down; kick(); };
    const onLeave = () => {
      shown = false;
      window.clearTimeout(offTimer);
      offTimer = 0;
      active = false;
      delete el.dataset.hover;
      setKey(null, null);
      delete el.dataset.visible;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(offTimer);
      clone?.remove();
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <>
      {/* 볼록렌즈 필터 (변위 지도는 실행 시 만들어 넣음) */}
      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <filter id={FILTER_ID} x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
          <feImage ref={feImage} x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={DISP_SCALE} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div ref={dot} className={styles.cursor} aria-hidden="true">
        <span className={styles.dot}>
          <div ref={view} className={styles.view}>
            <canvas ref={canvas} className={styles.canvas} />
          </div>
        </span>
      </div>
      {/* 렌즈 테두리: 화면 위에 따로 얹어 아래 색과 곱해짐 → 배경색보다 한 톤 진한 선 */}
      <div ref={ring} className={styles.ring} aria-hidden="true"><span /></div>
    </>
  );
}
