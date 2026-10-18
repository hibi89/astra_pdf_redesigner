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
| 7. STEP1 마이그레이션 | v1 파서·V2 변환·동일 트랜잭션 marker, 원본 유지, 기존 ACTIVE 보존. 실제 새 Chrome 프로필에서 v1 선존재 cold-start·새로고침·중복 방지·원본 바이트 동일성 검증 | **실제 Chrome CI 검증** (저장 실패 주입 별도 미확인) |
| 8. 프로젝트 export/import | `.localdoc.json` 실제 다운로드 후 독립 Chrome 프로필 파일 입력으로 import, 이미지 Base64 원본 바이트·문서/디자인 복원·새 ID·기존 문서 유지·A4 PDF | **독립 프로필 Chrome CI 검증** |
| 9. UI 구성·접근성 | 문서함 접기, 편집·디자인·PDF·JSON, label·disabled·경고 제공 | 구현 확인; 키보드/모바일 전체 수동 대기 |
| 10. 테마·PDF | 기존 3종+compact, 공통 미리보기·인쇄, A4 PDF 15p/이미지/190줄 캡션 좌표·본문 보존 | Chrome CI 검증; Windows/Edge 및 픽셀 육안 수동 대기 |
| 11. 모듈 분리 | model/idb/images/projectFile/useWorkspace/Workspace 및 CSS 책임 분리 | 구현 확인 |
| 12. 개인정보·보안·라이선스 | IndexedDB/로컬, 백엔드/API/CDN 추가 없음, 시스템 글꼴·원본 메타데이터 및 백업 경고 | 코드 확인; 네트워크/OS 전수 보안감사는 미실시 |
| 13. 만들지 않을 기능 | STEP3 PDF 추출·OCR/AI/클라우드·캔버스/설치형 없음 | 범위 준수 |
| 14. 구현 순서 | V2 모델→저장·UI→이미지→JSON→테마→자동 검증 | 기록·코드 확인 |
| 15. 자동 테스트 | `npm test` 16/16; 실제 Chrome 이미지/JSON/IndexedDB/인쇄/동시 탭 및 선존재 v1 cold-start 마이그레이션 | **CI 검증** (프로필 간 JSON import 추가 필요) |
| 16. 수동 테스트 21항 | CI로 일부 대체 가능하나 Chrome/Edge·Windows 실 OS·한글 선택·키보드·새 프로필 검증 미완료 | 수동 대기 |
| 17. 완료 기준 | 기능 대부분 구현·Chrome 자동 검증. 외부 환경 수용 및 특정 이동·마이그레이션 경계 검증 추가 필요 | **STEP2 전체 완료 선언 보류** |
| 18. 실행·최종 보고 | `npm install` / `npm test` / `npm run build` / `npm run dev` 존재, `npm run lint`는 미설정 | 보고·기록 진행 중 |

## 이번 감사에서 발견한 결함·수정(기능 브랜치에만 반영)
1. **미저장 STEP2 편집을 남긴 채 STEP1 화면으로 이동:** 원래 `Root` 모드 변경은 `Workspace`를 즉시 unmount하고 타이머를 제거하므로 저장되지 않은 문서 변경이 유실될 수 있음. `Workspace.tsx`의 ‘기존 회고록 편집’은 **`await w.flush()` 성공 후에만 onLegacy 호출**, 실패 시 작업 화면에 남도록 수정. `tests/step2-browser.mjs`에 즉시 전환+실패 주입 회귀 추가.
2. **늦은 STEP1 최초 마이그레이션의 활성 문서 변경:** `idb.initialize`가 기존 V2 ACTIVE가 있음에도 migration 문서를 ACTIVE로 지정. **기존 ACTIVE가 이미 있으면 유지**, 없을 때만 마이그레이션 문서를 활성화하도록 수정. 같은 트랜잭션의 marker/doc 기록과 v1 localStorage 보존 유지. 모드 왕복 후 활성 V2 데이터 유지·중복 마이그레이션 방지 테스트 추가.
3. **STEP1 기존 브라우저 스모크의 초기화 경쟁:** 새 모드 전환 버튼이 준비 완료까지 disabled가 되면서 예전 테스트의 빠른 click이 무시됨. `tests/browser-smoke.mjs`에서 버튼 활성화를 기다리도록 수정.

> 위 3건의 **최종 코드 통합검증은 [Actions #39142445389](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39142445389) SUCCESS로 확인**. Node 16/16, TS/Vite 빌드, STEP1 15페이지 인쇄, STEP2 전체 기존 회귀와 빠른 화면 전환/저장 실패 차단/1회 마이그레이션/2탭 잠금 PASS. 검증 기능 SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`. 실패한 중간 CI는 마이그레이션 후 활성 문서 변경 발견, 테스트 대기 조건, 임시 Chrome 폴더 정리 충돌로 분석·수정한 기록이며 최종 성공으로 대체됨.

## 병합/완료 결정
- **판정: HOLD**. 현재 기존 STEP1 안정 main에 STEP2 기능 병합하지 않음.
- 병합 전 필수: 최근 수정분 전체 CI SUCCESS, v1 기존 데이터가 먼저 있는 상태의 실제 IndexedDB 마이그레이션/중복 및 실패 처리 E2E, 별도 Chrome 프로필 JSON import 왕복 복원 증거 확보.
- 사용자 최종 수용: Windows Chrome/Edge A4 PDF 저장·한글 선택·페이지 나눔/이미지·테마 육안 검수는 별도 수동 항목. 완전 검수 후 완료 여부 판단.
- 다음 단위 권고: 이번 CI의 진단/수정 검증 마무리 → **기존 STEP1 localStorage가 먼저 있는 새 프로필 cold-start**를 Chrome에서 재현하는 회귀 시험 추가. 필요시 미검증 import 이식 테스트 연계.
- 진행률은 테스트 항목 누락을 보수적으로 반영해 STEP2 **약 90~95%**, 전체 7단계 동등 가중 약 **27~28%**로 추정(난도·시간 반영 안 함). 임의의 100% 판정 금지.


## 최종 자동 검증 결과 — 2026-10-19 00:53 KST
- [Actions #39142445389](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39142445389) **SUCCESS**, 검증 소스 SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`. 실제 Chrome STEP1 렌더·A4 PDF15p, STEP2 이미지·프로젝트 JSON·IndexedDB 실패/복구·PDF 페이지 나눔·멀티탭 Web Locks 및 빠른 모드 전환 복귀와 재시도 시나리오 PASS.
- **기술 판정:** 이 브랜치의 위 검증 항목에서는 회귀 없음. 다만 사용자 지침 16·17절의 cold-start v1 실물 마이그레이션, 별도 프로필 import, Windows Chrome/Edge 수동 인쇄·한글/이미지 시각 확인은 증거 부족.
- **병합 판단 유지:** HOLD. 수용 증거 부족이 곧 구현 실패를 뜻하지는 않지만, 아직 main에 STEP2 통합 커밋을 만들지 않음.
- **다음 ㄱ:** 기존 유효한 STEP1 `localStorage`를 사전에 가진 신규 Chrome 프로필에서 마이그레이션 시나리오(원문·디자인·marker·중복 방지·원본 보존)를 실제 E2E로 재현. 이후 두 번째 신규 프로필에서 JSON 이식 검증. CI+Windows 수동 검수 후 병합 검토.


## 신규 Chrome 프로필 V1 선존재 마이그레이션 검증 — 2026-10-19 01:04 KST
- 신규 `tests/step2-cold-migration.mjs`: 앱 JS 실행 **전** 별도 Chrome 프로필에 실제 v1 `localStorage` 규격의 **합성 테스트 회고록** 저장. `Page.addScriptToEvaluateOnNewDocument`로 첫 로딩 전에 데이터 주입 후 주입 hook 해제. 실제 사용자 자료는 사용하거나 수정하지 않음.
- `schemaVersion:1` 제목/작성자/날짜/원문 4개 항목(빈 항목·줄바꿈·선후 공백·탭·특수문자 포함), theme/color/font/textSize → 단일 v2 문서, 각 section/paragraph 정확 복사·고유 ID 확인 PASS.
- V1 `localStorage` 원본 JSON 바이트 그대로 유지, V2 `activeDocumentId`를 신규 migrated doc으로 설정, `v1MigrationFinished` true 확인 PASS. Chrome 새로고침 후 중복 생성 없고 데이터·ID·원본 바이트 모두 같음 PASS.
- [Actions #39143261165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39143261165) **SUCCESS** (코드 SHA `abb3d9425e72a2708306674176346727ef0ea710`): 단위 16/16, TS/Vite 빌드, STEP 1/2 기존 Chrome E2E 및 신규 migration 테스트 3개 PASS.
- 테스트 종료 시 Chrome 임시 프로필 삭제가 종종 `ENOTEMPTY` 경고를 내기 때문에 테스트 함수 검증과 폴더 정리를 분리. 최종 CI에 정리 지연 WARN 하나 있지만 기능 검증 통과. 임시 자료는 합성 문서만 포함하고 ephemeral CI runner에서 실행.
- **여전히 미검증:** 초기 migration `readwrite` 강제 실패 시 완료 marker/원문 rollback(구현은 같은 transaction), 서로 다른 Chrome 프로필 사이 JSON 파일 내보내기/가져오기 실제 이식, 사용자 Windows/Edge A4·한글·미관·접근성 검수.
- **병합 판정 HOLD 유지**, 다음 `ㄱ`은 별도 신규 프로필 JSON 이식 E2E 한 단위. Step 2 추정 약 95%, 전체 7단계 동일가중 약 28~29%; 지난 단계 대비 5%p 이상 상승이 아님.

## 신규 독립 Chrome 프로필 A→B JSON 이식 검증 — 2026-10-19 01:19 KST
- `tests/step2-cross-profile.mjs` 신규 및 `.github/workflows/ci.yml` CI 추가. 테스트 데이터는 synthetic 텍스트와 Canvas에서 생성한 PNG 40×70 및 WebP 84×36 이미지로 한정.
- Chrome 프로필 **A**에 문서 작성·레이아웃 설정 및 2개 이미지 실제 IndexedDB 저장 → UI '프로젝트 내보내기'에서 `.localdoc.json` **실제 파일 다운로드** → 파일의 문서·이미지 원본 Base64 무결성 검증 PASS.
- 프로필 A 종료 후, 별도 사용자 데이터 디렉터리의 Chrome 프로필 **B** 실행. 기존 빈 문서만 있는 DB 상태 확인 → CDP `DOM.setFileInputFiles`를 사용해 프로필 A가 다운로드한 **같은 파일 경로**를 브라우저의 실제 `input[type=file]`에 전달 → 앱 기존 import 코드 실행.
- 프로필 B에서 기존 빈 문서 보존, 문서 본문/섹션·한글·줄바꿈·작성자·날짜/스타일 보존, PNG·WebP **원본 이미지 바이트·규격·종류·순서 일치**, 문서/섹션/블록/asset ID 재발급 및 참조 무결성 PASS. 새로고침 후 보존 PASS.
- Chrome B A4 PDF에서 문자열 표지와 내장 이미지 2개 확인 PASS (시각적 픽셀 검수는 아님).
- [GitHub Actions #39144399956](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39144399956) **SUCCESS**, 코드 SHA `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`; 단위 16/16, TS/Vite 빌드, STEP1/2 기존 Chrome 회귀 및 신규 cross-profile 검사 PASS.
- **잔여:** 초기 STEP1→STEP2 migration 트랜잭션 실패 주입·원자적 rollback 증거, 사용자 Windows Chrome/Edge A4·한글·시각·입력 수동 검수. **STEP2 최종 완료/main 병합 HOLD**. 추정 STEP2 약 96%, 전체 동등 7단계 약 28~29%; 이전 대비 5%p 상승 미만.


## 2026-10-19 01:29 KST — 최초 STEP1 마이그레이션 강제 abort·원본/marker 롤백 검증
- `tests/step2-cold-migration.mjs`에 `STEP2_INJECT_MIGRATION_ABORT=1` 테스트 모드 추가. **사용자 데이터가 아닌 합성 V1 원본**을 가진 신규 Chrome 프로필에서 실제 IDB `documents+meta` 마이그레이션 트랜잭션의 `put` 작업을 큐에 넣은 뒤 **동일 트랜잭션을 `abort()`**하여 원자적 롤백 검증.
- 실패 직후 DB 문서 **0건**, 완료 marker **없음**, ACTIVE **없음**, V1 `localStorage` 원본 JSON 바이트 **불변** PASS. 화면 저장 오류 안내 확인.
- 페이지 새로고침으로 1회 실패 주입 제거 뒤 자동 migration 재수행 → 문서/섹션4/원문/메타/디자인 보존·정상 marker/ACTIVE 생성 PASS. 추가 새로고침 이후 **단일 문서 유지**·marker/원문/IDs 불변 PASS.
- `.github/workflows/ci.yml`은 정상 cold-start 실행 뒤 실패 주입 모드를 따로 실행. 기존 `tests/step2-browser.mjs`의 저장 재시도 직후 화면 전환 버튼 활성화를 기다리는 검증 동기화 보완(앱 기능 코드 변경 없음).
- [GitHub Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408): **SUCCESS**, 검증 코드 SHA `a5009a76499a983aa4566adabddabf862c9e839b`. 단위 **16/16 PASS**, TypeScript/Vite 빌드 PASS, 기존 Chrome STEP1 15p PDF·STEP2 이미지/JSON·저장복구/멀티탭/프로필 A→B 이식 회귀와 신규 migration abort/재시도 PASS.
- **최종 수용·main 병합 HOLD:** 사용자 Windows Chrome/Edge에서 A4 PDF 저장·한글 글꼴 및 페이지/이미지 레이아웃·키보드 사용성 수동 검증은 미완료. 모든 종류의 실제 OS 전원 장애 및 브라우저 저장소 제한 환경을 검증한 것은 아님.
- STEP2 자동 검증 기준 추정 **약 97~98%**, 전체 7단계 단순 동일비중 **약 28~29%**(시간·난도 미반영). 다음 한 단위는 사용자 환경 수용 체크리스트 제공 및 테스트 결과 접수/필요시 수정과 `main` 병합 판단.
