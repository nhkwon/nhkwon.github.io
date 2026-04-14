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
    ko: "연구 분야, 논문, 협업 문의를 빠르게 안내합니다.",
    en: "Ask about research topics, publications, and collaboration."
  },
  launcherLabel: {
    ko: "AI Chat",
    en: "AI Chat"
  },
  launcherHint: {
    ko: "연구 안내",
    en: "Research guide"
  },
  placeholder: {
    ko: "연구 분야나 논문에 대해 물어보세요",
    en: "Ask about research topics or publications"
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
    ko: "안녕하세요. 이 사이트의 연구 분야, 대표 논문, 협업 문의 방법을 안내해드릴게요.",
    en: "Hi. I can help you explore the site's research themes, selected publications, and collaboration info."
  },
  missingEndpointMessage: {
    ko: "GitHub Pages에는 서버 API가 없어서 브라우저만으로는 Gemini를 안전하게 호출할 수 없습니다. `api/chat.js`를 Vercel 같은 서버리스에 배포한 뒤, 이 파일의 `endpoint`를 그 주소로 바꿔주세요.",
    en: "GitHub Pages cannot safely call Gemini directly from the browser. Deploy `api/chat.js` to a serverless host such as Vercel, then point `endpoint` in this file to that URL."
  },
  githubPagesHint: {
    ko: "현재 GitHub Pages에 `/api/chat`가 없을 가능성이 큽니다. 별도 서버리스 URL을 `endpoint`에 넣어주세요.",
    en: "You're likely on GitHub Pages, where `/api/chat` does not exist. Update `endpoint` to your deployed serverless URL."
  },
  errorMessage: {
    ko: "응답을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    en: "I couldn't get a response. Please try again in a moment."
  },
  typingLabel: {
    ko: "답변 생성 중...",
    en: "Generating response..."
  },
  readyLabel: {
    ko: "연결됨",
    en: "Connected"
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
      "대표 논문 몇 편을 추천해줘",
      "공동연구 문의는 어떻게 하면 돼?"
    ],
    en: [
      "Summarize the main research themes in three lines",
      "Recommend a few representative papers",
      "How should I ask about collaboration?"
    ]
  }
};
