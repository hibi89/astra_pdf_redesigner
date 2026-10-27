# ASTRA 최초 설계 대비 갭 매트릭스 — 2026-10-27

## 기준과 판정

대조 기준은 `docs/ASTRA_ORIGINAL_ROADMAP.txt`, `docs/BLUEPRINT.md`, `REQUIREMENTS.md`, `docs/commercial/PRODUCT_SPEC_V1.md`, `docs/commercial/QA_RELEASE_GATES.md`다. 원본 설계·요구사항 파일은 수정하지 않았다. 아래 판정은 통합 브랜치의 코드, 기존 검증 기록, 현재 실행 중인 PR 검증을 기준으로 한 보수적 추정이다.

- **완료:** 요구 범위와 검증 증거가 모두 있다.
- **부분:** 일부 흐름만 구현·검증했으며 나머지 승인 기준이 남아 있다.
- **미구현:** 코드 또는 검증 증거를 확인하지 못했다.
- **승인대기:** 사용자 자산·라이선스·범위 승인이 있어야 다음 단계로 진행할 수 있다.

## A. 최초 7단계 로드맵

| 원본 단계 | 판정 | 근거와 남은 범위 |
|---|---|---|
| STEP 1 — 회고록 꾸미기 | 완료 | 기존 글 작성·테마/색상/폰트·미리보기·PDF 저장 기능이 통합 제품의 기반으로 유지된다. 이 작업에서 해당 경로를 수정하지 않았다. |
| STEP 2 — 개인 문서 제작기 | 완료 | 섹션/이미지/테마 편집 및 작성 데이터 보존 경로가 있다. `5d2265414f971fcc8d78b5f4cec11370a61756a1`에서 네 디자인 설정 변경·재로드에도 원문 보존, `1099b794f32da3e0bc467898e12b0ee7e7e71146`에서 JSON 내보내기/가져오기·잘못된 JSON 거부·복사본 삭제 뒤 원본 보존을 Edge 실제 브라우저로 확인했다. |
| STEP 3 — PDF 가져오기 | 부분 | 원본 기준 기능(로컬 추출·좌표 출처·이미지·역할/순서 수동 검수·원문 대조·경고·텍스트 포함/제외·새 문서/A4 출력)이 합성 fixture로 검증됐다. 선택 제외한 헤더/푸터도 원본 검수에는 유지되고 변환 출력에서 빠지는 것을 Chrome/Edge에서 확인했다. 손상 PDF는 M08-C에서 거부되고 V2 데이터/초안이 보존된다. PDF 내부 복구는 원래 STEP3 완료 기준이 아니다. | 실제 단순 PDF 5–10건 및 구매자 물리 PC 수용 미검증. |
| STEP 4 — 디자인 조합 엔진 | 부분 | BASIC 8개 사전 디자인의 출력·선택 경로는 Windows 회귀에서 8/8 확인됐다. 임의 레이아웃/폰트/색상/여백 조합, 여러 스타일 비교·즐겨찾기까지 완료했다는 증거는 없다. |
| STEP 5 — 레퍼런스 따라 꾸미기 | 미구현 | 레퍼런스 이미지/PDF/URL 입력, 색상·구성 분석, 레퍼런스 기반 스타일 변환의 구현·검증 증거가 없다. 사용자 레퍼런스 파일을 받거나 URL을 연결하는 기능은 데이터 처리 범위 확정이 필요하다. |
| STEP 6 — 레퍼런스 탐색 연동 | 승인대기 | 앱 내 인터넷 검색·썸네일 탐색·레퍼런스 저장/선택·조합의 구현 증거가 없다. 외부 검색이나 전송은 현재 허가 범위에 포함되지 않으므로 구현 전 사용자 승인과 데이터 경계가 필요하다. |
| STEP 7 — 최종 통합 PDF 리디자인 앱 | 부분 | PDF 가져오기→검수→A4 재구성 흐름과 unsigned Windows 설치형 검증은 존재한다. OCR, 복잡한 표/다단·장문 지원, 누락/넘침 자동 검사, 부분 수정, 고객용 서명·배포 검증은 미완료다. |
| STEP 7 OCR 및 실제 문서 수용 | 승인대기 | 현재 작업 규칙은 OCR을 기존 승인 범위 밖으로 둔다. 이번 사용자의 지시는 M09-D 취소 흐름 검증과 갭 분석을 허용하지만 OCR 구현이나 고객 문서 사용 승인으로 확대 해석하지 않는다. |

**7단계 전체 완료율 추정:** 약 **43%** (STEP 1·2 완료 2.0 + STEP 3·4·7 부분을 보수적으로 각 0.33으로 환산하여 3/7). 이는 기능 단계의 근사치이며 제품 품질이나 출시 준비율을 뜻하지 않는다. 레퍼런스·검색 단계는 완료로 계산하지 않았다.

## B. 상용 제품·72시간 내부 MVP

| 영역 | 판정 | 현재 증거 | 남은 기준 |
|---|---|---|---|
| 72시간 내부 기술 시연 핵심 경로 | GO — 제한 범위 | M05 검수에서 지원 텍스트 PDF→검수→2개 실조판→새 A4 PDF와 Windows 설치형 핵심 여정을 Chrome/Edge/NSIS 합성 테스트로 확인했다. 현재 exact-SHA `cc157cba4b442f44b88c3631a72686fdfe8f8af9`에서도 Node 67/67, build, 브라우저 A4/블록 제외, Windows M09-D/설치 업그레이드 회귀가 통과했다. | 이 제한된 기술 시연 GO는 상용 판매 판정이 아니다. 실제 PDF, 소스 위치 연계 완전성, 고객 PC, AI, 서명/라이선스는 별도 미완료다. |
| 원문·숫자·표·이미지 보존 및 누락 경고 | 부분 | 합성 PDF 텍스트 마커, 일부 이미지/페이지 구조와 보존 경계에 대한 검증이 있다. | QA 게이트가 요구하는 실제 문서 여러 건의 텍스트·표·이미지 비교와 누락/변형 경고 품질은 미검증이다. |
| 한글 A4 배치·페이지 분할·디자인 | 부분 | 합성 PDF A4 출력 및 BASIC 디자인 8/8의 설치형 회귀 기록이 있다. | 복잡한 표·폰트·긴 문서의 실제 한글 배치, 페이지 분할, 고객 기준 시각 품질은 미검증이다. |
| 오프라인 한국어 AI 윤문 | 승인대기 | 검증된 로컬 모델 실행·라이선스 증거가 없다. 규칙 기반 제안은 AI 윤문 완료로 간주하지 않는다. | 적합한 모델/런타임 라이선스 확인, 소유자 승인, 오프라인 실행 및 정확도 검수 필요. 모델 다운로드·외부 전송·비용은 별도 승인 대상이다. |
| 저장 데이터·개인정보·취소 안전성 | 부분 | M09-A/B/C 합성 시나리오에서 승인 전 저장 방지, 오래된 비동기 결과 무시, V2 보존을 검증했다. M09-D Windows 설치형 테스트는 exact-SHA CI에 포함됐다. | 실사용자 데이터/장치 정책과 장기 사용·중단·복구 보안 검수는 미검증이다. |
| 설치·서명·라이선스·지원 | 부분 | unsigned NSIS 설치/실행 및 기존 STEP2 데이터 업그레이드 회귀 기록이 있다. | 구매자 PC, 코드 서명, SKU 권한·라이선싱, 지원/복구 절차는 미검증 또는 미구현이다. |

## C. 가격 SKU별 준비도

| SKU | 판정 | 확인된 상태 | 출시 차단 항목 |
|---|---|---|---|
| BASIC — ₩30,000 | 부분 | 8개 기본 디자인의 합성 A4 설치형 회귀가 확인됐다. | 실제 고객 문서 품질, 오프라인 윤문 계약, 구매자 PC, 서명·라이선스·지원 게이트 미완료. 판매 NO-GO. |
| PRO — ₩60,000 | 미구현 | 20개 디자인과 SKU별 권한의 검증 증거가 없다. | 20개 디자인, 기능/권한 검증, BASIC 공통 윤문, QA·배포 게이트. 판매 NO-GO. |
| BUSINESS — ₩90,000 | 미구현 | 30개 디자인과 조직용 권한/지원의 검증 증거가 없다. | 30개 디자인, 조직 라이선스·지원, BASIC 공통 윤문, QA·배포 게이트. 판매 NO-GO. |
| 전 SKU 공통 오프라인 윤문 | 승인대기 | 로컬 모델 실사용·라이선스 검증은 수행하지 않았다. | 소유자 승인 후 라이선스 확인된 모델만 평가하고 오프라인 실행을 증명해야 한다. 현재 AI 성능 주장은 금지한다. |

## 현재 M09-D 검증 상태와 갱신 규칙

- 작업 브랜치: `integration/astra-commercial-core`; PR #9는 Draft이며 merge하지 않았다.
- M09-D 검증 코드 SHA: `1ead660ce57ec55dc1c612256aaa0e38e5a76d3c`.
- Linux [Chrome·Edge #40463905080](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40463905080) 및 Windows [NSIS #40463905117](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40463905117): exact-SHA 성공. 각 환경 Node 61/61, build 성공, Windows desktop shell 13/13.
- Windows 실제 설치 Electron UI 로그: `PASS M09-D WINDOWS INSTALLED UI` — 분석 중 표시된 취소 클릭, 새 파일 검수 유지, 늦은 이전 분석 결과 무시, 새 파일 source URL 해제, V2 저장소 전체 스냅샷의 취소 전·후·재시작 후 동일성을 확인했다.
- 첫 실패 `3c5004e`는 테스트가 IndexedDB 업그레이드 버전 2를 잘못 기대한 harness 오류였다. 실제 DB 업그레이드 버전은 1이며 저장 문서 `schemaVersion`은 2다. 다음 `67c533c` 실패는 기본 선택 상태가 켜진 이미지 포함 체크박스를 사용자 승인 체크박스로 잘못 읽은 harness 오류였다. 둘 다 테스트만 수정했으며 데이터베이스·앱 동작은 변경하지 않았다. 최종 SHA `1ead660`에서 모든 게이트가 성공했다.
- 로컬 회귀: Node 61/61, build 성공, desktop bundle/shell 13/13. 실제 설치형 직접 검증 증거는 위 Windows Actions 결과다.
- 최신 STEP2 데이터·디자인 회귀 exact-SHA `5d2265414f971fcc8d78b5f4cec11370a61756a1`: [Chrome·Edge #40467219994](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40467219994) SUCCESS 2/2, [Windows NSIS #40467220067](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40467220067) SUCCESS. 두 브라우저에서 원문/네 디자인 필드 분리 및 A4 페이지 분할이 통과했고 Windows 로그에 M09-D 직접 UI 표식이 있다. 합성 회귀로 7단계 추정(~43%)과 판매 NO-GO 판정은 바뀌지 않는다.
- 테스트는 CI의 합성 PDF만 사용했다. 고객 원문, 개인 파일, 외부 모델/런타임 다운로드를 사용하거나 전송하지 않았다.

### Latest exact-SHA STEP2 project JSON check — 2026-10-27

- Test-only SHA `1099b794f32da3e0bc467898e12b0ee7e7e71146`: exported project JSON must preserve exact document content and all four design values; invalid JSON must leave the active record unchanged; valid import must retain design values; deleting the imported copy must leave the original record unchanged.
- Local unit suite 61/61 and build PASS. GitHub Edge job [#122069789553](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551454/job/122069789553) SUCCESS with exact JSON export/import markers. Windows NSIS run [#40468551485](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551485) SUCCESS, including M09-D installed UI and STEP2 upgrade data preservation.
- Chrome+Edge run [#40468551454](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551454) completed **SUCCESS 2/2** at 2026-10-27 17:04 KST after the CI-only Korean font installation delay. Chrome logs confirm exact JSON content/design export, invalid import rejection, original preservation after deleting the imported copy, A4 PDF/text extraction, and M09-A/B/C regressions. Combined with Windows NSIS [#40468551485](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551485), the tested STEP2/M09-D regression set is green on this exact source SHA. This does not change the ~43% roadmap estimate or NO-GO release assessment.

## 검토 근거

- [M09-C 취소·재시도 검증](M09_C_PARSE_CANCEL_RECOVERY_20261027.md)
- [M09-B 오래된 비동기 결과/저장 경계](M09_B_STALE_IMPORT_RACE_20261027.md)
- [M08-A Windows 8개 디자인 출력](M08_A_WINDOWS_EIGHT_LAYOUTS_20261026.md)
- [M08-D 암호화 PDF 처리](M08_D_PASSWORD_PDF_ACCEPTANCE_20261027.md)
- [상용 QA 판매 게이트](QA_RELEASE_GATES.md)
- [상용 제품 명세](PRODUCT_SPEC_V1.md)

## 출시 판정

**전체 SKU 판매 및 public production: NO-GO.** 기능 개발 검증과 출시 승인을 분리한다. 기존 `main`, PR #3, PR #4는 변경·병합하지 않았다. M09-D Windows CI 통과는 실제 고객 PDF·구매자 PC·AI·SKU 권한·서명/라이선스 게이트 통과를 뜻하지 않는다.



## 최신 승인·검증 추가 — 2026-10-27 17:27 KST

- 사용자의 최신 승인은 STEP 3 PDF 가져오기 개발을 계속 허용한다. OCR은 별도 승인 전까지 제외한다. 과거 STEP2-only 지침은 최초 main 안정화 문맥이며, 원격 `AGENTS.md`의 승인 갱신이 실제 PR #3 이력과 현재 승인을 연결한다.
- 통합 브랜치 기능/테스트 SHA `3a704921b24b83b05701c6a48c9526d8580f9a6a`에서 PDF 검수 초안 Undo/Redo(최대 8단계, 메모리 내, 확인 동의 재요구)를 구현·검증했다. Node 62/62, build PASS. [Chrome+Edge #40472988885](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988885) 및 [Windows NSIS #40472988943](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988943) 모두 SUCCESS. 로그에서 실제 Undo/Redo 표식, Step3 PDF 출력, Windows M09-D 설치 UI 확인.
- 7단계 완료율 추정 ~43%는 변하지 않는다. STEP3는 합성 fixture 검증에서 부분 구현 상태를 유지하며, 동의받은 실PDF 5~10개와 구매자 PC 수동 수용은 미검증이다. OCR/복잡 표·다단 완전 재현은 승인·지원 범위 바깥이다. 판매 NO-GO.
- main/PR #3/#4/사용자 데이터/배포 설정은 변경·병합하지 않았다.


## 최신 STEP3 갱신 — 2026-10-27 17:45 KST

- 검증 코드 SHA 009966b57cc2e30397da5607b9429020c400e513에서 PDF 전체 이미지 복원 예산(복원 시도 50개·누적 40MP·성공 PNG 40MiB)을 적용하고, 한도 초과는 누락 집계와 사용자 경고로 노출한다. STEP3 추출 데이터/저장 스키마를 바꾸지 않는다.
- 로컬 Node 24: 63/63 PASS, production build PASS, diff check PASS. Chrome+Edge [#40475046652](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046652) SUCCESS 2/2; Windows NSIS [#40475046789](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046789) SUCCESS.
- Windows exact-SHA 로그에 PASS M09-D WINDOWS INSTALLED UI, installed STEP3 import/review/native A4 (2 pages, 6 markers, raster 1) 확인. 이는 합성 PDF 및 hosted Windows VM 결과이며 구매자 물리 PC 검수가 아니다.
- 원본 STEP3의 완료 기준을 기준으로 손상 PDF 내부 복구는 필수 기능이 아니다. 잘못된 구조를 거부하고, 실패를 성공으로 표시하지 않으며, 기존 사용자 데이터와 미확정 검수 초안을 보존하면 된다(M08-C 검증). 위 STEP3 요약 행을 이에 맞게 바로잡았다.
- 미완료 인수 조건: 동의된 실제 텍스트 중심 PDF 5~10건의 고객 로컬 비교 및 구매자 Windows PC GUI/인쇄 수용. OCR은 별도 승인 전까지 제외. 전체 7단계 보수 추정 ~43%, 상품 판매 NO-GO.


## 최신 STEP3 경계 정정 및 exact-SHA — 2026-10-27 17:55 KST

- 최종 functional SHA 9ae962eb825e4baa3a8d84b650926355258c9148. 문서당 이미지 복원 시도는 최대 50개, 누적 시도 디코딩은 40MP, 성공 PNG 누적은 40MiB로 제한한다. 누적 픽셀/이미지 수/PNG 출력량 중 하나라도 도달하면 PDF 전체 복원을 exhausted 상태로 전환하고 다음 페이지 이미지 객체 접근을 포함해 후속 복원을 멈춘다.
- 로컬 Node 24 64/64 PASS, build/diff-check PASS. Chrome+Edge [#40476342313](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342313) SUCCESS 2/2, Windows NSIS [#40476342230](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342230) SUCCESS. 설치형 M09-D 및 STEP3 A4 output 로그 확인.
- 최초 설계 STEP3는 오류 문서를 거짓 성공 처리하지 말고 원문과 출력 비교/수정이 가능해야 한다. corrupt catalog 입력은 명확히 거부되고 초안/V2 데이터 보존(M08-C)하므로 PDF internals 복구는 단계 요구 누락이 아니다.
- 남은 검증은 customer-local 동의 PDF 5~10건 및 buyer physical Windows PC 수용. OCR 별도 승인 전 제외, overall roadmap estimate ~43%, sales NO-GO.


## STEP3 최신 자원·정확성 보강 — 2026-10-27 18:06 KST

- Exact code/test SHA 4e5cdbb300153dc81e7374956030cae751148415: PDF.js text fragments are now counted against the existing 500,000-character document limit before appending them to retained page structures; overflow aborts further extraction, while final reconstructed text validation remains active.
- Local Node 24 65/65 PASS, build and diff-check PASS. Chrome+Edge [#40477533937](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533937) SUCCESS 2/2; Windows NSIS [#40477533758](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533758) SUCCESS, with M09-D installed UI and STEP3 A4 output markers.
- User text PDFs 5–10 and physical buyer PC remain NOT VERIFIED. OCR remains separately unapproved; no model/cost/external transmission/deployment. Seven-step estimate ~43%, sale NO-GO.


## STEP3 헤더·푸터 텍스트 제외 — 2026-10-27 18:26 KST

- 최초 설계의 머리글·바닥글 제거/원문 대조 요구를 텍스트 블록 포함 체크로 구현했다. 제외한 블록의 원문은 검수 초안과 원본 PDF 뷰에서 확인 가능하고, 새 프로젝트 변환에서만 빠진다. 모든 블록 제외 시 저장은 차단한다.
- Exact-SHA `cc157cba4b442f44b88c3631a72686fdfe8f8af9`: Chrome+Edge [#40479935848](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935848) SUCCESS 2/2, 67/67 Node 22 tests and build PASS; Windows NSIS [#40479935852](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935852) SUCCESS with M09-D and native STEP3 PDF markers.
- 7-step estimate ~43%; M05 72-hour internal technical demo is limited GO; SKU readiness remains BASIC partial / PRO and BUSINESS unimplemented / shared offline AI approval-gated. Sale remains NO-GO until customer-local 5–10 PDF and buyer physical PC checks.
