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
