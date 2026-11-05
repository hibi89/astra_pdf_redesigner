# ASTRA Windows 설치형 — GUI PDF 저장 기능 검증

## 확인된 완료 범위 (2026-10-19)

- 독립 브랜치: feature/windows-electron-package-20261019. 안정된 STEP1/2 main 기능만 포함하며 STEP3 Draft PR #3 기능은 불포함.
- Windows CI 검증 코드 SHA: e11076cf77946416bc59bcaa88227c8265499ab3.
- GitHub Actions #39206761720: completed/success. Windows Node 테스트 19/19 PASS(신규 PDF 저장 테스트 3 포함), 별도 데스크톱 보안 테스트 3/3 PASS, TypeScript/Vite 빌드 PASS.
- Windows 개발 Electron과 패키징된 win-unpacked EXE 모두 React 실행, secure astra:// origin, IndexedDB 및 localStorage 복원, preload IPC를 통한 실제 PDF 생성/파일 저장/재읽기 PASS.
- 실제 PDF: Electron printToPDF 결과 15,257 bytes, PDF 헤더와 디스크 파일 길이 확인. 인쇄된 페이지의 한글·이미지/표 픽셀 정확도와 Windows 파일 선택창의 수동 조작은 이 자동 테스트만으로 증명되지 않음.

## 소비자 GUI 동작

1. Windows 설치 EXE 설치 후 ASTRA 아이콘 클릭. 사용자가 CLI·Node.js·VS Code를 입력/설치할 필요 없게 설계.
2. 문서를 편집한 뒤 PDF 파일 저장 버튼 클릭. 일반 브라우저에서는 기존 인쇄 창을 유지.
3. Electron 앱에서는 Windows 파일 저장 대화상자로 PDF 파일명/폴더 선택. 선택 취소는 오류가 아니며, 권한·디스크 오류는 UI에 표시.
4. Electron main은 웹 콘텐츠에 파일시스템 권한을 노출하지 않고, 정확히 한 개의 PDF 저장 IPC만 허용. 저장 대상 경로는 운영체제의 저장 대화상자에서만 받음.
5. STEP2는 문서 저장 완료, 이미지 디코딩과 웹폰트 로딩 완료 후 PDF 생성을 호출.

## 변경 파일

- desktop/preload.cjs: contextBridge를 통해 astraDesktop.savePdf 한 가지 메서드만 노출.
- desktop/main.cjs: IPC 송신자/앱 origin 검증, showSaveDialog, A4 printToPDF, 파일 쓰기 및 오류/취소 응답. 격리 스모크 모드에서만 사용자 문서 폴더 대신 임시 프로필의 테스트 PDF를 생성하고 삭제.
- src/desktopPdf.ts: 웹과 데스크톱 출력 경로를 분기하는 타입 지정 함수.
- src/App.tsx, src/step2/Workspace.tsx: GUI 저장 버튼을 공통 함수에 연결.
- tests/desktop-pdf.test.ts: 웹 fallback, 저장/취소, 오류 및 예상 밖 응답 3개 회귀.
- tests/desktop-shell.test.cjs: preload/보안/IPC 경로 정적 검증.

## Windows CI/설치 파일 재검증

- 코드 SHA: e11076cf77946416bc59bcaa88227c8265499ab3
- 실행: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720
- Node 19/19, desktop 3/3, Electron 개발런타임과 패키징된 Windows EXE 실제 PDF 파일 쓰기 둘 다 PASS.
- 파일명: ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe (unsigned development test).
- EXE SHA256: 1FEB8C6801EB2870479955A5669B9405AC3117490A99954230AECB1470D3C84C
- Artifact: 12165323804, 112306801 bytes zipped. 다운로드: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720/artifacts/12165323804
- GitHub Artifact 보존 기한: 2026-10-26 UTC 전후, 약 7일. 정식/영구 배포 링크가 아님.

## 미완료·출시 게이트

- 실제 고객 Windows 10/11에서 NSIS 설치/재설치/삭제 및 바탕화면 바로가기 육안 검증 NOT RUN.
- GUI 저장 대화상자의 수동 폴더 선택/취소/덮어쓰기/권한 오류 실환경 테스트 NOT RUN (자동 Smoke는 대화상자 없이 테스트 전용 임시 파일에 저장).
- 출력 PDF 실제 A4/한글/숫자·긴 문서·이미지·표 마지막 페이지 누락·렌더링 정확도 수동 검수 NOT RUN.
- 브라우저 Chrome/Edge 사용자 데이터는 ASTRA 자체 origin으로 자동 이전되지 않음. STEP2 JSON 내보내기/가져오기가 필요하며 실기 검수 필요.
- 코드 서명·SmartScreen·앱 아이콘·EULA·고객 지원·업데이트 정책·실사용 문서 검수 필요.
- STEP3 PDF 가져오기 기능은 이번 빌드에 불포함; 별도 승인 후 통합/재패키징해야 함.

판정: 독립 GUI Windows 설치형과 로컬 PDF 파일 생성 기능의 자동 검증 통과. 상용 출시/실제 고객 인수는 미완료.