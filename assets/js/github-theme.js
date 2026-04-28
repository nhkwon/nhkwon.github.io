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

  function buildTopbar(copy, homeHref, scholarHref, contactHref) {
    const topbar = document.createElement("header");
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
        <button class="gh-search-stub" type="button" aria-label="${copy.search}">
          <span class="gh-search-stub-text">${copy.search}</span>
          <span class="gh-search-shortcut">/</span>
        </button>
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

  function buildRepoHeader(copy, navItems, pageTitle, pageDescription) {
    const header = document.createElement("section");
    const descriptionText = cleanText(pageDescription);
    const descriptionMarkup = descriptionText ? `<p class="gh-repo-page-description">${descriptionText}</p>` : "";
    const tabs = navItems
      .map((item) => {
        const href = item.getAttribute("href") || "#";
        const active = item.classList.contains("is-active") ? " is-active" : "";
        const iconMarkup = item.querySelector(".icon")?.outerHTML || "";
        const label = cleanText(item.querySelector("span")?.textContent || copy.overview);
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
    shell.appendChild(buildTopbar(copy, homeHref, scholarHref, contactHref));
    shell.appendChild(buildRepoHeader(copy, navItems, pageTitle, pageDescription));
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
  }

  function boot() {
    applyGithubTheme();
    window.setTimeout(applyGithubTheme, 60);
    window.requestAnimationFrame(applyGithubTheme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
