# Trip Plan

도시와 여행 일수를 입력하면 AI(Claude)가 인기 할것들 TOP 10과 일수별 여행 일정을 자동으로 생성해주는 모바일 친화적 웹앱입니다.

## 기술 스택
- Next.js 14 (App Router)
- Anthropic API (Claude Sonnet)
- 배포: Render

## 로컬 실행 방법

1. 의존성 설치
   ```bash
   npm install
   ```

2. 환경변수 설정
   `.env.example`을 복사해서 `.env.local`로 만들고, 본인의 Anthropic API 키를 입력하세요.
   ```bash
   cp .env.example .env.local
   ```

3. 개발 서버 실행
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000` 접속

## 배포 (Render)

Render에서 이 저장소를 Web Service로 연결한 후, 다음을 설정하세요:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variable**: `ANTHROPIC_API_KEY` (Render 대시보드에서 직접 설정, 코드에는 포함되지 않음)

main 브랜치에 commit이 반영되면 Render가 자동으로 재배포합니다.

## 주의사항

"인기 할것들"은 실시간 검색량 데이터가 아닌, Claude의 학습 데이터를 기반으로 생성된 추천입니다.
