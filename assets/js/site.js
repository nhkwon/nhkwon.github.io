(function () {
  const app = document.getElementById("app");

  if (!app || typeof SITE_DATA === "undefined") {
    return;
  }

  const page = document.body.dataset.page || "home";
  const lang = document.body.dataset.lang === "en" ? "en" : "ko";
  const publicationSort =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("sort") === "citations"
      ? "citations"
      : "year";
  let currentPublicationSort = publicationSort;
  const AI_CHAT_IDLE_MS = 20000;
  const AI_CHAT_STARTERS = [
    {
      label: { ko: "연구 주제", en: "Research topics" },
      prompt: { ko: "연구 주제가 궁금해요", en: "What are the main research topics?" }
    },
    {
      label: { ko: "논문 실적", en: "Publications" },
      prompt: { ko: "논문 실적을 알려주세요", en: "Show me the publication summary" }
    },
    {
      label: { ko: "연락 방법", en: "Contact" },
      prompt: { ko: "연락은 어떻게 하나요?", en: "How can I get in touch?" }
    }
  ];
  let aiChatOpen = false;
  let aiChatIdleTimer = null;

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
        ko: "권나현 연구 개요와 주요 논문실적 요약",
        en: "A compact landing page for Nahyun Kwon's research profile."
      }
    },
    bio: {
      icon: "user",
      label: { ko: "소개", en: "Biography" },
      subtitle: { ko: "Biography", en: "Biography" },
      description: {
        ko: "학력, 경력, 연구 배경 중심의 이력 정리",
        en: "Education, career history, and the broader research background."
      }
    },
    teaching: {
      icon: "research",
      label: { ko: "연구", en: "Research" },
      subtitle: { ko: "Research", en: "Research" },
      description: {
        ko: "주요 연구 축, 방법론, 적용 분야 중심의 현재 연구 방향",
        en: "Current research directions, methods, and application domains."
      }
    },
    publications: {
      icon: "papers",
      label: { ko: "Publications", en: "Publications" },
      subtitle: { ko: "Publications", en: "Publications" },
      description: {
        ko: "",
        en: ""
      }
    },
    news: {
      icon: "spark",
      label: { ko: "활동", en: "Activities" },
      subtitle: { ko: "Activities", en: "Activities" },
      description: {
        ko: "최근 연구 활동과 사이트 업데이트",
        en: "Recent research activities and site updates."
      }
    },
    contact: {
      icon: "mail",
      label: { ko: "연락처", en: "Contact" },
      subtitle: { ko: "Contact", en: "Contact" },
      description: {
        ko: "공동연구, 논문 문의, 연구 관련 연락 채널",
        en: "Official contact channels for collaboration and research inquiries."
      }
    }
  };

  const PROFILE = {
    educationHeading: { ko: "학력사항", en: "Education" },
    education: [
      {
        ko: "2011.02 한양대학교 건축학과 졸업(건축학사)",
        en: "Feb 2011, Bachelor of Architecture, Hanyang University"
      },
      {
        ko: "2014.02 서울대학교 건축학과 건축시공 및 건설관리 전공(공학석사)",
        en: "Feb 2014, M.Eng. in Architectural Construction and Construction Management, Seoul National University"
      },
      {
        ko: "2018.08 서울대학교 건축학과 건축시공 및 건설관리 전공(공학박사)",
        en: "Aug 2018, Ph.D. in Architectural Construction and Construction Management, Seoul National University"
      }
    ],
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
          ko: "2011.02 한양대학교 건축학과 졸업(학사학위, 건축학사), 2014.02 서울대학교 건축학과 건축시공 및 건설관리 전공(석사학위, 공학석사), 2018.08 서울대학교 건축학과 건축시공 및 건설관리 전공(박사학위, 공학박사)을 거쳐 현재 한양대학교 ERICA에서 연구교수로 재직하고 있습니다.",
          en: "She received a Bachelor of Architecture from Hanyang University in February 2011, an M.Eng. in Architectural Construction and Construction Management from Seoul National University in February 2014, and a Ph.D. in the same field in August 2018."
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
        period: { ko: "2018.08", en: "Aug 2018" },
        title: {
          ko: "서울대학교 건축학과 건축시공 및 건설관리 전공 박사(공학박사)",
          en: "Ph.D. in Engineering, Architectural Construction and Construction Management, Department of Architecture, Seoul National University"
        },
        body: {
          ko: "서울대학교 건축학과 건축시공 및 건설관리 전공에서 건설 소음 관리와 건설관리 기반 연구를 심화했습니다.",
          en: "Completed doctoral research in Architectural Construction and Construction Management within the Department of Architecture at Seoul National University."
        }
      },
      {
        period: { ko: "2014.02", en: "Feb 2014" },
        title: {
          ko: "서울대학교 건축학과 건축시공 및 건설관리 전공 석사(공학석사)",
          en: "M.Eng., Architectural Construction and Construction Management, Department of Architecture, Seoul National University"
        },
        body: {
          ko: "서울대학교 건축학과 건축시공 및 건설관리 전공에서 현장 소음 제어를 포함한 건설 소음 관리 연구를 수행했습니다.",
          en: "Completed master's research on construction-site noise management in Architectural Construction and Construction Management at Seoul National University."
        }
      },
      {
        period: { ko: "2011.02", en: "Feb 2011" },
        title: {
          ko: "한양대학교 건축학과 졸업(학사학위, 건축학사)",
          en: "Bachelor of Architecture, Department of Architecture, Hanyang University"
        },
        body: {
          ko: "한양대학교 건축학과에서 건축학사 학위를 취득하며 이후 건축시공 및 건설관리 연구의 기반을 마련했습니다.",
          en: "Completed the undergraduate architecture program at Hanyang University, building the foundation for later work in architectural construction and construction management."
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
  const scholarMetrics = {
    citationsAll: publicationSummary.totalCitations,
    citationsSince2021: "",
    hIndexAll: "",
    hIndexSince2021: "",
    ...SITE_DATA.scholarMetrics
  };

  PAGE_META.home.description = {
    ko: "권나현의 연구 개요와 주요 논문실적을 정리한 메인 페이지",
    en: "Main page summarizing Nahyun Kwon's research and journal publications."
  };

  PROFILE.educationHeading = { ko: "학위", en: "Degrees" };
  PROFILE.educationSummary = { ko: "건축학사 · 공학석사 · 공학박사", en: "B.Arch. · M.Eng. · Ph.D." };
  PROFILE.affiliation = {
    ko: "한양대학교 인공지능건설기술 연구센터",
    en: "AI Construction Technology Research Center, Hanyang University"
  };
  PROFILE.summary = {
    ko: "Construction AI·Data Intelligence를 향한 연구",
    en: "Research toward Construction AI & Data Intelligence"
  };

  PROFILE.summary = {
    ko: "Construction AI & Data Intelligence Research Group",
    en: "Construction AI & Data Intelligence Research Group"
  };

  CONTENT.hero.kicker = { ko: "Toward", en: "Toward" };
  CONTENT.hero.title = {
    ko: "Construction AI & Data Intelligence",
    en: "Construction AI & Data Intelligence"
  };
  CONTENT.hero.description = {
    ko: "유지관리, 성능평가, 예측모형, 의사결정을 잇는 데이터 기반 건축·건설 연구",
    en: "Data-driven research linking maintenance, performance assessment, predictive modeling, and decision-making in the built environment."
  };
  CONTENT.intro[0].body = {
    ko: "2011.02 한양대학교 건축학과 졸업(건축학사), 2014.02 서울대학교 건축학과 석사(건축시공 및 건설관리 전공, 공학석사), 2018.08 서울대학교 건축학과 박사(건축시공 및 건설관리 전공, 공학박사), 현재 한양대학교 인공지능건설기술 연구센터 연구",
    en: "B.Arch., Hanyang University (Feb 2011); M.Eng., Department of Architecture, Seoul National University, major in Architectural Construction and Construction Management (Feb 2014); Ph.D. in the same field (Aug 2018); currently at the AI Construction Technology Research Center, Hanyang University."
  };
  CONTENT.intro[1].body = {
    ko: "건축물 유지관리, 건설환경 리스크, 건물 성능평가, 도시·건축 데이터 분석을 실제 의사결정과 연결하는 연구",
    en: "Current work connects building maintenance, construction risk, performance assessment, and urban or building data analytics with practical decision-making."
  };
  CONTENT.timeline[0].title = {
    ko: "한양대학교 인공지능건설기술 연구센터",
    en: "AI Construction Technology Research Center, Hanyang University"
  };
  CONTENT.timeline[0].body = {
    ko: "건축물 유지관리, 건설관리, 에너지, 도시 분석을 연결하는 데이터 기반 연구",
    en: "Conducting data-driven research connecting building maintenance, construction management, energy, and urban analytics."
  };
  CONTENT.timeline[2].title = {
    ko: "서울대학교 건축학과, 공학박사",
    en: "Department of Architecture, Seoul National University, Ph.D."
  };
  CONTENT.timeline[2].body = {
    ko: "전공: 건축시공 및 건설관리",
    en: "Major: Architectural Construction and Construction Management"
  };
  CONTENT.timeline[3].title = {
    ko: "서울대학교 건축학과, 공학석사",
    en: "Department of Architecture, Seoul National University, M.Eng."
  };
  CONTENT.timeline[3].body = {
    ko: "전공: 건축시공 및 건설관리",
    en: "Major: Architectural Construction and Construction Management"
  };
  CONTENT.timeline[4].title = {
    ko: "한양대학교 건축학과, 건축학사",
    en: "Department of Architecture, Hanyang University, B.Arch."
  };
  CONTENT.timeline[4].body = {
    ko: "전공: 건축학",
    en: "Major: Architecture"
  };

  CONTENT.hero.title = { ko: "Construction AI & Data Intelligence", en: "Construction AI & Data Intelligence" };
  CONTENT.hero.description = {
    ko: "유지관리, 성능평가, 예측모형, 의사결정을 잇는 데이터 기반 건축·건설 연구",
    en: "Data-driven research linking maintenance, performance assessment, predictive modeling, and decision-making in the built environment."
  };
  CONTENT.intro = [
    {
      title: { ko: "학력 및 경력", en: "Education & Career" },
      bodyHtml: {
        ko: `<div class="education-list">
          <div class="education-row"><span class="education-year">2011.02</span><span class="education-text">한양대학교 건축학과 졸업</span></div>
          <div class="education-row"><span class="education-year">2014.02</span><span class="education-text">서울대학교 건축학과 건축시공 및 건설관리 전공</span></div>
          <div class="education-row"><span class="education-year">2018.08</span><span class="education-text">서울대학교 건축학과 건축시공 및 건설관리 전공</span></div>
          <div class="education-row"><span class="education-year">Present</span><span class="education-text">한양대학교 인공지능건설기술 연구센터</span></div>
        </div>`,
        en: `<div class="education-list">
          <div class="education-row"><span class="education-year">2011.02</span><span class="education-text">Department of Architecture, Hanyang University</span></div>
          <div class="education-row"><span class="education-year">2014.02</span><span class="education-text">Architectural Construction and Construction Management, Seoul National University</span></div>
          <div class="education-row"><span class="education-year">2018.08</span><span class="education-text">Architectural Construction and Construction Management, Seoul National University</span></div>
          <div class="education-row"><span class="education-year">Present</span><span class="education-text">AI Construction Technology Research Center, Hanyang University</span></div>
        </div>`
      }
    }
  ];

  document.title = `${text(PROFILE.name)} | ${text(PAGE_META[page].label)}`;

  app.innerHTML = `
    <div class="site-frame">
      ${renderSidebar()}
      <main class="site-main">
        ${renderPage()}
      </main>
    </div>
    ${renderAiChat()}
  `;
  finalizeRenderedPage();
  app.addEventListener("click", handleAppClick);
  app.addEventListener("submit", handleAppSubmit);
  app.addEventListener("input", handleAppInput);
  app.addEventListener("focusin", handleAppFocusIn);
  app.addEventListener("pointermove", handleAppPointerMove);
  app.addEventListener("keydown", handleAppKeydown);
  document.addEventListener("pointerdown", handleDocumentPointerDown);
  document.addEventListener("keydown", handleDocumentKeydown);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  syncAiChatUi();

  function text(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return value[lang] || value.ko || value.en || "";
    return String(value);
  }

  function finalizeRenderedPage() {
    if (page !== "home") {
      return;
    }

    const siteMain = app.querySelector(".site-main");
    if (!siteMain) {
      return;
    }

    const sections = Array.from(siteMain.querySelectorAll(".content-section"));
    sections.forEach((section) => {
      const titleText = String(section.querySelector(".section-title")?.textContent || "").trim().toLowerCase();
      const bioAction = section.querySelector('.section-action[href*="bio"]');
      const isIntroSection = Boolean(bioAction) || titleText === "biography" || titleText === "소개";

      if (isIntroSection) {
        section.remove();
      }
    });

    const firstSection = siteMain.querySelector(".content-section");
    if (firstSection) {
      firstSection.classList.add("home-primary-section");
    }

    const heroCaption = siteMain.querySelector(".hero-panel .hero-caption");
    if (heroCaption) {
      heroCaption.remove();
    }

    const heroLead = siteMain.querySelector(".hero-panel .hero-lead");
    if (heroLead) {
      heroLead.remove();
    }
  }

  function route(name, locale) {
    return ROUTES[name][locale || lang];
  }

  function publicationSortHref(sortKey) {
    const base = route("publications");
    return sortKey === "citations" ? `${base}?sort=citations` : base;
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
    return "SCI";
  }

  function byYearThenCitations(a, b) {
    if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
    const aCitations = typeof a.citations === "number" ? a.citations : -1;
    const bCitations = typeof b.citations === "number" ? b.citations : -1;
    if (bCitations !== aCitations) return bCitations - aCitations;
    return String(a.title).localeCompare(String(b.title));
  }

  function byCitationsThenYear(a, b) {
    const aCitations = typeof a.citations === "number" ? a.citations : -1;
    const bCitations = typeof b.citations === "number" ? b.citations : -1;
    if (bCitations !== aCitations) return bCitations - aCitations;
    if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
    return String(a.title).localeCompare(String(b.title));
  }

  function sortPublications(items) {
    return items.slice().sort(currentPublicationSort === "citations" ? byCitationsThenYear : byYearThenCitations);
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
      international: counts.SCI + counts.OTHER,
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
          <p class="sidebar-affiliation">${text(PROFILE.affiliation)}</p>
          <section class="sidebar-contact-card" aria-label="Contact details">
            <div class="sidebar-contact-row">
              <span class="sidebar-contact-label">Address</span>
              <p class="sidebar-contact-value">15588 경기도 안산시 상록구 한양대학로 55</p>
            </div>
            <div class="sidebar-contact-row">
              <span class="sidebar-contact-label">Email</span>
              <p class="sidebar-contact-value"><a class="sidebar-contact-link" href="mailto:nhkwon@hanyang.ac.kr">nhkwon@hanyang.ac.kr</a></p>
            </div>
            <div class="sidebar-contact-row">
              <span class="sidebar-contact-label">Tel.</span>
              <p class="sidebar-contact-value">01073929933</p>
            </div>
          </section>
        </div>
        <div class="sidebar-social">
          ${getProfileLinks().map((item) => renderSocialLink(item)).join("")}
        </div>
        <div class="sidebar-label">Navigation</div>
        <nav class="sidebar-nav" aria-label="Main navigation">
          ${navOrder
            .map(
              (item) => `
                <a class="nav-item ${page === item ? "is-active" : ""}" href="${route(item)}" ${page === item ? 'aria-current="page"' : ""}>
                  ${icon(PAGE_META[item].icon)}
                  <span>${PAGE_META[item].label?.en || text(PAGE_META[item].label)}</span>
                </a>
              `
            )
            .join("")}
        </nav>
        <div class="sidebar-label">Language</div>
        <div class="language-switch">
          <a class="lang-pill ${lang === "ko" ? "is-active" : ""}" href="${route(page, "ko")}">KO</a>
          <a class="lang-pill ${lang === "en" ? "is-active" : ""}" href="${route(page, "en")}">EN</a>
        </div>
      </aside>
    `;
  }

  function renderAiChat() {
    return `
      <div class="ai-chat-widget" data-ai-chat-widget>
        <section class="ai-chat-panel" id="ai-chat-panel" data-ai-chat-panel aria-hidden="true">
          <div class="ai-chat-panel-header">
            <div class="ai-chat-panel-copy">
              <p class="ai-chat-kicker">AI Assistant</p>
              <h2 class="ai-chat-title">${text({ ko: "연구 안내 채팅", en: "Research guide chat" })}</h2>
            </div>
            <button class="ai-chat-close" type="button" data-ai-chat-close>${text({ ko: "닫기", en: "Close" })}</button>
          </div>
          <div class="ai-chat-messages" data-ai-chat-messages>
            <article class="ai-chat-message is-assistant">
              <p class="ai-chat-message-label">AI Assistant</p>
              <p class="ai-chat-message-body">${text({
                ko: "연구 주제, 논문 실적, 최근 활동, 연락 방법을 빠르게 안내해드릴게요. 아래 버튼을 누르거나 직접 질문해 주세요.",
                en: "Ask about research topics, publications, recent activities, or contact details. You can use the shortcuts below or type your own question."
              })}</p>
            </article>
          </div>
          <div class="ai-chat-starters">
            ${AI_CHAT_STARTERS.map(
              (item) => `
                <button class="ai-chat-starter" type="button" data-ai-chat-starter="${text(item.prompt)}">${text(item.label)}</button>
              `
            ).join("")}
          </div>
          <form class="ai-chat-form" data-ai-chat-form>
            <label class="sr-only" for="ai-chat-input">${text({ ko: "질문 입력", en: "Ask a question" })}</label>
            <input
              class="ai-chat-input"
              id="ai-chat-input"
              data-ai-chat-input
              type="text"
              maxlength="200"
              placeholder="${text({ ko: "질문을 입력하세요", en: "Type your question" })}"
            >
            <button class="ai-chat-submit" type="submit">${text({ ko: "보내기", en: "Send" })}</button>
          </form>
          <p class="ai-chat-hint">${text({
            ko: "사용하지 않으면 자동으로 다시 축소됩니다.",
            en: "The panel automatically minimizes when it is idle."
          })}</p>
        </section>
        <button
          class="ai-chat-launcher"
          type="button"
          data-ai-chat-toggle
          aria-controls="ai-chat-panel"
          aria-expanded="false"
          aria-label="${text({ ko: "AI 채팅 열기", en: "Open AI chat" })}"
        >
          <span class="ai-chat-launcher-icon">${icon("spark")}</span>
          <span class="ai-chat-launcher-text">AI Chat</span>
        </button>
      </div>
    `;
  }

  function renderSocialLink(item) {
    const iconName = {
      "google scholar": "scholar",
      "center profile": "building",
      "research profile": "building",
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
            <p class="mark-subtitle">with Codex and vibe coding</p>
          </div>
        </div>
        <p class="hero-kicker">${text(CONTENT.hero.kicker)}</p>
        <h1 class="hero-title">${text(CONTENT.hero.title)}</h1>
        <p class="hero-caption">with Codex and vibe coding</p>
        <p class="hero-description">${text(CONTENT.hero.description)}</p>
        <div class="meta-row">
          <span class="meta-pill">${icon("building")} ${text({ ko: "한양대학교", en: "Hanyang University" })}</span>
          <span class="meta-pill">${icon("research")} ${text({ ko: "인공지능건설기술 연구센터", en: "AI Construction Technology Research Center" })}</span>
          <span class="meta-pill">${icon("spark")} ${text({ ko: "Construction AI & Data Intelligence Research Group", en: "Construction AI & Data Intelligence Research Group" })}</span>
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
                <span class="meta-pill">${icon("papers")}${text({ ko: `Intl. journals ${publicationSummary.international}`, en: `Intl. journals ${publicationSummary.international}` })}</span>
                <span class="meta-pill">${icon("research")}SCI(E) ${publicationSummary.SCI}</span>
                ${publicationSummary.OTHER ? `<span class="meta-pill">${icon("link")}Scopus ${publicationSummary.OTHER}</span>` : ""}
                <span class="meta-pill">${icon("book")}KCI ${publicationSummary.KCI}</span>
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
    const summaryNote = text({
      ko: `국제 저널 ${publicationSummary.international}편을 기준으로 정리했으며, 이 가운데 SCI(E) ${publicationSummary.SCI}편과 Scopus ${publicationSummary.OTHER}편(Results in Engineering)을 분리해 표시했습니다. KCI 논문 ${publicationSummary.KCI}편은 별도 구간으로 유지했고, 학술대회논문·proceeding·학위논문은 제외했습니다.`,
      en: `This page organizes ${publicationSummary.international} international journal papers, separated into SCI(E) ${publicationSummary.SCI} and Scopus ${publicationSummary.OTHER}. The ${publicationSummary.KCI} KCI papers are shown in a separate section, while conference papers, proceedings, and thesis work are excluded.`
    });

    return `
      <section class="content-section">
        ${renderSectionHeading({ ko: "吏묎퀎 媛쒖슂", en: "Publication Summary" }, { ko: "Summary", en: "Summary" })}
        <div class="summary-grid page-summary">
          ${getSummaryCards()
            .concat([
              {
                label: { ko: "寃뚯옱 ?곕룄", en: "Year Span" },
                value: publicationSummary.span,
                detail: { ko: "????쇰Ц 湲곗?", en: "Journal papers only" }
              }
            ])
            .map((item) => renderSummaryCard(item))
            .join("")}
        </div>
        <div class="note-banner">${summaryNote}</div>
      </section>
      <section class="content-section">
        ${renderPublicationSortControls()}
      </section>
      ${renderPublicationSection({ ko: "SCI(E) 논문실적", en: "SCI(E) Publications" }, { ko: `${sciPublications.length}편`, en: `${sciPublications.length} papers` }, sciPublications, "SCI")}
      ${otherPublications.length ? renderPublicationSection({ ko: "Scopus 논문실적", en: "Scopus Publications" }, { ko: `${otherPublications.length}편`, en: `${otherPublications.length} paper` }, otherPublications, "OTHER") : ""}
      ${renderPublicationSection({ ko: "KCI 논문실적", en: "KCI Publications" }, { ko: `${kciPublications.length}편`, en: `${kciPublications.length} papers` }, kciPublications, "KCI")}
    `;

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
            ko: `저널 논문 ${publicationSummary.total}편을 기준으로 정리했습니다. 학술대회논문, conference, proceeding, 학위논문은 본 화면에서 제외했고, SCI 저널 지표는 첨부해주신 통합연구실적 PDF의 IF, Percentile, 상위 비율을 반영했습니다.${publicationSummary.OTHER ? " Results in Engineering 1편은 ESCI 기반 기타 국제학술지로 별도 표시했습니다." : ""}`,
            en: `This page counts ${publicationSummary.total} journal papers only. Conference papers, proceedings, and thesis work are excluded, and the SCI journal metrics are reflected from the provided PDF record.${publicationSummary.OTHER ? " The Results in Engineering paper is shown separately as another international journal item." : ""}`
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
    const subtitleText =
      page === "publications" &&
      ((typeof subtitle === "object" && (subtitle.ko === "Summary" || subtitle.en === "Summary")) || subtitle === "Summary")
        ? { ko: `Summary · ${publicationSummary.span}`, en: `Summary · ${publicationSummary.span}` }
        : subtitle;

    return `
      <div class="section-heading">
        <div class="section-heading-copy">
          <h2 class="section-title">${text(title)}</h2>
          <p class="section-subtitle">${text(subtitleText)}</p>
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

  function renderPublicationSortControls() {
    return `
      <div class="panel publication-toolbar">
        <div class="publication-toolbar-copy">
          <p class="page-kicker">${text({ ko: "정렬", en: "Sort" })}</p>
          <h2 class="section-title">${text({ ko: "논문 보기 방식 선택", en: "Choose how to view publications" })}</h2>
          <p class="page-description">${text({
            ko: "연도별 보기에서는 연도 구간별로 정리되고, 인용순 보기에서는 인용 수가 높은 논문부터 한 번에 확인할 수 있습니다.",
            en: "Year view groups papers by publication year, while citation view shows the most-cited papers first."
          })}</p>
        </div>
        <div class="sort-switch" role="tablist" aria-label="${text({ ko: "논문 정렬", en: "Publication sorting" })}">
          <a class="sort-chip ${publicationSort === "year" ? "is-active" : ""}" href="${publicationSortHref("year")}">${text({ ko: "연도별", en: "By year" })}</a>
          <a class="sort-chip ${publicationSort === "citations" ? "is-active" : ""}" href="${publicationSortHref("citations")}">${text({ ko: "인용순", en: "By citations" })}</a>
        </div>
      </div>
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
                    <span class="badge ${badgeClass(item.journalClass)}">${publicationKindLabel(item.journalClass)}</span>
                    ${typeof item.citations === "number" ? `<span class="badge badge-neutral">${item.citations} ${text({ ko: "인용", en: "citations" })}</span>` : ""}
                    ${item.metrics?.impactFactor ? `<span class="badge badge-neutral">IF ${item.metrics.impactFactor}</span>` : ""}
                  </div>
                  <h3 class="publication-title"><a href="${getPublicationPrimaryLink(item)}" target="_blank" rel="noreferrer">${item.title}</a></h3>
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
    const sortedItems = sortPublications(items);

    return `
      <section class="content-section">
        ${renderSectionHeading(title, subtitle)}
        ${
          publicationSort === "citations"
            ? `<div class="publication-list citation-list">${sortedItems
                .map((item) => renderPublicationItem(item, kind))
                .join("")}</div>`
            : `<div class="year-stack">
                ${groupByYear(sortedItems)
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
              </div>`
        }
      </section>
    `;

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
            <span class="badge ${badgeClass(kind)}">${publicationKindLabel(kind)}</span>
            <span class="badge badge-neutral">${item.year}</span>
            ${item.metrics?.impactFactor ? `<span class="badge badge-neutral">IF ${item.metrics.impactFactor}</span>` : ""}
            ${typeof item.citations === "number" ? `<span class="badge badge-neutral">${item.citations} ${text({ ko: "인용", en: "citations" })}</span>` : ""}
          </div>
        </div>
        <h3 class="publication-title">${item.title}</h3>
        <p class="publication-authors">${item.authors}</p>
        <p class="publication-venue">${item.venue}</p>
        ${renderPublicationMetrics(item)}
        <div class="link-row">
          <a href="${scholarSearchUrl(item.title)}" target="_blank" rel="noreferrer">Google Scholar</a>
          ${item.doi ? `<a href="https://doi.org/${item.doi}" target="_blank" rel="noreferrer">DOI</a>` : ""}
        </div>
      </article>
    `;

    return `
      <article class="publication-item" id="${item.id}">
        <div class="publication-top">
          <div class="publication-badges">
            <span class="badge ${badgeClass(kind)}">${kind === "OTHER" ? text({ ko: "기타", en: "Other" }) : kind}</span>
            <span class="badge badge-neutral">${item.year}</span>
            ${item.metrics?.impactFactor ? `<span class="badge badge-neutral">IF ${item.metrics.impactFactor}</span>` : ""}
            ${typeof item.citations === "number" ? `<span class="badge badge-neutral">${item.citations} ${text({ ko: "인용", en: "citations" })}</span>` : ""}
          </div>
        </div>
        <h3 class="publication-title">${item.title}</h3>
        <p class="publication-authors">${item.authors}</p>
        <p class="publication-venue">${item.venue}</p>
        ${renderPublicationMetrics(item)}
        <div class="link-row">
          <a href="${scholarSearchUrl(item.title)}" target="_blank" rel="noreferrer">Google Scholar</a>
          ${item.doi ? `<a href="https://doi.org/${item.doi}" target="_blank" rel="noreferrer">DOI</a>` : ""}
        </div>
      </article>
    `;
  }

  function renderPublicationMetrics(item) {
    if (!item.metrics) {
      return "";
    }

    return `
      <div class="publication-metrics">
        ${item.metrics.indexType ? `<span class="metric-chip">${item.metrics.indexType}</span>` : ""}
        ${item.metrics.percentile ? `<span class="metric-chip">${text({ ko: `Percentile ${item.metrics.percentile}`, en: `Percentile ${item.metrics.percentile}` })}</span>` : ""}
        ${item.metrics.topPercent ? `<span class="metric-chip">${text({ ko: `상위 ${item.metrics.topPercent}%`, en: `Top ${item.metrics.topPercent}%` })}</span>` : ""}
      </div>
    `;
  }

  function getPublicationPrimaryLink(item) {
    if (item.paperUrl) return item.paperUrl;
    if (item.doi) return `https://doi.org/${item.doi}`;
    return scholarSearchUrl(item.title);
  }

  function getPublicationPrimaryLabel(item) {
    if (item.paperUrl || item.doi) {
      return text({ ko: "원문 보기", en: "Open paper" });
    }
    return "Google Scholar";
  }

  function renderPublicationItem(item, kind) {
    const primaryLink = getPublicationPrimaryLink(item);
    const doiLink = item.doi ? `https://doi.org/${item.doi}` : "";
    const scholarLink = scholarSearchUrl(item.title);

    return `
      <article class="publication-item" id="${item.id}">
        <div class="publication-top">
          <div class="publication-badges">
            <span class="badge ${badgeClass(kind)}">${publicationKindLabel(kind)}</span>
            <span class="badge badge-neutral">${item.year}</span>
            ${item.metrics?.impactFactor ? `<span class="badge badge-neutral">IF ${item.metrics.impactFactor}</span>` : ""}
            ${typeof item.citations === "number" ? `<span class="badge badge-neutral">${item.citations} ${text({ ko: "인용", en: "citations" })}</span>` : ""}
          </div>
        </div>
        <h3 class="publication-title"><a href="${primaryLink}" target="_blank" rel="noreferrer">${item.title}</a></h3>
        <p class="publication-authors">${item.authors}</p>
        <p class="publication-venue">${item.venue}</p>
        ${renderPublicationMetrics(item)}
        <div class="link-row">
          <a href="${primaryLink}" target="_blank" rel="noreferrer">${getPublicationPrimaryLabel(item)}</a>
          ${doiLink && doiLink !== primaryLink ? `<a href="${doiLink}" target="_blank" rel="noreferrer">DOI</a>` : ""}
          ${scholarLink !== primaryLink ? `<a href="${scholarLink}" target="_blank" rel="noreferrer">Google Scholar</a>` : ""}
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

  function renderPublicationSortControls() {
    return `
      <div class="panel publication-toolbar">
        <div class="publication-toolbar-copy">
          <p class="page-kicker">${text({ ko: "정렬", en: "Sort" })}</p>
          <h2 class="section-title">${text({ ko: "논문 보기 방식 선택", en: "Choose how to view publications" })}</h2>
          <p class="page-description">${text({
            ko: "연도별 보기는 최신 연도부터 정렬해 보여주고, 인용순 보기는 인용 수가 높은 논문부터 확인할 수 있습니다.",
            en: "Year view orders papers from newest to oldest, while citation view ranks them by citation count."
          })}</p>
        </div>
        <div class="sort-switch" role="tablist" aria-label="${text({ ko: "논문 정렬", en: "Publication sorting" })}">
          <a class="sort-chip ${publicationSort === "year" ? "is-active" : ""}" href="${publicationSortHref("year")}">${text({ ko: "연도별", en: "By year" })}</a>
          <a class="sort-chip ${publicationSort === "citations" ? "is-active" : ""}" href="${publicationSortHref("citations")}">${text({ ko: "인용순", en: "By citations" })}</a>
        </div>
      </div>
    `;
  }

  function renderPublicationSection(title, subtitle, items, kind) {
    const sortedItems = sortPublications(items);

    return `
      <section class="content-section">
        ${renderSectionHeading(title, subtitle)}
        <div class="publication-card-list">
          ${sortedItems.map((item) => renderPublicationItem(item, kind)).join("")}
        </div>
      </section>
    `;
  }

  function renderPublicationMetrics(item) {
    if (!item.metrics) {
      return "";
    }

    return `
      <div class="publication-metrics publication-card-metrics">
        <span class="metric-chip">${publicationKindLabel(item.journalClass || "SCI")}</span>
        ${item.metrics.indexType ? `<span class="metric-chip">${item.metrics.indexType}</span>` : ""}
        ${item.metrics.impactFactor ? `<span class="metric-chip">IF ${item.metrics.impactFactor}</span>` : ""}
        ${item.metrics.percentile ? `<span class="metric-chip">Percentile ${item.metrics.percentile}</span>` : ""}
        ${item.metrics.topPercent ? `<span class="metric-chip">${text({ ko: `상위 ${item.metrics.topPercent}%`, en: `Top ${item.metrics.topPercent}%` })}</span>` : ""}
      </div>
    `;
  }

  function getPublicationPrimaryLink(item) {
    if (item.paperUrl) return item.paperUrl;
    if (item.doi) return `https://doi.org/${item.doi}`;
    return scholarSearchUrl(item.title);
  }

  function getPublicationPrimaryLabel() {
    return "Details";
  }

  function renderPublicationItem(item, kind) {
    const primaryLink = getPublicationPrimaryLink(item);
    const doiLink = item.doi ? `https://doi.org/${item.doi}` : "";
    const scholarLink = scholarSearchUrl(item.title);
    const secondaryLinks = [
      doiLink && doiLink !== primaryLink ? `<a href="${doiLink}" target="_blank" rel="noreferrer">DOI</a>` : "",
      scholarLink !== primaryLink ? `<a href="${scholarLink}" target="_blank" rel="noreferrer">Google Scholar</a>` : ""
    ]
      .filter(Boolean)
      .join("");

    return `
      <article class="publication-item publication-card" id="${item.id}">
        <div class="publication-card-header">
          <div class="publication-card-heading">
            <p class="publication-year">${item.year || ""}</p>
            ${typeof item.citations === "number" ? `<span class="citation-pill">${text({ ko: `인용 ${item.citations}회`, en: `${item.citations} Citations` })}</span>` : ""}
          </div>
          <div class="publication-card-labels">
            <span class="badge ${badgeClass(kind)} publication-kind-badge">${publicationKindLabel(kind)}</span>
          </div>
        </div>
        <div class="publication-card-body">
          <h3 class="publication-title publication-card-title"><a href="${primaryLink}" target="_blank" rel="noreferrer">${item.title}</a></h3>
          <p class="publication-authors publication-card-authors">${item.authors}</p>
          <p class="publication-venue publication-venue-row">${icon("book")}<span>${item.venue}</span></p>
          ${renderPublicationMetrics(item)}
        </div>
        <div class="publication-card-footer">
          <a class="publication-detail-link" href="${primaryLink}" target="_blank" rel="noreferrer"><span>${getPublicationPrimaryLabel()}</span><span class="detail-arrow">&gt;</span></a>
          ${secondaryLinks ? `<div class="publication-secondary-links">${secondaryLinks}</div>` : ""}
        </div>
      </article>
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

  function getSummaryCards() {
    return [
      { label: { ko: "SCI 논문", en: "SCI Papers" }, value: String(publicationSummary.SCI), detail: { ko: "저널 논문 기준", en: "Journal papers only" } },
      { label: { ko: "KCI 논문", en: "KCI Papers" }, value: String(publicationSummary.KCI), detail: { ko: "국내 학술지 기준", en: "Domestic indexed journals" } },
      { label: { ko: "총 저널 논문", en: "Total Journals" }, value: String(publicationSummary.total), detail: { ko: "conference 제외", en: "Conferences excluded" } },
      {
        label: { ko: "총 인용", en: "Total Citations" },
        value: String(scholarMetrics.citationsAll || publicationSummary.totalCitations),
        detail: {
          ko: scholarMetrics.citationsSince2021 ? `2021년 이후 ${scholarMetrics.citationsSince2021}` : "제공된 목록 기준",
          en: scholarMetrics.citationsSince2021 ? `Since 2021: ${scholarMetrics.citationsSince2021}` : "Based on the provided list"
        }
      },
      {
        label: { ko: "h-index", en: "h-index" },
        value: String(scholarMetrics.hIndexAll || ""),
        detail: {
          ko: scholarMetrics.hIndexSince2021 ? `2021년 이후 ${scholarMetrics.hIndexSince2021}` : "Google Scholar 기준",
          en: scholarMetrics.hIndexSince2021 ? `Since 2021: ${scholarMetrics.hIndexSince2021}` : "Based on Google Scholar"
        }
      }
    ];
  }

  function getSummaryCards() {
    return [
      {
        label: { ko: "국제 저널", en: "Intl. Journals" },
        value: String(publicationSummary.international),
        detail: { ko: `SCI(E) ${publicationSummary.SCI} + Scopus ${publicationSummary.OTHER}`, en: `SCI(E) ${publicationSummary.SCI} + Scopus ${publicationSummary.OTHER}` }
      },
      {
        label: { ko: "KCI 논문", en: "KCI Papers" },
        value: String(publicationSummary.KCI),
        detail: { ko: "국내 등재 학술지", en: "Domestic indexed journals" }
      },
      {
        label: { ko: "총 저널 논문", en: "Total Journals" },
        value: String(publicationSummary.total),
        detail: { ko: `국제 ${publicationSummary.international} + KCI ${publicationSummary.KCI}`, en: `International ${publicationSummary.international} + KCI ${publicationSummary.KCI}` }
      },
      {
        label: { ko: "총 인용", en: "Total Citations" },
        value: String(scholarMetrics.citationsAll || publicationSummary.totalCitations),
        detail: {
          ko: scholarMetrics.citationsSince2021 ? `2021년 이후 ${scholarMetrics.citationsSince2021}` : "Google Scholar 기준",
          en: scholarMetrics.citationsSince2021 ? `Since 2021: ${scholarMetrics.citationsSince2021}` : "Based on Google Scholar"
        }
      },
      {
        label: { ko: "h-index", en: "h-index" },
        value: String(scholarMetrics.hIndexAll || ""),
        detail: {
          ko: scholarMetrics.hIndexSince2021 ? `2021년 이후 ${scholarMetrics.hIndexSince2021}` : "Google Scholar 기준",
          en: scholarMetrics.hIndexSince2021 ? `Since 2021: ${scholarMetrics.hIndexSince2021}` : "Based on Google Scholar"
        }
      }
    ];
  }

  function renderSummaryCard(item) {
    const labelKo = typeof item.label === "object" ? String(item.label.ko || "") : "";
    const labelEn = typeof item.label === "object" ? String(item.label.en || "") : String(item.label || "");

    if (labelKo.includes("게재 연도") || labelEn === "Year Span") {
      return "";
    }

    return `<article class="summary-card"><p class="summary-label">${text(item.label)}</p><p class="summary-value">${item.value}</p><p class="summary-detail">${text(item.detail)}</p></article>`;
  }

  function handleAppClick(event) {
    const chatToggle = event.target.closest("[data-ai-chat-toggle]");
    if (chatToggle) {
      event.preventDefault();
      setAiChatOpen(!aiChatOpen, { focusInput: !aiChatOpen, focusLauncher: aiChatOpen });
      return;
    }

    const chatClose = event.target.closest("[data-ai-chat-close]");
    if (chatClose) {
      event.preventDefault();
      setAiChatOpen(false, { focusLauncher: true });
      return;
    }

    const starterButton = event.target.closest("[data-ai-chat-starter]");
    if (starterButton) {
      event.preventDefault();
      setAiChatOpen(true);
      handleAiChatPrompt(starterButton.dataset.aiChatStarter || "");
      return;
    }

    const sortChip = event.target.closest("[data-publication-sort]");

    if (!sortChip || page !== "publications") {
      return;
    }

    event.preventDefault();

    const nextSort = sortChip.dataset.publicationSort === "citations" ? "citations" : "year";

    if (nextSort === currentPublicationSort) {
      return;
    }

    currentPublicationSort = nextSort;

    const siteMain = app.querySelector(".site-main");
    if (siteMain) {
      siteMain.innerHTML = renderPage();
      finalizeRenderedPage();
    }
  }

  function handleAppSubmit(event) {
    const chatForm = event.target.closest("[data-ai-chat-form]");
    if (!chatForm) {
      return;
    }

    event.preventDefault();

    const input = chatForm.querySelector("[data-ai-chat-input]");
    if (!input) {
      return;
    }

    const prompt = String(input.value || "").trim();
    if (!prompt) {
      input.focus();
      return;
    }

    handleAiChatPrompt(prompt);
    input.value = "";
  }

  function handleAppInput(event) {
    if (event.target.closest("[data-ai-chat-widget]")) {
      noteAiChatInteraction();
    }
  }

  function handleAppFocusIn(event) {
    if (event.target.closest("[data-ai-chat-widget]")) {
      noteAiChatInteraction();
    }
  }

  function handleAppPointerMove(event) {
    if (event.target.closest("[data-ai-chat-widget]")) {
      noteAiChatInteraction();
    }
  }

  function handleAppKeydown(event) {
    if (event.target.closest("[data-ai-chat-widget]")) {
      noteAiChatInteraction();
    }
  }

  function handleDocumentPointerDown(event) {
    if (!aiChatOpen || event.target.closest("[data-ai-chat-widget]")) {
      return;
    }

    setAiChatOpen(false);
  }

  function handleDocumentKeydown(event) {
    if (event.key === "Escape" && aiChatOpen) {
      setAiChatOpen(false, { focusLauncher: true });
    }
  }

  function handleVisibilityChange() {
    if (document.hidden && aiChatOpen) {
      setAiChatOpen(false);
    }
  }

  function handleAiChatPrompt(prompt) {
    const normalizedPrompt = String(prompt || "").trim();
    if (!normalizedPrompt) {
      return;
    }

    if (!aiChatOpen) {
      setAiChatOpen(true);
    }

    appendAiChatMessage("user", normalizedPrompt);

    const reply = getAiChatReply(normalizedPrompt);
    appendAiChatMessage("assistant", text(reply.body), reply.actions || []);
    noteAiChatInteraction();
  }

  function appendAiChatMessage(role, message, actions) {
    const container = app.querySelector("[data-ai-chat-messages]");
    if (!container) {
      return;
    }

    const article = document.createElement("article");
    article.className = `ai-chat-message ${role === "user" ? "is-user" : "is-assistant"}`;

    const label = document.createElement("p");
    label.className = "ai-chat-message-label";
    label.textContent = role === "user" ? text({ ko: "사용자", en: "You" }) : "AI Assistant";

    const body = document.createElement("p");
    body.className = "ai-chat-message-body";
    body.textContent = message;

    article.append(label, body);

    if (Array.isArray(actions) && actions.length) {
      const actionRow = document.createElement("div");
      actionRow.className = "ai-chat-actions";

      actions.forEach((action) => {
        const link = document.createElement("a");
        link.className = "ai-chat-action";
        link.href = action.href;
        link.textContent = text(action.label);
        if (action.external) {
          link.target = "_blank";
          link.rel = "noreferrer";
        }
        actionRow.appendChild(link);
      });

      article.appendChild(actionRow);
    }

    container.appendChild(article);
    container.scrollTop = container.scrollHeight;
  }

  function getAiChatReply(prompt) {
    const query = String(prompt || "").toLowerCase();
    const primaryActivity = ACTIVITIES[0];
    const researchTitles = CONTENT.research.slice(0, 3).map((item) => text(item.title)).join(", ");
    const emailHref = getProfileHref("email") || "mailto:envy978@hanmail.net";
    const scholarHref =
      getProfileHref("google scholar") ||
      "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors=Nahyun+Kwon+Hanyang+University+ERICA";

    if (matchesAiPrompt(query, ["연락", "문의", "이메일", "메일", "contact", "email", "collaboration"])) {
      return {
        body: {
          ko: "가장 빠른 연락 방법은 이메일입니다. 공동연구나 논문 문의라면 관심 주제와 현재 단계, 기대 산출물을 함께 보내주시면 더 빠르게 안내할 수 있습니다.",
          en: "Email is the best contact channel. For collaboration or publication inquiries, include your topic, current stage, and expected outcome for a faster reply."
        },
        actions: [
          { label: { ko: "메일 보내기", en: "Send email" }, href: emailHref, external: false },
          { label: { ko: "연락처 페이지", en: "Open contact page" }, href: route("contact"), external: false }
        ]
      };
    }

    if (matchesAiPrompt(query, ["논문", "publication", "paper", "scholar", "citation", "인용"])) {
      return {
        body: {
          ko: `현재 사이트에는 국제 저널 ${publicationSummary.international}편, KCI ${publicationSummary.KCI}편, 총 저널 ${publicationSummary.total}편이 정리되어 있습니다. 인용 정보와 전체 목록은 논문 페이지나 Google Scholar에서 빠르게 확인할 수 있습니다.`,
          en: `The site currently summarizes ${publicationSummary.international} international journals, ${publicationSummary.KCI} KCI papers, and ${publicationSummary.total} journal papers in total. You can inspect the full list and citations from the publications page or Google Scholar.`
        },
        actions: [
          { label: { ko: "논문 페이지", en: "Open publications" }, href: route("publications"), external: false },
          { label: { ko: "Scholar 열기", en: "Open Scholar" }, href: scholarHref, external: true }
        ]
      };
    }

    if (matchesAiPrompt(query, ["연구", "주제", "키워드", "research", "topic", "keyword", "project"])) {
      return {
        body: {
          ko: `주요 연구 축은 ${researchTitles}입니다. 유지관리, 건설관리, 에너지, 도시 데이터 분석을 연결하는 방향으로 정리되어 있고, 연구 프로젝트 페이지에서 세부 설명을 확인할 수 있습니다.`,
          en: `The main research themes include ${researchTitles}. The site organizes them around maintenance, construction management, energy, and urban-data applications, with more detail on the research page.`
        },
        actions: [{ label: { ko: "연구 페이지", en: "Open research page" }, href: route("teaching"), external: false }]
      };
    }

    if (matchesAiPrompt(query, ["학력", "경력", "소개", "bio", "career", "education", "profile"])) {
      return {
        body: {
          ko: `${text(PROFILE.affiliation)} 소속으로 활동하고 있으며, 학위는 ${text(PROFILE.educationSummary)}입니다. 학력과 경력 흐름은 소개 페이지에서 한 번에 볼 수 있습니다.`,
          en: `${text(PROFILE.affiliation)} is the current affiliation, and the degree summary is ${text(PROFILE.educationSummary)}. The biography page shows the education and career timeline in one place.`
        },
        actions: [{ label: { ko: "소개 페이지", en: "Open biography" }, href: route("bio"), external: false }]
      };
    }

    if (primaryActivity && matchesAiPrompt(query, ["최근", "활동", "news", "recent", "activity", "update"])) {
      return {
        body: {
          ko: `최근 활동으로는 ${text(primaryActivity.title)}가 정리되어 있습니다. 최신 항목과 사이트 업데이트는 활동 페이지에서 이어서 확인할 수 있습니다.`,
          en: `One of the recent activities highlighted on the site is ${text(primaryActivity.title)}. You can continue from the activities page for the latest updates.`
        },
        actions: [{ label: { ko: "활동 페이지", en: "Open activities" }, href: route("news"), external: false }]
      };
    }

    return {
      body: {
        ko: "연구 주제, 논문 실적, 최근 활동, 연락 방법 중 하나를 물어보시면 바로 연결해드릴게요.",
        en: "Ask about research topics, publications, recent activities, or contact details and I will point you to the right section."
      },
      actions: [
        { label: { ko: "연구 보기", en: "Open research" }, href: route("teaching"), external: false },
        { label: { ko: "논문 보기", en: "Open publications" }, href: route("publications"), external: false }
      ]
    };
  }

  function matchesAiPrompt(query, keywords) {
    return keywords.some((keyword) => query.includes(keyword));
  }

  function setAiChatOpen(nextState, options = {}) {
    aiChatOpen = Boolean(nextState);
    syncAiChatUi();

    if (aiChatOpen) {
      noteAiChatInteraction();
      if (options.focusInput) {
        const input = app.querySelector("[data-ai-chat-input]");
        if (input) {
          input.focus();
        }
      }
      return;
    }

    clearAiChatIdleTimer();
    if (options.focusLauncher) {
      const launcher = app.querySelector("[data-ai-chat-toggle]");
      if (launcher) {
        launcher.focus();
      }
    }
  }

  function syncAiChatUi() {
    const widget = app.querySelector("[data-ai-chat-widget]");
    const panel = app.querySelector("[data-ai-chat-panel]");
    const launcher = app.querySelector("[data-ai-chat-toggle]");

    if (!widget || !panel || !launcher) {
      return;
    }

    widget.classList.toggle("is-open", aiChatOpen);
    panel.setAttribute("aria-hidden", String(!aiChatOpen));
    launcher.setAttribute("aria-expanded", String(aiChatOpen));
    launcher.setAttribute("aria-label", text(aiChatOpen ? { ko: "AI 채팅 닫기", en: "Close AI chat" } : { ko: "AI 채팅 열기", en: "Open AI chat" }));
  }

  function noteAiChatInteraction() {
    if (!aiChatOpen) {
      return;
    }

    clearAiChatIdleTimer();
    aiChatIdleTimer = window.setTimeout(() => {
      setAiChatOpen(false);
    }, AI_CHAT_IDLE_MS);
  }

  function clearAiChatIdleTimer() {
    if (aiChatIdleTimer) {
      window.clearTimeout(aiChatIdleTimer);
      aiChatIdleTimer = null;
    }
  }

  function renderPublicationSortControls() {
    return `
      <div class="publication-toolbar publication-toolbar-compact">
        <div class="sort-switch" role="tablist" aria-label="${text({ ko: "논문 정렬", en: "Publication sorting" })}">
          <button class="sort-chip ${currentPublicationSort === "year" ? "is-active" : ""}" type="button" data-publication-sort="year" aria-pressed="${currentPublicationSort === "year"}">
            ${icon("calendar")}
            <span>${text({ ko: "연도별", en: "By year" })}</span>
          </button>
          <button class="sort-chip ${currentPublicationSort === "citations" ? "is-active" : ""}" type="button" data-publication-sort="citations" aria-pressed="${currentPublicationSort === "citations"}">
            ${icon("chart")}
            <span>${text({ ko: "인용순", en: "By citations" })}</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderPublicationsPage() {
    const sciPublications = getPublicationsByClass("SCI");
    const kciPublications = getPublicationsByClass("KCI");

    return `
      <section class="content-section">
        ${renderSectionHeading(
          { ko: "논문 개요", en: "Publication Summary" },
          { ko: `Summary · ${publicationSummary.span}`, en: `Summary · ${publicationSummary.span}` }
        )}
        <div class="summary-grid page-summary">
          ${getSummaryCards().map((item) => renderSummaryCard(item)).join("")}
        </div>
      </section>
      <section class="content-section">
        ${renderPublicationSortControls()}
      </section>
      ${renderPublicationSection({ ko: "SCI(E) 논문실적", en: "SCI(E) Publications" }, { ko: `${sciPublications.length}편`, en: `${sciPublications.length} papers` }, sciPublications, "SCI")}
      ${renderPublicationSection({ ko: "KCI 논문실적", en: "KCI Publications" }, { ko: `${kciPublications.length}편`, en: `${kciPublications.length} papers` }, kciPublications, "KCI")}
    `;
  }

  function getSummaryCards() {
    return [
      {
        label: { ko: "국제 저널", en: "Intl. Journals" },
        value: String(publicationSummary.international),
        detail: { ko: `SCI(E) ${publicationSummary.SCI}`, en: `SCI(E) ${publicationSummary.SCI}` }
      },
      {
        label: { ko: "KCI 논문", en: "KCI Papers" },
        value: String(publicationSummary.KCI),
        detail: { ko: "국내 등재 학술지", en: "Domestic indexed journals" }
      },
      {
        label: { ko: "총 저널 논문", en: "Total Journals" },
        value: String(publicationSummary.total),
        detail: { ko: `국제 ${publicationSummary.international} + KCI ${publicationSummary.KCI}`, en: `International ${publicationSummary.international} + KCI ${publicationSummary.KCI}` }
      },
      {
        label: { ko: "총 인용", en: "Total Citations" },
        value: String(scholarMetrics.citationsAll || publicationSummary.totalCitations),
        detail: {
          ko: scholarMetrics.citationsSince2021 ? `2021년 이후 ${scholarMetrics.citationsSince2021}` : "Google Scholar 기준",
          en: scholarMetrics.citationsSince2021 ? `Since 2021: ${scholarMetrics.citationsSince2021}` : "Based on Google Scholar"
        }
      },
      {
        label: { ko: "h-index", en: "h-index" },
        value: String(scholarMetrics.hIndexAll || ""),
        detail: {
          ko: scholarMetrics.hIndexSince2021 ? `2021년 이후 ${scholarMetrics.hIndexSince2021}` : "Google Scholar 기준",
          en: scholarMetrics.hIndexSince2021 ? `Since 2021: ${scholarMetrics.hIndexSince2021}` : "Based on Google Scholar"
        }
      }
    ];
  }

  function collectKeywords() {
    return Array.from(new Set(CONTENT.research.flatMap((item) => item.tags)));
  }

  function publicationKindLabel(kind) {
    if (kind === "SCI") return "SCI(E)";
    if (kind === "OTHER") return "Scopus";
    return kind;
  }

  function badgeClass(kind) {
    const classes = { SCI: "badge-sci", KCI: "badge-kci", OTHER: "badge-other" };
    return classes[kind] || "badge-other";
  }

  function renderInfoCard(item) {
    const body = item.bodyHtml ? text(item.bodyHtml) : text(item.body);
    return `<article class="info-card${item.cardClass ? ` ${item.cardClass}` : ""}"><h3 class="card-title">${text(item.title)}</h3><div class="card-body">${body}</div></article>`;
  }

  function renderHeroSchematic() {
    return `
      <div class="hero-visual hero-schematic" aria-hidden="true">
        <div class="hero-schematic-shell">
          <div class="hero-schematic-glow hero-schematic-glow-a"></div>
          <div class="hero-schematic-glow hero-schematic-glow-b"></div>
          <div class="hero-schematic-grid">
            <section class="hero-schematic-card hero-schematic-card-data">
              <span class="hero-schematic-label">Data Layer</span>
              <strong>BIM / Text / Sensors</strong>
              <p>Field records and digital assets</p>
            </section>
            <section class="hero-schematic-card hero-schematic-card-model">
              <span class="hero-schematic-label">Model Layer</span>
              <strong>Prediction & Ranking</strong>
              <div class="hero-schematic-bars" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </section>
            <section class="hero-schematic-core hero-schematic-core-grid">
              <span class="hero-schematic-core-ring"></span>
              <span class="hero-schematic-core-ring hero-schematic-core-ring-inner"></span>
              <div class="hero-schematic-core-badge">AI</div>
              <p class="hero-schematic-core-title">Intelligence Core</p>
              <p class="hero-schematic-core-copy">Inference / Optimization / Decision Support</p>
            </section>
            <section class="hero-schematic-card hero-schematic-card-asset">
              <span class="hero-schematic-label">Built Asset</span>
              <strong>Monitoring & Simulation</strong>
              <div class="hero-schematic-buildings" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </section>
            <section class="hero-schematic-card hero-schematic-card-decision">
              <span class="hero-schematic-label">Decision Layer</span>
              <strong>Planning / Safety / Maintenance</strong>
              <p>Operational action and support</p>
            </section>
          </div>
          <section class="hero-schematic-core">
            <span class="hero-schematic-core-ring"></span>
            <span class="hero-schematic-core-ring hero-schematic-core-ring-inner"></span>
            <div class="hero-schematic-core-badge">AI</div>
            <p class="hero-schematic-core-title">Intelligence Core</p>
            <p class="hero-schematic-core-copy">Inference · Optimization · Decision Support</p>
          </section>
        </div>
      </div>
    `;
  }

  function renderHeroPanel() {
    return `
      <section class="panel hero-panel">
        <div class="hero-layout">
          <div class="hero-copy">
            <p class="hero-kicker">${text({ ko: "Research Profile", en: "Research Profile" })}</p>
            <h1 class="hero-title">Construction AI & Data Intelligence</h1>
            <p class="hero-caption">${text({
              ko: "한양대학교 AI Construction Technology Research Center",
              en: "AI Construction Technology Research Center, Hanyang University"
            })}</p>
            <p class="hero-lead">${text({
              ko: "유지관리, 성능평가, 예측모형, 의사결정을 잇는 데이터 기반 건축·건설 연구",
              en: "Data-driven research connecting maintenance, performance assessment, predictive modeling, and decision-making in the built environment."
            })}</p>
            <div class="button-row">
              <a class="button button-primary" href="${route("publications")}">${icon("papers")}<span>${text({ ko: "전체 논문 보기", en: "View publications" })}</span></a>
              <a class="button button-secondary" href="${getProfileHref("google scholar") || scholarSearchUrl(text(PROFILE.name))}" target="_blank" rel="noreferrer">${icon("scholar")}<span>Google Scholar</span></a>
            </div>
          </div>
          ${renderHeroSchematic()}
        </div>
        <div class="summary-grid hero-summary">
          ${getSummaryCards().map((item) => renderSummaryCard(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderHomePage() {
    const introItems = [
      {
        title: { ko: "학력 및 경력", en: "Education & Career" },
        bodyHtml: {
          ko: `<div class="education-list">
            <div class="education-row"><span class="education-year">2011.02</span><span class="education-text">한양대학교 건축학과 졸업</span></div>
            <div class="education-row"><span class="education-year">2014.02</span><span class="education-text">서울대학교 건축학과 건축시공 및 건설관리 전공</span></div>
            <div class="education-row"><span class="education-year">2018.08</span><span class="education-text">서울대학교 건축학과 건축시공 및 건설관리 전공</span></div>
            <div class="education-row"><span class="education-year">Present</span><span class="education-text">한양대학교 인공지능건설기술 연구센터</span></div>
          </div>`,
          en: `<div class="education-list">
            <div class="education-row"><span class="education-year">2011.02</span><span class="education-text">Department of Architecture, Hanyang University</span></div>
            <div class="education-row"><span class="education-year">2014.02</span><span class="education-text">Architectural Construction and Construction Management, Seoul National University</span></div>
            <div class="education-row"><span class="education-year">2018.08</span><span class="education-text">Architectural Construction and Construction Management, Seoul National University</span></div>
            <div class="education-row"><span class="education-year">Present</span><span class="education-text">AI Construction Technology Research Center, Hanyang University</span></div>
          </div>`
        },
        cardClass: "education-card"
      }
    ];

    return `
      ${renderHeroPanel()}
      <section class="content-section">
        ${renderSectionHeading({ ko: "소개", en: "Biography" }, { ko: "Biography", en: "Biography" }, route("bio"), { ko: "소개 자세히 보기", en: "Open biography" })}
        <div class="card-grid one-column">${introItems.map((item) => renderInfoCard(item)).join("")}</div>
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

  function getSummaryCards() {
    return [
      {
        label: "SCI(E) papers",
        value: String(publicationSummary.SCI),
        detail: "Journal articles"
      },
      {
        label: "KCI papers",
        value: String(publicationSummary.KCI),
        detail: "Domestic journals"
      },
      {
        label: "Total journal papers",
        value: String(publicationSummary.total),
        detail: `SCI(E) ${publicationSummary.SCI} + KCI ${publicationSummary.KCI}`
      },
      {
        label: "Total citations",
        value: String(scholarMetrics.citationsAll || publicationSummary.totalCitations),
        detail: scholarMetrics.citationsSince2021 ? `Since 2021: ${scholarMetrics.citationsSince2021}` : "Google Scholar"
      },
      {
        label: "h-index",
        value: String(scholarMetrics.hIndexAll || ""),
        detail: scholarMetrics.hIndexSince2021 ? `Since 2021: ${scholarMetrics.hIndexSince2021}` : "Google Scholar"
      }
    ];
  }

  function fundedResearchProjects() {
    return [
    {
      period: "2024-2029",
      role: { ko: "연구책임자", en: "Principal Investigator" },
      program: { ko: "연구재단 세종과학펠로우십 연구과제 선정", en: "NRF Sejong Science Fellowship" },
      title: {
        ko: "KoBERT 기반 자연어처리 및 Transformer 알고리즘을 활용한 건축물하자 및 유지관리 플랫폼 개발",
        en: "Development of a building defect and maintenance platform using KoBERT-based NLP and Transformer algorithms"
      },
      summary: {
        ko: "건축물 하자 정보와 유지관리 이력, 비정형 텍스트를 구조화해 진단, 우선순위 결정, 유지관리 의사결정을 지원함",
        en: "This project develops an AI platform that structures defect records, maintenance histories, and unstructured text for diagnosis, prioritization, and maintenance decision support."
      }
    },
    {
      period: "2020-2022",
      role: { ko: "연구책임자", en: "Principal Investigator" },
      program: { ko: "연구재단 창의도전 연구과제 선정", en: "NRF Creative Challenge Program" },
      title: {
        ko: "행동패턴인식 기술을 활용한 딥러닝 기반 건설작업자 생산성 추정 시스템 개발",
        en: "Development of a deep learning-based productivity estimation system for construction workers using behavior pattern recognition"
      },
      summary: {
        ko: "행동 인식과 딥러닝을 결합해 건설 작업자의 작업 상태와 생산성을 정량 추정하고 현장 인력관리 고도화에 연결함",
        en: "This project combines behavior recognition and deep learning to estimate worker productivity and support smarter workforce management on site."
      }
    },
    {
      period: "2019-2020",
      role: { ko: "연구책임자", en: "Principal Investigator" },
      program: { ko: "국토교통과학진흥원 국토교통기술촉진사업 선정", en: "KAIA Transportation and Construction Technology Promotion Program" },
      title: {
        ko: "건설근로자 사고예방을 위한 딥러닝 기반 피로도-위험도 통합형 인력 모니터링 원천기술 개발",
        en: "Development of deep learning-based integrated fatigue-risk workforce monitoring technology for accident prevention in construction"
      },
      summary: {
        ko: "웨어러블 기반 생체·행동 데이터를 활용해 근로자의 피로도와 위험도를 통합 평가하고 사고 예방용 실시간 모니터링 체계를 구축함",
        en: "This project builds a real-time monitoring framework that integrates fatigue and risk assessment using wearable biometric and behavioral data."
      }
    }
    ];
  }

  function researchInterestAreas() {
    return [
    {
      code: "A",
      title: { ko: "시공-BIM-IT 융합", en: "Construction-BIM-IT Convergence" },
      subtitle: { ko: "BIM-based maintenance platform", en: "BIM-based maintenance platform" },
      tags: ["BIM", "CBR", "GA", "Maintenance"],
      summary: {
        ko: "BIM 객체와 유지관리 데이터를 연계해 비용, 시기, 공종을 예측하고 의사결정을 지원함",
        en: "This area focuses on linking BIM objects and maintenance data to predict cost, timing, and work packages for decision support."
      },
      bodyHtml: {
        ko: `<div class="research-copy">
          <p>건축물 생애주기 전반의 관리비용, 시기, 관련 공종 예측을 위해 인공신경망, 사례기반추론, budget allocation 기법을 결합한 유지관리 연구 수행</p>
          <p>BIM 모델 객체 속성값과 드론, 레이저 스캐닝 기술을 연계해 노후화를 조기 파악하고 자산 관리·배분을 지원하는 BIM 기반 객체 연동형 유지관리 의사결정 플랫폼으로 확장 예정</p>
        </div>`,
        en: `<div class="research-copy">
          <p>This research stream predicts maintenance cost, timing, and related trades across the building life cycle by combining genetic algorithms, case-based reasoning, and budget allocation methods.</p>
          <p>The next step is an object-linked BIM maintenance decision platform that connects BIM attributes with drone and laser-scanning data to detect deterioration earlier and allocate assets more efficiently.</p>
        </div>`
      }
    },
    {
      code: "B",
      title: { ko: "시공-안전-IT 융합", en: "Construction-Safety-IT Convergence" },
      subtitle: { ko: "Safety and productivity intelligence", en: "Safety and productivity intelligence" },
      tags: ["Wearables", "Deep Learning", "Safety", "Productivity"],
      summary: {
        ko: "웨어러블 데이터와 딥러닝을 활용해 근로자의 피로도, 위험도, 행동 패턴, 생산성을 통합 분석함",
        en: "This area integrates wearable data and deep learning to assess fatigue, risk, behavior patterns, and worker productivity."
      },
      bodyHtml: {
        ko: `<div class="research-copy">
          <p>웨어러블 디바이스 데이터, 딥러닝, 생태순간평가 기법을 접목해 근로자의 위험도와 피로도를 평가함</p>
          <p>행동 패턴 인식과 딥러닝 알고리즘을 활용해 작업자 생산성을 추정하는 통합 시스템을 연구책임자로 수행함. 안전관리뿐 아니라 환경관리, 공정관리, 인력관리까지 연결되는 실증형 프로젝트 관리 연구임</p>
          <p>건설현장과 IT 기술을 접목한 안전·작업효율 중심 연구로 지속 확장 예정</p>
        </div>`,
        en: `<div class="research-copy">
          <p>This work evaluates worker fatigue and risk by integrating wearable-device data, deep learning, and ecological momentary assessment techniques.</p>
          <p>It also extends to productivity estimation through behavior recognition and deep learning, providing a practical framework that connects safety, environmental control, scheduling, and workforce management.</p>
          <p>The long-term goal is to keep advancing construction safety and productivity through tightly integrated IT-enabled field systems.</p>
        </div>`
      }
    },
    {
      code: "C",
      title: { ko: "시공-설계-IT 융합", en: "Construction-Design-IT Convergence" },
      subtitle: { ko: "Smart safety platform with BIM and sensing", en: "Smart safety platform with BIM and sensing" },
      tags: ["4D-BIM", "AI CCTV", "AR/VR", "Smart Safety"],
      summary: {
        ko: "4D-BIM, 웨어러블 센싱, AI CCTV, AR/VR을 통합한 건설현장 안전관리 자동화 플랫폼 구상",
        en: "This area proposes an integrated smart-safety platform using 4D-BIM, wearable sensing, AI CCTV, and AR/VR."
      },
      bodyHtml: {
        ko: `<div class="research-copy">
          <p>건설 안전 중요성 증대에 따라 계획 단계부터 현장 안전관리를 지원할 대책이 필요함. 4D-BIM 모델, 웨어러블 센싱, AI CCTV를 활용해 공사 중 위험요인을 사전 예측함</p>
          <p>심박수, 가속도, 각속도, 체온, 근육 피로도 등 생체신호를 AR/VR 및 BIM 모델과 통합해 현장 안전관리를 자동화하는 스마트 플랫폼으로 확장하는 것이 목표임</p>
        </div>`,
        en: `<div class="research-copy">
          <p>This direction addresses the growing need for safety planning from the earliest project stages by integrating 4D-BIM, wearable sensing, and AI CCTV to predict field hazards in advance.</p>
          <p>By connecting physiological signals such as heart rate, acceleration, angular velocity, body temperature, and muscle fatigue with AR/VR and BIM, the goal is to automate site safety management through a smart integrated platform.</p>
        </div>`
      }
    },
    {
      code: "D",
      title: { ko: "시공-안전-유지관리-IT 융합", en: "Construction-Safety-Maintenance-IT Convergence" },
      subtitle: { ko: "Drone and digital twin building management", en: "Drone and digital twin building management" },
      tags: ["Drone", "Digital Twin", "Laser Scanning", "Inspection"],
      summary: {
        ko: "드론, 레이저 스캐닝, 디지털 트윈을 활용한 건축물 결함·균열 자동 탐지·예측 유지관리 시스템 연구",
        en: "This area studies maintenance systems that use drones, laser scanning, and digital twins to detect and predict building defects and cracks."
      },
      bodyHtml: {
        ko: `<div class="research-copy">
          <p>대형·복합 건축물 증가에 따라 안전 점검과 유지관리 중요성이 커지고 있으나 관리인력 전문성 부족과 시스템 부재로 객관성·효율성 한계가 존재함</p>
          <p>드론, 레이저 스캐닝, 디지털 트윈 기술을 기반으로 건축물 결함과 균열을 자동 탐지·식별·예측하는 관리 시스템 구현 목표</p>
        </div>`,
        en: `<div class="research-copy">
          <p>As large and complex buildings become more common, professional inspection and maintenance technologies are increasingly important, yet current practice still suffers from limited expertise and fragmented systems.</p>
          <p>This research therefore develops building management systems that automatically detect, identify, and predict defects and cracks using drones, laser scanning, and digital twins.</p>
        </div>`
      }
    },
    {
      code: "E",
      title: { ko: "AI agent-피지컬AI 융합", en: "AI Agent-Physical AI Convergence" },
      subtitle: { ko: "Autonomous decision-making smart construction systems", en: "Autonomous decision-making smart construction systems" },
      tags: ["AI Agent", "Physical AI", "IoT", "Closed-loop"],
      summary: {
        ko: "AI agent와 피지컬AI를 연결해 설계, 시공, 안전, 유지관리 전 단계의 자율 의사결정을 지원하는 통합 시스템 연구",
        en: "This area explores integrated systems where AI agents and physical AI support autonomous decision-making across design, construction, safety, and maintenance."
      },
      bodyHtml: {
        ko: `<div class="research-copy">
          <p>BIM, 디지털 트윈, 드론, 웨어러블, IoT를 연계해 AI agent가 현장 및 자산관리 데이터를 해석하고 의사결정을 보조하며 피지컬AI가 실제 공간에서 점검, 탐지, 경보, 대응을 수행하는 통합형 시스템 연구</p>
          <p>다중 에이전트가 공정 지연, 안전위험, 결함 발생 가능성, 에너지 성능 저하를 예측하고 대응 시나리오를 제안하는 프레임워크 구축. 드론, 이동로봇, 고정형 센서, 웨어러블 장치와 디지털 트윈을 연계한 폐쇄루프 운영체계 구현 목표</p>
          <p>스마트 건설안전, 스마트 유지관리, 스마트시티 운영 분야로 확장 가능한 핵심 기반임</p>
        </div>`,
        en: `<div class="research-copy">
          <p>The long-term vision is an integrated system in which AI agents interpret field and asset-management data for decision support while physical AI performs inspection, detection, alerting, and response in real environments.</p>
          <p>This includes a multi-agent framework for predicting schedule delays, safety risks, defect occurrence, and energy-performance degradation, linked to drones, mobile robots, fixed sensors, wearables, and digital twins in a closed-loop operating system.</p>
          <p>It is intended to become a core research axis for smart construction safety, smart maintenance, and future smart-city operations.</p>
        </div>`
      }
    }
    ];
  }

  function teachingPageMeta() {
    return {
      icon: "research",
      label: { ko: "Research Project", en: "Research Project" },
      subtitle: { ko: "Projects & Interests", en: "Projects & Interests" },
      description: {
        ko: "국가연구과제와 중점 연구주제 정리",
        en: "A structured overview of funded projects and ongoing research interests in construction AI, safety, BIM, and maintenance."
      }
    };
  }

  function collectKeywords() {
    return Array.from(new Set(researchInterestAreas().flatMap((item) => item.tags)));
  }

  function renderPageLead(pageKey) {
    const meta = pageKey === "teaching" ? teachingPageMeta() : PAGE_META[pageKey];

    return `
      <section class="panel page-lead">
        <p class="page-kicker">${text(meta.subtitle)}</p>
        <h1 class="page-title">${text(meta.label)}</h1>
        <p class="page-description">${text(meta.description)}</p>
        ${
          pageKey === "publications"
            ? `
              <div class="meta-row">
                <span class="meta-pill">${icon("papers")}${text({ ko: `Intl. journals ${publicationSummary.international}`, en: `Intl. journals ${publicationSummary.international}` })}</span>
                <span class="meta-pill">${icon("research")}SCI(E) ${publicationSummary.SCI}</span>
                ${publicationSummary.OTHER ? `<span class="meta-pill">${icon("link")}Scopus ${publicationSummary.OTHER}</span>` : ""}
                <span class="meta-pill">${icon("book")}KCI ${publicationSummary.KCI}</span>
              </div>
            `
            : ""
        }
      </section>
    `;
  }

  function renderResearchProjectCard(item) {
    return `
      <article class="info-card project-card">
        <div class="project-card-meta">
          <span class="tiny-badge">${item.period}</span>
          <span class="tiny-badge">${text(item.role)}</span>
        </div>
        <p class="project-program">${text(item.program)}</p>
        <h3 class="project-focus">${text(item.title)}</h3>
        <p class="card-body project-summary">${text(item.summary)}</p>
      </article>
    `;
  }

  function renderResearchInterestCard(item) {
    return `
      <article class="topic-card interest-card">
        <div class="interest-header">
          <div class="interest-heading">
            <span class="interest-code">${item.code}</span>
            <p class="interest-subtitle">${text(item.subtitle)}</p>
            <h3 class="card-title">${text(item.title)}</h3>
          </div>
          <div class="tag-list">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        ${text(item.bodyHtml)}
      </article>
    `;
  }

  function renderResearchPage() {
    const projects = fundedResearchProjects();
    const interests = researchInterestAreas();

    return `
      <section class="content-section">
        ${renderSectionHeading({ ko: "Research Project", en: "Research Project" }, { ko: "Funded Projects", en: "Funded Projects" })}
        <div class="card-grid three-column research-project-grid">${projects.map((item) => renderResearchProjectCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "관심연구", en: "Research Interests" }, { ko: "Research Interests", en: "Research Interests" })}
        <div class="card-grid two-column research-interest-grid">${interests.map((item) => renderResearchInterestCard(item)).join("")}</div>
      </section>
    `;
  }

  function renderHomePage() {
    const projects = fundedResearchProjects();
    const introItems = [
      {
        title: { ko: "학력 및 경력", en: "Education & Career" },
        bodyHtml: {
          ko: `<div class="education-list">
            <div class="education-row"><span class="education-year">2011.02</span><span class="education-text">한양대학교 건축학과 졸업</span></div>
            <div class="education-row"><span class="education-year">2014.02</span><span class="education-text">서울대학교 건축학과 건축시공 및 건설관리 전공</span></div>
            <div class="education-row"><span class="education-year">2018.08</span><span class="education-text">서울대학교 건축학과 건축시공 및 건설관리 전공</span></div>
            <div class="education-row"><span class="education-year">Present</span><span class="education-text">한양대학교 인공지능건설기술 연구센터</span></div>
          </div>`,
          en: `<div class="education-list">
            <div class="education-row"><span class="education-year">2011.02</span><span class="education-text">Department of Architecture, Hanyang University</span></div>
            <div class="education-row"><span class="education-year">2014.02</span><span class="education-text">Architectural Construction and Construction Management, Seoul National University</span></div>
            <div class="education-row"><span class="education-year">2018.08</span><span class="education-text">Architectural Construction and Construction Management, Seoul National University</span></div>
            <div class="education-row"><span class="education-year">Present</span><span class="education-text">AI Construction Technology Research Center, Hanyang University</span></div>
          </div>`
        },
        cardClass: "education-card"
      }
    ];

    return `
      ${renderHeroPanel()}
      <section class="content-section">
        ${renderSectionHeading({ ko: "소개", en: "Biography" }, { ko: "Biography", en: "Biography" }, route("bio"), { ko: "소개 자세히 보기", en: "Open biography" })}
        <div class="card-grid one-column">${introItems.map((item) => renderInfoCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "Research Project", en: "Research Project" }, { ko: "Funded Projects", en: "Funded Projects" }, route("teaching"), { ko: "Open research page", en: "Open research page" })}
        <div class="card-grid three-column research-project-grid">${projects.map((item) => renderResearchProjectCard(item)).join("")}</div>
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

  function renderHomePage() {
    const projects = fundedResearchProjects();
    const introItems = [
      {
        title: { ko: "학력 및 경력", en: "Education & Career" },
        bodyHtml: {
          ko: `<div class="education-list">
            <div class="education-row"><span class="education-meta"><span class="education-year">2011.02</span><span class="education-degree">공학사</span></span><span class="education-text"><span class="education-school">한양대학교 건축학과</span></span></div>
            <div class="education-row"><span class="education-meta"><span class="education-year">2014.02</span><span class="education-degree">공학석사</span></span><span class="education-text"><span class="education-school">서울대학교 건축학과</span><span class="education-track">건축시공 및 건설관리 전공</span></span></div>
            <div class="education-row"><span class="education-meta"><span class="education-year">2018.08</span><span class="education-degree">공학박사</span></span><span class="education-text"><span class="education-school">서울대학교 건축학과</span><span class="education-track">건축시공 및 건설관리 전공</span></span></div>
            <div class="education-row"><span class="education-meta"><span class="education-year">Present</span><span class="education-degree">Current</span></span><span class="education-text"><span class="education-school">한양대학교</span><span class="education-track">인공지능건설기술 연구센터</span></span></div>
          </div>`,
          en: `<div class="education-list">
            <div class="education-row"><span class="education-meta"><span class="education-year">2011.02</span><span class="education-degree">B.Eng.</span></span><span class="education-text"><span class="education-school">Department of Architecture</span><span class="education-track">Hanyang University</span></span></div>
            <div class="education-row"><span class="education-meta"><span class="education-year">2014.02</span><span class="education-degree">M.Eng.</span></span><span class="education-text"><span class="education-school">Department of Architecture, Seoul National University</span><span class="education-track">Architectural Construction and Construction Management</span></span></div>
            <div class="education-row"><span class="education-meta"><span class="education-year">2018.08</span><span class="education-degree">Ph.D.</span></span><span class="education-text"><span class="education-school">Department of Architecture, Seoul National University</span><span class="education-track">Architectural Construction and Construction Management</span></span></div>
            <div class="education-row"><span class="education-meta"><span class="education-year">Present</span><span class="education-degree">Current</span></span><span class="education-text"><span class="education-school">Hanyang University</span><span class="education-track">AI Construction Technology Research Center</span></span></div>
          </div>`
        },
        cardClass: "education-card"
      }
    ];

    return `
      ${renderHeroPanel()}
      <section class="content-section">
        ${renderSectionHeading({ ko: "소개", en: "Biography" }, { ko: "Biography", en: "Biography" }, route("bio"), { ko: "소개 자세히 보기", en: "Open biography" })}
        <div class="card-grid one-column">${introItems.map((item) => renderInfoCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "Research Project", en: "Research Project" }, { ko: "Funded Projects", en: "Funded Projects" }, route("teaching"), { ko: "Open research page", en: "Open research page" })}
        <div class="card-grid three-column research-project-grid">${projects.map((item) => renderResearchProjectCard(item)).join("")}</div>
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

  function renderHomePage() {
    const projects = fundedResearchProjects();

    return `
      ${renderHeroPanel()}
      <section class="content-section home-primary-section">
        ${renderSectionHeading(
          { ko: "연구 과제", en: "Research Projects" },
          { ko: "Funded Projects", en: "Funded Projects" },
          route("teaching"),
          { ko: "연구 페이지 보기", en: "Open research" }
        )}
        <div class="card-grid three-column research-project-grid">${projects.map((item) => renderResearchProjectCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading(
          { ko: "논문 실적", en: "Publications" },
          { ko: "Selected Publications", en: "Selected Publications" },
          route("publications"),
          { ko: "전체 논문 보기", en: "View all publications" }
        )}
        ${renderPublicationHomeSummary()}
      </section>
      <section class="content-section">
        ${renderSectionHeading(
          { ko: "최근 활동", en: "Recent Activities" },
          { ko: "Activities", en: "Activities" },
          route("news"),
          { ko: "활동 더 보기", en: "Open activities" }
        )}
        <div class="timeline-stack">${ACTIVITIES.map((item) => renderActivityCard(item)).join("")}</div>
      </section>
      ${renderContactCta()}
    `;
  }

  function renderHeroPanel() {
    return `
      <section class="panel hero-panel hero-panel-premium">
        <div class="hero-layout">
          <div class="hero-copy">
            <p class="hero-kicker">${text({ ko: "Research Profile", en: "Research Profile" })}</p>
            <h1 class="hero-title">Construction AI & Data Intelligence</h1>
            <div class="button-row">
              <a class="button button-primary" href="${route("publications")}">${icon("papers")}<span>${text({ ko: "전체 논문 보기", en: "View publications" })}</span></a>
              <a class="button button-secondary" href="${getProfileHref("google scholar") || scholarSearchUrl(text(PROFILE.name))}" target="_blank" rel="noreferrer">${icon("scholar")}<span>Google Scholar</span></a>
            </div>
          </div>
          ${renderHeroSchematic()}
        </div>
        <div class="summary-grid hero-summary">
          ${getSummaryCards().map((item) => renderSummaryCard(item)).join("")}
        </div>
      </section>
    `;
  }

  function renderHeroSchematic() {
    return `
      <div class="hero-visual hero-schematic" aria-hidden="true">
        <div class="hero-diagram-shell">
          <svg class="hero-diagram-svg" viewBox="0 0 620 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Construction AI pipeline">
            <defs>
              <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#f2f7fc"/>
              </linearGradient>
              <linearGradient id="hero-border" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#dbe6f4"/>
                <stop offset="100%" stop-color="#c6d6e8"/>
              </linearGradient>
              <linearGradient id="hero-blue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#d7e7ff"/>
                <stop offset="100%" stop-color="#7ba4e0"/>
              </linearGradient>
              <linearGradient id="hero-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#efd3a3"/>
                <stop offset="100%" stop-color="#bf8240"/>
              </linearGradient>
              <linearGradient id="hero-navy" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#21456f"/>
                <stop offset="100%" stop-color="#102744"/>
              </linearGradient>
              <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#102744" flood-opacity="0.12"/>
              </filter>
            </defs>
            <rect x="18" y="18" width="584" height="484" rx="38" fill="url(#hero-bg)" stroke="url(#hero-border)" stroke-width="1.5"/>
            <circle cx="504" cy="66" r="94" fill="#d8c4a1" opacity="0.18"/>
            <circle cx="112" cy="432" r="108" fill="#cadef5" opacity="0.26"/>
            <g filter="url(#hero-shadow)" font-family="'SUIT Variable','Pretendard Variable','Pretendard',sans-serif">
              <rect x="56" y="86" width="214" height="120" rx="24" fill="#ffffff" fill-opacity="0.9" stroke="#cfdbeb"/>
              <text x="80" y="122" fill="#9b744a" font-size="13" font-weight="800" letter-spacing="3">DATA LAYER</text>
              <text x="80" y="154" fill="#17304e" font-size="18" font-weight="800">BIM / Text / Sensors</text>
              <text x="80" y="184" fill="#678099" font-size="13.5" font-weight="500">Field records and digital assets</text>
              <circle cx="222" cy="150" r="7" fill="url(#hero-blue)"/>
              <circle cx="240" cy="150" r="10" fill="url(#hero-blue)"/>
              <circle cx="261" cy="150" r="13" fill="url(#hero-blue)"/>
              <circle cx="286" cy="150" r="10" fill="url(#hero-gold)"/>

              <rect x="350" y="86" width="214" height="120" rx="24" fill="#ffffff" fill-opacity="0.9" stroke="#cfdbeb"/>
              <text x="374" y="122" fill="#9b744a" font-size="13" font-weight="800" letter-spacing="3">MODEL LAYER</text>
              <text x="374" y="154" fill="#17304e" font-size="18" font-weight="800">Prediction / Ranking</text>
              <text x="374" y="184" fill="#678099" font-size="13.5" font-weight="500">Risk, quality, and performance</text>
              <rect x="498" y="136" width="16" height="40" rx="8" fill="url(#hero-gold)"/>
              <rect x="472" y="124" width="16" height="52" rx="8" fill="url(#hero-blue)"/>
              <rect x="446" y="114" width="16" height="62" rx="8" fill="url(#hero-blue)"/>
              <rect x="420" y="132" width="16" height="44" rx="8" fill="url(#hero-blue)"/>

              <rect x="56" y="314" width="214" height="120" rx="24" fill="#ffffff" fill-opacity="0.9" stroke="#cfdbeb"/>
              <text x="80" y="350" fill="#9b744a" font-size="13" font-weight="800" letter-spacing="3">BUILT ASSET</text>
              <text x="80" y="382" fill="#17304e" font-size="18" font-weight="800">Monitoring / Simulation</text>
              <text x="80" y="412" fill="#678099" font-size="13.5" font-weight="500">Performance signals and lifecycle context</text>
              <rect x="204" y="352" width="18" height="56" rx="9" fill="url(#hero-blue)"/>
              <rect x="178" y="334" width="18" height="74" rx="9" fill="url(#hero-blue)"/>
              <rect x="152" y="364" width="18" height="44" rx="9" fill="url(#hero-blue)"/>
              <rect x="230" y="322" width="18" height="86" rx="9" fill="url(#hero-gold)"/>

              <rect x="350" y="314" width="214" height="120" rx="24" fill="#ffffff" fill-opacity="0.9" stroke="#cfdbeb"/>
              <text x="374" y="350" fill="#9b744a" font-size="13" font-weight="800" letter-spacing="3">DECISION LAYER</text>
              <text x="374" y="382" fill="#17304e" font-size="18" font-weight="800">Planning / Safety / Maintenance</text>
              <text x="374" y="412" fill="#678099" font-size="13.5" font-weight="500">Research outputs applied to practice</text>
              <rect x="500" y="352" width="18" height="56" rx="9" fill="url(#hero-gold)"/>
              <rect x="474" y="366" width="18" height="42" rx="9" fill="url(#hero-blue)"/>
              <rect x="448" y="358" width="18" height="50" rx="9" fill="url(#hero-blue)"/>
              <rect x="422" y="374" width="18" height="34" rx="9" fill="url(#hero-blue)"/>

              <path d="M270 146 C308 164 322 188 330 220" stroke="#b9c9dc" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path d="M350 146 C312 164 298 188 290 220" stroke="#b9c9dc" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path d="M270 374 C308 356 322 332 330 300" stroke="#b9c9dc" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path d="M350 374 C312 356 298 332 290 300" stroke="#b9c9dc" stroke-width="3" fill="none" stroke-linecap="round"/>

              <circle cx="310" cy="260" r="84" fill="url(#hero-navy)"/>
              <circle cx="310" cy="260" r="104" fill="none" stroke="#d1deeb" stroke-dasharray="4 6"/>
              <circle cx="310" cy="260" r="48" fill="url(#hero-gold)"/>
              <text x="310" y="248" text-anchor="middle" fill="#eff4fa" font-size="14" font-weight="800" letter-spacing="3">INTELLIGENCE</text>
              <text x="310" y="264" text-anchor="middle" fill="#eff4fa" font-size="14" font-weight="800" letter-spacing="3">CORE</text>
              <text x="310" y="300" text-anchor="middle" fill="#13253c" font-size="28" font-weight="900">AI</text>
            </g>
          </svg>
        </div>
      </div>
    `;
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
      calendar: '<rect x="2.5" y="3.25" width="11" height="10.25" rx="1.75"></rect><path d="M5.25 2v2.5"></path><path d="M10.75 2v2.5"></path><path d="M2.5 6.5h11"></path>',
      chart: '<path d="M2.75 12.5h10.5"></path><path d="M4.75 11V8.25"></path><path d="M8 11V5.75"></path><path d="M11.25 11V3.75"></path>',
      code: '<path d="m5.5 4-3 4 3 4"></path><path d="m10.5 4 3 4-3 4"></path><path d="m8.9 2.75-1.8 10.5"></path>',
      link: '<path d="M6.2 9.8 9.8 6.2"></path><path d="M5.1 11.5H4a2.5 2.5 0 1 1 0-5h1.1"></path><path d="M10.9 4.5H12a2.5 2.5 0 1 1 0 5h-1.1"></path>',
      book: '<path d="M4 3.25h7.5a1 1 0 0 1 1 1v7.5a.75.75 0 0 1-.75.75H4.5A1.5 1.5 0 0 1 3 11V4.25a1 1 0 0 1 1-1Z"></path><path d="M4.5 12.5V4.25"></path>'
    };

    return `<svg class="icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.link}</svg>`;
  }
})();
