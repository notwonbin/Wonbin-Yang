"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectMedia } from "@/lib/types";
import styles from "./Media.module.css";

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

/** 카드를 꽉 채우는 이미지/영상(cover). 로드되면 fade-in. 영상은 자동재생·무음·반복. */
export default function Media({ item, sizes }: { item: ProjectMedia; sizes: string }) {
  const [loaded, setLoaded] = useState(false);
  const cls = `${styles.el} ${loaded ? styles.loaded : ""}`;

  return (
    <div className={styles.frame}>
      {isVideo(item.src) ? (
        <video
          className={cls}
          src={item.src}
          poster={item.poster}
          aria-label={item.alt}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          ref={(el) => {
            if (el && el.readyState >= 2 && !loaded) setLoaded(true);
          }}
          onLoadedData={() => setLoaded(true)}
        />
      ) : (
        <Image className={cls} src={item.src} alt={item.alt} fill sizes={sizes} draggable={false} onLoad={() => setLoaded(true)} />
      )}
    </div>
  );
}
