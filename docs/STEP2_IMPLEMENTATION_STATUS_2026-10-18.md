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
1. Node 22 `npm test`: **13/13 PASS** (기존 5 + 신규 8). 타입·변환·섹션 순서·복제 독립성·손상 설정·형식/JSON/이미지 헤더 등 순수 로직.
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
