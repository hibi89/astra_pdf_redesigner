# P89 PRO/BUSINESS 출력형 디자인 후보 22종 — 2026-11-14 KST

- 범위: 기존 8개 BASIC 출력 결과와 V2 저장 데이터를 그대로 보존하고, 임시 미리보기/인쇄로 PRO 후보 12개, BUSINESS 후보 10개의 구조를 비교한다.
- 바뀐 파일: `src/step4/skuLayoutCandidates.ts`, `src/step2/Workspace.tsx`, `src/styles.css`, `tests/sku-layout-candidates.test.ts`, `tests/step4-style-preset-browser.mjs`.
- 선택형 레이아웃별 구조 요소: 상단·측면 여백, 문서 머리말의 프레임/축/패널/레일, 제목 정렬·크기, 섹션 구획선/간격, 본문 호흡. 색상만 바꾼 템플릿이라고 주장하지 않는다.
- 8개 기존 BASIC에 12/10 후보를 더했으나 **기존 UI에서 영구 저장할 수 없고, 정식 SKU 20/30 출시는 미구현**. P89 전체 목표의 일부일 뿐 100% 완성률 상승을 확정하지 않음.
- 기존 저장 `DesignSettings.theme` 8종/IndexedDB V2 schema, 라이선스 entitlement, 원문, PDF, main/PR은 변경하지 않는다. 확정 저장형 신상품/라이선스는 별도 승인 및 회귀 전에는 적용하지 않는다.
- 검증 조건: Node22 npm test/TS build, Chrome/Edge GUI 22 후보 선택 및 DOM 22개 구분·실제 A4 PDF 1종·임시 시안 취소/IndexedDB 원문 보존, Windows 설치/업그레이드 기존 8/8 A4. 특히 22개 후보의 실제 PDF 모두에 대한 텍스트/이미지·표/페이지 경계·눈으로 보는 수용은 **미검증**.
- 원본 설계 7단계, STEP6 레퍼런스·STEP7 OCR, 실제 한국어 모델/실고객 PDF·구매자 Win10/11·상업적 권리/판매 승인 미달로 **공식 최종률 UNASSESSED**, [작업중]·RELEASE HOLD 유지.
