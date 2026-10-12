/**
 * 프로젝트 안의 이미지 또는 영상 하나.
 * - src가 .mp4 / .webm / .mov 로 끝나면 영상(자동재생, 무음, 반복)으로 표시됩니다.
 * - 갤러리 카드는 모두 같은 크기·비율(--card-ratio, 기본 4:5)이며 이미지는 카드에 맞춰 잘려 보입니다.
 */
export type ProjectMedia = {
  src: string;
  alt: string;
  /** 영상일 때 로딩 전에 보여줄 이미지 (선택) */
  poster?: string;
  /** (선택) 원본 비율 메모용 — 표시에는 쓰이지 않음 */
  ratio?: string;
};

export type Project = {
  /** URL 앵커로 쓰임 (#slug). 영문 소문자 + 하이픈 */
  slug: string;
  title: string;
  year: string;
  category: string;
  /** (선택) 왼쪽 Works 목록에 '제목 + 분류, 연도'로 보이는 짧은 분류. 없으면 category 사용 */
  kind?: string;
  role: string;
  /** 작업 당시 소속 회사 */
  company: string;
  description: string;
  /** 표시 순서대로 나열 */
  media: ProjectMedia[];
};

export type Profile = {
  name: string;
  role: string;
  location: string;
  period: string;
  career: { company: string; period: string; position?: string }[];
  email: string;
  links: { label: string; href: string; handle: string }[];
};
