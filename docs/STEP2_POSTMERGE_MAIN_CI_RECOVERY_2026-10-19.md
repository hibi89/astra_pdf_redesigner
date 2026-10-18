# STEP 2 — 병합 후 main CI Edge CDP 연결 문제 복구 (2026-10-19)

## 판정
**main CI 자동 검증 복구 SUCCESS. 사용자 Windows 전체 수동 검수는 NOT RUN. STEP 3 미착수.**

- 저장소: `hibi89/astra_pdf_redesigner`.
- PR #2 STEP2 병합 커밋: `f1ad26320b12b07019b115f77f8cf55e62f1e7e6`.
- 병합 직후 [GitHub Actions #39155133495](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39155133495) **FAILURE**: Node16/16, 빌드, Chrome 전체 회귀는 PASS. 같은 runner의 후속 Edge STEP1 스모크에서 DevTools `/json/version` HTTP 조회가 18초 이내 응답하지 않아 실패. stderr에는 `DevTools listening on ws://127.0.0.1:41891/...`와 D-Bus 경고가 함께 기록됨. **D-Bus가 직접 원인임은 미확정**. 해당 실행만으로 앱 PDF 기능 결함은 확인되지 않음.
- 복구 코드 커밋: `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`.
- [복구된 main CI #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) **SUCCESS**, **`a54c10a89e486cf4ab0f922f9ee6aa83fffe013a` HEAD**에 대한 검사.

## 변경 사항 (기능 소스 무변경)

1. `tests/browser-process.mjs`: Chromium/Edge가 고유 테스트 프로필의 `DevToolsActivePort`에 기록한 **실제 WebSocket 경로**로 직접 연결 및 핸드셰이크. 실패 시 제한시간 35초 내 구체적 진단, stderr 및 프로세스 상태 보존. 기존 `/json/version` HTTP 사전 조회 제거.
2. CDP 실브라우저 테스트 5개(`browser-smoke.mjs`, `step2-browser.mjs`, `step2-multitab.mjs`, `step2-cold-migration.mjs`, `step2-cross-profile.mjs`)를 `browserSession.connect()` 통합 방식으로 변경. 기존 PDF/DB/백업·2탭 검증 항목의 완료 기준 유지.
3. `.github/workflows/ci.yml`: Edge 테스트를 **독립 `edge-validation` GitHub-hosted runner**에 분리하고 Chrome 검증은 `build-and-test` runner에 유지. 두 job 모두 PASS여야 전체 Actions 성공. Edge용 poppler 설치/검사와 CDP 실패 시 즉시 FAIL 유지.
4. `src/App.tsx`, `src/storage.ts`, `src/step2/*`, 원본 roadmap/PNG 등 앱 기능·기존 사용자 로컬 데이터 관련 파일은 **수정하지 않음**. 비교 `f1ad2632…` → `a54c10a8…`의 변경 파일 7개는 CI YAML 1개 및 tests 스크립트 6개뿐.

## 실제 검증 결과 — Actions #39157047624

| 검사 | 결과 |
|---|---|
| Job `build-and-test` (Node22, Ubuntu Chrome) | **SUCCESS** |
| `npm test` | **16 PASS / 0 FAIL** |
| `npm run build` | **PASS** |
| STEP1 A4 장문 15p·한글 텍스트 추출·편집 UI 제외 | **PASS** |
| STEP2 이미지 PNG/JPEG/WebP, 실제 PDF embed, 장문 캡션·페이지 bounds | **PASS** |
| STEP2 IndexedDB 저장·재로드·QuotaExceededError, 이미지 트랜잭션 rollback | **PASS** |
| Chrome 멀티탭 Web Locks, V1 cold migration abort/복원, 독립 프로필 A→B JSON 이식 | **PASS** |
| Job `Microsoft Edge A4 PDF and IndexedDB` (독립 Ubuntu runner) | **SUCCESS** |
| 실제 Microsoft Edge STEP1 A4 PDF·STEP2 저장·이미지·JSON·다페이지 출력 | **PASS** |
| CDP 연결 로그 | Chrome/Edge 모두 `PASS BROWSER CDP CONNECTED`, OS 할당 포트 별도 확인 |

검증은 **Ubuntu Linux의 실제 Chrome/Edge**에서 수행했다. Windows Edge 환경에서 한글·레이아웃·실제 프린트 PDF를 육안 검수한 결과는 아니다. 하나의 성공 CI는 모든 향후 실행이나 사용자 시스템에서 오류가 재발하지 않음을 보장하지 않는다.

## 반드시 남겨둘 후속 수동 수용 — NOT RUN
- [ ] Windows Edge 실제 A4 PDF의 한글 글꼴 임베딩·선택/복사·시각 레이아웃.
- [ ] Windows Chrome/Edge에서 **2페이지 이상 긴 문서 및 긴 캡션 PDF**의 페이지 경계·내용 누락·잘림 육안 검사.
- [ ] PNG/JPEG/WebP 가로·세로 이미지가 포함된 Windows PDF의 누락·왜곡·종횡비·인쇄 UI 제외 육안 검사.
- [ ] Windows의 키보드·포커스·작은 화면·복구 UI 사용성 및 브라우저 간 `.localdoc.json` 이식 수동 점검.

사용자가 이 위험을 **STEP2 main 병합에 한해 조건부 수용**했으며, Windows 수동 검증 **완료**를 의미하지 않는다. STEP2 전체 품질/수용 PASS·100%라고 선언하지 않는다. 작업 진척도는 구현/자동검증 관점 약 99%, 전체 7단계 단순 동등비중 약 28~29%의 기존 추정만 유지한다.

## 인수인계
- 복구 후 `main` 코드 SHA: `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`; 보고서·STATUS/HANDOFF 문서만 후속 커밋으로 업데이트할 수 있으며 그 경우 검증된 코드 SHA와 docs-only HEAD를 구분할 것.
- 성공: [CI #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624). 실패 이전: [CI #39155133495](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39155133495).
- **STEP 3 기존 PDF 가져오기/재디자인 구현은 아직 시작하지 않음.** 사용자 다음 지시 전 기능 개발·로드맵 단계 변경 금지.
