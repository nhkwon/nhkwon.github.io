# nhkwon.github.io

GitHub Pages용 정적 개인 사이트입니다. `https://sangdon-park.github.io/ko.html`의 정보 구조를 참고해 메인 랜딩과 세부 페이지를 분리한 형태로 구성했습니다.

## Included Pages

- `index.html`: `ko.html`로 리디렉션
- `ko.html`, `en.html`: 메인 랜딩 페이지
- `bio*.html`: 소개 페이지
- `publications*.html`: 아웃풋/논문/기술 글 정리 페이지
- `teaching*.html`: 학습/멘토링 페이지
- `news*.html`: 소식 페이지
- `contact*.html`: 연락 페이지

## Main Files To Edit

- `assets/js/site-data.js`: 프로필, 소개, 연구 축, 링크, 아웃풋, 소식 텍스트
- `assets/js/site.js`: 레이아웃 렌더링 로직
- `assets/css/site.css`: 색상, 타이포그래피, 반응형 스타일

## Quick Customization

1. `assets/js/site-data.js`에서 이름, 소속, 이메일, 링크를 실제 정보로 바꿉니다.
2. `outputs.featured`에 실제 논문, 발표, 저장소, 글 링크를 추가합니다.
3. `news.featured`와 `news.archive`에 업데이트 로그를 넣습니다.
4. GitHub Pages에 푸시하면 바로 배포할 수 있습니다.

## Notes

- 현재 공개된 `nhkwon` GitHub/Tistory 흔적을 바탕으로 강화학습/로봇/기술 글 중심의 예시 콘텐츠를 넣었습니다.
- 실제 프로필이 다르면 `assets/js/site-data.js`만 수정해도 전체 페이지에 반영됩니다.
