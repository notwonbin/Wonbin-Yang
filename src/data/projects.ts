import type { Project } from "@/lib/types";

/**
 * 프로젝트 데이터.
 * - 순서 = 왼쪽 Works 목록 번호 순서
 * - kind + year → 왼쪽 목록의 "Event Design, 2026" 부분
 * - media는 표시 순서대로. 이미지(.jpg .png .webp)와 영상(.mp4 .webm)을 섞어 쓸 수 있습니다.
 * - 파일은 public/images/<slug>/ 아래에 넣고 경로를 적어주세요. 카드는 모두 4:5 비율입니다.
 * - motion(선택): 왼쪽 아래에 보이는 작은 반복 모션. 흰 배경 정사각형 MP4 (public/images/<slug>/motion.mp4)
 * - "—" 와 "프로젝트 설명을 입력해 주세요." 는 아직 채우지 않은 자리입니다.
 */
export const projects: Project[] = [
  {
    slug: "animal-league-2026",
    title: "ANIMAL LEAGUE 2026",
    year: "2026",
    category: "Event Branding",
    kind: "Event Design",
    role: "Project Lead",
    company: "멋쟁이사자처럼",
    description:
      "ANIMAL LEAGUE 2026은 전국 80개 대학, 약 2,300명이 참여한 대규모 대학 해커톤의 이벤트 브랜딩 프로젝트입니다. 프로젝트 리드로서 브랜드 아이덴티티를 비롯해 캐릭터, 그래픽, 영상, 공간 등 온·오프라인 전반의 디자인을 총괄하며, 행사 전체를 아우르는 일관된 브랜드 경험을 구축했습니다.",
    media: [
      { src: "/images/animal-league-2026/01.jpg", alt: "Animal League 2026", ratio: "4/5" },
      { src: "/images/animal-league-2026/02.mp4", alt: "Animal League 2026", ratio: "4/5" },
      { src: "/images/animal-league-2026/03.mp4", alt: "Animal League 2026", ratio: "4/5" },
      { src: "/images/animal-league-2026/04.mp4", alt: "Animal League 2026", ratio: "4/5" },
      { src: "/images/animal-league-2026/05.mp4", alt: "Animal League 2026", ratio: "4/5" },
    ],
    motion: "/images/animal-league-2026/motion.mp4",
  },
  {
    slug: "naver-pay-graphic-asset",
    title: "Naver Pay",
    year: "2025",
    category: "Graphic Asset Design",
    kind: "Graphic Asset Design",
    role: "—",
    company: "NAVER Pay",
    description:
      "프로젝트 설명을 입력해 주세요.",
    media: [
      { src: "/images/naver-pay-graphic-asset/01.jpg", alt: "Naver Pay Graphic Asset", ratio: "4/5" },
      { src: "/images/naver-pay-graphic-asset/07.mp4", alt: "Naver Pay Graphic Asset", ratio: "4/5" },
      { src: "/images/naver-pay-graphic-asset/02.jpg", alt: "Naver Pay Graphic Asset", ratio: "4/5" },
      { src: "/images/naver-pay-graphic-asset/03.jpg", alt: "Naver Pay Graphic Asset", ratio: "4/5" },
      { src: "/images/naver-pay-graphic-asset/04.jpg", alt: "Naver Pay Graphic Asset", ratio: "4/5" },
      { src: "/images/naver-pay-graphic-asset/05.jpg", alt: "Naver Pay Graphic Asset", ratio: "4/5" },
      { src: "/images/naver-pay-graphic-asset/06.jpg", alt: "Naver Pay Graphic Asset", ratio: "4/5" },
    ],
    motion: "/images/naver-pay-graphic-asset/motion.mp4",
  },
  {
    slug: "samsung-fire-insurance",
    title: "Samsung Fire & Marine Insurance",
    year: "2024",
    category: "Illustration Design",
    kind: "Illustration Design",
    role: "—",
    company: "Samsung Fire & Marine Insurance",
    description:
      "프로젝트 설명을 입력해 주세요.",
    media: [
      { src: "/images/samsung-fire-insurance/01.jpg", alt: "삼성화재", ratio: "4/5" },
      { src: "/images/samsung-fire-insurance/02.jpg", alt: "삼성화재", ratio: "4/5" },
      { src: "/images/samsung-fire-insurance/03.jpg", alt: "삼성화재", ratio: "4/5" },
      { src: "/images/samsung-fire-insurance/04.jpg", alt: "삼성화재", ratio: "4/5" },
      { src: "/images/samsung-fire-insurance/05.jpg", alt: "삼성화재", ratio: "4/5" },
    ],
  },
  {
    slug: "kbo",
    title: "KBO",
    year: "2022",
    category: "Brand Design",
    kind: "Brand Design",
    role: "—",
    company: "KBO",
    description:
      "프로젝트 설명을 입력해 주세요.",
    media: [
      { src: "/images/kbo/01.jpg", alt: "KBO", ratio: "4/5" },
      { src: "/images/kbo/02.jpg", alt: "KBO", ratio: "4/5" },
      { src: "/images/kbo/03.jpg", alt: "KBO", ratio: "4/5" },
      { src: "/images/kbo/04.jpg", alt: "KBO", ratio: "4/5" },
      { src: "/images/kbo/05.jpg", alt: "KBO", ratio: "4/5" },
    ],
  },
  {
    slug: "gwanghwamun-lions",
    title: "Gwanghwamun Lions",
    year: "2026",
    category: "Event Design",
    kind: "Event Design",
    role: "—",
    company: "—",
    description:
      "프로젝트 설명을 입력해 주세요.",
    media: [
      { src: "/images/gwanghwamun-lions/01.jpg", alt: "Gwanghwamun Lions", ratio: "4/5" },
      { src: "/images/gwanghwamun-lions/02.jpg", alt: "Gwanghwamun Lions", ratio: "4/5" },
      { src: "/images/gwanghwamun-lions/03.jpg", alt: "Gwanghwamun Lions", ratio: "4/5" },
      { src: "/images/gwanghwamun-lions/04.jpg", alt: "Gwanghwamun Lions", ratio: "4/5" },
      { src: "/images/gwanghwamun-lions/05.jpg", alt: "Gwanghwamun Lions", ratio: "4/5" },
    ],
  },
  {
    slug: "hack-it",
    title: "Hack It",
    year: "2026",
    category: "Graphic Design",
    kind: "Graphic Design",
    role: "—",
    company: "—",
    description:
      "프로젝트 설명을 입력해 주세요.",
    media: [
      { src: "/images/hack-it/01.jpg", alt: "Hack It", ratio: "4/5" },
      { src: "/images/hack-it/02.jpg", alt: "Hack It", ratio: "4/5" },
      { src: "/images/hack-it/03.jpg", alt: "Hack It", ratio: "4/5" },
      { src: "/images/hack-it/04.jpg", alt: "Hack It", ratio: "4/5" },
      { src: "/images/hack-it/05.jpg", alt: "Hack It", ratio: "4/5" },
    ],
  },
  {
    slug: "possibility-to-reality",
    title: "Possibility to Reality",
    year: "2025",
    category: "Campaign Design",
    kind: "Campaign Design",
    role: "—",
    company: "—",
    description:
      "프로젝트 설명을 입력해 주세요.",
    media: [
      { src: "/images/possibility-to-reality/01.jpg", alt: "Possibility to Reality", ratio: "4/5" },
      { src: "/images/possibility-to-reality/02.jpg", alt: "Possibility to Reality", ratio: "4/5" },
      { src: "/images/possibility-to-reality/03.jpg", alt: "Possibility to Reality", ratio: "4/5" },
      { src: "/images/possibility-to-reality/04.jpg", alt: "Possibility to Reality", ratio: "4/5" },
      { src: "/images/possibility-to-reality/05.jpg", alt: "Possibility to Reality", ratio: "4/5" },
    ],
  },
  {
    slug: "gangneung-tourism",
    title: "Gangneung Tourism Brand",
    year: "2021",
    category: "Brand Design",
    kind: "Brand Design",
    role: "—",
    company: "Gangneung City",
    description:
      "프로젝트 설명을 입력해 주세요.",
    media: [
      { src: "/images/gangneung-tourism/01.jpg", alt: "Gangneung Tourism Brand", ratio: "4/5" },
      { src: "/images/gangneung-tourism/02.jpg", alt: "Gangneung Tourism Brand", ratio: "4/5" },
      { src: "/images/gangneung-tourism/03.jpg", alt: "Gangneung Tourism Brand", ratio: "4/5" },
      { src: "/images/gangneung-tourism/04.jpg", alt: "Gangneung Tourism Brand", ratio: "4/5" },
      { src: "/images/gangneung-tourism/05.jpg", alt: "Gangneung Tourism Brand", ratio: "4/5" },
    ],
  },
];
