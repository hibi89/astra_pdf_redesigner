# Astra PDF Redesigner — 12영역 최종설계 증거 기반 잠정 완성률

**기준일: 2026-11-15 KST · 마지막 검증 기능 SHA `f5751bbb559f268706f2e7bc15438d0a8f590ed9` · P123 VERIFIED +3 · 잠정 64/100점 (64%); P124 Windows hosted synthetic PASS / 최종 인수 보류 +0, P119/P120/P121/P126 BLOCKED +0. G55 PASS; G60/G65/G70 NOT PASSED.**
**공식 구매자 최종 수용률: UNASSESSED. 출시: RELEASE HOLD.**


**G005 통합 보충 (2026-11-15 KST):** GPT 독립 G001–G004 QA [PR #12](https://github.com/hibi89/astra_pdf_redesigner/pull/12)는 통합 브랜치에만 병합했다. 정확 코드 SHA `24939be58c6fcd3396697bd93aa58a082b4d7a48`의 52/52 PASS, 통합 merge `4b486b5c9039e97a468483eafe4a1d7146193b0c`. 추가 수용 점수 **+0**. Codex P124 Windows [#43683050524](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683050524) FAIL (첫 BASIC 10개 제안 기준 미달, 이후 SKU/NSIS 미검증). **최종 64/100 잠정, G60/G65/G70 NOT PASSED, 공식 UNASSESSED, RELEASE HOLD**. G004 익명 템플릿은 실제 허가 PDF 검사·물리 PC 수용으로 계산하지 않는다.

**최신 G005 증거 정정 (2026-11-15 KST):** [GPT PR #14](https://github.com/hibi89/astra_pdf_redesigner/pull/14) 통합으로 실제 PDF.js 합성 원본/출력 위험 QA 21 PASS + 기존 독립 QA 52 PASS = [#43685514835](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685514835) 73/73 PASS, [정책 #43685514899](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43685514899) SUCCESS. **새 가점 +0**. Codex P124의 이전 Windows FAIL은 **역사적 실패**이며 새 정확 SHA `a2ca668c9578b68e760b922c026a5f2f8f941c8d` [Windows #43684225170](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43684225170)은 **SUCCESS**. 단, [독립 artifact audit](../evidence/astra/G003/P124_ARTIFACT_INDEPENDENT_AUDIT.md)에 따르면 각 시험용 SKU 실제 모델 10회 호출에서 **서로 다른 입력/제안 SHA 각 1개**이므로 10개 서로 다른 선택 문단의 사용자 흐름·정확성 수용과 실제 판매용 SKU 권한·ASAR 테스트코드 제외는 **미검증**이다. 따라서 Codex의 +2/총 66은 후보일 뿐, 본 중앙 정본은 **64/100**, official **UNASSESSED**, `RELEASE HOLD` 유지. 이 최신 보충이 바로 아래 오래된 P124/FAIL 내용보다 우선한다.

## 산정 원칙

사용자가 확정한 A01~A12 12개 영역의 100점 배점 **그대로** 사용한다. 아래 1점 단위 부분 수용 분해는 사용자 승인된 배점의 변경이 아니라 **총괄이 제안하는 잠정 검증 체크포인트**다. 각 항목은 코드 실행 및 CI·합성 브라우저 검증 증거가 있는 기능에만 부분 점수를 부여한다. 정식 판매·원본 내용 품질·실 물리 PC·구매자 최종 승인은 CI로 대신하지 않는다.

이 표의 **잠정 64%는 공식 확정 수용률과 다르며, 내부 기술 85%/95%나 출시 준비도에 전용할 수 없다.** 사용자가 부분 배점·수용기준을 확정하고 미확인 사항을 직접 검수할 때 공식 값을 산정한다.

| 영역 | 사용자 확정 배점 | 이번 회차까지 잠정 인정 | 남은 점수 | 인정한 합성/코드·출력 증거 | 반드시 남은 수용 |
|---|---:|---:|---:|---|---|
| A01 회고록 입력·저장·A4 | 4 | 3 | 1 | STEP1 필드·V1 자동 저장·Chrome/Edge A4 출력 | 사용자 실제 회고록 인쇄 |
| A02 문서·이미지·V2 | 6 | 5 | 1 | STEP2 블록·이미지·IndexedDB V2/PNG·파일 복원·NSIS 업그레이드 | 구매자 물리 PC 복원 |
| A03 기존 PDF 가져오기·원문 대조 | 14 | **12** | 2 | PDF.js 원본 추출·수동 승인·텍스트/이미지 대조·암호/손상/스캔 경고; **P114 Chrome/Edge 12종 위험 레이아웃·페이지별 승인 저장 게이트·원문 순서 보존; P115 Chrome/Edge 각각 15종 A4 차이 매트릭스(숫자·기호·부정·링크)와 원본 SHA/V1/V2 불변** | 실제 표·다단·도형·누락·의미 정확도 확인 |
| A04 8/20/30 레이아웃·브랜드·다중 PDF | 15 | **14** | 1 | BASIC8 + PRO12 + BUSINESS10 구조 차별성·실제 A4 PDF를 Chrome/Edge 30/30 검증; P112/P117 2~20개 문서 세션 브랜드 계획과 2/5/20개 개별 A4 출력·취소·V2 불변을 Chrome/Edge에서 확인. 배치 로고 포함·영구 저장은 미구현. | 최종 구매자 시각 품질·고객 수용 |
| A05 로컬 디자인 참고·적용 | 5 | **4** | 1 | PNG/JPEG/WebP/PDF 로컬 분석·미리보기·적용/Undo; Chrome/Edge 8종 합성 metric, source SHA·V2 전체 저장소 불변 및 손상 PDF fail-closed | 실구매자 레퍼런스 품질·폰트/권리·고객 PDF 수용
| A06 온라인 레퍼런스 | 5 | **4** | 1 | 안전한 브라우저 검색 링크·URL/권리메모 로컬 기록  P112 저장된 HTTPS 출처→사용자 파일 선택→STEP5 로컬 분석 직접 연결, 권리·파일 동일성 인증/내장 검색 카드 없음. | 내장 검색 결과·출처 검증·STEP5 직접 연결 |
| A07 OCR·콘텐츠 안전·STEP7 | 12 | **5** | 7 | STEP7 PDF 대조·수동 검토·출시 OCR 차단 정책/검사, P113 PNG/OCR 수동 대조. P119 UB-Mannheim 공급처 후보 audit BLOCKED +0: GitHub installer digest null, Authenticode/PE·DLL closure 및 bundle 재배포권 미확인. OCR_MANIFEST=null. | 승인 공급처의 Windows Tesseract 실제 한국어 OCR·표/스캔 정확도 |
| A08 한국어 로컬 AI 윤문 | 14 | **7** | 7 | P111 로컬 Ollama 동의 UI/controller; P122 mock/static E2E +2; P123 actual Qwen3-4B CPU loopback inference +3 (31 synthetic cases, 10 review-visible proposals, protected facts unchanged, auto-apply 0). | P124 3-SKU Windows Electron acceptance, buyer review; production model distribution not verified |
| A09 라이선스·SKU·지원 | 11 | **7** | 4 | P96 서명 검증, P107 기능 매트릭스, P108 발급/연장, P109 GUI gate, P110 main-frame guard, P125 main-process signed receipt/SKU boundary +2 (ephemeral synthetic keys; production issuer remains null) | 실판매자 pin·발급/환불/철회/기기 seat lifecycle·고객지원 약관·실제 customer build |
| A10 Windows 설치·복구 | 5 | 3 | 2 | CI Windows unsigned NSIS 설치·제거·업그레이드, A4/IndexedDB·PNG 보존 | 실 Win10/11 물리 설치·서명/SmartScreen |
| A11 허가 PDF 5~10건 검수 | 7 | 0 | 7 | 합성 도구는 존재하나 실제 사용자 승인 문서 0건 | 실제 허가 PDF 5~10건 독립 대조/육안 수용 |
| A12 판매·법적·최종 승인 | 2 | 0 | 2 | 상품 등록 초안만 존재 | 저작권·재배포권·크몽 등록·최종 구매자 승인 |
| **합계** | **100** | **64** | **36** | **잠정 증거 기반 구현·검증 점수** | **공식 수용 미완** |

## P125 +2점 — Electron main-process 서명·SKU side-effect 경계 (A09)
- **판정:** 59→61/100, A09 5→7/11. A01~A12 확정 최대배점은 불변. P125가 작업 점수 합계를 60 초과했어도 **G60은 NOT PASSED**: P119–P121에서 승인 Tesseract 공급자/실 Windows OCR/IPC 증거가 아직 없다. Gate score는 61점과 별도로 적용된다.
- **기능 SHA:** `88c56e4188754f960ae94281b6d68e37b5081b62`. main-process guard는 issuer JWK/pin 및 customer flag를 제품 상수에서만 읽고 IPC에서 받은 issuer를 신뢰하지 않는다. PDF IPC의 exact top-frame·URL 검사 뒤, 만료/issuer/signature/seat/tier와 BASIC8·PRO12·BUSINESS10/brand 권한을 확인하고 action ID를 side effect 전에 한 번만 예약한다. Ephemeral P-256 key/영수증은 테스트 실행 중 생성되며 저장소·제품·release에 보관되지 않는다.
- [Linux #43641402429](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402429) SUCCESS — Node 285/285, TypeScript/Vite build PASS. Chrome/Edge full PDF, layout, P117/P118/P122 browser regressions PASS.
- [Windows #43641402454](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402454) SUCCESS — Node 284 PASS / 1 Windows OS-only SKIP / 0 FAIL, desktop 81/81. Electron smoke, NSIS installed EXE, uninstall, and in-place 0.1.0→0.1.1 upgrade preserve existing STEP2 document+PNG.
- [Final blueprint #43641402742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402742) SUCCESS; all three runs have exact head SHA `88c56e4188754f960ae94281b6d68e37b5081b62`.
- Matrix/attack tests verify all six capabilities for signed synthetic BASIC/PRO/BUSINESS entitlements; invalid/missing issuer, wrong issuer, tampering, expiry, invalid seat, attacker-supplied JWK, wrong/cross frame, reused frame and duplicate request ID never run their protected side effect. Default internal preview succeeds. **Production issuer and pin stay null; customer build stays false; no seller key created.** This is a main boundary prototype, not a shipped customer entitlement system/DRM.
- Failed candidate notes: Windows run `#43640998165` at `440cae43022314684bb5d291107521853c10b3be` rejected a valid same-pinned-key receipt in the test; corrected fixture uses attacker-signed receipt/key. Earlier failed Windows test candidates received 0; final exact SHA only is scored. [P125 verification](../evidence/astra/P125/VERIFICATION.md).

## P123 VERIFIED +3점 — 실제 Qwen3-4B CPU 추론 (A08)

- **판정:** A08 4→7/14, 총점 61→64/100. P123은 +3/3 VERIFIED. G65는 아직 65점에 도달하지 않아 NOT PASSED; P123 실모델 조건은 충족했다.
- **정확 기능 SHA:** [`f5751bbb559f268706f2e7bc15438d0a8f590ed9`](https://github.com/hibi89/astra_pdf_redesigner/commit/f5751bbb559f268706f2e7bc15438d0a8f590ed9). 실제 `Qwen3-4B-Instruct-2507 Q8_0`를 GitHub-hosted Ubuntu CPU runner에서 Ollama loopback으로 실행하고 production `LocalModelReview.tsx`를 Chrome 검수 harness에서 확인했다.
- **고정 데이터와 결과:** 31개 합성 한국어 사례에서 실제 모델 출력 10건이 검수 UI에 보였고 21건은 안전하게 거부/오류 처리됐다. 숫자·날짜·금액·이름·표 행·부정문·인용·URL 보호 signature가 모든 proposal에서 동일했고 auto-apply는 0. Cancel 응답 114ms, proposal latency 7.56–9.03s, Ollama process-tree peak RSS 약 4.71GB. synthetic localStorage V1/IndexedDB V2 sentinels는 전후 동일했다.
- **모델 provenance:** GitHub release repo `locomotive-works/npu-local-model-running`, release `v1.0`, pinned commit `6bbfd43a548c506734fb8899ed5adee5878a5e4a`; LICENSE Apache-2.0, Git blob `6634c8cc3133b3848ec74b9f275acaaa1ea618ab`. 3개 GGUF part SHA와 결합 SHA는 [P123 검증서](../evidence/astra/P123/VERIFICATION.md)에 수록. 모델은 설치파일/제품에 재배포하지 않는다.
- **정확-SHA Actions:** [실모델 #43678897970](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897970), [Linux #43678897941](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897941), [Windows #43678897933](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897933), [정본 정책 #43678898126](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678898126) 모두 SUCCESS, feature SHA `f5751bbb559f268706f2e7bc15438d0a8f590ed9`. [측정 artifact](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897970/artifacts/14147513507), ZIP digest `d30312476d75175ef24847cbc35672b0b398f13dded94e0b77e8fb31c245b811`.
- **범위와 게이트:** 격리 runner/synthetic only; 고객 원본·구매자 PC·판매 빌드 미검증. G55 PASS; G60 NOT PASSED (실 OCR 공급/Windows acceptance 미완), G65 NOT PASSED (64/100), G70 NOT PASSED. 공식 수용 UNASSESSED, RELEASE HOLD.

## P124 Windows hosted synthetic PASS / 최종 3SKU 인수 보류 +0 — A08

P123 model dependency and P117 SKU-flow dependency satisfied. Real Qwen3 CPU Windows/Electron hosted workflow PASSED on exact `a2ca668c9578b68e760b922c026a5f2f8f941c8d`, with BASIC/PRO/BUSINESS **test-only contexts**, missing/tampered safeguards, explicit approval/reject/Undo and production-only unsigned NSIS smoke. Independent synthetic JSON artifact proved **10 real calls per test SKU but exactly one distinct input and one distinct proposal SHA per SKU**. Production `Workspace` entitlement UX, 10 distinct selected paragraphs per SKU and installed ASAR test-harness omission were not proven. **P124 +2 candidate NOT accepted**; central A08 7/14 unchanged, 64/100 provisional, RELEASE HOLD.

## P122 +2점 — 로컬 동의·stale response·원문 보호 (A08)

- **판정:** 57→59/100, A08 2→4/14. 사용자 확정 영역 배점 불변. G55 PASS 유지; 59점이라 G60 미도달.
- 코드 SHA `d2a84d03ac8c791e74470e756cb6417a356776c3`. 문서/블록 ID scope와 원문 텍스트가 바뀌면 in-flight 요청을 취소·무효화하며, 승인/Undo도 동일 scope에 한정한다. 숫자·날짜·통화·부정문·이름·표 행·URL·인용은 보수적 문자열 검증으로 보호한다.
- [Linux #43638127671](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127671) SUCCESS — Node 278/278, build PASS; 실제 Chrome·Edge에서 동의 전 요청0, auto-apply0, same-text cross-scope/changed-text stale 응답 차단, 수동 승인/Undo, 오류·취소 후 원문 유지, external requests0.
- [Windows #43638127695](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127695) SUCCESS — Node 277 PASS/1 OS-only SKIP/0 FAIL, desktop 74/74, Electron/NSIS smoke/install/uninstall/upgrade PASS. [Final blueprint #43638128095](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638128095) SUCCESS. 세 run exact head SHA는 동일.
- 최초 후보 `45affeef40c96cb4991fadd6da6c706fa84afd41` [Linux #43637402373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43637402373)은 overescaped regex/IPC fixture assertion 3건 실패, 무가점. 고친 최종 SHA의 full CI에서 회귀 통과.
- 이 작업은 30개 synthetic golden + mock UI/Electron bridge만 검증했다. 실제 Qwen3 CPU 추론, license/hash, latency/memory, 문장 품질 미검증이며 P123/P124로 중복 계산하지 않는다. [P122 검증서](../evidence/astra/P122/VERIFICATION.md).

## P119 +0점 — Windows Tesseract 공급처 후보 감사 (BLOCKED)

- **판정:** P119는 공급처 바이너리 SHA-256, Authenticode, PE imports/DLL closure, exact kor/eng payload mapping, candidate NOTICE와 재배포권을 입증할 수 없어 0/1점이다. 점수 57/100 및 A07 5/12 유지.
- GitHub UB-Mannheim v5.4.0.20240606 release asset은 50,175,248 bytes지만 release API `digest=null`; 실제 바이너리는 별도 다운로드/동봉 금지 지시에 따라 취득하지 않았다.
- Tesseract/tessdata source LICENSE Apache-2.0 표기, tessdata repo main commit에서 kor/eng의 size·Git blob SHA-1을 확인했다. Git blob SHA-1은 파일 SHA-256이 아니다. Leptonica license file과 repo metadata `NOASSERTION`를 기록했으나 installer dependency/NOTICE 연결을 증명하지 못했다.
- 기존 P104/P105/P106 synthetic checks는 정확 기능 SHA `420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02`에서 통과했지만 이는 실제 supplier sign/hash/license나 OCR 품질 증거가 아니다. [P119 검증서](../evidence/astra/P119/VERIFICATION.md)와 [기계 판독 후보 감사](../evidence/astra/P119/SUPPLIER_CANDIDATE_AUDIT.json).
- P120/P121은 P119 승인 자산이 없어 BLOCKED/0점. `OCR_MANIFEST=null`, RELEASE HOLD 유지. 다음 독립 작업 P122.

## P118 +1점 — 로컬 레퍼런스 분석·비파괴 적용·재현성

- **잠정 점수:** 56→57/100(+1), A05 3→4/5. 공식 구매자 수용 UNASSESSED, RELEASE HOLD.
- **정확 검증 SHA:** 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02. 변경 파일은 tests/step5-reference-browser.mjs, tests/step5-reference-analysis.test.ts이며 제품 로직 변경은 없다.
- [Linux #43633902801](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902801) SUCCESS — Node 276/276, build PASS; Chrome과 Edge 8개 PNG/JPEG/WebP 합성 레퍼런스의 예상 metric 범위·테마/색상, 2페이지 PDF 분석, 원본 SHA·V2 store 불변, apply/PDF/undo/cancel, malformed PDF fail-closed.
- [Windows #43633902770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902770) SUCCESS — Node 275 PASS/1 OS-only SKIP/0 FAIL, desktop 73/73, Electron/NSIS 설치·실행·제거·0.1.0→0.1.1 STEP2 문서+PNG 보존 PASS. [정본 정책 #43633903290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633903290) SUCCESS. 세 run 모두 exact head SHA 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02.
- 최초 후보 e2a7c04e693dea194b30aa11c4ee7cb20819739d, [Linux #43624942512](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43624942512)은 Node 문맥에서 document를 직접 조회한 브라우저 테스트 오류로 실패해 0점 처리했다. 수정 SHA에서 full regression을 재실행했다.
- 합성 사례 및 GitHub-hosted runner만 검증했다. 실제 폰트·저작권, 구매자 품질, 고객 PDF, 한글 OCR/의미 추출은 미검증이며 RELEASE HOLD를 유지한다. [P118 검증서](../evidence/astra/P118/VERIFICATION.md).

## P117 +1점 — BUSINESS 다중 문서 개별 PDF 출력·계획 교체

- **잠정 점수:** 55→56/100(+1), A04 13→14/15. A01~A12 확정 배점은 그대로다. 공식 구매자 수용 UNASSESSED, RELEASE HOLD.
- **검증 기능 SHA:** `c4d96dc02fb616e44773871952343161079e293b`. 제품 수정은 `src/step2/Workspace.tsx`의 새 batch plan 교체 1건. 함께 변경한 단위/브라우저 테스트와 Linux/Edge workflow wiring은 `tests/brand-batch-plan.test.ts`, `tests/sku-action-gate.test.ts`, `tests/step4-brand-batch-browser.mjs`, `.github/workflows/ci.yml`.
- [Linux #43622221289](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221289) SUCCESS — 271/271 Node, build PASS, Chrome 및 Edge 실제 브라우저 검증 PASS. 각 브라우저에서 합성 V2 문서 21개로 정확 2/5/20 계획을 바꾸고 총 27개의 단일 문서 A4 PDF를 생성·검증; 비대상 미오염, 취소 후 21/21 스타일 복원, 21개 V2 레코드·assets 저장소 불변.
- [Windows #43622221235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221235) SUCCESS — 270 PASS / 1 OS 전용 SKIP / 0 FAIL, desktop 73/73. 실제 Electron·NSIS 설치/실행/제거와 0.1.0→0.1.1 업그레이드 후 STEP2 문서+PNG 복원 PASS. [정본 정책 #43622221573](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221573) SUCCESS. 세 workflow의 `head_sha`는 모두 `c4d96dc02fb616e44773871952343161079e293b`.
- P117의 초기 테스트 후보 `e57396a47c2fdb46214601795df91fca6e44f16f`, [Linux #43621810438](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43621810438)은 출력 `<footer>`와 입력 필드를 구분하지 못한 selector로 실패했으며 0점 처리했다. selector를 input에 한정한 검증 SHA에서 전체 세 workflow를 다시 통과했다.
- 위조 영수증의 BUSINESS+brand-kit 상용 동작은 side effect 없이 거부됐다. 내부 미리보기는 판매용 사용권과 분리되어 있고 customer build false를 유지한다. 로고 배치, 상용 서명키 활성화, 구매자 실제 문서/육안 승인은 미검증이다. 상세: [P117 검증서](../evidence/astra/P117/VERIFICATION.md).

## P116 +1점 — BASIC8/PRO12/BUSINESS10 실제 A4 PDF 구조 회귀

- **잠정 점수:** 54→55/100(+1), A04 12→13/15. 사용자 확정 A01~A12 배점은 불변. G55 별도 PASS, 공식 수용 UNASSESSED, RELEASE HOLD.
- **기능 SHA:** `b03583f12c5eb212dd0207fb539593ec7c2b8df3`; 변경은 `tests/step4-style-preset-browser.mjs` 1개다. 기존 제품 레이아웃을 바꾸지 않고 전수 검증을 회귀화했다.
- [Linux #43618379958](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379958) SUCCESS: npm test 269/269, build PASS; Chrome과 Edge 각각 합성 A4 원본/출력 30/30, 30개 구조 시그니처 고유.
- [Windows #43618379926](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379926) SUCCESS: 268 PASS / 1 OS 전용 SKIP / 0 FAIL, desktop 73/73, Electron/NSIS 설치·실행·제거·업그레이드 PASS. [정본 정책 #43618380099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618380099) SUCCESS. 세 run의 head SHA는 모두 `b03583f12c5eb212dd0207fb539593ec7c2b8df3`.
- 각 PDF에서 40개 행 표식과 시작/끝 표식이 정확히 한 번씩 확인됐다. PDF 텍스트 추출은 합성 ASCII 원문에 대해 공백 제외 전체 문자 순서와 개별 표식을 검사했다. 모든 페이지의 A4 범위, 화면/PDF 줄 겹침 0, PNG PDF 임베드, STEP2 V2 전체 store와 원본 PNG 바이트 불변 PASS. DOM 및 V2 원문은 공백을 포함한 exact equality.
- `254e8c2b39488c0e2caad733b88fb2abfe04f31f`의 Linux #43618017819는 pdftotext 공백 출력 특성으로 실패하여 0점. 보정 후 최종 SHA에서 PASS했다. 상세 제한은 [P116 검증서](../evidence/astra/P116/VERIFICATION.md).
- **한계:** PDF 텍스트 계층의 한국어/CJK 매핑, 고객 PDF 및 구매자의 실제 시각 품질 승인은 미검증이다. A04 잔여 2점 및 출시 HOLD를 유지한다.

## G55 별도 검증 게이트 — PASS

P114(PDF 읽기 순서·수동 원문 대조), P115(원본/출력 15쌍 비교), P116(Chrome/Edge 30시안 A4 및 원문·PNG/V2 보존) 각 정확 SHA의 필수 Linux/Windows/정책 Actions가 성공했다. 게이트는 별도 기록이며 가중치 또는 추가 점수를 만들지 않는다. [G55 검증서](../evidence/astra/G55/VERIFICATION.md).


## P115 +2점 — A03 원본/출력 콘텐츠 대조와 무손상 검증

- **총괄 잠정 52→54/100(+2)**: A03 10→12/14. 승인된 A01~A12 가중치는 바뀌지 않았으며, 공식 구매자 최종 수용은 **UNASSESSED**, 출시 **RELEASE HOLD**.
- 정확 기능 SHA `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`: [Linux Chrome/Edge #43612143269](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143269) SUCCESS — Node 269PASS/0FAIL/0SKIP, build PASS, Chrome과 Edge 각각 합성 A4 원본/출력 15/15 차이 분류, 취소·오류 시 원본 PDF SHA256·STEP1 V1·모든 STEP2 V2 store 불변 PASS. [Windows Electron/NSIS #43612143223](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143223) SUCCESS — Node 268PASS/0FAIL/1 Windows 전용 SKIP, desktop 73PASS/0FAIL, 설치·실행·제거·0.1.0→0.1.1 업그레이드 후 STEP2 문서와 PNG 보존 PASS. [정본 blueprint policy #43612143523](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143523) SUCCESS; 구조 증거 확인 전용.
- 15종 합성 A4 사례에서 부호/금액/날짜/소수/통화·퍼센트·괄호 기호/NOT·NO·WITHOUT/링크 변경·삭제·추가/중복 참조 차이를 실제 PDF.js 브라우저 비교로 검증했다. 페이지 위험을 보여주며, 검토 도구가 V1/V2에 쓰거나 승인을 부여하지 않았다. corpus generator Git blob SHA `cc0830122cafad1ddaafc641c50529afce537835`.
- 중간 후보 #43611032904(빈 V1 기준), #43611361119(createHash import 누락), #43611776507(V1→V2 마이그레이션 전후 기준 스냅샷 순서)는 실패로 기록하고 가점하지 않았다. 수정된 정확 최종 SHA만 점수를 얻었다.
- 실제 고객 PDF, 물리 Windows 10/11, 실제 Tesseract OCR/Qwen3 CPU, 의미상 완전 보존·이미지 픽셀 재구성, 표 셀 자동 복원과 구매자 최종 품질은 미검증이다. 인간 검수 없는 완전성 주장은 하지 않는다.

## P114 +2점 — A03 원본 순서·레이아웃 수동 대조

- **총괄 잠정 50→52/100(+2)**: A03 8→10/14. 사용자 확정 A01~A12 배점은 불변이며, 공식 구매자 최종 수용은 **UNASSESSED**, 출시 **RELEASE HOLD**.
- 정확 기능 SHA `9c3c506ecae49b68f207e6022c6b136da515b7e5`: [Linux Chrome/Edge #43607945345](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945345) SUCCESS — Node 266PASS/0FAIL/0SKIP, build PASS, Chrome·Edge 각각 합성 PDF 12/12 및 A4/IndexedDB 회귀 PASS. [Windows Electron/NSIS #43607945351](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945351) SUCCESS — Node 265PASS/0FAIL/1 OS별 SKIP, desktop 73PASS/0FAIL, 설치·실행·제거 및 0.1.0→0.1.1 업그레이드 STEP2 IndexedDB/PNG 보존 PASS. [정본 blueprint policy #43607945617](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43607945617) SUCCESS; 구조 증거 확인 전용이며 독립 기능 승인·공식 점수는 부여하지 않음.
- 구현은 불확실한 텍스트 읽기 순서를 자동 재배치하지 않고 원문 추출 순서와 수동 대조를 유지한다. 합성 12종(단일열·2단·격자·회전·혼합 이미지·숫자/부정문·열 뒤섞임·3열·빈도 낮은 넓은 텍스트·페이지 밖 텍스트)을 실제 Chrome/Edge에서 모두 대조했고 필수 마커가 유지되며 의심 페이지는 저장 전 페이지별 승인을 요구했다. 변경 중 발견된 whitespace-only PDF.js 항목은 인접 원문에 공백을 보존해 합쳐 빈 편집 블록을 제거했다.
- 이전 후보 `9afe0b0ec1f8a4fe321328f42d8f8065cb41dedd`는 M09-A 회귀 테스트가 전체 동의만 누르고 페이지별 확인을 생략해 Linux에서 실패했다. 테스트를 새 승인 절차에 맞춰 고치고 편집 후 전체/페이지별 확인이 모두 해제되는 것도 검사해 최종 SHA에서 통과했다. 수정 전 후보에는 점수를 주지 않았다.
- 검증은 합성 자료와 hosted runners에 한정된다. 고객 원본 PDF, 물리 고객 PC, Tesseract Windows OCR, Qwen3 CPU 추론은 검증하지 않았다. 표 셀/벡터 도형 자동 재구성 또는 의미상 완전 동일성을 주장하지 않는다.

## P111~P113 +8점 (이번 회차)

- **총괄 잠정 42→50/100점(+8)**: A04 10→12(+2), A06 2→4(+2), A07 3→5(+2), A08 0→2(+2). 사용자 확정 영역별 최대점수는 변경하지 않으며 부분 인정 기준은 총괄 잠정. 현재 잔여50. **공식 사용자/구매자 수용점수는 UNASSESSED, RELEASE HOLD.**
- **정확 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1`:** [Linux Chrome/Edge #43595956953](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956953) 2/2 SUCCESS, Node263PASS/0FAIL/0SKIP, Chrome·Edge 실제 합성 PDF/V2 보존. [Windows Electron/NSIS #43595956932](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956932) SUCCESS, Node262PASS/0FAIL/1 OS SKIP, desktop73PASS/0FAIL, unsigned 설치/제거, 0.1.0→0.1.1 V2+PNG 보존. [정본 정책 #43595957159](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595957159) SUCCESS. 정확 SHA 3/3+raw job logs.
- **A08 한계:** Ollama 테스트는 local HTTP **mock**, 사용자 PC에 실제 모델이 있어도 Astra의 문단별 실추론·CPU 시간·의미/숫자 보존은 아직 미검증. 실제 모델(2.5GB GGUF 등)은 **동봉·업로드·재배포하지 않음.** 로컬 앱 프로세스에서 127.0.0.1로 명시 승인된 문단을 보내는 별도 프로세스 기반이므로 완전 제로 전송/무조건 의미 보존 주장 금지.
- **A07 실제 공급자 독립 실험:** 이 실행 환경 Tesseract 5.5.0 kor+eng, NanumGothic 48pt 합성 PNG 3건 중 **2건 100% 문자열 일치/1건 수치·순서 변형**. 제품 Electron OCR 파이프라인 및 Windows 벤더 SHA/AuthentiCode 검증은 별개. 재현 코드 `tools/verify-real-korean-ocr.py`, release OCR manifest null.
- **A04/A06 한계:** 여러 문서 동일 브랜드는 세션 메모리·텍스트만, 사용자는 각 문서를 열어 PDF를 수동 저장. URL 출처는 사용자 메모와 파일의 동일성/이용권이 미확인이고, 자동 웹 다운로드 없음.

## 증거 및 증분
- **P109 이전 기준:** 41/100 잠정 (A09 4/11). 정확 SHA `ee7ed4eaacf44a08800b56639d2178f5df76e7d3`, [Linux/Chrome/Edge](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625251) / [Windows](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625273) / [정본 정책](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625548) 3/3 SUCCESS.
- **P110 +1점:** `desktop/pdf-export-ipc-guard.cjs`에서 Electron main IPC 요청의 정확한 `astra://app/index.html` 상위 프레임과 창 생존 여부 확인, `desktop/main.cjs`의 native PDF 출력 전 강제. 가짜 창·cross-frame·다른 URL·query/port·파괴된 창 거부 6회귀 테스트를 `package.json` Node/desktop CI 두 경로에 추가.
- P110 정확 기능 SHA `5ed3525947f0225888963806f95d8f821ca03394`. [Linux Chrome/Edge #43593105358](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105358) **2/2 SUCCESS**, Node **247PASS/0FAIL/0SKIP**, Chrome·Edge 실 브라우저 합성 A4/V2 회귀 PASS. [Windows NSIS #43593105373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105373) SUCCESS, Node **246PASS/0FAIL/1 OS SKIP**, desktop **65PASS/0FAIL**, 실제 Electron 내부 시연 PDF·NSIS 0.1.0→0.1.1 V2/PNG 보존 PASS. [최종설계 정책 #43593105644](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105644) SUCCESS. **정확 SHA 3/3 SUCCESS**, 원시 job 로그까지 확인.
- 생산 `PRODUCTION_ISSUER_JWK=null`, 지문 pin null, `ASTRA_CUSTOMER_BUILD_ENABLED=false`, native customer mode false, OCR_MANIFEST=null. 상용 활성화/실고객 배포 불허.
- 같은 권한을 가진 정상 최상위 렌더러의 JS/직접 IPC 호출이나 재포장된 앱을 강력 DRM으로 막는 기술이 아니다. **고객용 상용 보안 완료를 주장하지 않는다.**

## 후속
다음 P126은 P121 의존성이 미충족되어 BLOCKED다. P119~P121 Windows Tesseract 실제 검증과 P123/P124 Qwen3 CPU/Electron 경로도 승인 모델·OCR 자산 및 실측 수단이 확보될 때까지 BLOCKED/0점이다. G60/G65/G70은 각 기준 점수에서 별도 증거로 판정한다. 공식 구매자 수용은 UNASSESSED, RELEASE HOLD를 유지한다.


## P119/P120 actual Windows Actions experiment (no score)

Exact Windows Tesseract 5.5.3 run #43644765268 on code SHA e293fcdc585792d1985cba5f31b032d050ede11c executed 12 synthetic kor+eng images: 9 exact, three misrecognition/omission, mean whitespace-normalized CER 0.0486, with one critical amount mismatch (2,300,000→22300,000). The pinned official release asset digest matched. Authenticode returned UnknownError; dependency import closure and bundled third-party notices remain unproven. P119/P120 remain blocked +0 under the prerequisite and full UI acceptance rules; score stays 61/100, G60 not passed.


## P119/P120 actual Windows re-audit — no added score

At exact audit SHA [`0f82c8f0764cd00460abe3b27f97b497ce61ceb5`](https://github.com/hibi89/astra_pdf_redesigner/commit/0f82c8f0764cd00460abe3b27f97b497ce61ceb5), Linux [#43647106432](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106432), Windows [#43647106409](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409), and final policy [#43647106804](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106804) passed. Tesseract 5.5.3 ran on 12 synthetic kor+eng cases: 9 exact, 3 errors, CER 0.0486, including a critical `2,300,000원→22300,000원` mismatch. Static PE imports were closed across 56 files. Authenticode returned UnknownError; dependency NOTICE/license and exact-bundle redistribution rights remain unverified. P119/P120/P121 receive no score; provisional total remains 61/100 and G60 is NOT PASSED. Official acceptance UNASSESSED, OCR_MANIFEST=null, RELEASE HOLD. [Report artifact 14134094222](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409/artifacts/14134094222) (SHA-256 `d3466b486c91b2e24edb638104e7bc5ffeb8a11c9e889f641ebcc5e726ecc193`).


## P119 additional upstream candidate audit — no added score

At exact audit SHA [`c365ba07df29cd6228a794f0c420230d448f91ee`](https://github.com/hibi89/astra_pdf_redesigner/commit/c365ba07df29cd6228a794f0c420230d448f91ee), Linux [#43650366545](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366545), Windows [#43650366554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554), and policy [#43650366939](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366939) passed. The upstream 5.5.0 installer downloaded only on the disposable Windows runner matched GitHub Scoop manifest SHA-256 `f3fc4236425b690c8be756f35793f77394ee004be0a6460a440c754d892f68bc`, then Authenticode returned `UnknownError` (same Universität Mannheim signer; Sectigo timestamp). The updated audit stopped before installation. It does not clear P119: exact-bundle notices/redistribution evidence remain missing for 5.5.3, and the 5.5.0 candidate is unapproved. P119/P120/P121 receive no score; 61/100 unchanged; G60 NOT PASSED; OCR_MANIFEST=null; RELEASE HOLD. [5.5.0 audit artifact]( https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554/artifacts/14135377855 ) SHA-256 `068625dc9be4c29db76b7b8fd8f29c20dda3d4a4c06954ee87d202e2c1abe472`.


## 2026-11-15 — P119 alternate official Windows supplier audit (no score)

Exact audit SHA [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530) passed Linux [#43651926094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926094), Windows [#43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099), and policy [#43651926332](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926332). The UB-Mannheim 5.4.0.20240606 installer hash matched the pinned Microsoft manifest at commit `dd11564899b74d402e5fd39cb6f7b31945170286`, but Windows Authenticode was `UnknownError` due to the signer/timestamp validity period; the candidate was not installed. Report [artifact 14136681467](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099/artifacts/14136681467) digest `426e2c00a342e651d9414cd2f43a1597a3c4dd2825a0ed0ad59f6fb4b895eb2f`. The exact-SHA Windows OCR rerun remained 9/12 exact, CER 0.0486 with the critical amount error; report [artifact 14136970048](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099/artifacts/14136970048) digest `36413a867222dc714455dd9ca81f1804fb8a42b796fa3a4f49fe2241aced8268`. P119/P120/P121 remain BLOCKED +0, provisional score remains 61/100, G60 NOT PASSED, official acceptance UNASSESSED, RELEASE HOLD, `OCR_MANIFEST=null`.


## Historical — P123 GitHub candidate audit before actual-model execution (+0; superseded)

Exact product source [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530); latest branch/doc head at the audit [`511161c9c2f7f35c484915b9f137f875e88a8890`](https://github.com/hibi89/astra_pdf_redesigner/commit/511161c9c2f7f35c484915b9f137f875e88a8890). Official QwenLM/Qwen3 still has no GitHub model weights or release assets. A third-party source/conversion repo, [`Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf`](https://github.com/Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf) at [`38a5c001fbdaf3485f98ba4d51d09ebd82f06547`](https://github.com/Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf/commit/38a5c001fbdaf3485f98ba4d51d09ebd82f06547), contains no model binary, has no GitHub release assets or repository license metadata, and its README says the GGUF files are hosted on Hugging Face. Its checksums alone cannot establish an artifact accessible under the GitHub-only constraint. No external host or local PC was used, and no model was downloaded or run. P123 remains BLOCKED +0; total 61/100, A08 4/14; G65 NOT PASSED.


## 2026-11-15 — 추가 GitHub Windows Tesseract 공급처 검색 (no score)

Read-only GitHub repository searches used the queries `tesseract windows installer`, `tesseract OCR Windows binaries`, and `tesseract setup Windows`. Results surfaced tutorials, source mirrors, and application repositories, but no candidate with a GitHub-accessible Windows binary, exact asset hash, valid Authenticode signature, and artifact-specific dependency NOTICE/license plus redistribution evidence. This search is discovery evidence only; it does not establish that no supplier exists outside these queries.

No binary was downloaded or installed, and no product code or runtime behavior changed. P119 remains BLOCKED +0; total remains 61/100; `OCR_MANIFEST=null`; RELEASE HOLD. Product source SHA remains `b6d7909e6897578181dbd304ff12491760422530`; docs at the start of this audit were `a85dbd5e21edeaf72d4d631666183731d6dce148`. Runtime tests were not rerun because no code changed.
