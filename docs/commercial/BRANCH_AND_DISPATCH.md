# GitHub 브랜치·통합·단일 작업 라우터

2026-10-25 | 책임자: ASTRA 총괄 | 저장소: `hibi89/astra_pdf_redesigner`

## 권한/브랜치
| 브랜치 | 목적/생성원 | 규칙 |
|---|---|---|
| `main` | 기존 STEP1/2 안정본 | 고객 데이터·원본 설계 보호; 검증된 PR만 명시적 승인 후 |
| `feature/step3-pdf-import-20261019` | **기존 Draft PR3** | 원본 브랜치 변경 금지, 안전한 통합은 새로운 별도 브랜치에서 |
| `feature/windows-electron-package-20261019` | **기존 Draft PR4** | 원본 브랜치 변경 금지, STEP3 아직 포함 안 됨 |
| `lead/astra-commercial-20261025` | main 2026-10-25 HEAD에서 신규 총괄 설계 | 상품 요구·WBS·기록 단일 출처, 테스트 사실과 계획 구분 |
| `feature/astra-pdf-fidelity-20261025` | **예정** PR3 HEAD에서 신규 파생 | B01~B04 PDF 정확도 독립 개선; PR3 본체 보호 |
| `integration/astra-commercial-core` | **예정** 총괄 검증된 기능만 순차 수용 | PR3/PR4 충돌 검증 A02 이후 생성, main 미병합 |
| `feature/astra-studio-ui` | **예정** integration 기반 | C 작업 UI/design |
| `feature/astra-local-humanize` | **예정** integration 기반 | D 작업 deterministic + on-device LLM |
| `feature/astra-sku-batch-brand` | **예정** integration 기반 | E 작업 SKU/배치/브랜딩 |
| `release/astra-windows-v1` | **예정** 통합 완료 후 | NSIS·서명/검증/배포 아티팩트, 배포 전 no-go 체크 |

기능 브랜치들은 **필요한 시점에 최신 통합 HEAD에서** 만들고, 현재 존재하지 않으면 '예정'이라고 기록한다. 빈 브랜치를 여럿 미리 생성해 기능 병합 충돌을 키우지 않는다. 실행 시 새 브랜치가 생성되면 이 표에 HEAD·PR 번호 갱신.

## 총괄 업무 규칙
1. 매번 `COMMERCE_START_HERE.md` → STATUS → WBS → ARCHITECTURE → HANDOFF → 해당 코드 branch latest SHA 확인.
2. READY 태스크 1개 선택: `TASK_ID`/수용 조건/예상 파일/기반 SHA 기록. 'ㄱ'은 다음 **1개 준비된 태스크** 실제 실행 의미.
3. 최초 DRAFT 보호: 관련 테스트 및 비파괴 수용/증거 없이 `main` 직접 수정·PR3/4 머지 금지. `lead` 계획 문서 PR은 draft로 공개 검토 가능.
4. 기능별 독립 브랜치에서 코드 변경·단위/브라우저/Windows 실검증(가능한 범위) 후 commit.
5. 비밀·고객 PDF·개인정보 GitHub Actions/Issue/PR/로그로 전달 금지. 합성 픽스처·권리 확인된 공개 자료만 CI.
6. 완료/실패/미검증: 테스트 실행 환경·명령·시각·SHA·PASS·FAIL·NOT RUN 구별. 자동검증은 Windows 실제 사용자 GUI 시험을 대체하지 않는다.
7. `docs/commercial/STATUS.md`와 `HANDOFF.md` 갱신. READY 다음 태스크 1개만 배정. 장애는 BLOCKED와 우회 경로 작성.
8. 큰 구조/라이선스/새로운 네트워크 전송/금전비용·판매범위 변경은 사용자 확인 필요. 이미 위임된 코드 설계/독립 브랜치 개발·기본 문서 갱신은 진행 가능.
9. 말뿐인 작업 보고 금지: 변경 파일 링크·커밋 SHA·테스트 증거를 반드시 남길 것.
10. 코드 변경 시 구 문서에 거짓 상태가 있으면 덮어쓰지 않고 신규 최신 상태를 우선한다; 원본 파일이 역사적 문서인 경우 변경하지 않는다.

## 브랜치 충돌 처리
- PR3/PR4는 둘 다 `main`에서 분기했으므로 서로 독립 구현이다. A01에서 루트/의존성/Root UI/앱 경로 교집합 체크.
- 통합 브랜치에 PR3 기능을 우선 도입해 STEP3 결과와 저장 모델을 고정하고, 이후 PR4의 Electron shell/IPC/NSIS 부분을 가져오는 방식(A안)을 기본 제안한다. 반대로 PR4 Windows shell에서 STEP3를 포팅하는 방식(B안)은 shell E2E/보안 위협 모델이 단순하면 채택 가능.
- A안: 콘텐츠 스키마 리스크 줄어듦, Windows packaging 충돌 일부 수작업. B안: Windows 보안/패키지 빠름, STEP3 UI/router 병합과 PDF.js worker 경로 위험. **반드시 비교/실제 CI 후 선택**.
- 통합 시 cherry-pick/merge commit/hunks 전부 근거와 diff 기록. `main`·Draft 원본 브랜치 변경 금지.
