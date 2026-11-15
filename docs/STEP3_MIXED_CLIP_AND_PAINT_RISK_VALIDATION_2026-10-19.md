# STEP 3 — 클리핑 + 실제 벡터 페인팅 혼합 PDF 위험 판정 검증

> **판정:** 고정 `pdfjs-dist 6.4.299`의 **실제 OperatorList**에서 클리핑 전용 경로와 `clip+stroke/fill` 경로를 분리하는 회귀가 Chrome·Linux Edge에서 성공했다. 이 결과는 **표/벡터 원형 재구성**이나 Windows/고객 실문서 정확도를 입증하지 않는다.

## 최종 검증 원장

| 대상 | 검증 및 관찰 |
|---|---|
| 기능 검증 커밋 | `4b527401cc8bdba9218b9aba4fca5537e24c77cc` |
| 최종 GitHub Actions | [#39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889), **completed/success**, 동일 head SHA, 2026-10-19T05:04:16Z |
| Node 단위 테스트 | **40/40 PASS**, 0 FAIL, 0 SKIP (기존 38 + 혼합 실문서/포장 명령 2) |
| 빌드 | TypeScript `tsc --noEmit` · Vite build PASS |
| Chrome 자동 회귀 | build-and-test job `117898021038` SUCCESS, STEP1/2/3 전수 회귀 |
| Linux Edge 자동 회귀 | Edge155 job `117898020781` SUCCESS, STEP1/2/3 PDF·IndexedDB 회귀 |
| 클리핑-only 합성 PDF | 벡터 위험 **0**, 이미지 클리핑 원본 대조 경고 유지 |
| 같은 경로의 `W S` 클립+선 그리기 | 벡터 위험 **양수**, 이미지 클리핑 경고도 유지; 실제 Chrome·Edge 모두 PASS |
| 기존 합성 2p A4 텍스트·표·이미지 | 벡터 위험 명령 **3회**, 원본→새 PDF 13/13 ASCII 마커 각각 1회, A4·래스터·기존 문서 불변 PASS |

## 발견된 실패 → 원인 확정 → 수정

1. 첫 합성 PDF 혼합 경계 테스트 커밋 `be35e185b3cbce371ec4edce3401568024506cc4`의 [Actions #39202071379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202071379)에서 **Node 38/39 PASS, 1 FAIL**. 실패 사례는 **같은 PDF 경로에 `W S`(클리핑+stroke)를 적용했음에도 벡터 위험을 0으로 판정**. 나머지 기존 안전성 회귀를 새 버그로 잘못 표시하지 않는다.
2. 실제 `pdfjs-dist` 명령 인자를 출력하는 진단 커밋 `0281d6cdac11915b2ebd02a6549fdac640ffcbbb` / [#39202172463](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202172463)에서 차이를 확인:
   - 순수 클리핑 `W n`: `clip > constructPath`, `constructPath.argsArray[0][0] = 28`(PDF.js `OPS.endPath`).
   - 클리핑+선 그리기 `W S`: `clip > constructPath`, `constructPath.argsArray[0][0] = 20`(PDF.js `OPS.stroke`).
   - **겉으로 보이는 연산자 이름이 같아도 실제 경로 종료 명령은 다르다.** 기존 로직은 clip 선행 여부만 확인하여 같은 경로에서 stroke까지 누락.
3. PDF.js 원본의 `src/core/evaluator.js`는 `constructPath`를 만들 때 첫 인자로 원래의 종료/paint `fn`을 전달한다. `src/shared/util.js`에는 `OPS.stroke=20`, `OPS.endPath=28`, `OPS.constructPath=91`로 정의되어 있다. **버전/구현 변화에 따른 검증 재실행이 필요**하므로 내부 값 20/28을 제품 코드에 하드코딩하지 않고 실행 시 전달된 `OPS` 상수로 비교한다.
4. 최종 구현 `src/step3/vectorRisk.ts`: `fn.argsArray?.[i]?.[0]`의 원래 경로 명령을 우선 판단. **`OPS.endPath`면 비페인팅 경로로 제외**, `OPS.stroke/fill` 등 페인트면 clip이 선행하더라도 벡터 위험에 포함. 인자가 없는 구버전/가상 operator 목록은 기존 clip-이웃 휴리스틱으로 보수적 fallback. 집계는 *소스 경로 명령 위험 지표*이지 표 셀/선 수나 벡터 복원율이 아니다.
5. 최종 커밋의 실제 [Actions #39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889)에서 **Node 40/40·Chrome/Edge E2E 모두 PASS** 확인. 모두 합성 fixture라 실제 고객 파일은 사용하지 않았다.

## 추가한 테스트·재현 절차

- `tests/fixtures/step3-clipped-pdf.mjs`: 기존 로컬 합성 PDF 생성기에 선택적 `paintInsideClip`, `paintOutsideClip`, `fillOutsideClip`, `strokeClipPath` 매개변수 추가. 옵션 없는 기존 fixture 결과는 그대로 보존.
- `tests/step3-vector-risk.test.ts`: Node `pdfjs-dist/legacy/build/pdf.mjs`로 **여섯 가지 PDF 변종의 OperatorList 실파싱** (클립-only, 클립 내부 stroke, 클립 외 stroke, 클립 외 fill, **동일 경로 clip+stroke**, 복수 stroke/fill). 비페인팅은 0, 실제 그린 경우는 양수여야 함. packed `constructPath`의 W n/W S/W f 분류 별도 단위 검사.
- `tests/step3-browser.mjs`: 클립-only 업로드 후, 같은 경로에 `W S`를 적용한 새로운 파일을 검수 화면에 업로드하여 벡터 위험 양수·이미지 클리핑 경고·기존 문서 무변경 직접 확인. 이어 기존 2페이지 혼합 문서 13/13 내용 보존 검증.
- 확인 명령: `npm test`, `npm run build` 및 GitHub Actions의 `Chrome print and persistence smoke`, `Microsoft Edge A4 print and IndexedDB smoke`.
- **최종 E2E 로그:** 양 브라우저에 `PASS STEP3 CLIP+STROKE PDF`, `PASS STEP3 CLIP-ONLY VECTOR CONTROL`, `PASS STEP3 MIXED VECTOR RISK`, `PASS STEP3 SOURCE/REPRINT COMPARISON` 기록됨.

## 남은 위험 및 제한

- `OPS` 구현/packing이 달라지면 본 휴리스틱을 검증해야 하며, count는 **근사 신호**이다. 수치가 0이어도 원본 그래픽 보존을 의미하지 않는다.
- 클리핑+투명도 혼합, 복잡 Form XObject/주석, 경로 병합 및 셀 경계 구조, 페이지 다단 읽기 순서, 실제 이미지 크롭·색상·픽셀 충실도는 **자동 복원/수용 미검증**.
- 사용자 실제 PDF 5~10개, Windows Chrome/Edge 장문·이미지 인쇄/육안 **NOT RUN**. 사용자 파일 외부 API·GitHub·로그로 전송하지 않았으며, 테스트는 오프라인 합성 데이터만 사용했다.
- `feature/step3-pdf-import-20261019` [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)은 open/draft/unmerged. STEP1/2 localStorage/IndexedDB 사용자 원본 및 main 기능, 원본 로드맵/PNG 모두 미변경. 이 한 단위가 STEP3 완료/상품화 수용을 의미하지 않음.

## 다음 확정 검증 단위

- 1순위: PDF.js 최적화된 클립+투명도·Form XObject의 손실 위험 감지 및 **오탐/누락 경계 시험**을 실물 합성 PDF로 1단위 확장. 실제 사용자 PDF/Windows 검수는 승인된 로컬 환경에서 별도.
- main STEP3 병합/STEP4 착수는 **사용자 명시 승인 이전 금지**. 비공식 추정 STEP3 약65~70%, 전체 7단계 약38% 유지.
