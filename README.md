# Yang Wonbin — Portfolio

Next.js 16 · TypeScript · CSS Modules. 디자인 시스템은 [`DESIGN.md`](./DESIGN.md) 참고.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # 프로덕션 확인
```

## 내용 수정

| 바꿀 것 | 파일 |
|---|---|
| 프로젝트 추가/삭제/순서/텍스트 | `src/data/projects.ts` |
| 이름, 직함, 경력, 이메일, SNS | `src/data/profile.ts` |
| 배포 도메인, SEO 문구 | `src/app/layout.tsx` (`metadataBase`) |
| 색, 글자 크기, 간격, 정렬 기준선, 모션 시간 | `src/app/globals.css` 상단 `:root` 토큰 |

### 이미지·영상 넣기

1. 파일을 `public/images/<프로젝트 slug>/` 폴더에 넣습니다.
2. `src/data/projects.ts`의 해당 프로젝트 `media` 목록에 한 줄 추가합니다.

```ts
media: [
  { src: "/images/doruri/01.jpg", alt: "로고타입" },
  { src: "/images/doruri/02.mp4", alt: "패키지 모션" },  // 영상도 같은 방식
]
```

- `.mp4` / `.webm` / `.mov`는 자동으로 영상(무음, 반복 재생)으로 표시됩니다.
- 갤러리 카드는 모두 같은 크기·비율(4:5)이고 이미지는 카드에 맞춰 잘려 보입니다. 4:5로 만든 파일이 가장 잘 맞습니다.
- 카드 비율을 바꾸려면 `globals.css`의 `--card-ratio` 하나만 바꾸면 됩니다.
- 영상은 용량을 줄여(가로 1280px 이하, 10MB 이하 권장) 넣는 게 좋습니다.

## 배포

Vercel에 저장소를 연결하면 별도 설정 없이 배포됩니다.
# wb_test
