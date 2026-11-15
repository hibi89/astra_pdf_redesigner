# G002 — PDF 원본·내용 보존 독립 QA 보조 게이트

**기준:** 2026-11-15 KST. 제품 최종설계 A03/A07/A11 검증 지원용 **합성 스냅샷 검증기**이며, 실제 PDF 수용/점수 승인과 구분한다.

## 신규 검사

- `tools/gpt-final-qa-text-fidelity.cjs`: 세 가지 서로 독립적으로 획득한 텍스트 스냅샷(원본 추출/앱 가져오기/출력 PDF 추출)과 사용 전후 원본 PDF **바이트 SHA-256**를 비교한다.
- `tests/gpt-final-qa-text-fidelity.test.cjs`: 금액 `2,300,000`→`22300,000` 오인식, 부정문 누락, 표 행 순서 역전/중복, 원본 바이트 변경, Unicode NFC/공백 재흐름, 입력 유효성, 원문 비노출 테스트.
- 출력은 위험코드/건수와 해시만 포함하고 **문서 본문과 파일 경로를 출력하지 않는다**. 파일을 수정/저장/전송하지 않는다.
- 한글 텍스트 정규화는 NFC+공백 압축만 허용한다. 숫자 정규화에서 쉼표를 지우지 않아 OCR의 금액 오류를 감지한다. 표 행은 별도 순서와 중복 위험 검사. **다단 읽기 순서·PDF 내 실제 표 좌표/이미지·폰트·인쇄 A4 외형은 확인하지 못한다.**

## 검증 경계

- 이 스냅샷 도구는 **PDF parser가 아니다**. 호출자가 공급하는 `sourceText/importedText/outputText`가 진짜 PDF에서 정확히 추출됐는지 검증하지 않으므로 `pdfExtractionAuthenticity=NOT_VERIFIED`.
- 기존의 실제 PDF.js 파서 테스트 `tests/pdf-integrity-audit.mjs`, `tests/owner-pdf-source-output-review.test.mjs`, `desktop/pdf-output-audit.cjs` 등은 삭제하거나 대체하지 않는다.
- 데이터는 합성, ASCII PDF header의 더미 바이트만 사용하므로 물리 Windows·실고객 5~10건·실 PDF 시각 육안 검증의 대체가 아니다.
- 상태는 `SYNTHETIC_TEXT_PARITY_REVIEW_REQUIRED` 혹은 `POTENTIAL_CONTENT_DIFFERENCE_REVIEW_REQUIRED`로만 보고한다. 상품 승인과 점수 변화는 모두 **0점**, RELEASE HOLD.
- 추후 G003에서는 실제 출력 PDF 파서로 수집한 스냅샷을 **정확 SHA의 결과**로 본 게이트에 연결한 후 A03/A07 오류를 독립 검토한다.

## 안전 조건

원본 파일의 최초 SHA와 수용 종료 SHA를 모두 수집하고 동일성 확인. 실제 고객 문서는 공개 Actions/저장소에 절대 올리지 않으며 실제 수용은 사용자 PC에서만 수행. 이 코드·테스트는 Electron, React UI, 저장 스키마, Codex C001 경로를 수정하지 않는다.
