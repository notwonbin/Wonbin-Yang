"use client";

import { useEffect, useState } from "react";
import styles from "./SeoulTime.module.css";

/** 서울 현재 시각 (HH:MM, 가운데 : 가 1초마다 깜빡임) */
const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default function SeoulTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return null; // 서버 렌더와 어긋나지 않게, 화면에 붙은 뒤에만 표시
  const [h, m] = time.split(":");
  return (
    <time className={styles.time} aria-label={`Seoul time ${time}`}>
      {h}<span className={styles.colon}>:</span>{m}
    </time>
  );
}
