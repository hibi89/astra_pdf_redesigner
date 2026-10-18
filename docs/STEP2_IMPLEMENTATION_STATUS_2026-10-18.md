# STEP 2 개인 문서 제작기 — 구현 및 검증 현황 (2026-10-18)

## 목적과 기준
- 사용자 승인 목표: STEP 1을 유지하면서 기존 아스트라 로드맵의 STEP 2를 구현하고, 최종적으로 STEP 3에서 PDF 내용 추출을 도입.
- 사용자 제출 원문: `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (바이트 그대로 보존).
- 참조 계획: `docs/STEP2_DESIGN_DECISION_2026-10-18.md`.
- 대상 브랜치: `feature/step2-full-20261018`. 기능 브랜치의 구현은 프로덕션 검증이 끝나지 않아 `main`에 합치지 않는다.

## 신규 기능 (코드 구현, 실제 브라우저 검증 미완료)
- 섹션·블록 V2 모델, 안정 ID, 순서 변경, 빈 섹션 출력 숨김, 4개 회고록 항목 마이그레이션.
- 기본 로컬 IndexedDB 3개 저장소: `documents`, `assets`, `meta`; 문서별 자동 저장 및 전환 전 flush, 완료 표시 + 문서 원자적 마이그레이션.
- 기존 `astra-pdf-redesigner:current:v1` localStorage는 읽기만 하며 자동 삭제/수정하지 않는다. 손상 또는 미래 버전 감지 시 경고한다.
- 문서함 생성(빈 문서·회고록·회고록 예시), 이름 변경, 독립 출력 제목, 열기·복제·삭제, 수정일 표시, 마지막 활성 문서 복원.
- 섹션/소제목/본문/이미지 블록 CRUD와 위·아래 이동. 복제 시 ID 전부 재발급, 이미지 자산 독립 복사.
- 이미지 PNG/JPEG/WebP, 크기 10MiB, 해상도 2천만 픽셀, 헤더/실제 디코딩 검증; 이미지 교체/정렬/크기/캡션.
- JSON `.localdoc.json`에 이미지 Base64 포함한 단일 문서 백업/가져오기, 100MiB 제한, 가져오기 전체 검증 후 새 문서로 원자 저장.
- 기존 3개 테마와 추가 컴팩트 리포트, 공통 화면/인쇄 리디자인 렌더러, `window.print()` 및 A4 CSS.
- 여러 탭 동시 편집 충돌: 지원 Chrome/Edge의 Web Locks API로 1개 탭만 편집 허용, 다른 탭은 읽기 전용 경고.
- 기존 STEP 1 회고록 편집 UI는 접근 가능한 별도 호환 화면으로 남김.

## 실제 검증
1. Node 22 `npm test`: **14/14 PASS** (기존 5 + 신규 9). 타입·변환·섹션 순서·복제 독립성·손상 설정·형식/JSON/이미지 헤더 등 순수 로직.
2. 로컬 글로벌 TypeScript `tsc --noEmit --strict --skipLibCheck --moduleResolution bundler --module esnext --allowImportingTsExtensions --target es2022 --lib es2022,dom src/step2/model.ts src/step2/images.ts src/step2/projectFile.ts src/step2/idb.ts`: **PASS**.
3. 로컬 TypeScript `transpileModule` JSX 구문 검사 (`Workspace.tsx`, `Root.tsx`, `useWorkspace.ts`): 구문 오류 **0건**. 타입 검사 또는 빌드 성공을 뜻하지 않음.
4. GitHub Actions (feature) #39131861115 / #39132088786: **실패**. 두 번 모두 Linux runner 미배정 (`runner_name=''`, steps `[]`), 실행 약 2초 후 종료. **테스트/빌드는 시작되지 않았으므로 앱 코드 오류라고 확정할 수 없음**. job 로그 다운로드에서 BlobNotFound 404. 동일 방식의 무의미한 재시도 중지.
5. 로컬 `npm install --offline`: ENOTCACHED. 기존 로컬 npm DNS `EAI_AGAIN`으로 온라인 설치 불가. React/Vite 빌드·실제 IndexedDB·브라우저 인쇄 STEP 2 검증: **미검증**.

## 회귀 및 미완료
- **STEP 1 main 기준** 2026-10-18 CI #39129894290 성공. STEP 2 신규 Root 구조가 STEP 1 브라우저 테스트에 미치는 영향을 자동 테스트(`tests/browser-smoke.mjs`)에 반영했지만 최신 Chrome 실행은 미검증.
- STEP 2 실제 실행/브라우저 검증이 통과해야 완성으로 판정할 수 있다.
- 자동화 추가 파일: `tests/step2-browser.mjs`에서 실제 IndexedDB 저장/복원, 이미지, JSON 입출력, PDF 텍스트 검사. 현재 미실행.
- 환경 복구 후 우선 `npm install && npm run build && npm test`, localhost dev를 띄운 뒤 Chrome/Edge 수동 및 E2E 확인.
- 알려진 제약: 저장은 현재 브라우저 프로필·origin에 종속, 외부 백업 암호화 없음, 미지원 이미지/표/OCR/PDF 분석/AI는 범위 외. 사용자 Windows 인쇄 검증 필요.

## 새 의존성·라이선스
- **추가 없음**: React/ReactDOM/Vite/TypeScript 기존 버전 유지. IndexedDB, Web Locks, Blob, Web APIs만 사용.

## 다음 작업 우선순위
1. GitHub Actions runner 할당 실패 원인/Actions 사용량 상태 확인 또는 사용 가능한 PC에서 npm 설치/빌드 검증. 고객 문서는 시험에 사용하지 않음.
2. 실제 Chrome에서 `tests/browser-smoke.mjs`, `tests/step2-browser.mjs` 수행, 정확한 로그 기반 최소 수정.
3. JPEG/WebP/가로세로 이미지·여러 페이지·긴 캡션·비정상 프로젝트, 탭 잠금, 빠른 문서 전환, 저장 실패 수동 확인.
4. 완전한 테스트 후 기능 브랜치→main 병합, 최신 SHA·STATUS/HANDOFF/BOOK 재조회, 사용자 PC Chrome/Edge 최종 확인.


## 2026-10-18 23:38:59 KST 후속 검증
- 저장소 현재 Public 확인. GitHub Actions 이전 실패 run `39132721985` 재실행 시 러너 배정·npm install·14 테스트 PASS, `Workspace.tsx` 이미지 블록 유니온 타입 오류 8건으로 빌드 실패.
- 타입 분기 수정·미사용 import 제거 commit `59628b9c3bb7a704f7b7079626b562dd1338c2ab`.
- 후속 Chrome E2E 업로드 timeout 분석: 테스트 PNG의 IDAT CRC 불일치. 유효한 PNG fixture로 교체 commit `caa0747a5b6967393e05b1b704fe0aa5b3f6aa24`.
- [Run #39136882566](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39136882566) **success**: 단위 14/14, TypeScript + Vite 빌드, 실제 Chrome STEP 1 회귀 및 A4 PDF 15p, STEP 2 저장·섹션 이동·PNG 원본·JSON import/export·이미지 PDF 스모크 PASS.
- **미검증:** JPEG/WebP, 이미지 가로/세로/대형·긴 캡션 인쇄, 빠른 문서 전환과 저장 순서 경쟁, 저장 장애·다중 탭 충돌, 사용자 Windows/Edge. 단위/스모크 통과를 STEP 2 100%로 판정하지 않음.
- `main`에는 STEP 2 기능 미병합. 다음 작업은 위험 높은 미검증 항목의 1단위 회귀 테스트·보강이며, 사용자 문서 사용 금지.

## 2026-10-18 23:47:43 KST — 비동기 문서 작업 충돌 방지 1단위 검증
- 원인: 기존 문서 전환·생성·복제·이미지 변경이 async로 각각 실행되어, 중복 클릭 시 이전 작업의 늦은 완료가 화면·활성 문서 상태를 뒤바꿀 위험.
- 구현: `src/step2/mutationGate.ts` 문서 변경 단일 실행(동시 요청은 명시적 거절). `useWorkspace` 편집 차단 및 변이 API 적용, `Workspace` 제어 비활성화. 원래 STEP 1과 데이터·저장소 키는 그대로 유지.
- 자동 검증: [GitHub Actions run 39137537886](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39137537886) SUCCESS, **16/16 unit PASS**, TS/Vite build PASS. 실제 Chrome에서 동시에 서로 다른 문서를 여는 요청을 수행해 한 요청 거부/첫 요청 보존/새로고침 후 원문·활성 문서 지속 확인 PASS. STEP 1 A4 PDF 15p와 STEP 2 이미지/JSON/PDF 기존 E2E 회귀 PASS.
- 코드 SHA `44d7be92f04be8ff4e1effeb9c16f271069cfe46`. **남음:** JPEG/WebP, 다양한 이미지 배치, 멀티탭 충돌, IndexedDB 저장 실패 주입·복구, Windows/Edge 수동 확인. STEP 2 전체 완료 아님, main 병합 전 추가 검토.

## 2026-10-18 23:59:02 KST — JPEG/WebP 이미지 형식과 PDF 출력 검증
- 검증 기능 코드 SHA `fa459db3317026190c85f690e5744950ed3b4da1`; 앱 코드 자체 변경 없음. `tests/step2-browser.mjs` 추가: Chrome Canvas 생성 JPEG 32×16(가로)·WebP 16×32(세로) 업로드, 실제 디코딩·원래 치수, IndexedDB 저장·새로고침 복원, JSON export Blob 원본 바이트 비교, `Page.printToPDF` A4 및 `pdfimages -list` 이미지 3종 포함 여부 검사.
- [Actions #39138352449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39138352449) **success** — 단위 16/16 PASS, TS/Vite build PASS, STEP 1 Chrome 15-page PDF PASS, STEP 2 JPEG/WebP·PNG·저장·백업·PDF·문서 전환 테스트 PASS.
- 중간 실행 `39138141905`, `39138228608`은 두 번째 JSON 다운로드 파일 탐색 타임아웃. 파일 이름/중복 다운로드 정책에 의존하지 않고 다운로드 직전 생성 JSON Blob을 잡아 검사하는 방식으로 테스트 하네스 수정. 최종 성공 로그 확인.
- 지원범위/한계: PNG/JPEG/WebP 이미지 포함 PDF는 확인; 고해상도·장문 캡션 페이지 분할의 육안·픽셀 품질, 저장 실패 주입, 멀티탭 및 Windows/Edge 인쇄는 미검증. STEP 2 전체 완료·main 병합은 아직 대기. STEP 3 미착수.


## 2026-10-19 00:10:27 KST — QuotaExceededError 실제 브라우저 주입 및 복구
- 테스트 `tests/step2-browser.mjs`: 실제 Chrome IndexedDB `documents` 저장 `readwrite` 트랜잭션을 1회 `QuotaExceededError`로 실패 주입. 단위 모킹 통과가 아닌 실제 브라우저 테스트.
- 실패 시 기존 DB persisted 문서 불변, 최신 편집 원문 미리보기·React 메모리 보존, `저장 실패` 상태·경고 및 이탈 보호 PASS.
- 오류 중 JSON 응급 백업(원문·이미지 포함) PASS, 수동 `지금 저장 / 재시도` 후 IndexedDB 반영·새로고침 복원·구식 오류 안내 소거 PASS.
- `src/step2/useWorkspace.ts` 저장 성공 뒤 `setError('')`로 기존 오류 배너 정리. 앱 기타 기능/사용자 기존 저장키 미변경.
- [CI 39139215112](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139215112) **success** — 테스트 16/16, 빌드 PASS, Chrome STEP1 15p PDF 및 기존 STEP2 이미지/JSON/인쇄 스모크 회귀 PASS. 기능 SHA `9339adb319a78192a0dda5ae437de248e9a056ca`.
- 미검증: IndexedDB 이미지 교체 트랜잭션 강제 중단·롤백, 여러 탭 충돌, 대형 이미지와 긴 캡션 인쇄, Windows/Edge 수동 확인. **main 병합 및 STEP 2 전체 완료 유보**. 실험은 고의 실패 1회이며 모든 디스크 부족 상태를 포괄하지 않음.


## 2026-10-19 00:20:19 KST — 실제 이미지 교체 트랜잭션 롤백/재시도
- 코드 SHA `154ff8d98aa97da311362c1e11ea78bac9db77d9`: 앱 소스 무변경, `tests/step2-browser.mjs` 실제 브라우저 스모크만 보강.
- IDB `assets.put`에서 새 교체용 PNG 입력을 탐지한 뒤 해당 transaction을 `abort()`함. 사용자가 갖고 있던 기존 3개 이미지에 대해 문서의 참조 배열, asset IDs·bytes·MIME·파일명 및 이미지 개수가 강제 실패 전후 완전히 동일함을 확인 PASS.
- 새로고침 복구 PASS. 실패 유도 제거 후 같은 이미지 재교체 성공 → 참조 업데이트, 이전 asset 제거, 고아 이미지 없음, 새로고침 후 출력 미리보기 정상 PASS.
- [GitHub Actions 39139965821](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139965821) **success**. `npm test` 16/16, `npm run build` PASS, STEP1 Chrome PDF 15페이지, STEP2 PNG/JPEG/WebP/프로젝트 JSON/문서 전환/실패 후 백업·재시도 회귀 PASS.
- 잔여 작업: 큰 이미지와 긴 캡션 PDF 페이지 경계, 여러 탭 쓰기 잠금 검증, 사용자 Windows Chrome/Edge 수동 확인. STEP2 약 90%는 추정치이며 최종 완료·main 병합 아님. STEP3 미착수.


## 2026-10-19 00:29:24 KST — A4 페이지 경계/고해상도 이미지/긴 캡션 검증
- 코드 SHA `3173098c0df9d210cd8d762b28d09a36b5298f73`. 사용자 데이터 없는 Chrome E2E 추가, 앱 코드/CSS 무변경. **1200×2500px 세로 이미지** + 선행 37줄 후 A4 인쇄에서 PDF 이미지 존재·짧은 캡션과 이미지 동일 페이지·본문 첫/마지막 표지 존재 PASS.
- 캡션 190줄로 교체한 A4 PDF에서 페이지 추가 생성, 긴 캡션 시작/끝·첫/끝 행, 앞선 본문 표지 모두 보존 및 단어 좌표들이 page bounds 안에 있는지 `pdftotext -bbox-layout` 기반 검사 PASS.
- [Actions 39140653462](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39140653462) **success**: 16/16 unit PASS, TS/Vite build PASS, Chrome STEP 1 15p PDF + STEP2 저장·이미지·JSON/실패 복구 회귀 PASS.
- 남은 것은 실제 2개 탭 Web Locks 보호 E2E, 사용자 Windows/Edge 수동 저장·한글 글꼴/미관 검수. 테스트는 텍스트/이미지 포함 및 좌표 경계를 확인했지 픽셀 레벨 이미지 왜곡·겹침까지 포괄하지 않음.
- STEP2 추정 약 92%, 전체 7단계 단순 동일 비중 약 28%. **전체 STEP2 완료/main 병합 아님**. 다음 `ㄱ`에서 멀티탭 검증.


## 2026-10-19 00:36:17 KST — 실제 Chrome 두 탭 동시 편집 보호
- 코드 SHA `3fe13c1097f63296d45c683f63ba0b95acd005a9`: 앱 소스 변경 없이 `tests/step2-multitab.mjs` 신규, `.github/workflows/ci.yml` CI 스모크 추가. 합성 테스트용 두 페이지는 같은 브라우저 프로필/동일 origin을 공유하되 별도 CDP 대상.
- 탭1 단독 `navigator.locks` 편집 잠금 획득(held 1)·원문 저장; 탭2 접근 시 잠금 불허·편집 UI/인쇄 비활성 및 안내 경고, 원문 불변 PASS.
- 탭1 종료시 held 0 확인 후 **탭2 새로고침** → 새 잠금(held 1)·원문 보존, 탭2 수정·저장·재시작 후 새 내용 유지 PASS. 자동 승계 아님; 명시적 새로고침 요구.
- [GitHub Actions 39141151527](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39141151527) **success**: Node 16/16, TypeScript/Vite build PASS, STEP1 Chrome A4 15p, STEP2 기존 사진/JSON/에러 복구/다중 페이지 검증 PASS, 신규 MULTITAB PASS 3개.
- 남음: Windows Chrome/Edge 수동 PDF/한글·시각 검수, 사용자 최종 수용 및 main 병합 전 요구사항 체크리스트, 잠금 미지원 브라우저/강제 종료는 미검증. STEP2 약 95%, 전체 7단계 단순 동일가중 약 28~29%(비공식 추정). main 미병합, STEP3 미착수.


## 2026-10-19 00:53:28 KST — 원본 지침 감사, 빠른 화면 전환·늦은 STEP1 마이그레이션 보호
- 근거: `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`에 원본 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 1~18절 기능별 판정 작성. 완료·코드만 확인·수동 대기 항목을 구별하고 **병합 HOLD** 기록.
- 발견 결함: STEP2 debounce 저장이 끝나기 전에 STEP1 모드로 이동하면 Workspace unmount로 미저장 변경 유실 위험 → `Workspace.tsx` 이동 전 반드시 flush 성공 대기, 실패 시 이동 거부/복구.
- 발견 결함: STEP2 사용 후 레거시 STEP1 localStorage가 새로 생성되면 `idb.initialize()`가 migrated 문서를 ACTIVE로 강제 변경 → 기존 ACTIVE가 존재하면 유지, migration 문서 별도 추가/marker와 원자적으로 저장하도록 수정.
- 검증: 실제 Chrome 즉시 전환 후 원문 보존·복귀/새로고침 유지·v1 migration 중복 생성 방지, 강제 QuotaExceededError 상황 전환 취소·메모리 편집 유지·재시도 PASS. STEP1 browser smoke 버튼 준비 상태 기다리기, E2E Chrome 프로세스 종료 후 임시 폴더 삭제하도록 보완.
- [Actions 39142445389](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39142445389) **SUCCESS**, 기능 SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`: 16/16 Node, TS/Vite 빌드, STEP1 Chrome A4 PDF15p, STEP2 모든 기존 E2E + 신규 즉시 전환 PASS.
- **추가 증거 필요:** 처음부터 유효한 v1 데이터가 있는 별도 Chrome 프로필에서 마이그레이션 cold-start와 원본 보존·중복 방지, 신규 브라우저 프로필에서 JSON import 왕복, Windows Chrome/Edge/한글/이미지 육안 인쇄. STEP2 최종 수용 및 main 기능 병합은 진행하지 않음.


## 2026-10-19 01:04 KST — 실제 신규 Chrome 프로필 V1 선존재 마이그레이션 PASS
- 테스트 `tests/step2-cold-migration.mjs`는 React 실행 전 V1 `localStorage`을 갖춘 **완전 신규 Chrome 사용자 프로필** 생성. synthetic v1 JSON을 preseed한 후 실제 STEP2 시작·IndexedDB migration 확인, 이후 preload hook 제거.
- 합성 문서 원본: 제목·작성자·날짜·`learned/difficult/solved/reflection` 텍스트/빈 항목/줄바꿈·공백·탭·특수문자·URLs, `theme/ accent/textSize/font`. V2 문서 하나/섹션4/원문/디자인과 고유 ID·ACTIVE·migration marker **PASS**.
- 앱 load/reload 전후 V1 raw JSON **byte-for-byte 같음**, 새로고침 후 V2 문서/IDs/활성 ID/marker 보존 및 중복 생성 0 **PASS**.
- [GitHub Actions 39143261165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39143261165) **success**, 기능 SHA `abb3d9425e72a2708306674176346727ef0ea710`: Node 테스트 16/16, TS/Vite 빌드, STEP1/2 기존 Chrome 회귀와 신규 cold-start 3 checks PASS.
- Cleanup 지연: `ENOTEMPTY` synthetic temp-profile warning은 ephemeral Chrome 종료 비동기성 때문. 앱 기능 테스트는 별도 PASS, CI run success. 추후 cleanup 진단 시 동일 로그 참고.
- **다음:** 별도 Chrome 프로필간 JSON export/import 검증. Windows/Edge 인쇄·한글/시각 수동 점검과 별도 migration 실패 롤백 주입은 남음. main STEP2 미병합. 추정 STEP2 95%, 전체 동등 7단계 약 28~29%.

## 2026-10-19 01:19 KST — Chrome 프로필 A→B 실제 JSON 파일 왕복 이식
- 기존 앱 코드 무변경, 신규 `tests/step2-cross-profile.mjs` 및 CI run 연결. 프로필 A와 B는 사용자 데이터 디렉터리가 별개인 Chrome 프로세스·DevTools CDP 세션.
- A에서 합성 본문+PNG·WebP 저장·다운로드한 `.localdoc.json`의 파일 데이터를 그대로 B의 file input에 제공. B 기존 문서는 보존되고 import 문서의 텍스트·테마·메타·이미지 원본 바이트·치수·순서가 동일. 모든 document/section/block/asset ID는 새로 생성되고 누락 참조 없음. reload 및 A4 PDF 내 이미지 2개까지 PASS.
- [CI #39144399956](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39144399956) **SUCCESS**, SHA `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`, Node 16/16, TS/Vite build, STEP1 15p PDF 및 이전 STEP2 저장/멀티탭/cold migration 회귀 PASS.
- 미검증 migration transaction 실패 원자적 rollback 및 사용자 Windows Chrome/Edge 수동 인쇄·한글·시각. STEP2 약 96% 비공식 추정, main 기능 미병합. 다음 검증은 v1 cold migration 실패 주입·원본/marker rollback.


## 2026-10-19 01:29 KST — 최초 V1→V2 마이그레이션 실제 IndexedDB abort/재시도 PASS
- `tests/step2-cold-migration.mjs` fault-injection `STEP2_INJECT_MIGRATION_ABORT=1`: 신규 Chrome에서 V1 source 사전 생성 후 초기 `documents+meta` write transaction을 의도적으로 abort. **docs 0 / marker undefined / active undefined / V1 source bytes unchanged** PASS. 오류 화면 확인 뒤 reload로 정상 migration 1회 성공, 추가 reload 시 데이터·IDs 불변 및 중복 0 PASS.
- Chrome 스모크의 저장 재시도 후 legacy 모드 전환 시 React 작업 잠금 해제를 기다리도록 `tests/step2-browser.mjs` 테스트 대기 조건 수정(기능 소스 미변경).
- [Actions 39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) **success**. 검증 SHA `a5009a76499a983aa4566adabddabf862c9e839b`; 단위 16/16 PASS, TS/Vite build PASS, Chrome STEP1 15p PDF, STEP2 이전 모든 E2E와 신규 migration 실패 복구 PASS.
- 사용자 Windows Chrome/Edge 한글 인쇄·레이아웃/접근성 수동 검증 **대기**, STEP2 main 기능 **미병합**, STEP3~7 미착수. STEP2 약 97~98%, 전체 동등가중 약 28~29% (비공식).
