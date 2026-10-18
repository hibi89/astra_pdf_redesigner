# STEP 2 최종 요구사항 대조·main 병합 사전검수 (2026-10-19)

## 근거와 판정 원칙
- **기준 원본:** `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (18개 항목). 이 원본은 수정하지 않음.
- **소스:** `src/Root.tsx`, `src/App.tsx`, `src/step2/{model,idb,images,useWorkspace,Workspace,projectFile,mutationGate}.ts(x)`, `src/styles.css`, `README.md`, 관련 `tests/`.
- **통과 로그(기준점):** [Actions #39141151527](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39141151527) — Node unit 16/16 PASS, TS/Vite build PASS, Chrome STEP1 15p 인쇄, STEP2 PNG/JPEG/WebP/JSON/IndexedDB/페이지 나눔, Chrome 실제 2탭 Web Locks PASS.
- **판정 레이블:** **CI 검증**(실제 로그 확인), **구현 확인**(코드 있음·해당 경계 E2E 미확인), **수동 대기**(외부 환경 필요), **추가 검증 필요**(테스트 또는 코드 누락).
- **주의:** 코드는 사용자 PC에서 실행하지 않았고, Chrome CI 결과를 Windows/Edge 실사용 검증으로 표현하지 않음.

## 원본 지침 1~18번 대조
| 원본 항목 | 확인된 구현·검증 근거 | 판정 |
|---|---|---|
| 1. 이번 단계의 목표 | 순서형 섹션·블록 문서 작성, 로컬 저장, JSON 프로젝트 파일, Chrome 인쇄, STEP3+ 미포함 | CI 검증 |
| 2. 기존 프로젝트 확인 | React19/TS5.9/Vite7, 기존 v1 localStorage·문서 렌더러 보존, STEP1 regression | CI 검증 |
| 3. STEP1 핵심 기능 유지 | Chrome STEP1 A4 15p·테마/본문·빈 항목·로컬 상태 회귀 | CI 검증 / 사용자 OS 수동 대기 |
| 4-1. 여러 문서 관리 | 생성·선택·이름/제목 분리·복제/삭제·active ID 유지. 문서 빠른 전환 Chrome 검사 | CI 검증 |
| 4-2. 섹션/블록 편집 | 제목/본문/이미지 블록 생성·수정·순서 위아래·삭제, 원문 저장 검증 | CI 검증 |
| 4-3. 이미지 | PNG/JPEG/WebP 시그니처·디코딩·크기/용량 검사, 캡션·정렬·크기·교체/삭제 | CI 검증 (일부 UI만 구현 확인) |
| 5. 데이터 모델 | schemaVersion 2, UUID 기반 문서/섹션/블록/자산 ID·내용/디자인 별도·빈 섹션 출력 규칙 | CI 검증 |
| 6. 로컬 저장·보호 | IndexedDB 3 store, debounce·상태·빠른 전환 방어·QuotaExceededError 복구·교체 rollback·2탭 Web Locks | CI 검증 (브라우저 크래시/권한 강제 해제 미검증) |
| 7. STEP1 마이그레이션 | v1 파서·V2 변환·동일 트랜잭션 migration marker, 원본 유지. unit에서 원문 보존 확인. **늦은 마이그레이션 시 기존 ACTIVE를 덮지 않도록 수정** | 실제 기존 v1 데이터 **별도 브라우저 cold-start 검증 필요** |
| 8. 프로젝트 export/import | `.localdoc.json`, 이미지 Base64 실제 파일, 크기/타입/버전·허용값·중복/누락 참조, 새 ID·트랜잭션 | 동일 Chrome 환경 CI 검증; **다른 브라우저 프로필/origin 가져오기 수동/자동 별도 필요** |
| 9. UI 구성·접근성 | 문서함 접기, 편집·디자인·PDF·JSON, label·disabled·경고 제공 | 구현 확인; 키보드/모바일 전체 수동 대기 |
| 10. 테마·PDF | 기존 3종+compact, 공통 미리보기·인쇄, A4 PDF 15p/이미지/190줄 캡션 좌표·본문 보존 | Chrome CI 검증; Windows/Edge 및 픽셀 육안 수동 대기 |
| 11. 모듈 분리 | model/idb/images/projectFile/useWorkspace/Workspace 및 CSS 책임 분리 | 구현 확인 |
| 12. 개인정보·보안·라이선스 | IndexedDB/로컬, 백엔드/API/CDN 추가 없음, 시스템 글꼴·원본 메타데이터 및 백업 경고 | 코드 확인; 네트워크/OS 전수 보안감사는 미실시 |
| 13. 만들지 않을 기능 | STEP3 PDF 추출·OCR/AI/클라우드·캔버스/설치형 없음 | 범위 준수 |
| 14. 구현 순서 | V2 모델→저장·UI→이미지→JSON→테마→자동 검증 | 기록·코드 확인 |
| 15. 자동 테스트 | `npm test` 16/16; Chrome 실 E2E 사진/JSON/IDB/인쇄/동시 탭 별도 | CI 검증 (마이그레이션 cold-start·별도 프로필 import 추가 필요) |
| 16. 수동 테스트 21항 | CI로 일부 대체 가능하나 Chrome/Edge·Windows 실 OS·한글 선택·키보드·새 프로필 검증 미완료 | 수동 대기 |
| 17. 완료 기준 | 기능 대부분 구현·Chrome 자동 검증. 외부 환경 수용 및 특정 이동·마이그레이션 경계 검증 추가 필요 | **STEP2 전체 완료 선언 보류** |
| 18. 실행·최종 보고 | `npm install` / `npm test` / `npm run build` / `npm run dev` 존재, `npm run lint`는 미설정 | 보고·기록 진행 중 |

## 이번 감사에서 발견한 결함·수정(기능 브랜치에만 반영)
1. **미저장 STEP2 편집을 남긴 채 STEP1 화면으로 이동:** 원래 `Root` 모드 변경은 `Workspace`를 즉시 unmount하고 타이머를 제거하므로 저장되지 않은 문서 변경이 유실될 수 있음. `Workspace.tsx`의 ‘기존 회고록 편집’은 **`await w.flush()` 성공 후에만 onLegacy 호출**, 실패 시 작업 화면에 남도록 수정. `tests/step2-browser.mjs`에 즉시 전환+실패 주입 회귀 추가.
2. **늦은 STEP1 최초 마이그레이션의 활성 문서 변경:** `idb.initialize`가 기존 V2 ACTIVE가 있음에도 migration 문서를 ACTIVE로 지정. **기존 ACTIVE가 이미 있으면 유지**, 없을 때만 마이그레이션 문서를 활성화하도록 수정. 같은 트랜잭션의 marker/doc 기록과 v1 localStorage 보존 유지. 모드 왕복 후 활성 V2 데이터 유지·중복 마이그레이션 방지 테스트 추가.
3. **STEP1 기존 브라우저 스모크의 초기화 경쟁:** 새 모드 전환 버튼이 준비 완료까지 disabled가 되면서 예전 테스트의 빠른 click이 무시됨. `tests/browser-smoke.mjs`에서 버튼 활성화를 기다리도록 수정.

> 위 3건의 **최종 코드 통합검증 결과는 최신 Actions 성공 로그로 따로 판정**한다. 이전 성공 로그(#39141151527)는 이번 수정 전 기준이므로 수정본 성공으로 오인하지 말 것.

## 병합/완료 결정
- **판정: HOLD**. 현재 기존 STEP1 안정 main에 STEP2 기능 병합하지 않음.
- 병합 전 필수: 최근 수정분 전체 CI SUCCESS, v1 기존 데이터가 먼저 있는 상태의 실제 IndexedDB 마이그레이션/중복 및 실패 처리 E2E, 별도 Chrome 프로필 JSON import 왕복 복원 증거 확보.
- 사용자 최종 수용: Windows Chrome/Edge A4 PDF 저장·한글 선택·페이지 나눔/이미지·테마 육안 검수는 별도 수동 항목. 완전 검수 후 완료 여부 판단.
- 다음 단위 권고: 이번 CI의 진단/수정 검증 마무리 → **기존 STEP1 localStorage가 먼저 있는 새 프로필 cold-start**를 Chrome에서 재현하는 회귀 시험 추가. 필요시 미검증 import 이식 테스트 연계.
- 진행률은 테스트 항목 누락을 보수적으로 반영해 STEP2 **약 90~95%**, 전체 7단계 동등 가중 약 **27~28%**로 추정(난도·시간 반영 안 함). 임의의 100% 판정 금지.
