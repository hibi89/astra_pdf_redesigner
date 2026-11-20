# P115 검증 증거 — 원본/출력 콘텐츠 차이 대조와 무손상 회귀

- 날짜: 2026-11-15 KST
- 저장소/브랜치: `hibi89/astra_pdf_redesigner` / `feature/astra-p71-pdf-source-parity-20261112`
- 정확 기능 SHA: `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`
- 선행 작업: P114 VERIFIED
- 상태/점수: **VERIFIED, +2점** · A03 10→12/14 · 전체 잠정 52→54/100
- 공식 구매자 수용률: **UNASSESSED** · 출시: **RELEASE HOLD**

## 구현 범위

`src/step7/OfflinePdfReview.tsx` 및 `src/step7/tokenParity.ts`가 원본 PDF와 출력 PDF를 실제 PDF.js 페이지별로 비교해 숫자 포함 토큰, 기호/구두점, 한국어·영어 부정 표현, 표시 링크 대상, 중복/추가 토큰, 페이지 위험을 분리한다. 결과에는 개수와 페이지 위치만 노출하고 PDF 본문과 링크 주소를 저장·외부 전송하지 않는다. 불확실한 결과는 수동 확인으로 남고, 검토 도구는 승인이나 V2 저장을 자동으로 하지 않는다.

기존 STEP3 원문 위치 기반 수동 복구·승인·되돌림 흐름과 STEP1 V1·STEP2 V2 저장 정책을 보존했다. 비교 취소·오류·완료 후 V1, 모든 V2 object store, 활성 문서, 원본 PDF 바이트 해시가 바뀌지 않는지 브라우저에서 확인한다.

## 합성 입력

- `tests/fixtures/step7-pdf-parity-corpus.mjs`
- GitHub Git blob SHA: `cc0830122cafad1ddaafc641c50529afce537835`
- 15개의 결정적 A4 PDF 원본/출력 쌍. 모든 문구·금액·날짜·링크는 합성이다.
- 사례: 음수·양수 부호, 날짜, 소수 금액, 통화/퍼센트/괄호 기호, 부호 반전, NOT/NO/WITHOUT, 링크 변경·삭제·추가, 중복 참조.

## 검증 결과 — 동일 기능 SHA

- **Linux Chrome + Edge** [Actions #43612143269](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143269) — SUCCESS. Node **269 PASS / 0 FAIL / 0 SKIP**, TypeScript/Vite build PASS. Chrome과 Edge 각각 실제 A4 PDF 15/15 쌍에서 예상한 숫자·기호·부정·링크 차이를 분류했고, 원본 SHA 및 전체 STEP1 V1/STEP2 V2 불변을 확인했다. 취소·잘못된 PDF 오류 복구, 기존 STEP3·A4/IndexedDB 회귀도 PASS.
- **Windows Electron + NSIS** [Actions #43612143223](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143223) — SUCCESS. Node **268 PASS / 0 FAIL / 1 Windows 전용 SKIP**, Electron desktop 회귀 **73 PASS / 0 FAIL**. 설치·실행·제거 및 0.1.0→0.1.1 인플레이스 업그레이드 후 STEP2 문서와 PNG 보존 PASS.
- **최종 blueprint 정책 게이트** [Actions #43612143523](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143523) — SUCCESS. 구조적 증거 검사이며 기능 독립 승인이나 공식 구매자 수용 판정은 아니다.

브라우저의 P115 로그는 `PASS P115 PDF PARITY CORPUS: 15/15 actual A4 source/output pairs`와 `PASS P115 PDF ERROR RECOVERY`를 Chrome·Edge 각각 기록한다. 외부 네트워크 요청은 0건이다.

## 수정 이력과 미인정 후보

다음 실패 후보에는 점수를 주지 않았다.

- Linux #43611032904: 격리 브라우저의 STEP1 V1 기준 데이터가 비어 있어 회귀 준비 단계에서 실패. 합성 V1 상태를 준비하는 테스트로 수정.
- Linux #43611361119: 브라우저 스크립트의 SHA256 helper import 누락. 테스트 import를 수정.
- Linux #43611776507: 기준 스냅샷 후 V1 마이그레이션이 V2 store에 반영되는 순서 문제. 앱의 기존 마이그레이션 완료 후를 기준선으로 잡도록 수정.
- 최종 `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`에서 Linux/Windows/정본 3개 Actions 모두 성공했다.

## 인정 범위와 남은 확인

P115는 합성 A4 비교에서 지정한 텍스트/숫자/부정/링크 차이 탐지, 수동 검토, 원본·V1/V2 무손상을 증명한다. 실제 고객 PDF의 표 셀 의미·다단 읽기 순서, 이미지 원본 픽셀 재구성, 물리 Windows 10/11, 실제 Tesseract OCR, 실제 Qwen3 CPU 추론, 구매자 최종 수용은 검증하지 않았다. 인간 검수 없는 완전한 PDF 보존을 주장하지 않는다.

다음 작업은 P116이다. BASIC 8/PRO 20/BUSINESS 30의 30개 A4 디자인 회귀를 검증하고, 55점 G55 게이트를 별도로 통과해야 한다. 공식 수용률 UNASSESSED 및 RELEASE HOLD는 그대로 유지한다.
