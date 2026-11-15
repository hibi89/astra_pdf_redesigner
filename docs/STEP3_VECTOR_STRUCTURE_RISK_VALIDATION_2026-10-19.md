# STEP 3 — 원본 벡터 경로·표 구조 손실 위험 계측 (2026-10-19)

## 범위와 판정
- **완료:** 업로드 PDF의 PDF.js 연산자 목록에서 *경로 관련 명령*을 보수적으로 집계해 검수 화면의 전체·페이지별 위험 수치 및 원본 대조 경고에 노출. 벡터 표의 실제 셀 구조/격자선은 자동 재구성하지 않으며, 수치를 **표/도형/셀의 개수 또는 보존율로 해석하지 않는다**.
- **CI 검증:** 기능 고정 SHA `f132adbeb70ea43c38cecfb3841b36cbd773951b`, [GitHub Actions #39199224379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39199224379) **SUCCESS**, 완료 `2026-10-19T04:26:04Z` (13:26:04 KST). Node22 **35/35 PASS** (0 fail/0 skipped), TypeScript/Vite build PASS, 실제 Linux Chrome·Microsoft Edge155의 STEP1/2/3 브라우저·PDF 회귀 모두 PASS.
- **합성 혼합 문서 검증:** A4 2페이지, 텍스트 마커 13개, 2열 문장, 벡터 표 선과 셀 텍스트, 래스터 이미지 XObject 1개. Chrome·Edge 각각 원본 벡터 경로 관련 명령 **3회 감지**, 명령 수/셀 수 구분 문구 표기, 원본·검수·재출력 텍스트 **13/13 각각 1회**, 이미지 포함, A4, 기존 문서 보호 PASS.

## 선택한 지표 및 보수적 의미
- `src/step3/vectorRisk.ts`의 `countVectorPaintOps`는 **PDF.js `constructPath` 묶음 명령이 있으면 그 수, 없으면 `stroke/fill` 계열 페인팅 명령 수**를 보수적 신호로 사용한다. 경로 구성·페인트가 동시에 보고되더라도 같은 경로를 단순 중복 합산하지 않는다.
- 브라우저 `src/step3/pdf.ts`가 페이지별 PDF.js `getOperatorList`와 `OPS`를 조회한 후 위험 신호를 `PdfPageInput.vectorPaintCount`로 전달. `src/step3/structure.ts`가 `PdfDraftPage.vectorPaintCount`에 보관, **1페이지 단위 경고**를 추가. 검수 UI `src/step3/ImportPanel.tsx` 전체/페이지별 표시.
- 해당 값은 **경로 명령/묶음 개수의 근사치**이며, 정확한 선 수·표 셀 수·벡터 객체 수가 아니다. 클리핑 등 *그렸는지 확실하지 않은 경로 구성*도 잡힐 수 있다. 원본에 위험 신호가 있을 때 복원된 표를 자동으로 만든다는 주장/동작은 없다. 0도 전체 원본 그래픽 보존을 증명하지 않는다.
- 원본 벡터 도형은 STEP3 변환 모델에서 직접 저장/재현하지 않는다. 결과물의 디자인용 CSS 선/테두리와 원본 표 선의 일치는 검증하지 않았다. **구조 손실 위험의 명시적 고지**만 자동 검증됨.

## 실패-수정 기록 및 검증 근거
1. 첫 구현 `c1873cb73acd4f43a13b11d32aa735ddacfa9b1e`에서 [Actions #39198865094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39198865094) **FAILURE**: Node35/35 PASS·빌드 PASS였으나 Chrome·Edge 합성 PDF 검수에서 `원본 벡터 경로 페인팅 0회`가 나와 기대값 3에 실패. 단순 `stroke`/ `fill` op만 세는 접근의 한계.
2. PDF.js가 경로를 `constructPath`로 묶어 제공하는 경우를 계측에 포함. 고유한 도형/선 개수로 표시하지 않도록 UI 문구와 회귀 검사를 수정. 별도 이미지 디코딩·텍스트/문서 저장 동작은 유지.
3. 후속 최종 기능 SHA `f132adbeb70ea43c38cecfb3841b36cbd773951b` [Actions #39199224379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39199224379) **SUCCESS**. Chrome build-and-test job `117888517772` 및 Edge job `117888518115`에서 `PASS STEP3 MIXED VECTOR RISK: 원본 벡터 경로 관련 명령 3회`, `PASS STEP3 MIXED REVIEW`, `PASS STEP3 SOURCE/REPRINT COMPARISON: 13/13` 로그 확인.
4. `tests/step3-vector-risk.test.ts` 신규 **3개** 단위 테스트: paint/count, constructPath packing과 중복 경계, 페이지별 경고/본문 불변, 이미지-only 음성 대조. 원래 32개에서 **35개**.
5. 기존 STEP1/2와 STEP3 원본 이미지 클리핑·2페이지 출력·저장/복원 E2E도 함께 CI 통과.

## 실제 사용자 수용에서 남은 검증
| 검사 | 현재 관찰 | 미확인/수용 조건 |
|---|---|---|
| 추출 내용 | 합성 텍스트 마커 13/13 보존 | 실제 PDF 5~10개 문장·수치·중복/오탈자 대조 |
| 다단 | 읽기 순서 위험 경고 PASS | 실제 다단/표의 정확한 열·셀 결합 및 순서 |
| 표/벡터 | 합성 원본 위험 명령 3회·경고 PASS | 원본 벡터 선/셀 구조 **미복원**, 원본 대조·수동 수정 |
| 래스터 이미지 | 합성 1개 PNG 재구성 및 A4 재출력에 존재 | 픽셀·색상·크롭·투명도 동일성 미검증 |
| 출력 운영 | Ubuntu Chrome/Edge155 CI PASS | Windows Chrome/Edge 실제 PDF·키보드·다페이지 육안 NOT RUN |

## 운영/인수
- 저장소 `hibi89/astra_pdf_redesigner`, 브랜치 `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3). main STEP3 기능 **미병합** 및 사용자 원본 외부 업로드/변경 없음.
- 이번 한 단위 완료가 STEP3 전체 완료를 의미하지 않음. 기존 비공식 추정 STEP3 약65~70%·전체 7단계 약38% 유지. 실제 사용자 PDF/Windows 수용 검사와 별도 main 병합 승인이 필요하다.
- 다음 `ㄱ`: 실제 문서 수용과 가까운 **오탐 제어 및 손실 위험 항목별 검수/비교 체크**를 한 단위 진행. DOCX/PDF 생성·비동기 업로드/실제 고객 자료 공개는 자동으로 수행하지 않는다.
