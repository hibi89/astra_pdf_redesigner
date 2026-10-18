# 요구사항

## 전체 목표
사용자 PDF의 내용을 구조화·보존해 새 레이아웃으로 재조판하는 로컬 문서 도구. 설계 원본은 `docs/BLUEPRINT.md`와 `docs/ASTRA_ORIGINAL_ROADMAP.txt`.

## STEP 1 확정
- 로컬 React + TypeScript + Vite, 백엔드/외부 API/CDN 없음. 개발 서버 127.0.0.1.
- 회고록 제목/작성자(선택)/작성일/학습/어려움/해결/소감·계획 입력.
- 실시간 A4 기준 미리보기, 원문·문단 보존, 빈 본문/작성자 출력 숨김.
- 고유 레이아웃을 갖는 3개 테마, 색상 6개, 본문 크기 3개, 시스템 글꼴 2종.
- window.print() + @page A4, 입력 UI 제외, 자연스러운 여러 페이지 분할.
- localStorage schemaVersion 1 자동 저장·복원, 오류 경고, 예시/초기화 확인.
- 접근 가능한 범위에서 테스트; PDF 실제 인쇄는 Chrome/Edge에서 검증해야 최종 완료.

## 제외
STEP 2 이후의 문서 편집/이미지/PDF 업로드/OCR/검색/AI/서버/로그인/상품화 기능.
