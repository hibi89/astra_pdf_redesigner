# HANDOFF — Astra PDF Redesigner (2026-10-18)

1. **목표·용도·확정 요구·기술**: PDF 콘텐츠와 디자인을 분리하여 새로운 스타일로 재조판하는 로컬 도구. STEP 1은 국비학원 회고록 입력→테마→실시간 A4 기준 미리보기→브라우저 PDF. React/TypeScript/Vite/CSS, 로컬 저장, 백엔드/API/CDN 없음. 확정 원본은 `REQUIREMENTS.md`, `docs/BLUEPRINT.md`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`.
2. **완료 기능·변경·결정 근거**: 4개 본문+제목/날짜/선택 작성자, 3개 분리된 테마, 6색, 3 크기, 시스템 고딕/명조, 공통 DocumentView, `window.print()`, `@page` A4, 빈 섹션 숨김, 로컬 `schemaVersion:1` 자동 복원/초기화. 외부 API와 PDF 라이브러리를 쓰지 않은 것은 STEP 1 경량·오프라인 우선 요구 때문이다. 원본 설계 PNG 2개와 원본 텍스트를 `docs/`에 변경 없이 저장함.
3. **테스트 명령·성공/실패 수·검증/미검증**: `npm test` 5/5 PASS, `npm run build` GitHub Actions PASS. `tests/browser-smoke.mjs` 실제 Chrome 검증 항목 6그룹 PASS: React 렌더, 입력·테마·복원, 초기화, 손상 저장 데이터, 긴 본문/URL, A4 PDF **15페이지**·출력 텍스트 추출·편집 UI 배제. 결과: [Actions #39128155552](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39128155552). 사용자 Windows/Edge 인쇄 및 한글 글꼴 선택 품질 미검증. CI 초기 시도는 npm 캐시/TypeScript 축소 범위 오류 및 테스트 하네스 장애로 실패했으나 코드·CI를 수정한 최종 HEAD 기준 성공.
4. **완료/진행/대기/차단·중단 지점**: STEP 1 구현과 GitHub 자동 검증 완료. 사용자 실제 회고록 PDF 육안 검수·학원 업로드 가능 여부 대기. STEP 2 블록 데이터 모델·STEP 1 비파괴 변환과 4개 신규 테스트는 구현, 나머지 STEP 2 UI·이미지·다중 문서·내보내기는 미구현. Vercel 배포 없음(로컬 제품).
5. **오류 근거·원인·시도·재시도 금지·대안**: 로컬 npm 설치는 DNS `EAI_AGAIN`으로 차단되어 GitHub Actions에서 정상 설치/빌드 검증. CI 초기 누락된 lockfile 캐시 설정 제거, `src/storage.ts` TS18046 좁히기 문제 수정, 브라우저 도구 `poppler-utils` 설치 및 CDP 새로고침 전환 재시도 처리 후 100% 최종 검사 통과. 사용자 로컬 npm DNS 장애가 있으면 패키지 레지스트리 네트워크를 확인하고 무의미한 반복 설치를 피할 것.
6. **저장소·브랜치·SHA·주요 경로**: `hibi89/astra_pdf_redesigner` `main`, 최종 테스트 검증 기능 SHA `639b5e984e8ba711674a3b3d29fc6baf881a14d1`. 주요 경로 `src/App.tsx`, `src/types.ts`, `src/storage.ts`, `src/styles.css`, `tests/`, `.github/workflows/ci.yml`, `docs/`. 이 문서 자체의 HEAD SHA는 GitHub에서 최신 조회해 확인.
7. **Production URL·Vercel 프로젝트·실행 명령·환경**: Production URL/배포 없음(미적용). `npm install` → `npm run dev` (Vite `127.0.0.1:5173`), `npm test`, `npm run build`. 검증 CI 환경 GitHub Ubuntu/Node.js 22/Chrome headless.
8. **원본 위치·백업·인증·수정 금지**: `docs/blueprints/architecture-flow.png`, `docs/blueprints/seven-step-plan.png`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`는 사용자 원본, 직접 수정 금지. 기존 원본은 Git SHA와 이력으로 복구. 실제 회고록은 해당 브라우저 로컬 `localStorage` 하나만 사용, 서버/클라우드 전송 없음. 브라우저 데이터 제거 시 작업본 삭제될 수 있어 사용자 별도 백업 필요. 비밀/토큰/ENV 없음.
9. **다음 작업 우선순위·절차·완료 기준·승인**: 사용자가 개인 PC에서 최초 npm 설치→dev 실행→짧은 실제 회고록과 장문 샘플 출력·한글 선택·페이지 나눔·학원 첨부 가능성 확인. 결과 확인 후 STEP 1 승인/수용 기록, STEP 2 상세 작업은 새 승인 후 진행.
10. **갱신 일시(KST)·확인 시점·검증 범위·문서 기준 커밋**: GitHub Actions 최종 성공 확인 시점 2026-10-18 21:39:37 KST; GitHub 원본 자료·기능 SHA `639b5e984e8ba711674a3b3d29fc6baf881a14d1` 및 [run #39128155552](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39128155552)을 검증 기준으로 한다. 인수인계 문서는 해당 확인 후 갱신했으며 최신 문서 HEAD는 GitHub 직접 재조회가 기준.

**상태 원칙**: 로컬 ZIP/구현 설명/CI Ready만으로 사용자 Windows 인쇄까지 검증됐다고 주장하지 않는다.

**최종 인수인계 보완:** Chrome 내비게이션 로드 완료 이벤트를 기다리도록 E2E를 안정화했으며, 문서만 수정된 커밋은 CI 재실행에서 제외했다. 최신 기능 SHA `639b5e984e8ba711674a3b3d29fc6baf881a14d1`, 검증 `39128155552` / 2026-10-18 21:39:37.

## 2026-10-18 22:04 KST 최신 작업 인수인계 (STEP 2 첫 단위)
1. **목표:** PDF 내용 보존·디자인 재조판(내용/디자인 별도 저장). 원래 아스트라 7단계 유지. STEP 2는 제목·문단·이미지 블록 기반 개인 문서 제작기. 확정: `REQUIREMENTS.md`.
2. **구현:** STEP 1 UI/저장 키 원형 보존. `src/step2/model.ts` 신규, 기존 회고록 내용/줄바꿈/숫자/테마를 안전하게 변환, 이동·수정·손상 데이터 검사. 문서 편집 UI는 아직 없음.
3. **테스트:** 로컬 Node 22 `npm test` 9/9 PASS. GitHub Actions `39129894290` success (GitHub Ubuntu npm 설치·테스트·빌드·Chrome 스모크). 사용자 Windows 인쇄는 여전히 수동 확인.
4. **상태:** STEP 1 자동 검증 완료, STEP 2 첫 모델 단위 완료, STEP 2 전체 진행 중. STEP 3+ 대기. 미해결: 이미지 저장/관리·UI·프로젝트 export/import.
5. **장애/대안:** 로컬 npm 패키지 레지스트리 DNS EAI_AGAIN으로 build 실행 불가. 성공한 GitHub Actions로 보완. 제약 미해결 시 반복 시도 금지.
6. **저장소/코드:** `hibi89/astra_pdf_redesigner` main. STEP 2 기능 SHA `5eb2b8d5db89f69a2a61254ddd79651d1226ad56`; 계획 `docs/STEP2_DESIGN_DECISION_2026-10-18.md`; PR #1.
7. **배포/환경:** Production/Vercel 미적용(로컬 프로그램), `npm install`, `npm test`, `npm run build`, `npm run dev` → `127.0.0.1:5173`.
8. **원본/보안:** `docs/ASTRA_ORIGINAL_ROADMAP.txt`, PNG 2장, STEP 1 v1 localStorage 원본 키는 변경·삭제 금지; 민감 데이터/토큰 없음. 이미지는 나중에 브라우저 로컬 IndexedDB에 저장.
9. **우선순위:** 블록 CRUD+편집 UI → 이미지 검증·저장 → 다중 문서 → 프로젝트 백업/가져오기 → Chrome 인쇄 E2E. 코드·기능을 완료할 때까지 원본 PDF 업로드/OCR로 범위 확장 금지.
10. **시점/검증:** 2026-10-18 22:04:29 KST GitHub Actions success 상태 재조회, 기능 SHA 확인. 문서 저장 후 최신 docs/BOOK SHA는 GitHub 재조회 필요. 미구현을 완료로 표시하지 않음.

## STEP 2 새 지침 인수인계 — 2026-10-18 22:39:17 KST (기능 브랜치, main 미병합)
1. **목표:** 사용자 확정 PDF 콘텐츠 보존·스타일 재조판. 현재 단계 STEP 2는 PDF 업로드 이전의 개인 문서 제작기. 확정 원본은 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (feature branch).
2. **구현:** `feature/step2-full-20261018`에서 V2 섹션/소제목/문단/이미지 블록 UI, 문서 목록 생성·복제·삭제/수정, 추가 컴팩트 테마, 네이티브 IndexedDB 자산·메타 저장, 변환, JSON 내보내기·가져오기 구현. STEP 1 화면은 별도 호환 버튼으로 유지.
3. **테스트:** 로컬 Node 22 단위 **14/14 PASS**; 순수 TypeScript 모듈의 별도 타입검사 PASS; JSX 구문 검사 PASS. 전체 Vite build 및 실제 Chrome STEP 2 검사 미검증. GitHub Actions #39131861115/#39132088786 runner 미배정 실패.
4. **상태:** STEP 1 main 자동 검증 완료(이전 run #39129894290). STEP 2는 브랜치 소스 구현 중 **검증 대기/부분 완료**. STEP 3 미착수.
5. **실패 및 대안:** CI 작업 약 2초 종료, runner_name 공백·steps 0, 로그 BlobNotFound. 코드 실패인지 미확인. 환경 npm 설치 EAI_AGAIN / --offline ENOTCACHED. 동일 방식 재시도 금지. 인터넷 연결된 개발환경에서 빌드+Chrome E2E 검증.
6. **저장소/SHA:** `hibi89/astra_pdf_redesigner`, main HEAD 문서 갱신 후 재조회, 기능 브랜치 `feature/step2-full-20261018` SHA `ebb5861cbc795286c1aa1d9ea1321fb46f261ffb`. `src/step2/*`, `src/Root.tsx`, `tests/step2-browser.mjs`.
7. **배포:** Production/Vercel 미적용, 로컬 React/Vite, `npm install`, `npm test`, `npm run build`, `npm run dev` → `127.0.0.1:5173`.
8. **원본/데이터/보안:** 원본 로드맵·설계 PNG GitHub에 보관, v1 `astra-pdf-redesigner:current:v1` 자동 삭제·변경 금지. 이미지 Blob은 새 IndexedDB에 저장. 비밀/외부 API 없음. 기능은 검증 전 main으로 병합 금지.
9. **다음 우선 작업:** runner 장애 근거 확인 → 빌드·E2E 수행 → 결함 최소 수정 → STEP 1 회귀·PDF 인쇄/이미지 검증 → main merge → 문서·BOOK 최신화. 사용자 개인정보 포함 문서는 자동 시험 금지.
10. **시각/검증:** 2026-10-18 22:39:17 KST, 로컬 단위/순수 타입 검사와 GitHub 두 runner 미배정 실패 확인. 실제 STEP 2 Chrome/Windows 테스트 아직 수행하지 않음.


## 최신 작업 인수인계 — 2026-10-18 23:38:59 KST (STEP 2 기능 브랜치)
1. **목표·기술:** 원본 PDF 콘텐츠 보존 후 디자인 재조판. 현재 STEP 2 개인 문서 제작기, React/TypeScript/Vite, IndexedDB/브라우저 APIs. STEP 3 PDF 가져오기는 아직 금지.
2. **완료 기능/변경:** `feature/step2-full-20261018`의 V2 편집/문서함/이미지/JSON 기능 소스를 유지. `Workspace.tsx` 이미지 블록 TypeScript 타입 분기와 미사용 import 수정, E2E 손상된 PNG CRC fixture 교체. STEP 1 UI·localStorage v1 원본 미변경. 공개 저장소에서 Actions 러너가 다시 배정됨.
3. **테스트:** 검증된 기능 SHA `caa0747a5b6967393e05b1b704fe0aa5b3f6aa24`. [CI run 39136882566](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39136882566) **success**, 단위 14 PASS/0 FAIL, `npm run build` PASS, 실제 Chrome STEP 1 회귀·A4 PDF 15p PASS, STEP 2 IndexedDB·섹션 이동·PNG 이미지·프로젝트 JSON export/import·이미지 PDF PASS. 추가 수동 항목 미검증.
4. **상태/중단:** STEP 1 main 기존 검증 상태 보존. STEP 2 기능 브랜치 통합 스모크 통과; **main 미병합**, STEP 2 전체 최종 완료 미판정. STEP 3 미착수.
5. **오류·시도·금지:** 종전 GitHub Actions 러너 미할당은 저장소 공개 상태 이후 해소. 재실행 시 TS6133/TS2339 8건 수정, 후속 E2E에서 PNG IDAT CRC 오류 검증·fixture 교체해 최종 PASS. 동일한 무의미한 runner 재시도 불필요. 로컬 npm registry DNS EAI_AGAIN 문제 별도.
6. **저장소/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner` / `feature/step2-full-20261018` 기능 SHA 위와 같음. `src/step2/Workspace.tsx`, `tests/step2-browser.mjs` 변경. `main`은 문서 업데이트뿐, STEP 2 소스 미병합.
7. **Production/환경:** Production URL/Vercel 미적용. 로컬 `npm install`, `npm test`, `npm run build`, `npm run dev`, Chrome/Edge 우선.
8. **원본/백업/보안:** 사용자 원본 `docs/ASTRA_ORIGINAL_ROADMAP.txt`, 원본 PNG 2종 및 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 보존. `astra-pdf-redesigner:current:v1` 기존 저장 데이터 삭제/수정 금지. 민감 문서 외부 전송 금지, 공개 저장소에 비밀 추가 금지.
9. **다음 1단위/완료 기준:** JPEG/WebP·이미지 레이아웃·문서 전환/저장 경쟁·실패 복구 중 위험이 높은 부분을 골라 최소 테스트와 수정·CI 검증. 실제 Windows 검수는 별도. 그 후 main 병합 판단.
10. **확인 시각/범위:** GitHub Actions run `39136882566` success, 2026-10-18 23:38:59 KST 종료·로그 검증. 기능 SHA `caa0747a5b6967393e05b1b704fe0aa5b3f6aa24`, 인수인계 문서/BOOK 최종 커밋은 별도 조회 후 확인.

## 현재 인수인계 갱신 — 2026-10-18 23:47:43 KST
1. **목표/용도/요구/기술:** 사용자의 PDF 원문 보존·새 디자인 재조판 최종 목표. STEP 2 개인 문서 제작기(React/Vite/IndexedDB); STEP 3 PDF 업로드·OCR 미착수.
2. **완료 기능/결정:** STEP 2 feature의 문서·이미지/JSON 기능에 문서 변경 작업 동시 실행 방지 추가. `src/step2/mutationGate.ts`를 통해 다른 문서 변경 시작을 거절하고 작업 중 편집 비활성화; 실패 시 재시도 가능. 기존 STEP 1·v1 localStorage 원본 미변경.
3. **테스트:** `npm test` **16/16 PASS**, `npm run build` PASS, Chrome 실제 실행에서 동일 턴의 복수 문서 전환 차단/원문·활성 문서 새로고침 유지, STEP 1 A4 PDF 15p·STEP 2 PNG/JSON/인쇄 스모크 PASS. 증거 [run 39137537886](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39137537886).
4. **상태/중단:** 저장 경쟁 방어 1단위 구현·CI 검증 완료. STEP 2 전체 수용·main 병합은 아직 대기. STEP 3 미착수.
5. **오류/원인/시도/대안:** 이전 구현은 `switchTo` 등의 비동기 동작 중 후속 변경 실행이 가능해 순서 역전 위험. 중복 요청 거부 게이트로 최소 해결, 실패 뒤 잠금 해제 단위테스트. JPEG/WebP·큰 이미지·멀티탭 및 저장 실패 주입까지 완료 주장 금지.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner` / `feature/step2-full-20261018` 기능 SHA `44d7be92f04be8ff4e1effeb9c16f271069cfe46`; main 기능은 STEP 1 유지. 주요 경로 `src/step2/mutationGate.ts`, `useWorkspace.ts`, `Workspace.tsx`, `tests/step2-mutation.test.ts`, `tests/step2-browser.mjs`.
7. **Production/환경:** 배포 미적용(로컬 프로그램); 개발 `npm install`, `npm test`, `npm run build`, `npm run dev`, `127.0.0.1:5173`.
8. **원본/백업/보안:** 기존 `docs/ASTRA_ORIGINAL_ROADMAP.txt`·PNG 2장·STEP 2 원본 지침 유지. localStorage v1·IndexedDB 사용자 문서 삭제/변경 금지, 외부 전송·토큰 없음.
9. **다음 작업/승인:** JPEG/WebP와 이미지 출력 경계, 또는 IndexedDB 실패 복구 중 **다음 한 단위**를 테스트; 기존 자동 검증 유지 후 main 병합 검토. 실 Windows/Edge 검수는 사용자 수동으로 남음.
10. **시각/검증 범위/문서 기준:** 2026-10-18 23:47:43 KST, run 39137537886 완료·로그 재조회, 기능 SHA `44d7be92f04be8ff4e1effeb9c16f271069cfe46`; 문서 HEAD·중앙 BOOK 커밋은 기록 후 재조회.

## 최신 인수인계 — 2026-10-18 23:59:02 KST (STEP 2 이미지 검증)
1. **목표·구현 범위:** 원본 콘텐츠와 디자인 분리를 목표로 하는 로컬 PDF 리디자인 앱. 현재 STEP 2 문서 제작기 이미지 검증을 수행; STEP 3 기존 PDF 가져오기 미착수.
2. **변경:** 이미지 핸들러/사용자 데이터 수정 없음. `tests/step2-browser.mjs`에 실제 Chrome Canvas JPEG(32×16 가로)·WebP(16×32 세로) 업로드, IndexedDB 새로고침, 이미지 원본 byte-for-byte JSON 내보내기, Chrome A4 PDF `pdfimages` 이미지 포함 검증 추가. 테스트는 개인 이미지·외부 API 불사용.
3. **검증:** [Actions run 39138352449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39138352449) **success**; Node `npm test` 16/16 PASS; TypeScript/Vite 빌드 PASS; Chrome JPEG/WebP 디코딩·복원·메타·원본 바이트 일치·PDF 이미지 3종 포함 PASS; STEP 1 PDF 15페이지 및 이전 STEP 2 스모크 PASS.
4. **현재 상태:** 기능 브랜치 `feature/step2-full-20261018`의 검증 코드 SHA `fa459db3317026190c85f690e5744950ed3b4da1`; 이후 문서 커밋은 GitHub 재조회. main은 STEP 1 기존 코드 유지, STEP 2 main 병합 미진행. STEP 2 전체 최종 수용 미판정.
5. **오류/재시도/원인:** 파일 2회 다운로드가 Chrome 동작에 영향을 받아 테스트 파일 탐색이 타임아웃(`39138141905`, `39138228608`). 사용자 앱 이상으로 단정하지 않음. JSON 다운로드 앞단 Blob을 직접 확인하도록 테스트 하네스 변경 → 최종 PASS. 같은 다운로드 탐색 방식 재사용 금지.
6. **코드·저장소:** `hibi89/astra_pdf_redesigner`, `tests/step2-browser.mjs`, `src/step2/images.ts`(미변경), `src/step2/projectFile.ts`(미변경); 원래 STEP 1 v1 저장키 변경·삭제 없음.
7. **환경/배포:** 로컬 React/Vite, `npm test`, `npm run build`, `npm run dev` → 127.0.0.1:5173; Vercel/Production 없음.
8. **데이터/보안:** 원본 STEP1 회고록, 설계 PNG 2종, STEP2 지침 원본, 사용자 저장 데이터 유지; 신규 테스트 이미지는 비민감 합성 데이터만 사용, 서버로 문서·이미지 전송 안 함.
9. **다음 1단위/검증 조건:** IndexedDB 할당량·트랜잭션 실패 복구 혹은 대형 이미지/긴 캡션/페이지 분할 경계 1단위를 테스트. 사용자 Windows/Edge 실제 저장 검수는 별도. 전 항목을 완료로 주장하지 않고 main 병합은 후속 판단.
10. **갱신 및 확인:** 2026-10-18 23:59:02 KST, run `39138352449` success 및 전체 로그 재확인, 기능 SHA `fa459db3317026190c85f690e5744950ed3b4da1`. 문서 HEAD·BOOK 동기화 후 재조회 기준.


## 2026-10-19 00:10:27 KST 현재 작업 인수인계 — STEP 2 저장 실패 회복
1. **목적/기술:** 최종 PDF 원문 보존·디자인 재조판 로컬 앱. 현재 STEP 2 문서 제작기 React/Vite/IndexedDB, STEP 3 PDF 불러오기 미착수.
2. **구현·의미:** 기능 브랜치 `feature/step2-full-20261018`, `src/step2/useWorkspace.ts` 저장 재시도 성공 시 낡은 오류 안내 제거; `tests/step2-browser.mjs`에 실제 Chrome 브라우저 IndexedDB 문서 write 트랜잭션 1회 강제 실패 후 복구 시나리오 추가.
3. **실제 테스트:** [CI 39139215112](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139215112) **success**. `npm test` 16/16, `npm run build` PASS, Chrome 기존 STEP 1 PDF15p·STEP2 JPEG/WebP/PNG·JSON·다중 문서 회귀 PASS. QuotaExceededError 주입: 기존 DB 원본 보전, 편집 메모리 유지, 저장 실패 경고, 이탈 경고, 긴급 JSON export(원문·이미지), 저장 재시도·오류 안내 해제·새로고침 후 데이터 보존 모두 PASS.
4. **상태/미완료:** STEP 2 핵심 구현·자동 테스트 상당 부분 검증. 전체 완료 선언 및 main 코드 병합 **대기**; Windows/Edge 수동 인쇄·대형 이미지/긴 캡션·이미지 트랜잭션 실패·멀티탭은 미검증. STEP 3~7 미착수.
5. **발견 문제·원인·대안:** 실패한 비동기 IndexedDB 저장 이후 재시도는 이전에도 정상 동작했으나 UI 오류 메시지 유지 위험을 확인해 최소 수정. QuotaExceededError 테스트는 1회 주입이며 물리적 디스크 부족 전체 조건을 재현한 것은 아님.
6. **SHA/경로:** 검증 기능 SHA `9339adb319a78192a0dda5ae437de248e9a056ca`. `tests/step2-browser.mjs`, `src/step2/useWorkspace.ts`. 저장소 `hibi89/astra_pdf_redesigner`, 브랜치 `feature/step2-full-20261018`, main에는 기존 STEP 1 유지.
7. **실행/배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` localhost 127.0.0.1:5173. Vercel Production/로그인/API 없음.
8. **보안·원본:** 사용자 기존 `astra-pdf-redesigner:current:v1` localStorage와 STEP 1 설계 원본, 프로젝트 JSON·이미지 원본 유지. 합성 테스트 문서/이미지만 사용, 문서 데이터 외부 전송·로그 출력 금지.
9. **다음 작업/기준:** 1단위로 대형 이미지·긴 캡션·페이지 경계 검증 또는 이미지 교체 transaction rollback 주입. 남은 항목 전수검사 전 STEP 2 100% 주장 금지. main 병합은 후속 검수 후.
10. **진행률/갱신:** 2026-10-19 00:10:27 KST, STEP 2 자동 검증 기준 약 85~90%, **7단계 단순 동일비중 환산 약 26~27%**(정량 일정/난이도 반영하지 않은 참고치). CI `39139215112` success·SHA `9339adb319a78192a0dda5ae437de248e9a056ca` 로그 확인; 문서/BOOK 최종 HEAD는 저장 후 재조회.


## 2026-10-19 00:20:19 KST 현재 작업 인수인계 — 이미지 교체 트랜잭션 안전성
1. **프로젝트·목표:** Astra PDF Redesigner `p5`; 원본 PDF 콘텐츠 보존·새 디자인 재조판이 최종 목표. 현재 STEP 2 React/Vite/IndexedDB 문서 제작기, STEP 3 PDF 가져오기 미착수.
2. **구현/변경:** 기존 `src/step2/idb.ts`의 문서·자산·메타 단일 transaction을 그대로 사용. `tests/step2-browser.mjs`에 실제 Chrome 데이터 저장 실패 주입 테스트 추가. 앱 코드와 STEP 1/v1 localStorage 원본 변경 없음.
3. **검증:** [Actions run 39139965821](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139965821) **success**, Node 16/16, TS/Vite build PASS, Chrome 기존 STEP1 15p PDF 및 STEP2 기능 회귀 PASS. 신규 테스트: image asset `put` 후 transaction `abort()` 강제 → 문서 참조/기존 이미지 바이트/자산 개수 완전 보존, 새로고침 후 확인; fault 제거 후 재교체 성공·기존 자산만 제거·고아 자산 0·복원 PASS.
4. **상태/경계:** 이미지 교체 원자성 검증 완료, STEP2 전체 약 90% 수준이라는 비공식 추정; main 기능 미병합. 전체 7단계 동등 가중 환산 약 27%, 실소요시간 추정 아님.
5. **오류·시도/우회:** 오류 재현은 한 번의 진짜 IDB 트랜잭션 중단; 기존 구현이 정상 롤백되어 앱 로직 변경 불필요. 이 통과만으로 브라우저 저장소 전체 고장/디스크 부족을 전부 검증했다고 주장하지 않음.
6. **저장소/SHA/경로:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018` 검증 코드 SHA `154ff8d98aa97da311362c1e11ea78bac9db77d9`, 테스트 `tests/step2-browser.mjs`. main 코드 STEP1 기존 유지.
7. **실행/배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` localhost 127.0.0.1:5173. Vercel/Production 없음.
8. **원본·백업·보안:** STEP1 저장 키·로드맵 PNG/TXT·사용자 문서 변경 없음. 테스트는 합성 이미지·테스트 브라우저 profile만 사용. 비밀/API 없음.
9. **다음 작업 및 수용 기준:** 대형 이미지·긴 설명 출력의 다중 페이지 PDF/텍스트·이미지 누락·겹침 검증 → 멀티탭 충돌 실제 검사 → 최종 STEP2 수용 후 main 병합 검토, 사용자 Windows Chrome/Edge 출력 별도.
10. **검증 시각:** 2026-10-19 00:20:19 KST, 기능 SHA `154ff8d98aa97da311362c1e11ea78bac9db77d9`, run `39139965821` success 로그·결과 재확인. main/feature 문서 HEAD 및 중앙 BOOK은 갱신 뒤 다시 읽는다.


## 최신 인수인계 — 2026-10-19 00:29:24 KST (STEP 2 A4 레이아웃 경계)
1. **목표·요구·스택:** 기존 PDF 원문을 보존하며 새 디자인으로 재조판하는 최종 목적. 현재 STEP 2 개인 문서 제작기(React/Vite/IndexedDB); 사용자 제공 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 원형 유지, STEP 3 PDF import 미시작.
2. **구현 내용:** `tests/step2-browser.mjs`에 고해상도 세로형 이미지(1200×2500), 선행 37줄, 짧은 캡션 및 190줄 긴 캡션의 실제 Chrome A4 PDF 회귀 테스트 추가. 앱 코드/CSS는 변경하지 않음.
3. **검증 결과:** [run 39140653462](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39140653462) **success**: 16/16 unit, TS/Vite build, STEP 1 Chrome PDF 15p·기존 STEP 2 회귀 PASS. 짧은 캡션과 이미지 동일 페이지, 긴 캡션 전/후 표지 보존, 추가 페이지 생성, PDF 전체 텍스트 좌표 A4 물리 경계 내부 PASS.
4. **완료/진행/미검증:** STEP 2 인쇄 경계 특정 시나리오 통과. 실제 멀티탭 경쟁/잠금과 사용자 Windows Chrome/Edge 인쇄·육안 검수 미검증, STEP 2 전체 수용/main 병합 아직 보류. STEP3~7 미착수.
5. **문제/제약:** Chrome A4에서는 해당 사례에 인쇄 수정 필요 없었음. `pdfimages`는 이미지 포함/페이지 검사이고 bbox는 텍스트 물리 범위 검사이므로 픽셀 수준 겹침/미관 전체 증명은 아님. 불필요한 CSS 변경 금지.
6. **브랜치/커밋/경로:** `hibi89/astra_pdf_redesigner` / `feature/step2-full-20261018`, 검증 코드 SHA `3173098c0df9d210cd8d762b28d09a36b5298f73`; `tests/step2-browser.mjs`. main에는 기존 검증된 STEP1 코드 유지.
7. **실행/배포:** `npm install`, `npm test`, `npm run build`, `npm run dev`; Chrome CI Ubuntu Node22. Production/Vercel 없음.
8. **원본·보안:** STEP1 v1 localStorage·기존 원본 PNG/TXT/STEP2 지침·사용자 IndexedDB 문서 불변. 임시 Chrome 프로필과 합성 문서만 테스트. 개인정보·문서 본문 외부 전송/로그 노출 금지.
9. **다음 1단위:** 실제 두 Chrome 탭 동시 접근시 2번째 탭 편집 잠금·1번째 탭 종료 후 재접근/저장 복구 E2E 수행, 성공 후 STEP2 병합·수동 검수 판단.
10. **기준 시각/진행률:** 2026-10-19 00:29:24 KST, 검증 run `39140653462` success/코드 SHA `3173098c0df9d210cd8d762b28d09a36b5298f73`; STEP2 **약 92%**, 전체 7단계 동일 비중 환산 **약 28%**의 비공식 추정. 비중/일정 미반영. 문서와 중앙 BOOK 최종 HEAD는 커밋 뒤 재조회.


## 최신 인수인계 — 2026-10-19 00:36:17 KST (STEP 2 멀티탭 잠금)
1. **목적/현상:** `hibi89/astra_pdf_redesigner` p5, 기존 PDF 콘텐츠 보존·디자인 재조판 최종 목표. 현재 STEP2 React/Vite/IndexedDB 문서 제작기. STEP3 PDF 업로드·리디자인 미착수.
2. **구현/변경:** 앱 코드는 수정하지 않음. 신규 `tests/step2-multitab.mjs`(Chrome DevTools Protocol 실제 두 탭 + Web Locks), `.github/workflows/ci.yml`에 `CHROME_PATH="$CHROME_BIN" node tests/step2-multitab.mjs` 추가. 이전 STEP1/2 원문·자산·localStorage 원본 무변경.
3. **검증 증거:** [Actions 39141151527](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39141151527) **success**, Node **16/16 PASS**, TS/Vite 빌드, Chrome STEP1 15p A4 및 STEP2 종전 기능 회귀 PASS. Chrome 2탭에서 독점 잠금/둘째 탭 편집 차단·경고, 소유 탭 닫으면 잠금 0, 둘째 탭 새로고침 후 잠금 재획득, 기존 원문·신규 편집 저장/재시작 보존까지 검사 PASS.
4. **상태/결정:** STEP2 주요 자동 검증 **약 95% 완료 추정**, 전체 7단계 동등 가중 **약 28~29%**. STEP2 전체 100% 수용 아님; main에는 STEP1 유지, STEP2 feature 미병합. STEP3~7 미착수.
5. **문제/대안:** 잠금 소유자 종료 시 둘째 탭은 **자동 활성화가 아닌 새로고침**으로 편집권 획득(현재 UI 안내와 일치). 크래시/OS별 브라우저/브라우저 Web Locks 미지원 조건은 미검증. 기존 설계에 수정 필요 없음.
6. **SHA/위치:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`, 기능 검증 SHA `3fe13c1097f63296d45c683f63ba0b95acd005a9`; 추가 파일 `tests/step2-multitab.mjs`, `.github/workflows/ci.yml`.
7. **운영/환경:** `npm install`, `npm test`, `npm run build`, `npm run dev` → 127.0.0.1:5173. CI Ubuntu Chrome Node22. Production URL·Vercel 미적용.
8. **원본·보안:** `docs/ASTRA_ORIGINAL_ROADMAP.txt`, 설계 PNG 2장, `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt`, 기존 사용자 IndexedDB·localStorage v1 원본 그대로. 테스트 임시 Chrome 프로필에 합성 텍스트만 사용, 유료 API/비밀/고객 데이터 없음.
9. **다음 작업:** STEP2 완료 기준을 사용자 지침과 코드/테스트/CI 근거로 항목별 점검. 누락 시 처리, 그 후 STEP2→main PR·병합 판단. 사용자 Windows Chrome/Edge PDF 저장·인쇄 미리보기/한글 폰트·육안 확인은 별도 수동 수용 기준.
10. **검증 시각:** 2026-10-19 00:36:17 KST, run `39141151527` 결론 SUCCESS 로그 확인, 테스트 기능 SHA `3fe13c1097f63296d45c683f63ba0b95acd005a9`; `STATUS.md`/본 문서/BOOK commit SHA는 갱신 후 재조회.


## 최신 작업 인수인계 — 2026-10-19 00:53:28 KST (STEP 2 원본 요구사항 최종 감사)
1. **목표/원본:** Astra PDF Redesigner p5 최종 목표는 기존 PDF 본문 그대로 보존·다른 디자인 재조판. STEP2 로컬 개인 문서 제작기 범위만 완료 검토. 원본은 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (1~18절), 상세 수용 체크리스트는 feature `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`.
2. **수정/기능:** `src/step2/Workspace.tsx` 레거시 모드 전환 전 `await w.flush()` 실행, 저장 실패 시 전환하지 않음. `src/step2/idb.ts` 유효한 existing ACTIVE 보존하며 늦은 STEP1 migration doc을 별도 추가, marker와 doc transaction 유지. `tests/browser-smoke.mjs` 초기화 대기, `tests/step2-browser.mjs` 새 전환 E2E·종료 정리 안정화. README 최신 검증 결과 반영.
3. **검증:** [Actions #39142445389](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39142445389) **SUCCESS**, SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`: Node 16/16, TS/Vite 빌드 PASS, 실제 Chrome STEP1 PDF15p·STEP2 이미지/프로젝트파일/실패복구·2탭·대형 이미지·긴 캡션·빠른 화면 전환·저장 실패 차단 PASS.
4. **완료/미완료:** 기능 브랜치 코드 CI 통과. **STEP2 전체 수용 및 main 병합 HOLD**, 이유: 유효한 STEP1 v1 기존 데이터의 cold-start browser migration, 별도 프로필 JSON import, 사용자 Windows/Edge PDF·한글 시각 수동 테스트 미완료. STEP3~7 미착수.
5. **실패/원인/대안:** 검토 도중 빠른 전환 미저장 위험과 delayed migration ACTIVE 강제 변경을 발견해 코드 수정. 중간 CI 초기화 전 disabled 버튼 클릭, 전환 후 wrong active document, mock save failure test readiness, 임시 Chrome 테스트 폴더 ENOTEMPTY 문제 수정. 마지막 run `39142445389` SUCCESS. 통과한 범위를 벗어난 성공 주장 금지.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`. 마지막 검증 코드 SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`; main에는 STEP1 소스만. 상세 감사 `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`.
7. **환경:** Node22/npm, React19/TS/Vite, `npm install`, `npm test`, `npm run build`, `npm run dev` → 127.0.0.1:5173; GitHub Ubuntu Chrome CI. Production/Vercel 없음.
8. **원본/보안:** STEP1 `astra-pdf-redesigner:current:v1` localStorage 원본, 설계 PNG 2종, roadmap TXT, STEP2 원본 지침 보존. 고객 문서/이미지 외부 전송·로그 표시/비밀 없음.
9. **다음 `ㄱ`/완료 기준:** **실제 v1 데이터 선존재 독립 Chrome 프로필 cold-start migration 자동 시험**(title/author/date/4개 항목·서식 원문·디자인·marker 1회·v1 원본 불변). 그다음 새 브라우저 프로필 JSON 가져오기, Windows/Edge 수동 검수; 통과한 후 main 병합/STEP2 최종 완료 판단.
10. **기준 시간·진행률:** 2026-10-19 00:53:28 KST, CI #39142445389 success. STEP2 보수적 **약 90~95%**, 전체 7단계 **약 27~28%** (동일 비중 비공식 추정). 5%p 이상 실질 상승 시 별도 보고.


## 최신 인수인계 — 2026-10-19 01:04 KST (실제 Chrome V1 cold-start 데이터 이동)
1. **목표/원본:** Astra PDF Redesigner p5, 원본 PDF 내용 보존·디자인 교체 최종 목표. STEP2 개인 문서 제작기 기능 브랜치만 검증 중, `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 유지. STEP3 PDF 가져오기 미착수.
2. **구현:** `tests/step2-cold-migration.mjs` 신규. 별도 신규 Chrome 사용자 프로필에 앱 실행 **전** 유효한 v1 `localStorage` 합성 회고록을 preseed, 실제 React/IndexedDB 자동 migration 테스트. `.github/workflows/ci.yml`에 연결. Chrome 테스트 종료 시 임시 프로필 정리 오류가 기능 검증 결과를 덮지 않도록 `tests/step2-browser.mjs` 및 신규 테스트 cleanup error 분리.
3. **실제 검증:** [run 39143261165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39143261165) **success**, SHA `abb3d9425e72a2708306674176346727ef0ea710`, Node 16/16, TS/Vite build, STEP1 PDF15p 및 STEP2 기존 Chrome 전 항목 PASS. 신규: 4개 원문 섹션·빈 섹션/공백·문자·작성자·날짜·디자인 보존, v2 문서 1개·독립 IDs, ACTIVE·migration true, v1 original bytes 불변, reload 후 이중 생성 방지 PASS.
4. **진행/보류:** STEP2 자동 검증과 구현 약 95% 비공식 추정. **main 병합 HOLD**: 프로필 간 JSON backup/import 실물 이식 E2E, 사용자 Windows/Edge 인쇄/한글/시각 수동 검증 남음. 저장 실패 중 원자적 migration 롤백 별도 미검증.
5. **오류/원인:** 기존 Chrome temp profile 정리 ENOTEMPTY로 CI가 기능 PASS 후 실패한 기록 #39143134124; cleanup 경고 분리 후 최종 SUCCESS #39143261165. 기능 검증과 cleanup 경고 구별, 임시 합성 데이터 테스트 서버 환경 한정.
6. **Repo/Branch/SHA/경로:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`; verified code SHA `abb3d9425e72a2708306674176346727ef0ea710`; 신규 `tests/step2-cold-migration.mjs`, `.github/workflows/ci.yml` 갱신. main은 STEP1 기능 그대로 유지.
7. **실행/배포:** Node22, `npm install`, `npm test`, `npm run build`, `npm run dev` localhost 127.0.0.1:5173. GitHub Ubuntu Chrome CI. Production/Vercel 미적용.
8. **원본·보안:** 사용자 기존 v1 `localStorage`와 v2 IndexedDB/설계 PNG·TXT/STEP2 원본 지침 보존, 고객 데이터/네트워크 전송 없음. 테스트는 임시 synthetic records만 사용.
9. **다음 `ㄱ`:** 신규 브라우저 프로필 A에서 이미지 포함 문서 JSON 내보내기 → 완전 별도 Chrome 프로필 B에서 JSON 가져오기, 새 ID·원문/이미지 bytes/디자인 복원·A4 검증. 다음 수용 사항은 사용자 Windows/Edge 출력.
10. **진행률:** 2026-10-19 01:04 KST. STEP2 약 95%, 전체 7단계 동일비중 약 28~29%(가중·시간 미반영). 중앙 `BOOK.md`/보고서 동기화 후 재확인.


## 현재 인수인계 — 2026-10-19 01:19 KST (STEP2 실물 JSON 파일의 프로필 간 이식 검증)
1. **목표/현재 단계:** 기존 PDF 원문 보존·재디자인 최종 목표. 현재 STEP2 개인 문서 제작기 검증, React/TS/Vite/IndexedDB. STEP3 실제 PDF 추출·재구성 미시작.
2. **변경:** 앱 소스는 변경하지 않음. `tests/step2-cross-profile.mjs` 새 Chrome CDP E2E 추가, `.github/workflows/ci.yml`에 실행 연결. 기능 브랜치 `feature/step2-full-20261018`.
3. **검증:** [Actions `39144399956`](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39144399956) **SUCCESS**, 검증 SHA `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`: unit 16/16, TS/Vite build, Chrome STEP1 A4 15p 및 STEP2 모든 이전 E2E PASS. 프로필 A synthetic 한글/영문 본문·디자인·PNG/WebP 저장 후 실제 `.localdoc.json` 다운로드. 분리된 B Chrome 프로필 `DOM.setFileInputFiles`로 파일 import, 기존 B 문서 유지·원문/디자인/bytes 동일·고유 ID 재발급·새로고침 유지·PDF 이미지 2개 PASS.
4. **완료/보류:** 프로필 간 이식 검증 완료. STEP2 전체 최종 수용/main 병합 **HOLD**, 원본 사용자 Windows Chrome/Edge 실제 PDF/한글/배치·키보드 수동 검수 및 migration transaction 실패 rollback 주입 남음. STEP3~7 미착수.
5. **오류·시도:** 이번 검증 최종 CI가 첫 실행부터 SUCCESS. 기존 임시 프로필 정리 지연 WARN은 지난 cold migration 테스트에서 보고된 별개 사항. 확인된 신규 앱 결함 없음.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`; 검증 기능 코드 `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`. `tests/step2-cross-profile.mjs` 및 CI YAML, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`, `README.md` 검증 현황 최신화. main은 STEP1만.
7. **환경/배포:** Ubuntu GitHub Actions Chrome, Node22 `npm install`/`npm test`/`npm run build`/`npm run dev`, local port 4173 테스트. Windows/Edge 미실행, Production/Vercel 미적용.
8. **원본/보안:** STEP1 v1 localStorage, V2 사용자 IndexedDB, 원본 지침 및 이미지·TXT 보존. 테스트는 합성 파일/임시 Chrome 사용자 디렉터리만 사용; 실제 사용자 데이터 변경·외부 전송 없음.
9. **다음 1단위:** V1 최초 마이그레이션 중 실제 IDB transaction abort를 강제하여 marker·doc·원본 데이터 무손실/재시도 성공을 검증. 별도 사용자 Windows/Edge 인쇄·시각 수용 이후 main 병합 재판단.
10. **진행률/기준:** 2026-10-19 01:19 KST, STEP2 약 96%, 전체 7단계 동등가중 약 28~29% (기간·난도 비반영 비공식 추정). 5%p 이상 증가나 단계 완료 시 별도 알림.


## 최신 인수인계 — 2026-10-19 01:29 KST (STEP2 최초 migration 원자적 rollback)
1. **목표/범위:** Astra PDF Redesigner p5, 최종 기존 PDF 본문 보존·디자인 재조판. STEP2 React/TS/Vite/IndexedDB 개인 문서 제작기. STEP3 PDF 실제 가져오기 미착수.
2. **변경:** `tests/step2-cold-migration.mjs` 신규 fault 모드 `STEP2_INJECT_MIGRATION_ABORT=1` 및 `.github/workflows/ci.yml` 별도 실행 추가. 실제 Chrome에서 v1 선존재+초기 migration `documents+meta` IDB transaction을 `abort()`; 실패 이후 새로고침으로 재시도 검증. `tests/step2-browser.mjs` 저장 성공 뒤 버튼 활성화 대기 조건만 보강. **앱 기능 소스 변경 없음**.
3. **실제 검증:** [GitHub Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) **SUCCESS**, SHA `a5009a76499a983aa4566adabddabf862c9e839b`. 실패 직후 V2 문서 0, 완료 marker/ACTIVE 없음, V1 원본 바이트 동일, 오류 안내 PASS. 1회 재시도 시 정확한 V2 원문/서식 복원 및 marker/active 생성, 추가 reload 시 중복 문서 0 PASS. Node16/16, TS/Vite build, STEP1 Chrome PDF15p 및 STEP2 기존 PNG/JPEG/WebP/JSON·다중 탭·긴 캡션 전체 회귀 PASS.
4. **현재 완료·미완료:** STEP2 핵심 앱 기능 및 예정된 Linux Chrome E2E 항목 대부분 통과. **STEP2 최종 수용·main 기능 병합 HOLD**, 사용자 Windows Chrome/Edge A4 출력·한글 폰트·이미지 레이아웃·키보드 수동 검수 남음. STEP3~7 미착수.
5. **발견 오류·원인·대안:** 초기 CI #39144986696은 기존 화면 전환 E2E에서 save-chip 저장됨 표시 뒤 버튼 disabled 해제가 늦어지는 타이밍 실패(앱 데이터 손상 아님). 테스트에서 disabled=false 기다린 후 click하게 수정, 최종 run 성공. 브라우저 임시 프로필 cleanup warning은 테스트 데이터 영역만 관련.
6. **저장소/브랜치/SHA/위치:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018` 코드 SHA `a5009a76499a983aa4566adabddabf862c9e839b`; `tests/step2-cold-migration.mjs`, `tests/step2-browser.mjs`, `.github/workflows/ci.yml`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`. main에는 기존 STEP1 소스만.
7. **테스트 환경/배포:** GitHub Actions Ubuntu Node22+Chrome, `npm install`, `npm test`, `npm run build`, `npm run dev` localhost. Vercel/Production 미배포.
8. **원본·보안:** 사용자 v1 localStorage/v2 IndexedDB·원본 설계 파일·원본 지침 보존. 실패 주입은 합성 데이터·임시 Chrome 프로필에서만 실행; 실제 문서 변경 없음/외부 API 호출 없음.
9. **다음 1단위/완료 기준:** 사용자 Windows Chrome/Edge에서 STEP1 15p PDF/STEP2 한글·PNG/JPEG/WebP·페이지 나눔·프로필 import 수동 수용용 체크리스트 마련. 사용자 테스트 결과 확인 후 STEP2 수용/기능 main 병합 여부 결정. 수동 검증 전 완료·병합 주장 금지.
10. **진행률/시각:** 2026-10-19 01:29 KST, STEP2 약 97~98% 추정, 전체 7단계 동등비중 약 28~29% (비공식·가중/시간 미반영). CI #39145149408 success·검증 SHA `a5009a76499a983aa4566adabddabf862c9e839b` 로그 확인.


## 최신 인수인계 — 2026-10-19 01:40 KST (STEP2 Windows 수용·병합 HOLD)
1. **목표·범위:** p5 Astra PDF Redesigner, 기존 PDF 본문 보존/새 디자인 리디자인 전체 7단계 중 STEP2 개인 문서 제작기 수용 직전. STEP3~7 미착수.
2. **이번 작업:** 원본 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` §16 21항을 그대로 보존한 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md` 신규 생성. Windows Chrome/Edge의 PDF(A4·머리글/바닥글 없음), 한글 텍스트 선택, PNG/JPEG/WebP와 큰 이미지/캡션 페이지 경계, 4종 테마, 저장/복제/JSON 브라우저 이식, 키보드·좁은 화면·백엔드 없이 동작을 수동 점검할 절차/증거 양식·병합 게이트 문서화.
3. **실제 검증 기준:** 마지막 기능 검증 [Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) SUCCESS, 기능 SHA `a5009a76499a983aa4566adabddabf862c9e839b`, Node 16/16 PASS·TypeScript/Vite 빌드·Ubuntu Chrome STEP1 15p/STEP2 이미지·저장 실패·기존 v1 migration abort·프로필간 JSON·PDF·멀티탭 회귀 PASS. **이번 단위에 새 테스트 실행 안 함**. Windows 수동 항목 **21/21 미실행**.
4. **현재 상태/판정:** STEP2 자동 근거 충분하나 OS별 실제 인쇄/한글/이미지 레이아웃 수동 수용 미완료. **STEP2 최종 완료 선언·main 코드 병합 HOLD**. README·요구사항 감사 문서에서 같은 한계 기록. STEP3 시작 금지.
5. **핵심 위험/안전:** 브라우저 프로필·origin별 IndexedDB 격리(`4178` 테스트 포트; 기본 `5173`과 별개). 기존 실제 사용자 데이터 삭제/초기화 금지, 합성 테스트 프로젝트만 사용. PDF 헤더/풋터 브라우저 설정은 앱에서 자동 강제 불가능, Chrome/Edge·OS 시스템 글꼴 차이 실제 검수 필요.
6. **저장소/브랜치/경로:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`, `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`; main은 STEP1 기능 보존. 원본 로드맵/TXT·PNG는 무변경.
7. **로컬 Windows 준비:** Node22+ Git, 새 전용 클론에 `npm install`, `npm test`, `npm run build`, `npm run dev -- --port 4178 --strictPort`; 별도 test Chrome/Edge 프로필로 `127.0.0.1:4178` 접속, PDF 저장/한글 선택/시각 증거 수집. 명령·절차는 신규 문서에 모두 있음.
8. **백업/보안·배포:** 사용자 로컬 데이터·이미지 원본 무변경. 프로젝트 JSON 미암호화, 테스트는 합성 자료만 사용. Production/Vercel 미배포. API·비밀 키 추가 없음.
9. **다음 작업·수용 조건:** 사용자 실제 Windows Chrome/Edge 실행 결과(21항 중 필수 관문·FAIL 재현·합성 PDF/스크린샷) 접수 → 결함 수정 시 CI 재검증 → feature-to-main diff 최종 리뷰·사용자 승인 후 병합 → main Actions 검증. 결과 미수령이면 PASS 주장·병합 금지.
10. **기준 시각/진척도:** 2026-10-19 01:40 KST; STEP2 **약 97~98%** 추정, 전체 7단계 단순 동등가중 **약 28~29%** 유지. 5%p 진도 상승 없음; 새 문서·README·감사/BOOK 갱신 후 GitHub 재조회 필요.


## 최신 인수인계 — 2026-10-19 02:14 KST (STEP2 병합 전 코드 감사 / CI fail-closed)
1. **목표/상태:** p5 Astra PDF Redesigner. STEP2 개인 문서 제작기 feature는 자동 검증 상당 부분 완료. 기존 STEP1 `main` 보존. STEP2 main 병합·STEP3~7 아직 시작하지 않음. 사용자는 가능한 자동 검증을 GPT가 직접 수행하고 Windows 실제 조작을 반복 요구하지 않기를 원함.
2. **이번 작업:** `main...feature/step2-full-20261018` 및 역방향 비교(기능 브랜치 63 ahead, 28 behind; main의 최신 HANDOFF/STATUS 문서 유지 필요), `src/step2/{idb,useWorkspace,model,images,projectFile,Workspace}`, `src/Root.tsx`, `.github/workflows/ci.yml` 및 E2E 스모크 정적 감사. 새 보고 `docs/STEP2_PREMERGE_CODE_CI_AUDIT_2026-10-19.md`.
3. **코드 수정:** CI에서 Chrome 없을 때 경고+성공(`exit 0`) 처리 경로를 **오류+실패(`exit 1`)**로 변경. React 앱/IndexedDB 기능 소스 변경 없음. 검증 코드 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`.
4. **실제 검증:** [Actions #39148544554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39148544554) **success**; Node 16/16 PASS, TypeScript/Vite build PASS, 로그에 `Chrome: /usr/bin/google-chrome`, STEP1 15p PDF/STEP2 이미지·JSON·동시탭·migration abort·큰 이미지/긴 캡션 등 모든 Chrome 스모크 PASS. 테스트 Chrome 임시 profile cleanup 경고 `ENOTEMPTY`는 가끔 있으나 최종 CI success.
5. **Windows 실제 제출물:** 사용자가 Windows Chrome155에서 짧은 PDF 및 편집기 화면 제출. PDF 1p A4 `594.96×841.92pt`, 맑은 고딕 embedded+Unicode, 한글 원문 추출 가능, 편집기 UI 인쇄 제외 확인. 이 PDF는 이미지 없는 1페이지라 Windows 대형 이미지/2페이지 이상·Edge 시각/글꼴·키보드까지 완료로 간주하지 않음. 실제 사용자 PDF 파일은 공개 GitHub 저장소로 옮기지 않음. 21항 전체 PASS는 아직 미확정, 일부 Chrome 부분 증거 기록.
6. **병합 판단:** HOLD. feature와 main은 diverged; main 문서 기록을 보존하며 실제 3-way merge/diff/새 CI 확인 필요. 사용자의 명시적 승인 전 main 기능 병합 금지.
7. **Repo/Paths:** `hibi89/astra_pdf_redesigner`, feature `feature/step2-full-20261018`; `docs/STEP2_PREMERGE_CODE_CI_AUDIT_2026-10-19.md`, Windows checklist `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `.github/workflows/ci.yml`, `README.md`. 기존 원본 roadmap/TXT/PNG·STEP1 v1 localStorage 삭제/수정 금지.
8. **기술/환경:** Node22, React19/TS/Vite/IndexedDB, `npm install`, `npm test`, `npm run build`, `npm run dev`. Local 127.0.0.1. No Vercel/Production, 외부 AI API 없음.
9. **다음 1단위:** 이미 Linux Chrome 자동 검사 통과한 것은 반복 검증 최소화. 남은 Windows Edge/이미지 포함 장문 수동 검수 범위를 사용자와 합의하되 사용자 PC 개입 요구 최소화; 병합 승인 후 main 최신 문서 보존하며 병합 및 main CI 검증. STEP3는 별도 사용자 지침 후.
10. **진행률/시간:** 2026-10-19 02:14 KST. STEP2 약 **97~98%**, 전체 7단계 단순 동등 비중 약 **28~29%**. 5%p 유의미한 상승 아님. 검증 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`, Actions #39148544554 성공 확인.


## 최신 인수인계 — 2026-10-19 02:24 KST (Linux Microsoft Edge 155 실제 A4 PDF/저장 E2E)
1. **목적:** Astra PDF Redesigner p5, STEP2 개인 문서 제작기 마무리. 기존 PDF 본문 보존·재디자인은 장기 목표(STEP3~7 미착수). 사용자 반복 수동테스트 최소화, 자동 가능한 것은 CI 수행.
2. **변경:** `feature/step2-full-20261018`의 `.github/workflows/ci.yml`에 Edge 필수 단계 추가. `microsoft-edge` 탐지 실패시 **exit 1**; 제품 버전 출력 및 Poppler 확인 후 Edge 실행 경로로 기존 `tests/browser-smoke.mjs`, `tests/step2-browser.mjs` 두 CDP 테스트를 실제 실행. 앱 React/IndexedDB 기능 코드는 변경하지 않음.
3. **검증:** [Actions #39149195481](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481) **SUCCESS**; 검증 소스 SHA `34352fd4e92ca43641da3b4d9de3070232276497`. Microsoft Edge `/usr/bin/microsoft-edge` **155.0.4283.45**, STEP1 A4 PDF15p/텍스트 추출/편집 UI 제외 PASS, STEP2 IndexedDB 저장, PNG/JPEG/WebP 원본 및 PDF raster, JSON 가져오기·내보내기, 긴 캡션/대형 이미지 A4, QuotaExceededError·이미지 교체 중지 복구, 레거시 화면 전환 테스트 PASS. 기존 Google Chrome 전수·Node 16/16·TS 빌드도 PASS.
4. **검증 범위/한계:** 실제 **Ubuntu Linux Edge** 자동 검증이며 사용자 **Windows Edge 실제 PDF/글꼴·시각 검수는 미완료**. 사용자가 제출한 Windows Chrome 1페이지 A4 한글 PDF 부분 증거는 존재, Windows 다페이지/이미지 및 키보드 조작 별도. Edge에서는 browser-smoke/step2-browser 두 스모크만 실행(Chrome 별도 멀티탭/프로필간 이식 스크립트의 Edge 재실행은 아님).
5. **완료/병합:** STEP2 자동 검증 중심 약 **98~99%**(비공식 추정), 7단계 전체 동일 비중 약 **28~29%**. 사용자 수용/Windows 잔여 사항 및 명시적 승인 전 **main 기능 미병합 HOLD**, STEP3 미착수.
6. **GitHub 파일/refs:** 저장소 `hibi89/astra_pdf_redesigner`, 브랜치 `feature/step2-full-20261018`; 검증 코드 `34352fd4e92ca43641da3b4d9de3070232276497`, `docs/STEP2_EDGE_CHROMIUM_CI_VALIDATION_2026-10-19.md`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`, `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `README.md`. main은 기존 STEP1 코드 보존.
7. **테스트 환경:** GitHub Ubuntu Node22 + Chrome + Microsoft Edge 155, Vite localhost 127.0.0.1:4173, npm test/build, Poppler. 타이밍 이슈와 임시 프로필 cleanup `ENOTEMPTY` WARN은 사용자 데이터 실패와 구별. Production/Vercel 미배포.
8. **데이터/보안:** 실제 사용자 v1 localStorage·v2 IndexedDB, 로드맵 원본 TXT/PNG, 원본 지침 무변경. 테스트는 합성 임시 Chrome/Edge 브라우저 프로필에서만 실행; 사용자 PDF 원본은 GitHub 공개 업로드 금지, API 키 없음.
9. **다음 1단위:** main과 feature의 병합 준비·충돌·원본 안전성 및 사용자 승인 전제 조건 재확인. Windows Edge 실제 A4/한글/사진·키보드 미검증은 남기되 자동 검사를 반복해 사용자에게 재요구하지 말 것. 명시적 병합 승인 전 main 변경 금지.
10. **기준:** 2026-10-19 02:24 KST, Actions #39149195481 SUCCESS·Edge 바이너리/버전·실제 테스트 로그 확인. STEP2 약 98~99%, 전체 28~29%, 5%p 이상 상승 아니므로 전체 진행률 변동 별도 선언 불필요.


## 최신 인수인계 — 2026-10-19 02:43 KST (STEP2 main 격리 3-way 병합 실제 통과)
1. **목표/현재:** `hibi89/astra_pdf_redesigner` p5 STEP2 개인 문서 제작기를 기존 STEP1 main에 안전하게 병합할 수 있는지 실환경 검증. 최종 기존 PDF 본문 추출/재디자인 STEP3~7은 아직 미착수. 사용자는 반복 수동검수 최소화 희망.
2. **이번 변경:** `feature/step2-full-20261018`에 `.github/workflows/step2-merge-preflight.yml` 신규: GitHub Actions `contents:read`, checkout `fetch-depth:0`, `persist-credentials:false`, `main` detached HEAD에서 실제 `git merge --no-commit --no-ff FEATURE_SHA` 수행한 뒤 **merge commit/push 없이** 검수. 앱 기능 원본 코드 수정 없음.
3. **병합 결과:** [Actions #39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) **SUCCESS**; 시험 조합 main `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a` + feature `8d9fdb1adef31875a793cce9376de3154eb08229`. diverged 73 ahead/32 behind, Git 충돌 0, `git diff --name-only --diff-filter=U` 빈 결과, staged 28개 경로, HEAD는 여전히 main/ MERGE_HEAD feature 일치.
4. **데이터·원본 불변:** main `HANDOFF.md`, `STATUS.md`, `src/App.tsx`, `src/storage.ts`, 원본 roadmap TXT, STEP1/BLUEPRINT spec, PNG 2개 및 feature STEP2 원본 지침을 병합 트리에서 원본 파일에 `cmp`로 바이트 비교 **모두 PASS**. 테스트용 합성 문서만 사용; 사용자 실제 브라우저 데이터 변경 없음.
5. **병합 트리 기능 증거:** Node16/16, TypeScript/Vite build, 실제 Chrome STEP1 A4 15p 및 STEP2 이미지/JSON/저장·2탭 Web Locks·V1 migration abort/재시도·프로필간 JSON 이식 **PASS**. 실제 Microsoft Edge 155에서 STEP1 A4·STEP2 PNG/JPEG/WebP/긴 캡션/IndexedDB 저장 오류 복구 **PASS**. 동일 feature 자체 CI #39150537297 SUCCESS.
6. **경계/승인:** **main 실제 병합 미진행 / STEP2 사용자 최종 수용 HOLD**. Windows Chrome에서 사용자가 제출한 1p A4 한글 PDF 일부 PASS; Windows Edge 사용자가 생성한 이미지/긴 문서 출력·키보드 육안 수동검수 미확인. 사용자 승인 전에 main merge 금지. Status/Handoff 갱신으로 main docs-only HEAD가 변하면 **병합 직전 최신 main+feature SHAs로 preflight 재실행 필수**.
7. **저장소/증거:** `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`에 SHA/28 files/CMP/모든 통합 테스트 기록, `.github/workflows/step2-merge-preflight.yml` 계속 feature push마다 검사. 기존 원본 `docs/ASTRA_ORIGINAL_ROADMAP.txt`, `docs/blueprints/*.png`, STEP2 지침 TXT 불변.
8. **배포/보안:** GitHub Ubuntu Node22, headless Chrome+Edge, Vite localhost. 사용자 원본·비밀/토큰 접근/외부 공개 없음. Production/Vercel 미배포. GitHub main 브랜치 기능은 STEP1 상태 유지.
9. **다음 1단위:** 실사용 Windows의 미확인 항목을 명시하며 STEP2 수용/병합 승인 판단. 사용자 명시적 승인이 있으면 최신 main/feature 재확인·preflight 재실행 → 실제 병합 및 main 전체 CI/원본 보존 검증. STEP3 시작은 이후 별도.
10. **진행률:** 2026-10-19 02:43 KST STEP2 자동·기술 관점 약 **99%** 비공식, 전체 동일 비중 7단계 **약 28~29%**, 전체 5%p 이상 상승 아님. 시험한 feature SHA `8d9fdb1adef31875a793cce9376de3154eb08229`, Actions #39150537369 최종 success 로그 확보.


## 최신 인수인계 — 2026-10-19 02:52 KST (p5 STEP2 Draft PR #2)
1. **목적:** STEP1 원본 편집기·v1 localStorage를 유지하며 STEP2 React/TS/IndexedDB/이미지·JSON/A4 제작기 브랜치를 main에 검토용 등록. STEP3 PDF 원문 추출/재디자인은 아직 미착수.
2. **결과:** [Draft PR #2](https://github.com/hibi89/astra_pdf_redesigner/pull/2) **open / draft=true / merged=false**. Head `feature/step2-full-20261018`, base `main`. 생성 후 GitHub API `mergeable=true`, `mergeable_state=clean` 확인(당시 head `d94fdd831ce53b3afb4e02eea640c93c3209cc94`, base `e9044998f6f05cb41d13e339e6e8424e37ef62bb`). PR 설명에 기능·테스트·Windows 수동 미검증·수용 체크리스트 및 승인조건 작성. **실제 merge 하지 않음**.
3. **검증:** 기존 preflight [#39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) SUCCESS(기능 `8d9fdb1adef31875a793cce9376de3154eb08229` + main `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`), 파일 바이트 보존·Node16/16·빌드·Chrome/Edge E2E PASS. **현재 PR HEAD와 시험 SHA는 달라 최신 HEAD의 전체 preflight PASS로 단정하지 않음**. GitHub mergeable=clean은 충돌 없음 표시에 한정.
4. **사용자 부분 검수:** 실제 Windows Chrome155 1p A4 PDF 한글·폰트 임베딩·텍스트 추출·앱 UI 제외 부분 PASS. Windows Edge 실 PDF, Windows 이미지/다페이지/키보드 최종 수동 검수 미완료. 자동 가능한 항목은 모두 CI로 처리; 반복적인 사용자 조작 요구는 최소화.
5. **판정:** STEP2 main 통합 PR은 **Draft 상태 HOLD**, 사용자 명시적 main 병합 승인 전 merge 금지. 사용자 남은 수동/시각 문제 수용 여부도 별도 확인 필요.
6. **Repository/docs:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`; PR #2, `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`, `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`, `README.md`. main STATUS/HANDOFF는 문서만 변경, STEP1 앱 기능은 그대로.
7. **실행/환경:** Node22 npm test/build, GitHub Actions Ubuntu Chrome+Microsoft Edge 155, 로컬 Vite, no Production/Vercel. 원본 로드맵 PNG/TXT, STEP2 지침 TXT, 사용자 localStorage/IndexedDB 그대로. 외부 API 키 없음.
8. **유의:** 현재 main doc 갱신으로 PR base SHA가 또 변할 수 있으므로, 병합 직전 최신 PR head/base 재조회→isolated preflight 재실행. 중요 자료 원본 변경/유실 막기.
9. **다음 1단위:** 사용자 별도 승인 요청 시 잔여 Windows Edge 시각 검수 수용/추가 실행 중 선택→(승인된 경우) 최신 HEAD 기준 병합 사전검사 및 main merge·새 main CI. 승인 없으면 PR Draft 유지.
10. **진척도:** 2026-10-19 02:52 KST, STEP2 기술 구현 약 **99%**, 전체 7단계 동일 가중 약 **28~29%** 비공식 추정; 실사용 최종 수용/병합 미완료. 5%p 의미 있는 상승 없음.


## 최신 인수인계 — 2026-10-19 (main Edge CDP 자동검사 복구 SUCCESS)
1. **p5 프로젝트:** `hibi89/astra_pdf_redesigner`, PR #2 STEP2 개인 문서 제작기 **main 병합 완료**, merge SHA `f1ad26320b12b07019b115f77f8cf55e62f1e7e6`.
2. **병합 직후 main 실패:** [Actions #39155133495](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39155133495) FAILURE: Node16/16/빌드/Chrome 전수 PASS, Edge STEP1 CDP `/json/version` 제한시간 초과. 로그 Edge `DevTools listening` 출력 확인, D-Bus 경고는 원인 미확정.
3. **새 지시로 복구 실행:** tests `browser-process.mjs`가 프로필별 DevToolsActivePort에 기록된 WS URL에 직접 연결/핸드셰이크(+stderr/종료 진단); 5개 브라우저 스모크 수정. CI `edge-validation`을 Chrome과 다른 Ubuntu runner로 분리. 앱 `src/**` 변경 없음.
4. **검증 성공:** main 기능/CI 코드 SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`, [Actions #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) SUCCESS, 독립 jobs `build-and-test`, `Microsoft Edge A4 PDF and IndexedDB` 모두 success. Node 16/16, build, Chrome 장문/이미지/IndexedDB·2탭 Web Locks·V1 migration abort·JSON A→B, Edge 실 A4/이미지·장문·저장 오류/복구 전수 PASS.
5. **산출 보고:** `docs/STEP2_POSTMERGE_MAIN_CI_RECOVERY_2026-10-19.md`. 기능 코드 변경 0, CI/테스트 파일 7개 수정. main 새 docs-only HEAD가 생기면 **검증된 실행 SHA는 `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`**라고 분리 표기할 것.
6. **미완료:** 사용자 실제 Windows Edge A4/한글, Windows Chrome/Edge 2페이지 이상 장문·이미지 PDF 육안, 키보드·작은 화면/Windows간 JSON 이식 등 *NOT RUN*. 사용자는 잔여 위험을 main 병합에 대해 수용했으나 STEP2 Windows 최종 수용을 완료했다고 표시하지 말 것.
7. **다음:** STEP3 PDF import/재디자인 미착수. 사용자 별도 `ㄱ` 또는 명시 지시로 진행 방향 결정; 현재 응답에서는 새 기능 개발하지 않음. 실제 상용 사용 전 Windows 수동 체크리스트 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`를 완료해야 함.
8. **진척도:** STEP2 기술적 기능 약 99% / 전체 7단계 동일 비중 약 28~29%의 비공식 추정 유지. STEP2 전체 검증 PASS는 아님.


## 최신 인수인계 — 2026-10-19 STEP3 첫 PDF 가져오기 MVP (p5)
1. **기준:** `hibi89/astra_pdf_redesigner` 안정 main은 STEP2까지 병합된 상태, 기존 성공 CI #39157047624. 원본 로드맵 `docs/ASTRA_ORIGINAL_ROADMAP.txt` STEP3 §5를 우선한다. STEP1/2 저장 자료·앱 기능 원본 변경 금지.
2. **현재 작업:** `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) **open/draft**. main 앱 코드 미병합. STEP3 PDF 가져오기 첫 세로형 MVP 구성.
3. **소스:** `src/step3/pdf.ts` PDF.js `6.4.299` + worker bundled `?url`; `structure.ts` 좌표 기반 단일 열 읽기순서·제목/본문/캡션 추정·경고; `convert.ts` STEP2 문서 변환; `ImportPanel.tsx` 원본 Blob PDF 뷰어와 추출검수·수정·명시적 확정; `src/step2/model.ts` caption 및 출처 좌표 optional 호환; `useWorkspace.ts` 원자적 새 문서 저장; `Workspace.tsx` 통합. `pdfjs-dist` Apache-2.0.
4. **테스트:** feature 구현/검증 코드 SHA `e216866a592362342ac6dd2ca2105b71799cc8fc` 및 [Actions #39159350165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39159350165) **success**. Node **21/21 PASS**, TS/Vite build PASS, 기존 Chrome/Edge STEP1/2 회귀 + 실제 양 브라우저 STEP3 합성 PDF 업로드→원본대조·새로고침·새 A4 재출력 E2E PASS. 실패했던 첫 타입 컴파일은 PDF.js v6 TypeScript API 차이 수정 후 해결.
5. **안전:** PDF bytes 브라우저 내 처리, 외부 서버/CDN 없음; 원본 PDF 영구 DB 저장하지 않음, 확인 전 기존 문서함 변경 없음, 저장은 새 문서+ACTIVE 단일 transaction. 텍스트를 임의 재작성하지 않으며 읽기순서·줄바꿈·공백 추정 경고.
6. **아직 안 된 것:** 실제 단순 PDF 5~10개 원본/추출 비교, PDF 이미지 복원(현재 이미지 명령 감지 및 경고), 다단/표·암호/스캔 OCR, Windows 현장 테스트. 이전 STEP2 Windows Edge 실제 PDF·장문 이미지·키보드 NOT RUN 계속.
7. **보고/목표:** `docs/STEP3_PDF_IMPORT_DESIGN_2026-10-19.md` 및 `docs/STEP3_MVP_IMPLEMENTATION_AND_CI_2026-10-19.md`는 **feature**에만 존재. 이번에는 Step3 코드 `main`에 병합하지 않았으며 명시적 승인 전 Draft 유지.
8. **다음 작업:** 다양한 합성 텍스트·혼합 이미지 페이지에서 원본 대조 정확도 측정, 추출 누락 위험 신호 및 PDF 이미지 추출 경로 검증, CI 강화를 진행. 실제 사용자 PDF는 승인 없이 GitHub에 업로드/공개하지 말 것.
9. **진척도:** STEP3 약 45~50% 비공식 (첫 MVP 자동 검증 관점), 전체 동등비중 7단계 약35% 비공식. 실제 시간/품질 35% 완성이라는 뜻 아님.


## 최신 인수인계 — 2026-10-19 STEP3 이미지 복원·다페이지 검증
1. **기준:** p5 `hibi89/astra_pdf_redesigner`. main은 STEP2 안정 코드 보존. STEP3는 `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)에서만 구현, main merge 금지(명시적 승인 전).
2. **새 구현:** `src/step3/imageRecovery.ts` 브라우저 PDF.js 이미지 operator CTM/viewport 좌표, 일반 XObject/inline 디코딩 픽셀→PNG, 마스크/회전/그룹/반복/잘못된 좌표 미지원 경고. `pdf.ts` 이미지 복원 호출, `structure.ts` 페이지 순서·여러 열 경고 및 감지/복원/미복원 건수, `ImportPanel.tsx` 복원 PNG 미리보기·개별 포함/제외·명시 확인. `convert.ts` 새 V2 이미지 블록/Asset 변환·근사 위치, `src/step2/{model,useWorkspace}.ts` 원본 좌표(선택)·문서/PNG/active 원자 저장.
3. **CI 판정:** 구현/검증 SHA `53c56e47a10606e381d4f5593695b7ca11bc7733`, [Actions #39162038601](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39162038601) **SUCCESS**; Node26/26·build, 기존 STEP1/2 Chrome·Edge E2E/저장·멀티탭/프로필간 JSON 회귀 PASS. 실제 Chrome/Edge 합성 **2페이지** PDF 컬러 이미지 1건 감지/복원/미복원0, 원본 비교→새 V2 문서·PNG 저장→리로드→A4 PDF raster 이미지 포함/`pdftotext` 첫-끝 순서 PASS.
4. **증거:** feature `docs/STEP3_IMAGE_RECOVERY_MULTIPAGE_VALIDATION_2026-10-19.md`, `docs/STEP3_PDF_IMPORT_DESIGN_2026-10-19.md`, `docs/STEP3_MVP_IMPLEMENTATION_AND_CI_2026-10-19.md`. 중간 실패 run은 문구/TS 타입/체크박스 선택자/비동기 로딩 경합 수정과 구분, 마지막 성공 run만 최신 PASS 증거.
5. **제한:** PNG **재인코딩**, 원본 이미지 bytes 보존 아님; 이미지 마스크·회전·그룹/반복·클리핑/벡터·다단/표 문서의 완전 복원 아님. 고용량/다량 XObject 실물 성능과 정확도 미검증.
6. **추가 수용:** 실제 사용자 PDF 5~10개 대조 및 Windows Chrome/Edge 실 PDF·장문/이미지·키보드 육안 NOT RUN. STEP2 Windows 미완료 검수 별도 유지. 실제 사용자 PDF를 공개 저장소에 올리지 않음.
7. **다음 `ㄱ`:** 누락/복잡 이미지 합성 fixture 확대, 페이지 순서 모호성·오류 계측, 실문서 샘플 수용 검증 기준 강화. PR #3은 Draft 유지. STEP4 선착수 금지.
8. **진척도:** STEP3 비공식 약65~70%, 전체 단계 동등비중 약38%(이전35% 대비 +3%p). 기능/CI 검증 SHA와 문서만 갱신된 feature HEAD는 구분. STEP3 최종 전체 수용 아님.

## 2026-10-19 10:29:29 KST — STEP3 이미지 실패 경계 테스트 1단위 인수인계
1. **목표·용도·기술**: 로컬 PDF 업로드→내용 확인→재디자인 PDF, 이번은 PDF.js operator list 미지원 이미지·위치 오류의 무음 누락 방지 회귀 테스트에 한정.
2. **변경/판단**: 기능 수정 없이 `tests/step3-image-recovery.test.ts`에 3건 추가. 실제 클리핑/벡터 이미지 복원을 주장하지 않으며, 미지원/위치 오류는 검수 경고로 집계하도록 기존 구조를 검사.
3. **검증/미검증**: GitHub commit `2200836cc529f4272e78456783d36e50f6b0142c`, blob `794a361b114df268390a8163b86dbd756fcf72d6` 재조회 완료. commit workflow 조회 결과 0건, status 빈 배열. **신규 테스트 실행·빌드·브라우저 CI 미검증**. 기존 CI #39162038601 성공은 이전 SHA에만 적용.
4. **상태/중단 지점**: STEP3 기능 브랜치 Draft PR #3 유지, main 병합 금지. 테스트 반영 완료 / 실행 확인 대기 / 실제 문서·Windows 현장 검수 대기.
5. **오류/원인/재시도 금지**: 신규 코드 오류는 아직 관측되지 않음. GitHub Actions 실행 결과를 커넥터가 제공하지 않아 합격 판정 불가. 같은 조회 방식 반복만으로 합격 주장 금지. 추후 CI 런 ID 또는 사용 가능한 실행환경 확보 후 테스트.
6. **저장소/브랜치/SHA/경로**: `hibi89/astra_pdf_redesigner` / `feature/step3-pdf-import-20261019` / `2200836cc529f4272e78456783d36e50f6b0142c`; `tests/step3-image-recovery.test.ts`, 기존 `src/step3/imageRecovery.ts` 변경 없음. main 인수인계 문서만 별도 갱신.
7. **배포/환경**: Vercel/Production 미적용. Node22 `npm test` → `npm run build`, CI Chrome/Edge 스모크는 실행 확인 대기.
8. **원본/백업/보안**: 원본 Git SHA와 Git history로 복구. 브라우저 localStorage/IndexedDB, PDF/이미지 사용자 원본, 로드맵·PNG 보호. 합성 테스트만 사용; 민감 데이터·토큰 미출력.
9. **다음 확정 작업/완료 기준**: 이번 신규 커밋의 3개 Node 테스트 및 종전 회귀 전체 CI를 검증한다. 통과 근거 없으면 테스트 완료나 진행률 상승 주장하지 않는다. Windows 실사용/사용자 PDF 수용 검사는 별도.
10. **시각·검증 범위**: 2026-10-19 10:29:29 KST. 이번 검증은 소스 반영과 blob 재조회까지. 문서 자체의 최신 HEAD는 저장 후 별도 확인. STEP3 65~70%, 전체 약38%는 종전 비공식 추정 유지.

## 2026-10-19 10:48:52 KST — STEP3 신규 회귀 검증·Edge CDP 초기화 실패 최소 수정 인수인계
1. **목표/기술·요구:** 기존 PDF 콘텐츠 우선 보존→검수→재디자인 PDF 출력. 로컬 React/TypeScript/Vite+PDF.js/IndexedDB, 이번 한 단위는 STEP3 신규 이미지 누락/좌표 회귀의 실제 CI 검증.
2. **완료 기능·변경 이유:** 사용자 이전 `ㄱ`에서 추가한 이미지 마스크/반복·그룹, 페이지 밖/제로 영역, 복구된 graphics-state 3개 회귀를 검증. Edge 첫 CDP 접속이 느린 CI 환경에서 제한시간 35초를 넘은 로그 확인 후 `tests/browser-process.mjs`만 수정, **Edge만 60초 / Chrome 35초**. `src/**`, STEP1/2 사용자 파일·브라우저 저장 데이터·오리지널 로드맵 변경 없음.
3. **테스트/성공·실패:** 구 SHA `2200836cc529f4272e78456783d36e50f6b0142c` Actions [#39185454384](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39185454384) **실패(Edge CDP 최초 연결 timeout)**, Node 29/29·빌드·Chrome 전수 성공. 최신 검증 SHA **`aa63fc262d0a2db080be4be82bd91d7b4a5b3976`**, Actions [#39186875371](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39186875371) **전체 SUCCESS**, Node 29/29 PASS, 0 FAIL, TypeScript/Vite build PASS, Google Chrome STEP1/2/3 회귀 PASS, Linux Microsoft Edge 155 STEP1/2/3 PDF·이미지·저장 E2E PASS. Chrome/Edge 두 job logs 직접 확인. Windows 수동 결과 미검증.
4. **완료/대기/중단:** 단위 목표인 최신 SHA CI 검증과 Edge 초기화 복구 **완료**. STEP3 전체 65~70% 비공식, 전체 7단계 동일가중 약38% 유지. STEP3 PR #3 **Draft/open/unmerged**, main 기능 미병합. 실제 사용자 PDF 및 Windows Edge/긴 문서 육안 수용 대기.
5. **오류/원인·시도·금지:** 실패 로그 Edge `DevTools listening` 표시 후 CDP WebSocket handshake timeout `35000ms`; 이전 성공 Edge 최초 연결 ~24초, CI 변동성 확인. D-Bus 경고는 확정 원인 아님. 동일 커밋에서 실패한 Edge 전수 회귀를 새 SHA의 **60초 제한**으로 성공시키며 재검증. 임의로 이 timeout을 계속 늘리거나 CI를 우회 성공 처리하는 방식 금지. Chromium 임시 프로필 cleanup `ENOTEMPTY`는 아직 간헐적 경고이며 사용자 데이터 손상 증거 아님.
6. **저장소/브랜치/SHA·경로:** `hibi89/astra_pdf_redesigner`, `feature/step3-pdf-import-20261019`, CI 검증 기능 SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976`; `tests/browser-process.mjs`, `tests/step3-image-recovery.test.ts`, `.github/workflows/ci.yml`. main 문서 저장 후 HEAD 재조회 필요. PR #3은 Draft 유지.
7. **Production/명령/환경:** 앱 로컬, Vercel/Production **미적용**. `npm install`, `npm test`, `npm run build`, `npm run dev` (`127.0.0.1:5173`). Actions Ubuntu Node22 Chrome+Microsoft Edge155, Poppler `pdfinfo`, `pdftotext`, `pdfimages`.
8. **원본·백업·인증/보안:** STEP1 localStorage v1, STEP2 IndexedDB v2 기존 문서 및 원본 `docs/blueprints/*.png`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`, 사용자 실제 PDF 수정·업로드 금지. Git 이력과 커밋 SHA로 기능 원상복귀 가능. 합성 픽셀/텍스트만 Actions 실행; 토큰 없음.
9. **다음 작업/기준/승인:** 다음 `ㄱ`에서 **복잡 이미지(마스크·반복/그룹/클리핑) 누락 경고 fixture 1단위 강화**. 재구성 품질/배치/글꼴은 실문서 원본과 육안 대조를 별도 수행. STEP3 main 병합 전 원본 손실 평가·최신 main/feature 병합 사전 검증·사용자 승인 필요. Windows 검증이 없으면 100%/상용 수용 완료 선언 금지.
10. **갱신 KST/검증 시점/기준:** 2026-10-19 10:48:52 KST, GitHub run #39186875371 `completed/success` (updated_at 2026-10-19T01:48:25Z)와 두 job 로그 및 PR Draft/HEAD 직접 확인. 기능 검증 코드 `aa63fc262d0a2db080be4be82bd91d7b4a5b3976`. 문서 HEAD는 최종 재조회로 확인.

## 2026-10-19 11:03:17 KST — STEP3 실제 클리핑 PDF 검증 1단위 인수인계
1. **목표·용도·확정 요구·기술:** 로컬 PDF 원문 추출/검수 → 재디자인 후 A4 출력. 콘텐츠 보존 우선, PNG 원본 동등성 비보장. React/TS/Vite/PDF.js/IndexedDB. 이번은 STEP3 클리핑 그래픽 차이의 무음 누락 방지와 실제 합성 PDF 시험.
2. **완료·변경·판단 근거:** 단순 무조건 PNG 복원으로 클리핑 영역이 달라질 수 있는 기존 문제에 대해 2안 비교: (A) 클리핑 경로 직접 크롭 재현(복잡/고비용/품질 리스크), (B) `clip/eoClip` 활성 상태 추적·원본 대조 경고(저비용, 기존 이미지 유지). B 적용. `src/step3/imageRecovery.ts` 그래픽 상태에서 클리핑만 보수적으로 추적하고 `problems`에 advisory 추가(미복원 이미지 숫자는 오염하지 않음). 이 구간에서 실제 크롭/클리핑 픽셀 재현은 하지 않음.
3. **테스트 명령·성공/실패·범위:** `npm test` **31 PASS/0 FAIL/0 SKIP**(이전29 +2), `npm run build` PASS. 실제 GitHub Actions [#39187963241](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39187963241) **SUCCESS** (코드 SHA `d0444b5138c29acebbe2d80ed187165a4dacd237`, 완료 2026-10-19 02:03:17Z). Linux Chrome와 Microsoft Edge155의 STEP1/2/3 E2E, 실제 합성 PDF에서 클리핑 경고/이미지 감지/미확정 DB 불변, 기존 2페이지 이미지 PDF 저장·재인쇄 회귀 PASS. Edge job `117854290424`, Chrome/build job `117854290640`; 각 로그 `PASS STEP3 CLIPPED XOBJECT PDF` 확인. Windows 실제 장문·이미지 출력/사용자 PDF 품질은 **미검증**.
4. **완료/진행/대기/차단·중단:** STEP3의 본 1단위 기능·테스트/CI **완료**, STEP3 전체 **미완료**. `feature/step3-pdf-import-20261019` [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) **open/draft/unmerged**, main 기능 병합 보류. STEP3 약65~70%, 전체 약38% 비공식 추정 그대로.
5. **오류·실패·원인·재시도/대안:** 금회 최종 CI 실패 없음. 기존 누락: clip operator 존재해도 이미지 PNG 복원에 크롭 차이 경고가 없었음. 적용 방식은 보수적 경고이므로 실제 부분 클리핑 없음에도 경고가 뜰 수 있음. 정밀 클리핑/투명도/벡터 복원은 전혀 검증되지 않으며, 픽셀 동일성을 주장하지 말 것. 이전 Edge CDP 실패는 `tests/browser-process.mjs` Edge 60초 변경과 구분, 이번 CI Edge/Chrome 모두 PASS.
6. **저장소·브랜치·SHA·주요 경로:** `hibi89/astra_pdf_redesigner`; 기능 검증 `d0444b5138c29acebbe2d80ed187165a4dacd237`. `src/step3/imageRecovery.ts`, `tests/step3-image-recovery.test.ts`, `tests/fixtures/step3-clipped-pdf.mjs`, `tests/step3-browser.mjs`. 이전 검증 SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976`. GitHub 연결 커미터 `hibi89` 확인. main STATUS/HANDOFF 문서 HEAD 별도로 확인.
7. **Production·Vercel·실행·환경:** Vercel/Production **미적용**(로컬 앱), `npm install`, `npm test`, `npm run build`, `npm run dev` → `http://127.0.0.1:5173`. Ubuntu GitHub Actions Node22 + Chrome + Edge155 + Poppler.
8. **원본·백업·인증·수정 금지:** STEP1 localStorage v1, STEP2 IndexedDB v2, 설계 PNG/TXT/로드맵, 실제 사용자 PDF 모두 보존·무변경. Git SHA 이력으로 기능 브랜치 수정 전 상태 복원 가능. 합성 PDF는 코드로만 생성, 실문서/토큰 외부 전송 없음. 기존 STEP1/2 기능 코드/main 배포 무변경.
9. **다음 작업 우선순위·절차·완료 기준·승인:** 다음 `ㄱ`은 STEP3 사용자 수용 준비를 위한 **새로운 PDF 품질/누락·원본-결과 대조 fixture 1단위**를 검증하고 근거 기록. 실제 사용자 PDF 5~10개와 Windows Chrome/Edge 인쇄·육안은 사용 가능한 원본/환경에서 별도 확인. main 병합은 최신 main+feature SHA 병합 사전검사 및 사용자 별도 승인 후. STEP4 선행 금지.
10. **일시·확인·문서 기준:** 2026-10-19 11:03:17 KST. GitHub CI run #39187963241 head_sha `d0444b5138c29acebbe2d80ed187165a4dacd237` / completed success, Chrome+Edge job 로그, PR Draft HEAD `d0444b5138c29acebbe2d80ed187165a4dacd237` 확인. STATUS/HANDOFF/BOOK 쓰기 후 GitHub SHA·재조회 검증. Linux E2E 증거 외 OS/실문서 미검증 구분.

## 2026-10-19 11:24:52 KST — STEP3 혼합 문서 원본 대조 E2E 최종 인수인계
1. **목표·용도·확정 요구·기술**: 로컬 PDF 업로드 → 원본 내용 보존·검수 → 테마 변경·A4 PDF 재출력. STEP3 단일 열 MVP에서 오차가 생기는 다단·표·이미지 혼합 PDF에 대해 실제 출력을 대조하는 수용 테스트 강화. React/TS/Vite, PDF.js, IndexedDB, headless Chrome/Edge, Poppler.
2. **완료·변경·결정 근거**: 2페이지 혼합 PDF fixture를 코드로 생성(2열 문장·벡터 격자 표·PNG 재구성 대상 이미지 1·13개 원본 마커). 픽셀/표 구조 동일성 평가는 재디자인과 충돌하므로 **원본/검수/재출력 13개 텍스트 식별자 정확성, raster 포함, A4, 원본 문서 불변**을 확인. 초기 다단 미경고를 발견해 `src/step3/structure.ts`에 PDF.js가 넓은 간격 텍스트를 합친 경우의 보수적 경고 휴리스틱만 보완. 기존 정상 데이터 흐름 유지.
3. **테스트 명령·성공/실패·미검증**: 첫 run [#39189111252](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189111252) **FAIL**(실제 Edge에서 다단 경고 누락). 최종 고정 기능 SHA `0c6061b40286d7a859d8505995ad253f48da9665`에서 [Actions #39189525347](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189525347) **SUCCESS**: `npm test` **32 PASS/0 FAIL/0 SKIP**, `npm run build` PASS, Chrome STEP1/2/3 및 Linux Edge155 STEP1/2/3 브라우저/이미지/문서 E2E 모두 PASS. 각 job 실제 로그에서 다단 경고 `column= true`와 `SOURCE/REPRINT COMPARISON` 13/13 확인. Windows 환경, 실제 사용자 PDF 품질 및 벡터 표 구조는 **미검증**.
4. **완료/진행/대기·중단 지점**: 단위 테스트 구현·회귀·기능 검증 **완료**. STEP3 자체는 **미완료**, Draft PR #3 **open/draft/unmerged**. STEP3 main 기능 병합 및 Windows 장문/이미지 출력·사용자 PDF 5~10개 수용 대기. 추정 STEP3 65~70%, 7단계 전체 약38% 유지.
5. **오류·원인·시도·재시도 금지·대안**: 분리된 좌/우 텍스트가 PDF.js TextItem 하나로 결합되는 경우 이전 좌표 기반 `reconstructLines`가 다단을 놓칠 수 있는 문제(합성 PDF의 실제 Edge 검증에서 경고 미발생). 넓은 행의 문자/실제 폭 차이 2건 이상 조건으로만 경고 보강, 자동 텍스트 재배열 금지. 정상 폭넓은 텍스트도 경고할 가능성 있음. 표 선·셀 원형 복원과 다단 정밀 배치는 별도 설계/수용 단계이며 현재 정확성 증거가 없다.
6. **저장소·브랜치·SHA·주요 경로**: `hibi89/astra_pdf_redesigner` / `feature/step3-pdf-import-20261019`; 테스트 검증 SHA `0c6061b40286d7a859d8505995ad253f48da9665`; 문서만 후속 feature 커밋 `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5`. `tests/fixtures/step3-mixed-layout-pdf.mjs`, `tests/step3-browser.mjs`, `src/step3/structure.ts`, `tests/step3-structure.test.ts`. 보고 `docs/STEP3_MIXED_SOURCE_REPRINT_ACCEPTANCE_2026-10-19.md`. main 문서 HEAD는 이번 인수인계 커밋 재조회로 확인.
7. **Production·Vercel·명령·환경**: Vercel/Production **미적용**(로컬 웹앱), `npm install`, `npm test`, `npm run build`, `npm run dev` (127.0.0.1:5173). GitHub Actions Ubuntu Node22, Chrome, Linux Edge155, `pdfinfo`/`pdftotext`/`pdfimages`.
8. **원본·백업·인증·수정 금지**: 이전 기능 SHA `d0444b5138c29acebbe2d80ed187165a4dacd237` 복구 기준, Git history 보존. STEP1 v1 localStorage·STEP2 v2 IndexedDB, 원본 로드맵 및 PNG, 사용자 실제 PDF·개인정보·토큰 접근/수정/공개 금지. 새 테스트는 완전 합성 데이터만 쓰고 브라우저 격리 프로필로 검사.
9. **다음 작업 우선순위·절차·완료 기준·승인**: 다음 `ㄱ`은 PDF 실물 수용 품질을 위한 **열/표/벡터 정보의 보존 불가 경고·원본-결과 비교 측정 단위**를 하나씩 확장. 최종 사용자 실문서 5~10개는 사용자 원본을 확보한 승인된 로컬 환경에서 검수, 공개 GitHub 업로드 금지. STEP3 main 병합 전 최신 main/feature SHA 격리 병합 사전검사와 사용자 명시 승인 필요. Windows 수동 검수는 계속 NOT RUN으로 구분.
10. **갱신·확인 시각/검증 범위/기준 커밋**: 2026-10-19 11:24:52 KST; 기능 SHA `0c6061b40286d7a859d8505995ad253f48da9665`의 CI #39189525347 종료 2026-10-19T02:22:57Z, 두 job 실제 로그 검증; 문서-only feature SHA `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5` GitHub 커밋 확인(2026-10-19T02:24:52Z). 이 문서 수정 후 main SHA·중앙 BOOK SHA를 재조회해야 완료. CI 성공은 13마커·한 raster 합성 케이스에 한정, 상용 품질/Windows 수용 아님.

## 2026-10-19 13:27:43 KST — STEP3 벡터 표 구조 손실 위험 계측 1단위 인수인계
1. **확정 목표/요구/기술:** 로컬 PDF 원문 보존·확인·스타일 재구성. PDF.js/React/TS/Vite/IndexedDB. 이번은 표·도형 등 벡터 명령의 구조 손실 위험을 수치·경고로 보여주는 검사(벡터 구조 자동 재구성 아님). STEP1/2 및 사용자 원본 보존.
2. **완료 구현·선택 이유:** 원본 경로를 벡터 좌표로 완전 복원하는 고난도 방식 대신 PDF.js 경로 관련 operator **근사 건수**를 페이지별/전체 UI에 보고하여 손실 검수로 연결. `src/step3/vectorRisk.ts` 경로 관련 `constructPath` 묶음 우선/일반 stroke-fill 명령 fallback, `pdf.ts` 추출, `structure.ts` 경고 및 count, `ImportPanel.tsx` 총합·페이지별 표시. 도형/셀 개수·보존율이라고 주장하면 안 됨. UI 및 검사 외 데이터 변환·복원 알고리즘 변경 없음.
3. **실제 성공/실패·테스트 근거:** 최초 SHA `c1873cb73acd4f43a13b11d32aa735ddacfa9b1e`의 [Actions #39198865094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39198865094) **FAIL**(Node35/35·build PASS, Chrome/Edge 모두 원본 벡터 경로 0으로 E2E FAIL). 원인: PDF.js 경로의 최적화 `constructPath`를 기존 단순 stroke/fill 계수가 놓침. 수정 후 **코드 SHA `f132adbeb70ea43c38cecfb3841b36cbd773951b`**, [Actions #39199224379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39199224379) `completed/success`, Node35/35·TS/Vite·Chrome/Edge155 STEP1~3 E2E 전체 PASS. 두 job에서 `PASS STEP3 MIXED VECTOR RISK` 원본 관련 명령 **3회**, `PASS STEP3 SOURCE/REPRINT COMPARISON` 원본 13/13 텍스트·A4 raster·기존 문서 보호 확인.
4. **완료/대기/진행률/중단:** 이 **한 단위 코드·CI 완료**, STEP3 전체는 미완료. 기능 `feature/step3-pdf-import-20261019`, [PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) draft/open/unmerged, main STEP3 미병합·허가 없이 통합 금지. STEP3 비공식65~70%, 전체7단계 약38% 추정 유지. STEP4 미착수.
5. **실패 원인·재시도 전략:** 처음에는 paint command만 셌고 optimized path batches를 누락. 두번째는 `constructPath` 묶음 존재 시 묶음 수, 그렇지 않으면 paint op 수라는 **대안 방법**으로 성공. 수치가 도형·셀·선 수와 1:1 대응하지 않는 사실 명시. unsupported clipping, mask, rotate, annotations/OCR 및 표 원형 복원의 실패 가능성을 이 지표 하나로 확정 판정하지 말 것.
6. **저장소·브랜치·커밋·경로:** `hibi89/astra_pdf_redesigner`, CI 검증 `f132adbeb70ea43c38cecfb3841b36cbd773951b`; feature 보고서 docs-only 커밋 `63f43b1b94730a6a3e5d8e9232035a96157c20ae` (성공 CI 대상 아님). `src/step3/{vectorRisk,pdf,structure,ImportPanel}`, `tests/step3-vector-risk.test.ts`, `tests/step3-browser.mjs`, `docs/STEP3_VECTOR_STRUCTURE_RISK_VALIDATION_2026-10-19.md`. main STATUS/HANDOFF 최신 SHA는 저장 후 재조회.
7. **실행·CI 환경·배포:** `npm test` 35/35, `npm run build`, GitHub Actions Linux Chrome/Edge 155 headless with Poppler `pdfinfo/pdftotext/pdfimages`. Local `npm run dev` on 127.0.0.1:5173. No Vercel/Production deployment. Windows 실환경 브라우저 PDF 출력/육안 수용은 **NOT RUN**.
8. **원본·백업/인증·보안:** Git SHA `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5`는 금회 변경 전 feature HEAD. STEP1/2 저장소/사용자 실제 PDF/디자인 설계 PNG·TXT·원본 데이터 및 토큰 미변경·미출력. 합성 fixture만 테스트하고, 실제 사용자 PDF 공개 GitHub 업로드 금지. 원본 로컬 문서 무손상·검수 전 저장 방지 기존 테스트 유지.
9. **다음 `ㄱ` 작업·수용 기준·승인:** 경고 **오탐 또는 누락 위험**이 있는 합성 사례(텍스트 전용·이미지 전용·단순 장식·표 선)를 분리해 검사하고 UI 검수 항목/원본 대조 정확성 보완. 실제 사용자 PDF 5~10개는 보안이 확보된 사용자 승인 로컬 환경에서 검사. STEP3 main 병합 전 최신 main+feature 검증, Windows 실제 출력 검증과 별도 사용자 승인이 필요. 임의 본병합/STEP4 진행 금지.
10. **인수 일시·검증 범위:** 2026-10-19 13:27:43 KST. 검증 run #39199224379, head_sha `f132adbeb70ea43c38cecfb3841b36cbd773951b`, finish 2026-10-19T04:26:04Z, 두 job 결과/로그 직접 확인. docs-only SHA `63f43b1b94730a6a3e5d8e9232035a96157c20ae`. STATUS/HANDOFF와 project-book BOOK 최신 p5 행은 업데이트·재조회 필요. 완료 표기는 **경로 위험 계측 단위**, 실제 상용 PDF 표 복원 품질 아님.

## 2026-10-19 13:48:10 KST — STEP3 클립 오탐 제거·검수 4항목 인수인계
1. **제품 목표·요구·기술:** 기존 로컬 PDF 가져오기→원문·이미지·표/벡터 위험 감지→원본 대조 후 재디자인 A4. 콘텐츠 보존 우선. React/TS/Vite/PDF.js/IndexedDB, 외부 API 없음, STEP3 Draft PR #3.
2. **선택·구현:** PDF.js `constructPath`가 실제 표 선뿐 아니라 클리핑 마스크를 표현할 수 있음. 클리핑 전용 경로의 불필요한 '표/벡터 구조 위험' 오탐을 줄이되, 진짜 벡터 페인트의 경고는 유지. `src/step3/vectorRisk.ts`의 선행 `clip/eoClip` 및 후행 `clip/eoClip` 판별, 명시 페인트 있는 경우 보수적으로 집계. `src/step3/ImportPanel.tsx`의 네 부문 원본 대조 **안내** 체크리스트(항목별 확인 증빙은 아님).
3. **실패·실제 원인:** [Actions #39200328670](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200328670) `SyntaxError`(test quoting); [#39200525378](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200525378) clip-only 파일에서 벡터 1회 오탐; [#39200817859](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200817859)에서 진짜 PDF.js 명령 배열 확인: **`clip > constructPath`**. 기존 테스트 가정 `constructPath > clip`과 달랐음. 실제 PDF.js fixture 검증으로 원인 확정 후 최소 수정. 같은 추측 기반 반복 재시도 금지.
4. **자동 테스트·성공/미검증:** 최종 코드 SHA **`90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee`**, [#39200950625](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200950625) `completed/success`, Node **38 PASS·0 FAIL·0 SKIP**, TypeScript/Vite build PASS, Chrome 및 Linux Edge 155 STEP1/2/3 브라우저 회귀 PASS. clip-only 합성 0회·이미지 경고 유지, mixed 2page synthetic raster+vector 3회, 원본↔새 A4 텍스트 13/13, 문서 저장 전 무변경/기존 문서 보존. **Windows/고객 실제 PDF·픽셀 대조 미검증**.
5. **완료·대기·정지 지점:** 이번 1단위 구현/자동 CI **완료**, STEP3 전체 기능 **미완료**, PR3 Draft/open/unmerged, main STEP3 미병합. STEP1/2 기능·로컬 사용자 원본 수정 없음. STEP3 약65~70%, 전체7단계 약38% 비공식 추정.
6. **저장소·브랜치·SHA·경로:** `hibi89/astra_pdf_redesigner`, `feature/step3-pdf-import-20261019`, 검증 코드 `90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee`, feature 후속 문서 SHA `d1a89d8b6a96f72225208e5a9b1144e5413eaa92`. `src/step3/vectorRisk.ts`, `src/step3/ImportPanel.tsx`, `tests/step3-vector-risk.test.ts`, `tests/step3-browser.mjs`, `docs/STEP3_VECTOR_CLIP_FALSE_POSITIVE_AND_REVIEW_2026-10-19.md`. STATUS/HANDOFF 본 main 문서 HEAD는 저장 후 재조회.
7. **실행 환경·배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` on 127.0.0.1:5173. GitHub Actions Ubuntu Node22, Chrome+Edge155, Poppler PDF 점검. Vercel/Production 미적용. Windows 실사용 Edge/Chrome PDF 출력/키보드/장문 수용 **NOT RUN**.
8. **데이터/보안·원상복귀:** 사용자 PDF 업로드 없음; synthetic fixture만 Node/브라우저에서 동작. STEP1 localStorage v1·STEP2 IndexedDB v2·설계 PNG/TXT·STEP3 원본 기능·토큰 변경/노출 없음. `63f43b1b94730a6a3e5d8e9232035a96157c20ae`는 이 단위 이전 feature HEAD이며 Git SHA로 이력 비교/복구 가능.
9. **다음 한 단위·수용 기준:** clip+stroke/fill/투명도·PDF.js 최적화 조합에서 과잉 제외/누락 경계 테스트, 일반 텍스트/이미지 정상 사례 부작용 검증. 실문서 5~10개는 보호된 승인 로컬 환경에서 원본↔출력 수동 대조(문장/수치/표/이미지/순서) 별도. main 병합 전에 현재 main/feature 병합 사전 검증과 사용자 명시 승인. STEP4 무단 선행 금지.
10. **확인 시각·근거:** 2026-10-19 13:48:10 KST; run #39200950625 2026-10-19T04:46:15Z 최종 성공·코드 SHA 일치·두 job 로그 확인. 완료 판정은 **합성 PDF의 벡터 클립 오탐 단위와 UI 대조 안내**에만 적용, 실제 표/그래픽 완전 복원이나 상용 품질 인수 아님.

## 2026-10-19 14:06:12 KST — STEP3 실제 혼합 클립+페인트 경로 판정 인수인계
1. **사용자 목표·확정 범위·기술:** PDF 로컬 업로드→추출/원본 대조·수정→테마 재구성→A4 저장. 문장·숫자·이미지·표 내용 보존 우선. `pdfjs-dist 6.4.299`, React/TS/Vite, IndexedDB. 사용자 로컬 PDF 외부 업로드/자동 요약 금지, STEP3 Draft 단계.
2. **완료 구현·비교한 접근:** 단순 클립 인접 여부만으로 `constructPath`를 제거하던 방식은 동일 경로 `W S`의 실제 벡터 선을 누락. 이웃 연산자를 모두 위험으로 계산하면 클립-only 오탐 재발. 따라서 **실제 `OperatorList.argsArray[i][0]` packed terminal op**를 활용: `OPS.endPath`는 비페인팅, `OPS.stroke/fill`은 clip 동시 적용에도 그리기 위험으로 집계. 패킹 정보가 없는 경우 이전 보수적 추론 fallback. 산출 수치는 복원율/표 셀 수가 아니며 변환 출력에 벡터 선을 재구성하지 않음.
3. **실패·원인·수정·테스트:** [CI #39202071379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202071379) 실제 PDF.js 합성 테스트 **38/39 PASS, W S 누락 FAIL**. [CI #39202172463](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202172463) 실제 실패 연산자 `clip > constructPath` 확인: `W n` `args[0]=28(endPath)`, `W S` `args[0]=20(stroke)`. 하드코딩 20/28 금지, `OPS` 상수 사용. 최근 최종 코드 SHA **`4b527401cc8bdba9218b9aba4fca5537e24c77cc`**, [#39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889) **완료·SUCCESS** Node **40/40·빌드·Chrome/Edge 155 STEP1~3 전체 PASS**. 실제 각 로그에 클립-only 0, clip+stroke 위험 양수, 2p 표 3, 13개 텍스트·이미지·A4·기존 DB 보존 확인.
4. **완료/대기/중단 지점:** 본 한 단위 기능+회귀 검증 **완료**. STEP3 전체 및 사용자 수용 **미완료**, `feature/step3-pdf-import-20261019` [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/unmerged, main STEP3 기능 미병합, STEP4 착수 금지. 진행률 비공식 STEP3 65~70%, 전체 약38% 유지.
5. **테스트 경계/위험·금지:** PDF.js의 최적화 Form XObject, transparency, 합성 clip/paint, 벡터 폰트·실표 구조, 픽셀 동일성, 다단 실제 내용 순서, Windows Chrome/Edge 수동 인쇄, 사용자 실제 PDF 5~10개 **미검증**. 검증은 합성 fixture 6종/packed terminal+브라우저 회귀까지만. 같은 누락 재발 시 추측성 명령 카운트를 늘리기보다 실제 `argsArray`와 공식 pdf.js 소스부터 확인.
6. **경로·커밋·브랜치:** `hibi89/astra_pdf_redesigner`, 기능 검증 `4b527401cc8bdba9218b9aba4fca5537e24c77cc`, 보고 docs-only SHA `90b7e995f263701e57aede91a8bf0e44b2778d80`. `src/step3/vectorRisk.ts`, `tests/step3-vector-risk.test.ts`, `tests/fixtures/step3-clipped-pdf.mjs`, `tests/step3-browser.mjs`, `docs/STEP3_MIXED_CLIP_AND_PAINT_RISK_VALIDATION_2026-10-19.md`. main STATUS/HANDOFF 문서만 별도 갱신·재조회, BOOK p5까지 동기화.
7. **환경·배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` (127.0.0.1:5173). Actions Ubuntu Node22 Chrome+Edge155+Poppler. 로컬 도구, Vercel/Production 배포 없음. CI head SHA `4b527401cc8bdba9218b9aba4fca5537e24c77cc` 확인, docs commit은 CI 이후(성공 CI 범위 아님).
8. **원본/백업/보안:** STEP1 localStorage v1, STEP2 IndexedDB v2, 사용자 PDF/토큰/설계 원본 PNG·TXT 미변경. 테스트는 완전 합성 오프라인 PDF만 생성. Git 이력에서 전단계 `d1a89d8b6a96f72225208e5a9b1144e5413eaa92` 및 현 `4b527401cc8bdba9218b9aba4fca5537e24c77cc`로 비교/복원 가능. 원본 PDF 외부 공개 금지.
9. **다음 한 단위와 완료 기준/승인:** 투명도·Form XObject와 clip+paint 혼합 시 PDF.js 경고 누락/오탐을 실물 합성 PDF로 확장하거나, 실제 PDF 사용자 수용 기준을 마련. 성공 시 Node·빌드·Chrome/Edge 회귀 실제 검증 근거와 경고 한계를 기재. STEP3 main 병합/STEP4는 최신 SHA 병합 사전 검증과 사용자 명시 승인 전 금지. Windows·고객 5~10 문서 검수는 별도.
10. **최종 확인 시각:** 2026-10-19 14:06:12 KST, [Actions #39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889) `completed/success` at 2026-10-19T05:04:16Z, two jobs log inspection. 이 인수인계의 완료 범위는 '동일 경로 W S 누락 방지 검증'이며 제품 완성/상용 품질이 아니다.

## 2026-10-19 14:19:35 KST — STEP3 투명도·Form XObject 검증 1단위 인수인계
1. **제품 목표/스택:** 브라우저 로컬 PDF 업로드→원본 텍스트·이미지·표/벡터 및 합성 리스크 표시→사용자 원본 대조·수정→디자인 PDF A4 재조판. React/TypeScript/Vite, PDF.js 6.4.299, IndexedDB. 원문 자동 수정/외부 업로드 금지.
2. **선택·기능:** 투명도가 포함된 Form의 원본 픽셀을 정밀 복제하는 A안은 구현/성능/품질 위험 크므로, **우선 위험 계측·검수 고지 B안** 적용. `src/step3/graphicsRisk.ts`에서 PDF.js `setGState`의 `CA/ca<1`, 비Normal BM, SMask 활성, beginGroup, Form begin 범위 합산 (투명 신호와 Form 범위 분리). `pdf.ts`/ `structure.ts` 경고 및 `ImportPanel.tsx` 총합·체크리스트. 원본 alpha를 PNG에 합성하거나 Form 변환을 1:1 재현하지 않음.
3. **검증 근거/실패:** 이번 단위 신규 실패 없음. `tests/fixtures/step3-transparency-form-pdf.mjs` 실제 1p A4 synthetic Form 내부 bitmap+vector, alpha0.4 transparency group vs alpha1 opaque form. 실제 operator probe commit `67646c0d4233df350b78c36f5e7d7de69ba3c424`, Actions [#39203296609](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203296609) **SUCCESS**; 기존 코드를 보존하고 이를 바탕으로 변경. 코드 SHA `1ebbb7958c477c309e22e24fed7255658f56b58b`, Actions [#39203639740](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203639740) **SUCCESS**, Node **43/43 PASS**, build, Chrome/Edge155 STEP1~3 전체 PASS. 투명 Form 위험신호3/Form1, 불투명 Form 위험0/Form1. 이미지/벡터/13 marker 원본→출력·DB 기존 정상 회귀 유지.
4. **진행/대기/중단:** 이 단위 구현·자동 CI **완료**, STEP3 전체·실사용 인수 미완료. [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/unmerged, main STEP3 기능 병합 안 함, STEP4 착수 금지. 비공식 STEP3 약65~70%, 전체 7단계 약38% 유지.
5. **오류·위험·판정 경계:** PDF.js Graphics State와 XObject는 flattened operator 단계의 보수적 신호이며 투명 이벤트 수·Form 범위 수는 투명한 객체/표 셀/정확히 복원한 픽셀 수가 아님. 독립 Form/투명 그룹 합성이 새 PNG에서 유지되는지는 미검증. 출력 색·Blend/SoftMask·XObject nesting/annotation, Windows 실기, 실제 PDF 5~10개 수용 **NOT RUN**. 위험 0도 동등성/완전성 보증 금지.
6. **저장소/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner`, feature `feature/step3-pdf-import-20261019`, **CI 검증 코드 SHA `1ebbb7958c477c309e22e24fed7255658f56b58b`**, 후속 문서만 feature commit `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`. `src/step3/{graphicsRisk,pdf,structure,ImportPanel}`, `tests/fixtures/step3-transparency-form-pdf.mjs`, `tests/step3-transparency-form.test.ts`, `tests/step3-browser.mjs`, 보고 `docs/STEP3_TRANSPARENCY_FORM_RISK_VALIDATION_2026-10-19.md`.
7. **운영/환경/명령:** `npm install`, `npm test`(43/43 CI 성공), `npm run build`, `npm run dev` 로컬 127.0.0.1:5173. GitHub Actions Ubuntu Node22 Chrome+Edge155, Poppler. Vercel/Production 배포 없음. Chrome run job `117901675059`, Edge job `117901674699` 원본 로그에서 두 비교 PASS 확인.
8. **원본·보안·복구:** STEP1 localStorage v1, STEP2 IndexedDB v2·설계 원본 PNG/TXT 및 실제 사용자 PDF/민감정보·토큰 노출/수정 없음. 합성 데이터만 CI 사용. Git SHA `90b7e995f263701e57aede91a8bf0e44b2778d80`는 이 단위 전 기준; 비교/복구 가능. main 기능 파일 무변경·원본 문서 검수 전 저장 금지 회귀 유지.
9. **다음 한 단위·승인:** 중첩 Form/투명 SoftMask/Blend 실제 합성 PDF가 위험 수치를 감지하는지 확인, 필요 시 최소 코드만 수정하고 전수 회귀. 또는 고객 PDF는 사용자 동의·로컬 비공개 환경에서 실문서 5~10개와 Windows PDF/인쇄 육안 검수. 기능 main 병합 전 최신 main+feature 사전검사 및 사용자 **별도 명시 승인** 필요.
10. **갱신/검증 기준:** 2026-10-19 14:19:35 KST; #39203639740 `completed/success` at 2026-10-19T05:18:05Z head_sha `1ebbb7958c477c309e22e24fed7255658f56b58b`. 새 기능과 CI PASS만 완료 표기. feature docs-only SHA `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`는 CI 이후 작성한 보고서. main STATUS/HANDOFF/BOOK.md 쓰기·재조회 후 최신 HEAD 확정 필요.

## 2026-10-19 20:06 KST — Windows 설치 Electron 동시 업그레이드 인수인계

1. **범위:** 격리 브랜치 `codex/p5-windows-reliability`; 제품 IndexedDB schema version은 변경하지 않았다. 실제 NSIS 설치판/합성 데이터 검증은 GitHub Windows runner에서만 진행했다.
2. **구현:** `desktop/step2-versionchange-acceptance.cjs`는 이미 연결된 v2 렌더러와 잠금 대기 중인 두 번째 렌더러를 같은 Electron 기본 session에서 실행하고, 두 번째 렌더러의 v2→v3 합성 업그레이드를 검증한다. `desktop/main.cjs`는 CI 전용 flag일 때만 이 검증을 실행한다.
3. **보존 조건:** 업그레이드 전후 기존 모든 object store의 저장값을 deep compare한다. 문서, Blob PNG bytes 및 metadata, `migrationAudit`, `activeDocumentId`, 기존 화면의 텍스트/이미지 유지, 구 화면 편집 비활성화, 무차단 업그레이드를 확인한다.
4. **임시 자료 안전:** `tests/windows-installer-version-upgrade.ps1`는 비어 있는 `RUNNER_TEMP` profile만 소유하고 실행 전 기존 경로를 거부한다. 테스트 후 지정된 단일 child path이며 reparse point가 아닌지 확인한 뒤 재귀 정리, 잔류 검사까지 수행한다. CI 로그에서 profile cleanup PASS 확인.
5. **로컬 검증:** Node 19/19 PASS, TS/Vite build PASS, `desktop:verify` 7/7 PASS, PowerShell parser PASS. Electron 동시 renderer 실행은 CI/GitHub Actions에서만 가능하도록 제한되어 로컬 Windows 설치 EXE 검증으로 보고하지 않는다.
6. **원격 증거:** 코드 SHA `cc7495fb1ccaf68277f884a9533d988785c8c0d4`. [Chrome/Edge Actions #39241620449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39241620449) SUCCESS; [Windows installer Actions #39241620515](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39241620515) SUCCESS. Windows 로그는 installed v1→v2 migration 이후 `blocked=0`, 이전 store/document/PNG bytes/meta/active ID preservation, read-only recovery mode 및 profile cleanup을 직접 출력했다.
7. **PR:** [Draft PR #7](https://github.com/hibi89/astra_pdf_redesigner/pull/7), base `test/windows-idb-v2-installed-upgrade`, open/draft/unmerged. PR #3~#6과 main 미변경. 제품 배포 없음.
8. **남은 한계:** Windows Server 2025 합성 프로필 결과만 있다. 일반 사용자 Windows 10/11, 실사용 문서, 전원 장애, 서명·SmartScreen, 실기 설치 환경은 미검증. 로컬 cross-profile PDF 텍스트 검증은 Poppler `pdftotext` 미설치 한계가 이전 기록대로 남고 Ubuntu CI 교차 프로필은 PASS다.
9. **다음 작업:** PR #7 CI 증거/변경 검토가 1순위. 사용자 데이터 사용, PR/main 병합, STEP4 착수는 별도 승인 전 금지.
10. **문서 상태:** 이 기록을 포함한 docs-only 커밋 SHA는 검증 후 확정한다. Actions는 코드 SHA 기준이며 후속 문서 커밋과 구분한다.


## 2026-10-19 — Windows 설치판 실험: IndexedDB v1→v2 마이그레이션 검증
- 별도 Draft [PR #6](https://github.com/hibi89/astra_pdf_redesigner/pull/6), `test/windows-idb-v2-installed-upgrade` (PR #4 Windows 설치판에서 분기). **main / PR #4 / PR #5 수정 없음, 병합 금지**.
- [Windows Actions #39223771185](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39223771185) **completed/SUCCESS**, 검증 기능 SHA `0e5198341d4a708af20a3be3c481f058fecbfaf2`. Windows EXE 0.1.0(IDB v1)로 STEP2 합성 문서/PNG 저장, **재빌드한 0.1.1(IDB v2)** NSIS 설치판으로 같은 경로 덮어 설치; DB version 2·`migrationAudit` 생성·문서/PNG/active ID/캡션 보존, 설치판 제거까지 실제 CI 로그 PASS.
- v2 코드는 Windows CI 작업 중 임시로 적용·빌드됨. Git 브랜치 제품 소스는 v1 유지하며 PR #5의 additive schema patch와 동일 형태. 브라우저 롤백 검증 [#39222517425](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39222517425) 별도 성공.
- **미검증:** 일반 사용자 Windows 10/11 설치판, 실고객 문서, 코드 서명/SmartScreen, 비정상 전원종료 복구 및 장문 PDF 육안. unsigned 설치 artifact는 7일 한정 테스트용. 상세 `docs/WINDOWS_IDB_SCHEMA_V2_INSTALLED_UPGRADE_2026-10-19.md`.
- **다음:** 해당 성공을 제품 main 병합 승인으로 간주하지 말 것. PR #4/#5/#6 모두 Draft 그대로, STEP4 금지.

## 2026-10-19 — IndexedDB 업그레이드 충돌 복구 인수인계

- 현재 브랜치 `codex/p5-windows-reliability`, 코드 SHA `0080272b7a1a2b306f911532c0e217f3e215df27`; 기준 원격 테스트 ref는 `e2f767d87f1657f6fdecdee0457b223f285823f0`. Draft PR #7은 `test/windows-idb-v2-installed-upgrade` 대상이며 open/unmerged 상태다.
- 주요 변경: `src/step2/idb.ts`가 versionchange 때 연결을 닫고, 이미 blocked로 거부된 open 요청의 늦은 성공도 닫는다. 더 높은 DB 버전에서 구버전 앱이 초기화/쓰기 경로로 진입하지 않고 안내를 보인다. `useWorkspace.ts`는 편집 잠금을 풀고 읽기 전용으로 멈추며 미저장 변경 경고를 유지한다.
- `tests/step2-versionchange.mjs`는 합성 문서·PNG와 임시 프로필로 경쟁 v1→v2 업그레이드, 저장 데이터/이미지 bytes/메타데이터/active ID, 같은 버전 재오픈, versionchange 트랜잭션 abort rollback, 재시작 후 더 높은 버전 안내, 재시도, blocked 후 늦은 성공 핸들 정리 및 다음 업그레이드를 확인한다. Chrome·Edge 로컬 모두 PASS; profile cleanup PASS.
- 결과: `npm test` 19/19, `npm run build`, `npm run desktop:verify` 6/6 PASS. Chrome·Edge Actions #39239803359 attempt 2와 Windows 설치판 Actions #39239803360 모두 SUCCESS. 최초 Edge attempt 실패는 CDP 연결 일시 실패이며 같은 run 재시도 성공으로 기록했다.
- 로컬 `tests/step2-cross-profile.mjs`는 마지막 PDF 텍스트 검사에서 `pdftotext` 누락으로 중단했다. Ubuntu Actions 전체 Chrome 교차 프로필 검증은 PASS다. 추후 로컬 재실행이 필요하면 Poppler `pdftotext`가 있는 환경에서 기준을 유지해 실행한다.
- 다음 우선순위: Draft PR #7 검토 대기. 필요 시 다른/손상된 외부 연결 환경을 추가로 점검하되 제품 schema bump는 별도 요구가 있기 전 하지 않는다. 실제 일반 사용자 설치판/전원 장애 검증은 미완료로 유지한다. PR #3~#6 및 main 병합, STEP4 착수 금지.

## 2026-10-19 20:28 KST — 미저장 초안 versionchange 후속 검증

1. **범위/브랜치:** `codex/p5-windows-reliability`, 코드 커밋 `9fbf467a7d7bfe1ecd84611298094595197e626f`. Draft PR #7은 base `test/windows-idb-v2-installed-upgrade`; main 및 PR #3~#6 미변경, STEP4 미착수.
2. **구현:** `desktop/step2-versionchange-acceptance.cjs`에 미저장 초안 시나리오 추가. 합성 marker를 편집기에 입력하고 React 미리보기에도 반영되는지 확인한다. 450ms autosave만 테스트 중 지연시키며 native 타이머를 보존, `finally`에서 예약된 테스트 타이머를 취소하고 기존 `window.setTimeout` descriptor를 복원한다.
3. **저장 전·후 경계:** 경쟁 업그레이드 직전 snapshot이 baseline과 같고 marker가 DB에 없음을 확인. v2→v3 완료 뒤 초안이 화면에 남고 편집기가 disabled, 저장 칩이 `저장 실패`, 미저장 타이머 callback은 실행되지 않았는지 확인한다. 기존 모든 store·문서·PNG bytes·metadata·active ID deep compare도 유지한다.
4. **한글 검사:** `저장 중`, `저장 실패`, versionchange 안내 문자열을 `src/step2/useWorkspace.ts`와 비교했다. UTF-8 file bytes/text와 Unicode codepoints가 정상 일치하며 손상은 없다. 터미널 렌더링 인코딩 차이로 판정.
5. **로컬 검증:** `node --check desktop/step2-versionchange-acceptance.cjs` PASS, `git diff --check` PASS, `npm test` 19/19 PASS, `npm run build` PASS, `npm run desktop:verify` 7/7 PASS. 빌드에서 사전 존재하던 dynamic/static import 경고가 표시되었으나 빌드는 성공했다.
6. **원격 검증:** Windows 설치/업그레이드 workflow [#39244383974](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39244383974) SUCCESS; Windows Server 2025 NSIS 설치판의 v1→v2 설치와 v2→v3 경쟁 renderer, 미저장 초안 보존, 기존 DB 값, profile cleanup 확인. Chrome/Edge workflow [#39244384031](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39244384031) 두 job SUCCESS.
7. **오류/복구:** 이 단위에서 테스트 실패 없음. 최초 sandbox 내 커밋은 `.git/index.lock` 생성 권한 거부; 사용자 요청된 단일 파일만 권한 검토 실행으로 커밋한 뒤 지정 브랜치 push 성공. 다른 미추적 파일은 보존했고 커밋하지 않았다.
8. **PR/운영:** PR #7 open/draft/unmerged. Actions artifact는 unsigned test installer로 7일 보관; 제품 배포 없음.
9. **미검증:** 실제 Windows 10/11, 사용자 설치/데이터, 전원 장애, 서명/SmartScreen, 실제 고객 문서. 로컬에서 설치 EXE 시나리오를 실행하지 않았으며 Windows Actions에서 합성 프로필로 실행했다.
10. **다음 우선순위:** PR #7 Draft에서 코드 및 CI evidence를 검토하고 사용자 환경 검증 계획을 수립한다. 승인 없이 병합·STEP4 착수 금지.
