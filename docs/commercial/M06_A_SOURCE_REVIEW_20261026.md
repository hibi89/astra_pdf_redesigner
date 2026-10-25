# M06-A — 출처 좌표 연결 및 세션 수동 검수 상태

Status: **M06-A internal synthetic UX VERIFIED** on Chrome/Edge and Windows regression CI (2026-10-26 KST); customer PC and real PDF unverified.

## 실제 구현
- `src/step3/sourceReview.ts`: PDF.js 추출 시 기록된 `origin.page/x/y/width/height`의 유효성 검사, 좌상단 기준 좌표→표시 사각형, 개별 블록 검수 서명. 블록 텍스트/이미지 설명/출처 데이터가 바뀌면 기존 '검수 완료' 표시는 일치하지 않아 자동 무효.
- `src/step3/SourceAnchorPreview.tsx`: 이미 고객이 직접 업로드한 PDF의 **현재 세션 Blob URL을 로컬 fetch**한 뒤 PDF.js로 선택된 실제 페이지를 canvas에 렌더링. 좌표에 반투명 강조 사각형을 겹치고 페이지 번호·추정 좌표를 명시. 외부 네트워크 사용/원본 영구 저장/이미지 원본 변경 없음. 렌더 실패 시 경고와 원본 전체 뷰 제공.
- `src/step2/Workspace.tsx`: 각 원본 출처 블록에 '원본 위치 보기'와 해당 블록의 '원문 수동 대조 완료' 버튼. 선택한 편집 블록 강조, 상단 '수동 대조 n/N' 및 미완료 경고, 원본 iframe 전체 뷰는 기본으로 펼침. 이 체크는 **사용자가 직접 검토했다고 표시한 것일 뿐**, 자동 내용 일치나 모든 페이지 요소 복원 인증이 아님.
- 사용자가 원본 비교 창을 닫거나 다른 문서로 전환하거나 앱을 재실행하면 임시 좌표 선택·수동 검수 상태가 사라진다. 업로드한 PDF 원본 바이트는 이전 M02 정책대로 IndexedDB 저장 금지. 비교 세션이 없으면 해당 버튼은 비활성화 및 안내.
- **현재는 soft warning**, PDF 저장을 하드 차단하는 완전한 completeness gate는 아님. 기존 STEP2 문서와 이전에 가져온 문서의 출력 기능을 갑자기 차단하지 않는 호환성 선택. 추출기 자체의 누락을 검출할 수 없는 경우 체크리스트 100%여도 원문 정확도 보장 불가.

## 자동 검증 설계 / 증거 한계
- `tests/source-review.test.ts`: 텍스트/좌표 변경 후 체크 상태 무효화, 불가능한 출처 페이지 거부, 추정 영역 좌표 표시 정규화.
- `tests/step3-browser.mjs`: 실제 합성 다페이지 PDF 승인 뒤, 2페이지 출처 블록 클릭→PDF.js page canvas의 실제 렌더 크기·bbox 존재/블록 강조→검수 0/N에서 1/N 증가. 이후 기존 원본 SHA 불변, PDF 출력·IDB/원본 Blob 해제 회귀검사는 그대로 실행.
- `npm test`에 `node --check tests/step3-browser.mjs` 추가하여 Chromium E2E 시작 전에 JS 문법 오류 포착.
- 실제 클릭한 단락과 원본 내용이 의미상 같다는 보장은 **사용자 검수** 영역. 이미지/벡터/표 셀과 원본 페이지 좌표의 완전 정확도, 50페이지 대규모 로딩, 고객 Windows PC 사용성은 **검증 범위 밖**.

## 연관 작업
- M01/M02/M03-A/M03-B0/M04/M05 scoped DONE; M06-A 검증 성공 시 내부 source review UX DONE.
- M03-B1 실제 GGUF 오프라인 추론·모델 라이선스·Windows CPU benchmark는 별도 승인 전 BLOCKED.
- NEXT candidate M06-B: 클릭 가능한 4단계 작업 네비게이션, 900/1100/1600px responsive + keyboard UX 테스트. 유료판매 NO-GO: 모델/고객 PDF/PC/3 SKU 배포 검증 미완료.
- Main/PR3/PR4 보호, PR #9 Draft 유지.

## VERIFIED M06-A — 2026-10-26
- Tested implementation SHA: `e351fab774eb8e3de9caab8aae4039fc6185fcd9`.
- [Linux Chrome and Microsoft Edge #40207916153](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40207916153): **SUCCESS**, `npm test` **60/60 PASS**, build PASS. Both Chrome/Edge E2E log `PASS M06 CLICK-THROUGH`: real locally imported synthetic PDF page **2**, actual PDF.js canvas + coordinate rectangle, selected editor block highlight, **0/7 → 1/7** manually acknowledged blocks; preexisting source hash/revoke, Korean rule review, A4 print and 13/13 source markers also passed.
- [Windows NSIS #40207916086](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40207916086): **SUCCESS** installed EXE, native PDF export, Step2/Step3 integrity, uninstall and in-place upgrade persistence. **M06 canvas page-click itself was not directly driven in Windows E2E**; UI direct proof is Chrome+Edge Linux.
- Real screenshot: #40207916153, synthetic-only artifact `astra-m02-studio-chrome-synthetic` ID **12604421593**, visibly shows selected page thumbnail with orange coordinate marker and `수동 대조 1/7` status next to actual redesigned A4. Captured by running Chromium, not a concept render; artifact retention is limited.
- Resolved CI iterations: initial `5c77dcb7` E2E had a missing assertion parenthesis; added `node --check`. Later `f3fa4f73` E2E changed established source-label text; restored `원본 PDF 출처`. Another E2E accidentally evaluated the Node `chosen` variable inside browser scope; fixed at tested `e351fab7`. Some intermediate Windows isolated runs failed/recovered; use **both final same-source SUCCESS links above**, not stale failure runs.
- No PDF original bytes stored in IDB, no review status persisted, no network upload, no paid service or model installed. Review acknowledgement is **manual only / soft warning**; it is not content equality, geometry parity, export hard-stop, commercial approval, or all-PDF support.
- **M06-A DONE** within internal source-review synthetic scope. Next **M06-B READY**: interactive four-step guidance and real 900/1100/1600px visual/keyboard tests. **M03-B1 actual offline LLM BLOCKED** pending approved license/model/runtime download and CPU quality benchmark; customer sale NO-GO.
