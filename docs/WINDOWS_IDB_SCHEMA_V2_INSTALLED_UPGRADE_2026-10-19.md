# ASTRA Windows 실설치 IndexedDB v1→v2 마이그레이션 독립 검증

- 범위: Draft PR #6 (`test/windows-idb-v2-installed-upgrade`), 기반은 Windows Desktop Draft PR #4. `main` 및 PR #4/#5의 코드에는 반영하지 않음.
- 별도 브라우저 Draft PR #5에서 검증한 스키마 변경과 동일한 형태: `VERSION=1→2`, 기존 `documents`/`assets`/`meta` 보존, `migrationAudit` 저장소만 추가.
- 기존 Windows 버전 번호 변경 테스트는 **동일한 앱 스키마**를 사용했으므로 이 검증을 대체하지 못함.

## 실제 Windows CI 재현 순서

1. 체크아웃의 원래 IDB **v1** React 앱을 빌드하고 Electron NSIS **0.1.0** 설치 파일 생성.
2. Windows runner의 별도 경로에 무인 설치하고 앱의 STEP2 GUI를 조작해 한글 장문, 이미지(PNG), 캡션을 실제 IndexedDB에 저장. Electron PDF 출력은 PDF 파서로 검사.
3. 업그레이드 준비 스크립트는 **GitHub Actions Windows + RUNNER_TEMP 조건에서만** 동작. 이 CI 작업 디렉터리의 `package.json`과 `src/step2/idb.ts`를 수정해 0.1.1 및 IDB v2 후보 생성. Git 커밋상의 제품 코드나 사용자 프로필은 수정하지 않음.
4. 반드시 `npm run build` 및 `npm run desktop:verify` 이후 별도 **0.1.1 NSIS 설치 파일** 생성.
5. **동일 설치 경로**에 0.1.1 덮어 설치. 설치된 실제 Electron EXE를 재시작하여 DB `version===2`, 필수 3개 저장소 및 추가 `migrationAudit` 존재, 종전 활성 문서/PNG/캡션/내용 유지 확인. 설치판을 제거.
6. CI 실패 시 위 항목 중 완료된 항목만 검증 성공으로 기록. Windows CI가 통과해도 실제 고객 PC, 서명/SmartScreen, 실고객 문서, 기존 설치된 앱의 예외 환경은 미검증으로 유지.

## 증거 및 상태

- Windows CI: [Actions run #39223771185](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39223771185). **작성 시점에 진행 중; PASS 미확정**.
- 실험용 Draft PR: https://github.com/hibi89/astra_pdf_redesigner/pull/6
- 기존 브라우저 기반 v1→v2 및 롤백 검증: [Actions #39222517425](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39222517425) SUCCESS.
- 두 Draft PR 병합, `main` 수정, STEP4 착수는 사용자 명시 승인 전 금지.
