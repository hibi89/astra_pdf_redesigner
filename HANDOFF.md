# HANDOFF — Astra PDF Redesigner

1. **목표/기술:** PDF 내용을 보존하면서 새 디자인으로 재조판하는 로컬 도구. STEP 1 범위는 회고록 입력→테마→미리보기→브라우저 PDF. React/TypeScript/Vite/CSS.
2. **변경:** 새 프로젝트 초기 구성 및 로드맵 원본(이미지 2개 + 텍스트) 보존. 내용/디자인 분리와 공통 문서 렌더러 적용.
3. **테스트:** `npm test`, `npm run build`; 실제 성공/실패 개수는 `STATUS.md`에서 확인할 것. 브라우저 인쇄 수동 검증 별도.
4. **상태:** STEP 1 로컬 구현. 배포 없음. 사용자의 PDF 육안 검증 대기.
5. **오류/대안:** 환경의 npm 설치/네트워크와 브라우저 인쇄 제약은 검증 결과를 따른다. 브라우저 인쇄 옵션은 앱에서 강제 불가.
6. **저장소/경로:** `hibi89/astra_pdf_redesigner`, `main`, `src/`, `docs/blueprints/`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`. HEAD SHA는 GitHub 최종 재조회 기준.
7. **운영:** `npm install && npm run dev`, 주소 `127.0.0.1:5173`. Production URL/배포 없음.
8. **원본/보안:** 사용자 첨부 이미지 2개와 텍스트 로드맵은 `docs/`에 저장. 원본 수정 금지. 회고록은 localStorage 한 개 저장, API 통신 없음. 비밀정보 저장하지 않음.
9. **다음 작업:** 설치·테스트·인쇄 정확도 검증과 사용자 실제 회고록 PDF 확인. 이후 단계는 승인 후 착수.
10. **갱신 시각/범위:** 2026-10-18 KST. 문서 기준 커밋 SHA 및 확정 테스트는 검증 이후 갱신.
