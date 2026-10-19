# STATUS — Astra PDF Redesigner

- 저장소: `hibi89/astra_pdf_redesigner` / `main`
- 단계: **STEP 1 main 안정 / STEP 2 feature 편집기·저장·인쇄 스모크 검증 완료, 저장 경쟁 방어 추가, 추가 검수 대기**
- 검증된 소스 커밋: `639b5e984e8ba711674a3b3d29fc6baf881a14d1`
- 검증 GitHub Actions: [#39128155552](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39128155552), 결론 **success** (검증 종료 2026-10-18 21:39:37 KST)
- 로컬/Vercel 배포: 로컬 전용. Vercel Production 없음(미적용).

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
