// Public client-side settings only.
// Never store your Gemini API key in this file.
window.SITE_CHAT_CONFIG = {
  endpoint: "/api/chat",
  model: "gemini-3-flash-preview",
  maxHistory: 8,
  assistantName: {
    ko: "Research AI",
    en: "Research AI"
  },
  title: {
    ko: "AI Chat",
    en: "AI Chat"
  },
  subtitle: {
    ko: "연구 분야와 대표 논문을 빠르게 살펴볼 수 있습니다.",
    en: "Explore research themes and representative papers."
  },
  launcherLabel: {
    ko: "AI Chat",
    en: "AI Chat"
  },
  launcherHint: {
    ko: "대표논문 보기",
    en: "Open paper guide"
  },
  placeholder: {
    ko: "연구 분야나 대표 논문에 대해 물어보세요.",
    en: "Ask about research topics or representative papers."
  },
  sendLabel: {
    ko: "보내기",
    en: "Send"
  },
  closeLabel: {
    ko: "닫기",
    en: "Close"
  },
  welcomeMessage: {
    ko: "안녕하세요. 이 사이트의 핵심 연구 분야와 대표 논문을 빠르게 안내해드릴게요.",
    en: "Hi. I can quickly guide you through the site's research themes and representative papers."
  },
  missingEndpointMessage: {
    ko: "아직 Gemini API 엔드포인트가 연결되지 않았습니다. `assets/js/site-config.js`의 `endpoint` 값을 서버 주소로 바꿔주세요.",
    en: "The Gemini endpoint is not configured yet. Update `endpoint` in `assets/js/site-config.js`."
  },
  githubPagesHint: {
    ko: "GitHub Pages에서는 `/api/chat`가 직접 동작하지 않습니다. 별도 서버리스 URL을 `endpoint`에 넣어주세요.",
    en: "On GitHub Pages, `/api/chat` will not exist. Point `endpoint` to a separate serverless URL."
  },
  errorMessage: {
    ko: "응답을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    en: "I could not get a response. Please try again in a moment."
  },
  typingLabel: {
    ko: "답변 생성 중...",
    en: "Generating response..."
  },
  setupLabel: {
    ko: "설정 필요",
    en: "Setup needed"
  },
  disclaimer: {
    ko: "민감한 개인정보나 비공개 자료는 입력하지 마세요.",
    en: "Do not paste private or confidential information."
  },
  suggestedPrompts: {
    ko: [
      "핵심 연구 분야를 3줄로 요약해줘",
      "대표 논문 3편 추천해줘"
    ],
    en: [
      "Summarize the main research themes in three lines",
      "Recommend three representative papers"
    ]
  }
};
