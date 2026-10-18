# STEP 2 — 실제 Microsoft Edge A4 PDF·저장 회귀 검증 (2026-10-19)

## 목표·범위
GitHub Actions Ubuntu 러너에 기본 제공되는 **실제 Microsoft Edge**에서 STEP1/STEP2의 A4 PDF, IndexedDB, 이미지, JSON 및 실패 복구를 자동으로 재현해 Linux Chromium/Google Chrome 전용 의존성 여부를 확인한다. 사용자 PC와 실제 사용자 문서에는 접근하지 않는다.

- 저장소: `hibi89/astra_pdf_redesigner`
- 기능 브랜치: `feature/step2-full-20261018`
- **테스트/CI 구현 코드 SHA:** `34352fd4e92ca43641da3b4d9de3070232276497`
- **확인한 Actions 실행:** [#39149195481 — SUCCESS](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481)
- 런타임: `/usr/bin/microsoft-edge`, **Microsoft Edge 155.0.4283.45**, Ubuntu GitHub Actions Node22.
- **Windows Edge 수동 결과와 구별:** 이 성공은 GitHub-hosted **Linux Edge** 결과이며 사용자의 Windows Edge PDF 출력·한글 렌더링을 대체하지 않는다.

## 구현한 CI
`.github/workflows/ci.yml`에 필수 단계 `Microsoft Edge A4 print and IndexedDB smoke` 추가. Chrome 전체 회귀 및 빌드 완료 후 다음 검사를 수행한다.

1. `microsoft-edge` 또는 `microsoft-edge-stable` (가능하면 `microsoft-edge-beta`) 검색. 없을 때는 `::error`, **exit 1**. 설치 실패/미설치가 CI 성공으로 위장되지 않음.
2. `$EDGE_BIN --version`을 실행해 실제 Edge 제품명·버전을 로그에 기록.
3. `pdfinfo`, `pdftotext`, `pdfimages` 존재 검사(누락시 실패).
4. 독립 Vite 서버 `http://127.0.0.1:4173` 기동 및 curl 응답 확인.
5. 테스트 브라우저 경로 `CHROME_PATH="$EDGE_BIN"`을 전달. 기존 `tests/browser-smoke.mjs` 및 `tests/step2-browser.mjs`가 Chrome DevTools Protocol을 사용하므로 엔진 내부를 바꾸지 않고 동일한 실제 PDF/스토리지 회귀를 Edge에서 실행.
6. 두 스모크가 **모두 성공**해야 최종 `PASS EDGE` 로그 출력. 단계 전체가 필수이므로 오류를 삼키지 않음.

## 증거 (Actions 로그에서 확인)
| 테스트 | 실제 Edge 결과 |
|---|---|
| Edge 실행파일·버전 | `/usr/bin/microsoft-edge`, `Microsoft Edge 155.0.4283.45` |
| STEP1 기존 React·빈 섹션·작성자 생략 | PASS |
| STEP1 `Page.printToPDF` A4 PDF 15페이지, 텍스트 추출·편집 UI 제외 | PASS |
| STEP2 IndexedDB 자동 저장→새로고침, 문서명/테마, 섹션 재정렬 | PASS |
| PNG 이미지 저장, JPEG/WebP 디코딩·정확한 바이트/치수 보존, A4 PDF 이미지 raster 3개 포함 | PASS |
| 프로젝트 JSON 백업·복원, 잘못된 파일 거부, 독립 복제·삭제 | PASS |
| 문서 전환 경합·기존 원본 보존 | PASS |
| 강제 `QuotaExceededError` 저장 실패 시 메모리 원본·긴급 JSON 보존·수동 재시도 | PASS |
| 새 이미지 저장 중 실제 트랜잭션 `abort` → 기존 바이트/문서 복구, 재시도 성공 | PASS |
| 1200×2500px 이미지의 짧은 캡션 동일 A4 페이지 유지 | PASS |
| 긴 이미지 캡션 추가 페이지, 시작/끝 텍스트 보존, `pdftotext -bbox-layout` 페이지 물리 경계 내 위치 | PASS |
| STEP2 미저장 본문 수정 직후 STEP1 전환과 저장 실패시 전환 차단/복구 | PASS |
| 기존 Google Chrome 및 Node unit/build | 전체 PASS, 단위 16/16 |

**판정:** Linux Edge 기반 STEP 1/2 저장·실제 인쇄·오류 복구 자동 검증 **PASS**. 테스트 코드 로그 문구 중 `PASS: Chrome` 또는 `PASS STEP2: Chrome`은 기존 스크립트의 일반 메시지이지만, 같은 Edge 단계의 `Microsoft Edge executable` 및 버전과 `CHROME_PATH=$EDGE_BIN` 환경에서 실행됐음을 Actions 로그로 확인한다.

## 남은 수용/리스크
- **Windows Edge 시각/폰트 실제 출력은 미검증.** 사용자가 제공한 Windows Chrome 단일 PDF는 짧은 문서에 한해 A4·맑은 고딕 임베딩·한글 추출·편집 UI 제외 부분 PASS였지만, Windows Edge 2페이지 이상·이미지/긴 캡션 출력·키보드 수동 조작은 미확인.
- 기존 `tests/step2-browser.mjs`의 Chrome 임시 프로필 정리시 `WARN ... ENOTEMPTY`가 일부 실행에서 남는다. 이번 Edge 구간에서도 경고가 한 번 남았지만 최종 테스트 및 Actions step success. 오직 임시 합성 테스트 프로필 정리 관련이며 사용자 문서 손상을 의미하지 않는다.
- 이 작업은 앱 로직 변경 **없음**, `.github/workflows/ci.yml`만 기능 변경. 기존 `main`/STEP1 기능과 사용자 문서 원본은 그대로 유지. 마이그레이션·멀티탭·프로필 간 이식의 세부 E2E는 **Chrome** 단계에서 계속 검사되며 **Edge에서는 STEP1/STEP2 전체 브라우저 스모크 2개**를 수행함. Edge가 모든 특수 2탭/프로필 A→B 테스트까지 별도로 실행했다고 주장하지 않음.
- **STEP2 최종 사용자 수용·main 병합 HOLD**. 전체 7단계 로드맵의 STEP3~7 미착수.
- 진척도: STEP2 **약 98~99%**, 전체 7단계 **약 28~29%**(동등 가중한 비공식 추정). 총 진행률 5%p 이상 상승하지 않았으므로 유의미한 업데이트 기준 미달.

## 다음 단계
기능 브랜치의 최신 HEAD에 대해 `main` 통합 diff 및 원본 보호를 검증하고, Windows Edge 미확인 항목을 명확히 남겨 사용자 명시적 승인 후 main 병합한다. 사용자 실환경 추가 조작은 자동 검증으로 해결 불가능한 핵심 문제에 한정한다.
