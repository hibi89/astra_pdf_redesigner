# STEP 2 — Windows Chrome/Edge 수동 수용 체크리스트 (2026-10-19)

> **검수 상태: 21개 원본 수동 항목의 전체 승인 0건 / Windows Chrome 짧은 A4 PDF 일부 확인 / Edge·긴 문서·이미지 검수 대기.** 사용자가 제출한 Windows Chrome 짧은 PDF에서 A4 규격·한글 표시와 텍스트 추출·인쇄 UI 제외는 확인했지만, 21개 항목의 포괄적 수동 시험이 끝난 것은 아니다. 그래서 아래 체크박스는 아직 미체크 상태다. 기준 원본은 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` §16의 21개 항목과 §17의 완료 기준이며, 아래 1~21 번호·의미를 보존한다.

## 0. 검증된 범위와 별도 수용 범위

- 소스 저장소: `hibi89/astra_pdf_redesigner`, 대상 브랜치 `feature/step2-full-20261018`. **`main`은 STEP 1 기능 유지, STEP 2 코드 미병합**.
- 기준 자동 증거: [GitHub Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) **SUCCESS**, 검증 코드 SHA `a5009a76499a983aa4566adabddabf862c9e839b`. Node22 단위 16/16·TS/Vite 빌드·Linux Chrome PDF/IndexedDB·실제 두 탭·기존 STEP1 마이그레이션 실패 주입/원본 보존·PNG/JPEG/WebP·프로필 A→B JSON 이식 통과.
- 자동 검증은 Windows Chrome/Edge **실제 저장한 PDF의 한글 폰트·페이지 모양·키보드 조작/작은 창 시각 검증을 대신하지 않는다**.
- 테스트 원칙: **실제 사용자 문서·기존 브라우저 프로필을 수정하거나 삭제하지 말 것.** 로컬 별도 포트·전용 임시 브라우저 프로필 및 합성 문서만 사용한다. 사용자 프로젝트 원본은 별도 백업한 상태로 보관.

## 1. 사용자 Windows 로컬에서 테스트 준비 (필요할 때만 실행)

Node.js **22 이상**, Git, Chrome, Edge, PowerShell이 설치되어 있어야 한다. 일반 PowerShell 창을 열고 테스트 전용 신규 폴더를 생성한다. 이 명령은 기존 GitHub 원본 또는 사용자 브라우저 데이터를 변경하지 않는다.

```powershell
git clone --branch feature/step2-full-20261018 --single-branch https://github.com/hibi89/astra_pdf_redesigner.git astra-step2-acceptance
cd astra-step2-acceptance
node --version
npm install
npm test
npm run build
npm run dev -- --port 4178 --strictPort
```

- `npm run dev`를 실행한 **첫 PowerShell은 종료하지 않는다**. 앱 접속 주소는 `http://127.0.0.1:4178`. 기존 기본 `5173` 포트를 피하는 이유는 **origin별 IndexedDB/localStorage가 분리**되기 때문이다. `npm run lint` 스크립트는 현재 `package.json`에 **없다**.
- 안전한 별도 Chrome 프로필을 사용하려면 **다른 PowerShell**에서 아래 명령을 실행한다. 실제 설치 위치가 다르면 `$chrome` 경로를 먼저 수정한다.

```powershell
$chrome = Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'
if (!(Test-Path $chrome)) { $chrome = Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe' }
if (!(Test-Path $chrome)) { throw 'Chrome 실행 파일 경로를 직접 확인하세요.' }
$testChrome = Join-Path $env:TEMP ('astra-step2-chrome-' + (Get-Date -Format yyyyMMddHHmmss))
Start-Process -FilePath $chrome -ArgumentList @("--user-data-dir=`"$testChrome`"", '--no-first-run', 'http://127.0.0.1:4178')
```

- Edge는 위 Chrome과 **서로 다른 프로필 경로**로 실행한다.

```powershell
$edge = Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'
if (!(Test-Path $edge)) { $edge = Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe' }
if (!(Test-Path $edge)) { throw 'Edge 실행 파일 경로를 직접 확인하세요.' }
$testEdge = Join-Path $env:TEMP ('astra-step2-edge-' + (Get-Date -Format yyyyMMddHHmmss))
Start-Process -FilePath $edge -ArgumentList @("--user-data-dir=`"$testEdge`"", '--no-first-run', 'http://127.0.0.1:4178')
```

- **같은 origin이라도 Chrome과 Edge 프로필은 서로 다른 데이터 공간**이다. 두 앱 간 이식은 `.localdoc.json` 내보내기·가져오기를 사용한다.
- 전용 테스트 프로필은 다른 앱/문서가 저장된 기존 프로필이 아니다. **검증이 끝나기 전·백업을 확보하기 전 프로필/사이트 데이터를 삭제하지 않는다.** 앱을 닫더라도 서버 중지 `Ctrl+C`는 안전하다.

## 2. 빠른 수용 절차 — 사용자 PC에서 우선 확인할 7개 관문

### M1. Chrome / Edge A4 PDF 시각 확인
- Chrome과 Edge에서 각각 **합성 테스트 문서**를 생성한다. 예: 제목 `STEP2 A4 검수`, 작성자 `테스트`, 본문 `한글 가나다 ABC123\n두 번째 문단\nhttps://example.com/very/long/path/without/spaces`.
- 이미지 PNG·JPEG·WebP에서 **가로 이미지/세로 이미지**를 각 한 개 이상, 캡션은 짧은 것과 긴 것 모두 추가한다. 서식·본문 변경 후 `저장됨`을 확인한다.
- 앱의 **PDF 저장 / 인쇄** 클릭 → 인쇄 대상 **PDF로 저장** → 용지 **A4** → **머리글과 바닥글 끔**. 배경 그래픽은 **끔/켬 모두** 적어도 한 번 확인한다. 브라우저에서 앱 UI가 인쇄되지 않는지 확인한다.
- 저장한 PDF를 별도 뷰어로 열어 **한글 글꼴·문자 선택/복사**, 페이지 끝 문단, 이미지 종횡비·잘림, 캡션 경계, 앱 UI 제거를 **육안 검사**한다. 파일명에 브라우저와 테스트 사례를 표기한다.

### M2. 기존 테마 3종 + 컴팩트 리포트
- 4종 테마, 포인트 색상, 글자 크기(작게/보통/크게), 고딕·명조를 바꿔도 본문이 변하지 않는지 확인. **테마별로 배치·여백·섹션 라벨·캡션**이 읽히는지 비교한다.

### M3. 새로고침·문서 전환
- 문서 A/B 2개를 빠르게 전환하고 새로고침한다. 각 원문·이미지·디자인이 섞이지 않아야 한다. 마지막 문서 복원도 확인한다.

### M4. 이미지 복제·삭제
- 이미지가 있는 **합성 문서**만 복제한 후 원본을 삭제한다. 복제본의 이미지·본문이 살아 있어야 한다. 실제 사용자 문서는 삭제 금지.

### M5. Chrome → Edge 백업 이식
- Chrome 테스트 문서에서 `프로젝트 내보내기` → `.localdoc.json` 다운로드 → **Edge 신규 테스트 프로필**의 `프로젝트 가져오기` 선택. 이미지·본문·서식이 동일하고 Edge의 기존 테스트 문서가 덮이지 않아야 한다.
- JSON은 **암호화되지 않음**. 개인 자료 대신 합성 데이터 사용.

### M6. 음성·키보드·작은 창 확인
- 브라우저 너비를 약 390px로 줄이거나 반응형 도구를 이용해 편집기/버튼/미리보기가 심하게 겹치지 않는지 확인. `Tab`, `Shift+Tab`, `Enter`, `Space`만으로 자주 쓰는 버튼·라디오·파일 업로드에 접근할 수 있는지 확인한다. 오류는 색 이외 텍스트로도 보이는지 기록한다.

### M7. STEP 1 원본·외부 네트워크
- STEP 1 영역을 열어 미리보기·테마·A4 인쇄가 유지되는지 확인. **기존 실제 데이터와 분리된 테스트 프로필에는 STEP 1 원본이 없을 수 있으므로** 원래 데이터 마이그레이션 자체는 CI를 근거로 처리하고, 본인 실제 저장 데이터를 임의 변형/삭제하며 시험하지 않는다.
- 앱은 테스트용 로컬 Vite 서버만 사용한다. `npm install`에는 네트워크가 필요할 수 있다. 개발 서버가 뜬 뒤 문서/이미지 입력·인쇄·JSON 작업에 별도 백엔드/API가 필요한지 관찰한다. 오프라인 검증은 의존성 설치 후 앱/이미지가 로드된 상태에서 수행한다.

**빠른 수용 기준:** M1~M5는 최소한 Chrome·Edge에서 실행하고, M6과 M7도 실패·제약을 기록한다. **PASS가 안 된 항목을 일괄 PASS로 처리하지 않는다.**

## 3. 원본 지침 §16 — 번호를 보존한 21개 수동 체크리스트

검사 날짜, 브라우저 버전 및 OS 빌드는 마지막 보고 양식에 별도로 기록한다. 아래 체크박스는 실행 후 본인이 직접 표시한다.

- [ ] **01** 기존 STEP 1 저장 데이터가 있는 환경에서 실행 (실사용 프로필 변경 금지; 테스트용 v1 샘플 또는 CI 증거 활용 여부 구분)
- [ ] **02** 기존 회고록의 내용과 디자인 유지 확인 (원본 보존 검증 여부 기록)
- [ ] **03** 빈 문서와 회고록 양식 생성
- [ ] **04** 섹션 추가·삭제·이름 변경·순서 변경
- [ ] **05** 본문·소제목·이미지 블록 순서 변경
- [ ] **06** 가로·세로·큰 이미지 추가
- [ ] **07** 설명·정렬·크기 조절
- [ ] **08** 새로고침 후 내용·이미지·디자인 복원
- [ ] **09** 두 문서를 빠르게 전환해 데이터 섞임 여부 확인
- [ ] **10** 이미지 포함 문서 복제 후 원본 삭제 (**테스트 문서 한정**)
- [ ] **11** 프로젝트 내보내기
- [ ] **12** 별도 브라우저 프로필 또는 다른 origin에서 가져오기
- [ ] **13** 잘못된 프로젝트 파일 가져오기 시 기존 문서 보존 (합성·의도적 오류 파일만)
- [ ] **14** 여러 페이지 문서를 PDF로 저장
- [ ] **15** PDF에 앱 UI가 없는지 확인
- [ ] **16** 한글 정상 출력 및 텍스트 선택 확인
- [ ] **17** 이미지 잘림·왜곡·누락 확인
- [ ] **18** 긴 본문·긴 URL·긴 캡션의 누락 여부 확인
- [ ] **19** 기존 테마 3종과 추가 테마 확인
- [ ] **20** 작은 화면·키보드 조작 확인
- [ ] **21** 백엔드나 외부 API 없이 핵심 기능 동작 확인

## 4. 수동 테스트 증거 및 결과 기록

- OS: Windows 버전/빌드 `________`; Chrome 버전 `________`; Edge 버전 `________`.
- 사용 브랜치/최신 SHA: `feature/step2-full-20261018` / `________`; 앱 주소 `http://127.0.0.1:4178`.
- 번호별 상태: `01: 미실행`, `02: 미실행`, ... `21: 미실행` → 각 항목 **PASS / FAIL / BLOCKED / NOT RUN** 중 하나로 업데이트한다.
- 첨부 추천: `STEP2_Chrome_A4_short.pdf`, `STEP2_Chrome_A4_long.pdf`, `STEP2_Edge_A4_long.pdf`, 문제 화면 스크린샷 1~3장, **합성 테스트 문서의** `.localdoc.json` 한 개.
- 실패시 보고: `브라우저/버전 — 항목 번호 — 기대 결과 — 실제 결과 — 재현 순서(3~5단계) — 스크린샷 또는 합성 PDF`. 필요한 경우 화면 녹화. **사용자의 실제 원문/원본 이미지/비밀번호/토큰은 제출하지 않음**.
- 최종 선언: `Chrome PASS __/21 | Edge PASS __/21 | FAIL __ | BLOCKED __ | NOT RUN __ | 최종 수동 수용: 승인/보류`. CI PASS는 별도 집계한다.

## 5. STEP 2 main 병합 및 STEP 3 진행 승인 조건

**현재 판정: HOLD (수동 수용 미실행·사용자 승인 대기).**

**병합 전 필수 게이트**

1. **코드 기준 고정:** 병합할 feature HEAD를 기록하고 그 SHA로 `npm test`(16/16 이상), `npm run build`, 실제 Chrome CI STEP1/STEP2 회귀가 모두 **SUCCESS**인지 확인. 현재 참고 run #39145149408 이후 변경은 docs-only이며, 병합 직전 재조회 필요.
2. **데이터 안전:** 기존 STEP1 v1 원본 자동 삭제/덮어쓰기 없음, v2 문서/이미지·오류 복구/마이그레이션·JSON 백업 동작 입증. 현재 Linux Chrome 테스트는 PASS. 병합 당일 변경사항 재검증.
3. **Windows 수동 수용:** 위 §16 21항 중 **해당되는 Windows Chrome/Edge 핵심 항목**을 실제 실행하고, 특히 PDF 한글 선택·이미지/캡션 페이지 경계·UI 제거·4종 테마·백업 이식을 명시적으로 PASS. Windows 전용 실패/차단이 있으면 수정 후 재검증. 항목 01/02는 기존 실제 데이터 훼손 없이 합성/CI 검증과 사용자 확인을 분리 기록한다.
4. **FAIL 0 및 잔여 경계 설명:** 심각도 높은 데이터 손상·원문 누락·인쇄 이미지 잘림/왜곡·복구 불가 문제가 0건. BLOCKED/NOT RUN은 사유를 적어 **완료 주장과 구분**하고 사용자 수용 여부 결정.
5. **변경 검토와 권한:** feature→main diff에서 STEP1 안정 코드·설계 원본/지침 유지, 중요 데이터 저장 키 변경 여부·의존성·비밀 유출 여부 확인. main 병합은 **명시적 승인 이후** 별도 작업으로 수행하고, 병합 후 main CI 성공까지 확인.
6. **STEP 3 진입:** STEP2 main 병합·회귀·사용자 수용까지 완료한 뒤 별도 STEP3 원본 PDF 가져오기 요구사항으로 진행. STEP2 수동 검수 대기 중 STEP3 기능 시작 금지.

**완료 전에는 `STEP2 자동 검증 거의 완료 / Windows 수동 승인 대기 / main 미병합`이라고만 보고**하며, STEP2 100%/전체 로드맵 단계 완료라고 표시하지 않는다.

## 6. 사전 위험과 운영 메모

- localhost 127.0.0.1의 **포트가 바뀌면 저장 origin이 달라진다**. `4178`에서 만든 테스트 문서는 기본 `5173`의 기존 문서함에서 자동으로 보이지 않는다. 브라우저 프로필을 바꿔도 IndexedDB가 분리된다. 이식은 `.localdoc.json`으로 한다.
- 시스템 폰트/Windows 인쇄 드라이버/Chrome·Edge 버전에 따라 페이지 나눔 차이가 날 수 있다. CI Ubuntu Chrome 결과를 Windows 시각 PASS로 확대하지 않는다.
- 이미지 PNG/JPEG/WebP 각 **10MiB 이하·2,000만 픽셀 이하**, 전체 프로젝트 JSON **100MiB 이하**. 파일 크기·형식 검사는 클라이언트 환경을 가정하며 악성 파일 완전 차단을 뜻하지 않는다.
- 문서/이미지는 브라우저 프로필·origin별 IndexedDB에 남는다. `npm install`은 초기 네트워크가 필요할 수 있으나 앱의 로컬 편집은 API/백엔드 전송을 요구하지 않는다. 백업은 미암호화 파일이므로 안전하게 보관한다.
- 진척도는 기존 보수적 추정 STEP2 **약 97~98%**, 전체 7단계 **약 28~29%**를 유지한다. 이 문서 생성 자체는 기능 테스트·수동 검수 완료가 아니라 **검수 준비 완료**이다.

## 7. 실제 사용자 Windows Chrome PDF에서 확인된 부분 증거 — 2026-10-19

- 사용자가 Windows Chrome 155의 `http://127.0.0.1:4178`에서 테스트 문서를 작성한 스크린샷과 **단일 PDF 1개**를 이 대화에 제출했다. 실사용 문서가 아닌 테스트 문서이며 **PDF 자체는 공개 GitHub 저장소에 업로드하지 않았다**.
- 제출 PDF(로컬 검사한 파일명: `아스트라 PDF 리디자이너 — 회고록.pdf`)의 `pdfinfo`: **1페이지 / 594.96×841.92pt (A4)**, Creator Windows NT 10.0 / Chrome 155, Producer Skia/PDF m155.
- `pdffonts`: `MalgunGothic` 및 `MalgunGothicBold` 글꼴 부분집합 **embedded=yes**, Unicode 매핑 **uni=yes**. `pdftotext -layout`: 한글 제목 `아스트라 PDF 테스트`, 날짜 `2026-10-19`, 섹션 `새 섹션`, 한글 테스트 본문이 추출되며 첨부 페이지 영상에서 깨진 문자/인쇄 UI가 보이지 않음.
- **수동 체크리스트 15번(인쇄 UI 제외)은 Chrome 짧은 문서에 한해 관찰 PASS**. 16번 중 **한글 정상 출력·PDF 텍스트 추출 PASS**, 실제 뷰어에서 사용자 마우스로 글자 선택·복사는 별도 미확인. 14번은 **여러 페이지 출력**을 뜻하므로 1페이지 PDF만으로 PASS 처리 불가.
- 이미지가 없는 파일(`pdfimages -list` 이미지 행 0)이므로 **17번 이미지 잘림/왜곡/누락, 18번 긴 문서/긴 캡션, Edge 인쇄는 검증하지 않음**. 최종 21항은 부분 증거까지 수집한 후 Windows Chrome과 Edge 각각 평가한다.
- 공개 프로젝트 로그/문서에는 사용자 제출 PDF의 메타데이터·검증 결과만 기록한다. 업로드된 PDF 원본·실제 작성 내용·기기 식별값은 별도 복사/게시 금지.


## 8. Linux Microsoft Edge 자동 실브라우저 검증 — 2026-10-19

- [GitHub Actions #39149195481](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481) **SUCCESS**, 코드 SHA `34352fd4e92ca43641da3b4d9de3070232276497`. GitHub Actions Ubuntu의 **실제 Microsoft Edge 155.0.4283.45**(`/usr/bin/microsoft-edge`)에서 STEP1 A4 PDF 15페이지, STEP2 IndexedDB 저장·복원, PNG/JPEG/WebP·실제 PDF 이미지, 긴 캡션 페이지 나눔 및 저장 실패·재시도 검증 PASS.
- 상세 로그 및 스모크 범위: [Edge 자동 검증 보고서](STEP2_EDGE_CHROMIUM_CI_VALIDATION_2026-10-19.md). 기존 Chrome 전체 CI도 함께 PASS.
- **별도 표시:** Ubuntu Linux Edge **자동 PASS ≠ Windows Edge 수동 PASS**. 사용자 Windows Chrome 1페이지 PDF에서 A4·한글·내장 글꼴·인쇄 UI 제외의 일부 확인은 이루어졌으나, 실제 Windows Edge 출력과 Windows 다페이지 이미지 시각/키보드 조작은 여전히 미확인. 원본 수동 항목 21개는 전체 완료로 표시하지 않음.
- STEP2 자동 검증 기준 진행률은 약 98~99%, 전체 7단계 단순 동일 비중 28~29% 비공식 추정. `main` 기능 병합 및 STEP3 미착수.


## 9. 잔여 위험의 승인과 후속 Windows 수동 검수 — 2026-10-19

**사용자가 명시적으로 STEP 2의 `main` 병합과 아래 잔여 Windows 위험을 수용했다.** 단, **수동 검수 항목의 PASS 판정이나 STEP 2 전체 검증 완료를 승인한 것은 아니다.** 21개 원본 수동 항목의 포괄적 수용 상태는 미완료로 유지한다.

### 병합 승인 조건 (검증될 때까지 HOLD)
- [ ] 최신 `main` + `feature/step2-full-20261018` HEAD로 **실제 3-way 무커밋 병합 사전검사** 다시 실행, 원본 파일 바이트 불변 + Node 16/16 + TypeScript 빌드 + Chrome 전체 + Edge PDF/저장 회귀 PASS
- [ ] 동일 최신 기능 HEAD의 필수 CI 성공 (Chrome/Edge 검사 누락 시 실패 처리)
- [ ] 검사가 실패하면 **Draft 해제·병합하지 않고 원인 보고**
- [ ] 검사가 모두 성공한 후 Draft 해제·명시적으로 허가된 `main` 병합; 실제 병합 커밋 SHA 확인
- [ ] 병합 후 **새 `main` SHA의 전체 CI SUCCESS** 및 기존 원본 코드·지침/이미지 보존 확인. CI 실패하면 **STEP 3 등 다음 단계 중단** 후 원인 보고

### 병합 후에도 미완료로 유지할 Windows 전용 수동 항목
- [ ] **Windows Edge 실물 A4 PDF**: 한글 폰트/선택·복사/인쇄 대화상자 설정과 화면 시각 품질. GitHub Ubuntu Edge 자동화 PASS와 별개.
- [ ] **Windows Edge 및 Chrome에서 2페이지 이상 실제 PDF 육안 검수**: 긴 한국어 문단·긴 이미지 캡션, 페이지 넘김, 문장/제목/캡션 잘림과 누락
- [ ] **Windows 가로·세로 실제 이미지 포함 PDF 육안 검수**: PNG/JPEG/WebP 이미지 배치, 종횡비, 이미지 누락·잘림·왜곡
- [ ] **키보드·작은 화면·사용성**: 탭 탐색, 포커스, 문서관리/모달 접근성과 작은 화면에서 조작 가능 여부
- [ ] **브라우저 간 수동 파일 이식·복구**: 실제 Windows Chrome ↔ Edge에서 .localdoc.json 및 이미지 원본 보존 (기존 Linux Chrome A↔B는 자동 PASS)

### 검수 기록 원칙
- 사용자 제출 Windows Chrome **짧은 1p PDF**의 A4·한글·글꼴/텍스트 추출·인쇄 UI 제외는 부분 증거로 유지한다.
- Windows Edge 실사용 육안 검사 결과가 제출되지 않았으므로 그 항목을 자동 테스트 근거로 **완료 표시하지 않는다**.
- 추후 검증 시 브라우저/버전, PDF 조건, PASS/FAIL, 재현 단계와 증거를 기록한다. 실제 사용자 문서나 민감한 데이터를 GitHub에 게시하지 않는다.
- 이번 승인으로 허용되는 것은 **조건부 main 병합**이며, STEP 2 전체 Windows 사용자 수용/품질 검증 완료 선언은 아니다.


## 10. 2026-10-19 — 병합 후 main CI 실패 복구 및 Windows 미검증 유지

- PR #2 **실제 main 병합 완료**, merge SHA `f1ad26320b12b07019b115f77f8cf55e62f1e7e6`. 따라서 과거 항목 중 `main 미병합` 표시는 **병합 당시 이전 상태 기록**이며, 현재는 해당하지 않음.
- 병합 직후 [main CI #39155133495](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39155133495) Edge 시작 CDP 검사 실패. CI 전용 헬퍼를 수정하고 Edge를 Chrome과 독립 runner로 분리한 결과 `main` 코드 SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`의 [새 CI #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) **SUCCESS**: Node16/16·build·Chrome STEP1/2 전체·Edge STEP1/2 실제 PDF/이미지/긴 캡션·DB 실패/복구 PASS.
- 이 결과는 **GitHub Ubuntu의 Linux 브라우저 자동 검증**이다. **Windows Edge 실물 PDF, Windows 긴 본문/이미지 다페이지 육안, 키보드/작은 화면, Windows Chrome↔Edge JSON 이식은 NOT RUN**. 본 문서 §9 체크박스를 체크하지 않으며, STEP2 전체 Windows 수용·전체 검증 완료 선언 금지.
- 상세: [main Edge CI 복구 보고서](STEP2_POSTMERGE_MAIN_CI_RECOVERY_2026-10-19.md).
