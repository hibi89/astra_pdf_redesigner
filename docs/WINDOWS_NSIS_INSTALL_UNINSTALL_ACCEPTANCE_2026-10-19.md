# ASTRA Windows NSIS 실제 설치·실행·제거 회귀 검증

## 결과 (2026-10-19)

**자동 검증 단위 완료. 개발용 미서명 시험판이며 소비자 품질 인수 완료는 아니다.**

- 기능 브랜치 `feature/windows-electron-package-20261019` (안정된 STEP1·STEP2 기반). 검증 코드 SHA: `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5`.
- [Windows Actions #39208406254](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254) **completed/success**, 코드 SHA 일치, Windows runner 실제 로그 확인.
- Node 기존/신규 **19/19 PASS**, Electron 보안·설치 경로 정적 테스트 **4/4 PASS**, TypeScript/Vite 빌드 PASS.
- 개발용 Electron 및 `win-unpacked` EXE 실제 React/IndexedDB/localStorage·PDF 파일 디스크 저장 스모크 PASS. 추가로 **NSIS로 별도 임시 폴더에 실제 설치한 EXE**도 동일한 스모크(15,257바이트 PDF 생성/재읽기) PASS.
- 바탕화면 바로가기 **1개**, 시작 메뉴 바로가기 **1개** 생성 확인. `Uninstall` EXE로 실제 자동 제거한 후 설치 폴더·두 바로가기 제거 확인.
- 실제 Windows 러너의 앱 데이터 경로에 만든 **합성 sentinel 파일**을 제거 전후로 검사: 바이트 값 그대로 유지. 이 테스트로 고객의 기존 실제 문서 전체 보존까지 증명한 것은 아니다.

## 검증 설계 및 안전 경계

- `tests/windows-installer-lifecycle.ps1`: **GitHub Actions Windows + `RUNNER_TEMP`에서만 실행**. 실제 사용자 PC에서 직접 실행 불가하도록 환경 검사를 넣음.
- NSIS `/S`(silent) 및 `/D=임시-설치폴더`(명령줄 마지막 인자), 설치 EXE/Uninstall EXE 위치 확인. 설치·실행·제거가 서로 다른 작업 단계인 것을 실제 실행으로 입증.
- 설치 전 동일 임시 폴더가 존재하면 작업을 거부. 테스트 오류 시에도 임시 설치에 대한 제거를 시도. 사용자 홈 디렉터리 전체 삭제 금지.
- 앱 `--astra-desktop-smoke`는 분리된 PID별 userData 경로에서 React/저장 API/로컬 PDF 생성 후 테스트 PDF를 삭제. 고객 문서/토큰/네트워크 접근 없음.
- 원래 사용자 데이터 폴더 대신 hosted runner의 임시 사용자 프로필에 *합성 마커 파일 1개*만 만들고 제거 후 비교. 스크립트 `finally`는 마커 파일 1개만 정리하며 **앱 userData 폴더 전체를 재귀 삭제하지 않음**.
- `tests/desktop-shell.test.cjs`에 NSIS lifecycle 실행·보호 조건을 정적 검증하는 단위 검사 1개 추가. 기존 3개→4개.
- `.github/workflows/windows-desktop.yml`: unsigned NSIS 패키징→packaged EXE 실행→**silent install/shortcut/installed EXE/uninstall**→설치 파일 해시/Artifact 업로드 순으로 통과 필수화.

## 검증 로그 요약

| Windows 실행 단위 | 실제 관측 |
|---|---|
| 기존 Node 테스트 | **19/19 PASS**, fail 0 skip 0 |
| Electron 보안 테스트 | **4/4 PASS**, fail 0 skip 0 |
| NSIS 설치 | `PASS ASTRA NSIS INSTALL` |
| 바탕화면·시작 메뉴 | `PASS ASTRA NSIS SHORTCUTS: desktop=1 start-menu=1` |
| 설치된 EXE | `PASS ASTRA INSTALLED EXE` + PDF 15,257 bytes 생성/저장 |
| 실제 제거 | `PASS ASTRA NSIS UNINSTALL` (프로그램·바로가기 삭제, 합성 userData 유지) |
| CI 패키지 | unsigned `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe` |

최신 설치 EXE SHA-256: `C49D217B48ECA4ABAA80296D2E03C80D0C331F8148C361D6C267DB5918A7977A`.

- Artifact 이름 `astra-windows-installer-unsigned-test` / ID **12165714586**, ZIP 크기 **112,306,806 바이트**.
- 다운로드: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254/artifacts/12165714586
- 만료 예정: 2026-10-26T06:12:54Z (7일 retention). **영구 출시 링크 아님**.

## 여전히 필요한 검증

- 실제 고객 Windows 10/11 PC에서 보이는 NSIS 설치 마법사·삭제/재설치·권한/백신/SmartScreen 동작의 **수동 확인**.
- Windows `showSaveDialog` 대화상자 사용자가 직접 클릭하는 저장·취소·덮어쓰기 및 접근 권한 오류 **수동 확인**. 현재 스모크에서는 사용자 문서 폴더를 만지지 않도록 임시 경로에 PDF를 직접 기록.
- 출력 PDF의 실제 A4 규격, 한글, 장문, 이미지, 표·벡터·마지막 페이지의 **내용 보존/시각 품질**은 수동 검수 미완료.
- 설치 파일이 이전 버전을 덮을 때 IndexedDB/프로필 마이그레이션, 브라우저→앱 JSON 이식, 여러 Windows 버전·사용자 계정 권한 테스트 미실시.
- 사용자용 로고·코드 서명·SmartScreen·업데이트/EULA·고객지원/라이선스 및 상용 배포 준비 미완료.
- **STEP3 PDF 원본 가져오기·리디자인은 이 Windows 설치 시험판에 포함되지 않음.** 별도 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 승인·통합 및 Windows 재검증 필요.

## 저장소 상태와 다음 검증 단위

- 독립 [Windows Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4)는 open/draft/**unmerged**, `main`의 STEP1/STEP2 기능 무변경.
- `main`의 STATUS/HANDOFF 문서와 중앙 project-book/BOOK.md에 코드 검증 SHA와 문서-only SHA를 분리해 동기화.
- 다음 한 단위: A4/한글/이미지·여러 페이지 PDF의 실제 출력 구조/텍스트 검증 또는 설치형 업데이트 시 프로필 보존 검사. 고객 눈으로 확인하는 UX 검증은 별도.

**판정:** Windows CI에서 실제 설치·앱 실행·로컬 PDF 저장·바로가기·제거·합성 데이터 보존 검증 완료. 상용 판매 준비/STEP3 포함 **아님**.

### 생성된 PDF 내용 재분석 검증 추가 — 2026-10-19

- [CI #39210319075](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075) SUCCESS, 기능 SHA `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`: Node19/19·desktop5/5, 실제 설치된 EXE의 합성 A4 **2페이지**, 한글/숫자/ASCII 마커 **6/6**, 이미지 draw **1건**을 `pdfjs-dist`로 파싱 확인. NSIS 설치·제거도 PASS.
- 최신 EXE SHA256 `FC91757AA962C167BA8D814A3F939ECBE3562085C45F5C32C894E4D16D0158D7`, [최신 Artifact 12167606844](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075/artifacts/12167606844), 2026-10-26 만료 예정.
- 상세 [PDF 콘텐츠 검증](WINDOWS_PDF_CONTENT_ACCEPTANCE_2026-10-19.md). 미완료: 실제 STEP2 사용자 편집/장문·한글 시각 품질·수동 저장창·STEP3 통합. 이전 검증의 기존 Artifact URL은 구 시험 파일입니다.
