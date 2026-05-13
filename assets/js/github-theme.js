(() => {
  const COPY = {
    ko: {
      search: "페이지 탐색",
      publicLabel: "Public",
      about: "About",
      links: "Links",
      language: "Language",
      contact: "Contact",
      overview: "Overview"
    },
    en: {
      search: "Search pages",
      publicLabel: "Public",
      about: "About",
      links: "Links",
      language: "Language",
      contact: "Contact",
      overview: "Overview"
    }
  };

  function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function currentUpdateLabel() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}.${values.month}.${values.day}`;
  }

  function currentCopy() {
    return COPY[document.body.dataset.lang === "en" ? "en" : "ko"];
  }

  function pageSearchItems(lang) {
    return [
      { keys: ["home", "홈"], label: "Home", href: lang === "en" ? "en.html" : "ko.html" },
      { keys: ["biography", "bio", "소개", "학력", "경력"], label: "Biography", href: lang === "en" ? "bio-en.html" : "bio.html" },
      { keys: ["research", "연구"], label: "Research", href: lang === "en" ? "teaching-en.html" : "teaching.html" },
      { keys: ["publications", "publication", "papers", "논문"], label: "Publications", href: lang === "en" ? "publications-en.html" : "publications.html" },
      { keys: ["research trends", "trend", "literature", "paper trend", "paper trends", "연구동향", "논문동향"], label: "Research Trends", href: paperTrendsHref(lang) },
      { keys: ["activities", "activity", "news", "활동"], label: "Activities", href: lang === "en" ? "news-en.html" : "news.html" },
      { keys: ["contact", "연락", "게시판"], label: "Contact", href: lang === "en" ? "contact-en.html" : "contact.html" }
    ];
  }

  function buildTopbar(copy, homeHref, scholarHref, contactHref, lang) {
    const topbar = document.createElement("header");
    const searchOptions = pageSearchItems(lang)
      .map((item) => `<option value="${item.label}"></option>`)
      .join("");

    topbar.className = "gh-topbar";
    topbar.innerHTML = `
      <div class="gh-topbar-inner">
        <div class="gh-topbar-brand">
          <a class="gh-topbar-mark" href="${homeHref}" aria-label="Open home"><span>NH</span></a>
          <div class="gh-topbar-path">
            <span class="gh-topbar-owner">nhkwon</span>
            <span class="gh-topbar-sep">/</span>
            <strong class="gh-topbar-repo">nhkwon.github.io</strong>
          </div>
        </div>
        <form class="gh-search-stub" data-gh-page-search role="search" aria-label="${copy.search}">
          <input class="gh-search-stub-text" type="search" name="pageSearch" list="gh-page-search-options" placeholder="${copy.search}" autocomplete="off">
          <datalist id="gh-page-search-options">${searchOptions}</datalist>
          <span class="gh-search-shortcut">/</span>
        </form>
        <div class="gh-topbar-tools">
          ${
            scholarHref
              ? `<a class="gh-topbar-link" href="${scholarHref}" target="_blank" rel="noreferrer">Google Scholar</a>`
              : ""
          }
          <a class="gh-topbar-link" href="${contactHref}">${copy.contact}</a>
        </div>
      </div>
    `;
    return topbar;
  }

  function paperTrendsHref(lang) {
    return lang === "en" ? "trends-en.html" : "trends.html";
  }

  function isPaperTrendsRoute(entry, lang) {
    const href = cleanText(entry?.href || "");
    const label = cleanText(entry?.label || "").toLowerCase();
    return href === paperTrendsHref(lang) || href.includes("#paper-trends") || /research trends|paper trend/.test(label);
  }

  function paperTrendsIcon() {
    return `
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19V5"></path>
        <path d="M4 19h16"></path>
        <path d="m7 15 3.5-3.5 3 3L19 9"></path>
      </svg>
    `;
  }

  function buildRepoNavEntries(navItems, copy, lang) {
    const entries = navItems.map((item) => ({
      href: item.getAttribute("href") || "#",
      active: item.classList.contains("is-active"),
      iconMarkup: item.querySelector(".icon")?.outerHTML || "",
      label: cleanText(item.querySelector("span")?.textContent || copy.overview)
    }));
    const trendsEntry = {
      href: paperTrendsHref(lang),
      active: (window.location.pathname.split("/").pop() || "") === paperTrendsHref(lang) || window.location.hash === "#paper-trends",
      iconMarkup: paperTrendsIcon(),
      label: "Research Trends"
    };

    if (!entries.some((entry) => isPaperTrendsRoute(entry, lang))) {
      const publicationsIndex = entries.findIndex((entry) => /publications/i.test(entry.href) || /publications/i.test(entry.label));
      const activitiesIndex = entries.findIndex((entry) => /news/i.test(entry.href) || /activities/i.test(entry.label));
      const insertIndex = publicationsIndex >= 0 ? publicationsIndex + 1 : activitiesIndex >= 0 ? activitiesIndex : entries.length;
      entries.splice(insertIndex, 0, trendsEntry);
    }

    if (trendsEntry.active) {
      entries.forEach((entry) => {
        entry.active = isPaperTrendsRoute(entry, lang);
      });
    }

    return entries;
  }

  function buildRepoHeader(copy, navItems, pageTitle, pageDescription, lang) {
    const header = document.createElement("section");
    const descriptionText = cleanText(pageDescription);
    const descriptionMarkup = descriptionText ? `<p class="gh-repo-page-description">${descriptionText}</p>` : "";
    const tabs = buildRepoNavEntries(navItems, copy, lang)
      .map((item) => {
        const active = item.active ? " is-active" : "";
        const iconMarkup = item.iconMarkup || "";
        const label = cleanText(item.label || copy.overview);
        const href = item.href || "#";
        return `<a class="gh-repo-tab${active}" href="${href}">${iconMarkup}<span>${label}</span></a>`;
      })
      .join("");

    header.className = "gh-repo-header";
    header.innerHTML = `
      <div class="gh-repo-heading">
        <div class="gh-repo-title-row">
          <div class="gh-repo-pathline">
            <a href="${navItems[0]?.getAttribute("href") || "ko.html"}">nhkwon</a>
            <span>/</span>
            <strong>nhkwon.github.io</strong>
            <span class="gh-visibility-badge">${copy.publicLabel}</span>
          </div>
          <div class="gh-repo-actions">
            <span class="gh-page-pill">${cleanText(pageTitle)}</span>
          </div>
        </div>
        <div class="gh-repo-copy">
          <h1 class="gh-repo-page-title">${cleanText(pageTitle)}</h1>
          ${descriptionMarkup}
        </div>
      </div>
      <nav class="gh-repo-tabs" aria-label="Page navigation">
        <div class="gh-repo-tab-list">${tabs}</div>
        <div class="gh-repo-tabs-update" aria-label="Latest update">
          <span class="gh-repo-tabs-update-label">Update</span>
          <strong class="gh-repo-tabs-update-value">${currentUpdateLabel()}</strong>
        </div>
      </nav>
    `;
    return header;
  }

  function buildHomeOverview(siteMain) {
    const heroPanel = siteMain.querySelector(".hero-panel");
    if (!heroPanel) return null;

    const kicker = cleanText(heroPanel.querySelector(".hero-kicker")?.textContent);
    const title = "Construction AI & Data Intelligence";
    const caption = cleanText(heroPanel.querySelector(".hero-caption")?.textContent);
    const buttons = heroPanel.querySelector(".button-row")?.innerHTML || "";
    const stats = heroPanel.querySelector(".hero-summary")?.innerHTML || "";

    const overview = document.createElement("section");
    overview.className = "gh-home-overview";
    overview.innerHTML = `
      <div class="gh-home-overview-layout">
        <div class="gh-home-overview-copy">
          <p class="gh-home-overview-kicker">${kicker}</p>
          <h2 class="gh-home-overview-title">${title} <span class="gh-home-overview-title-tag">with Codex and Vibe Coding</span></h2>
          <p class="gh-home-overview-caption">${caption}</p>
          <div class="button-row gh-home-overview-actions">${buttons}</div>
        </div>
      </div>
      <div class="summary-grid hero-summary gh-home-overview-stats">${stats}</div>
    `;
    return overview;
  }

  function applyGithubTheme() {
    const app = document.getElementById("app");
    const frame = app?.querySelector(".site-frame");
    if (!app || !frame || app.querySelector(".gh-theme-shell")) return;

    const copy = currentCopy();
    const lang = document.body.dataset.lang === "en" ? "en" : "ko";
    const sidebar = frame.querySelector(".site-sidebar");
    const siteMain = frame.querySelector(".site-main");
    const navItems = Array.from(sidebar?.querySelectorAll(".sidebar-nav .nav-item") || []);
    const activeNav = navItems.find((item) => item.classList.contains("is-active")) || navItems[0];
    const homeHref = navItems[0]?.getAttribute("href") || (lang === "en" ? "en.html" : "ko.html");
    const contactHref =
      navItems.find((item) => /contact/i.test(item.getAttribute("href") || ""))?.getAttribute("href") ||
      (lang === "en" ? "contact-en.html" : "contact.html");
    const scholarHref = document.querySelector('a[href*="scholar.google"]')?.getAttribute("href") || "";
    const pageTitle =
      cleanText(siteMain?.querySelector(".page-title")?.textContent) ||
      (document.body.dataset.page === "home" ? "Construction AI & Data Intelligence" : cleanText(siteMain?.querySelector(".hero-title")?.textContent)) ||
      cleanText(activeNav?.querySelector("span")?.textContent) ||
      "Construction AI & Data Intelligence";
    const pageDescription =
      document.body.dataset.page === "home"
        ? ""
        : cleanText(siteMain?.querySelector(".page-description")?.textContent) ||
          cleanText(siteMain?.querySelector(".hero-kicker")?.textContent) ||
          "Construction AI, smart maintenance, data science, and publication records.";

    document.body.classList.add("theme-github-mode");

    const shell = document.createElement("div");
    shell.className = "gh-theme-shell";
    shell.appendChild(buildTopbar(copy, homeHref, scholarHref, contactHref, lang));
    shell.appendChild(buildRepoHeader(copy, navItems, pageTitle, pageDescription, lang));
    app.insertBefore(shell, frame);

    const contentLayout = document.createElement("div");
    contentLayout.className = "gh-content-layout";
    const aboutPanel = document.createElement("aside");
    aboutPanel.className = "gh-about-panel";
    aboutPanel.innerHTML = sidebar?.innerHTML || "";
    shell.appendChild(contentLayout);
    contentLayout.appendChild(siteMain);
    contentLayout.appendChild(aboutPanel);
    frame.remove();

    siteMain?.querySelector(".page-lead")?.remove();
    if (document.body.dataset.page === "home") {
      const overview = buildHomeOverview(siteMain);
      const heroPanel = siteMain?.querySelector(".hero-panel");
      if (overview) siteMain.insertBefore(overview, siteMain.firstChild);
      heroPanel?.remove();
    }

    if (aboutPanel && !aboutPanel.querySelector(".gh-sidebar-heading")) {
      const aboutHeading = document.createElement("div");
      aboutHeading.className = "gh-sidebar-heading";
      aboutHeading.textContent = copy.about;
      aboutPanel.insertBefore(aboutHeading, aboutPanel.firstChild);
    }

    Array.from(aboutPanel?.querySelectorAll(":scope > .sidebar-label") || []).forEach((label) => label.remove());
    aboutPanel?.querySelector(".sidebar-nav")?.setAttribute("hidden", "hidden");

    const social = aboutPanel?.querySelector(".sidebar-social");
    if (social && !social.previousElementSibling?.classList.contains("gh-sidebar-section-title")) {
      const linksHeading = document.createElement("div");
      linksHeading.className = "gh-sidebar-section-title";
      linksHeading.textContent = copy.links;
      social.parentNode.insertBefore(linksHeading, social);
    }

    const languageSwitch = aboutPanel?.querySelector(".language-switch");
    if (languageSwitch && !languageSwitch.previousElementSibling?.classList.contains("gh-sidebar-section-title")) {
      const languageHeading = document.createElement("div");
      languageHeading.className = "gh-sidebar-section-title";
      languageHeading.textContent = copy.language;
      languageSwitch.parentNode.insertBefore(languageHeading, languageSwitch);
    }

    const sidebarAssistant = aboutPanel?.querySelector(".sidebar-ai-assistant");
    if (sidebarAssistant) {
      sidebarAssistant.classList.add("gh-sidebar-ai-assistant");
      contentLayout.appendChild(sidebarAssistant);
    }
  }

  function findPageSearchTarget(value, lang) {
    const query = cleanText(value).toLowerCase();
    if (!query) return "";

    const exactMatch = pageSearchItems(lang).find((item) => item.label.toLowerCase() === query);
    if (exactMatch) return exactMatch.href;

    const keyMatch = pageSearchItems(lang).find((item) =>
      item.keys.some((key) => key.toLowerCase().includes(query) || query.includes(key.toLowerCase()))
    );
    return keyMatch?.href || "";
  }

  function handleSearchSubmit(event) {
    const form = event.target.closest("[data-gh-page-search]");
    if (!form) return;

    event.preventDefault();
    const lang = document.body.dataset.lang === "en" ? "en" : "ko";
    const input = form.querySelector('input[name="pageSearch"]');
    const href = findPageSearchTarget(input?.value, lang);

    if (href) {
      window.location.href = href;
      return;
    }

    input?.focus();
    form.classList.add("is-invalid");
    window.setTimeout(() => form.classList.remove("is-invalid"), 900);
  }

  function handleSearchShortcut(event) {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;

    const active = document.activeElement;
    if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;

    const input = document.querySelector('.gh-search-stub input[name="pageSearch"]');
    if (!input) return;

    event.preventDefault();
    input.focus();
  }

  function boot() {
    applyGithubTheme();
    window.setTimeout(applyGithubTheme, 60);
    window.setTimeout(applyGithubTheme, 250);
    window.setTimeout(applyGithubTheme, 1000);
    window.requestAnimationFrame(applyGithubTheme);

    const app = document.getElementById("app");
    if (!app || app.querySelector(".gh-theme-shell")) {
      return;
    }

    const observer = new MutationObserver(() => {
      applyGithubTheme();
      if (app.querySelector(".gh-theme-shell")) {
        observer.disconnect();
      }
    });

    observer.observe(app, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  document.addEventListener("submit", handleSearchSubmit);
  document.addEventListener("keydown", handleSearchShortcut);
})();
