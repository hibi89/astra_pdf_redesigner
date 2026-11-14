# P121 — Electron OCR IPC 실실행 차단 기록

**상태:** BLOCKED · 0/1점 · 테스트 미실행 · 잠정 점수 영향 없음 (57/100)

P121은 검증된 OCR 공급 자산으로 Windows Electron에서 실제 PNG→kor+eng 호출, 취소/timeout, 임시파일 삭제, V2 미수정, 원본 PNG 대조를 시험해야 한다. P119의 공급자 서명/hash/PE closure/재배포권과 P120 실제 OCR 실행이 검증되지 않아 두 선행 조건이 충족되지 않았다.

임의 OCR 바이너리·시험 manifest를 제품 상수로 주입하지 않았다. 실제 subprocess/취소/timeout 결과는 **NOT RUN (BLOCKED)**이며, 점수는 0이다. OCR_MANIFEST=null 및 RELEASE HOLD 유지. P119/P120 선행 증거가 생기면 같은 Windows GitHub Actions runner에서 진행한다.
