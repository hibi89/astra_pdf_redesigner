# M07-A — BASIC 여섯 레이아웃 실제 출력 검증

**작성/검증:** 2026-10-26 KST. **앱 코드 SHA:** `da1fb6a25a660172a477ff3d376f85e0d7b16b98`.

## 검증 가능한 실물
- Linux [Actions #40211494842](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40211494842): **Chrome+Edge 2/2 SUCCESS**, `npm test` **61/61 PASS**, 타입 검사 + Vite 빌드 PASS.
- 합성 한국어/숫자 2페이지 원본 PDF를 실제 편집기에 가져오고 6종 각각 **Chromium PDF 출력 결과 자체**를 PDF.js 및 Poppler로 재열기/검증했다. 6개 모두 `pdfinfo` A4, 순서 있는 정확한 3개 소스 표식, 실제 복원된 PNG raster operation, PDF.js 텍스트 bounds 결과 PASS. 표/벡터/스캔 문서는 대상 아님.
- 각 결과의 첫 제목 텍스트 `STEP3_TEST_BEGIN_7519`에 대한 `pdftotext -bbox`의 x좌표·y좌표·폭을 3pt 단위로 정규화한 **6개 서명이 서로 달랐다.** 레이아웃이 색상 선택만 바뀐 것은 아니다. 각종 격자/전체 페이지 시각 품질이 서로 완벽히 다르다는 증명은 아니며, 고객 PDF 출시 게이트는 따로 남아 있다.

## 출력 6종 목록 (Chrome xMin, yMin 단위 pt)
| ID | 이름 | 구성 원칙 | 제목 xMin | 제목 yMin | 실제 검사 |
|---|---|---|---:|---:|---|
| `report` | 깔끔한 보고서 | 보고서형 강조 제목과 구조선 | 45.00 | 235.95 | PASS |
| `minimal` | 미니멀 노트 | 큰 여백·절제된 제목 | 45.00 | 265.20 | PASS |
| `diary` | 학습 다이어리 | 시퀀스 표기·왼쪽 보조선 | 62.75 | 253.20 | PASS |
| `compact` | 컴팩트 리포트 | 작은 제목·압축된 본문 | 45.00 | 176.70 | PASS |
| `editorial` | 에디토리얼 | 중앙 제목과 넓은 문단 호흡·얇은 경계 | 113.03 | 343.95 | PASS |
| `ledger` | 장부형 요약 | 좌측 강조 경계·정보 밀도가 높은 인쇄 | 76.17 | 185.70 | PASS |

## 변경 코드 및 호환성
- `src/types.ts`: `ThemeId`에 `editorial`, `ledger` 두 식별자 추가. 기존 스키마 버전 1/2 변경 없음.
- `src/step2/model.ts`: 두 테마를 새 프로젝트·기존 프로젝트 검증에서 허용. 지원되지 않는 임의 테마는 계속 거부.
- `src/step2/Workspace.tsx`: STEP2/3 디자인 스튜디오 옵션 4→6, 선택한 테마가 DOM/PDF 출력에 사용되며 원문과 기존 파일을 덮어쓰지 않음. 원래 STEP1 회고록 화면 `THEMES` 목록은 그대로 유지해 과거 동선 변경 최소화.
- `src/styles.css`: `editorial` 제목 중앙 정렬/넓은 여백/별도 섹션 타이포, `ledger` 왼쪽 강조 박스/작은 제목/촘촘한 섹션. 별도 print 재현 스타일 포함. 원문 텍스트 자체는 바꾸지 않음.
- `tests/step3-browser.mjs`: 실제 Chrome/Edge에서 모든 선택지 인쇄 → PDF.js/Poppler 이중 구조 검사, 6개 제목 벡터 pairwise 비교. `tests/step2-model.test.ts`: 유효 6개/임의 theme validation 1종 추가.
- `tests/step2-browser.mjs`: 과거 테스트가 `v2theme` 마지막 라디오가 compact라는 순서 가정을 하던 부분을 명시적으로 4번째 compact 선택으로 교정. 새 테마가 있어도 기존 인쇄·프로젝트 테스트 의도 유지.
- **실제 추가 수**는 이번 두 종. 기존 report/minimal 2종과 기존 diary/compact 2종까지 **합성 PDF 실제 검증된 총 6종**. BASIC 최종 목표 8종 중 **2종 남음**. 아직 크몽 BASIC 출시 요건 충족 아님.

## 한계 / 출시 보류
- Chrome/Edge CI의 합성 텍스트·PNG 문서 검증 결과이지 구매자 Windows PC·실제 고객 문서에서 모든 요소가 정밀 복원됐다는 뜻이 아님. 특히 OCR, 어려운 표, 다단, 폰트 재현, 원본 픽셀 동일, 특수 그래픽 복원은 별도 수용 시험 필요.
- Windows installer CI는 설치/출력/업그레이드 회귀이며 6종을 각각 Windows 렌더러에서 출력해 배치 비교한 증거가 아니다. 결과는 CI 완료 후 별도 확인.
- AI 윤문은 실제 LLM 없이 규칙 검수와 비활성 IPC만 있으며 30,000/60,000/90,000원 모든 상품에 동일 모델을 포함한다는 상품 목표는 **현재 미충족**. 실제 GGUF·런타임 다운로드/품질·라이선스·CPU 실측은 명시적 사용자 승인 이전 BLOCKED.
- **현 단계:** BASIC 템플릿 6/8 synthetic design proof만 완료. 앱 전체, AI 제공, SKU 판매, 전 기능 75% 완료 주장 불가.

## 다음 독립 작업
**M07-B READY:** 남은 BASIC 2종을 인쇄 조판과 정보 배치에서 확실히 구별되도록 구현하고 같은 PDF.js/Poppler + Windows 리그레션을 통과시켜 내부 **8/8** 도달을 목표로 한다. 그 뒤 실제 고객 파일·일반 Windows PC 평가를 별도 게이트로 수행한다.
별도 승인 전 M03-B1 다운로드/유료 API/가중치 획득 금지. `main`, 기존 PR #3/#4 불변, 개발 `integration/astra-commercial-core`, 총괄 `lead/astra-commercial-20261025`, Draft PR #9 미병합.
