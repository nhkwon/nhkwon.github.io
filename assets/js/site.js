(function () {
  function bootSite() {
  const app = document.getElementById("app");

  if (!app || typeof SITE_DATA === "undefined") {
    return;
  }

  const page = document.body.dataset.page || "home";
  const lang = document.body.dataset.lang === "en" ? "en" : "ko";
  const sortParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("sort") : "";
  const publicationSort =
    sortParam === "citations" || sortParam === "if" ? sortParam : "year";
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
    trends: { ko: "trends.html", en: "trends-en.html" },
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
    trends: {
      icon: "chart",
      label: { ko: "Research Trends", en: "Research Trends" },
      subtitle: { ko: "Paper Trend Radar", en: "Paper Trend Radar" },
      description: {
        ko: "주요 건설관리, 건축공학, 토목공학, 프로젝트관리 저널의 최신 논문 흐름을 자동 수집해 요약합니다.",
        en: "A live and archived scan of recent papers from construction management, building engineering, civil engineering, and project management journals."
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

  const DEFAULT_ACTIVITIES = [
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
  const ACTIVITIES = Array.isArray(SITE_DATA.activities) && SITE_DATA.activities.length ? SITE_DATA.activities : DEFAULT_ACTIVITIES;
  function getActivities() {
    return Array.isArray(SITE_DATA.activities) && SITE_DATA.activities.length ? SITE_DATA.activities : ACTIVITIES;
  }
  const CONTACT_BOARD_STORAGE_KEY = "nhkwon-contact-board-v1";
  const CONTACT_BOARD_MAX_FILE_SIZE = 2 * 1024 * 1024;
  const CONTACT_BOARD_API = "/api/contact-board";
  const PAPER_TRENDS_API = "/api/paper-trends";

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function readContactBoardPosts() {
    try {
      const raw = window.localStorage.getItem(CONTACT_BOARD_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeContactBoardPosts(posts) {
    window.localStorage.setItem(CONTACT_BOARD_STORAGE_KEY, JSON.stringify(posts));
  }

  function formatContactBoardDate(value) {
    try {
      return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch (error) {
      return "";
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result || "")));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(file);
    });
  }

  function renderContactBoardEmpty() {
    return `<p class="empty-state">${text({ ko: "\ub4f1\ub85d\ub41c \ubb38\uc758\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.", en: "No messages yet." })}</p>`;
  }

  function renderContactBoardLoading() {
    return `<p class="empty-state">${text({ ko: "\uac8c\uc2dc\uae00\uc744 \ubd88\ub7ec\uc624\ub294 \uc911\uc785\ub2c8\ub2e4.", en: "Loading messages." })}</p>`;
  }

  async function requestContactBoard(path = "", options = {}) {
    const response = await fetch(`${CONTACT_BOARD_API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(payload?.error || "Contact board request failed.");
      error.status = response.status;
      throw error;
    }

    return payload;
  }

  function contactBoardErrorMessage(error, action) {
    const status = Number(error?.status || 0);

    if (status === 401) {
      return text({
        ko: "인증코드가 맞지 않습니다.",
        en: "The authentication code is incorrect."
      });
    }

    if (status === 403) {
      return text({
        ko: "현재 접속 주소가 게시판 API 허용 도메인에 포함되어 있지 않습니다.",
        en: "The current origin is not allowed to use the board API."
      });
    }

    if (status === 404) {
      return text({
        ko: "로컬 미리보기 서버에는 게시판 API가 없습니다. Vercel 배포 주소에서 확인해주세요.",
        en: "The local preview server does not include the board API. Check the Vercel deployment URL."
      });
    }

    if (status >= 500) {
      return text({
        ko: "게시판 서버 설정 또는 Supabase 연결에 문제가 있습니다. Vercel 환경변수와 재배포 상태를 확인해주세요.",
        en: "The board server or Supabase connection is not configured correctly. Check Vercel environment variables and redeploy."
      });
    }

    return text({
      ko: action === "delete" ? "게시글을 삭제할 수 없습니다." : "게시글을 등록할 수 없습니다.",
      en: action === "delete" ? "The post could not be deleted." : "The post could not be saved."
    });
  }

  async function loadContactBoardPosts() {
    const payload = await requestContactBoard();
    return Array.isArray(payload?.posts) ? payload.posts : [];
  }

  async function createContactBoardPost(post, authCode) {
    const payload = await requestContactBoard("", {
      method: "POST",
      body: JSON.stringify({ ...post, authCode })
    });
    return payload?.post || post;
  }

  async function deleteContactBoardPost(id, authCode) {
    await requestContactBoard("", {
      method: "DELETE",
      body: JSON.stringify({ id, authCode })
    });
  }

  async function refreshContactBoardList() {
    const list = app.querySelector("[data-contact-board-list]");
    if (!list) {
      return;
    }

    list.innerHTML = renderContactBoardLoading();

    try {
      const posts = await loadContactBoardPosts();
      list.innerHTML = posts.length ? posts.map((post, index) => renderContactBoardPost(post, index)).join("") : renderContactBoardEmpty();
    } catch (error) {
      const localPosts = readContactBoardPosts();
      list.innerHTML = localPosts.length ? localPosts.map((post, index) => renderContactBoardPost(post, index)).join("") : renderContactBoardEmpty();
      const status = app.querySelector("[data-contact-board-status]");
      if (status) {
        status.textContent = text({
          ko: "Supabase \uc5f0\uacb0 \uc124\uc815\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.",
          en: "Check the Supabase connection settings."
        });
      }
    }
  }

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
          href: getProfileHref("google scholar") || "https://scholar.google.com/citations?user=IplmvucAAAAJ&hl=en"
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
  ensureRuntimeStyleOverrides();
  finalizeRenderedPage();
  app.addEventListener("click", handleAppClick);
  app.addEventListener("submit", handleAppSubmit);
  app.addEventListener("input", handleAppInput);
  app.addEventListener("change", handleAppChange);
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

  function ensureRuntimeStyleOverrides() {
    const styleId = "site-runtime-overrides";
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      .hero-panel .hero-kicker {
        max-width: 38rem !important;
        margin: 0 0 0.25rem !important;
        font-family: "Inter", "Pretendard", "Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif !important;
        font-size: clamp(0.9rem, 1.05vw, 1rem) !important;
        font-weight: 600 !important;
        line-height: 1.42 !important;
        letter-spacing: 0.01em !important;
        text-transform: none !important;
        color: #8f6d4c !important;
      }

      .hero-panel .hero-title {
        max-width: 9.2ch !important;
        font-size: clamp(3.18rem, 6vw, 5.15rem) !important;
        font-weight: 780 !important;
        line-height: 0.94 !important;
        letter-spacing: -0.06em !important;
        color: #132741 !important;
      }

      .hero-panel .hero-caption {
        display: inline-flex !important;
        width: fit-content !important;
        margin-top: 1rem !important;
        padding: 0.76rem 1.18rem !important;
        border-radius: 999px !important;
        background: linear-gradient(180deg, rgba(224, 232, 241, 0.96), rgba(214, 223, 235, 0.88)) !important;
        font-family: "Inter", "Pretendard", "Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        letter-spacing: -0.015em !important;
        text-transform: none !important;
        color: #26486e !important;
      }

      .hero-summary {
        margin-top: 1.5rem !important;
        gap: 18px !important;
        align-items: stretch !important;
      }

      .summary-card {
        display: grid !important;
        grid-template-rows: minmax(3.55rem, auto) auto 1fr !important;
        align-content: start !important;
        gap: 0.82rem !important;
        min-height: 214px !important;
        padding: 26px 26px 24px !important;
      }

      .summary-label {
        display: block !important;
        min-height: 3.55rem !important;
        margin: 0 !important;
        font-family: "Inter", "Pretendard", "Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif !important;
        font-size: 0.98rem !important;
        font-weight: 600 !important;
        line-height: 1.32 !important;
        letter-spacing: -0.01em !important;
        text-transform: none !important;
        color: #8f6d4c !important;
      }

      .summary-value {
        margin: 0 !important;
        align-self: start !important;
        font-family: "Inter", "Pretendard", "Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif !important;
        font-size: clamp(3rem, 3.3vw, 3.95rem) !important;
        font-weight: 730 !important;
        line-height: 0.9 !important;
        letter-spacing: -0.055em !important;
        color: #132741 !important;
      }

      .summary-detail {
        margin: 0 !important;
        align-self: end !important;
        font-family: "Inter", "Pretendard", "Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif !important;
        font-size: 0.98rem !important;
        line-height: 1.5 !important;
        color: #667d93 !important;
      }

      .hero-diagram-shell {
        width: 100% !important;
        padding: 10px !important;
        border-radius: 40px !important;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(242, 247, 252, 0.98)),
          radial-gradient(circle at top right, rgba(219, 193, 156, 0.14), rgba(219, 193, 156, 0) 44%) !important;
        border: 1px solid rgba(201, 212, 225, 0.92) !important;
        box-shadow: 0 30px 70px rgba(17, 41, 71, 0.1) !important;
      }

      .hero-diagram-svg {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        border-radius: 30px !important;
      }

      .section-subtitle,
      .mark-subtitle,
      .interest-subtitle,
      .page-kicker,
      .meta-pill,
      .metric-chip {
        font-family: "Inter", "Pretendard", "Pretendard Variable", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif !important;
        letter-spacing: 0.01em !important;
        text-transform: none !important;
      }

      .section-subtitle,
      .mark-subtitle,
      .interest-subtitle,
      .page-kicker {
        font-size: 0.82rem !important;
        font-weight: 600 !important;
        color: #7f6244 !important;
      }

      .meta-pill,
      .metric-chip {
        font-size: 0.78rem !important;
        font-weight: 600 !important;
      }

      @media (max-width: 1120px) {
        .summary-card {
          min-height: 198px !important;
        }
      }

      @media (max-width: 820px) {
        .hero-panel .hero-kicker {
          max-width: none !important;
          font-size: 0.84rem !important;
        }

        .hero-panel .hero-title {
          max-width: none !important;
          font-size: clamp(2.5rem, 10vw, 3.75rem) !important;
        }

        .hero-panel .hero-caption {
          font-size: 0.95rem !important;
        }

        .summary-card {
          grid-template-rows: minmax(2.9rem, auto) auto 1fr !important;
          min-height: 172px !important;
          padding: 22px 20px 20px !important;
        }

        .summary-label {
          min-height: 2.9rem !important;
          font-size: 0.92rem !important;
        }

        .summary-value {
          font-size: clamp(2.6rem, 11vw, 3.25rem) !important;
        }

        .summary-detail {
          font-size: 0.92rem !important;
        }

        .hero-diagram-shell {
          padding: 8px !important;
        }
      }
    `;
  }

  function finalizeRenderedPage() {
    const sidebarRows = Array.from(app.querySelectorAll(".sidebar-contact-row"));
    const signatureNote = app.querySelector(".sidebar-signature-note");

    if (sidebarRows[0]?.querySelector(".sidebar-contact-value")) {
      sidebarRows[0].querySelector(".sidebar-contact-value").textContent =
        lang === "ko"
          ? "15588 경기도 안산시 상록구 한양대학로 55"
          : "55 Hanyangdaehak-ro, Sangnok-gu, Ansan-si, Gyeonggi-do 15588";
    }

    if (sidebarRows[2]?.querySelector(".sidebar-contact-value")) {
      sidebarRows[2].querySelector(".sidebar-contact-value").textContent = "+82 10-7392-9933";
    }

    if (signatureNote) {
      signatureNote.textContent =
        lang === "ko"
          ? "Maintenance · Performance · Prediction · Decision"
          : "Maintenance · Performance · Prediction · Decision";
    }

    if (signatureNote) {
      signatureNote.textContent = "Maintenance · Performance · Prediction · Decision";
    }

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

    const heroCopy = siteMain.querySelector(".hero-panel .hero-copy");
    if (!heroCopy) {
      return;
    }

    const heroKicker = heroCopy.querySelector(".hero-kicker");
    const heroTitle = heroCopy.querySelector(".hero-title");
    let heroCaption = heroCopy.querySelector(".hero-caption");
    const heroLead = heroCopy.querySelector(".hero-lead");
    const heroPillRow = heroCopy.querySelector(".hero-pill-row");
    const buttonRow = heroCopy.querySelector(".button-row");

    if (heroKicker) {
      heroKicker.textContent =
        "Hanyang University ERICA · AI Construction Technology Research Center";
    }

    if (heroTitle) {
      heroTitle.textContent = "Construction AI & Data Intelligence";
    }

    if (heroKicker) {
      heroKicker.textContent =
        "Hanyang University ERICA · AI Construction Technology Research Center";
    }

    if (!heroCaption && heroTitle) {
      heroCaption = document.createElement("p");
      heroCaption.className = "hero-caption";
      heroTitle.insertAdjacentElement("afterend", heroCaption);
    }

    if (heroCaption) {
      heroCaption.textContent = "with Codex and Vibe Coding";
    }

    if (heroLead) {
      heroLead.remove();
    }

    if (heroPillRow) {
      heroPillRow.remove();
    }

    if (buttonRow) {
      const buttonLabels = buttonRow.querySelectorAll("span");
      if (buttonLabels[0]) {
        buttonLabels[0].textContent = lang === "ko" ? "전체 논문 보기" : "View publications";
      }

      if (buttonLabels[0]) {
        buttonLabels[0].textContent = lang === "ko" ? "전체 논문 보기" : "View publications";
      }

      if (heroCaption) {
        heroCaption.insertAdjacentElement("afterend", buttonRow);
      }
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
    if (item.journalClass === "KCI" || item.journalClass === "SCI" || item.journalClass === "OTHER") return item.journalClass;
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

  function impactFactorValue(item) {
    const raw = item?.metrics?.impactFactor;
    const value = Number(String(raw || "").replace(/[^0-9.]+/g, ""));
    return Number.isFinite(value) ? value : -1;
  }

  function byImpactFactorThenYear(a, b) {
    const aIf = impactFactorValue(a);
    const bIf = impactFactorValue(b);
    if (bIf !== aIf) return bIf - aIf;
    if ((b.year || 0) !== (a.year || 0)) return (b.year || 0) - (a.year || 0);
    const aCitations = typeof a.citations === "number" ? a.citations : -1;
    const bCitations = typeof b.citations === "number" ? b.citations : -1;
    if (bCitations !== aCitations) return bCitations - aCitations;
    return String(a.title).localeCompare(String(b.title));
  }

  function sortPublications(items) {
    const sorter =
      currentPublicationSort === "citations"
        ? byCitationsThenYear
        : currentPublicationSort === "if"
          ? byImpactFactorThenYear
          : byYearThenCitations;
    return items.slice().sort(sorter);
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
      case "trends":
        return `${renderPageLead("trends")}<section class="content-section paper-trend-overview">${renderPaperTrendSnapshotCard()}</section>${renderResearchTrendRadar()}`;
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
    const navOrder = ["home", "bio", "teaching", "publications", "trends", "news", "contact"];

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
    return "";
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
        <div class="timeline-stack">${getActivities().map((item) => renderActivityCard(item)).join("")}</div>
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
        <div class="timeline-stack">${getActivities().map((item) => renderActivityCard(item)).join("")}</div>
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
        ${renderSectionHeading({ ko: "\uc5f0\ub77d \ucc44\ub110", en: "Contact Channels" }, { ko: "Channels", en: "Channels" })}
        <div class="card-grid three-column">${CONTACT.cards.map((item) => renderContactCard(item)).join("")}</div>
      </section>
      <section class="content-section">
        ${renderSectionHeading({ ko: "\uac8c\uc2dc\ud310", en: "Message Board" }, { ko: "Board", en: "Board" })}
        ${renderContactBoard()}
      </section>
    `;
  }

  function renderContactBoard() {
    const posts = readContactBoardPosts();

    return `
      <div class="contact-board">
        <div class="contact-board-list" data-contact-board-list>
          ${posts.length ? posts.map((post, index) => renderContactBoardPost(post, index)).join("") : renderContactBoardLoading()}
        </div>
        <form class="contact-board-form" data-contact-board-form>
          <div class="contact-board-grid">
            <label class="form-field">
              <span>${text({ ko: "\uc774\ub984", en: "Name" })}</span>
              <input type="text" name="name" autocomplete="name" required>
            </label>
            <label class="form-field">
              <span>${text({ ko: "\uc774\uba54\uc77c", en: "Email" })}</span>
              <input type="email" name="email" autocomplete="email" required>
            </label>
          </div>
          <label class="form-field">
            <span>${text({ ko: "\uc81c\ubaa9", en: "Subject" })}</span>
            <input type="text" name="subject" required>
          </label>
          <label class="form-field">
            <span>${text({ ko: "\ub0b4\uc6a9", en: "Message" })}</span>
            <textarea name="message" rows="7" required></textarea>
          </label>
          <label class="form-field">
            <span>${text({ ko: "\ucca8\ubd80\ud30c\uc77c", en: "Attachment" })}</span>
            <input type="file" name="attachments" multiple>
          </label>
          <label class="form-field">
            <span>${text({ ko: "\uc778\uc99d\ucf54\ub4dc", en: "Authentication code" })}</span>
            <input type="password" name="authCode" autocomplete="off" required>
          </label>
          <div class="contact-board-actions">
            <button class="button button-primary" type="submit">${icon("mail")}<span>${text({ ko: "\ub4f1\ub85d", en: "Post" })}</span></button>
            <p class="contact-board-status" data-contact-board-status aria-live="polite"></p>
          </div>
        </form>
      </div>
    `;
  }

  function renderContactBoardPost(post, index = 0) {
    const attachments = Array.isArray(post.attachments) ? post.attachments : [];
    const postNumber = Number(index) + 1;

    return `
      <article class="contact-board-post">
        <div class="contact-board-post-head">
          <div class="contact-board-post-main">
            <h3 class="contact-board-title"><span class="contact-board-number">${postNumber}</span><span>${escapeHtml(post.subject)}</span></h3>
            <p class="contact-board-meta">${escapeHtml(post.name)} &middot; ${escapeHtml(post.email)} &middot; ${escapeHtml(formatContactBoardDate(post.createdAt))}</p>
          </div>
          <button class="contact-board-delete" type="button" data-contact-post-delete="${escapeHtml(post.id)}" aria-label="${text({ ko: "\uac8c\uc2dc\uae00 \uc0ad\uc81c", en: "Delete post" })}">&times;</button>
        </div>
        <p class="contact-board-message">${escapeHtml(post.message)}</p>
        ${
          attachments.length
            ? `<div class="contact-board-attachments">${attachments
                .map((file) => `<a class="attachment-pill" href="${file.dataUrl}" download="${escapeHtml(file.name)}">${icon("link")}<span>${escapeHtml(file.name)}</span></a>`)
                .join("")}</div>`
            : ""
        }
      </article>
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

  async function handleAppClick(event) {
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

    const trendTopicButton = event.target.closest("[data-paper-trend-topic]");
    if (trendTopicButton) {
      event.preventDefault();
      const form = app.querySelector("[data-paper-trend-form]");
      const queryInput = form?.querySelector("[data-paper-trend-query]");
      if (queryInput) {
        queryInput.value = trendTopicButton.dataset.paperTrendTopic || "";
      }
      app.querySelectorAll("[data-paper-trend-topic]").forEach((button) => {
        button.classList.toggle("is-active", button === trendTopicButton);
      });
      updatePaperTrendLinks(form);
      if (form) {
        await loadPaperTrendResults(form);
      }
      return;
    }

    const trendJournalButton = event.target.closest("[data-paper-trend-journal]");
    if (trendJournalButton) {
      event.preventDefault();
      const form = app.querySelector("[data-paper-trend-form]");
      const journalSelect = form?.querySelector("[data-paper-trend-journal-select]");
      if (journalSelect) {
        journalSelect.value = trendJournalButton.dataset.paperTrendJournal || "";
      }
      app.querySelectorAll("[data-paper-trend-journal]").forEach((button) => {
        button.classList.toggle("is-active", button === trendJournalButton);
      });
      updatePaperTrendLinks(form);
      if (form) {
        await loadPaperTrendResults(form);
      }
      return;
    }

    const deleteContactPostButton = event.target.closest("[data-contact-post-delete]");
    if (deleteContactPostButton) {
      event.preventDefault();
      const postId = deleteContactPostButton.dataset.contactPostDelete;
      const authCode = window.prompt(text({ ko: "\uc0ad\uc81c \uc778\uc99d\ucf54\ub4dc\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694.", en: "Enter the delete authentication code." }));
      if (!authCode) {
        return;
      }
      const status = app.querySelector("[data-contact-board-status]");
      if (status) {
        status.textContent = text({ ko: "\uc0ad\uc81c \uc911...", en: "Deleting..." });
      }

      try {
        await deleteContactBoardPost(postId, authCode);
      } catch (error) {
        if (status) {
          status.textContent = contactBoardErrorMessage(error, "delete");
        }
        return;
      }

      const list = app.querySelector("[data-contact-board-list]");
      if (list) {
        await refreshContactBoardList();
      }

      if (status) {
        status.textContent = text({ ko: "\uc0ad\uc81c\ub418\uc5c8\uc2b5\ub2c8\ub2e4.", en: "Deleted." });
      }
      return;
    }

    const sortChip = event.target.closest("[data-publication-sort]");

    if (!sortChip || page !== "publications") {
      return;
    }

    event.preventDefault();

    const nextSort = ["year", "citations", "if"].includes(sortChip.dataset.publicationSort)
      ? sortChip.dataset.publicationSort
      : "year";

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

  async function handleAppSubmit(event) {
    const contactBoardForm = event.target.closest("[data-contact-board-form]");
    if (contactBoardForm) {
      event.preventDefault();

      const status = contactBoardForm.querySelector("[data-contact-board-status]");
      const formData = new FormData(contactBoardForm);
      const files = Array.from(contactBoardForm.querySelector('input[name="attachments"]')?.files || []);
      const oversizedFile = files.find((file) => file.size > CONTACT_BOARD_MAX_FILE_SIZE);
      const authCode = String(formData.get("authCode") || "").trim();

      if (oversizedFile) {
        if (status) {
          status.textContent = text({ ko: "\ucca8\ubd80\ud30c\uc77c\uc740 \uac01 2MB \uc774\ud558\ub9cc \ub4f1\ub85d\ub429\ub2c8\ub2e4.", en: "Each attachment must be 2MB or smaller." });
        }
        return;
      }

      if (!authCode) {
        if (status) {
          status.textContent = text({ ko: "\uc778\uc99d\ucf54\ub4dc\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694.", en: "Enter the authentication code." });
        }
        return;
      }

      if (status) {
        status.textContent = text({ ko: "\ub4f1\ub85d \uc911...", en: "Posting..." });
      }

      try {
        const attachments = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: await readFileAsDataUrl(file)
          }))
        );
        const post = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          subject: String(formData.get("subject") || "").trim(),
          message: String(formData.get("message") || "").trim(),
          attachments,
          createdAt: new Date().toISOString()
        };

        if (!post.name || !post.email || !post.subject || !post.message) {
          if (status) {
            status.textContent = text({ ko: "\ud544\uc218 \ud56d\ubaa9\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694.", en: "Please fill in every required field." });
          }
          return;
        }

        const savedPost = await createContactBoardPost(post, authCode);
        const posts = [savedPost, ...readContactBoardPosts()].slice(0, 30);
        writeContactBoardPosts(posts);
        contactBoardForm.reset();

        await refreshContactBoardList();

        if (status) {
          status.textContent = text({ ko: "\ub4f1\ub85d\ub418\uc5c8\uc2b5\ub2c8\ub2e4.", en: "Posted." });
        }
      } catch (error) {
        if (status) {
          status.textContent = contactBoardErrorMessage(error, "create");
        }
      }
      return;
    }

    const paperTrendForm = event.target.closest("[data-paper-trend-form]");
    if (paperTrendForm) {
      event.preventDefault();
      await loadPaperTrendResults(paperTrendForm);
      return;
    }

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

    if (event.target.closest("[data-paper-trend-form]")) {
      updatePaperTrendLinks(event.target.closest("[data-paper-trend-form]"));
    }
  }

  function handleAppChange(event) {
    const trendForm = event.target.closest("[data-paper-trend-form]");
    if (trendForm) {
      updatePaperTrendLinks(trendForm);
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
    const primaryActivity = getActivities()[0];
    const researchTitles = CONTENT.research.slice(0, 3).map((item) => text(item.title)).join(", ");
    const emailHref = getProfileHref("email") || "mailto:envy978@hanmail.net";
    const scholarHref =
      getProfileHref("google scholar") ||
      "https://scholar.google.com/citations?user=IplmvucAAAAJ&hl=en";

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
          <button class="sort-chip ${currentPublicationSort === "if" ? "is-active" : ""}" type="button" data-publication-sort="if" aria-pressed="${currentPublicationSort === "if"}">
            ${icon("star")}
            <span>${text({ ko: "IF순", en: "By IF" })}</span>
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
      ${renderScholarMetricsPanel()}
      <section class="content-section">
        ${renderPublicationSortControls()}
      </section>
      ${renderPublicationSection({ ko: "SCI(E) 논문실적", en: "SCI(E) Publications" }, { ko: `${sciPublications.length}편`, en: `${sciPublications.length} papers` }, sciPublications, "SCI")}
      ${renderPublicationSection({ ko: "KCI 논문실적", en: "KCI Publications" }, { ko: `${kciPublications.length}편`, en: `${kciPublications.length} papers` }, kciPublications, "KCI")}
    `;
  }

  function scholarMetricDetail(sinceValue) {
    return sinceValue ? `Since 2021: ${sinceValue}` : "Google Scholar";
  }

  function renderScholarMetricsPanel() {
    const scholarHref = getProfileHref("google scholar") || "https://scholar.google.com/citations?user=IplmvucAAAAJ&hl=en";
    const updated = scholarMetrics.updated || "";

    return `
      <section class="content-section scholar-metrics-section">
        ${renderSectionHeading("Google Scholar metrics", updated ? `Updated ${updated}` : "Citation profile")}
        <div class="scholar-metrics-grid">
          <article class="info-card scholar-metric-card">
            <h3 class="card-title">Citations</h3>
            <div class="publication-metrics">
              <span class="metric-chip">All ${scholarMetrics.citationsAll || publicationSummary.totalCitations}</span>
              ${scholarMetrics.citationsSince2021 ? `<span class="metric-chip">Since 2021 ${scholarMetrics.citationsSince2021}</span>` : ""}
            </div>
          </article>
          <article class="info-card scholar-metric-card">
            <h3 class="card-title">h-index</h3>
            <div class="publication-metrics">
              <span class="metric-chip">All ${scholarMetrics.hIndexAll || "-"}</span>
              ${scholarMetrics.hIndexSince2021 ? `<span class="metric-chip">Since 2021 ${scholarMetrics.hIndexSince2021}</span>` : ""}
            </div>
          </article>
          <article class="info-card scholar-metric-card">
            <h3 class="card-title">i10-index</h3>
            <div class="publication-metrics">
              <span class="metric-chip">All ${scholarMetrics.i10IndexAll || "-"}</span>
              ${scholarMetrics.i10IndexSince2021 ? `<span class="metric-chip">Since 2021 ${scholarMetrics.i10IndexSince2021}</span>` : ""}
            </div>
          </article>
        </div>
        <div class="link-row scholar-metrics-link">
          <a href="${scholarHref}" target="_blank" rel="noreferrer">Open Google Scholar profile</a>
        </div>
      </section>
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
        <div class="timeline-stack">${getActivities().map((item) => renderActivityCard(item)).join("")}</div>
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
        detail: scholarMetricDetail(scholarMetrics.citationsSince2021)
      },
      {
        label: "h-index",
        value: String(scholarMetrics.hIndexAll || ""),
        detail: scholarMetricDetail(scholarMetrics.hIndexSince2021)
      },
      {
        label: "i10-index",
        value: String(scholarMetrics.i10IndexAll || ""),
        detail: scholarMetricDetail(scholarMetrics.i10IndexSince2021)
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
    },
    {
      period: "2024-2025",
      role: { ko: "연구원", en: "Researcher" },
      program: { ko: "한국에너지기술평가원 / 한양대학교 ERICA 산학협력단", en: "KETEP / Hanyang University ERICA" },
      title: {
        ko: "분산형 재생에너지 시스템 실증단지 필수 기반인프라 구축",
        en: "Core infrastructure for a distributed renewable energy system demonstration complex"
      },
      summary: {
        ko: "재생에너지 실증단지 운영에 필요한 전력·데이터·운영 기반 인프라를 구축하는 연구",
        en: "Infrastructure research for power, data, and operation systems required by renewable-energy demonstration sites."
      }
    },
    {
      period: "2020-2025",
      role: { ko: "연구원", en: "Researcher" },
      program: { ko: "한국에너지기술평가원 / 한국건설기술연구원", en: "KETEP / KICT" },
      title: {
        ko: "제로에너지건축물 구현을 위한 스마트 외장재·설비 융복합 기술개발 및 성능평가 체계 구축, 실증",
        en: "Smart envelope and equipment convergence technologies for zero-energy buildings"
      },
      summary: {
        ko: "스마트 외장재와 설비 융복합 기술을 결합해 제로에너지건축물의 성능평가와 실증 체계를 구축하는 연구",
        en: "Research on smart envelope and equipment convergence technologies with performance evaluation and demonstration for zero-energy buildings."
      }
    },
    {
      period: "2024",
      role: { ko: "연구원", en: "Researcher" },
      program: { ko: "한국에너지기술평가원", en: "KETEP" },
      title: {
        ko: "재생에너지 디지털트윈 및 친환경교통 실증연구 인프라 구축",
        en: "Renewable energy digital twin and eco-friendly transportation demonstration infrastructure"
      },
      summary: {
        ko: "재생에너지와 친환경교통 실증 데이터를 디지털트윈 기반 인프라로 연결하는 연구",
        en: "Digital-twin infrastructure research connecting renewable-energy and eco-friendly transportation demonstration data."
      }
    },
    {
      period: "2022",
      role: { ko: "연구원", en: "Researcher" },
      program: { ko: "한국건설기술연구원", en: "KICT" },
      title: {
        ko: "그린리모델링 활성화를 위한 건축물 에너지 디지털 진단 및 설계 자동화 기술개발",
        en: "Digital energy diagnosis and design automation for green remodeling"
      },
      summary: {
        ko: "건축물 에너지 상태를 디지털로 진단하고 그린리모델링 설계 과정을 자동화하는 기술개발 연구",
        en: "Technology research for digital building-energy diagnosis and automated green-remodeling design workflows."
      }
    },
    {
      period: "2018-2022",
      role: { ko: "연구원", en: "Researcher" },
      program: { ko: "한국연구재단 건설구조물 내구성 혁신 연구센터", en: "NRF Research Center for Durable Construction Structures" },
      title: {
        ko: "건설구조물 내구성 혁신 연구센터",
        en: "Research Center for Durability Innovation in Construction Structures"
      },
      summary: {
        ko: "건설구조물의 내구성 향상, 성능저하 진단, 유지관리 전략을 다루는 연구센터 과제",
        en: "Research-center work on durability improvement, deterioration diagnosis, and maintenance strategies for construction structures."
      }
    },
    {
      period: "2018-2020",
      role: { ko: "연구원", en: "Researcher" },
      program: { ko: "(주)썬앤라이트", en: "Sun & Light" },
      title: {
        ko: "그린리모델링 및 실내환경 향상을 위한 IoT기반 스마트 모듈러 외피 패키지 개발",
        en: "IoT-based smart modular envelope package for green remodeling and indoor environment improvement"
      },
      summary: {
        ko: "IoT 센싱과 모듈러 외피 패키지를 활용해 그린리모델링과 실내환경 개선을 연결하는 연구",
        en: "Research linking IoT sensing and modular envelope packages for green remodeling and indoor environmental improvement."
      }
    },
    {
      period: "2017-2018",
      role: { ko: "참여연구원", en: "Research Participant" },
      program: { ko: "산업통상자원부 산업핵심기술개발사업", en: "MOTIE Industrial Core Technology Program" },
      title: {
        ko: "엔지니어링 프로젝트의 지능형 통합관리 지원 시스템 개발",
        en: "Intelligent integrated management support system for engineering projects"
      },
      summary: {
        ko: "엔지니어링 프로젝트의 공정, 비용, 리스크 정보를 통합해 지능형 관리 의사결정을 지원하는 시스템 연구",
        en: "System research for intelligent project-management decisions by integrating schedule, cost, and risk information."
      }
    },
    {
      period: "2018",
      role: { ko: "참여연구원", en: "Research Participant" },
      program: { ko: "국토교통부 국토교통기술촉진연구사업", en: "MOLIT Transportation and Construction Technology Promotion Program" },
      title: {
        ko: "네트워크 기반 라이프라인 지진 재해 기능저하 예측 모델",
        en: "Network-based prediction model for lifeline degradation under earthquake disasters"
      },
      summary: {
        ko: "네트워크 관점에서 라이프라인 시설의 지진 재해 취약성과 기능저하를 예측하는 모델 연구",
        en: "Network-based modeling for predicting seismic vulnerability and functional degradation of lifeline facilities."
      }
    },
    {
      period: "2012-2013",
      role: { ko: "참여연구원", en: "Research Participant" },
      program: { ko: "국토해양부 건설교통기술연구개발사업 / 첨단도시개발사업", en: "MOLIT Construction and Transportation R&D / Advanced Urban Development" },
      title: {
        ko: "개방형 BIM 기반 설계환경 개발 기획 및 통합 공사관리 시스템 연구",
        en: "Open BIM-based design environment planning and integrated construction management systems"
      },
      summary: {
        ko: "개방형 BIM 설계환경과 공정·원가·노무·안전 데이터를 연결하는 통합 공사관리 시스템 연구",
        en: "Integrated construction-management research connecting open BIM design environments with schedule, cost, labor, and safety data."
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
        <div class="timeline-stack">${getActivities().map((item) => renderActivityCard(item)).join("")}</div>
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
        <div class="timeline-stack">${getActivities().map((item) => renderActivityCard(item)).join("")}</div>
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
        <div class="timeline-stack">${getActivities().map((item) => renderActivityCard(item)).join("")}</div>
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
          <svg class="hero-diagram-svg" viewBox="0 0 620 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Coding, data science, AI, and smart construction illustration">
            <defs>
              <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#f4f8fc"/>
              </linearGradient>
              <linearGradient id="hero-frame" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#dbe5f0"/>
                <stop offset="100%" stop-color="#c4d3e3"/>
              </linearGradient>
              <linearGradient id="hero-ink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#17385d"/>
                <stop offset="100%" stop-color="#0f2743"/>
              </linearGradient>
              <linearGradient id="hero-blue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e4f0ff"/>
                <stop offset="100%" stop-color="#89addd"/>
              </linearGradient>
              <linearGradient id="hero-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f4ddbb"/>
                <stop offset="100%" stop-color="#c89259"/>
              </linearGradient>
              <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#102744" flood-opacity="0.12"/>
              </filter>
              <pattern id="hero-grid" width="34" height="34" patternUnits="userSpaceOnUse">
                <path d="M 34 0 L 0 0 0 34" fill="none" stroke="#dfe8f2" stroke-width="1"/>
              </pattern>
              <filter id="hero-soft-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="22"/>
              </filter>
            </defs>
            <rect x="18" y="18" width="584" height="484" rx="40" fill="url(#hero-bg)" stroke="url(#hero-frame)" stroke-width="1.5"/>
            <rect x="42" y="42" width="536" height="436" rx="34" fill="url(#hero-grid)" opacity="0.55"/>
            <circle cx="510" cy="94" r="96" fill="#e2cfb1" opacity="0.2" filter="url(#hero-soft-blur)"/>
            <circle cx="116" cy="408" r="116" fill="#d4e4f8" opacity="0.42" filter="url(#hero-soft-blur)"/>
            <g filter="url(#hero-shadow)" font-family="'Inter','Pretendard Variable','Pretendard',sans-serif">
              <rect x="56" y="70" width="228" height="164" rx="28" fill="#ffffff" fill-opacity="0.96" stroke="#d7e2ee"/>
              <text x="82" y="106" fill="#7f6141" font-size="13" font-weight="700">Coding workflow</text>
              <text x="82" y="132" fill="#153453" font-size="22" font-weight="700">Python, agents, APIs</text>
              <text x="82" y="156" fill="#72879b" font-size="13.5" font-weight="500">From prompt design to automation</text>
              <rect x="82" y="176" width="176" height="40" rx="14" fill="url(#hero-ink)"/>
              <circle cx="100" cy="196" r="4" fill="#f4ddbb"/>
              <circle cx="114" cy="196" r="4" fill="#89addd"/>
              <circle cx="128" cy="196" r="4" fill="#d6e7fb"/>
              <rect x="144" y="190" width="38" height="6" rx="3" fill="#f4ddbb" fill-opacity="0.95"/>
              <rect x="92" y="208" width="76" height="5" rx="2.5" fill="#7fa6d9"/>
              <rect x="176" y="208" width="58" height="5" rx="2.5" fill="#d8e7fa" fill-opacity="0.95"/>
              <rect x="82" y="232" width="72" height="22" rx="11" fill="#edf4fc" stroke="#d5e3f0"/>
              <text x="98" y="247" fill="#3f6388" font-size="11.5" font-weight="600">Git sync</text>
              <path d="M284 150 C304 162 308 188 308 214" stroke="#cad7e5" stroke-width="3.5" fill="none" stroke-linecap="round"/>

              <rect x="336" y="70" width="228" height="164" rx="28" fill="#ffffff" fill-opacity="0.96" stroke="#d7e2ee"/>
              <text x="362" y="106" fill="#7f6141" font-size="13" font-weight="700">Data science</text>
              <text x="362" y="132" fill="#153453" font-size="22" font-weight="700">Signals, forecasts, insight</text>
              <text x="362" y="156" fill="#72879b" font-size="13.5" font-weight="500">Sensor streams and model outputs</text>
              <path d="M364 202 C386 184 404 212 424 194 C440 180 456 178 476 190 C494 200 512 178 534 188" fill="none" stroke="#7ea7dd" stroke-width="5" stroke-linecap="round"/>
              <circle cx="386" cy="184" r="6.5" fill="#ffffff" stroke="#7ea7dd" stroke-width="3"/>
              <circle cx="424" cy="194" r="6.5" fill="#ffffff" stroke="#7ea7dd" stroke-width="3"/>
              <circle cx="476" cy="190" r="6.5" fill="#ffffff" stroke="#c89259" stroke-width="3"/>
              <circle cx="534" cy="188" r="6.5" fill="#ffffff" stroke="#7ea7dd" stroke-width="3"/>
              <rect x="362" y="208" width="18" height="24" rx="9" fill="#dceafd"/>
              <rect x="388" y="196" width="18" height="36" rx="9" fill="#7ea7dd"/>
              <rect x="414" y="184" width="18" height="48" rx="9" fill="#dceafd"/>
              <rect x="440" y="172" width="18" height="60" rx="9" fill="#c89259"/>
              <rect x="466" y="190" width="18" height="42" rx="9" fill="#a8c3e8"/>
              <rect x="492" y="200" width="18" height="32" rx="9" fill="#dceafd"/>
              <path d="M336 150 C318 162 314 188 314 214" stroke="#cad7e5" stroke-width="3.5" fill="none" stroke-linecap="round"/>

              <circle cx="310" cy="258" r="86" fill="#edf4fb" stroke="#d5e2ef"/>
              <circle cx="310" cy="258" r="58" fill="url(#hero-ink)"/>
              <circle cx="310" cy="258" r="34" fill="url(#hero-gold)"/>
              <circle cx="310" cy="258" r="104" fill="none" stroke="#d6e2ee" stroke-dasharray="5 8"/>
              <text x="310" y="234" text-anchor="middle" fill="#ecf3fb" font-size="13" font-weight="700">AI reasoning</text>
              <text x="310" y="250" text-anchor="middle" fill="#ecf3fb" font-size="13" font-weight="700">hub</text>
              <text x="310" y="286" text-anchor="middle" fill="#12304e" font-size="27" font-weight="900">AI</text>

              <rect x="96" y="308" width="428" height="140" rx="30" fill="#ffffff" fill-opacity="0.97" stroke="#d7e2ee"/>
              <text x="124" y="346" fill="#7f6141" font-size="13" font-weight="700">Smart construction</text>
              <text x="124" y="372" fill="#153453" font-size="22" font-weight="700">BIM, safety, maintenance</text>
              <text x="124" y="396" fill="#72879b" font-size="13.5" font-weight="500">Digital twin signals connected to field decisions</text>
              <path d="M178 430 L224 386 L252 406 L298 358 L332 386" fill="none" stroke="#b7cbe2" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="178" cy="430" r="6" fill="#7ea7dd"/>
              <circle cx="224" cy="386" r="6" fill="#c89259"/>
              <circle cx="252" cy="406" r="6" fill="#7ea7dd"/>
              <circle cx="298" cy="358" r="6" fill="#7ea7dd"/>
              <circle cx="332" cy="386" r="6" fill="#c89259"/>
              <rect x="392" y="352" width="34" height="72" rx="10" fill="#dce9f8" stroke="#bcd0e5"/>
              <rect x="430" y="334" width="40" height="90" rx="10" fill="#a6c2e7" stroke="#8fb0d8"/>
              <rect x="474" y="316" width="26" height="108" rx="10" fill="#e7d4b8" stroke="#d6b28a"/>
              <path d="M448 320 H520" stroke="#7f9cc3" stroke-width="3" stroke-linecap="round"/>
              <path d="M494 320 V288" stroke="#7f9cc3" stroke-width="3" stroke-linecap="round"/>
              <path d="M494 288 L532 304" stroke="#7f9cc3" stroke-width="3" stroke-linecap="round"/>
              <path d="M310 316 C310 332 310 340 310 352" stroke="#cad7e5" stroke-width="3.5" fill="none" stroke-linecap="round"/>
              <circle cx="310" cy="352" r="6.5" fill="#ffffff" stroke="#c89259" stroke-width="3"/>
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

  function renderSidebar() {
    const navOrder = ["home", "bio", "teaching", "publications", "trends", "news", "contact"];

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
              <p class="sidebar-contact-value">${text({
                ko: "15588 경기도 안산시 상록구 한양대학로 55",
                en: "55 Hanyangdaehak-ro, Sangnok-gu, Ansan-si, Gyeonggi-do 15588"
              })}</p>
            </div>
            <div class="sidebar-contact-row">
              <span class="sidebar-contact-label">Email</span>
              <p class="sidebar-contact-value"><a class="sidebar-contact-link" href="mailto:nhkwon@hanyang.ac.kr">nhkwon@hanyang.ac.kr</a></p>
            </div>
            <div class="sidebar-contact-row">
              <span class="sidebar-contact-label">Tel.</span>
              <p class="sidebar-contact-value">+82 10-7392-9933</p>
            </div>
          </section>
          <section class="sidebar-signature" aria-label="Research signature">
            <p class="sidebar-signature-kicker">${text({ ko: "Research Signature", en: "Research Signature" })}</p>
            <p class="sidebar-signature-title">Construction AI & Data Intelligence</p>
            <p class="sidebar-signature-note">${text({
              ko: "Maintenance · Performance · Prediction · Decision",
              en: "Maintenance · Performance · Prediction · Decision"
            })}</p>
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

  function renderHeroPanel() {
    return `
      <section class="panel hero-panel hero-panel-premium">
        <div class="hero-layout">
          <div class="hero-copy">
            <p class="hero-kicker">${text({
              ko: "Hanyang University ERICA · AI Construction Technology Research Center",
              en: "Hanyang University ERICA · AI Construction Technology Research Center"
            })}</p>
            <h1 class="hero-title">Construction AI & Data Intelligence</h1>
            <p class="hero-caption">${text({ ko: "with Codex and Vibe Coding", en: "with Codex and Vibe Coding" })}</p>
            <div class="button-row">
              <a class="button button-primary" href="${route("publications")}">${icon("papers")}<span>${text({ ko: "?꾩껜 ?쇰Ц 蹂닿린", en: "View publications" })}</span></a>
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
  function renderSidebarCredentials() {
    const educationItems =
      lang === "ko"
        ? [
            { degree: "학사", school: "한양대학교 건축학부", field: "건축설계", period: "2007.02.27 - 2011.02.18" },
            { degree: "석사", school: "서울대학교 건축학과", field: "건설관리 및 시공", period: "2012.03.01 - 2014.02.26" },
            { degree: "박사", school: "서울대학교 건축학과", field: "건설관리 및 시공", period: "2014.03.01 - 2018.08.29" }
          ]
        : [
            { degree: "B.Arch.", school: "Hanyang University", field: "Architectural Design", period: "2007.02.27 - 2011.02.18" },
            { degree: "M.Eng.", school: "Seoul National University", field: "Construction Management", period: "2012.03.01 - 2014.02.26" },
            { degree: "Ph.D.", school: "Seoul National University", field: "Construction Management", period: "2014.03.01 - 2018.08.29" }
          ];

    const careerItems =
      lang === "ko"
        ? [
            {
              role: "책임연구원",
              place: "현대건설 기술연구원 스마트건설연구실",
              period: "",
              hidePeriod: true
            }
          ]
        : [
            {
              role: "Senior Researcher",
              place: "Smart Construction Research Lab, Hyundai E&C R&D Institute",
              period: "",
              hidePeriod: true
            }
          ];

    const renderItem = (item) => `
      <li class="sidebar-credential-item">
        ${item.hidePeriod ? "" : `<span class="sidebar-credential-period">${item.period}</span>`}
        <strong>${item.degree || item.role}</strong>
        <span>${item.school || item.place}</span>
        ${item.field ? `<span>${item.field}</span>` : ""}
      </li>
    `;

    return `
      <section class="sidebar-credentials-card" aria-label="${text({ ko: "학력 및 경력", en: "Education and Career" })}">
        <p class="sidebar-card-title">${text({ ko: "학력 및 경력", en: "Education & Career" })}</p>
        <div class="sidebar-credential-group">
          <span class="sidebar-credential-heading">${text({ ko: "학력", en: "Education" })}</span>
          <ul class="sidebar-credential-list">${educationItems.map(renderItem).join("")}</ul>
        </div>
        <div class="sidebar-credential-group">
          <span class="sidebar-credential-heading">${text({ ko: "경력", en: "Career" })}</span>
          <ul class="sidebar-credential-list">${careerItems.map(renderItem).join("")}</ul>
        </div>
      </section>
    `;
  }

  function renderSidebar() {
    const navOrder = ["home", "bio", "teaching", "publications", "trends", "news", "contact"];

    return `
      <aside class="site-sidebar">
        <section class="sidebar-profile-block" aria-label="About">
          <div class="sidebar-profile-head">
            <div class="sidebar-photo-frame">
              <img class="profile-portrait" src="${SITE_DATA.profile?.photo || "assets/images/profile-portrait.svg"}" alt="${text(PROFILE.name)}">
            </div>
            <div class="sidebar-identity">
              <p class="sidebar-name">${text(PROFILE.name)}</p>
              <p class="sidebar-affiliation">${text(PROFILE.affiliation)}</p>
            </div>
          </div>
        </section>
        <section class="sidebar-contact-card" aria-label="Contact details">
          <div class="sidebar-contact-row">
            <span class="sidebar-contact-label">Address</span>
            <p class="sidebar-contact-value">${text({
              ko: "15588 경기도 안산시 상록구 한양대학로 55",
              en: "55 Hanyangdaehak-ro, Sangnok-gu, Ansan-si, Gyeonggi-do 15588"
            })}</p>
          </div>
          <div class="sidebar-contact-row">
            <span class="sidebar-contact-label">Email</span>
            <p class="sidebar-contact-value sidebar-email-list">
              <a class="sidebar-contact-link" href="mailto:nhkwon@hanyang.ac.kr">nhkwon@hanyang.ac.kr</a>
              <a class="sidebar-contact-link" href="mailto:nhkwon78@naver.com">nhkwon78@naver.com</a>
            </p>
          </div>
          <div class="sidebar-contact-row">
            <span class="sidebar-contact-label">Tel.</span>
            <p class="sidebar-contact-value">+82 10-7392-9933</p>
          </div>
        </section>
        ${renderSidebarCredentials()}
        <div class="sidebar-label">${text({ ko: "Links", en: "Links" })}</div>
        <div class="sidebar-social">
          ${getProfileLinks().map((item) => renderSocialLink(item)).join("")}
        </div>
        <div class="sidebar-label">${text({ ko: "Navigation", en: "Navigation" })}</div>
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
        <div class="sidebar-label">${text({ ko: "Language", en: "Language" })}</div>
        <div class="language-switch">
          <a class="lang-pill ${lang === "ko" ? "is-active" : ""}" href="${route(page, "ko")}">KO</a>
          <a class="lang-pill ${lang === "en" ? "is-active" : ""}" href="${route(page, "en")}">EN</a>
        </div>
      </aside>
    `;
  }

  function renderHeroPanel() {
    return `
      <section class="panel hero-panel hero-panel-premium">
        <div class="hero-layout hero-layout-simple">
          <div class="hero-copy">
            <p class="hero-kicker">${text({
              ko: "Hanyang University ERICA · AI Construction Technology Research Center",
              en: "Hanyang University ERICA · AI Construction Technology Research Center"
            })}</p>
            <h1 class="hero-title">Construction AI & Data<br class="hero-title-break">Intelligence <span class="hero-title-tag">with Codex and Vibe Coding</span></h1>
            <p class="hero-lead">${text({
              ko: "건축·도시·시공 데이터를 바탕으로 노후 건축물 유지관리, 안전, 성능 예측, 의사결정 지원을 연결하는 연구를 수행합니다.",
              en: "Research focused on data-driven maintenance, safety, performance prediction, and decision support for the built environment."
            })}</p>
            <div class="button-row">
              <a class="button button-primary" href="${route("publications")}">${icon("papers")}<span>${text({ ko: "전체 논문 보기", en: "View publications" })}</span></a>
              <a class="button button-secondary" href="${getProfileHref("google scholar") || scholarSearchUrl(text(PROFILE.name))}" target="_blank" rel="noreferrer">${icon("scholar")}<span>Google Scholar</span></a>
            </div>
          </div>
          <div class="hero-visual hero-update-visual">
            <div class="gh-home-overview-update" aria-label="Latest update">
              <span class="gh-home-overview-update-label">Update</span>
              <strong class="gh-home-overview-update-value">${currentUpdateLabel()}</strong>
            </div>
          </div>
        </div>
        <div class="hero-summary hero-summary-balanced">
          <div class="summary-metric-grid">
            ${getSummaryCards().map((item) => renderSummaryCard(item)).join("")}
          </div>
          ${renderPaperTrendSnapshotCard()}
        </div>
      </section>
    `;
  }

  function renderPaperTrendSnapshotCard() {
    return `
      <article class="paper-trend-summary-card" data-paper-trend-summary>
        <div class="paper-trend-summary-head">
          <p class="paper-trend-summary-kicker">Automated Research Trends</p>
          <h2>Paper Trend Summary</h2>
          <p class="paper-trend-summary-insight" data-paper-trend-summary-copy>${text({
            ko: "Automation in Construction, JBE, ASCE 저널 등 지정 저널의 최신 논문을 매일 수집해 누적하고, 주요 연구축을 요약합니다.",
            en: "Daily scans accumulate papers from the target Elsevier and ASCE journals and summarize the dominant research signals."
          })}</p>
        </div>
        <div class="paper-trend-summary-metrics">
          <span><strong data-paper-trend-summary-count>--</strong>${text({ ko: "표시 논문", en: "shown" })}</span>
          <span><strong data-paper-trend-summary-journals>18</strong>${text({ ko: "대상 저널", en: "journals" })}</span>
          <span><strong data-paper-trend-summary-signal>AI / ML</strong>${text({ ko: "주요 축", en: "top axis" })}</span>
        </div>
        <div class="paper-trend-summary-tags" data-paper-trend-summary-tags>
          <span>AI / ML</span>
          <span>Energy</span>
          <span>Carbon</span>
          <span>BIM / Digital Twin</span>
          <span>Safety</span>
          <span>Project Delivery</span>
        </div>
        <p class="paper-trend-summary-updated" data-paper-trend-summary-updated>${text({
          ko: "Vercel Cron과 Supabase 저장소로 계속 업데이트됩니다.",
          en: "Continuously updated through Vercel Cron and Supabase storage."
        })}</p>
      </article>
    `;
  }

  function renderResearchFocusCard() {
    const interests = [
      "Construction Management",
      "Building Maintenance",
      "Smart Construction",
      "Safety & Prediction",
      "Decision Support"
    ];
    const methodologies = [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Digital Twin",
      "Optimization",
      "Generative AI",
      "AI Agents",
      "Physical AI"
    ];
    const renderTags = (items) => items.map((item) => `<span class="research-focus-tag">${item}</span>`).join("");

    return `
      <article class="research-focus-card">
        <div class="research-focus-group">
          <p class="research-focus-label">Research Interests</p>
          <div class="research-focus-tags">${renderTags(interests)}</div>
        </div>
        <div class="research-focus-group">
          <p class="research-focus-label">AI Methodology</p>
          <div class="research-focus-tags">${renderTags(methodologies)}</div>
        </div>
      </article>
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
          { ko: "전체 논문 보기", en: "View publications" }
        )}
        ${renderPublicationHomeSummary()}
      </section>
      ${renderResearchTrendRadar()}
      <section class="content-section">
        ${renderSectionHeading(
          { ko: "최근 활동", en: "Recent Activities" },
          { ko: "Activities", en: "Activities" },
          route("news"),
          { ko: "활동 더 보기", en: "Open activities" }
        )}
        <div class="timeline-stack">${getActivities().map((item) => renderActivityCard(item)).join("")}</div>
      </section>
      ${renderContactCta()}
    `;
  }

  function renderResearchTrendRadar() {
    const journals = researchTrendJournals();
    const topics = researchTrendTopics();

    return `
      <section id="paper-trends" class="content-section paper-trend-section" data-paper-trend-panel>
        ${renderSectionHeading(
          { ko: "논문 동향 레이더", en: "Paper Trend Radar" },
          { ko: "Latest Literature Scan", en: "Latest Literature Scan" }
        )}
        <div class="paper-trend-panel">
          <form class="paper-trend-form" data-paper-trend-form>
            <label class="paper-trend-field paper-trend-field-query" for="paper-trend-query">
              <span>${text({ ko: "검색 주제", en: "Search topic" })}</span>
              <input
                id="paper-trend-query"
                data-paper-trend-query
                type="search"
                value="${escapeHtml(defaultPaperTrendQuery())}"
                placeholder="${text({ ko: "예: AI construction management, project delivery, digital twin", en: "e.g. AI construction management, project delivery, digital twin" })}"
              >
            </label>
            <label class="paper-trend-field" for="paper-trend-journal">
              <span>${text({ ko: "저널", en: "Journal" })}</span>
              <select id="paper-trend-journal" data-paper-trend-journal-select>
                <option value="">${text({ ko: "전체 지정 저널", en: "All target journals" })}</option>
                ${journals.map((journal) => `<option value="${escapeHtml(journal.title)}">${escapeHtml(journal.short)} · ${escapeHtml(journal.publisher)}</option>`).join("")}
              </select>
            </label>
            <label class="paper-trend-field" for="paper-trend-window">
              <span>${text({ ko: "기간", en: "Window" })}</span>
              <select id="paper-trend-window" data-paper-trend-window>
                <option value="12">${text({ ko: "최근 12개월", en: "Last 12 months" })}</option>
                <option value="24" selected>${text({ ko: "최근 24개월", en: "Last 24 months" })}</option>
                <option value="36">${text({ ko: "최근 36개월", en: "Last 36 months" })}</option>
                <option value="60">${text({ ko: "최근 5년", en: "Last 5 years" })}</option>
              </select>
            </label>
            <button class="button button-primary paper-trend-submit" type="submit">
              ${icon("spark")}
              <span>${text({ ko: "최신 논문 불러오기", en: "Load latest papers" })}</span>
            </button>
          </form>

          <div class="paper-trend-topics" aria-label="${text({ ko: "빠른 주제", en: "Quick topics" })}">
            ${topics.map((topic, index) => `
              <button class="paper-topic-chip" type="button" data-paper-trend-topic="${escapeHtml(topic.query)}">
                ${text(topic.label)}
              </button>
            `).join("")}
          </div>

          <div class="paper-journal-strip" aria-label="${text({ ko: "지정 저널", en: "Target journals" })}">
            <button class="paper-journal-chip is-active" type="button" data-paper-trend-journal="">
              ${text({ ko: "전체", en: "All" })}
            </button>
            ${journals.map((journal) => `
              <button class="paper-journal-chip" type="button" data-paper-trend-journal="${escapeHtml(journal.title)}">
                <span>${escapeHtml(journal.short)}</span>
                <small>${escapeHtml(journal.publisher)}</small>
              </button>
            `).join("")}
          </div>

          <div class="paper-trend-meta">
            <article>
              <span>${text({ ko: "범위", en: "Scope" })}</span>
              <strong data-paper-trend-scope>${text({ ko: "전체 지정 저널", en: "All target journals" })}</strong>
            </article>
            <article>
              <span>${text({ ko: "분야", en: "Fields" })}</span>
              <strong>Construction · Civil · Project Management</strong>
            </article>
            <article>
              <span>${text({ ko: "자료원", en: "Sources" })}</span>
              <strong>Crossref · Scholar · Semantic Scholar</strong>
            </article>
          </div>

          <div class="paper-trend-source-row">
            <a class="section-action" data-paper-trend-link="scholar" href="#" target="_blank" rel="noreferrer">${icon("scholar")}Google Scholar</a>
            <a class="section-action" data-paper-trend-link="semantic" href="#" target="_blank" rel="noreferrer">${icon("research")}Semantic Scholar</a>
            <a class="section-action" data-paper-trend-link="crossref" href="#" target="_blank" rel="noreferrer">${icon("link")}Crossref API</a>
          </div>

          <div class="paper-trend-clusters" data-paper-trend-clusters>
            ${renderPaperTrendClusterSummary([])}
          </div>

          <div class="paper-trend-results-header">
            <p class="paper-trend-status" data-paper-trend-status>${text({
              ko: "자동 업데이트로 축적된 논문 동향을 불러올 수 있습니다.",
              en: "Load accumulated paper trends from the automatic update archive."
            })}</p>
          </div>
          <div class="paper-trend-results" data-paper-trend-results>
            ${renderPaperTrendIntro()}
          </div>
          <p class="paper-trend-note">${text({
            ko: "Vercel Cron이 Crossref 메타데이터를 주기적으로 수집해 Supabase에 축적합니다. 최종 인용, 색인, 원문 접근 여부는 Scholar, Scopus, 출판사 페이지에서 확인하세요.",
            en: "Vercel Cron periodically collects Crossref metadata into Supabase. Verify citation counts, indexing, and full-text access in Scholar, Scopus, or the publisher page."
          })}</p>
        </div>
      </section>
    `;
  }

  function researchTrendJournals() {
    return [
      { title: "Automation in Construction", short: "Automation in Construction", publisher: "Elsevier", issn: "0926-5805", tier: "major" },
      { title: "Buildings", short: "Buildings", publisher: "MDPI", issn: "2075-5309", tier: "secondary" },
      { title: "Journal of Building Engineering", short: "Journal of Building Engineering", publisher: "Elsevier", issn: "2352-7102", tier: "major" },
      { title: "Sustainability", short: "Sustainability", publisher: "MDPI", issn: "2071-1050", tier: "secondary" },
      { title: "Developments in the Built Environment", short: "Developments in Built Environment", publisher: "Elsevier", issn: "2666-1659", tier: "major" },
      { title: "Building and Environment", short: "Building and Environment", publisher: "Elsevier", issn: "0360-1323", tier: "major" },
      { title: "KSCE Journal of Civil Engineering", short: "KSCE Journal of Civil Engineering", publisher: "Elsevier / KSCE", issn: "1226-7988", tier: "major" },
      { title: "Journal of Asian Architecture and Building Engineering", short: "JAABE", publisher: "Taylor & Francis", issn: "1347-2852", tier: "major" },
      { title: "Applied Sciences", short: "Applied Sciences", publisher: "MDPI", issn: "2076-3417", tier: "secondary" },
      { title: "Advances in Civil Engineering", short: "Advances in Civil Engineering", publisher: "Wiley / Hindawi", issn: "1687-8094", tier: "secondary" },
      { title: "Energy and Buildings", short: "Energy and Buildings", publisher: "Elsevier", issn: "0378-7788", tier: "major" },
      { title: "Energies", short: "Energies", publisher: "MDPI", issn: "1996-1073", tier: "secondary" },
      { title: "Expert Systems with Applications", short: "Expert Systems with Applications", publisher: "Elsevier", issn: "0957-4174", tier: "major" },
      { title: "Journal of the Architectural Institute of Korea", short: "JAIK", publisher: "Architectural Institute of Korea", issn: "2733-6247", tier: "secondary" },
      { title: "Results in Engineering", short: "Results in Engineering", publisher: "Elsevier", issn: "2590-1230", tier: "major" },
      { title: "Journal of Construction Engineering and Management", short: "J. Construction Eng. & Management", publisher: "ASCE", issn: "0733-9364", tier: "major" },
      { title: "Journal of Management in Engineering", short: "J. Management in Engineering", publisher: "ASCE", issn: "0742-597X", tier: "major" },
      { title: "Journal of Computing in Civil Engineering", short: "J. Computing in Civil Engineering", publisher: "ASCE", issn: "0887-3801", tier: "major" }
    ];
  }

  function researchTrendTopics() {
    return [
      { label: { ko: "AI 기반 건설관리", en: "AI for construction management" }, query: "artificial intelligence machine learning deep learning" },
      { label: { ko: "프로젝트 관리", en: "Project management" }, query: "project management scheduling cost risk" },
      { label: { ko: "비용·건설관리", en: "Cost and construction management" }, query: "construction management cost estimation cost overrun budget" },
      { label: { ko: "BIM·Digital Twin", en: "BIM digital twin" }, query: "BIM digital twin" },
      { label: { ko: "안전·리스크", en: "Safety and risk" }, query: "safety risk accident worker" },
      { label: { ko: "건물 성능·에너지", en: "Building performance" }, query: "energy retrofit building performance" },
      { label: { ko: "LLM·NLP 자동화", en: "LLM and NLP automation" }, query: "large language model natural language processing" },
      { label: { ko: "지속가능·탄소", en: "Sustainability and carbon" }, query: "sustainable carbon circular economy" }
    ];
  }

  function researchTrendClusters() {
    return [
      {
        label: "AI / ML",
        terms: ["artificial intelligence", "machine learning", "deep learning", "neural", "computer vision", "generative", "llm", "large language"],
        hint: { ko: "AI, ML, 비전, 생성형 AI 흐름", en: "AI, ML, vision, and generative AI signals" }
      },
      {
        label: "BIM / Digital Twin",
        terms: ["bim", "building information", "digital twin", "scan-to-bim", "point cloud"],
        hint: { ko: "BIM, 디지털 트윈, 포인트클라우드", en: "BIM, digital twins, and point-cloud workflows" }
      },
      {
        label: "Safety / Risk",
        terms: ["safety", "risk", "hazard", "accident", "worker", "fatigue"],
        hint: { ko: "안전, 리스크, 근로자 모니터링", en: "Safety, risk, and worker monitoring" }
      },
      {
        label: "Project Delivery",
        terms: ["project management", "delivery", "contract", "schedule", "scheduling", "cost", "productivity"],
        hint: { ko: "공정, 비용, 계약, 생산성", en: "Schedule, cost, contract, and productivity" }
      },
      {
        label: "Cost / Construction Management",
        terms: ["construction management", "cost", "cost estimation", "cost overrun", "budget", "life cycle cost", "maintenance cost", "quantity", "estimate"],
        hint: { ko: "비용예측, 예산, 생애주기 비용, 건설관리", en: "Cost estimation, budgeting, life-cycle cost, and construction management" }
      },
      {
        label: "Building Performance",
        terms: ["energy", "retrofit", "thermal", "indoor", "building performance", "environment"],
        hint: { ko: "에너지, 리트로핏, 실내환경", en: "Energy, retrofit, and indoor environment" }
      },
      {
        label: "Sustainability",
        terms: ["sustainability", "carbon", "circular", "life cycle", "resilience", "climate"],
        hint: { ko: "탄소, 순환경제, 회복탄력성", en: "Carbon, circular economy, and resilience" }
      }
    ];
  }

  function defaultPaperTrendQuery() {
    return "";
  }

  const PAPER_TREND_PREVIEW_LIMIT = 90;
  const PAPER_TREND_ROWS_PER_JOURNAL = 25;
  const PAPER_TREND_SELECTED_JOURNAL_ROWS = 75;
  const PAPER_TREND_CONCURRENT_REQUESTS = 4;
  const PAPER_TREND_FETCH_TIMEOUT_MS = 10000;

  function initializePaperTrendPanel() {
    const panel = app.querySelector("[data-paper-trend-panel]");
    const form = panel?.querySelector("[data-paper-trend-form]");
    if (!panel || !form) {
      return;
    }

    updatePaperTrendLinks(form);

    if (panel.dataset.autoLoaded) {
      return;
    }

    panel.dataset.autoLoaded = "true";
    window.setTimeout(() => loadPaperTrendResults(form), 250);
  }

  function readPaperTrendForm(form) {
    const query = String(form?.querySelector("[data-paper-trend-query]")?.value || "").trim() || defaultPaperTrendQuery();
    const journal = String(form?.querySelector("[data-paper-trend-journal-select]")?.value || "").trim();
    const months = Number(form?.querySelector("[data-paper-trend-window]")?.value || 24);
    const journalMeta = researchTrendJournals().find((item) => item.title === journal);
    return {
      query,
      journal,
      issn: journalMeta?.issn || "",
      title: journalMeta?.title || journal,
      publisher: journalMeta?.publisher || "",
      tier: journalMeta?.tier || "",
      months: Number.isFinite(months) && months > 0 ? months : 24
    };
  }

  function buildStoredPaperTrendUrl(data) {
    const params = new URLSearchParams();
    params.set("months", String(data.months || 24));
    params.set("limit", String(PAPER_TREND_PREVIEW_LIMIT));

    if (data.journal) {
      params.set("journal", data.journal);
    }

    if (data.query) {
      params.set("query", data.query);
    }

    return `${PAPER_TRENDS_API}?${params.toString()}`;
  }

  async function fetchStoredPaperTrendItems(data) {
    try {
      const response = await fetch(buildStoredPaperTrendUrl(data), {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      const items = Array.isArray(payload?.items)
        ? payload.items.map(normalizeStoredPaperTrendItem).filter((item) => item.title)
        : [];

      return { ...payload, items: data.journal ? items : limitPaperTrendPreviewItems(items) };
    } catch (error) {
      return null;
    }
  }

  function normalizeStoredPaperTrendItem(item) {
    return {
      title: String(item?.title || "").trim(),
      venue: String(item?.venue || item?.journal || "").trim(),
      authors: String(item?.authors || "").trim() || text({ ko: "저자 정보 없음", en: "Author metadata unavailable" }),
      doi: String(item?.doi || "").trim(),
      url: String(item?.url || "").trim(),
      publisher: String(item?.publisher || "").trim(),
      citations: Number(item?.citations || 0),
      date: String(item?.date || "").trim() || text({ ko: "날짜 미상", en: "Date unavailable" }),
      year: Number(item?.year || 0),
      firstSeenAt: String(item?.firstSeenAt || "").trim(),
      lastSeenAt: String(item?.lastSeenAt || "").trim(),
      source: String(item?.source || "crossref").trim()
    };
  }

  function formatPaperTrendUpdatedAt(value) {
    if (!value) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Seoul"
      }).format(new Date(value));
    } catch (error) {
      return "";
    }
  }

  function storedPaperTrendStatus(data, payload) {
    const updatedAt = formatPaperTrendUpdatedAt(payload?.lastUpdatedAt);
    const suffix = updatedAt
      ? text({ ko: ` 마지막 자동 업데이트: ${updatedAt}`, en: ` Last automatic update: ${updatedAt}` })
      : "";

    return text({
      ko: `${data.months}개월 누적 데이터에서 ${payload.items.length}편을 불러왔습니다.${suffix}`,
      en: `Loaded ${payload.items.length} accumulated records from the last ${data.months} months.${suffix}`
    });
  }

  function isMdpiTrendSource(itemOrVenue) {
    const mdpiVenues = new Set(["buildings", "sustainability", "applied sciences", "energies"]);
    const publisher = normalizePaperTrendText(typeof itemOrVenue === "object" ? itemOrVenue.publisher : "");
    const venue = normalizePaperTrendText(typeof itemOrVenue === "object" ? itemOrVenue.venue || itemOrVenue.journal : itemOrVenue);
    return publisher.includes("mdpi") || mdpiVenues.has(venue);
  }

  function isMajorTrendSource(itemOrVenue) {
    const publisher = normalizePaperTrendText(typeof itemOrVenue === "object" ? itemOrVenue.publisher : "");
    const venue = normalizePaperTrendText(typeof itemOrVenue === "object" ? itemOrVenue.venue || itemOrVenue.journal : itemOrVenue);
    const majorVenues = new Set(
      researchTrendJournals()
        .filter((journal) => journal.tier === "major")
        .map((journal) => normalizePaperTrendText(journal.title))
    );
    return !isMdpiTrendSource(itemOrVenue) && (publisher.includes("elsevier") || publisher.includes("asce") || majorVenues.has(venue));
  }

  function paperTrendRowsForTarget(target, baseRows) {
    if (target?.tier === "secondary" || isMdpiTrendSource(target)) {
      return Math.max(3, Math.min(5, Math.round(baseRows * 0.2)));
    }

    if (target?.tier === "major" || isMajorTrendSource(target)) {
      return Math.max(baseRows, 32);
    }

    return Math.max(10, Math.round(baseRows * 0.6));
  }

  function limitPaperTrendPreviewItems(items, limit = PAPER_TREND_PREVIEW_LIMIT) {
    const sorted = items.slice().sort(comparePaperTrendItems);
    const mdpiLimit = Math.max(2, Math.floor(limit * 0.06));
    const mdpiItems = sorted.filter((item) => isMdpiTrendSource(item)).slice(0, mdpiLimit);
    const majorItems = sorted.filter((item) => !isMdpiTrendSource(item)).slice(0, limit - mdpiItems.length);
    return majorItems.concat(mdpiItems).slice(0, limit);
  }

  function topPaperTrendSummaryClusters(items) {
    return researchTrendClusters()
      .map((cluster) => ({
        label: cluster.label,
        count: items.filter((item) => cluster.terms.some((term) => item.title.toLowerCase().includes(term))).length
      }))
      .filter((cluster) => cluster.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }

  function topPaperTrendVenues(items) {
    const counts = new Map();
    const metaByVenue = new Map();
    items.forEach((item) => {
      const venue = item.venue || item.journal;
      if (venue) {
        counts.set(venue, (counts.get(venue) || 0) + 1);
        metaByVenue.set(venue, item);
      }
    });
    const entries = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([venue, count]) => ({ venue, count, item: metaByVenue.get(venue) || { venue } }));
    const majorEntries = entries.filter((entry) => isMajorTrendSource(entry.item));
    const secondaryEntries = entries.filter((entry) => !isMajorTrendSource(entry.item));
    const ordered = majorEntries.length ? majorEntries.concat(secondaryEntries) : entries;

    return ordered
      .slice(0, 2)
      .map((entry) => entry.venue);
  }

  function paperTrendClusterTrendSentence(label) {
    const sentences = {
      "AI / ML": {
        ko: "AI/ML은 예측·분류·자동화 방법론으로 붙고 있습니다.",
        en: "AI/ML is appearing as a prediction, classification, and automation layer."
      },
      "BIM / Digital Twin": {
        ko: "BIM·디지털트윈·포인트클라우드 기반 현장 데이터화가 보입니다.",
        en: "BIM, digital twins, and point clouds are shaping data-rich site workflows."
      },
      "Safety / Risk": {
        ko: "안전·위험·근로자 모니터링 흐름이 이어집니다.",
        en: "Safety, risk, and worker monitoring remain visible signals."
      },
      "Project Delivery": {
        ko: "공정·비용·생산성 의사결정 지원 연구가 이어집니다.",
        en: "Schedule, cost, and productivity decision support remain active."
      },
      "Cost / Construction Management": {
        ko: "공사비 예측·예산관리·건설관리 의사결정 연구가 함께 나타납니다.",
        en: "Cost estimation, budgeting, and construction management decision support are also visible."
      },
      "Building Performance": {
        ko: "건물 에너지·성능예측·실내환경 연구가 가장 활발합니다.",
        en: "Building energy, performance prediction, and indoor environment work are especially active."
      },
      Sustainability: {
        ko: "탄소·순환경제·기후회복성 주제가 함께 확산됩니다.",
        en: "Carbon, circular economy, and climate resilience themes are expanding together."
      }
    };

    return sentences[label] ? text(sentences[label]) : label;
  }

  function paperTrendKeywordLabels(label) {
    const labels = {
      "AI / ML": ["AI / ML", "Machine Learning", "Deep Learning", "Computer Vision", "LLM"],
      "BIM / Digital Twin": ["BIM", "Digital Twin", "Point Cloud", "Scan-to-BIM"],
      "Safety / Risk": ["Safety", "Risk", "Worker Monitoring", "Hazard"],
      "Project Delivery": ["Project Delivery", "Scheduling", "Cost", "Productivity"],
      "Cost / Construction Management": ["Cost", "Construction Management", "Cost Estimation", "Budget", "Life-cycle Cost"],
      "Building Performance": ["Building Performance", "Energy", "Retrofit", "Indoor Environment"],
      Sustainability: ["Sustainability", "Carbon", "Circular Economy", "Climate Resilience"]
    };

    return labels[label] || [label];
  }

  function topPaperTrendKeywords(items, clusters) {
    const chosen = [];
    const add = (label) => {
      if (!label || chosen.some((item) => item.toLowerCase() === String(label).toLowerCase())) {
        return;
      }
      chosen.push(label);
    };
    const activeClusters = clusters.length ? clusters : researchTrendClusters().slice(0, 4);

    activeClusters.slice(0, 1).forEach((cluster) => {
      paperTrendKeywordLabels(cluster.label).forEach(add);
    });
    paperTrendKeywordLabels("Cost / Construction Management").forEach(add);
    activeClusters.slice(1).forEach((cluster) => {
      paperTrendKeywordLabels(cluster.label).forEach(add);
    });

    if (chosen.length < 8) {
      researchTrendClusters().forEach((cluster) => paperTrendKeywordLabels(cluster.label).slice(0, 2).forEach(add));
    }

    return chosen.slice(0, items.length > 0 ? 12 : 8);
  }

  function buildPaperTrendInsight(items, clusters, venues) {
    const baseClusters = clusters.length ? clusters : [{ label: "Building Performance" }, { label: "AI / ML" }, { label: "Sustainability" }];
    const activeClusters = baseClusters.slice(0, 2);
    const costCluster = baseClusters.find((cluster) => cluster.label === "Cost / Construction Management") || { label: "Cost / Construction Management" };
    if (!activeClusters.some((cluster) => cluster.label === costCluster.label)) {
      activeClusters.push(costCluster);
    } else if (baseClusters[2]) {
      activeClusters.push(baseClusters[2]);
    }
    const trendText = activeClusters.map((cluster) => paperTrendClusterTrendSentence(cluster.label)).join(" ");
    const venueText = venues.length ? venues.join(", ") : text({ ko: "지정 저널", en: "target journals" });

    return text({
      ko: `동향: ${trendText} 주요출처: ${venueText}`,
      en: `Trend: ${trendText} Main sources: ${venueText}`
    });
  }

  function paperTrendSignalShortLabel(label) {
    const labels = {
      "Building Performance": { ko: "성능", en: "Performance" },
      "Project Delivery": { ko: "프로젝트", en: "Delivery" },
      "BIM / Digital Twin": { ko: "BIM", en: "BIM" },
      "Safety / Risk": { ko: "안전", en: "Safety" },
      "Cost / Construction Management": { ko: "비용", en: "Cost" },
      Sustainability: { ko: "탄소", en: "Carbon" }
    };

    return labels[label] ? text(labels[label]) : label;
  }

  function updatePaperTrendSummaryCard(items, meta = {}) {
    const card = app.querySelector("[data-paper-trend-summary]");
    if (!card || !Array.isArray(items) || !items.length) {
      return;
    }

    const clusters = topPaperTrendSummaryClusters(items);
    const venues = topPaperTrendVenues(items);
    const countEl = card.querySelector("[data-paper-trend-summary-count]");
    const journalsEl = card.querySelector("[data-paper-trend-summary-journals]");
    const signalEl = card.querySelector("[data-paper-trend-summary-signal]");
    const copyEl = card.querySelector("[data-paper-trend-summary-copy]");
    const tagsEl = card.querySelector("[data-paper-trend-summary-tags]");
    const updatedEl = card.querySelector("[data-paper-trend-summary-updated]");
    const topSignal = clusters[0]?.label || "AI / ML";

    if (countEl) {
      countEl.textContent = String(items.length);
    }

    if (journalsEl) {
      const journalCount = new Set(items.map((item) => item.venue).filter(Boolean)).size || researchTrendJournals().length;
      journalsEl.textContent = String(journalCount);
    }

    if (signalEl) {
      signalEl.textContent = paperTrendSignalShortLabel(topSignal);
    }

    if (copyEl) {
      copyEl.textContent = buildPaperTrendInsight(items, clusters, venues);
    }

    if (tagsEl) {
      const tags = topPaperTrendKeywords(items, clusters)
        .map((label) => `<span>${escapeHtml(label)}</span>`)
        .join("");
      tagsEl.innerHTML = tags;
    }

    if (updatedEl) {
      const updatedAt = formatPaperTrendUpdatedAt(meta.lastUpdatedAt);
      if (meta.source === "stored" && updatedAt) {
        updatedEl.textContent = text({
          ko: `Supabase 누적 데이터 기준 · 마지막 자동 업데이트 ${updatedAt}`,
          en: `Based on the Supabase archive · last automatic update ${updatedAt}`
        });
      } else {
        updatedEl.textContent = text({
          ko: `현재 화면의 실시간 스캔 결과로 요약했습니다.${meta.loadedTargets && meta.totalTargets ? ` (${meta.loadedTargets}/${meta.totalTargets}개 저널 응답)` : ""}`,
          en: `Summarized from the live scan on this page.${meta.loadedTargets && meta.totalTargets ? ` (${meta.loadedTargets}/${meta.totalTargets} journals responded)` : ""}`
        });
      }
    }
  }

  function updatePaperTrendLinks(form) {
    if (!form) {
      return;
    }

    const data = readPaperTrendForm(form);
    const panel = form.closest("[data-paper-trend-panel]");
    const links = {
      scholar: buildScholarTrendUrl(data),
      semantic: buildSemanticScholarTrendUrl(data),
      crossref: buildCrossrefTrendUrl(data, 100)
    };

    Object.keys(links).forEach((key) => {
      const link = panel?.querySelector(`[data-paper-trend-link="${key}"]`);
      if (link) {
        link.href = links[key];
      }
    });

    const scope = panel?.querySelector("[data-paper-trend-scope]");
    if (scope) {
      scope.textContent = data.journal || text({ ko: "전체 지정 저널", en: "All target journals" });
    }

    panel?.querySelectorAll("[data-paper-trend-journal]").forEach((button) => {
      button.classList.toggle("is-active", String(button.dataset.paperTrendJournal || "") === data.journal);
    });
  }

  function waitPaperTrend(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function fetchPaperTrendPayload(target, rows) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = typeof AbortController === "function" ? new AbortController() : null;
      const timeoutId = controller
        ? window.setTimeout(() => controller.abort(), PAPER_TREND_FETCH_TIMEOUT_MS)
        : 0;

      try {
        const response = await fetch(buildCrossrefTrendUrl(target, rows), {
          headers: { Accept: "application/json" },
          signal: controller?.signal
        });

        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        // Crossref can intermittently reject browser-side requests; retry once before skipping the journal.
      } finally {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      }

      await waitPaperTrend(350 * (attempt + 1));
    }

    return null;
  }

  async function fetchPaperTrendPayloads(targets, rows) {
    const payloads = new Array(targets.length).fill(null);
    let nextIndex = 0;
    const workerCount = Math.min(PAPER_TREND_CONCURRENT_REQUESTS, targets.length);

    await Promise.all(
      Array.from({ length: workerCount }, async () => {
        while (nextIndex < targets.length) {
          const currentIndex = nextIndex;
          nextIndex += 1;
          payloads[currentIndex] = await fetchPaperTrendPayload(
            targets[currentIndex],
            targets.length > 1 ? paperTrendRowsForTarget(targets[currentIndex], rows) : rows
          );
        }
      })
    );

    return payloads;
  }

  async function loadPaperTrendResults(form) {
    if (!form || typeof fetch !== "function") {
      return;
    }

    const panel = form.closest("[data-paper-trend-panel]");
    const status = panel?.querySelector("[data-paper-trend-status]");
    const results = panel?.querySelector("[data-paper-trend-results]");
    const clusters = panel?.querySelector("[data-paper-trend-clusters]");
    const data = readPaperTrendForm(form);
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    if (!panel || !results) {
      return;
    }

    panel.dataset.requestId = requestId;
    updatePaperTrendLinks(form);

    if (status) {
      status.textContent = text({
        ko: "저장된 논문 동향을 확인한 뒤 최신 메타데이터를 불러오는 중입니다.",
        en: "Checking stored paper trends before loading the latest metadata."
      });
    }
    results.innerHTML = renderPaperTrendLoading();

    try {
      const storedPayload = await fetchStoredPaperTrendItems(data);

      if (storedPayload?.items?.length) {
        if (panel.dataset.requestId !== requestId) {
          return;
        }

        results.innerHTML = storedPayload.items.map((item) => renderPaperTrendResultItem(item)).join("");
        if (clusters) {
          clusters.innerHTML = renderPaperTrendClusterSummary(storedPayload.items);
        }
        updatePaperTrendSummaryCard(storedPayload.items, {
          source: "stored",
          data,
          lastUpdatedAt: storedPayload.lastUpdatedAt,
          availableCount: storedPayload.availableCount
        });
        if (status) {
          status.textContent = storedPaperTrendStatus(data, storedPayload);
        }
        return;
      }

      const targetQueries = data.journal
        ? [data]
        : researchTrendJournals().map((journal) => ({ ...data, ...journal, journal: journal.title, issn: journal.issn }));
      const rowsPerQuery = data.journal ? PAPER_TREND_SELECTED_JOURNAL_ROWS : PAPER_TREND_ROWS_PER_JOURNAL;
      const payloads = await fetchPaperTrendPayloads(targetQueries, rowsPerQuery);

      if (!payloads.some(Boolean)) {
        throw new Error("Crossref unavailable");
      }

      if (panel.dataset.requestId !== requestId) {
        return;
      }

      const normalizedItems = dedupePaperTrendItems(
        payloads
          .flatMap((payload, index) => normalizeCrossrefTrendItems(payload?.message?.items || [], targetQueries[index]))
          .filter(isPaperTrendResearchRecord)
          .filter((item) => isPaperTrendVenueMatch(item.venue, data.journal))
          .filter((item) => isPaperTrendDatePlausible(item, data.months))
      );
      const items = data.journal
        ? normalizedItems.sort(comparePaperTrendItems).slice(0, PAPER_TREND_PREVIEW_LIMIT)
        : limitPaperTrendPreviewItems(normalizedItems);

      if (!items.length) {
        results.innerHTML = renderPaperTrendEmpty(data);
        if (clusters) {
          clusters.innerHTML = renderPaperTrendClusterSummary([]);
        }
        if (status) {
          status.textContent = text({
            ko: "조건에 맞는 최신 논문을 찾지 못했습니다. 검색어를 넓혀보세요.",
            en: "No recent papers matched this query. Try a broader search."
          });
        }
        return;
      }

      results.innerHTML = items.map((item) => renderPaperTrendResultItem(item)).join("");
      if (clusters) {
        clusters.innerHTML = renderPaperTrendClusterSummary(items);
      }
      updatePaperTrendSummaryCard(items, {
        source: "live",
        data,
        loadedTargets: payloads.filter(Boolean).length,
        totalTargets: targetQueries.length
      });
      if (status) {
        const loadedTargets = payloads.filter(Boolean).length;
        status.textContent = text({
          ko: `${data.months}개월 범위에서 ${items.length}편을 불러왔습니다.${loadedTargets < targetQueries.length ? ` (${loadedTargets}/${targetQueries.length}개 저널 응답)` : ""}`,
          en: `Loaded ${items.length} recent records from the last ${data.months} months.${loadedTargets < targetQueries.length ? ` (${loadedTargets}/${targetQueries.length} journals responded)` : ""}`
        });
      }
    } catch (error) {
      if (panel.dataset.requestId !== requestId) {
        return;
      }
      results.innerHTML = renderPaperTrendError(data);
      if (status) {
        status.textContent = text({
          ko: "실시간 메타데이터를 불러오지 못했습니다. 외부 검색 링크를 사용하세요.",
          en: "Could not load live metadata. Use the external search links."
        });
      }
    }
  }

  function buildPaperTrendPhrase(data) {
    const phrase = data.query || "construction management civil engineering project management";
    return data.journal ? `${phrase} "${data.journal}"` : phrase;
  }

  function buildScholarTrendUrl(data) {
    const year = new Date().getFullYear() - Math.max(0, Math.ceil(data.months / 12) - 1);
    return `https://scholar.google.com/scholar?as_ylo=${year}&q=${encodeURIComponent(buildPaperTrendPhrase(data))}`;
  }

  function buildSemanticScholarTrendUrl(data) {
    return `https://www.semanticscholar.org/search?q=${encodeURIComponent(buildPaperTrendPhrase(data))}&sort=pub-date`;
  }

  function buildCrossrefTrendUrl(data, rows = PAPER_TREND_PREVIEW_LIMIT) {
    const endpoint = "https://api.crossref.org/works";
    const filters = [
      "type:journal-article",
      `from-pub-date:${isoDateMonthsAgo(data.months)}`,
      `until-pub-date:${isoTodayDate()}`
    ];

    if (data.issn) {
      filters.push(`issn:${data.issn}`);
    }

    const params = new URLSearchParams();
    params.set("filter", filters.join(","));
    params.set("sort", "published");
    params.set("order", "desc");
    params.set("rows", String(rows));
    params.set("select", "DOI,title,author,container-title,published,published-print,published-online,issued,URL,is-referenced-by-count");

    if (data.query) {
      params.set("query.title", data.query);
    }

    if (data.journal && !data.issn) {
      params.set("query.container-title", data.journal);
    }

    return `${endpoint}?${params.toString()}`;
  }

  function isoDateMonthsAgo(months) {
    const date = new Date();
    date.setMonth(date.getMonth() - Number(months || 24));
    return date.toISOString().slice(0, 10);
  }

  function isoTodayDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function normalizeCrossrefTrendItems(items, journal = {}) {
    return items
      .map((item) => {
        const date = crossrefPublishedDate(item);
        const title = Array.isArray(item.title) ? item.title[0] : item.title;
        const venue = Array.isArray(item["container-title"]) ? item["container-title"][0] : item["container-title"];

        return {
          title: String(title || "").trim(),
          venue: String(venue || "").trim(),
          authors: formatCrossrefAuthors(item.author),
          doi: String(item.DOI || "").trim(),
          url: String(item.URL || "").trim(),
          journal: journal.title || journal.journal || "",
          publisher: journal.publisher || "",
          citations: Number(item["is-referenced-by-count"] || 0),
          date: date.label,
          year: date.year
        };
      })
      .filter((item) => item.title && item.venue);
  }

  function dedupePaperTrendItems(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = item.doi ? `doi:${item.doi.toLowerCase()}` : `title:${item.title.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function isPaperTrendResearchRecord(item) {
    const title = normalizePaperTrendText(item.title);
    const excludedTitles = [
      "editorial board",
      "editorial",
      "corrigendum",
      "erratum",
      "correction",
      "correction to",
      "retraction",
      "contents",
      "front matter",
      "back matter",
      "announcement",
      "call for papers",
      "preface"
    ];

    return !excludedTitles.some((excluded) => title === excluded || title.startsWith(`${excluded} `));
  }

  function comparePaperTrendItems(a, b) {
    const yearDiff = Number(b.year || 0) - Number(a.year || 0);
    if (yearDiff) {
      return yearDiff;
    }
    return String(b.date || "").localeCompare(String(a.date || ""));
  }

  function isPaperTrendDatePlausible(item, months) {
    const year = Number(item.year || 0);
    if (!year) {
      return true;
    }

    const currentYear = new Date().getFullYear();
    const earliestYear = currentYear - Math.ceil(Number(months || 24) / 12) - 1;
    return year >= earliestYear && year <= currentYear + 1;
  }

  function isPaperTrendVenueMatch(venue, selectedJournal) {
    const normalizedVenue = normalizePaperTrendText(venue);
    const targets = selectedJournal
      ? [selectedJournal]
      : researchTrendJournals().map((journal) => journal.title);

    return targets.some((target) => {
      const normalizedTarget = normalizePaperTrendText(target);
      return normalizedVenue.includes(normalizedTarget) || normalizedTarget.includes(normalizedVenue);
    });
  }

  function normalizePaperTrendText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function crossrefPublishedDate(item) {
    const candidates = [item?.["published-online"], item?.["published-print"], item?.published, item?.issued];
    const parts = candidates
      .map((candidate) => candidate?.["date-parts"]?.[0])
      .find((part) => Array.isArray(part) && part.length);

    const year = parts?.[0] || "";
    const month = String(parts?.[1] || "01").padStart(2, "0");
    const day = String(parts?.[2] || "01").padStart(2, "0");

    return {
      year,
      label: year ? `${year}.${month}.${day}` : text({ ko: "날짜 미상", en: "Date unavailable" })
    };
  }

  function formatCrossrefAuthors(authors) {
    if (!Array.isArray(authors) || !authors.length) {
      return text({ ko: "저자 정보 없음", en: "Author metadata unavailable" });
    }

    const names = authors
      .slice(0, 3)
      .map((author) => [author.given, author.family].filter(Boolean).join(" ") || author.name || "")
      .filter(Boolean);

    return `${names.join(", ")}${authors.length > 3 ? " et al." : ""}`;
  }

  function renderPaperTrendClusterSummary(items) {
    const titleCorpus = items.map((item) => item.title.toLowerCase()).join(" ");
    const clusters = researchTrendClusters()
      .map((cluster) => ({
        ...cluster,
        count: items.length
          ? items.filter((item) => cluster.terms.some((term) => item.title.toLowerCase().includes(term))).length
          : 0,
        hit: cluster.terms.some((term) => titleCorpus.includes(term))
      }))
      .sort((a, b) => b.count - a.count);

    return clusters
      .slice(0, 6)
      .map((cluster) => `
        <article class="paper-trend-cluster-card ${cluster.count ? "has-hits" : ""}">
          <span>${cluster.count ? text({ ko: "감지", en: "Detected" }) : text({ ko: "트렌드 축", en: "Trend axis" })}</span>
          <strong>${escapeHtml(cluster.label)}</strong>
          <p>${cluster.count ? text({ ko: `${cluster.count}편 관련`, en: `${cluster.count} matched records` }) : text(cluster.hint)}</p>
        </article>
      `)
      .join("");
  }

  function renderPaperTrendIntro() {
    return `
      <article class="paper-result-card paper-result-placeholder">
        <div>
          <span class="paper-result-date">${text({ ko: "준비됨", en: "Ready" })}</span>
          <h3>${text({ ko: "관심 주제와 저널을 선택해 최신 논문 흐름을 확인하세요.", en: "Select a topic and journal to scan recent literature." })}</h3>
          <p>${text({
            ko: "지정한 건설관리, 건축공학, 토목공학, 프로젝트관리 저널 전체를 대상으로 DOI 메타데이터를 조회합니다.",
            en: "The scan covers the full target journal set and retrieves DOI metadata where available."
          })}</p>
        </div>
      </article>
    `;
  }

  function renderPaperTrendLoading() {
    return [1, 2, 3]
      .map(
        () => `
          <article class="paper-result-card paper-result-loading">
            <span></span>
            <strong></strong>
            <p></p>
          </article>
        `
      )
      .join("");
  }

  function renderPaperTrendEmpty(data) {
    return `
      <article class="paper-result-card paper-result-placeholder">
        <div>
          <span class="paper-result-date">${text({ ko: "검색 결과 없음", en: "No matches" })}</span>
          <h3>${escapeHtml(buildPaperTrendPhrase(data))}</h3>
          <p>${text({ ko: "검색어를 줄이거나 전체 지정 저널 범위에서 다시 시도해보세요.", en: "Try a broader query or search across all target journals." })}</p>
        </div>
      </article>
    `;
  }

  function renderPaperTrendError(data) {
    return `
      <article class="paper-result-card paper-result-placeholder">
        <div>
          <span class="paper-result-date">${text({ ko: "외부 API 연결 실패", en: "External API unavailable" })}</span>
          <h3>${escapeHtml(buildPaperTrendPhrase(data))}</h3>
          <p>${text({ ko: "네트워크나 CORS 정책 때문에 미리보기를 불러오지 못할 수 있습니다. 위의 외부 검색 링크는 계속 사용할 수 있습니다.", en: "Network or CORS policy may block the preview. The external search links above remain available." })}</p>
        </div>
      </article>
    `;
  }

  function renderPaperTrendResultItem(item) {
    const href = item.doi ? `https://doi.org/${item.doi}` : item.url || scholarSearchUrl(item.title);

    return `
      <article class="paper-result-card">
        <div class="paper-result-main">
          <span class="paper-result-date">${escapeHtml(item.date)}</span>
          <h3><a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.authors)}</p>
          <div class="paper-result-meta">
            <span>${icon("book")}${escapeHtml(item.venue)}</span>
            ${item.doi ? `<span>DOI ${escapeHtml(item.doi)}</span>` : ""}
            ${item.citations ? `<span>${text({ ko: `Crossref 인용 ${item.citations}`, en: `Crossref citations ${item.citations}` })}</span>` : ""}
          </div>
        </div>
      </article>
    `;
  }

  function ensureRuntimeStyleOverrides() {
    const styleId = "site-runtime-overrides";
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      body,
      .site-frame,
      .site-sidebar,
      .hero-panel,
      .summary-card,
      .nav-item,
      .button,
      .sidebar-contact-value,
      .sidebar-affiliation {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }

      .site-sidebar {
        gap: 18px !important;
      }

      .sidebar-profile-block {
        display: grid !important;
        gap: 14px !important;
      }

      .sidebar-profile-kicker {
        margin: 0 !important;
        color: #7f6544 !important;
        font-family: "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", Arial, sans-serif !important;
        font-size: 0.8rem !important;
        font-weight: 700 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
      }

      .sidebar-profile-head {
        display: grid !important;
        grid-template-columns: auto minmax(0, 1fr) !important;
        gap: 16px !important;
        align-items: center !important;
      }

      .sidebar-photo-frame {
        width: 120px !important;
        height: 120px !important;
        margin: 0 !important;
        padding: 3px !important;
        border-radius: 999px !important;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 248, 253, 0.98)),
          radial-gradient(circle at 30% 20%, rgba(121, 175, 232, 0.2), rgba(121, 175, 232, 0)) !important;
        box-shadow:
          0 16px 32px rgba(16, 39, 66, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.86) !important;
      }

      .profile-portrait {
        border-radius: 999px !important;
        object-position: center top !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        filter: contrast(1.06) saturate(1.04) !important;
      }

      .sidebar-identity {
        min-width: 0 !important;
        display: grid !important;
        gap: 6px !important;
        text-align: left !important;
        align-content: center !important;
      }

      .sidebar-name {
        margin: 0 !important;
        font-size: clamp(1.68rem, 1.85vw, 2rem) !important;
        font-weight: 760 !important;
        line-height: 1.04 !important;
        letter-spacing: -0.032em !important;
      }

      .sidebar-affiliation {
        max-width: none !important;
        margin: 0 !important;
        color: #62778c !important;
        font-size: 0.93rem !important;
        font-weight: 500 !important;
        line-height: 1.56 !important;
        letter-spacing: -0.012em !important;
      }

      .sidebar-contact-card {
        margin-top: 2px !important;
      }

      .sidebar-social {
        justify-content: flex-start !important;
      }

      .hero-panel .hero-layout,
      .hero-panel .hero-layout-simple {
        grid-template-columns: minmax(0, 1fr) !important;
        align-items: start !important;
        gap: 20px !important;
      }

      .hero-panel .hero-copy {
        max-width: min(100%, 820px) !important;
      }

      .hero-panel .hero-kicker {
        max-width: 48rem !important;
        margin: 0 0 0.25rem !important;
        font-family: "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", Arial, sans-serif !important;
        font-size: clamp(0.86rem, 1vw, 0.96rem) !important;
        font-weight: 600 !important;
        line-height: 1.42 !important;
        letter-spacing: 0.002em !important;
        text-transform: none !important;
        color: #8f6d4c !important;
      }

      .hero-panel .hero-title {
        max-width: 10.2ch !important;
        font-family: "Noto Serif KR", "Nanum Myeongjo", "Batang", Georgia, "Times New Roman", serif !important;
        font-size: clamp(2.98rem, 5.65vw, 4.78rem) !important;
        font-weight: 760 !important;
        line-height: 1.02 !important;
        letter-spacing: -0.026em !important;
        color: #132741 !important;
      }

      .hero-panel .hero-title .hero-title-tag {
        display: inline-block !important;
        margin-left: 0.24em !important;
        transform: translateY(-0.12em) !important;
        color: #6e7781 !important;
        font-family: "Noto Serif KR", "Nanum Myeongjo", Georgia, "Times New Roman", serif !important;
        font-size: clamp(1.1rem, 1.62vw, 1.48rem) !important;
        font-weight: 700 !important;
        line-height: 1.15 !important;
        letter-spacing: 0 !important;
        white-space: nowrap !important;
      }

      .hero-panel .hero-caption {
        display: inline-flex !important;
        width: fit-content !important;
        margin-top: 0.35rem !important;
        padding: 0.76rem 1.18rem !important;
        border-radius: 999px !important;
        background: linear-gradient(180deg, rgba(224, 232, 241, 0.96), rgba(214, 223, 235, 0.88)) !important;
        font-family: "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", Arial, sans-serif !important;
        font-size: 0.94rem !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        letter-spacing: -0.006em !important;
        text-transform: none !important;
        color: #26486e !important;
      }

      .hero-panel .hero-lead {
        display: block !important;
        margin-top: 1.05rem !important;
        max-width: 44rem !important;
        font-size: 1rem !important;
        line-height: 1.76 !important;
        letter-spacing: -0.006em !important;
        color: #60768b !important;
      }

      .hero-summary {
        margin-top: 1.5rem !important;
        gap: 18px !important;
        align-items: stretch !important;
      }

      .summary-card {
        display: grid !important;
        grid-template-rows: minmax(3.55rem, auto) auto 1fr !important;
        align-content: start !important;
        gap: 0.82rem !important;
        min-height: 214px !important;
        padding: 26px 26px 24px !important;
      }

      .summary-label {
        display: block !important;
        min-height: 3.55rem !important;
        margin: 0 !important;
        font-family: "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", Arial, sans-serif !important;
        font-size: 0.94rem !important;
        font-weight: 600 !important;
        line-height: 1.32 !important;
        letter-spacing: -0.004em !important;
        text-transform: none !important;
        color: #8f6d4c !important;
      }

      .summary-value {
        margin: 0 !important;
        align-self: start !important;
        font-family: "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", Arial, sans-serif !important;
        font-size: clamp(2.05rem, 2.2vw, 2.65rem) !important;
        font-weight: 700 !important;
        line-height: 0.94 !important;
        letter-spacing: -0.038em !important;
        color: #132741 !important;
      }

      .summary-detail {
        margin: 0 !important;
        align-self: end !important;
        font-family: "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", "Segoe UI", Arial, sans-serif !important;
        font-size: 0.94rem !important;
        line-height: 1.48 !important;
        letter-spacing: -0.008em !important;
        color: #667d93 !important;
      }

      .sidebar-contact-value,
      .nav-item,
      .button,
      .lang-pill {
        letter-spacing: -0.008em !important;
      }

      .nav-item,
      .button,
      .lang-pill {
        font-size: 0.94rem !important;
      }

      .paper-trend-panel {
        display: grid !important;
        gap: 18px !important;
        padding: 22px !important;
        border: 0 !important;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.98)) !important;
      }

      .paper-trend-form {
        display: grid !important;
        grid-template-columns: minmax(240px, 1fr) minmax(210px, 0.72fr) minmax(150px, 0.36fr) auto !important;
        gap: 12px !important;
        align-items: end !important;
      }

      .paper-trend-field {
        display: grid !important;
        gap: 7px !important;
        min-width: 0 !important;
      }

      .paper-trend-field span {
        color: #57606a !important;
        font-size: 0.82rem !important;
        font-weight: 800 !important;
      }

      .paper-trend-field input,
      .paper-trend-field select {
        width: 100% !important;
        min-height: 42px !important;
        padding: 0 12px !important;
        border: 1px solid #d0d7de !important;
        border-radius: 8px !important;
        background: #ffffff !important;
        color: #24292f !important;
        font: inherit !important;
        font-weight: 600 !important;
        outline: none !important;
      }

      .paper-trend-field input:focus,
      .paper-trend-field select:focus {
        border-color: #2da44e !important;
        box-shadow: 0 0 0 3px rgba(45, 164, 78, 0.16) !important;
      }

      .paper-trend-submit {
        min-height: 42px !important;
        white-space: nowrap !important;
      }

      .paper-trend-topics,
      .paper-journal-strip,
      .paper-trend-source-row,
      .paper-result-meta {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
      }

      .paper-topic-chip,
      .paper-journal-chip {
        appearance: none !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 34px !important;
        border: 1px solid #d0d7de !important;
        border-radius: 999px !important;
        background: #ffffff !important;
        color: #24292f !important;
        font: inherit !important;
        font-size: 0.88rem !important;
        font-weight: 700 !important;
      }

      .paper-topic-chip {
        padding: 0 12px !important;
      }

      .paper-journal-chip {
        gap: 6px !important;
        padding: 0 12px !important;
      }

      .paper-journal-chip small {
        color: #57606a !important;
        font-size: 0.72rem !important;
        font-weight: 700 !important;
      }

      .paper-topic-chip.is-active,
      .paper-journal-chip.is-active {
        border-color: #1f883d !important;
        background: #dafbe1 !important;
        color: #116329 !important;
      }

      .paper-trend-meta,
      .paper-trend-clusters {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 12px !important;
      }

      .paper-trend-meta article,
      .paper-trend-cluster-card,
      .paper-result-card {
        display: grid !important;
        gap: 8px !important;
        padding: 16px !important;
        border: 1px solid #d8dee4 !important;
        border-radius: 10px !important;
        background: #ffffff !important;
        box-shadow: none !important;
      }

      .paper-trend-meta span,
      .paper-trend-cluster-card span,
      .paper-result-date {
        color: #57606a !important;
        font-size: 0.75rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.04em !important;
        text-transform: uppercase !important;
      }

      .paper-trend-meta strong,
      .paper-trend-cluster-card strong,
      .paper-result-card h3 {
        color: #24292f !important;
        font-weight: 800 !important;
        line-height: 1.4 !important;
      }

      .paper-trend-cluster-card.has-hits {
        border-color: #aceebb !important;
        background: #f0fff4 !important;
      }

      .paper-trend-results {
        display: grid !important;
        gap: 12px !important;
      }

      .paper-result-card p,
      .paper-trend-note,
      .paper-trend-status,
      .paper-trend-cluster-card p {
        color: #57606a !important;
        line-height: 1.65 !important;
      }

      .paper-result-meta span {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        min-height: 30px !important;
        padding: 4px 9px !important;
        border-radius: 999px !important;
        background: #f6f8fa !important;
        color: #57606a !important;
        font-size: 0.82rem !important;
        font-weight: 700 !important;
      }

      .paper-result-loading span,
      .paper-result-loading strong,
      .paper-result-loading p {
        display: block !important;
        border-radius: 999px !important;
        background: #f6f8fa !important;
      }

      @media (max-width: 1180px) {
        .paper-trend-form,
        .paper-trend-meta,
        .paper-trend-clusters {
          grid-template-columns: 1fr 1fr !important;
        }
      }

      @media (max-width: 720px) {
        .paper-trend-form,
        .paper-trend-meta,
        .paper-trend-clusters {
          grid-template-columns: 1fr !important;
        }

        .paper-trend-submit,
        .paper-trend-source-row .section-action {
          width: 100% !important;
          justify-content: center !important;
        }
      }

      .hero-panel .hero-schematic,
      .hero-panel .hero-visual,
      .hero-panel .hero-diagram-shell {
        display: none !important;
      }

      @media (max-width: 1120px) {
        .summary-card {
          min-height: 198px !important;
        }
      }

      @media (max-width: 820px) {
        .sidebar-profile-head {
          gap: 14px !important;
        }

        .sidebar-photo-frame {
          width: 92px !important;
          height: 92px !important;
        }

        .hero-panel .hero-kicker {
          max-width: none !important;
          font-size: 0.84rem !important;
        }

        .hero-panel .hero-title {
          max-width: none !important;
          font-size: clamp(2.5rem, 10vw, 3.75rem) !important;
        }

        .hero-panel .hero-title .hero-title-tag {
          display: block !important;
          margin: 0.42rem 0 0 !important;
          transform: none !important;
          white-space: normal !important;
        }

        .hero-panel .hero-caption {
          font-size: 0.95rem !important;
        }

        .summary-card {
          grid-template-rows: minmax(2.9rem, auto) auto 1fr !important;
          min-height: 172px !important;
          padding: 22px 20px 20px !important;
        }

        .summary-label {
          min-height: 2.9rem !important;
          font-size: 0.92rem !important;
        }

        .summary-value {
          font-size: clamp(2.05rem, 8.5vw, 2.55rem) !important;
        }

        .summary-detail {
          font-size: 0.92rem !important;
        }
      }

      @media (max-width: 560px) {
        .sidebar-profile-head {
          grid-template-columns: 1fr !important;
          justify-items: start !important;
        }

        .sidebar-photo-frame {
          width: 96px !important;
          height: 96px !important;
        }
      }
    `;
  }

  function finalizeRenderedPage() {
    const sidebarRows = Array.from(app.querySelectorAll(".sidebar-contact-row"));

    if (sidebarRows[0]?.querySelector(".sidebar-contact-value")) {
      sidebarRows[0].querySelector(".sidebar-contact-value").textContent =
        lang === "ko"
          ? "15588 경기도 안산시 상록구 한양대학로 55"
          : "55 Hanyangdaehak-ro, Sangnok-gu, Ansan-si, Gyeonggi-do 15588";
    }

    if (sidebarRows[2]?.querySelector(".sidebar-contact-value")) {
      sidebarRows[2].querySelector(".sidebar-contact-value").textContent = "+82 10-7392-9933";
    }

    if (page === "contact") {
      refreshContactBoardList();
    }

    if (page === "trends") {
      initializePaperTrendPanel();
      return;
    }

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

    const heroCopy = siteMain.querySelector(".hero-panel .hero-copy");
    if (!heroCopy) {
      return;
    }

    const heroKicker = heroCopy.querySelector(".hero-kicker");
    const heroTitle = heroCopy.querySelector(".hero-title");
    let heroCaption = heroCopy.querySelector(".hero-caption");
    let heroLead = heroCopy.querySelector(".hero-lead");
    const buttonRow = heroCopy.querySelector(".button-row");
    const buttonLabels = buttonRow ? buttonRow.querySelectorAll("span") : [];

    const heroText = {
      kicker: "Hanyang University ERICA · AI Construction Technology Research Center",
      title: "Construction AI & Data Intelligence",
      caption:
        "Building Maintenance · Safety · Prediction · Decision Support",
      lead:
        lang === "ko"
          ? "건축·도시·시공 데이터를 바탕으로 노후 건축물 유지관리, 안전, 성능 예측, 의사결정 지원을 연결하는 연구를 수행합니다."
          : "Research focused on data-driven maintenance, safety, performance prediction, and decision support for the built environment."
    };

    if (heroKicker) {
      heroKicker.textContent = heroText.kicker;
    }

    if (heroTitle) {
      heroTitle.textContent = heroText.title;
    }

    if (!heroCaption && heroTitle) {
      heroCaption = document.createElement("p");
      heroCaption.className = "hero-caption";
      heroTitle.insertAdjacentElement("afterend", heroCaption);
    }

    if (heroCaption) {
      heroCaption.textContent = heroText.caption;
    }

    if (!heroLead) {
      heroLead = document.createElement("p");
      heroLead.className = "hero-lead";
      (heroCaption || heroTitle)?.insertAdjacentElement("afterend", heroLead);
    }

    if (heroLead) {
      heroLead.textContent = heroText.lead;
    }

    if (buttonLabels[0]) {
      buttonLabels[0].textContent = lang === "ko" ? "전체 논문 보기" : "View publications";
    }

    if (heroLead && buttonRow && heroLead.nextElementSibling !== buttonRow) {
      heroLead.insertAdjacentElement("afterend", buttonRow);
    }

    initializePaperTrendPanel();
  }

  function finalizeRenderedPage() {
    const koreanAddress = "15588 \uacbd\uae30\ub3c4 \uc548\uc0b0\uc2dc \uc0c1\ub85d\uad6c \ud55c\uc591\ub300\ud559\ub85c 55, \uc81c2\uacf5\ud559\uad00 507\ud638";
    const koreanAffiliation = "\ud55c\uc591\ub300\ud559\uad50 ERICA \uc778\uacf5\uc9c0\ub2a5 \uac74\uc124\uae30\uc220 \uc5f0\uad6c\uc13c\ud130";
    const applySidebarText = () => {
      const sidebarRows = Array.from(app.querySelectorAll(".sidebar-contact-row"));

      if (sidebarRows[0]?.querySelector(".sidebar-contact-value")) {
        sidebarRows[0].querySelector(".sidebar-contact-value").textContent =
          lang === "ko"
            ? koreanAddress
            : "Room 507, Engineering Building II, 55 Hanyangdaehak-ro, Sangnok-gu, Ansan-si, Gyeonggi-do 15588";
      }

      if (sidebarRows[1]?.querySelector(".sidebar-contact-value")) {
        sidebarRows[1].querySelector(".sidebar-contact-value").innerHTML = `
          <a class="sidebar-contact-link" href="mailto:nhkwon@hanyang.ac.kr">nhkwon@hanyang.ac.kr</a>
          <a class="sidebar-contact-link" href="mailto:nhkwon78@naver.com">nhkwon78@naver.com</a>
        `;
        sidebarRows[1].querySelector(".sidebar-contact-value").classList.add("sidebar-email-list");
      }

      if (sidebarRows[2]?.querySelector(".sidebar-contact-value")) {
        sidebarRows[2].querySelector(".sidebar-contact-value").textContent = "+82 10-7392-9933";
      }

      const sidebarAffiliation = app.querySelector(".sidebar-affiliation");
      if (sidebarAffiliation) {
        sidebarAffiliation.textContent =
          lang === "ko"
            ? koreanAffiliation
            : "AI Construction Technology Research Center, Hanyang University ERICA";
      }
    };

    applySidebarText();
    requestAnimationFrame(applySidebarText);
    setTimeout(applySidebarText, 80);

    if (page === "contact") {
      refreshContactBoardList();
    }

    if (page === "trends") {
      initializePaperTrendPanel();
      return;
    }

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

    const heroCopy = siteMain.querySelector(".hero-panel .hero-copy");
    if (!heroCopy) {
      return;
    }

    const heroKicker = heroCopy.querySelector(".hero-kicker");
    const heroTitle = heroCopy.querySelector(".hero-title");
    let heroCaption = heroCopy.querySelector(".hero-caption");
    let heroLead = heroCopy.querySelector(".hero-lead");
    const buttonRow = heroCopy.querySelector(".button-row");
    const buttonLabels = buttonRow ? buttonRow.querySelectorAll("span") : [];

    const heroText = {
      kicker: "Hanyang University ERICA · AI Construction Technology Research Center",
      title: 'Construction AI & Data<br class="hero-title-break">Intelligence <span class="hero-title-tag">with Codex and Vibe Coding</span>',
      lead:
        lang === "ko"
          ? "\uac74\ucd95\u00b7\ub3c4\uc2dc\u00b7\uc2dc\uacf5 \ub370\uc774\ud130\ub97c \ubc14\ud0d5\uc73c\ub85c \ub178\ud6c4 \uac74\ucd95\ubb3c \uc720\uc9c0\uad00\ub9ac, \uc548\uc804, \uc131\ub2a5 \uc608\uce21, \uc758\uc0ac\uacb0\uc815 \uc9c0\uc6d0\uc744 \uc5f0\uacb0\ud558\ub294 \uc5f0\uad6c\ub97c \uc218\ud589\ud569\ub2c8\ub2e4."
          : "Research focused on data-driven maintenance, safety, performance prediction, and decision support for the built environment."
    };

    if (heroKicker) {
      heroKicker.textContent = heroText.kicker;
    }

    if (heroTitle) {
      heroTitle.innerHTML = heroText.title;
    }

    if (heroCaption) {
      heroCaption.remove();
      heroCaption = null;
    }

    if (!heroLead) {
      heroLead = document.createElement("p");
      heroLead.className = "hero-lead";
      (heroCaption || heroTitle)?.insertAdjacentElement("afterend", heroLead);
    }

    if (heroLead) {
      heroLead.textContent = heroText.lead;
    }

    if (buttonLabels[0]) {
      buttonLabels[0].textContent = lang === "ko" ? "\uc804\uccb4 \ub17c\ubb38 \ubcf4\uae30" : "View publications";
    }

    if (heroLead && buttonRow && heroLead.nextElementSibling !== buttonRow) {
      heroLead.insertAdjacentElement("afterend", buttonRow);
    }

    initializePaperTrendPanel();
  }
  }

  if (window.SITE_DATA_READY && typeof window.SITE_DATA_READY.finally === "function") {
    window.SITE_DATA_READY.finally(bootSite);
  } else {
    bootSite();
  }
})();
