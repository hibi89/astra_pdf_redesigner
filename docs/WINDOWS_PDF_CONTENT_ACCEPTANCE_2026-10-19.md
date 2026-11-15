# Windows 설치형 PDF 실제 파일 내용 검증 (2026-10-19)

## 결론 및 검증 범위

- **한 단위 자동 검증 완료**: GitHub-hosted Windows runner에서 NSIS 설치한 ASTRA STEP1/2 EXE가 생성한 **실제 PDF 파일**을 pdfjs-dist로 다시 열어 A4/2페이지/한글·숫자·라틴 문자/PNG 명령을 검사. 사용자 문서·브라우저 자료·클라우드 서버 미사용.
- **기능 코드 SHA:** `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`.
- **CI:** [Windows Actions #39210319075](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075) `completed/success`, 코드 SHA 일치, 2026-10-19T06:33:02Z. Node **19/19 PASS, FAIL 0, SKIP 0**, desktop **5/5 PASS**, TypeScript/Vite build PASS.
- 실제 NSIS 임시 설치→데스크톱/시작 메뉴 shortcut→설치된 EXE 두 가지 PDF 출력 검증→제거, synthetic userData sentinel 그대로 유지, 설치 파일 SHA/업로드 모두 PASS.

## 출력 PDF 자동 분석

| 항목 | CI에서 검증한 결과 | 판정 경계 |
|---|---|---|
| MediaBox/용지 | 출력 페이지 1/2 폭 약 595.28pt, 높이 약 841.89pt (A4 허용오차 2pt) | 육안 인쇄 여백은 아직 확인하지 않음 |
| 페이지 분리 | 정확히 **2페이지**, 시작/종료 고유 식별자가 원본 순서대로 각각의 페이지에 1회 | 복잡한 사용자 장문 자동 페이지 나눔의 품질 증거는 아님 |
| 텍스트 | 한글·숫자·ASCII **6/6 식별자 보존**, 각 1회. 한글 포함: `한글 문서 검증`, `마지막 페이지 확인` | 합성 Fixture에서의 PDF 텍스트 추출 검증이며 실제 사용자의 본문/서식·한글 폰트 육안 품질은 미검증 |
| 이미지 | 64×64 RGB 합성 PNG 이미지를 넣어 `pdfjs-dist`의 이미지 draw operator **1개 확인** | PDF 픽셀색/크롭/해상도 완전 일치는 미검증 |
| 파일 생성 | 설치된 Electron 실행→PDF buffer 생성·디스크 저장·재읽기→별도 Node PDF.js 구조 검사 모두 PASS | GUI Windows 저장 대화상자는 자동 스모크에서 사용하지 않음 |

## 구현/테스트 구성

- **`desktop/pdf-acceptance-fixture.cjs` 신규:** 런타임에 합성 64×64 RGB PNG를 CRC32/PNG chunk/zlib로 생성. 앱의 실제 STEP2 `.paper-surface` 안에 `.project-paper` 스타일의 문서 DOM 2페이지·한글 본문·이미지와 강제 페이지 분리 삽입. 테스트에만 사용되는 출력 화면이며 사용자의 실제 `ProjectDocument` 편집·저장 흐름을 테스트하는 것은 아님.
- **`desktop/main.cjs`:** 오직 `--astra-desktop-smoke --astra-pdf-acceptance` 및 `GITHUB_ACTIONS=true` 상태에서 테스트 Fixture 동작. PDF를 오직 `RUNNER_TEMP` 루트의 `astra-pdf-acceptance-*.pdf` 경로에 `wx`(덮어쓰기 금지)로 기록. 기존 일반 웹/데스크톱 사용자 저장 및 단일 최소 IPC 브리지 동작을 변경하지 않음.
- **`tests/verify-desktop-pdf.mjs` 신규:** 설치된 Windows EXE가 쓴 PDF만 입력받아 PDF.js `getDocument`, 페이지 크기, 페이지별 텍스트·한글·숫자 마커, 이미지 OperatorList를 검사. `pdfjs-dist@6.4.299`는 **개발/CI 전용 devDependency**, 설치된 앱에서 사용자 PDF 내용 분석용으로 추가하지 않음.
- **`tests/windows-installer-lifecycle.ps1`:** 설치된 EXE의 합성 출력 mode 실행→Node 검증→기존 NSIS 제거까지 순차 통과 필수화. `finally`에서 검사 PDF 한 개만 삭제, 전체 AppData 삭제 금지.
- **`tests/desktop-shell.test.cjs`:** 합성 PNG 헤더·식별자, CI-only output guard·정리 조건 단위 1개 추가(4→5). 기존 앱 웹판/이미지/저장 테스트 19개 변경 없음.

## 확인한 실제 Windows CI 로그

- `PASS ASTRA PDF CONTENT FIXTURE: installed renderer printed a two-page Korean/image synthetic preview`
- `PASS ASTRA INSTALLED PDF CONTENT: A4 x 2, Korean/numeric markers 6/6, raster draw 1`
- `PASS ASTRA WINDOWS PDF STRUCTURE: installed Electron PDF parsed and verified`
- `PASS ASTRA NSIS UNINSTALL: app and both shortcuts removed; synthetic userData preserved`

## 설치 파일 및 남은 검증

- 최신 Windows x64 unsigned 테스트 설치 파일: `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`
- EXE SHA-256: `FC91757AA962C167BA8D814A3F939ECBE3562085C45F5C32C894E4D16D0158D7`.
- [GitHub Actions Artifact #12167606844](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075/artifacts/12167606844), ZIP **112,308,696 bytes**, 자동 만료 **2026-10-26T06:32:53Z**. 정식 Release나 장기 보존 아님.
- **NOT RUN:** Windows GUI 저장창 실사용자 조작(취소/덮어쓰기 포함), 보이는 NSIS 설치 마법사·SmartScreen/권한, 실제 편집기 저장→출력까지의 긴 고객 문서·복잡한 표/이미지·한글 서체의 시각 품질, 실제 사용자 IndexedDB 데이터 버전 마이그레이션/이동, 코드 서명/자동업데이트/판매 라이선스.
- **STEP3 PDF 원본 가져오기는 Windows 설치 시험판에 미포함**. STEP3 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)와 Windows [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4)는 모두 open/draft/unmerged. 사용자 명시 승인 전 main 기능 병합/STEP4 착수 금지.
- 비공식 로드맵 전체 진행률 약38%는 이전 추정 유지. Desktop packaging 별도 상품화 트랙.

## 다음 한 단위

선택지 A: 실제 STEP2 IndexedDB 데이터를 테스트 GUI로 작성·저장→장문/이미지 PDF 출력→읽기 검증, 현재의 synthetic-preview-only 한계를 좁힘. 선택지 B: Windows 앱 업그레이드 후 합성 데이터 보존 테스트. 고객 자료는 보호된 로컬 환경에서 별도 검수.

**판정:** 고객 문서 리디자인 완성/실사용 품질이 아닌, **실제 설치된 Windows 프로그램이 합성 A4 2페이지·한글·이미지 출력 PDF를 생성했다는 자동 근거**.
