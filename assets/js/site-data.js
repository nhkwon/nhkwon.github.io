const SITE_DATA = {
  profile: {
    name: "N.H. Kwon",
    initials: "NH",
    title: {
      ko: "강화학습 · 로봇지능 · AI 시스템",
      en: "Reinforcement Learning · Robotics · AI Systems"
    },
    affiliation: {
      ko: "연구, 프로젝트, 기술 글을 한곳에 정리하는 개인 허브",
      en: "A personal hub for research, projects, and technical writing"
    },
    location: {
      ko: "Seoul, Korea",
      en: "Seoul, Korea"
    },
    status: {
      ko: "Embodied AI, learning systems, and applied engineering",
      en: "Embodied AI, learning systems, and applied engineering"
    },
    email: "hello@example.com",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/nhkwon"
      },
      {
        label: "Blog",
        url: "https://nhkwon.tistory.com"
      },
      {
        label: "Email",
        url: "mailto:hello@example.com"
      }
    ]
  },
  hero: {
    eyebrow: {
      ko: "Reference-inspired academic site structure",
      en: "Reference-inspired academic site structure"
    },
    headline: {
      ko: "연구, 프로젝트, 글, 협업 이력을 한눈에 보여주는 개인 홈페이지",
      en: "A personal website that brings research, projects, writing, and collaboration into one place"
    },
    description: {
      ko: "메인 랜딩과 세부 페이지를 분리해 홈에서는 전체 방향을 보여주고, 각 세부 페이지에서는 소개, 아웃풋, 학습/멘토링, 소식, 연락 방식을 더 자세히 정리할 수 있게 구성했습니다.",
      en: "This build separates a strong landing page from focused detail pages. The home page gives a quick overview, while dedicated pages expand biography, outputs, learning and mentoring, updates, and contact."
    },
    panelTitle: {
      ko: "Current snapshot",
      en: "Current snapshot"
    },
    buttons: [
      {
        page: "bio",
        kind: "primary",
        label: {
          ko: "소개 자세히 보기",
          en: "Open biography"
        }
      },
      {
        page: "publications",
        kind: "secondary",
        label: {
          ko: "아웃풋 정리 보기",
          en: "Open outputs"
        }
      }
    ],
    badges: [
      "Embodied AI",
      "Robot Learning",
      "Technical Notes",
      "GitHub Pages"
    ]
  },
  stats: [
    {
      label: {
        ko: "현재 초점",
        en: "Current focus"
      },
      value: {
        ko: "로봇과 에이전트 시스템에서 학습-실험-배포 사이클을 빠르게 돌리는 구조 설계",
        en: "Designing fast iteration loops across learning, evaluation, and deployment for robot and agent systems"
      }
    },
    {
      label: {
        ko: "정리 방식",
        en: "Publishing mode"
      },
      value: {
        ko: "긴 논문 목록뿐 아니라 읽기 노트, 코드, 데모, 프로젝트 맥락까지 함께 기록",
        en: "Capturing not only papers, but also reading notes, code, demos, and the context behind each project"
      }
    },
    {
      label: {
        ko: "협업 스타일",
        en: "Collaboration style"
      },
      value: {
        ko: "문제 정의, 실험 설계, 재현성, 문서화까지 한 흐름으로 맞추는 방식 선호",
        en: "Preferring a workflow that aligns problem framing, experiment design, reproducibility, and documentation"
      }
    }
  ],
  about: {
    section: {
      eyebrow: {
        ko: "About",
        en: "About"
      },
      title: {
        ko: "소개",
        en: "Biography"
      },
      description: {
        ko: "짧은 이력, 관심사, 일하는 방식을 한 페이지 안에서 읽히도록 정리했습니다.",
        en: "A compact overview of background, interests, and working style."
      }
    },
    paragraphs: [
      {
        ko: "이 사이트는 연구실 소개형 홈페이지 구조를 바탕으로 만들었지만, 논문 목록만 나열하는 대신 연구 맥락과 기술 글, 프로젝트 정리까지 함께 보이도록 설계했습니다.",
        en: "This site borrows the structure of an academic homepage, but it goes beyond listing publications by showing research context, technical writing, and project work together."
      },
      {
        ko: "공개된 `nhkwon` 블로그 글 흐름을 기준으로 강화학습, 로봇 조작, 에이전트 시스템을 핵심 축으로 두고, 이후 실제 소속·이력·성과로 자연스럽게 확장할 수 있는 형태로 잡았습니다.",
        en: "Based on the public trail of `nhkwon` technical notes, the current draft centers reinforcement learning, robot manipulation, and agent systems, while staying flexible enough to grow into a fuller profile with real affiliations, roles, and outcomes."
      }
    ],
    highlights: [
      {
        title: {
          ko: "문제 정의",
          en: "Problem framing"
        },
        body: {
          ko: "현상을 설명하는 것에 그치지 않고, 어떤 시스템으로 검증할지까지 함께 설계합니다.",
          en: "The goal is not just to describe a phenomenon, but to define the system that can validate it."
        }
      },
      {
        title: {
          ko: "재현 가능성",
          en: "Reproducibility"
        },
        body: {
          ko: "실험 결과와 구현 경로를 함께 남겨 다음 실험이나 협업이 빨라지게 만듭니다.",
          en: "Results are paired with implementation notes so the next experiment or collaboration starts faster."
        }
      },
      {
        title: {
          ko: "지식 공유",
          en: "Knowledge sharing"
        },
        body: {
          ko: "논문, 블로그, 데모, 코드가 따로 놀지 않도록 한 흐름으로 엮어 공개하는 방식을 지향합니다.",
          en: "Papers, blog posts, demos, and code are treated as one connected publication stream."
        }
      }
    ],
    timeline: [
      {
        period: {
          ko: "2026 - Present",
          en: "2026 - Present"
        },
        title: {
          ko: "개인 연구/프로젝트 허브 정비",
          en: "Structuring a personal research and project hub"
        },
        body: {
          ko: "메인 페이지와 세부 페이지를 분리해 연구, 아웃풋, 소식, 연락 채널을 명확히 정리하는 구조로 재설계했습니다.",
          en: "The site architecture was reorganized so research, outputs, updates, and contact paths are separated but still easy to navigate."
        }
      },
      {
        period: {
          ko: "2024 - 2025",
          en: "2024 - 2025"
        },
        title: {
          ko: "강화학습·로봇 조작 논문 읽기 노트 축적",
          en: "Accumulating reading notes on RL and robot manipulation"
        },
        body: {
          ko: "PPO와 HAMSTER 같은 주제를 공개 블로그 글로 정리하며 연구 관심사를 외부에 드러내기 시작했습니다.",
          en: "Public notes on topics such as PPO and HAMSTER created an external trail of research interests around RL and robot learning."
        }
      },
      {
        period: {
          ko: "Ongoing",
          en: "Ongoing"
        },
        title: {
          ko: "실험-문서-배포 루프 정교화",
          en: "Tightening the experiment-documentation-deployment loop"
        },
        body: {
          ko: "코드, 문서, 발표 자료, 데모가 같은 프로젝트 흐름 안에서 움직이는 방식을 계속 개선하고 있습니다.",
          en: "The ongoing goal is to keep code, documentation, talks, and demos moving inside one coherent workflow."
        }
      }
    ],
    principles: [
      {
        title: {
          ko: "Fast iteration",
          en: "Fast iteration"
        },
        body: {
          ko: "작은 실험을 빠르게 반복하며 설계의 병목을 먼저 찾습니다.",
          en: "Start with small experiments, then identify the true bottleneck before scaling."
        }
      },
      {
        title: {
          ko: "Readable artifacts",
          en: "Readable artifacts"
        },
        body: {
          ko: "남겨둔 결과물은 나중의 나와 다른 협업자도 이해할 수 있어야 한다고 봅니다.",
          en: "Every artifact should stay readable for both future collaborators and future-you."
        }
      },
      {
        title: {
          ko: "Systems perspective",
          en: "Systems perspective"
        },
        body: {
          ko: "모델 성능뿐 아니라 데이터 수집, 평가, 운영 비용까지 함께 봅니다.",
          en: "Model quality is evaluated together with data flow, evaluation, and operational cost."
        }
      }
    ],
    toolkit: [
      "PyTorch",
      "Simulation",
      "Evaluation",
      "Experiment Tracking",
      "Documentation",
      "GitHub Pages"
    ]
  },
  research: {
    section: {
      eyebrow: {
        ko: "Research",
        en: "Research"
      },
      title: {
        ko: "연구 및 기술 관심사",
        en: "Research and technical interests"
      },
      description: {
        ko: "공개 블로그와 참고 사이트의 구조를 바탕으로, 현재 초점을 설명할 수 있는 핵심 축으로 재구성했습니다.",
        en: "The current layout turns the observed themes into a compact set of research axes."
      }
    },
    areas: [
      {
        title: {
          ko: "강화학습과 정책 최적화",
          en: "Reinforcement learning and policy optimization"
        },
        body: {
          ko: "정책 경사, 샘플 효율, 보상 설계, 학습 안정성을 실제 문제 구조와 연결해 이해하는 데 관심이 있습니다.",
          en: "Interested in connecting policy gradients, sample efficiency, reward design, and learning stability to real problem structures."
        },
        tags: ["RL", "Optimization", "Policy Learning"]
      },
      {
        title: {
          ko: "로봇 조작과 embodied AI",
          en: "Robot manipulation and embodied AI"
        },
        body: {
          ko: "오픈월드 일반화, 계층형 제어, 시각-언어-행동 결합 구조를 중심으로 로봇 지능을 바라봅니다.",
          en: "A strong focus on open-world generalization, hierarchical control, and vision-language-action integration for robotic intelligence."
        },
        tags: ["Robotics", "Embodied AI", "Generalization"]
      },
      {
        title: {
          ko: "에이전트 시스템과 도구 활용",
          en: "Agent systems and tool use"
        },
        body: {
          ko: "모델 호출, 툴 연동, 평가 기준, 운영 안정성을 함께 고려하는 end-to-end 시스템 설계에 흥미가 있습니다.",
          en: "An interest in end-to-end systems that balance model calls, tool integration, evaluation criteria, and operational robustness."
        },
        tags: ["LLM Systems", "Tool Use", "Evaluation"]
      },
      {
        title: {
          ko: "기술 글쓰기와 지식 구조화",
          en: "Technical writing and knowledge structuring"
        },
        body: {
          ko: "논문이나 구현 내용을 다시 설명 가능한 구조로 풀어내고, 이후 연구나 협업의 발판으로 삼는 방식을 중요하게 생각합니다.",
          en: "Treating writing as a reusable technical asset that supports the next round of research or collaboration."
        },
        tags: ["Writing", "Synthesis", "Public Notes"]
      }
    ],
    workflow: [
      {
        title: {
          ko: "Observe",
          en: "Observe"
        },
        body: {
          ko: "논문, 시스템, 실제 문제에서 어떤 병목이 반복되는지 먼저 봅니다.",
          en: "Start by observing which bottlenecks keep appearing across papers, systems, and real workflows."
        }
      },
      {
        title: {
          ko: "Prototype",
          en: "Prototype"
        },
        body: {
          ko: "작게 구현해보고 성능보다 구조적 리스크를 먼저 확인합니다.",
          en: "Build a fast prototype and inspect structural risks before chasing peak performance."
        }
      },
      {
        title: {
          ko: "Document",
          en: "Document"
        },
        body: {
          ko: "남는 결과물은 다음 실험이나 발표 자료로 재사용할 수 있게 정리합니다.",
          en: "Package what was learned so it can turn into the next experiment, note, or talk."
        }
      }
    ]
  },
  outputs: {
    section: {
      eyebrow: {
        ko: "Outputs",
        en: "Outputs"
      },
      title: {
        ko: "논문, 글, 데모를 함께 보여주는 아웃풋 정리",
        en: "A publication area that can hold papers, notes, and demos together"
      },
      description: {
        ko: "아직 정식 논문 목록이 많지 않더라도, 공개 노트와 프로젝트를 함께 보일 수 있는 구조로 만들었습니다.",
        en: "Even before a long paper list exists, the structure can already showcase public notes, repositories, and project artifacts."
      }
    },
    featured: [
      {
        type: {
          ko: "Technical Note",
          en: "Technical Note"
        },
        date: "2024-08-08",
        title: {
          ko: "PPO 논문 읽기 노트",
          en: "Reading note on PPO"
        },
        meta: {
          ko: "정책 최적화 · 강화학습",
          en: "Policy optimization · Reinforcement learning"
        },
        description: {
          ko: "Proximal Policy Optimization의 핵심 아이디어와 surrogate objective를 한국어로 정리한 공개 글입니다.",
          en: "A public Korean note summarizing the key idea behind Proximal Policy Optimization and its surrogate objective."
        },
        href: "https://nhkwon.tistory.com/1",
        linkLabel: {
          ko: "글 보기",
          en: "Read note"
        },
        external: true,
        tags: ["RL", "PPO", "Reading Note"]
      },
      {
        type: {
          ko: "Technical Note",
          en: "Technical Note"
        },
        date: "2025-06-26",
        title: {
          ko: "HAMSTER 논문 읽기 노트",
          en: "Reading note on HAMSTER"
        },
        meta: {
          ko: "로봇 조작 · Vision-Language-Action",
          en: "Robot manipulation · Vision-Language-Action"
        },
        description: {
          ko: "오픈월드 로봇 조작을 위한 계층형 action model 구조를 정리한 공개 글입니다.",
          en: "A public note on a hierarchical action model for open-world robot manipulation."
        },
        href: "https://nhkwon.tistory.com/3",
        linkLabel: {
          ko: "글 보기",
          en: "Read note"
        },
        external: true,
        tags: ["Robotics", "Embodied AI", "VLA"]
      },
      {
        type: {
          ko: "Site Architecture",
          en: "Site Architecture"
        },
        date: "2026-04-10",
        title: {
          ko: "GitHub Pages용 개인 사이트 베이스",
          en: "A GitHub Pages base for a personal site"
        },
        meta: {
          ko: "정적 HTML · CSS · JS",
          en: "Static HTML · CSS · JS"
        },
        description: {
          ko: "메인 페이지와 세부 페이지를 나누고, 공용 데이터 파일 하나로 전체 콘텐츠를 바꿀 수 있게 구성했습니다.",
          en: "The site is split into a landing page and focused detail pages, all powered by one shared content file."
        },
        href: "ko.html",
        linkLabel: {
          ko: "메인 보기",
          en: "Open site"
        },
        external: false,
        tags: ["Portfolio", "Design System", "GitHub Pages"]
      }
    ],
    categories: [
      {
        title: {
          ko: "논문 / 포스터",
          en: "Papers / Posters"
        },
        body: {
          ko: "정식 학술 아웃풋을 연도별 또는 주제별로 정리하기 좋은 영역입니다.",
          en: "A good place for peer-reviewed papers, preprints, posters, and workshop submissions."
        }
      },
      {
        title: {
          ko: "기술 노트",
          en: "Technical Notes"
        },
        body: {
          ko: "논문 읽기, 구현 메모, 실험 정리처럼 생각의 흔적을 빠르게 공개하는 데 적합합니다.",
          en: "Ideal for reading notes, implementation memos, and quick writeups that expose your thinking."
        }
      },
      {
        title: {
          ko: "데모 / 저장소",
          en: "Demos / Repositories"
        },
        body: {
          ko: "코드와 실행 예시를 함께 연결해 결과물이 실재한다는 느낌을 줄 수 있습니다.",
          en: "Connect code and execution artifacts so visitors can see that the work is real and reproducible."
        }
      },
      {
        title: {
          ko: "강연 / 수업 자료",
          en: "Talks / Teaching Material"
        },
        body: {
          ko: "연구 결과를 설명하는 발표 자료와 강의 노트까지 같은 흐름에 포함할 수 있습니다.",
          en: "Talk decks and teaching notes can live in the same publication stream as research outputs."
        }
      }
    ],
    process: [
      {
        title: {
          ko: "One source of truth",
          en: "One source of truth"
        },
        body: {
          ko: "정리 대상 하나마다 대표 링크를 정해 관리하면 전체 목록이 훨씬 깔끔해집니다.",
          en: "Assign one canonical link to each item so the overall list stays clean and maintainable."
        }
      },
      {
        title: {
          ko: "Context matters",
          en: "Context matters"
        },
        body: {
          ko: "무엇을 만들었는지뿐 아니라 왜 만들었는지, 무엇을 배웠는지도 함께 남기면 훨씬 설득력이 생깁니다.",
          en: "Show not just what was built, but why it mattered and what was learned."
        }
      },
      {
        title: {
          ko: "Link artifacts together",
          en: "Link artifacts together"
        },
        body: {
          ko: "논문, 코드, 발표 자료, 블로그 글을 연결하면 방문자가 빠르게 구조를 이해할 수 있습니다.",
          en: "Link papers, code, talks, and notes together so visitors can understand the structure quickly."
        }
      }
    ]
  },
  teaching: {
    section: {
      eyebrow: {
        ko: "Learning",
        en: "Learning"
      },
      title: {
        ko: "학습 트랙과 멘토링 방식",
        en: "Learning tracks and mentoring style"
      },
      description: {
        ko: "참고 사이트의 교육 섹션을 응용해 수업, 세미나, 스터디, 멘토링을 모두 담을 수 있게 했습니다.",
        en: "Inspired by the reference site's teaching section, this page can hold courses, seminars, study groups, and mentoring."
      }
    },
    tracks: [
      {
        title: {
          ko: "Reinforcement Learning Foundations",
          en: "Reinforcement Learning Foundations"
        },
        body: {
          ko: "정책 경사, actor-critic, 보상 설계, sample efficiency를 논문과 구현 관점에서 함께 다루는 트랙입니다.",
          en: "A track for policy gradients, actor-critic methods, reward design, and sample efficiency through both papers and implementation."
        },
        tags: ["RL", "Theory + Practice", "Reading Group"]
      },
      {
        title: {
          ko: "Embodied AI and Robot Learning",
          en: "Embodied AI and Robot Learning"
        },
        body: {
          ko: "VLA, 계층형 제어, 시뮬레이션-현실 전이, 일반화 이슈를 함께 다루는 주제 중심 트랙입니다.",
          en: "A topic-driven track on VLA systems, hierarchical control, sim-to-real transfer, and generalization."
        },
        tags: ["Robotics", "Embodied AI", "Projects"]
      },
      {
        title: {
          ko: "Project Studio",
          en: "Project Studio"
        },
        body: {
          ko: "문헌 조사에서 끝나지 않고, 작은 데모나 재현 실험까지 연결하는 프로젝트형 학습 방식입니다.",
          en: "A project-based format that pushes beyond reading into demos, replications, and working systems."
        },
        tags: ["Implementation", "Demo", "Portfolio"]
      }
    ],
    mentoring: [
      {
        title: {
          ko: "무엇을 중요하게 보는가",
          en: "What I value"
        },
        body: {
          ko: "질문을 잘게 쪼개는 능력, 실패 로그를 정리하는 습관, 그리고 결과물을 끝까지 마무리하는 태도를 중요하게 봅니다.",
          en: "I value the ability to break questions down, keep a clean failure log, and carry work through to a finish."
        }
      },
      {
        title: {
          ko: "함께 일하는 방식",
          en: "How we work"
        },
        body: {
          ko: "짧은 주기로 점검하고, 작은 목표를 계속 완료하는 리듬을 선호합니다.",
          en: "I prefer short check-in cycles and a rhythm of continuously finishing small milestones."
        }
      },
      {
        title: {
          ko: "미리 준비하면 좋은 것",
          en: "What to prepare"
        },
        body: {
          ko: "관심 주제, 현재 수준, 읽은 자료, 해보고 싶은 구현 아이디어를 정리해 두면 협업 시작이 빨라집니다.",
          en: "A short note on interests, current level, readings, and implementation ideas makes collaboration start much faster."
        }
      }
    ],
    principles: [
      {
        ko: "논문을 읽고 끝내지 않고, 최소 하나의 구현 또는 재현 실험으로 연결합니다.",
        en: "Move from reading to at least one implementation or replication experiment."
      },
      {
        ko: "자료는 누적 가능하게 관리해 이후 세미나나 발표 자료로 재활용합니다.",
        en: "Keep study artifacts reusable so they can become the next seminar or talk material."
      },
      {
        ko: "과제형보다 포트폴리오형 결과물을 남기는 흐름을 지향합니다.",
        en: "Aim for portfolio-grade outputs rather than disposable assignments."
      }
    ]
  },
  news: {
    section: {
      eyebrow: {
        ko: "News",
        en: "News"
      },
      title: {
        ko: "소식과 업데이트",
        en: "News and updates"
      },
      description: {
        ko: "홈페이지 개편, 공개 글, 프로젝트 진행 상황을 짧고 빠르게 남길 수 있도록 구성했습니다.",
        en: "A place for site updates, public notes, and short project announcements."
      }
    },
    featured: [
      {
        date: "2026-04-10",
        title: {
          ko: "개인 홈페이지 구조 전면 구축",
          en: "Full personal site structure launched"
        },
        body: {
          ko: "메인 랜딩과 소개/아웃풋/학습/소식/연락 페이지를 분리해 정보 접근성을 높였습니다.",
          en: "The site now separates a main landing page from dedicated biography, outputs, learning, news, and contact pages."
        },
        href: "ko.html",
        linkLabel: {
          ko: "홈으로",
          en: "Go home"
        },
        external: false
      },
      {
        date: "2025-06-26",
        title: {
          ko: "HAMSTER 읽기 노트 공개",
          en: "HAMSTER reading note published"
        },
        body: {
          ko: "오픈월드 로봇 조작과 계층형 action model 구조를 정리한 글을 공개했습니다.",
          en: "Published a note on hierarchical action models for open-world robot manipulation."
        },
        href: "https://nhkwon.tistory.com/3",
        linkLabel: {
          ko: "읽기",
          en: "Read"
        },
        external: true
      },
      {
        date: "2024-08-08",
        title: {
          ko: "PPO 읽기 노트 공개",
          en: "PPO reading note published"
        },
        body: {
          ko: "정책 최적화 기초를 다시 정리하는 글을 공개하며 공개 기술 글 흐름을 시작했습니다.",
          en: "A note on PPO marked the start of a public technical writing stream around policy optimization."
        },
        href: "https://nhkwon.tistory.com/1",
        linkLabel: {
          ko: "읽기",
          en: "Read"
        },
        external: true
      }
    ],
    archive: [
      {
        date: "2026-04-10",
        body: {
          ko: "GitHub Pages용 메인/세부 페이지 구조 구축",
          en: "Built the landing + detail page structure for GitHub Pages"
        }
      },
      {
        date: "2025-06-26",
        body: {
          ko: "로봇 조작 논문 읽기 노트 업데이트",
          en: "Updated the robot manipulation reading note archive"
        }
      },
      {
        date: "2024-08-08",
        body: {
          ko: "강화학습 읽기 노트 시리즈 시작",
          en: "Started a reinforcement learning note series"
        }
      }
    ]
  },
  contact: {
    section: {
      eyebrow: {
        ko: "Contact",
        en: "Contact"
      },
      title: {
        ko: "연락 및 협업 안내",
        en: "Contact and collaboration"
      },
      description: {
        ko: "누가 어떤 주제로 연락하면 좋은지 빠르게 이해할 수 있도록 카드형으로 정리했습니다.",
        en: "Structured as cards so visitors can quickly understand how and when to reach out."
      }
    },
    cards: [
      {
        title: {
          ko: "연구/프로젝트 협업",
          en: "Research / project collaboration"
        },
        body: {
          ko: "문제 정의, 현재 진행 단계, 기대하는 결과물을 함께 보내주면 맥락 파악이 빠릅니다.",
          en: "It helps to include the problem framing, current stage, and the outcome you are hoping for."
        },
        action: {
          label: {
            ko: "메일 보내기",
            en: "Send email"
          },
          href: "mailto:hello@example.com"
        }
      },
      {
        title: {
          ko: "기술 글 / 블로그",
          en: "Writing / blog"
        },
        body: {
          ko: "공개된 읽기 노트와 기술 글은 블로그에서 계속 업데이트할 수 있습니다.",
          en: "Public reading notes and technical writing can continue to grow through the external blog."
        },
        action: {
          label: {
            ko: "블로그 보기",
            en: "Open blog"
          },
          href: "https://nhkwon.tistory.com"
        }
      },
      {
        title: {
          ko: "코드와 저장소",
          en: "Code and repositories"
        },
        body: {
          ko: "GitHub를 중심으로 저장소, 데모, 사이트 소스를 연결하는 흐름을 만들 수 있습니다.",
          en: "GitHub can act as the main hub that ties repositories, demos, and the website source together."
        },
        action: {
          label: {
            ko: "GitHub 보기",
            en: "Open GitHub"
          },
          href: "https://github.com/nhkwon"
        }
      }
    ],
    checklist: [
      {
        ko: "연락 목적이 연구 제안인지, 프로젝트 협업인지, 단순 문의인지 먼저 적어두면 좋습니다.",
        en: "State whether the message is a research proposal, project collaboration, or a simple inquiry."
      },
      {
        ko: "관련 링크나 읽어두면 좋은 문서를 함께 보내면 답변 속도가 빨라집니다.",
        en: "Relevant links or documents usually make responses much faster."
      },
      {
        ko: "구체적인 일정 제안이나 원하는 커뮤니케이션 방식이 있으면 함께 남겨주세요.",
        en: "If you have a preferred timeline or communication style, include that upfront."
      }
    ]
  }
};

SITE_DATA.profile.title = {
  ko: "건축·도시·건설 데이터 기반 의사결정",
  en: "Data-driven decision-making in building, urban, and construction domains"
};

SITE_DATA.profile.affiliation = {
  ko: "건축물 유지관리, 공사 소음, 에너지 성능, 도시 데이터 분석을 다루는 연구 허브",
  en: "A research hub spanning building maintenance, construction noise, energy performance, and urban analytics"
};

SITE_DATA.profile.status = {
  ko: "Building engineering, construction management, and urban analytics",
  en: "Building engineering, construction management, and urban analytics"
};

SITE_DATA.hero.headline = {
  ko: "건축물 성능, 유지관리, 건설환경, 도시 데이터를 연구하는 개인 홈페이지",
  en: "A personal website focused on building performance, maintenance, construction environment, and urban data"
};

SITE_DATA.hero.description = {
  ko: "사례기반추론, 유전알고리즘, 머신러닝, 다기준 의사결정 기법을 활용해 노후 공동주택 유지관리, 공사 소음 관리, 에너지 리트로핏, 도시 환경 평가 문제를 다루는 연구 실적을 정리했습니다.",
  en: "This site organizes research on aging building maintenance, construction noise management, energy retrofit, and urban environment evaluation using case-based reasoning, genetic algorithms, machine learning, and multi-criteria decision methods."
};

SITE_DATA.hero.badges = [
  "Building Engineering",
  "Construction Management",
  "Case-Based Reasoning",
  "Urban Analytics"
];

SITE_DATA.stats = [
  {
    label: {
      ko: "등재 실적",
      en: "Listed outputs"
    },
    value: {
      ko: "현재 사이트 기준 43건의 논문·학술 실적 반영",
      en: "43 publication and scholarly records currently reflected on the site"
    }
  },
  {
    label: {
      ko: "연구 범위",
      en: "Research scope"
    },
    value: {
      ko: "유지관리비 예측, 공사 소음, 에너지 성능, 도시 분석, 모듈러·순환경제",
      en: "Maintenance cost prediction, construction noise, energy performance, urban analytics, and modular/circular construction"
    }
  },
  {
    label: {
      ko: "대표 성과",
      en: "Representative impact"
    },
    value: {
      ko: "최다 인용 논문 126회, 실적 연도 범위 2014-2026",
      en: "Top cited paper at 126 citations, with records spanning 2014-2026"
    }
  }
];

SITE_DATA.about.paragraphs = [
  {
    ko: "연구의 큰 축은 건축물 유지관리와 성능 예측, 건설 현장의 환경 리스크 관리, 그리고 도시 규모 데이터 분석입니다. 특히 사례기반추론(CBR), 유전알고리즘, 머신러닝을 활용해 예측과 의사결정을 지원하는 모델을 다수 다뤘습니다.",
    en: "The work centers on building maintenance and performance prediction, environmental risk management on construction sites, and data-driven urban analysis. A recurring methodological thread is the use of case-based reasoning, genetic algorithms, and machine learning for prediction and decision support."
  },
  {
    ko: "논문 실적은 노후 주거 건물의 유지관리비 예측, 건설 소음 위험 평가와 보상비 산정, 건물 에너지 사용 예측, 도시 스트레스와 건물 밀도 분석, 모듈러 건축과 순환경제까지 폭넓게 걸쳐 있습니다.",
    en: "The publication record spans maintenance cost prediction for aging residential buildings, construction noise risk and compensation estimation, building energy-use prediction, urban stress and density analysis, and recent work on modular construction and circular economy."
  }
];

SITE_DATA.research.section.title = {
  ko: "연구 분야",
  en: "Research areas"
};

SITE_DATA.research.section.description = {
  ko: "논문 실적을 기준으로 핵심 연구 축을 다시 정리했습니다.",
  en: "The main research axes below are reconstructed from the publication record you shared."
};

SITE_DATA.research.areas = [
  {
    title: {
      ko: "건축물 유지관리와 성능 예측",
      en: "Building maintenance and performance prediction"
    },
    body: {
      ko: "노후 공동주택 유지관리비, 보수 시점, 수명 예측과 같은 문제를 사례기반추론과 유전알고리즘으로 다룹니다.",
      en: "This line of work addresses maintenance cost, repair timing, and service life prediction for aging buildings using case-based reasoning and genetic algorithms."
    },
    tags: ["Maintenance", "CBR", "Genetic Algorithm"]
  },
  {
    title: {
      ko: "건설 소음과 환경 리스크 관리",
      en: "Construction noise and environmental risk"
    },
    body: {
      ko: "공사 소음 예측, 위험도 평가, 보상비 산정, 능동소음제어 기반 관리 모델까지 포함하는 연구 축입니다.",
      en: "This axis covers construction noise prediction, risk assessment, compensation estimation, and active noise-control based management."
    },
    tags: ["Construction Noise", "Risk Assessment", "ANC"]
  },
  {
    title: {
      ko: "건물 에너지와 리트로핏",
      en: "Building energy and retrofit"
    },
    body: {
      ko: "점유 특성과 사용자 그룹 분석을 활용한 에너지 사용 예측과 기존 건축물 리트로핏 전략 모델을 다룹니다.",
      en: "This line studies occupancy-aware energy prediction and retrofit strategy models for existing buildings."
    },
    tags: ["Energy", "Retrofit", "End-user Groups"]
  },
  {
    title: {
      ko: "도시 분석과 데이터 기반 의사결정",
      en: "Urban analytics and data-driven decisions"
    },
    body: {
      ko: "도시 스트레스, 건물 커버리지, 재개발 의사결정, 모듈러·순환경제 평가 등 도시/건설 의사결정 문제를 다룹니다.",
      en: "This area includes urban stress sensing, building coverage estimation, redevelopment decisions, and modular/circular construction evaluation."
    },
    tags: ["Urban Analytics", "MCDM", "Machine Learning"]
  }
];

SITE_DATA.outputs.section.title = {
  ko: "논문 실적 및 연구 아웃풋",
  en: "Publications and research outputs"
};

SITE_DATA.outputs.section.description = {
  ko: "전달해주신 논문 및 학술 실적을 기반으로 대표 논문과 전체 목록을 함께 정리했습니다.",
  en: "Representative papers and the full publication list are organized here based on the records you provided."
};
SITE_DATA.outputs.section.eyebrow = {
  ko: "Publications",
  en: "Publications"
};

SITE_DATA.teaching.section.title = {
  ko: "교육 및 지도",
  en: "Teaching and Mentoring"
};
SITE_DATA.teaching.section.eyebrow = {
  ko: "Teaching",
  en: "Teaching"
};

SITE_DATA.news.section.eyebrow = {
  ko: "News",
  en: "News"
};

SITE_DATA.contact.section.eyebrow = {
  ko: "Contact",
  en: "Contact"
};

SITE_DATA.outputs.process = [
  {
    title: {
      ko: "Case-based reasoning",
      en: "Case-based reasoning"
    },
    body: {
      ko: "유지관리비, 보수 일정, 공사 소음, 보상비 산정 등 다양한 예측 문제에 일관되게 활용된 핵심 방법론입니다.",
      en: "A core methodology repeatedly used for maintenance cost, repair scheduling, construction noise, and compensation estimation problems."
    }
  },
  {
    title: {
      ko: "Optimization and learning",
      en: "Optimization and learning"
    },
    body: {
      ko: "유전알고리즘, 머신러닝, 딥러닝을 결합해 성능 예측과 의사결정 지원 모델을 정교화했습니다.",
      en: "Genetic algorithms, machine learning, and deep learning are combined to refine prediction and decision-support models."
    }
  },
  {
    title: {
      ko: "Built environment applications",
      en: "Built environment applications"
    },
    body: {
      ko: "건축물 유지관리, 건설관리, 에너지, 도시환경, 모듈러·순환경제까지 응용 범위를 확장하고 있습니다.",
      en: "Applications extend across building maintenance, construction management, energy, urban environment, and modular/circular construction."
    }
  }
];

SITE_DATA.outputs.publications = [];

SITE_DATA.outputs.publications.push(
  {
    type: "journal",
    year: 2020,
    citations: 126,
    title: "Maintenance cost prediction for aging residential buildings based on case-based reasoning and genetic algorithm",
    authors: "N Kwon, K Song, Y Ahn, M Park, Y Jang",
    venue: "Journal of Building Engineering 28, 101006"
  },
  {
    type: "journal",
    year: 2016,
    citations: 96,
    title: "Construction noise management using active noise control techniques",
    authors: "N Kwon, M Park, HS Lee, J Ahn, M Shin",
    venue: "Journal of Construction Engineering and Management 142 (7), 04016014"
  },
  {
    type: "journal",
    year: 2020,
    citations: 88,
    title: "Performance evaluation of normalization-based CBR models for improving construction cost estimation",
    authors: "J Ahn, SH Ji, SJ Ahn, M Park, HS Lee, N Kwon, EB Lee, Y Kim",
    venue: "Automation in Construction 119, 103329"
  },
  {
    type: "journal",
    year: 2017,
    citations: 80,
    title: "Predicting hourly energy consumption in buildings using occupancy-related characteristics of end-user groups",
    authors: "K Song, N Kwon, K Anderson, M Park, HS Lee, SH Lee",
    venue: "Energy and Buildings 156, 121-133"
  },
  {
    type: "journal",
    year: 2019,
    citations: 51,
    title: "International diversification and performance of construction companies: Moderating effect of regional, product, and industry diversifications",
    authors: "Y Jang, N Kwon, Y Ahn, HS Lee, M Park",
    venue: "Journal of Management in Engineering 35 (5), 04019015"
  },
  {
    type: "journal",
    year: 2019,
    citations: 50,
    title: "Compensation cost estimation model for construction noise claims using case-based reasoning",
    authors: "N Kwon, J Cho, HS Lee, I Yoon, M Park",
    venue: "Journal of Construction Engineering and Management 145 (8), 04019047"
  },
  {
    type: "journal",
    year: 2018,
    citations: 39,
    title: "Construction noise risk assessment model focusing on construction equipment",
    authors: "N Kwon, K Song, HS Lee, J Kim, M Park",
    venue: "Journal of Construction Engineering and Management 144 (6), 04018034"
  },
  {
    type: "journal",
    year: 2017,
    citations: 38,
    title: "Construction noise prediction model based on case-based reasoning in the preconstruction phase",
    authors: "N Kwon, M Park, HS Lee, J Ahn, S Kim",
    venue: "Journal of Construction Engineering and Management 143 (6), 04017008"
  },
  {
    type: "journal",
    year: 2019,
    citations: 36,
    title: "Business models and performance of international construction companies",
    authors: "Y Jang, Y Ahn, M Park, HS Lee, N Kwon",
    venue: "Sustainability 11 (9), 2575"
  },
  {
    type: "journal",
    year: 2019,
    citations: 34,
    title: "BIM-Based Digital Fabrication Process for a Free-Form Building Project in South Korea",
    authors: "J Lee, N Kwon, N Ham, J Kim, Y Ahn",
    venue: "Advances in Civil Engineering 2019 (1), 4163625"
  },
  {
    type: "journal",
    year: 2021,
    citations: 31,
    title: "Developing a machine learning-based building repair time estimation model considering weight assigning methods",
    authors: "N Kwon, Y Ahn, BS Son, H Moon",
    venue: "Journal of Building Engineering 43, 102627"
  },
  {
    type: "journal",
    year: 2019,
    citations: 31,
    title: "Development of an energy saving strategy model for retrofitting existing buildings: A Korean case study",
    authors: "K Song, Y Ahn, J Ahn, N Kwon",
    venue: "Energies 12 (9), 1626"
  },
  {
    type: "journal",
    year: 2019,
    citations: 29,
    title: "Performance evaluation of distance measurement methods for construction noise prediction using case-based reasoning",
    authors: "N Kwon, J Lee, M Park, I Yoon, Y Ahn",
    venue: "Sustainability 11 (3), 871"
  },
  {
    type: "journal",
    year: 2019,
    citations: 27,
    title: "Probabilistic maintenance cost analysis for aged multi-family housing",
    authors: "M Park, N Kwon, J Lee, S Lee, Y Ahn",
    venue: "Sustainability 11 (7), 1843"
  },
  {
    type: "journal",
    year: 2019,
    citations: 25,
    title: "Forecasting repair schedule for building components based on case-based reasoning and fuzzy-AHP",
    authors: "S Park, N Kwon, Y Ahn",
    venue: "Sustainability 11 (24), 7181"
  }
);

SITE_DATA.outputs.publications.push(
  {
    type: "journal",
    year: 2024,
    citations: 4,
    title: "Deriving the importance of defects in multi-unit residential buildings using the analytic hierarchy process method",
    authors: "D Kang, E Lee, Y Ahn, N Kwon",
    venue: "Buildings 14 (12), 4028"
  },
  {
    type: "journal",
    year: 2025,
    citations: 3,
    title: "Developing an automated framework for eco-label information categorization using web crawling and Natural Language Processing techniques",
    authors: "HAT Nguyen, DH Pham, B Kim, Y Ahn, N Kwon",
    venue: "Expert Systems with Applications 282, 127688"
  },
  {
    type: "journal",
    year: 2014,
    citations: 3,
    title: "The Development of Noise Management Model Using Active Noise Control Technique on Construction Site",
    authors: "N Kwon, M Park, HS Lee, J Ahn, S Kim",
    venue: "Korean Journal of Construction Engineering and Management 15 (2), 12-22"
  },
  {
    type: "journal",
    year: 2026,
    citations: 1,
    title: "Physics-Regularized Deep Learning Framework for Floor Impact Sound Prediction in Residential Buildings: A Civil Engineering Approach",
    authors: "J Kim, D Jung, K Jeon, Y Ahn, W Kim, N Kwon",
    venue: "Results in Engineering, 109400"
  },
  {
    type: "journal",
    year: 2019,
    citations: 1,
    title: "Estimating risk interdependency ratio for construction projects: Using risk checklist in pre-construction phase",
    authors: "J Kim, HS Lee, M Park, N Kwon",
    venue: "Architectural Research 21 (2), 49-57"
  },
  {
    type: "journal",
    year: 2019,
    citations: 1,
    title: "Space Planning of the Health Life Support Center using the Modular Construction Method-Space Unitification and Modularization through Spatial Proximity Analysis of Case Projects",
    authors: "H Jang, N Kwon, Y Ahn, C Ahn",
    venue: "Journal of the Architectural Institute of Korea Planning & Design 35 (11), 43-52"
  },
  {
    type: "journal",
    year: 2025,
    title: "Prioritizing Construction Waste Management Improvements From Generator and Intermediate Processor Perspectives",
    authors: "YJ Cheon, NH Kwon, YH Ahn",
    venue: "Journal of the Architectural Institute of Korea 41 (2), 117-127"
  },
  {
    type: "conference",
    year: 2022,
    title: "Integrative framework for green building material selection-A case study of LEED project in Vietnam",
    authors: "DH Pham, N Kwon, YH Ahn",
    venue: "대한건축학회 학술발표대회 논문집 42 (1), 635-636"
  },
  {
    type: "conference",
    year: 2022,
    title: "Assessing urban design: measure unmeasurable things with computer vision",
    authors: "QH Le, N Kwon, Y Ahn",
    venue: "대한건축학회논문집"
  },
  {
    type: "conference",
    year: 2022,
    title: "Integrative framework for green building material selection-AcasestudyofLEED projectinVietnam",
    authors: "DH Pham, N Kwon, YH Ahn",
    venue: "대한건축학회논문집"
  },
  {
    type: "conference",
    year: 2017,
    title: "Competency Level Evaluation for Construction Management in Southeast Asian Countries",
    authors: "N Kwon, M Park, HS Lee, BS Son, J Kim, BG Kwon",
    venue: "International conference on construction engineering and project management"
  },
  {
    type: "conference",
    year: 2015,
    title: "Capability Evaluation for Improving Competitiveness of the Korean Construction Firms",
    authors: "N Kwon, M Park, HS Lee, B Son, HS Jang, JW Kim",
    venue: "International conference on construction engineering and project management"
  },
  {
    type: "thesis",
    year: 2014,
    title: "Construction Noise Management using ANC Technique on Sites",
    authors: "권나현",
    venue: "서울대학교 대학원"
  }
);

SITE_DATA.outputs.publications.push(
  {
    type: "journal",
    year: 2019,
    citations: 23,
    title: "Preliminary service life estimation model for MEP components using case-based reasoning and genetic algorithm",
    authors: "N Kwon, K Song, M Park, Y Jang, I Yoon, Y Ahn",
    venue: "Sustainability 11 (11), 3074"
  },
  {
    type: "journal",
    year: 2024,
    citations: 21,
    title: "Sensing perceived urban stress using space syntactical and urban building density data: A machine learning-based approach",
    authors: "QH Le, N Kwon, TH Nguyen, B Kim, Y Ahn",
    venue: "Building and Environment 266, 112054"
  },
  {
    type: "journal",
    year: 2022,
    citations: 19,
    title: "Deep learning based urban building coverage ratio estimation focusing on rapid urbanization areas",
    authors: "QH Le, H Shin, N Kwon, J Ho, Y Ahn",
    venue: "Applied Sciences 12 (22), 11428"
  },
  {
    type: "journal",
    year: 2025,
    citations: 18,
    title: "TOPSIS and AHP-Based Multi-Criteria Decision-Making Approach for Evaluating Redevelopment in Old Residential Projects",
    authors: "C Park, M Son, J Kim, B Kim, Y Ahn, N Kwon",
    venue: "Sustainability 17 (15), 7072"
  },
  {
    type: "journal",
    year: 2017,
    citations: 17,
    title: "A system dynamics approach for modeling cognitive process of construction workers' unsafe behaviors",
    authors: "J Kim, H Lee, M Park, N Kwon",
    venue: "Korean Journal of Construction Engineering and Management 18 (2), 38-48"
  },
  {
    type: "journal",
    year: 2024,
    citations: 16,
    title: "Advancing modular construction through circular economy: Insights from semi-automated PRISMA analysis and topic modeling",
    authors: "DH Ly, QH Le, TDHN Nguyen, Y Ahn, K Kim, N Kwon",
    venue: "Journal of Building Engineering 98, 111232"
  },
  {
    type: "journal",
    year: 2024,
    citations: 11,
    title: "Construction safety innovation and barriers in different company types and sizes: a survey in Vietnam",
    authors: "TN Thach, H Moon, HD Pham, N Kwon, Y Ahn",
    venue: "KSCE Journal of Civil Engineering 28 (8), 3057-3073"
  },
  {
    type: "journal",
    year: 2021,
    citations: 10,
    title: "Estimating the performance of heavy impact sound insulation using empirical approaches",
    authors: "J Cho, HS Lee, M Park, K Song, J Kim, N Kwon",
    venue: "Journal of Asian Architecture and Building Engineering 20 (3), 298-313"
  },
  {
    type: "journal",
    year: 2023,
    citations: 9,
    title: "Moderating effect of project type on the relationship between project delivery systems and cost performance",
    authors: "H Moon, M Park, Y Ahn, N Kwon",
    venue: "Journal of Management in Engineering 39 (1), 04022066"
  },
  {
    type: "journal",
    year: 2024,
    citations: 8,
    title: "Risk evaluation of radioactive concrete structure decommissioning in nuclear power plants using fuzzy-AHP",
    authors: "H Moon, S Mirmotalebi, Y Jang, Y Ahn, N Kwon",
    venue: "Buildings 14 (6), 1536"
  },
  {
    type: "journal",
    year: 2020,
    citations: 8,
    title: "Reduction and transformation of energy use data for end-user group categorization in dormitory buildings",
    authors: "K Song, J Ahn, Y Ahn, M Park, N Kwon",
    venue: "Journal of Building Engineering 32, 101524"
  },
  {
    type: "journal",
    year: 2024,
    citations: 5,
    title: "Effects of periodic materials on distance attenuation in wall-slab structures: an experiment",
    authors: "J Cho, K Song, N Kwon, M Park, TW Kim",
    venue: "Buildings 14 (3), 694"
  },
  {
    type: "journal",
    year: 2025,
    citations: 4,
    title: "Developing a life cycle assessment-based framework for module-based impact distribution in adaptive reuse of modular buildings",
    authors: "DH Ly, TDHN Nguyen, H Jang, B Kim, Y Ahn, N Kwon",
    venue: "Journal of Building Engineering, 113703"
  },
  {
    type: "journal",
    year: 2025,
    citations: 4,
    title: "Computing green remodeling construction cost for public buildings based on genetic algorithm and case-based reasoning",
    authors: "S Park, S Park, H Jang, Y Ahn, N Kwon",
    venue: "Developments in the Built Environment 22, 100655"
  },
  {
    type: "journal",
    year: 2025,
    citations: 4,
    title: "Developing a framework for evaluating project feasibility of disaster management facilities: Case studies of two protective shelters in South Korea",
    authors: "N Kwon, J Cho, Y Ahn, J Kim, YJ Park",
    venue: "Journal of Management in Engineering 41 (1), 05024011"
  }
);

SITE_DATA.outputs.featured = SITE_DATA.outputs.publications
  .slice()
  .sort((a, b) => {
    const aCitations = typeof a.citations === "number" ? a.citations : -1;
    const bCitations = typeof b.citations === "number" ? b.citations : -1;

    if (bCitations !== aCitations) {
      return bCitations - aCitations;
    }

    return (b.year || 0) - (a.year || 0);
  })
  .slice(0, 6)
  .map((item, index) => ({
    type: {
      ko: "대표 논문",
      en: "Representative Paper"
    },
    date: String(item.year),
    title: item.title,
    meta: item.venue,
    description: item.authors,
    page: "publications",
    anchor: `#publication-${index + 1}`,
    linkLabel: {
      ko: "전체 목록에서 보기",
      en: "View in full list"
    },
    tags: [
      String(item.year),
      item.type === "journal" ? "Journal" : item.type === "conference" ? "Conference" : "Thesis"
    ]
  }));

SITE_DATA.profile.name = "Nahyun Kwon";
SITE_DATA.profile.nameDisplay = {
  ko: "권나현",
  en: "Nahyun Kwon"
};
SITE_DATA.profile.initials = "NH";
SITE_DATA.profile.location = {
  ko: "Ansan, Republic of Korea",
  en: "Ansan, Republic of Korea"
};
SITE_DATA.profile.email = "envy978@hanmail.net";
SITE_DATA.profile.photo = "assets/images/profile-photo.png";
SITE_DATA.profile.photoAlt = {
  ko: "권나현 프로필 이미지",
  en: "Nahyun Kwon profile image"
};
SITE_DATA.profile.title = {
  ko: "Research Professor, Center for AI Technology in Construction",
  en: "Research Professor, Center for AI Technology in Construction"
};
SITE_DATA.profile.affiliation = {
  ko: "한양대학교 ERICA 건축·도시·건설 데이터 기반 연구",
  en: "Building, urban, and construction data research at Hanyang University ERICA"
};
SITE_DATA.profile.status = {
  ko: "Building maintenance, construction management, energy, and urban analytics",
  en: "Building maintenance, construction management, energy, and urban analytics"
};
SITE_DATA.profile.links = [
  {
    label: "Google Scholar",
    url: "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors=Nahyun+Kwon+Hanyang+University+ERICA"
  },
  {
    label: "Lab Profile",
    url: "https://sbcml.hanyang.ac.kr/index.php?gubun=RP&hCode=STAFF_LIST"
  },
  {
    label: "GitHub",
    url: "https://github.com/nhkwon"
  },
  {
    label: "Email",
    url: "mailto:envy978@hanmail.net"
  }
];

SITE_DATA.hero.panelTitle = {
  ko: "Research snapshot",
  en: "Research snapshot"
};
SITE_DATA.hero.eyebrow = {
  ko: "Building Engineering · Construction Management · Urban Analytics",
  en: "Building Engineering · Construction Management · Urban Analytics"
};

SITE_DATA.about.highlights = [
  {
    title: {
      ko: "핵심 방법론",
      en: "Core methods"
    },
    body: {
      ko: "사례기반추론, 유전알고리즘, 머신러닝, 다기준 의사결정 기법을 활용해 실제 건축·건설 문제를 모델링합니다.",
      en: "The work combines case-based reasoning, genetic algorithms, machine learning, and multi-criteria decision methods for practical building and construction problems."
    }
  },
  {
    title: {
      ko: "주요 적용 분야",
      en: "Application domains"
    },
    body: {
      ko: "노후 주거건물 유지관리, 공사 소음 관리, 에너지 리트로핏, 도시 환경 분석, 모듈러 건축을 주요 적용 대상으로 다룹니다.",
      en: "Major application domains include aging housing maintenance, construction noise management, energy retrofit, urban environment analysis, and modular construction."
    }
  },
  {
    title: {
      ko: "연구 협업",
      en: "Research collaboration"
    },
    body: {
      ko: "한양대학교 ERICA와 서울대학교 기반 연구 흐름을 바탕으로 건축공학, 건설관리, 도시분석을 연결하는 협업을 수행합니다.",
      en: "The work connects architectural engineering, construction management, and urban analytics through collaborations centered on Hanyang University ERICA and earlier Seoul National University research."
    }
  }
];

SITE_DATA.about.timeline = [
  {
    period: {
      ko: "2024 - Present",
      en: "2024 - Present"
    },
    title: {
      ko: "Research Professor, Center for AI Technology in Construction, Hanyang University ERICA",
      en: "Research Professor, Center for AI Technology in Construction, Hanyang University ERICA"
    },
    body: {
      ko: "최근 논문과 공개 연구실 프로필 기준으로 확인되는 현재 소속입니다.",
      en: "This is the current affiliation inferred from recent papers and the public lab profile."
    }
  },
  {
    period: {
      ko: "2026",
      en: "2026"
    },
    title: {
      ko: "MDPI Sustainability 특별호 Guest Editor",
      en: "Guest Editor for an MDPI Sustainability special issue"
    },
    body: {
      ko: "건설 프로젝트 관리, 그린 빌딩, 회복탄력적 인프라 관련 특별호에 참여하고 있습니다.",
      en: "Serving on a special issue related to construction project management, green building, and resilient infrastructure."
    }
  },
  {
    period: {
      ko: "2018",
      en: "2018"
    },
    title: {
      ko: "서울대학교 건설환경공학부 박사",
      en: "Ph.D., Department of Civil and Environmental Engineering, Seoul National University"
    },
    body: {
      ko: "건설 소음 관리와 건설관리 기반 연구 흐름을 심화했습니다.",
      en: "Advanced research in construction noise management and construction management."
    }
  },
  {
    period: {
      ko: "2014",
      en: "2014"
    },
    title: {
      ko: "서울대학교 건설환경공학부 석사",
      en: "M.S., Department of Civil and Environmental Engineering, Seoul National University"
    },
    body: {
      ko: "공사 현장의 능동소음제어 기반 소음 관리 연구를 수행했습니다.",
      en: "Completed master's research on active noise control for construction-site noise management."
    }
  },
  {
    period: {
      ko: "2011",
      en: "2011"
    },
    title: {
      ko: "한양대학교 건축공학과 학사",
      en: "B.S., Architectural Engineering, Hanyang University"
    },
    body: {
      ko: "건축과 건설관리 연구의 기반을 마련한 학부 과정입니다.",
      en: "Undergraduate training that built the foundation for later work in building and construction research."
    }
  }
];

SITE_DATA.about.timeline = [
  {
    period: {
      ko: "2024 - Present",
      en: "2024 - Present"
    },
    title: {
      ko: "Research Professor, Center for AI Technology in Construction, Hanyang University ERICA",
      en: "Research Professor, Center for AI Technology in Construction, Hanyang University ERICA"
    },
    body: {
      ko: "최근 논문과 공개 연구자 프로필을 기준으로 확인되는 현재 소속입니다.",
      en: "This is the current affiliation inferred from recent papers and the public lab profile."
    }
  },
  {
    period: {
      ko: "2026",
      en: "2026"
    },
    title: {
      ko: "MDPI Sustainability 특집호 Guest Editor",
      en: "Guest Editor for an MDPI Sustainability special issue"
    },
    body: {
      ko: "건설 프로젝트 관리, 친환경 건축, 회복탄력적 인프라와 관련된 특집호 편집 활동에 참여하고 있습니다.",
      en: "Serving on a special issue related to construction project management, green building, and resilient infrastructure."
    }
  },
  {
    period: {
      ko: "2018.08",
      en: "Aug 2018"
    },
    title: {
      ko: "서울대학교 건축학과 건축시공 및 건설관리 전공 박사(공학박사)",
      en: "Ph.D. in Engineering, Architectural Construction and Construction Management, Department of Architecture, Seoul National University"
    },
    body: {
      ko: "서울대학교 건축학과 건축시공 및 건설관리 전공에서 건설 소음 관리와 건설관리 기반 연구를 심화했습니다.",
      en: "Completed doctoral research in Architectural Construction and Construction Management at Seoul National University."
    }
  },
  {
    period: {
      ko: "2014.02",
      en: "Feb 2014"
    },
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
    period: {
      ko: "2011.02",
      en: "Feb 2011"
    },
    title: {
      ko: "한양대학교 건축학과 졸업(학사학위, 건축학사)",
      en: "Bachelor of Architecture, Department of Architecture, Hanyang University"
    },
    body: {
      ko: "한양대학교 건축학과에서 건축학사 학위를 취득하며 이후 건축시공 및 건설관리 연구의 기반을 마련했습니다.",
      en: "Completed the undergraduate architecture program at Hanyang University, building the foundation for later work in architectural construction and construction management."
    }
  }
];

SITE_DATA.contact.cards = [
  {
    title: {
      ko: "이메일",
      en: "Email"
    },
    body: {
      ko: "공개 프로필에 기재된 연락처를 기준으로 바로 메일을 보낼 수 있게 연결했습니다.",
      en: "This uses the publicly listed contact address from the profile sources."
    },
    action: {
      label: {
        ko: "메일 보내기",
        en: "Send email"
      },
      href: "mailto:envy978@hanmail.net"
    }
  },
  {
    title: {
      ko: "Google Scholar",
      en: "Google Scholar"
    },
    body: {
      ko: "논문 인용과 저자 검색을 빠르게 확인할 수 있도록 Scholar author search로 연결했습니다.",
      en: "Linked to a Scholar author search so visitors can quickly inspect publications and citation records."
    },
    action: {
      label: {
        ko: "Scholar 열기",
        en: "Open Scholar"
      },
      href: "https://scholar.google.com/citations?hl=en&view_op=search_authors&mauthors=Nahyun+Kwon+Hanyang+University+ERICA"
    }
  },
  {
    title: {
      ko: "연구실 프로필",
      en: "Lab profile"
    },
    body: {
      ko: "한양대학교 ERICA 연구실 공개 페이지를 통해 현재 연구 맥락을 이어서 볼 수 있습니다.",
      en: "The public Hanyang ERICA lab page gives additional context around the current research environment."
    },
    action: {
      label: {
        ko: "프로필 보기",
        en: "Open profile"
      },
      href: "https://sbcml.hanyang.ac.kr/index.php?gubun=RP&hCode=STAFF_LIST"
    }
  }
];

const DOI_BY_TITLE = {
  "Maintenance cost prediction for aging residential buildings based on case-based reasoning and genetic algorithm": "10.1016/j.jobe.2019.101006",
  "Construction noise management using active noise control techniques": "10.1061/(ASCE)CO.1943-7862.0001121",
  "Performance evaluation of normalization-based CBR models for improving construction cost estimation": "10.1016/j.autcon.2020.103329",
  "Predicting hourly energy consumption in buildings using occupancy-related characteristics of end-user groups": "10.1016/j.enbuild.2017.09.060",
  "International diversification and performance of construction companies: Moderating effect of regional, product, and industry diversifications": "10.1061/(ASCE)ME.1943-5479.0000713",
  "Business models and performance of international construction companies": "10.3390/su11092575",
  "BIM-Based Digital Fabrication Process for a Free-Form Building Project in South Korea": "10.1155/2019/4163625",
  "Development of an energy saving strategy model for retrofitting existing buildings: A Korean case study": "10.3390/en12091626",
  "Performance evaluation of distance measurement methods for construction noise prediction using case-based reasoning": "10.3390/su11030871",
  "Probabilistic maintenance cost analysis for aged multi-family housing": "10.3390/su11071843",
  "Forecasting repair schedule for building components based on case-based reasoning and fuzzy-AHP": "10.3390/su11247181",
  "Preliminary service life estimation model for MEP components using case-based reasoning and genetic algorithm": "10.3390/su11113074",
  "Sensing perceived urban stress using space syntactical and urban building density data: A machine learning-based approach": "10.1016/j.buildenv.2024.112054",
  "Deep learning based urban building coverage ratio estimation focusing on rapid urbanization areas": "10.3390/app122211428",
  "TOPSIS and AHP-Based Multi-Criteria Decision-Making Approach for Evaluating Redevelopment in Old Residential Projects": "10.3390/su17157072",
  "Advancing modular construction through circular economy: Insights from semi-automated PRISMA analysis and topic modeling": "10.1016/j.jobe.2024.111232",
  "Construction safety innovation and barriers in different company types and sizes: a survey in Vietnam": "10.1007/s12205-024-0204-2",
  "Estimating the performance of heavy impact sound insulation using empirical approaches": "10.1080/13467581.2020.1786390",
  "Risk evaluation of radioactive concrete structure decommissioning in nuclear power plants using fuzzy-AHP": "10.3390/buildings14061536",
  "Reduction and transformation of energy use data for end-user group categorization in dormitory buildings": "10.1016/j.jobe.2020.101524",
  "Effects of periodic materials on distance attenuation in wall-slab structures: an experiment": "10.3390/buildings14030694",
  "Developing a life cycle assessment-based framework for module-based impact distribution in adaptive reuse of modular buildings": "10.1016/j.jobe.2025.113703",
  "Computing green remodeling construction cost for public buildings based on genetic algorithm and case-based reasoning": "10.1016/j.dibe.2025.100655",
  "Developing a framework for evaluating project feasibility of disaster management facilities: Case studies of two protective shelters in South Korea": "10.1061/JMENEA.MEENG-6067",
  "Deriving the importance of defects in multi-unit residential buildings using the analytic hierarchy process method": "10.3390/buildings14124028",
  "Developing an automated framework for eco-label information categorization using web crawling and Natural Language Processing techniques": "10.1016/j.eswa.2025.127688",
  "Physics-Regularized Deep Learning Framework for Floor Impact Sound Prediction in Residential Buildings: A Civil Engineering Approach": "10.1016/j.rineng.2026.109400"
};

const PAPER_URL_BY_TITLE = {
  "Compensation cost estimation model for construction noise claims using case-based reasoning": "https://ascelibrary.org/doi/full/10.1061/%28ASCE%29CO.1943-7862.0001675",
  "Construction noise risk assessment model focusing on construction equipment": "https://ascelibrary.org/doi/10.1061/%28ASCE%29CO.1943-7862.0001480",
  "Construction noise prediction model based on case-based reasoning in the preconstruction phase": "https://ascelibrary.org/doi/10.1061/%28ASCE%29CO.1943-7862.0001291",
  "Developing a machine learning-based building repair time estimation model considering weight assigning methods": "https://www.sciencedirect.com/science/article/pii/S235271022100485X?dgcid=coauthor",
  "Moderating effect of project type on the relationship between project delivery systems and cost performance": "https://ascelibrary.org/doi/full/10.1061/%28ASCE%29ME.1943-5479.0001097"
};

const JOURNAL_METRICS_BY_VENUE = {
  "Advances in Civil Engineering": {
    indexType: "SCIE",
    impactFactor: "1.6",
    percentile: "43.7",
    topPercent: "56.3"
  },
  "Applied Sciences": {
    indexType: "SCIE",
    impactFactor: "2.5",
    percentile: "71.7",
    topPercent: "28.3"
  },
  "Automation in Construction": {
    indexType: "SCIE",
    impactFactor: "11.5",
    percentile: "99.7",
    topPercent: "0.3"
  },
  "Building and Environment": {
    indexType: "SCIE",
    impactFactor: "7.6",
    percentile: "95.4",
    topPercent: "4.6"
  },
  Buildings: {
    indexType: "SCIE",
    impactFactor: "3.1",
    percentile: "67.9",
    topPercent: "32.1"
  },
  "Developments in the Built Environment": {
    indexType: "SCIE",
    impactFactor: "8.9",
    percentile: "96.4",
    topPercent: "3.6"
  },
  Energies: {
    indexType: "SCIE",
    impactFactor: "3.2",
    percentile: "38.7",
    topPercent: "61.3"
  },
  "Energy and Buildings": {
    indexType: "SCIE",
    impactFactor: "7.1",
    percentile: "93.7",
    topPercent: "6.3"
  },
  "Expert Systems with Applications": {
    indexType: "SCIE",
    impactFactor: "7.5",
    percentile: "93.9",
    topPercent: "6.1"
  },
  "Journal of Asian Architecture and Building Engineering": {
    indexType: "SCIE",
    impactFactor: "1.6",
    percentile: "43.7",
    topPercent: "56.3"
  },
  "Journal of Building Engineering": {
    indexType: "SCIE",
    impactFactor: "7.4",
    percentile: "94.8",
    topPercent: "5.2"
  },
  "Journal of Construction Engineering and Management": {
    indexType: "SCIE",
    impactFactor: "5.1",
    percentile: "86.6",
    topPercent: "13.4"
  },
  "Journal of Management in Engineering": {
    indexType: "SCIE",
    impactFactor: "7.0",
    percentile: "93.2",
    topPercent: "6.8"
  },
  "KSCE Journal of Civil Engineering": {
    indexType: "SCIE",
    impactFactor: "2.0",
    percentile: "46.2",
    topPercent: "53.8"
  },
  "Results in Engineering": {
    indexType: "ESCI",
    impactFactor: "7.9",
    percentile: "96.93",
    topPercent: "3.07"
  },
  Sustainability: {
    indexType: "SCIE",
    impactFactor: "3.3",
    percentile: "58.4",
    topPercent: "41.6"
  }
};

function normalizeVenueKey(venue) {
  return String(venue || "")
    .replace(/\s+\d.*$/, "")
    .replace(/,\s*$/, "")
    .trim();
}

SITE_DATA.scholarMetrics = {
  citationsAll: 971,
  citationsSince2021: 822,
  hIndexAll: 18,
  hIndexSince2021: 18,
  i10IndexAll: 23,
  i10IndexSince2021: 22,
  updated: "2026-04-11"
};

SITE_DATA.outputs.publications = SITE_DATA.outputs.publications.map((item) => ({
  ...item,
  doi: DOI_BY_TITLE[item.title] || item.doi,
  paperUrl: PAPER_URL_BY_TITLE[item.title] || item.paperUrl,
  metrics: JOURNAL_METRICS_BY_VENUE[normalizeVenueKey(item.venue)] || item.metrics
}));
