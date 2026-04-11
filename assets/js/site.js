(function () {
  const app = document.getElementById("app");

  if (!app || typeof SITE_DATA === "undefined") {
    return;
  }

  const page = document.body.dataset.page || "home";
  const lang = document.body.dataset.lang === "en" ? "en" : "ko";

  const ROUTES = {
    home: { ko: "ko.html", en: "en.html" },
    bio: { ko: "bio.html", en: "bio-en.html" },
    teaching: { ko: "teaching.html", en: "teaching-en.html" },
    publications: { ko: "publications.html", en: "publications-en.html" },
    news: { ko: "news.html", en: "news-en.html" },
    contact: { ko: "contact.html", en: "contact-en.html" }
  };

  const PAGE_META = {
    home: {
      icon: "home",
      label: { ko: "Home", en: "Home" },
      subtitle: { ko: "Overview", en: "Overview" },
      description: {
        ko: "권나현 연구교수의 연구 개요와 주요 논문실적을 정리한 메인 페이지입니다.",
        en: "A compact landing page for Nahyun Kwon's research profile."
      }
    },
    bio: {
      icon: "user",
      label: { ko: "소개", en: "Biography" },
      subtitle: { ko: "Biography", en: "Biography" },
      description: {
        ko: "학력, 경력, 연구 배경을 중심으로 연구자 이력을 정리했습니다.",
        en: "Education, career history, and the broader research background."
      }
    },
    teaching: {
      icon: "research",
      label: { ko: "연구", en: "Research" },
      subtitle: { ko: "Research", en: "Research" },
      description: {
        ko: "주요 연구 축과 방법론, 적용 분야를 중심으로 현재 연구 방향을 정리했습니다.",
        en: "Current research directions, methods, and application domains."
      }
    },
    publications: {
      icon: "papers",
      label: { ko: "논문", en: "Publications" },
      subtitle: { ko: "Publications", en: "Publications" },
      description: {
        ko: "저널 논문만 집계해 SCI와 KCI 실적을 분리했습니다.",
        en: "Journal papers only, organized into SCI and KCI categories."
      }
    },
    news: {
      icon: "spark",
      label: { ko: "활동", en: "Activities" },
      subtitle: { ko: "Activities", en: "Activities" },
      description: {
        ko: "최근 연구 활동과 사이트 업데이트를 모았습니다.",
        en: "Recent research activities and site updates."
      }
    },
    contact: {
      icon: "mail",
      label: { ko: "연락처", en: "Contact" },
      subtitle: { ko: "Contact", en: "Contact" },
      description: {
        ko: "공동연구, 논문 문의, 연구 관련 연락에 활용할 수 있는 연결 창구입니다.",
        en: "Official contact channels for collaboration and research inquiries."
      }
    }
  };

  const PROFILE = {
    name: { ko: "권나현", en: "Nahyun Kwon" },
    title: { ko: "연구교수", en: "Research Professor" },
    affiliation: {
      ko: "한양대학교 ERICA AI기술건설연구센터",
      en: "Center for AI Technology in Construction, Hanyang University ERICA"
    },
    summary: {
      ko: "노후 공동주택 유지관리, 건설 소음, 건물 에너지, 도시분석 연구",
      en: "Aging housing maintenance, construction noise, building energy, and urban analytics"
    }
  };

  const CONTENT = {
    hero: {
      kicker: { ko: "Research Professor Website", en: "Research Professor Website" },
      title: {
        ko: "건축·건설 데이터를 기반으로 유지관리와 성능 예측을 연구합니다.",
        en: "Research on maintenance and performance prediction for the built environment."
      },
      description: {
        ko: "노후 공동주택 유지관리와 수선비 예측, 건설 소음 관리, 건물 에너지 성능, 도시 분석을 중심으로 데이터 기반 건축·건설 연구를 수행합니다.",
        en: "This site presents research on maintenance prediction, construction noise, building energy, and urban analytics."
      }
    },
    intro: [
      {
        title: { ko: "학력 및 경력", en: "Education and Career" },
        body: {
          ko: "한양대학교 건축공학과 학사, 서울대학교 건설환경공학부 석사·박사를 거쳐 현재 한양대학교 ERICA에서 연구교수로 재직하고 있습니다.",
          en: "B.S. from Hanyang University, M.S. and Ph.D. from Seoul National University, now serving as a research professor at Hanyang University ERICA."
        }
      },
      {
        title: { ko: "현재 연구 방향", en: "Current Research Focus" },
        body: {
          ko: "노후 건축물 유지관리, 건설 소음 관리, 건물 에너지 성능, 도시·건축 데이터 분석을 실제 문제 해결 중심으로 확장하고 있습니다.",
          en: "Current work extends building maintenance, construction noise management, energy performance, and urban analytics toward practical problem solving."
        }
      }
    ],
    bio: [
      {
        title: { ko: "연구 키워드", en: "Research Keywords" },
        body: {
          ko: "사례기반추론, 유전알고리즘, 머신러닝, 건축물 유지관리, 건설관리, 건물 에너지, 도시 분석",
          en: "Case-based reasoning, genetic algorithms, machine learning, building maintenance, construction management, energy, and urban analytics."
        }
      },
      {
        title: { ko: "주요 방법론", en: "Core Methods" },
        body: {
          ko: "CBR, GA, Fuzzy-AHP, AHP/TOPSIS, 통계적 분석, 딥러닝 기반 접근을 함께 활용합니다.",
          en: "A blend of CBR, GA, Fuzzy-AHP, AHP/TOPSIS, statistical analysis, and machine learning."
        }
      },
      {
        title: { ko: "적용 분야", en: "Application Domains" },
        body: {
          ko: "노후 공동주택 유지관리, 건설 소음, 그린 리모델링, 모듈러 건축, 도시 스트레스 분석 등으로 연구 범위를 확장하고 있습니다.",
          en: "Applications include aging housing maintenance, construction noise, green retrofit, modular construction, and urban stress analysis."
        }
      }
    ],
    timeline: [
      {
        period: { ko: "2024 - 현재", en: "2024 - Present" },
        title: {
          ko: "한양대학교 ERICA AI기술건설연구센터 연구교수",
          en: "Research Professor, Hanyang University ERICA"
        },
        body: {
          ko: "건축물 유지관리, 건설관리, 에너지, 도시 분석을 중심으로 데이터 기반 연구를 수행하고 있습니다.",
          en: "Conducting data-driven research on building maintenance, construction management, energy, and urban analytics."
        }
      },
      {
        period: { ko: "2026", en: "2026" },
        title: {
          ko: "Sustainability 특집호 Guest Editor",
          en: "Guest Editor for a Sustainability special issue"
        },
        body: {
          ko: "건설 프로젝트 관리, 친환경 건축, 회복탄력적 인프라 관련 편집 활동에 참여하고 있습니다.",
          en: "Participating in editorial work related to project management, green buildings, and resilient infrastructure."
        }
      },
      {
        period: { ko: "2018", en: "2018" },
        title: {
          ko: "서울대학교 건설환경공학부 박사",
          en: "Ph.D., Seoul National University"
        },
        body: {
          ko: "건설 소음 관리와 건설관리 기반 연구를 심화했습니다.",
          en: "Completed doctoral work centered on construction noise management and construction management."
        }
      },
      {
        period: { ko: "2014", en: "2014" },
        title: {
          ko: "서울대학교 건설환경공학부 석사",
          en: "M.S., Seoul National University"
        },
        body: {
          ko: "현장 소음 제어를 포함한 건설 소음 관리 연구를 수행했습니다.",
          en: "Completed master's research on active noise control for construction-site noise management."
        }
      },
      {
        period: { ko: "2011", en: "2011" },
        title: {
          ko: "한양대학교 건축공학과 학사",
          en: "B.S., Hanyang University"
        },
        body: {
          ko: "건축·건설 연구의 기반이 되는 학부 과정을 이수했습니다.",
          en: "Completed undergraduate training that built the foundation for later work in building research."
        }
      }
    ],
    research: [
      {
        title: { ko: "노후 건축물 유지관리", en: "Aging Building Maintenance" },
        body: {
          ko: "CBR과 GA를 바탕으로 수선 시기, 유지관리 비용, 수리 기간을 예측하는 모델을 연구합니다.",
          en: "Models for repair timing, maintenance cost, and repair duration using CBR and GA."
        },
        tags: ["CBR", "GA", "Maintenance"]
      },
      {
        title: { ko: "건설 소음 관리", en: "Construction Noise Management" },
        body: {
          ko: "소음 예측, 위험도 평가, 보상비 산정, 능동소음제어 기반 관리기법을 다룹니다.",
          en: "Noise prediction, risk assessment, compensation estimation, and active noise control."
        },
        tags: ["Noise", "Risk", "Control"]
      },
      {
        title: { ko: "건물 에너지와 그린 리모델링", en: "Building Energy and Retrofit" },
        body: {
          ko: "점유 특성과 데이터 변환 기법을 기반으로 건물 에너지 소비 예측과 리트로핏 전략 수립을 연구합니다.",
          en: "Energy prediction and retrofit strategies based on occupancy and transformed building data."
        },
        tags: ["Energy", "Retrofit", "Prediction"]
      },
      {
        title: { ko: "도시 분석과 모듈러 건축", en: "Urban Analytics and Modular Construction" },
        body: {
          ko: "도시 밀도, 공간 데이터, 컴퓨터 비전, 모듈러 및 순환경제 기반 연구를 확장하고 있습니다.",
          en: "Research on density, spatial data, computer vision, and modular or circular construction."
        },
        tags: ["Urban", "Modular", "Vision"]
      }
    ],
    methods: [
      {
        title: { ko: "사례기반추론과 최적화", en: "CBR and Optimization" },
        body: {
          ko: "과거 사례를 구조화해 예측과 의사결정에 활용하고, 유전알고리즘과 결합해 성능을 높입니다.",
          en: "Past cases are structured for prediction and decision support, often paired with optimization."
        }
      },
      {
        title: { ko: "머신러닝과 데이터 기반 예측", en: "Machine Learning" },
        body: {
          ko: "수리 기간, 도시 스트레스, 건축물 밀도와 같은 복합 현상을 정량화하기 위해 머신러닝과 딥러닝을 사용합니다.",
          en: "Machine learning and deep learning are used to quantify complex built-environment phenomena."
        }
      },
      {
        title: { ko: "의사결정 지원 모델", en: "Decision-Support Models" },
        body: {
          ko: "AHP, TOPSIS, Fuzzy-AHP를 적용해 재개발, 결함 중요도, 해체 위험 등 다기준 의사결정을 다룹니다.",
          en: "AHP, TOPSIS, and Fuzzy-AHP support multi-criteria decision making."
        }
      },
      {
        title: { ko: "현장 적용형 연구 설계", en: "Field-Oriented Design" },
        body: {
          ko: "데이터 수집부터 평가 지표까지 실제 유지관리와 시공 문제에 맞게 연구를 설계합니다.",
          en: "Projects are designed from data collection to evaluation with field application in mind."
        }
      }
    ]
  };

  const ACTIVITIES = [
    {
      date: "2026",
      title: { ko: "Sustainability 특집호 Guest Editor", en: "Guest Editor for Sustainability" },
      body: {
        ko: "건설 프로젝트 관리, 친환경 건축, 회복탄력적 인프라 관련 특집호 편집 활동에 참여하고 있습니다.",
        en: "Serving as guest editor for a special issue related to project management and green buildings."
      }
    },
    {
      date: "2025",
      title: { ko: "재개발·그린 리모델링 연구 확장", en: "Expanded work on redevelopment and green retrofit" },
      body: {
        ko: "재개발 평가, 공공건축물 그린 리모델링 비용, 재난관리 시설 타당성 평가로 연구 범위를 넓히고 있습니다.",
        en: "Recent work includes redevelopment assessment, green remodeling cost estimation, and feasibility analysis."
      }
    },
    {
      date: "2024",
      title: { ko: "도시 스트레스와 모듈러 건축 연구 고도화", en: "Expanded urban stress and modular construction research" },
      body: {
        ko: "도시 밀도와 공간 데이터 기반 분석, 모듈러 건축과 순환경제 연구를 함께 확장하고 있습니다.",
        en: "Urban stress analysis and modular construction research have been expanded through spatial data."
      }
    },
    {
      date: "2026-04",
      title: { ko: "연구 홈페이지 개편", en: "Research site redesign" },
      body: {
        ko: "연구 소개와 논문실적을 더 깔끔하게 볼 수 있도록 GitHub Pages 기반 홈페이지를 전면 정리했습니다.",
        en: "The GitHub Pages site was redesigned to present the research profile more clearly."
      }
    }
  ];

  const CONTACT = {
    cards: [
      {
        title: { ko: "이메일", en: "Email" },
        body: {
          ko: "공동연구, 논문 문의, 연구실 관련 연락은 이메일로 부탁드립니다.",
          en: "For collaboration or publication inquiries, email is the primary channel."
        },
        action: { label: { ko: "메일 보내기", en: "Send email" }, href: getProfileHref("email") || "mailto:envy978@hanmail.net" }
      },
      {
        title: { ko: "Google Scholar", en: "Google Scholar" },
        body: {
          ko: "전체 논문 목록과 인용 정보를 빠르게 확인할 수 있습니다.",
          en: "A quick way to inspect the full publication list and citation profile."
        },
        action: {
          label: { ko: "Scholar 열기", en: "Open Scholar" },
          href: getProfileHref("google scholar") || "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors=Nahyun+Kwon+Hanyang+University+ERICA"
        }
      },
      {
        title: { ko: "연구센터 프로필", en: "Lab Profile" },
        body: {
          ko: "현재 소속 연구환경과 연구센터 정보를 확인할 수 있습니다.",
          en: "Additional context on the current research environment and center profile."
        },
        action: { label: { ko: "프로필 보기", en: "Open profile" }, href: getProfileHref("lab profile") || "https://sbcml.hanyang.ac.kr/index.php?gubun=RP&hCode=STAFF_LIST" }
      }
    ],
    checklist: [
      { ko: "공동연구 문의 시 관심 주제, 현재 단계, 기대 산출물을 간단히 함께 보내주시면 좋습니다.", en: "For collaboration inquiries, include the topic, current stage, and expected outcome." },
      { ko: "논문 관련 문의는 논문 제목이나 연도를 함께 적어주시면 더 빠르게 확인할 수 있습니다.", en: "For publication-related questions, include the paper title or year for context." },
      { ko: "관련 링크나 자료가 있다면 함께 전달해 주시면 답변이 더 정확해집니다.", en: "Relevant links or materials usually make follow-up easier." }
    ]
  };

  const KCI_VENUES = new Set([
    "Architectural Research",
    "Journal of the Architectural Institute of Korea",
    "Journal of the Architectural Institute of Korea Planning & Design",
    "Korean Journal of Construction Engineering and Management"
  ]);

  const OTHER_VENUES = new Set(["Results in Engineering"]);

  const publicationSummary = getPublicationSummary();

  document.title = `${text(PROFILE.name)} | ${text(PAGE_META[page].label)}`;

  app.innerHTML = `
    <div class="site-frame">
      ${renderSidebar()}
      <main class="site-main">
        ${renderPage()}
      </main>
    </div>
  `;

  function text(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return value[lang] || value.ko || value.en || "";
    return String(value);
  }

  function route(name, locale) {
    return ROUTES[name][locale || lang];
  }

  function externalAttrs(url) {
    return url && !url.startsWith("mailto:") ? ' target="_blank" rel="noreferrer"' : "";
  }

  function getProfileLinks() {
    return Array.isArray(SITE_DATA.profile?.links) ? SITE_DATA.profile.links : [];
  }

  function getProfileHref(label) {
    const item = getProfileLinks().find(
      (link) => String(link.label || "").trim().toLowerCase() === String(label).trim().toLowerCase()
    );
    return item?.url || "";
  }

  function normalizeVenue(venue) {
    return String(venue || "").replace(/\s+\d.*$/, "").replace(/,\s*$/, "").trim();
  }

  function classifyPublication(item) {
    const venueKey = normalizeVenue(item.venue);
    if (item.type !== "journal") return "EXCLUDED";
    if (KCI_VENUES.has(venueKey)) return "KCI";
    if (OTHER_VENUES.has(venueKey)) return "OTHER";
    return "SCI";
  }

  function byYearThenCitations(a, b) {
    if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
    const aCitations = typeof a.citations === "number" ? a.citations : -1;
    const bCitations = typeof b.citations === "number" ? b.citations : -1;
    if (bCitations !== aCitations) return bCitations - aCitations;
    return String(a.title).localeCompare(String(b.title));
  }

  function getJournalPublications() {
    return (SITE_DATA.outputs?.publications || [])
      .map((item, index) => ({
        ...item,
        id: item.id || `publication-${index + 1}`,
        journalClass: classifyPublication(item),
        venueKey: normalizeVenue(item.venue)
      }))
      .filter((item) => item.type === "journal")
      .sort(byYearThenCitations);
  }

  function getPublicationsByClass(kind) {
    return getJournalPublications().filter((item) => item.journalClass === kind);
  }

  function getPublicationSummary() {
    const journals = getJournalPublications();
    const counts = { SCI: 0, KCI: 0, OTHER: 0 };
    const years = journals.map((item) => item.year).filter(Number.isFinite);
    let totalCitations = 0;

    journals.forEach((item) => {
      counts[item.journalClass] += 1;
      totalCitations += typeof item.citations === "number" ? item.citations : 0;
    });

    return {
      total: journals.length,
      SCI: counts.SCI,
      KCI: counts.KCI,
      OTHER: counts.OTHER,
      totalCitations,
      span: years.length ? `${Math.min(...years)} - ${Math.max(...years)}` : "-"
    };
  }

  function getFeaturedPublications() {
    return getJournalPublications()
      .filter((item) => item.journalClass !== "OTHER")
      .slice()
      .sort((a, b) => {
        const aCitations = typeof a.citations === "number" ? a.citations : -1;
        const bCitations = typeof b.citations === "number" ? b.citations : -1;
        if (bCitations !== aCitations) return bCitations - aCitations;
        return (b.year || 0) - (a.year || 0);
      })
      .slice(0, 5);
  }

  function groupByYear(items) {
    const groups = items.reduce((acc, item) => {
      const key = item.year || "-";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.keys(groups)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ year, items: groups[year] }));
  }

  function scholarSearchUrl(query) {
    return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
  }

  function renderPage() {
    switch (page) {
      case "bio":
        return `${renderPageLead("bio")}${renderBioPage()}`;
      case "teaching":
        return `${renderPageLead("teaching")}${renderResearchPage()}`;
      case "publications":
        return `${renderPageLead("publications")}${renderPublicationsPage()}`;
      case "news":
        return `${renderPageLead("news")}${renderActivitiesPage()}`;
      case "contact":
        return `${renderPageLead("contact")}${renderContactPage()}`;
      case "home":
      default:
        return renderHomePage();
    }
  }

  function renderSidebar() {
    const navOrder = ["home", "bio", "teaching", "publications", "news", "contact"];

    return `
      <aside class="site-sidebar">
        <div class="sidebar-photo-frame">
          <img class="profile-portrait" src="${SITE_DATA.profile?.photo || "assets/images/profile-portrait.svg"}" alt="${text(PROFILE.name)}">
        </div>
        <div class="sidebar-identity">
          <p class="sidebar-name">${text(PROFILE.name)}</p>
          <p class="sidebar-role">${text(PROFILE.title)}</p>
          <p class="sidebar-affiliation">${text(PROFILE.affiliation)}</p>
          <p class="sidebar-summary">${text(PROFILE.summary)}</p>
        </div>
        <div class="sidebar-mark">
          <div class="mark-badge">NK</div>
          <div class="mark-copy">
            <p class="mark-title">Research Profile</p>
            <p class="mark-subtitle">Academic Website</p>
          </div>
        </div>
        <div class="sidebar-social">
          ${getProfileLinks().map((item) => renderSocialLink(item)).join("")}
        </div>
        <div class="sidebar-label">${text({ ko: "내비게이션", en: "Navigation" })}</div>
        <nav class="sidebar-nav" aria-label="Main navigation">
          ${navOrder
            .map(
              (item) => `
                <a class="nav-item ${page === item ? "is-active" : ""}" href="${route(item)}" ${page === item ? 'aria-current="page"' : ""}>
                  ${icon(PAGE_META[item].icon)}
                  <span>${text(PAGE_META[item].label)}</span>
                </a>
              `
            )
            .join("")}
        </nav>
        <div class="sidebar-label">${text({ ko: "언어", en: "Language" })}</div>
        <div class="language-switch">
          <a class="lang-pill ${lang === "ko" ? "is-active" : ""}" href="${route(page, "ko")}">KO</a>
          <a class="lang-pill ${lang === "en" ? "is-active" : ""}" href="${route(page, "en")}">EN</a>
        </div>
      </aside>
    `;
  }

  function renderSocialLink(item) {
    const iconName = {
      "google scholar": "scholar",
      "lab profile": "building",
      github: "code",
      email: "mail"
    }[String(item.label || "").toLowerCase()] || "link";

    return `
      <a class="social-link" href="${item.url}"${externalAttrs(item.url)} aria-label="${item.label}" title="${item.label}">
        ${icon(iconName)}
      </a>
    `;
  }

  function renderHeroPanel() {
    return `
      <section class="panel hero-panel">
        <div class="hero-mark">
          <div class="mark-badge hero-badge">NK</div>
          <div class="mark-copy">
            <p class="mark-title">${text(PROFILE.name)}</p>
            <p class="mark-subtitle">Academic Website</p>
          </div>
        </div>
        <p class="hero-kicker">${text(CONTENT.hero.kicker)}</p>
        <h1 class="hero-title">${text(CONTENT.hero.title)}</h1>
        <p class="hero-description">${text(CONTENT.hero.description)}</p>
        <div class="meta-row">
          <span class="meta-pill">${icon("building")} Hanyang University ERICA</span>
          <span class="meta-pill">${icon("research")} Center for AI Technology in Construction</span>
          <span class="meta-pill">${icon("spark")} Built Environment Data Research</span>
        </div>
        <div class="summary-grid hero-summary">
          ${getSummaryCards().map((item) => renderSummaryCard(item)).join("")}
        </div>
        <div class="button-row">
          <a class="button button-primary" href="${route("publications")}">${icon("papers")}<span>${text({ ko: "전체 논문 보기", en: "View publications" })}</span></a>
          <a class="button button-secondary" href="${getProfileHref("google scholar") || scholarSearchUrl(text(PROFILE.name))}" target="_blank" rel="noreferrer">${icon("scholar")}<span>Google Scholar</span></a>
        </div>
      </section>
    `;
  }

  function renderPageLead(pageKey) {
    const meta = PAGE_META[pageKey];

    return `
      <section class="panel page-lead">
        <p class="page-kicker">${text(meta.subtitle)}</p>
        <h1 class="page-title">${text(meta.label)}</h1>
        <p class="page-description">${text(meta.description)}</p>
        ${
          pageKey === "publications"
            ? `
              <div class="meta-row">
                <span class="meta-pill">${icon("papers")}SCI ${publicationSummary.SCI}</span>
                <span class="meta-pill">${icon("book")}KCI ${publicationSummary.KCI}</span>
                ${
                  publicationSummary.OTHER
                    ? `<span class="meta-pill">${icon("link")}${text({ ko: `기타 ${publicationSummary.OTHER}편`, en: `Other ${publicationSummary.OTHER}` })}</span>`
                    : ""
                }
              </div>
            `
            : ""
        }
      </section>
    `;
  }

  function renderHomePage() {
    return `
      ${renderHeroPanel()}
      <section class="content-section">
        ${renderSectionHeading({ ko: "소개", en: "Biography" }, { ko: "Biography", en: "Biography" }, route("bio"), { ko: "소개 자세히 보기", en: "Open biography" })}
        <div class="card-grid two-column">${CONTENT.intro.map((item) => renderInfoCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "연구", en: "Research" }, { ko: "Research Themes", en: "Research Themes" }, route("teaching"), { ko: "연구 페이지 보기", en: "Open research" })}
        <div class="card-grid two-column">${CONTENT.research.map((item) => renderTopicCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "논문실적", en: "Publications" }, { ko: "Selected Publications", en: "Selected Publications" }, route("publications"), { ko: "전체 논문 보기", en: "View all publications" })}
        ${renderPublicationHomeSummary()}
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "최근 활동", en: "Recent Activities" }, { ko: "Activities", en: "Activities" }, route("news"), { ko: "활동 더 보기", en: "Open activities" })}
        <div class="timeline-stack">${ACTIVITIES.map((item) => renderActivityCard(item)).join("")}</div>
      </section>
      ${renderContactCta()}
    `;
  }

  function renderBioPage() {
    return `
      <section class="content-section">
        ${renderSectionHeading({ ko: "핵심 요약", en: "Profile Summary" }, { ko: "Profile", en: "Profile" })}
        <div class="card-grid three-column">${CONTENT.bio.map((item) => renderInfoCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "학력 및 경력", en: "Education and Career" }, { ko: "Timeline", en: "Timeline" })}
        <div class="timeline-stack">${CONTENT.timeline.map((item) => renderTimelineItem(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "연구 키워드", en: "Research Keywords" }, { ko: "Keywords", en: "Keywords" })}
        <div class="keyword-cloud">${collectKeywords().map((item) => `<span class="keyword-chip">${item}</span>`).join("")}</div>
      </section>
    `;
  }

  function renderResearchPage() {
    return `
      <section class="content-section">
        ${renderSectionHeading({ ko: "주요 연구 축", en: "Research Themes" }, { ko: "Themes", en: "Themes" })}
        <div class="card-grid two-column">${CONTENT.research.map((item) => renderTopicCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "연구 방법론", en: "Research Methods" }, { ko: "Methods", en: "Methods" })}
        <div class="card-grid two-column">${CONTENT.methods.map((item) => renderInfoCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "적용 분야", en: "Application Domains" }, { ko: "Domains", en: "Domains" })}
        <div class="note-banner">${text({ ko: "유지관리 비용 예측, 건설 소음 관리, 에너지 절감 전략, 도시 스트레스 분석, 모듈러 및 순환경제 기반 의사결정까지 실제 현장 문제에 연결되는 연구를 수행하고 있습니다.", en: "The research extends from maintenance prediction and construction noise control to energy strategy, urban stress analysis, and modular or circular construction." })}</div>
      </section>
    `;
  }

  function renderPublicationsPage() {
    const sciPublications = getPublicationsByClass("SCI");
    const kciPublications = getPublicationsByClass("KCI");
    const otherPublications = getPublicationsByClass("OTHER");

    return `
      <section class="content-section">
        ${renderSectionHeading({ ko: "집계 개요", en: "Publication Summary" }, { ko: "Summary", en: "Summary" })}
        <div class="summary-grid page-summary">
          ${getSummaryCards()
            .concat([
              {
                label: { ko: "게재 연도", en: "Year Span" },
                value: publicationSummary.span,
                detail: { ko: "저널 논문 기준", en: "Journal papers only" }
              }
            ])
            .map((item) => renderSummaryCard(item))
            .join("")}
        </div>
        <div class="note-banner">
          ${text({
            ko: `저널 논문 ${publicationSummary.total}편을 기준으로 정리했습니다. 학술대회논문, conference, proceeding, 학위논문은 본 화면에서 제외했습니다.${publicationSummary.OTHER ? " Results in Engineering 1편은 기타 국제학술지로 별도 표시했습니다." : ""}`,
            en: `This page counts ${publicationSummary.total} journal papers only. Conference papers, proceedings, and thesis work are excluded.${publicationSummary.OTHER ? " The Results in Engineering paper is shown separately as another international journal item." : ""}`
          })}
        </div>
      </section>
      ${renderPublicationSection({ ko: "SCI 논문실적", en: "SCI Publications" }, { ko: `${sciPublications.length}편`, en: `${sciPublications.length} papers` }, sciPublications, "SCI")}
      ${renderPublicationSection({ ko: "KCI 논문실적", en: "KCI Publications" }, { ko: `${kciPublications.length}편`, en: `${kciPublications.length} papers` }, kciPublications, "KCI")}
      ${otherPublications.length ? renderPublicationSection({ ko: "기타 국제학술지", en: "Other International Journals" }, { ko: `${otherPublications.length}편`, en: `${otherPublications.length} paper` }, otherPublications, "OTHER") : ""}
    `;
  }

  function renderActivitiesPage() {
    return `
      <section class="content-section">
        ${renderSectionHeading({ ko: "최근 활동", en: "Recent Activities" }, { ko: "Recent", en: "Recent" })}
        <div class="timeline-stack">${ACTIVITIES.map((item) => renderActivityCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "연구 확장 방향", en: "Research Expansion" }, { ko: "Ongoing", en: "Ongoing" })}
        <div class="note-banner">${text({ ko: "건축물 유지관리와 건설관리 중심의 기존 연구를 바탕으로, 도시 데이터 분석과 모듈러 건축, 친환경 리모델링까지 적용 범위를 넓혀가고 있습니다.", en: "The ongoing research expands from building maintenance and construction management toward urban analytics, modular construction, and green retrofitting." })}</div>
      </section>
    `;
  }

  function renderContactPage() {
    return `
      <section class="content-section">
        ${renderSectionHeading({ ko: "연락 채널", en: "Contact Channels" }, { ko: "Channels", en: "Channels" })}
        <div class="card-grid three-column">${CONTACT.cards.map((item) => renderContactCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "문의 전 참고", en: "Before Reaching Out" }, { ko: "Guidance", en: "Guidance" })}
        <div class="timeline-stack">${CONTACT.checklist.map((item) => `<article class="timeline-item"><p class="timeline-body">${text(item)}</p></article>`).join("")}</div>
      </section>
    `;
  }

  function renderSectionHeading(title, subtitle, href, actionLabel) {
    return `
      <div class="section-heading">
        <div class="section-heading-copy">
          <h2 class="section-title">${text(title)}</h2>
          <p class="section-subtitle">${text(subtitle)}</p>
        </div>
        ${href && actionLabel ? `<a class="section-action" href="${href}">${text(actionLabel)}</a>` : ""}
      </div>
    `;
  }

  function renderInfoCard(item) {
    return `<article class="info-card"><h3 class="card-title">${text(item.title)}</h3><p class="card-body">${text(item.body)}</p></article>`;
  }

  function renderTopicCard(item) {
    return `
      <article class="topic-card">
        <div class="topic-head">
          <h3 class="card-title">${text(item.title)}</h3>
          <div class="tag-list">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        <p class="card-body">${text(item.body)}</p>
      </article>
    `;
  }

  function renderTimelineItem(item) {
    return `<article class="timeline-item"><p class="timeline-period">${text(item.period)}</p><h3 class="card-title">${text(item.title)}</h3><p class="timeline-body">${text(item.body)}</p></article>`;
  }

  function renderActivityCard(item) {
    return `<article class="activity-card"><p class="activity-date">${item.date}</p><h3 class="card-title">${text(item.title)}</h3><p class="card-body">${text(item.body)}</p></article>`;
  }

  function renderContactCard(item) {
    return `
      <article class="contact-card">
        <h3 class="card-title">${text(item.title)}</h3>
        <p class="card-body">${text(item.body)}</p>
        <div class="contact-actions">
          <a class="button button-secondary" href="${item.action.href}"${externalAttrs(item.action.href)}>${icon(item.action.href.startsWith("mailto:") ? "mail" : "link")}<span>${text(item.action.label)}</span></a>
        </div>
      </article>
    `;
  }

  function renderPublicationHomeSummary() {
    return `
      <div class="publication-home-grid">
        <div class="panel compact-panel">
          <div class="summary-grid">${getSummaryCards().map((item) => renderSummaryCard(item)).join("")}</div>
        </div>
        <div class="publication-preview-list">
          ${getFeaturedPublications()
            .map(
              (item) => `
                <article class="publication-preview">
                  <div class="publication-badges">
                    <span class="badge ${badgeClass(item.journalClass)}">${item.journalClass}</span>
                    ${typeof item.citations === "number" ? `<span class="badge badge-neutral">${item.citations} ${text({ ko: "인용", en: "citations" })}</span>` : ""}
                  </div>
                  <h3 class="publication-title"><a href="${route("publications")}#${item.id}">${item.title}</a></h3>
                  <p class="publication-authors">${item.authors}</p>
                  <p class="publication-venue">${item.venue}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderPublicationSection(title, subtitle, items, kind) {
    return `
      <section class="content-section">
        ${renderSectionHeading(title, subtitle)}
        <div class="year-stack">
          ${groupByYear(items)
            .map(
              (group) => `
                <article class="year-block">
                  <div class="year-head">
                    <h3 class="year-title">${group.year}</h3>
                    <span class="tiny-badge">${text({ ko: `${group.items.length}편`, en: `${group.items.length} papers` })}</span>
                  </div>
                  <div class="publication-list">${group.items.map((item) => renderPublicationItem(item, kind)).join("")}</div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderPublicationItem(item, kind) {
    return `
      <article class="publication-item" id="${item.id}">
        <div class="publication-top">
          <div class="publication-badges">
            <span class="badge ${badgeClass(kind)}">${kind === "OTHER" ? text({ ko: "기타", en: "Other" }) : kind}</span>
            <span class="badge badge-neutral">${item.year}</span>
            ${typeof item.citations === "number" ? `<span class="badge badge-neutral">${item.citations} ${text({ ko: "인용", en: "citations" })}</span>` : ""}
          </div>
        </div>
        <h3 class="publication-title">${item.title}</h3>
        <p class="publication-authors">${item.authors}</p>
        <p class="publication-venue">${item.venue}</p>
        <div class="link-row">
          <a href="${scholarSearchUrl(item.title)}" target="_blank" rel="noreferrer">Google Scholar</a>
          ${item.doi ? `<a href="https://doi.org/${item.doi}" target="_blank" rel="noreferrer">DOI</a>` : ""}
        </div>
      </article>
    `;
  }

  function renderContactCta() {
    return `
      <section class="panel cta-panel">
        <div>
          <p class="page-kicker">Contact</p>
          <h2 class="section-title">${text({ ko: "공동연구와 문의는 이메일로 연락해 주세요.", en: "Email is the best way to get in touch." })}</h2>
          <p class="page-description">${text({ ko: "연구 주제나 논문 관련 문의, 공동연구 제안이 있다면 간단한 설명과 함께 메일로 보내주시면 확인 후 답변드릴 수 있습니다.", en: "For collaborations or publication inquiries, include a short summary in your email." })}</p>
        </div>
        <div class="button-row">
          <a class="button button-primary" href="${getProfileHref("email") || "mailto:envy978@hanmail.net"}">${icon("mail")}<span>${text({ ko: "메일 보내기", en: "Send email" })}</span></a>
          <a class="button button-secondary" href="${route("contact")}">${icon("link")}<span>${text({ ko: "연락처 페이지", en: "Open contact page" })}</span></a>
        </div>
      </section>
    `;
  }

  function getSummaryCards() {
    return [
      { label: { ko: "SCI 논문", en: "SCI Papers" }, value: String(publicationSummary.SCI), detail: { ko: "저널 논문 기준", en: "Journal papers only" } },
      { label: { ko: "KCI 논문", en: "KCI Papers" }, value: String(publicationSummary.KCI), detail: { ko: "국내 학술지 기준", en: "Domestic indexed journals" } },
      { label: { ko: "총 저널 논문", en: "Total Journals" }, value: String(publicationSummary.total), detail: { ko: "conference 제외", en: "Conferences excluded" } },
      { label: { ko: "총 인용", en: "Total Citations" }, value: String(publicationSummary.totalCitations), detail: { ko: "제공된 목록 기준", en: "Based on the provided list" } }
    ];
  }

  function renderSummaryCard(item) {
    return `<article class="summary-card"><p class="summary-label">${text(item.label)}</p><p class="summary-value">${item.value}</p><p class="summary-detail">${text(item.detail)}</p></article>`;
  }

  function collectKeywords() {
    return Array.from(new Set(CONTENT.research.flatMap((item) => item.tags)));
  }

  function badgeClass(kind) {
    const classes = { SCI: "badge-sci", KCI: "badge-kci", OTHER: "badge-other" };
    return classes[kind] || "badge-other";
  }

  function icon(name) {
    const paths = {
      home: '<path d="M2.5 7.5 8 3l5.5 4.5v5a1 1 0 0 1-1 1h-3v-3H6.5v3h-3a1 1 0 0 1-1-1z"></path>',
      user: '<path d="M8 8a2.75 2.75 0 1 0 0-5.5A2.75 2.75 0 0 0 8 8Zm0 1.5c-3 0-5.5 1.55-5.5 3.25 0 .41.34.75.75.75h9.5c.41 0 .75-.34.75-.75 0-1.7-2.5-3.25-5.5-3.25Z"></path>',
      research: '<path d="M6.25 2.5h3.5v2.25l2.2 3.47a1.75 1.75 0 0 1-1.48 2.68H5.53a1.75 1.75 0 0 1-1.48-2.68l2.2-3.47Zm-.6 8.4h4.7"></path>',
      papers: '<path d="M4 2.75h5.5L12.5 5v8.25a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-9.5a1 1 0 0 1 1-1Z"></path><path d="M9.5 2.75V5h3"></path><path d="M5.5 8.25h5"></path><path d="M5.5 10.5h5"></path>',
      spark: '<path d="m8 2.25 1.3 3.05 3.2.26-2.44 2.08.73 3.12L8 9.03 5.2 10.76l.73-3.12L3.5 5.56l3.2-.26L8 2.25Z"></path>',
      mail: '<path d="M2.75 4.25h10.5a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H2.75a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1Z"></path><path d="m2.25 5 5.17 3.62a1 1 0 0 0 1.16 0L13.75 5"></path>',
      building: '<path d="M3.25 2.5h5.5v11h-5.5z"></path><path d="M8.75 5h4v8.5h-4z"></path><path d="M5 4.75h1"></path><path d="M5 7h1"></path><path d="M5 9.25h1"></path><path d="M10.25 7h1"></path><path d="M10.25 9.25h1"></path>',
      scholar: '<path d="m8 2 5.75 3.5L8 9 2.25 5.5 8 2Z"></path><path d="M4.25 7.1V9.5c0 1.25 1.72 2.25 3.75 2.25s3.75-1 3.75-2.25V7.1"></path>',
      code: '<path d="m5.5 4-3 4 3 4"></path><path d="m10.5 4 3 4-3 4"></path><path d="m8.9 2.75-1.8 10.5"></path>',
      link: '<path d="M6.2 9.8 9.8 6.2"></path><path d="M5.1 11.5H4a2.5 2.5 0 1 1 0-5h1.1"></path><path d="M10.9 4.5H12a2.5 2.5 0 1 1 0 5h-1.1"></path>',
      book: '<path d="M4 3.25h7.5a1 1 0 0 1 1 1v7.5a.75.75 0 0 1-.75.75H4.5A1.5 1.5 0 0 1 3 11V4.25a1 1 0 0 1 1-1Z"></path><path d="M4.5 12.5V4.25"></path>'
    };

    return `<svg class="icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.link}</svg>`;
  }
})();
