## 2026-11-15 KST — P119 BLOCKED · P120/P121 BLOCKED · 잠정 57/100

- **P119:** Windows Tesseract 후보 공급망 감사 결과 0/1점. 공개 UB-Mannheim v5.4.0.20240606 installer의 GitHub release asset metadata는 50,175,248 bytes, `digest:null`; 실제 SHA-256, Authenticode, PE direct/delay-load DLL 폐쇄, 설치파일 속 kor/eng·dependency 목록 및 해당 묶음 재배포권을 입증하지 못했다. P119 지시대로 설치 바이너리/모델을 다운로드하거나 저장소에 동봉하지 않았다.
- **출처 조사:** upstream Tesseract 5.5.4 release는 2026-10-28 공개됐으나 Windows asset 없음. tessdata_best의 eng/kor 파일은 GitHub main commit `e12c65a915945e4c28e237a9b52bc4a8f39a0cec`에서 존재/크기/Git blob SHA-1을 확인했지만 SHA-256은 없음(바이너리 미취득). Tesseract/tessdata 소스는 Apache-2.0 표기. Leptonica 후보 LICENSE는 있으나 repo metadata NOASSERTION이며 후보 설치물과 dependency/NOTICE 매핑 미확인.
- **기능·차단 정책:** 기존 공급망 검증기는 합성 manifest byte/hash/PE imports, 누락·변조·경로 오염을 거부하고 결과를 review-required로 제한한다. `OCR_MANIFEST=null`, OCR 비활성, RELEASE HOLD를 유지했다. 상세 [P119 감사·검증](docs/evidence/astra/P119/VERIFICATION.md) 및 [후보 JSON](docs/evidence/astra/P119/SUPPLIER_CANDIDATE_AUDIT.json).
- **테스트 근거:** 실제 공급자 자산 검증은 SKIP/BLOCKED. 기존 synthetic suite는 code SHA `420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02`에서 Linux [#43633902801](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902801) PASS (Node 276/276/build), Windows [#43633902770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902770) PASS (Node 275 + 1 OS-only SKIP, desktop 73/73, synthetic Authenticode tests), blueprint [#43633903290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633903290) PASS. 이 CI는 공급자 승인이나 OCR 실행 증거가 아니다.
- **P120/P121:** P119 공급 자산 승인 미달로 실제 Tesseract 및 Electron IPC subprocess 시험을 실행하지 않았다. 각각 0점 BLOCKED 기록: [P120](docs/evidence/astra/P120/VERIFICATION.md), [P121](docs/evidence/astra/P121/VERIFICATION.md).
- **점수·진행:** A07 5/12, 총 57/100 유지. G55 PASS, G60 미도달. 공식 수용 UNASSESSED, RELEASE HOLD. 다음 독립 작업 P122.
- **변경 파일:** P119–P121 evidence/JSON 및 상업용 진행 문서만. 제품 기능·OCR manifest·고객 데이터 변경 없음.

## 2026-11-15 KST — Astra P118 검증 완료, 잠정 57/100

- **완료 작업:** P118 (A05 로컬 레퍼런스 분석·비파괴 적용/재현성), VERIFIED +1.
- **검증 SHA:** 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02. 변경: tests/step5-reference-browser.mjs, tests/step5-reference-analysis.test.ts; 제품 코드 변경 없음.
- **Linux PASS:** [#43633902801](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902801), exact SHA. Node 276/276, build PASS. Chrome·Edge 각각 PNG/JPEG/WebP 8종 metric 범위, PDF 2페이지 selectable text·no-OCR 고지, preset·A4 PDF·apply/undo/cancel·content 복원 PASS. 손상 PDF fail-closed.
- **Windows PASS:** [#43633902770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902770), exact SHA. Node 275 PASS / 1 Windows 전용 SKIP / 0 FAIL, desktop 73/73. Electron/NSIS 설치·실행·제거 및 0.1.0→0.1.1 업그레이드 뒤 STEP2 문서+PNG 보존 PASS.
- **정본 정책 PASS:** [#43633903290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633903290), exact SHA. 세 필수 run의 head SHA는 모두 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02.
- **비파괴 증거:** Chrome/Edge 양쪽에서 전체 V2 documents/assets/meta와 원본 이미지/PDF 파일 SHA-256 불변. Apply 후 Undo 시 content/design 복원. OCR·폰트·저작권 자동판정 없음.
- **점수:** A05 3→4/5, 총 56→57/100. 공식 수용 UNASSESSED, RELEASE HOLD. G55 PASS, G60 미도달.
- **실패 후보:** e2a7c04e693dea194b30aa11c4ee7cb20819739d Linux #43624942512는 Node 문맥 DOM 참조 오류로 실패(0점). 수정된 최종 SHA에서 전체 CI 재통과. [P118 검증서](docs/evidence/astra/P118/VERIFICATION.md).
- **다음 작업:** P119 Windows Tesseract 공급처·해시·DLL·라이선스 증거 감사.

## 2026-11-15 KST — Astra P117 검증 완료, 잠정 56/100

- **완료 작업:** P117 (A04 다중 문서 BUSINESS 브랜드 출력/SKU 우회 회귀) VERIFIED, +1점.
- **최종 기능 SHA:** `c4d96dc02fb616e44773871952343161079e293b`. 변경 파일: `src/step2/Workspace.tsx`, `tests/brand-batch-plan.test.ts`, `tests/sku-action-gate.test.ts`, `tests/step4-brand-batch-browser.mjs`, `.github/workflows/ci.yml`.
- **Linux PASS:** [#43622221289](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221289), exact SHA. npm test 271/271, build PASS. Chrome·Edge 각각 2/5/20 대상 계획과 27개 개별 A4 PDF PASS; 미선택 격리·취소 복원·V2 문서/assets 불변 PASS.
- **Windows PASS:** [#43622221235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221235), exact SHA. Node 270 PASS / 1 Windows 전용 SKIP / 0 FAIL, desktop 73/73 PASS. Electron/NSIS 설치·실행·제거 및 0.1.0→0.1.1 업그레이드 후 STEP2 문서+PNG 보존 PASS.
- **정본 정책 PASS:** [#43622221573](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221573), exact SHA. 세 필수 run 모두 head SHA `c4d96dc02fb616e44773871952343161079e293b`.
- **점수:** A04 13→14/15, 총 55→56/100. 공식 구매자 최종 수용률 UNASSESSED, RELEASE HOLD. 고객 issuer pin, SKU/서명키 활성화, OCR 차단은 변경하지 않았다.
- **실패 후보:** 초기 SHA `e57396a47c2fdb46214601795df91fca6e44f16f` Linux #43621810438은 테스트의 모호한 꼬리말 selector로 실패(0점). 수정 SHA에서 전체 필수 Actions 재통과. [P117 검증서](docs/evidence/astra/P117/VERIFICATION.md).
- **다음 작업:** P118. G55 PASS 유지; G60/G65/G70은 각각 별도 증거 후 적용.

## 2026-11-15 KST — Astra P116 검증 완료·G55 통과, 잠정 55/100

- **완료 작업 ID:** P116(A04, +1) 및 별도 점수 게이트 G55(PASS).
- **기능 SHA / 변경 파일:** `b03583f12c5eb212dd0207fb539593ec7c2b8df3`; `tests/step4-style-preset-browser.mjs`만 변경. 기존 BASIC8/PRO12/BUSINESS10 제품 코드는 수정하지 않고 30개 실제 PDF 검증을 재현 가능한 회귀로 고정했다.
- **Linux PASS:** [#43618379958](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379958), exact SHA. npm test 269/269, npm run build PASS. Chrome와 Edge 각각 BASIC 8 + PRO 12 + BUSINESS 10의 실제 A4 PDF 30/30을 생성·검증했다. 구조 시그니처 30종 고유, 40개 고유 표식·시작/끝·문자 순서, 페이지 경계, 줄 겹침, PNG 임베드, 모든 STEP2 V2 store와 PNG 바이트 불변 PASS.
- **Windows PASS:** [#43618379926](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379926), exact SHA. Node 268 PASS / 1 Windows 전용 SKIP / 0 FAIL; desktop 73/73 PASS; Electron/NSIS 설치·실행·제거·0.1.0→0.1.1 V2 업그레이드 PASS.
- **정본 정책 PASS:** [#43618380099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618380099), exact SHA. 세 workflow run 모두 head SHA `b03583f12c5eb212dd0207fb539593ec7c2b8df3`.
- **G55 별도 판정:** P114, P115, P116 실제 PDF 원문/순서 대조와 30종 A4 회귀 조건을 확인하고 PASS. [G55 검증서](docs/evidence/astra/G55/VERIFICATION.md).
- **잠정 점수:** A04 12→13/15, 총 54→55/100. 사용자 확정 A01~A12 최대 배점 변경 없음. 작업 증거는 [P116 검증서](docs/evidence/astra/P116/VERIFICATION.md), [점수표](docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md), [작업 원장](docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json)에 기록.
- **실패 후보:** 이전 SHA `254e8c2b39488c0e2caad733b88fb2abfe04f31f`의 Linux #43618017819는 PDF 추출기 공백 차이로 실패(0점). 최종 검증 SHA에서 비교를 보정했다.
- **한계:** PDF 텍스트 추출 검증은 합성 ASCII 본문과 공백 제외 문자 순서에 한정된다. CJK PDF text-layer/한국어 추출, 고객 자료·실구매자 시각 승인·물리 Win10/11은 미검증. 공식 구매자 수용 UNASSESSED, RELEASE HOLD 유지.
- **다음 작업:** P117. OCR_MANIFEST=null, PRODUCTION_ISSUER_JWK=null, seller thumbprint=null, ASTRA_CUSTOMER_BUILD_ENABLED=false 및 기존 데이터/기능 보존.

## 2026-11-15 KST — Astra P115 검증 완료, 잠정 54/100

- **완료 작업:** P115 (A03 원본/출력 PDF 글자·수치·기호·부정문·링크 차이 대조). 숫자 포함 토큰, 기호/구두점, 한국어·영어 부정 표현, 링크 대상과 추가/중복 토큰을 페이지 위험과 함께 구분한다. 수동 검토를 유지하고 V1/V2 저장을 자동 승인하지 않는다.
- **정확 기능 SHA:** `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`. P114 기능 SHA 이후 5개 커밋, 변경 파일: `src/step7/OfflinePdfReview.tsx`, `src/step7/tokenParity.ts`, `tests/fixtures/step7-pdf-parity-corpus.mjs`, `tests/step7-pdf-review-browser.mjs`, `tests/step7-token-parity.test.ts`.
- **검증 PASS:** [Linux Chrome/Edge #43612143269](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143269) exact SHA — Node 269/269, build PASS, Chrome·Edge 각각 합성 A4 원본/출력 15/15 대조, 취소·잘못된 PDF 복구 및 원본 SHA·STEP1 V1·모든 STEP2 V2 store 불변 PASS. [Windows Electron/NSIS #43612143223](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143223) — Node 268 PASS/0 FAIL/1 Windows 전용 SKIP, desktop 73/73, 설치·제거 및 0.1.0→0.1.1 업그레이드 뒤 STEP2 문서/PNG 보존 PASS. [정본 정책 #43612143523](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143523) PASS(구조 증거 검사 전용).
- **중간 실패와 수정:** #43611032904는 hosted V1 기준 데이터 누락, #43611361119는 테스트 SHA helper import 누락, #43611776507은 V1→V2 마이그레이션 전후 스냅샷 순서 오류로 실패했다. 모두 테스트 준비를 수정했고 점수는 부여하지 않았다. 최종 SHA 3개 Actions가 모두 성공했다.
- **점수·상태:** P115 +2점, A03 10→12/14, 총 잠정 **52→54/100**. P114/P115 VERIFIED, 다음 P116. 공식 구매자 수용 **UNASSESSED**, 출시 **RELEASE HOLD**. 확정 가중치·STEP1 V1·STEP2 V2·BASIC8/PRO20/BUSINESS30·서명키와 출시 차단 상태 불변.
- **제한:** 실제 고객 PDF와 표/다단 의미 정확도, 이미지 원본 픽셀 재현, 물리 Win10/11, 실제 Tesseract OCR·Qwen3 CPU 추론은 미검증. 15쌍 전부 합성 PDF.
- **당시 다음 작업:** P116에서 30개 A4 디자인을 검수하고 G55를 별도로 통과하는 것이었다. 완료 결과와 P117 다음 단계는 이 파일 최상단 최신 상태에 기록했다.


## 2026-11-15 KST — Astra P114 검증 완료, 잠정 52/100

- **완료 작업:** P114 (A03 PDF 읽기 순서·위험 레이아웃 수동 대조). 불확실한 소스 순서를 자동 재정렬하지 않고 원문 추출 순서로 보여주며, 위험 페이지별 확인과 전체 확인을 모두 거쳐야 V2에 저장된다. 수정 시 두 확인을 해제한다.
- **정확 기능 SHA:** `9c3c506ecae49b68f207e6022c6b136da515b7e5`. 구현/회귀 변경: `.github/workflows/ci.yml`, `desktop/step3-project-acceptance.cjs`, `src/step3/ImportPanel.tsx`, `src/step3/pdf.ts`, `src/step3/structure.ts`, `tests/fixtures/step3-layout-risk-matrix.mjs`, `tests/step3-browser.mjs`, `tests/step3-consent-browser.mjs`, `tests/step3-layout-review-browser.mjs`, `tests/step3-structure.test.ts`.
- **검증 PASS:** [Linux Chrome/Edge #43607945345](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945345) exact SHA — 266/266 Node tests, build PASS, Chrome/Edge 각 12/12 PDF 위험 매트릭스 및 A4/IndexedDB 회귀 PASS. [Windows Electron/NSIS #43607945351](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945351) — 265/266 Node tests PASS(1 OS 전용 SKIP), desktop 73/73, NSIS 설치·실행·제거 및 업그레이드 후 STEP2 문서/PNG 보존 PASS. [최종 정책 #43607945617](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945617) PASS(구조 증거 검사이며 독립 기능 승인 아님).
- **중간 실패와 수정:** 이전 `9afe0b0ec1f8a4fe321328f42d8f8065cb41dedd` Linux 실행은 M09-A 테스트가 페이지별 승인 없이 저장 활성화를 기대해 실패했다. 테스트를 페이지별 동의까지 수행하도록 고치고, 본문/역할/순서 수정이 모든 승인을 해제하는 회귀를 추가했다. 최종 SHA에서 Chrome·Edge 각각 12/12 PASS.
- **점수·상태:** P114 +2점, A03 8→10/14, 총 잠정 **50→52/100**. 공식 구매자 수용 **UNASSESSED**, 출시 **RELEASE HOLD**. 확정 배점, STEP1 V1, STEP2 V2, BASIC8/PRO20/BUSINESS30, 서명키와 출시 차단 정책은 유지.
- **제한:** generated synthetic PDFs/hosted runners만 검증. 고객 원본, 물리 고객 PC, 실제 Windows Tesseract OCR 및 Qwen3 CPU 추론은 미검증. 자동 표 셀·벡터 구조 복원/의미 완전성은 약속하지 않음.
- **다음 작업:** P115 (A03 원본 글자·수치·기호·부정문 차이 계층 및 수동 복구·원본 위치 대조). 55% 게이트는 아직 미도달; P116에서 잠정 55점에 도달하면 별도 검증한다.


## 2026-11-14 21:55 KST — Astra High 설계 공시, Instant 개발 담당 전환 (기능 변경 없음)

- **이번 회차 완료:** 사용자 최종설계 가중치 A01~A12 합계100을 보존한 [P114~P126 50→70 상세 실행계획](docs/commercial/ASTRA_P114_P126_50_TO_70_EXECUTION_PLAN_20261114.md), [13개 JSON 작업 원장](docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json), [70→100 Instant 인수인계·High 최종감사 기준](docs/commercial/ASTRA_INSTANT_70_TO_100_HANDOFF_20261114.md)을 `feature/astra-p71-pdf-source-parity-20261112` 브랜치에 GitHub 문서로 공시. 설계 담당 **GPT-6 High** / 실제 구현·테스트·GitHub 최신화 담당 **GPT-6 Instant** / 완료 후 사용자 요청 시 High 별도 감사.
- **배점·상태 불변:** 50점 기준 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1` (이전 [Linux #43595956953](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956953), [Windows #43595956932](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956932), [정본 #43595957159](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595957159) **3/3 SUCCESS**). 이 설계 회차에는 앱 코드·테스트·배포를 **실행/수정하지 않았음**. 잠정 50/100 유지, 공식 사용자/구매자 수용률 **UNASSESSED**, [작업중], **RELEASE HOLD**, 크몽 미등록, Vercel 미적용.
- **작업 원장 검증:** P114~P126 13개, 모두 PENDING, 계획상 추가 +20점, 영역별 70점 목표 합계=70. 55·60·65·70 검증 게이트를 계획에 고정. P123 실제 Qwen3 CPU 추론, P119~P121 실제 Windows Tesseract가 막히면 **미인정**, mock·문서로 대체해 점수 뻥튀기 금지. P127~P138 후보 30점은 실사용/고객 승인 자료가 없으면 100% 인정 불가.
- **다음 시작점:** Instant는 P114를 실제 구현하고 테스트 스크립트에 회귀를 등록한 뒤 정확 기능 SHA Linux/Win/정본 CI 확인, STATUS/HANDOFF·점수표 및 필요시 중앙 원장을 최신 HEAD에 fast-forward 반영. 매번 +점수는 새 SHA 실행 검증 후에만. High 재검수는 사용자 재호출 시 실행.
- **보존:** main/Draft PR #10·고객 원본·STEP1 localStorage V1·STEP2 IndexedDB V2·8/20/30 시안·생산 issuer pin=null, ASTRA_CUSTOMER_BUILD_ENABLED=false, OCR_MANIFEST=null, 비밀/권한/요금/배포/중앙 타상품 무변경. **설계만 공시; P114 코드 미착수**.

## 2026-11-14 KST — P111~P113 확정 설계 잠정 완성률 50/100(+8%p), 정확 기능 SHA 3/3 CI SUCCESS

- **검증된 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1`**: A08(0→2/14) 사용자 설치 Qwen3/Ollama 127.0.0.1 로컬 AI 옵트인 어댑터, 고정 모델/URL·수동 문단 윤문 Diff/승인/거부/되돌림·숫자/부정문 변경 차단 및 timeout/cancel/단일실행. 실제 모델 추론은 이 제품으로 직접 테스트하지 않았으며 합성 HTTP 테스트 8건(로컬 실제 모델 미동봉/미실행). A04(10→12/15) BUSINESS 2~20문서 세션 텍스트 브랜드/레이아웃 일괄 미리보기→문서별 출력, 문서 V2 영구변경 없음. A06(2→4/5) 기록한 출처→사용자 로컬 파일 직접 선택→STEP5 디자인 분석 연계, 권리/URL 일치 자동 확인하지 않음. A07(3→5/12) 스캔 원본 임시 PNG와 OCR 초안 나란히 비교+숫자/의미/표 읽기 순서 수동 확인, 자동 승인·원본 변경 없음.
- **정확 SHA CI 3/3 SUCCESS**: [Linux Chrome·Edge #43595956953](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956953) **2/2 SUCCESS**, Node **263 PASS / 0 FAIL / 0 SKIP**, TS/Vite+실제 Chrome/Edge 합성 PDF A4/V2 보존 PASS. [Windows Electron·NSIS #43595956932](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956932) **SUCCESS**, Node **262 PASS / 0 FAIL / 1 OS SKIP**, desktop **73 PASS / 0 FAIL**, unsigned NSIS 설치·제거/0.1.0→0.1.1 V2+PNG 보존 PASS. [정본 정책 #43595957159](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595957159) **SUCCESS**. 실제 job logs 검증 완료. 이전 중간 기능 SHA의 Windows 실패 2종(IPC preload 구형 assertion, smoke consent 예상값)은 정확 원인 수정 후 최종 SHA 정상 통과; 실패 이력 은폐하지 않음.
- **실 Tesseract 공급자 검증(별도 로컬 실행, 제품/Electron CI 아님):** Tesseract 5.5.0 + kor/eng + NanumGothic 합성 한글 이미지 3개를 이 환경에서 인식: **2건 정확/1건 숫자·순서 오류**. 재현용 `tools/verify-real-korean-ocr.py`. 따라서 실제 한국어 OCR 사용 가능성은 확인했지만 판매용 Windows 공급처·DLL/언어팩 배포 승인, 실제 고객 PDF 및 앱의 최종 OCR 실행은 **미검증**. `OCR_MANIFEST=null` 유지.
- **배점:** 사용자 승인한 12개 영역 합계 100 불변. 총괄의 항목별 잠정 부분점수 **42→50/100 (+8%p)**, 결손 **50점**. A04 +2, A06 +2, A07 +2, A08 +2. 상세 `docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md`. 부분점수 산정 방식/구매자 수용은 사용자 최종 승인이 필요하므로 **공식 최종완성률 UNASSESSED**, 현재 50%는 최종설계 전 범위 대비 검증 진척 추정치이지 판매 승인 아님.
- 변동 없는 출시 장벽: 실 판매자 서명키/핀 null, customer SKU flag false, 같은 프레임 직접 IPC 우회·철회/기기 정책/상용 법적 권리, 실제 구매자 Win10/11, 허가 PDF 5~10 수동 검수, Astra Qwen 실추론·품질, 정식 OCR 배포 미완. **[작업중], RELEASE HOLD, 크몽 미등록, Vercel 미적용.** `main`/Draft PR #10, 고객 원본 PDF, STEP1 localStorage V1, STEP2 IndexedDB V2, 8+22 시안, 다른 상품 정보 보존.
- **다음 P114:** 실제 Windows 로컬 Qwen3 4B 문단 실추론/원문 숫자·부정문·고유명사 비교, PDF 텍스트 편집 E2E, OCR 공급자 고정/Windows 실행 증거 및 BUSINESS 다중 문서 실제 UI 반복 출력. 고객 개인키 발급·배포/판매/원본 전송은 별도 승인.

## 2026-11-14 KST — P110 PDF IPC 프레임 신뢰경계 강화 + 잠정 최종설계 42/100점 (정확 SHA 3/3 CI SUCCESS)

- **기능 SHA `5ed3525947f0225888963806f95d8f821ca03394`**: `desktop/pdf-export-ipc-guard.cjs` 추가. Electron PDF 저장 IPC에서 window/webContents 생존·동일 sender·최상위 senderFrame·정확 `astra://app/index.html` 두 URL 비교 후에만 printToPDF/저장 허용. P110 신규 6개 합성 정책 테스트를 `npm test`와 `npm run desktop:test` 양쪽 등록(첫 CI의 테스트 목록 누락을 발견해 정확 SHA에서 재검증). 기존 개발용 Electron PDF·V2/PNG 회귀 보존. 고객 상용 빌드는 계속 미승인·원래 공개키 pin null.
- [Linux Chrome/Edge #43593105358](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105358) **2/2 SUCCESS**, Node **247PASS/0FAIL/0SKIP**, Chrome/Edge 실제 합성 A4/IDB PASS. [Windows Electron·NSIS #43593105373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105373) **SUCCESS**, Node **246PASS/0FAIL/1 symlink SKIP**, desktop **65PASS/0FAIL**, 설치·제거/0.1.0→0.1.1 V2/PNG 보존 PASS. [최종설계 정책 #43593105644](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105644) **SUCCESS**, 정확 기능 SHA 3/3 워크플로 SUCCESS 및 원시 Node·Windows logs 확인.
- 사용자 최종설계 12영역 가중 합계 100은 불변. 총괄이 새로 제시한 **잠정 증거 기반 완성률 41→42/100(+1%p, A09 4→5/11)**. 계산 기준·누적 근거·58점 미충족 사유는 `docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md`에 고정. **공식 구매자 수용률 UNASSESSED**, 점수 42는 사용자 승인 부분점수·출시 승인 아님.
- same-frame 직접 IPC·변조된 고객 바이너리에서 상용 SKU 유효성 검증과 강한 DRM을 해결한 것은 아님. 정식 서명 키·재발급/환불·장치·실물Win10/11·실 허가PDF5~10·정식 한글 OCR/로컬 AI는 미구현/미검증. **[작업중], RELEASE HOLD, 크몽 미등록, OCR_MANIFEST=null, main/PR10·원본/V1/V2 보존**.
- 다음 P111: 메인 프로세스 서명 검증/상용 실행 경로 독립 보호와 위협모델 검토, 이후 가장 큰 A08/A07 미충족 고정 장벽에 집중. 유료·판매자키·배포·보안 권한 변경은 별도 승인.

## 2026-11-14 KST — P109 SKU GUI·PDF 실행 경로 서명 권한 3/3 정확 SHA 검증 완료

- **기능 SHA `ee7ed4eaacf44a08800b56639d2178f5df76e7d3`**. src/commercial/skuActionGate.ts + CommercialLicensePanel.tsx, Workspace/BatchImportPanel/ProLayoutLibrary/BusinessBrandLibrary 실행 경로에 P107 발급자 지문/서명 영수증 재검증 호출 연결. PDF 저장은 BASIC/PRO/BUSINESS 선택 레이아웃·BUSINESS 브랜드 동시 권한을 저장 직전에 판단. 다중 PDF 개별 저장, 템플릿·브랜드 로컬 보관함 저장/삭제, 시안/브랜드 가져오기·내보내기 UI 내부 접근 검사. 영수증은 React 메모리 전용, V1/V2 영구 저장/서버 전송 없음. P109 신규 합성 회귀 **5/5 PASS**.
- 정확 SHA [Linux Chrome·Edge #43591625251](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625251) **2/2 SUCCESS**, Node **241PASS/0FAIL/0SKIP**, TypeScript/Vite build, 실제 Chrome·Edge A4 PDF·IndexedDB V2/원본 회귀 PASS. [Windows Electron·NSIS #43591625273](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625273) **SUCCESS**, Node **240PASS/0FAIL/1 OS symlink SKIP**, desktop **59PASS/0FAIL**, unsigned 설치·제거, 0.1.0→0.1.1 IndexedDB V2/PNG 보존 PASS, OCR RELEASE HOLD PASS. [최종설계 정책 #43591625548](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625548) **SUCCESS**. 원시 job logs 및 정확 SHA 직접 확인, 전체 3/3 SUCCESS.
- 내부 개발용 시안을 보존하기 위해 `ASTRA_CUSTOMER_BUILD_ENABLED=false`; 실제 판매자 `PRODUCTION_ISSUER_JWK`와 thumbprint는 **null**, 고객용 코드는 상용 기능 **fail-closed**. 검증 성공=실제 고객 라이선스/판매 승인 아님. Electron main IPC 직접 호출·브라우저 기본 인쇄·변조 바이너리의 DRM 우회 방지, 환불/철회·기기 수, 실제 키 안전 운영 및 물리 Win10/11 고객 PDF5~10 검수 미완. main/PR10·원본PDF·V1/V2·기존 시안 보존, OCR_MANIFEST=null, Vercel 미적용.
- 증거: `docs/commercial/ASTRA_P109_GUI_SKU_GATES_20261114.md`. 공식 12영역 A01~A12 사용자 가중치 승인, **최종 수용률 UNASSESSED/100% 미달**, [작업중], **RELEASE HOLD**, 크몽 미등록. 다음 P110: Electron main IPC PDF 저장 신뢰경계/고객용 배포 분리, 직접 호출·만료/취소 정책 검수. 유료·키 발급·보안설정/실배포 변경은 별도 승인.

## 2026-11-14 KST — P108 exact code SHA 발급·연장 정책 Linux/Windows/정본 3/3 CI SUCCESS 최종 정정

- **기능 SHA 0bf9c7bb125b25b3441117a6e54ba53ac05cba67**, 소유자 비추출 ECDSA P256 CryptoKey 요구, P96 canonical 서명 영수증 생성·서명 즉시 확인, 이전 영수증 진위 확인 후 동일 ID·tier·seats로 issuedAt와 expiresAt 단조 증가 연장. src/commercial/offlineLicenseIssuer.ts·tests/offline-license-issuer.test.ts 신규. 테스트 ephemeral 개인키만 사용, 실제 seller private/public key 발급·보관/영수증 상용 배포 없음.
- [Linux Chrome/Edge #43586747520](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747520) 2/2 SUCCESS, Node **236PASS/0FAIL/0SKIP**, 새 P108 8/8 PASS, 실제 Chrome/Edge 합성 PDF.js/OCR UI·IndexedDB V2 보존 PASS. [Windows NSIS #43586747579](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747579) SUCCESS, Node **235PASS/0FAIL/1 OS symlink SKIP**, desktop **59PASS/0FAIL**, P106 Windows Authenticode synthetic/NSIS 설치·업그레이드 0.1.0→0.1.1 V2·PNG 보존·OCR_RELEASE_HOLD PASS. [정본정책 #43586747799](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747799) SUCCESS. **정확 SHA 전체 3/3 workflow SUCCESS**. GitHub raw job logs 확인, 아래 'CI 진행중' 잠정 기록은 본 최종 결과로 정정·역사 보존.
- A09 상용 발급 운영도구/실 키·pin·GUI 액션 권한·좌석 기기 인증/이전 영수증 철회·환불 승인 미완, BASIC·PRO 1석/BUSINESS 최대2석은 기술 초안일 뿐 판매 약관 최종 승인 아님. A07 실제 OCR·A08 한국어 CPU LLM·물리Win10/11·허가 실제 PDF5~10 품질수용 미검증. **공식 최종12영역 UNASSESSED/100 미달**, [작업중], RELEASE HOLD, 크몽 미등록, Vercel 미적용, main/PR10/원본 PDF/V1/V2·디자인8+22/비밀 불변.

## 2026-11-14 KST — P108 오프라인 라이선스 서명 발급·단조 연장 (정확 CI 전체 진행 중)

- 새 **기능 SHA 0bf9c7bb125b25b3441117a6e54ba53ac05cba67**: src/commercial/offlineLicenseIssuer.ts 신설. 소유자 제공 비추출 ECDSA P256 키로 기존 P96 canonical v1 영수증 발급, 사전 발급자 public JWK thumbprint/키 쌍 일치 확인, 발급 직후 P96 검사 재확인. 서명된 이전 영수증만 같은 licenseId/productMajor/tier/seats에 연장 발급, 발행시각과 만료시각 단조 증가 강제. BASIC·PRO 1석/BUSINESS 최대2석은 **기술 초안이며 고객·법적 승인 아님**. 기존 화면/엔진·테스트 외 비밀/원본 변경 없음.
- 신규 tests/offline-license-issuer.test.ts 합성8건: 실제 ephemeral WebCrypto, 잘못된 signer/key pin, tier/기간/자리수 위조, 기존 영수증 재검증, 연장 안전성, production issuer null일 때 상용 SKU unlock DENY. CI [정본 #43586747799](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747799) SUCCESS, [Linux/Chrome/Edge #43586747520](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747520) npm test/build step PASS, [Windows NSIS #43586747579](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747579) npm test/P106 Authenticode step PASS. 전체 run 최종은 IN_PROGRESS; 정확 숫자/성공은 종료 후 확정.
- P108은 **실제품 라이선스 발급 시스템 아님**. 판매자 개인키 생성·보관·실 발급 경로, 환불·회수, 서명목록의 철회 갱신·장치 시트 검사, GUI 기능 락/실 구매자검증은 미완. 과거 영수증은 다른 영수증 발급만으로 자동 취소되지 않음. 전체 공식 12영역 UNASSESSED/100 미달, A09 11점 완수 아님, [작업중], RELEASE HOLD, 크몽 미등록/Vercel 미적용, 원본 및 main/PR10/V1/V2/8+22 시안 그대로.
- 근거 docs/commercial/ASTRA_P108_OFFLINE_LICENSE_ISSUANCE_20261114.md. 기술 변경 파일2개, 판매자 개인키·토큰·원본PDF 업로드0.

## 2026-11-14 KST — P107 exact source signed 3SKU policy 3/3 GitHub CI 성공

- 최종 검증 코드 SHA **0d3501d0cf51f3b5e87370f6a973fbb01d72e697**, 신규 src/commercial/skuAccess.ts+tests/sku-access.test.ts (WebCrypto 합성 서명 SKU권한/위조/발급자/pin/만료 대응7회귀). 상용 issuer JWK/thumbprint null, production SKU access=DENY. BASIC/PRO/BUSINESS 기능 허용정책 엔진만 완성, GUI/실 라이선스/판매 허가는 아직 없음.
- [Linux Chrome·Edge #43583817449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817449) **2/2 SUCCESS, Node228 PASS/0 FAIL/0 SKIP**, Chrome/Edge synthetic PDF.js·OCR 검수·원본/IndexedDB V2 보호 PASS. [Windows Electron·NSIS #43583817441](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817441) **SUCCESS, Node227 PASS/0 FAIL/1 symlink OS SKIP**, desktop59 PASS/0 FAIL, NSIS 0.1.0→0.1.1 사용자 데이터/PNG 보존 PASS, P106 Authenticode synthetic PASS, OCR_RELEASE_HOLD PASS. [정본 정책 #43583817679](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817679) SUCCESS. 전체 **3/3 workflow SUCCESS**, raw job logs 확인.
- 아래 P107 초기 'CI 진행중' 표시를 exact SHA 로그로 성공 정정, 역사 보존. A09 11점 최종수용 완료는 아님: 실제 판매자 pin/GUI 락/기기·갱신·취소·고객 권리/물리 Windows 미구현. 실제 Tesseract/한국어 LLM 및 실 허가 PDF5~10 미확인. 전체 공식률 **UNASSESSED/100% 미달**, Astra [작업중], RELEASE HOLD, 크몽 미등록, Vercel 미적용. 기존 main/PR10/V1/V2/8디자인+22시안·원본 PDF/비밀 변경0.

## 2026-11-14 KST — P107 signed SKU capability policy (전체 CI 결과 대기)

- A09 전체 11점 요구 중 일부: P96 검증 서명 ECDSA-P256 receipt + RFC7638 vendor JWK thumbprint pin → 6개 SKU capability 매트릭스. 신규 src/commercial/skuAccess.ts / tests/sku-access.test.ts 7개 공격·권한 회귀. BASIC base only / PRO 20-layout + template-save·batch-pdf / BUSINESS 30-layout·brand-kit까지 허용 후보를 검증된 receipt로만 판정. 정식 판매자 key/pin은 null이므로 실제 제품 상용 권한 모두 거부; 시험용 서명키는 테스트 메모리에만 존재. 기존 Workspace 프로토타입·V1/V2 저장값 불변.
- 기능 코드 SHA 0d3501d0cf51f3b5e87370f6a973fbb01d72e697. GitHub 정책 [#43583817679](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817679) SUCCESS, Linux [#43583817449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817449) npm test/build step PASS, Windows [#43583817441](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817441) npm test/P106 Authenticode synthetic step PASS. 두 전체 run 최종 conclusion은 검증 대기; 정확 PASS/FAIL/SKIP 종료 후 별도 기록.
- 중요: 아직 실제 키 pin·license issuance·GUI/액션 잠금 통합·기기수/재발급/실구매자 acceptance가 없다. 현재 기존 PRO/BUSINESS는 명시된 비상용 시안 그대로이며 상용 보호가 아니고 A09 완성 주장 금지. 전체 12영역 최종률 UNASSESSED, 100% 미달, [작업중]·RELEASE HOLD·크몽 미등록·Vercel 미적용.
- 변동된 실제 경로는 신규 2개만, main/PR10·원본 PDF·STEP1 localStorage V1·STEP2 IndexedDB V2 및 8+22 시안/모델/비밀정보 그대로 보존. 상세 docs/commercial/ASTRA_P107_SIGNED_SKU_ACCESS_20261114.md.

## 2026-11-14 KST — P106 exact SHA Windows Authenticode evidence 3/3 workflow SUCCESS 확정

- **기능 SHA 7ec1de61a750d324df7e7ae25ff30f109fc766e5**, 새 Windows offline Authenticode 조회·원본 installer SHA/EXE·DLL bytes 전후 SHA·미등록 DLL/위험 path 거부 도구. [Linux Chrome·Edge #43580696635](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696635) **2/2 SUCCESS**, Node **221PASS/0FAIL/0SKIP**·Chrome/Edge synthetic PDF.js OCR UI PASS. [Windows NSIS #43580696709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696709) **SUCCESS**, Node **220PASS/0FAIL/1 OS symlink SKIP**·desktop **59PASS/0FAIL**, 신규 P106 합성 전제/변조/누락·비밀 경로 점검 **11/11 PASS**, Electron/NSIS 설치·제거/0.1.0→0.1.1 V2·PNG 보존 PASS, OCR_RELEASE_HOLD PASS. [정본 정책 #43580696839](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696839) SUCCESS; **전체 3/3 SUCCESS**.
- 아래 P106 초기 '전체 CI 진행 중' 표시는 exact SHA 원시 로그로 성공 **정정**(이력 유지). P106은 합성 Windows unsigned 설치기 서명 상태 검증 기술이지 실제 제3자 설치파일 신뢰·법무 권리 확인이 아니다. 실제 Windows OCR 엔진/binary/사용자 허가 원본 0, 디바이스 Win10/11·실 DLL runtime/실 서명·NOTICE/모델/3SKU 미검증. OCR_MANIFEST=null, 공식 최종12영역 UNASSESSED/100 미달, RELEASE HOLD, [작업중], 크몽 미등록, Vercel 미적용.
- 수정 대상 scripts/tests/Windows CI 문서만, 원래 STEP1 V1/STEP2 V2, main/PR10, 고객 원본 PDF·8디자인 변경0. 근거 docs/commercial/ASTRA_P106_WINDOWS_AUTHENTICODE_EVIDENCE_20261114.md.

## 2026-11-14 KST — P106 Windows Authenticode 사전 감사 도구

- 정확 기능 SHA: 7ec1de61a750d324df7e7ae25ff30f109fc766e5. 신규 scripts/ocr-windows-authenticode-evidence.ps1, tests/ocr-windows-authenticode-evidence.test.ps1, Windows GitHub Actions 보안 단계.
- 설치파일 원본 SHA-256과 매 EXE/DLL 바이트·해시 전후 일치, 파일 크기·미등록 DLL·부정 경로를 검사하고 Windows Get-AuthenticodeSignature 서명 상태 및 관찰된 thumbprint를 출력. **서명은 검증 근거 수집이지 판매·법무허가가 아님.** 실제 공급자 OCR 파일·고객 원본·다운로드/설치·모델 외부 전송 없음.
- [Windows CI #43580696709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696709) P106 synthetic Authenticode evidence 단계 SUCCESS, [최종설계 정책 #43580696839](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696839) SUCCESS. [Linux Chrome/Edge #43580696635](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696635)와 Windows NSIS 전체 결론은 기록 시점 **IN_PROGRESS, 최종 PASS 미검증**; 종료 후 정확 SHA 재검증. P105 CI 3/3은 과거 증거만.
- 실제 제조사 설치본 Authenticode/인증서 신뢰, 모든 Windows DLL과 런타임 로딩·NOTICE/SBOM·재배포 적법성/물리 Win10·11/고객 허가 PDF5~10/한글·금액 OCR/로컬 AI·3SKU 공식100점은 미검증. OCR_MANIFEST=null, RELEASE HOLD, 공식 UNASSESSED/100 미달, [작업중]/크몽 미등록/Vercel 미적용 유지. 기존 main·PR10·STEP1 V1·STEP2 V2·원본 PDF·8디자인 보존.

## 2026-11-14 17:38 KST — P105 정확 기능 SHA Linux/Windows/정본 3/3 CI SUCCESS (최종 정정)

- 정확 기능 SHA **d8e765ef538e6f41fa3fc870a9257238a7c4af98**: [Linux Chrome+Edge #43576345594](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345594) 2/2 SUCCESS, Node **221 PASS / 0 FAIL / 0 SKIP**, 빌드 및 Chrome/Edge synthetic PDF.js OCR 검수/원문·V2 보존 회귀 PASS. [Windows NSIS #43576345628](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345628) SUCCESS, Node **220 PASS / 0 FAIL / 1 Windows symlink SKIP**(221 total), 데스크톱 **59 PASS / 0 FAIL / 0 SKIP**, Electron smoke/패키징/0.1.0→0.1.1 in-place 업그레이드·기존 IndexedDB V2/PNG 보존 PASS. [최종설계 정책 #43576345809](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345809) SUCCESS. **전체 3/3 workflow SUCCESS**.
- P105 신규 정적 PE import/delay DLL fail-closed 합성 11개를 기존 P104 테스트에 추가하여 exact-SHA CI로 검증. 인증된 실제 Windows Tesseract 공급처·Authenticode·실 인식·전 종속 DLL 동적 closure/재배포 적법성을 검증한 것은 아님. OCR_MANIFEST=null, legalRedistributionApproved=false, installerSignatureVerified=false, dllRuntimeDependencyClosureVerified=false, productOcrEnabled=false, NSIS RELEASE HOLD 유지.
- 원본 PDF·STEP1 V1·STEP2 V2·디자인8종·main/PR10 불변. 전체 사용자 12영역 공식 **UNASSESSED/100% 미달**, Astra [작업중], 크몽 미등록, 실제 판매/일반 배포 미승인. 아래 P105 초기 'CI 진행 중' 기록은 본 정확 로그 결론으로 **정정**, 이력 삭제하지 않음.

## 2026-11-14 KST — P105 x64 PE static import + delay dependency fail-closed audit (정확 CI 최종 대기)

- **실제 기능 커밋 SHA d8e765ef538e6f41fa3fc870a9257238a7c4af98** (기존 P104 HEAD 074b2402에서 일반 fast-forward). desktop/ocr-pe-import-audit.cjs 신규, 기존 P104 offline manifest/hash 검사와 결합: PE32+ optional header/section RVA, direct/delay imports, 안전 DLL 파일명, 시스템 DLL shadowing, 신고되지 않은 제3자 DLL 차단. 단일 PE 버퍼 64 MiB 초과는 자동 승인 없이 차단. 기존 원문/PDF/IndexedDB/NSIS HOLD/주 브랜치 불변.
- 신규 tests/ocr-pe-import-audit.test.cjs 11개를 npm test와 desktop:test에 추가; 기존 합성 fake PE optional header를 정상 구조로 보강. **CI run #43576345594 Linux/Chrome/Edge, #43576345628 Windows NSIS, #43576345809 정책**이 기능 SHA에서 실행됨. 최초 step 단위 npm test/Windows Node/React build/desktop smoke/ocr release gate SUCCESS, 정책 workflow SUCCESS. 전체 Linux/Windows installer conclusion은 이 기록 작성 시 **IN_PROGRESS/미확정**. 정확 SHA별 최종 PASS/FAIL/SKIP은 별도 확인하고 갱신할 것.
- P105의 검사는 import descriptor에 **정적으로 기록된** DLL만 다룬다. Windows LoadLibrary 동적 로딩, forwarded exports, 실행 중 DLL 검색·API-set OS 차이, 실제 Authenticode/인증서 유효성, 법적 재배포권·SBOM, 실제 Windows10/11 Tesseract·한국어/숫자/표 OCR/허가 PDF 5~10개와 3SKU/AI 수용은 **미검증**. 실제 release hold와 OCR_MANIFEST=null 유지.
- **공식 12영역 최종완성률 UNASSESSED**, 최종100% 미달, Astra [작업중], RELEASE HOLD/크몽 미등록/Vercel 미적용. 증거 상세 docs/commercial/ASTRA_P105_PE_STATIC_IMPORT_REVIEW_20261114.md.

## 2026-11-14 KST — P104 정확 SHA OCR 공급망·Windows 패키징 3/3 CI 최종 성공

- **최종 기능/회귀 SHA:** e2fd0797990ce94e7f7a68720ece3617f9d114db. [Linux Chrome+Edge #43574432110](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43574432110) **2/2 JOB SUCCESS**, Node 210/210 PASS/0 FAIL/0 SKIP, Vite/TypeScript build 및 Chrome/Edge 각각 실제 PDF.js synthetic scan review E2E PASS(네트워크 외부 요청0).
- [Windows Electron·NSIS #43574432095](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43574432095) **SUCCESS** Node **209 PASS / 1 Windows symlink SKIP / 0 FAIL**, desktop **48/48 PASS**, Windows exe smoke·NSIS 설치/제거·0.1.0→0.1.1 기존 IndexedDB V2/PNG 보존 PASS. **첫·두 번째 NSIS 빌드 모두** OCR `RELEASE_HOLD/nativeOcrAssetsBundled:false/productOcrEnabled:false` 게이트 실제 PASS. [정본 정책 #43574432327](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43574432327) SUCCESS(공식 최종100% 인증 아님).
- 이전 P104 '신규 Linux/Windows CI 미확인' 기록은 정확 SHA 원시 로그로 **성공 확인하여 정정**. 공급망 사전검증 합성 PE/DLL/언어팩 15 + 출시보류 차단 6 사례가 210 Node 테스트에 포함. 실제 제3자 Windows Tesseract 파일을 공급받아 설치·서명·재배포권·DLL 의존 그래프/한국어 품질까지 검증한 것은 **아님**. 실제 라이선스·DLL·설치파일 출처는 계속 HOLD, OCR_MANIFEST=null.
- 코드 저장소 hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112, P104 공급망 문서 docs/commercial/ASTRA_P104_WINDOWS_OCR_PREFLIGHT_20261114.md. STEP1/2 저장 원본, main/PR10, 사용자 PDF·데이터 불변. 공식 12개 항목 최종 점수 UNASSESSED/100% 미달, [작업중]/RELEASE HOLD/크몽 미등록/Vercel 미적용. 다음은 실제 Windows OCR 공급처·DLL/Authenticode·재배포권 확인과 물리 Windows10/11·고객 PDF 검수.

## 2026-11-14 KST — P104 Windows OCR 사전공급망/라이선스·NSIS 출시 보류 방어

- **최종 P104 코드 SHA e2fd0797990ce94e7f7a68720ece3617f9d114db**: `desktop/ocr-supply-chain-preflight.cjs` 외부 Windows x64 OCR 자산 manifest(원본 배포 URL/SHA, 파일별 SHA/크기, DLL·kor·eng 전수재고, LICENSE/NOTICE 증빙 ID·URL) 검증. 미등록 DLL·무허가 경로·중복 대소문자 이름·심볼릭 링크/하드링크·파일 내용 변조·PE32+ x64 불일치·누락된 저작권 증빙은 차단. **통과해도 review-required(법적 재배포/서명/DLL closure/실행 허가 모두 false)**.
- `desktop/ocr-release-hold-gate.cjs`: Electron OCR_MANIFEST=null 유지, 패키지 대상 desktop/dist 네이티브 .exe/.dll/.traineddata 등 및 임의 OCR 폴더, electron-builder.yml extraResources/extraFiles와 사전 고정된 files 목록의 변경을 거부. `npm run build` prebuild와 Windows NSIS 0.1.0 및 0.1.1 각 패키징 직전에 강제. 실제 OCR 바이너리/모델·고객데이터/네트워크 전송 없음.
- `tests/ocr-supply-chain-preflight.test.cjs` **합성 15건** + `tests/ocr-release-hold-gate.test.cjs` **합성 6건**을 npm test/desktop:test에 추가. 실제 EXE/DLL 아닌 합성 PE+모의 언어팩·LICENSE/NOTICE, 고객 원본 0. 기술 설계 및 검증 경계: docs/commercial/ASTRA_P104_WINDOWS_OCR_PREFLIGHT_20261114.md. 실제 라이선스 적법성·Authenticode/원본 설치파일 서명·DLL 의존성 전체 검사는 **여전히 미검증**.
- Github 정확 SHA 정책 게이트 **#43574432327 SUCCESS**, Linux Chrome·Edge #43574432110 / Windows Electron·NSIS #43574432095 **최종 결론 확인 중(현재 CI 실행 중; 성공 주장 금지)**. Windows GUI Tesseract 실제 인식/물리 Win10·11 고객 실PDF·모델/3SKU 인수/판매 승인 미충족. 기존 검증된 P103 기능 f9672f12의 3/3 PASS와 구분.
- 저장소 hibi89/astra_pdf_redesigner, 브랜치 feature/astra-p71-pdf-source-parity-20261112. STEP1 localStorage V1·STEP2 IndexedDB V2·원본 PDF/기존 정상 기능·main/PR10 불변. 공식 최종 12항 UNASSESSED/목표100 미달, [작업중], RELEASE HOLD, 크몽 미등록, Vercel 미적용.

## 2026-11-14 KST — P103 정확 SHA Chrome·Edge·Windows 3/3 SUCCESS (최신 검증)

- 정확 **기능/테스트 SHA f9672f12b2d40106bdcc244e2675c903b3c98888**. [Linux Chrome+Edge #43571908499](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908499) **2/2 JOB SUCCESS, Node189/189 PASS/0 FAIL/0 SKIP + TypeScript/Vite build**, 브라우저 각각 **PASS STEP7 OCR UI**(합성 scanned PDF→PDF.js 실제 PNG→모의 native OCR→페이지/PSM 전환 시 이전 초안 폐기, 외부 HTTPS 요청0). [Windows NSIS #43571908498](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908498) **SUCCESS Node188 PASS/0 FAIL/1 Windows symlink SKIP, desktop27/27 PASS**, 패키지/설치·제거/0.1.0→0.1.1 IndexedDB V2/PNG 보존. [정책 #43571908709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908709) SUCCESS(공식 제품100% 검증 아님).
- 앞선 P103 문서의 '신규 CI 진행 중'은 위 정확 SHA 실 로그로 **성공 확인**하여 정정. 해당 검증은 합성 모의 OCR 응답의 프론트엔드 검수 흐름이며, 진짜 Windows Tesseract 바이너리·DLL·언어팩/상용 권리/고객 실문서·물리 PC는 **미검증**. Linux 실 Tesseract 합성20 PSM6 15/20 exact, PSM3 5/20 exact 기록과 구분.
- 원본 STEP1/2 V1/V2·고객 원본·main/PR10 불변, OCR_MANIFEST=null, 판매/Production 미적용. 공식 A01~A12 전체 최종완성률 **UNASSESSED / 100% 미달**, [작업중], RELEASE HOLD, 크몽 미등록. 상세 docs/commercial/ASTRA_P103_OCR_PSM_REVIEW_20261114.md.

## 2026-11-14 KST — P103 OCR PSM 실측 비교·초안 페이지/모드 귀속 보강

- **P102 기능 SHA 5d87df4ef2f9f6b6cefd6f51f52d7f66de0d2d71 정확 CI 성공 확인:** [Linux Chrome+Edge #43568805209](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43568805209) 2/2 SUCCESS, Node **189/189 PASS·0FAIL**, TS/Vite build PASS, 실제 합성 브라우저 검증. [Windows NSIS #43568805220](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43568805220) SUCCESS, Node **188 PASS/0FAIL/1 Windows symlink SKIP**, desktop **27/27 PASS**, EXE/설치·제거/업그레이드 후 V2/PNG 보존. [정책 #43568805420](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43568805420) SUCCESS(100% 실상품 인증 아님). 이전 P102 'CI 미확인' 기록은 본 기록으로 정정.
- 실제 Linux Tesseract 5.5/kor+eng 합성 20종 **PSM6 정확15/20·평균 CER2.2%** / **PSM3 정확5/20·평균 CER51.28%**. 동일 NanumGothic 생성기 Git Blob 3a156177, 독립 동일 이미지/공백 제거 NFC 비교. 일반 단문 성능은 PSM6 우세이나 6개 복합 다단·표 사전 실험에서는 PSM3가 일부 표식을 더 인식해 일률적 승자 아님. 모두 수동 원문 대조 필요. 상세 `docs/commercial/ASTRA_P103_OCR_PSM_REVIEW_20261114.md`.
- **P103 코드 SHA f9672f12b2d40106bdcc244e2675c903b3c98888:** 골든 실행기 PSM 선택 인수(3/6), STEP7 UI 페이지·PSM 전환 시 이전 초안 폐기 및 생성 페이지/모드·수정 여부 명시, 합성 스캔 PDF의 실제 PDF.js 렌더+모의 OCR 결과 Chrome·Edge E2E 신규 추가/CI 연결. 자동 사용자 원문 수정·DB쓰기 없음. **이 SHA의 CI는 현재 진행 중이며 최종 미검증**. P102 PASS로 P103 PASS를 대체하지 않음.
- 기존 Tesseract Windows 실제 바이너리+DLL/NOTICE·재배포 SHA·Win10/11 실PC·고객 PDF5~10·GGUF·정식 3SKU 라이선스/권리/판매 승인 미충족. OCR_MANIFEST=null, 원본 V1/V2·main/PR10/고객 파일 변경0. **전체 최종점수 UNASSESSED/100% 미달 · [작업중] · RELEASE HOLD · 크몽 미등록**.

## 2026-11-14 KST — P102 OCR Windows 공급망/UTF-8/PSM/임시파일 보강

- **정본 기능 SHA:** 5d87df4ef2f9f6b6cefd6f51f52d7f66de0d2d71. 원격 P102 코드: OCR stdout UTF-8 한글 파편 디코딩 문제 수정(바이트 누적 후 단일 디코딩), PSM 3/6만 허용 및 STEP7 사용자 선택, 임시 PNG 삭제 재시도·정리 실패 시 비성공 처리, OCR 페이지 Canvas 최대 4096px/8MP. 회귀 3종(한글 바이트 분할/PSM 제한·주입 차단/삭제 실패) 신규 추가.
- **정적 원격 검증:** GitHub 파일/호출 흐름 11개 연결 기준 PASS(원격 소스 존재·단위 테스트 포함 여부 확인). 이는 npm test나 실제 앱 CI 성공 판정이 **아니다**. P102 exact SHA 전체 Node/tsc/Chrome/Edge/Windows Electron NSIS 실행 상태는 **미확인**, 따라서 신규 기능 종단 완료 주장 금지.
- **공급망 확인:** Tesseract 공식 tessdoc에는 최신 공식 Windows 설치기 없음. UB Mannheim 5.5.3.20260724는 third-party Windows installer. Apache2.0 Tesseract/tessdata_fast, BSD계열 Leptonica 및 PNG/TIFF/JPEG/zlib/Windows DLL NOTICE 별도 검증 필요. 다운로드·실행·SHA고정·Windows 재배포 승인 아직 없음. OCR_MANIFEST=null 계속 유지.
- **원본/상용:** STEP1 V1/STEP2 V2·고객 PDF·배포·main/PR10·등록 상태 불변. [작업중], 공식 final score UNASSESSED/100% 미달, RELEASE HOLD/크몽 미등록.
- **세부:** docs/commercial/ASTRA_P102_WINDOWS_OCR_SUPPLY_CHAIN_20261114.md. 기존 P101 Linux 한영 합성 20건 15/20 정확/5 오류는 역사적 검증 범위만 유지, P102 품질 재검증 전 승격 금지. 다음은 exact SHA CI/Windows 공급망 SBOM·DLL 해시 및 PSM3/6 골든 비교.

## 2026-11-14 KST — P101 실제 Tesseract 한글 골든20 재현 (합성 Linux / 판매 HOLD)

- **코드/재현 스크립트:** scripts/generate-ocr-golden.py와 scripts/run-ocr-golden.cjs 신규 추가. 단순 스캔·어려운 합성 조건(한글/영문/음수/금액/날짜/블러/회전/명암/글자 크기) 20 PNG를 로컬 글꼴로 생성하고, 입력 SHA 및 Tesseract 바이너리·kor+eng 언어팩을 SHA-256 고정한 뒤 실제 desktop/local-ocr-controller.cjs를 실행한다. OCR 문자열 자체를 테스트 로그에 저장하지 않고 집계/불일치 사례 번호만 출력. 사용자 고객 PDF·기존 IndexedDB·판매 자산 업로드/수정 없음.
- **원격과 동일 바이트 검증:** 생성기 Git Blob **3a156177c3ecdb92b12db0760c7c88b9b1de2abd**, 실제 OCR 골든 실행기 Git Blob **9b0405d1b3aff34471edb5728b3f80f4c6631d5c**. Node22 로컬 실행본·GitHub SHA 일치. 오리지널 합성 PNG와 생성기 재생성 PNG 20/20 SHA 일치.
- **실제 오프라인 엔진:** 테스트 환경 Linux Tesseract 5.5.0 / Leptonica 1.84.1, 설치 경로 /usr/bin/tesseract, kor/eng 언어팩을 격리 temp로 복사해 **테스트 전용 주입 manifest**로 실행. 실행파일 SHA256 **74b76a5b994adcc18be362bf64ed5118082b2401d5d9a35242e92fc4c62e2b4b**, kor 데이터 **6b85e11d9bbf07863b97b3523b1b112844c43e713df8b66418a081fd1060b3b2**, eng 데이터 **7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2**. **배포용 Windows 실행파일·DLL·모델 아님, 권리·상용 패키지 재배포 미승인**.
- **측정 결과:** 실제 20/20 OCR 응답 status=review, 공백 제거·NFC 기준 완전일치 **15/20**, 오인식 **5/20**(사례 2,8,13,16,17), 사례별 평균 문자 오류율 **약 2.2%**, 실행 20건 합계 약 **4.1~4.3초**(해당 Linux 호스트 한정). 불가→물가, 2,300,000→22300,000, A-101→4-101 등 의미/숫자 훼손 사례 확인. 이 결과는 **OCR 사용 가능 골격의 실작동 근거**이지 원문 보존 충실도 통과가 아니며 5개 정확 불일치로 수동 검토/보정 필수.
- **재현:** Python Pillow+사용권 확인된 로컬 한국어 폰트로 generator에 --out/--font 전달. Linux에서 runner에 samples-dir, tesseract 실행파일, kor.traineddata, eng.traineddata 절대경로를 순서대로 전달. 무료, 네트워크/클라우드/외부 PDF 전송 0. Python/Node 버전 및 로컬 글꼴 차이가 있으므로 OS 간 동일 OCR 성능 보장 없음.
- **이번 실행/상품 구분:** 이전 P101 mock 단위 **7 PASS/0 FAIL**, 실제 Linux 합성 OCR 골든20 실행(완전일치15/20), 앱 React/Chrome·Edge 및 Windows NSIS 전체 exact SHA **미검증**, 실 한글 PDF 스캔20건/고객 승인5~10 PDF/Windows10·11·재배포/코드서명/진짜 로컬 LLM 등 미충족. 앱 기본 OCR_MANIFEST=null로 **실제품 OCR 버튼 비활성**, 최종설계 공식 UNASSESSED/100% 미달, [작업중]/RELEASE HOLD/크몽 미등록. 실판매/원본 외부전송 금지.
- 다음: 자동화 실제 CI 로그 확인 → Windows 라이선스/해시 고정 Tesseract 패키지+CLI 한국어 골든 E2E → UI 테스트/안전 저장·수동 검수 → 실제 PDF·3SKU/LLM/상용 QA.

## 2026-11-14 KST — P101 OCR 입력 검증 강화 + 정확 원격 Blob 로컬 7/7 PASS

- P101 기능/테스트 최신 정확 소스 SHA **d6dcf80bc024c2a36ab40738cbed1d7b28e4711f** (feature/astra-p71-pdf-source-parity-20261112). src/step7/ocrEligibility.ts로 선택 가능한 원본 텍스트가 있는 페이지를 OCR에서 제외(스캔/비선택 텍스트만 제안); LocalOcrPanel.tsx에 실제 PDF.js getTextContent() 검사 후 차단. PDF 추출/기존 V1/V2 저장 데이터 변경 없음.
- desktop/local-ocr-controller.cjs의 이전 IHDR-only 입력 검사를 PNG 전체 청크 길이·CRC32·IDAT/IEND 유무·메모리 상한 검증으로 강화했다. 유효한 로컬 PNG 4x4 및 손상된 CRC 합성 fixture로 부정 검사. 실제 OCR 실행 바이너리는 **여전히 미번들/OCR_MANIFEST=null**.
- **실제 로컬 단위 검증:** Node.js 22.16.0 동일 소스 격리 복사본 컨트롤러/eligibility 7 PASS / 0 FAIL / 0 SKIP. 파일 내용 Git Blob SHA: OCR controller **ebfce5b831dfb4c73310ab4f6fced876664bc8d0**, OCR controller test **f7b448e05cba48ff3a3f24be106153ced9f6b735**, eligibility **11bdc9383fdad6b048fcbcb43ae6af4c045f5c31**, eligibility test **a26b1e0e6cc5c5891f780806da1e3e6e6f05d5f9**. Github 원격 내용 일치 확인. eligibility strict TypeScript 검사 PASS.
- **미검증:** 전체 npm test/build/Chrome·Edge/Windows Electron·NSIS exact SHA CI 결과(연결 도구로 조회 불가), 실제 OCR 한영 스캔 인식 20종·Tesseract 바이너리 kor+eng/NOTICE/재배포권·실 Windows10/11·허가 실 PDF5~10건/상품 인수. 전체 공식 최종설계 **UNASSESSED/100% 미달**, [작업중], RELEASE HOLD, 크몽 미등록.
- 인수인계: HANDOFF.md, docs/commercial/ASTRA_P101_LOCAL_OCR_DEVELOPMENT_20261114.md. 다음은 정확 SHA CI 확인·최소수정 → 검증된 Tesseract 공급원/실인식 E2E → 수용 조건 증거 기반 재산정.

## 2026-11-14 KST — P101 로컬 OCR 백엔드·STEP7 화면 연결 (신규 검증 대기)

- 사용자 승인된 0원 OCR 개발 범위에서 독립 Tesseract 실행 컨트롤러, PNG 8MiB/8MP 가드, kor/eng 및 바이너리 SHA256 검증, 단일 실행/취소/20초 타임아웃, 임시파일 비공개·삭제, Electron 신뢰 IPC, 스캔 PDF 한 페이지 미승인 OCR 초안 UI를 추가했다. GitHub 최신 작성 코드 커밋 **deeb1ed94a00cb25cfc1efafcf8e33fab1f9847b**(문서 전 마지막 소스 SHA). 
- npm test, desktop:test/Chrome·Edge 웹 비활성·Windows Electron smoke 신규 회귀를 등록했다. **정확한 최신 소스 전체 CI PASS/FAIL 결과는 아직 미확인**. 테스트 코드 추가를 테스트 통과로 간주하지 않는다.
- OCR_MANIFEST=null, 실제 바이너리·kor/eng 언어팩 **미포함**, 제품 실제 OCR 인식 **NOT RUN**. 모델/고객자료 다운로드/외부 전송0, 원본 V1/V2·main·PR10·배포·상품 등록 불변. 실 스캔/한국어 골든/물리 Win10/11 및 LICENSE·NOTICE 미검증, **RELEASE HOLD**.
- 문서: docs/commercial/ASTRA_P101_LOCAL_OCR_DEVELOPMENT_20261114.md. 공식 최종 12영역 가중치 승인·점수 UNASSESSED/100% 미달, 과거 기술85%와 구분. 다음에는 정확 SHA CI 결과부터 확인하고 오류 최소 수정 후 Tesseract 바이너리 권리/해시·실인식 구현 진행.

## 2026-11-14 KST — 사용자 승인 확정: 무료 OCR·로컬 한국어 LLM·12영역 100점

- 사용자 명시 승인: Tesseract 등 무료 OCR 검토/구현, llama.cpp+Qwen 등 무료 한국어 로컬 모델 검토, A01–A12 배점 100점 확정. 공식 기능별 증거 점수는 **산정 대기/목표100% 미달**(0%·85%·100%로 임의 표시 금지). 상세 후보·권리·제외 승인: `docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md`.
- 공식 upstream Tesseract OCR/한국어 tessdata_fast Apache-2.0, llama.cpp MIT, Qwen3-0.6B-GGUF Apache-2.0 후보 라이선스 출처 확인. 실제 바이너리/해시/모델 품질/한국어 OCR·실PC 미검증, 다운로드/상용 번들/판매/고객 PDF 업로드 미실행. 이전 P95~P100 CI 검증 사실 불변.

## 2026-11-14 KST — P100 수동 STEP6 출처 북마크 정확 SHA CI 3/3 SUCCESS (최신)

- **P100은 개발 회차 번호**이고 전체 제품 **100% 완성 뜻 아님**. 원본 7단계/상용 SKU 전체의 공식 최종완성률 **`UNASSESSED` / 목표100% 미달**. 과거 내부 기술 85% 잠정 이력은 별개.
- 기능·테스트 정확 SHA `2213e8e50759836b8c24bfbe7b037536a8fd995a`: [Linux Chrome+Edge #43553461990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553461990) **2/2 SUCCESS, Node179/179 PASS, 0 FAIL**, 새 출처 수동 보관·권리 `UNVERIFIED`·기존 V2 문서/스타일 불변 브라우저 실제 E2E PASS. [Windows NSIS #43553462026](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462026) **SUCCESS, Node178 PASS/0 FAIL/1 OS SKIP, desktop19/19 PASS**, 설치/제거/0.1.0→0.1.1 인플레이스 업그레이드 V2·PNG 보존. [정책 #43553462320](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462320) SUCCESS(증거 정책만).
- STEP6 `src/step6/sourceRecords.ts` · `SourceRecordsPanel.tsx` 사용자 스스로 선택한 HTTPS URL/이름/미검증 권리메모 20개 별도 로컬 보관/삭제. 이미지/PDF 바이트·파일명·원문 데이터 자동 유출/다운로드0. **검색 결과 자체 API/카드/원본 저작권 검증·STEP5 자동 연결은 여전히 미구현.**
- 앞 P95~P99 CI SUCCESS 기록은 아래에 보존. 실제 소유 Windows10/11·허가 실PDF5~10·실 OCR·한국어 GGUF·SKU 발급/entitlement·재배포/소유자 크몽 GO **미충족**, RELEASE HOLD/[작업중]/미등록. [13시 한 번에 요청](docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md) 및 [전체 12영역 미승인 배점](docs/commercial/ASTRA_P100_SCOREBOARD_20261114.md).

## 2026-11-14 KST — STEP6 수동 출처 기록 보관 P100 기능 (제품 완성 100% 아님)

- 기능 SHA `2213e8e50759836b8c24bfbe7b037536a8fd995a` 단계명 P100은 작업 번호이며 **공식 최종완성률 UNASSESSED / 목표100% 미달**. 별도 로컬 key·메모 등록 최대20건, HTTPS 출처 고정·권리 `UNVERIFIED`, 원본 PDF/그림 데이터 자동 수집·외부 API 네트워크0, 기존 IndexedDB V2 불변. UI `src/step6/SourceRecordsPanel.tsx`, 파서 `sourceRecords.ts`, Node·브라우저 회귀 추가.
- 정확 SHA [Linux Chrome/Edge #43553461990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553461990), [Windows NSIS #43553462026](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462026) **진행 중/최종 미검증**. [policy #43553462320](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462320) SUCCESS는 정책만. [구현 한계·다음 작업](docs/commercial/ASTRA_STEP6_SOURCE_RECORDS_P100_20261114.md).
- 앞선 P95–P99 정확 소스 `0a0dec3e`의 Linux Chrome/Edge #43552456521 2/2 Node177 PASS + Windows #43552456514 Node176/desktop19 SUCCESS 검증 보존. 현재 전체 상용 3SKU/STEP6 결과카드/OCR/GGUF/실 허가PDF5~10·실 Win10/11·권리/판매 인수 미완. [작업중]/RELEASE HOLD/미등록.

## 2026-11-14 KST — P99 exact test-command SHA CI 3/3 SUCCESS (latest)

- 정확 기능+보안 회귀 SHA `0a0dec3edb998cc8ea94bcffc3fa781c7d1c9377`: [Linux Chrome+Edge #43552456521](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456521) **2/2 SUCCESS, Node177/177 PASS, 0 FAIL**, TypeScript/Vite 빌드와 기존 V2/STEP3/STEP4/STEP5 기능 회귀. [Windows NSIS #43552456514](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456514) **SUCCESS, Node176 PASS/0 FAIL/1 OS SKIP, desktop19/19 PASS**, 안전 외부 검색 allowlist/무단 schemes 거부/네이티브 재확인 코드 테스트, NSIS install/uninstall/0.1.0→0.1.1 V2 문서·PNG 보존. [evidence gate #43552456710](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456710) SUCCESS(정책 증거만).
- Windows GitHub runner에서 `shell.openExternal` 클릭→실제 시스템 브라우저 실행 자체는 GUI 자동시험 미구현, 사용자 물리 PC 미검증. P99은 사용자 동의한 외부 검색 페이지 안전 연결이고, **원래 STEP6 앱 내 결과 카드·출처/라이선스 자동 수집의 대체가 아님**. 현재 앱은 인터넷 PDF 업로드 금지·내부 HTTP 차단 유지.
- P95/P96/P97/P98 이전 정확 SHA 모두 3/3 CI SUCCESS 상태. 공식 전체100% **UNASSESSED/미달** (역사적 내부85% 별도), 실 OCR·GGUF·정식 라이선스 GUI·CUSTOMER Win10/11 실PDF5~10·권리/소유자 판매 GO 등 미완. [작업중]/RELEASE HOLD/크몽 미등록. 사용자 13시 기존 통합 예약에서 실 PC·권리 및 배점 승인 한번에 안내. 문서 커밋을 새 기능 검증 SHA로 오인 금지.

## 2026-11-14 KST — P95~P99 독립 개발·실CI 증거 및 공식 P100 (최신)

- **공식 최종완성률: UNASSESSED / 목표 100% / 미달.** 사용자 확정 원본 7단계와 3SKU 전체가 분모. 과거 85%는 엔지니어링 내부 잠정치이며 공식 퍼센트가 아님. 사용자 미승인 12영역 100점 배점안은 `docs/commercial/ASTRA_P100_SCOREBOARD_20261114.md`. 계산·출시 승인 전 가산 금지.
- **P95 PRO 순차 PDF(정확 기능 SHA `e69dfed1361ef0ade02eefbb883e070d45aa7a9b`)**: 2–10개/합계 100MiB 이하 로컬 대기·각 PDF 원문 검수·수동 승인·개별 저장·저장된 V2 보존. [Linux Chrome+Edge #43551099424](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43551099424) **2/2 SUCCESS, Node167/167 PASS**, Chrome+Edge 각 실제 PDF 2개 개별 인수 E2E. [Windows #43551099468](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43551099468) **SUCCESS, Node166 PASS/1 OS SKIP, desktop16 PASS**, NSIS 설치·업그레이드 V2 유지.
- **P96 오프라인 ECDSA P-256 라이선스 모듈(정확 SHA `0ffcbbeb10e51ed35ed98383c7239eb57239bf62`)**: signed BASIC/PRO/BUSINESS entitlement 3단계 순수 검증, 만료·위변조·다른 서명자·미존재 키 fail closed. [Linux #43551475625](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43551475625) **2/2 SUCCESS Node170/170 PASS**, [Win #43551475613](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43551475613) **SUCCESS Node169 PASS/1 OS SKIP desktop16 PASS**. **실제 상용 개인키/공개키 pin 미발급·GUI 라이선스 적용·재설치/환불·기기수 정책 미완**. 판매 활성화/권한 부여 완료 아님.
- **P97 로컬 PRO 스타일 보관함**: 최초 `6d68410f` TS unknown `savedAt` 타입 오류로 build/Windows FAIL; `ed363a4f8aa0294114a1ff0ef99c3daff2f846eb` 타입 좁힘 1곳 수정 후 [Linux #43551962845](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43551962845) **2/2 SUCCESS Node172/172 PASS**, [Windows #43551962840](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43551962840) **SUCCESS Node171 PASS/1OS SKIP desktop16 PASS**, V2 원본 불변. 별도 localStorage에 안전한 시안 ID·별명만 최대24개 저장/복원; 사용자 PDF·원본 V2 미변경.
- **P98 BUSINESS 로컬 브랜드 보관함(정확 SHA `1918a8016205a57381a938a1045bd001409914ae`)**: 회사명·텍스트·강조색 12건 저장·재적용, 로고/PDF·개인자료 미저장. [Linux #43552063732](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552063732) **2/2 SUCCESS Node174/174 PASS**, [Windows #43552063812](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552063812) **SUCCESS Node173 PASS/1 OS SKIP desktop16 PASS**, V2 보존. 정식 상용 브랜드 일괄 배치/entitlement 대체 아님.
- **P99 STEP6 Electron 검색 연결:** 외부 Google/Bing만 HTTPS 구조·쿼리길이 제한 허용, Electron system browser에서 별도 사용자 native 확인, 앱 내부 HTTP 차단 유지. 코드 `a2b7feabd6d4ac612d49f2042b1c3c81edb672de`, P99 CJS tests Linux+Win 추가 포함 최신 source `0a0dec3edb998cc8ea94bcffc3fa781c7d1c9377`; [Linux #43552456521](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456521), [Windows #43552456514](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456514) **신규 CI 진행 중 (최종 미확인)**, policy #43552456710 SUCCESS (정본 정책만). 실제 고객 OS 네이티브 팝업·외부 페이지는 미검증. 앱 내 검색 결과 카드/출처 라이선스 자동수집 기능은 미완.
- **P100 STEP6 출처 북마크 추가 시도:** 선택한 브라우저 테스트 삽입 문자열 단일 앵커 불일치로 GitHub 커밋 전 중단(기능 미구현·소스 불변). 반복 강제 패치 대신 후속 별도 파일·브라우저 테스트 검토 후 전환.
- 핵심 미완: 실제 Tesseract OCR 설치/한국어 인식·실 승인 GGUF/llama.cpp CPU 품질·정식 3SKU 사용권 UI/메이저 약관/환불·BUSINESS 여러 문서 브랜드 일괄·STEP6 검색결과 화면·지원 표/다단·실 5~10 허가PDF/물리 Win10·11/저작권·소유자 판매 GO. **BASIC/PRO/BUSINESS RELEASE HOLD**. 1시 사용자 폰/PC/승인 요청은 이미 기존 통합 예약에 추가됨.
- 기존 main/Draft PR10, STEP1 localStorage V1·STEP2 IndexedDB V2, 고객 PDF·비밀/모델 파일, Production/Vercel/크몽 미등록 상태 불변. 정확 코드 기능 SHA는 위 항목 각각, 본 문서 커밋은 코드 검증으로 계산하지 않음.

## 2026-11-14 KST — P93/P94 증거·공식 최종완성률 추적표 최신화

- **공식 최종완성률 `UNASSESSED` / 목표100% / 미달**. 과거 내부 엔지니어링 85% 잠정은 별도 표시. 제안 가중치 12개 영역 100점은 아직 사용자 미승인; 사용자 13:00 한 번에 요청. [REQ별 상태/정확 SHA](docs/commercial/ASTRA_P100_SCOREBOARD_20261114.md). `0%` 혹은 `85% 공식 완료`로 표현 금지.
- 정확 기능 SHA `39acc84f48bf1edda4b2687e896dc833ab398e92`, Linux Chrome/Edge #43549158873 **2/2 SUCCESS·Node165/165 PASS+build PASS**, Windows #43549158855 **SUCCESS·Node164 PASS/1 OS SKIP/desktop16 PASS·NSIS 설치·제거·업그레이드 V2 유지**, 정책 #43549159013 SUCCESS.
- P93 고급 22종 전체 Chrome/Edge A4 실제 PDF 출력 확인. P94 BUSINESS 브랜드 회사명/꼬리말/색상/수동 로컬 로고 이미지 및 JSON 설정 내보내기/가져오기·초기화 기술 검증(브라우저/Node 2 신규 회귀). P94 구성은 임시 메모리/파일이며 DB schema·고객원본·문서/회사 자료 영구 저장·무단 외부 전송 없음. 정식 SKU/고객 합격 아님.
- P95 PRO 다중 PDF 큐 통합 패치 앵커 오류 2회(소스 CRLF와 문자열 불일치)로 **커밋 전 중단**, 기능 미구현. 기존 정상 STEP3 PDF 가져오기 보존. 외부 모델/실 OCR·PRO 정식 배치·고객 Windows·허가 PDF5~10·저작권/법적·판매 GO 여전히 대기.
- 사용자 13:00 별도 예약 중복 생성 없음. 기존 [13시 사용자 목록](docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md)과 공식 `UNASSESSED`/[작업중]/RELEASE HOLD/크몽 미등록 유지. 기능/테스트 원본 SHA `39acc84f`, 문서 HEAD는 새 커밋 후 확인.

## 2026-11-14 KST — P92 정확 기능 SHA 전체 CI 3/3 SUCCESS (최신 검증)

- 소스/테스트 SHA **`b8b29bc13fe09a7220ed47b5139e5f41c3e5140f`**: [Linux Chrome+Edge #43547702092](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702092) **2/2 SUCCESS**. 실제 GitHub build/test 로그 Node22 **163/163 PASS, 0 FAIL**, TypeScript/Vite build PASS; Chrome/Edge 브라우저 STEP5·STEP6 동의 후만 검색 링크·STEP4 22시안 JSON 내보내기/가져오기·데이터 불변·실제 A4 PDF 회귀 통과.
- [Windows NSIS #43547702089](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702089) **SUCCESS**, Node **162 PASS/0 FAIL**(+OS 차이 1SKIP), desktop test **16/16 PASS**, unsigned NSIS 설치·바로가기·제거·0.1.0→0.1.1 업그레이드 및 기존 V2 문서·PNG 유지 PASS. [최종설계 증거정책 #43547702386](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702386) SUCCESS는 정본 evidence policy 판정.
- 기능 검증 3개 워크플로가 모두 녹색이지만 테스트는 합성/runner 기준이며 **원본7단계+상용 SKU 최종 100%는 미달**. 실제 Win10·11 물리 사용·허가 PDF5~10건의 사람 육안 인수·OCR 실동작/한국어 GGUF 추론 품질·폰트/모델 재배포·정식 PRO20/BUSINESS30 영구 라이브러리/entitlement·브랜드/배치·최종 판매/지원/환불 승인 미충족. STEP6은 외부 검색수집이 아닌 사용자 수동 검색 링크임.
- 공식 `UNASSESSED`/[작업중]/RELEASE HOLD/미등록/Production 미적용 유지. 사용자 13시 일괄 PC/권리 검수 안내 `docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md`. GitHub 문서 HEAD는 이번 반영 뒤 재확인; **정확 기능 증거는 `b8b29bc1`**. 기존 원본·DB V2·PR10/main 손대지 않음.

## 2026-11-14 KST — P92 고급 레이아웃 22종 휴대용 JSON 재사용 구현

- P92 **소스 SHA `b8b29bc13fe09a7220ed47b5139e5f41c3e5140f`**: `src/step4/advancedLayoutPreset.ts`의 22종 고급 ID만 JSON `astra-advanced-layout`/version1으로 안전 내보내기·재불러오기. 1KiB 상한·스키마 키 정확 검사·유효 ID 체크·불량/임의 추가 필드 거부. `Workspace.tsx`에 UI 통합 및 브라우저 V2 저장 불변 회귀 추가, 데이터베이스 스키마 마이그레이션·PDF/에셋 직렬화·원본 수정 없음.
- 독립 Node22 모듈 테스트 P92 **2/2 PASS**(실제 저장소 전체 빌드와 다른 격리 미러), P91 이전 `be243985ff5c` **Node161/161 PASS + Chrome/Edge 2/2 SUCCESS + Windows 1/1 SUCCESS + 최종설계 정책 SUCCESS** ([Linux #43547363002](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547363002), [Windows #43547362316](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547362316)). P92 정확 소스 CI [Linux #43547702092](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702092) 및 [Windows #43547702089](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702089) **실행 중**, [설계 정책 #43547702386](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702386) SUCCESS. 최종 결과를 확인하기 전 P92 통합 통과 주장 금지.
- 고급 JSON 파일 수동 재사용은 PRO20/BUSINESS30 완성·로컬 DB 영구 라이브러리·라이선스 entitlement·브랜드 키트·배치 작업이 아니다. STEP6 외부 이미지 검색은 소유자 동의형 링크만 구현(무자동검색/무 PDF 전송). OCR 실실행/상용 한국어 GGUF/물리 Win10·11/실PDF5~10/폰트·모델 재배포·실고객 인수·크몽 승인 **미완**.
- 공식 최종설계율 **UNASSESSED, 100% 미달**; 역사적 엔지니어링 85% 재사용 금지. [작업중], BASIC/PRO/BUSINESS RELEASE HOLD, 미등록, Production/Vercel 미적용. 소유자 13시 작업 묶음: `docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md`. 기존 main/PR10·사용자 데이터 보존.

## 2026-11-14 KST — STEP6 무료 검색 동의형 연결·P91 작업

- 정확 소스 HEAD `95a7f7be6cab5a98637fceac7f50196eb1bac219`: React STEP6 검색 패널, 수동 키워드만 허용, Google/Bing 고정 HTTPS 새 탭 링크, 개별 클릭 전 동의 요구. PDF 바이트·파일명·프로젝트 데이터 자동 전송 없음. 기존 STEP5 사용자가 직접 내려받은 권리 확보 파일만 로컬 분석. 외부 API·유료 결제·schema 변경 없음.
- Node22 독립 모듈 테스트 **2/2 PASS** 및 정적 URL/전송 방지 자체검사 PASS(컨테이너 재현, 전체 npm suite 아님). exact HEAD GitHub CI Linux Chrome/Edge #43547118090 및 Windows #43547118003 **진행 중**; 최종설계 증거 게이트 #43547118295 SUCCESS(증거정책만).
- 추가 Chrome/Edge 실제 브라우저에서 수동입력·동의 전 링크 차단·동의 후 HTTPS 키워드 전달·검색어 변경 시 동의 해제·IndexedDB 불변을 검증하는 회귀를 `tests/step5-reference-browser.mjs`에 보강. 이 테스트가 포함된 다음 SHA 전체 CI는 **미검증**.
- STEP6 인터넷 결과 자동 수집/라이선스 판정/앱 내 카드 검색은 미구현이며 STEP6 전체 완료가 아님. PRO20/BUSINESS30 정식·OCR·실한국어 모델/성능·실사용 Windows·5~10 실제 PDF·상용권/사용자 수용·출시도 그대로 미완. 공식 최종완성률 **UNASSESSED / 100% 미달**, [작업중]·RELEASE HOLD·미등록 유지.
- 오후 1시 사용자 PC 일괄 요청은 `docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md`로 수집. 기존 자동 예약 중복 생성 금지. 기존 STEP1 v1/STEP2 IndexedDB V2·원본 PDF·main·Draft PR10 불변. Production/Vercel 미적용.

## 2026-11-14 KST — P90 정확 SHA 최종 CI 3/3 GREEN 및 인수검사 최신화

- **실제 코드/테스트 SHA `8d604a0644cc74f9bf6ebc35dca7c64a17a3245b`**: [Linux Chrome+Edge #43545039341](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43545039341) **2/2 SUCCESS**. GitHub 실제 raw job 로그 npm **159/159 PASS, 0 FAIL**, TS/Vite build PASS, 양 브라우저 기존 데이터·PDF 스모크 통과, P89 22종 구조형 후보 및 실제 A4 출력 마커 PASS. [Windows NSIS #43545039441](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43545039441) **SUCCESS**: Electron native smoke/unsigned 설치·실행·제거·업그레이드 기존 IndexedDB V2 유지. [최종설계 policy #43545039836](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43545039836) SUCCESS(증빙 정책).
- P90 신규 보수적 검토기: +/- 금액·날짜·비율·URL·한국어 인용·부정/금지 표현의 변경 제안을 검사해 실패시 거부, 합성 한국어 20건 + 핵심 부정 3건. 실제 모델 파일 실행은 `RELEASE_MANIFEST=null`로 **금지**. 자동 규칙 검사 ≠ 오프라인 LLM 또는 완전 의미보존.
- P89 기존 8개 + 추가 22개 구조 시안: 실제 Chrome/Edge 임시 UI 22종과 A4 1종/저장불변 테스트 통과. 그러나 PRO20/BUSINESS30 **영구 레이아웃 저장·실사용 권한·고객 전수 PDF 출력 미검증**.
- P88 5~10건 오프라인 소유자 문서 검수 지원은 합성/CI 성공이지만 실제 5~10건 사용자 소유 PDF 작업 **미실행**. OCR 0원 설계/공식 Tesseract Apache-2.0 자료 검토 문서는 작성했으나 **OCR 바이너리·언어팩 다운로드/실행 0회**, 별도 사용자 승인 대기.
- **최종 상태:** 원래 7단계+SKU 전체 공식 완료율 `UNASSESSED`, **100% 미달**. 이전 엔지니어링 추정 85%는 과거 내부 수치일 뿐 최종 완료율 아님. [작업중], RELEASE HOLD, 크몽 상품 미등록, 3개 SKU 미출시. Production/Vercel 미적용.
- **다음:** 별도 사용자 승인 필요한 실제 한국어 Qwen GGUF/llama.cpp·Tesseract OCR·인터넷 레퍼런스 질의/저장 스키마·서명·판매 판단을 오후 1시 예약에서 한 번에 요청. 사용자 PC/실PDF·폰트·출력/권리 검증 전 GO 금지. GitHub main/PR10·사용자 원본 v1/V2 미변경.
- 문서 최신화 커밋은 코드를 재검증한 새 SHA로 착각하지 않는다. 정확 기능 검증 SHA는 위 `8d604a06`.

## 2026-11-14 KST — P90 보호 토큰 가드 / 오프라인 OCR 비용 설계 인수인계

1. **최종 목표/기술:** Astra 기존 7단계+상용 3 SKU(3만/6만/9만 원)의 원문 보존/옵트인 로컬 AI, React/PDF.js/Electron+Node. 전체 100% 목표, 공식률 UNASSESSED.
2. **신규 구현:** `desktop/local-model-controller.cjs` 위험 구문 보호가 기존 ASCII 숫자/인용만 보던 것을 수치 부호·통화·굽은 따옴표·한글 부정/금지/취소까지 확장. `tests/local-model-controller.test.cjs`에 20개 한국어 골든 입력과 3개 핵심 보호 검증 추가. `RELEASE_MANIFEST=null` 유지(실모델/다운로드 없음). 독립 CLI OCR(A) vs WASM(B) 무상 설계·권리 조사 `docs/commercial/ASTRA_ZERO_COST_OCR_DECISION_20261114.md` (코드 미구현).
3. **테스트 상태:** 별도 Node22.16.0 20/20 합성 부호·부정 시나리오 PASS. P90 정확 source SHA `8d604a0644cc74f9bf6ebc35dca7c64a17a3245b`: [Linux Chrome/Edge #43545039341](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43545039341)와 [Windows #43545039441](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43545039441) 실행 중; npm test/build 스텝 SUCCESS 확인, 최종 3개 job verdict/실기기 **미확정**. [최종설계 정책 #43545039836](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43545039836) SUCCESS는 증거 정책만.
4. **완료/진행/대기:** P89 임시 레이아웃 22개 정확 SHA `cabe0adf79a3` Chrome+Edge 2/2, Node157/157, Windows SUCCESS. P90 단위 코드는 원격에 반영, Hosted 전체 검증 진행 중. 실모델·실 OCR·PRO20/BUSINESS30 영구 저장·권한·실고객 수용 미완, 판매 HOLD.
5. **실패/전환:** P90 현재 신규 회귀 실패 증거 없음, 정규식 독립 재현 20/20. OCR은 Tesseract(A)/WASM(B) 비교만 했고 승인 이전에 다운로드/실행하지 않음. 새 CI 결과 확인 전 성공 주장 금지.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, P90 소스 `8d604a0644cc74f9bf6ebc35dca7c64a17a3245b`, 이전 P89 `cabe0adf79a3`, 문서 HEAD는 지금 커밋 후 재확인. Draft PR10 미병합.
7. **배포/환경:** GitHub Actions Node22/Chrome/Edge + hosted Windows Electron NSIS. Vercel/Production 미적용. 사용자 PC 미실행, 공개 판매 미등록.
8. **원본·안전/백업:** STEP1 localStorage/STEP2 IndexedDB V2/원본 PDF/main/기존 PR/모델 가중치/토큰 불변. Git parent SHA 복구 가능. 고객 문서 외부 업로드 금지.
9. **다음 작업 및 사용자 승인:** 새 CI exact SHA 결과 검사→오류면 근본 원인만 보정→상용 한국어 GGUF/실 CPU 다운로드 및 OCR 프로그램·언어팩은 오후 1시 사용자 승인 요청에 일괄 포함, 파일·권리 확인 전 다운로드 금지. 원래 7단계/PRO20·BUSINESS30 영구기능·실고객 Windows 5–10 PDF/지원·서명/크몽 GO 모두 따로 검증.
10. **갱신:** 2026-11-14 KST, 로컬 20개 합성보호 검사+원격 GitHub 최신 소스/진행 중 Actions와 공개 Tesseract 라이선스 문서 기준. `[작업중]`, 공식 UNASSESSED, 출시/판매 NO-GO 불변.

## 2026-11-14 KST — P89 정확 소스 SHA Chrome·Edge·Windows 검증 완료

- 코드/테스트 SHA `cabe0adf79a3724066c367ac7cbdb3955bbc113a` [Linux Chrome+Edge Actions #43544304090](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43544304090) **2/2 SUCCESS**: npm 단위 **157/157 PASS, 0 FAIL**, TS/Vite build PASS; Chrome/Edge 양 브라우저 실제 `PASS P89 PRO/BUSINESS TEMPORARY` 로그(22개 선택·서로 다른 computed DOM geometry/실제 A4 PDF/기존 IndexedDB V2 불변), STEP4 기존 파일 프리셋/취소/복원 PASS.
- [Windows NSIS #43544304096](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43544304096) **SUCCESS**: 설치형/업그레이드·기존 기본 8종 출력/데이터 유지 등 기존 Windows 회귀 PASS. 22개 고급 시안을 Windows 설치형에서 각각 출력한 증거는 없음. [설계 gate #43544304524](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43544304524) SUCCESS(정책만).
- **검증된 결과:** BASIC 8종 불변 + 고급 **임시 시안 22개** 선택/출력, 저장된 디자인/콘텐츠 미변경. **검증되지 않은 것:** 실제 PRO20/BUSINESS30 영구 재사용·Entitlement/30개의 PDF 전수 인쇄/실 고객 출력·실 PC·오프라인 한국어 모델/STEP6/7/상용권·판매 승인.
- **공식 완성률 UNASSESSED / 100% 미달 / 기존 기술85% 잠정(역사 기록) / Astra [작업중] / RELEASE HOLD·미등록**. 최종상품으로 상향 산정 금지.
- 문서 전용 이번 갱신은 테스트 후 상태 기록이며 테스트된 코드 SHA를 새 문서 HEAD로 바꾸지 않는다.

## 2026-11-14 KST — P89 PRO/BUSINESS 추가 22개 임시 출력 시안 (검증 진행)

- 소스 기준 **`cabe0adf79a3724066c367ac7cbdb3955bbc113a`** (최초 22종 구현 `81aa46f9980188070c612a8becb1ddbb56ec5d1d`, 후속 브라우저 PDF A4 정규식 테스트만 보정).
- `src/step4/skuLayoutCandidates.ts`: 기존 BASIC 8종 외 PRO 시안 12개/BUSINESS 시안 10개를 선언하고, `Workspace.tsx`에 별도 **임시 미리보기 및 PDF 시험 출력 UI** 연결. `styles.css`에서 테마별 제목·프레임·테두리·여백·정렬·섹션 구획 22개 구조형 후보를 구현. 기존 V2 DesignSettings 스키마/데이터, main/PR, 과거 8종, 상품 권한 시스템 변경 없음.
- `tests/sku-layout-candidates.test.ts` Node 단위 검사(22개 ID/계층/11개 패밀리/중복 형상/기존 스키마 무변경), `tests/step4-style-preset-browser.mjs` 실제 Chrome/Edge 선택 22개·계산 CSS 22개 구분·취소/IndexedDB 불변·A4 1종 인쇄 검사 추가.
- **검증 상태:** GitHub Actions [Linux Chrome/Edge #43544304090](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43544304090), [Windows #43544304096](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43544304096) 실행 중; [최종설계 증거 규칙 #43544304524](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43544304524) SUCCESS. 신규 22 시안 전체 A4/Windows 실물 개별 출력·고객 수용은 **미검증**, CI 종료 전 PASS 주장 금지.
- **판정:** 임시 출력 후보를 **상용 PRO20/BUSINESS30 완성이나 템플릿 영구 저장·SKU 라이선스라고 간주하지 않음**. 원본 최종설계 공식률 **UNASSESSED**, 100% 미달, 이전 기술85% 잠정, 해총 Astra [작업중]·RELEASE HOLD·미등록 그대로. 고객 실제 문서 5~10, 물리 PC, STEP6/7 OCR·레퍼런스 검색, 실제 한국어 GGUF/권리 승인 대기.
- 후속: 해당 정확 SHA CI 완전 종료 판단→진짜 PDF 22/22 구조·인쇄 회귀/폰트·다페이지 개선→승인된 호환 스키마/라이선스 구현 전에는 판매 출고 금지. 

## 2026-11-14 KST — ASTRA P88 새 기능 SHA CI 완전 확인 (최종설계 100% 미달)

- **기능 SHA** `fb3b02217c6c4223df49c2141e9373f08317a66c`: GitHub Blob이 로컬 합성검증 Node22.16.0 5/5 PASS인 새 P88 검수 도구 및 테스트와 각각 동일(`3c6a4fcd...`, `e14d18f8...`).
- [Windows NSIS #43541356233](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43541356233) **COMPLETED SUCCESS**: build/desktop native smoke/unsigned NSIS/설치→실행→제거/0.1.0→0.1.1 업그레이드 이후 STEP2 IndexedDB 유지/installer SHA 보고·아티팩트 업로드.
- [Chrome+Edge #43541356242](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43541356242) **COMPLETED SUCCESS**: npm test + npm run build, Chromium Chrome 인쇄/상태저장, Microsoft Edge A4 PDF/IndexedDB smoke 각각 SUCCESS.
- [최종설계 증거 정책 #43541356536](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43541356536) **COMPLETED SUCCESS**: 점수 과장 없이 evidence/scope gate 통과. 이것은 제품 100% 수용 아님.
- 이후 문서 전용 [크몽 상품 초안](docs/commercial/ASTRA_KMONG_LISTING_DRAFT_20261114.md), [7단계 전체 100% 격차표](docs/commercial/ASTRA_FINAL_BLUEPRINT_100_GATES_20261114.md), [Apache/MIT 모델 라이선스 1차 조사](docs/commercial/ASTRA_MODEL_LICENSE_PRECHECK_20261114.md) 작성. 이 3개 docs-only 커밋은 테스트 대상 소스 변경 없음.
- **정식 전체 완성률 UNASSESSED·100% 미달 / 역사상 내부 엔지니어링 잠정 85%**. 5~10 허가된 고객 PDF, 물리 Windows10·11, 20/30 디자인, STEP6 공개 레퍼런스 검색/STEP7 OCR, 실제 한국어 GGUF, 상용 사용권·SKU entitlement/출시 승인 미완; `[작업중]`, `RELEASE HOLD`, `미등록`. Production/Vercel 미적용.
- 아래 과거 작업 로그는 변경하지 않음; 후속 실제 개발·검증 때만 상태 갱신. 개인 PDF/경로/모델 가중치/토큰 GitHub 업로드 금지.

## 2026-11-14 KST — 사용자 재개, 최종설계 100% 목표 / P88 오프라인 5–10 PDF 배치 인수검수

- **사용자 최신 지시:** 기존 11/13 중단·[사용자 개입 필요] 상태를 폐기하고 100% 완성 작업 재개. 해총 Astra [작업중] 중앙 커밋 `e1bbafc864ccd935cfc8ba68f9a43b049ea92f4b`.
- **이번 소스 기능:** 별도 `scripts/owner-batch-acceptance.mjs`로 STEP7 기존 PDF 원본/출력 SHA+수동 7항목 검수 기록을 로컬에서 5–10건 결합. 원본 내용·파일명·경로를 출력하지 않음; symlink/중복/변조/덮어쓰기 차단. `tests/owner-batch-acceptance.test.mjs`를 npm test에 추가. 구조·스키마 변경 없음.
- **실제 실행:** Node22.16.0 로컬 합성 단위테스트 **5 PASS / 0 FAIL**, `node --check` PASS. 이 테스트의 PDF는 헤더만 있는 합성 검사용 바이트, 실제 PDF 파싱/Windows·CI 새 SHA는 **검증 대기**.
- **완성 판단:** 기존 85% *엔지니어링 추정*과 새로운 사용자 최종설계 *공식 UNASSESSED* 구분; 100% 미달, 모든 SKU RELEASE HOLD/미등록. 구매자 PC/실PDF 5~10/PRO20/BUSINESS30/진짜 라이선스 확보 한국어 GGUF·GPU/CPU 성능·서명/상업권·고객 인수 미검증.
- **원본 보호:** 기존 STEP1 v1, STEP2 IDB V2, main, PR3/4/10, PDF 원본, 사용자 데이터, 환경변수·모델/유료 서비스 변경 없음. 배포/Vercel 미적용. 테스트가 녹색이어도 판매 GO로 전환하지 않음.
- **후속:** 새 GitHub 커밋 SHA에 연결된 Linux Chrome/Edge/Windows CI 확인 → 실패하면 원인별 최소 수정 → 소유자 Windows 실PDF 점검을 별도 요청 → PDF/모델 사용권 및 디자인 20/30 개발 순으로 검증.

## 2026-11-13 KST — 사용자 직접 지시로 ASTRA 개발 종료·[사용자 개입 필요] 인계
- **최신 사용자 지시:** 목표 95% 달성 전이라도 Astra `[작업중]` 중앙 표식을 제거하고 `[사용자 개입 필요]`로 변경. 이는 앞선 일반 목표 잠금 지시를 **Astra에만** 명시적으로 변경한 것임. 해총 `kmong-productization/docs/audits/KMONG_16_CURRENT_20261111.md`에 반영, 중앙 표식 `[사용자 개입 필요]`.
- **상태:** 현재 완료 엔지니어링 85% 잠정, 95% **미달**; 출시 **RELEASE HOLD**, BASIC/PRO/BUSINESS 판매 NO-GO. 기존 자동 CI 검증은 소스 `0db2acb5185445d342f97062a6962ec52a08a1fe` 기준 Linux/Chrome+Edge [#43243819225](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243819225) 2/2 SUCCESS 150 PASS, Windows [#43243819123](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243819123) 1/1 SUCCESS, 149 PASS/1 SKIP, desktop16 PASS, NSIS 설치·업그레이드 PASS. 최근 변경은 문서·상태만, 기능·실제 검증 재실행 없음.
- **사용자 개입 필요:** 원본 제공 및 5–10개 실 PDF 육안 검증, 구매자 물리 Windows10/11 인수시험, 모델·폰트의 상업적 이용/재배포 권한 승인, SKU 및 판매·배포 최종 승인. **개발 미완:** PRO20/BUSINESS30 고유 레이아웃 및 실제 상용 통합·서명 등. 체크리스트만 채워도 95%로 판정할 수 없음.
- 소스/원본PDF/IndexedDB V2/기존 PR·main 보호. Astra 작업은 소유자가 재개를 다시 명시적으로 지시하기 전까지 **종료·대기**, 다른 크몽 상품 표식은 불변.

## 2026-11-12 KST — ASTRA P85–P87 owner-only acceptance improvements, exact-SHA CI GREEN, P95 unmet
- New code on `feature/astra-p71-pdf-source-parity-20261112`: P85 `a048fba6787b` page-local raster image draw drift despite equal global count; P86 `ca9fce6670a9` whole-document extracted reading-order risk despite same token multiset or changed page count; P87 `0db2acb51854` seven-item transient owner visual checklist with local JSON evidence and unchangeable `ownerApproval=NOT_GRANTED`. CLI/browser count flags only. Existing user V2/schema, original PDF and files, main, PR10 Draft preserved.
- Exact new functional SHA `0db2acb5185445d342f97062a6962ec52a08a1fe`: [Chrome+Edge Linux #43243819225](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243819225) **SUCCESS 2/2**: Node **150/150 PASS**, build PASS, real Chrome/Edge STEP7 owner check/file input/result JSON/V2 unchanged/no external HTTP PASS. [Windows #43243819123](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243819123) **SUCCESS 1/1**: Node **149 PASS/1 SKIP**, desktop **16 PASS**, 8/8 unique A4 outputs, NSIS install/uninstall/in-place upgrade retaining stored STEP2 content+PNG PASS. Synthetic fixture only, no real buyer machine.
- P85 had both [Linux #43242919874](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43242919874) / [Windows #43242919558](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43242919558) SUCCESS. P86 [Linux #43243356071](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243356071) FAILURE on Edge CDP cold start 60s no DevToolsActivePort (runner/browser environment), not product assertion; its build-and-test job succeeded and [Windows #43243355823](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43243355823) SUCCESS; P87 later ran Edge green.
- Current internal **85% provisional** remains; target **95 NOT MET**. Concrete gates: representative owner consented PDFs, physical Windows buyer QA, PRO20/BUSINESS30 designs, approved licensed local Korean model/font and commercial sale/legal/signing. BASIC/PRO/BUSINESS RELEASE HOLD, central Astra **[작업중] never remove before verified 95**.
- Full evidence `docs/commercial/ASTRA_P85_P87_ACCEPTANCE_EVIDENCE_20261112.md`; no deployment, model download, paid API or original data change.

## 2026-11-12 KST — P84 PDF.js vector-paint CI regression recovered, P95 target still unmet
- Real CI read via GitHub Actions push-run REST GET (previous PR-only query misleadingly returned empty): P83 code `36bc458da322` [Linux #43233430431](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43233430431) FAILURE (146 PASS/2 FAIL; actual Edge vector drift 0 vs 2), [Windows #43233430460](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43233430460) FAILURE (145 PASS/2 FAIL/1 SKIP). Both failures traced to P82/P83's incorrect assumption that PDF.js emits standalone `OPS.stroke`.
- P84 diagnostic synthetic-only source `2bbadf4116a2` verified actual PDF.js 6.4.299 encapsulates stroke paint opcode in `OPS.constructPath` at `argsArray[i][0]`. Production fix `ceef31d121d3d2a89448220326c89ecb1bc6066a`: GUI/CLI use embedded drawing opcode, regression helper covers it, temporary diagnostic removed, exactly five scoped paths. Draft PR #10 open/unmerged, main/data preserved.
- **Exact-source [Linux Chrome+Edge #43235958596](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43235958596) SUCCESS 2/2 jobs**: Node22 148/148 PASS, build PASS, Chrome/Edge real STEP7 PDF pair PASS with offline/IndexedDB preservation. **Exact-source [Windows #43235958651](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43235958651) SUCCESS 1/1**: Node 147 PASS/1 SKIP, desktop16 PASS, installed native PDF + 8/8 distinct A4 layouts, NSIS install/uninstall and synthetic 0.1.0→0.1.1 data-preserving upgrade PASS.
- P81 source `d417eb91` historical push-run [Linux #43228896996](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43228896996) and [Windows #43228897262](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43228897262) both SUCCESS, correcting older "not verified" entries. See `docs/commercial/ASTRA_P84_PDFJS_VECTOR_CI_RECOVERY_20261112.md`.
- **Engineering 85% provisional, 95 NOT achieved, BASIC/PRO/BUSINESS RELEASE HOLD, hub ASTRA [작업중] retained**. Real customer PDFs / buyer PC / PRO20 + BUSINESS30 / licensed Korean local LLM / signing / rights and sale acceptance still pending. No production release, cloud, data transmission, licensing or schema changes.

## 2026-11-12 KST — ASTRA P82/P83 vector-stroke structural advisory, P95 objective still unmet
- Functional commits P82 `31304eae012c7f78de597ce3095764559764a364`, P83 `36bc458da322ebb77b9b48190857112b637ea7bf` on `feature/astra-p71-pdf-source-parity-20261112`, Draft PR #10 not merged. Only six scoped code/test files per compare, no main/customer schema/IndexedDB changes.
- Existing raster/text/numeric/P76–P81 review preserved. CLI PDF.js and GUI now report source/output PDF vector stroke-paint count and same-index page vector drift counts (P83), warning if removed table border or moved page strokes. Count-only risk signals, not graphic/semantic proof; no PDF contents exported.
- New helper exact Git blob `0399a2c8ba957797f15ca41e9b5672b30a4cf8b2` and test blob `adf5c769d7a789a8f53fca28978cf878ad646a8d` independently matched Linux files. Node22.16 **3/3 PASS/0 FAIL**, helper `tsc` PASS. Synthetic PDFs identical extracted text but 4 vs 3 vector drawing objects confirmed independently using PyMuPDF, not full application PDF.js test.
- Latest GitHub commit workflow query yielded zero PR-triggered runs and commit statuses empty; actual full npm/build/Chrome/Edge/Windows latest SHA **NOT VERIFIED**. Real customer PDF, owner physical Windows, PRO20/BUSINESS30 distinct layouts, license/LLM and sale acceptance missing; **85% provisional / P95 NOT ACHIEVED / RELEASE HOLD / [작업중] remains until verified goal**.
- Detailed evidence `docs/commercial/ASTRA_P82_P83_VECTOR_SIGNALS_20261112.md`.

## 2026-11-12 KST — ASTRA P79–P81 review resilience; 95% objective pending
- Product feature `feature/astra-p71-pdf-source-parity-20261112` functional SHA `d417eb91e31f5781fded65120bcfc363a4ea97c2`. P79 `3739ede4` fixes stuck PDF review button after input switch using AbortController and PDF.js loader destroy; P80 `c2003ced` flags sign-only changes (-100/100/+100) in CLI/UI lexical comparison; P81 `d417eb91` prevents stack overflow when appending many tokens.
- Exact new helper Git blob `4513d7608d5cb5f836b8b87cb69e1fc2d1f81973` reconstructed locally: Node22.16 isolated regression **11 PASS/0 FAIL**, 1000 numerical fuzz cases PASS, 300001-token controlled error PASS, `tsc` standalone PASS. Initial bug was reproduced (10 pass/1 fail with RangeError) before P81 fixed it. Three sets of browser/PDF regression were added, but **not run here**.
- `.github/workflows/ci.yml` already includes feature branch push and Chrome/Edge PDF browser review. GitHub connector commit workflow-run query filters PR and reports zero; status endpoint empty. Actual new-SHA `npm test`, full React/Vite build, actual Chrome/Edge and Windows installed-app **UNVERIFIED**. Historical P75 CI remains restricted to its original SHA.
- Documented evidence `docs/commercial/ASTRA_P79_P81_REVIEW_RESILIENCE_20261112.md`; no customer data, schema, model, external network, source PDF modification, permission or merge.
- **85% provisional internal engineering unchanged; P95 NOT ACHIEVED; BASIC/PRO/BUSINESS RELEASE HOLD, not sale ready.** Source rights, local LLM, original PRO20/BUSINESS30 design acceptance, real owner PDF/physical Windows and exact CI are pending. Central product **[작업중] must remain** until verified 95%.

## 2026-11-12 KST — ASTRA P78 inside-page reading order (95 target still pending)
- Current source and test commit: `071978729197c671f2a41b0e1ce6ad838ce24f8b` on `feature/astra-p71-pdf-source-parity-20261112`. Prior P76/P77 parent `1151a0d6f78db3faaae6782815c8acdf1864e9e5` remains recoverable; Draft PR #10 stays open and unmerged.
- Actual regression gap reproduced: identical token multiset, identical count on same page, reordered table labels were previously not flagged. Implemented per-page ordered-token risk signal for CLI PDF.js and GUI. Counter warns only when the per-page multiset matches but token order differs; it does NOT claim semantic, table or visual fidelity. No PDF text/content/path included in report.
- Files: `src/step7/tokenParity.ts`, `src/step7/OfflinePdfReview.tsx`, `scripts/owner-pdf-source-output-review.mjs`, and three corresponding tests/browser regression. GitHub commit parent compare confirmed exactly 6 scoped changed files, no other application files or storage model affected.
- Verified: Linux Node22.16 exact Git blob `f249d24dcaad06d9050e3ab470c39c96707074d1` SHA match; TypeScript `tsc --noEmit --skipLibCheck --target ES2022 --module ESNext tokenParity.ts` PASS; Node 5/5 local regression PASS; 300,000-token scenario and 300 deterministic cases PASS (0 mismatches). These tests cover the isolated core helper, not full app/PDF.js.
- Full original `npm test`, `npm run build`, Chrome/Edge file-upload integration, Windows Electron/NSIS at this SHA: **NOT VERIFIED**. GitHub connector returned zero PR-triggered workflow runs and zero combined commit statuses; do not equate empty results with CI pass/failure. Previous P75 browser/Windows SUCCESS applies only to historical SHA.
- Engineering final-product score **85% provisional unchanged / 95% target NOT MET**; BASIC/PRO/BUSINESS **RELEASE HOLD**. Source, original 7-stage blueprint, user data, IndexedDB V2, main branch, licensed fonts/models, production unaffected. Per latest user AGENTS goal lock, central Astra **[작업중] MUST STAY until 95% verified**.
- Evidence and pending owner/execution gates: `docs/commercial/ASTRA_P78_ORDER_INTEGRITY_20261112.md`.

## 2026-11-12 KST — ASTRA P76/P77, P95 objective remains pending
- Feature source `047d48372f4e5c997bf6f24683a90cd05c506873` (parent `dc69f7e7ddbb4a3816ab9068373e8feefd659799`) on `feature/astra-p71-pdf-source-parity-20261112`; main and prior IndexedDB V2 preserved.
- P76 CLI PDF.js and GUI compare same-index page selected-text token counts. Globally identical tokens on reversed PDF pages are detected; unequal page counts are REVIEW REQUIRED, not fidelity proof. Export still contains counts/flags only.
- P77 removed post-error pathname cleanup of private JSON/HTML review output, preserving replaced owner files on concurrent writes as HOLD. O_EXCL still refuses overwrites.
- Source code/test commits `702032f0f24a6ebfbc682eab5915fe6766a22a2c`, `047d48372f4e5c997bf6f24683a90cd05c506873`, GitHub diff 2+4 expected paths only. Exact blob `src/step7/tokenParity.ts` 6a9ebc5c3f08ebca0e567cf0d920803141d0eb46 reconstructed and Linux Node22.16 6 assertions PASS.
- Full npm, Chrome/Edge browser, Windows NSIS at final SHA NOT VERIFIED: connector returned no PR workflow runs and empty commit statuses. Earlier P75 exact SHA 3b3c6f73 CI Chrome+Edge 2/2 SUCCESS and Windows installer SUCCESS, but cannot transfer that status to P76/P77.
- Final-product internal engineering remains **85% provisional**, **95 NOT ACHIEVED**, BASIC/PRO/BUSINESS RELEASE HOLD. PRO20/BUSINESS30 unique designs, licensed local Korean LLM, real owner customer PDF acceptance, physical Windows10/11, STEP6 search, rights/signature/support are pending or approval-gated.
- See `docs/commercial/ASTRA_P95_ATTEMPT_P76_P77_20261112.md`; no model/API, permission, release, deployment or source file transfer.

## 2026-11-12 KST — P71–P75 PDF source/output parity (85% provisional engineering; RELEASE HOLD)
- Independent new feature `feature/astra-p71-pdf-source-parity-20261112` code **`3b3c6f73a11d1791076eb5a860f14f87691844b5`**, original parent `feature/astra-p52-to-p70-20261111@8f987462dc7c2edd02303ec32c9813340170860a`, main and original STEP1–5 intact.
- Owner-selected local source/output PDFs: actual PDF.js selected-text tokens, numeric changes, raster draw parity, A4 and PDF pages. CLI additionally binds original manual receipt + project .localdoc JSON + original/changed PDF to SHA256 and emits private new-only offline JSON/HTML with script/network disabled; GUI integrates **최종 PDF 원본 대조** with local file pickers, diff metadata/sha display/export and return to unchanged IndexedDB V2. No OCR, model, original file edits, data transfer, license approval.
- Exact-source [Chrome/Edge Actions #43118808792](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43118808792) **SUCCESS 2/2 jobs**, Linux Node **134/134 PASS, 0 FAIL**, React TS/Vite build; both real Chrome and Edge emitted **PASS STEP7 PDF PAIR** (PDF2 local upload, numeric modification visible, metadata-only JSON, V2 unchanged, external HTTP 0).
- Exact-source [Windows Actions #43118808750](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43118808750) **SUCCESS 1/1 job**, Windows Node **133 PASS/1 SKIP/0 FAIL** out of134, desktop bundle **16 PASS**, packaged EXE smoke, unsigned NSIS install/uninstall and in-place upgrade **PASS**. Windows skip is platform-specific symlink behavior; genuine owner physical Win10/11 NOT VERIFIED.
- Previous 70% subjective engineering estimate +5 physical source/receipt/project/output SHA +4 in-app two-PDF risk comparison +3 independent no-JS offline owner JSON/HTML +3 exact-source Chrome/Edge+Windows regression = **85% provisional internal engineering metric**. Not formal seven-step readiness nor commercial acceptance. PRO 20/BUSINESS 30 layouts, licensed offline Korean LLM, STEP6 internet search/OCR approval, complex tables, actual customer's PDF 5–10 samples, real buyer PC, signed binary, fonts/licensing and retail rights **UNVERIFIED/NOT IMPLEMENTED**; **BASIC/PRO/BUSINESS RELEASE HOLD, SALE NO-GO**. No merge/production. [Details](docs/commercial/ASTRA_P85_PDF_PAIR_REVIEW_20261112.md).

## 2026-10-29 — STEP3 cancellation, progress and recovered-source ordering (code `9e131b2`)

- Branch `integration/astra-commercial-core` remote HEAD: `9e131b296bd17a75595769a36d9ebfc954e3c0c9`; PR #9 remains Draft/open/unmerged. Original local project and user data were not touched.
- STEP3 now reports the page being analyzed and passes an `AbortSignal` into PDF.js. Cancel, replacement selection and unmount destroy an active PDF.js task; a late file read is rejected before parsing. Missing-text recovery retains estimated coordinates only in the review draft so multiple manual recoveries remain in source order; project conversion strips those coordinates from manually recovered blocks.
- Windows installed-app acceptance now checks loading status during cancel/reselect and ignores late responses after document switch. The STEP3 source review browser regression verifies the recovered block can navigate back to its estimated source location. Installed reload helpers wait for the STEP2/3 renderer to hydrate before executing persistence checks.
- Local verification on code `9e131b2`: `npm test` 90/90 PASS; `npm run build` PASS; `npm run desktop:verify` 16/16 PASS; changed acceptance scripts pass `node --check`. Exact-SHA Windows and browser runs for `9e131b2` were still in progress at last check. Windows installer workflow #40856599632 on `db461dc` SUCCESS; Windows and STEP1/2 workflows on `52c18b0` SUCCESS; both workflows on `2291a85` SUCCESS. Windows was not run directly on this workstation.
- Seven-step estimate remains approximately **52%**, below the 80% target. No percentage increase is claimed solely from tests. Current approval boundaries leave persistent user styles (schema/migration), reference URL/library persistence, internet search/services, OCR and model download unimplemented; complex table/multicolumn reconstruction also remains. Real customer PDFs and a buyer PC have not been accepted.
- No OCR, paid API, external service, model download, storage schema change, merge, deployment or sale. The earlier isolated checkout `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-work-continued` still has uncommitted changes/local-only history and must be preserved. The newer clean worktree is `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-remote-current`.

## 2026-10-29 — STEP5 PDF typography proposal (verified code `c160e36`)

- Branch `integration/astra-commercial-core` code SHA `c160e3667fc249995daf1b00d8338a0dacd2b7cd`; Draft PR #9 remains open and unmerged.
- STEP5 now uses the selected PDF page's embedded median font size normalized by page width to suggest a small/medium/large editable body size. When the PDF has no selectable text (including scans), the existing pixel-density proposal is retained. OCR is not used. User can adjust the preview and apply or cancel it.
- Installed Windows acceptance verifies the actual PDF analysis UI and proposal selection, full IndexedDB V2 record equality through analysis and cancel, and the rest of the installed PDF/design/upgrade regression. Exact-SHA Windows [#40847149721](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40847149721) and Chrome/Edge [#40847149615](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40847149615) SUCCESS.
- Local `npm test` 88/88 PASS, production build PASS, `desktop:verify` 16/16 PASS, acceptance helper syntax and whitespace checks PASS. Native Electron GUI was not directly run locally; hosted Windows installed-app E2E passed.
- Roadmap remains approximately 52%, below the requested 80%. This is a small STEP5 feature increment, not a test-count uplift. STEP3 real user PDFs (5–10) and buyer PC acceptance remain unverified; STEP4 durable custom style save/reuse needs schema approval; STEP5 URL input and STEP6 search are external service work outside current approval; STEP7 OCR is excluded.
- No OCR, paid API, model download, schema change, merge, deployment or sale. Original local project and user data remain untouched. Isolated working clone retained pending explicit approval because automatic review rejected its deletion due divergent local history.

## 2026-10-29 — STEP3/4 continuation closeout (verified code `602c0a4`)

- Branch `integration/astra-commercial-core` HEAD `602c0a410b7f2146717569b39019b152b51e2b8d`; Draft PR #9 remains open and unmerged.
- STEP3 retains short Korean source fragments for omission matching. Windows acceptance covers cancel, reselect, a late PDF response after switching documents, no stale URL/draft, and identical V2 stores before/after reload.
- STEP4 compares saved and candidate A4 previews side by side. Print output contains only the candidate once; actual Windows Electron audit found 2 A4 pages, both fixture markers, and the expected raster image. Apply/undo restored the exact prior design and content.
- Exact-SHA Chrome+Edge workflow [#40843605820](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40843605820) SUCCESS; Windows installer workflow [#40843605882](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40843605882) SUCCESS, including 8/8 A4 layouts, M09-D, install/uninstall, and 0.1.0→0.1.1 document/image preservation.
- Local Node tests 87/87 PASS; TypeScript/Vite build PASS; `desktop:verify` 15/15 PASS; helper syntax/whitespace checks PASS. Local Electron binary launch was SKIP: Electron's binary fetch failed in this network-restricted environment. Hosted Windows acceptance passed.
- Reassessment: approximately 52% across the original seven steps; the 80% goal is not met. No increase is attributed to test quantity. User PDF variety, custom saved design library, URL/search references, customer machine acceptance and production hardening remain.
- No OCR, paid/external API, model download, schema migration, merge, deployment, or sale. Original local project remains untouched.

# STATUS — Astra PDF Redesigner
## Historical record — STEP3 source omission recovery (`b640c3f`)

- Current branch: `integration/astra-commercial-core`; code/test SHA `b640c3fc1e654edccd5c4234fa31810e0105e993`; PR #9 remains Draft/open/unmerged. Source restore began at `4a7094c`; current source omission features are `df4e473`, `d3a7d17`, `4d4349e`, `484d43f`, and `d4f2ecd`.
- STEP3 missing-text warnings link each missing PDF.js text item to its estimated source-page location and let the user add that exact source text as an editable manual block. Adding it revokes prior review consent and participates in undo/redo. Transient source coordinates and the extracted-text baseline are excluded from project conversion.
- Omission lists progressively reveal items in groups of 12. Short numeric fragments remain in the comparison, and number-only snippets use token boundaries and occurrence counts; an omitted `7` is not satisfied by `7.5%` or `112`.
- Local verification at `d4f2ecd`: `npm test` 86/86 PASS, `npm run build` PASS, `npm run desktop:verify` 15/15 PASS, targeted STEP3 structure tests 14/14 PASS, syntax and whitespace checks PASS. Focused synthetic-PDF UI E2E passed Chrome and Edge for source-location highlighting, exact manual recovery, consent revocation and no premature document save.
- Installed Windows acceptance exercises missing-text source location/recovery before manual correction and native PDF output. Latest exact-SHA workflows are in progress; run #40838475306 SUCCESS. Earlier feature SHA `d4f2ecd`: Windows #40837315265 and Chrome+Edge #40837315314 SUCCESS. Numeric browser regression had a damaged first API blob on `29b2c7d`; restored the test source in `b640c3f`. Exact-SHA Chrome+Edge #40838475198 and Windows #40838475306 SUCCESS. No direct Windows Electron GUI session was run locally.
- Broad `tests/step3-browser.mjs` direct local run remains unverified because Windows Poppler `pdfimages` is unavailable. Use hosted exact-SHA CI for the full workflow; this environment limitation is not a product test failure.
- Prior exact-SHA `4062db8` Chrome+Edge #40832419890 and Windows #40832419764 both completed SUCCESS. These cover the earlier output-count fix, not the source-restore feature.
- Earlier STEP3 live source parity and Electron PDF structural/text/raster output audit remain as described below. STEP4 comparison/apply/undo and all 8 built-in designs remain schema-compatible with prior exact-SHA installed Windows and browser evidence.
- Reassessed seven-step completeness remains approximately **51%**, not 80%; no completion increase is claimed for test quantity. STEP4 persistent user presets require the prohibited schema/migration change; STEP5 URL/persistent reference library and STEP6 internet search/external integration remain outside authorization. Actual customer PDFs and a physical buyer PC remain unverified. No OCR, model download, paid service, merge, deployment, or sale.

## 2026-10-29 — STEP3 live source parity + STEP7 exported PDF audit (historical `2726b57`)

- STEP3 retains transient PDF.js text items for each import review page. The live warning compares them with currently included editable blocks, identifies missing text excerpts, and updates as the user edits, excludes/re-includes, or adds manual blocks. Undo/redo remains covered by the same page review flow. This is embedded-text comparison only; no OCR or persistence change.
- Electron STEP2/4 PDF save now compares actual PDF text markers and raster image draw count with the editor's text markers and image block count before Save As. Warnings allow cancel or continue. It does not claim visual or per-image identity.
- Feature commits: `cab4461` image omission warning, `6f6b960` compare raster draw count to all image blocks, `78c6aec` live editable-block omission warning and manual-recovery browser regression, `de12f06` linear-time matcher, `e76b16f` retain single-digit source number warnings, `2726b57` trie type fix.
- Latest local verification at `2726b57`: Node **83/83 PASS**, TypeScript/Vite build PASS, `desktop:verify` **15/15 PASS**, browser script syntax PASS. An earlier recheck of `e76b16f` exposed a matcher type syntax error; fixed at `2726b57`, then the full local checks passed. Exact-SHA Chrome/Edge workflow #40831300535 and Windows installer #40831300540 were in progress at last check. No local Windows desktop GUI run.
- Reassessed seven-step estimate is approximately **51%**; 80% not achieved. STEP5 now counts as partial for local image/PDF reference analysis and reversible design preview. STEP6 and OCR remain approval-gated; STEP4 persistent style reuse is blocked by the explicit schema-change restriction; customer PDFs/physical buyer PC acceptance are unavailable here. No merge, release, or deployment.

## 2026-10-29 — STEP7 Electron PDF output preflight

- Electron export reopens generated PDF with bundled PDF.js before showing Save As. It checks A4 page boxes, text bounds, rotated text that could not be checked, and pages with neither selectable text nor raster content. Findings open a continue-save/cancel warning; no file is written until the user continues and chooses a path. Browser print flow is unchanged.
- STEP2 also sends transient markers sampled from each visible title, section, text block and image caption. PDF.js counts these in the generated bytes; missing markers trigger the same warning so users can cancel or inspect the output. Full project text is not copied over IPC, and no content is persisted by the audit.
- STEP2 also indicates whether the visible project contains any image. If it does and the exported PDF has no raster paint operations, the same warning asks the user to verify the image output; it does not claim to count every image placement.
- The Windows installed synthetic PDF acceptance calls the same audit and requires actual two-page A4 text/raster output to pass. Local regression mutates actual synthetic PDF bytes to prove non-A4 and out-of-bounds warnings.
- Local verification: `npm test` 81/81 PASS, build PASS, `desktop:verify` 15/15 PASS, main/preload/audit syntax and diff checks PASS. The STEP5 Chrome/Edge runner profile cleanup now retries on transient Windows/Linux directory locks and emits a warning instead of masking completed assertions.
- CI evidence from SHA `7c098fb`: Windows run #40829254809 SUCCESS; Linux Chrome and Edge failed only during temporary STEP5 Chromium profile cleanup (`ENOTEMPTY`) after functional assertions passed. Latest SHA `ca80360` exact-SHA Chrome/Edge and Windows runs #40829833872/#40829833841 were queued at last check.
- No OCR, external service, model or persistence change. Roadmap estimate remains ~48%; 80% not achieved.

## 2026-10-29 — STEP3 extraction quality signals and STEP5 local reference analysis

- Implemented an in-memory, local-only raster analysis flow: PNG/JPEG/WebP up to 10 MiB and 20 MP, or PDF up to 30 MiB / 50 pages with selectable page. Measures approximate whitespace, visual density and margins; maps salient colors to the existing palette and suggests an existing theme/text size. Font remains a user choice. This is heuristic pixel analysis, not OCR or semantic/text/font recognition.
- The user can edit supported existing `DesignSettings`, preview on the current A4 document, apply, cancel or undo. Source image/PDF bytes and analysis are not persisted; existing content and V2 schema remain unchanged. No network/API/model usage.
- For PDF pages with embedded selectable text, also estimate median font size, largest-fragment/median size ratio and the largest fragment's alignment. This reads PDF text operators only; scanned pixels remain unrecognized and the UI states that OCR is not performed.
- Added synthetic pixel tests and Chrome UI regression for local image analysis, PDF page 2 selection, preview/cancel/apply/undo and exact content preservation.
- Local evidence at the first feature SHA: `npm test` 71/71 PASS; build PASS; desktop verify 14/14 PASS. At the typography extension: `npm test` 73/73 PASS, build PASS, browser-script syntax/diff check PASS; dedicated `tests/step5-reference-browser.mjs` **Chrome PASS and Edge PASS** (local raster, two-page PDF selectable-text metrics and OCR disclosure, A4 PDF generation, preview/cancel/apply/undo and content preservation). Broader pre-existing `step2-browser.mjs` was not rerun to completion locally because Poppler's `pdftotext` executable is unavailable. Exact-SHA CI for first feature `dab6d9ae0c4401e8e19284a3811f6d6e1a688ba6` is running; Windows exact-SHA not yet confirmed.
- STEP3 follow-up: each page flags replacement/private-use glyphs and text fragments outside page bounds, with a page-local warning and character count; source text remains editable for correction. No persisted schema change. Local evidence: `npm test` 74/74 PASS, build PASS, desktop verify 14/14 PASS.
- Functional commits: `dab6d9ae0c4401e8e19284a3811f6d6e1a688ba6` (image/PDF analysis), `b0222e97bb96dd92e376bebe23c73d87081f4ab0` (embedded PDF typography), `1b178a60fec1d14beafe27b0e6a8a9eff3db91e3` (STEP3 quality signals), and `7c098fb1e923e0990ed50084b07568e7357a85d3` (Electron output preflight). Current marker comparison and test-cleanup fix are pending their functional commit. Main and original local project untouched. Roadmap estimate ~48% (STEP5 remains partial); 80% not achieved. Exact-SHA CI continues asynchronously; continue with next independent gaps without idle waiting.

## 2026-10-29 — Windows user-data upgrade regression rerun

- Latest code SHA `12213f89381ad2f90102f4db1e4fbb4e9a283edb`; added failure diagnostics around installed STEP2 renderer evaluation without changing app behavior or persistence.
- Windows CI [#40824530246](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40824530246) exact-SHA **SUCCESS**. STEP2 baseline 0.1.0 data generation and PDF audit PASS; in-place 0.1.0→0.1.1 upgrade retained document+PNG; upgraded uninstall PASS. The prior run #40823559986 failed once at the same baseline generation with an unhelpful Electron `{}` error and did not reproduce.
- Same run also passed installed STEP3 PDF import/manual recovery/source comparison/native A4 export, STEP4 comparison/apply/undo and 8/8 layout PDF audit, and M09-D cancel/reselect/stale-result/V2-store regression.
- Local validation of the diagnostic-only change: Node 68/68 tests PASS, build PASS, desktop verify 14/14 PASS, script syntax/diff checks PASS. Full Windows workflow exact-SHA now green; actual customer PDFs and physical print acceptance remain unverified.

## 2026-10-29 — STEP3 Electron 원본 Blob 렌더 수정

- 기능 SHA `a9404c0743470147dc7cd9228e629787f9ae347f` (`integration/astra-commercial-core`, PR #9 Draft/unmerged). 사용자 데이터·V2 schema·8개 디자인 불변.
- 원인: Windows installed acceptance 진단에서 Electron `astra:` renderer의 Blob URL `fetch()`가 `Failed to fetch`로 실패해 source canvas가 비어 있었다. STEP3 원본 검수 및 STEP2 원본 대조에 세션 메모리의 원본 `Blob`을 PDF.js에 직접 전달한다. Blob을 IndexedDB/schema에 기록하지 않는다.
- 로컬 검증: `npm test` 68/68 PASS, `npm run build` PASS, `npm run desktop:verify` 14/14 PASS, `node --check desktop/step3-project-acceptance.cjs`와 `git diff --check` PASS. `npm run desktop:smoke`는 Electron 바이너리 다운로드 `fetch failed`로 SKIP.
- CI: `a9404c0` Windows #40823559986의 설치형 STEP3 가져오기·원본 대조·수동 복구 텍스트의 A4 native PDF 출력 PASS. 같은 exact-SHA에서 STEP4 동일 문서 비교/적용/undo, 기존 디자인 8종 PDF 8/8, M09-D 취소/재선택/late-result 무시도 PASS. Chrome/Edge #40823560131 SUCCESS. 전체 Windows run은 이후 별도 0.1.0→0.1.1 upgrade baseline 생성 시 Electron startup failure `{}`로 FAIL; STEP3/4 설치 수용 단계는 완료됐다.
- 실제 사용자 PDF/물리 인쇄 및 로컬 Windows GUI 미검증. 7단계 완료율 약 45%; 복잡 PDF 수용이 남고, STEP5 미구현·STEP6 승인대기·STEP7 부분. 80% 미달, 출시/판매 NO-GO.

## 2026-10-29 — STEP3 복구·원본 대조 기능 확장

- 최신 코드 SHA `ef4eb63df686157196a96079df0680f701bedc6c` (`integration/astra-commercial-core`, PR #9 Draft/unmerged). 기존 사용자 저장 데이터와 V2 스키마, 원본 roadmap, STEP4 8개 디자인은 변경하지 않았다.
- 이번 기능: 추출 텍스트/복원 이미지에서 원본 페이지와 추정 위치로 이동, 원본 패널 자동 노출 및 대조 문맥(텍스트/이미지) 표시, 누락 텍스트 수동 추가·수정·삭제·정렬·실행취소/다시실행, 빈 블록 저장 방지와 수정 후 동의 재확인. Windows 설치 앱 회귀는 이를 통해 만든 텍스트가 저장된 프로젝트 미리보기 및 native A4 PDF에 실제 나타나는지 확인하도록 확장했다.
- 결함 수정: STEP3 브라우저/설치형 검수가 React 수동 블록 렌더 이전 DOM을 조회하던 테스트 경합을 렌더 대기 방식으로 고침. PDF.js 원본 위치를 빠르게 재선택할 때 취소된 렌더와 새 렌더가 canvas를 동시에 사용하는 충돌을 직렬화해 방지.
- 로컬 검증: 최신 소스 기준 `npm test` 68/68 PASS, `npm run build` PASS, `npm run desktop:verify` 14/14 PASS (`ef4eb63` 소스 변경 후 test/build/diff-check PASS). TypeScript/Vite의 기존 동적/정적 import 청크 경고만 출력.
- CI: `ef4eb63` exact-SHA Chrome/Edge #40822093641 SUCCESS. Browser logs confirm source text/image jumps, missing-text recovery, undo/redo, theme/reload/A4 output, cancellation, retry, and late response handling all pass. Windows #40822093651 and latest code `f8cb21c` #40822208336 both FAILED at installed STEP3 source text location timeout. Same timeout appeared at `a850518` #40821833694; earlier Windows #40820434701 and #40821335099 passed. Latest browser #40822208266 and `1878a6d` browser #40822018994 completed SUCCESS; Windows #40822018950 FAILED at the same installed source-location timeout. `a850518` browser #40821833788 also completed SUCCESS. Browser manual recovery #40821335082 failed due missing React render wait (fixed in `a850518`); source text run #40820434613 and Windows #40820434701 passed.
- 직접 Windows UI: 로컬 Chrome DevTools WebSocket 연결 및 Electron smoke가 실행 환경에서 실패해 미검증. Windows hosted CI에서 설치/빌드/packaged smoke는 통과했으나 installed STEP3 source-location 렌더는 #40821833694, #40822018950, #40822093651, #40822208336에서 timeout되어 미검증. 사용자 PC의 실제 문서 5–10건·물리 인쇄/구매자 PC 검수도 미검증. Computer Use는 브라우저 URL 식별 정책으로 중단되어 재시도하지 않았다.
- 전체 7단계 완료율 **약 45% 재평가**: STEP3는 복구·원본 비교 기능이 늘었으나 다단/표·복잡한 PDF 및 실제 고객 문서 수용이 남고, STEP4는 비교·적용·취소가 구현되어도 저장형 사용자 프리셋은 승인/스키마 대기, STEP5 미구현, STEP6 승인대기, STEP7 부분이다. STEP3의 수동 누락 복구와 원본 위치 대조가 브라우저에서 실제로 통합되어 약 1%p만 반영했다. 반복 Windows installed source-location timeout과 고객 PDF 수용 미검증으로 80%에는 크게 미달한다. 출시/판매 판단은 NO-GO.

## 2026-10-29 — STEP3 원본 위치 연결 보강

- 최신 브랜치 코드 SHA `9ade72efb957d4399a2d184f1aafc39472b576dd` (`integration/astra-commercial-core`, PR #9 Draft, 미병합). 기존 원본 PDF·V2 저장 구조·8개 디자인은 변경하지 않았다.
- 기능: STEP3 검수의 각 텍스트 블록에서 `원본 위치 보기`를 누르면 실제 PDF.js 원본 페이지를 렌더하고 추정 출처 좌표를 강조한다. 기존 원본 파일 Blob URL 수명과 취소/확정 흐름을 재사용한다.
- 로컬 Windows 검증: `npm test` 67/67 PASS, `npm run build` PASS, `npm run desktop:verify` 14/14 PASS, `git diff --check` PASS (`core.whitespace=cr-at-eol`).
- 미검증/실패: Chrome STEP3 E2E는 Windows Chrome의 DevTools WebSocket 시작 실패로 테스트 페이지 진입 전 종료. `npm run desktop:smoke`는 Electron 바이너리 설치 후 종료 코드 1(추가 로그 없음). 따라서 Windows 앱 상호작용은 이번 SHA에서 미검증. GitHub exact-SHA CI #40820434613 (Chrome/Edge) 및 #40820434701 (Windows installer)은 실행 중이며 아직 결과로 기록하지 않는다.
- 전체 7단계 완성률은 **약 44% 유지**. STEP3/4는 여전히 부분이며 이 보강 하나만으로 단계 완성률을 올리지 않는다. STEP5 미구현, STEP6 승인대기, STEP7 부분. 고객 PDF 5–10건과 구매자 PC 인수검수는 미검증.

- 저장소: `hibi89/astra_pdf_redesigner` / `integration/astra-commercial-core` (Draft PR #9, main 미변경)
- 승인 범위: STEP3 PDF 가져오기는 기존 승인 범위이며, 사용자가 STEP4 디자인 비교·적용·취소 개발도 승인했다. OCR은 별도 승인 전 제외한다. 저장형 사용자 스타일 라이브러리/스키마 변경은 승인 전 구현하지 않는다.
- 제품 상태: STEP1·2 완료, STEP3·4·7 부분, STEP5 미구현, STEP6 승인대기. 최초 7단계 추정 약 44% (STEP1·2=2.0, STEP3=.33, STEP4=.45, STEP7=.33, 합계 3.11/7); 판매/Production NO-GO.
- 최신 기능·테스트 SHA: `273db07ae851e8d2420da39688b5fa84641ce65d` (STEP4 같은 문서 8개 레이아웃 임시 비교, 적용/취소, 기존 디자인 컨트롤 동기화).
- Exact-SHA Chrome+Edge [#40486509235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509235): SUCCESS 2/2, Node 22 `npm test` 67/67 PASS, `npm run build` PASS. 실제 브라우저 A4 PDF의 텍스트·이미지·페이지 및 비교 미리보기/적용 PDF 레이아웃 동등성을 확인했다.
- Exact-SHA Windows NSIS [#40486509335](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509335): SUCCESS. 설치 앱 STEP4 임시 비교 PDF·적용·취소, 기존 8개 A4 PDF 8/8, M09-D, 설치/제거 및 0.1.0→0.1.1 STEP2 데이터 보존을 확인했다.
- 미검증: 동의된 실제 PDF 5–10개 사용자 PC 비교, 구매자 물리 Windows PC GUI/인쇄 수용. CI PDF는 synthetic fixture만 사용했다.
- main, PR #3/#4, 사용자 데이터, 배포 설정은 변경·병합하지 않음. 외부 전송·OCR·모델 다운로드·유료 서비스·merge·배포 없음.

## 과거 기록 — 2026-10-27 16:51 KST
- 저장소 `hibi89/astra_pdf_redesigner`, 검증 브랜치 `integration/astra-commercial-core`, Draft PR #9 미병합. 기능·테스트 SHA `1099b794f32da3e0bc467898e12b0ee7e7e71146`.
- 이번 테스트 보강: 프로젝트 JSON 내보내기의 원문과 네 디자인 설정 일치, 잘못된 JSON 가져오기 시 활성 문서 무변경, 올바른 가져오기의 디자인 설정 유지, 가져온 복사본 삭제 뒤 원본 보존을 확인하도록 테스트를 강화했다.
- 로컬 exact-SHA 검증: `npm test` 61/61 PASS, `npm run build` PASS, `node --check tests/step2-browser.mjs` PASS, `git diff --check` PASS.
- GitHub exact-SHA: Edge job [#122069789553](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551454/job/122069789553) SUCCESS; `PASS STEP2: portable project JSON includes exact text and image bytes`, `PASS STEP2: JSON import, invalid import rejection, independent copy survives delete` 확인. Windows NSIS run [#40468551485](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551485) SUCCESS; `PASS M09-D WINDOWS INSTALLED UI`, STEP2 프로필 재실행 보존, 0.1.0→0.1.1 업그레이드 보존 및 설치기 업로드 확인.
- Chrome job `#122069789889`은 17:04 KST `completed/success`. exact-SHA Chrome smoke에서 `PASS STEP2: portable project JSON includes exact text and image bytes`, `PASS STEP2: JSON import, invalid import rejection, independent copy survives delete`, 실제 Chrome A4/PDF 검사와 M09-A/B/C 회귀 마커를 확인했다. Chrome+Edge run `#40468551454` 2/2 성공.
- 후속 조회 16:58 KST에도 Chrome 폰트 단계는 실행 중이었다. 로컬 `git push`/`git fetch`는 `Could not resolve host: github.com`으로 실패했으나 GitHub 연결을 통해 문서와 PR은 원격 반영했다. 로컬 문서 커밋 `b72d0dc2bd051562775cd65bde82b1ae529ab088`은 16:58 KST 원격 PR HEAD `836c95f6b2ca9f927070089511b66ae8e56a3d0c`와 서로 다른 ancestry이므로, DNS가 복구되기 전 로컬 커밋을 PR 브랜치에 직접 push하지 않는다.
- 합성 데이터만 사용. 고객 PDF, 외부 모델 다운로드, 유료 서비스, 배포·병합 없음. 전체 7단계 약 43%, 판매 및 public production NO-GO.

## 완료 기능
- 회고록 제목, 선택 작성자, 로컬 오늘 기본 작성일, 4개 본문 항목 실시간 편집.
- 서로 다른 레이아웃 3개(깔끔한 보고서, 미니멀 노트, 학습 다이어리), 포인트 색상 6개, 고딕/명조, 크기 3개.
- 원문 문단 및 숫자 유지, 빈 본문 섹션·빈 작성자 숨김.
- 동일 React 문서 렌더러를 미리보기와 인쇄에 사용, A4 인쇄 CSS, `window.print()`, 다중 페이지.
- `localStorage` `schemaVersion: 1` 자동 저장·복원, 손상 데이터 처리, 경고, 확인 후 예시·초기화.
- 원본 설계 PNG 2개 및 사용자가 제공한 텍스트 로드맵을 `docs/`에 원본 보존.

## 실제 수행한 테스트
- 로컬 Node.js 22.16: `npm test` **5/5 PASS** (데이터 모델/저장 파서), `npm install`은 해당 실행 환경의 DNS `EAI_AGAIN`으로 불가. 로컬 npm 빌드·브라우저 실행은 미수행.
- GitHub Actions Ubuntu Node.js 22: `npm install --no-audit --no-fund` PASS, `npm test` **5/5 PASS**, `npm run build` PASS.
- 실제 Linux Chrome headless: React 렌더링 PASS, 빈 섹션·작성자 숨김 PASS, 입력/줄바꿈·테마 변경·새로고침 복원 PASS, 초기화·손상 저장 데이터 회복 PASS, 긴 URL 넘침 검사 PASS.
- Chrome `Page.printToPDF` 및 Poppler 검사: **A4 PDF 15페이지 생성**, 처음/마지막 마커 텍스트 추출 PASS, 편집기 UI 제외 PASS.
- 원본 두 PNG 및 로드맵 Git blob SHA 로컬/원격 일치 검증 완료.

## 미검증·제약
- 사용자 Windows Chrome/Edge 인쇄 대화상자의 PDF로 저장, 브라우저 머리글·바닥글/배경 옵션 및 실제 한글 글꼴의 선택 품질: **수동 검증 필요**.
- 국비학원 사이트에서 PDF 첨부 제출 가능 여부 확인 필요(자동 제출 범위 제외).
- 실제 OS별 글꼴과 인쇄 페이지 나눔은 달라질 수 있음.
- STEP 2의 **블록 모델 및 STEP 1 비파괴 변환기만 구현**; 블록 편집 UI·이미지 저장·다중 문서·내보내기는 미구현. STEP 3~7의 기존 PDF 가져오기/OCR/AI/검색/설치형은 미구현.

## 다음 작업
1. STEP 2에서 블록 편집과 이미지·여러 문서의 지속 저장 구현. STEP 1 v1 저장 데이터는 기존 키를 변경·삭제하지 않고 읽기/변환한다.
2. 로컬 이미지 업로드 후 PDF 출력 검증, 프로젝트 내보내기/가져오기 복원 확인.
3. 사용자 Windows Chrome/Edge의 실제 인쇄·한글 선택 검수는 여전히 필요.

- 기준 검증 시점: 2026-10-18 21:39:37 KST

- CI 안정화 보완: 새로고침 완료 이벤트 명시 대기 및 문서만 변경된 커밋에서는 CI 실행 생략; 최신 코드/워크플로 HEAD `639b5e984e8ba711674a3b3d29fc6baf881a14d1`, 검증 run `39128155552`.

## 2026-10-18 STEP 2 착수·첫 단위 (추가 기록)
- 사용자 확정: 최종 목표는 **기존 PDF 콘텐츠를 보존한 디자인 리디자인**, 아스트라 단계 순서 유지.
- 선택 설계: 순서 있는 제목/문단/이미지 블록 모델. 대안 비교 및 제약은 `docs/STEP2_DESIGN_DECISION_2026-10-18.md`.
- 구현: `src/step2/model.ts` (블록·프로젝트/컬렉션 타입, STEP 1 데이터 변환, 순서 변경, 런타임 검사), `tests/step2-model.test.ts`.
- STEP 1 UI·`src/storage.ts`·localStorage v1 키 **미변경**. 신규 모델만 분리해 추가.
- 로컬 Node 22 `npm test` **9/9 PASS** (기존 5 + 신규 4). 로컬 npm 설치/빌드는 DNS 장애로 미검증.
- GitHub PR [#1](https://github.com/hibi89/astra_pdf_redesigner/pull/1) squash merge → **기능 SHA `5eb2b8d5db89f69a2a61254ddd79651d1226ad56`**, main.
- GitHub Actions [#39129894290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39129894290) `success` (2026-10-18 22:04:29 KST 재조회 기준): 설치, 9개 단위 테스트, TypeScript/Vite 빌드, Chrome 인쇄 스모크 (워크플로 내 실행 검증).
- **남은 작업:** STEP 2 UI·IndexedDB 이미지 저장·문서 관리·내보내기/가져오기·사용자 Windows 검수. STEP 2 완성 아님.

## STEP 2 상세 지침 반영 및 기능 브랜치 구현 중 (2026-10-18 22:39:17 KST)
- 사용자 제공 STEP 2 지침 원문을 `feature/step2-full-20261018`의 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt`에 변경 없이 보존.
- 기능 브랜치 최신 확인 SHA `ebb5861cbc795286c1aa1d9ea1321fb46f261ffb`. 코드 구현: V2 섹션·블록 모델, IndexedDB(문서·자산·메타), 안전 마이그레이션, 문서함, 이미지 검증/편집, 프로젝트 JSON 내보내기·가져오기, 추가 컴팩트 테마, Chrome 브라우저 테스트 코드.
- 로컬 Node 22 `npm test` **14/14 PASS**, 전역 TypeScript로 순수 모델/저장 모듈 정적 타입검사 PASS, JSX 구문 검사 PASS. **전체 React/Vite 빌드·STEP 2 Chrome IndexedDB/인쇄 실제 테스트는 미검증**.
- CI 두 차례 `39131861115`, `39132088786`: 러너 미배정, `steps=[]`, 약 2초 뒤 종료. 테스트 실행 전 실패로 앱 오류 여부 불명. 동일 시도 반복 중단. 로컬 npm offline도 ENOTCACHED, 온라인 DNS EAI_AGAIN.
- **main은 STEP 1 검증 소스 유지**. STEP 2 기능 브랜치 코드는 빌드/실브라우저 검증 후에만 main 병합. 문서 원본 v1 자동 삭제·덮어쓰기 없음.
- 다음 작업: GitHub Actions runner 복구/다른 인터넷 가능한 환경에서 `npm install && npm run build` 및 `tests/browser-smoke.mjs`·`tests/step2-browser.mjs` 실행 → 실패 코드 수정 → 병합/문서 갱신.
- 세부 기록: feature 브랜치의 `docs/STEP2_IMPLEMENTATION_STATUS_2026-10-18.md`.


## STEP 2 통합 자동 검증 완료 — 2026-10-18 23:38:59 KST
- 저장소 공개 여부 재조회: **Public**. GitHub Actions 러너 미배정 상태 이후, 과거 run `39132721985` 재실행(시도 2)에서 실제 Node/빌드까지 진행됨. 설치/테스트 PASS 후 `Workspace.tsx` TS 오류 8건 발견.
- 기능 브랜치 `feature/step2-full-20261018`에서 이미지 블록 분기 타입 좁히기·미사용 import 제거 (`59628b9c3bb7a704f7b7079626b562dd1338c2ab`).
- 이후 Chrome 테스트 PNG fixture가 잘못된 IDAT CRC를 포함한 사실 확인. **테스트 자산만** 올바른 2×2 PNG로 교체 (`caa0747a5b6967393e05b1b704fe0aa5b3f6aa24`).
- [GitHub Actions #39136882566](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39136882566): **success**. Node 22 단위 **14/14 PASS**, TypeScript/Vite 빌드 PASS, 실제 Chrome 기존 STEP 1 회귀 PASS 및 A4 PDF 15페이지/텍스트 추출 PASS, STEP 2 IndexedDB 저장·복원·섹션 순서·PNG 이미지/Blob 복원·JSON 백업/가져오기·이미지 포함 A4 PDF 스모크 PASS.
- 아직 **사용자 Windows Chrome/Edge 출력, JPEG/WebP 및 가로·세로 대형 이미지, 길고 복잡한 캡션, 멀티탭 충돌, 빠른 저장 경쟁 및 실패 복구는 미검증**. STEP 2 최종 수용 전 추가 검수 필요.
- **main에는 STEP 2 기능 미병합**. 이 커밋은 문서 상태 변경만 수행. Production/Vercel 미적용(로컬 앱).
- 다음 `ㄱ`: 자동 CI로 발견되지 않는 저장 경쟁/이미지 유형·페이지 나눔 보강 검증을 1단위 진행하고, 충분히 통과한 뒤 main 병합을 판단한다.

## STEP 2 저장 경쟁 방어 — 2026-10-18 23:47:43 KST
- 작업 범위 **1단위**: 동시에 들어오는 문서 전환·생성·복제·삭제·이미지 작업의 중복 실행 거부. 변경 동작 중 편집 폼 비활성화, 실패 후 잠금 해제. 기존 STEP 1 화면·저장 데이터 미수정.
- 기능 브랜치 `feature/step2-full-20261018`, 검증 코드 SHA `44d7be92f04be8ff4e1effeb9c16f271069cfe46`. 신규 `src/step2/mutationGate.ts`; `src/step2/useWorkspace.ts`, `src/step2/Workspace.tsx`, `tests/step2-mutation.test.ts`, `tests/step2-browser.mjs`.
- [GitHub Actions #39137537886](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39137537886): **success**, Node 단위 **16/16 PASS**, TypeScript/Vite **빌드 PASS**, Chrome **동일 이벤트 루프 내 두 문서 전환 요청 중복 방어**·원본 본문/활성 문서 새로고침 복원 PASS. STEP 1 Chrome A4 15페이지 및 STEP 2 이미지·JSON 입출력 회귀 PASS.
- **여전히 미검증:** JPEG/WebP, 가로/세로 대형 이미지·긴 캡션 인쇄, 멀티탭 충돌, 저장소 오류/할당량 실패 주입, 사용자 Windows/Edge 수동 출력 검수. 위 테스트는 특정 전환 경쟁 1종의 성공이며 모든 경쟁 조건을 증명하지 않음.
- **main 기능 미병합**, Production/Vercel 미적용. 다음 `ㄱ`: 미검증 JPEG/WebP·이미지 출력 경계 또는 저장 실패 복구 중 1단위 추가 검증 후 main 병합 판단.

## STEP 2 JPEG/WebP 검증 완료 — 2026-10-18 23:59:02 KST
- 대상: `feature/step2-full-20261018` 기능 SHA `fa459db3317026190c85f690e5744950ed3b4da1`. 이번 단위는 앱 소스 변경 없이 **실제 Chrome 테스트 `tests/step2-browser.mjs`만 확장**.
- Chrome Canvas로 만든 개인정보 없는 테스트 이미지 사용: **가로형 JPEG 32×16**, **세로형 WebP 16×32**. 실제 입력 업로드 → 디코딩 → IndexedDB 저장 → 새로고침 후 두 이미지 원래 치수 복원 PASS.
- JSON 내보내기 Blob에서 MIME·가로세로·Base64 바이트를 확인하여 **JPEG/WebP 원본 파일 바이트 1:1 보존 PASS**. 기존 PNG 포함 A4 PDF에서 `pdfimages -list` 이미지 3개 이상 포함 PASS. PDF 형식 A4·본문 텍스트 검사 PASS.
- [GitHub Actions run 39138352449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39138352449) **success**. `npm test` **16/16 PASS**, `npm run build` PASS, STEP 1 Chrome PDF 15페이지 및 기존 STEP 2 회귀 PASS.
- 과정 중 두 번 실패한 E2E(`39138141905`, `39138228608`)는 **두 번째 동일 이름 JSON 다운로드 파일 탐색 시간 초과**. 실제 업로드/복원은 통과. 브라우저 반복 다운로드 파일명/허용 정책에 의존하지 않고 다운로드 직전 생성한 JSON Blob을 확인하도록 테스트를 수정하여 최종 PASS.
- 미검증: 큰 이미지·긴 캡션에서 실제 시각적 잘림, 여러 이미지 페이지 경계, 멀티탭 충돌, 저장 공간 부족/오류 복구, 사용자 Windows Chrome/Edge 출력. PDF 내 이미지 **포함**을 검증했으며 픽셀 단위 동일 배치를 검증한 것은 아님.
- **STEP 2 전체 최종 수용 및 main 기능 병합 대기**. STEP 3 미착수, Production 미적용. 다음 `ㄱ`: 저장 오류·IndexedDB 트랜잭션 실패 복구 또는 대형 이미지·캡션 출력 경계 중 1단위 집중 검증.


## 2026-10-19 00:10:27 KST — STEP 2 IndexedDB 저장 실패 복구 검증
- [GitHub Actions run 39139215112](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139215112): **success**, 기능 SHA `9339adb319a78192a0dda5ae437de248e9a056ca`, Node 22 단위 테스트 **16/16 PASS**, TypeScript/Vite 빌드 PASS, 실제 Chrome STEP 1 A4 PDF 15페이지 및 STEP 2 이미지/JSON/인쇄·문서 전환 회귀 PASS.
- 테스트에서 `IDBDatabase.prototype.transaction`을 1회 가로채 문서 `readwrite` 저장을 `QuotaExceededError`로 실패시킴. **실패 시 DB 원본 미변경·편집 중 최신 원문 메모리 유지·'저장 실패' 안내·beforeunload 이탈 경고 PASS**.
- 미저장 메모리 문서를 JSON으로 내보내 텍스트·첨부 이미지가 포함됨을 확인 PASS. '지금 저장 / 재시도' 후 DB에 최신 본문 반영·새로고침 복원 PASS.
- 발견한 UX 문제: 저장 재시도 성공 뒤 구식 오류 안내가 남을 위험. `src/step2/useWorkspace.ts`에서 저장 성공 시 오류 안내 지움; Chrome E2E에서 확인 PASS.
- 신규/수정 파일: `tests/step2-browser.mjs`(실제 브라우저 실패 주입), `src/step2/useWorkspace.ts`(성공 안내 보정). **STEP 1 localStorage 원본 불변**, main에 STEP 2 기능 미병합.
- **남은 위험:** 이미지 교체 트랜잭션 실패/부분 롤백 주입, 멀티탭 충돌, 큰 이미지·긴 캡션의 출력/페이지 분할·실제 Windows Chrome/Edge 수동 점검. 모든 IndexedDB 실패 유형을 검증한 것은 아님.
- **진행률 참고(비공식 추정):** STEP 2 요구기능 구현 대부분 완료, 자동 검증 기준 약 **85~90%**. 전체 7단계를 단순히 동일 비중으로 계산하면 **약 26~27%**이며 실제 개발 난이도별 가중 진행률은 아님. 유의미한 완료 기준 또는 약 5%p 이상 변화 시 사용자에게 재보고.
- 다음 1단위: 대형 이미지·긴 캡션의 A4 인쇄 경계, 또는 이미지 교체 트랜잭션 실패 주입·복구 추가 검증. 후속 검수 후 main 병합 판단. STEP 3 미착수.


## 2026-10-19 00:20:19 KST — STEP 2 이미지 교체 트랜잭션 원자성 확인
- 기능 브랜치 `feature/step2-full-20261018`, 검증 코드 SHA `154ff8d98aa97da311362c1e11ea78bac9db77d9`. 이번 1단위 작업은 **앱 코드 변경 없이 `tests/step2-browser.mjs`에 실제 Chrome IndexedDB fault-injection/복원 테스트만 추가**.
- 교체 대상 기존 이미지 3개의 참조 ID·원본 이미지 MIME/파일명/Base64 바이트를 기록. 새로운 PNG의 `assets.put()` 호출 직후 실제 IndexedDB readwrite 트랜잭션을 `abort()`시켜 문서 참조 변경/새 파일 저장/기존 파일 삭제 모두 원자적으로 롤백 PASS.
- 오류 알림 및 이전 미리보기 유지 PASS. 새로고침 후 기존 3개 이미지 참조·원본 bytes 1:1 보존 PASS. 주입 제거 후 교체 재시도 성공, 기존 교체 대상 asset 삭제·새 이미지 참조 연결·고아 자산 없음·새로고침 후 복원 PASS.
- [GitHub Actions run 39139965821](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139965821) **success**. 단위 16/16 PASS, TypeScript/Vite 빌드 PASS, Chrome STEP 1 A4 PDF 15p·STEP 2 JPEG/WebP/PNG/JSON/저장실패 회복/문서전환 기존 회귀 PASS.
- **미검증:** 장문 캡션과 대형 이미지가 여러 페이지를 가로지를 때 PDF 시각적 레이아웃, 실제 멀티탭 동시 편집 방지, 사용자 Windows/Edge 수동 인쇄. STEP 2 main 기능 미병합/STEP 3 미착수, Production 없음.
- 진행률: STEP 2 자동 검증 중심 **약 90% 수준**(이전 85~90% 대비 경계 검증 1개 추가). 7단계 **단순 동등 가중 기준 약 27%**, 변경 폭이 사용자 요청한 유의미한 5%p에 못 미쳐 별도 상승 알림 생략. 수치는 테스트 커버리지 측정값이 아닌 로드맵 추정.
- 다음 1단위: 대형 이미지·긴 캡션의 페이지 나눔 안전성 검사. 완료 기준 통과 후 STEP 2 main 병합 검토.


## 2026-10-19 00:29:24 KST — STEP 2 대형 이미지·긴 캡션 A4 인쇄 검증
- 브랜치 `feature/step2-full-20261018`, 자동 검증 기능 SHA `3173098c0df9d210cd8d762b28d09a36b5298f73`. 앱 코드/CSS/원본 자료 변경 **없음**. `tests/step2-browser.mjs`에 Chrome 실제 출력 테스트 1단위 추가.
- 합성 **1200×2500px** 세로 이미지와 페이지 경계 부근의 선행 문단 37줄을 생성해 A4 인쇄. 이미지·짧은 캡션이 같은 PDF 페이지에 포함되는지 페이지별 `pdftotext`와 `pdfimages -list`로 검사: **PASS**.
- 같은 이미지의 캡션을 190줄로 변경해 다시 인쇄. PDF가 추가 페이지로 확장되고 캡션 시작·끝과 처음·마지막 행 및 앞쪽 본문 표지가 누락/중복 없이 남는지 검사: **PASS**. `pdftotext -bbox-layout` 단어 좌표가 페이지 물리적 경계를 벗어나지 않는지 검사: **PASS**.
- [Actions run 39140653462](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39140653462) **success**, 단위 **16/16**, TypeScript/Vite build PASS, 기존 STEP 1 A4 PDF 15페이지 및 STEP 2 이미지/IndexedDB/JSON/실패 복구 회귀 PASS.
- **미검증:** 실제 출력물의 픽셀 수준 시각적 잘림/미세 겹침, Windows Chrome/Edge의 시스템 글꼴·인쇄 미리보기, 실제 다중 탭 Web Locks 충돌. 특정 합성 이미지/캡션의 Chrome PDF 검증이며 모든 레이아웃을 보장하지 않음.
- **다음 `ㄱ`: 실제 두 탭 동시 접근 충돌·잠금 해제 검증. STEP 2는 추정 **약 92%**, 전체 7단계 **단순 동일 비중 약 28%**, 기준 직전 약 27%에서 유의미한 5%p 상승은 아님. main STEP2 기능 미병합, STEP 3~7 미착수.


## 2026-10-19 00:36:17 KST — STEP 2 실제 Chrome 2탭 Web Locks 독점 편집 검증
- 검증 코드 SHA `3fe13c1097f63296d45c683f63ba0b95acd005a9`, 작업 브랜치 `feature/step2-full-20261018`. 앱 기능 코드 변경 **없음**. `tests/step2-multitab.mjs` 신규 및 `.github/workflows/ci.yml`에 검증 단계 추가.
- **같은 Chrome 브라우저 프로필·같은 origin**에 실제 두 탭 생성. 첫 탭의 `navigator.locks.query()`에서 `astra-pdf-redesigner-editor` 독점 잠금 1개 확인. 둘째 탭은 문서 목록·본문 편집 미개방, 읽기 전용 경고 노출·출력 버튼 비활성화, 첫 탭 원문 유지 PASS.
- 첫 탭 `Target.closeTarget` 닫기 → Web Lock 해제(보유 수 0) → 둘째 탭 새로고침으로 새로운 독점 잠금 획득, 기존 문서 내용 유지 PASS. 이어 둘째 탭에서 새 내용 수정·자동 저장·새로고침 복원 PASS. 구버전 데이터 덮어쓰기 없음.
- [GitHub Actions run 39141151527](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39141151527): **success**, Node 테스트 **16/16 PASS**, TypeScript/Vite 빌드 PASS, STEP1 A4 PDF 15p 및 기존 STEP2 JPEG/WebP·PNG·JSON/IndexedDB 실패 주입·인쇄 페이지 나눔 회귀 PASS. 멀티탭 3개 검사 PASS.
- **미검증/제약:** 잠금 미지원 브라우저의 실사용 동작, 강제 종료·OS 전원 장애, Windows Chrome/Edge 인쇄 및 한글 글꼴·PDF 육안 검수. 둘째 탭은 **첫 탭 종료 후 새로고침이 필요**하며 자동 편집권 승계 기능을 구현한 것이 아님.
- STEP2 개발/자동 검증은 **약 95% 비공식 추정**, 전체 7단계 단순 동일가중 환산 **약 28~29%**. 이전 전체 약 28% 대비 유의미한 5%p 증가는 아님. 테스트 커버리지 계량치가 아니며 실시간 일정/난이도 미반영.
- **main STEP2 기능 미병합**, Production/Vercel 없음. 다음 `ㄱ`: STEP2 최종 출시/병합 전 요구사항 대조·자동 증거 점검 후 GitHub PR 생성 여부 판단. 사용자 Windows/Edge 수동 검사 전 완전한 수용 주장 금지. STEP3~7 미착수.


## 2026-10-19 00:53:28 KST — STEP 2 원본 요구사항 대조 및 전환·마이그레이션 결함 수정
- 기준: `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (1~18절)와 실제 feature 소스·16개 Node 테스트·Chrome E2E 대조. 상세 표: feature `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`.
- **실제 결함 1:** STEP2 본문 자동 저장 debounce(450ms) 이전에 ‘기존 회고록 편집’을 클릭하면 Workspace unmount 시 타이머가 제거돼 아직 저장되지 않은 글이 유실될 수 있었음. `src/step2/Workspace.tsx`에서 `await w.flush()` 성공한 경우에만 모드 전환, 실패 시 문서 유지/오류·재시도 안내.
- **실제 결함 2:** 최초 STEP1 localStorage가 뒤늦게 생긴 상태에서 STEP2를 재진입하면 `idb.initialize`가 migration 문서를 ACTIVE로 강제해 기존 편집 문서가 바뀌었음. `src/step2/idb.ts`의 migration transaction이 **기존 ACTIVE 있으면 유지**, 없을 때만 migrated doc을 ACTIVE로 저장하도록 수정. 이전 v1 localStorage 원본 유지, 문서·migration marker 동시 처리.
- **테스트 연동 수정:** STEP1 Chrome 스모크는 전환 버튼이 활성화될 때까지 기다림. STEP2 Chrome 스모크는 빠른 화면 전환 후 원문 보존/중복 migration 방지/강제 저장 실패 시 전환 취소·재시도 검증. Chrome 테스트 종료에서 프로세스 종료를 기다린 뒤 임시 profile을 제거하도록 보완.
- [GitHub Actions #39142445389](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39142445389) **SUCCESS**. 테스트 **16/16 PASS**, TS/Vite 빌드 PASS, STEP1 Chrome 15p A4 및 STEP2 기존 이미지/JSON/저장/2탭/페이지 나눔 회귀+신규 화면 전환 PASS. 검증 SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`.
- **남은 수용 증거:** 유효한 기존 STEP1 v1 데이터가 사전 존재하는 **독립 Chrome 프로필 cold-start 마이그레이션 E2E**(현재는 단위·지연 발생 상황 검증), 독립 프로필 JSON 가져오기, 사용자 Windows Chrome/Edge PDF 출력·한글·시각 수동 검수. UI 접근성 전체 수동 점검도 남음.
- **병합 판정 HOLD:** `main`에 STEP2 기능 미병합, STEP3 미착수. 보수적 추정 STEP2 **약 90~95%**, 전체 7단계 **약 27~28%** (동일 비중 단순 환산·소요 시간 반영 안 함). 이전 기준에서 유의미한 5%p 순증 아님.
- 다음 `ㄱ`: STEP1 v1 원본 있는 별도 Chrome 프로필에서 실제 초기 마이그레이션/복원·중복 방지 검증. 이후 별도 프로필 JSON 이식 확인 → main 병합 여부 판단.


## 2026-10-19 01:04 KST — STEP2 V1 선존재 신규 프로필 마이그레이션 E2E 성공
- 검증 코드 `abb3d9425e72a2708306674176346727ef0ea710`, 기능 브랜치 `feature/step2-full-20261018`. 원본 STEP1 `localStorage`이 **처음부터 존재**하는 신규 Chrome 프로필을 만들어 앱 JS 이전에 유효한 v1 형식의 **합성 데이터**를 저장. 실제 사용자 데이터 수정 없이 검증.
- `tests/step2-cold-migration.mjs`와 `.github/workflows/ci.yml` 테스트 추가. Chrome IndexedDB에서 STEP2 문서 1개(빈 문서 중복 없음), v1 제목/작성자/날짜·4개 본문 항목 원문/공백/줄바꿈/특수문자·기존 디자인 exact match, 고유 ID·ACTIVE·migration marker true PASS.
- 기존 `astra-pdf-redesigner:current:v1` 원본 JSON byte-for-byte 유지 PASS. Chrome 새로고침 후 문서·ACTIVE·migration marker 원상태 동일/중복 복제 0 PASS.
- [GitHub Actions `39143261165`](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39143261165) **SUCCESS**: `npm test` 16/16 PASS, TS/Vite 빌드 PASS, 기존 STEP1 Chrome PDF 15p·STEP2 이미지/JSON·2탭·인쇄·저장 실패 회귀+신규 cold migration PASS.
- 유의: Chrome test 종료에서 합성 임시 프로필 삭제 `ENOTEMPTY` 경고 발생. **검증 PASS와 분리**하여 CI 완료 success, runner 임시 디렉터리 정리 경고는 기록. 기능 데이터/사용자 문서와 무관.
- **남은 수용 항목:** 새로운 Chrome 프로필 간 JSON 파일 실물 내보내기→가져오기 E2E, 사용자의 Windows Chrome/Edge A4 인쇄/한글·시각 검수, 초기 migration 실제 트랜잭션 실패 주입은 별도 미검증.
- 상태 STEP2 **약 95% 비공식 추정**, 전체 7단계 단순 동일비중 환산 **약 28~29%**. 진도 유의미 상승 기준(5%p) 미달. **main STEP2 병합 HOLD**; STEP3~7 미착수. 다음 `ㄱ`: 독립 Chrome 프로필 JSON 이식/복원 검증.


## 2026-10-19 01:19 KST — STEP2 Chrome 별도 프로필 간 JSON 프로젝트 이식 검증 PASS
- 앱 코드 변경 없음. `feature/step2-full-20261018`의 신규 `tests/step2-cross-profile.mjs`와 Actions CI 연결. [GitHub Actions `39144399956`](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39144399956) **SUCCESS** (검증 코드 SHA `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`; Node 단위 16/16, TS/Vite 빌드, STEP1/2 기존 Chrome 회귀 PASS).
- **프로필 A:** 별도 Chrome 사용자 디렉터리에서 synthetic 본문·메타/compact 디자인·원본 PNG(40×70)·WebP(84×36) 2개 저장, UI에서 실제 `.localdoc.json` 다운로드; 파일 내 Base64와 DB 원본 이미지 bytes 일치 확인.
- **프로필 B:** 프로필 A와 독립된 Chrome 사용자 디렉터리에서 빈 문서만 존재함을 먼저 확인. CDP `DOM.setFileInputFiles`로 A가 다운로드한 **동일 실물 파일**을 B의 프로젝트 가져오기 파일 입력창에 전달하여 앱 import. 기존 B 문서 보존, 원문·메타·디자인·이미지 bytes/순서/규격 정확 복원·모든 doc/section/block/asset ID 새로 발급·참조 오류 없음 PASS. 새로고침 후 유지·A4 PDF 본문·이미지 2개 포함 PASS.
- 이전 검증 완료: 기존 STEP1 v1 cold-start 마이그레이션, 저장 실패 복원, 이미지 원자적 교체, 멀티탭 Web Locks, 긴 캡션·A4 페이지 나눔 등. **아직 미검증:** V1→V2 **초기 migration transaction 강제 abort/원본·marker rollback**, Windows Chrome/Edge 인쇄·한글/시각 수동 검수와 전체 접근성.
- **상태:** STEP2 주요 자동 수용 증거 대부분 완료, 진행률 **약 96%**(비공식 추정). 전체 7단계 단순 동등가중 **약 28~29%**, 5%p 유의미 상승 아님. `main` 기능 STEP1 유지, STEP2 병합 HOLD, STEP3~7 미착수. 다음 `ㄱ`은 초기 migration 쓰기 실패 주입·복구 검사 1단위.


## 2026-10-19 01:29 KST — STEP 1→2 최초 마이그레이션 트랜잭션 중단·복구 검증 성공
- 기능 브랜치 `feature/step2-full-20261018`의 `tests/step2-cold-migration.mjs`에서 실제 Chrome IndexedDB `documents+meta` 마이그레이션 트랜잭션을 `put` 큐 등록 뒤 강제 `abort()`하는 1회 오류 주입 E2E 추가. 앱 로직·사용자 데이터는 변경하지 않고 합성 v1 데이터만 사용.
- **실패 직후 검증:** V2 documents 0건, `v1MigrationFinished` marker 없음, `activeDocumentId` 없음, STEP1 v1 `localStorage` raw JSON 바이트 불변, 오류 안내 PASS.
- **복구 검증:** 새로고침 후 주입 제거 → V1 원문 4개 항목/공백/줄바꿈·메타/디자인이 V2 문서로 1회 이동하고 marker·active 생성 PASS. 추가 reload 이후 같은 V2 ID·내용·marker 유지, 중복 문서 없음 PASS.
- 기존 `tests/step2-browser.mjs`에서 저장 재시도 '저장됨' 표시 직후 모드 변경 버튼 활성화까지 기다리도록 시험 타이밍 수정. 이전 CI `39144986696`의 테스트 클릭 타이밍 실패 해결. 앱 기능 소스 수정 없음.
- [GitHub Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) **SUCCESS**(테스트 코드 SHA `a5009a76499a983aa4566adabddabf862c9e839b`). 단위 **16/16**, TypeScript/Vite 빌드, STEP1 A4 PDF15p·STEP2 PNG/JPEG/WebP·JSON 프로필간 이식·IndexedDB 저장복구/멀티탭/긴 캡션 모든 Chrome 회귀 및 신규 abort·복구 PASS.
- **잔여 수용:** 사용자 Windows Chrome/Edge에서 한글/폰트, A4 인쇄 이미지 잘림·페이지 나눔, 키보드 접근성 실제 수동 검수. Linux Chrome 자동 테스트 결과를 사용자 OS 실검수로 표현하지 않음.
- STEP2 구현·자동검증 기준 추정 **약 97~98%**. 전체 로드맵 7단계 단순 동등가중 **약 28~29%**, 5%p 이상 진도 상승은 아님. STEP2 main 코드 병합 HOLD, STEP3~7 미착수. 다음 `ㄱ`: Windows/Edge 사용자 수동 수용 절차·결과 확인 및 병합 조건 판단.


## 2026-10-19 01:40 KST — Windows Chrome/Edge STEP2 수동 수용 절차·병합 조건 확정
- 기능 브랜치 `feature/step2-full-20261018`의 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md` 신규 문서. `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 원본 §16 **21개 수동 검사 번호 유지**·§17 최종 완료 기준·§18 보고 조건에 맞춰 테스트 전용 Windows PowerShell 실행, 서로 다른 Chrome/Edge 프로필, localhost 별도 포트 `4178` 및 A4 PDF 증거 수집·오류 보고 양식 작성.
- 모든 수동 검사 상태: **미실행 21/21**, Windows Chrome·Edge 한글/이미지/캡션 시각·키보드 검증 결과 미접수. 이전 Ubuntu Chrome Actions [#39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) SUCCESS (기능 SHA `a5009a76499a983aa4566adabddabf862c9e839b`, Node 16/16, 빌드/실제 Chrome 회귀)와 혼동 금지.
- 병합 게이트: 최신 feature diff·CI 확인 + 실제 Windows Chrome/Edge 수동 결과에서 중요한 데이터 손상·누락·인쇄 실패 0 + 미실행/차단 근거 문서화 + 사용자 명시적 승인. **현재 STEP2 전체 수용 HOLD / main 기능 미병합**, STEP3 미착수.
- 검수 전용 별도 프로필·origin을 안내해 실제 사용자 문서·기존 `5173` origin/데이터를 변경하지 않도록 함. 수동 증거는 합성 PDF·스크린샷으로 수집하고 사용자 원본·비밀 키는 제출하지 않는다.
- 진척도: STEP2 약 **97~98%**, 7단계 동등가중 전체 약 **28~29%** 이전 추정 유지. 문서화만 추가됐으며 유의미한 실질 진도 상승은 아님.
- **다음 작업:** 사용자 Windows Chrome/Edge에서 수동 검수 결과를 수집하면 FAIL 분석·수정·재검증 후 main 병합 판단. 사용자 PC에서 아직 테스트하지 않음.


## 2026-10-19 02:14 KST — STEP2 병합 전 코드/CI 검수, 브라우저 필수 검사 강화
- GitHub `main` vs `feature/step2-full-20261018` 정적 비교. 앞섬 **63 commits**, 뒤짐 **28 commits**인 diverged 상태. main 쪽 최근 수정은 `HANDOFF.md`/`STATUS.md` 중심, 기능 브랜치는 STEP2 React/IndexedDB/CSS/테스트 신설. **실제 merge 및 merge 성공/충돌 검사 미수행**, main STEP1 원본·사용자 데이터 무변경.
- **CI 신뢰성 문제 수정:** 기존 `.github/workflows/ci.yml`은 Chrome 미설치 시 `exit 0`으로 실브라우저 검사를 건너뛰고 성공 처리할 가능성. 필수 Chrome/PDF 테스트 누락 시 `::error`와 **`exit 1`**로 실패하도록 변경(기능 변경 없음).
- [GitHub Actions #39148544554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39148544554) **SUCCESS**, 실제 코드 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`. Node 16/16, TypeScript/Vite build, Chrome executable `/usr/bin/google-chrome`, STEP1 A4 15p 및 STEP2 이미지/IndexedDB·마이그레이션 abort/긴 캡션·멀티탭·크로스 프로필 JSON E2E **전부 PASS**.
- **실제 사용자 Windows Chrome PDF 부분 증거 확인:** 첨부된 짧은 문서 1페이지 `594.96 x 841.92 pt` A4, Creator Windows Chrome155, 내장 `MalgunGothic`/`MalgunGothicBold` 글꼴·Unicode 매핑, 한글 제목/본문 정상 추출, 인쇄 UI 보이지 않음. 이 파일 자체는 GitHub 공개 게시 금지. **Edge 출력·Windows 2페이지 이상/이미지/긴 캡션은 미검증**, 실제 뷰어에서 문자 선택·복사 수동 동작도 미확인. '21/21 모든 수동 항목 미실행'이라는 기존 표기는 **일부 Chrome 증거 존재**로 정정.
- 상세 감사 파일: feature `docs/STEP2_PREMERGE_CODE_CI_AUDIT_2026-10-19.md` 및 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md` (Windows Chrome 부분 증거 기록). `README.md` 최신 CI 연동. CI 임시 Chrome 프로필 cleanup `ENOTEMPTY` 간헐적 WARN은 여전히 존재하나 기능 검사 성공과 별개.
- **병합 판정 HOLD:** 사용자 명시적 승인 전 main 병합 없음. STEP2 약 **97~98%**, 전체 7단계 단순 동등 가중 **28~29%** 이전 추정 유지. 새 코드 감사/CI 신뢰성 개선은 5%p 실질 진도 상승 아님. 다음: 미검증 수용 범위를 협의하고 필요 시 Edge/장문 증거 추가·결함 해결 후 main 병합 승인/재검증.


## 2026-10-19 02:24 KST — Microsoft Edge 실제 Linux 브라우저 PDF·저장 회귀 자동화 성공
- GitHub Actions `.github/workflows/ci.yml` 기능 브랜치 `feature/step2-full-20261018`에 `Microsoft Edge A4 print and IndexedDB smoke` **필수 단계** 추가. Edge 없을 때 우회 성공 방지(`::error`+exit 1), 출력도구 pdfinfo/pdftotext/pdfimages 확인, 별도 Vite 테스트 서버에서 `tests/browser-smoke.mjs`·`tests/step2-browser.mjs`를 `CHROME_PATH="$EDGE_BIN"`으로 실행.
- [Actions #39149195481](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481) **SUCCESS**. 실제 로그: `Microsoft Edge executable: /usr/bin/microsoft-edge`; `Microsoft Edge 155.0.4283.45`. 테스트 기능 SHA `34352fd4e92ca43641da3b4d9de3070232276497`. Node 단위 16/16, TS/Vite build, 기존 Chrome 전수 회귀 PASS.
- **Edge 실제 검증 PASS:** STEP1 A4 15p·한글 PDF 텍스트 추출·편집 UI 제외, STEP2 IndexedDB 저장/새로고침·PNG/JPEG/WebP 원본 bytes·이미지 PDF raster 포함·JSON 백업/불량 입력 거부·대형 세로 이미지+긴 캡션 다페이지 A4·QuotaExceededError 저장실패·이미지 교체 transaction abort 복원·화면 전환 미저장 보호. 테스트용 임시 Chrome 프로필 삭제 `ENOTEMPTY` 경고는 간헐적이지만 Actions 최종 성공.
- **검증 경계:** Ubuntu **Linux Edge** 155에서의 자동 검사이며 **Windows Edge 실제 PDF·폰트·육안 수용 아님**. Edge에서는 STEP1/2 browser smoke 두 스크립트 실행, Chrome 전용 다른 2탭/프로필간 이식 스크립트까지 Edge에서 별도 실행한 것은 아님. Windows Chrome 1페이지 사용자 제출 PDF 부분 PASS 증거는 별도 유지.
- 보고서: feature `docs/STEP2_EDGE_CHROMIUM_CI_VALIDATION_2026-10-19.md`. `README.md`, STEP2 감사/Windows 검수 문서·구현 상태 최신 반영. **STEP2 최종 수용·main 병합 HOLD**, STEP3~7 미착수. 진행률 STEP2 비공식 약 98~99%, 전체 동일 비중 7단계 약 28~29%, 유의미한 5%p 상승 없음.
- 다음 작업: 남은 Windows 실환경 수용 항목을 최소화해 판단하고 병합 전 feature/main 충돌·코드/원본 보호를 재검토한다. 사용자 명시적 승인 없는 main 병합 금지.


## 2026-10-19 02:43 KST — STEP2 main+feature 실제 격리 병합·바이트 무결성·통합 회귀 성공
- 최신 비교: `main`과 `feature/step2-full-20261018`이 **diverged**, 기능 브랜치 73 commits ahead/32 behind. 실제 병합을 GitHub Actions 격리 runner에서 **detached main HEAD** `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a` + 기능 SHA `8d9fdb1adef31875a793cce9376de3154eb08229`로 `git merge --no-commit --no-ff` 수행. **충돌 0**, 28개 staged 경로, HEAD main 유지/ MERGE_HEAD feature 일치. **main에 merge commit/푸시 없음**.
- 기존 main의 `HANDOFF.md`/`STATUS.md`, STEP1 `src/App.tsx`/`src/storage.ts`, 로드맵·STEP1/BLUEPRINT 명세·설계 PNG2장과 feature STEP2 원본 지침 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt`를 병합 결과와 **byte-for-byte** 비교 **전부 PASS**. STEP1와 기존 인수인계 보호 확인.
- [GitHub Actions #39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) **SUCCESS**: 병합된 임시 트리에서 Node 16/16, TS/Vite 빌드, Google Chrome STEP1 PDF15p·STEP2 이미지/JSON·저장 실패·실제 2탭·V1 migration abort/재시도·독립 프로필 JSON 파일 이식 및 Microsoft Edge 155 STEP1/STEP2 A4 PDF·긴 캡션·저장 복구 전체 PASS. 기능 브랜치 단독 CI [#39150537297](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537297)도 SUCCESS.
- 기능 브랜치 `.github/workflows/step2-merge-preflight.yml` 신규(추후 push시 자동 재검증). 상세 보고 `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`. 앱 기능 코드 변경 없음, workflow·보고서만 추가.
- **판정:** 기술적 병합 사전검증 PASS. 사용자 Windows Chrome 1p 한글/A4 부분 PASS, Windows Edge 실제 긴 PDF/이미지·키보드 육안 수용 미완료. STEP2 최종 수용·main 실제 병합은 사용자 명시적 승인 전 **HOLD**, STEP3 미착수.
- 이번 상태 문서 추가 뒤 **main HEAD가 바뀌므로**, 최종 merge 전에 새로운 main/feature SHA 조합으로 preflight 다시 실행해야 한다. 이전 run의 `main` SHA는 `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`. 원본 파일들이 후속 수정에도 그대로인지 병합시 확인.
- 진행률 비공식 STEP2 **약 99%**(자동·기술적 준비 관점), 전체 7단계 **약 28~29%**(동일 비중 단순 환산; 5%p 상승 없음). 다음: 수동 수용 범위·병합 명시적 승인 여부 확인 → 승인시 최신 main HEAD로 재검증 후 main 병합/CI 확인.


## 2026-10-19 02:52 KST — STEP2 main 통합 Draft Pull Request 준비 완료
- [GitHub Draft PR #2](https://github.com/hibi89/astra_pdf_redesigner/pull/2) 생성: `feature/step2-full-20261018` → `main`. 상태 `open`/`draft=true`/`merged=false` 확인, GitHub의 당시 `mergeable=true`, `mergeable_state=clean`. **실제 main merge·push 미수행**.
- PR은 STEP2 전체 기능·V1 로컬 데이터/원본 보존·Linux Chrome/Edge 실제 PDF/DB/JSON CI 성공과 Windows Chrome 사용자 제출 1p PDF 부분 검증·남아있는 Windows Edge/긴 이미지·키보드 시각 수용의 차이를 명시. 원본 사용자 PDF는 공개 저장소에 올리지 않음.
- 이전 격리 병합 Actions [#39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) **SUCCESS**(main `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`, feature `8d9fdb1adef31875a793cce9376de3154eb08229`). Draft PR 생성 시 main `e9044998f6f05cb41d13e339e6e8424e37ef62bb`, head `d94fdd831ce53b3afb4e02eea640c93c3209cc94`로 **이전 시험 SHAs와 다름**. PR mergeable=clean만으로 새 조합의 통합 CI PASS 확정 불가.
- **최종 병합 게이트:** 사용자 수동 검수 미완료 항목 해결 또는 명시적 잔여위험 수용 + 사용자 STEP2 main 병합 명시적 승인 → 최신 main/feature SHA 고정하여 isolated preflight·CI 재검증 → 실제 merge 및 새 main CI PASS 확인. 병합 승인 전 Draft 유지.
- 기능 브랜치 `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`에 PR 등록/남은 수용 조건 추기. STEP2 약 **99%** 자동·기술 관점 비공식 추정, 전체 7단계 동등 비중 약 **28~29%**; PR 생성은 전체 완성을 높이지 않음. STEP3~7 미착수.


## 2026-10-19 — 병합 후 Edge CI 실패 복구, main 전체 자동검사 SUCCESS
- PR #2의 STEP2 병합 SHA `f1ad26320b12b07019b115f77f8cf55e62f1e7e6`; 병합 직후 [Actions #39155133495](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39155133495) **FAILURE**(Chrome PASS, Edge STEP1 `/json/version` CDP startup timeout). D-Bus 경고가 존재하나 근본 원인임은 확정하지 않음.
- 사용자 새 `ㄱ` 지시에 따라 **CI 전용 복구**: `tests/browser-process.mjs`에서 `DevToolsActivePort`의 WebSocket 경로로 직접 핸드셰이크, 검사 스크립트 5개 연결 방식을 공통화; Edge 독립 runner job 도입(`.github/workflows/ci.yml`). **`src/**` 앱 기능·사용자 원본·기존 설계 수정 없음**, 변경 파일 총 7개(테스트6+워크플로1).
- 기능/CI 수정 `main` SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`, [Actions #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) **SUCCESS**: `build-and-test` Node16/16, TS/Vite 빌드, Chrome STEP1·STEP2 E2E·2탭/마이그레이션 abort·프로필 간 JSON PASS; 분리된 Edge job STEP1/STEP2 A4 PDF·이미지·긴 캡션·IndexedDB 복구 PASS. CDP 실제 WebSocket 연결 성공 로그 확인.
- 보고서: `docs/STEP2_POSTMERGE_MAIN_CI_RECOVERY_2026-10-19.md`. 기존 병합/원본 Git blob SHA 비교 PASS 기록 유지, 앱 동작 코드 수정 없음.
- **Windows Edge 실물 PDF·Windows 긴 문서/PNG-JPEG-WebP 다페이지 육안·키보드·작은 창 사용자 수동 검수는 여전히 NOT RUN. STEP2 전체 검증 완료나 100% 선언 금지.**
- STEP 3 미착수. 진행률 보수적 추정 STEP2 구현/자동검증 약 **99%**, 전체 동일 비중 7단계 약 **28~29%** 유지. 추후 앱 기능 구현은 별도 사용자 지시 필요.


## 2026-10-19 — STEP3 기존 PDF 가져오기 첫 세로형 MVP, Draft PR #3
- 기존 STEP2 안정 main 코드 SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`의 [Actions #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) SUCCESS 유지. **main 앱 기능은 수정하지 않았다**.
- 사용자 `ㄱ` 승인으로 로드맵 §5 STEP3 착수. **기능 브랜치 `feature/step3-pdf-import-20261019`** 신규(최초 base main `2c81797735661263ce9fe992ca3fa3b356f60869`), [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 작성. 아직 main 병합하지 않음.
- 브라우저 로컬 PDF.js `6.4.299`(Apache-2.0)로 선택 가능한 단일 열 PDF 텍스트·좌표 추출, 원본 Blob PDF 대조·분류/순서/본문 수정, 확인 후 별도 schemaVersion2 문서 atomic 저장, 기존 테마로 A4 재출력 구현. 원본 PDF 파일 바이트는 영구 저장하지 않음. 30MiB/50p 제한·스캔/암호 PDF 차단·원본 이미지 미복원/열·순서 위험 경고.
- **실제 [feature CI #39159350165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39159350165) SUCCESS**(검증 코드 `e216866a592362342ac6dd2ca2105b71799cc8fc`). 단위 **21/21**, TypeScript/Vite 빌드, 기존 STEP1/2 Chrome/Edge 회귀, 양쪽 실제 브라우저의 합성 PDF 생성→PDF.js 가져오기 검수→DB 신규 저장→테마·리로드→A4 재출력 PASS.
- 완성 아님: 실제 PDF 5~10개 대조, PDF 내부 이미지 원본 자동 추출·복원, 일부 표/다단/문자 매핑/순서의 정확도, Windows 실물 검증은 **미구현/미검증**. STEP2 Windows Edge/장문·이미지 PDF 육안 검수도 **NOT RUN 유지**.
- 자세한 [STEP3 설계](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_PDF_IMPORT_DESIGN_2026-10-19.md), [MVP 결과](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_MVP_IMPLEMENTATION_AND_CI_2026-10-19.md). Draft PR #3 main 통합 금지; 최종 수용/실제 고객 PDF 검토·별도 승인 필요.
- 진행률 비공식 STEP1 100%, STEP2 기술 구현 약99%(Windows 일부 미완료), STEP3 첫 MVP **약45~50%**, STEP4~7 미착수. 7단계 동일 비중 단순 전체 **약35%**(이전 28~29% 대비 5%p 이상 상승). 실제 난이도/남은 시간 기준 추정 아님.


## 2026-10-19 — STEP3 이미지 PNG 재구성·실제 2페이지 PDF 회귀 PASS (Draft PR #3)
- STEP3 기능 브랜치 `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 검토 상태. **main 기능 미병합**. 기존 STEP1/2 main 소스와 로컬 사용자 데이터 변경 없음.
- PDF.js operator list에서 이미지 행렬/원본 페이지 좌표를 추적하고, 지원되는 일반 XObject·inline 이미지의 **디코딩된 픽셀을 PNG로 재구성**, 이미지 누락 개수와 실패 이유·복원 썸네일·포함/제외 체크박스를 표기하도록 구현. 마스크·회전·반복/그룹·클리핑 및 색상 완전 일치는 미지원/미확인임을 경고. 원본 encoded JPEG/PNG 바이트 추출과 구분.
- 선택된 복원 PNG를 STEP2 schemaVersion2 문서의 이미지 블록/Asset에 연결, 문서+이미지+활성 ID IndexedDB **단일 atomic transaction**; 확인 이전 문서함 불변. 페이지 단위 텍스트·이미지 출처를 보존하며 이미지 위치는 근사 배치.
- **검증 코드 SHA `53c56e47a10606e381d4f5593695b7ca11bc7733`**, [feature Actions #39162038601](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39162038601) **SUCCESS**: Node 26/26, TS/Vite build, 기존 STEP1/2 Chrome/Edge 회귀 PASS. Chrome·Edge 각 실제 2페이지 이미지 PDF에서 1건 감지/PNG 1건 복원/미복원0, 명시적 확인→새 문서/이미지 IDB 저장→테마 변경/리로드→실제 A4 PDF `pdfimages -list` 이미지 존재 및 텍스트 1→2페이지 마커 순서 PASS.
- 상세: [이미지 복원·다페이지 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_IMAGE_RECOVERY_MULTIPAGE_VALIDATION_2026-10-19.md).
- **미완료:** 실제 사용자 간단한 PDF 5~10개 원문/추출·영상/이미지 육안 대조, 복잡한 클리핑·표·다단·회전/투명 이미지·고용량 성능, Windows Chrome/Edge 현장 검증. 기존 STEP2 Windows Edge 실물 PDF/장문·이미지/키보드 육안 체크리스트 NOT RUN 유지. STEP3 전체 완료/100% 선언 금지.
- 비공식 추정 STEP3 **65~70%**, 전체 7단계 동일 비중 약 **38%**(이전 약35% 대비 ~3%p, 5%p 유의미 상승 아님). 실제 개발 시간/상용 품질 기준 아님.
- 다음 단위: 혼합/미지원 이미지의 누락 감지 회귀 확장 및 실제 샘플 대조; 사용자 최종 수용·별도 승인 전 PR Draft·main 미병합 유지.

## 2026-10-19 10:29:29 KST — STEP3 미지원·잘못된 이미지 배치 누락 집계 회귀 추가
- 대상 `feature/step3-pdf-import-20261019`, 테스트 파일 `tests/step3-image-recovery.test.ts`에 3건 추가. 코드 커밋 `2200836cc529f4272e78456783d36e50f6b0142c`; GitHub 파일 재조회 blob `794a361b114df268390a8163b86dbd756fcf72d6` 확인.
- 추가 검증: (1) 마스크·XObject 반복·inline 그룹·mask 반복 4개를 `detected=4, images=0, problems=4`로 경고 집계, (2) 페이지 경계 초과/면적 0 이미지 2개를 픽셀 로드 없이 누락 처리, (3) 잘못된 배치 후 graphics-state restore로 이어지는 정상 이미지 위치 복구 확인.
- **검증 구분**: GitHub 반영/파일 재조회 PASS. 신규 Node 단위 테스트·빌드·Chrome/Edge 전체 CI 결과는 **미확인**(commit workflow 조회 0건/commit status 비어 있음); 성공이라고 표시하지 않음. 기능 `src/**` 변경 0, 제품 사용자 데이터와 원본 파일 변경 0.
- STEP3 이미지 복원 및 기존 CI 성공의 이전 근거는 `53c56e47...` / run `39162038601`이며 신규 커밋 검사 결과가 아님.
- PR #3 Draft 및 main STEP3 기능 미병합 유지. 실제 사용자 PDF 5~10개/Windows Edge·다페이지 이미지는 미검증. 단계 추정 STEP3 약65~70%, 전체 약38% 유지.
- 다음 1단위: **신규 SHA에 대한 CI 로그/테스트 확인**, FAIL이면 최소 수정과 재검증, 그 후 실제 복잡 이미지 누락 fixture 확대.

## 2026-10-19 10:48:52 KST — STEP3 신규 이미지 회귀 29/29 검증 및 Edge CI 복구
- **검증 출처:** 이전 기능+테스트 SHA `2200836cc529f4272e78456783d36e50f6b0142c`에서 [GitHub Actions #39185454384](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39185454384) **FAILURE**: Node **29/29 PASS**, `npm run build` PASS, Chrome STEP1~3 전체 스모크 PASS; 독립 Edge job의 STEP1 초기 CDP WebSocket handshake가 35초 제한에 걸려 **실행 시작 전에 실패**. Edge stderr의 D-Bus 경고는 근본원인 미확정. 해당 실패는 신규 3개 이미지 테스트 실패가 아님.
- **최소 수정:** `tests/browser-process.mjs`의 `launchBrowser().connect`에서 **Microsoft Edge만 60초**, Chrome 및 그 외 브라우저는 기존 **35초** 초기 연결 제한 유지. 앱 `src/**` / 사용자 데이터 / PDF 이미지 처리 알고리즘 수정 없음. 기능/CI SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976` (GitHub 계정 `hibi89` 커밋 신원 연결 확인).
- **재검증:** [Actions #39186875371](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39186875371) **SUCCESS**, 해당 head SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976` 고정 확인, 두 job **build-and-test / Microsoft Edge A4 PDF and IndexedDB 모두 success**. Node **29 PASS / 0 FAIL / 0 SKIP**, TypeScript/Vite build PASS, Chrome STEP1/2/3 회귀(프로필 분리·2탭·JSON A→B·마이그레이션·이미지 포함 PDF) PASS. Linux Edge 155 STEP1 A4 PDF→STEP2 저장/출력→STEP3 이미지 복원·2페이지 순서·A4 재출력 PASS. Edge STEP1 CDP 연결 로그 5번째 시도 성공. `ENOTEMPTY` 테스트용 임시 프로필 정리 경고는 비치명적.
- **안전·범위:** 신규 STEP3 회귀 3건 모두 포함한 29/29 성공. 기능 브랜치 `feature/step3-pdf-import-20261019`, Draft PR #3 **open / draft / unmerged**; STEP3 main 미병합. Linux 자동 검증은 **Windows Edge 실제 인쇄나 사용자 실제 PDF 5~10개·복잡 클리핑/회전/다단 PDF 검수에 해당하지 않음**. STEP2 Windows 사용자 수용도 일부 미검증. Vercel/Production 미적용.
- **현재 판정:** 이번 **CI 검증 1단위 완료**. 전체 단계 비공식 추정 약38%, STEP3 약65~70% 유지(실사용 정확도 증명 아님). 다음 `ㄱ`: 실제 복잡 그래픽/반복/투명 이미지 합성 fixture를 추가하고 최소 누락 감지·경고/복구 경계 검증, 또는 실제 사용자 PDF 별도 수용 검증(원본은 공개 GitHub 업로드 금지). 추가 기능/병합은 승인 조건 준수.

## 2026-10-19 11:03:17 KST — STEP3 클리핑·반복 이미지 실물 합성 PDF 경고 검증
- **한 단위 범위:** 기능 브랜치 `feature/step3-pdf-import-20261019`에서 보수적인 PDF 클리핑 위험 감지/고지 및 합성 실제 PDF 회귀 시험. 기존 정상 XObject PNG 복원과 마스크·반복·그룹 누락 카운트를 유지. 원본 클리핑 형상/픽셀 동일성 복원은 **미구현**.
- **구현:** `src/step3/imageRecovery.ts`에서 PDF.js `clip/eoClip` operator 활성 그래픽 상태를 `save/restore` 스택과 함께 추적. 클리핑 중 일반 XObject/inline 이미지는 **복원 가능하면 PNG를 유지하되** 개별 원본 대조 경고를 `problems`에 추가; `detected/recovered/omitted` 건수는 경고와 분리. 변환 로직/기존 문서 저장·보안은 변경 없음. 테스트 `tests/step3-image-recovery.test.ts` 2건 추가.
- **실제 PDF fixture:** `tests/fixtures/step3-clipped-pdf.mjs`에서 합성 1p A4 PDF의 선택 가능한 텍스트, 동일 bitmap XObject 두 번(일반/클립 `W n`)을 생성. `tests/step3-browser.mjs`에서 `pdfimages -list` 실제 이미지 표시 2회 검사→로컬 PDF.js 가져오기→클리핑 경고 표시, 복원 이미지 감지 및 **확정 전 문서함/활성 문서 불변** 확인. PNG에 원본 크롭을 실제 적용했다는 뜻은 아님.
- **검증 SHA:** `d0444b5138c29acebbe2d80ed187165a4dacd237` / [GitHub Actions #39187963241](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39187963241) **completed/success**, HEAD 일치, 실제 로그 양쪽 job **SUCCESS**. Node **31/31 PASS, 0 FAIL, 0 SKIP**, TS/Vite build PASS, Chrome STEP1~3 및 Linux Microsoft Edge155 STEP1~3 E2E 모두 PASS. 두 브라우저 로그에 `PASS STEP3 CLIPPED XOBJECT PDF` 직접 확인. Chrome 기존 멀티탭·마이그레이션·교차 프로필 JSON도 PASS.
- **안전/잔여:** 합성 데이터만 CI 사용, 사용자 PDF 외부 업로드 없음. STEP1 localStorage/STEP2 IndexedDB·원본 설계·main 기능 수정 없음. 실제 사용자 PDF 5~10개 대조, 복잡 클립 형상·투명도·벡터/회전/표·Windows 실제 인쇄/육안 **미검증**. STEP2 Windows 잔여 검증 NOT RUN 유지. 경고 검출은 **보수적**이며 실제 잘린 면적을 계산하지 않는다.
- **상태/진행률:** `Draft PR #3` open, STEP3 기능 **main 미병합**, 별도 승인 전 병합하지 않음. STEP3 비공식 약 **65~70%**, 전체 7단계 동등가중 약 **38%** 유지(품질·시간 환산 아님). **다음 `ㄱ`:** 실사용 적합성 검증에 필요한 다양한 PDF fixture/원본-결과 대조 기준 한 단위 확대; 최종 사용자 PDF와 Windows 수동 수용은 별도.

## 2026-10-19 11:24:52 KST — STEP3 합성 혼합 레이아웃 원본→재출력 대조 수용 검증 완료
- **한 단위:** `feature/step3-pdf-import-20261019`에 완전 합성 A4 2페이지 PDF fixture (`tests/fixtures/step3-mixed-layout-pdf.mjs`) 추가. 원본 좌/우 열 텍스트, 벡터 2×2 표, 컬러 래스터 XObject 1개, 원본 13개 고유 텍스트 마커. 실제 표/열 레이아웃 동일성은 주장하지 않고 원본↔검수↔A4 재출력에서 **13/13 식별자 각각 정확히 1회**·원본 페이지 구분 순서·재출력 래스터 포함·기존 문서 목록 보존을 자동 대조.
- **1차 실패:** [CI #39189111252](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189111252) `failure`(SHA `5939738a45176c54f558773def70f1ef13ce242c`). Edge 로그에 13개 원본/추출 마커는 나타났지만 **다단 경고 검출 없음**으로 실패. 시험 결과가 아닌 제품 경고 휴리스틱 문제. 
- **최소 수정:** `src/step3/structure.ts`에서 PDF.js가 분리된 좌/우 텍스트를 단일 넓은 TextItem으로 합친 경우, **글자 수에 비해 시각적 폭이 넓은 짧은 행이 2개 이상**이면 기존 `열 또는 넓은 텍스트 간격` 경고를 보수적으로 표시. 텍스트/이미지 복원이나 자동 순서 재배열은 변경하지 않음. `tests/step3-structure.test.ts` 신규 회귀 1건. 정상 폭넓은 본문도 경고할 수 있으므로 원본 확인을 요구하는 휴리스틱임을 유지.
- **최종 검증:** GitHub Actions [#39189525347](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189525347) `completed/success`, HEAD `0c6061b40286d7a859d8505995ad253f48da9665`. Node **32/32 PASS, FAIL 0, SKIP 0**; TS/Vite build PASS. Chrome 전체 STEP1/2/3 회귀·Linux Edge155 STEP1/2/3 회귀 PASS. 양 브라우저 로그에 `STEP3 MIXED WARNING COUNT: 3 column= true`, `PASS STEP3 MIXED REVIEW`, `PASS STEP3 SOURCE/REPRINT COMPARISON`(13/13·A4·이미지·문서 보존) 확인. 기존 다페이지·클리핑·저장/복원 테스트 유지.
- **출력 검증 경계:** 원본 `pdfinfo` 2p A4, `pdfimages` 래스터 1, `pdftotext` 13개 marker. 결과는 재디자인 문서의 `pdftotext` 13개 마커·A4·raster 유무만 확인. PDF 페이지수 동일성·열 순서·표 선/셀 구조·이미지 픽셀 색상/크롭 정확도 **미검증**. 사용자 실제 5~10개 PDF·Windows Chrome/Edge 육안·STEP2 잔여 수용도 **NOT RUN**.
- **소스/문서:** 기능 검증 SHA `0c6061b40286d7a859d8505995ad253f48da9665`; feature의 [검증 보고](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_MIXED_SOURCE_REPRINT_ACCEPTANCE_2026-10-19.md) 문서 커밋 `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5`(CI 이후 docs-only). `Draft PR #3` open/draft/unmerged, **main STEP3 기능 미병합**. 기존 STEP1/2 사용자 데이터 무변경·외부 업로드 없음. 로컬 프로그램으로 Production/Vercel 미적용.
- **진도/다음:** 이번 수용 테스트 한 단위 **완료**, STEP3 약65~70% / 전체7단계 약38%는 비공식 추정 유지. 다음 `ㄱ`: 오탐·열 순서와 벡터 표 누락에 대한 원본 대조 지표/실사용 수용 체크 확장. 실제 사용자 PDF 검증과 병합은 원본/승인 확보 후 수행.

## 2026-10-19 13:27:43 KST — STEP3 벡터 경로/표 구조 손실 위험 계측 및 브라우저 검증
- **목표와 구현:** 기존 PDF 업로드 시 원본 표 선/벡터 도형이 STEP3의 텍스트·PNG 중심 모델에서 자동 복원되지 않는 위험을 **실제 PDF.js 경로 관련 명령 수(근사치)**로 명시. `src/step3/vectorRisk.ts` 신규, `src/step3/pdf.ts` getOperatorList 연결, `src/step3/structure.ts` 페이지별 경고·집계, `src/step3/ImportPanel.tsx` 총합/페이지별 표시. 이 값은 표 셀·도형·선 수나 보존율이 **아니다**. 출력에 벡터 표 형상을 재생성하지 않음. 기존 문서 저장/이미지 복원 동작은 유지.
- **실제 실패 근거:** 초기 코드 `c1873cb73acd4f43a13b11d32aa735ddacfa9b1e`, [Actions #39198865094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39198865094) **FAILURE**. Node **35/35 PASS**, build PASS, Chrome/Edge 양쪽 실제 합성 PDF 벡터 경로 표시에 **0회**가 나와 E2E FAIL. PDF.js 최적화 경로의 `constructPath` 묶음을 `stroke/fill` 단독 계수가 놓친 오류. 기존 동일 접근 무의미 반복 금지.
- **수정/검증:** `constructPath` 묶음이 있으면 묶음 개수, 없으면 페인팅 명령 수를 **위험 지표**로 사용; 중복 가산 방지. **최종 검증 SHA `f132adbeb70ea43c38cecfb3841b36cbd773951b`**, [Actions #39199224379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39199224379) `completed/success`, 2026-10-19T04:26:04Z. Node **35/35 PASS, fail0, skip0**, TS/Vite build PASS, Chrome STEP1~3 및 Linux Edge155 STEP1~3 전체 회귀 PASS(두 job 직접 로그 확인). 실제 합성 2p A4 PDF는 원본 벡터 관련 명령 **3회**, 누락/구조 경고, 2열 읽기 순서 경고, 원본·검수·출력 **13/13 마커 보존**, raster XObject 1 포함, 기존 문서 불변 PASS.
- **테스트:** `tests/step3-vector-risk.test.ts` 신규 3개 단위 검사, `tests/step3-browser.mjs` 실제 혼합 문서에 위험 수치·경고·이미지·내용 무손실 비교 추가. 별도 [검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_VECTOR_STRUCTURE_RISK_VALIDATION_2026-10-19.md) feature docs-only SHA `63f43b1b94730a6a3e5d8e9232035a96157c20ae`. 보고서 커밋은 CI 검증 SHA와 **구분**.
- **안전·미검증:** 사용자 원본 PDF/STEP1 localStorage/STEP2 IndexedDB 및 main 앱 기능 무변경. OCR, 벡터 표 선/셀 구조·다단 정확한 순서, 벡터 도형의 출력 보존율, 이미지 색상/크롭/픽셀 동일성, 실제 사용자 PDF 5~10개, Windows Chrome/Edge 출력·육안 **미검증**. 수치 0이라도 모든 도형 보존을 보증하지 않음. 합성 자료만 CI에 사용.
- **상태:** STEP3 `feature/step3-pdf-import-20261019` [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/**unmerged**. **main STEP3 미병합**; Production/Vercel 미적용(로컬 앱). 비공식 STEP3 약65~70%, 전체 7단계 약38% 유지. **다음 `ㄱ`:** 벡터 오탐/리스크 계측에 대한 예외 및 사용자 검수 기준 추가 또는 실제 샘플 PDF 수용 검증. main 병합·STEP4는 별도 승인 전 착수 금지.

## 2026-10-19 13:48:10 KST — STEP3 클리핑 경로 오탐 제거·원본 대조 체크리스트 CI 검증
- **수행 범위:** `src/step3/vectorRisk.ts`의 클리핑 전용 `constructPath` 오탐 개선(클립 전·후 연산자 순서 모두 처리), `src/step3/ImportPanel.tsx` 검수 체크리스트 4항목(텍스트·숫자, 다단/표 읽기 순서, 표 선·벡터 구조, 이미지 크롭/복원) 노출. 원본 문서 저장 방식/STEP1·2/표 구조 자동 재구성 기능 불변. 체크리스트는 안내용이고 항목별 개별 승인을 강제하지 않음.
- **실패 경과/원인:** 첫 코드 `03b2a527...` CI [#39200328670](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200328670) E2E의 테스트 따옴표 `SyntaxError`로 FAIL. 구문 보정 `595369018...` CI [#39200525378](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200525378)은 **실제 clip-only PDF 위험 1회** 오탐으로 FAIL. `pdfjs-dist`에서 동일 합성 PDF operator list를 직접 파싱한 `117e4a133...` CI [#39200817859](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200817859) 단위 37 PASS·1 FAIL로 원인 확정: PDF.js가 **`clip > constructPath`**를 전달(기존 가상 단위 테스트는 `constructPath > clip` 순서만 가정). 동일 방식 반복 없이 양쪽 순서 분리 판정으로 수정.
- **최종 검증:** **코드 SHA `90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee`** [Actions #39200950625](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200950625) **completed/success**(2026-10-19T04:46:15Z). Node **38/38 PASS, 0 FAIL, 0 SKIP**, TS/Vite build PASS, Chrome STEP1/2/3 및 Linux Edge155 STEP1/2/3 두 job 성공. 양쪽 E2E 로그에 `PASS STEP3 CLIP-ONLY VECTOR CONTROL`(클립 전용 PDF 벡터 0, 기존 이미지 클립 경고 유지), `PASS STEP3 CHECKLIST`(4항목), `PASS STEP3 MIXED VECTOR RISK`(혼합 PDF 벡터 위험 3), `PASS STEP3 SOURCE/REPRINT COMPARISON`(13/13 마커·래스터·A4·기존 저장 문서 무손상) 확인.
- **검증 문서:** feature docs-only commit `d1a89d8b6a96f72225208e5a9b1144e5413eaa92`, `docs/STEP3_VECTOR_CLIP_FALSE_POSITIVE_AND_REVIEW_2026-10-19.md` ([보기](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_VECTOR_CLIP_FALSE_POSITIVE_AND_REVIEW_2026-10-19.md)). CI 성공은 앞선 코드 SHA 기준이며 후속 문서 전용 커밋과 구분.
- **검증 한계:** PDF.js의 클립·페인트 합성 연산자에서 오탐/누락 가능성, 표 선/셀·다단 정확한 순서, SVG/특수 벡터/주석, 이미지 픽셀/투명도 정확성, 실제 사용자 PDF 5~10개/Windows Chrome·Edge 실출력·육안 **미검증**. 경로 위험 수치 0이어도 원본 그래픽 완전 보존을 의미하지 않음. synthetic fixture만 테스트, 외부 서버 업로드 없음.
- **상태/다음:** `feature/step3-pdf-import-20261019` Draft PR #3 open/draft/unmerged; **main 기능 미병합**, Vercel/Production 미적용. 비공식 STEP3 65~70%, 전체 약38% 유지. 다음 `ㄱ`: 클립+페인트 혼합/투명도 등 누락·오탐 경계 추가 또는 사용자 수용 판정 기준 확대. 기능 병합/STEP4 착수는 사용자 별도 승인 전 금지.

## 2026-10-19 14:06:12 KST — STEP3 클립+벡터 페인팅 혼합 PDF 실제 OperatorList 오탐/누락 검증
- **목표·구현 범위:** PDF.js `constructPath`가 경로를 그리지 않고 끝낸 `W n`과 같은 경로를 클리핑하며 그린 `W S`를 구분. `src/step3/vectorRisk.ts`에서 실물 `argsArray[i][0]`로 packed terminal `OPS.endPath`(클립-only)는 위험 카운트 제외, `OPS.stroke/fill`(실제 그리기)은 clip이 선행하더라도 위험에 포함. `argsArray` 없는 기존 synthetic/legacy path는 clip 인접 fallback 유지. PDF.js 6.4.299 기준. **실제 표 셀/원형 도형 복원 기능을 구현한 것은 아님**.
- **신규 재현·테스트:** `tests/fixtures/step3-clipped-pdf.mjs`에 선택적 클립 안/밖 stroke, 바깥 fill, 동일 경로 W S 매개변수 추가(기본 기존 fixture 유지). `tests/step3-vector-risk.test.ts`에서 **6가지 실제 합성 PDF를 PDF.js로 직접 파싱**, 원래 terminal op 기반 W n/W S/W f 회귀 +1. `tests/step3-browser.mjs`에서 같은 경로 clip+stroke의 벡터 위험 양수 및 기존 클립된 이미지 경고·문서함 무변경 검증.
- **처음 발견한 실제 실패:** 검증 목적 테스트 `be35e185b3cbce371ec4edce3401568024506cc4` [Actions #39202071379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202071379) Node **38/39**, `W S` 같은 경로를 위험 0으로 누락. 진단 `0281d6cdac11915b2ebd02a6549fdac640ffcbbb` [#39202172463](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202172463)에서 진짜 PDF.js `clip > constructPath`의 `argsArray[i][0]`: `W n`은 **28(endPath)**, `W S`는 **20(stroke)** 확인. Mozilla pdf.js evaluator가 원래 terminal `fn`을 `constructPath` 첫 인자에 전달한다는 소스 구조와 일치. 매직 숫자는 코딩하지 않고 `OPS` 상수와 비교.
- **최종 검증:** 코드 SHA **`4b527401cc8bdba9218b9aba4fca5537e24c77cc`**, [Actions #39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889) **completed/success** (2026-10-19T05:04:16Z), Node **40/40 PASS/FAIL0/SKIP0**, TS/Vite build PASS, Linux Chrome 전체 STEP1~3·Edge155 전체 STEP1~3 CI jobs 모두 success. 양쪽 실제 로그 `PASS STEP3 CLIP-ONLY VECTOR CONTROL`, `PASS STEP3 CLIP+STROKE PDF`, `PASS STEP3 MIXED VECTOR RISK`, `PASS STEP3 SOURCE/REPRINT COMPARISON`: 클립-only 위험 0, W S 위험 양수, 혼합 2p 표 경로 위험 3, 텍스트 13/13·A4·raster·기존 문서 보존.
- **변경·위험 경계:** STEP1/2 앱·IndexedDB/localStorage 사용자 문서 무변경, 기능 변경은 벡터 계측과 합성 테스트만. 실제 PDF 사용/외부 전송 없음. pdf.js 버전·특수 XObject/클리핑+투명도/주석·벡터 표 원형 복원·다단 실제 순서·이미지 픽셀/색상·Windows 실환경·실제 사용자 PDF 5~10개는 **미검증**. 위험 수치 0도 완전 보존 증명이 아님.
- **문서·PR:** [상세 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_MIXED_CLIP_AND_PAINT_RISK_VALIDATION_2026-10-19.md) feature docs-only SHA `90b7e995f263701e57aede91a8bf0e44b2778d80` (CI 코드 SHA와 구분). `feature/step3-pdf-import-20261019` Draft PR #3 open/draft/**unmerged**, main STEP3 기능 미병합. Vercel/Production 배포 없음. STEP3 비공식 약65~70%, 전체 약38% 유지.
- **다음 `ㄱ`:** pdf.js Form XObject/투명도 등의 또 다른 누락 경계 또는 실사용 수용 품질 1단위 시험. main 병합 및 STEP4 사용자 별도 승인 전 금지.

## 2026-10-19 14:19:35 KST — STEP3 투명도/Form XObject 원본 합성 위험 탐지 및 CI 검증
- **목표/방법:** 사용자 PDF의 투명도/알파/혼합모드/투명 그룹 및 Form XObject가 PDF→PNG/블록 재구성에서 누락·왜곡돼도 성공으로 오인하지 않게 **손실 위험 신호**를 원본 검수 UI에 노출. PDF.js `getOperatorList()`의 `OPS.setGState` `CA/ca<1`, 비정상 `BM`, 활성 `SMask`, `OPS.beginGroup`, `OPS.paintFormXObjectBegin` 범위를 구분. **신호 개수=객체 수/픽셀 동일성/복원율 아님**, Form/투명 효과를 실제로 재현하지 않음.
- **변경:** 신규 `src/step3/graphicsRisk.ts` 순수 스캔; `src/step3/pdf.ts` → `structure.ts` 페이지별 compositionRisk 및 원본 검수 경고 전달; `ImportPanel.tsx` 합성 위험/폼 범위 총합·4항목 체크리스트 문구 강화. 이전 STEP1/2 저장 로직, 이미지 PNG decode, 다단/표 위험 지표, 원본/기존 문서 데이터 **무변경**.
- **검증 데이터:** 완전 합성 A4 1p, 선택 가능한 ASCII 텍스트 마커 2개, Form XObject 내부 bitmap XObject+벡터 rectangle, `ExtGState alpha 0.4 + 투명 Group`과 `alpha 1 + 일반 Form` variant. Probe-only SHA `67646c0d4233df350b78c36f5e7d7de69ba3c424` [Actions #39203296609](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203296609) **SUCCESS**로 실제 PDF.js Form/graphics op 노출 확인.
- **최종 PASS:** 코드 `1ebbb7958c477c309e22e24fed7255658f56b58b` [Actions #39203639740](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203639740) **completed/success** (2026-10-19T05:18:05Z), Node **43/43 PASS, fail0, skip0**, TS/Vite build PASS, Linux Chrome STEP1/2/3 + Microsoft Edge155 STEP1/2/3 두 CI job SUCCESS. 두 브라우저 로그: 투명 Form **투명도 합성 위험 신호 3 / Form 범위 1**, 불투명 Form **투명도 위험 0 / Form 범위 1**, 원본 선택 가능한 텍스트 유지·검수 전 기존 문서 불변. 이전 clip-only/clip+stroke 및 2p 표/이미지/원본-출력 **13/13** 회귀 유지.
- **산출/문서:** `tests/fixtures/step3-transparency-form-pdf.mjs`, `tests/step3-transparency-form.test.ts`, `tests/step3-browser.mjs`. [상세보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/step3-pdf-import-20261019/docs/STEP3_TRANSPARENCY_FORM_RISK_VALIDATION_2026-10-19.md) feature docs-only SHA `faec84e388da0f7a6d71f71c1b8d14e18d9f3098` (CI 검증 대상은 이전 코드 SHA와 구분).
- **제한/상태:** 실제 5~10 사용자 PDF/Windows Chrome·Edge 장문·인쇄/육안, 투명도 픽셀·Form 내부 조합 보존/SoftMask 실물 수용·주석/복잡 Form 미검증. Risk 0이라도 완전 복원 보장하지 않음. [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/**main STEP3 기능 미병합**; STEP4 미착수, Production/Vercel 미적용. 비공식 STEP3 약65~70%/전체 약38% 유지.
- **다음 `ㄱ`:** 중첩 Form·SoftMask·BlendMode 합성 실제 PDF 오탐/누락 경계 또는 실문서 acceptance 평가 단계 1단위. main 병합 및 STEP4는 사용자 별도 승인 전 금지.

## 2026-10-19 14:48:11 KST — Windows Electron 설치형 MVP 개발 브랜치 / Windows 실물 EXE 자동검증
- **사용자 요구:** 구매자가 CLI/Node.js 없이 설치 EXE 더블클릭으로 Windows 데스크톱 ASTRA를 사용하도록 준비. 기존 STEP3 개발/합병과 분리된 신규 브랜치 `feature/windows-electron-package-20261019` (기존 main STEP1/2 기반). **STEP3 PDF 가져오기 기능은 아직 이 설치 파일에 포함되지 않음**.
- **구현:** Electron 44.9.0+electron-builder 26.15.3, 보안 표준 앱 프로토콜 `astra://app`, React/Vite 상대 번들, Windows NSIS x64 Installer, 앱 전용 userData의 IndexedDB/localStorage, Windows native Save dialog, 외부 HTTP(S)/새 창 금지, context isolation/sandbox.
- **CI 검증 코드 SHA:** `ab89fcb85ce2a847eba751254543983b50a59d82`; [Windows Actions #39205924586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586) **completed/success** (2026-10-19T05:44:30Z). STEP1/STEP2 Node **16/16 PASS**, 데스크톱 보안/번들 경로 **3/3 PASS**, TypeScript/Vite build PASS, 실제 Windows Electron 개발용 실행 + `win-unpacked/*.exe` **패키징 실행** 각각 PASS (React 렌더, Print API 존재, IndexedDB 생성, localStorage 새로고침 유지).
- **EXE:** `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe` 실제 Windows NSIS 빌드/해시/Actions 업로드 PASS. SHA256 `26B6C2DEC5453A1C6233E7C7BED1ACECEE077F88103C757034A8D93F4A0A8FBC`. [시험용 ZIP Artifact #12165647731](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586/artifacts/12165647731), 약112MB, 서명/배포 적합성 미확인. 디렉터리 `release/`는 gitignore, GitHub repo에는 설치 바이너리 커밋하지 않음.
- **증거·브랜치:** [개발 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_ELECTRON_PACKAGING_2026-10-19.md) doc-only commit `a6050ffe9c50e073804b16e4432db50ec35d69f7`. [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) **open/draft/unmerged**. STEP3 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) **unmerged**; main 앱 기능/기존 저장 데이터 무변경.
- **유효 범위/금지:** 아직 실제 고객 Windows PC에 설치·삭제·재설치·업그레이드, Windows 한글/이미지/장문 PDF 수동 인쇄, JSON 수동 데이터 이동, 아이콘·코드 서명/SmartScreen/EULA/유료 라이선스·STEP3 실문서 PDF 검증 **NOT RUN**. 무서명 시험용 Artifacts 고객 판매 금지. 기존 Chrome/Edge 브라우저 데이터가 Electron으로 자동 이동되지 않음을 명시. 비공식 전체7단계 진행률 약38%는 유지(패키징은 별도 상품화 트랙).
- **다음:** Windows 10/11 실제 설치/삭제 및 인쇄 수용, `.localdoc.json` 가져오기/내보내기와 버전 간 사용자 데이터 보존 검증. 실제 STEP3 탑재는 PR3 별도 검증·명시 승인 뒤, PR4/main 병합도 별도 승인 전 금지.

## 2026-10-19 15:01:21 KST — Windows Electron GUI 원본 PDF 저장 시험판(별도 기능 브랜치) 검증
- 사용자 목표: 고객에게 Node/npm/CLI를 요구하지 않는 Windows GUI 설치 프로그램 형태로 ASTRA를 배포. 안정된 STEP1·2 main 기반으로 별도 feature/windows-electron-package-20261019 브랜치를 사용했으며 STEP3 Draft PR #3 **미포함**, main 기능 **미병합**.
- 기존 Electron 44.9.0 / electron-builder 26.15.3 Windows x64 NSIS unsigned installer 및 secure astra://app 프로토콜, sandbox/컨텍스트 격리, IndexedDB/localStorage 프로그램 저장 분리 구조를 그대로 유지.
- 이번 코드 변경: desktop/preload.cjs에서 단일 제한된 astraDesktop.savePdf() 브리지 노출, desktop/main.cjs에서 앱 창/Origin 검사·Windows showSaveDialog·webContents.printToPDF(A4/CSS·배경 포함)·파일 저장·취소/오류 상태 처리. src/desktopPdf.ts 웹 window.print fallback, STEP1 App·STEP2 Workspace GUI 연동. STEP2 이미지 decode/font ready/저장 flush 검사 전제 유지.
- 실제 Windows GitHub Actions [#39206761720](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720) completed/success, 코드 SHA e11076cf77946416bc59bcaa88227c8265499ab3. Node **19/19 PASS**(기존16+추가3), desktop 보안 테스트 **3/3 PASS**, TypeScript/Vite build PASS, 개발 Electron과 패키징된 win-unpacked EXE의 secure origin·로컬 IndexedDB/localStorage·IPC PDF 파일 생성·저장·재읽기 **모두 PASS**(15,257 bytes). 테스트는 격리된 임시 userData에만 기록하고 삭제.
- 실제 테스트 NSIS 파일 ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe, SHA256 1FEB8C6801EB2870479955A5669B9405AC3117490A99954230AECB1470D3C84C. [Actions Artifact ID 12165323804](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720/artifacts/12165323804) ZIP 112,306,801 bytes, 7일 보존(2026-10-26 만료 예정), unsigned **시험판**이며 고객 배포 릴리스 아님.
- 코드 검증 이후 데스크톱 보고서/README docs-only SHA d62f89b7ebc04eb0de3b6b2c44363c2e08996312; [Windows 데스크톱 GUI PDF 저장 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_DESKTOP_NATIVE_PDF_EXPORT_2026-10-19.md) 참조. CI 성공은 이전 코드 SHA 대상임.
- **미검증:** 실제 NSIS 고객 PC 설치/재설치/삭제·바탕화면 바로가기, 저장창 사용자가 직접 폴더/취소/덮어쓰기 조작, 한글·장문·이미지 PDF 육안/A4 출력, 사용자 기존 웹 문서→데스크톱 이관, 코드 서명/SmartScreen, 상용 사용권/업데이트/지원. Smoke는 사용자 폴더가 아닌 임시 프로필 파일 기록으로 실제 PDF 생성만 검증.
- 기존 STEP3의 CI Node43/43·Linux Chrome/Edge SUCCESS 상태와 Draft PR #3 미병합 및 사용자 실제 PDF 5~10개·Windows 시각 검수 미완료 상태 그대로. STEP4~7은 별개, 7단계 전체 비공식 진행률 약38% 유지. **다음 개발:** 실설치·실 PDF·아이콘/서명 게이트 검증, STEP3 통합은 별도 승인 후 수행.

## 2026-10-19 15:13 KST — Windows NSIS 실제 무인 설치·앱 실행·제거 자동 수용 검증
- **완료 범위:** 별도 `feature/windows-electron-package-20261019`/Draft PR #4에서 기존 unsigned Windows x64 NSIS 설치 파일을 **GitHub-hosted Windows 러너**에 실제 `/S /D=격리된 임시폴더` 설치 → 설치된 앱 런타임+PDF 생성 → `/S` 제거까지 검증. `main` 앱 기능/STEP3 Draft PR #3 **변경·병합 없음**.
- 변경 파일: `tests/windows-installer-lifecycle.ps1` 신규(Windows GitHub Actions+RUNNER_TEMP만 허용, 임시경로 사전 확인, 설치 exe/Uninstall exe 확인, 바탕화면·시작메뉴 shortcut 검증, 실제 설치 EXE `--astra-desktop-smoke` 실행, silent 제거, 설치 경로/shortcut 제거·synthetic userData marker 값 보존, 제한적 cleanup), `.github/workflows/windows-desktop.yml` 패키징 이후 수명주기 검증 필수 단계, `tests/desktop-shell.test.cjs` 안전 제약 단위 테스트 +1.
- **실제 증거:** CI 코드 SHA `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5`, [Windows Actions #39208406254](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254) `completed/success`, 2026-10-19T06:13:03Z. Node **19/19 PASS fail0 skip0**, desktop 보안/수명주기 **4/4 PASS**, TypeScript/Vite build PASS, 기존 dev Electron/packaged EXE smoke PASS, **실제 설치된 EXE** React·IndexedDB/localStorage·PDF 파일 15,257 bytes 저장/재읽기 PASS. 실제 log `PASS ASTRA NSIS INSTALL`, `PASS ASTRA NSIS SHORTCUTS: desktop=1 start-menu=1`, `PASS ASTRA INSTALLED EXE`, `PASS ASTRA NSIS UNINSTALL`(설치 경로·두 링크 제거, 합성 userData marker 유지).
- **신규 test artifact:** `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe` **미서명 개발용 테스트**, SHA256 `C49D217B48ECA4ABAA80296D2E03C80D0C331F8148C361D6C267DB5918A7977A`; [ZIP Artifact 12165714586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254/artifacts/12165714586), 112,306,806 bytes, 만료 2026-10-26T06:12:54Z. **이전 ZIP/SHA는 구 시험 버전이므로 최신 링크와 혼동 금지**.
- **한계:** Windows runner silent `/S` 자동 설치/제거는 성공했으나 실사용 Windows 10/11 고객 PC의 보이는 설치 마법사·권한·스마트스크린/백신·저장 대화상자 버튼·장문/한글/표/이미지 PDF 육안 및 정식 코드 서명/업데이트는 **NOT RUN**. appData 유지 판정은 합성 마커 1개에 한정, 실제 고객 데이터 업그레이드 보존이나 STEP3 포함 증명이 아니다. Electron 시험판은 여전히 **STEP1·2 전용**.
- [Windows 설치·제거 상세 검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_NSIS_INSTALL_UNINSTALL_ACCEPTANCE_2026-10-19.md), 기능 검증 SHA `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5` / 그 뒤 docs-only SHA `b13ec1feb02cda3cbea63280b25da8bfdcc8e7a5` 구분. PR4 Draft/open/unmerged; STEP3 Draft PR3 별개, 메인 기능 병합/STEP4 착수 명시 승인 전 금지. 기존 로드맵 전체 비공식 약38% 유지(데스크톱 별도 트랙).
- **다음 `ㄱ` 작업:** A4 실제 PDF 원본-출력 규격·한글·복수 페이지와 이미지 보존을 구조 수준으로 자동 검증하고, 고객 실기 GUI/수동 육안 검수는 별도 미검증으로 유지. 또는 설치 업데이트 후 합성 IndexedDB 데이터 보존 검사 1단위.

## 2026-10-19 15:38:16 KST — Windows 설치형 실제 출력 PDF A4·한글·2p·이미지 구조 검증
- **기능/CI:** Windows 독립 Draft PR4 코드 SHA `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`, [Actions #39210319075](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075) **completed/success**(2026-10-19T06:33:02Z). Node **19/19 PASS**, desktop security/fixture **5/5 PASS**, TypeScript/Vite build PASS, GitHub Windows NSIS 임시 설치·실제 EXE 실행·PDF 디스크 생성·파일 재검증·silent 제거·shortcut/userData 합성마커 보존 PASS.
- **실제 PDF 내용 근거:** 설치된 Electron EXE에서 렌더링한 합성 문서를 임시 파일에 저장하고 dev 전용 `pdfjs-dist@6.4.299`로 재파싱. **A4 정확히 2페이지**(폭 ~595.28pt/높이 ~841.89pt), 페이지 분리·식별자 순서, **한글·숫자·라틴 문자 6/6 각각 1회**, PNG 래스터 draw opcode **1건** 확인. 실측 로그 `PASS ASTRA INSTALLED PDF CONTENT: A4 x 2, Korean/numeric markers 6/6, raster draw 1`.
- **구현:** `desktop/pdf-acceptance-fixture.cjs`가 64x64 합성 RGB PNG를 생성하여 STEP2의 실제 `.paper-surface` 미리보기 DOM에 두 페이지와 한글 문장 삽입; `desktop/main.cjs`의 `--astra-desktop-smoke --astra-pdf-acceptance`는 `GITHUB_ACTIONS`/`RUNNER_TEMP` 안전 게이트를 통과해야 실행. `tests/verify-desktop-pdf.mjs`에서 MediaBox·text·image operator 대조, `tests/windows-installer-lifecycle.ps1`에서 검증 후 PDF 1개 정리, shell 단위 검사 +1. **실제 고객 프로젝트 데이터/IndexedDB 변경 없음**.
- **아티팩트:** unsigned 시험 NSIS `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, SHA256 `FC91757AA962C167BA8D814A3F939ECBE3562085C45F5C32C894E4D16D0158D7`, [Artifact #12167606844](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075/artifacts/12167606844), 112,308,696 bytes ZIP, 2026-10-26T06:32:53Z 만료. 기능 CI SHA `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`와 문서-only feature SHA `fa7c760332c89f36731f3176630b4997ee5185a3` 구분.
- **미검증/한계:** 이번 내용 대조는 **합성 미리보기 DOM**에 한정됨. 실제 STEP2 편집/저장 UI를 거친 고객 장문 문서, 표·이미지 픽셀 동일성·한글 글꼴 육안, Windows 저장 대화상자 수동 조작·SmartScreen·업그레이드·서명·상용 판매 인수 **NOT RUN**. STEP3 PDF 가져오기 기능은 현재 Windows 시험판에 **미포함**.
- **브랜치·다음:** [Windows Draft PR4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) open/draft/unmerged; [STEP3 Draft PR3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) 별개. main 기능 병합/STEP4 착수는 사용자 명시 승인 전 금지. 비공식 전체 약38% 유지, Desktop 상품화 별도. [상세 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_PDF_CONTENT_ACCEPTANCE_2026-10-19.md). 다음 `ㄱ`: 실제 STEP2 합성 프로젝트 데이터 저장→PDF 구조 대조 또는 Windows 앱 업그레이드 사용자 프로필 보존 검증.

## 2026-10-19 16:11:22 KST — Windows STEP2 실제 저장 프로젝트 PDF 자동 수용 PASS
- 대상 Windows 별도 기능 브랜치 `feature/windows-electron-package-20261019`, [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4). **main 기능 코드 미수정**, STEP3 Draft PR #3 미수정·미병합.
- 검증 코드 SHA `c5113056ed4b779b245a50fd42d33a32b46d4b1b`, [GitHub Windows Actions #39214047605](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605) `completed/success` (head_sha 일치, 2026-10-19 16:11:22 KST).
- Node **19/19 PASS**, desktop 보안/수용 연결 **6/6 PASS**, TS/Vite build, 개발용 Electron, 패키지 EXE, NSIS 실제 silent 설치/제거·단축키/합성 userData sentinel 검증 **PASS**.
- 새 단계: React STEP2 실제 편집 화면에서 합성 한글·숫자·장문 65행·PNG 2×2 입력 → `IndexedDB` 문서/asset 저장 → Electron 앱 URL 재로드 후 저장 데이터 직접 검사 및 이미지 디코딩 → 실제 설치된 EXE `printToPDF` 출력 파일 저장 → 별도 PDF.js로 **A4 3페이지, 식별자 5/5 각 1회, 래스터 draw 1, 문서함 이름 인쇄 누락 없음** 검증 **PASS**. 이전 직접 DOM 주입 A4 2페이지·6/6 출력 검사도 PASS 유지.
- 테스트 구현 `desktop/step2-project-acceptance.cjs`, `desktop/main.cjs`의 CI 전용 모드, `tests/windows-installer-lifecycle.ps1`, `tests/verify-desktop-pdf.mjs`, `tests/desktop-shell.test.cjs`. 기능 정상 경로/고객 DB/원본 수정 없음.
- 기능 성공 CI 이후 feature docs-only 커밋 `883568e2f0f47186cb561c9d82bbc985a3cb4742`, 상세 보고서 `docs/WINDOWS_STEP2_STORED_PROJECT_PDF_ACCEPTANCE_2026-10-19.md`. 시험용 unsigned EXE SHA256 `60048F38227DB08C43F9BC073938AC94D1BFD94A07AF91C424654EB9B8E134E6`; [Artifact 12168803144](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605/artifacts/12168803144), ZIP 112,310,427 bytes·2026-10-26T07:11:12Z 만료.
- **NOT RUN:** 고객 실문서 5~10개·PDF 픽셀/표·한글 폰트 육안, Windows 저장창 수동 클릭/취소/덮어쓰기/실사용 PC SmartScreen, 실제 데이터 업그레이드 보존, 코드 서명·정식 판매. STEP3 PDF 가져오기는 Windows 설치형에 **미포함**. PR3/PR4 Draft/open/unmerged; 병합·STEP4 승인 전 금지. 전체 비공식 약38% 유지, 데스크톱 별도 상품화 트랙.
- **다음 `ㄱ`**: 동일 사용자 프로필에서 설치판 버전 업그레이드 전후 합성 STEP2 문서+PNG IndexedDB 보존(기존 sentinel 1개 검증 확대)을 한 단위 검증. 사용자 실제 문서는 외부 CI로 올리지 않음.

## 2026-10-19 16:22:28 KST — Windows STEP2 동일 프로필 별도 EXE 재실행 보존 PASS
- PR4 feature 코드 `0c627cdca0668a6f7548a1407eb8d5088faaa264`, [Windows CI #39215369203](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39215369203) `completed/success` (head SHA 일치), Node 19/19·desktop 6/6·빌드·NSIS 설치/제거 PASS.
- 실제 STEP2 UI 합성 문서+PNG IndexedDB 저장 → A4 3페이지/식별자 5/5/래스터 1 출력 → **별도 설치 EXE 두 번째 프로세스에서 동일 CI 격리 프로필로 재실행, 문서·이미지·캡션·자산·실제 이미지 디코딩 보존 PASS**. 로그 `PASS ASTRA STEP2 PROFILE PRESERVED`, `PASS ASTRA STEP2 SECOND EXE LAUNCH` 확인.
- 보고 `docs/WINDOWS_STEP2_RESTART_PRESERVATION_2026-10-19.md` (PR4 feature docs commit `4249efe10b7959a7899b7af9e7b8a78ac237c1eb`). 시험용 unsigned EXE SHA256 `AB74148E4DD30CBB7C9996790271AF4832DDD0A6896856211F53FDDB5D3E6AD2`, [Artifact #12169552072](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39215369203/artifacts/12169552072) 112310681 bytes, 2026-10-26T07:22:28Z 만료.
- **미검증**: 동일 버전 재실행이며 **서로 다른 버전으로 업그레이드 아님**. 실제 고객 PC GUI/실문서 품질·코드서명/SmartScreen/상용 수용 미검증. PR3/PR4 Draft/open/unmerged, STEP4·main 기능 병합 별도 승인 전 금지. 전체 7단계 비공식 약38% 유지.
- 다음 `ㄱ`: 상이한 버전 두 빌드로 동일 CI 프로필의 실제 STEP2 문서+PNG 보존/재출력 확인. 고객 데이터 사용 금지.

## 2026-10-19 16:33 KST — NSIS 두 버전 실제 업그레이드 STEP2 문서·PNG 보존 PASS
- Windows CI [#39216361190](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39216361190) **completed/success** / 검증 소스 SHA `5b5a833dd9611f9dd0d90af803c6ce7b0735cc0d`; Node 19/19, desktop 6/6, Vite/Electron/NSIS 회귀 PASS.
- CI에서 별도 0.1.0/0.1.1 NSIS 설치 파일 생성. **0.1.0 실제 설치 → STEP2 UI 합성 문서+PNG IndexedDB 저장 → PDF.js A4 3쪽/텍스트 5/5/래스터1 확인 → 0.1.1 동일 경로 덮어 설치 → 새 EXE에서 기존 문서/PNG 복원 → 제거** 실제 Windows runner 로그 PASS.
- 0.1.1은 **CI에서만 패키지 버전 번호를 바꾼 동일 앱 코드·동일 저장 스키마 빌드**. 따라서 **버전만 다른 설치 패키지 업그레이드 시 데이터 보존**을 검증한 것이며 **기능 코드/스키마 변경에 따른 마이그레이션은 미검증**. 고객 PC 수동 인수, 서명·SmartScreen, 실문서 시각 품질도 미검증.
- 근거 [PR4 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_NSIS_VERSION_UPGRADE_STEP2_PERSISTENCE_2026-10-19.md), feature docs 커밋 `057ccef81b97dd741c46002c28292bfdf544362f`; unsigned CI 전용 0.1.1 EXE SHA256 `EBDD0945CCF242CA126A109DA20772D3854DB0A292E5A39BBE28977F83F559FA`, [Artifact #12169723064](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39216361190/artifacts/12169723064), 2026-10-26 만료.
- 다음 `ㄱ`: 기존 앱 코드 또는 IndexedDB 스키마 **실제 변경**을 재현한 호환성 검사 가능성 확인 및 작은 단위 실행. PR3·PR4 Draft/open/unmerged, main 기능 병합/STEP4 별도 승인 전 금지; 전체 7단계 추정 약38% 유지.


## M09-B final 10-point handoff — 2026-10-27 KST
1. **Objective/requirements/stack:** offline PDF source→explicit manual review→redesigned A4 PDF, content preservation paramount; React/TS/Vite/PDF.js/IndexedDB, Windows Electron/NSIS. Final BASIC 30k/PRO 60k/BUSINESS 90k and equal offline Korean AI rewriting remain contractual future scope, not sold.
2. **Completed:** `src/step3/ImportPanel.tsx` uses request generation and unmount cleanup to reject late PDF.js result before transient original/image Blob allocation and state update. `tests/step3-race-browser.mjs` deterministic actual PDF `File.arrayBuffer` hold, real navigate to STEP1 and back, verifies no orphan source, original V2 snapshots unchanged, legitimate V1 migration permitted. Source/PDF bytes/DB schema unchanged.
3. **Exact verification:** source+test `1abe28f6b7751ec6d0483d0b55095e006608ff93`. [Chrome+Edge #40371859883](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859883) **SUCCESS 2/2** both real `PASS M09-B CHROME/EDGE STALE UNMOUNT`, Node 61/61, build; [Windows #40371859794](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40371859794) **SUCCESS**, 61 unit/12 desktop, 8 A4 installed PDF, STEP3/native save, STEP2+PNG upgrade. Physical buyer PC and M09-B Windows direct GUI NOT RUN.
4. **State:** M09-A and M09-B narrowly scoped **DONE**. PR9 Draft unmerged. Genuine Korean offline model, real buyer PDFs/PC, 20/30 template SKUs, licensing/signing/distribution support **WAIT/BLOCKED BY OWNER APPROVAL**, sale NO-GO.
5. **Errors and retry:** Before fix Edge #40369980500 reproduced orphan `URL.createObjectURL` count1; chose cheap generation+unmount guard vs deep worker cancellation. First fix #40370194342 failed test assuming no new docs; legitimate old STEP1 V1→V2 migration added one. Test-only corrected IDs/content/migration assertion, subsequent success. Do not repeat obsolete count-only assertion or use undocumented cancel APIs.
6. **Repository/refs:** `hibi89/astra_pdf_redesigner` / `integration/astra-commercial-core`; exact tested code SHA above, later docs-only SHA retrieve from GitHub. `src/step3/ImportPanel.tsx`, `tests/step3-race-browser.mjs`, `.github/workflows/ci.yml`, `docs/commercial/M09_B_STALE_IMPORT_RACE_20261027.md`. `lead/astra-commercial-20261025` maintains orchestration.
7. **Runtime/deploy:** GitHub Node22 Linux Chrome+Edge and Windows x64 Electron NSIS; local npm scripts, no Vercel URL. GitHub Action unsigned installer is not an approved consumer release.
8. **Originals/security/backup:** main/PR3/PR4 untouched; raw original designs, STEP1 localStorage v1 and STEP2 IDB V2 regression guarded. Only synthetic PDF in CI, never customer file/token/model acquisition, no external transmission. Git SHA history enables rollback.
9. **Next:** incremental source integrity/cancel stress QA if self-contained, or owner-authorized real PDF/Windows manual acceptance. Genuine GGUF download/model/license/CPU is a separate explicit approval and proof gate. Maintain current 8/8 BASIC, no 20/30 SKU or AI marketing.
10. **Confirmed:** 2026-10-27 KST, exact Chrome/Edge/Windows final workflow conclusions and all M09-B markers inspected; later docs-only changes are not retested app source.


## M09-C final ten-point handoff — 2026-10-27 KST
1. **Goal/confirmed contract/tech:** Offline PDF import→manual review→new styled A4 PDF using React/TS/Vite/PDF.js/IndexedDB/Electron NSIS. Source immutable, 30k BASIC/60k PRO/90k BUSINESS eventual SKUs, same opted-in offline AI rewrite required before commercial sale.
2. **Completed:** analysis progress now renders independent `busy&&parsing` Cancel button even with `draft=null`; pressing it invalidates M09-B request token and allows immediate replacement. Late old extraction cannot allocate original Blob URL or replace newer draft. Loaded review cancel preserved, active saving remains non-cancellable, no PDF.js internal cancellation or DB change.
3. **Tests/verification:** exact code/test SHA `2ba0b4e57f7d521ba9482a6d626411f10961f9b9`. [Chrome+Edge #40376435854](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435854) SUCCESS 2/2 with exact both-browser `PASS M09-C CHROME/EDGE CANCEL/RETRY`, Node61/61/build PASS, old M09-A/B etc PASS. [Windows #40376435967](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40376435967) SUCCESS Node61/desktop12, installed native STEP3 print, 8/8 BASIC A4 layouts and STEP2+PNG in-place upgrade preservation. Buyer Windows manual interaction and direct M09-C Windows UI click NOT RUN.
4. **State:** M09-A/B/C scoped DONE. Actual consumer PDF/PC, genuine commercial Korean offline GGUF, PRO20/BUSINESS30, installer signing/licensing/support still WAIT and sale NO-GO. PR9 Draft unmerged.
5. **Failures/stop-pivot:** initial M09-C Edge failed `before.docs.length` from CDP script expression not executing Promise. One test-only correction then Edge error `cancelButton.disabled` because review footer is guarded by `draft&&`; substantive layout pivot implemented `busy&&parsing` cancel outside draft; final both browsers and Windows green. Do not repeat failed shell count/conditional assumptions. No evidence of customer V2 corruption.
6. **Repository/refs/paths:** `hibi89/astra_pdf_redesigner`, `integration/astra-commercial-core`; exact tested code above, later docs-only head to recheck, protected main/PR3/PR4, Draft PR9 to `lead/astra-commercial-20261025`. Files `src/step3/ImportPanel.tsx`, `tests/step3-cancel-browser.mjs`, `.github/workflows/ci.yml`, `docs/commercial/M09_C_PARSE_CANCEL_RECOVERY_20261027.md`.
7. **Deployment/environment:** Node22 Linux CI Chrome/Edge, GitHub hosted Windows x64 installed Electron/NSIS, npm test + npm run build, no Vercel/Production (N/A); test EXE unsigned and not consumer release.
8. **Originals/backup/secrets:** Existing STEP1 localStorage v1, STEP2 IndexedDB V2, two design PNG, customer PDFs and original repository branches protected. Only synthetic data generated in CI, no customer API/paid/model asset/token. Git pre-fix `461a2057...` / working base revisions for rollback, no force push.
9. **Next priority/procedure/completion:** M09-D candidate installed Windows UI synthetic cancellation test or owner-approved real PDF/PC user acceptance. Ensure source-review consent/DB unchanged; require Chrome/Edge and Windows green exact SHA; major model acquisition or release gated by explicit owner approval. No unsupported claims of Windows M09-C direct click.
10. **Checked evidence:** 2026-10-27 KST. Exact final jobs #40376435854 and #40376435967 completed/success and named browser/native markers inspected; document-only later commits do not change code or independently constitute a test.



## 2026-10-27 17:27 KST — STEP 3 PDF 가져오기 재개 / 검수 편집 실행 취소·다시 실행

- **승인 범위:** 최신 사용자 승인은 기존 STEP 3 PDF 가져오기 개발을 계속 허용한다. OCR은 별도 승인 전까지 제외한다. 과거 STEP2-only 문구는 초기 main 안정화 기록이며, 실제 STEP3 PR #3 개발 이력 및 최신 승인은 원격 `AGENTS.md`의 2026-10-27 갱신(commit `08e68699e8f58a640ef119b832a60a92d6d87e5f`)에 정합되게 기록했다.
- **원격 기능/테스트 SHA:** `3a704921b24b83b05701c6a48c9526d8580f9a6a`, `integration/astra-commercial-core`; PR #9는 Draft/open/unmerged.
- **이번 보강:** PDF 확정 전 편집 초안에 최대 8단계 메모리 내 실행 취소/다시 실행 추가. 텍스트·분류·순서·이미지 포함 변경을 초안 상태에서 되돌릴 수 있고, 수정·되돌리기·다시 실행 뒤 원문 확인 동의는 다시 받아야 한다. 새 파일·취소·저장 완료 시 이력을 버린다. IndexedDB/project JSON 스키마와 원본 문서는 변경하지 않았다. 기존 Step3 추출·이미지 복원·원본 대조·취소 구현은 재작성하지 않았다.
- **로컬 검증:** `npm test` 62/62 PASS, `npm run build` PASS, `git diff --check` PASS. 빌드는 기존 model.ts static/dynamic import chunk 경고만 출력했다.
- **Chrome + Edge exact-SHA:** [#40472988885](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988885) SUCCESS 2/2. Chrome job #122084327342, Edge #122084326864에서 `PASS STEP3 DRAFT UNDO/REDO`, 실제 합성 PDF import/reprint, A4·텍스트·이미지, M09-A/B/C 회귀 로그 확인. Node 62/62 및 build도 성공.
- **Windows NSIS exact-SHA:** [#40472988943](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988943) SUCCESS. Job #122084327265에 `PASS M09-D WINDOWS INSTALLED UI`, installed STEP3 import/source review/native A4 PDF(2 pages, six markers, raster draw), 설치/제거 및 0.1.0→0.1.1 STEP2 데이터 보존 로그 확인.
- **M09-D 판정:** Windows hosted runner의 설치 앱 창에서 분석 취소→새 PDF 선택→늦은 이전 결과 무시→새 Blob URL 정리→IndexedDB V2 스냅샷 불변을 실제 UI로 확인했다. 이는 합성 CI 증거이며 고객 PC/실문서 검증은 아니다.
- **남은 STEP3 검증:** 동의받은 고객 텍스트 중심 PDF 5~10개를 고객 로컬에서만 비교하고 구매자 Windows PC에서 GUI/실문서 수용을 확인해야 한다. 복잡한 표·다단·그래픽은 지원 완전성을 주장하지 않고 경고/수동 검수가 필요하다. 스캔 OCR, 모델/런타임 다운로드, 비용, 외부 PDF 전송은 미승인이다. 상용 판매는 NO-GO.
- **보존/동기화:** main, PR #3/#4, 사용자 저장 데이터 및 배포 설정을 건드리거나 병합하지 않았다. 로컬 `git fetch`는 `Could not resolve host: github.com`으로 실패했으며 GitHub 연결 API로 위 exact commit을 원격에 반영했다. 현재 로컬 clone은 원격 ancestry와 다르므로 로컬 ref를 push하지 않는다.


## 2026-10-27 17:45 KST — STEP 3 PDF 이미지 누적 자원 한도

- 구현 SHA: 009966b57cc2e30397da5607b9429020c400e513 (integration/astra-commercial-core, PR #9). 기존 per-image/per-page 기준은 유지하고, 문서당 이미지 복원 시도 최대 50개·누적 40MP·성공 PNG 40MiB 상한을 적용했다. 상한에 닿으면 후속 이미지는 복원하지 않고 기존 미복원 개수·검수 경고에 표시한다. 초안/문서 저장 스키마, 원본 PDF, 사용자 V2 데이터는 변경하지 않았다.
- 로컬 검증: Node 24 npm test 63/63 PASS, npm run build PASS, git diff --check PASS. 첫 추가 테스트에서 이미지 개수 경계 기대값 오류로 1회 실패했고, 테스트 입력만 바로잡은 후 전체 통과했다. 기존 빌드의 model.ts chunk 경고는 남아 있다.
- exact-SHA Chrome·Edge: [Actions #40475046652](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046652) SUCCESS 2/2. Chrome·Edge에서 PDF 가져오기/Undo·Redo/A4 재출력, 스캔·손상·암호 PDF 거부, M09-A/B/C 회귀 통과 로그 확인.
- exact-SHA Windows NSIS: [Actions #40475046789](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046789) SUCCESS. 설치형 M09-D 취소→대체 선택→늦은 분석 무시→저장소 불변, STEP3 가져오기/검수/새 A4 PDF(2쪽, 원문 표식 6개, 래스터 1개), 설치·업그레이드 로그 확인.
- 최초 STEP3 기준 재대조: PDF 내부 복구는 원본 로드맵의 STEP3 요구가 아니다. 손상 파일을 성공으로 위장하지 않고 거부하며 기존 문서와 미확정 검수 초안을 보존하는 편이 범위에 맞다. 갭 매트릭스에 이 판단을 반영했다.
- 미검증/남은 작업: 합성 fixture만 사용했다. 고객 동의 실제 단순 PDF 5~10개 내용 비교, 구매자 Windows PC 직접 GUI/인쇄 수용은 미검증. 복잡한 표·다단·OCR은 원본 범위를 벗어나거나 별도 승인이 필요하다. 7단계 추정은 ~43%, 판매/Production NO-GO.
- 보존/최신성: main, PR #3/#4, 배포 설정, 사용자 저장 데이터는 변경·병합되지 않았다. OCR·모델 다운로드·비용·외부 PDF 전송·배포 없음. 기능 테스트 SHA는 위 코드 SHA이며, 문서 전용 갱신이 뒤따른다.


## 2026-10-27 17:55 KST — STEP3 이미지 누적 한도 최종 경계 검증

- 최종 기능·테스트 SHA: 9ae962eb825e4baa3a8d84b650926355258c9148. 앞선 검토에서 첫 한도 초과 뒤 작은 이미지 시도가 계속될 수 있음을 확인해 동작을 바로잡았다. 이제 PDF 단위 예산에 도달하면 exhausted 상태로 두고 이후 페이지의 이미지 객체를 읽거나 복원하지 않는다. 시도 이미지 수와 디코딩 픽셀은 복원 실패도 예산에 포함하며, 성공 PNG bytes는 별도 집계한다.
- 새 회귀 테스트는 첫 페이지 누적 픽셀 한도 도달 시 경고가 나오고 다음 페이지 이미지 객체 접근이 일어나지 않는지 확인한다. 로컬 Node 24 npm test 64/64 PASS, npm run build PASS, git diff --check PASS. 기존 model.ts chunk warning 지속.
- Exact-SHA Chrome·Edge [#40476342313](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342313) SUCCESS 2/2; Windows NSIS [#40476342230](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342230) SUCCESS. Windows installed test에서 M09-D 실제 UI 취소·대체 파일·늦은 결과 무시·V2 불변, STEP3 실제 앱 출력 A4 2페이지/marker 6개/raster 1개 확인.
- 이전 exact-SHA 009966b도 녹색이었으며, 그 뒤 최종 코드 검토로 경계 조건을 추가 보완한 것이다. 실패를 숨기거나 테스트를 생략하지 않았다.
- 제한 설명 정정: 50개는 실제 회수 성공 개수가 아니라 문서 전체 복원 시도 상한이다. 40MP는 시도된 이미지 디코딩 픽셀 상한, 40MiB는 성공 PNG 누적 출력 상한이다. 최초 경고 뒤 모든 후속 복원을 중단한다.
- 이 보완은 추출/프로젝트 스키마를 바꾸지 않는다. OCR/외부 전송/모델 다운로드/비용/배포/merge 없음. 고객 동의 실제 PDF 5~10개와 구매자 Windows PC 수용은 계속 미검증. 상용 판매 NO-GO.


## 2026-10-27 18:06 KST — STEP3 추출 텍스트 제한 조기 적용

- **최종 기능·테스트 SHA:** 4e5cdbb300153dc81e7374956030cae751148415. PDF.js 텍스트 항목을 문서 전체 누적 500,000자 한도와 대조하면서 페이지별 fragment 배열에 추가하도록 변경했다. 초과 시 나머지 페이지/항목 추출을 진행하지 않고 기존 저장 데이터는 그대로 둔다. 구조 재구성 후에도 기존 최종 한도 검사를 유지한다.
- **로컬 검증:** Node 24 npm test 65/65 PASS, npm run build PASS, git diff --check PASS. 정확한 경계 500,000자는 허용되고 다음 문자부터 거부되는 단위 테스트 포함.
- **Chrome·Edge:** [Actions #40477533937](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533937) SUCCESS 2/2. Chrome/Edge PDF 가져오기, Undo/Redo, 실제 브라우저 A4 PDF, M08 corrupt/password/scan boundaries, M09-A/B/C 회귀 확인. Chrome test summary #fail 0.
- **Windows NSIS:** [Actions #40477533758](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533758) SUCCESS. 설치형 M09-D 취소→대체 파일→이전 분석 무시→V2 불변, STEP3 native A4 출력 2쪽/marker 6개/raster 1개 확인.
- 합성 PDF만 사용했다. 고객 PDF/물리 구매자 PC 수용은 미검증으로 유지한다. OCR 미승인, 7단계 완료율 추정 ~43%, 상용 판매 NO-GO.
- main/PR #3/#4/사용자 저장 데이터/배포는 변경·병합하지 않았다. 외부 전송, 모델 다운로드, 비용 서비스, Production 배포 없음.

## 2026-10-27 18:26 KST — STEP3 텍스트 블록 제외와 exact-SHA 검증

- **설계 근거:** 최초 STEP3의 “머리글·바닥글 제거는 원문을 확인할 수 있게 처리” 요구를 보강했다. 검수 화면의 각 텍스트 블록에 새 문서 포함 체크를 제공한다. 제외한 텍스트는 검수 초안과 원본 PDF 비교 화면에 남고, 새 프로젝트에만 포함되지 않는다. 전체 텍스트를 제외하면 저장이 막힌다. 기존 저장 스키마·사용자 문서·원본 PDF는 변경하지 않았다.
- **최종 검증 SHA:** `cc157cba4b442f44b88c3631a72686fdfe8f8af9` (integration/astra-commercial-core, Draft PR #9).
- **GitHub Actions:** Chrome+Edge [#40479935848](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935848) SUCCESS 2/2. Node 22 `npm test` 67/67 PASS, `npm run build` PASS. 브라우저 로그: 원본 검수 17개 표식 유지, 머리글·바닥글 4개 제외, 결과 PDF 본문 표식 13개 유지, A4/이미지 출력, 동의 취소 및 Undo PASS.
- **Windows NSIS:** [#40479935852](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935852) SUCCESS. 설치형 M09-D 취소→대체 파일 선택→늦은 분석 무시→V2 저장소 불변, STEP3 native A4(2페이지·6개 표식·래스터 1개), 설치/제거 및 0.1.0→0.1.1 STEP2 데이터 보존 확인.
- **수정 이력:** 중간 exact-SHA에서 테스트가 실제 읽기 순서(40479291489/435), 17개 fixture 표식 기대값(40479424192/232), 표식 수와 통합 블록 수 혼동(40479582180), 브라우저 테스트 문법(40479877233/246)으로 실패했다. 각 원인을 확인해 fixture·테스트만 고쳤고, 우회·생략하지 않은 최종 SHA에서 위 전체 검증을 통과했다. 0.1.0 기준 Windows run [#40479582087](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479582087)은 SUCCESS였다.
- **남은 검증:** 고객 동의 실제 텍스트 중심 PDF 5–10개를 사용자 PC에서만 비교하고, 구매자 물리 Windows PC에서 GUI/인쇄 수용은 아직 미검증. 이 파일들을 CI/PR에 올리지 않는다.
- **진척 구분:** 아스트라 7단계 약 43%. 72시간 내부 기술 시연은 M05 기준 핵심 경로만 제한 GO이며 완성품/판매 허가가 아니다. BASIC은 부분, PRO 20종·BUSINESS 30종은 미구현, 전 SKU 오프라인 윤문은 승인대기. 상용 판매/Production은 NO-GO.
- **보존/승인:** main, PR #3/#4, 사용자 저장 데이터, 배포 설정 변경·병합 없음. OCR, 모델/런타임 다운로드, 외부 문서 전송, 유료 서비스, 배포 없음. OCR은 별도 승인 전 제외.

## 2026-10-27 18:40 KST — 총괄 지시 갱신: 설계 기능 구현 우선

- **사용자 운영 방식 확정:** 기존 제한 GO 내부 MVP → 최초 7단계 설계/요구사항 갭 순으로 기능 완성 → 최종 보안·안정성·호환성·상용 QA. 세부 계획: [docs/commercial/MVP_TO_BLUEPRINT_COMPLETION_20261027.md](docs/commercial/MVP_TO_BLUEPRINT_COMPLETION_20261027.md).
- **개발 다음 우선순위:** STEP4 스타일 토큰·검증된 레이아웃/비교·사용자 프리셋 저장/재사용 → 승인 범위의 STEP5 로컬 레퍼런스·STEP7 검수 보강. 이전 STEP3 합성 경계 테스트의 반복만으로 완성률을 올리지 말 것. 사용자 자료가 없어도 독립 기능 구현 진행, 실PDF/물리 PC는 미검증 유지.
- **기준 증거:** 기능/테스트 SHA cc157cba4b442f44b88c3631a72686fdfe8f8af9, [Chrome/Edge #40479935848](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935848) 및 [Windows #40479935852](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935852) SUCCESS. 최초 로드맵 약 43% 추정, 상품판매 NO-GO.
- **승인/보존:** 원본 문서/PNG, main, PR3/PR4, 기존 데이터, 외부 전송/비용/배포 변경 금지. OCR/STEP6 웹검색/로컬 LLM 다운로드/중요 스키마 변경·PR 병합은 별도 승인. 저장·원문 필수 안전 테스트는 구현 시점 유지.
- **전달:** [PR #9 총괄 지시](https://github.com/hibi89/astra_pdf_redesigner/pull/9#issuecomment-6438610031). 이번 기록은 코드 신규 구현이나 재테스트 완료가 아닌 실행계획 변경.

## 2026-10-27 19:18 KST — STEP4 동일 문서 스타일 비교·적용·취소

- **구현:** 기존 8개 레이아웃을 같은 전체 문서에서 한 번에 하나씩 비교한다. 비교 상태는 메모리 전용이라 저장 전 문서/디자인은 변하지 않는다. 선택 적용은 기존 `DesignSettings.theme`를 사용하고, 적용 직전 디자인을 한 번 취소할 수 있다. 적용/취소 뒤에도 본문, 섹션, 이미지 참조 및 IndexedDB store 구성이 동일하다. 비교 중 기존 디자인 컨트롤을 눌러도 미리보기와 저장 테마가 동기화된다.
- **구현 방식 비교:** A) 레이아웃별 고정 CSS만 늘리면 초기 구현은 가장 빠르고 저장 호환성을 건드리지 않지만, 폰트·색상·크기 조합이 늘 때 중복·회귀·유지보수 비용이 커진다. B) 제한된 디자인 토큰(`theme/accent/font/textSize`)과 레이아웃 프리셋 ID를 유지하면 약간의 초기 설계가 필요하지만, 렌더 경로와 기존 V2 데이터에 맞춰 확장·검증하기 쉽다. 둘 다 외부/API 비용은 없다. **B를 권고**한다. 이번 구현은 이미 존재하는 V2 디자인 필드만 사용하며 저장 스키마를 바꾸지 않았다. 사용자 프리셋 저장/재사용은 데이터 이식성과 마이그레이션을 설계해 별도 승인받은 뒤 진행한다.
- **기능·테스트 SHA:** `273db07ae851e8d2420da39688b5fa84641ce65d`.
- **Chrome·Edge:** [Actions #40486509235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509235) SUCCESS 2/2. `npm test` 67/67 PASS, `npm run build` PASS. 실제 same-document 비교 테마 PDF가 A4이고 본문 표식 3개와 래스터 이미지를 유지했다. 비교 출력과 저장된 같은 레이아웃의 제목 bbox 차이는 각 좌표 1.5pt 미만이었다. 8개 테마 실제 출력은 모두 고유 배치·A4·텍스트 순서·이미지를 보존했다.
- **Windows 설치형:** [Actions #40486509335](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509335) SUCCESS. 설치된 Electron에서 ephemeral alternate PDF, 적용 후 정확한 디자인/콘텐츠 복원을 확인했고, 실제 Electron A4 레이아웃 8개를 PDF.js로 다시 읽어 8/8 성공했다. M09-D 취소→새 PDF 재선택→늦은 이전 결과 무시→V2 store 전부 불변, NSIS 설치/제거, 0.1.0→0.1.1 업그레이드 후 STEP2 문서·PNG 보존도 확인했다.
- **중간 실패와 수정:** `a1c0885` Edge 테스트는 fixture 초기 테마를 report로 고정한 가정 때문에 실패했다. 동적 baseline으로 고쳐 `83045a6`에서 STEP4 PDF/내용 보존은 통과했지만 비교 패널 열린 동안 일반 테마 선택이 미리보기에 반영되지 않는 결함을 발견했다. 컨트롤 동기화와 회귀를 추가한 최종 SHA `273db07ae851e8d2420da39688b5fa84641ce65d`에서 Chrome·Edge·Windows 모두 성공했다. 테스트를 생략하지 않았다.
- **미검증·제약:** 실제 고객 PDF 5–10개 및 구매자 PC 수용은 미검증. 7단계 추정은 약 44%, 판매/Production NO-GO. 사용자 스타일 저장/재사용 스키마, 무제한 디자인 조합, OCR은 미완료/승인대기.
- **보존:** 사용자 지시에 따라 GitHub 통합 브랜치에서만 반영. main·PR #3/#4·사용자 원본/데이터·배포 설정을 변경·병합하지 않았다.

## 2026-10-29 — STEP3 block split/merge and STEP4 multi-undo

- Functional SHA `97a5720d9b130d8137e9cfc068ba7b192954d3e1` adds cursor-based extraction block split, guarded same-role adjacent merge that preserves boundary whitespace, and per-document STEP4 apply undo history (up to 20 entries); existing V2 schema unchanged.
- Local verification: `npm test` 91/91 PASS, `npm run build` PASS, `npm run desktop:verify` 16/16 PASS. Exact-SHA Chrome/Edge run #40860736343 SUCCESS; Windows installer/upgrade run #40860736332 SUCCESS, including IndexedDB preservation.
- Seven-stage completion reassessed at ~52%, below 80%. Customer PDFs and physical buyer PC remain unverified; durable design presets need schema approval; OCR remains excluded. No merge, deployment or sale.
- Local temporary worktree contains preserved line-ending-only edits and patch backups; it was not deleted. No original project/user data was modified.

## 2026-11-11 KST — ASTRA PDF 52%→70% 잠정 기능개발 목표 달성 (상용 RELEASE HOLD)
- 별도 `feature/astra-p52-to-p70-20261111`만 수정, 기반 `integration/astra-commercial-core@b80830ab3219dbcf88556d60ce2c47c2dcec7764`. `main`/통합 브랜치/기존 Draft PR #3/#4/#9/원본 PDF·기존 IndexedDB/Production 변경 없음.
- **기능범위 가중치:** STEP4 휴대용 스타일 프리셋 내보내기·가져오기·임시 미리보기·명시적 적용/되돌리기 (+5%p); STEP5 로컬 참고 이미지/PDF 분석 제안을 동일 프리셋으로 재사용(+4); STEP7 원본 PDF SHA-256·문서 내용 SHA-256·수동 출처 대조 현황 검토 영수증(+5); 로컬 원본 PDF·프로젝트 백업과 영수증 독립 무수정 검증(+4). **52→70% 잠정 엔지니어링 추정**, 기존 8개 기본 디자인·M09는 재가산하지 않음. 원본 7단계 설계 완성도 및 판매 준비율과 별개.
- **GitHub 실제 exact-SHA `dab6e365f5c9d57e285eaf71cb840ecc41513c6e`:** [Chrome/Edge #42957762014](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/42957762014) SUCCESS 2/2, `npm test` **107 PASS/0 FAIL/0 SKIP**, `npm run build` PASS, 브라우저 실제 프리셋→A4→UNDO/원본 IndexedDB, STEP5 분석 프리셋, STEP7 원본 PDF 해시/검토 영수증 및 기존 STEP1~3 PDF 테스트 PASS. [Windows NSIS #42957762000](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/42957762000) SUCCESS, Node **107/107**, Desktop **16/16**, 패키지 EXE/설치·제거·업그레이드·M09-D 보존 PASS.
- 최초 CI 타입 좁히기, A4 좌표 허용오차, `updatedAt` 테스트 baseline, Windows 경로 파싱 문제를 수정해 최종 정확 SHA에서 재검증함. 이전 실패를 최종 성공으로 대체하되 이력 보존. 독립 `verify-source-review.mjs`는 **원본·백업 바이트 해시 일치 검증**일 뿐 PDF 픽셀/내용 동일성·법적 사용자 인증이 아님. 검토 결과는 `source_fidelity_certified:false`, `owner_approval:NOT_GRANTED`.
- OCR/STEP6 인터넷 탐색/실 GGUF 한국어 윤문과 사용권·CPU 성능, PRO20/BUSINESS30, 실제 고객 PDF 5~10건, 구매자 물리 Windows/서명·라이선스·지원 **미구현/미검증**. **전 SKU 출시 NO-GO, Vercel Production 미적용**. 상세 `docs/commercial/ASTRA_P70_PORTABLE_STYLE_RECEIPT_20261111.md`.
