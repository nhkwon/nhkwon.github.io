# nhkwon.github.io

정적 개인사이트에 Gemini 기반 AI 챗 위젯을 붙인 버전입니다.

## 이번에 추가한 것

- `assets/js/chat-widget.js`
  - 사이트 우하단의 AI 챗 UI
  - 현재 페이지 내용과 대표 논문 일부를 컨텍스트로 함께 전송
  - 대화 내역을 `localStorage`에 잠깐 보관
- `assets/js/site-config.js`
  - 챗봇 제목, 추천 질문, 엔드포인트, 모델명을 넣는 공개 설정 파일
- `api/chat.js`
  - Gemini API를 대신 호출하는 서버리스 프록시 예시
  - API 키는 여기서 서버 환경변수로 읽음
- `.env.example`
  - 서버 환경변수 예시

## 중요한 점: API 키는 어디에 저장하나?

브라우저 파일에 넣으면 안 됩니다.

- 넣으면 안 되는 곳
  - `assets/js/site-config.js`
  - `assets/js/chat-widget.js`
  - HTML 파일
  - GitHub에 커밋되는 어떤 파일이든
- 넣어야 하는 곳
  - Vercel / Netlify / Cloudflare Workers 같은 서버리스의 환경변수
  - 로컬 개발 중이면 커밋하지 않는 `.env.local`

이 프로젝트에서는 서버가 `GEMINI_API_KEY`를 읽고, 브라우저는 오직 `/api/chat` 같은 프록시 주소만 호출하도록 구성했습니다.

## Gemini 모델명

사용자 요청을 반영해 현재 기본값은 `gemini-3-flash-preview`로 넣어두었습니다.

- 프론트 설정: `assets/js/site-config.js`
- 서버 기본값: `api/chat.js`

필요하면 `gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-2.0-flash`로 바꿀 수 있게 해두었습니다.

## 빠른 설정

### 1. 서버 환경변수 설정

아래 값을 서버리스 배포 환경에 넣으세요.

```bash
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3-flash-preview
ALLOWED_ORIGINS=https://your-domain.com,https://your-name.github.io
```

로컬에서는 `.env.example`를 참고해서 `.env.local`을 만들면 됩니다.

### 2. 챗봇 엔드포인트 설정

`assets/js/site-config.js`의 `endpoint`를 사용 환경에 맞게 바꾸세요.

- 사이트 전체를 Vercel에 올릴 때
  - 그대로 `"/api/chat"` 사용
- 사이트는 GitHub Pages에 두고 API만 따로 둘 때
  - 예: `"https://your-chat-proxy.vercel.app/api/chat"`

### 3. UI 문구 수정

다음 파일에서 제목, 안내문, 추천 질문을 바꿀 수 있습니다.

- `assets/js/site-config.js`

## GitHub Pages를 계속 쓸 때

GitHub Pages는 정적 호스팅이라 `api/chat.js`를 직접 실행하지 못합니다.

즉, 아래 둘 중 하나가 필요합니다.

1. 사이트를 Vercel 같은 곳으로 옮겨서 `/api/chat`까지 같이 배포
2. 사이트는 GitHub Pages에 두고, `api/chat.js`를 별도 서버리스 프로젝트로 배포한 뒤 그 URL을 `endpoint`에 입력

## 파일 구조

- `assets/css/site.css`: 기존 사이트 스타일 + AI 챗 스타일
- `assets/js/site.js`: 기존 사이트 렌더링
- `assets/js/site-config.js`: 공개 챗 설정
- `assets/js/chat-widget.js`: 챗 UI와 브라우저 로직
- `api/chat.js`: Gemini 프록시
- `.env.example`: 서버 환경변수 예시

## 보안 체크리스트

- `GEMINI_API_KEY`를 브라우저 코드에 넣지 않기
- `.env.local`은 커밋하지 않기
- 가능하면 `ALLOWED_ORIGINS`로 호출 도메인 제한하기
- 민감한 개인정보는 챗 입력창에 넣지 않기
