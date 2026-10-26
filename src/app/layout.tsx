import type { Metadata, Viewport } from "next";
import { profile } from "@/data/profile";
import "./globals.css";

const title = "Wonbin Yang — Brand Designer";
const description = "Selected brand identity and BX design work by Wonbin Yang, 2023 — 2026. Seoul, KR.";

export const metadata: Metadata = {
  // 배포 도메인으로 바꿔주세요
  metadataBase: new URL("https://yangwonbin.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: ["/images/animal-league-2026/01.jpg"],
  },
  twitter: { card: "summary_large_image", title, description },
  authors: [{ name: profile.name }],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 저장된 테마(밝은/어두운)를 그리기 전에 적용 → 깜빡임 없음 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
