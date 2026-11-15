# ASTRA PDF Redesigner — Windows 설치형 Electron MVP

**상태: 개발용 Windows 설치 파일 생성 및 패키징된 실행 파일 자동검사 성공. 판매 준비 완료는 아님.**

## 목표 및 브랜치 격리

- 브랜치: `feature/windows-electron-package-20261019` (안정된 main의 STEP 1·2 기반).
- PDF 가져오기 STEP 3은 독립된 Draft PR #3에만 존재하며, **이 설치 파일에 포함되지 않음**.
- 사용자 구매 과정에는 Node.js, npm, VS Code, CLI가 필요하지 않음: 설치 EXE 실행 → 바탕화면 아이콘 → GUI 사용.
- main 기능 파일과 STEP 3 Draft 기능 모두 **미병합·무변경**.

## 구현

- Electron 44.9.0 / electron-builder 26.15.3 / Windows x64 NSIS 설치 파일.
- 기존 React UI, `window.print()` 인쇄 기능, 이미지·JSON 입출력의 기존 STEP 2 편집기 재사용.
- Vite `base: './'`로 CSS/JS 리소스를 번들 내부의 상대 주소로 참조.
- 보안 표준 사용자 지정 `astra://app/` 프로토콜 사용. 앱 번들 밖 경로 차단.
- 보안 옵션: Chromium sandbox, contextIsolation, nodeIntegration 비활성, 외부 HTTP/HTTPS 요청 및 새 창 차단, CSP 적용.
- Electron 전용 안정된 userData 경로. IndexedDB와 localStorage가 앱 안에서 지속됨을 실제 Windows 런타임에서 검증.
- 일반 Chrome/Edge에 저장된 데이터는 **자동 복사되지 않음**. STEP 2의 `.localdoc.json` 내보내기/가져오기 절차로 이동해야 함.
- 프로그램 자동 업데이트/사용권 검증/유료 라이선스/인증서 서명은 현재 미구현.

## 검증 근거

| 구분 | 검증 결과 |
|---|---|
| GitHub Actions Windows | [#39205924586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586) **SUCCESS**, 코드 SHA `ab89fcb85ce2a847eba751254543983b50a59d82` |
| STEP 1·2 기존 테스트 | **16/16 PASS**, 0 FAIL/0 SKIP |
| 데스크톱 경로·보안 단위 테스트 | **3/3 PASS** |
| Vite 빌드/상대경로 검사 | PASS |
| Electron 개발 런타임 실행 | PASS: React 화면 로딩, secure scheme, IndexedDB, print API, localStorage 재접속 |
| electron-builder | Windows x64 NSIS EXE 패키징 PASS |
| 패키징된 실제 `win-unpacked/*.exe` | Windows에서 `--astra-desktop-smoke` 실행 PASS (이전 검사와 분리) |
| 설치 파일 검증 | 설치 EXE 1개 존재, 최소 크기, SHA-256 산출 PASS |
| Actions Artifact | `astra-windows-installer-unsigned-test`, id `12165647731`, 업로드 완료, 약 112 MB ZIP |

설치 파일 이름: `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`.
설치 파일 SHA-256: `26B6C2DEC5453A1C6233E7C7BED1ACECEE077F88103C757034A8D93F4A0A8FBC`.
다운로드: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586/artifacts/12165647731

## 개발자 실행 명령 (구매자는 사용하지 않음)

1. `npm install`
2. `npm test`
3. `npm run build`
4. `npm run desktop:verify`
5. `npm run desktop:smoke`
6. `npm run desktop:package`

설치 EXE는 `release/`에 생성. 설치 패키징·실제 Windows CI가 끝났다는 뜻이지, 소비자 PC 설치·삭제 절차가 통과했다는 뜻은 아님.

## 미완료 — 판매·배포 전 필수

- [ ] 고객용 Windows 10/11에서 설치/재설치/삭제, 프로그램 바로가기 및 PDF 저장 실제 수동 검증.
- [ ] Windows 인쇄 A4·한글·장문·이미지·JSON 가져오기/내보내기 확인.
- [ ] STEP 3 기능을 명시 승인 후 별도 병합, 실제 고객 PDF 5~10개 원본-출력 검수.
- [ ] 코드 서명 인증서와 SmartScreen 안내(서명 여부는 현재 검증되지 않음), 사용자용 로고·아이콘·EULA/지원 정책.
- [ ] 버전 업그레이드 시 IndexedDB/userData 보존 및 설치 파일 회귀 테스트.
- [ ] 구매자용 매뉴얼, 배포 파일 해시·악성코드 검사, 권한/라이선스 검토.

**릴리스 판정: 개발용 Windows 설치 파일 MVP 성공. 판매용 정식판 아님.**

## 네이티브 PDF 파일 저장 추가 검증 (2026-10-19)

- 이전 테스트판 이후 Electron preload IPC 기반 Windows GUI PDF 저장 대화상자 코드를 추가. 일반 웹판의 window.print() 동작은 유지.
- CI 코드 SHA e11076cf77946416bc59bcaa88227c8265499ab3. Windows Actions #39206761720 SUCCESS: Node 19/19, desktop 3/3, Electron 및 win-unpacked EXE 실제 PDF 파일 생성/저장(15,257 bytes), NSIS 패키징 PASS.
- 신규 unsigned 시험판 SHA256: 1FEB8C6801EB2870479955A5669B9405AC3117490A99954230AECB1470D3C84C.
- 설치 파일: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720/artifacts/12165323804 (7일 보존). 이전 검증/해시는 이전 시험판이며 이 링크가 최신.
- 상세: docs/WINDOWS_DESKTOP_NATIVE_PDF_EXPORT_2026-10-19.md. 고객 PC 설치/삭제, GUI 저장 창 수동 동작, 실제 한글·장문 A4 품질 미검증. 정식 판매 가능 판정 아님.

### NSIS 실제 설치/제거 자동 검증 — 2026-10-19 추가

- 코드 SHA `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5`; [Windows CI #39208406254](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254) **SUCCESS**.
- Windows isolated temp 경로에 unsigned NSIS **실제 /S 설치** → 앱/Uninstall EXE 확인 → 바탕화면·시작 메뉴 바로가기 각각 1개 → **설치된 앱 실제 실행+PDF 생성**(15,257 bytes) → `/S` 제거 → 앱/바로가기 제거 확인, 합성 userData marker 유지.
- Node **19/19**, 데스크톱 보안·수명주기 검사 **4/4**, TS/Vite·packaged exe PASS.
- 새 개발용 설치 파일 SHA256 `C49D217B48ECA4ABAA80296D2E03C80D0C331F8148C361D6C267DB5918A7977A`, [Artifact 12165714586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254/artifacts/12165714586), 2026-10-26 UTC 만료 예정.
- 상세 근거 `docs/WINDOWS_NSIS_INSTALL_UNINSTALL_ACCEPTANCE_2026-10-19.md`. **기존 링크/해시/미검증 항목은 이전 검증 시점 기록이며 이번 결과가 최신**. 수동 설치 마법사·GUI 저장 창/실제 한글·장문 PDF 시각 검증/기존 사용자 프로필 업그레이드/코드서명은 여전히 미완료.
