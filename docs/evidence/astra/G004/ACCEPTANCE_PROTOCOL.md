# G004 — 실제 허가 PDF 5~10건 및 물리 Windows 10/11 수용 프로토콜

**기준일:** 2026-11-15 KST. 실제 고객 원본 PDF를 공개 GitHub/Actions에 올리지 않는다. 아직 검증된 고객 문서 0건. A11 0/7점 유지, 공식 `UNASSESSED`, `RELEASE HOLD`.

## A. 사용자가 로컬에서만 수행할 최종 수용

1. 사용할 PDF 5~10개를 소유·수용 권한이 확인된 자료에서 선정한다. 스캔·표·다단·혼합 이미지·한글/영문·긴 보고서 등 난이도를 섞는다. **원본 문서·고객 정보·파일명·원문 본문을 외부에 보내지 않는다.**
2. 로컬에서 각 원본 PDF의 SHA-256을 검수 전후에 계산한다. **개별 해시 값·파일 경로는 로컬 비공개 기록에만 유지**한다.
3. 실제 Astra Windows 앱에서 가져오기→추출 대조→경고 확인→디자인 변경→PDF 출력→원본/출력 2창 수동 비교를 수행한다.
4. 각 케이스의 문장·숫자·금액·부정문·표 셀·이미지 누락/왜곡·다단 읽기 순서·A4 인쇄·폰트 대체/겹침을 검수한다. 문제가 있으면 결과를 통과로 표시하지 않고 수정 및 재검토한다.
5. Windows 10 및 Windows 11 **물리 PC**에서 설치·업그레이드·제거·IndexedDB 문서/PNG 복구·SmartScreen/서명·오프라인 CPU 속도/메모리를 별도 확인한다. Actions runner의 Windows는 물리 구매자 PC 수용을 대신하지 않는다.
6. 검증이 완료된 후에만 **익명 결과 요약**을 `docs/evidence/astra/G004/OWNER_ANONYMOUS_TEMPLATE.json`의 구조에 맞춰 로컬에서 작성한다. 케이스 ID는 `CASE-01`~`CASE-10`, 입력 가능한 필드는 정해진 enum/숫자/참거짓으로 제한한다.
7. `node tools/gpt-final-qa-owner-acceptance.cjs <local-anonymous-summary.json>`로 검증할 수 있다. 결과는 문서 원문 없이 **집계 수치만** 출력하며, 모든 검사에서 문제가 없더라도 **`MANUAL_EVIDENCE_REVIEW_REQUIRED`**에 머문다. 실제 판매 승인과 최종 채점은 사용자 별도로 한다.

## B. 코드 경계

- `tools/gpt-final-qa-owner-acceptance.cjs`는 원본 PDF 파일을 읽지 않는다. **익명 요약**만 검증하며 파일 경로·원문·고객 이름·해시 등의 추가 필드를 거부한다.
- `tests/gpt-final-qa-owner-acceptance.test.cjs`에서 5~10건 범위, 소유자 실행 주장, 익명 ID, Windows10/11, 표/스캔/다단 등 범위, 오류 건수, 파일명·원문 필드 거부, 시뮬레이션 결함 감지, 서명되지 않은 요약으로 승인 불가를 검수한다.
- `OWNER_ANONYMOUS_TEMPLATE.json`은 모든 수용 관련 필드가 `false`인 **미실행 샘플**이다. 사용자 PC에서 수용한 실제 결과로 절대 오인하지 않는다.
- 시스템/프로그램은 외부 고객 PDF, 실 소유자 키, Windows 서명/판매 설정을 변경하지 않는다. 
- **검증의 한계:** 요약 데이터의 참/거짓은 자체 입력이므로 원본 동의·물리 PC/육안 수행 증거의 진위는 자동으로 증명하지 못한다. 모든 케이스 오류가 0이어도 `buyerAcceptance=UNASSESSED`, `scoreDelta=0`, RELEASE HOLD 유지.

## C. 수용 책임 및 중단 조건

- 소유자의 실제 법적 PDF 사용 허락 및 구매자 개인정보 보호가 선행한다.
- 실제 A11 완료 조건: 허가 PDF 5~10건의 원본-출력 수동 육안 검수 통과, 문서별 비공개 증거/동의, 차이가 있으면 설명된 미지원 경고 및 수정 재검증.
- 실제 A10 최종 Windows 판정은 물리 OS/설치·저장복구·서명/SmartScreen 확인 및 최종 사용자 승인.
- 완전 검증 전에는 최종 100점·상품 출시·고객 수용 완료 주장 금지.

**다음 READY:** G005에서 PR #12 독립 QA 변경 diff·실 CI·점수 문서 검수, Codex #13의 신규 SHA/Windows P124 결과 재확인. Codex F01/F02 해소 전 +0.
