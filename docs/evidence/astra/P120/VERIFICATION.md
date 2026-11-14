# P120 — 실제 Windows Tesseract kor+eng 평가

**상태:** BLOCKED · 인정 0/1점 · 잠정 총점 61/100  
**정확 코드 SHA:** [`c365ba07df29cd6228a794f0c420230d448f91ee`](https://github.com/hibi89/astra_pdf_redesigner/commit/0f82c8f0764cd00460abe3b27f97b497ce61ceb5)  
**Actions:** Linux [#43650366545](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106432) PASS · Windows [#43650366554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409) PASS · 정본 정책 [#43650366939](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106804) PASS

## 실제 Windows 실행

GitHub-hosted Windows Server 2025 runner에서 upstream Tesseract 5.5.3.20260724와 commit 고정 `tessdata_best` kor/eng를 임시 경로에서 실행했다. installer release SHA-256 `bee9e3434bd94fd65387d9be28cd467a41f61b1275383b55b0f59a1331270ae4`가 GitHub Release digest와 일치했다.

- 12개 자체 합성 한국어 사례 중 **9개 exact / 3개 오인식·누락**, 평균 공백 정규화 CER **0.0486**.
- `매출액` → `매줄액` (CER 0.0667).
- `2,300,000원` → `22300,000원` (CER 0.0625, 중요 숫자 불일치).
- `증빙 자료는 외부 전송 금지` 문구 일부 누락 (CER 0.4545).
- 나머지 9건은 정확했다. 상세 report 및 PE import inventory는 [Actions artifact 14134094222](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409/artifacts/14134094222)에 있으며 SHA-256은 `d3466b486c91b2e24edb638104e7bc5ffeb8a11c9e889f641ebcc5e726ecc193`.

## 미완료 acceptance와 점수

이 실행은 실제 OCR 엔진과 오류 사례를 입증하지만 P119 공급처 승인, 제품 UI의 원문 대조·오류 경고, PSM 3/6 선택, 취소·정리 동작을 검증하지 않았다. 그래서 **P120 BLOCKED +0**이다. P121의 실제 Electron IPC/V2 불변성도 차단 상태다. OCR_MANIFEST는 null이고 제품 OCR은 비활성, RELEASE HOLD를 유지한다.


## 2026-11-15 re-run on latest audit SHA

The real Windows Tesseract 5.5.3 kor+eng smoke ran again on exact SHA [`c365ba07df29cd6228a794f0c420230d448f91ee`](https://github.com/hibi89/astra_pdf_redesigner/commit/c365ba07df29cd6228a794f0c420230d448f91ee), with Linux [#43650366545](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366545), Windows [#43650366554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554), and policy [#43650366939](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366939) all SUCCESS. Results remain 9 exact / 3 errors across 12 synthetic samples, mean whitespace-normalized CER 0.0486; the critical amount mismatch is unchanged. Updated OCR report [artifact 14135218120](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554/artifacts/14135218120) SHA-256 `9427dd87df4dcb09e2a8082123742968911e115bde7940bab12a69b5dca46565`. P120 remains BLOCKED +0 because P119 approval and full app/UI PSM 3/6 and cancellation acceptance are incomplete.
