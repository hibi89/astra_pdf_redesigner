# Windows 설치형 STEP2 저장 문서 → PDF 수용 검증 (2026-10-19)

## 목표와 근거
- **범위**: 이전 테스트의 직접 주입된 `.paper-surface` 합성 HTML을 넘어, **실제 STEP2 React 편집 UI → IndexedDB 문서/이미지 저장 → 페이지 재로드 → 실제 설치된 Electron EXE의 `printToPDF` → 디스크 출력 PDF 파싱**을 한 개의 격리된 합성 프로젝트로 연결한다.
- 비교안 A: 기존 인쇄 HTML 주입만 확대(빠르지만 실제 저장 경로는 미검증). **선택 B**: STEP2 UI 입력·저장·재로드 검사 후 인쇄(검증 범위 확대, 일부 실행비용 증가). 고객 자료·대용량 원본 사용 없음.
- 대상: `feature/windows-electron-package-20261019`, Windows Draft PR #4. **STEP3 Draft PR #3 및 main 기능 미변경·미병합**.
- 코드 검증 SHA: `c5113056ed4b779b245a50fd42d33a32b46d4b1b`.
- GitHub Actions [#39214047605](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605): **completed/success**, 위 코드 SHA 일치, 2026-10-19 16:11:22 KST 종료.

## 실제 코드·자동 테스트
- 신규 `desktop/step2-project-acceptance.cjs`: CI 전용 `--astra-desktop-smoke --astra-step2-acceptance` 모드. STEP2 UI의 실제 React 입력 이벤트로 한글 문서·장문 65행·구분 식별자·합성 PNG 2×2·이미지 설명을 입력하고 저장 버튼을 조작한다. UI '저장됨' 확인, `astra://app/index.html` 재로드 후 실제 IndexedDB의 활성 문서·문단·이미지 자산 메타를 독립 조회하고 이미지 디코딩을 확인한다.
- `desktop/main.cjs`에 CI 전용 실행 분기만 추가, 정상 UI·저장/출력·권한 설계 로직 무변경. `ASTRA_STEP2_ACCEPTANCE_OUT` 출력은 `GITHUB_ACTIONS=true` 및 `RUNNER_TEMP` 하위 고정 PDF 파일명·`wx` 비덮어쓰기 제한.
- `tests/windows-installer-lifecycle.ps1`: NSIS로 설치된 EXE를 두 번째 격리 프로필에서 실행해 실제 STEP2 저장 문서의 PDF 파일 생성 및 파싱, 설치/바로가기 제거·합성 사용자 데이터 마커 보존.
- `tests/verify-desktop-pdf.mjs --step2-project`: PDF.js 6.4.299로 실제 생성 파일을 파싱하여 **A4 전체 페이지, 한글/수치 식별자 5/5 각각 정확히 1회, 1개 래스터 draw, 문서함 이름 비인쇄**를 검증한다. 기존 A4 2페이지 직접 주입 fixture 검사도 유지.
- `tests/desktop-shell.test.cjs`의 CI 제한·테스트 연결 단위 항목 추가. 기존 STEP1/STEP2 Node 19/19 PASS, desktop 보안/Fixture 6/6 PASS, TS/Vite build, 개발 Electron, packaged EXE, 실제 NSIS 설치/제거 PASS.

## Windows 실제 실행 로그에서 확인한 결과
- `PASS ASTRA REAL STEP2 PROJECT: UI edit, IndexedDB document+PNG, reload, installed Electron PDF output`
- `PASS ASTRA INSTALLED STEP2 PDF CONTENT: A4 pages=3, persisted Korean/numeric markers 5/5, raster draw 1`
- `PASS ASTRA INSTALLED STEP2 PROJECT PDF: actual editor, IDB, reload, A4 text/image PDF`
- 이전 출력 fixture `A4 x 2, markers 6/6, raster draw 1`, NSIS INSTALL/UNINSTALL 및 Windows EXE smoke 결과도 유지.
- 최신 시험용 unsigned 설치 파일 `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, SHA256 `60048F38227DB08C43F9BC073938AC94D1BFD94A07AF91C424654EB9B8E134E6`.
- [GitHub Actions Artifact #12168803144](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605/artifacts/12168803144): ZIP 112,310,427 bytes, 2026-10-26T07:11:12Z 만료. **정식 판매/장기 배포 파일 아님.**

## 검증 한계·작업 경계
- CI는 실제 앱 UI에 자동화 JavaScript 이벤트를 보내는 시험이며 사용자가 Windows 저장창에서 폴더·취소·덮어쓰기를 수동 조작한 증거는 아니다. GUI 네이티브 SaveDialog는 이 테스트에서 열지 않는다.
- PDF 구조 검사 5개 토큰·A4·이미지 draw는 고객 문서의 누락 제로, 이미지 픽셀/색상·크롭 동일성, 2열 표 구조, 장문 페이지 나눔 육안 및 한글 폰트 가독성의 증명이 아니다.
- Windows 10/11 고객 PC에서의 SmartScreen·실제 설치 마법사/UAC, 업그레이드 후 실제 데이터 보존, 서명·자동 업데이트·판매 수용 **NOT RUN**.
- STEP3 PDF 가져오기 미탑재, PR3/PR4 open/draft/unmerged. 사용자 별도 승인 전 기능 브랜치 main 병합·STEP4 착수 금지.
- 현재 비공식 7단계 전체 약38% 유지. 데스크톱 상품화는 별도 검증 트랙.

## 다음 단위
Windows 동일 앱 버전 업그레이드 후 합성 IndexedDB의 **실제 프로젝트 문서+PNG** 보존 검사(기존 합성 marker만 보존한 시험에서 확장), 또는 실제 사용자 Windows 수동 GUI/실문서 수용 검증. 최소 수정·독립 CI 확인, 고객 데이터 외부 전송 금지.
