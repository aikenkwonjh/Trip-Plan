import './globals.css';

export const metadata = {
  title: 'Trip Plan - 여행 플래너',
  description: '도시를 입력하면 인기 할것들과 여행 일정을 자동으로 추천해드립니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
