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
    publications: { ko: "논문", en: "Publications" },
    teaching: { ko: "교육", en: "Teaching" },
    news: { ko: "소식", en: "News" },
    contact: { ko: "연락처", en: "Contact" }
  };

  const HOME_SECTIONS = [
    { id: "about", label: SITE_DATA.about.section.title },
    { id: "research", label: SITE_DATA.research.section.title },
    { id: "outputs", label: SITE_DATA.outputs.section.title },
    { id: "teaching", label: SITE_DATA.teaching.section.title },
    { id: "news", label: SITE_DATA.news.section.title },
    { id: "contact", label: SITE_DATA.contact.section.title }
  ];

  document.title = `${profileName()} | ${text(PAGE_LABELS[page])}`;

  app.innerHTML = `
    <div class="site-shell">
      ${renderHeader()}
      <main class="site-main">
        ${renderMasthead()}
        ${page === "home" ? renderHomeJumpNav() : ""}
        ${renderPage()}
      </main>
      ${renderFooter()}
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

  function profileName() {
    return text(SITE_DATA.profile.nameDisplay || SITE_DATA.profile.name);
  }

  function route(name, routeLang) {
    return ROUTES[name][routeLang || lang];
  }

  function externalAttrs(url) {
    return url && !url.startsWith("mailto:") ? ' target="_blank" rel="noreferrer"' : "";
  }

  function renderHeader() {
    const navOrder = ["home", "bio", "publications", "teaching", "news", "contact"];

    return `
      <header class="site-header reveal">
        <div class="header-inner">
          <a class="brand" href="${route("home")}">
            <span class="brand-mark">${SITE_DATA.profile.initials}</span>
            <span class="brand-text">${profileName()}</span>
          </a>
          <nav class="site-nav" aria-label="Pages">
            ${navOrder
              .map(
                (item) =>
                  `<a class="nav-link ${page === item ? "is-active" : ""}" href="${route(item)}">${text(PAGE_LABELS[item])}</a>`
              )
              .join("")}
          </nav>
          <a class="lang-toggle" href="${route(page, otherLang)}">${otherLang.toUpperCase()}</a>
        </div>
      </header>
    `;
  }

  function renderMasthead() {
    const links = SITE_DATA.profile.links || [];

    return `
      <section class="masthead section-card reveal">
        <div class="masthead-primary">
          <div class="portrait-shell">
            <img class="profile-portrait" src="${SITE_DATA.profile.photo}" alt="${text(SITE_DATA.profile.photoAlt || SITE_DATA.profile.name)}">
          </div>
          <div class="profile-copy">
            <p class="section-kicker">${text(SITE_DATA.hero.eyebrow)}</p>
            <h1 class="profile-name">${profileName()}</h1>
            <p class="profile-role">${text(SITE_DATA.profile.title)}</p>
            <p class="profile-affiliation">${text(SITE_DATA.profile.affiliation)}</p>
            <div class="profile-meta">
              <span>${text(SITE_DATA.profile.location)}</span>
              <span>${text(SITE_DATA.profile.status)}</span>
            </div>
          </div>
        </div>
        <div class="masthead-secondary">
          <p class="masthead-lead">${text(SITE_DATA.hero.description)}</p>
          <div class="action-row">
            <a class="button button-primary" href="${route("publications")}">${text({
              ko: "전체 논문 목록",
              en: "Full publication list"
            })}</a>
            <a class="button button-secondary" href="${route("contact")}">${text({
              ko: "연구 문의",
              en: "Contact"
            })}</a>
          </div>
          <div class="profile-links">
            ${links
              .map((item) => `<a class="text-link" href="${item.url}"${externalAttrs(item.url)}>${item.label}</a>`)
              .join("")}
          </div>
        </div>
        <div class="masthead-stats">
          ${getPublicationSummaryCards()
            .map(
              (item) => `
                <article class="stat-card">
                  <p class="stat-label">${text(item.label)}</p>
                  <p class="stat-value">${item.value}</p>
                  <p class="stat-detail">${text(item.detail)}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderHomeJumpNav() {
    return `
      <nav class="jump-nav reveal" aria-label="Section navigation">
        ${HOME_SECTIONS.map(
          (item) => `<a class="jump-link" data-target="${item.id}" href="#${item.id}">${text(item.label)}</a>`
        ).join("")}
      </nav>
    `;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <div class="footer-inner">
          <p>${profileName()}</p>
          <p>${text({
            ko: "Clean academic-style GitHub Pages site",
            en: "Clean academic-style GitHub Pages site"
          })}</p>
        </div>
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
      <section id="about" class="section-card reveal">
        ${renderSectionHeader(SITE_DATA.about.section)}
        <div class="split-layout">
          <div class="body-copy">
            ${SITE_DATA.about.paragraphs.map((item) => `<p>${text(item)}</p>`).join("")}
            <div class="action-row">
              <a class="button button-secondary" href="${route("bio")}">${text({
                ko: "소개 자세히 보기",
                en: "Open biography"
              })}</a>
            </div>
          </div>
          <div class="simple-grid">
            ${SITE_DATA.about.highlights.map((item) => renderNoteCard(item)).join("")}
          </div>
        </div>
      </section>

      <section id="research" class="section-card reveal">
        ${renderSectionHeader(SITE_DATA.research.section)}
        <div class="topic-grid">
          ${SITE_DATA.research.areas.map((item) => renderTopicCard(item)).join("")}
        </div>
      </section>

      <section id="outputs" class="section-card reveal">
        ${renderSectionHeader(SITE_DATA.outputs.section)}
        ${renderPublicationDigest()}
      </section>

      <section id="teaching" class="section-card reveal">
        ${renderSectionHeader(SITE_DATA.teaching.section)}
        <div class="topic-grid">
          ${SITE_DATA.teaching.tracks.map((item) => renderTopicCard(item)).join("")}
        </div>
        <div class="compact-list">
          ${SITE_DATA.teaching.principles.map((item) => `<div class="list-note">${text(item)}</div>`).join("")}
        </div>
      </section>

      <section id="news" class="section-card reveal">
        ${renderSectionHeader(SITE_DATA.news.section)}
        <div class="news-grid">
          ${SITE_DATA.news.featured.map((item) => renderNewsCard(item)).join("")}
        </div>
      </section>

      <section id="contact" class="section-card reveal">
        ${renderSectionHeader(SITE_DATA.contact.section)}
        <div class="simple-grid">
          ${SITE_DATA.contact.cards.map((item) => renderContactCard(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderBioPage() {
    return `
      ${renderLeadSection(SITE_DATA.about.section)}
      <section class="section-card reveal">
        <div class="split-layout">
          <div class="body-copy">
            ${SITE_DATA.about.paragraphs.map((item) => `<p>${text(item)}</p>`).join("")}
          </div>
          <div class="simple-grid">
            ${SITE_DATA.about.principles.map((item) => renderNoteCard(item)).join("")}
          </div>
        </div>
      </section>
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "학력 및 경력", en: "Education and Career" },
          { ko: "Timeline", en: "Timeline" },
          { ko: "공개 프로필과 논문 실적을 기준으로 정리한 간단한 이력입니다.", en: "A compact timeline based on public profile and publication information." }
        )}
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
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "연구 키워드", en: "Research Keywords" },
          { ko: "Keywords", en: "Keywords" },
          { ko: "사이트 전체에서 공통으로 이어지는 키워드를 정리했습니다.", en: "Keywords that connect the overall research agenda." }
        )}
        <div class="tag-cloud">
          ${SITE_DATA.about.toolkit.map((item) => `<span class="chip">${item}</span>`).join("")}
        </div>
      </section>
    `;
  }

  function renderPublicationsPage() {
    return `
      ${renderLeadSection(SITE_DATA.outputs.section)}
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "연구 실적 개요", en: "Publication Summary" },
          { ko: "Summary", en: "Summary" },
          { ko: "홈페이지와 논문 실적을 함께 읽기 쉬운 구조로 정리했습니다.", en: "A structured summary of the current publication record." }
        )}
        ${renderPublicationOverview()}
      </section>
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "대표 논문", en: "Representative Papers" },
          { ko: "Selected Publications", en: "Selected Publications" },
          { ko: "인용 수와 대표성을 기준으로 주요 논문을 먼저 보여줍니다.", en: "Selected papers surfaced first using citation count and representativeness." }
        )}
        ${renderPublicationTeaserList(getFeaturedPublications())}
      </section>
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "전체 논문실적", en: "Complete Publication Record" },
          { ko: "Full List", en: "Full List" },
          { ko: "연도 기준으로 정렬했으며, DOI가 확인된 항목은 바로 연결됩니다.", en: "Sorted by year, with DOI links where they could be verified." }
        )}
        ${renderPublicationList(getPublicationsByYear())}
      </section>
    `;
  }

  function renderTeachingPage() {
    return `
      ${renderLeadSection(SITE_DATA.teaching.section)}
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "교육 및 연구지도", en: "Teaching and Mentoring" },
          { ko: "Teaching & Mentoring", en: "Teaching & Mentoring" },
          { ko: "과목 운영과 학생 지도를 함께 담을 수 있는 구조로 구성했습니다.", en: "A page structure for both courses and mentoring." }
        )}
        <div class="topic-grid">
          ${SITE_DATA.teaching.tracks.map((item) => renderTopicCard(item)).join("")}
        </div>
      </section>
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "지도 방식", en: "Mentoring Style" },
          { ko: "Mentoring", en: "Mentoring" },
          { ko: "연구 또는 프로젝트 협업을 시작할 때 기대하는 기준을 정리했습니다.", en: "How collaboration is usually structured for students and projects." }
        )}
        <div class="simple-grid">
          ${SITE_DATA.teaching.mentoring.map((item) => renderNoteCard(item)).join("")}
        </div>
        <div class="compact-list">
          ${SITE_DATA.teaching.principles.map((item) => `<div class="list-note">${text(item)}</div>`).join("")}
        </div>
      </section>
    `;
  }

  function renderNewsPage() {
    return `
      ${renderLeadSection(SITE_DATA.news.section)}
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "주요 업데이트", en: "Featured Updates" },
          { ko: "Featured", en: "Featured" },
          { ko: "최근 공개된 글과 사이트 업데이트를 중심으로 정리했습니다.", en: "Highlighted updates and public-facing posts." }
        )}
        <div class="news-grid">
          ${SITE_DATA.news.featured.map((item) => renderNewsCard(item)).join("")}
        </div>
      </section>
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "아카이브", en: "Archive" },
          { ko: "Archive", en: "Archive" },
          { ko: "짧은 로그 형태로 남기는 업데이트 기록입니다.", en: "Short-form archived updates." }
        )}
        <div class="timeline-list">
          ${SITE_DATA.news.archive
            .map(
              (item) => `
                <article class="timeline-item">
                  <p class="timeline-period">${item.date}</p>
                  <div><p>${text(item.body)}</p></div>
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
      ${renderLeadSection(SITE_DATA.contact.section)}
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "기본 연락 정보", en: "Basic Contact" },
          { ko: "Contact", en: "Contact" },
          { ko: "공개적으로 확인 가능한 채널과 홈페이지 내 연결을 함께 제공합니다.", en: "Publicly visible contact channels and profile links." }
        )}
        <div class="simple-grid">
          ${SITE_DATA.contact.cards.map((item) => renderContactCard(item)).join("")}
        </div>
      </section>
      <section class="section-card reveal">
        ${renderStaticSectionHeader(
          { ko: "문의 전 참고", en: "Before Reaching Out" },
          { ko: "Guidance", en: "Guidance" },
          { ko: "학생 문의나 공동연구 제안을 보낼 때 도움이 되는 간단한 안내입니다.", en: "A few notes that help when sending a student inquiry or research proposal." }
        )}
        <div class="compact-list">
          ${SITE_DATA.contact.checklist.map((item) => `<div class="list-note">${text(item)}</div>`).join("")}
        </div>
      </section>
    `;
  }

  function renderLeadSection(section) {
    return `
      <section class="section-card section-lead reveal">
        ${renderSectionHeader(section)}
      </section>
    `;
  }

  function renderSectionHeader(section) {
    return renderStaticSectionHeader(section.title, section.eyebrow, section.description);
  }

  function renderStaticSectionHeader(title, eyebrow, description) {
    const alternate = lang === "ko" && typeof title === "object" && title.en ? title.en : "";

    return `
      <header class="section-header">
        <p class="section-kicker">${text(eyebrow)}</p>
        <h2 class="section-title">${text(title)}</h2>
        ${alternate ? `<p class="section-alt">${alternate}</p>` : ""}
        ${description ? `<p class="section-description">${text(description)}</p>` : ""}
      </header>
    `;
  }

  function renderNoteCard(item) {
    return `
      <article class="note-card">
        <h3>${text(item.title)}</h3>
        <p>${text(item.body)}</p>
      </article>
    `;
  }

  function renderTopicCard(item) {
    return `
      <article class="topic-card">
        <div class="topic-top">
          <h3>${text(item.title)}</h3>
          ${item.tags ? `<div class="chip-row">${item.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>` : ""}
        </div>
        <p>${text(item.body)}</p>
      </article>
    `;
  }

  function renderNewsCard(item) {
    return `
      <article class="news-card">
        <p class="meta-line">${item.date}</p>
        <h3>${text(item.title)}</h3>
        <p>${text(item.body)}</p>
        <a class="text-link" href="${item.href}"${item.external ? ' target="_blank" rel="noreferrer"' : ""}>${text(item.linkLabel)}</a>
      </article>
    `;
  }

  function renderContactCard(item) {
    return `
      <article class="note-card">
        <h3>${text(item.title)}</h3>
        <p>${text(item.body)}</p>
        <a class="text-link" href="${item.action.href}"${externalAttrs(item.action.href)}>${text(item.action.label)}</a>
      </article>
    `;
  }

  function renderPublicationDigest() {
    const summary = getPublicationSummary();

    return `
      <div class="publication-digest">
        <article class="summary-card">
          <p class="section-kicker">${text({
            ko: "Selected Publications",
            en: "Selected Publications"
          })}</p>
          <h3>${text({
            ko: "논문 실적이 홈페이지에 반영되었습니다",
            en: "The publication record is reflected on the site"
          })}</h3>
          <p>${text({
            ko: `총 ${summary.count}건의 학술 실적과 확인 가능한 인용 ${summary.totalCitations}회를 기준으로 정리했습니다. 논문 페이지에서 전체 목록과 DOI 링크를 확인할 수 있습니다.`,
            en: `The site currently reflects ${summary.count} scholarly records and ${summary.totalCitations} known citations from the provided list. The publications page includes the full record and DOI links where available.`
          })}</p>
          <div class="action-row">
            <a class="button button-secondary" href="${route("publications")}">${text({
              ko: "전체 논문실적",
              en: "Full publication record"
            })}</a>
            <a class="button button-tertiary" href="${scholarSearchUrl(typeof SITE_DATA.profile.name === "string" ? SITE_DATA.profile.name : profileName())}" target="_blank" rel="noreferrer">${text({
              ko: "Google Scholar 검색",
              en: "Search Google Scholar"
            })}</a>
          </div>
        </article>
        ${renderPublicationTeaserList(getFeaturedPublications().slice(0, 5))}
      </div>
    `;
  }

  function renderPublicationOverview() {
    return `
      <div class="stats-grid">
        ${getPublicationSummaryCards()
          .map(
            (item) => `
              <article class="stat-card">
                <p class="stat-label">${text(item.label)}</p>
                <p class="stat-value">${item.value}</p>
                <p class="stat-detail">${text(item.detail)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderPublicationTeaserList(publications) {
    return `
      <div class="publication-teaser-list">
        ${publications.map((item) => renderPublicationTeaser(item)).join("")}
      </div>
    `;
  }

  function renderPublicationTeaser(item) {
    const href = page === "publications" ? `#${item.id}` : `${route("publications")}#${item.id}`;

    return `
      <article class="publication-teaser">
        <h3><a href="${href}">${item.title}</a></h3>
        <p>${item.authors}</p>
        <p class="meta-line">${item.venue}</p>
      </article>
    `;
  }

  function renderPublicationList(publications) {
    const groups = publications.reduce((acc, item) => {
      const key = item.year || "-";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);
      return acc;
    }, {});

    return `
      <div class="year-group-list">
        ${Object.keys(groups)
          .sort((a, b) => Number(b) - Number(a))
          .map(
            (year) => `
              <section class="year-group">
                <div class="year-heading">
                  <h3>${year}</h3>
                  <p>${groups[year].length} ${text({ ko: "건", en: "items" })}</p>
                </div>
                <div class="publication-list">
                  ${groups[year].map((item) => renderPublicationItem(item)).join("")}
                </div>
              </section>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderPublicationItem(item) {
    const citationText =
      typeof item.citations === "number"
        ? `${item.citations} ${text({ ko: "회 인용", en: "citations" })}`
        : "";

    return `
      <article class="publication-item" id="${item.id}">
        <div class="publication-meta">
          <span class="meta-chip">${publicationTypeLabel(item.type)}</span>
          <span class="meta-chip">${item.year}</span>
          ${citationText ? `<span class="meta-chip">${citationText}</span>` : ""}
        </div>
        <h3>${item.title}</h3>
        <p class="publication-authors">${item.authors}</p>
        <p class="publication-venue">${item.venue}</p>
        <div class="publication-links">
          <a class="text-link" href="${scholarSearchUrl(item.title)}" target="_blank" rel="noreferrer">Google Scholar</a>
          ${item.doi ? `<a class="text-link" href="https://doi.org/${item.doi}" target="_blank" rel="noreferrer">DOI</a>` : ""}
        </div>
      </article>
    `;
  }

  function getPublicationSummary() {
    const publications = getNormalizedPublications();
    const years = publications.map((item) => item.year).filter(Number.isFinite);
    const totalCitations = publications.reduce(
      (sum, item) => sum + (typeof item.citations === "number" ? item.citations : 0),
      0
    );
    const topCited = publications.reduce(
      (max, item) => Math.max(max, typeof item.citations === "number" ? item.citations : 0),
      0
    );

    return {
      count: publications.length,
      totalCitations,
      topCited,
      span: years.length ? `${Math.min(...years)} - ${Math.max(...years)}` : "-"
    };
  }

  function getPublicationSummaryCards() {
    const summary = getPublicationSummary();

    return [
      {
        label: {
          ko: "등재 실적",
          en: "Listed works"
        },
        value: `${summary.count}`,
        detail: {
          ko: "저널, 학술대회, 학위논문 포함",
          en: "Including journals, conferences, and thesis work"
        }
      },
      {
        label: {
          ko: "확인 가능한 인용",
          en: "Known citations"
        },
        value: `${summary.totalCitations}`,
        detail: {
          ko: "제공된 목록에 포함된 인용 수 합계",
          en: "Sum of citation counts included in the provided record"
        }
      },
      {
        label: {
          ko: "연도 범위",
          en: "Year span"
        },
        value: summary.span,
        detail: {
          ko: `최다 인용 논문 ${summary.topCited}회`,
          en: `Top-cited paper at ${summary.topCited} citations`
        }
      }
    ];
  }

  function getNormalizedPublications() {
    return (SITE_DATA.outputs.publications || []).map((item, index) => ({
      ...item,
      id: item.id || `publication-${index + 1}`
    }));
  }

  function getPublicationsByYear() {
    return getNormalizedPublications()
      .slice()
      .sort((a, b) => {
        if ((b.year || 0) !== (a.year || 0)) {
          return (b.year || 0) - (a.year || 0);
        }

        const aCitations = typeof a.citations === "number" ? a.citations : -1;
        const bCitations = typeof b.citations === "number" ? b.citations : -1;

        if (bCitations !== aCitations) {
          return bCitations - aCitations;
        }

        return a.title.localeCompare(b.title);
      });
  }

  function getFeaturedPublications() {
    return getNormalizedPublications()
      .slice()
      .sort((a, b) => {
        const aCitations = typeof a.citations === "number" ? a.citations : -1;
        const bCitations = typeof b.citations === "number" ? b.citations : -1;

        if (bCitations !== aCitations) {
          return bCitations - aCitations;
        }

        return (b.year || 0) - (a.year || 0);
      })
      .slice(0, 6);
  }

  function scholarSearchUrl(query) {
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
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
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function enableScrollSpy() {
    if (page !== "home" || !("IntersectionObserver" in window)) {
      return;
    }

    const sections = HOME_SECTIONS.map((item) => document.getElementById(item.id)).filter(Boolean);
    const links = Array.from(document.querySelectorAll(".jump-link"));

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
        threshold: [0.3, 0.6],
        rootMargin: "-20% 0px -55% 0px"
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
