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
  /** (선택) 왼쪽 Works 목록에만 쓰는 짧은 이름. 없으면 title */
  short?: string;
  year: string;
  category: string;
  /** (선택) 왼쪽 Works 목록에 '제목 + 분류, 연도'로 보이는 짧은 분류. 없으면 category 사용 */
  kind?: string;
  /** 직책 — Role 줄 맨 앞에 보임 (예: Project Lead) */
  role: string;
  /** (선택) 작업 범위 — Role 줄에서 직책 뒤에 간격으로 나열. "A · B · C" 처럼 · 로 구분해서 적기 */
  scope?: string;
  /** 작업 당시 소속 회사 */
  company: string;
  description: string;
  /** 표시 순서대로 나열 */
  media: ProjectMedia[];
  /** (선택) 왼쪽 아래 작은 모션 — 흰 배경 MP4, 정사각형 (예: /images/<slug>/motion.mp4) */
  motion?: string;
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
