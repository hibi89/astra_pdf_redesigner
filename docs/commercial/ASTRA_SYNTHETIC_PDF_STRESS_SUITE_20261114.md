# Astra PDF — 고난도 합성 PDF 8종 사전 검증 (2026-11-14 KST)

사용자 지시: 쉬운 PDF뿐 아니라 고의적으로 어려운 샘플을 만들어 테스트. 채팅 산출물 `astra_pdf_stress_suite_20261114.zip` (8 PDF + manifest.json, SHA256 포함). GitHub에는 고객 문서/생성 PDF 바이너리를 무단 업로드하지 않음.

| 파일 | 난이도/필수 검증 |
|---|---|
| 01_korean_english_financial.pdf | 2페이지 한영 혼합 숫자·원문 토큰 |
| 02_dense_table_42x7.pdf | 42행 7열 고밀도 표/금액/마지막 행 |
| 03_two_column_reading_order.pdf | 2단 각22행 읽기 순서 |
| 04_vector_chart_shapes.pdf | 벡터 도형·곡선·막대/범례 보존 |
| 05_landscape_small_text.pdf | 가로형 A4, 작은 글자 25행 |
| 06_watermark_rotated_footnote.pdf | 회전 텍스트·워터마크·6pt 각주 |
| 07_scanned_image_only_skew_blur.pdf | 스캔 이미지-only/1.7도 기울기·blur, 텍스트 추출 0자/OCR 필수 |
| 08_mixed_three_page_boundaries.pdf | 3페이지 복합 표·큰 여백·마지막 페이지 보존 |

**독립 사전 테스트 실제 결과:** ReportLab/Pillow/PyMuPDF로 8종 생성, PyMuPDF 8/8 렌더 PASS. 07은 PDF 내 텍스트 추출 0자, 2x 렌더→로컬 Tesseract `kor+eng --psm 6` OCR에서 한글 문장 다수 인식되지만 `O0Il1`을 `0011` 등으로 오인하는 품질 오류 확인. OCR 성공/정확100% 아님.

**미검증:** Astra Electron 실제 UI의 8종 가져오기→원문 수동 승인→재디자인→PDF A4 출력·표/이미지/다단/각주/페이지 순서 비교; Windows10/11 실제 구매자 환경. 테스트용 PDF 제작과 외부 PyMuPDF/Tesseract 사전 검증을 Astra 제품 E2E PASS로 혼동하지 않는다.

**필수 다음 테스트:** 8종 전체로 브라우저 PDF.js 인식/페이지·텍스트·그림 구조 비교; 스캔07은 OCR 없으면 명시 FAIL/수동 검토 필요, 빈 추출을 성공 처리 금지; 출력에서 표42행×7열·다단 좌우순서·벡터·가로A4·각주6pt·3페이지 끝 마커 보존. 모델/OCR 실제 패키지 라이선스/CPU/보안, 사용자 PC 검증 및 판매 별도 GO. 공식 12영역 100점 배점 사용자 승인, 증거 점수 산정 대기/100% 미달. RELEASE HOLD.
