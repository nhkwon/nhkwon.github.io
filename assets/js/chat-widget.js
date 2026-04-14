(function () {
  const app = document.getElementById("app");

  if (!app || !document.body) {
    return;
  }

  const lang = document.body.dataset.lang === "en" ? "en" : "ko";
  const page = document.body.dataset.page || "home";
  const config = normalizeConfig(window.SITE_CHAT_CONFIG || {});
  const storageKey = `site-ai-chat:${lang}`;
  const state = {
    isOpen: false,
    isSending: false,
    messages: loadMessages()
  };

  if (!state.messages.length) {
    state.messages = [createMessage("assistant", localize(config.welcomeMessage))];
    saveMessages();
  }

  document.body.insertAdjacentHTML("beforeend", renderShell());

  const elements = {
    root: document.querySelector("[data-ai-chat-root]"),
    launcher: document.querySelector("[data-ai-chat-launcher]"),
    panel: document.querySelector("[data-ai-chat-panel]"),
    close: document.querySelector("[data-ai-chat-close]"),
    status: document.querySelector("[data-ai-chat-status]"),
    messages: document.querySelector("[data-ai-chat-messages]"),
    suggestions: document.querySelector("[data-ai-chat-suggestions]"),
    hint: document.querySelector("[data-ai-chat-hint]"),
    form: document.querySelector("[data-ai-chat-form]"),
    input: document.querySelector("[data-ai-chat-input]"),
    send: document.querySelector("[data-ai-chat-send]")
  };

  if (!elements.root) {
    return;
  }

  elements.launcher.addEventListener("click", () => setOpen(true));
  elements.close.addEventListener("click", () => setOpen(false));
  elements.form.addEventListener("submit", handleSubmit);
  elements.input.addEventListener("keydown", handleInputKeydown);
  elements.suggestions.addEventListener("click", handleSuggestionClick);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.isOpen) {
      setOpen(false);
    }
  });

  render();

  function normalizeConfig(input) {
    const defaults = {
      endpoint: "",
      model: "gemini-3-flash-preview",
      maxHistory: 8,
      assistantName: { ko: "Research AI", en: "Research AI" },
      title: { ko: "AI Chat", en: "AI Chat" },
      subtitle: {
        ko: "연구 분야, 논문, 협업 문의를 빠르게 안내합니다.",
        en: "Ask about research topics, publications, and collaboration."
      },
      launcherLabel: { ko: "AI Chat", en: "AI Chat" },
      launcherHint: { ko: "Research guide", en: "Research guide" },
      placeholder: {
        ko: "연구 분야나 논문에 대해 물어보세요",
        en: "Ask about research topics or publications"
      },
      sendLabel: { ko: "보내기", en: "Send" },
      closeLabel: { ko: "닫기", en: "Close" },
      welcomeMessage: {
        ko: "안녕하세요. 이 사이트의 연구 분야, 대표 논문, 협업 문의 방법을 안내해드릴게요.",
        en: "Hi. I can help you explore the site's research themes, selected publications, and collaboration info."
      },
      missingEndpointMessage: {
        ko: "Gemini API 엔드포인트가 아직 연결되지 않았습니다. `assets/js/site-config.js`에서 `endpoint`를 서버리스 주소로 바꿔주세요.",
        en: "The Gemini endpoint is not configured yet. Update `endpoint` in `assets/js/site-config.js` with your deployed serverless URL."
      },
      githubPagesHint: {
        ko: "GitHub Pages에서는 `/api/chat`가 동작하지 않습니다. 별도 서버리스 URL을 넣어주세요.",
        en: "On GitHub Pages, `/api/chat` will not exist. Point `endpoint` to a separate serverless URL."
      },
      errorMessage: {
        ko: "응답을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        en: "I couldn't get a response. Please try again in a moment."
      },
      typingLabel: { ko: "답변 생성 중...", en: "Generating response..." },
      readyLabel: { ko: "연결됨", en: "Connected" },
      setupLabel: { ko: "설정 필요", en: "Setup needed" },
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

    return {
      ...defaults,
      ...input,
      suggestedPrompts: {
        ...defaults.suggestedPrompts,
        ...(input.suggestedPrompts || {})
      }
    };
  }

  function localize(value) {
    if (typeof value === "string") {
      return value;
    }

    if (!value || typeof value !== "object") {
      return "";
    }

    return value[lang] || value.ko || value.en || "";
  }

  function renderShell() {
    return `
      <section class="ai-chat-root" data-ai-chat-root>
        <button
          class="ai-chat-launcher"
          type="button"
          data-ai-chat-launcher
          aria-expanded="false"
          aria-controls="site-ai-chat-panel"
        >
          <span class="ai-chat-launcher-mark">AI</span>
          <span class="ai-chat-launcher-copy">
            <strong>${escapeHtml(localize(config.launcherLabel))}</strong>
            <span>${escapeHtml(localize(config.launcherHint))}</span>
          </span>
        </button>

        <section
          class="ai-chat-panel"
          id="site-ai-chat-panel"
          data-ai-chat-panel
          aria-label="${escapeHtml(localize(config.title))}"
          hidden
        >
          <header class="ai-chat-header">
            <div class="ai-chat-header-copy">
              <p class="ai-chat-kicker">${escapeHtml(localize(config.assistantName))}</p>
              <h2>${escapeHtml(localize(config.title))}</h2>
              <p>${escapeHtml(localize(config.subtitle))}</p>
            </div>
            <button
              class="ai-chat-close"
              type="button"
              data-ai-chat-close
              aria-label="${escapeHtml(localize(config.closeLabel))}"
            >
              ×
            </button>
          </header>

          <div class="ai-chat-toolbar">
            <span class="ai-chat-status" data-ai-chat-status></span>
            <a class="ai-chat-contact" href="${lang === "en" ? "contact-en.html" : "contact.html"}">
              ${escapeHtml(lang === "en" ? "Contact page" : "문의 페이지")}
            </a>
          </div>

          <div class="ai-chat-messages" data-ai-chat-messages aria-live="polite"></div>

          <div class="ai-chat-suggestions" data-ai-chat-suggestions></div>

          <p class="ai-chat-hint" data-ai-chat-hint></p>

          <form class="ai-chat-form" data-ai-chat-form>
            <label class="sr-only" for="site-ai-chat-input">${escapeHtml(localize(config.title))}</label>
            <textarea
              class="ai-chat-input"
              id="site-ai-chat-input"
              data-ai-chat-input
              rows="3"
              maxlength="1200"
              placeholder="${escapeHtml(localize(config.placeholder))}"
            ></textarea>
            <div class="ai-chat-form-footer">
              <button class="ai-chat-send" type="submit" data-ai-chat-send>${escapeHtml(localize(config.sendLabel))}</button>
            </div>
          </form>
        </section>
      </section>
    `;
  }

  function render() {
    elements.panel.hidden = !state.isOpen;
    elements.root.classList.toggle("is-open", state.isOpen);
    elements.launcher.setAttribute("aria-expanded", String(state.isOpen));
    elements.status.textContent = state.isSending
      ? localize(config.typingLabel)
      : config.endpoint
        ? config.model
        : localize(config.setupLabel);
    elements.hint.textContent = state.isSending
      ? localize(config.typingLabel)
      : localize(config.disclaimer);
    elements.messages.innerHTML = renderMessages();
    elements.suggestions.innerHTML = renderSuggestions();
    elements.send.disabled = state.isSending;
    elements.input.disabled = state.isSending;

    if (state.isOpen) {
      requestAnimationFrame(() => {
        elements.messages.scrollTop = elements.messages.scrollHeight;
        if (!state.isSending) {
          elements.input.focus();
        }
      });
    }
  }

  function renderMessages() {
    const bubbles = state.messages.map((message) => {
      return `
        <article class="ai-chat-bubble ${message.role === "user" ? "is-user" : "is-assistant"}">
          <p class="ai-chat-bubble-role">${escapeHtml(message.role === "user" ? (lang === "en" ? "You" : "나") : localize(config.assistantName))}</p>
          <div class="ai-chat-bubble-text">${formatText(message.text)}</div>
        </article>
      `;
    });

    if (state.isSending) {
      bubbles.push(`
        <article class="ai-chat-bubble is-assistant is-pending">
          <p class="ai-chat-bubble-role">${escapeHtml(localize(config.assistantName))}</p>
          <div class="ai-chat-bubble-text">${escapeHtml(localize(config.typingLabel))}</div>
        </article>
      `);
    }

    return bubbles.join("");
  }

  function renderSuggestions() {
    const prompts = Array.isArray(config.suggestedPrompts?.[lang])
      ? config.suggestedPrompts[lang]
      : Array.isArray(config.suggestedPrompts?.ko)
        ? config.suggestedPrompts.ko
        : [];

    return prompts
      .map(
        (prompt) => `
          <button class="ai-chat-suggestion" type="button" data-ai-chat-prompt="${escapeAttribute(prompt)}">
            ${escapeHtml(prompt)}
          </button>
        `
      )
      .join("");
  }

  function handleSuggestionClick(event) {
    const button = event.target.closest("[data-ai-chat-prompt]");

    if (!button) {
      return;
    }

    setOpen(true);
    elements.input.value = button.getAttribute("data-ai-chat-prompt") || "";
    elements.input.focus();
  }

  function handleInputKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (state.isSending) {
      return;
    }

    const userText = elements.input.value.trim();

    if (!userText) {
      return;
    }

    elements.input.value = "";
    state.messages.push(createMessage("user", userText));
    trimMessages();
    saveMessages();
    setOpen(true);

    if (!config.endpoint) {
      state.messages.push(createMessage("assistant", localize(config.missingEndpointMessage)));
      trimMessages();
      saveMessages();
      render();
      return;
    }

    state.isSending = true;
    render();

    try {
      const result = await requestAssistantReply(userText);
      state.messages.push(createMessage("assistant", result.reply || localize(config.errorMessage)));
    } catch (error) {
      state.messages.push(createMessage("assistant", getFriendlyError(error)));
    } finally {
      state.isSending = false;
      trimMessages();
      saveMessages();
      render();
    }
  }

  async function requestAssistantReply(userText) {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userText,
        history: state.messages
          .slice(-config.maxHistory * 2)
          .map((message) => ({ role: message.role, text: message.text })),
        lang,
        page,
        url: window.location.href,
        model: config.model,
        siteContext: buildSiteContext()
      })
    });

    const payload = await safeJson(response);

    if (!response.ok) {
      const error = new Error((payload && payload.error) || `Request failed with status ${response.status}.`);
      error.status = response.status;
      throw error;
    }

    return payload || {};
  }

  function buildSiteContext() {
    const profile = window.SITE_DATA?.profile || {};
    const publications = Array.isArray(window.SITE_DATA?.outputs?.publications)
      ? window.SITE_DATA.outputs.publications
          .slice(0, 6)
          .map((item) => `${item.year || ""} | ${item.title || ""} | ${item.venue || ""}`)
          .join("\n")
      : "";
    const pageText = clipText(
      (document.querySelector(".site-main")?.innerText || "")
        .replace(/\s+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim(),
      6000
    );

    return [
      `Language: ${lang}`,
      `Current page: ${page}`,
      `Name: ${localize(profile.nameDisplay || profile.name)}`,
      `Title: ${localize(profile.title)}`,
      `Affiliation: ${localize(profile.affiliation)}`,
      `Summary: ${localize(profile.status)}`,
      publications ? `Selected publications:\n${publications}` : "",
      pageText ? `Visible page content:\n${pageText}` : ""
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  function getFriendlyError(error) {
    if (error && error.status === 404 && config.endpoint === "/api/chat") {
      return localize(config.githubPagesHint);
    }

    return localize(config.errorMessage);
  }

  function setOpen(nextOpen) {
    state.isOpen = Boolean(nextOpen);
    render();
  }

  function createMessage(role, text) {
    return {
      role,
      text: clipText(String(text || "").trim(), 4000)
    };
  }

  function trimMessages() {
    const maxMessages = Math.max(6, config.maxHistory * 2 + 2);

    if (state.messages.length > maxMessages) {
      state.messages = state.messages.slice(-maxMessages);
    }
  }

  function loadMessages() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((item) => item && (item.role === "assistant" || item.role === "user") && typeof item.text === "string")
        .map((item) => createMessage(item.role, item.text))
        .slice(-18);
    } catch (_error) {
      return [];
    }
  }

  function saveMessages() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state.messages.slice(-18)));
    } catch (_error) {
      // Ignore storage failures.
    }
  }

  function formatText(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  function clipText(value, limit) {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/\n/g, " ");
  }

  async function safeJson(response) {
    try {
      return await response.json();
    } catch (_error) {
      return null;
    }
  }
})();
