# P120 — 실제 Tesseract OCR 평가 차단 기록

**상태:** BLOCKED · 0/1점 · 테스트 미실행 · 잠정 점수 영향 없음 (57/100)

P120은 승인된 공급 자산을 전제로 실제 Tesseract `kor+eng` 실행과 12개 이상 합성 스캔의 페이지별 CER, 중요 숫자 정합, 오류 실패 사례를 기록해야 한다. P119가 공급자 바이너리 해시·Authenticode·PE/DLL closure·후보 묶음 재배포권 미확인으로 BLOCKED이므로 이 선행 조건이 충족되지 않았다.

실제 엔진을 임의 설치하거나 출처가 확정되지 않은 패키지를 사용하지 않았다. mock 또는 기존 2/3 합성 결과를 P120 점수로 재사용하지 않는다. OCR_MANIFEST=null, RELEASE HOLD 유지. **실제 Tesseract 실행: NOT RUN (BLOCKED); CER/CSV/JSON 결과: 없음; 점수: 0.** P119 공급처·권리와 Windows Actions에서 실행할 검증 자산이 확보될 때 재개한다.
