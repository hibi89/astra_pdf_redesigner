# STATUS — Astra PDF Redesigner

## 2026-10-29 — STEP3 Electron 원본 Blob 렌더 수정

- 기능 SHA `a9404c0743470147dc7cd9228e629787f9ae347f` (`integration/astra-commercial-core`, PR #9 Draft/unmerged). 사용자 데이터·V2 schema·8개 디자인 불변.
- 원인: Windows installed acceptance 진단에서 Electron `astra:` renderer의 Blob URL `fetch()`가 `Failed to fetch`로 실패해 source canvas가 비어 있었다. STEP3 원본 검수 및 STEP2 원본 대조에 세션 메모리의 원본 `Blob`을 PDF.js에 직접 전달한다. Blob을 IndexedDB/schema에 기록하지 않는다.
- 로컬 검증: `npm test` 68/68 PASS, `npm run build` PASS, `npm run desktop:verify` 14/14 PASS, `node --check desktop/step3-project-acceptance.cjs`와 `git diff --check` PASS. `npm run desktop:smoke`는 Electron 바이너리 다운로드 `fetch failed`로 SKIP.
- CI: `a9404c0` Windows #40823559986의 설치형 STEP3 가져오기·원본 대조·수동 복구 텍스트의 A4 native PDF 출력 PASS. 같은 exact-SHA에서 STEP4 동일 문서 비교/적용/undo, 기존 디자인 8종 PDF 8/8, M09-D 취소/재선택/late-result 무시도 PASS. 전체 Windows run은 이후 별도 0.1.0→0.1.1 upgrade baseline 생성 시 Electron startup failure `{}`로 FAIL; STEP3/4 설치 수용 단계는 완료됐다. Chrome/Edge #40823560131은 진행 중.
- 실제 사용자 PDF/물리 인쇄 및 로컬 Windows GUI 미검증. 7단계 완료율 약 45%; 복잡 PDF 수용이 남고, STEP5 미구현·STEP6 승인대기·STEP7 부분. 80% 미달, 출시/판매 NO-GO.

## 2026-10-29 — STEP3 복구·원본 대조 기능 확장

- 최신 코드 SHA `ef4eb63df686157196a96079df0680f701bedc6c` (`integration/astra-commercial-core`, PR #9 Draft/unmerged). 기존 사용자 저장 데이터와 V2 스키마, 원본 roadmap, STEP4 8개 디자인은 변경하지 않았다.
- 이번 기능: 추출 텍스트/복원 이미지에서 원본 페이지와 추정 위치로 이동, 원본 패널 자동 노출 및 대조 문맥(텍스트/이미지) 표시, 누락 텍스트 수동 추가·수정·삭제·정렬·실행취소/다시실행, 빈 블록 저장 방지와 수정 후 동의 재확인. Windows 설치 앱 회귀는 이를 통해 만든 텍스트가 저장된 프로젝트 미리보기 및 native A4 PDF에 실제 나타나는지 확인하도록 확장했다.
- 결함 수정: STEP3 브라우저/설치형 검수가 React 수동 블록 렌더 이전 DOM을 조회하던 테스트 경합을 렌더 대기 방식으로 고침. PDF.js 원본 위치를 빠르게 재선택할 때 취소된 렌더와 새 렌더가 canvas를 동시에 사용하는 충돌을 직렬화해 방지.
- 로컬 검증: 최신 소스 기준 `npm test` 68/68 PASS, `npm run build` PASS, `npm run desktop:verify` 14/14 PASS (`ef4eb63` 소스 변경 후 test/build/diff-check PASS). TypeScript/Vite의 기존 동적/정적 import 청크 경고만 출력.
- CI: `ef4eb63` exact-SHA Chrome/Edge #40822093641 SUCCESS. Browser logs confirm source text/image jumps, missing-text recovery, undo/redo, theme/reload/A4 output, cancellation, retry, and late response handling all pass. Windows #40822093651 and latest code `f8cb21c` #40822208336 both FAILED at installed STEP3 source text location timeout. Same timeout appeared at `a850518` #40821833694; earlier Windows #40820434701 and #40821335099 passed. Latest browser #40822208266 and `1878a6d` browser #40822018994 completed SUCCESS; Windows #40822018950 FAILED at the same installed source-location timeout. `a850518` browser #40821833788 also completed SUCCESS. Browser manual recovery #40821335082 failed due missing React render wait (fixed in `a850518`); source text run #40820434613 and Windows #40820434701 passed.
- 직접 Windows UI: 로컬 Chrome DevTools WebSocket 연결 및 Electron smoke가 실행 환경에서 실패해 미검증. Windows hosted CI에서 설치/빌드/packaged smoke는 통과했으나 installed STEP3 source-location 렌더는 #40821833694, #40822018950, #40822093651, #40822208336에서 timeout되어 미검증. 사용자 PC의 실제 문서 5–10건·물리 인쇄/구매자 PC 검수도 미검증. Computer Use는 브라우저 URL 식별 정책으로 중단되어 재시도하지 않았다.
- 전체 7단계 완료율 **약 45% 재평가**: STEP3는 복구·원본 비교 기능이 늘었으나 다단/표·복잡한 PDF 및 실제 고객 문서 수용이 남고, STEP4는 비교·적용·취소가 구현되어도 저장형 사용자 프리셋은 승인/스키마 대기, STEP5 미구현, STEP6 승인대기, STEP7 부분이다. STEP3의 수동 누락 복구와 원본 위치 대조가 브라우저에서 실제로 통합되어 약 1%p만 반영했다. 반복 Windows installed source-location timeout과 고객 PDF 수용 미검증으로 80%에는 크게 미달한다. 출시/판매 판단은 NO-GO.

## 2026-10-29 — STEP3 원본 위치 연결 보강

- 최신 브랜치 코드 SHA `9ade72efb957d4399a2d184f1aafc39472b576dd` (`integration/astra-commercial-core`, PR #9 Draft, 미병합). 기존 원본 PDF·V2 저장 구조·8개 디자인은 변경하지 않았다.
- 기능: STEP3 검수의 각 텍스트 블록에서 `원본 위치 보기`를 누르면 실제 PDF.js 원본 페이지를 렌더하고 추정 출처 좌표를 강조한다. 기존 원본 파일 Blob URL 수명과 취소/확정 흐름을 재사용한다.
- 로컬 Windows 검증: `npm test` 67/67 PASS, `npm run build` PASS, `npm run desktop:verify` 14/14 PASS, `git diff --check` PASS (`core.whitespace=cr-at-eol`).
- 미검증/실패: Chrome STEP3 E2E는 Windows Chrome의 DevTools WebSocket 시작 실패로 테스트 페이지 진입 전 종료. `npm run desktop:smoke`는 Electron 바이너리 설치 후 종료 코드 1(추가 로그 없음). 따라서 Windows 앱 상호작용은 이번 SHA에서 미검증. GitHub exact-SHA CI #40820434613 (Chrome/Edge) 및 #40820434701 (Windows installer)은 실행 중이며 아직 결과로 기록하지 않는다.
- 전체 7단계 완성률은 **약 44% 유지**. STEP3/4는 여전히 부분이며 이 보강 하나만으로 단계 완성률을 올리지 않는다. STEP5 미구현, STEP6 승인대기, STEP7 부분. 고객 PDF 5–10건과 구매자 PC 인수검수는 미검증.

- 저장소: `hibi89/astra_pdf_redesigner` / `integration/astra-commercial-core` (Draft PR #9, main 미변경)
- 승인 범위: STEP3 PDF 가져오기는 기존 승인 범위이며, 사용자가 STEP4 디자인 비교·적용·취소 개발도 승인했다. OCR은 별도 승인 전 제외한다. 저장형 사용자 스타일 라이브러리/스키마 변경은 승인 전 구현하지 않는다.
- 제품 상태: STEP1·2 완료, STEP3·4·7 부분, STEP5 미구현, STEP6 승인대기. 최초 7단계 추정 약 44% (STEP1·2=2.0, STEP3=.33, STEP4=.45, STEP7=.33, 합계 3.11/7); 판매/Production NO-GO.
- 최신 기능·테스트 SHA: `273db07ae851e8d2420da39688b5fa84641ce65d` (STEP4 같은 문서 8개 레이아웃 임시 비교, 적용/취소, 기존 디자인 컨트롤 동기화).
- Exact-SHA Chrome+Edge [#40486509235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509235): SUCCESS 2/2, Node 22 `npm test` 67/67 PASS, `npm run build` PASS. 실제 브라우저 A4 PDF의 텍스트·이미지·페이지 및 비교 미리보기/적용 PDF 레이아웃 동등성을 확인했다.
- Exact-SHA Windows NSIS [#40486509335](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509335): SUCCESS. 설치 앱 STEP4 임시 비교 PDF·적용·취소, 기존 8개 A4 PDF 8/8, M09-D, 설치/제거 및 0.1.0→0.1.1 STEP2 데이터 보존을 확인했다.
- 미검증: 동의된 실제 PDF 5–10개 사용자 PC 비교, 구매자 물리 Windows PC GUI/인쇄 수용. CI PDF는 synthetic fixture만 사용했다.
- main, PR #3/#4, 사용자 데이터, 배포 설정은 변경·병합하지 않음. 외부 전송·OCR·모델 다운로드·유료 서비스·merge·배포 없음.

## 과거 기록 — 2026-10-27 16:51 KST
- 저장소 `hibi89/astra_pdf_redesigner`, 검증 브랜치 `integration/astra-commercial-core`, Draft PR #9 미병합. 기능·테스트 SHA `1099b794f32da3e0bc467898e12b0ee7e7e71146`.
- 이번 테스트 보강: 프로젝트 JSON 내보내기의 원문과 네 디자인 설정 일치, 잘못된 JSON 가져오기 시 활성 문서 무변경, 올바른 가져오기의 디자인 설정 유지, 가져온 복사본 삭제 뒤 원본 보존을 확인하도록 테스트를 강화했다.
- 로컬 exact-SHA 검증: `npm test` 61/61 PASS, `npm run build` PASS, `node --check tests/step2-browser.mjs` PASS, `git diff --check` PASS.
- GitHub exact-SHA: Edge job [#122069789553](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551454/job/122069789553) SUCCESS; `PASS STEP2: portable project JSON includes exact text and image bytes`, `PASS STEP2: JSON import, invalid import rejection, independent copy survives delete` 확인. Windows NSIS run [#40468551485](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551485) SUCCESS; `PASS M09-D WINDOWS INSTALLED UI`, STEP2 프로필 재실행 보존, 0.1.0→0.1.1 업그레이드 보존 및 설치기 업로드 확인.
- Chrome job `#122069789889`은 17:04 KST `completed/success`. exact-SHA Chrome smoke에서 `PASS STEP2: portable project JSON includes exact text and image bytes`, `PASS STEP2: JSON import, invalid import rejection, independent copy survives delete`, 실제 Chrome A4/PDF 검사와 M09-A/B/C 회귀 마커를 확인했다. Chrome+Edge run `#40468551454` 2/2 성공.
- 후속 조회 16:58 KST에도 Chrome 폰트 단계는 실행 중이었다. 로컬 `git push`/`git fetch`는 `Could not resolve host: github.com`으로 실패했으나 GitHub 연결을 통해 문서와 PR은 원격 반영했다. 로컬 문서 커밋 `b72d0dc2bd051562775cd65bde82b1ae529ab088`은 16:58 KST 원격 PR HEAD `836c95f6b2ca9f927070089511b66ae8e56a3d0c`와 서로 다른 ancestry이므로, DNS가 복구되기 전 로컬 커밋을 PR 브랜치에 직접 push하지 않는다.
- 합성 데이터만 사용. 고객 PDF, 외부 모델 다운로드, 유료 서비스, 배포·병합 없음. 전체 7단계 약 43%, 판매 및 public production NO-GO.

## 완료 기능
- 회고록 제목, 선택 작성자, 로컬 오늘 기본 작성일, 4개 본문 항목 실시간 편집.
- 서로 다른 레이아웃 3개(깔끔한 보고서, 미니멀 노트, 학습 다이어리), 포인트 색상 6개, 고딕/명조, 크기 3개.
- 원문 문단 및 숫자 유지, 빈 본문 섹션·빈 작성자 숨김.
- 동일 React 문서 렌더러를 미리보기와 인쇄에 사용, A4 인쇄 CSS, `window.print()`, 다중 페이지.
- `localStorage` `schemaVersion: 1` 자동 저장·복원, 손상 데이터 처리, 경고, 확인 후 예시·초기화.
- 원본 설계 PNG 2개 및 사용자가 제공한 텍스트 로드맵을 `docs/`에 원본 보존.

## 실제 수행한 테스트
- 로컬 Node.js 22.16: `npm test` **5/5 PASS** (데이터 모델/저장 파서), `npm install`은 해당 실행 환경의 DNS `EAI_AGAIN`으로 불가. 로컬 npm 빌드·브라우저 실행은 미수행.
- GitHub Actions Ubuntu Node.js 22: `npm install --no-audit --no-fund` PASS, `npm test` **5/5 PASS**, `npm run build` PASS.
- 실제 Linux Chrome headless: React 렌더링 PASS, 빈 섹션·작성자 숨김 PASS, 입력/줄바꿈·테마 변경·새로고침 복원 PASS, 초기화·손상 저장 데이터 회복 PASS, 긴 URL 넘침 검사 PASS.
- Chrome `Page.printToPDF` 및 Poppler 검사: **A4 PDF 15페이지 생성**, 처음/마지막 마커 텍스트 추출 PASS, 편집기 UI 제외 PASS.
- 원본 두 PNG 및 로드맵 Git blob SHA 로컬/원격 일치 검증 완료.

## 미검증·제약
- 사용자 Windows Chrome/Edge 인쇄 대화상자의 PDF로 저장, 브라우저 머리글·바닥글/배경 옵션 및 실제 한글 글꼴의 선택 품질: **수동 검증 필요**.
- 국비학원 사이트에서 PDF 첨부 제출 가능 여부 확인 필요(자동 제출 범위 제외).
- 실제 OS별 글꼴과 인쇄 페이지 나눔은 달라질 수 있음.
- STEP 2의 **블록 모델 및 STEP 1 비파괴 변환기만 구현**; 블록 편집 UI·이미지 저장·다중 문서·내보내기는 미구현. STEP 3~7의 기존 PDF 가져오기/OCR/AI/검색/설치형은 미구현.

## 다음 작업
1. STEP 2에서 블록 편집과 이미지·여러 문서의 지속 저장 구현. STEP 1 v1 저장 데이터는 기존 키를 변경·삭제하지 않고 읽기/변환한다.
2. 로컬 이미지 업로드 후 PDF 출력 검증, 프로젝트 내보내기/가져오기 복원 확인.
3. 사용자 Windows Chrome/Edge의 실제 인쇄·한글 선택 검수는 여전히 필요.

- 기준 검증 시점: 2026-10-18 21:39:37 KST

- CI 안정화 보완: 새로고침 완료 이벤트 명시 대기 및 문서만 변경된 커밋에서는 CI 실행 생략; 최신 코드/워크플로 HEAD `639b5e984e8ba711674a3b3d29fc6baf881a14d1`, 검증 run `39128155552`.

## 2026-10-18 STEP 2 착수·첫 단위 (추가 기록)
- 사용자 확정: 최종 목표는 **기존 PDF 콘텐츠를 보존한 디자인 리디자인**, 아스트라 단계 순서 유지.
- 선택 설계: 순서 있는 제목/문단/이미지 블록 모델. 대안 비교 및 제약은 `docs/STEP2_DESIGN_DECISION_2026-10-18.md`.
- 구현: `src/step2/model.ts` (블록·프로젝트/컬렉션 타입, STEP 1 데이터 변환, 순서 변경, 런타임 검사), `tests/step2-model.test.ts`.
- STEP 1 UI·`src/storage.ts`·localStorage v1 키 **미변경**. 신규 모델만 분리해 추가.
- 로컬 Node 22 `npm test` **9/9 PASS** (기존 5 + 신규 4). 로컬 npm 설치/빌드는 DNS 장애로 미검증.
- GitHub PR [#1](https://github.com/hibi89/astra_pdf_redesigner/pull/1) squash merge → **기능 SHA `5eb2b8d5db89f69a2a61254ddd79651d1226ad56`**, main.
- GitHub Actions [#39129894290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39129894290) `success` (2026-10-18 22:04:29 KST 재조회 기준): 설치, 9개 단위 테스트, TypeScript/Vite 빌드, Chrome 인쇄 스모크 (워크플로 내 실행 검증).
- **남은 작업:** STEP 2 UI·IndexedDB 이미지 저장·문서 관리·내보내기/가져오기·사용자 Windows 검수. STEP 2 완성 아님.

## STEP 2 상세 지침 반영 및 기능 브랜치 구현 중 (2026-10-18 22:39:17 KST)
- 사용자 제공 STEP 2 지침 원문을 `feature/step2-full-20261018`의 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt`에 변경 없이 보존.
- 기능 브랜치 최신 확인 SHA `ebb5861cbc795286c1aa1d9ea1321fb46f261ffb`. 코드 구현: V2 섹션·블록 모델, IndexedDB(문서·자산·메타), 안전 마이그레이션, 문서함, 이미지 검증/편집, 프로젝트 JSON 내보내기·가져오기, 추가 컴팩트 테마, Chrome 브라우저 테스트 코드.
- 로컬 Node 22 `npm test` **14/14 PASS**, 전역 TypeScript로 순수 모델/저장 모듈 정적 타입검사 PASS, JSX 구문 검사 PASS. **전체 React/Vite 빌드·STEP 2 Chrome IndexedDB/인쇄 실제 테스트는 미검증**.
- CI 두 차례 `39131861115`, `39132088786`: 러너 미배정, `steps=[]`, 약 2초 뒤 종료. 테스트 실행 전 실패로 앱 오류 여부 불명. 동일 시도 반복 중단. 로컬 npm offline도 ENOTCACHED, 온라인 DNS EAI_AGAIN.
- **main은 STEP 1 검증 소스 유지**. STEP 2 기능 브랜치 코드는 빌드/실브라우저 검증 후에만 main 병합. 문서 원본 v1 자동 삭제·덮어쓰기 없음.
- 다음 작업: GitHub Actions runner 복구/다른 인터넷 가능한 환경에서 `npm install && npm run build` 및 `tests/browser-smoke.mjs`·`tests/step2-browser.mjs` 실행 → 실패 코드 수정 → 병합/문서 갱신.
- 세부 기록: feature 브랜치의 `docs/STEP2_IMPLEMENTATION_STATUS_2026-10-18.md`.


## STEP 2 통합 자동 검증 완료 — 2026-10-18 23:38:59 KST
- 저장소 공개 여부 재조회: **Public**. GitHub Actions 러너 미배정 상태 이후, 과거 run `39132721985` 재실행(시도 2)에서 실제 Node/빌드까지 진행됨. 설치/테스트 PASS 후 `Workspace.tsx` TS 오류 8건 발견.
- 기능 브랜치 `feature/step2-full-20261018`에서 이미지 블록 분기 타입 좁히기·미사용 import 제거 (`59628b9c3bb7a704f7b7079626b562dd1338c2ab`).
- 이후 Chrome 테스트 PNG fixture가 잘못된 IDAT CRC를 포함한 사실 확인. **테스트 자산만** 올바른 2×2 PNG로 교체 (`caa0747a5b6967393e05b1b704fe0aa5b3f6aa24`).
- [GitHub Actions #39136882566](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39136882566): **success**. Node 22 단위 **14/14 PASS**, TypeScript/Vite 빌드 PASS, 실제 Chrome 기존 STEP 1 회귀 PASS 및 A4 PDF 15페이지/텍스트 추출 PASS, STEP 2 IndexedDB 저장·복원·섹션 순서·PNG 이미지/Blob 복원·JSON 백업/가져오기·이미지 포함 A4 PDF 스모크 PASS.
- 아직 **사용자 Windows Chrome/Edge 출력, JPEG/WebP 및 가로·세로 대형 이미지, 길고 복잡한 캡션, 멀티탭 충돌, 빠른 저장 경쟁 및 실패 복구는 미검증**. STEP 2 최종 수용 전 추가 검수 필요.
- **main에는 STEP 2 기능 미병합**. 이 커밋은 문서 상태 변경만 수행. Production/Vercel 미적용(로컬 앱).
- 다음 `ㄱ`: 자동 CI로 발견되지 않는 저장 경쟁/이미지 유형·페이지 나눔 보강 검증을 1단위 진행하고, 충분히 통과한 뒤 main 병합을 판단한다.

## STEP 2 저장 경쟁 방어 — 2026-10-18 23:47:43 KST
- 작업 범위 **1단위**: 동시에 들어오는 문서 전환·생성·복제·삭제·이미지 작업의 중복 실행 거부. 변경 동작 중 편집 폼 비활성화, 실패 후 잠금 해제. 기존 STEP 1 화면·저장 데이터 미수정.
- 기능 브랜치 `feature/step2-full-20261018`, 검증 코드 SHA `44d7be92f04be8ff4e1effeb9c16f271069cfe46`. 신규 `src/step2/mutationGate.ts`; `src/step2/useWorkspace.ts`, `src/step2/Workspace.tsx`, `tests/step2-mutation.test.ts`, `tests/step2-browser.mjs`.
- [GitHub Actions #39137537886](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39137537886): **success**, Node 단위 **16/16 PASS**, TypeScript/Vite **빌드 PASS**, Chrome **동일 이벤트 루프 내 두 문서 전환 요청 중복 방어**·원본 본문/활성 문서 새로고침 복원 PASS. STEP 1 Chrome A4 15페이지 및 STEP 2 이미지·JSON 입출력 회귀 PASS.
- **여전히 미검증:** JPEG/WebP, 가로/세로 대형 이미지·긴 캡션 인쇄, 멀티탭 충돌, 저장소 오류/할당량 실패 주입, 사용자 Windows/Edge 수동 출력 검수. 위 테스트는 특정 전환 경쟁 1종의 성공이며 모든 경쟁 조건을 증명하지 않음.
- **main 기능 미병합**, Production/Vercel 미적용. 다음 `ㄱ`: 미검증 JPEG/WebP·이미지 출력 경계 또는 저장 실패 복구 중 1단위 추가 검증 후 main 병합 판단.

## STEP 2 JPEG/WebP 검증 완료 — 2026-10-18 23:59:02 KST
- 대상: `feature/step2-full-20261018` 기능 SHA `fa459db3317026190c85f690e5744950ed3b4da1`. 이번 단위는 앱 소스 변경 없이 **실제 Chrome 테스트 `tests/step2-browser.mjs`만 확장**.
- Chrome Canvas로 만든 개인정보 없는 테스트 이미지 사용: **가로형 JPEG 32×16**, **세로형 WebP 16×32**. 실제 입력 업로드 → 디코딩 → IndexedDB 저장 → 새로고침 후 두 이미지 원래 치수 복원 PASS.
- JSON 내보내기 Blob에서 MIME·가로세로·Base64 바이트를 확인하여 **JPEG/WebP 원본 파일 바이트 1:1 보존 PASS**. 기존 PNG 포함 A4 PDF에서 `pdfimages -list` 이미지 3개 이상 포함 PASS. PDF 형식 A4·본문 텍스트 검사 PASS.
- [GitHub Actions run 39138352449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39138352449) **success**. `npm test` **16/16 PASS**, `npm run build` PASS, STEP 1 Chrome PDF 15페이지 및 기존 STEP 2 회귀 PASS.
- 과정 중 두 번 실패한 E2E(`39138141905`, `39138228608`)는 **두 번째 동일 이름 JSON 다운로드 파일 탐색 시간 초과**. 실제 업로드/복원은 통과. 브라우저 반복 다운로드 파일명/허용 정책에 의존하지 않고 다운로드 직전 생성한 JSON Blob을 확인하도록 테스트를 수정하여 최종 PASS.
- 미검증: 큰 이미지·긴 캡션에서 실제 시각적 잘림, 여러 이미지 페이지 경계, 멀티탭 충돌, 저장 공간 부족/오류 복구, 사용자 Windows Chrome/Edge 출력. PDF 내 이미지 **포함**을 검증했으며 픽셀 단위 동일 배치를 검증한 것은 아님.
- **STEP 2 전체 최종 수용 및 main 기능 병합 대기**. STEP 3 미착수, Production 미적용. 다음 `ㄱ`: 저장 오류·IndexedDB 트랜잭션 실패 복구 또는 대형 이미지·캡션 출력 경계 중 1단위 집중 검증.


## 2026-10-19 00:10:27 KST — STEP 2 IndexedDB 저장 실패 복구 검증
- [GitHub Actions run 39139215112](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139215112): **success**, 기능 SHA `9339adb319a78192a0dda5ae437de248e9a056ca`, Node 22 단위 테스트 **16/16 PASS**, TypeScript/Vite 빌드 PASS, 실제 Chrome STEP 1 A4 PDF 15페이지 및 STEP 2 이미지/JSON/인쇄·문서 전환 회귀 PASS.
- 테스트에서 `IDBDatabase.prototype.transaction`을 1회 가로채 문서 `readwrite` 저장을 `QuotaExceededError`로 실패시킴. **실패 시 DB 원본 미변경·편집 중 최신 원문 메모리 유지·'저장 실패' 안내·beforeunload 이탈 경고 PASS**.
- 미저장 메모리 문서를 JSON으로 내보내 텍스트·첨부 이미지가 포함됨을 확인 PASS. '지금 저장 / 재시도' 후 DB에 최신 본문 반영·새로고침 복원 PASS.
- 발견한 UX 문제: 저장 재시도 성공 뒤 구식 오류 안내가 남을 위험. `src/step2/useWorkspace.ts`에서 저장 성공 시 오류 안내 지움; Chrome E2E에서 확인 PASS.
- 신규/수정 파일: `tests/step2-browser.mjs`(실제 브라우저 실패 주입), `src/step2/useWorkspace.ts`(성공 안내 보정). **STEP 1 localStorage 원본 불변**, main에 STEP 2 기능 미병합.
- **남은 위험:** 이미지 교체 트랜잭션 실패/부분 롤백 주입, 멀티탭 충돌, 큰 이미지·긴 캡션의 출력/페이지 분할·실제 Windows Chrome/Edge 수동 점검. 모든 IndexedDB 실패 유형을 검증한 것은 아님.
- **진행률 참고(비공식 추정):** STEP 2 요구기능 구현 대부분 완료, 자동 검증 기준 약 **85~90%**. 전체 7단계를 단순히 동일 비중으로 계산하면 **약 26~27%**이며 실제 개발 난이도별 가중 진행률은 아님. 유의미한 완료 기준 또는 약 5%p 이상 변화 시 사용자에게 재보고.
- 다음 1단위: 대형 이미지·긴 캡션의 A4 인쇄 경계, 또는 이미지 교체 트랜잭션 실패 주입·복구 추가 검증. 후속 검수 후 main 병합 판단. STEP 3 미착수.


## 2026-10-19 00:20:19 KST — STEP 2 이미지 교체 트랜잭션 원자성 확인
- 기능 브랜치 `feature/step2-full-20261018`, 검증 코드 SHA `154ff8d98aa97da311362c1e11ea78bac9db77d9`. 이번 1단위 작업은 **앱 코드 변경 없이 `tests/step2-browser.mjs`에 실제 Chrome IndexedDB fault-injection/복원 테스트만 추가**.
- 교체 대상 기존 이미지 3개의 참조 ID·원본 이미지 MIME/파일명/Base64 바이트를 기록. 새로운 PNG의 `assets.put()` 호출 직후 실제 IndexedDB readwrite 트랜잭션을 `abort()`시켜 문서 참조 변경/새 파일 저장/기존 파일 삭제 모두 원자적으로 롤백 PASS.
- 오류 알림 및 이전 미리보기 유지 PASS. 새로고침 후 기존 3개 이미지 참조·원본 bytes 1:1 보존 PASS. 주입 제거 후 교체 재시도 성공, 기존 교체 대상 asset 삭제·새 이미지 참조 연결·고아 자산 없음·새로고침 후 복원 PASS.
- [GitHub Actions run 39139965821](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139965821) **success**. 단위 16/16 PASS, TypeScript/Vite 빌드 PASS, Chrome STEP 1 A4 PDF 15p·STEP 2 JPEG/WebP/PNG/JSON/저장실패 회복/문서전환 기존 회귀 PASS.
- **미검증:** 장문 캡션과 대형 이미지가 여러 페이지를 가로지를 때 PDF 시각적 레이아웃, 실제 멀티탭 동시 편집 방지, 사용자 Windows/Edge 수동 인쇄. STEP 2 main 기능 미병합/STEP 3 미착수, Production 없음.
- 진행률: STEP 2 자동 검증 중심 **약 90% 수준**(이전 85~90% 대비 경계 검증 1개 추가). 7단계 **단순 동등 가중 기준 약 27%**, 변경 폭이 사용자 요청한 유의미한 5%p에 못 미쳐 별도 상승 알림 생략. 수치는 테스트 커버리지 측정값이 아닌 로드맵 추정.
- 다음 1단위: 대형 이미지·긴 캡션의 페이지 나눔 안전성 검사. 완료 기준 통과 후 STEP 2 main 병합 검토.


## 2026-10-19 00:29:24 KST — STEP 2 대형 이미지·긴 캡션 A4 인쇄 검증
- 브랜치 `feature/step2-full-20261018`, 자동 검증 기능 SHA `3173098c0df9d210cd8d762b28d09a36b5298f73`. 앱 코드/CSS/원본 자료 변경 **없음**. `tests/step2-browser.mjs`에 Chrome 실제 출력 테스트 1단위 추가.
- 합성 **1200×2500px** 세로 이미지와 페이지 경계 부근의 선행 문단 37줄을 생성해 A4 인쇄. 이미지·짧은 캡션이 같은 PDF 페이지에 포함되는지 페이지별 `pdftotext`와 `pdfimages -list`로 검사: **PASS**.
- 같은 이미지의 캡션을 190줄로 변경해 다시 인쇄. PDF가 추가 페이지로 확장되고 캡션 시작·끝과 처음·마지막 행 및 앞쪽 본문 표지가 누락/중복 없이 남는지 검사: **PASS**. `pdftotext -bbox-layout` 단어 좌표가 페이지 물리적 경계를 벗어나지 않는지 검사: **PASS**.
- [Actions run 39140653462](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39140653462) **success**, 단위 **16/16**, TypeScript/Vite build PASS, 기존 STEP 1 A4 PDF 15페이지 및 STEP 2 이미지/IndexedDB/JSON/실패 복구 회귀 PASS.
- **미검증:** 실제 출력물의 픽셀 수준 시각적 잘림/미세 겹침, Windows Chrome/Edge의 시스템 글꼴·인쇄 미리보기, 실제 다중 탭 Web Locks 충돌. 특정 합성 이미지/캡션의 Chrome PDF 검증이며 모든 레이아웃을 보장하지 않음.
- **다음 `ㄱ`: 실제 두 탭 동시 접근 충돌·잠금 해제 검증. STEP 2는 추정 **약 92%**, 전체 7단계 **단순 동일 비중 약 28%**, 기준 직전 약 27%에서 유의미한 5%p 상승은 아님. main STEP2 기능 미병합, STEP 3~7 미착수.


## 2026-10-19 00:36:17 KST — STEP 2 실제 Chrome 2탭 Web Locks 독점 편집 검증
- 검증 코드 SHA `3fe13c1097f63296d45c683f63ba0b95acd005a9`, 작업 브랜치 `feature/step2-full-20261018`. 앱 기능 코드 변경 **없음**. `tests/step2-multitab.mjs` 신규 및 `.github/workflows/ci.yml`에 검증 단계 추가.
- **같은 Chrome 브라우저 프로필·같은 origin**에 실제 두 탭 생성. 첫 탭의 `navigator.locks.query()`에서 `astra-pdf-redesigner-editor` 독점 잠금 1개 확인. 둘째 탭은 문서 목록·본문 편집 미개방, 읽기 전용 경고 노출·출력 버튼 비활성화, 첫 탭 원문 유지 PASS.
- 첫 탭 `Target.closeTarget` 닫기 → Web Lock 해제(보유 수 0) → 둘째 탭 새로고침으로 새로운 독점 잠금 획득, 기존 문서 내용 유지 PASS. 이어 둘째 탭에서 새 내용 수정·자동 저장·새로고침 복원 PASS. 구버전 데이터 덮어쓰기 없음.
- [GitHub Actions run 39141151527](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39141151527): **success**, Node 테스트 **16/16 PASS**, TypeScript/Vite 빌드 PASS, STEP1 A4 PDF 15p 및 기존 STEP2 JPEG/WebP·PNG·JSON/IndexedDB 실패 주입·인쇄 페이지 나눔 회귀 PASS. 멀티탭 3개 검사 PASS.
- **미검증/제약:** 잠금 미지원 브라우저의 실사용 동작, 강제 종료·OS 전원 장애, Windows Chrome/Edge 인쇄 및 한글 글꼴·PDF 육안 검수. 둘째 탭은 **첫 탭 종료 후 새로고침이 필요**하며 자동 편집권 승계 기능을 구현한 것이 아님.
- STEP2 개발/자동 검증은 **약 95% 비공식 추정**, 전체 7단계 단순 동일가중 환산 **약 28~29%**. 이전 전체 약 28% 대비 유의미한 5%p 증가는 아님. 테스트 커버리지 계량치가 아니며 실시간 일정/난이도 미반영.
- **main STEP2 기능 미병합**, Production/Vercel 없음. 다음 `ㄱ`: STEP2 최종 출시/병합 전 요구사항 대조·자동 증거 점검 후 GitHub PR 생성 여부 판단. 사용자 Windows/Edge 수동 검사 전 완전한 수용 주장 금지. STEP3~7 미착수.


## 2026-10-19 00:53:28 KST — STEP 2 원본 요구사항 대조 및 전환·마이그레이션 결함 수정
- 기준: `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (1~18절)와 실제 feature 소스·16개 Node 테스트·Chrome E2E 대조. 상세 표: feature `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`.
- **실제 결함 1:** STEP2 본문 자동 저장 debounce(450ms) 이전에 ‘기존 회고록 편집’을 클릭하면 Workspace unmount 시 타이머가 제거돼 아직 저장되지 않은 글이 유실될 수 있었음. `src/step2/Workspace.tsx`에서 `await w.flush()` 성공한 경우에만 모드 전환, 실패 시 문서 유지/오류·재시도 안내.
- **실제 결함 2:** 최초 STEP1 localStorage가 뒤늦게 생긴 상태에서 STEP2를 재진입하면 `idb.initialize`가 migration 문서를 ACTIVE로 강제해 기존 편집 문서가 바뀌었음. `src/step2/idb.ts`의 migration transaction이 **기존 ACTIVE 있으면 유지**, 없을 때만 migrated doc을 ACTIVE로 저장하도록 수정. 이전 v1 localStorage 원본 유지, 문서·migration marker 동시 처리.
- **테스트 연동 수정:** STEP1 Chrome 스모크는 전환 버튼이 활성화될 때까지 기다림. STEP2 Chrome 스모크는 빠른 화면 전환 후 원문 보존/중복 migration 방지/강제 저장 실패 시 전환 취소·재시도 검증. Chrome 테스트 종료에서 프로세스 종료를 기다린 뒤 임시 profile을 제거하도록 보완.
- [GitHub Actions #39142445389](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39142445389) **SUCCESS**. 테스트 **16/16 PASS**, TS/Vite 빌드 PASS, STEP1 Chrome 15p A4 및 STEP2 기존 이미지/JSON/저장/2탭/페이지 나눔 회귀+신규 화면 전환 PASS. 검증 SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`.
- **남은 수용 증거:** 유효한 기존 STEP1 v1 데이터가 사전 존재하는 **독립 Chrome 프로필 cold-start 마이그레이션 E2E**(현재는 단위·지연 발생 상황 검증), 독립 프로필 JSON 가져오기, 사용자 Windows Chrome/Edge PDF 출력·한글·시각 수동 검수. UI 접근성 전체 수동 점검도 남음.
- **병합 판정 HOLD:** `main`에 STEP2 기능 미병합, STEP3 미착수. 보수적 추정 STEP2 **약 90~95%**, 전체 7단계 **약 27~28%** (동일 비중 단순 환산·소요 시간 반영 안 함). 이전 기준에서 유의미한 5%p 순증 아님.
- 다음 `ㄱ`: STEP1 v1 원본 있는 별도 Chrome 프로필에서 실제 초기 마이그레이션/복원·중복 방지 검증. 이후 별도 프로필 JSON 이식 확인 → main 병합 여부 판단.


## 2026-10-19 01:04 KST — STEP2 V1 선존재 신규 프로필 마이그레이션 E2E 성공
- 검증 코드 `abb3d9425e72a2708306674176346727ef0ea710`, 기능 브랜치 `feature/step2-full-20261018`. 원본 STEP1 `localStorage`이 **처음부터 존재**하는 신규 Chrome 프로필을 만들어 앱 JS 이전에 유효한 v1 형식의 **합성 데이터**를 저장. 실제 사용자 데이터 수정 없이 검증.
- `tests/step2-cold-migration.mjs`와 `.github/workflows/ci.yml` 테스트 추가. Chrome IndexedDB에서 STEP2 문서 1개(빈 문서 중복 없음), v1 제목/작성자/날짜·4개 본문 항목 원문/공백/줄바꿈/특수문자·기존 디자인 exact match, 고유 ID·ACTIVE·migration marker true PASS.
- 기존 `astra-pdf-redesigner:current:v1` 원본 JSON byte-for-byte 유지 PASS. Chrome 새로고침 후 문서·ACTIVE·migration marker 원상태 동일/중복 복제 0 PASS.
- [GitHub Actions `39143261165`](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39143261165) **SUCCESS**: `npm test` 16/16 PASS, TS/Vite 빌드 PASS, 기존 STEP1 Chrome PDF 15p·STEP2 이미지/JSON·2탭·인쇄·저장 실패 회귀+신규 cold migration PASS.
- 유의: Chrome test 종료에서 합성 임시 프로필 삭제 `ENOTEMPTY` 경고 발생. **검증 PASS와 분리**하여 CI 완료 success, runner 임시 디렉터리 정리 경고는 기록. 기능 데이터/사용자 문서와 무관.
- **남은 수용 항목:** 새로운 Chrome 프로필 간 JSON 파일 실물 내보내기→가져오기 E2E, 사용자의 Windows Chrome/Edge A4 인쇄/한글·시각 검수, 초기 migration 실제 트랜잭션 실패 주입은 별도 미검증.
- 상태 STEP2 **약 95% 비공식 추정**, 전체 7단계 단순 동일비중 환산 **약 28~29%**. 진도 유의미 상승 기준(5%p) 미달. **main STEP2 병합 HOLD**; STEP3~7 미착수. 다음 `ㄱ`: 독립 Chrome 프로필 JSON 이식/복원 검증.


## 2026-10-19 01:19 KST — STEP2 Chrome 별도 프로필 간 JSON 프로젝트 이식 검증 PASS
- 앱 코드 변경 없음. `feature/step2-full-20261018`의 신규 `tests/step2-cross-profile.mjs`와 Actions CI 연결. [GitHub Actions `39144399956`](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39144399956) **SUCCESS** (검증 코드 SHA `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`; Node 단위 16/16, TS/Vite 빌드, STEP1/2 기존 Chrome 회귀 PASS).
- **프로필 A:** 별도 Chrome 사용자 디렉터리에서 synthetic 본문·메타/compact 디자인·원본 PNG(40×70)·WebP(84×36) 2개 저장, UI에서 실제 `.localdoc.json` 다운로드; 파일 내 Base64와 DB 원본 이미지 bytes 일치 확인.
- **프로필 B:** 프로필 A와 독립된 Chrome 사용자 디렉터리에서 빈 문서만 존재함을 먼저 확인. CDP `DOM.setFileInputFiles`로 A가 다운로드한 **동일 실물 파일**을 B의 프로젝트 가져오기 파일 입력창에 전달하여 앱 import. 기존 B 문서 보존, 원문·메타·디자인·이미지 bytes/순서/규격 정확 복원·모든 doc/section/block/asset ID 새로 발급·참조 오류 없음 PASS. 새로고침 후 유지·A4 PDF 본문·이미지 2개 포함 PASS.
- 이전 검증 완료: 기존 STEP1 v1 cold-start 마이그레이션, 저장 실패 복원, 이미지 원자적 교체, 멀티탭 Web Locks, 긴 캡션·A4 페이지 나눔 등. **아직 미검증:** V1→V2 **초기 migration transaction 강제 abort/원본·marker rollback**, Windows Chrome/Edge 인쇄·한글/시각 수동 검수와 전체 접근성.
- **상태:** STEP2 주요 자동 수용 증거 대부분 완료, 진행률 **약 96%**(비공식 추정). 전체 7단계 단순 동등가중 **약 28~29%**, 5%p 유의미 상승 아님. `main` 기능 STEP1 유지, STEP2 병합 HOLD, STEP3~7 미착수. 다음 `ㄱ`은 초기 migration 쓰기 실패 주입·복구 검사 1단위.


## 2026-10-19 01:29 KST — STEP 1→2 최초 마이그레이션 트랜잭션 중단·복구 검증 성공
- 기능 브랜치 `feature/step2-full-20261018`의 `tests/step2-cold-migration.mjs`에서 실제 Chrome IndexedDB `documents+meta` 마이그레이션 트랜잭션을 `put` 큐 등록 뒤 강제 `abort()`하는 1회 오류 주입 E2E 추가. 앱 로직·사용자 데이터는 변경하지 않고 합성 v1 데이터만 사용.
- **실패 직후 검증:** V2 documents 0건, `v1MigrationFinished` marker 없음, `activeDocumentId` 없음, STEP1 v1 `localStorage` raw JSON 바이트 불변, 오류 안내 PASS.
- **복구 검증:** 새로고침 후 주입 제거 → V1 원문 4개 항목/공백/줄바꿈·메타/디자인이 V2 문서로 1회 이동하고 marker·active 생성 PASS. 추가 reload 이후 같은 V2 ID·내용·marker 유지, 중복 문서 없음 PASS.
- 기존 `tests/step2-browser.mjs`에서 저장 재시도 '저장됨' 표시 직후 모드 변경 버튼 활성화까지 기다리도록 시험 타이밍 수정. 이전 CI `39144986696`의 테스트 클릭 타이밍 실패 해결. 앱 기능 소스 수정 없음.
- [GitHub Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) **SUCCESS**(테스트 코드 SHA `a5009a76499a983aa4566adabddabf862c9e839b`). 단위 **16/16**, TypeScript/Vite 빌드, STEP1 A4 PDF15p·STEP2 PNG/JPEG/WebP·JSON 프로필간 이식·IndexedDB 저장복구/멀티탭/긴 캡션 모든 Chrome 회귀 및 신규 abort·복구 PASS.
- **잔여 수용:** 사용자 Windows Chrome/Edge에서 한글/폰트, A4 인쇄 이미지 잘림·페이지 나눔, 키보드 접근성 실제 수동 검수. Linux Chrome 자동 테스트 결과를 사용자 OS 실검수로 표현하지 않음.
- STEP2 구현·자동검증 기준 추정 **약 97~98%**. 전체 로드맵 7단계 단순 동등가중 **약 28~29%**, 5%p 이상 진도 상승은 아님. STEP2 main 코드 병합 HOLD, STEP3~7 미착수. 다음 `ㄱ`: Windows/Edge 사용자 수동 수용 절차·결과 확인 및 병합 조건 판단.


## 2026-10-19 01:40 KST — Windows Chrome/Edge STEP2 수동 수용 절차·병합 조건 확정
- 기능 브랜치 `feature/step2-full-20261018`의 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md` 신규 문서. `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 원본 §16 **21개 수동 검사 번호 유지**·§17 최종 완료 기준·§18 보고 조건에 맞춰 테스트 전용 Windows PowerShell 실행, 서로 다른 Chrome/Edge 프로필, localhost 별도 포트 `4178` 및 A4 PDF 증거 수집·오류 보고 양식 작성.
- 모든 수동 검사 상태: **미실행 21/21**, Windows Chrome·Edge 한글/이미지/캡션 시각·키보드 검증 결과 미접수. 이전 Ubuntu Chrome Actions [#39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) SUCCESS (기능 SHA `a5009a76499a983aa4566adabddabf862c9e839b`, Node 16/16, 빌드/실제 Chrome 회귀)와 혼동 금지.
- 병합 게이트: 최신 feature diff·CI 확인 + 실제 Windows Chrome/Edge 수동 결과에서 중요한 데이터 손상·누락·인쇄 실패 0 + 미실행/차단 근거 문서화 + 사용자 명시적 승인. **현재 STEP2 전체 수용 HOLD / main 기능 미병합**, STEP3 미착수.
- 검수 전용 별도 프로필·origin을 안내해 실제 사용자 문서·기존 `5173` origin/데이터를 변경하지 않도록 함. 수동 증거는 합성 PDF·스크린샷으로 수집하고 사용자 원본·비밀 키는 제출하지 않는다.
- 진척도: STEP2 약 **97~98%**, 7단계 동등가중 전체 약 **28~29%** 이전 추정 유지. 문서화만 추가됐으며 유의미한 실질 진도 상승은 아님.
- **다음 작업:** 사용자 Windows Chrome/Edge에서 수동 검수 결과를 수집하면 FAIL 분석·수정·재검증 후 main 병합 판단. 사용자 PC에서 아직 테스트하지 않음.


## 2026-10-19 02:14 KST — STEP2 병합 전 코드/CI 검수, 브라우저 필수 검사 강화
- GitHub `main` vs `feature/step2-full-20261018` 정적 비교. 앞섬 **63 commits**, 뒤짐 **28 commits**인 diverged 상태. main 쪽 최근 수정은 `HANDOFF.md`/`STATUS.md` 중심, 기능 브랜치는 STEP2 React/IndexedDB/CSS/테스트 신설. **실제 merge 및 merge 성공/충돌 검사 미수행**, main STEP1 원본·사용자 데이터 무변경.
- **CI 신뢰성 문제 수정:** 기존 `.github/workflows/ci.yml`은 Chrome 미설치 시 `exit 0`으로 실브라우저 검사를 건너뛰고 성공 처리할 가능성. 필수 Chrome/PDF 테스트 누락 시 `::error`와 **`exit 1`**로 실패하도록 변경(기능 변경 없음).
- [GitHub Actions #39148544554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39148544554) **SUCCESS**, 실제 코드 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`. Node 16/16, TypeScript/Vite build, Chrome executable `/usr/bin/google-chrome`, STEP1 A4 15p 및 STEP2 이미지/IndexedDB·마이그레이션 abort/긴 캡션·멀티탭·크로스 프로필 JSON E2E **전부 PASS**.
- **실제 사용자 Windows Chrome PDF 부분 증거 확인:** 첨부된 짧은 문서 1페이지 `594.96 x 841.92 pt` A4, Creator Windows Chrome155, 내장 `MalgunGothic`/`MalgunGothicBold` 글꼴·Unicode 매핑, 한글 제목/본문 정상 추출, 인쇄 UI 보이지 않음. 이 파일 자체는 GitHub 공개 게시 금지. **Edge 출력·Windows 2페이지 이상/이미지/긴 캡션은 미검증**, 실제 뷰어에서 문자 선택·복사 수동 동작도 미확인. '21/21 모든 수동 항목 미실행'이라는 기존 표기는 **일부 Chrome 증거 존재**로 정정.
- 상세 감사 파일: feature `docs/STEP2_PREMERGE_CODE_CI_AUDIT_2026-10-19.md` 및 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md` (Windows Chrome 부분 증거 기록). `README.md` 최신 CI 연동. CI 임시 Chrome 프로필 cleanup `ENOTEMPTY` 간헐적 WARN은 여전히 존재하나 기능 검사 성공과 별개.
- **병합 판정 HOLD:** 사용자 명시적 승인 전 main 병합 없음. STEP2 약 **97~98%**, 전체 7단계 단순 동등 가중 **28~29%** 이전 추정 유지. 새 코드 감사/CI 신뢰성 개선은 5%p 실질 진도 상승 아님. 다음: 미검증 수용 범위를 협의하고 필요 시 Edge/장문 증거 추가·결함 해결 후 main 병합 승인/재검증.


## 2026-10-19 02:24 KST — Microsoft Edge 실제 Linux 브라우저 PDF·저장 회귀 자동화 성공
- GitHub Actions `.github/workflows/ci.yml` 기능 브랜치 `feature/step2-full-20261018`에 `Microsoft Edge A4 print and IndexedDB smoke` **필수 단계** 추가. Edge 없을 때 우회 성공 방지(`::error`+exit 1), 출력도구 pdfinfo/pdftotext/pdfimages 확인, 별도 Vite 테스트 서버에서 `tests/browser-smoke.mjs`·`tests/step2-browser.mjs`를 `CHROME_PATH="$EDGE_BIN"`으로 실행.
- [Actions #39149195481](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481) **SUCCESS**. 실제 로그: `Microsoft Edge executable: /usr/bin/microsoft-edge`; `Microsoft Edge 155.0.4283.45`. 테스트 기능 SHA `34352fd4e92ca43641da3b4d9de3070232276497`. Node 단위 16/16, TS/Vite build, 기존 Chrome 전수 회귀 PASS.
- **Edge 실제 검증 PASS:** STEP1 A4 15p·한글 PDF 텍스트 추출·편집 UI 제외, STEP2 IndexedDB 저장/새로고침·PNG/JPEG/WebP 원본 bytes·이미지 PDF raster 포함·JSON 백업/불량 입력 거부·대형 세로 이미지+긴 캡션 다페이지 A4·QuotaExceededError 저장실패·이미지 교체 transaction abort 복원·화면 전환 미저장 보호. 테스트용 임시 Chrome 프로필 삭제 `ENOTEMPTY` 경고는 간헐적이지만 Actions 최종 성공.
- **검증 경계:** Ubuntu **Linux Edge** 155에서의 자동 검사이며 **Windows Edge 실제 PDF·폰트·육안 수용 아님**. Edge에서는 STEP1/2 browser smoke 두 스크립트 실행, Chrome 전용 다른 2탭/프로필간 이식 스크립트까지 Edge에서 별도 실행한 것은 아님. Windows Chrome 1페이지 사용자 제출 PDF 부분 PASS 증거는 별도 유지.
- 보고서: feature `docs/STEP2_EDGE_CHROMIUM_CI_VALIDATION_2026-10-19.md`. `README.md`, STEP2 감사/Windows 검수 문서·구현 상태 최신 반영. **STEP2 최종 수용·main 병합 HOLD**, STEP3~7 미착수. 진행률 STEP2 비공식 약 98~99%, 전체 동일 비중 7단계 약 28~29%, 유의미한 5%p 상승 없음.
- 다음 작업: 남은 Windows 실환경 수용 항목을 최소화해 판단하고 병합 전 feature/main 충돌·코드/원본 보호를 재검토한다. 사용자 명시적 승인 없는 main 병합 금지.


## 2026-10-19 02:43 KST — STEP2 main+feature 실제 격리 병합·바이트 무결성·통합 회귀 성공
- 최신 비교: `main`과 `feature/step2-full-20261018`이 **diverged**, 기능 브랜치 73 commits ahead/32 behind. 실제 병합을 GitHub Actions 격리 runner에서 **detached main HEAD** `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a` + 기능 SHA `8d9fdb1adef31875a793cce9376de3154eb08229`로 `git merge --no-commit --no-ff` 수행. **충돌 0**, 28개 staged 경로, HEAD main 유지/ MERGE_HEAD feature 일치. **main에 merge commit/푸시 없음**.
- 기존 main의 `HANDOFF.md`/`STATUS.md`, STEP1 `src/App.tsx`/`src/storage.ts`, 로드맵·STEP1/BLUEPRINT 명세·설계 PNG2장과 feature STEP2 원본 지침 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt`를 병합 결과와 **byte-for-byte** 비교 **전부 PASS**. STEP1와 기존 인수인계 보호 확인.
- [GitHub Actions #39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) **SUCCESS**: 병합된 임시 트리에서 Node 16/16, TS/Vite 빌드, Google Chrome STEP1 PDF15p·STEP2 이미지/JSON·저장 실패·실제 2탭·V1 migration abort/재시도·독립 프로필 JSON 파일 이식 및 Microsoft Edge 155 STEP1/STEP2 A4 PDF·긴 캡션·저장 복구 전체 PASS. 기능 브랜치 단독 CI [#39150537297](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537297)도 SUCCESS.
- 기능 브랜치 `.github/workflows/step2-merge-preflight.yml` 신규(추후 push시 자동 재검증). 상세 보고 `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`. 앱 기능 코드 변경 없음, workflow·보고서만 추가.
- **판정:** 기술적 병합 사전검증 PASS. 사용자 Windows Chrome 1p 한글/A4 부분 PASS, Windows Edge 실제 긴 PDF/이미지·키보드 육안 수용 미완료. STEP2 최종 수용·main 실제 병합은 사용자 명시적 승인 전 **HOLD**, STEP3 미착수.
- 이번 상태 문서 추가 뒤 **main HEAD가 바뀌므로**, 최종 merge 전에 새로운 main/feature SHA 조합으로 preflight 다시 실행해야 한다. 이전 run의 `main` SHA는 `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`. 원본 파일들이 후속 수정에도 그대로인지 병합시 확인.
- 진행률 비공식 STEP2 **약 99%**(자동·기술적 준비 관점), 전체 7단계 **약 28~29%**(동일 비중 단순 환산; 5%p 상승 없음). 다음: 수동 수용 범위·병합 명시적 승인 여부 확인 → 승인시 최신 main HEAD로 재검증 후 main 병합/CI 확인.


## 2026-10-19 02:52 KST — STEP2 main 통합 Draft Pull Request 준비 완료
- [GitHub Draft PR #2](https://github.com/hibi89/astra_pdf_redesigner/pull/2) 생성: `feature/step2-full-20261018` → `main`. 상태 `open`/`draft=true`/`merged=false` 확인, GitHub의 당시 `mergeable=true`, `mergeable_state=clean`. **실제 main merge·push 미수행**.
- PR은 STEP2 전체 기능·V1 로컬 데이터/원본 보존·Linux Chrome/Edge 실제 PDF/DB/JSON CI 성공과 Windows Chrome 사용자 제출 1p PDF 부분 검증·남아있는 Windows Edge/긴 이미지·키보드 시각 수용의 차이를 명시. 원본 사용자 PDF는 공개 저장소에 올리지 않음.
- 이전 격리 병합 Actions [#39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) **SUCCESS**(main `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`, feature `8d9fdb1adef31875a793cce9376de3154eb08229`). Draft PR 생성 시 main `e9044998f6f05cb41d13e339e6e8424e37ef62bb`, head `d94fdd831ce53b3afb4e02eea640c93c3209cc94`로 **이전 시험 SHAs와 다름**. PR mergeable=clean만으로 새 조합의 통합 CI PASS 확정 불가.
- **최종 병합 게이트:** 사용자 수동 검수 미완료 항목 해결 또는 명시적 잔여위험 수용 + 사용자 STEP2 main 병합 명시적 승인 → 최신 main/feature SHA 고정하여 isolated preflight·CI 재검증 → 실제 merge 및 새 main CI PASS 확인. 병합 승인 전 Draft 유지.
- 기능 브랜치 `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`에 PR 등록/남은 수용 조건 추기. STEP2 약 **99%** 자동·기술 관점 비공식 추정, 전체 7단계 동등 비중 약 **28~29%**; PR 생성은 전체 완성을 높이지 않음. STEP3~7 미착수.


## 2026-10-19 — 병합 후 Edge CI 실패 복구, main 전체 자동검사 SUCCESS
- PR #2의 STEP2 병합 SHA `f1ad26320b12b07019b115f77f8cf55e62f1e7e6`; 병합 직후 [Actions #39155133495](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39155133495) **FAILURE**(Chrome PASS, Edge STEP1 `/json/version` CDP startup timeout). D-Bus 경고가 존재하나 근본 원인임은 확정하지 않음.
- 사용자 새 `ㄱ` 지시에 따라 **CI 전용 복구**: `tests/browser-process.mjs`에서 `DevToolsActivePort`의 WebSocket 경로로 직접 핸드셰이크, 검사 스크립트 5개 연결 방식을 공통화; Edge 독립 runner job 도입(`.github/workflows/ci.yml`). **`src/**` 앱 기능·사용자 원본·기존 설계 수정 없음**, 변경 파일 총 7개(테스트6+워크플로1).
- 기능/CI 수정 `main` SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`, [Actions #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) **SUCCESS**: `build-and-test` Node16/16, TS/Vite 빌드, Chrome STEP1·STEP2 E2E·2탭/마이그레이션 abort·프로필 간 JSON PASS; 분리된 Edge job STEP1/STEP2 A4 PDF·이미지·긴 캡션·IndexedDB 복구 PASS. CDP 실제 WebSocket 연결 성공 로그 확인.
- 보고서: `docs/STEP2_POSTMERGE_MAIN_CI_RECOVERY_2026-10-19.md`. 기존 병합/원본 Git blob SHA 비교 PASS 기록 유지, 앱 동작 코드 수정 없음.
- **Windows Edge 실물 PDF·Windows 긴 문서/PNG-JPEG-WebP 다페이지 육안·키보드·작은 창 사용자 수동 검수는 여전히 NOT RUN. STEP2 전체 검증 완료나 100% 선언 금지.**
- STEP 3 미착수. 진행률 보수적 추정 STEP2 구현/자동검증 약 **99%**, 전체 동일 비중 7단계 약 **28~29%** 유지. 추후 앱 기능 구현은 별도 사용자 지시 필요.


## 2026-10-19 — STEP3 기존 PDF 가져오기 첫 세로형 MVP, Draft PR #3
- 기존 STEP2 안정 main 코드 SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`의 [Actions #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) SUCCESS 유지. **main 앱 기능은 수정하지 않았다**.
- 사용자 `ㄱ` 승인으로 로드맵 §5 STEP3 착수. **기능 브랜치 `feature/step3-pdf-import-20261019`** 신규(최초 base main `2c81797735661263ce9fe992ca3fa3b356f60869`), [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 작성. 아직 main 병합하지 않음.
- 브라우저 로컬 PDF.js `6.4.299`(Apache-2.0)로 선택 가능한 단일 열 PDF 텍스트·좌표 추출, 원본 Blob PDF 대조·분류/순서/본문 수정, 확인 후 별도 schemaVersion2 문서 atomic 저장, 기존 테마로 A4 재출력 구현. 원본 PDF 파일 바이트는 영구 저장하지 않음. 30MiB/50p 제한·스캔/암호 PDF 차단·원본 이미지 미복원/열·순서 위험 경고.
- **실제 [feature CI #39159350165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39159350165) SUCCESS**(검증 코드 `e216866a592362342ac6dd2ca2105b71799cc8fc`). 단위 **21/21**, TypeScript/Vite 빌드, 기존 STEP1/2 Chrome/Edge 회귀, 양쪽 실제 브라우저의 합성 PDF 생성→PDF.js 가져오기 검수→DB 신규 저장→테마·리로드→A4 재출력 PASS.
- 완성 아님: 실제 PDF 5~10개 대조, PDF 내부 이미지 원본 자동 추출·복원, 일부 표/다단/문자 매핑/순서의 정확도, Windows 실물 검증은 **미구현/미검증**. STEP2 Windows Edge/장문·이미지 PDF 육안 검수도 **NOT RUN 유지**.
- 자세한 [STEP3 설계](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_PDF_IMPORT_DESIGN_2026-10-19.md), [MVP 결과](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_MVP_IMPLEMENTATION_AND_CI_2026-10-19.md). Draft PR #3 main 통합 금지; 최종 수용/실제 고객 PDF 검토·별도 승인 필요.
- 진행률 비공식 STEP1 100%, STEP2 기술 구현 약99%(Windows 일부 미완료), STEP3 첫 MVP **약45~50%**, STEP4~7 미착수. 7단계 동일 비중 단순 전체 **약35%**(이전 28~29% 대비 5%p 이상 상승). 실제 난이도/남은 시간 기준 추정 아님.


## 2026-10-19 — STEP3 이미지 PNG 재구성·실제 2페이지 PDF 회귀 PASS (Draft PR #3)
- STEP3 기능 브랜치 `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 검토 상태. **main 기능 미병합**. 기존 STEP1/2 main 소스와 로컬 사용자 데이터 변경 없음.
- PDF.js operator list에서 이미지 행렬/원본 페이지 좌표를 추적하고, 지원되는 일반 XObject·inline 이미지의 **디코딩된 픽셀을 PNG로 재구성**, 이미지 누락 개수와 실패 이유·복원 썸네일·포함/제외 체크박스를 표기하도록 구현. 마스크·회전·반복/그룹·클리핑 및 색상 완전 일치는 미지원/미확인임을 경고. 원본 encoded JPEG/PNG 바이트 추출과 구분.
- 선택된 복원 PNG를 STEP2 schemaVersion2 문서의 이미지 블록/Asset에 연결, 문서+이미지+활성 ID IndexedDB **단일 atomic transaction**; 확인 이전 문서함 불변. 페이지 단위 텍스트·이미지 출처를 보존하며 이미지 위치는 근사 배치.
- **검증 코드 SHA `53c56e47a10606e381d4f5593695b7ca11bc7733`**, [feature Actions #39162038601](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39162038601) **SUCCESS**: Node 26/26, TS/Vite build, 기존 STEP1/2 Chrome/Edge 회귀 PASS. Chrome·Edge 각 실제 2페이지 이미지 PDF에서 1건 감지/PNG 1건 복원/미복원0, 명시적 확인→새 문서/이미지 IDB 저장→테마 변경/리로드→실제 A4 PDF `pdfimages -list` 이미지 존재 및 텍스트 1→2페이지 마커 순서 PASS.
- 상세: [이미지 복원·다페이지 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_IMAGE_RECOVERY_MULTIPAGE_VALIDATION_2026-10-19.md).
- **미완료:** 실제 사용자 간단한 PDF 5~10개 원문/추출·영상/이미지 육안 대조, 복잡한 클리핑·표·다단·회전/투명 이미지·고용량 성능, Windows Chrome/Edge 현장 검증. 기존 STEP2 Windows Edge 실물 PDF/장문·이미지/키보드 육안 체크리스트 NOT RUN 유지. STEP3 전체 완료/100% 선언 금지.
- 비공식 추정 STEP3 **65~70%**, 전체 7단계 동일 비중 약 **38%**(이전 약35% 대비 ~3%p, 5%p 유의미 상승 아님). 실제 개발 시간/상용 품질 기준 아님.
- 다음 단위: 혼합/미지원 이미지의 누락 감지 회귀 확장 및 실제 샘플 대조; 사용자 최종 수용·별도 승인 전 PR Draft·main 미병합 유지.

## 2026-10-19 10:29:29 KST — STEP3 미지원·잘못된 이미지 배치 누락 집계 회귀 추가
- 대상 `feature/step3-pdf-import-20261019`, 테스트 파일 `tests/step3-image-recovery.test.ts`에 3건 추가. 코드 커밋 `2200836cc529f4272e78456783d36e50f6b0142c`; GitHub 파일 재조회 blob `794a361b114df268390a8163b86dbd756fcf72d6` 확인.
- 추가 검증: (1) 마스크·XObject 반복·inline 그룹·mask 반복 4개를 `detected=4, images=0, problems=4`로 경고 집계, (2) 페이지 경계 초과/면적 0 이미지 2개를 픽셀 로드 없이 누락 처리, (3) 잘못된 배치 후 graphics-state restore로 이어지는 정상 이미지 위치 복구 확인.
- **검증 구분**: GitHub 반영/파일 재조회 PASS. 신규 Node 단위 테스트·빌드·Chrome/Edge 전체 CI 결과는 **미확인**(commit workflow 조회 0건/commit status 비어 있음); 성공이라고 표시하지 않음. 기능 `src/**` 변경 0, 제품 사용자 데이터와 원본 파일 변경 0.
- STEP3 이미지 복원 및 기존 CI 성공의 이전 근거는 `53c56e47...` / run `39162038601`이며 신규 커밋 검사 결과가 아님.
- PR #3 Draft 및 main STEP3 기능 미병합 유지. 실제 사용자 PDF 5~10개/Windows Edge·다페이지 이미지는 미검증. 단계 추정 STEP3 약65~70%, 전체 약38% 유지.
- 다음 1단위: **신규 SHA에 대한 CI 로그/테스트 확인**, FAIL이면 최소 수정과 재검증, 그 후 실제 복잡 이미지 누락 fixture 확대.

## 2026-10-19 10:48:52 KST — STEP3 신규 이미지 회귀 29/29 검증 및 Edge CI 복구
- **검증 출처:** 이전 기능+테스트 SHA `2200836cc529f4272e78456783d36e50f6b0142c`에서 [GitHub Actions #39185454384](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39185454384) **FAILURE**: Node **29/29 PASS**, `npm run build` PASS, Chrome STEP1~3 전체 스모크 PASS; 독립 Edge job의 STEP1 초기 CDP WebSocket handshake가 35초 제한에 걸려 **실행 시작 전에 실패**. Edge stderr의 D-Bus 경고는 근본원인 미확정. 해당 실패는 신규 3개 이미지 테스트 실패가 아님.
- **최소 수정:** `tests/browser-process.mjs`의 `launchBrowser().connect`에서 **Microsoft Edge만 60초**, Chrome 및 그 외 브라우저는 기존 **35초** 초기 연결 제한 유지. 앱 `src/**` / 사용자 데이터 / PDF 이미지 처리 알고리즘 수정 없음. 기능/CI SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976` (GitHub 계정 `hibi89` 커밋 신원 연결 확인).
- **재검증:** [Actions #39186875371](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39186875371) **SUCCESS**, 해당 head SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976` 고정 확인, 두 job **build-and-test / Microsoft Edge A4 PDF and IndexedDB 모두 success**. Node **29 PASS / 0 FAIL / 0 SKIP**, TypeScript/Vite build PASS, Chrome STEP1/2/3 회귀(프로필 분리·2탭·JSON A→B·마이그레이션·이미지 포함 PDF) PASS. Linux Edge 155 STEP1 A4 PDF→STEP2 저장/출력→STEP3 이미지 복원·2페이지 순서·A4 재출력 PASS. Edge STEP1 CDP 연결 로그 5번째 시도 성공. `ENOTEMPTY` 테스트용 임시 프로필 정리 경고는 비치명적.
- **안전·범위:** 신규 STEP3 회귀 3건 모두 포함한 29/29 성공. 기능 브랜치 `feature/step3-pdf-import-20261019`, Draft PR #3 **open / draft / unmerged**; STEP3 main 미병합. Linux 자동 검증은 **Windows Edge 실제 인쇄나 사용자 실제 PDF 5~10개·복잡 클리핑/회전/다단 PDF 검수에 해당하지 않음**. STEP2 Windows 사용자 수용도 일부 미검증. Vercel/Production 미적용.
- **현재 판정:** 이번 **CI 검증 1단위 완료**. 전체 단계 비공식 추정 약38%, STEP3 약65~70% 유지(실사용 정확도 증명 아님). 다음 `ㄱ`: 실제 복잡 그래픽/반복/투명 이미지 합성 fixture를 추가하고 최소 누락 감지·경고/복구 경계 검증, 또는 실제 사용자 PDF 별도 수용 검증(원본은 공개 GitHub 업로드 금지). 추가 기능/병합은 승인 조건 준수.

## 2026-10-19 11:03:17 KST — STEP3 클리핑·반복 이미지 실물 합성 PDF 경고 검증
- **한 단위 범위:** 기능 브랜치 `feature/step3-pdf-import-20261019`에서 보수적인 PDF 클리핑 위험 감지/고지 및 합성 실제 PDF 회귀 시험. 기존 정상 XObject PNG 복원과 마스크·반복·그룹 누락 카운트를 유지. 원본 클리핑 형상/픽셀 동일성 복원은 **미구현**.
- **구현:** `src/step3/imageRecovery.ts`에서 PDF.js `clip/eoClip` operator 활성 그래픽 상태를 `save/restore` 스택과 함께 추적. 클리핑 중 일반 XObject/inline 이미지는 **복원 가능하면 PNG를 유지하되** 개별 원본 대조 경고를 `problems`에 추가; `detected/recovered/omitted` 건수는 경고와 분리. 변환 로직/기존 문서 저장·보안은 변경 없음. 테스트 `tests/step3-image-recovery.test.ts` 2건 추가.
- **실제 PDF fixture:** `tests/fixtures/step3-clipped-pdf.mjs`에서 합성 1p A4 PDF의 선택 가능한 텍스트, 동일 bitmap XObject 두 번(일반/클립 `W n`)을 생성. `tests/step3-browser.mjs`에서 `pdfimages -list` 실제 이미지 표시 2회 검사→로컬 PDF.js 가져오기→클리핑 경고 표시, 복원 이미지 감지 및 **확정 전 문서함/활성 문서 불변** 확인. PNG에 원본 크롭을 실제 적용했다는 뜻은 아님.
- **검증 SHA:** `d0444b5138c29acebbe2d80ed187165a4dacd237` / [GitHub Actions #39187963241](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39187963241) **completed/success**, HEAD 일치, 실제 로그 양쪽 job **SUCCESS**. Node **31/31 PASS, 0 FAIL, 0 SKIP**, TS/Vite build PASS, Chrome STEP1~3 및 Linux Microsoft Edge155 STEP1~3 E2E 모두 PASS. 두 브라우저 로그에 `PASS STEP3 CLIPPED XOBJECT PDF` 직접 확인. Chrome 기존 멀티탭·마이그레이션·교차 프로필 JSON도 PASS.
- **안전/잔여:** 합성 데이터만 CI 사용, 사용자 PDF 외부 업로드 없음. STEP1 localStorage/STEP2 IndexedDB·원본 설계·main 기능 수정 없음. 실제 사용자 PDF 5~10개 대조, 복잡 클립 형상·투명도·벡터/회전/표·Windows 실제 인쇄/육안 **미검증**. STEP2 Windows 잔여 검증 NOT RUN 유지. 경고 검출은 **보수적**이며 실제 잘린 면적을 계산하지 않는다.
- **상태/진행률:** `Draft PR #3` open, STEP3 기능 **main 미병합**, 별도 승인 전 병합하지 않음. STEP3 비공식 약 **65~70%**, 전체 7단계 동등가중 약 **38%** 유지(품질·시간 환산 아님). **다음 `ㄱ`:** 실사용 적합성 검증에 필요한 다양한 PDF fixture/원본-결과 대조 기준 한 단위 확대; 최종 사용자 PDF와 Windows 수동 수용은 별도.

## 2026-10-19 11:24:52 KST — STEP3 합성 혼합 레이아웃 원본→재출력 대조 수용 검증 완료
- **한 단위:** `feature/step3-pdf-import-20261019`에 완전 합성 A4 2페이지 PDF fixture (`tests/fixtures/step3-mixed-layout-pdf.mjs`) 추가. 원본 좌/우 열 텍스트, 벡터 2×2 표, 컬러 래스터 XObject 1개, 원본 13개 고유 텍스트 마커. 실제 표/열 레이아웃 동일성은 주장하지 않고 원본↔검수↔A4 재출력에서 **13/13 식별자 각각 정확히 1회**·원본 페이지 구분 순서·재출력 래스터 포함·기존 문서 목록 보존을 자동 대조.
- **1차 실패:** [CI #39189111252](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189111252) `failure`(SHA `5939738a45176c54f558773def70f1ef13ce242c`). Edge 로그에 13개 원본/추출 마커는 나타났지만 **다단 경고 검출 없음**으로 실패. 시험 결과가 아닌 제품 경고 휴리스틱 문제. 
- **최소 수정:** `src/step3/structure.ts`에서 PDF.js가 분리된 좌/우 텍스트를 단일 넓은 TextItem으로 합친 경우, **글자 수에 비해 시각적 폭이 넓은 짧은 행이 2개 이상**이면 기존 `열 또는 넓은 텍스트 간격` 경고를 보수적으로 표시. 텍스트/이미지 복원이나 자동 순서 재배열은 변경하지 않음. `tests/step3-structure.test.ts` 신규 회귀 1건. 정상 폭넓은 본문도 경고할 수 있으므로 원본 확인을 요구하는 휴리스틱임을 유지.
- **최종 검증:** GitHub Actions [#39189525347](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189525347) `completed/success`, HEAD `0c6061b40286d7a859d8505995ad253f48da9665`. Node **32/32 PASS, FAIL 0, SKIP 0**; TS/Vite build PASS. Chrome 전체 STEP1/2/3 회귀·Linux Edge155 STEP1/2/3 회귀 PASS. 양 브라우저 로그에 `STEP3 MIXED WARNING COUNT: 3 column= true`, `PASS STEP3 MIXED REVIEW`, `PASS STEP3 SOURCE/REPRINT COMPARISON`(13/13·A4·이미지·문서 보존) 확인. 기존 다페이지·클리핑·저장/복원 테스트 유지.
- **출력 검증 경계:** 원본 `pdfinfo` 2p A4, `pdfimages` 래스터 1, `pdftotext` 13개 marker. 결과는 재디자인 문서의 `pdftotext` 13개 마커·A4·raster 유무만 확인. PDF 페이지수 동일성·열 순서·표 선/셀 구조·이미지 픽셀 색상/크롭 정확도 **미검증**. 사용자 실제 5~10개 PDF·Windows Chrome/Edge 육안·STEP2 잔여 수용도 **NOT RUN**.
- **소스/문서:** 기능 검증 SHA `0c6061b40286d7a859d8505995ad253f48da9665`; feature의 [검증 보고](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_MIXED_SOURCE_REPRINT_ACCEPTANCE_2026-10-19.md) 문서 커밋 `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5`(CI 이후 docs-only). `Draft PR #3` open/draft/unmerged, **main STEP3 기능 미병합**. 기존 STEP1/2 사용자 데이터 무변경·외부 업로드 없음. 로컬 프로그램으로 Production/Vercel 미적용.
- **진도/다음:** 이번 수용 테스트 한 단위 **완료**, STEP3 약65~70% / 전체7단계 약38%는 비공식 추정 유지. 다음 `ㄱ`: 오탐·열 순서와 벡터 표 누락에 대한 원본 대조 지표/실사용 수용 체크 확장. 실제 사용자 PDF 검증과 병합은 원본/승인 확보 후 수행.

## 2026-10-19 13:27:43 KST — STEP3 벡터 경로/표 구조 손실 위험 계측 및 브라우저 검증
- **목표와 구현:** 기존 PDF 업로드 시 원본 표 선/벡터 도형이 STEP3의 텍스트·PNG 중심 모델에서 자동 복원되지 않는 위험을 **실제 PDF.js 경로 관련 명령 수(근사치)**로 명시. `src/step3/vectorRisk.ts` 신규, `src/step3/pdf.ts` getOperatorList 연결, `src/step3/structure.ts` 페이지별 경고·집계, `src/step3/ImportPanel.tsx` 총합/페이지별 표시. 이 값은 표 셀·도형·선 수나 보존율이 **아니다**. 출력에 벡터 표 형상을 재생성하지 않음. 기존 문서 저장/이미지 복원 동작은 유지.
- **실제 실패 근거:** 초기 코드 `c1873cb73acd4f43a13b11d32aa735ddacfa9b1e`, [Actions #39198865094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39198865094) **FAILURE**. Node **35/35 PASS**, build PASS, Chrome/Edge 양쪽 실제 합성 PDF 벡터 경로 표시에 **0회**가 나와 E2E FAIL. PDF.js 최적화 경로의 `constructPath` 묶음을 `stroke/fill` 단독 계수가 놓친 오류. 기존 동일 접근 무의미 반복 금지.
- **수정/검증:** `constructPath` 묶음이 있으면 묶음 개수, 없으면 페인팅 명령 수를 **위험 지표**로 사용; 중복 가산 방지. **최종 검증 SHA `f132adbeb70ea43c38cecfb3841b36cbd773951b`**, [Actions #39199224379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39199224379) `completed/success`, 2026-10-19T04:26:04Z. Node **35/35 PASS, fail0, skip0**, TS/Vite build PASS, Chrome STEP1~3 및 Linux Edge155 STEP1~3 전체 회귀 PASS(두 job 직접 로그 확인). 실제 합성 2p A4 PDF는 원본 벡터 관련 명령 **3회**, 누락/구조 경고, 2열 읽기 순서 경고, 원본·검수·출력 **13/13 마커 보존**, raster XObject 1 포함, 기존 문서 불변 PASS.
- **테스트:** `tests/step3-vector-risk.test.ts` 신규 3개 단위 검사, `tests/step3-browser.mjs` 실제 혼합 문서에 위험 수치·경고·이미지·내용 무손실 비교 추가. 별도 [검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_VECTOR_STRUCTURE_RISK_VALIDATION_2026-10-19.md) feature docs-only SHA `63f43b1b94730a6a3e5d8e9232035a96157c20ae`. 보고서 커밋은 CI 검증 SHA와 **구분**.
- **안전·미검증:** 사용자 원본 PDF/STEP1 localStorage/STEP2 IndexedDB 및 main 앱 기능 무변경. OCR, 벡터 표 선/셀 구조·다단 정확한 순서, 벡터 도형의 출력 보존율, 이미지 색상/크롭/픽셀 동일성, 실제 사용자 PDF 5~10개, Windows Chrome/Edge 출력·육안 **미검증**. 수치 0이라도 모든 도형 보존을 보증하지 않음. 합성 자료만 CI에 사용.
- **상태:** STEP3 `feature/step3-pdf-import-20261019` [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/**unmerged**. **main STEP3 미병합**; Production/Vercel 미적용(로컬 앱). 비공식 STEP3 약65~70%, 전체 7단계 약38% 유지. **다음 `ㄱ`:** 벡터 오탐/리스크 계측에 대한 예외 및 사용자 검수 기준 추가 또는 실제 샘플 PDF 수용 검증. main 병합·STEP4는 별도 승인 전 착수 금지.

## 2026-10-19 13:48:10 KST — STEP3 클리핑 경로 오탐 제거·원본 대조 체크리스트 CI 검증
- **수행 범위:** `src/step3/vectorRisk.ts`의 클리핑 전용 `constructPath` 오탐 개선(클립 전·후 연산자 순서 모두 처리), `src/step3/ImportPanel.tsx` 검수 체크리스트 4항목(텍스트·숫자, 다단/표 읽기 순서, 표 선·벡터 구조, 이미지 크롭/복원) 노출. 원본 문서 저장 방식/STEP1·2/표 구조 자동 재구성 기능 불변. 체크리스트는 안내용이고 항목별 개별 승인을 강제하지 않음.
- **실패 경과/원인:** 첫 코드 `03b2a527...` CI [#39200328670](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200328670) E2E의 테스트 따옴표 `SyntaxError`로 FAIL. 구문 보정 `595369018...` CI [#39200525378](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200525378)은 **실제 clip-only PDF 위험 1회** 오탐으로 FAIL. `pdfjs-dist`에서 동일 합성 PDF operator list를 직접 파싱한 `117e4a133...` CI [#39200817859](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200817859) 단위 37 PASS·1 FAIL로 원인 확정: PDF.js가 **`clip > constructPath`**를 전달(기존 가상 단위 테스트는 `constructPath > clip` 순서만 가정). 동일 방식 반복 없이 양쪽 순서 분리 판정으로 수정.
- **최종 검증:** **코드 SHA `90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee`** [Actions #39200950625](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200950625) **completed/success**(2026-10-19T04:46:15Z). Node **38/38 PASS, 0 FAIL, 0 SKIP**, TS/Vite build PASS, Chrome STEP1/2/3 및 Linux Edge155 STEP1/2/3 두 job 성공. 양쪽 E2E 로그에 `PASS STEP3 CLIP-ONLY VECTOR CONTROL`(클립 전용 PDF 벡터 0, 기존 이미지 클립 경고 유지), `PASS STEP3 CHECKLIST`(4항목), `PASS STEP3 MIXED VECTOR RISK`(혼합 PDF 벡터 위험 3), `PASS STEP3 SOURCE/REPRINT COMPARISON`(13/13 마커·래스터·A4·기존 저장 문서 무손상) 확인.
- **검증 문서:** feature docs-only commit `d1a89d8b6a96f72225208e5a9b1144e5413eaa92`, `docs/STEP3_VECTOR_CLIP_FALSE_POSITIVE_AND_REVIEW_2026-10-19.md` ([보기](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_VECTOR_CLIP_FALSE_POSITIVE_AND_REVIEW_2026-10-19.md)). CI 성공은 앞선 코드 SHA 기준이며 후속 문서 전용 커밋과 구분.
- **검증 한계:** PDF.js의 클립·페인트 합성 연산자에서 오탐/누락 가능성, 표 선/셀·다단 정확한 순서, SVG/특수 벡터/주석, 이미지 픽셀/투명도 정확성, 실제 사용자 PDF 5~10개/Windows Chrome·Edge 실출력·육안 **미검증**. 경로 위험 수치 0이어도 원본 그래픽 완전 보존을 의미하지 않음. synthetic fixture만 테스트, 외부 서버 업로드 없음.
- **상태/다음:** `feature/step3-pdf-import-20261019` Draft PR #3 open/draft/unmerged; **main 기능 미병합**, Vercel/Production 미적용. 비공식 STEP3 65~70%, 전체 약38% 유지. 다음 `ㄱ`: 클립+페인트 혼합/투명도 등 누락·오탐 경계 추가 또는 사용자 수용 판정 기준 확대. 기능 병합/STEP4 착수는 사용자 별도 승인 전 금지.

## 2026-10-19 14:06:12 KST — STEP3 클립+벡터 페인팅 혼합 PDF 실제 OperatorList 오탐/누락 검증
- **목표·구현 범위:** PDF.js `constructPath`가 경로를 그리지 않고 끝낸 `W n`과 같은 경로를 클리핑하며 그린 `W S`를 구분. `src/step3/vectorRisk.ts`에서 실물 `argsArray[i][0]`로 packed terminal `OPS.endPath`(클립-only)는 위험 카운트 제외, `OPS.stroke/fill`(실제 그리기)은 clip이 선행하더라도 위험에 포함. `argsArray` 없는 기존 synthetic/legacy path는 clip 인접 fallback 유지. PDF.js 6.4.299 기준. **실제 표 셀/원형 도형 복원 기능을 구현한 것은 아님**.
- **신규 재현·테스트:** `tests/fixtures/step3-clipped-pdf.mjs`에 선택적 클립 안/밖 stroke, 바깥 fill, 동일 경로 W S 매개변수 추가(기본 기존 fixture 유지). `tests/step3-vector-risk.test.ts`에서 **6가지 실제 합성 PDF를 PDF.js로 직접 파싱**, 원래 terminal op 기반 W n/W S/W f 회귀 +1. `tests/step3-browser.mjs`에서 같은 경로 clip+stroke의 벡터 위험 양수 및 기존 클립된 이미지 경고·문서함 무변경 검증.
- **처음 발견한 실제 실패:** 검증 목적 테스트 `be35e185b3cbce371ec4edce3401568024506cc4` [Actions #39202071379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202071379) Node **38/39**, `W S` 같은 경로를 위험 0으로 누락. 진단 `0281d6cdac11915b2ebd02a6549fdac640ffcbbb` [#39202172463](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202172463)에서 진짜 PDF.js `clip > constructPath`의 `argsArray[i][0]`: `W n`은 **28(endPath)**, `W S`는 **20(stroke)** 확인. Mozilla pdf.js evaluator가 원래 terminal `fn`을 `constructPath` 첫 인자에 전달한다는 소스 구조와 일치. 매직 숫자는 코딩하지 않고 `OPS` 상수와 비교.
- **최종 검증:** 코드 SHA **`4b527401cc8bdba9218b9aba4fca5537e24c77cc`**, [Actions #39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889) **completed/success** (2026-10-19T05:04:16Z), Node **40/40 PASS/FAIL0/SKIP0**, TS/Vite build PASS, Linux Chrome 전체 STEP1~3·Edge155 전체 STEP1~3 CI jobs 모두 success. 양쪽 실제 로그 `PASS STEP3 CLIP-ONLY VECTOR CONTROL`, `PASS STEP3 CLIP+STROKE PDF`, `PASS STEP3 MIXED VECTOR RISK`, `PASS STEP3 SOURCE/REPRINT COMPARISON`: 클립-only 위험 0, W S 위험 양수, 혼합 2p 표 경로 위험 3, 텍스트 13/13·A4·raster·기존 문서 보존.
- **변경·위험 경계:** STEP1/2 앱·IndexedDB/localStorage 사용자 문서 무변경, 기능 변경은 벡터 계측과 합성 테스트만. 실제 PDF 사용/외부 전송 없음. pdf.js 버전·특수 XObject/클리핑+투명도/주석·벡터 표 원형 복원·다단 실제 순서·이미지 픽셀/색상·Windows 실환경·실제 사용자 PDF 5~10개는 **미검증**. 위험 수치 0도 완전 보존 증명이 아님.
- **문서·PR:** [상세 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_MIXED_CLIP_AND_PAINT_RISK_VALIDATION_2026-10-19.md) feature docs-only SHA `90b7e995f263701e57aede91a8bf0e44b2778d80` (CI 코드 SHA와 구분). `feature/step3-pdf-import-20261019` Draft PR #3 open/draft/**unmerged**, main STEP3 기능 미병합. Vercel/Production 배포 없음. STEP3 비공식 약65~70%, 전체 약38% 유지.
- **다음 `ㄱ`:** pdf.js Form XObject/투명도 등의 또 다른 누락 경계 또는 실사용 수용 품질 1단위 시험. main 병합 및 STEP4 사용자 별도 승인 전 금지.

## 2026-10-19 14:19:35 KST — STEP3 투명도/Form XObject 원본 합성 위험 탐지 및 CI 검증
- **목표/방법:** 사용자 PDF의 투명도/알파/혼합모드/투명 그룹 및 Form XObject가 PDF→PNG/블록 재구성에서 누락·왜곡돼도 성공으로 오인하지 않게 **손실 위험 신호**를 원본 검수 UI에 노출. PDF.js `getOperatorList()`의 `OPS.setGState` `CA/ca<1`, 비정상 `BM`, 활성 `SMask`, `OPS.beginGroup`, `OPS.paintFormXObjectBegin` 범위를 구분. **신호 개수=객체 수/픽셀 동일성/복원율 아님**, Form/투명 효과를 실제로 재현하지 않음.
- **변경:** 신규 `src/step3/graphicsRisk.ts` 순수 스캔; `src/step3/pdf.ts` → `structure.ts` 페이지별 compositionRisk 및 원본 검수 경고 전달; `ImportPanel.tsx` 합성 위험/폼 범위 총합·4항목 체크리스트 문구 강화. 이전 STEP1/2 저장 로직, 이미지 PNG decode, 다단/표 위험 지표, 원본/기존 문서 데이터 **무변경**.
- **검증 데이터:** 완전 합성 A4 1p, 선택 가능한 ASCII 텍스트 마커 2개, Form XObject 내부 bitmap XObject+벡터 rectangle, `ExtGState alpha 0.4 + 투명 Group`과 `alpha 1 + 일반 Form` variant. Probe-only SHA `67646c0d4233df350b78c36f5e7d7de69ba3c424` [Actions #39203296609](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203296609) **SUCCESS**로 실제 PDF.js Form/graphics op 노출 확인.
- **최종 PASS:** 코드 `1ebbb7958c477c309e22e24fed7255658f56b58b` [Actions #39203639740](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203639740) **completed/success** (2026-10-19T05:18:05Z), Node **43/43 PASS, fail0, skip0**, TS/Vite build PASS, Linux Chrome STEP1/2/3 + Microsoft Edge155 STEP1/2/3 두 CI job SUCCESS. 두 브라우저 로그: 투명 Form **투명도 합성 위험 신호 3 / Form 범위 1**, 불투명 Form **투명도 위험 0 / Form 범위 1**, 원본 선택 가능한 텍스트 유지·검수 전 기존 문서 불변. 이전 clip-only/clip+stroke 및 2p 표/이미지/원본-출력 **13/13** 회귀 유지.
- **산출/문서:** `tests/fixtures/step3-transparency-form-pdf.mjs`, `tests/step3-transparency-form.test.ts`, `tests/step3-browser.mjs`. [상세보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_TRANSPARENCY_FORM_RISK_VALIDATION_2026-10-19.md) feature docs-only SHA `faec84e388da0f7a6d71f71c1b8d14e18d9f3098` (CI 검증 대상은 이전 코드 SHA와 구분).
- **제한/상태:** 실제 5~10 사용자 PDF/Windows Chrome·Edge 장문·인쇄/육안, 투명도 픽셀·Form 내부 조합 보존/SoftMask 실물 수용·주석/복잡 Form 미검증. Risk 0이라도 완전 복원 보장하지 않음. [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/**main STEP3 기능 미병합**; STEP4 미착수, Production/Vercel 미적용. 비공식 STEP3 약65~70%/전체 약38% 유지.
- **다음 `ㄱ`:** 중첩 Form·SoftMask·BlendMode 합성 실제 PDF 오탐/누락 경계 또는 실문서 acceptance 평가 단계 1단위. main 병합 및 STEP4는 사용자 별도 승인 전 금지.

## 2026-10-19 14:48:11 KST — Windows Electron 설치형 MVP 개발 브랜치 / Windows 실물 EXE 자동검증
- **사용자 요구:** 구매자가 CLI/Node.js 없이 설치 EXE 더블클릭으로 Windows 데스크톱 ASTRA를 사용하도록 준비. 기존 STEP3 개발/합병과 분리된 신규 브랜치 `feature/windows-electron-package-20261019` (기존 main STEP1/2 기반). **STEP3 PDF 가져오기 기능은 아직 이 설치 파일에 포함되지 않음**.
- **구현:** Electron 44.9.0+electron-builder 26.15.3, 보안 표준 앱 프로토콜 `astra://app`, React/Vite 상대 번들, Windows NSIS x64 Installer, 앱 전용 userData의 IndexedDB/localStorage, Windows native Save dialog, 외부 HTTP(S)/새 창 금지, context isolation/sandbox.
- **CI 검증 코드 SHA:** `ab89fcb85ce2a847eba751254543983b50a59d82`; [Windows Actions #39205924586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586) **completed/success** (2026-10-19T05:44:30Z). STEP1/STEP2 Node **16/16 PASS**, 데스크톱 보안/번들 경로 **3/3 PASS**, TypeScript/Vite build PASS, 실제 Windows Electron 개발용 실행 + `win-unpacked/*.exe` **패키징 실행** 각각 PASS (React 렌더, Print API 존재, IndexedDB 생성, localStorage 새로고침 유지).
- **EXE:** `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe` 실제 Windows NSIS 빌드/해시/Actions 업로드 PASS. SHA256 `26B6C2DEC5453A1C6233E7C7BED1ACECEE077F88103C757034A8D93F4A0A8FBC`. [시험용 ZIP Artifact #12165647731](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586/artifacts/12165647731), 약112MB, 서명/배포 적합성 미확인. 디렉터리 `release/`는 gitignore, GitHub repo에는 설치 바이너리 커밋하지 않음.
- **증거·브랜치:** [개발 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_ELECTRON_PACKAGING_2026-10-19.md) doc-only commit `a6050ffe9c50e073804b16e4432db50ec35d69f7`. [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) **open/draft/unmerged**. STEP3 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) **unmerged**; main 앱 기능/기존 저장 데이터 무변경.
- **유효 범위/금지:** 아직 실제 고객 Windows PC에 설치·삭제·재설치·업그레이드, Windows 한글/이미지/장문 PDF 수동 인쇄, JSON 수동 데이터 이동, 아이콘·코드 서명/SmartScreen/EULA/유료 라이선스·STEP3 실문서 PDF 검증 **NOT RUN**. 무서명 시험용 Artifacts 고객 판매 금지. 기존 Chrome/Edge 브라우저 데이터가 Electron으로 자동 이동되지 않음을 명시. 비공식 전체7단계 진행률 약38%는 유지(패키징은 별도 상품화 트랙).
- **다음:** Windows 10/11 실제 설치/삭제 및 인쇄 수용, `.localdoc.json` 가져오기/내보내기와 버전 간 사용자 데이터 보존 검증. 실제 STEP3 탑재는 PR3 별도 검증·명시 승인 뒤, PR4/main 병합도 별도 승인 전 금지.

## 2026-10-19 15:01:21 KST — Windows Electron GUI 원본 PDF 저장 시험판(별도 기능 브랜치) 검증
- 사용자 목표: 고객에게 Node/npm/CLI를 요구하지 않는 Windows GUI 설치 프로그램 형태로 ASTRA를 배포. 안정된 STEP1·2 main 기반으로 별도 feature/windows-electron-package-20261019 브랜치를 사용했으며 STEP3 Draft PR #3 **미포함**, main 기능 **미병합**.
- 기존 Electron 44.9.0 / electron-builder 26.15.3 Windows x64 NSIS unsigned installer 및 secure astra://app 프로토콜, sandbox/컨텍스트 격리, IndexedDB/localStorage 프로그램 저장 분리 구조를 그대로 유지.
- 이번 코드 변경: desktop/preload.cjs에서 단일 제한된 astraDesktop.savePdf() 브리지 노출, desktop/main.cjs에서 앱 창/Origin 검사·Windows showSaveDialog·webContents.printToPDF(A4/CSS·배경 포함)·파일 저장·취소/오류 상태 처리. src/desktopPdf.ts 웹 window.print fallback, STEP1 App·STEP2 Workspace GUI 연동. STEP2 이미지 decode/font ready/저장 flush 검사 전제 유지.
- 실제 Windows GitHub Actions [#39206761720](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720) completed/success, 코드 SHA e11076cf77946416bc59bcaa88227c8265499ab3. Node **19/19 PASS**(기존16+추가3), desktop 보안 테스트 **3/3 PASS**, TypeScript/Vite build PASS, 개발 Electron과 패키징된 win-unpacked EXE의 secure origin·로컬 IndexedDB/localStorage·IPC PDF 파일 생성·저장·재읽기 **모두 PASS**(15,257 bytes). 테스트는 격리된 임시 userData에만 기록하고 삭제.
- 실제 테스트 NSIS 파일 ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe, SHA256 1FEB8C6801EB2870479955A5669B9405AC3117490A99954230AECB1470D3C84C. [Actions Artifact ID 12165323804](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720/artifacts/12165323804) ZIP 112,306,801 bytes, 7일 보존(2026-10-26 만료 예정), unsigned **시험판**이며 고객 배포 릴리스 아님.
- 코드 검증 이후 데스크톱 보고서/README docs-only SHA d62f89b7ebc04eb0de3b6b2c44363c2e08996312; [Windows 데스크톱 GUI PDF 저장 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_DESKTOP_NATIVE_PDF_EXPORT_2026-10-19.md) 참조. CI 성공은 이전 코드 SHA 대상임.
- **미검증:** 실제 NSIS 고객 PC 설치/재설치/삭제·바탕화면 바로가기, 저장창 사용자가 직접 폴더/취소/덮어쓰기 조작, 한글·장문·이미지 PDF 육안/A4 출력, 사용자 기존 웹 문서→데스크톱 이관, 코드 서명/SmartScreen, 상용 사용권/업데이트/지원. Smoke는 사용자 폴더가 아닌 임시 프로필 파일 기록으로 실제 PDF 생성만 검증.
- 기존 STEP3의 CI Node43/43·Linux Chrome/Edge SUCCESS 상태와 Draft PR #3 미병합 및 사용자 실제 PDF 5~10개·Windows 시각 검수 미완료 상태 그대로. STEP4~7은 별개, 7단계 전체 비공식 진행률 약38% 유지. **다음 개발:** 실설치·실 PDF·아이콘/서명 게이트 검증, STEP3 통합은 별도 승인 후 수행.

## 2026-10-19 15:13 KST — Windows NSIS 실제 무인 설치·앱 실행·제거 자동 수용 검증
- **완료 범위:** 별도 `feature/windows-electron-package-20261019`/Draft PR #4에서 기존 unsigned Windows x64 NSIS 설치 파일을 **GitHub-hosted Windows 러너**에 실제 `/S /D=격리된 임시폴더` 설치 → 설치된 앱 런타임+PDF 생성 → `/S` 제거까지 검증. `main` 앱 기능/STEP3 Draft PR #3 **변경·병합 없음**.
- 변경 파일: `tests/windows-installer-lifecycle.ps1` 신규(Windows GitHub Actions+RUNNER_TEMP만 허용, 임시경로 사전 확인, 설치 exe/Uninstall exe 확인, 바탕화면·시작메뉴 shortcut 검증, 실제 설치 EXE `--astra-desktop-smoke` 실행, silent 제거, 설치 경로/shortcut 제거·synthetic userData marker 값 보존, 제한적 cleanup), `.github/workflows/windows-desktop.yml` 패키징 이후 수명주기 검증 필수 단계, `tests/desktop-shell.test.cjs` 안전 제약 단위 테스트 +1.
- **실제 증거:** CI 코드 SHA `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5`, [Windows Actions #39208406254](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254) `completed/success`, 2026-10-19T06:13:03Z. Node **19/19 PASS fail0 skip0**, desktop 보안/수명주기 **4/4 PASS**, TypeScript/Vite build PASS, 기존 dev Electron/packaged EXE smoke PASS, **실제 설치된 EXE** React·IndexedDB/localStorage·PDF 파일 15,257 bytes 저장/재읽기 PASS. 실제 log `PASS ASTRA NSIS INSTALL`, `PASS ASTRA NSIS SHORTCUTS: desktop=1 start-menu=1`, `PASS ASTRA INSTALLED EXE`, `PASS ASTRA NSIS UNINSTALL`(설치 경로·두 링크 제거, 합성 userData marker 유지).
- **신규 test artifact:** `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe` **미서명 개발용 테스트**, SHA256 `C49D217B48ECA4ABAA80296D2E03C80D0C331F8148C361D6C267DB5918A7977A`; [ZIP Artifact 12165714586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254/artifacts/12165714586), 112,306,806 bytes, 만료 2026-10-26T06:12:54Z. **이전 ZIP/SHA는 구 시험 버전이므로 최신 링크와 혼동 금지**.
- **한계:** Windows runner silent `/S` 자동 설치/제거는 성공했으나 실사용 Windows 10/11 고객 PC의 보이는 설치 마법사·권한·스마트스크린/백신·저장 대화상자 버튼·장문/한글/표/이미지 PDF 육안 및 정식 코드 서명/업데이트는 **NOT RUN**. appData 유지 판정은 합성 마커 1개에 한정, 실제 고객 데이터 업그레이드 보존이나 STEP3 포함 증명이 아니다. Electron 시험판은 여전히 **STEP1·2 전용**.
- [Windows 설치·제거 상세 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_NSIS_INSTALL_UNINSTALL_ACCEPTANCE_2026-10-19.md), 기능 검증 SHA `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5` / 그 뒤 docs-only SHA `b13ec1feb02cda3cbea63280b25da8bfdcc8e7a5` 구분. PR4 Draft/open/unmerged; STEP3 Draft PR3 별개, 메인 기능 병합/STEP4 착수 명시 승인 전 금지. 기존 로드맵 전체 비공식 약38% 유지(데스크톱 별도 트랙).
- **다음 `ㄱ` 작업:** A4 실제 PDF 원본-출력 규격·한글·복수 페이지와 이미지 보존을 구조 수준으로 자동 검증하고, 고객 실기 GUI/수동 육안 검수는 별도 미검증으로 유지. 또는 설치 업데이트 후 합성 IndexedDB 데이터 보존 검사 1단위.

## 2026-10-19 15:38:16 KST — Windows 설치형 실제 출력 PDF A4·한글·2p·이미지 구조 검증
- **기능/CI:** Windows 독립 Draft PR4 코드 SHA `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`, [Actions #39210319075](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075) **completed/success**(2026-10-19T06:33:02Z). Node **19/19 PASS**, desktop security/fixture **5/5 PASS**, TypeScript/Vite build PASS, GitHub Windows NSIS 임시 설치·실제 EXE 실행·PDF 디스크 생성·파일 재검증·silent 제거·shortcut/userData 합성마커 보존 PASS.
- **실제 PDF 내용 근거:** 설치된 Electron EXE에서 렌더링한 합성 문서를 임시 파일에 저장하고 dev 전용 `pdfjs-dist@6.4.299`로 재파싱. **A4 정확히 2페이지**(폭 ~595.28pt/높이 ~841.89pt), 페이지 분리·식별자 순서, **한글·숫자·라틴 문자 6/6 각각 1회**, PNG 래스터 draw opcode **1건** 확인. 실측 로그 `PASS ASTRA INSTALLED PDF CONTENT: A4 x 2, Korean/numeric markers 6/6, raster draw 1`.
- **구현:** `desktop/pdf-acceptance-fixture.cjs`가 64x64 합성 RGB PNG를 생성하여 STEP2의 실제 `.paper-surface` 미리보기 DOM에 두 페이지와 한글 문장 삽입; `desktop/main.cjs`의 `--astra-desktop-smoke --astra-pdf-acceptance`는 `GITHUB_ACTIONS`/`RUNNER_TEMP` 안전 게이트를 통과해야 실행. `tests/verify-desktop-pdf.mjs`에서 MediaBox·text·image operator 대조, `tests/windows-installer-lifecycle.ps1`에서 검증 후 PDF 1개 정리, shell 단위 검사 +1. **실제 고객 프로젝트 데이터/IndexedDB 변경 없음**.
- **아티팩트:** unsigned 시험 NSIS `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, SHA256 `FC91757AA962C167BA8D814A3F939ECBE3562085C45F5C32C894E4D16D0158D7`, [Artifact #12167606844](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075/artifacts/12167606844), 112,308,696 bytes ZIP, 2026-10-26T06:32:53Z 만료. 기능 CI SHA `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`와 문서-only feature SHA `fa7c760332c89f36731f3176630b4997ee5185a3` 구분.
- **미검증/한계:** 이번 내용 대조는 **합성 미리보기 DOM**에 한정됨. 실제 STEP2 편집/저장 UI를 거친 고객 장문 문서, 표·이미지 픽셀 동일성·한글 글꼴 육안, Windows 저장 대화상자 수동 조작·SmartScreen·업그레이드·서명·상용 판매 인수 **NOT RUN**. STEP3 PDF 가져오기 기능은 현재 Windows 시험판에 **미포함**.
- **브랜치·다음:** [Windows Draft PR4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) open/draft/unmerged; [STEP3 Draft PR3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 별개. main 기능 병합/STEP4 착수는 사용자 명시 승인 전 금지. 비공식 전체 약38% 유지, Desktop 상품화 별도. [상세 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_PDF_CONTENT_ACCEPTANCE_2026-10-19.md). 다음 `ㄱ`: 실제 STEP2 합성 프로젝트 데이터 저장→PDF 구조 대조 또는 Windows 앱 업그레이드 사용자 프로필 보존 검증.

## 2026-10-19 16:11:22 KST — Windows STEP2 실제 저장 프로젝트 PDF 자동 수용 PASS
- 대상 Windows 별도 기능 브랜치 `feature/windows-electron-package-20261019`, [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4). **main 기능 코드 미수정**, STEP3 Draft PR #3 미수정·미병합.
- 검증 코드 SHA `c5113056ed4b779b245a50fd42d33a32b46d4b1b`, [GitHub Windows Actions #39214047605](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605) `completed/success` (head_sha 일치, 2026-10-19 16:11:22 KST).
- Node **19/19 PASS**, desktop 보안/수용 연결 **6/6 PASS**, TS/Vite build, 개발용 Electron, 패키지 EXE, NSIS 실제 silent 설치/제거·단축키/합성 userData sentinel 검증 **PASS**.
- 새 단계: React STEP2 실제 편집 화면에서 합성 한글·숫자·장문 65행·PNG 2×2 입력 → `IndexedDB` 문서/asset 저장 → Electron 앱 URL 재로드 후 저장 데이터 직접 검사 및 이미지 디코딩 → 실제 설치된 EXE `printToPDF` 출력 파일 저장 → 별도 PDF.js로 **A4 3페이지, 식별자 5/5 각 1회, 래스터 draw 1, 문서함 이름 인쇄 누락 없음** 검증 **PASS**. 이전 직접 DOM 주입 A4 2페이지·6/6 출력 검사도 PASS 유지.
- 테스트 구현 `desktop/step2-project-acceptance.cjs`, `desktop/main.cjs`의 CI 전용 모드, `tests/windows-installer-lifecycle.ps1`, `tests/verify-desktop-pdf.mjs`, `tests/desktop-shell.test.cjs`. 기능 정상 경로/고객 DB/원본 수정 없음.
- 기능 성공 CI 이후 feature docs-only 커밋 `883568e2f0f47186cb561c9d82bbc985a3cb4742`, 상세 보고서 `docs/WINDOWS_STEP2_STORED_PROJECT_PDF_ACCEPTANCE_2026-10-19.md`. 시험용 unsigned EXE SHA256 `60048F38227DB08C43F9BC073938AC94D1BFD94A07AF91C424654EB9B8E134E6`; [Artifact 12168803144](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605/artifacts/12168803144), ZIP 112,310,427 bytes·2026-10-26T07:11:12Z 만료.
- **NOT RUN:** 고객 실문서 5~10개·PDF 픽셀/표·한글 폰트 육안, Windows 저장창 수동 클릭/취소/덮어쓰기/실사용 PC SmartScreen, 실제 데이터 업그레이드 보존, 코드 서명·정식 판매. STEP3 PDF 가져오기는 Windows 설치형에 **미포함**. PR3/PR4 Draft/open/unmerged; 병합·STEP4 승인 전 금지. 전체 비공식 약38% 유지, 데스크톱 별도 상품화 트랙.
- **다음 `ㄱ`**: 동일 사용자 프로필에서 설치판 버전 업그레이드 전후 합성 STEP2 문서+PNG IndexedDB 보존(기존 sentinel 1개 검증 확대)을 한 단위 검증. 사용자 실제 문서는 외부 CI로 올리지 않음.

## 2026-10-19 16:22:28 KST — Windows STEP2 동일 프로필 별도 EXE 재실행 보존 PASS
- PR4 feature 코드 `0c627cdca0668a6f7548a1407eb8d5088faaa264`, [Windows CI #39215369203](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39215369203) `completed/success` (head SHA 일치), Node 19/19·desktop 6/6·빌드·NSIS 설치/제거 PASS.
- 실제 STEP2 UI 합성 문서+PNG IndexedDB 저장 → A4 3페이지/식별자 5/5/래스터 1 출력 → **별도 설치 EXE 두 번째 프로세스에서 동일 CI 격리 프로필로 재실행, 문서·이미지·캡션·자산·실제 이미지 디코딩 보존 PASS**. 로그 `PASS ASTRA STEP2 PROFILE PRESERVED`, `PASS ASTRA STEP2 SECOND EXE LAUNCH` 확인.
- 보고 `docs/WINDOWS_STEP2_RESTART_PRESERVATION_2026-10-19.md` (PR4 feature docs commit `4249efe10b7959a7899b7af9e7b8a78ac237c1eb`). 시험용 unsigned EXE SHA256 `AB74148E4DD30CBB7C9996790271AF4832DDD0A6896856211F53FDDB5D3E6AD2`, [Artifact #12169552072](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39215369203/artifacts/12169552072) 112310681 bytes, 2026-10-26T07:22:28Z 만료.
- **미검증**: 동일 버전 재실행이며 **서로 다른 버전으로 업그레이드 아님**. 실제 고객 PC GUI/실문서 품질·코드서명/SmartScreen/상용 수용 미검증. PR3/PR4 Draft/open/unmerged, STEP4·main 기능 병합 별도 승인 전 금지. 전체 7단계 비공식 약38% 유지.
- 다음 `ㄱ`: 상이한 버전 두 빌드로 동일 CI 프로필의 실제 STEP2 문서+PNG 보존/재출력 확인. 고객 데이터 사용 금지.

## 2026-10-19 16:33 KST — NSIS 두 버전 실제 업그레이드 STEP2 문서·PNG 보존 PASS
- Windows CI [#39216361190](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39216361190) **completed/success** / 검증 소스 SHA `5b5a833dd9611f9dd0d90af803c6ce7b0735cc0d`; Node 19/19, desktop 6/6, Vite/Electron/NSIS 회귀 PASS.
- CI에서 별도 0.1.0/0.1.1 NSIS 설치 파일 생성. **0.1.0 실제 설치 → STEP2 UI 합성 문서+PNG IndexedDB 저장 → PDF.js A4 3쪽/텍스트 5/5/래스터1 확인 → 0.1.1 동일 경로 덮어 설치 → 새 EXE에서 기존 문서/PNG 복원 → 제거** 실제 Windows runner 로그 PASS.
- 0.1.1은 **CI에서만 패키지 버전 번호를 바꾼 동일 앱 코드·동일 저장 스키마 빌드**. 따라서 **버전만 다른 설치 패키지 업그레이드 시 데이터 보존**을 검증한 것이며 **기능 코드/스키마 변경에 따른 마이그레이션은 미검증**. 고객 PC 수동 인수, 서명·SmartScreen, 실문서 시각 품질도 미검증.
- 근거 [PR4 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_NSIS_VERSION_UPGRADE_STEP2_PERSISTENCE_2026-10-19.md), feature docs 커밋 `057ccef81b97dd741c46002c28292bfdf544362f`; unsigned CI 전용 0.1.1 EXE SHA256 `EBDD0945CCF242CA126A109DA20772D3854DB0A292E5A39BBE28977F83F559FA`, [Artifact #12169723064](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39216361190/artifacts/12169723064), 2026-10-26 만료.
- 다음 `ㄱ`: 기존 앱 코드 또는 IndexedDB 스키마 **실제 변경**을 재현한 호환성 검사 가능성 확인 및 작은 단위 실행. PR3·PR4 Draft/open/unmerged, main 기능 병합/STEP4 별도 승인 전 금지; 전체 7단계 추정 약38% 유지.


## M09-B final 10-point handoff — 2026-10-27 KST
1. **Objective/requirements/stack:** offline PDF source→explicit manual review→redesigned A4 PDF, content preservation paramount; React/TS/Vite/PDF.js/IndexedDB, Windows Electron/NSIS. Final BASIC 30k/PRO 60k/BUSINESS 90k and equal offline Korean AI rewriting remain contractual future scope, not sold.
2. **Completed:** `src/step3/ImportPanel.tsx` uses request generation and unmount cleanup to reject late PDF.js result before transient original/image Blob allocation and state update. `tests/step3-race-browser.mjs` deterministic actual PDF `File.arrayBuffer` hold, real navigate to STEP1 and back, verifies no orphan source, original V2 snapshots unchanged, legitimate V1 migration permitted. Source/PDF bytes/DB schema unchanged.
3. **Exact verification:** source+test `1abe28f6b7751ec6d0483d0b55095e006608ff93`. [Chrome+Edge #40371859883](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859883) **SUCCESS 2/2** both real `PASS M09-B CHROME/EDGE STALE UNMOUNT`, Node 61/61, build; [Windows #40371859794](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859794) **SUCCESS**, 61 unit/12 desktop, 8 A4 installed PDF, STEP3/native save, STEP2+PNG upgrade. Physical buyer PC and M09-B Windows direct GUI NOT RUN.
4. **State:** M09-A and M09-B narrowly scoped **DONE**. PR9 Draft unmerged. Genuine Korean offline model, real buyer PDFs/PC, 20/30 template SKUs, licensing/signing/distribution support **WAIT/BLOCKED BY OWNER APPROVAL**, sale NO-GO.
5. **Errors and retry:** Before fix Edge #40369980500 reproduced orphan `URL.createObjectURL` count1; chose cheap generation+unmount guard vs deep worker cancellation. First fix #40370194342 failed test assuming no new docs; legitimate old STEP1 V1→V2 migration added one. Test-only corrected IDs/content/migration assertion, subsequent success. Do not repeat obsolete count-only assertion or use undocumented cancel APIs.
6. **Repository/refs:** `hibi89/astra_pdf_redesigner` / `integration/astra-commercial-core`; exact tested code SHA above, later docs-only SHA retrieve from GitHub. `src/step3/ImportPanel.tsx`, `tests/step3-race-browser.mjs`, `.github/workflows/ci.yml`, `docs/commercial/M09_B_STALE_IMPORT_RACE_20261027.md`. `lead/astra-commercial-20261025` maintains orchestration.
7. **Runtime/deploy:** GitHub Node22 Linux Chrome+Edge and Windows x64 Electron NSIS; local npm scripts, no Vercel URL. GitHub Action unsigned installer is not an approved consumer release.
8. **Originals/security/backup:** main/PR3/PR4 untouched; raw original designs, STEP1 localStorage v1 and STEP2 IDB V2 regression guarded. Only synthetic PDF in CI, never customer file/token/model acquisition, no external transmission. Git SHA history enables rollback.
9. **Next:** incremental source integrity/cancel stress QA if self-contained, or owner-authorized real PDF/Windows manual acceptance. Genuine GGUF download/model/license/CPU is a separate explicit approval and proof gate. Maintain current 8/8 BASIC, no 20/30 SKU or AI marketing.
10. **Confirmed:** 2026-10-27 KST, exact Chrome/Edge/Windows final workflow conclusions and all M09-B markers inspected; later docs-only changes are not retested app source.


## M09-C final ten-point handoff — 2026-10-27 KST
1. **Goal/confirmed contract/tech:** Offline PDF import→manual review→new styled A4 PDF using React/TS/Vite/PDF.js/IndexedDB/Electron NSIS. Source immutable, 30k BASIC/60k PRO/90k BUSINESS eventual SKUs, same opted-in offline AI rewrite required before commercial sale.
2. **Completed:** analysis progress now renders independent `busy&&parsing` Cancel button even with `draft=null`; pressing it invalidates M09-B request token and allows immediate replacement. Late old extraction cannot allocate original Blob URL or replace newer draft. Loaded review cancel preserved, active saving remains non-cancellable, no PDF.js internal cancellation or DB change.
3. **Tests/verification:** exact code/test SHA `2ba0b4e57f7d521ba9482a6d626411f10961f9b9`. [Chrome+Edge #40376435854](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435854) SUCCESS 2/2 with exact both-browser `PASS M09-C CHROME/EDGE CANCEL/RETRY`, Node61/61/build PASS, old M09-A/B etc PASS. [Windows #40376435967](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435967) SUCCESS Node61/desktop12, installed native STEP3 print, 8/8 BASIC A4 layouts and STEP2+PNG in-place upgrade preservation. Buyer Windows manual interaction and direct M09-C Windows UI click NOT RUN.
4. **State:** M09-A/B/C scoped DONE. Actual consumer PDF/PC, genuine commercial Korean offline GGUF, PRO20/BUSINESS30, installer signing/licensing/support still WAIT and sale NO-GO. PR9 Draft unmerged.
5. **Failures/stop-pivot:** initial M09-C Edge failed `before.docs.length` from CDP script expression not executing Promise. One test-only correction then Edge error `cancelButton.disabled` because review footer is guarded by `draft&&`; substantive layout pivot implemented `busy&&parsing` cancel outside draft; final both browsers and Windows green. Do not repeat failed shell count/conditional assumptions. No evidence of customer V2 corruption.
6. **Repository/refs/paths:** `hibi89/astra_pdf_redesigner`, `integration/astra-commercial-core`; exact tested code above, later docs-only head to recheck, protected main/PR3/PR4, Draft PR9 to `lead/astra-commercial-20261025`. Files `src/step3/ImportPanel.tsx`, `tests/step3-cancel-browser.mjs`, `.github/workflows/ci.yml`, `docs/commercial/M09_C_PARSE_CANCEL_RECOVERY_20261027.md`.
7. **Deployment/environment:** Node22 Linux CI Chrome/Edge, GitHub hosted Windows x64 installed Electron/NSIS, npm test + npm run build, no Vercel/Production (N/A); test EXE unsigned and not consumer release.
8. **Originals/backup/secrets:** Existing STEP1 localStorage v1, STEP2 IndexedDB V2, two design PNG, customer PDFs and original repository branches protected. Only synthetic data generated in CI, no customer API/paid/model asset/token. Git pre-fix `461a2057...` / working base revisions for rollback, no force push.
9. **Next priority/procedure/completion:** M09-D candidate installed Windows UI synthetic cancellation test or owner-approved real PDF/PC user acceptance. Ensure source-review consent/DB unchanged; require Chrome/Edge and Windows green exact SHA; major model acquisition or release gated by explicit owner approval. No unsupported claims of Windows M09-C direct click.
10. **Checked evidence:** 2026-10-27 KST. Exact final jobs #40376435854 and #40376435967 completed/success and named browser/native markers inspected; document-only later commits do not change code or independently constitute a test.



## 2026-10-27 17:27 KST — STEP 3 PDF 가져오기 재개 / 검수 편집 실행 취소·다시 실행

- **승인 범위:** 최신 사용자 승인은 기존 STEP 3 PDF 가져오기 개발을 계속 허용한다. OCR은 별도 승인 전까지 제외한다. 과거 STEP2-only 문구는 초기 main 안정화 기록이며, 실제 STEP3 PR #3 개발 이력 및 최신 승인은 원격 `AGENTS.md`의 2026-10-27 갱신(commit `08e68699e8f58a640ef119b832a60a92d6d87e5f`)에 정합되게 기록했다.
- **원격 기능/테스트 SHA:** `3a704921b24b83b05701c6a48c9526d8580f9a6a`, `integration/astra-commercial-core`; PR #9는 Draft/open/unmerged.
- **이번 보강:** PDF 확정 전 편집 초안에 최대 8단계 메모리 내 실행 취소/다시 실행 추가. 텍스트·분류·순서·이미지 포함 변경을 초안 상태에서 되돌릴 수 있고, 수정·되돌리기·다시 실행 뒤 원문 확인 동의는 다시 받아야 한다. 새 파일·취소·저장 완료 시 이력을 버린다. IndexedDB/project JSON 스키마와 원본 문서는 변경하지 않았다. 기존 Step3 추출·이미지 복원·원본 대조·취소 구현은 재작성하지 않았다.
- **로컬 검증:** `npm test` 62/62 PASS, `npm run build` PASS, `git diff --check` PASS. 빌드는 기존 model.ts static/dynamic import chunk 경고만 출력했다.
- **Chrome + Edge exact-SHA:** [#40472988885](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988885) SUCCESS 2/2. Chrome job #122084327342, Edge #122084326864에서 `PASS STEP3 DRAFT UNDO/REDO`, 실제 합성 PDF import/reprint, A4·텍스트·이미지, M09-A/B/C 회귀 로그 확인. Node 62/62 및 build도 성공.
- **Windows NSIS exact-SHA:** [#40472988943](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988943) SUCCESS. Job #122084327265에 `PASS M09-D WINDOWS INSTALLED UI`, installed STEP3 import/source review/native A4 PDF(2 pages, six markers, raster draw), 설치/제거 및 0.1.0→0.1.1 STEP2 데이터 보존 로그 확인.
- **M09-D 판정:** Windows hosted runner의 설치 앱 창에서 분석 취소→새 PDF 선택→늦은 이전 결과 무시→새 Blob URL 정리→IndexedDB V2 스냅샷 불변을 실제 UI로 확인했다. 이는 합성 CI 증거이며 고객 PC/실문서 검증은 아니다.
- **남은 STEP3 검증:** 동의받은 고객 텍스트 중심 PDF 5~10개를 고객 로컬에서만 비교하고 구매자 Windows PC에서 GUI/실문서 수용을 확인해야 한다. 복잡한 표·다단·그래픽은 지원 완전성을 주장하지 않고 경고/수동 검수가 필요하다. 스캔 OCR, 모델/런타임 다운로드, 비용, 외부 PDF 전송은 미승인이다. 상용 판매는 NO-GO.
- **보존/동기화:** main, PR #3/#4, 사용자 저장 데이터 및 배포 설정을 건드리거나 병합하지 않았다. 로컬 `git fetch`는 `Could not resolve host: github.com`으로 실패했으며 GitHub 연결 API로 위 exact commit을 원격에 반영했다. 현재 로컬 clone은 원격 ancestry와 다르므로 로컬 ref를 push하지 않는다.


## 2026-10-27 17:45 KST — STEP 3 PDF 이미지 누적 자원 한도

- 구현 SHA: 009966b57cc2e30397da5607b9429020c400e513 (integration/astra-commercial-core, PR #9). 기존 per-image/per-page 기준은 유지하고, 문서당 이미지 복원 시도 최대 50개·누적 40MP·성공 PNG 40MiB 상한을 적용했다. 상한에 닿으면 후속 이미지는 복원하지 않고 기존 미복원 개수·검수 경고에 표시한다. 초안/문서 저장 스키마, 원본 PDF, 사용자 V2 데이터는 변경하지 않았다.
- 로컬 검증: Node 24 npm test 63/63 PASS, npm run build PASS, git diff --check PASS. 첫 추가 테스트에서 이미지 개수 경계 기대값 오류로 1회 실패했고, 테스트 입력만 바로잡은 후 전체 통과했다. 기존 빌드의 model.ts chunk 경고는 남아 있다.
- exact-SHA Chrome·Edge: [Actions #40475046652](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046652) SUCCESS 2/2. Chrome·Edge에서 PDF 가져오기/Undo·Redo/A4 재출력, 스캔·손상·암호 PDF 거부, M09-A/B/C 회귀 통과 로그 확인.
- exact-SHA Windows NSIS: [Actions #40475046789](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046789) SUCCESS. 설치형 M09-D 취소→대체 선택→늦은 분석 무시→저장소 불변, STEP3 가져오기/검수/새 A4 PDF(2쪽, 원문 표식 6개, 래스터 1개), 설치·업그레이드 로그 확인.
- 최초 STEP3 기준 재대조: PDF 내부 복구는 원본 로드맵의 STEP3 요구가 아니다. 손상 파일을 성공으로 위장하지 않고 거부하며 기존 문서와 미확정 검수 초안을 보존하는 편이 범위에 맞다. 갭 매트릭스에 이 판단을 반영했다.
- 미검증/남은 작업: 합성 fixture만 사용했다. 고객 동의 실제 단순 PDF 5~10개 내용 비교, 구매자 Windows PC 직접 GUI/인쇄 수용은 미검증. 복잡한 표·다단·OCR은 원본 범위를 벗어나거나 별도 승인이 필요하다. 7단계 추정은 ~43%, 판매/Production NO-GO.
- 보존/최신성: main, PR #3/#4, 배포 설정, 사용자 저장 데이터는 변경·병합되지 않았다. OCR·모델 다운로드·비용·외부 PDF 전송·배포 없음. 기능 테스트 SHA는 위 코드 SHA이며, 문서 전용 갱신이 뒤따른다.


## 2026-10-27 17:55 KST — STEP3 이미지 누적 한도 최종 경계 검증

- 최종 기능·테스트 SHA: 9ae962eb825e4baa3a8d84b650926355258c9148. 앞선 검토에서 첫 한도 초과 뒤 작은 이미지 시도가 계속될 수 있음을 확인해 동작을 바로잡았다. 이제 PDF 단위 예산에 도달하면 exhausted 상태로 두고 이후 페이지의 이미지 객체를 읽거나 복원하지 않는다. 시도 이미지 수와 디코딩 픽셀은 복원 실패도 예산에 포함하며, 성공 PNG bytes는 별도 집계한다.
- 새 회귀 테스트는 첫 페이지 누적 픽셀 한도 도달 시 경고가 나오고 다음 페이지 이미지 객체 접근이 일어나지 않는지 확인한다. 로컬 Node 24 npm test 64/64 PASS, npm run build PASS, git diff --check PASS. 기존 model.ts chunk warning 지속.
- Exact-SHA Chrome·Edge [#40476342313](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342313) SUCCESS 2/2; Windows NSIS [#40476342230](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342230) SUCCESS. Windows installed test에서 M09-D 실제 UI 취소·대체 파일·늦은 결과 무시·V2 불변, STEP3 실제 앱 출력 A4 2페이지/marker 6개/raster 1개 확인.
- 이전 exact-SHA 009966b도 녹색이었으며, 그 뒤 최종 코드 검토로 경계 조건을 추가 보완한 것이다. 실패를 숨기거나 테스트를 생략하지 않았다.
- 제한 설명 정정: 50개는 실제 회수 성공 개수가 아니라 문서 전체 복원 시도 상한이다. 40MP는 시도된 이미지 디코딩 픽셀 상한, 40MiB는 성공 PNG 누적 출력 상한이다. 최초 경고 뒤 모든 후속 복원을 중단한다.
- 이 보완은 추출/프로젝트 스키마를 바꾸지 않는다. OCR/외부 전송/모델 다운로드/비용/배포/merge 없음. 고객 동의 실제 PDF 5~10개와 구매자 Windows PC 수용은 계속 미검증. 상용 판매 NO-GO.


## 2026-10-27 18:06 KST — STEP3 추출 텍스트 제한 조기 적용

- **최종 기능·테스트 SHA:** 4e5cdbb300153dc81e7374956030cae751148415. PDF.js 텍스트 항목을 문서 전체 누적 500,000자 한도와 대조하면서 페이지별 fragment 배열에 추가하도록 변경했다. 초과 시 나머지 페이지/항목 추출을 진행하지 않고 기존 저장 데이터는 그대로 둔다. 구조 재구성 후에도 기존 최종 한도 검사를 유지한다.
- **로컬 검증:** Node 24 npm test 65/65 PASS, npm run build PASS, git diff --check PASS. 정확한 경계 500,000자는 허용되고 다음 문자부터 거부되는 단위 테스트 포함.
- **Chrome·Edge:** [Actions #40477533937](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533937) SUCCESS 2/2. Chrome/Edge PDF 가져오기, Undo/Redo, 실제 브라우저 A4 PDF, M08 corrupt/password/scan boundaries, M09-A/B/C 회귀 확인. Chrome test summary #fail 0.
- **Windows NSIS:** [Actions #40477533758](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533758) SUCCESS. 설치형 M09-D 취소→대체 파일→이전 분석 무시→V2 불변, STEP3 native A4 출력 2쪽/marker 6개/raster 1개 확인.
- 합성 PDF만 사용했다. 고객 PDF/물리 구매자 PC 수용은 미검증으로 유지한다. OCR 미승인, 7단계 완료율 추정 ~43%, 상용 판매 NO-GO.
- main/PR #3/#4/사용자 저장 데이터/배포는 변경·병합하지 않았다. 외부 전송, 모델 다운로드, 비용 서비스, Production 배포 없음.

## 2026-10-27 18:26 KST — STEP3 텍스트 블록 제외와 exact-SHA 검증

- **설계 근거:** 최초 STEP3의 “머리글·바닥글 제거는 원문을 확인할 수 있게 처리” 요구를 보강했다. 검수 화면의 각 텍스트 블록에 새 문서 포함 체크를 제공한다. 제외한 텍스트는 검수 초안과 원본 PDF 비교 화면에 남고, 새 프로젝트에만 포함되지 않는다. 전체 텍스트를 제외하면 저장이 막힌다. 기존 저장 스키마·사용자 문서·원본 PDF는 변경하지 않았다.
- **최종 검증 SHA:** `cc157cba4b442f44b88c3631a72686fdfe8f8af9` (integration/astra-commercial-core, Draft PR #9).
- **GitHub Actions:** Chrome+Edge [#40479935848](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935848) SUCCESS 2/2. Node 22 `npm test` 67/67 PASS, `npm run build` PASS. 브라우저 로그: 원본 검수 17개 표식 유지, 머리글·바닥글 4개 제외, 결과 PDF 본문 표식 13개 유지, A4/이미지 출력, 동의 취소 및 Undo PASS.
- **Windows NSIS:** [#40479935852](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935852) SUCCESS. 설치형 M09-D 취소→대체 파일 선택→늦은 분석 무시→V2 저장소 불변, STEP3 native A4(2페이지·6개 표식·래스터 1개), 설치/제거 및 0.1.0→0.1.1 STEP2 데이터 보존 확인.
- **수정 이력:** 중간 exact-SHA에서 테스트가 실제 읽기 순서(40479291489/435), 17개 fixture 표식 기대값(40479424192/232), 표식 수와 통합 블록 수 혼동(40479582180), 브라우저 테스트 문법(40479877233/246)으로 실패했다. 각 원인을 확인해 fixture·테스트만 고쳤고, 우회·생략하지 않은 최종 SHA에서 위 전체 검증을 통과했다. 0.1.0 기준 Windows run [#40479582087](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479582087)은 SUCCESS였다.
- **남은 검증:** 고객 동의 실제 텍스트 중심 PDF 5–10개를 사용자 PC에서만 비교하고, 구매자 물리 Windows PC에서 GUI/인쇄 수용은 아직 미검증. 이 파일들을 CI/PR에 올리지 않는다.
- **진척 구분:** 아스트라 7단계 약 43%. 72시간 내부 기술 시연은 M05 기준 핵심 경로만 제한 GO이며 완성품/판매 허가가 아니다. BASIC은 부분, PRO 20종·BUSINESS 30종은 미구현, 전 SKU 오프라인 윤문은 승인대기. 상용 판매/Production은 NO-GO.
- **보존/승인:** main, PR #3/#4, 사용자 저장 데이터, 배포 설정 변경·병합 없음. OCR, 모델/런타임 다운로드, 외부 문서 전송, 유료 서비스, 배포 없음. OCR은 별도 승인 전 제외.

## 2026-10-27 18:40 KST — 총괄 지시 갱신: 설계 기능 구현 우선

- **사용자 운영 방식 확정:** 기존 제한 GO 내부 MVP → 최초 7단계 설계/요구사항 갭 순으로 기능 완성 → 최종 보안·안정성·호환성·상용 QA. 세부 계획: [docs/commercial/MVP_TO_BLUEPRINT_COMPLETION_20261027.md](docs/commercial/MVP_TO_BLUEPRINT_COMPLETION_20261027.md).
- **개발 다음 우선순위:** STEP4 스타일 토큰·검증된 레이아웃/비교·사용자 프리셋 저장/재사용 → 승인 범위의 STEP5 로컬 레퍼런스·STEP7 검수 보강. 이전 STEP3 합성 경계 테스트의 반복만으로 완성률을 올리지 말 것. 사용자 자료가 없어도 독립 기능 구현 진행, 실PDF/물리 PC는 미검증 유지.
- **기준 증거:** 기능/테스트 SHA cc157cba4b442f44b88c3631a72686fdfe8f8af9, [Chrome/Edge #40479935848](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935848) 및 [Windows #40479935852](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935852) SUCCESS. 최초 로드맵 약 43% 추정, 상품판매 NO-GO.
- **승인/보존:** 원본 문서/PNG, main, PR3/PR4, 기존 데이터, 외부 전송/비용/배포 변경 금지. OCR/STEP6 웹검색/로컬 LLM 다운로드/중요 스키마 변경·PR 병합은 별도 승인. 저장·원문 필수 안전 테스트는 구현 시점 유지.
- **전달:** [PR #9 총괄 지시](https://github.com/hibi89/astra_pdf_redesigner/pull/9#issuecomment-6438610031). 이번 기록은 코드 신규 구현이나 재테스트 완료가 아닌 실행계획 변경.

## 2026-10-27 19:18 KST — STEP4 동일 문서 스타일 비교·적용·취소

- **구현:** 기존 8개 레이아웃을 같은 전체 문서에서 한 번에 하나씩 비교한다. 비교 상태는 메모리 전용이라 저장 전 문서/디자인은 변하지 않는다. 선택 적용은 기존 `DesignSettings.theme`를 사용하고, 적용 직전 디자인을 한 번 취소할 수 있다. 적용/취소 뒤에도 본문, 섹션, 이미지 참조 및 IndexedDB store 구성이 동일하다. 비교 중 기존 디자인 컨트롤을 눌러도 미리보기와 저장 테마가 동기화된다.
- **구현 방식 비교:** A) 레이아웃별 고정 CSS만 늘리면 초기 구현은 가장 빠르고 저장 호환성을 건드리지 않지만, 폰트·색상·크기 조합이 늘 때 중복·회귀·유지보수 비용이 커진다. B) 제한된 디자인 토큰(`theme/accent/font/textSize`)과 레이아웃 프리셋 ID를 유지하면 약간의 초기 설계가 필요하지만, 렌더 경로와 기존 V2 데이터에 맞춰 확장·검증하기 쉽다. 둘 다 외부/API 비용은 없다. **B를 권고**한다. 이번 구현은 이미 존재하는 V2 디자인 필드만 사용하며 저장 스키마를 바꾸지 않았다. 사용자 프리셋 저장/재사용은 데이터 이식성과 마이그레이션을 설계해 별도 승인받은 뒤 진행한다.
- **기능·테스트 SHA:** `273db07ae851e8d2420da39688b5fa84641ce65d`.
- **Chrome·Edge:** [Actions #40486509235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509235) SUCCESS 2/2. `npm test` 67/67 PASS, `npm run build` PASS. 실제 same-document 비교 테마 PDF가 A4이고 본문 표식 3개와 래스터 이미지를 유지했다. 비교 출력과 저장된 같은 레이아웃의 제목 bbox 차이는 각 좌표 1.5pt 미만이었다. 8개 테마 실제 출력은 모두 고유 배치·A4·텍스트 순서·이미지를 보존했다.
- **Windows 설치형:** [Actions #40486509335](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509335) SUCCESS. 설치된 Electron에서 ephemeral alternate PDF, 적용 후 정확한 디자인/콘텐츠 복원을 확인했고, 실제 Electron A4 레이아웃 8개를 PDF.js로 다시 읽어 8/8 성공했다. M09-D 취소→새 PDF 재선택→늦은 이전 결과 무시→V2 store 전부 불변, NSIS 설치/제거, 0.1.0→0.1.1 업그레이드 후 STEP2 문서·PNG 보존도 확인했다.
- **중간 실패와 수정:** `a1c0885` Edge 테스트는 fixture 초기 테마를 report로 고정한 가정 때문에 실패했다. 동적 baseline으로 고쳐 `83045a6`에서 STEP4 PDF/내용 보존은 통과했지만 비교 패널 열린 동안 일반 테마 선택이 미리보기에 반영되지 않는 결함을 발견했다. 컨트롤 동기화와 회귀를 추가한 최종 SHA `273db07ae851e8d2420da39688b5fa84641ce65d`에서 Chrome·Edge·Windows 모두 성공했다. 테스트를 생략하지 않았다.
- **미검증·제약:** 실제 고객 PDF 5–10개 및 구매자 PC 수용은 미검증. 7단계 추정은 약 44%, 판매/Production NO-GO. 사용자 스타일 저장/재사용 스키마, 무제한 디자인 조합, OCR은 미완료/승인대기.
- **보존:** 사용자 지시에 따라 GitHub 통합 브랜치에서만 반영. main·PR #3/#4·사용자 원본/데이터·배포 설정을 변경·병합하지 않았다.
