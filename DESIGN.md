# Yang Wonbin — Portfolio Design System (v9)

Minimal · Editorial · Precise · Quiet · Contemporary.
작업물이 먼저 보이는 한 페이지 아카이브. 텍스트는 작고 조용하게, 위계는 크기보다 색(3단계)과 위치로. 색은 이미지에서만.
모든 값은 `src/app/globals.css`의 `:root` 토큰으로만 관리한다.

## 1. Structure

```
┌───────────────┬──────────────────────────────────────────────────────────┐
│ YANG WONBIN   │ ANIMAL LEAGUE 2026      Category …    Description        │ ← --rail-top (같은 가로선)
│ BX / BRAND …  │ 2026                    Role …        (max 34em)         │
│ Seoul, KR     │                         Company …                        │
│ 멋쟁이사자처럼 2025.09—Present ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌──      │ ← 제목 + --head-h (경력 = 카드 상단)
│ Plus X   2022.07—2025.03  │    │ │    │ │    │ │    │ │  4.5장, 4:5   │
│ Mass C&G 2021.01—2022.03  │    │ │    │ │    │ │    │ │               │
│               │                                                          │
│ Selected Works│ └────┘ └────┘ └────┘ └────┘ └──                          │
│ 01 ANIMAL …   │                                                          │
│               │                                   ↕ --project-gap        │
│ About         │ LIKELION BRAND IDENTITY …                                │
└───────────────┴──────────────────────────────────────────────────────────┘
```

## 2. Color

| Token | Hex | 용도 |
|---|---|---|
| `--paper` | `#F4F4F2` | 배경 (흰 이미지가 묻히지 않게 한 톤 눌러 둠) |
| `--plate` | `#E9E9E6` | 이미지 로딩 전 |
| `--ink` | `#3A3A38` | Primary — 제목, 설명, 메타 값, 활성 목록 |
| `--ink-2` | `#7C7C79` | Secondary — 연도, 라벨, Selected Works |
| `--ink-3` | `#B0B0AD` | Inactive — 비활성 목록 |

## 3. Typography (Inter Tight + Pretendard)

| 순위 | 요소 | 값 | 색 |
|---|---|---|---|
| 1 | 프로젝트 제목 / About | `--fs-title` 16 / 1.2 / 500 / −0.01em | ink |
| 1′ | 연도 | 16 / 1.2 / 400 | ink-2 (크기는 같고 색·굵기로 한 단계 아래) |
| 2 | 설명 | `--fs-meta` 11 / 1.55 (메타 값과 같은 크기), 최대 `--measure` 44em | ink |
| 3 | 메타 값 | `--fs-meta` 11 / 1.45 | ink |
| 4 | 메타 라벨 | `--fs-caption` 11 | ink-2 |
| 1 | 사이드바 이름 | 16 / 1.2 / 600 `--fw-strong` | ink |
| 3 | 회사명 · Works 라벨 | 12 / 600 `--fw-strong` | ink |
| 3 | 직함 · Works 목록 | 12 / 1.45 | ink / ink-3 |

## 4. Grid & spacing

- 간격: 4px 기반 `--space-1`…`--space-9` (4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96)
- 12열 그리드. Sidebar `--side` 3열, Content 4–12열(9열). 제목·카드·About 모두 같은 x에서 시작.
- 헤더 열 = 카드 열: Title/Year → 1번 카드 왼쪽선 · Meta → 2번 카드 · Description → 3번 카드부터 (태블릿: Meta 1번 · Description 2번). About도 같은 열. 첫 줄 baseline 일치.
- 세로 기준선
  - `--rail-top` 24px: 이름 상단 = 첫 프로젝트 제목 상단
  - `--head-h`: 제목 상단 → 카드 상단, 모든 프로젝트 동일 (≥1440 128 · 1200–1439 144 · 1025–1199 176 · ≤1024 232 · ≤680 300). 사이드바 이름 블록도 같은 높이라 경력 블록 상단 = 카드 상단.
  - 사이드바: 이름 → (head-h) → 경력(회사 | 기간) → 48px → Works (경력·Works 목록 행 높이 동일)
  - `--project-gap`: 카드 하단 → 다음 제목 160–208px (태블릿·모바일 144). 프로젝트 안쪽 여백(약 38–114px)보다 항상 크다.
- 카드: 같은 폭·비율 `--card-ratio` 4:5, gap 10–16px, 모서리 `--radius-media` 8px

| Viewport | 보이는 카드 |
|---|---|
| ≥1440px | 4.1 |
| 1025–1439px | 3.3 |
| 681–1024px | 2.2 |
| ≤680px | 1.1 |

## 5. Interaction (이유가 있는 것만, 화면 요소는 추가하지 않음)

| 인터랙션 | 이유 |
|---|---|
| 사이드바 sticky + 스크롤 위치 자동 활성 + 클릭 시 smooth scroll | 긴 아카이브에서 현재 위치·이동 |
| 부드러운 스크롤 + 프로젝트 스냅 (데스크톱) — 휠 입력은 스프링(강도 120 · 감쇠 19)으로 따라가고, 입력이 멈추면 같은 스프링이 속도를 이어받아 가장 알맞은 프로젝트로 미끄러지듯 안착. 진행 방향 18%만 넘겨도 다음으로. 목록 클릭도 같은 스프링. 키보드·스크롤바·가로 갤러리는 기본 동작. 태블릿/모바일: CSS proximity | 끊김 없는 모션감, 스크롤이 끝나면 제목 = 이름선, 카드 = 경력선 |
| 사이드바 항목 hover 시 2px 이동 | 클릭 가능함을 조용히 알림 |
| 마지막 카드가 화면 끝에 반쯤 걸침 + grab 커서 | 가로로 더 있음을 암시 |
| 트랙패드 · Shift+휠 · 마우스 드래그(놓으면 가까운 카드에 맞춤) · 키보드 ←/→ | 입력 방식별 탐색, 접근성 |
| 커스텀 커서: 8px 먹색 점이 부드럽게 따라옴. 갤러리 카드·링크(Works 목록, 이름, About 링크) 위에서만 96px 볼록렌즈로 바뀜 — 아래 이미지·영상·글자가 비치고 가운데 1.8배, 가장자리는 원래 크기라 테두리 없이 이어짐. 그 밖에서는 점 그대로. 누르면 살짝 작아짐 (마우스 기기만) | 조용하지만 손에 붙는 반응 |
| 숨은 글자 (`src/data/secrets.ts`): 프로젝트 사이 여백·사이드바에 7% 진하기로 숨겨 둔 9px 한마디, 렌즈를 대야만 또렷하게 읽힘 | 렌즈 커서를 만든 이유 — 찾는 사람만 웃는 발견 |
| 서울 실시간 시계: 'Seoul, KR' 옆 HH:MM, 가운데 : 가 1초마다 깜빡임 | 지금 이 사람이 있는 곳 |
| 이름 hover 시 글자가 0.45초 뒤섞였다 왼쪽부터 제자리로 | 이름에 손이 가게 |
| 다른 탭으로 나가면 탭 제목 '(•_•) come back soon', 돌아오면 '(˘▽˘) welcome back' 1.6초 | 작은 인사 |
| 이미지 hover 시 0.7초 동안 2% 확대 | 거의 인지되지 않는 반응 |
| 이미지·영상 로드 시 fade-in, 진입 시 사이드바 1회 reveal | 첫 인상 |

모션: `--dur-fast` 150 · `--dur-base` 240 · `--dur-slow` 700ms, `prefers-reduced-motion` 시 제거.

## 6. Files

- `src/data/projects.ts` 프로젝트 / `src/data/profile.ts` 개인 정보
- `public/images/<slug>/` 이미지·영상
- `src/components/` Sidebar, ProjectSection, Carousel, Media, About, Footer
