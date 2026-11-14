# P120 — 실제 Windows Tesseract kor+eng 평가 (승인 선행조건 대기)

**상태:** BLOCKED · 인정 0/1점 · 실제 실행 가능성은 입증, P119 공급 승인과 전체 수용조건 미완 · 잠정 총점 61/100

## 실제 GitHub Actions 실행

정확 source SHA [`e293fcdc585792d1985cba5f31b032d050ede11c`](https://github.com/hibi89/astra_pdf_redesigner/commit/e293fcdc585792d1985cba5f31b032d050ede11c)의 Windows workflow [#43644765268](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43644765268)에서 공식 GitHub release asset SHA-256과 commit 고정 `tessdata_best` kor/eng 데이터로 Tesseract `5.5.3.20260724`를 임시 실행했다. 합성 한국어 사례 12개 전부 실제 OCR했고, 자동 적용이나 고객 데이터 사용은 없었다.

- **9/12 exact**, 3건 오인식/누락. 공백을 정규화한 평균 CER **0.0486**.
- `매출액`을 `매줄액`으로 인식 (CER 0.0667).
- `2,300,000원`을 `22300,000원`으로 인식 (CER 0.0625, 중요 숫자 불일치).
- `증빙 자료는 외부 전송 금지` 일부 누락 (CER 0.4545).
- 나머지 9건은 정확. 페이지별 기대/인식 텍스트, fixture SHA-256, CER, 중요 숫자 일치 여부는 [Actions OCR report artifact](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43644765268/artifacts/14133059583)에 기록됐다. 이 실행에서는 OCR 실행 자체가 성공했으나 제품 release signoff는 하지 않았다.

## 점수 보류 이유

P120의 선행 P119는 여전히 BLOCKED다. 설치 파일의 Authenticode는 `UnknownError`, DLL import closure와 모든 third-party license/NOTICE mapping은 미입증이다. 실제 엔진 smoke는 P120의 앱 내 원문 대조 경고·PSM3/6·취소 UI와 Electron IPC/V2 불변성까지 검증하지 않았다. 따라서 **P120 BLOCKED +0**이며 OCR_MANIFEST=null 및 RELEASE HOLD를 유지한다. 전체 PSM/취소/수동 검수·Electron 경로는 승인 가능한 공급 자산 선행 검증 뒤에만 진행한다.
