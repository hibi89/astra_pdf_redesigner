# STEP3 — 투명도·Form XObject 합성 위험 감지 / 실제 PDF 검증

## 범위와 결론

- **완료:** PDF.js `getOperatorList()`에서 그래픽 상태의 알파·블렌딩·소프트 마스크·투명 그룹 신호와 Form XObject 범위 신호를 **비파괴 검수 경고**로 분리해 표시. 위험 신호 수는 물체/픽셀/이미지 수, 원본 대비 보존율, 소프트 마스크 복원율이 아니다.
- **미구현:** Form·투명 그룹 전체의 픽셀 합성 동등성 재현, clipping/alpha effect의 PNG 픽셀 적용, 레이어/주석/표/벡터 객체 자동 완전 복원. 합성 PDF가 검증됐다고 실문서 수용 완료로 보지 않는다.
- **결과:** 고정 기능 SHA `1ebbb7958c477c309e22e24fed7255658f56b58b`; [GitHub Actions #39203639740](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203639740) `completed/success` (2026-10-19T05:18:05Z), two jobs successful. Node **43/43 PASS, 0 FAIL/0 SKIP**, TypeScript/Vite build PASS, Linux Chrome 및 Microsoft Edge155 전체 STEP1~3 자동 회귀 PASS.

## 검증 자료·측정

완전 합성 단일 페이지 A4 PDF 생성기 `tests/fixtures/step3-transparency-form-pdf.mjs`:
- 선택 가능한 텍스트 `FORM_ALPHA_SOURCE_201`, `FORM_ALPHA_END_202`.
- Form XObject 내부에 색상 raster XObject 및 vector rectangle stroke.
- 원본 페이지에 `ExtGState`를 적용해 알파 0.4 + 투명 그룹 또는 알파 1 + 일반 Form으로 변경. 실제 PDF.js `getOperatorList()`를 Node와 브라우저에서 사용하며, 고객 데이터/외부 서버 사용하지 않음.

| 실제 PDF.js 소스 | 관측된 경고 | 한계 |
|---|---|---|
| Form / alpha=0.4 / transparent group | **투명도 합성 위험 신호 3건, Form 범위 1건** | 알파·그룹 신호의 발생 횟수이며 투명 객체 개수 아님 |
| Form / alpha=1 / group 없음 | **투명도 위험 0건, Form 범위 1건** | 일반 Form 내부 이미지/벡터 합성의 동등성 보장 아님 |
| 기존 clip-only synthetic | 벡터 위험 오탐 0 · 클리핑 이미지 검토 경고 유지 | 실제 크롭 픽셀 동등성 미검증 |
| 기존 clip+stroke synthetic | 벡터 위험 양수 · 클리핑 경고 유지 | 표/벡터 구조 직접 재생성 아님 |
| 기존 mixed 2p A4 source/output | 13개 문자 마커 원본→출력 각 1회, PNG raster·A4, 기존 저장 문서 보존 PASS | 표 선/셀 레이아웃 동등성 미검증 |

## 코드·안전성

- 신규 `src/step3/graphicsRisk.ts`: `scanGraphicsComposition` 순수 함수. `OPS.setGState`의 `CA`/`ca`가 1 미만인지, `SMask` 활성인지, 일반이 아닌 `BM`, `OPS.beginGroup`, 투명 플래그를 분석. `OPS.paintFormXObjectBegin` 범위를 별도 계수. 인식 불가능한 인자 형식은 임의로 투명하다고 단정하지 않음.
- `src/step3/pdf.ts` → `src/step3/structure.ts`: 파일을 **브라우저 로컬에서만 분석**, 원본 텍스트/PNG 데이터 변형 없이 페이지별 `compositionRisk`로 전달. 필요한 경우 페이지번호를 붙여 `warnings`에 원본 대조 안내.
- `src/step3/ImportPanel.tsx`: `data-step3-composition-count`를 통해 위험 수와 Form 범위 수를 검수 단계에 표시. 기존 사용자 확정 체크박스와 IndexedDB 쓰기 전 검수·원본 비파괴 절차 유지.
- `tests/step3-transparency-form.test.ts`: 실제 PDF.js Form/alpha operator 검출 및 스캔, 가짜 `OPS.setGState`의 `ca, CA, BM, SMask` 단위 경계 검사.
- `tests/step3-browser.mjs`: 두 Form PDF를 각각 선택하고 HTML에 투명도 경고/일반 Form 경고가 나타나는지, 원본 선택 가능한 텍스트가 보존되는지, 확정 전 기존 문서 목록이 바뀌지 않는지 확인. 두 브라우저 실제 로그:
  - `PASS STEP3 FORM/ALPHA REVIEW: step3-transparent-form.pdf 투명도·합성 위험 신호 3건 · Form XObject 범위 1건`
  - `PASS STEP3 FORM/ALPHA REVIEW: step3-opaque-form.pdf 투명도·합성 위험 신호 0건 · Form XObject 범위 1건`

## 검증 절차와 범위 제한

- 먼저 probe-only 합성 테스트 SHA `67646c0d4233df350b78c36f5e7d7de69ba3c424`, [#39203296609](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203296609) **SUCCESS**로 투명/불투명 Form 실제 PDF.js 연산자 관측. 그 뒤 UI·경고 코드 추가.
- 최종 기능 SHA `1ebbb7958c477c309e22e24fed7255658f56b58b`, [#39203639740](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203639740) **SUCCESS**. Chrome job `117901675059`, Edge job `117901674699` 각각 로그 확인. TypeScript/Vite build·Node43/43·Chrome/Edge 전체 PASS.
- Mozilla PDF.js evaluator의 `setGState`는 `ca`, `CA`, `BM`, `SMask` 처리값을 OperatorList에 전달하는 구조. PDF.js 6.4.299과 다르게 업그레이드되면 검사 재실행 필요. 위험 수 0이어도 완전 보존 증거는 아니다.
- 실제 사용자 PDF 5~10개 검수, Windows Chrome/Edge 실제 PDF 출력·육안, 복잡한 투명 XObject 렌더링/투명 이미지를 원본과 픽셀 대조하는 시험은 **NOT RUN**.

## 브랜치·다음 작업

- `hibi89/astra_pdf_redesigner` / `feature/step3-pdf-import-20261019` / [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open, draft, **unmerged**. main STEP3 기능 미병합.
- STEP1 localStorage v1, STEP2 IndexedDB v2, 기존 원본 PDF/이미지 데이터/설계 PNG 및 토큰 **수정하지 않음**. synthetic 데이터만 Actions에서 사용. 앱은 로컬 프로그램이며 Production/Vercel 배포 없음.
- STEP3 **약65~70%**, 전체 7단계 **약38%**는 기존의 비공식 진행률 추정 유지(이번 CI만으로 실사용 정확도 수치 갱신 불가).
- 다음 `ㄱ`: 실제 합성 PDF에서 nested Form, soft mask, blending mode(동일/비동일) 구분 또는 사용자 수용용 원본 대조 검사 한 단위. main 병합·STEP4는 사용자 별도 승인 전 금지.
