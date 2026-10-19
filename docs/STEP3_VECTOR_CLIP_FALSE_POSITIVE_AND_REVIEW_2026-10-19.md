# STEP 3 — 클리핑 경로 오탐 제거 및 원본 대조 체크리스트 (2026-10-19)

## 검증 결과
- **최종 기능 코드 SHA:** `90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee`.
- **GitHub Actions:** [#39200950625](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200950625) **completed/success** (2026-10-19 04:46:15 UTC / 13:46:15 KST), head SHA 일치. Node 22 **38/38 PASS, 0 FAIL, 0 SKIP**; TypeScript/Vite 빌드 PASS; Linux Chrome 전체 STEP1~3 + Microsoft Edge155 전체 STEP1~3 두 job PASS.
- **브라우저 증거:** Chrome/Edge 양쪽 실제 로그에 `PASS STEP3 CLIP-ONLY VECTOR CONTROL`, `PASS STEP3 CLIPPED XOBJECT PDF`, `PASS STEP3 CHECKLIST`, `PASS STEP3 MIXED VECTOR RISK`, `PASS STEP3 SOURCE/REPRINT COMPARISON` 있음.
- **정확히 입증된 내용:** 클립 전용 합성 PDF의 벡터 위험 0회이면서 이미지 클리핑 경고는 유지; 벡터 표가 포함된 2페이지 합성 PDF에서 위험 명령 3회·표 구조 미복원 경고 노출; 원본 텍스트 식별자 13개 각 1회 재출력·A4·이미지 포함·기존 브라우저 문서 목록 불변.
- **미입증:** PDF 벡터 도형/표 셀 선의 복원, 클리핑 픽셀 재현, 실제 사용자 PDF 5~10개 및 Windows Chrome/Edge 실사용 출력·장문 육안. 데이터 처리 품질 전체 합격을 뜻하지 않음.

## 문제 발견·재시도·해결 (실제 로그)
| 순서 | 변경·검사 | 관측 |
|---|---|---|
| 1 | clip-following constructPath + 4항목 UI 검수 체크리스트, SHA `03b2a52722d5176cad9e02c80ccef3d36b937613` | [#39200328670](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200328670) **FAILURE**, E2E 테스트 코드 따옴표 누락 `SyntaxError`. 기능 동작 판정 불가 |
| 2 | 테스트 스크립트 구문만 최소 수정, SHA `595369018683ab980f32b479fbe223dab97aa3db` | [#39200525378](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200525378) 클립 PDF 위험 **1회**로 오탐, Edge E2E FAIL. 경고 단위 코드가 실제 PDF.js 구조를 반영하지 못함 |
| 3 | 실제 synthetic PDF를 Node의 `pdfjs-dist/legacy/build/pdf.mjs`로 파싱하여 `OPS` 명칭 배열을 진단, SHA `117e4a133e9b303586ca271144edc37ea4ab71ff` | [#39200817859](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200817859) 원인 확인: 실제 연산자 순서 **`clip > constructPath`**, 가상 테스트 가정과 반대; 단위 37 PASS·1 FAIL |
| 4 | `clip > constructPath` 및 `constructPath > clip` 두 패턴 감지, 실제 fixture와 unit 테스트, SHA `90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee` | [#39200950625](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200950625) **전체 SUCCESS**, Node 38/38·Chrome/Edge 성공 |

기존 방법으로 재시도만 하지 않고, 실제 PDF.js 연산자 순서 확인 후 조건을 수정했다. 가상 연산자 배열만으로 실제 PDF 판정 정확성을 주장하지 않는다.

## 구현 범위
- `src/step3/vectorRisk.ts`: 각 `constructPath`에 직접 인접한 **선행 clip/eoClip** 또는 다음 페인트 이전의 **후행 clip/eoClip**를 확인하고, 별도 명시적 페인팅이 없는 클립 경로를 보수적 벡터 표/도형 위험 집계에서 제외. 기존 `constructPath` 묶음과 `stroke/fill` fallback을 유지. 0이라고 해도 전체 그래픽 보존을 의미하지 않음.
- `src/step3/ImportPanel.tsx`: `data-step3-acceptance-checklist` 검수 패널 4항목 (문장·숫자, 다단/표 읽기 순서, 표 선/벡터 구조, 래스터/PNG 복원). 기존 원본 PDF iframe과 문서 확정 체크박스·기존 문서 무변경 절차 유지. **패널은 안내용**이고 각 항목별 완료 증명을 자동화하지 않음.
- `tests/step3-vector-risk.test.ts`: clip 이후/이전, clip-only, 실제 PDF.js Node 진단 합성 fixture, paint/clip 혼합·경계 단위 회귀. 전체 단위 38개.
- `tests/step3-browser.mjs`: 클립 합성 PDF는 벡터 위험 **0회**+이미지 클립 경고; 혼합 PDF는 벡터 위험 **3회**, 체크리스트 4종 확인; 기존 13 마커/이미지/저장 전 무변경 회귀 유지.

## 오탐/누락 경계
- `constructPath`는 PDF.js 구현에 따라 생성/페인트/클리핑 명령으로 합쳐질 수 있고, 이 값은 **표 셀·도형·선 수가 아닌 위험 신호 명령 수**이다.
- 클립과 렌더링이 하나의 묶음 명령으로 접힌 PDF 등에서 false-negative가 여전히 가능하다. 이미지가 아닌 SVG/벡터 폰트/주석/OCR/특수 그래픽의 완전 보존을 보증하지 않는다. 사용자 확인 문구로 이를 표시했다.
- 스캔 PDF OCR 및 벡터 표/다단 구조의 정밀 복원은 현 STEP3 MVP의 범위 밖. 향후 별도 기술 설계/수용 기준 필요.

## 저장·복원·병합 경계
- GitHub 저장소 `hibi89/astra_pdf_redesigner` feature `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) **open/unmerged**. main에는 STEP3 기능 변경 없이 STATUS/HANDOFF 문서만 업데이트한다.
- 사용자 원본 PDF·로컬 IndexedDB/localStorage·원본 로드맵·설계 PNG 및 Git 기록은 변경하지 않았다. CI에서 사용자 실제 PDF를 사용하거나 공개 GitHub에 업로드하지 않았다.
- Vercel/Production 배포 없음 (로컬 프로그램). 실제 사용자 PDF 5~10개 + Windows Chrome/Edge PDF 저장·인쇄·육안 최종 수용 미실시.
- **다음 `ㄱ`**: 실제 클립+페인트 복합 PDF, 주석/투명도·벡터 오탐/누락의 한계 검증 또는 실사용 검수용 acceptance 기준 확대. main 병합과 STEP4 착수는 사용자 별도 승인 전 하지 않는다.
- 추정 진행률 STEP3 약 65~70%, 전체 7단계 약 38%는 과거의 비공식 추정 유지(신규 CI가 상용 품질 증명은 아님).
