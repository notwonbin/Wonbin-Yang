import type { Profile } from "@/lib/types";

/** 사이드바 · About · Footer에 쓰이는 개인 정보. 연락처는 임시 값입니다. */
export const profile: Profile = {
  name: "YANG WONBIN",
  role: "BX / BRAND DESIGNER",
  location: "Seoul, KR",
  period: "2023 — 2026",
  // 사이드바 두 번째 영역과 About에 표시. position(직함)은 선택 항목
  career: [
    { company: "멋쟁이사자처럼", period: "2025.09 — Present" },
    { company: "Plus X", period: "2022.07 — 2025.03" },
    { company: "Mass C&G", period: "2021.01 — 2022.03" },
  ],
  email: "hello@yangwonbin.com",
  links: [
    { label: "Instagram", href: "https://instagram.com/", handle: "@yangwonbin" },
    { label: "Behance", href: "https://www.behance.net/", handle: "behance.net/yangwonbin" },
  ],
};
