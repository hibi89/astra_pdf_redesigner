# STEP 3 — 2페이지 혼합 레이아웃 PDF 원본·재출력 대조 검증 (2026-10-19)

> **판정:** 합성 PDF의 텍스트 식별자 **13/13 원본→검수→재출력 보존** 및 A4·래스터·다단 경고·기존 문서 보호를 Linux Chrome/Edge 자동 테스트로 확인. **표의 선·셀 구조나 이미지 픽셀 동일성, 실제 사용자 PDF 정확도는 검증하지 않음.**

## 검증 근거
- 기능+테스트 HEAD: `0c6061b40286d7a859d8505995ad253f48da9665`; 기존 검증 기준 `d0444b5138c29acebbe2d80ed187165a4dacd237`.
- 첫 시도 [GitHub Actions #39189111252](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189111252): 실제 Edge 브라우저에서 합성 원본·13개 추출 확인까지 도달했으나 **다단 경고 미탐지로 assertion 실패**. 결과가 확인되기 전까지 해당 시도를 PASS로 계산하지 않음.
- 수정 후 [GitHub Actions #39189525347](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189525347): **completed/success**, 검증 SHA 일치, `build-and-test`와 `Microsoft Edge A4 PDF and IndexedDB` **모두 success**. Node **32/32 PASS (fail 0, skip 0)**, TypeScript/Vite build, Chrome 기존 STEP1/2/3 전체 회귀·Linux Edge155 STEP1/2/3 회귀 PASS.
- 실제 Chrome/Edge 양쪽 로그: `PASS STEP3 MIXED SOURCE`, `STEP3 MIXED WARNING COUNT: 3 column= true`, `PASS STEP3 MIXED REVIEW`, `PASS STEP3 SOURCE/REPRINT COMPARISON`. 13개 마커가 재출력 PDF 텍스트에 각각 1회 존재, 원본 페이지 구분 마커 순서 유지, 래스터 이미지 포함 및 A4 출력 확인.

## 생성 원본 (사용자 자료 미사용)
- 코드: `tests/fixtures/step3-mixed-layout-pdf.mjs` — 완전 합성·오프라인 PDF 생성. 테스트 코드에서 매번 동일한 구조 생성; 외부 URL/CDN/고객 데이터/API 호출 없음.
- 원본 `pdfinfo` A4 **2페이지**; `pdfimages -list` 래스터 XObject **1개**. 별도 로컬 Poppler/렌더링으로 원본 파란색/녹색/빨간색 기울기 이미지와 벡터 표 선·2열 문장 시각 확인.
- 1페이지: 일반 머리말/꼬리말, 좌우 각 2개 텍스트, 표 안 텍스트 4개와 벡터 격자, 컬러 이미지 1개. 2페이지: 머리말·본문·꼬리말.
- **13개 고유 ASCII 마커**를 `pdftotext`로 확인; PDF.js 검수 화면의 `textarea`와 재출력 `pdftotext`에서 각 마커 **누락 0·중복 0**.
- 배포/화면 동등 테스트가 아닌 **내용 유지 수용 회귀**: 재디자인 후 페이지 수·레이아웃·표 선·폰트·픽셀 일치를 비교하지 않음.

## 초기 실패 원인과 수정
- 기존 `reconstructLines`는 PDF.js가 좌/우 텍스트를 한 `TextItem`으로 결합하면 문장 간 큰 수평 공백을 좌표별로 식별하지 못할 수 있었음. 실제 합성 PDF가 첫 시도에서 다단 경고를 발생시키지 못함.
- `src/step3/structure.ts`에 글자 수에 비해 지나치게 넓은 `PdfLine`이 **2줄 이상** 존재하는 경우 단/표 위험을 보수적으로 경고하는 검사를 추가. 기존 좌/우 열 검사와 사용자의 텍스트 값/순서 및 저장 DB는 유지.
- `tests/step3-structure.test.ts`에 합쳐진 넓은 텍스트 항목의 경고 및 내용 유지 회귀 **1건** 추가. 기능/브라우저 테스트는 `tests/step3-browser.mjs`에 추가.
- 이 검사는 휴리스틱이며 실제 다단 여부를 확정하거나 열별 올바른 순서를 자동 재배열하지 않는다. 정상의 넓은 문장이 경고를 유발할 가능성은 남는다.

## 원본↔출력 수용 표
| 대상 | 자동 검사 | 확인 결과 및 한계 |
|---|---|---|
| 원본 PDF 자체 | `pdfinfo`, `pdftotext`, `pdfimages` | 2p A4 / 13 마커 / 래스터 1개 원본 증거 |
| 추출 검수 화면 | PDF.js → 편집 가능한 블록 | 13/13, 중복 없음, 원본 1/2페이지 검토 UI |
| 다단·표 위험 경고 | UI 경고 원문 확인 | 열/넓은 간격 경고 발생; 표 셀 재구성 판정은 **미검증** |
| 이미지 | 원본 1 raster, 검수 PNG, 새 PDF `pdfimages` | 래스터 존재 확인. **픽셀/크롭/색상 완전 동일 미검증** |
| PDF 재출력 | `pdftotext` 13 마커 각각 1회, A4, source page marker order | 13/13 보존, 1p→2p 구간 순서 보존(출력 페이지 수 동일 보장 안 함) |
| 기존 문서 | 새 파일 검수 전 문서함 불변, 저장 후 기존 문서 제목 보존 | 사용자 데이터가 아닌 격리된 합성 테스트 프로필에서 PASS |
| 실제 사용자 PDF·Windows | CI에 입력하지 않음 | **NOT RUN** |

## 인수 및 다음 작업
- 기능 브랜치 `feature/step3-pdf-import-20261019`; [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 유지, **main STEP3 미병합**.
- **추가 수용 필요:** 실제 사용자 단순 PDF 5~10개를 로컬에서 원본↔복원 PDF 대조 (텍스트·숫자·표/이미지, 누락·왜곡·읽기순서), Windows Chrome·Edge 출력·글꼴·페이지 나눔 육안. 고객 원본 공개 GitHub 업로드 금지.
- 남은 개선 후보: 텍스트 좌표/열별 블록 정합성, 표 벡터/셀 구조·다단/회전·투명도, PDF 이미지 크롭, 큰 파일·많은 이미지.
- STEP3 비공식 진행률 **약 65~70%**, 전체 7단계 **약 38%** 유지. 새로운 합성 정확도 측정이 실사용 정확도를 증명하지는 않음.
