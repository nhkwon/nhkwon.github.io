(function () {
  const app = document.getElementById("app");

  if (!app || typeof SITE_DATA === "undefined") {
    return;
  }

  const page = document.body.dataset.page || "home";
  const lang = document.body.dataset.lang || "ko";
  const otherLang = lang === "ko" ? "en" : "ko";

  const ROUTES = {
    home: { ko: "ko.html", en: "en.html" },
    bio: { ko: "bio.html", en: "bio-en.html" },
    publications: { ko: "publications.html", en: "publications-en.html" },
    teaching: { ko: "teaching.html", en: "teaching-en.html" },
    news: { ko: "news.html", en: "news-en.html" },
    contact: { ko: "contact.html", en: "contact-en.html" }
  };

  const PAGE_LABELS = {
    home: { ko: "홈", en: "Home" },
    bio: { ko: "소개", en: "Biography" },
    publications: { ko: "아웃풋", en: "Outputs" },
    teaching: { ko: "학습", en: "Learning" },
    news: { ko: "소식", en: "News" },
    contact: { ko: "연락", en: "Contact" }
  };

  const QUICK_LINKS = [
    { id: "about", label: SITE_DATA.about.section.title },
    { id: "research", label: SITE_DATA.research.section.title },
    { id: "outputs", label: SITE_DATA.outputs.section.title },
    { id: "teaching", label: SITE_DATA.teaching.section.title },
    { id: "news", label: SITE_DATA.news.section.title },
    { id: "contact", label: SITE_DATA.contact.section.title }
  ];

  document.title = `${SITE_DATA.profile.name} | ${text(PAGE_LABELS[page])}`;

  app.innerHTML = `
    <div class="site-shell">
      ${renderSidebar()}
      <div class="content-shell">
        ${renderTopbar()}
        <main class="main-content">
          ${renderPage()}
        </main>
        ${renderFooter()}
      </div>
    </div>
  `;

  revealOnScroll();
  enableScrollSpy();

  function text(value) {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "object") {
      return value[lang] || value.ko || value.en || "";
    }

    return String(value);
  }

  function route(name, routeLang) {
    return ROUTES[name][routeLang || lang];
  }

  function linkTarget(item) {
    return item && item.external ? ' target="_blank" rel="noreferrer"' : "";
  }

  function buttonLink(item) {
    if (item.page) {
      return route(item.page);
    }

    return item.href || "#";
  }

  function renderSidebar() {
    return `
      <aside class="sidebar">
        <section class="glass-card profile-card reveal">
          <div class="profile-accent"></div>
          <div class="monogram">${SITE_DATA.profile.initials}</div>
          <p class="eyebrow">${text(SITE_DATA.hero.eyebrow)}</p>
          <h1 class="sidebar-title">${SITE_DATA.profile.name}</h1>
          <p class="sidebar-subtitle">${text(SITE_DATA.profile.title)}</p>
          <p class="sidebar-description">${text(SITE_DATA.profile.affiliation)}</p>
          <div class="meta-stack">
            <span>${text(SITE_DATA.profile.location)}</span>
            <span>${text(SITE_DATA.profile.status)}</span>
          </div>
          <div class="social-strip">
            ${SITE_DATA.profile.links
              .map(
                (item) =>
                  `<a class="social-link" href="${item.url}"${item.url.startsWith("mailto:") ? "" : ' target="_blank" rel="noreferrer"'}>${item.label}</a>`
              )
              .join("")}
          </div>
          <div class="cta-row compact">
            <a class="button button-primary" href="${route("contact")}">${text({
              ko: "연락 페이지",
              en: "Contact page"
            })}</a>
            <a class="button button-secondary" href="${route("publications")}">${text({
              ko: "아웃풋 보기",
              en: "See outputs"
            })}</a>
          </div>
        </section>
        <nav class="glass-card quick-nav reveal" aria-label="Quick navigation">
          <p class="quick-nav-title">${text({
            ko: "빠른 이동",
            en: "Quick jump"
          })}</p>
          ${QUICK_LINKS.map(
            (item) =>
              `<a class="quick-link" data-target="${item.id}" href="${route("home")}#${item.id}">${text(item.label)}</a>`
          ).join("")}
        </nav>
      </aside>
    `;
  }

  function renderTopbar() {
    const navOrder = ["home", "bio", "publications", "teaching", "news", "contact"];

    return `
      <header class="glass-card topbar">
        <a class="wordmark" href="${route("home")}">${SITE_DATA.profile.name}</a>
        <nav class="page-nav" aria-label="Pages">
          ${navOrder
            .map(
              (item) =>
                `<a class="page-link ${page === item ? "is-active" : ""}" href="${route(item)}">${text(PAGE_LABELS[item])}</a>`
            )
            .join("")}
        </nav>
        <a class="lang-switch" href="${route(page, otherLang)}">${otherLang.toUpperCase()}</a>
      </header>
    `;
  }

  function renderFooter() {
    return `
      <footer class="glass-card site-footer">
        <p>${SITE_DATA.profile.name}</p>
        <p>${text({
          ko: "GitHub Pages용 정적 HTML/CSS/JS 사이트",
          en: "Static HTML/CSS/JS site for GitHub Pages"
        })}</p>
      </footer>
    `;
  }

  function renderPage() {
    switch (page) {
      case "bio":
        return renderBioPage();
      case "publications":
        return renderPublicationsPage();
      case "teaching":
        return renderTeachingPage();
      case "news":
        return renderNewsPage();
      case "contact":
        return renderContactPage();
      case "home":
      default:
        return renderHomePage();
    }
  }

  function renderHomePage() {
    return `
      <section class="glass-card hero reveal">
        <div class="hero-copy">
          <p class="eyebrow">${text(SITE_DATA.hero.eyebrow)}</p>
          <h2 class="display-title">${text(SITE_DATA.hero.headline)}</h2>
          <p class="hero-description">${text(SITE_DATA.hero.description)}</p>
          <div class="cta-row">
            ${SITE_DATA.hero.buttons
              .map(
                (item) =>
                  `<a class="button ${
                    item.kind === "primary" ? "button-primary" : "button-secondary"
                  }" href="${buttonLink(item)}">${text(item.label)}</a>`
              )
              .join("")}
          </div>
          <div class="pill-row">
            ${SITE_DATA.hero.badges.map((badge) => `<span class="pill">${badge}</span>`).join("")}
          </div>
        </div>
        <div class="hero-panel">
          <p class="eyebrow">${text(SITE_DATA.hero.panelTitle)}</p>
          <div class="stat-stack">
            ${SITE_DATA.stats
              .map(
                (item) => `
                  <article class="mini-card">
                    <p class="mini-label">${text(item.label)}</p>
                    <p class="mini-value">${text(item.value)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>

      <section id="about" class="glass-card section-panel reveal">
        ${renderSectionHeader(SITE_DATA.about.section)}
        <div class="two-column">
          <div class="stack">
            <div class="copy-block">
              ${SITE_DATA.about.paragraphs.map((item) => `<p>${text(item)}</p>`).join("")}
            </div>
            <div class="cta-row">
              <a class="button button-primary" href="${route("bio")}">${text({
                ko: "상세 소개",
                en: "Full biography"
              })}</a>
            </div>
          </div>
          <div class="stack">
            ${SITE_DATA.about.highlights
              .map(
                (item) => `
                  <article class="info-card">
                    <h3>${text(item.title)}</h3>
                    <p>${text(item.body)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>

      <section id="research" class="glass-card section-panel reveal">
        ${renderSectionHeader(SITE_DATA.research.section)}
        <div class="card-grid card-grid-4">
          ${SITE_DATA.research.areas.map((item) => renderTopicCard(item)).join("")}
        </div>
        <div class="workflow-row">
          ${SITE_DATA.research.workflow
            .map(
              (item) => `
                <article class="workflow-card">
                  <h3>${text(item.title)}</h3>
                  <p>${text(item.body)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section id="outputs" class="glass-card section-panel reveal">
        ${renderSectionHeader(SITE_DATA.outputs.section)}
        ${renderPublicationOverview()}
        <div class="card-grid card-grid-3">
          ${SITE_DATA.outputs.featured.map((item) => renderOutputCard(item)).join("")}
        </div>
        <div class="cta-row">
          <a class="button button-secondary" href="${route("publications")}">${text({
            ko: "전체 논문실적 보기",
            en: "Open full publication list"
          })}</a>
        </div>
      </section>

      <section id="teaching" class="glass-card section-panel reveal">
        ${renderSectionHeader(SITE_DATA.teaching.section)}
        <div class="card-grid card-grid-3">
          ${SITE_DATA.teaching.tracks.map((item) => renderTopicCard(item)).join("")}
        </div>
        <div class="principle-list">
          ${SITE_DATA.teaching.principles.map((item) => `<div class="bullet-card">${text(item)}</div>`).join("")}
        </div>
        <div class="cta-row">
          <a class="button button-secondary" href="${route("teaching")}">${text({
            ko: "학습/멘토링 자세히 보기",
            en: "Open learning page"
          })}</a>
        </div>
      </section>

      <section id="news" class="glass-card section-panel reveal">
        ${renderSectionHeader(SITE_DATA.news.section)}
        <div class="card-grid card-grid-3">
          ${SITE_DATA.news.featured.map((item) => renderNewsCard(item)).join("")}
        </div>
      </section>

      <section id="contact" class="glass-card section-panel reveal">
        ${renderSectionHeader(SITE_DATA.contact.section)}
        <div class="card-grid card-grid-3">
          ${SITE_DATA.contact.cards.map((item) => renderContactCard(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderBioPage() {
    return `
      ${renderPageHero(
        text(SITE_DATA.about.section.eyebrow),
        text(SITE_DATA.about.section.title),
        text(SITE_DATA.about.section.description)
      )}
      <section class="glass-card section-panel reveal">
        <div class="two-column">
          <div class="copy-block">
            ${SITE_DATA.about.paragraphs.map((item) => `<p>${text(item)}</p>`).join("")}
          </div>
          <div class="stack">
            ${SITE_DATA.about.principles
              .map(
                (item) => `
                  <article class="info-card">
                    <h3>${text(item.title)}</h3>
                    <p>${text(item.body)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Timeline",
            en: "Timeline"
          })}</p>
          <h2>${text({
            ko: "짧은 흐름",
            en: "Compact timeline"
          })}</h2>
        </div>
        <div class="timeline-list">
          ${SITE_DATA.about.timeline
            .map(
              (item) => `
                <article class="timeline-item">
                  <p class="timeline-period">${text(item.period)}</p>
                  <div>
                    <h3>${text(item.title)}</h3>
                    <p>${text(item.body)}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Toolkit",
            en: "Toolkit"
          })}</p>
          <h2>${text({
            ko: "자주 쓰는 작업 언어",
            en: "Working vocabulary"
          })}</h2>
          <p>${text({
            ko: "이 사이트는 기술 영역을 태그와 키워드 중심으로 빠르게 읽히게 설계했습니다.",
            en: "The site is designed so visitors can understand the technical space quickly through tags and keywords."
          })}</p>
        </div>
        <div class="pill-row">
          ${SITE_DATA.about.toolkit.map((item) => `<span class="pill">${item}</span>`).join("")}
        </div>
      </section>
    `;
  }

  function renderPublicationsPage() {
    return `
      ${renderPageHero(
        text(SITE_DATA.outputs.section.eyebrow),
        text(SITE_DATA.outputs.section.title),
        text(SITE_DATA.outputs.section.description)
      )}
      <section class="glass-card section-panel reveal">
        ${renderPublicationOverview()}
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Selected publications",
            en: "Selected publications"
          })}</p>
          <h2>${text({
            ko: "대표 논문",
            en: "Representative papers"
          })}</h2>
        </div>
        <div class="card-grid card-grid-3">
          ${SITE_DATA.outputs.featured.map((item) => renderOutputCard(item)).join("")}
        </div>
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Full list",
            en: "Full list"
          })}</p>
          <h2>${text({
            ko: "전체 논문실적",
            en: "Complete publication record"
          })}</h2>
          <p>${text({
            ko: "아래 목록은 전달해주신 논문 및 학술 실적을 기준으로 정리했습니다.",
            en: "The list below is based on the publication record you provided."
          })}</p>
        </div>
        ${renderPublicationList()}
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Research themes",
            en: "Research themes"
          })}</p>
          <h2>${text({
            ko: "핵심 키워드",
            en: "Core themes"
          })}</h2>
        </div>
        <div class="workflow-row">
          ${SITE_DATA.outputs.process
            .map(
              (item) => `
                <article class="workflow-card">
                  <h3>${text(item.title)}</h3>
                  <p>${text(item.body)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderTeachingPage() {
    return `
      ${renderPageHero(
        text(SITE_DATA.teaching.section.eyebrow),
        text(SITE_DATA.teaching.section.title),
        text(SITE_DATA.teaching.section.description)
      )}
      <section class="glass-card section-panel reveal">
        <div class="card-grid card-grid-3">
          ${SITE_DATA.teaching.tracks.map((item) => renderTopicCard(item)).join("")}
        </div>
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Mentoring",
            en: "Mentoring"
          })}</p>
          <h2>${text({
            ko: "함께 일하는 방식",
            en: "How we work together"
          })}</h2>
        </div>
        <div class="card-grid card-grid-3">
          ${SITE_DATA.teaching.mentoring
            .map(
              (item) => `
                <article class="info-card">
                  <h3>${text(item.title)}</h3>
                  <p>${text(item.body)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Principles",
            en: "Principles"
          })}</p>
          <h2>${text({
            ko: "운영 원칙",
            en: "Operating principles"
          })}</h2>
        </div>
        <div class="principle-list">
          ${SITE_DATA.teaching.principles.map((item) => `<div class="bullet-card">${text(item)}</div>`).join("")}
        </div>
      </section>
    `;
  }

  function renderNewsPage() {
    return `
      ${renderPageHero(
        text(SITE_DATA.news.section.eyebrow),
        text(SITE_DATA.news.section.title),
        text(SITE_DATA.news.section.description)
      )}
      <section class="glass-card section-panel reveal">
        <div class="card-grid card-grid-3">
          ${SITE_DATA.news.featured.map((item) => renderNewsCard(item)).join("")}
        </div>
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Archive",
            en: "Archive"
          })}</p>
          <h2>${text({
            ko: "짧은 로그",
            en: "Short archive"
          })}</h2>
        </div>
        <div class="timeline-list compact-timeline">
          ${SITE_DATA.news.archive
            .map(
              (item) => `
                <article class="timeline-item">
                  <p class="timeline-period">${item.date}</p>
                  <div>
                    <p>${text(item.body)}</p>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderContactPage() {
    return `
      ${renderPageHero(
        text(SITE_DATA.contact.section.eyebrow),
        text(SITE_DATA.contact.section.title),
        text(SITE_DATA.contact.section.description)
      )}
      <section class="glass-card section-panel reveal">
        <div class="card-grid card-grid-3">
          ${SITE_DATA.contact.cards.map((item) => renderContactCard(item)).join("")}
        </div>
      </section>
      <section class="glass-card section-panel reveal">
        <div class="section-heading">
          <p class="eyebrow">${text({
            ko: "Before reaching out",
            en: "Before reaching out"
          })}</p>
          <h2>${text({
            ko: "연락 전에 함께 적어두면 좋은 것",
            en: "What helps before you reach out"
          })}</h2>
        </div>
        <div class="principle-list">
          ${SITE_DATA.contact.checklist.map((item) => `<div class="bullet-card">${text(item)}</div>`).join("")}
        </div>
      </section>
    `;
  }

  function renderPageHero(eyebrow, title, description) {
    return `
      <section class="glass-card page-hero reveal">
        <div class="stack">
          <p class="eyebrow">${eyebrow}</p>
          <h2 class="page-title">${title}</h2>
          <p class="page-description">${description}</p>
        </div>
        <div class="cta-row">
          <a class="button button-secondary" href="${route("home")}">${text({
            ko: "메인으로",
            en: "Back home"
          })}</a>
          <a class="button button-primary" href="${route("contact")}">${text({
            ko: "연락하기",
            en: "Get in touch"
          })}</a>
        </div>
      </section>
    `;
  }

  function renderSectionHeader(section) {
    return `
      <div class="section-heading">
        <p class="eyebrow">${text(section.eyebrow)}</p>
        <h2>${text(section.title)}</h2>
        <p>${text(section.description)}</p>
      </div>
    `;
  }

  function renderTopicCard(item) {
    return `
      <article class="info-card">
        <h3>${text(item.title)}</h3>
        <p>${text(item.body)}</p>
        ${item.tags ? `<div class="tag-row">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>` : ""}
      </article>
    `;
  }

  function renderOutputCard(item) {
    const href = item.page ? `${route(item.page)}${item.anchor || ""}` : item.href;
    const tags = item.tags || [];

    return `
      <article class="info-card output-card">
        <div class="meta-row">
          <span class="badge">${text(item.type)}</span>
          <span class="date-text">${item.date}</span>
        </div>
        <h3>${text(item.title)}</h3>
        <p class="meta-text">${text(item.meta)}</p>
        <p>${text(item.description)}</p>
        ${tags.length ? `<div class="tag-row">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>` : ""}
        ${href ? `<a class="inline-link" href="${href}"${linkTarget(item)}>${text(item.linkLabel)}</a>` : ""}
      </article>
    `;
  }

  function renderPublicationOverview() {
    const stats = getPublicationStats();

    if (!stats.length) {
      return "";
    }

    return `
      <div class="card-grid card-grid-3 publication-overview">
        ${stats
          .map(
            (item) => `
              <article class="mini-card publication-stat">
                <p class="mini-label">${text(item.label)}</p>
                <p class="publication-stat-value">${item.value}</p>
                <p class="mini-value">${text(item.detail)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderPublicationList() {
    const publications = getSortedPublications();

    if (!publications.length) {
      return "";
    }

    return `
      <div class="publication-list">
        ${publications.map((item, index) => renderPublicationItem(item, index)).join("")}
      </div>
    `;
  }

  function renderPublicationItem(item, index) {
    const entryId = item.id || `publication-${index + 1}`;
    const citationText =
      typeof item.citations === "number"
        ? `${item.citations} ${text({ ko: "회 인용", en: "citations" })}`
        : "";
    const scholarUrl = scholarSearchUrl(item.title);
    const doiUrl = item.doi ? `https://doi.org/${item.doi}` : "";

    return `
      <article class="info-card publication-item" id="${entryId}">
        <div class="publication-head">
          <div class="publication-badges">
            <span class="badge">${publicationTypeLabel(item.type)}</span>
            <span class="tag">${item.year}</span>
            ${citationText ? `<span class="tag citation-tag">${citationText}</span>` : ""}
          </div>
        </div>
        <h3 class="publication-title">${item.title}</h3>
        <p class="publication-authors">${item.authors}</p>
        <p class="publication-venue">${item.venue}</p>
        <div class="publication-links">
          <a class="inline-link" href="${scholarUrl}" target="_blank" rel="noreferrer">${text({
            ko: "Google Scholar",
            en: "Google Scholar"
          })}</a>
          ${
            doiUrl
              ? `<a class="inline-link" href="${doiUrl}" target="_blank" rel="noreferrer">DOI</a>`
              : ""
          }
        </div>
      </article>
    `;
  }

  function getPublicationStats() {
    const publications = SITE_DATA.outputs.publications || [];

    if (!publications.length) {
      return [];
    }

    const years = publications.map((item) => Number(item.year)).filter(Number.isFinite);
    const citations = publications.map((item) => Number(item.citations)).filter(Number.isFinite);
    const minYear = years.length ? Math.min(...years) : "";
    const maxYear = years.length ? Math.max(...years) : "";
    const maxCitations = citations.length ? Math.max(...citations) : 0;

    return [
      {
        label: {
          ko: "등재 항목",
          en: "Listed items"
        },
        value: `${publications.length}`,
        detail: {
          ko: "저널, 학술대회, 학위논문 포함",
          en: "Including journals, conferences, and thesis work"
        }
      },
      {
        label: {
          ko: "연도 범위",
          en: "Year span"
        },
        value: `${minYear} - ${maxYear}`,
        detail: {
          ko: "현재 반영된 실적 기준",
          en: "Across the records currently listed"
        }
      },
      {
        label: {
          ko: "최다 인용",
          en: "Top cited"
        },
        value: `${maxCitations}`,
        detail: {
          ko: "현재 목록 기준 최대 인용 수",
          en: "Highest citation count among the listed entries"
        }
      }
    ];
  }

  function getSortedPublications() {
    return (SITE_DATA.outputs.publications || [])
      .slice()
      .sort((a, b) => {
        const aCitations = typeof a.citations === "number" ? a.citations : -1;
        const bCitations = typeof b.citations === "number" ? b.citations : -1;

        if (bCitations !== aCitations) {
          return bCitations - aCitations;
        }

        return (b.year || 0) - (a.year || 0);
      });
  }

  function scholarSearchUrl(title) {
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
  }

  function publicationTypeLabel(type) {
    const labels = {
      journal: { ko: "저널", en: "Journal" },
      conference: { ko: "학술대회", en: "Conference" },
      thesis: { ko: "학위논문", en: "Thesis" }
    };

    if (typeof type === "string" && labels[type.toLowerCase()]) {
      return text(labels[type.toLowerCase()]);
    }

    return text(type);
  }

  function renderNewsCard(item) {
    return `
      <article class="info-card">
        <p class="date-text">${item.date}</p>
        <h3>${text(item.title)}</h3>
        <p>${text(item.body)}</p>
        <a class="inline-link" href="${item.href}"${linkTarget(item)}>${text(item.linkLabel)}</a>
      </article>
    `;
  }

  function renderContactCard(item) {
    return `
      <article class="info-card">
        <h3>${text(item.title)}</h3>
        <p>${text(item.body)}</p>
        <a class="inline-link" href="${item.action.href}"${item.action.href.startsWith("mailto:") ? "" : ' target="_blank" rel="noreferrer"'}>${text(
          item.action.label
        )}</a>
      </article>
    `;
  }

  function revealOnScroll() {
    const items = Array.from(document.querySelectorAll(".reveal"));

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function enableScrollSpy() {
    if (page !== "home" || !("IntersectionObserver" in window)) {
      return;
    }

    const sections = QUICK_LINKS.map((item) => document.getElementById(item.id)).filter(Boolean);
    const links = Array.from(document.querySelectorAll(".quick-link"));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const currentId = visible.target.id;
        links.forEach((link) => link.classList.toggle("is-active", link.dataset.target === currentId));
      },
      {
        threshold: [0.3, 0.6, 0.9],
        rootMargin: "-20% 0px -45% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
