"use client";

import { useEffect } from "react";

/**
 * 지금 보고 있는 프로젝트의 대표 색을 배경(--paper)에 아주 살짝 섞는다 → 프로젝트마다 공기가 달라지는 느낌.
 *  - 대표 색: 그 프로젝트 첫 이미지(없으면 영상 첫 화면)에서 채도 높은 색 위주로 뽑은 평균
 *  - 섞는 양: TINT (아주 미묘하게)
 *  - 바뀔 때는 body 배경이 천천히 넘어감 (globals.css 의 transition)
 *  - About 등 프로젝트가 아닌 곳에선 원래 종이색
 * 'Works' 강조와 같은 기준(화면 위쪽 1/3 지점)으로 지금 프로젝트를 정한다.
 */
const TINT = 0;                  // 대표 색을 섞는 비율 (0 = 꺼짐, 0.1 = 꽤 보임)
const MAX_SHIFT = 4;           // 종이색에서 한 채널이 최대 몇만큼 벗어날 수 있는지 (0~255)
const BASE: [number, number, number] = [0xff, 0xff, 0xff]; // 원래 종이색 (--paper)

type RGB = [number, number, number];

/** 이미지에서 '색이 있는' 픽셀 위주로 평균 색을 구함 (회색·흰색·검정은 거의 무시) */
function dominant(src: CanvasImageSource): RGB | null {
  const c = document.createElement("canvas");
  c.width = c.height = 24;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  try {
    g.drawImage(src, 0, 0, 24, 24);
    const d = g.getImageData(0, 0, 24, 24).data;
    let r = 0, gr = 0, b = 0, w = 0;
    for (let i = 0; i < d.length; i += 4) {
      const R = d[i], G = d[i + 1], B = d[i + 2];
      const max = Math.max(R, G, B), min = Math.min(R, G, B);
      const sat = max === 0 ? 0 : (max - min) / max;
      const k = sat * sat + 0.002;            // 채도 높은 픽셀일수록 큰 비중
      r += R * k; gr += G * k; b += B * k; w += k;
    }
    return w ? [r / w, gr / w, b / w] : null;
  } catch {
    return null;
  }
}

/** 대표 색의 '색감'만 섞음 — 밝기는 종이색에 맞춰서, 어두운 프로젝트에서도 배경이 칙칙해지지 않게 */
const mix = (c: RGB, t: number): RGB => {
  const lum = (x: RGB) => 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2];
  const k = lum(BASE) / Math.max(1, lum(c));
  const d = BASE.map((v, i) => (Math.min(255, c[i] * k) - v) * t);
  const over = Math.max(...d.map(Math.abs)) / MAX_SHIFT; // 원색이 강한 프로젝트도 MAX_SHIFT 이상 튀지 않게
  return BASE.map((v, i) => Math.round(v + d[i] / Math.max(1, over))) as RGB;
};
const css = (c: RGB) => `rgb(${c[0]} ${c[1]} ${c[2]})`;

export default function AmbientTint() {
  useEffect(() => {
    if (TINT <= 0) return;
    const root = document.documentElement;
    const tints = new Map<Element, RGB | null>();

    let current: Element | null = null;
    const apply = (s: Element | null) => {
      const c = s ? tints.get(s) : null;
      if (c) root.style.setProperty("--paper", css(mix(c, TINT)));
      else root.style.removeProperty("--paper");
    };

    // 각 프로젝트 대표 색 구하기 (이미지가 로드되는 대로)
    const sections = [...document.querySelectorAll<HTMLElement>("section[data-section]")];
    for (const s of sections) {
      const media = s.querySelector<HTMLImageElement | HTMLVideoElement>(":scope > ul img, :scope > ul video");
      if (!media) { tints.set(s, null); continue; }
      const read = () => {
        const c = dominant(media);
        tints.set(s, c);
        if (s === current) apply(s);
      };
      if (media instanceof HTMLVideoElement) {
        if (media.readyState >= 2) read(); else media.addEventListener("loadeddata", read, { once: true });
      } else {
        const im = new Image();
        im.onload = () => {
          const c = dominant(im);
          tints.set(s, c);
          if (s === current) apply(s);
        };
        im.src = media.currentSrc || media.src;
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          current = e.target;
          apply(current);
        }
      },
      { rootMargin: "-33% 0px -66% 0px" },
    );
    document.querySelectorAll("[data-section]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.style.removeProperty("--paper");
    };
  }, []);
  return null;
}
