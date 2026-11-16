> **[HANDOFF-STARTUP-V2 | ACTIVE | 2026-11-16]** **먼저** `astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112` 역할/최신 HEAD와 `AGENTS.md` 상단 [OWNER-DEV-EXECUTION-V2](https://github.com/hibi89/hackathon-command-center-2026/blob/kmong-productization/docs/strategy/OWNER_DEV_EXECUTION_CANONICAL_20261116.md)의 적용 범위를 확정한 후 HANDOFF 최신 진행·차단/STATUS/REQUIREMENTS/확정 최종설계/실제 소스를 교차 검증하라. 오래된 HANDOFF 모델 담당·4슬롯 잠금·P85/95 지시는 역사일 뿐 현재 실행순서가 아니다. **웹 Sol High 최초 설계 → 웹 Sol Instant 주력 구현 → 구현 후보 후 전체 CI·수정(위험검사 유지) → Codex Sol Max/Astra Max 독립검수 → High 최종인수 → 사용자 GO 뒤 Luna Extra High 상품등록**.  원본/기능·데이터/보안·권리·검증 공식률/RELEASE HOLD 불변. 본 공시는 코드 검증 성공을 의미하지 않는다.

# Astra P114–P126 실행 재개 — 2026-11-15 KST

## 최신 완료 checkpoint

## 2026-11-15 KST — P123 VERIFIED +3 · 잠정 64/100

- **완료 작업 ID:** P123 (A08) VERIFIED, +3점. A08 4/14→7/14, 총점 61→64/100. 사용자 확정 A01~A12 배점은 변경하지 않았다.
- **정확 기능 SHA:** [`f5751bbb559f268706f2e7bc15438d0a8f590ed9`](https://github.com/hibi89/astra_pdf_redesigner/commit/f5751bbb559f268706f2e7bc15438d0a8f590ed9). GitHub Actions에서 실제 Qwen3-4B-Instruct-2507 Q8_0 CPU 추론과 production `LocalModelReview.tsx` 검수 UI를 확인했다.
- **실행 결과:** 사전 고정 synthetic 한국어 31건; 유효 제안 10건이 검수 UI에 표시되고 21건은 안전 거부/오류. 보호 숫자·날짜·금액·인명·표 행·부정문·인용·URL 서명은 모든 표시 제안에서 동일, 자동 적용 0. 취소는 114ms에 종료했고 synthetic localStorage V1/IndexedDB V2 sentinels가 유지됐다. 제안 지연 약 7.56–9.03초, sampled Ollama process-tree peak RSS 약 4.71GB; 정확 건별 수치는 보고서에 기록했다.
- **모델 출처/무결성:** GitHub release `locomotive-works/npu-local-model-running@v1.0`, pinned commit `6bbfd43a548c506734fb8899ed5adee5878a5e4a`; pinned LICENSE는 Apache-2.0 (blob `6634c8cc3133b3848ec74b9f275acaaa1ea618ab`). 결합 모델 SHA-256 `eed67be2a8eed4320ff71f3d5b350db10653549281e09b8967b97aeb1f1554ee`. 가중치는 Actions 실행 중에만 내려받았고 저장소·고객 빌드에 포함하지 않았다.
- **정확 SHA Actions:** [실 Qwen3 #43678897970](`https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897970`) SUCCESS; [Linux #43678897941](`https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897941`) SUCCESS; [Windows #43678897933](`https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897933`) SUCCESS; [정본 정책 #43678898126](`https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678898126`) SUCCESS. 네 실행 모두 feature SHA `f5751bbb559f268706f2e7bc15438d0a8f590ed9` 기준.
- **검증 보고서:** [Actions artifact 14147513507](`https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43678897970/artifacts/14147513507`), ZIP SHA-256 `d30312476d75175ef24847cbc35672b0b398f13dded94e0b77e8fb31c245b811`.
- **범위 제한:** 격리 GitHub runner와 합성 문단/sentinels만 사용했다. 고객 PDF·실제 사용자 V1/V2 저장소, Windows 구매자 PC, 판매 제품 번들/재배포는 검증하지 않았다. 모델은 localhost `127.0.0.1:11434`, `OLLAMA_NO_CLOUD=1`; 외부 추론 API·외부 모델 호스트는 사용하지 않았다.
- **게이트/출시:** G55 PASS. G60 NOT PASSED (P119–P121의 승인 OCR 공급자·실 Windows OCR/Electron 증거 미완), G65 NOT PASSED (현재 64점), G70 NOT PASSED. 공식 구매자 수용 UNASSESSED, RELEASE HOLD 유지.
- **다음:** P124 실제 모델 기반 3-SKU Windows Electron GUI acceptance. P119/P120/P121 및 P126은 OCR 공급처/의존성 증거에 계속 종속.

## 다음 실행 항목: P124

P123과 P117 선행 조건은 충족됐다. P124에서 실제 Qwen3 CPU 모델을 연결한 Windows Electron 흐름을 준비하고, BASIC8/PRO20/BUSINESS30 각각에 대해 정상/모델 없음/취소/위조·오류 경로, 실제 제안 10건 이상, 승인·거절·Undo, 승인되지 않은 원문 변경 0, 출력 PDF 문자 동일성을 검증한다. 기본 앱 V1/V2 회귀와 exact-SHA Linux/Windows/final-policy Actions를 포함한다. 모의 UI만으로 점수 부여 금지.

## 지속 제한 및 인계

- 현재 잠정 점수 64/100, A08 7/14. G55 PASS; G60/G65/G70 NOT PASSED. G65에는 65점 도달 별도 검증이 필요하다.
- 공식 구매자 수용 UNASSESSED, RELEASE HOLD. 고객 빌드 비활성, OCR_MANIFEST=null, production issuer/signing key 미설정 상태를 보존한다.
- P119–P121은 승인·해시·서명·묶음 라이선스/NOTICE가 확인된 Windows OCR 공급처가 없어 BLOCKED +0. P126은 P121 선행 작업이 막혀 대기.
- GitHub 저장소와 hosted Actions만 사용한다. 고객 문서/로컬 PC/외부 추론 API/유료 runner/외부 CI/Vercel은 사용하지 않는다. P123은 합성 데이터만 사용했다.
- 상세 scoring/evidence: [P123 verification](docs/evidence/astra/P123/VERIFICATION.md), [task register](docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json), [evidence score](docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md).

---


## 2026-11-15 KST — P119 additional GitHub Windows supplier search · BLOCKED +0 · provisional 61/100

GitHub repository search queries `tesseract windows installer`, `tesseract OCR Windows binaries`, and `tesseract setup Windows` surfaced no candidate meeting all requirements for an accessible Windows binary, exact hash, valid Authenticode, and exact bundle dependency NOTICE/license/redistribution evidence. No binary was downloaded/installed and no product code changed. Runtime tests were not rerun. P119 remains BLOCKED +0; total stays 61/100; G60/G65/G70 are not passed; official acceptance is UNASSESSED; `OCR_MANIFEST=null`; RELEASE HOLD. Resume when approved GitHub-accessible supplier evidence is available. P120/P121/P126 remain downstream; P123/P124 still need a GitHub-accessible licensed Qwen3 4B artifact.

## 2026-11-15 KST — P123 additional GitHub checkpoint audit · BLOCKED +0 · provisional 61/100

- Official QwenLM/Qwen3 GitHub has no 4B weights/releases. Third-party source repo [`Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf`](https://github.com/Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf) at [`38a5c001fbdaf3485f98ba4d51d09ebd82f06547`](https://github.com/Dadhichi-Sarker-Shayon/model-qwen3-4b-q4-k-m-gguf/commit/38a5c001fbdaf3485f98ba4d51d09ebd82f06547) contains only recipe/checksums; README says actual GGUF files are hosted on Hugging Face; no GitHub assets or repository license metadata. The checkpoint cannot be retrieved under current GitHub-only constraints.
- No model was downloaded or run; no external model host, local PC, or inference API was used. P123 remains BLOCKED +0; total 61/100; G65 not passed; official acceptance UNASSESSED; RELEASE HOLD.
- No code changed and no runtime tests were run this audit. Product code SHA remains `b6d7909e6897578181dbd304ff12491760422530`; current documentation is updated and goes through the final policy gate. P119 valid-signature/licensing evidence and P123 model artifact/license remain required before dependent work.

## 2026-11-15 KST — P119 UB-Mannheim 5.4.0 Windows candidate audit · BLOCKED +0 · provisional 61/100
- **Exact source SHA:** [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530). Linux [#43651926094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926094) SUCCESS; Windows [#43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099) SUCCESS; final blueprint [#43651926332](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926332) SUCCESS.
- **Windows result:** Node 289 pass / 0 fail / 1 OS-specific skip; desktop 86/86; new candidate guard 6/6; Tesseract 5.5.3 12-case real OCR step PASS; unsigned NSIS, install lifecycle, and 0.1.0→0.1.1 upgrade checks PASS.
- **P119:** UB-Mannheim 5.4.0 installer SHA matched pinned Microsoft manifest at signed commit `dd11564899b74d402e5fd39cb6f7b31945170286`; Authenticode is `UnknownError` due certificate validity period. Fail-closed audit did not install; PE/import/license scan absent. The 5.5.0/5.5.3 candidates have the same untrusted status. [Candidate report](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099/artifacts/14136681467) digest `426e2c00a342e651d9414cd2f43a1597a3c4dd2825a0ed0ad59f6fb4b895eb2f`.
- **P120:** OCR report [artifact 14136970048](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099/artifacts/14136970048) digest `36413a867222dc714455dd9ca81f1804fb8a42b796fa3a4f49fe2241aced8268`: 9/12 exact, CER 0.0486, critical amount mismatch. P119/P120/P121 remain BLOCKED +0. Score 61/100; G60/G65/G70 not passed; OCR_MANIFEST=null; RELEASE HOLD.
- **Superseded run:** [#43649218648](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43649218648), SHA `9540f7034c1404d3dea770c064bf29447e13c5c3`, was reported by GitHub as cancelled at 2026-11-14T23:24:28Z while still at the original unbounded installer audit; it produced no report and is not evidence or score.
- **Remaining blockers:** need an approved Windows Tesseract supplier with independently verifiable GitHub source/hash/signature and exact-bundle dependency license/NOTICE/redistribution evidence. P123 separately requires GitHub-accessible licensed Qwen3 4B weights plus exact SHA. P120/P121/P126 are downstream of supplier approval.

## 2026-11-15 KST — P119 alternate Windows asset audit · +0 · 61/100

- **SHA:** [`c365ba07df29cd6228a794f0c420230d448f91ee`](https://github.com/hibi89/astra_pdf_redesigner/commit/c365ba07df29cd6228a794f0c420230d448f91ee). Linux [#43650366545](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366545) PASS (Node 290/290); Windows [#43650366554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554) PASS (Node 289 PASS/0 FAIL/1 OS SKIP; desktop 86/86; OCR step PASS); policy [#43650366939](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366939) PASS.
- **Alternative asset:** official Tesseract 5.5.0 Windows release matched SHA-256 `f3fc4236425b690c8be756f35793f77394ee004be0a6460a440c754d892f68bc` from pinned GitHub manifest. Authenticode returned `UnknownError` (certificate validity-period error), same Universität Mannheim thumbprint as 5.5.3; candidate was not installed. [Audit artifact 14135377855](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554/artifacts/14135377855) SHA-256 `068625dc9be4c29db76b7b8fd8f29c20dda3d4a4c06954ee87d202e2c1abe472`.
- **P119/P120:** 5.5.3 actual OCR and static closure remain exploratory evidence; exact bundle license/NOTICE and redistribution remain unresolved. P119/P120/P121 BLOCKED +0; 61/100; G60/G65/G70 NOT PASSED; OCR_MANIFEST=null; RELEASE HOLD. Continue P119 with pinned 5.4.0 candidate audit if available.

Superseded exploratory Actions run [#43649218648](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43649218648) at SHA `9540f7034c1404d3dea770c064bf29447e13c5c3` was later reported by GitHub as cancelled (2026-11-14T23:24:28Z) at the original unbounded installer audit step and has no report. The current `c365...` workflow is pinned and fail-closed; do not treat the superseded run as evidence or score.

## 2026-11-15 KST — P119/P120 Windows re-audit · BLOCKED +0 · provisional 61/100
- **Source SHA:** [`0f82c8f0764cd00460abe3b27f97b497ce61ceb5`](https://github.com/hibi89/astra_pdf_redesigner/commit/0f82c8f0764cd00460abe3b27f97b497ce61ceb5); added `usp10.dll` Windows system-DLL classification and regression.
- **Exact SHA Actions:** Linux [#43647106432](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106432) SUCCESS; Windows [#43647106409](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409) SUCCESS; final blueprint [#43647106804](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106804) SUCCESS.
- **P119 BLOCKED +0:** upstream Tesseract 5.5.3 release asset SHA matched; Windows Authenticode is `UnknownError` (certificate validity period). Static import closure passes for 56 PE files: 286 direct, 0 delay, 157 Windows system and 129 bundled. Exact bundle dependency NOTICE/license and redistribution rights remain unverified; no binary was committed or bundled.
- **P120 BLOCKED +0:** 12 actual Windows kor+eng synthetic cases: 9 exact, 3 errors/omissions, mean CER 0.0486; critical number error `2,300,000원→22300,000원`. P119 approval and product UI/source review, PSM3/6, cancel/cleanup acceptance incomplete. [OCR report artifact 14134094222](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409/artifacts/14134094222) SHA-256 `d3466b486c91b2e24edb638104e7bc5ffeb8a11c9e889f641ebcc5e726ecc193`.
- **Score and next work:** 61/100 unchanged; G55 PASS, G60/G65/G70 NOT PASSED; official acceptance UNASSESSED; RELEASE HOLD; OCR_MANIFEST=null. P121/P126 and P123/P124 remain blocked on the prerequisite evidence described above. No independent P114–P126 task remains without these inputs.


## 2026-11-15 KST — P125 VERIFIED +2 · 잠정 61/100 · G60 미통과
- **완료:** P125(A09) main-process signed SKU action boundary. BASIC/PRO/BUSINESS 권한, 만료·발급자·서명·좌석·SKU 검증을 Electron main에서 side effect 전 수행한다. trusted top-frame, one-time request ID, 4096회 fail-closed bound. test-only JWK는 매 테스트 중 생성하며 저장소에 private key를 두지 않았다.
- **정확 기능·회귀 SHA:** `88c56e4188754f960ae94281b6d68e37b5081b62`. [P125 검증서](docs/evidence/astra/P125/VERIFICATION.md). Production issuer JWK/pin은 null, customer build false, 기존 demo preview 유지.
- **Linux PASS:** [#43641402429](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402429), exact SHA. Node 285/285 + build PASS, Chrome/Edge full A4/PDF/V1/V2 regressions PASS, P122 UI and P117–P118 browser paths remain green.
- **Windows PASS:** [#43641402454](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402454), exact SHA. Node 284 PASS/1 Windows OS-only SKIP/0 FAIL, desktop 81/81, Electron smoke and P106 synthetic checks PASS, NSIS install/run/uninstall/0.1.0→0.1.1 upgrade preserves STEP2 doc+PNG.
- **정본 정책 PASS:** [#43641402742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402742), exact SHA.
- **점수:** A09 5→7/11, 작업 점수 합계 59→61/100. G60 remains **NOT PASSED** because P119–P121 actual Windows supplier/OCR/Electron evidence is blocked; crossing 60 in task sum does not pass that gate. G65/G70 not passed. P126 remains BLOCKED on P121; official acceptance UNASSESSED, RELEASE HOLD.
- **실패 후보:** Windows unit regressions failed on earlier candidate SHAs while test fixtures/assertions were corrected; no candidate before this exact SHA receives credit. Latest rejected expectation on `440cae43022314684bb5d291107521853c10b3be`, Windows [#43640998165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43640998165), incorrectly expected an already valid receipt signed by the configured test key to be denied. It now uses an attacker-signed receipt plus injected attacker key and confirms main ignores the IPC-supplied key; final exact SHA passed all three workflows.
- **다음:** P126 BLOCKED because P121 cannot run without the approved OCR asset. P119–P121 and P123–P124 remain BLOCKED +0.

## 2026-11-15 KST — P123/P124 BLOCKED +0 · 잠정 59/100
- **P123:** actual Qwen3 4B CPU inference cannot be performed under the GitHub-only constraint. Official [QwenLM/Qwen3](https://github.com/QwenLM/Qwen3) main snapshot `7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e` has no GitHub Releases or model-weight assets; its README directs users to Hugging Face/ModelScope for checkpoints and says model-specific license files are in Hugging Face repositories. Those external model hosts and this PC's local model are outside this run's permitted sources. Therefore no exact 4B artifact SHA-256, license-file mapping, runner model installation, CPU/RAM/latency measurement, or 30-paragraph real-model result exists. **P123 0/3 BLOCKED**; no mock substituted. [P123 evidence](docs/evidence/astra/P123/VERIFICATION.md).
- **P124:** P117 is VERIFIED, but its other dependency P123 is blocked. No real-model 3-SKU Windows/Electron proposal, approval/reject/Undo, PDF equality, or model-missing path acceptance was performed. **P124 0/2 BLOCKED**; P122 mock evidence is not reused. [P124 evidence](docs/evidence/astra/P124/VERIFICATION.md).
- **Score/gates:** A08 remains 4/14; total 59/100. G55 PASS; G60 not passed because P119–P121 lack approved Tesseract asset and actual Windows OCR/Electron evidence; G65 cannot pass without real Qwen3. Official buyer acceptance UNASSESSED, RELEASE HOLD, OCR_MANIFEST=null.
- **Next independent work:** P125 main-process signed SKU policy; exact-SHA GitHub Actions are in progress. No P123/P124 credit claimed.

## 2026-11-15 KST — P122 VERIFIED · 잠정 59/100

- **완료 작업:** P122(A08) +2점. 고정 loopback/model, 명시 동의, 오래된 문서·블록 응답 폐기, 원문 안전검사를 실제 Chrome/Edge mock UI와 Electron bridge 회귀로 확인했다. [P122 검증서](docs/evidence/astra/P122/VERIFICATION.md).
- **정확 기능 SHA:** `d2a84d03ac8c791e74470e756cb6417a356776c3`. 30개 synthetic golden(이름·표·숫자·날짜·금액·부정·URL·인용)과 scope-bound proposal/Undo를 추가했다. 실제 Qwen3 실행은 없다.
- **Linux PASS:** [#43638127671](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127671), exact SHA. Node 278/278, build PASS; Chrome/Edge UI에서 무동의 호출0·자동 적용0·동일 문구 다른 block stale proposal0·원문 유지·외부 요청0.
- **Windows PASS:** [#43638127695](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127695), exact SHA. Node 277 PASS/1 Windows OS-only SKIP/0 FAIL, desktop 74/74, Electron bridge smoke, P106 synthetic, NSIS 설치/제거/업그레이드 및 STEP2 문서+PNG 보존 PASS.
- **정본 정책 PASS:** [#43638128095](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638128095), exact SHA.
- **실패 후보:** `45affeef40c96cb4991fadd6da6c706fa84afd41` Linux [#43637402373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43637402373)은 escape 오류 3건으로 FAIL·0점. 수정 최종 SHA에서 전체 CI를 통과했다.
- **점수:** A08 2→4/14, 57→59/100. P119/P120/P121은 0점 BLOCKED. G55 PASS, G60 미도달. 공식 수용 UNASSESSED, RELEASE HOLD.
- **다음:** P123 실 Qwen3:4b-instruct CPU 추론 환경·권리·모델 hash 확인. P119/P120/P121은 Tesseract 공급 자산/권리 확인 전 계속 차단.

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

## 2026-11-15 KST — P125 VERIFIED +2 · 잠정 61/100 · G60 미통과
- **완료:** P125(A09) main-process signed SKU action boundary. BASIC/PRO/BUSINESS 권한, 만료·발급자·서명·좌석·SKU 검증을 Electron main에서 side effect 전 수행한다. trusted top-frame, one-time request ID, 4096회 fail-closed bound. test-only JWK는 매 테스트 중 생성하며 저장소에 private key를 두지 않았다.
- **정확 기능·회귀 SHA:** `88c56e4188754f960ae94281b6d68e37b5081b62`. [P125 검증서](docs/evidence/astra/P125/VERIFICATION.md). Production issuer JWK/pin은 null, customer build false, 기존 demo preview 유지.
- **Linux PASS:** [#43641402429](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402429), exact SHA. Node 285/285 + build PASS, Chrome/Edge full A4/PDF/V1/V2 regressions PASS, P122 UI and P117–P118 browser paths remain green.
- **Windows PASS:** [#43641402454](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402454), exact SHA. Node 284 PASS/1 Windows OS-only SKIP/0 FAIL, desktop 81/81, Electron smoke and P106 synthetic checks PASS, NSIS install/run/uninstall/0.1.0→0.1.1 upgrade preserves STEP2 doc+PNG.
- **정본 정책 PASS:** [#43641402742](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43641402742), exact SHA.
- **점수:** A09 5→7/11, 작업 점수 합계 59→61/100. G60 remains **NOT PASSED** because P119–P121 actual Windows supplier/OCR/Electron evidence is blocked; crossing 60 in task sum does not pass that gate. G65/G70 not passed. P126 remains BLOCKED on P121; official acceptance UNASSESSED, RELEASE HOLD.
- **실패 후보:** Windows unit regressions failed on earlier candidate SHAs while test fixtures/assertions were corrected; no candidate before this exact SHA receives credit. Latest rejected expectation on `440cae43022314684bb5d291107521853c10b3be`, Windows [#43640998165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43640998165), incorrectly expected an already valid receipt signed by the configured test key to be denied. It now uses an attacker-signed receipt plus injected attacker key and confirms main ignores the IPC-supplied key; final exact SHA passed all three workflows.
- **다음:** P126 BLOCKED because P121 cannot run without the approved OCR asset. P119–P121 and P123–P124 remain BLOCKED +0.

## 2026-11-15 KST — P123/P124 BLOCKED +0 · 잠정 59/100
- **P123:** actual Qwen3 4B CPU inference cannot be performed under the GitHub-only constraint. Official [QwenLM/Qwen3](https://github.com/QwenLM/Qwen3) main snapshot `7a2f61ffc7a20d47efcd2bf97f6f2bf52729042e` has no GitHub Releases or model-weight assets; its README directs users to Hugging Face/ModelScope for checkpoints and says model-specific license files are in Hugging Face repositories. Those external model hosts and this PC's local model are outside this run's permitted sources. Therefore no exact 4B artifact SHA-256, license-file mapping, runner model installation, CPU/RAM/latency measurement, or 30-paragraph real-model result exists. **P123 0/3 BLOCKED**; no mock substituted. [P123 evidence](docs/evidence/astra/P123/VERIFICATION.md).
- **P124:** P117 is VERIFIED, but its other dependency P123 is blocked. No real-model 3-SKU Windows/Electron proposal, approval/reject/Undo, PDF equality, or model-missing path acceptance was performed. **P124 0/2 BLOCKED**; P122 mock evidence is not reused. [P124 evidence](docs/evidence/astra/P124/VERIFICATION.md).
- **Score/gates:** A08 remains 4/14; total 59/100. G55 PASS; G60 not passed because P119–P121 lack approved Tesseract asset and actual Windows OCR/Electron evidence; G65 cannot pass without real Qwen3. Official buyer acceptance UNASSESSED, RELEASE HOLD, OCR_MANIFEST=null.
- **Next independent work:** P125 main-process signed SKU policy; exact-SHA GitHub Actions are in progress. No P123/P124 credit claimed.

## 2026-11-15 KST — P122 VERIFIED · 잠정 59/100 GitHub-only 인수인계 (10항)

1. **완료 작업:** P122(A08) +2점. 127.0.0.1 고정 Ollama/model, 명시 동의, 모델 응답 검증, stale-response cancel, 수동 승인/Undo를 보강했다.
2. **정확 기능 SHA:** `d2a84d03ac8c791e74470e756cb6417a356776c3`; [P122 검증서](docs/evidence/astra/P122/VERIFICATION.md). 변경은 controller, LocalModelReview/Workspace, 30-case golden, Electron IPC test, synthetic Chrome/Edge harness 및 CI wiring이다.
3. **Linux:** [#43638127671](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127671) SUCCESS exact SHA. Node 278/278, build PASS; Chrome/Edge에서 동의 전 제안 호출0, auto-apply0, 문서·블록 scope/본문 변경 stale 응답 거부, 승인·Undo·예외/취소 원문 보존·외부 요청0.
4. **Windows:** [#43638127695](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127695) SUCCESS exact SHA. Node 277 PASS/1 OS-only SKIP/0 FAIL, desktop 74/74, Electron smoke, P106 synthetic audit, NSIS 설치·실행·제거·0.1.0→0.1.1 기존 V2 문서+PNG 보존 PASS.
5. **정책:** [#43638128095](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638128095) SUCCESS at exact SHA.
6. **Golden evidence:** 30개 합성 긍정/공격 사례에서 숫자·날짜·금액·부정문·이름·표 행·URL·인용 변조를 fail-closed 처리한다. 고위험 문장은 보수적으로 거부하며 의미 보존을 보증하지 않는다.
7. **점수:** A08 2→4/14, 총 57→59/100. P122에서 +2만 반영. G55 PASS, G60은 59점이라 미도달.
8. **시도 실패:** 최초 SHA `45affeef40c96cb4991fadd6da6c706fa84afd41`, Linux [#43637402373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43637402373) regex/test escaping 오류 3건 FAIL·0점; 수정 SHA 최종 full CI 통과.
9. **차단/보존:** P119/P120/P121 BLOCKED 0점; OCR_MANIFEST=null, RELEASE HOLD. 실제 Qwen3 CPU 추론·품질·모델 권리/hash 미검증. STEP1 V1, STEP2 V2, BASIC8/PRO20/BUSINESS30, seller key/customer build gate 불변.
10. **다음:** P123 actual Qwen3 local CPU model availability, source/license/hash/runner constraints check. P119 supplier artifact remains external blocker; official buyer acceptance UNASSESSED.

## 2026-11-15 KST — P119 공급자 근거 BLOCKED · 잠정 57/100 인수인계

1. **완료 판정:** P119 Windows Tesseract 공급처·재배포 감사를 수행했다. UB-Mannheim v5.4.0.20240606 installer의 GitHub Release `digest`가 `null`이고 SHA-256·Authenticode·실제 PE/DLL closure·candidate bundle의 재배포 권리가 입증되지 않아 P119는 **BLOCKED, +0점**이다.
2. **정확한 대상/변경:** 기능 코드는 수정하지 않았다. 출처 evidence와 P119–P121 차단 문서, 상태/점수/작업원장만 기록했다. 자세히: [P119 verification](docs/evidence/astra/P119/VERIFICATION.md), [candidate JSON](docs/evidence/astra/P119/SUPPLIER_CANDIDATE_AUDIT.json), [P120](docs/evidence/astra/P120/VERIFICATION.md), [P121](docs/evidence/astra/P121/VERIFICATION.md).
3. **점수:** P119 +0, A07 5/12, 총 잠정 57/100. 사용자 배점 고정. 공식 수용 UNASSESSED, RELEASE HOLD, `OCR_MANIFEST=null`.
4. **공개 출처 사실:** installer candidate 50,175,248 bytes, release v5.4.0.20240606 (2024-06-08); upstream v5.5.4 (2026-10-28)에는 Windows binary asset 없음. tessdata_best main의 kor/eng Git blob SHA-1 및 크기는 기록했으나 파일 SHA-256은 없음. Leptonica exact installer mapping/NOTICE 포함을 확인하지 못했다.
5. **테스트 결과:** 공급처 바이너리 검사는 NOT RUN/BLOCKED. 기존 synthetic fail-closed tests exact code SHA `420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02`: Linux [#43633902801](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902801) SUCCESS 276/276+build; Windows [#43633902770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902770) SUCCESS 275 PASS/1 OS-only SKIP, desktop 73/73, synthetic Authenticode; policy [#43633903290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633903290) SUCCESS. 이 결과는 실제 공급처 승인으로 해석하지 않는다.
6. **종속 차단:** P120 실 OCR 및 P121 Electron native OCR 시험 모두 P119 승인 자산이 없어 BLOCKED/0점이며 실제 실행·CER artifact 없음.
7. **보존 상태:** STEP1 V1, STEP2 V2, BASIC8/PRO20/BUSINESS30, 서명키/고객 build 차단, 원본·고객 데이터 보존. OCR_MANIFEST=null 및 RELEASE HOLD 유지.
8. **GitHub-only:** source audit는 GitHub 공개 repository/release metadata, Actions는 GitHub-hosted prior verification만 사용. 로컬 PC, 외부 CI, Vercel, 유료서비스, 외부 추론 API 사용 없음; 바이너리 다운로드/커밋 없음.
9. **한계·미검증:** asset hash/서명/PE imports/runtime DLL, exact bundled kor+eng, candidate NOTICE/re-distribution rights, 실제 OCR 품질 모두 미검증. 공식 구매자 수용은 UNASSESSED.
10. **다음:** 독립 P122 (127.0.0.1 고정 Ollama 동의/오래된 응답·원문 변경 방어) 진행. P120/P121은 공급자 승인 근거가 제공되면 재개한다.

## 2026-11-15 KST — P118 VERIFIED · 잠정 57/100 GitHub-only 인수인계 (10항)

1. **목표·범위:** P114~P118을 최신 기존 feature branch에서 검증했다. 사용자 확정 A01~A12 배점, STEP1 V1·STEP2 V2, BASIC8/PRO20/BUSINESS30, 서명·출시 차단 정책을 보존한다. 70점 후 GPT-6 High 독립 검수는 사용자 요청 시 진행한다.
2. **완료 작업·변경:** P118(A05 +1). 기존 로컬 레퍼런스 분석·비파괴 적용을 보강된 회귀로 검증했다. 변경 파일은 tests/step5-reference-browser.mjs, tests/step5-reference-analysis.test.ts; 제품 소스 변경은 없다. [P118 검증서](docs/evidence/astra/P118/VERIFICATION.md).
3. **최종 검증 기능 SHA:** 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02. Chrome/Edge 각각 PNG/JPEG/WebP 8종, 2페이지 PDF, 저장·취소·Undo·손상 PDF fail-closed와 V2/source 바이트 불변을 확인했다.
4. **정확 SHA Actions:** [Linux #43633902801](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902801) Node 276/276·build·Chrome/Edge PASS; [Windows #43633902770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902770) Node 275 PASS/1 OS SKIP, desktop 73/73, NSIS 설치/업그레이드 PASS; [정본 정책 #43633903290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633903290) PASS. 세 run의 head SHA는 모두 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02.
5. **수용 증거:** 8개 raster 사례의 예상 metric 범위·테마·색상을 양 브라우저에서 확인했다. 원본 파일 SHA-256과 전체 IndexedDB documents/assets/meta 및 asset SHA는 preview/PDF 분석 중 불변. Apply·PDF 출력·Undo 후 content/design 복원. 손상 PDF는 오류만 표시하고 미리보기·적용을 제공하지 않는다.
6. **점수:** P118 +1, A05 3→4/5, 총 56→57/100. 사용자 확정 배점 불변. G55 PASS 유지, G60 미도달. 공식 수용 UNASSESSED, RELEASE HOLD.
7. **실패 후보:** e2a7c04e693dea194b30aa11c4ee7cb20819739d Linux #43624942512는 Node 문맥의 브라우저 DOM 직접 참조로 실패(0점). CDP 평가로 수정했고 PNG/JPEG/WebP 전체 범위 최종 SHA에서 세 필수 workflow 재통과.
8. **미검증·차단:** 실제 폰트/권리·저작물 사용권, 구매자 레퍼런스 품질, 고객 PDF 수용, 물리 Win10/11, 한글 OCR/의미 인식은 미검증. OCR 및 판매 차단 정책은 변경하지 않았다.
9. **저장소:** hibi89/astra_pdf_redesigner의 feature/astra-p71-pdf-source-parity-20261112만 사용했다. GitHub-hosted Actions만으로 검증했다.
10. **다음:** P119 Windows Tesseract 공급처/해시/DLL/LICENSE 감사. 실 공급처·재배포권 근거가 없으면 0점으로 두고 다음 독립 작업을 진행한다.

## 2026-11-15 KST — P117 VERIFIED · 잠정 56/100 GitHub-only 인수인계 (10항)

1. **목표·범위:** P114–P117 검증을 마쳤다. 사용자 확정 A01~A12, STEP1 V1·STEP2 V2, BASIC8/PRO20/BUSINESS30, 서명·출시 차단 정책을 보존한다. GPT-6 High의 독립 검수는 사용자가 70점 달성 뒤 요청할 때 수행한다.
2. **완료 작업·변경:** P117(A04 +1). 이전 배치 대상을 누적 병합하던 BUSINESS plan 갱신을 새 선택으로 교체한다. Chrome/Edge 실제 UI 회귀와 위조 license guard 회귀를 추가했다. 상세 [P117 검증서](docs/evidence/astra/P117/VERIFICATION.md).
3. **최종 기능 SHA:** `c4d96dc02fb616e44773871952343161079e293b`; 기능 코드 변경은 부모 커밋 `e57396a47c2fdb46214601795df91fca6e44f16f` 및 테스트 선택자 수정 커밋 `c4d96dc02fb616e44773871952343161079e293b`에 반영됐다. 변경 파일: `src/step2/Workspace.tsx`, `tests/brand-batch-plan.test.ts`, `tests/sku-action-gate.test.ts`, `tests/step4-brand-batch-browser.mjs`, `.github/workflows/ci.yml`.
4. **정확 SHA Actions:** Linux #43622221289 (Node 271/271, build, Chrome+Edge PASS), Windows #43622221235 (Node 270 PASS/1 OS SKIP, desktop 73/73, NSIS PASS), 정책 #43622221573; 모두 head SHA `c4d96dc02fb616e44773871952343161079e293b`.
5. **기능 수용 증거:** Chrome·Edge 각각 21개 합성 V2 문서에서 2/5/20개 계획을 전환하고 총 27개 개별 A4 PDF를 검사했다. 비대상 미오염, 취소 뒤 21/21 원래 테마 복원과 V2 문서·assets 불변 PASS. Windows 0.1.0→0.1.1 NSIS 업그레이드 후 기존 STEP2 문서+PNG 보존 PASS.
6. **점수:** P117 +1, A04 13→14/15, 잠정 총점 55→56/100. A01~A12 최대 배점 변경 없음. G55는 이미 별도 PASS이고 G60/G65/G70은 미도달.
7. **시도 판정:** 초기 SHA `e57396a47c2fdb46214601795df91fca6e44f16f`의 Linux #43621810438은 브라우저 test의 꼬리말 선택자 충돌로 실패해 0점. 선택자를 좁힌 최종 SHA에서 세 필수 workflow를 재실행해 모두 PASS했다.
8. **미검증·차단:** 다중 배치 로고, 실제 고객 issuer pin/서명 발급·상용 사용권, 고객 문서·구매자 육안 수용, 물리 Win10/11은 미검증. 공식 수용 UNASSESSED, RELEASE HOLD 유지.
9. **저장소·진행률:** 기존 branch `feature/astra-p71-pdf-source-parity-20261112`만 사용했다. 코드·증거·진행률·핸드오프는 GitHub에 기록 중이며 사용자의 로컬 PC/외부 CI/Vercel/유료서비스/외부 추론 API를 사용하지 않았다.
10. **다음:** P118 로컬 레퍼런스 분석→비파괴 적용·재현성 강화. 목표 70점 달성 전까지 P114–P126 순서와 별도 G60/G65/G70 증거 게이트를 유지한다.

## 2026-11-15 KST — P116 VERIFIED · G55 PASS / 잠정 55/100 GitHub-only 인수인계 (10항)

1. **목표·범위:** 사용자 확정 A01~A12, STEP1 V1·STEP2 V2, BASIC8/PRO20/BUSINESS30, 출시 차단 정책을 유지하며 P114~P116을 검증했다. GPT-6 High는 70점 후 사용자 요청 시 독립 검수한다.
2. **완료 작업·변경 파일:** P116(A04)에서 기존 30개 레이아웃의 실제 A4 PDF 구조·텍스트·이미지 회귀를 추가했다. 제품 레이아웃 코드는 그대로이며 변경 파일은 `tests/step4-style-preset-browser.mjs` 하나다. 상세: `docs/evidence/astra/P116/VERIFICATION.md`.
3. **검증 기능 SHA:** `b03583f12c5eb212dd0207fb539593ec7c2b8df3`. Linux #43618379958: npm test 269/269, build PASS, Chrome 및 Edge 각각 30/30 A4 PDF·문자 순서·40개 표식·PNG/V2·경계/겹침 PASS. Windows #43618379926: 268 PASS, 1 OS 전용 SKIP, 0 FAIL; desktop 73/73, 설치/업그레이드 PASS. 정책 #43618380099 PASS.
4. **점수·별도 게이트:** P116 +1, A04 12→13/15, 잠정 54→55/100. G55를 별도 PASS로 적용했다. P114+P115+P116 증거는 `docs/evidence/astra/G55/VERIFICATION.md`. 공식 구매자 수용은 UNASSESSED.
5. **실패 후보·시험 판정:** SHA `254e8c2b39488c0e2caad733b88fb2abfe04f31f`의 Linux #43618017819은 PDF 추출 공백 정규화 차이로 실패했고 0점 처리했다. 최종 SHA에서 문자 순서 비교와 개별 표식 검사를 수정해 통과시켰다. 다른 실험 실패 후보도 점수 미인정.
6. **저장소·커밋:** `hibi89/astra_pdf_redesigner`, `feature/astra-p71-pdf-source-parity-20261112`; 검증 코드는 위 정확 SHA. 증거/상태 문서는 별도 문서 커밋으로 기록한다.
7. **런너·자료:** GitHub-hosted Linux/Windows만 사용. 합성 ASCII 원문·2×2 PNG 사용, Actions에서 60개 브라우저 PDF를 임시 생성·검사·폐기. 고객 원본·유료 API/CI·외부 AI 추론·Vercel 사용 없음.
8. **정확 SHA CI:** [Linux #43618379958](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379958), [Windows #43618379926](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379926), [정책 #43618380099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618380099) 모두 SUCCESS, 각각 head SHA `b03583f12c5eb212dd0207fb539593ec7c2b8df3`.
9. **미검증·차단:** Poppler CJK 텍스트 계층/한국어 추출 정합, 고객 PDF와 실제 구매자 시각 품질, 종이 출력, 물리 Win10/11은 미검증. STEP1 V1, STEP2 V2, SKU·서명키·OCR/고객 출시 차단은 유지. 공식 수용 UNASSESSED, RELEASE HOLD.
10. **다음:** P117 BUSINESS 다중 문서 브랜드 재사용·저장·취소·SKU 우회 회귀. G60/G65/G70은 각각 별도 증거 후 적용.
## 2026-11-15 KST — P115 VERIFIED / 잠정 54/100 GitHub-only 인수인계 (10항)

1. **목표·범위:** Astra STEP1~7, 확정 A01~A12 가중치, P114~P126 50→70 실행 순서, BASIC8/PRO20/BUSINESS30 보존. GPT-6 High는 사용자 호출 시 별도 독립 검수.
2. **완료·변경:** P115는 원본/출력 PDF의 숫자 포함 토큰, 기호, 부정 표현, 링크 및 추가/중복 토큰 차이를 페이지 위치와 함께 분리한다. 수동 검토·취소/오류 복구를 유지하고 원본 SHA, V1/V2 및 자동승인 금지를 검증했다. 변경: `src/step7/OfflinePdfReview.tsx`, `src/step7/tokenParity.ts`, `tests/fixtures/step7-pdf-parity-corpus.mjs`, `tests/step7-pdf-review-browser.mjs`, `tests/step7-token-parity.test.ts`.
3. **테스트·정확 SHA:** 기능 SHA `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`. [Linux #43612143269](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143269) SUCCESS: Node 269PASS/0FAIL/0SKIP, build PASS, Chrome·Edge 각 15/15 실제 A4 합성 쌍 대조, 오류/취소·원본 SHA/V1/V2 불변 PASS. [Windows #43612143223](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143223) SUCCESS: Node 268PASS/0FAIL/1 Windows 전용 SKIP, desktop 73PASS/0FAIL, NSIS 설치·실행·제거·0.1.0→0.1.1 V2 문서/PNG 보존 PASS. [정본 정책 #43612143523](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143523) SUCCESS.
4. **당시 P115 결과:** P115 +2, A03 10→12/14, 누적 52→54/100. 이후 P116/G55 최신 결과는 이 파일 최상단 인수인계에 기록했다. 공식 구매자 최종 수용 UNASSESSED, RELEASE HOLD.
5. **오류·시도:** #43611032904 V1 합성 기준 데이터 누락, #43611361119 SHA helper import 누락, #43611776507 마이그레이션 기준 스냅샷 순서 오류. 테스트를 각각 보정했고 실패 후보 가점은 0. 최종 SHA에서 세 Actions 전체 PASS.
6. **저장소·버전:** `hibi89/astra_pdf_redesigner`, `feature/astra-p71-pdf-source-parity-20261112`. 검증 기능 SHA `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`. 증거 `docs/evidence/astra/P115/VERIFICATION.md`, 등록 `docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json`; 문서 동기화 SHA는 기능 검증 SHA와 구분한다.
7. **실행 환경:** GitHub-hosted Ubuntu Node22 Chrome/Edge 및 Windows Electron/NSIS만 사용. 입력 15쌍과 데이터는 합성. 사용자 로컬 PC, 외부 CI, Vercel, 유료 서비스, 외부 AI API, 고객 원본 전송 없음.
8. **CI 링크:** [Linux Chrome/Edge #43612143269](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143269), [Windows Electron/NSIS #43612143223](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143223), [Final blueprint policy #43612143523](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43612143523). 세 실행은 모두 정확 SHA `a89c7a7dfbb2e18ef1c5f328e248d2e60ec69a0d`.
9. **수용 범위/미검증:** 합성 PDF에서 숫자·날짜·기호·부정·링크 차이 대조와 V1/V2/원본 무손상만 입증. 실제 표·다단 의미 정확성, 이미지 픽셀 재구성, 고객 PDF·물리 Win10/11·Windows OCR·Qwen3 CPU·구매자 수용은 미검증. 점수는 잠정, 공식 수용 UNASSESSED, RELEASE HOLD.
10. **당시 다음:** P116 30개 A4 검수 및 G55 별도 게이트. 완료 결과와 현재 다음 작업 P117은 최상단 인수인계에 기록했다.

## 2026-11-14 21:55 KST — P114~P126 50→70 High 설계 공시 / Instant 인수인계 10항

1. **목표·용도·확정요구·기술:** 사용자 최종설계 A01~A12 배점 총100, Astra 로컬 PDF STEP1~7와 BASIC8/PRO20/BUSINESS30, React/TS/Vite, Electron/NSIS, local Tesseract/Ollama는 별도 설치·검증. 현재 잠정 50/100, 공식 UNASSESSED. 사용자 최신 지시: High는 **설계만**, Instant가 개발을 실행하며 70점 이후 100점까지 추진, 이후 사용자 요청 시 High 재검수.
2. **완료 변경·선택 근거:** [P114~P126 50→70 작업별 실행 설계](docs/commercial/ASTRA_P114_P126_50_TO_70_EXECUTION_PLAN_20261114.md), [JSON 점수·의존·증거 작업 원장](docs/commercial/ASTRA_P114_P126_TASK_REGISTER_20261114.json), [P127~P138 70→100 후속·High 감사 체크리스트](docs/commercial/ASTRA_INSTANT_70_TO_100_HANDOFF_20261114.md) 생성. 13개 단계 P114~P126 총 +20점: A03 +4, A04 +2, A05 +1, A07 +3, A08 +7, A09 +2, A10 +1. 기존 12영역 최대 가중치 변경 0. 모델은 사용자 설치 Ollama Qwen3 우선(모델 동봉/배포 대비 유지비·보안 부담 최소), OCR은 출처/권리 감사→격리 Windows 실검증 우선(무허가 패키징 반대), 문서/브랜드는 비파괴 세션 경로 유지.
3. **테스트 명령·실제 결과·미검증:** 이번 회차는 문서/JSON 생성·합계/13개 PENDING 불변 검증만 수행; **코드 테스트·새 CI 미실행**, 점수 +0. 기준 정확 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1`: 이전 Linux Node 263 PASS/0 FAIL, Chrome/Edge SUCCESS [#43595956953](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956953); Windows Node262 PASS/1 SKIP, desktop73 PASS, NSIS SUCCESS [#43595956932](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956932); 정책 SUCCESS [#43595957159](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595957159). Instant 재현: npm test, npm run build, npm run desktop:test, npm run ocr:release-gate 및 Chrome/Edge/Windows NSIS 실제 CI. 코드 변경 후 새 SHA 재검증 필수.
4. **상태/차단:** P114~P126 **전체 PENDING**, 코드 미착수, 완료 선언 금지. 50→70은 '검증 후 인정될 경우' 상한 목표. 실제 Qwen3 4B CPU/Astra 윤문, Windows OCR 공급자·kor/eng·DLL 라이선스, 실고객 Win10/11·허가 PDF 5~10건, 상용 판매 키/환불/법적 승인 차단. 잠정 50, 공식 UNASSESSED, RELEASE HOLD, 등록 미완.
5. **오류 근거·시도·대안/중단:** 과거 P111 Windows 스모크 실패는 preload/동의 오류 예상값 변경 뒤 최종 SHA 3/3 정상화됨. 구 실패 방식을 반복하지 않는다. 앞으로 기능 구현 중 2회 무진전 실패하면 중단·전환해 차단 원인(코드/CI/자산/라이선스/고객)과 1~3개 대안을 보고하고 독립 작업을 진행한다. mock/model 미설치/CI Ready를 실모델/실고객 수용으로 오인 금지.
6. **저장소·브랜치·SHA·경로:** `hibi89/astra_pdf_redesigner` / `feature/astra-p71-pdf-source-parity-20261112`; 기준 실제 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1`; 설계 이전 문서 HEAD `7ed25d4f04ba10bad18e96c6986bb9a5e97a0b08`. 이번 설계 문서 파일 3개는 위 링크, 최신 문서 HEAD는 GitHub ref readback으로 확인. 이 뒤 소스 변경 없음.
7. **Production URL/Vercel/실행:** Product 판매 Production/Vercel **미적용**. 테스트 환경은 GitHub-hosted Linux Chrome/Edge, Windows Electron/unsigned NSIS. 로컬 npm test/build/desktop:test 등은 사용자 PC 개입 없이 runner에서 가능한 범위만. 실제 사용자 Windows PC·고객 PDF는 최종 수동 단계에 모음.
8. **원본·백업·인증/수정금지:** P113 기능 SHA와 이번 설계 전 문서 HEAD를 참조 복구. main/PR#10, 고객 PDF/이미지/문서, STEP1 V1, STEP2 V2, 기존 레이아웃, 사용자 저장 데이터 보존. OCR_MANIFEST=null, customer build flag=false, seller public JWK/pin=null 유지. 고객 원본/민감문장/비밀키/.env·대용량 모델·OCR 실행파일 GitHub 업로드 금지. 크몽 타상품 및 등록완료 이력 변경 금지.
9. **Instant 다음 우선순위/완료 기준/승인:** 첫 `ㄱ`에 P114 시작. P115~P126 의존 순서 및 각 수용검사(부정/합성/실제 인식/CPU·Windows 설치·데이터 무결성)를 계획대로 수행. 점수·STATUS/HANDOFF·중앙 Astra 행 갱신은 정확 새 SHA CI 통과 후. 70 달성 뒤 P127~P138 후보를 최신 근거로 재평가하여 100까지 추진. 유료/보안·권한/서명키/판매·배포/고객 데이터 외부 전송은 별도 승인.
10. **갱신 KST·근거 범위:** 2026-11-14 21:55 KST 사용자 최신 역할 전환·50→70 공시 요구 기준. **검증된 것은 계획 파일 존재·작업13/증분20/분야합계70 계산**, 코드 개발/새 CI/고객 검수는 이 회차에 미수행. 공식 UNASSESSED, RELEASE HOLD. High 최종 독립 검수는 사용자 명시 재호출이 필요.

## 2026-11-14 KST — P111~P113 최종설계 잠정50% 달성 인수인계 (10항)

1. **목표·확정 요구·기술:** Astra PDF Redesigner, 12개 확정 영역 A01~A12 100점, STEP1~7와 BASIC8/PRO20/BUSINESS30. P111 로컬 Ollama Qwen3 adapter / P112 BUSINESS batch & STEP6 source link / P113 OCR 수동 대조. 로컬 React/TS/Node/Electron/NSIS. 사용자 요구는 우선 50% 도달 후 100%까지 연속 개발.
2. **완료·설계 비교:** A08 로컬 Ollama 고정 127.0.0.1:11434 및 `qwen3:4b-instruct` 별도 사용자 PC 설치 모델, 사용자 명시 동의·검사/수정 전후/되돌림. 대안 A 별도 런타임·모델 번들(품질/용량·재배포권 검증 필요) 대비 B 기존 설치 모델 로컬 API(추가 API 비용0·배포물 중량 증가0, 채택). A04는 기존 영구 V2 스키마 변경 대신 세션 메모리 브랜드 계획(2~20문서, 각각 독립 PDF 저장, V2 보존) 채택. A06 출처 기록 수동 파일 선택만(온라인 자동 크롤 금지), A07 페이지 시각/수동 대조 UI. 내장 모델이나 OCR 비밀·자산 새로 동봉하지 않음.
3. **테스트·정확 SHA:** `npm test`, `npm run build`, `npm run desktop:test`, `npm run ocr:release-gate`. 기능 SHA **`26aff40d6de524c2430f8a6b325d906cea67f7e1`**. [Linux Chrome+Edge #43595956953](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956953) 2/2 SUCCESS, Node **263PASS/0FAIL/0SKIP**, 실제 브라우저 합성 PDF·IndexedDB 회귀 PASS; [Windows Electron+NSIS #43595956932](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956932) SUCCESS, Node **262PASS/0FAIL/1 OS SKIP**, desktop **73PASS/0FAIL**, 설치·제거/업그레이드 0.1.0→0.1.1 V2/PNG 보존 PASS; [정본 정책 #43595957159](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595957159) SUCCESS. 정확 SHA 3/3 및 raw job logs 확인. P111 Ollama mock HTTP8/8, P112 batch plan4/4, P111~113 UI wiring4/4 신규. 별도 이 컨테이너에서 정식 Tesseract 5.5.0 kor/eng/Pillow/NanumGothic 합성 이미지 3건 **2 정확/1 실패**(실측이지만 앱 IPC 실행 아님).
4. **완료/진행/대기/차단:** 총괄 잠정 전체 설계 점수 **50/100(+8)** A04 12/15, A06 4/5, A07 5/12, A08 2/14. 사용자 승인 부분점수 아님 → **공식 UNASSESSED**, 출시 RELEASE HOLD. A08 실 윈도우 Astra 모델 윤문과 품질 수용, OCR Windows 공급업체 DLL·실 스캔, 고객 PDF5~10/Win10·11, 상품·법적 승인 미완.
5. **오류 근거·시도·재시도 금지·대안:** 중간 P111 Windows 실패1: 기존 `tests/desktop-shell.test.cjs`가 preload `localModelPropose:text=>` 문자열 고정 검사; 정확 원인과 새 `(text,explicitConsent)=>` 비교로 수정. Windows 실패2: 기존 installed Electron smoke가 미동의 모델 호출을 `unavailable`로 기대했으나 새 계약은 `local-model-consent-required` error, smoke 기대값 수정. 구 중간 커밋 CI SUCCESS/FAIL을 최종 검증 증거로 쓰지 않음. 정확 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1` 3/3 SUCCESS로 회귀 종료. 합성 Ollama 테스트를 실제 한국어 모델 추론 성공으로 전용 금지. 실제 Tesseract 샘플3의 실패를 품질 개선 대상으로 유지.
6. **저장소·브랜치·SHA·경로:** 제품 `hibi89/astra_pdf_redesigner` / `feature/astra-p71-pdf-source-parity-20261112`; 기능 `26aff40d6de524c2430f8a6b325d906cea67f7e1`. `desktop/owner-ollama-controller.cjs`, `desktop/main.cjs`, `desktop/preload.cjs`, `src/humanize/LocalModelReview.tsx`, `src/step2/Workspace.tsx`, `src/step4/brandBatchPlan.ts`, `src/step6/SourceRecordsPanel.tsx`, `src/step7/LocalOcrPanel.tsx`, `tools/verify-real-korean-ocr.py`, 관련 `tests/*`. 문서 `docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md`, `STATUS.md`, `HANDOFF.md`.
7. **배포/실행·환경:** Production URL·Vercel 미적용. React Vite 빌드, GitHub-hosted Windows2025 unsigned NSIS, Linux Chrome/Edge 검증. 로컬 Ollama 사용자 설치 모델 연동 코드는 동작 준비되었으나 실제 Astra owner PC 시험 미완. OCR 앱 번들 RELEASE HOLD. GitHub Actions SUCCESS는 고객 PC 정상의 대체 증거가 아님.
8. **원본·백업·인증·수정 금지:** 시작 제품 문서 HEAD `f1837253d488ddc9f51c1910a57bc012b2666467` 안전복구 기준, 이후 정확 기능 SHA 위에서 문서 갱신. 고객 원본 PDF·STEP1 V1/STEP2 V2·8+22 후보·`main`/Draft PR#10 변경 금지. 개인키, 고객 텍스트, .env, 토큰 저장/외부 전송 금지. `PRODUCTION_ISSUER_JWK=null`, pinned SHA=null, `ASTRA_CUSTOMER_BUILD_ENABLED=false`, OCR_MANIFEST=null. 중앙 타상품·등록이력 보존.
9. **다음 작업·완료 기준·승인:** P114 실제 허가/합성 문단의 Windows Ollama Qwen3 추론(최소 고정 8케이스 + 날짜/금액/부정/고유명사), 거부/승인/Undo 실제 UI/중간 취소, BUSINESS 대상 문서 2~20개 화면·출력, Tesseract 실제 Windows 공급자 해시/Authenticode/언어팩 및 로고·다단 검증. 차후 사용자 보유 허가 PDF5~10 육안 수용, 실제 설치기 서명/법무·라이선스·판매자 키 승인은 분리. 실행 불가 PC 작업은 마지막에 모아 요청.
10. **갱신·검증범위:** 2026-11-14 KST, 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1`, Linux Node/Chrome/Edge + Windows Node/Electron/NSIS + 정본 정책 **3/3 SUCCESS** raw logs 직접 확인. 총괄 잠정 50/100(공식 UNASSESSED), [작업중], RELEASE HOLD, 크몽 미등록. 소스 SHA와 문서·중앙 원장 HEAD 별도 재조회.

## 2026-11-14 KST — P110 Electron PDF IPC 신뢰경계 + 최종설계 잠정42% 인수인계 10항

1. **목표·용도·확정 요구·기술:** Astra 로컬 PDF STEP1~7/3SKU, 사용자 최종 12영역 배점100. P109 GUI SKU 검증 뒤 P110 Electron main process PDF IPC 외부 창·하위 프레임·출처 위조 차단. Node22/TypeScript/React/Electron/NSIS; 외부 서비스·과금0.
2. **완료 기능·결정:** 대안 A native IPC에서 정확 top-frame/source/window 검증(채택; 적은 변경·비용0·기존 프리뷰 유지), B React UI 버튼 검사만 수행(동일 렌더러의 우회 가능, 제외). 새 `desktop/pdf-export-ipc-guard.cjs`에서 요청 Sender, senderFrame===mainFrame, 정확 `astra://app/index.html`, 생존 창 검사. `desktop/main.cjs` PDF 실제 printToPDF 전 검사. 새 `tests/pdf-export-ipc-guard.test.cjs` 6개; `package.json` Node+desktop 테스트 포함. 고객용 라이선스/DRM 활성화는 미완.
3. **테스트 명령/실수:** 기능 `5ed3525947f0225888963806f95d8f821ca03394`. `npm test`, `npm run build`, `npm run desktop:test`, `npm run ocr:release-gate`. [Linux Chrome·Edge #43593105358](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105358) **2/2 SUCCESS**, **247PASS/0FAIL/0SKIP**. [Windows Electron·NSIS #43593105373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105373) **SUCCESS**, Node **246PASS/0FAIL/1 OS symlink SKIP**, desktop **65PASS/0FAIL**, NSIS 설치·제거/업그레이드 0.1.0→0.1.1/V2/PNG PASS. [정본 정책 #43593105644](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105644) SUCCESS. P110 신규6/6 두 테스트 경로 PASS; 원시 logs+정확 SHA 3/3 확인.
4. **완료·진행·대기·차단:** IPC 출처/프레임과 CI 검증 완료. 사용자 설계 총괄 **잠정 42/100**(+1 A09)이며 정식 부분점수 승인 전이라 공식 UNASSESSED. customer build 실제 signer public JWK/pin, same-frame IPC abuse, 강력 DRM, 환불/철회·실 기기, 실 OCR/한국어 AI/물리 Win10/11/PDF5~10 미완. [작업중], RELEASE HOLD.
5. **오류 근거·시도·실패/전환:** P110 최초 코드 SHA `c2c3951474fa6af2e1562a24e18b4f002db733d4`는 보안 테스트 파일을 npm script 목록에 넣지 않아 새 테스트가 CI에서 실행되지 않았음. Node/Windows 기존 테스트 SUCCESS를 P110 신규6 PASS로 오인하지 않고 `package.json` 양 경로에 추가 → 새 SHA `5ed3525947...`로 6/6 실행+전체3/3 CI 재검증. 실행 중 로그 404는 미완결 job blob 조회였으며 기능 실패가 아님. 임의 구 동작 성공을 새 보안테스트 성공으로 전용 금지.
6. **저장소·브랜치·SHA·경로:** `hibi89/astra_pdf_redesigner`, `feature/astra-p71-pdf-source-parity-20261112`, P110 기능 SHA `5ed3525947f0225888963806f95d8f821ca03394`, 수정 `desktop/pdf-export-ipc-guard.cjs`, `desktop/main.cjs`, `tests/pdf-export-ipc-guard.test.cjs`, `package.json`, `docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md`, `STATUS.md`, `HANDOFF.md`.
7. **Production·Vercel/환경:** GitHub-hosted Windows NSIS unsigned test·Linux Chrome/Edge, 정식 Production/Vercel 미적용, 실제 판매자용 signed 설치기·물리 Windows 및 구매자 설치 미검증.
8. **원본·백업·비밀·수정 금지:** P110 이전 P109 제품 문서 HEAD `d24e73f82fe28e8f94b0ef15cc27d4460d0c40ff` 복구 기준. main/Draft PR10, 고객 원본 PDF, STEP1 V1·STEP2 V2, 기존 디자인 8+22, OCR_MANIFEST null, 모든 실제 비밀키/토큰/.env, 중앙 타상품 및 등록이력 불변. 고객 모델/OCR 외부 전송0.
9. **다음 우선순위·절차·완료기준/승인:** P111 Electron main에서 신뢰성 있는 실제 서명 영수증 검증을 요구하는 구매자용 별도 경로(내부 테스트 preview 분리), direct IPC 및 영수증 위조/만료/revoke/보안 정책 회귀 → A08 합법 GGUF 한국어 CPU 추론·A07 정식 Tesseract 실제 공급처/Windows 한글 인식/법무 검증 → 실 고객 승인 PDF5~10/물리 Win10/11. 사용자 요청 전 판매/권한/실제 키/상용 출시 금지.
10. **갱신/확인/문서 기준:** 2026-11-14 KST, 정확 기능 SHA `5ed352...` 전체3/3 workflow+raw job PASS 확인. **총괄 잠정 최종설계 완성률 42/100**, 공식 UNASSESSED, RELEASE HOLD. 문서 최신 HEAD와 중앙 kmong HEAD는 별도 readback 확인.

## 2026-11-14 KST — P109 3SKU GUI·PDF 실행 경로 정확 SHA 3/3 CI 검증 인수인계 10항

1. **목표·용도·요구·기술:** STEP1~7 Astra PDF, BASIC8/PRO20/BUSINESS30과 12영역100점 확정 사용자 설계 중 A09 SKU 실행 경로. P96 ECDSA P-256 offline receipt/P107 pinned issuer, React/Node22/Electron/Windows NSIS, 무료·로컬·기존 시연 기능 보존.
2. **완료 기능·비교·결정:** A 내부 developer preview 보존 + 고객 상용 실행 경로마다 서명 검증(채택, 비용0/기존 시연 회귀 최소화). B UI tier/localStorage 문자열만 체크(빠르나 위조 취약, 배제). 신규 skuActionGate.ts·CommercialLicensePanel.tsx·5 합성 테스트와 Workspace/PDF 출력·배치 검수/PRO/BUSINESS 보관함 action 연결. receipt는 상태 메모리만, 공개키 pin null이면 상용 액션 거부. 내부 프리뷰 통과를 고객용 판매 승인으로 혼동 금지.
3. **테스트 명령·PASS/FAIL/SKIP:** 기능 SHA **`ee7ed4eaacf44a08800b56639d2178f5df76e7d3`**, `npm test`/ `npm run build`/ `npm run desktop:test`/ `npm run ocr:release-gate`. Linux Chrome·Edge [#43591625251](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625251) **2/2 SUCCESS**, Node **241PASS/0FAIL/0SKIP**, Chrome·Edge 실제 합성 PDF/IndexedDB PASS. Windows [#43591625273](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625273) **SUCCESS**, Node **240PASS/0FAIL/1 symlink SKIP**, desktop **59PASS/0FAIL**, NSIS 설치·제거/0.1.0→0.1.1 V2·PNG 보존 PASS. 최종설계 [#43591625548](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625548) SUCCESS. P109 신규 **5/5 PASS**, 정확 기능 SHA CI **3/3 SUCCESS** 및 원시 logs readback.
4. **완료/진행/대기/차단:** GUI 상용 영수증 검사, 3SKU 저장·출력 직전 검증 및 내부 프리뷰 회귀 구현·CI 검증 완료. 고객 build sign-off, 실제 seller key/pin, Electron main IPC 직접 호출 보안, 브라우저 인쇄 우회, 취소·환불/좌석·기기 정책, OCR·한국어 GGUF 실 공급자·실물 Win10/11·허가 PDF5~10은 미검증·미구현. 공식 UNASSESSED, RELEASE HOLD.
5. **오류·시도·재시도 금지·대안:** 통합 원격 소스 패치의 공백/중복 문자열 앵커 불일치와 별도 JS 문법 오류 발생 → 커밋 전 중단, 보존 확인 후 단일 파일·작은 범위 sequential 안전 수정으로 전환. 최신 정확 SHA Linux/Windows/정책 성공. 상용 flag=false 조건의 내부 시험 실행을 DRM 성공/무단 판매로 판단 금지. 실패한 대규모 문자열 패치 반복 금지.
6. **저장소·브랜치·SHA·주요 경로:** `hibi89/astra_pdf_redesigner` / `feature/astra-p71-pdf-source-parity-20261112` / 기능 `ee7ed4eaacf44a08800b56639d2178f5df76e7d3`. 경로 `src/commercial/skuActionGate.ts`, `CommercialLicensePanel.tsx`, `src/step2/Workspace.tsx`, `src/step3/BatchImportPanel.tsx`, `src/step4/{ProLayoutLibrary,BusinessBrandLibrary}.tsx`, `tests/sku-action-gate.test.ts`, `docs/commercial/ASTRA_P109_GUI_SKU_GATES_20261114.md`. 문서 HEAD 별도 readback.
7. **Production/URL·환경:** Chrome·Edge GitHub Linux runner/Windows Electron·unsigned NSIS Github runner. 물리 고객 PC·배포 서명·상용 등록/Vercel Production 미적용. 고객별 독립 설치/실제 라이선스 검수 없음.
8. **원본·백업·권한·수정 금지:** P109 시작 제품 HEAD `42594efcb675ba86d6700e33d5c8b0b316290a5c` 복구 기준. `main`, Draft PR10, 고객 원본PDF, STEP1 localStorage V1/STEP2 IndexedDB V2, 기존 8+22 시안, 중앙 타제품, 실제 개인키·토큰/.env/기존 등록 이력 불변. `ASTRA_CUSTOMER_BUILD_ENABLED=false`, 실제 판매자 공개키 pin null, `OCR_MANIFEST=null` 유지.
9. **다음 우선순위/절차·완료/승인:** P110 Electron main process PDF IPC에서 구매자용 신뢰 경계·직접 호출 차단/개발 preview 분리(기본 릴리스 HOLD 유지), 실제 라이선스·만료·위조 테스트, 출력·저장 우회 회귀 → 실 공급자 OCR/로컬 한국어 AI Windows CPU·법무/실 PC/허가 PDF 수동 QA → A01~12 정확 수용 증거 산정. 키 생성·운영·판매·배포·보안/권한 변경은 별도 승인.
10. **갱신일시 KST·검증범위·기준:** 2026-11-14 KST, 기능 `ee7ed4eaacf44a08800b56639d2178f5df76e7d3` 정확 SHA CI Linux/Win/정책 최종 3/3 상태+raw logs 확인. 테스트의 합성 PDF와 실제 고객 원본 품질/물리 Win10/11/상용 법적 수용은 엄격 분리. 공식 UNASSESSED/100 미달, RELEASE HOLD, 크몽 미등록.

## 2026-11-14 KST — P108 오프라인 라이선스 발급·연장 정확 SHA 3/3 CI 최종 성공 인수인계 10항

1. **목표·용도·요구·기술:** Astra 최종 7단계, BASIC/PRO/BUSINESS 3SKU, 전체12영역100점 중 A09 오프라인 라이선스. P96 ECDSA P-256 canonical receipt + P107 publisher public JWK thumbprint, Node22/React/Electron/Windows NSIS. 무료/오프라인.
2. **완료 기능·대안 비교:** A 기존 서명 형식으로 소유자 비추출 CryptoKey 발급·서명 읽기검증·동일 ID/SKU/seats 연장(채택; 외부 서버/키 유출 없음). B 상시 온라인 인증·취소 서버(비용/네트워크·프라이버시 단점, 보류). 신규 발급/연장 API는 테스트 전용 기술이며 정식 판매자키/고객발급 기능이 아니다.
3. **테스트 명령·PASS/FAIL/SKIP:** 정확 기능 **0bf9c7bb125b25b3441117a6e54ba53ac05cba67**. [Linux Chrome/Edge #43586747520](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747520) **2/2 SUCCESS**, Node **236PASS/0FAIL/0SKIP**, 신규 P108 합성 **8/8 PASS**(로그 #71–#78), React 빌드/Chrome/Edge 합성 PDF.js·V2 보존 PASS. [Windows Electron/NSIS #43586747579](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747579) **SUCCESS**, Node **235PASS/0FAIL/1 Windows symlink SKIP**, desktop **59PASS/0FAIL**, P106 Authenticode synthetic PASS, NSIS 설치·제거/0.1.0→0.1.1 IndexedDB V2·PNG 보존 PASS. [정본정책 #43586747799](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747799) SUCCESS. **전체 3/3 workflow SUCCESS**. npm test/npm run build/npm run desktop:test/npm run ocr:release-gate.
4. **완료·진행·대기·차단:** 사전검증 발급/연장 정책 소스/합성 PASS. 정식 seller key·공개 pin, 소유자 안전 발급 도구, 고객 GUI SKU 잠금/내보내기 강제, 오프라인 철회/환불·재발급·장치수·정식 2석 계약 미구현. 실제 Tesseract/한글AI 모델·물리 Win10/11·허가 PDF5~10 미검증. 12영역 공식 UNASSESSED·100 미달, RELEASE HOLD.
5. **오류 근거·시도/재시도 금지·대안:** 첫 GitHub batch 저장 RemoteProtocolError; 원격 HEAD 불변 확인 후 blob2개 분리 업로드·일반 fast-forward 성공. P108 정확 SHA CI 3/3 성공/신규8/8 테스트 성공, 기존 P108 초기 전체 CI 진행중 기록은 새 증거로 정정(이력은 유지). 서명만으로 환불 취소/기존 영수증 즉시 철회·라이선스 복제 방지 보장 금지.
6. **저장소·브랜치·SHA·경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112; 기능 0bf9c7bb125b25b3441117a6e54ba53ac05cba67. src/commercial/offlineLicenseIssuer.ts, tests/offline-license-issuer.test.ts, docs/commercial/ASTRA_P108_OFFLINE_LICENSE_ISSUANCE_20261114.md, ASTRA_P100_SCOREBOARD_20261114.md, STATUS.md/HANDOFF.md. 문서 HEAD 최종 readback 필수.
7. **Production/Vercel·환경:** Windows hosted runner unsigned NSIS 시험/Node22/Chrome·Edge, 실제 Windows10/11 PC 고객설치·판매·크몽등록/Vercel Production 미적용. 키는 synthetic tests에서만 메모리 생성, 외부 네트워크/서버/고객 PDF 접근 없음.
8. **원본·백업·비밀·수정 금지:** 직전 제품 HEAD fbff14090caf5cead6973e6a47d503e76248696b 복구 기준. main/PR10, 원본 PDF, STEP1 V1·STEP2 V2·8+22 시안, 서명키·토큰/권한·등록이력 변경0. production signer key/pin null, OCR_MANIFEST=null, 오프라인 모델 공급처 미승인.
9. **다음 우선순위·절차·승인:** 무료 코드 범위의 판매용 GUI·export SKU enforcement 설계/시험(기존 개발 시안·원본 보존) → 소유자 명시 승인 후만 실제 개인키·발급 운영/철회 목록 및 rollback 방지 프로세스 → 실 공급자 OCR/AI CPU 품질·법무/Windows/동의 고객PDF5~10 → 정본12영역 점수 증빙·출시 수용. 판매/개인키/외부자료 전송/환경·권한변경 미승인 유지.
10. **KST 갱신·검증 범위:** 2026-11-14 KST, 기능 정확 SHA Linux/Win/정책 3/3 최종 GitHub status+raw logs 확인; 실제 판매자·사용자 설치·법무·물리 Windows/문서품질은 미검증. 중앙 원장 별도 최신화·readback 확인.

## 2026-11-14 KST — P108 오프라인 서명 라이선스 발급·연장 개발 인수인계 10항 (정확 CI 전체 확인 중)

1. **목표·요구·기술:** Astra PDF 사용자 최종 STEP1~7 및 BASIC/PRO/BUSINESS A09 11/100 영역. P96 ECDSA P256 오프라인 receipt 검증 + P107 발급자 공개키 pin 체계 위에 서명 발급·안전 연장을 구현. TypeScript/WebCrypto/Node22, 외부 API·과금·고객 자료 전송 없음.
2. **완료 기능·설계 비교:** 대안 A 기존 서명형 v1 영수증을 소유자 비추출 CryptoKey로 발급하고 기존 서명 영수증을 확인한 뒤 동일 ID/SKU/seat 조건으로 만료일만 단조 증가 연장(채택, 비용0/형식 호환). 대안 B 온라인 활성화·복제/취소 서버(운영비·고객기기 추적·오프라인 약속 불일치, 보류). 새 src/commercial/offlineLicenseIssuer.ts + tests/offline-license-issuer.test.ts 합성8개. BASIC/PRO 1석 기술안, BUSINESS 1/2석 기술 초안(법적·상용 확정 아님), 서명 실패·미래/기한초과·tier/seat 조작/기간축소 거부.
3. **명령·테스트·숫자:** 정확 기능 SHA 0bf9c7bb125b25b3441117a6e54ba53ac05cba67. 신규 WebCrypto 합성8검증, 기존 npm test의 tests/*.test.ts 자동 포함. [Linux Chrome/Edge #43586747520](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747520), [Windows NSIS #43586747579](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747579), [정본 정책 #43586747799](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43586747799). 정책 SUCCESS, Linux npm test/build PASS 및 Windows npm test/P106 step PASS, 전체 Linux/Windows run은 아직 IN_PROGRESS·결론 미확인. 이전 P107 3/3 PASS는 별도 코드 SHA.
4. **완료/진행/대기/차단:** 서명된 발급·연장 라이브러리와 합성 테스트 반영. 진짜 판매자 개인키와 신원·키 pin·오프라인 운영 발급 CLI/GUI·영수증 전달/재발급·refund 철회 목록·최신버전 강제·좌석/장치 인증·고객 상품 실행/법무 조건 미구현. P108 함수는 구매자 앱 화면에 연결되지 않았고 테스트키만 메모리에 생성. A07 실 OCR/A08 로컬 한글 AI/허가 PDF5~10 미검증. 공식 전체 UNASSESSED/100 미달, RELEASE HOLD.
5. **오류·근거·재시도·대안:** GitHub 코드 업로드 첫 다중요청이 RemoteProtocolError로 중단되어 실제 브랜치 변경0을 HEAD readback으로 확인, 동일 코드를 blob 단위 분리 저장하여 정상 일반 fast-forward commit. 기능/CI 에러 아직 확인되지 않음. 이전 영수증 재사용 차단은 서명만으로 불가능하므로 사후 취소/철회나 환불 효력을 주장하지 않음. 임의 판매자키 배포 금지.
6. **저장소·브랜치·SHA·경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112. 신규 code 0bf9c7bb125b25b3441117a6e54ba53ac05cba67; src/commercial/offlineLicenseIssuer.ts, tests/offline-license-issuer.test.ts, docs/commercial/ASTRA_P108_OFFLINE_LICENSE_ISSUANCE_20261114.md. 기존 P96/107 소스 불변. docs HEAD commit 이후 정확 조회.
7. **Production·Vercel·실행환경:** 고객 실제 판매·배포 없음, Vercel 미적용. Node22 test/npm run build/npm run desktop:test/npm run ocr:release-gate. 발급 모듈은 소유자 테스트용 API로만 존재, 실제 고객 발급 프로그램 아님.
8. **원본·백업·비밀·금지:** 수정 전 HEAD fbff14090caf5cead6973e6a47d503e76248696b. main/PR10/원본 PDF, STEP1 localStorage V1, STEP2 IndexedDB V2, 8+22 레이아웃, 등록이력, 앱 권한/서명키·토큰·환경변수 무변경. 테스트 키 ephemeral memory only; production issuer key/pin null. OCR_MANIFEST=null, RELEASE HOLD.
9. **다음 작업·절차·완료기준·승인:** 정확 코드 SHA 3/3 최종 CI/원시 로그 확인 → 사용자 승인된 서명키 생성·안전 소유자 발급 인터페이스·출력 atomic write/비밀 비유출 설계 및 운영 QA → 유효 서명 갱신·키교체·취소목록 로컬 전달/rollback 탐지(오프라인 철회 한계 명시) → 실제 GUI 액션·PDF export entitlement 진입점 통합 및 물리 Win10/11/구매자 인수. A07/08 실제 공급처·모델 및 12영역 재산정 별도. 무료 코드 개발 기승인, 실제 비밀/배포/권한 변경/실고객 자료 전송 별도 승인.
10. **갱신시점(KST)/검증범위:** 2026-11-14 KST. 기능 SHA code GitHub readback + 일부 Actions steps/정본정책 확인, Linux/Windows 최종 PASS/FAIL/SKIP 대기. 공식 점수 UNASSESSED, 개발 진행 [작업중], 판매/배포 HOLD. 중앙 원장 별도 commit 검증 예정.

## 2026-11-14 KST — P107 exact-source 3/3 CI 검증 성공 최종 인수인계 10항

1. 목표·용도·요구·기술: Astra 최종 7단계 3SKU 사용자12영역100점. A09 오프라인 SKU 사용권 기능별 검증 로직, P96 ECDSA P256 signed receipt+RFC7638 JWK thumbprint. Vite/React/Node22/Windows NSIS, 외부 전송·비용0.
2. 완료 기능·대안/근거: A verified signer receipt + pinned issuer public key + tier capability matrix(채택, 서명 위조 불가/유지비0), B UI tier/localStorage raw 값 수용(위조 가능, 불채택). BASIC 기본8, PRO20+템플릿/다중PDF, BUSINESS30+브랜드, 총6 action. 생산 키/pin null이라 실제 상품 사용권 DENY; 기존 개발 프로토타입 GUI 무변경. 단독 권한 검증은 판매 가능 판단이 아니다.
3. 테스트 명령·성공/실패/SKIP: 정확 기능 SHA 0d3501d0cf51f3b5e87370f6a973fbb01d72e697. [Linux Chrome/Edge #43583817449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817449) 2/2 SUCCESS Node 228 PASS/0 FAIL/0 SKIP, Chrome·Edge 합성 PDF/IndexedDB·OCR GUI PASS. [Windows NSIS #43583817441](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817441) SUCCESS Node 227 PASS/0 FAIL/1 symlink SKIP, desktop 59 PASS/0 FAIL, Windows PowerShell synthetic P106 PASS, NSIS 0.1.0→0.1.1 V2·PNG 보존 PASS. [정본정책 #43583817679](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43583817679) SUCCESS. 총 workflow 3/3 SUCCESS. 명령 npm test, npm run build, npm run desktop:test, npm run ocr:release-gate.
4. 완료/진행/대기/차단: Policy+WebCrypto 합성7 tests 기능 검증 완료. A09 아직 생산판매자 공개키pin·라이선스 생성/재발급·취소/장치 수·GUI/내보내기 강제락과 소비자 Win10/11·상용품질 미완. A07 실제 OCR, A08 GGUF local AI, 실 허가 PDF5~10 및 최종12영역100점 미검증. UNASSESSED/RELEASE HOLD.
5. 오류/원인/시도/대안: 신규 P107 CI 실패0. 이전 P107 초안의 Linux/Windows 진행 중 기록은 정확 SHA raw logs로 성공 정정, 과거 기록 삭제하지 않음. preview에 무단 락 적용하면 기존 정상 기능 훼손 위험이므로 상용 기능 연결 전 key/회귀/UX 승인 필요. 허위 공개키/실 인증서/판매 승인 생성 금지.
6. 저장소·브랜치·SHA/경로: hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112 / code 0d3501d0cf51f3b5e87370f6a973fbb01d72e697. src/commercial/skuAccess.ts, tests/sku-access.test.ts, docs/commercial/ASTRA_P107_SIGNED_SKU_ACCESS_20261114.md. docs HEAD는 커밋 후 재조회.
7. Production/Vercel·실행환경: 제품 Windows local/Electron + GitHub hosted CI synthetic, Vercel 미적용, 판매/정식 고객 설치·크몽 등록0, private key/라이선스 서버 없음. CI는 고객 상용 acceptance 증거 아님.
8. 원본·백업·인증/수정금지: 이전 Git 기능 부모 0b432f2598f121ae1a7f527bf4289ab92aed6a52를 복구 참조. main/Draft PR10, STEP1 localStorage V1/STEP2 IndexedDB V2, 디자인8종+22개 시안, 고객 원본 PDF, 기존 등록 이력, GitHub 연결/토큰/비밀/서명키 불변. 테스트 key 메모리 생성 및 폐기.
9. 다음 우선순위/절차·완료기준·승인: P108은 정식 issuer key 신원·pin 배포 및 라이선스 발급/회수·장치수 정책 설계, 시험 GUI/상용 GUI 분리 후 구매자 진입점과 PDF 생성 액션 실제 권한 검증; 무료 코드 가능. 이후 Tesseract 실제 Win 서명/재배포권·로컬 한국어 AI CPU·실 구매자 Win10/11·허가 PDF 검증 및12영역 재산정. 판매·고객 자료 전송·권한/보안 변경/실제품 활성화는 별도 승인.
10. 갱신 시점·검증범위: 2026-11-14 KST, GitHub Actions 정확 source SHA 3/3 SUCCESS + Linux/Win raw logs PASS/FAIL/SKIP 확인. CI와 실제 법적/고객/물리 검증 구분, 공식 UNASSESSED·100% 미달·RELEASE HOLD. 중앙 원장과 제품 docs HEAD 최종 readback 별도 실시.

## 2026-11-14 KST — P107 사용자 12영역 A09 오프라인 SKU 기능 권한 판정 10항 (CI 전체 진행중)

1. 목표·요구·기술: Astra PDF STEP1~7, BASIC/PRO/BUSINESS 3SKU 8/20/30 조판·템플릿·다중 PDF·브랜드 사용권; A09는 100점 중 11점 영역. P96 ECDSA P-256 receipt verifier 위에 vendor-pinned JWK SHA-256 thumbprint(RFC7638)와 서명 기반 기능 허용 매트릭스를 구축한다. React/TypeScript/WebCrypto, 외부 API 0.
2. 완료 기능 및 선택 근거: A. 서명 검증 + 공개키 thumbprint를 trusted build에 pin하고 기능 요청마다 검증하는 방식(채택, 별도 비용0); B. UI tier 문자열이나 localStorage 값으로 잠금 해제(빠르지만 조작 가능해 배제). src/commercial/skuAccess.ts 추가; BASIC base-layout만, PRO base/pro + template-save/batch-pdf, BUSINESS 전체 6개 capability. 서명·expiry 검증 전 기능 허용 금지. 실제 판매자 issuer key/pin은 null, 정식 상용 접근 전부 DENY. 기존 개발용 preview는 변경하지 않고 별도 완제품 SKU UI 통합이 필요.
3. 테스트 명령·PASS/FAIL/SKIP: 기능 정확 SHA 0d3501d0cf51f3b5e87370f6a973fbb01d72e697. 신규 tests/sku-access.test.ts 7개 합성 WebCrypto 서명 receipt 회귀를 기존 npm test (tests/*.test.ts)에 자동 포함. GitHub Linux Chrome/Edge #43583817449, Windows NSIS #43583817441, 정책 #43583817679. 확인 시점 정책 SUCCESS, Linux npm test/build 및 Windows npm test + P106 step PASS. 전체 Actions 최종 결론 및 정확 수치는 진행 중/미확인. 실행 npm test, npm run build, npm run desktop:test, npm run ocr:release-gate.
4. 완료·진행·차단: capability 검증 정책 코드 및 회귀 GitHub 반영. 정식 판매자 공개키/핀·라이선스 발급·장치수/재발급·GUI entitlement enforcement·실 구매자 Windows/판매약관/사용권·모델/OCR 품질 미구현·미검증. 공식 UNASSESSED, 100% 미달, RELEASE HOLD.
5. 오류·원인·실패 대안: 기존 UI는 PRO/BUSINESS를 별도 명시한 개발 시험 시안으로 노출하므로, 실제 구매자 기능을 임의로 잠가 정상 기능을 훼손하지 않도록 읽기·저장·디자인 프로토타입 수정 금지. issuer key를 테스트 생성값으로 실제 제품에 pin하면 판매자 신뢰 위조 위험, 미설정 null 유지. 현 작업 검증 실패 발견 시 최소 수정 후 정확 SHA 재검증.
6. 저장소·브랜치·SHA·주요 경로: hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112 / 기능 0d3501d0cf51f3b5e87370f6a973fbb01d72e697. src/commercial/skuAccess.ts, tests/sku-access.test.ts, 기존 src/commercial/offlineLicense.ts는 수정0. 상세 docs/commercial/ASTRA_P107_SIGNED_SKU_ACCESS_20261114.md.
7. Production URL·Vercel·실행 환경: 로컬 전용 Windows/Electron/Node22 + GitHub Actions 합성. Vercel 미적용, 실제 크몽 판매 미등록, 발급 서버/클라우드 없음. 테스트 검증은 설치/배포 승인 아님.
8. 원본·복구·보안: 직전 제품 HEAD 0b432f2598f121ae1a7f527bf4289ab92aed6a52 정상 Git revert 기반. main/Draft PR10, 원본 고객 PDF·STEP1 localStorage V1·STEP2 IndexedDB V2·고급 시안·기존 라이선스/판매 이력, GitHub secrets/키/환경 미수정. 새 라이선스 test key는 CI 메모리에서만 생성, 저장·배포하지 않음.
9. 다음 단계·완료 기준·승인: (1) P107 정확 코드 SHA 전체 CI 및 로그 확인 (2) trusted publisher JWK thumbprint·라이선스 발급/기기 정책 및 철회 모델을 설계·증거 기반 승인 (3) 사용자 검수 후 실제 GUI/액션 진입점에 entitlement enforcement 통합하되 현재 개발용 프로토타입 보존 (4) P106 실제 Windows OCR 공급처 검증과 A08 한국어 로컬 LLM, 실 고객 PDF5~10, 최종 12영역 재산정. 무료 개발 승인 기확정, 출시/서명키/외부자료 전송/판매는 별도.
10. 갱신 KST·검증 범위: 2026-11-14 KST. GitHub branch/기능 commit 및 Linux/Windows 중간 unit/build, 정책 PASS 일부 실증. 전체 Linux/Windows 최종은 미확인; 문서 SHA와 중앙 원장 최종 HEAD는 별도 readback. 기능권한 테스트 합격을 제품 판매 가능이나 A09 11/11점으로 간주 금지.

## 2026-11-14 KST — P106 기능 정확 SHA 3/3 CI 최종 성공 인수인계 10항

1. **목표·최종 요구·기술:** Astra PDF 원래 7단계/3SKU/12영역100점, Windows 오프라인 Tesseract EXE/DLL/installer Authenticode·SHA 증거 검수. PowerShell Get-AuthenticodeSignature/Get-FileHash + Node/PDF.js/Electron; 배포·원본 변경 없음.
2. **완료 기능/대안:** A) Windows 기본 무료 API(구현) vs B) 외부 SignTool·실 바이너리 동적 로더(보류/실 공급자 확보 후). 실제 설치파일 SHA, PE files pre/post SHA, 누락/변조/미등록 DLL/unsafe path fail-closed. 실 서명·권리 승인 자동 전환 안 함; P104/P105 독립 검증 필요.
3. **테스트 명령/숫자/근거:** 정확 기능 SHA **7ec1de61a750d324df7e7ae25ff30f109fc766e5**. [Linux Chrome·Edge #43580696635](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696635) **2/2 SUCCESS**, Node **221PASS/0FAIL/0SKIP**, 실제 Chrome·Edge 합성 PDF.js/OCR 검수 UI PASS. [Windows Electron/NSIS #43580696709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696709) **SUCCESS**, Node **220PASS/0FAIL/1 symlink 권한 SKIP**, desktop **59PASS/0FAIL**, P106 Windows Authenticode **11/11 합성 확인**, Electron smoke·NSIS 설치/삭제·0.1.0→0.1.1 V2/PNG 보존 PASS. [정본 정책 #43580696839](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696839) SUCCESS. **전체3/3 workflow SUCCESS.** 실행: npm test, npm run build, npm run desktop:test, npm run ocr:release-gate, CI pwsh tests/ocr-windows-authenticode-evidence.test.ps1.
4. **완료/진행/대기/차단:** 보안 도구·검사·CI 완료; 실제 공급자 installer/서명/라이선스/실 PE 동적 DLL closure/실한글 OCR/물리 Win10·11/고객 PDF5~10/3SKU/로컬 모델 미검증. 공식 최종점수 UNASSESSED, 100% 미달, RELEASE HOLD.
5. **오류/원인·재시도 금지:** 최초 문서 작성 문자열 구문 오류(원격 변경0), 간소화 재시도로 문서 HEAD 정상 반영. 실제 P106 보안 단계와 CI 모두 실패0. 합성 unsigned 서명으로 실 제조자 인증·상용 적법성 주장 금지. 독립 공급자 신뢰/서명시각/폐기/권리 자료 필요.
6. **저장소/브랜치/SHA/경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112 / 기능 7ec1de61a750d324df7e7ae25ff30f109fc766e5. scripts/ocr-windows-authenticode-evidence.ps1, tests/ocr-windows-authenticode-evidence.test.ps1, .github/workflows/windows-desktop.yml, docs/commercial/ASTRA_P106_WINDOWS_AUTHENTICODE_EVIDENCE_20261114.md. 최종 문서 HEAD는 remote 확인.
7. **Production/환경:** Windows hosted unsigned NSIS 합성 시험; 실제 구매자 설치 배포·판매·Vercel은 N/A. 미래 공급처 오프라인 감사 pwsh -NoProfile -File scripts/ocr-windows-authenticode-evidence.ps1 -InstallerPath <installer> -AssetsRoot <assets> -ManifestPath <external-manifest>. 네트워크 고객자료전송0.
8. **원본/백업·인증·금지:** 직전 P105 HEAD 9bcbd93e82f477e47970795854ba9b3cf9ec95f8 복구 참조. main·Draft PR10·STEP1 localStorage V1·STEP2 IndexedDB V2·디자인8종·고객 PDF·GitHub 권한·Secrets/서명키·크몽등록 이력 변경0. OCR_MANIFEST=null.
9. **다음 작업/완료기준·승인:** (1) 실제 공급자 Windows Tesseract installer/EXE/DLL/kor+eng 사용권·SHA·서명·SBOM·NOTICE (2) 윈도우 동적 DLL/runtime·한글/금액/표/다단 실 OCR (3) 물리 Win10/11, 허가 PDF5~10, 모델/3SKU 정식 인수 (4) 사용자 최종설계12영역/100점 증거 재산정. 무료 개발 기승인/모바일 PC개입 보류, 판매·권한변경·외부 전송 별도 승인.
10. **갱신(KST)/검증 범위:** 2026-11-14 KST, GitHub 정확 SHA 3/3 workflow 및 Linux/Windows raw job logs·Windows P106 신규 테스트 11개 PASS 확인. 실제 공급자/구매자 PC/법무·판매 GO는 미검증. 중앙 kmong-productization 원장 따로 동기화.

## 2026-11-14 KST — P106 Authenticode Evidence 10항 인수인계 (CI 전체 검증 중)

1. **목표·용도·기술:** Astra STEP1~7, BASIC/PRO/BUSINESS 사용자 최종설계 12영역100점 기준, 로컬 Windows OCR 공급자 설치/EXE/DLL의 서명 및 SHA 증거 수집. Node22/React/PDF.js/Electron/PowerShell.
2. **완료·대안:** A Windows 기본 Get-AuthenticodeSignature+Get-FileHash(무료/새 의존성0·구현), B 외부 SignTool/별도 WinTrust(실물 확보·추가 도구 필요, 후속). 명시적 installer hash pin, 바이너리 SHA 전후 재검증, manifest와 native 파일 목록 비교, reparse/경로변조 차단. 모든 상용·법적 승인 false.
3. **테스트:** 기능 SHA 7ec1de61a750d324df7e7ae25ff30f109fc766e5. Windows synthetic Authenticode CI STEP SUCCESS 및 정책 CI [#43580696839](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696839) SUCCESS. 전체 Windows NSIS [#43580696709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696709), Linux/Chrome/Edge [#43580696635](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43580696635) 최종 결론 IN_PROGRESS(상세 숫자 미확정). npm test, npm run desktop:test, npm run build, npm run ocr:release-gate.
4. **완료/진행/차단:** CI 신설 기능 보안 단계 통과, 전체 CI 결과 및 실제 제3자 Windows installer/DLL/kor+eng, 인증서 신뢰·법적 재배포, 실제 Windows10/11·고객 PDF5~10·로컬 모델·PRO20/BUSINESS30 수용 미확인. 공식 UNASSESSED, RELEASE HOLD.
5. **오류·원인·재시도 금지·대안:** 코드 CI P106 단계 실패 기록 없음. 문서 원자적 커밋 첫 시도 문자열 구문 오류로 원격변경0, 간소화해 재시도. 해시가 확인돼도 manifest 자체 공급자 신뢰·AuthentiCode 적법성/동적 DLL 폐쇄성 보증 아님; 허위 서명·법적 증거 생성 금지.
6. **저장소·브랜치·SHA:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112. 기능 7ec1de61a750d324df7e7ae25ff30f109fc766e5, scripts/ocr-windows-authenticode-evidence.ps1, tests/ocr-windows-authenticode-evidence.test.ps1, .github/workflows/windows-desktop.yml, docs/commercial/ASTRA_P106_WINDOWS_AUTHENTICODE_EVIDENCE_20261114.md.
7. **Production·환경:** 실제 상용 설치/배포 없음, Vercel 미적용. Windows PowerShell 오프라인 비실행 감사(외부 PDF 전송0). 미래 검증 시 pwsh -NoProfile -File scripts/ocr-windows-authenticode-evidence.ps1 -InstallerPath <installer> -AssetsRoot <assets> -ManifestPath <external-json>. P104/P105 별도 검증 필수.
8. **원본·복구·비밀·수정금지:** 직전 HEAD 9bcbd93e82f477e47970795854ba9b3cf9ec95f8 백업 SHA, main/PR10 및 STEP1 localStorage V1, STEP2 IndexedDB V2, 고객 원본 PDF, 디자인8종, 암호·키·GitHub 권한/판매 이력 불변. OCR_MANIFEST=null.
9. **다음 우선순위·승인:** 정확 SHA 전체 Linux/Win CI 완료/실패 로그 → 실제 공급자 exe/DLL/언어팩/라이선스 실측·서명·법무→실 로더·한국어·금액·표·다단·물리 Win10/11/허가 PDF 검수→3SKU·로컬 모델 12영역 공식100점 재산정. 무료 개발 승인 재요청 불필요, 실 다운로드/배포/판매/고객 원본 외부 전송 별도 승인.
10. **갱신 KST/검증 범위:** 2026-11-14 KST, 실제 GitHub SHA/Windows 신규 synthetic step/정본 gate 확인, 전체 CI 종결·실 OCR 공급원/실 Windows/상업권리 미검증. docs 및 중앙 kmong HEAD 최종 조회 필요.

## 2026-11-14 17:38 KST — P105 정확 CI 검증 완료 최종 인수인계 10항

1. **목표·요구·기술:** Astra PDF STEP1~7, BASIC/PRO/BUSINESS 최종설계 12영역 100점. 오프라인 Tesseract 공급망 정적 PE32+ x64 import 검증. React/PDF.js/Electron/Node22/NSIS. 원본 무손상/외부 API·과금 없음.
2. **완료 변경·설계 근거:** 옵션 A 기존 P104 SHA-256 동일 바이트 스트림에서 정적 import/delay-load 검사(0원·오프라인/채택). 옵션 B Windows Authenticode/실제 DLL Loader만으로 검사(서명·동적검증에는 필요하지만 import inventory 대체 불가, 공급원 미확보로 보류). P105 새 parser, 기존 preflight 연결, 안전 실패 처리, 합성11회귀; P104 안전검사/릴리스 HOLD 보존.
3. **테스트/정확 SHA PASS/FAIL/SKIP:** 기능 **d8e765ef538e6f41fa3fc870a9257238a7c4af98**. [Linux Chrome+Edge #43576345594](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345594) 2/2 SUCCESS, Node **221 PASS/0 FAIL/0 SKIP**, Chrome+Edge PDF.js 합성 OCR UI/저장 데이터 보존 PASS. [Windows #43576345628](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345628) 1/1 SUCCESS, Node **220 PASS/0 FAIL/1 symlink OS SKIP**, desktop **59 PASS/0 FAIL**, Electron NSIS 설치/제거·0.1.0→0.1.1 V2/PNG 보존 PASS. [정본 #43576345809](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43576345809) SUCCESS. 전체 3/3 SUCCESS. Linux/Windows raw job logs 확인.
4. **완료/진행/대기·차단:** 정적 PE와 Linux/Windows 합성 E2E 통과. 실제 제3자 설치파일/EXE/DLL/kor+eng 정본 SHA·Authenticode/재배포권·NOTICE/SBOM·동적 로딩·물리 Win10/11·고객 PDF5~10·오프라인 한국어 AI·3SKU 인수 미검증. 전체 공식률 UNASSESSED/100 미달. RELEASE HOLD.
5. **오류·원인·시도·대안:** 원자적 코드 커밋 최초 JS 문자열 구문오류(실제 원격 변경0), 수정 후 일반 nonforce fast-forward 성공. CI P105 전체 PASS 확인으로 초기 '진행중' 기록 정정. 정적 import 무결성=실 DLL 로딩 또는 재배포 적법성이라는 오인 금지. 공급원 미확보 상태에서 임의 서명해시/권리증거 생성 금지.
6. **저장소/브랜치/SHA·경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112. 기능 d8e765ef538e6f41fa3fc870a9257238a7c4af98; desktop/ocr-pe-import-audit.cjs, desktop/ocr-supply-chain-preflight.cjs, tests/ocr-pe-import-audit.test.cjs, tests/ocr-supply-chain-preflight.test.cjs, package.json, docs/commercial/ASTRA_P105_PE_STATIC_IMPORT_REVIEW_20261114.md. 본 docs HEAD는 GitHub 최종 readback 필수.
7. **Production·Vercel·실행:** 판매/배포 Vercel 미적용. Windows hosted unsigned NSIS와 설치 회귀 검증은 실 사용자 설치 테스트가 아님. npm test/npm run build/npm run desktop:test/npm run ocr:release-gate, 외부 실 자산 있을 때만 npm run ocr:preflight -- <assets-folder> <external-manifest>.
8. **원본·백업·비밀·금지:** 기능 이전 부모 074b240244aad23631466894fd633efc86558f12로 정상 Git revert 가능. main/Draft PR10, 사용자 원본PDF·V1 localStorage·V2 IndexedDB·8디자인/기존 등록이력·비밀·서명키/권한 그대로. OCR_MANIFEST=null, 외부 전송/자동 다운로드/원본 변경/force push/무단 배포 없음.
9. **다음 작업 우선순위·완료기준·승인:** (1) 적법한 Windows Tesseract 설치파일·DLL·kor+eng 공급자 해시/정확 버전/서명 인증서/법무 LICENSE·NOTICE·SBOM 확보 (2) 실제 DLL 로더·동적 의존성 및 Windows 한글/금액/표/다단 OCR (3) 독립 물리 Windows10/11·허가 PDF5~10·원문 보존 검수 (4) 3SKU/실 GGUF CPU/12영역100점·판매 승인. 무료 코드 승인 기확정, 모바일 사용자에게 PC 요구는 최종 단계로 일괄.
10. **갱신 시각(KST)·확인 범위:** 2026-11-14 17:38 KST, GitHub Actions 정확 기능 SHA의 3/3 result + job raw logs 확인. 실 공급원/물리PC/고객·판매 검증 미진행, 공식 제품100% 증명 아님. 중앙 kmong-productization 원장 최신화는 별도 커밋 확인.

## 2026-11-14 KST — P105 다음 채팅 인수인계 10항 (CI 진행 중 잠정)

1. **목표·용도·확정 요구·기술:** ASTRA PDF 원래 7단계, BASIC/PRO/BUSINESS, 사용자 최종설계 12영역 100점, 오프라인 OCR 공급망 신뢰 강화. Node22/PE32+ x64/React+PDF.js/Electron; 실제 고객 자료·판매·유료결제 없음.
2. **완료 기능·결정 근거:** 대안 A 기존 P104 스트리밍 SHA-256로 확인한 동일 파일 바이트에서 PE 정적 import/지연 DLL 검사(채택; 부수 비용 0, 즉시 CI 검증), 대안 B 외부 Windows 설치 공급자·서명 검수 단독(실제 자산 없어 보류). P105 경로 누락/공급망 DLL 탈락/OS DLL 이름 오염/변조된 RVA 차단; 기존 P104 정확 SHA·패키징 차단 유지.
3. **테스트 명령/진행·성공/실패·미검증:** P105 기능 SHA d8e765ef538e6f41fa3fc870a9257238a7c4af98; 추가 parser 합성 11건. npm test / npm run desktop:test / npm run build / npm run ocr:release-gate. GitHub Actions Linux+Chrome/Edge #43576345594, Windows+NSIS #43576345628, 최종설계 #43576345809. 코드 push 직후 Node Linux/Windows·build/desktop smoke/RELEASE HOLD CI step 성공, 정책 workflow 성공; 전체 2개 workflow **IN_PROGRESS / 최종 PASS 아직 미검증**. P104 이전 3/3 성공과 혼동 금지.
4. **완료/진행/대기/차단:** P105 코드 커밋 반영/일부 CI 단계 PASS. 전체 browser/NSIS 결과·원시 로그 확인 진행, 공급자 EXE/DLL/installer 실물 서명·실측 SHA·전체 runtime 종속성·NOTICE/SBOM/법적 재배포·실 OS/고객 PDF/LLM/3SKU 수용 대기. 전체 최종률 UNASSESSED, 100% 미달, RELEASE HOLD.
5. **오류·근거·시도·재시도 금지·대안:** 최초 원자적 커밋 스크립트 문자열 구문오류(원격 코드 변경 0), 단순화 후 GitHub fast-forward 성공. PE import table만으로 LoadLibrary를 검증했다는 오인 금지; 파일 검증 한계를 우회하기 위한 false PASS 금지. 서명과 재배포 적법성은 공급자 원본 필요.
6. **저장소·브랜치·SHA·핵심 경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112 / 기능 d8e765ef538e6f41fa3fc870a9257238a7c4af98. 변경 desktop/ocr-pe-import-audit.cjs, desktop/ocr-supply-chain-preflight.cjs, tests/ocr-pe-import-audit.test.cjs, tests/ocr-supply-chain-preflight.test.cjs, package.json, P105 상세 문서. 본 문서 SHA는 최종 커밋 후 확인.
7. **Production·배포·환경:** Windows NSIS 합성 설치기 CI는 배포/실 제품 승인 아님. Vercel 미적용. Node22 npm test/build/desktop:test/ocr:release-gate, 외부 manifest 검수는 npm run ocr:preflight -- <assets> <manifest>. 현재 실제 자산 0/OCR_MANIFEST=null.
8. **원본·백업·비밀·수정 금지:** 이전 Git HEAD 074b240244aad23631466894fd633efc86558f12로 정상 Git revert 가능한 기준. main·Draft PR10·STEP1 localStorage V1·STEP2 IndexedDB V2·고객 PDF·디자인8종·등록이력·인증 비밀 모두 유지. force push·외부 업로드·서명키·승인 없는 OCR 자산 다운로드·번들 금지.
9. **다음 작업·완료 기준·승인:** ①정확 기능 SHA의 Linux+Windows 전체 job/raw log 완료 확인 ②실제 신뢰할 Windows Tesseract installer+개별 DLL/kor+eng 및 라이선스/Authenticode 증거 확보(무단 설치/재배포 금지) ③Windows static+dynamic loader 회귀와 실 한글/금액/표 PDF ④3SKU/AI/실 고객 PDF 5~10·물리 PC·12영역100점 검수. 사용자 모바일; PC 요청 최후 합산, 무료 코드 범위 이미 승인.
10. **갱신 시점(KST)·검증 범위:** 2026-11-14 KST, GitHub commit/branch + Actions step 단위 실증; 전체 Actions 최종 결과 및 공급자/구매자 Windows는 아직 미확인. 중앙 kmong-productization 동기화는 별도 exact-SHA 검증 후.

## 2026-11-14 KST — P104 정확 SHA 3/3 CI 검증 최종 인수인계 10항

1. **목표·확정 요구·기술:** Astra STEP1~7/3SKU/최종12항100점, 로컬 Windows x64 OCR 바이너리 안전 감사·가드. React/TS/PDF.js/Electron/NSIS + Node22 SHA-256/PE32+ 사전검사, 유료/외부 전송0.
2. **완료 기능/변경/선택 근거:** 휴먼 서명·법무 검토 선행 오프라인 번들(A) 우선, 별도 사용자설치(B) 대비 사용편의 우위. 출처·SHA/크기·모든 exe/DLL·kor+eng·LICENSE/NOTICE manifest 교차 검사와 우회(glob, symlink, hardlink, extraResources) 차단, OCR_RELEASE_HOLD 기본 유지. 성공 report도 review-required/legalRedistributionApproved:false. OCR 실행 자산은 실제 포함하지 않음.
3. **정확 테스트/명령·PASS/FAIL/SKIP:** 기능 sha **e2fd0797990ce94e7f7a68720ece3617f9d114db**. [Linux Chrome+Edge #43574432110](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43574432110) 2/2 SUCCESS Node **210PASS/0FAIL/0SKIP**, npm run build PASS, 두 브라우저 STEP7 synthetic OCR review E2E PASS. [Windows #43574432095](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43574432095) SUCCESS Node **209PASS/0FAIL/1 Windows symlink 권한SKIP**, desktop **48PASS/0FAIL**, NSIS EXE/설치·제거/업그레이드 V2·PNG 보존 PASS, OCR release hold (기본 0.1.0·업그레이드0.1.1) 2회 PASS. [정본 정책 #43574432327](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43574432327) SUCCESS.
4. **완료/진행/대기/차단:** GitHub 코드/합성 공급망 회귀 15+6, 안전 패키징 차단/CI 검증까지 완료. 사용자 실제 Win10/11·한글 OCR 엔진 실행·독립 공급처 EXE/DLL/kor+eng·SHA/Authenticode/법적 재배포/NOTICE·실고객 PDF5~10·한국어 AI/정식3SKU/판매 GO 미완. 최종100% 미달/UNASSESSED/RELEASE HOLD.
5. **오류 근거/원인/시도/재시도 금지·대안:** 초기 디렉터리 hardlink 검사 false-positive 가능성 제거(파일 hardlink만 거부); Electron 파일 포함 목록 변경 우회 발견→정확 files 3개 allowlist+악성 추가 glob 회귀 적용. CI 실제 로그를 확인하여 이전 '미검증' 표현 정정. 이력상 이전 일부 커밋 실패를 최신 전체 성공으로 대체하되 실패 로그를 삭제하거나 force push하지 않음.
6. **저장소/브랜치/SHA/경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112, 실행 코드 e2fd0797990ce94e7f7a68720ece3617f9d114db. desktop/ocr-supply-chain-preflight.cjs, desktop/ocr-release-hold-gate.cjs, tests/ocr-supply-chain-preflight.test.cjs, tests/ocr-release-hold-gate.test.cjs, package.json, .github/workflows/windows-desktop.yml, docs/commercial/ASTRA_P104_WINDOWS_OCR_PREFLIGHT_20261114.md. 문서 SHA는 본 update 후 확인.
7. **배포/Production URL/실행 환경:** Windows NSIS 개발 설치기 CI에서만 합성 확인. Vercel N/A, 크몽 등록0. npm test; npm run build (prebuild OCR hold), npm run desktop:test; npm run ocr:release-gate; 실제 자산 확보 시 npm run ocr:preflight -- <folder> <json> (결과 review-required이고 출시허가 불가).
8. **원본/백업/보안·수정금지:** main·Draft PR10·STEP1 localStorage V1·STEP2 IndexedDB V2·원본 PDF 및 고객 자료, 서명/환경·토큰/모델 자산 변경0. Git 이전 SHA로 원복 가능. 고객 실파일·바이너리 GitHub 저장0. OCR_MANIFEST=null.
9. **다음 작업/절차/완료 조건·승인:** (1) 외부 공급처 Windows 설치파일/Authenticode와 EXE/DLL/kor+eng 실제 bytes 및 라이선스·NOTICE/SBOM 검수 (2) 전체 의존 DLL closure 및 런타임 서명/해시 재검증 후 사용자 사용 PC 조건 (3) Windows 실제 한글/숫자/표 OCR와 원본 PDF 대조·합성/실사용자 시나리오 (4) 3SKU/LLM/최종사용자 수용. 기존 무료 OCR 코딩 승인 재요청 금지, 외부 전송/유료 구매/권한·보안 변경/판매 GO 별도 승인.
10. **갱신일시(KST)·확인시점·검증범위·문서기준:** 2026-11-14 KST, GitHub raw workflow job logs에서 정확 SHA 3/3 SUCCESS, Node Linux210 Windows209+1SKIP desktop48, Chrome/Edge OCR UI 및 NSIS2회 HOLD PASS. 기능 CI 성공≠재배포 라이선스·실 Win10/11·제품 공식100% 합격. HEAD는 문서 업데이트 직후 실제 비교.

## 2026-11-14 KST — P104 Windows OCR 공급망 사전 검증 10항 (최신)

1. **목표·용도·확정 요구·기술:** Astra PDF STEP1~7, BASIC/PRO/BUSINESS 사용자 원본 12영역/100점·원본 무손상·무료 로컬 OCR 사전 안전 감사. Node22 CJS, Win64 PE 헤더, SHA-256, Electron Builder NSIS. 무료 OCR 코드/배점은 승인됨. 판매·유료결제·외부 고객 자료 전송 미승인.
2. **완료 기능/변경/근거:** 공급망 옵션 A(검증 후 허가된 오프라인 Windows DLL/EXE/lang 번들) 선택, B(별도 사용자 설치/지원비 증가) 대안. 실제 파일 반입 전 offline manifest 검사, per-file SHA/bytes/PE x64, 라이선스·NOTICE 인벤토리, symlink/hardlink/추가DLL/경로/extraResources/extraFiles 차단. 성공해도 `review-required`로 귀결, legalRedistributionApproved=false. 현재 패키지 자체 release HOLD.
3. **테스트/명령·성공/실패수:** tests/ocr-supply-chain-preflight.test.cjs 15개 + tests/ocr-release-hold-gate.test.cjs 6개, npm test/desktop:test 연결; prebuild+Windows 0.1.0/0.1.1 직전 `npm run ocr:release-gate` 필수. 실제 CI 정확 코드 e2fd0797990ce94e7f7a68720ece3617f9d114db 설계 게이트 #43574432327 SUCCESS, Linux/Chrome/Edge #43574432110·Windows NSIS #43574432095 전체 최종 로그 **확인 중**, 통과 주장 금지. 이전 P103 SHA f9672f12 CI는 3/3 SUCCESS(이력 분리).
4. **완료/진행/대기/차단:** 안전검사·패키징 차단 코드 GitHub 반영, 정책 성공. 실제 서명된 Windows exe와 모든 DLL·kor/eng/실물 해시·AuthentiCode·DLL import closure/업스트림 재배포권 및 LICENSE/NOTICE 육안 법무확인 미완, Release HOLD. 실제 고객 Win10/11·PDF5~10·모델/3SKU/판매수용 미검증.
5. **오류/실패 근거·원인·시도·재시도 금지·대안:** 초기 검사에서 정상 Unix directory nlink>1도 불법 하드링크로 잘못 분류할 가능성 파악 → 일반 디렉터리 허용·파일 하드링크만 거부. Electron files glob에 새 폴더만 더하면 OCR 네이티브 파일이 우회될 위험 확인 → 정확 3개 files allowlist 검증+회귀 추가. unsigned DLL/가짜 법적 증빙은 사전 검사 성공으로 판매 가능 판정 불가; 별도 법무/서명·실 실행 필요.
6. **저장소/브랜치/SHA/경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112. 최신 **기능·테스트 SHA e2fd0797990ce94e7f7a68720ece3617f9d114db**, 문서 docs/commercial/ASTRA_P104_WINDOWS_OCR_PREFLIGHT_20261114.md. 대상 desktop/ocr-supply-chain-preflight.cjs, desktop/ocr-release-hold-gate.cjs, tests/ocr-*.test.cjs, .github/workflows/windows-desktop.yml, package.json.
7. **Production URL·Vercel·명령·환경:** Vercel 미적용(Windows Electron/NSIS), npm test/build, npm run desktop:test, npm run ocr:release-gate; 미래 자산 검증시 `npm run ocr:preflight -- <assets-folder> <manifest.json>`(현재 실제 바이너리 없음). CI Windows hosted 테스트는 물리 구매자 PC의 정상보증 아님.
8. **원본/백업·인증·수정 금지:** 개발 브랜치 과거 SHA에서 복구 가능. main/PR10, 사용자 PDF·STEP1 localStorage V1·STEP2 IndexedDB V2·등록 이력·서명키/비밀·구매자 데이터 미수정, 실제 OCR 바이너리/모델/폰트 ZIP 미다운로드·미번들. OCR_MANIFEST=null.
9. **다음 작업 우선순위/완료기준·승인:** e2fd0797 exact SHA Linux Chrome/Edge + Windows NSIS Actions 완료 결론/원시 로그 확인→필요시 테스트/경로 최소 수정→Windows 설치파일/EXE/DLL/thumbprint/SBOM·LICENSE/NOTICE·실 Win OCR 독립 실행→원문 검수/실 고객 PDF5~10·3SKU/모델·최종 판매 승인. 무료 코드 승인 재요청 금지. 구매·전송/상품 등록·범위변경/외부 인증은 사전 승인.
10. **최신화 KST·확인시점·검증 범위·문서 기준커밋:** 2026-11-14 KST, 코드 SHA e2fd0797; GitHub 실제 파일·CI 정책 확인, Linux/Windows full CI 결론 확인 전 미검증. 문서/중앙 원장은 마지막 커밋 SHA를 별도로 재확인. 본 문서는 P104 코드 개발 기록이며 최종 제품100% 완료 주장 아님.

## 2026-11-14 KST — P103 정확 SHA CI 3/3 성공 인수인계 (최신 10항)

1. **목표·요구·기술:** 사용자 원본 7단계+3SKU 12영역 100점 전체, React/TypeScript/PDF.js/Electron/Tesseract. 원본/사용자 저장 데이터 보존, OCR 미승인 검수, 출시 RELEASE HOLD.
2. **구현·근거:** P102 보안 OCR 기반 유지, P103 신규 골든 러너 PSM3/6 선택·STEP7 페이지/모드 변경 시 과거 초안 폐기·OCR 초안 페이지/모드 출처와 수동 수정 여부 표시. 스캔 PDF 실제 브라우저 렌더에 모의 OCR 백엔드 사용한 E2E 추가. 단문20+복합6 합성 실 Tesseract 품질 비교, PSM6 기본 및 PSM3 수동 대안.
3. **테스트 명령·성공/실패/범위:** 정확 기능 SHA **f9672f12b2d40106bdcc244e2675c903b3c98888**. [Chrome+Edge #43571908499](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908499) 2/2 SUCCESS, Node189PASS/0FAIL, npm run build PASS, Chrome와 Edge 각각 **PASS STEP7 OCR UI**. [Windows #43571908498](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908498) 1/1 SUCCESS, Node188PASS/0FAIL/1 OS-only symlink SKIP, desktop27/27PASS, NSIS install/uninstall·0.1.0→0.1.1 V2 PNG 보존 PASS. [정본 정책 #43571908709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908709) SUCCESS(100% 합격 아님). 실 고객 OCR/Win10·11 미검증.
4. **완료/진행/대기·차단:** P103 코드·UI·Chrome/Edge/Windows hosted 합성 테스트 통과. OCR_MANIFEST=null, Windows 정식 native Tesseract+DLL/kor+eng 미번들/미사용. 표·다단 오인식 가능, 실제 PDF 원문 복원·고객 PC/LLM/3SKU 정식 상용·판매 승인 미충족. 공식 최종점수 UNASSESSED, 100% 미달/[작업중]/RELEASE HOLD/크몽 미등록.
5. **오류/원인·시도·전환:** P102 CI 접근 이슈는 GitHub REST workflow runs/jobs/logs 정확 SHA 조회로 해소. PSM3 단문20 중 5 exact/CER51.28%로 누락 다수 → PSM6 기본 유지(15 exact/CER2.2%). 복합6 경우 PSM3가 표/박스 표식을 더 찾기도 하여 사용자가 직접 모드 선택·대조, 자동 인증 금지. P103 새 스캔 UI E2E는 Chrome/Edge 모두 녹색. 동일 실패 방식을 반복하지 않음.
6. **저장소/브랜치/SHA·경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112, 기능 f9672f12b2d40106bdcc244e2675c903b3c98888. docs/commercial/ASTRA_P103_OCR_PSM_REVIEW_20261114.md, src/step7/LocalOcrPanel.tsx, scripts/run-ocr-golden.cjs, tests/step7-local-ocr-browser.mjs, .github/workflows/ci.yml. 제품 STATUS 문서 업데이트 e1c0682d6cfdd7e25b4bfbd3d1a6768f69e3bceb, 본 HANDOFF 갱신 SHA는 이후 HEAD 확인.
7. **Production/실행 명령·환경:** Node22 npm test/npm run build, 실제 Chrome/Edge 브라우저 E2E 및 Windows hosted NSIS/Electron, Vercel 미적용. OS별 상품 구매자 물리 테스트·실 Tesseract Windows 실행은 미검증. PSM3/6 실 비교는 Linux5.5·Pillow/NanumGothic 합성 샘플.
8. **원본 위치/백업·인증 관리·수정 금지:** Git 직전 SHA 롤백 가능. 사용자 V1 localStorage·V2 IndexedDB, 원본 docs/ASTRA_ORIGINAL_ROADMAP.txt, main/Draft PR10, 비밀키·고객 PDF/실 라이선스 자산 변경0. OCR 데이터는 별도 미승인 메모리 초안, 클라우드 원문 전송0/고객파일 GitHub 업로드0. OCR 배포 manifest null.
9. **다음 작업/우선순위/승인:** ①Windows Tesseract 공급처·DLL/kor/eng 정확 버전 SHA·라이선스/NOTICE/SBOM 사전 검증(승인 전 번들 금지) ②전용 OCR 실제 Windows Native+페이지별 혼합/스캔·표 정확도·CPU/취소 회귀 ③고객 허가 PDF5~10 원문/출력 수동 검수와 물리 Win10/11 설치·인쇄 ④3SKU/실 GGUF/소유자 최종 판매 승인. 무료 OCR 코드 개발/100점 배점은 기존 승인 완료, 반복 승인 요청 금지. 유료구매·외부원문 전송·등록/배포는 별도.
10. **KST 갱신/정확 검증 범위·문서 기준:** 2026-11-14 KST, GitHub Actions 3/3 raw logs 직접 조회, 합성 UI E2E Chrome/Edge 각 PASS·Windows hosted Node/desktop/NSIS PASS. Linux 실 Tesseract 20/6 합성 비교는 윈도우 사용성·판매성 증거 아님. 최종 HEAD 확인 필요, 코드 f9672f12/문서 커밋 구분.

## 2026-11-14 KST — P103 실 OCR 모드 비교·프론트엔드 초안 귀속 인수인계 10항

1. **목표/기술/정본:** 사용자 확정 STEP1~7 및 BASIC8/PRO20/BUSINESS30, 12영역 총 100점. React/TS/PDF.js/Electron/무료 로컬 Tesseract. 고객 내용·원본 무손상, 전체 공식 최종률 UNASSESSED/100% 미달.
2. **완료/변경/근거:** P102 Unicode/임시PNG/허용 PSM 보강 CI 정확 SHA 성공. P103 단문 합성20 OCR 모드 PSM6/3 성능 비교 및 복합 구조6 탐색 후 기본6 유지/PSM3 선택형. STEP7 페이지·모드 전환 시 미승인 이전 OCR 초안과 provenance 삭제, 성공 시 페이지·모드 표시/사용자 편집표시. 합성 스캔 PDF 브라우저 E2E 추가.
3. **실제 테스트/미검증:** P102 exact 기능 SHA 5d87df4ef2f9: Linux Chrome+Edge #43568805209 2/2 SUCCESS Node189PASS/0FAIL/0SKIP·build PASS, Windows #43568805220 SUCCESS Node188PASS/0FAIL/1 symlink OS SKIP+desktop27PASS·NSIS 설치/업그레이드 성공, 정책 #43568805420 SUCCESS. P103 신규 기능 SHA f9672f12b2d40106bdcc244e2675c903b3c98888 GitHub Chrome/Edge·Windows CI는 현재 실행중/미확인. Linux 실 Tesseract 5.5 PSM6 합성20 중15 exact/CER2.2%, PSM3 5 exact/CER51.28%. 합성 표식6장은 예비 탐색으로만 평가. 실고객·실 WinOCR 불인정.
4. **완료/진행/대기/차단:** UI와 합성 E2E 코드 반영 완료, P102 exact CI green. P103 신규 CI 판단 대기. 실제 Windows 실행파일+kor/eng/DLL 정식 LICENSE·NOTICE/해시·실 Win10/11·허가 PDF5~10·한국어 GGUF CPU·3SKU 정식 권리·판매 승인 미충족; RELEASE HOLD.
5. **오류/원인/시도/대안:** PDF 페이지 또는 PSM 변경 후 이전 초안이 남으면 다른 출처 텍스트 오인 가능 → 입력 변경 때 초안/출처 폐기, 성공 시 생성한 페이지/모드 명시. 골든 비교에서 PSM3 단문 누락 다수(5/20 정확) 확인 → 기본 PSM6 유지. 두 모드 모두 표 숫자/의미 자동 인증 불가, 수동 검수 보존. E2E 실패 시 실제 job log를 읽고 안전한 테스트·UI 최소 수정(테스트 생략 금지).
6. **repo/branch/SHA/경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112. P102 기능5d87df4e / P103 기능 f9672f12b2d40106bdcc244e2675c903b3c98888. P103 문서 HEAD 1d951f39182b7a313ba5cd49b1d695a8ab4d6d78, STATUS 갱신 1be2518211c948ba9bfa5b8fd015aefeb3e4400a; 본 HANDOFF 이후 HEAD 재조회. 주요 src/step7/LocalOcrPanel.tsx, scripts/run-ocr-golden.cjs, tests/step7-local-ocr-browser.mjs, .github/workflows/ci.yml, docs/commercial/ASTRA_P103_OCR_PSM_REVIEW_20261114.md.
7. **실행/Production/환경:** Node22 npm test/build, GitHub hosted Chrome/Edge actual browser, Windows NSIS/Electron. Vercel N/A, 크몽 미등록. Linux 실 OCR 비교는 Tesseract 5.5 kor+eng/Pillow/NanumGothic 합성20, 자료 외부업로드0.
8. **원본/백업/인증/수정 금지:** 기존 main/PR10·STEP1 localStorage V1/STEP2 IndexedDB V2·원본 PDF/고객 파일·구매자 개인정보/비밀키 불변. Git parent SHA 회복 가능. OCR_MANIFEST=null, 정식 Windows 바이너리/모델/폰트 번들0; 유료 사용·외부 원문 전송·판매 없음.
9. **다음 작업/완료 기준:** 먼저 P103 head SHA GitHub Actions Chrome·Edge E2E+Windows NSIS Node/React 실제 로그 성공/실패를 확인하고 최소 수정. 다음 PSM3/6 복합 6종 재현 생성기 고정/검증, Windows Tesseract DLL·언어팩·LICENSE/NOTICE·SBOM exact pin, 실제 무전송 한글 OCR/A4/취소·원문 보존·수동 검수. 최종100%는 사용자 실 PDF/물리 Windows/상용 권리·판매 별도 수용 필요. 사용자 무료 OCR 개발 승인 반복 요청 금지.
10. **갱신일시/증거/기준커밋:** 2026-11-14 KST, GitHub API Actions raw job logs로 P102 exact SHA 3/3 확인, Python 로컬 synthetic 20+6 실OCR 비교, P103 코드 f9672f12 신규 CI 아직 최종 미확인. 본 문서 SHA는 새 HEAD로 확인하고 기능 SHA와 구분.

## 2026-11-14 KST — P102 Windows OCR 인수인계 10항 (최신)

1. **목표/기술:** Astra PDF STEP1~7·BASIC/PRO/BUSINESS 사용자 100점 설계 기준, 로컬 Tesseract/Electron/PDF.js/React·기존 사용자 데이터 안전/0원 운영.
2. **결정·구현:** Windows Tesseract 5 최신 공식 설치파일 부재·UB Mannheim 제3자 확인. 기본 무배포(OFF) 유지. P102 UTF8 native stdout 보존, PSM3/6 allowlist·UI, Windows temp PNG 재시도/실패 비성공, 페이지 캔버스 4096px/8MP 가드 추가.
3. **테스트:** tests/local-ocr-controller.test.cjs 신규 한글 바이트 split·PSM 주입·cleanup failure 회귀 3종 추가; npm test/desktop:test 기존 OCR 포함 확인. GitHub 코드 연결 11개 정적 확인. **P102 exact-source Node/TS/Chrome/Edge/Windows CI 모두 실행 결과 미확인**, 신규 PASS 수치 주장 불가. P101 Linux 과거 7/7+실 Tesseract synthetic20 중 15 exact 별도 근거.
4. **완료/진행/차단:** 코드·테스트·문서 GitHub 원격 반영. 실제 Windows OCR 바이너리·DLL·traineddata 사용권/디지털 서명/해시·실 Win10/11·OCR 품질·고객 PDF5~10·LLM/상용 3SKU 모두 미검증. 최종100 미달·RELEASE HOLD.
5. **시도/결함/전환:** native stdout chunk-by-chunk UTF8 디코딩의 다중바이트 한글 깨짐 위험을 Buffer.concat으로 수정, 모드 문자열 CLI 주입 허용 금지, 임시파일 rm 실패를 성공으로 숨기지 않도록 수정. 공개 Actions URL 읽기 불가/커넥터 실행목록 제한이라 CI 성공 간주 금지. 다음엔 GitHub Actions 정확 SHA 확인 또는 독립 재현 환경으로 대체.
6. **저장소·브랜치·SHA·주요 경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112; **최종 P102 기능 소스 SHA 5d87df4ef2f9f6b6cefd6f51f52d7f66de0d2d71**, 정책/공급망 문서 커밋 d062320a2e7ce5725d77ef036b9a0b2806010459. desktop/local-ocr-controller.cjs, desktop/main.cjs, preload.cjs, src/desktopPdf.ts, src/step7/LocalOcrPanel.tsx, tests/local-ocr-controller.test.cjs. 이 문서 커밋으로 HEAD 갱신 가능.
7. **Production/실행:** Node22 npm test/build, npm run desktop:verify/smoke, Windows NSIS CI; Production/Vercel 미적용, 크몽 판매·배포 없음.
8. **원본/백업/인증:** Git 이전 SHA 복원 가능, main/PR10/STEP1 localStorage V1·STEP2 IndexedDB V2·원본 PDF/고객자료·개인키·모델바이너리/NOTICE 변경 없음. OCR_MANIFEST=null.
9. **다음 작업/기준·승인:** P102 정확 SHA CI Linux/Chrome/Edge/Windows 전 검증, DLL/재배포권/sha256/NOTICE/SBOM 포함 재배포 승인 전 공급망 프리플라이트, PSM3/6 합성표/한글 숫자 골든, 실 PDF 5~10·실 Win10/11 수용·사용자 판매 별도 승인. 무료 OCR 개발 승인 완료, 같은 승인 재요청 금지.
10. **KST 확인·증거:** 2026-11-14 KST GitHub 커넥터로 실제 소스/테스트 연결 11개 확인. 공식 12영역 가중치 합계100 승인·증거점수 UNASSESSED, 과거 내부 기술85% 구분. P102 자료 docs/commercial/ASTRA_P102_WINDOWS_OCR_SUPPLY_CHAIN_20261114.md. 문서 기준 커밋은 작성 후 HEAD 별도 대조.

## 2026-11-14 KST — P101 실 Tesseract 골든20 / 재현 자동화 인수인계 10항 (최신)

1. **목표·스택·요구:** 사용자 최종설계 STEP1~7+3SKU 100점 기준, 무료 로컬 OCR/Tesseract + React/PDF.js/Electron. 원본 데이터 보존·오프라인 검수 초안·유료서비스0. 공식 완성률 UNASSESSED/100% 미달.
2. **완료 기능·결정:** 스캔-only 판별과 PNG CRC/청크 검사 보강. 테스트를 고의로 어려운 한영·숫자·명암·기울임·흐림 20개 합성 이미지로 재생성/실 Tesseract 실행. 소스 스크립트 scripts/generate-ocr-golden.py 및 scripts/run-ocr-golden.cjs 원격 커밋. 상용 바이너리/언어팩 번들은 활성화하지 않음.
3. **테스트 명령·실측:** Node22 로컬 동일 Blob 단위 7 PASS/0 FAIL/0 SKIP; strict TS PASS. 실제 Linux Tesseract 5.5.0 kor+eng 20/20 review 반환/정확한 문자열 15/20/오인식5/20/평균 사례별 CER 2.2%/약 4.1~4.3초. 신규 생성기와 실행기를 이용해 20 PNG 해시와 결과를 재현. **전체 npm build/Chrome/Edge/Windows NSIS exact SHA CI는 조회 불가·미검증**.
4. **완료·진행·대기·차단:** P101 OCR 컨트롤러·GUI 비파괴 소스 구현, Linux OCR CLI 실추론 단위 확인. 원본 보존 실PDF5~10/고객 물리 Win10·11/실 GUI 연동/정식 DLL·언어팩 LICENSE/NOTICE/원본 A07 수동 검수/3SKU/LLM 미완, RELEASE HOLD.
5. **오류 근거·원인·대안:** 실제 합성 사례 2 불가→물가, 8 2,300,000→22300,000, 13 AI→시, 16 숫자 구분자 오류, 17 A-101→4-101. OCR은 의미·숫자 무손실 보증 불가하여 manual reviewOnly/approved:false 유지. test runner의 regex 이중 escaping 초기 코드 오류를 발견해 소스 e81afaaf에서 수정, 최신 직접 재실행 PASS. GUI/Win 성공으로 과장 금지.
6. **저장소/브랜치/SHA·경로:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112; 최신 소스+하네스 commit **e81afaafcb93a55f0d9ca6eb3ad827edebb72231**; STATUS 갱신 **622632a50d87584a0b7aceb54b49661b928d1e5d**. 실제 실행 코어 blob ebfce5b8, mock test f7b448e0, eligibility 11bdc938/a26b1e0e, Python generator 3a156177, Node runner 9b0405d1. 주요 desktop/local-ocr-controller.cjs, src/step7/*, tests/*, scripts/generate-ocr-golden.py, scripts/run-ocr-golden.cjs.
7. **Production/실행 명령/환경:** npm test/build, npm run desktop:verify/smoke, Windows NSIS, Vercel N/A. Linux 골든: python scripts/generate-ocr-golden.py --out <빈폴더> --font <로컬 한글폰트>; node scripts/run-ocr-golden.cjs <샘플폴더> <tesseract바이너리> <kor.traineddata> <eng.traineddata>. 이 명령은 OS/폰트/패키지 설치에 의존하며 대고객 품질 확정 아님.
8. **원본·백업·보안·권리:** 기존 main/Draft PR10/V1 localStorage/V2 IndexedDB/원본 PDF·사용자 기밀·한글 폰트·실 binaries 무변경, 외부 PDF 업로드0. Linux 시험 바이너리 파일·kor/eng 언어팩은 임시 공간 테스트 후 삭제, 상용 Windows 패키지 포함0. Git history SHA 롤백 가능.
9. **다음 우선순위·기준/승인:** exact SHA GitHub Actions 검증 → 무료 정식 Windows Tesseract 배포 경로·DLL/NOTICE·언어팩 해시 및 권리 확인 → 20 실 PDF/로컬 CPU/취소·실 UI·원문/수동 승인 회귀 → 실고객5~10/Win10·11·3SKU/LLM·최종 상용 판매 승인. 사용자 이미 무료 OCR 코드와 100점 배점 승인했으므로 재요청 금지. 유료결제/외부전송/출시는 별도.
10. **갱신 일시·범위·문서 SHA:** 2026-11-14 KST, 독립 컨테이너 Linux Node22·Python Pillow·Tesseract5.5 실 20건과 정확 소스 blob 확인, GitHub 원격 문서 반영. 본 HANDOFF 자체 commit은 다음 조회로 확인. GitHub Actions/Windows/고객 실제 PDF 검증하지 않음.

## 2026-11-14 KST — P101 OCR 보완 검증 인수인계 (10항 최신)

1. **목표·요구·기술:** Astra 원본 7단계 및 3SKU 최종 100점 가중 범위. OCR은 승인된 무료 오프라인 Tesseract/PDF.js/React/Electron, 원본·고객 자료 무전송, 결과 검수 전 미승인 초안.
2. **구현·결정:** 기존 P101 로컬 OCR 컨트롤러/프론트엔드에 PNG 전체 CRC/청크 검증을 추가하고 PDF.js 원본 선택 텍스트가 있는 페이지의 OCR 실행을 차단. 헤더만 믿는 안보다 CRC+IEND 검사(8MiB·8MP bounded)가 품질/안전상 우위, 외부 API 비용0. 개인정보·원본 V1/V2 DB 불변.
3. **명령·실검증:** Node22.16 격리 원격 동일 Blob 4개로 node --experimental-strip-types --test tests/local-ocr-controller.test.cjs tests/step7-ocr-eligibility.test.ts **7 PASS /0 FAIL /0 SKIP**, eligibility TypeScript strict PASS. 전체 npm test/build/Chrome·Edge/Windows NSIS 신규 소스는 **CI 미확인**. 단위 테스트의 mock spawn은 실제 Tesseract 인식 성공이 아님.
4. **완료/진행/대기:** 저장소 소스 반영/단위 검증 완료, 실행 manifest null 및 Tesseract 바이너리·kor/eng 언어팩 미번들, 실제 OCR/실 고객 PDF/물리 Win10·11 검사 미완. 공식 UNASSESSED, 판매 RELEASE HOLD.
5. **오류/원인·대안:** 기존 검사는 PNG 서명/IHDR만 신뢰하여 CRC 오류를 인식 전 거부하지 못함 → 1024청크 제한·CRC·IEND 검증 보완. test mock은 유효 4×4 PNG로 교체하고 손상 CRC 부정검사 추가. GitHub Actions API/웹 실행 목록 조회 불가, 확인되지 않은 CI 성공 추정 금지.
6. **repo/branch/SHA:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112. 정확 최신 실행 소스 SHA **d6dcf80bc024c2a36ab40738cbed1d7b28e4711f**; STATUS 문서 SHA **e4538b969b53ab4e7359c875ee4705ac9a837958**. 주요 src/step7/LocalOcrPanel.tsx·ocrEligibility.ts, desktop/local-ocr-controller.cjs, tests/local-ocr-controller.test.cjs·step7-ocr-eligibility.test.ts.
7. **Production/환경:** 로컬 Electron Windows NSIS, React Vite 브라우저, Node22. 실 서비스 배포 Vercel 미적용, 크몽 미등록, 포장/설치 사용자 검수 미적용. 빌드 및 Win CI는 차회 실제 로그 확인.
8. **원본/백업·보안:** Git 부모 SHA 롤백 가능, main/Draft PR10/원본 설계 PNG·기존 저장 데이터·고객 실PDF·서명키/모델 파일 불변. OCR 임시PNG 자동 삭제, 로그로 사용자 텍스트 출력 금지. 라이선스/바이너리 해시 및 고객 원본의 클라우드 업로드는 별도 조건.
9. **다음 우선순위:** (1) GitHub 정확 SHA Actions 실행 확인/최소 수정 (2) 정식 Tesseract Windows 바이너리+언어팩+DLL/NOTICE 검토 및 SHA 고정 (3) 한글·숫자·표·다단 스캔 20종 실 오프라인 결과/실 Win10·11 측정 (4) 원문-초안 대조·승인 동작 수용 (5) 마지막 별도 SKU/LLM/판매 요건 재검증. 추가 유료결제/실고객 원본 외부전송/PR 병합 금지.
10. **갱신 시점/근거:** 2026-11-14 KST. GitHub 현재 코드 ref 원격 일치 및 컨테이너 Node22 단위7/7, TS strict 검증. 마지막 기능 SHA와 문서 SHA 구분. 이 문서 커밋은 코드 성공 증빙 아님.

## 2026-11-14 KST — P101 신규 로컬 OCR 개발 인수인계 (10항)

1. **목표/기술:** 사용자 최종설계 STEP1~7 + 3SKU 100%, 무료 오프라인 Tesseract/PDF.js/React/TypeScript/Electron. 승인된 A01~A12 배점 100점, 증거점수 공식 UNASSESSED, 출시 HOLD.
2. **구현/근거:** desktop/local-ocr-controller.cjs에 실행파일+kor/eng 해시 고정 필수, PNG 8MiB/8MP, 안전한 전용 임시파일·stdin 미사용·shell:false·timeout/취소/동시실행 제한. main/preload/desktopPdf 좁은 IPC, step7/LocalOcrPanel.tsx UI, Root STEP7 PDF 검수 하단 연결. 별도 검토 초안만 제공, 원문/DB 자동 변경 없음.
3. **테스트/범위:** tests/local-ocr-controller.test.cjs 합성 무실행 가드/asset pin/취소/임시파일 제거, tests/step7-pdf-review-browser.mjs 브라우저 실패 폐쇄, Windows smoke IPC 검사, npm test와 desktop:test 명령에 추가. **신규 exact SHA의 실제 전체 npm/Chrome/Edge/Windows 결과는 미검증**. 이전 P100 Node179/178+desktop19 PASS 증거만 별도 보존, P101 통과로 전용 금지.
4. **완료/진행/차단:** 소스·테스트 구현/원격 반영 완료. 배포 패키지에 OCR_MANIFEST=null·실바이너리/kor/eng 언어팩 미포함으로 실제 한국어 OCR 실행 불가; Golden20, 실 고객 PDF5~10, 물리PC/라이선스/권리·상용 심사 미완.
5. **오류/근거/전환:** 인수 문서 최초 작성에서 JS 템플릿의 markdown backtick 구문 오류로 도구 요청 전 중단, backtick 없는 문서로 수정하여 GitHub 커밋 완료. 제품 실행 테스트 실패는 아직 확인되지 않음. 설치 자산 미검증 상태에서 임의 오픈/외부 다운로드 금지.
6. **저장소·브랜치·SHA:** hibi89/astra_pdf_redesigner / feature/astra-p71-pdf-source-parity-20261112. 마지막 소스 SHA **deeb1ed94a00cb25cfc1efafcf8e33fab1f9847b**; 이후 docs-only STATUS **e06ec9c665b52bee31b5d02765d9bbe1f03223ff**, 본 HANDOFF 갱신 시 HEAD 재확인. main/Draft PR10 불변.
7. **배포/환경:** Node22 npm test/build, Chrome/Edge, Windows Electron NSIS hosted; Vercel Production 해당 없음. 설치형 합성 테스트가 실 Win10/11 구매자 수용을 대체하지 않음.
8. **자산·백업/보안:** 원본 docs/ASTRA_ORIGINAL_ROADMAP.txt·설계PNG, V1 localStorage/V2 IndexedDB, 고객 PDF·모델 비밀·개인키 그대로. 신규 OCR은 임시 페이지 래스터 1장 메모리→격리 파일→정리, 외부 network/API/요금0. 기존 Git 부모 SHA로 코드 복원 가능.
9. **다음 작업:** (1) 신규 exact-SHA GitHub Actions Linux/Chrome/Edge/Windows 로그 확인 및 오류 최소수정 (2) Tesseract Windows 공급원·DLL/LICENSE/NOTICE 및 kor/eng SHA 검증+승인 코드 manifest pin (3) 실 오프라인 한국어 스캔 골든 20종/취소/성능 회귀 (4) OCR 미승인 초안 수동 대조·확정, 이후 실고객/상품화 분리. 100%/판매GO 주장 금지.
10. **시점/검증:** 2026-11-14 KST 원격 코드·문서 API 업데이트 결과 확인, 최신 CI 실행 결과 아직 별도 증거 없음. P101은 개발 회차 번호이며 공식 완성률이 아님. 상세 docs/commercial/ASTRA_P101_LOCAL_OCR_DEVELOPMENT_20261114.md.

## 2026-11-14 KST — 사용자 승인 최신 인수인계 (10항)

1. 목표: 원본 STEP1~7+3SKU 전체 100%, 최종 12영역 가중치 승인.
2. 결정: 무료 로컬 OCR Tesseract 우선, 무료 llama.cpp+Qwen GGUF 후보 우선, 배점 A01–A12 확정.
3. 검증: 공식 라이선스 원문 Tesseract/tessdata_fast Apache-2.0, llama.cpp MIT, Qwen3-0.6B GGUF Apache-2.0 확인. 기능 실바이너리/CPU/OCR 품질·재배포 해시 미검증; 이전 P95~P100 exact SHA CI 기록 유지.
4. 상태: 사용자 승인 3건 완료, 구현/실증 대기, 최종 증거 점수 산정 대기/100% 미달, RELEASE HOLD.
5. 실패/대안: 별도 OCR 실행파일 vs WASM(전자는 기존 구조 최소수정), 로컬 llama.cpp vs 유료 클라우드(전자는 0원·개인정보 유출 차단). 무검증 번들 금지.
6. repo/branch: hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112, 최신 기능 SHA 2213e8e5, 본 승인 문서 SHA 이후 재조회.
7. 배포: Vercel 미적용, 크몽 미등록, Windows NSIS CI 기술 PASS/실 사용자 Win10·11 미검증.
8. 원본·보안: main/PR10·V1/V2/고객 PDF·개인키·모델파일 불변, 다운로드/외부 원본 업로드/유료결제0.
9. 다음: 정확한 무료 바이너리/모델 버전·해시·권리 확보→STEP7 OCR/로컬 모델 안전 통합→CPU/한글 품질 회귀→실 PDF5~10·Windows 설치 수용→정식 SKU 및 판매 별도 GO. 동일 승인 재요청 금지.
10. 확인: 2026-11-14 KST, 사용자 채팅의 명시 승인 및 upstream 공식 라이선스 근거. 상세 `docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md`.

## 2026-11-14 KST — P100 STEP6 출처 보관 검증 성공 / 전체 제품 100% 미달 (10항)

1. **목표·정본·기술:** 원본 STEP1~7+크몽 3SKU 100% 기준 React/TS/Electron/PDF.js, 공식률 UNASSESSED, 과거85% 내부 별도.
2. **완료·근거:** P95 PRO 로컬 PDF 수동 순차 승인, P96 ECDSA 서명 검증 모듈, P97 PRO 저장 시안, P98 BUSINESS 브랜드 텍스트 보관, P99 안전 외부 Google/Bing 네이티브 확인, P100 참고 URL/권리 `UNVERIFIED` 별도 로컬 출처 목록. 사용자 원문·파일 원본 자동수집/전송 없음.
3. **테스트:** 신규 정확 기능SHA `2213e8e50759836b8c24bfbe7b037536a8fd995a`, [Linux Chrome/Edge #43553461990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553461990) **2/2 SUCCESS, Node179/179 PASS**, [Win #43553462026](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462026) **SUCCESS, Node178 PASS/1OS SKIP, desktop19PASS, NSIS upgrade V2·PNG 보존**. P95~P99 정확 SHA/CI 이전 HANDOFF 기록 참조. 실 고객PC/실PDF·모델/OCR 검증 없음.
4. **완료·진행·차단:** P100 로컬 출처 메타데이터 구현·회귀 3/3 성공, 원래 STEP6 검색결과 API/카드/STEP5 직접 연결 미완. 진짜 오프라인 LLM·OCR/스캔, 표·다단, 상용 GUI 사용권/브랜드 일괄·사용자 PC/실 PDF5~10·폰트/모델 rights·크몽/고객 수용 미완. 전체100 미달, RELEASE HOLD·미등록.
5. **오류·근거·피벗:** P100 최초 브라우저 test 교체 위치 찾기 실패 GitHub 쓰기 전 중단→독립 파일·실존 브라우저 로그 앵커 사용해서 재설계/테스트 통과, 원본 프로젝트 V2 불변. P97 첫 TS 타입 오류는 수정 SHA `ed363a4f` 후 CI GREEN. 반복 무의미 재시도 금지.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, P100 기능 `2213e8e5`, 제품 직전 docs `83c65f23`, 크몽 listing-only docs `1d79bbca`. 이번 docs HEAD 커밋 후 조회. 주요 `src/step6/sourceRecords.ts`, `src/step6/SourceRecordsPanel.tsx`, `tests/step5-reference-browser.mjs`.
7. **Production/환경:** GitHub Node22 Linux Chrome/Edge Windows Electron NSIS, Vercel/Production 미적용, 고객 설치·크몽 등록 없음.
8. **원본·백업/비밀:** git parent SHA reversible, main/PR10/V1/V2/원본 PDF/모델/폰트/실 라이선스 발급키 불변. 고객 내용 자동 외부 네트워크0, 유료 결제0.
9. **다음 우선순위/사용자 승인:** 2026-11-14 13:00 KST 기존 통합 알림에서 폰으로 12영역 배점 확정·모델/Tesseract 0원 권리/해시·오프라인 라이선스 발급 정책 승인, 외출 후 PC Win10/11+5~10 허가PDF 원문/출력7항 실검수/국문 글꼴·실 모델 CPU/판매 GO 별도 요청. 100%·등록완료·판매GO 증거 없이 확정 금지.
10. **갱신/검증범위:** 2026-11-14 KST 실제 GitHub exact SHA Actions raw job log 3/3, 총 Node179/178+desktop19, P100은 내부 기능 번호이며 공식 완성률 아님. 문서 자체 커밋은 별도 코드 증명 불가.

## 2026-11-14 KST — P100 수동 출처 수집·오프라인 라이브러리 후속 인수 (10항)

1. **목표·기술:** 원본STEP1~7+3SKU 전체100%, React/TS/Electron 로컬 우선, 제품 공식완성률 `UNASSESSED`/100% 미달.
2. **변경·선택:** STEP6 검색 URL 결과 직접 API/자동수집 대신 추가 0원·무전송 수동 북마크. 사용자가 직접 URL·이름·권리 메모 입력, 별도 localStorage 20건, 항상 권리 `UNVERIFIED`, V2 문서 불변.
3. **테스트:** 정확 코드 `2213e8e50759836b8c24bfbe7b037536a8fd995a` Node unit+Chrome/Edge browser sourceRecord V2 불변 회귀 작성, [Linux #43553461990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553461990), [Win #43553462026](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462026) **실행 중/결과 미확인**. policy #43553462320 SUCCESS. 앞 P99 source `0a0dec3e` Chrome/Edge+Win CI 3/3 GREEN Node177/176 desktop19. 실 URL 사용권·고객PDF QA 미검증.
4. **상태:** 이번 P100 기능 소스/회귀 커밋됨, CI 검증 대기. 원래 STEP6 앱 내 결과 카드/API/권리 자동검증·STEP7 OCR/진짜 로컬 LLM·정식 상품 SKU/실 고객 PC/5–10 PDF·판매 승인 HOLD. 전체100 미달.
5. **실패/피벗:** 최초 P100 브라우저 테스트 정확 앵커 불일치 GitHub 쓰기 전 중단, 이번 작업은 독립 sourceRecords/SourceRecordsPanel 분리·브라우저 끝의 실제 존재 앵커 위치를 사용해 소스 반영. 문제가 발견되면 exact CI 로그 확인 후 최소 1회 수정; 반복 강제 패치 금지.
6. **repo/branch/SHA/path:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, 코드 `2213e8e5`, `src/step6/sourceRecords.ts`, `src/step6/SourceRecordsPanel.tsx`, `tests/source-records.test.ts`, `tests/step5-reference-browser.mjs`; 문서 HEAD 이번 커밋 후 확인.
7. **Production/환경:** GitHub Node22 Linux Chrome/Edge, Win Electron NSIS. Vercel/Production 미적용, 출시/크몽 등록0.
8. **원본·백업·보안:** parent `ded69d01` 및 이후 HEAD revert 가능. 원본 STEP1 V1/STEP2 IDB V2/고객 PDFs·모델키/실 브랜드 assets·main/PR10 불변, 외부 전송·유료 사용료0.
9. **다음 작업/승인:** 정확 P100 Linux/Win CI 종료 결과 확인→오류시 재현/최소수정. 실제 Tesseract OCR/한국어 GGUF 승인·다운로드 권리/인수 및 원래 STEP6 제공처 API·검색결과 카드·실품질/상용 SKU 구현은 후속. 기존 13:00 사용자 통합에서 휴대전화 배점/권리·소프트웨어 승인과 PC 실PDF5~10/Win10·11 검증 일괄 안내; 당장 외출 중 수동 PC 작업 요구 금지.
10. **확인 일시/범위:** 2026-11-14 KST GitHub source readback 및 Actions 현재 상태, 최종 SUCCEEDED 아직 미확정. 공식 `UNASSESSED`/목표100 미달·이전 내부85% 별도.

## 2026-11-14 KST — P99 CI 완료 readback 및 인수인계 10항 (최신)

1. **목표/기술:** 원본 7단계·3SKU 전체100%, 오프라인 우선 React/TS/Electron/PDF.js·0원, 최종률 UNASSESSED.
2. **완료 기능/설계:** P95 파일별 수동 검수 PRO 배치; P96 ECDSA-256 진짜 서명 검증 모듈(판매키 미발급), P97 PRO 레이아웃 로컬 보관, P98 BUSINESS 브랜드 텍스트 보관, P99 안전 URL만 시스템 외부 브라우저로 띄우기 전 별도 native 확인창 (실 GUI 사람 클릭 시험 대기). V2 문서/원본 PDF 미변경.
3. **테스트:** 최신 정확 source `0a0dec3edb998cc8ea94bcffc3fa781c7d1c9377`: Linux [#43552456521](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456521) **2/2 SUCCESS Node177/177 PASS**, Windows [#43552456514](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456514) **SUCCESS Node176 PASS/1 OS SKIP desktop19/19**, 설치·제거·업그레이드 V2/PDF 보존. 정책 [#43552456710](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43552456710) SUCCESS. 실제 물리 Win10/11·PDF5~10/OCR/모델·클릭 웹브라우저 미검증.
4. **진척/대기:** P95–P99 기능 또는 경계선 보안 CI SUCCESS. 원래 STEP6 완전 검색결과 카드·STEP7 OCR 실제 실행·한국어 GGUF 모델/CPU·SKU GUI entitlement·BUSINESS 일괄·인수/권리/판매 GO 미완. 공식 P100 UNASSESSED, [작업중]/HOLD/미등록.
5. **오류·근거/대안:** P97 최초 unknown savedAt 타입 오류 CI FAIL을 좁힘 수정으로 재CI 성공. P100 참고 출처 북마크 테스트 앵커 불일치로 커밋 전 중단, 기존 기능 유지; 후속 컴포넌트 분리나 실제 승인 기반 검색 제공 API가 마련될 때 재평가.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, code SHA `0a0dec3e`, 전 문서 HEAD `cf3813d3`, 새 docs HEAD는 커밋 후 확인. 핵심 파일은 STATUS 상단 및 P95–P99 인수 항목 참조.
7. **배포/실행:** `npm test && npm run build`, Chrome/Edge GitHub Linux runners, Windows Node22 Electron NSIS. Production/Vercel **미적용**, 설치형 미출시/실고객 Windows 검증 전 보류.
8. **백업·비밀:** git parent SHA 역변환 가능, force push 없음; main/PR10/V1 localStorage/V2 IndexedDB/고객 PDF·모델·실 라이선스 키 불변, 외부 원문 전송0.
9. **다음 작업/승인:** 오후 1시(2026-11-14 KST) 기존 통합 1회 알림에서 폰 12영역 배점/권리·실 모델·OCR·정식 발급키 승인, PC 5~10 허가 PDF/Win10·11 설치 인수/실제 검색 페이지·국문 폰트 검증을 묶음. 미승인 유료결제·소유자 원본 업로드·상용키 생성·크몽 등록 실행 금지.
10. **갱신일/검증 범위:** 2026-11-14 KST raw GitHub Actions exact SHA 전체 verdict, Node/desktop counters, 보류 항목·정본 요구를 구분. 문서 커밋 자체는 기능 CI가 아님.

## 2026-11-14 KST — P95~P99 개발·회귀 및 100% 목표 인수인계 (필수 10항)

1. **목표·기술·확정:** 사용자 7단계+크몽 3SKU(BASIC8/PRO20/BUSINESS30), 0원 로컬 React/TypeScript/Electron/PDF.js. 최종 100%, 공식률 UNASSESSED/미달. 미승인 12항 100점 배점안은 `docs/commercial/ASTRA_P100_SCOREBOARD_20261114.md`.
2. **완료·설계근거:** P95 독립 BatchImportPanel 로컬 PDF2–10개 수동 개별 인수 (기존 PDF 업로드 로직 재사용), P96 서버 없는 ECDSA 오프라인 서명 검증 모듈, P97 고급 레이아웃 별도 로컬 저장/복원, P98 BUSINESS 텍스트 브랜드 보관함, P99 네이티브 사용자 동의형 안전 외부 검색창. 기존 V2 문서/DB migration 대신 별도 로컬 메타데이터만 저장, 앱 HTTP 네트워크 차단 유지.
3. **테스트:** P95 exact `e69dfed1` Linux #43551099424 2/2 SUCCESS Node167PASS, Win #43551099468 SUCCESS Node166PASS+desktop16. P96 exact `0ffcbbeb` Linux #43551475625 2/2 SUCCESS Node170PASS, Win #43551475613 SUCCESS Node169PASS+desktop16. P97 수정 exact `ed363a4f` Linux #43551962845 2/2 SUCCESS Node172PASS, Win #43551962840 SUCCESS Node171PASS+desktop16. P98 exact `1918a801` Linux #43552063732 2/2 SUCCESS Node174PASS, Win #43552063812 SUCCESS Node173PASS+desktop16. P99 source+CI test `0a0dec3e`: Linux #43552456521 /Win #43552456514 **종료 전 미검증**, policy #43552456710 SUCCESS. 모든 Windows Node 1OS SKIP, NSIS 설치/업그레이드. 실 고객PC/실PDF 5–10, LLM/OCR 미검증.
4. **완료/진행/차단:** P95–P98 기술 PASS, P99 CI 검증 대기, P100 출처 북마크 앵커 미반영. OCR·GGUF·STEP6 검색 카드·정식 SKU entitlement·BUSINESS 일괄·고객QA·권리·구매자 Windows 검증 대기, 최종100 미달. [작업중], RELEASE HOLD, 미등록.
5. **실패 근거/시도·피벗:** P97 Windows/Linux TS `savedAt:unknown` 2 build FAIL 동일 원인 → `typeof item.savedAt==='number'` 좁힘 단일 수정으로 재CI SUCCESS. P100 브라우저 테스트 앵커 불일치 1회 GitHub 쓰기 전에 중단; 추가 강제 문자열 교체하지 않고 분리/소스 위치 재확인. OCR 라이브러리/실모델 다운로드와 개인키 발급 무승인 강행 금지.
6. **저장소/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, 최신 source `0a0dec3edb998cc8ea94bcffc3fa781c7d1c9377`; docs HEAD 갱신 후 readback. 주요 `src/step3/BatchImportPanel.tsx`, `src/commercial/offlineLicense.ts`, `src/step4/ProLayoutLibrary.tsx`, `src/step4/BusinessBrandLibrary.tsx`, `desktop/approved-search-link.cjs`.
7. **실행·Production:** `npm test && npm run build` GitHub Actions Node22 Linux Chrome+Edge, Win Electron16/NSIS. Vercel/Production **미적용**, 크몽 판매물 미출시, 사용자 실 Windows10·11 미실행.
8. **원본·백업·보안:** git parent `54e12b70`→P95 `e69dfed1`→P96 `0ffcbbeb`→P97 `6d68410f`→fix `ed363a4f`→P98 `1918a801`→P99 `a2b7feab`→test `0a0dec3e`. git revert 가능, force push 없음, main/PR10·V1/V2/고객 PDF/모델/비밀 unchanged.
9. **다음 우선순위·승인:** P99 CI 완료 확인→오류 시 최소 수정→영구 GUI 판매용 서명키/런타임 라이선스 연계, 실제 OCR 엔진·한국어 모델 권리 승인 후 0원 실동작/CPU 검증, STEP6 화면형 결과, BUSINESS 브랜드 일괄. 기존 2026-11-14 13:00 통합 자동화에 폰으로 미승인 배점안/권리·추가 설치 결정, PC 필요 실제 PDF5–10와 Win10/11 수용/출시 승인 일괄 처리. 판매·라이선스/소스 병합·유료 비용은 명시 GO 대기.
10. **시각·검증 경계:** 2026-11-14 KST, GitHub exact SHA 실제 Actions 및 raw 로그. 수치 `UNASSESSED`은 0% 뜻 아님; 내부 과거 85%는 별개. 코드 CI SUCCESS가 전체 SKU/인수 GO 아님. 문서 기준 SHA 이번 갱신 후 readback.

## 2026-11-14 KST — P93/P94 기능 검증·최종완성률 산정 대기 (HANDOFF 필수10항)

1. **목표·설계·기술:** 원본 7단계+3SKU(BASIC8/PRO20/BUSINESS30), 0원 로컬 React/TS/PDF.js/Electron, 전체 최종100%. 12영역 요구사항/배점 제안은 `docs/commercial/ASTRA_P100_SCOREBOARD_20261114.md`.
2. **완료·차별·결정:** P93 PRO/BUSINESS 22개 전종 A4 PDF 실제 Chrome/Edge 출력 검증. P94 BUSINESS 로컬 로고·브랜드명·꼬리말·브랜드 색·JSON 불러오기/내보내기. DB 직접 migration(A)은 동의/호환성 위험이 있어 session-only + 수동 JSON(B)을 채택. 기존 STEP1/2/3 변경 없이 작동.
3. **테스트:** 기능 SHA `39acc84f48bf1edda4b2687e896dc833ab398e92` Linux #43549158873 2/2 Chrome/Edge SUCCESS Node165/165 + TypeScript/Vite build, Win #43549158855 SUCCESS Node164PASS/1SKIP desktop16 PASS, NSIS 설치·제거·업그레이드 V2 데이터 유지, gate #43549159013 SUCCESS. 실제 Win10/11 사용자·5~10 실PDF/모델·상업권 전부 미검증.
4. **완료/진행/대기:** 새 기능·CI 끝, 기술 병목 A04/06/07/08/09/10/11/12은 남음. **공식 최종완성률 UNASSESSED / 100% 미달**, 내부85%는 역사적 잠정. [작업중], RELEASE HOLD, 크몽 등록0.
5. **실패 근거/대안:** P95 STEP3 다중 PDF 큐 `ImportPanel.tsx` 자동 문자열 통합 CRLF/anchor 2회 실패, 원격 GitHub 쓰기 전 중지. 부작용0. 재시도 반복 금지, 다음 작업은 독립 컴포넌트로 피벗 및 실제 브라우저 연결 검증. OCR/LLM 자료 무단 다운로드 금지.
6. **저장소·브랜치·SHA:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`; P94 기능 `39acc84f`, P93 기능 `ffd7a3dd`, docs HEAD 이번 커밋 후 재조회. 핵심 `src/step4/brandKit.ts`, `src/step2/Workspace.tsx`, `tests/step4-style-preset-browser.mjs`.
7. **배포·실행:** `npm test && npm run build`, hosted Linux Chrome/Edge·Windows NSIS. Vercel/Production 미적용, 물리 PC 미검증. 공개 사이트·크몽 상품 미출시.
8. **원본·백업·인증:** 작업 전 Git parent `b8b29bc1`→P93 `ffd7a3dd`→P94 `39acc84f`; Git non-force revert 가능. STEP1 localStorage V1/STEP2 IndexedDB V2·main·PR10·고객 PDF/모델·비밀/구매자 자료 불변.
9. **다음 우선순위/승인:** 13:00 기존 합동 요청에서 12개 배점 제안 승인, 허가 PDF5~10 원본 대조 및 실 Win10/11·폰트/모델 라이선스·0원 OCR/LLM 설치/보안·판매 결정 모음. 그 뒤 P95 독립 안전 큐, PRO 영구 라이브러리, BUSINESS 정식 entitlement·배치·브랜드, OCR/모델 품질. 100점/상용 GO 전 고객 수용 필요.
10. **갱신 시점/범위:** 2026-11-14 KST, 원격 Actions 완료 verdict 및 raw 로그, 정확 기능 SHA 기준. 새 문서 HEAD는 별도 조회, 문서 커밋은 새 기능 검증 SHA가 아님. 중앙 `kmong-productization` 동일 수치/범위 동기화 필요.

## 2026-11-14 KST — P92 CI 종료 확정 인수요약 (10항)

1. **목표·기술:** 원래 STEP1~7·BASIC8/PRO20/BUSINESS30 전체 100% 최종설계, 무료 로컬 React/TypeScript/Electron/PDF.js.
2. **변경·선택:** P91 옵트인 외부 이미지 검색 링크, P92 22종 고급 임시 시안 JSON 레이아웃 ID만 수동 저장/재사용, 원본 내용·IDB V2 스키마 불변.
3. **정확 SHA 테스트:** `b8b29bc13fe09a7220ed47b5139e5f41c3e5140f` [Linux #43547702092](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702092) **2/2 SUCCESS, Node163 PASS/0 FAIL, Chrome+Edge, TS/Vite build 및 A4 인쇄**; [Win #43547702089](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702089) **SUCCESS, Node162 PASS/0 FAIL/OS 1SKIP, desktop16/16, NSIS install/uninstall/upgrade/V2 유지**; [policy #43547702386](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43547702386) SUCCESS. 실제 고객PC·고객 PDF는 수행하지 않음.
4. **완료/대기:** 2개 기능 추가·기존 회귀 검증 완료. STEP6 실제 검색 결과 수집, STEP7 OCR, 실 GGUF, 정식 3 SKU 저장/권한/브랜드/배치, 고객·권리·판매 검증 미달. 공식 UNASSESSED, P100 미달, RELEASE HOLD.
5. **문제·전환·재시도:** 무료 수동 검색/휴대용 파일로 외부 PDF·유료 API·영구 DB migration 위험 회피. 정규식/스키마 부정 입력 PASS; 미검증은 고객 인수·상용성이지 새 CI failure 아님.
6. **Repo/브랜치/SHA:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`; 기능 SHA `b8b29bc1`, 직전 문서 SHA `cfb5bcdcf7f3`, 본 문서 HEAD는 커밋 후 조회. 핵심 `src/step4/advancedLayoutPreset.ts`, `src/step6/*`, `tests/*preset*.test.ts`, browser tests.
7. **배포·환경:** GitHub Actions hosted Ubuntu Chrome/Edge+Windows NSIS; Vercel/Production 미적용, 사용자 물리 Win10/11 미검증.
8. **원본·보안·복구:** main/PR10·STEP1 v1/STEP2 IDB V2·고객PDF/모델/토큰 불변, parent SHA 기반 revert 가능. 고객 자료 업로드·무단 다운로드/상용 배포 금지.
9. **다음 우선순위·승인:** 13:00 기존 통합 사용자 알림에서 물리PC/5~10 실문서/모델·OCR 무료 설치/폰트·권리 일괄 안내; AI는 이후 OCR/정식 저장/브랜드 배치 구현·품질/권리 검증. 판매/병합/유료 결제 별도 소유자 GO 필요.
10. **검증 시각·범위:** 2026-11-14 KST, GitHub 3개 Actions job verdict 및 실제 raw 로그에 근거. 전체100%/크몽 등록 미달 상태 보존.

## 2026-11-14 KST — P92 STEP4 고급 시안 휴대용 파일 (10항)

1. **목표/요구/기술:** 사용자 확정 7단계 전체·BASIC8/PRO20/BUSINESS30 100%, 0원 로컬 앱. React/TypeScript/Vite/Electron/PDF.js, 판매·실모델 별도 승인.
2. **완료 변경/선정 근거:** 22종 임시 고급 레이아웃에 대해 `src/step4/advancedLayoutPreset.ts`의 JSON export/import + `src/step2/Workspace.tsx` UI. DB V2 스키마 직접 변경(A)은 동의/마이그레이션 위험이 크므로, 작은 JSON 수동 보관(B)을 먼저 선택. 레이아웃 ID 외 고객 내용 비포함.
3. **테스트/결과:** 독립 Node22 P92 테스트 **2 PASS/0 FAIL**, 기존 P91 정확 SHA `be243985ff5c` Chrome/Edge Linux #43547363002 **2/2 GREEN, Node 161/161**, Windows #43547362316 **SUCCESS**, gate #43547362463 SUCCESS. P92 새 소스 `b8b29bc13fe0` CI Linux #43547702092, Win #43547702089 **진행 중(최종 미검증)**, gate #43547702386 SUCCESS. P92 새 브라우저 JSON roundtrip·보안회귀는 CI 종료 전 미확정.
4. **완료/진행/대기/차단:** 기존 BASIC8 + 22개 고급 임시 출력, P91 STEP6 동의형 수동 검색, P92 JSON 재사용 구현. 원래 STEP6 앱내 카드/수집 및 STEP7 OCR, 오프라인 실제 LLM, PRO/BUSINESS 정식 저장/권한/배치·브랜드키트/고객 QA/권리/판매 GO 미완; 100% 미달.
5. **문제·시도·전환:** 저장 스키마 직접 변환·외부 API/고객PDF 업로드/무단 다운로드는 회피. 유효 레이아웃 ID 22개·1KiB·정확 키 검증 방식 채택. P92 CI 미완료는 실패 단정하지 말고 확인 뒤 최소 수정.
6. **Repo/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, 기능 SHA `b8b29bc13fe09a7220ed47b5139e5f41c3e5140f`, 이전 P91 `be243985ff5c`(승인보안 회귀). `src/step4/advancedLayoutPreset.ts`, `src/step6/*`, `tests/advanced-layout-preset.test.ts`, `tests/step4-style-preset-browser.mjs`.
7. **Production/실행/환경:** `npm test && npm run build`, GitHub hosted Node22 Chrome/Edge Windows NSIS. Production URL 및 Vercel 프로젝트 **미적용**, 로컬 실제 Win10/11 **미검증**, 공개 판매 미등록.
8. **원본/백업/비밀:** 부모 기능 SHA `be243985ff5c`로 Git revert 복구 가능. 기존 main/Draft PR10/설정·DB localStorage v1, IndexedDB v2·고객 PDF 불변. 파일명/고객자료/토큰/모델 가중치 GitHub 업로드 금지.
9. **다음 작업/승인:** 정확 P92 SHA CI 완료 확인→실고객/물리PC/폰트·모델 권리/설치 검증→안전한 승인형 OCR/한국어 모델 및 PRO20/BUSINESS30 SKU 구현. 13시 소유자 PC 요청 `docs/commercial/ASTRA_OWNER_1300_CHECKLIST_20261114.md`에 일괄 보관, 중복 알림 금지. 출시/크몽 등록은 최종 사용자 GO 필요.
10. **갱신/확인 시점:** 2026-11-14 KST, P91 정확 CI 결과·P92 source GitHub readback 및 Node22 분리 단위만 검증. 공식 `UNASSESSED`/[작업중]/RELEASE HOLD, 문서 기준 커밋 후 원격 확인. 임의 100%·95% 산정 금지.

## 2026-11-14 KST — P91 STEP6 보안형 검색 연결 (10항 인수인계)

1. **목표/확정 요구/기술:** Astra 원래 7단계·3 SKU 전체 최종설계 100%, 0원 로컬우선, React/TS/Vite/Electron/PDF.js. 웹 검색은 소유자가 수동 입력한 일반 키워드만.
2. **완료 기능/선택 근거:** `src/step6/referenceDiscovery.ts`(고정 호스트 HTTPS URL/80자/제어문자 차단), `src/step6/ReferenceSearchPanel.tsx`(opt-in 검색/새 탭/다운로드 후 STEP5 로컬 분석), `src/step2/Workspace.tsx` 연결. 직접 원격 이미지 수집보다 비용 0원·저작권/개인 PDF 외부 전송 위험 낮은 수동 검색을 선택.
3. **테스트/미검증:** Node22 독립 모듈 2 PASS/0 FAIL(컨테이너), 기존 159/159 PASS는 이전 정확 코드 `8d604a0644cc` 전용. 신규 소스 `95a7f7be6cab` CI 실행 중; 이번 추가 브라우저 동의·DB불변 회귀가 반영된 다음 SHA는 CI 종료 전 성공 주장 금지.
4. **상태/중단:** STEP6 수동 탐색 링크 구현, 자동검색 카드·결과 직접 수집은 미구현. PRO20/BUSINESS30 정식 저장/entitlement/배치·브랜드 기능, OCR, 모델, PDF·Windows 실사용 시험, 판매 인수 미완. 공식 **UNASSESSED/100% 미달** [작업중], RELEASE HOLD.
5. **문제/피벗:** 승인 안 된 외부 PDF 전송·원격 모델/API·구독·DB 스키마 변환을 회피. 링크 검색 수동 방식으로 전환; 라이선스나 OCR 정확도를 보장하지 않음. 2회 실패 반복 재시도 없음.
6. **저장소/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, P91 기능 HEAD `95a7f7be6cab5a98637fceac7f50196eb1bac219`; 본 문서 포함 최신 SHA는 커밋 후 재확인. 핵심 `src/step6/*`, `tests/reference-discovery.test.ts`, `tests/step5-reference-browser.mjs`.
7. **배포/환경:** 기존 GitHub Actions Node22/Chrome/Edge + Windows NSIS; Production/Vercel **미적용**, Windows 물리 PC 미검증. 명령 `npm test && npm run build`, 워크플로 `.github/workflows/ci.yml`.
8. **원본/백업/보안:** 부모 커밋 `b9065bfb5e46`로 소스 회귀 가능; v1/localStorage·V2/IndexedDB·원본 PDF·Draft PR10·main·원격 설정 불변. PDF/고객자료/토큰/모델 가중치 업로드 금지.
9. **다음 우선순위/승인:** P91 정확 SHA CI 확인→오류만 최소 수정→STEP4 PRO20/BUSINESS30 완성 및 STEP7 OCR/오프라인 한국어 모델 실제 권리 검증. 오후 1시 사용자 PC·실PDF/Windows/라이선스/무료 모델·OCR 다운로드 동의 일괄 요청; 판매·서명·배포는 별도 GO.
10. **갱신 시점/검증 범위:** 2026-11-14 KST, GitHub branch source readback + Node22 독립 테스트. 문서 전용/회귀 추가 커밋을 전체 통과 SHA로 오인하지 않음.

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

## 2026-11-14 KST — P89 22개 추가 임시 레이아웃 인수인계 (10항)
1. **목표·기술:** 전체 100% 최종설계 중 PRO20/BUSINESS30 고유 조판 부족을 무료·오프라인 React/TS/CSS/Electron으로 최소위험 보강.
2. **범위·근거:** 기존 BASIC 8개 보존, 추가 12/10 임시 조판·미리보기/새 PDF 시험, 구조 11개 계열과 개별 여백·정렬·타이틀·구획 사용. 별도 V2 DB schema 변경 없이 교체 가능 후보를 먼저 검증하는 방식을 선택.
3. **테스트:** 단위 `tests/sku-layout-candidates.test.ts`, 실제 Chrome·Edge 22개 CSS 구조 및 1개 A4 출력·기존 V2 불변 테스트를 추가. 정확 SHA `cabe0adf79a3` CI #43544304090 Linux Chrome/Edge 및 #43544304096 Windows **진행 중/최종 결과 미확인**, 최종설계 정책 #43544304524 SUCCESS. 이전 P88 CI SUCCESS는 별개.
4. **상태:** 시안 코드 완료, E2E/Win 설치형 결과 대기. 실판매 PRO20/BUSINESS30 기능·영구템플릿·SKU entitlement/실고객 수용 미완. 최종률 UNASSESSED, 목표100 미달/[작업중]/RELEASE HOLD.
5. **오류·재시도:** 최초 브라우저 테스트 PDF info 정규식에서 literal `\\s` 오타 발견, 실제 실행 전 테스트 코드만 정정(cabe0adf). 새로운 실행의 FAIL 여부는 아직 확인 안 됨; 실제 실패 근거 없이 무의미한 반복 금지.
6. **저장소·SHA·경로:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, 기능 최초 `81aa46f9980188070c612a8becb1ddbb56ec5d1d`, 최종 수정 `cabe0adf79a3724066c367ac7cbdb3955bbc113a`; `src/step4/skuLayoutCandidates.ts`, `src/step2/Workspace.tsx`, `src/styles.css`, `tests/sku-layout-candidates.test.ts`, STEP4 browser E2E.
7. **배포·환경:** Production/Vercel 미적용. Node22 `npm test`, `npm run build`; Linux Chrome/Edge, hosted Windows Electron NSIS, 실제 소비자 설치 미실행.
8. **원본·보안/백업:** Git 이전 `50f9a057` 보존, 기존 IndexedDB V2/v1 localStorage/원본 PDF/비밀/이미지/모델 무변경, 퍼블릭 GitHub에는 합성 테스트만.
9. **다음 작업·승인:** CI 종료 후 실패 원인별 최소수정, 고급 22개 PDF 개별 인쇄·다페이지 및 육안 수용, 향후 실제 저장·라이선스/검색/OCR/모델 다운로드·외부 전송·출시 사전 승인.
10. **시점:** 2026-11-14 KST, GitHub 기능 SHA/코드 diff 확인, CI 실행 중; 문서 기준 SHA는 후속 GitHub HEAD 재확인. P88 5/5 및 이전 CI PASS와 P89 새 결과를 혼동하지 않는다.

## 2026-11-14 KST — ASTRA P88 새 기능 SHA CI 완전 확인 (최종설계 100% 미달)

- **기능 SHA** `fb3b02217c6c4223df49c2141e9373f08317a66c`: GitHub Blob이 로컬 합성검증 Node22.16.0 5/5 PASS인 새 P88 검수 도구 및 테스트와 각각 동일(`3c6a4fcd...`, `e14d18f8...`).
- [Windows NSIS #43541356233](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43541356233) **COMPLETED SUCCESS**: build/desktop native smoke/unsigned NSIS/설치→실행→제거/0.1.0→0.1.1 업그레이드 이후 STEP2 IndexedDB 유지/installer SHA 보고·아티팩트 업로드.
- [Chrome+Edge #43541356242](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43541356242) **COMPLETED SUCCESS**: npm test + npm run build, Chromium Chrome 인쇄/상태저장, Microsoft Edge A4 PDF/IndexedDB smoke 각각 SUCCESS.
- [최종설계 증거 정책 #43541356536](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43541356536) **COMPLETED SUCCESS**: 점수 과장 없이 evidence/scope gate 통과. 이것은 제품 100% 수용 아님.
- 이후 문서 전용 [크몽 상품 초안](docs/commercial/ASTRA_KMONG_LISTING_DRAFT_20261114.md), [7단계 전체 100% 격차표](docs/commercial/ASTRA_FINAL_BLUEPRINT_100_GATES_20261114.md), [Apache/MIT 모델 라이선스 1차 조사](docs/commercial/ASTRA_MODEL_LICENSE_PRECHECK_20261114.md) 작성. 이 3개 docs-only 커밋은 테스트 대상 소스 변경 없음.
- **정식 전체 완성률 UNASSESSED·100% 미달 / 역사상 내부 엔지니어링 잠정 85%**. 5~10 허가된 고객 PDF, 물리 Windows10·11, 20/30 디자인, STEP6 공개 레퍼런스 검색/STEP7 OCR, 실제 한국어 GGUF, 상용 사용권·SKU entitlement/출시 승인 미완; `[작업중]`, `RELEASE HOLD`, `미등록`. Production/Vercel 미적용.
- 아래 과거 작업 로그는 변경하지 않음; 후속 실제 개발·검증 때만 상태 갱신. 개인 PDF/경로/모델 가중치/토큰 GitHub 업로드 금지.

## 2026-11-14 KST — ASTRA P100 재개/P88 검수 도구 인수인계 (필수 10항)

1. **목표·용도·확정 요구·기술:** 원래 7단계/상용 30k·60k·90k 8/20/30 템플릿과 동등한 오프라인 한국어 윤문까지 포함하는 Astra PDF Redesigner의 최종설계 100%를 목표로 재개. React19/TS5/Vite7/PDF.js/Electron NSIS, 로컬·데이터 보존 우선.
2. **완료·변경·결정 근거:** 새 P88 `scripts/owner-batch-acceptance.mjs`/단위 5개를 추가해 기존 STEP7 SHA·수동 7항목 검수의 5~10개 오프라인 집계를 제공. 실고객 PDF를 공개 CI로 보내는 방식 대신 로컬 해시 검사를 선택(비용/보안/유지보수 우위). 원문 파일과 저장 DB 변경 없음.
3. **테스트/미검증:** Node22.16.0 단독 합성 5 PASS/0 FAIL/0 SKIP, `node --check` PASS. 합성 PDF는 헤더만 있으므로 실제 파싱/육안/구매자 Win10·11, 새 SHA 전체 npm/Chrome/Edge/Windows hosted CI는 **검증 대기**. 이전 0db2acb5 CI는 과거 기준.
4. **단계·차단·중단:** P88 로컬 구현 및 단위검증 완료, 원격 CI/통합 검증 대기. 최종 100% 미달, 공식 최종완성률 UNASSESSED; 기존 엔지니어링 추정 85% 역사 수치 유지. [작업중]·RELEASE HOLD·미등록.
5. **오류·원인·시도·대안:** 신규 구현에서 현재 단위 실패 없음. 생략 없는 실고객 PDF 충실도·실기기 검증은 장비/원본이 없어 불가능; 대안은 사용자 소유 PC 오프라인 검수, 퍼블릭 GitHub에는 합성만. 반복 무의미 CI·원본 업로드 금지.
6. **GitHub/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, 최신 기능 SHA는 커밋 후 GitHub HEAD로 확인. 기준 parent `2c2bef5288257d9405bb912aa838ca071703e0ed`, Draft PR10 미병합. `scripts/owner-batch-acceptance.mjs`, `tests/owner-batch-acceptance.test.mjs`, `docs/commercial/ASTRA_OWNER_BATCH_ACCEPTANCE_20261114.md`. 허브 `hibi89/hackathon-command-center-2026@kmong-productization`, 마커 커밋 `e1bbafc8`.
7. **배포/환경:** 개발 `npm test`, `npm run build`, `npm run desktop:verify`, `npm run desktop:package`. Production URL/Vercel 해당 없음. Windows NSIS 이전 합성 PASS, 실제 고객 출시 NO-GO.
8. **원본/백업/보안:** STEP1 localStorage v1/STEP2 IndexedDB V2 및 모든 원본 설계·PDF 수정 금지, Git 이전 SHA 롤백. 실제 고객 PDF·절대경로 manifest·모델 가중치/GitHub 비밀 업로드 금지, CLI 외부 연결0/원본 읽기전용.
9. **다음 우선·승인:** 새 SHA CI 성공 확인; PRO20·BUSINESS30 고유 디자인/템플릿 저장·배치·브랜드 기능 구현과 회귀. 실제 한국어 GGUF/런타임은 사용자 승인·재배포권·성능을 먼저 확보(무단 다운로드 금지). 사용자는 원본 PDF 5~10개 준비, 실제 Windows10·11 설치·PDF 출력 육안 검수, 판매·지원·라이선스 최종 GO.
10. **갱신 기준:** 2026-11-14 KST, 현재 범위 로컬 Node22 합성 5 tests/소스 읽기·기능 브랜치 변경. CI·물리 고객 컴퓨터·사용권 최종 확인 안 됨. 문서 자체 HEAD는 새 커밋 후 재조회, 기존 증거 SHA `0db2acb5`로 새 코드 성공 주장 금지.

## 2026-11-13 KST — ASTRA 사용자 개입 필요 · 명시적 작업 종료 인수인계 (필수 10항)
1. **목표·기술**: 원본 PDF→로컬 구조화→검수→새 A4 출력의 Astra PDF Redesigner(React/TS/Vite/Electron/PDF.js). 최종 목표 95% 유지.
2. **완료 기능·결정 근거**: P85 이미지 페이지별 이동 위험, P86 전체 텍스트 읽기 순서 위험, P87 소유자 7항목 수동 검수·JSON. 최신 사용자 직접 지시로 개발 `[작업중]` 해제, `[사용자 개입 필요]`로 전환. **95% 달성 아님**.
3. **실제 테스트**: 기능 SHA `0db2acb5185445d342f97062a6962ec52a08a1fe` Linux/Chrome/Edge #43243819225 150/150 PASS 2/2 SUCCESS; Windows #43243819123 149 PASS/1 SKIP, desktop 16 PASS, 8/8 A4, NSIS 설치/제거/업그레이드 1/1 SUCCESS. 이번 상태 변경에서는 코드를 수정하거나 CI를 실행하지 않음. 실구매자 PC·실고객 PDF **미검증**.
4. **상태·중단 지점**: 엔지니어링 **85% 잠정**, 목표 **95% 미달**. **RELEASE HOLD**, 외부 판매 불가. 중앙 상태 **[사용자 개입 필요]**, 사용자 재개 지시 전 Astra 개발 대기.
5. **오류·시도·전환**: P82/P83 PDF.js constructPath 오분류 P84 수정 검증; P86 중간 Edge CDP 시간초과 후 P87 최신 성공. 재작업 반복 금지. 병목은 고객 PDF/물리 Windows/라이선스 승인 및 미구현 PRO/BUSINESS.
6. **저장소·브랜치·SHA·경로**: `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, 최신 기능 SHA `0db2acb51854`, 기존 문서 `deb87550fa48`; Draft PR #10 미병합. 해총 `hibi89/hackathon-command-center-2026@kmong-productization` 중앙 감사표 `docs/audits/KMONG_16_CURRENT_20261111.md`.
7. **배포·환경**: `npm test`, `npm run build`, GitHub Chrome/Edge 및 Windows Electron/NSIS 자동 검증. Production/Vercel 해당 없음; 상용 출시/배포 없음.
8. **원본·백업·인증 관리**: Git 커밋으로 기능·문서 이전 상태 복구 가능, 원본 PDF/IndexedDB V2 유지, 토큰·개인정보·유료 모델 다운로드/외부 데이터 전송/권한 변경 없음. 원본·main 및 타제품 변경 금지.
9. **다음 작업·승인·완료 기준**: 사용자가 원본 사용 허용 PDF 5–10개 제공·검수하고 실제 Windows 사용, 모델/폰트 재배포 권리 및 SKU/판매 승인. PRO20/BUSINESS30 고유 디자인 구현·실제 품질/서명 보강 후 최신 기능 SHA CI/실사용 검증, 그때 95% 판정. 그 전에는 Astra `[작업중]` 표식 재설정 금지.
10. **갱신 기준**: 2026-11-13 KST. 기능 검증은 2026-11-12 수행한 정확 SHA CI 근거; 현 상태 변경은 문서만. 문서 SHA는 기록된 GitHub 새 HEAD를 확인. 운영 원칙은 Astra 한정 사용자 최신 지시 우선.

## 2026-11-12 KST — ASTRA P85–P87 owner-acceptance handoff (10 required fields)
1. Goal/tech: Astra existing offline React19/TS5/Vite7/Electron44/PDF.js program, final 95% target, source/output PDF preservation first; existing 7-step blueprint controls scope.
2. Completed/choices: P85 same-index raster image draw count differences, P86 document-wide reading-order risk with identical token multiset, P87 transient 7-item visual checklist and safe offline JSON. Chose schema-preserving low-cost verification over unapproved new persistent theme/migration and falsely certifying PDF visual fidelity.
3. Tests: latest exact functional `0db2acb5185445d342f97062a6962ec52a08a1fe` Linux Chrome+Edge #43243819225 SUCCESS 2/2, Node150 PASS/0 FAIL and build; Windows #43243819123 SUCCESS 1/1, Node149PASS/1SKIP, desktop16PASS, 8/8 unique A4, NSIS install/remove and upgrade preserve assets PASS. Actual buyer-owned Windows/real customer PDFs NOT VERIFIED.
4. State: P85/P86/P87 functionality integrated and full synthetic CI green. Product engineering score 85 provisional, target 95 NOT reached, all tiers RELEASE HOLD, central Astra [작업중] must remain.
5. Failures/root/pivot: P86 #43243356071 Linux run FAILED on Edge CDP cold-start 60-second DevToolsActivePort timeout with attempts=0, not code test; browser fixed at no code change via fresh runner P87 Edge SUCCESS. P85 both runs success; no futile retry. Earlier P84 PDF.js constructPath root resolved and green.
6. Repo/branch/SHA: `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112` functional head `0db2acb5`, PR #10 still Draft open; paths `src/step7/{tokenParity,pdfPaintSignals,OfflinePdfReview}.ts[x]`, CLI `scripts/owner-pdf-source-output-review.mjs`, STEP7 tests, evidence docs. Hub `hibi89/hackathon-command-center-2026@kmong-productization`.
7. Runtime/deploy: Node22 npm test/build, hosted Chrome/Edge and Windows Electron NSIS test workflows. Vercel Production not applicable; no release or market upload.
8. Originals/backup/security: prior recoverable head `a8b1e9f00ab4ef3e658415b17029c288c49122c0` and git history, main/PR3/PR4 unchanged, no source PDF/customer upload, no IndexDB V2 schema migration, secrets, paid model/API or permission edits.
9. Next: verify owner-consented 5–10 real PDFs and buyer Windows10/11, decide and implement actual PRO20/BUSINESS30 unique layouts with schema compatibility approval, approved licensed Korean GGUF/model and rights, signed installer and sale policies; no 95 claim or marker removal before all objective gates.
10. 2026-11-12 KST, verification scope: GitHub exact source and run IDs/logs, Linux Node/browsers, hosted Windows NSIS, synthetic fixtures. Product docs updated here, CI result applies to function SHA `0db2acb5`; documentation HEAD must be read back.

## 2026-11-12 KST — ASTRA P84 red-to-green exact-source CI, 10-point handoff
1. Goal, requirements, tech: ASTRA offline React/TypeScript/Vite/Electron/PDF.js local source/output PDF redesign, user-requested 95 engineering readiness and no customer document transfer. Preserve original seven-stage design and approval boundaries.
2. Completed feature and reason: P82/P83 PDF.js vector comparison originally broken; P84 analyzes `OPS.constructPath` embedded paint opcode `argsArray[i][0]` rather than only top-level `OPS.stroke`. Browser GUI/CLI updated, test helper strengthened; alternative full-page pixel equivalence rejected for misleading fidelity claims.
3. Tests/proof: pre-fix 36bc Linux #43233430431 FAILED 146P/2F, Windows #43233430460 FAILED 145P/2F/1S, actual Edge warning 0 expected2. Corrected `ceef31d121d3d2a89448220326c89ecb1bc6066a`: Linux Chrome+Edge #43235958596 SUCCESS 2/2, Node 148P/0F, build, browser STEP7; Windows #43235958651 SUCCESS 1/1, Node147P/0F/1S, desktop16P, 8/8 A4, NSIS install/uninstall/upgrader PASS. Buyer-owned physical PC / real customer docs still unverified.
4. Done/ongoing/waiting: P84 source and synthetic GitHub CI verified; 85% provisional engineering stays; 95 target NOT MET, release HOLD. Hub product `[작업중]` MUST STAY.
5. Root/error/failed methods: P82/P83 assumed PDF.js standalone OPS.stroke; actual operators are constructPath, exposed by diagnostic 2bbadf; diagnostic removed after narrow fix. Earlier PR-only workflow query returned zero but push workflows did exist, avoid using that tool for coverage claims. Corrected read-only GitHub Actions REST GET.
6. Repository/branch/SHA/paths: `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, functional SHA `ceef31d121d3d2a89448220326c89ecb1bc6066a`; changed helper `src/step7/pdfPaintSignals.ts`, UI `src/step7/OfflinePdfReview.tsx`, CLI `scripts/owner-pdf-source-output-review.mjs`, two tests. Draft PR #10, main untouched. Hub `hibi89/hackathon-command-center-2026@kmong-productization`.
7. Run/deploy: Node22 `npm test`, `npm run build`, `npm run desktop:verify`; GitHub Linux Chrome/Edge and hosted Windows Electron installer. Vercel/Production N/A, no sales or production deployment. Hosted Windows is not buyer Windows.
8. Original/backup/auth: P83 pre-fix source 36bc and P84 parent 2bbadf remain recoverable in Git history; original owner PDFs, IndexedDB V2, secrets, paid APIs, fonts/models, permissions untouched. No destructive reset.
9. Next priority/criteria: customer-approved 5–10 actual PDF layout/readability checks; native buyer Windows10/11 and license/redistribution acceptance, PRO20/BUSINESS30 original layouts and approved offline Korean LLM; no claim of 95 until independently proven. No scope reduction or model downloads without explicit owner consent.
10. Updated 2026-11-12 KST. Verified exact source GitHub commit, 2 successful push workflows with 3 total jobs and raw logs, tests, installer and main/PR state; documentation commit SHA to verify after write.

## 2026-11-12 KST — ASTRA P82/P83 vector stroke handoff (10 required)
1. Goal/tech: Raise local PDF redesign product to verified 95%, React19/TS5/Vite7/Electron44/PDF.js, unchanged user-approved offline scope.
2. Features/design: compared pixel raster verification (high cost and misleading for redesign) vs count-only vector stroke painting (chosen). P82 flags missing table border strokes despite equal text; P83 flags cross-page displacement despite equal global strokes.
3. Testing: exact Git blob source 0399a2c8 and test adf5c769 verified locally, Node22.16 scoped 3PASS/0FAIL, standalone tsc PASS. Synthetic text-identical PDF 4 vs 3 vector strokes checked by PyMuPDF. Original npm test/build/Chrome/Edge/Windows full PDF.js NOT VERIFIED.
4. Status: P82/P83 committed, current 85% provisional, P95 not achieved, RELEASE HOLD, product [작업중] preserved.
5. Errors/blocker: no full private repository mount/checkout available, GitHub fetch_commit_workflow_runs reports 0 PR runs and combined status empty; historical successful P75 CI not latest source evidence. No assertions about real renderer or device acceptance.
6. GitHub: hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112 latest code 36bc458da322ebb77b9b48190857112b637ea7bf, source parent 31304eae, Draft PR10 unmerged. Hub hibi89/hackathon-command-center-2026@kmong-productization; scoreboard must be checked at latest HEAD before edit.
7. Runtime/deploy: Node22 npm test/build/desktop:verify, Chrome/Edge smoke, Windows NSIS install/upgrade; Production Vercel N/A, no deployed/paid service or release.
8. Source/backup/security: base 6eacf9f7 and P82/P83 Git history recoverable; customer PDF/IndexedDB V2 and original feature owner data untouched. No secrets, external document upload, fonts/models, permission changes.
9. Next: full exact-SHA CI, buyer-owned PDF consent and visual/table acceptance; only with explicit authorization licensed model/PRO20/BUSINESS30 commercial gate. Do not release or remove [작업중] before verified 95%.
10. Updated 2026-11-12 KST; limited verified scope exact helper/test blobs, synthetic PyMuPDF, GitHub source diffs and docs. GitHub doc HEAD readback pending.

## 2026-11-12 KST — ASTRA P79–P81 handoff (10 required fields)
1. Goal/technology: ASTRA locally processed PDF redesign to 95%; React19/TypeScript5/Vite7/Electron44/PDF.js; authorized current feature-only code and tests, no paid/external features.
2. Features/decisions: P79 selected cancellation via AbortController/PDF.js over mere busy reset; P80 preserved numeric sign over mere digit count; P81 prechecked token bounds and loops instead of catching stack overflow. Original V2 and docs preserved.
3. Tests: exact Git helper blob `4513d760` SHA match, Node22 isolated tests 11PASS/0FAIL, 1000 sign fuzz, 300001 token controlled limit, TypeScript `tsc` standalone PASS. Full app npm/build/browser/Windows/CI latest SHA NOT VERIFIED.
4. Status: new functional code completed, engineering 85% provisional, P95 not met, release HOLD, ASTRA [작업중] marker kept.
5. Error/attempt/pivot: old token spread failed with actual RangeError; changed to bounded loops then 11/11 PASS. Browser changed-file stale busy bug fixed in source and synthetic browser regression added but not run. GitHub workflow query reports no PR-triggered runs and empty status (not CI result); previous container git DNS unavailable, no unproductive repeat.
6. GitHub: `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`; P79 `3739ede47ce9361073ac1939e44599fa7d734a52`, P80 `c2003ced478a379360e4ed9ec38982c9a650d49c`, latest code `d417eb91e31f5781fded65120bcfc363a4ea97c2`; Draft PR10 unmerged, main unchanged. Hub `hibi89/hackathon-command-center-2026@kmong-productization`.
7. Deployment: Node22 npm test, npm run build, npm run desktop:verify plus Chrome/Edge GitHub Actions & Windows NSIS workflows; actual Vercel Production N/A, no release or owner Windows run.
8. Originals/security: original feature parent `736c2930` recoverable, no customer source PDFs or IndexedDB V2 edited; no secrets, models, real consumer uploads or permission changes; GitHub history preserves rollback.
9. Next priority/completion: run exact latest SHA full CI including actual browser and Windows, add owner-consented 5–10 PDF acceptance and physical buyer device check, obtain necessary rights/design/model decisions; leave [작업중] until 95 proven, no auto-unmark at switch/end.
10. Updated 2026-11-12 KST; source/test diff + exact core blob and isolated local tests verified, full browser/Windows/external acceptance NOT VERIFIED. This handoff documentation commit SHA should be read back.

## 2026-11-12 KST — ASTRA P78 within-page order safety continuation (10 points)
1. Goal / scope: 95% Astra Kmong product using existing local React19/Vite7/TS5/Electron44/PDF.js, no external PDF upload, OCR, commercial rights bypass.
2. Chosen design: A full semantic/PDF layout equivalence would overclaim visual/OCR truth; B linear advisory token order count with multiset guard chosen. Reports only risk count; keeps original contents unchanged. Previously P76 detected page swaps and P77 prevented error cleanup deletion.
3. Tests: exact Git blob `f249d24dcaad06d9050e3ab470c39c96707074d1` local SHA match; Node22.16 5/5 deterministic unit PASS, 300 fuzz cases + 300k token stress PASS, TypeScript tsc standalone PASS. Three integration tests added but exact new-SHA full npm/PDF.js/browser/Windows not yet executed; no claim of CI pass.
4. Status: P78 code committed; current engineering score 85% provisional, 95 NOT achieved, SALE HOLD, work marker maintained.
5. Failure/blocker: full private/public checkout unavailable from local container due github.com DNS; existing connector provides per-file source but no comprehensive repo runtime. New SHA commit statuses empty/PR workflow list empty, not proof either way. Don't repeat destructive or meaningless CI retries.
6. GitHub: `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, new code SHA `071978729197c671f2a41b0e1ce6ad838ce24f8b`; exact six paths checked. Draft PR #10 unmerged; pre-change SHA `1151a0d6` reversible; hub `hibi89/hackathon-command-center-2026@kmong-productization`.
7. Deployment/run: Node22 npm test/build/desktop:verify + Chrome/Edge/Windows workflows; no Vercel Production, no release, no billing or permission changes.
8. Backup/auth/data: all customer PDFs and local V2 unmodified; only synthetic test fixtures, no API keys, no new data uploads; Git history is rollback source.
9. Next steps: exact commit full npm/build/Chrome/Edge/Windows tests; real owner-consented 5–10 PDF visual acceptance and PRO20/BUSINESS30 design/approved local Korean model/rights support where required. Keep [작업중] until actual target verified.
10. Timestamp: 2026-11-12 KST; scope GitHub source diff/blob, isolated local TypeScript & stress regression, CI status queries; documents based on functional SHA; documentation-only HEAD should be read back after commit.

## 2026-11-12 KST — ASTRA P76/P77 partial development, P95 not certified (10 points)
1. Goal/tech: achieve Astra Kmong 95%; existing local React19/Vite7/TS5/Electron44/PDF.js offline PDF redesign. No owner approval for external services, OCR, LLM, schema changes or sale.
2. Work/design: A inode-check-before-output-delete still TOCTOU; B no pathname removal after write failure, HOLD outputs, selected. P76 now flags page-local text movement with matching global tokens in CLI/GUI; P77 keeps replaced owner files after second output write fails.
3. Proof/tests: GitHub changed file diff exactly 2+4, source SHA 047d48372f4e5c997bf6f24683a90cd05c506873; exact Git blob tokenParity SHA 6a9ebc5c3f08ebca0e567cf0d920803141d0eb46 Linux Node22.16 6/6 assertions pass. Original complete npm/build/browser/Windows CI NOT VERIFIED at new SHA. P75 historic Chrome+Edge+Windows CI successful only for SHA 3b3c6f73.
4. State: implemented fixes, 85% provisional remains, target95 NOT MET, sale RELEASE HOLD, no customer release.
5. Error/cause/pivot: previous post-error pathname deletion may remove a concurrently replaced owner artifact. Removed cleanup rather than adding race-prone inode retry. GitHub workflow-run connector only lists PR runs and yielded none; combined status empty, inconclusive. Local full git checkout DNS failure; do not repeat identical network attempt.
6. Repository/branch/SHA: hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112, code commits 702032f0 and 047d4837, original branch parent dc69f7e7, main and Draft PR10 not merged; modified CLI/UI/token helper and 3 tests.
7. Runtime: Node22 npm install --no-audit --no-fund; npm test; npm run build; npm run desktop:verify; hosted browser/Windows workflows. Vercel/Production not applicable; no deploy or billing change.
8. Originals/backup/secret: baseline dc69f7e7 and Git history support restore. Original customer PDFs, local IndexedDB V2, source documents, assets, permissions and secrets untouched; synthetic fixtures only.
9. Next: exact-SHA full CI, Chrome/Edge browser and Windows NSIS; 5–10 consented buyer PDFs, PRO20/BUSINESS30 designs, local LLM redistribution/license, physical Windows and legal sale gates. No 95/100 label without objectively satisfied criteria.
10. As of 2026-11-12 KST: remote code commits and diff checked, component exact-blob local execution checked, full CI and physical customer acceptance NOT VERIFIED. Documentation commit SHA readback pending.

## 2026-11-12 KST — ASTRA P71–P75 85% provisional engineering, exact-SHA cross-platform CI, 10-point handoff
1. Objective/confirmed scope/technology: user directed urgent remaining <85 Kmong product excluding REA_APP and others in parallel; selected Astra PDF Redesigner starting70% provisional. React19/Vite7/TypeScript5/Electron44/PDF.js, local-only source PDF→redesign→PDF save; original 7-step roadmap with no OCR/models/network grants.
2. Delivered/decisions: alternative A trusting A4/marker as equivalence rejected; B independent source/output PDF actual selected-text tokens, numeric/duplicates/raster/A4 risk, optional original STEP7 manual review receipt+project backup+output SHA chain and offline HTML/JSON chosen. New `scripts/owner-pdf-source-output-review.mjs`, `src/step7/tokenParity.ts`, `src/step7/OfflinePdfReview.tsx`; only minimal Root/Workspace route/button, no schema/user data changes. Tests `tests/owner-pdf-source-output-review.test.mjs`, `tests/step7-token-parity.test.ts`, `tests/step7-pdf-review-browser.mjs`.
3. Exact tests: code SHA `3b3c6f73a11d1791076eb5a860f14f87691844b5`; [CI #43118808792](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43118808792) Chrome+Edge jobs 2/2 SUCCESS, Node134 PASS/0 FAIL, build, actual Chrome/Edge PASS STEP7 PDF PAIR. [Windows #43118808750](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43118808750) 1/1 SUCCESS, Node133 PASS/1 SKIP/0 FAIL, desktop16 PASS, packaged EXE/unsigned NSIS install/uninstall/upgrade PASS; no customer physical Win10/11 or original exact pixel/fidelity/legal review.
4. Done: engineering internal scope 70→85% provisional (+5 SHA chain,+4 UI PDF-to-PDF,+3 offline HTML/JSON,+3 measured cross-OS regression). P1–5 preserved; P6 no autonomous search; P7 no OCR. Buyer sale all three SKUs NO-GO, RELEASE HOLD. Draft PR #10 unmerged.
5. Failure/root and retry: first code SHA `a27347dcc0b48cdf2bd5857aec260b7bd5f76d4f` CI failed because `Array.map(path.resolve)` passes index as `paths[2]` argument. Minimal lambda fix at `2b5a000fee5f03f486925f1c2112025215c583e6` verified Linux browser/Windows full SUCCESS; UI SHA `d5b1cd12...` also fully green; final image parity/sha display `3b3c6f73a11d1791076eb5a860f14f87691844b5` full green. Do not repeat old error, never claim exact original-pixel clone.
6. Source/branch/SHA/main: `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`, exact functional `3b3c6f73a11d1791076eb5a860f14f87691844b5`; parent base `feature/astra-p52-to-p70-20261111@8f987462dc7c2edd02303ec32c9813340170860a`, main untouched. Draft [PR #10](https://github.com/hibi89/astra_pdf_redesigner/pull/10). Paths per item2 plus `.github/workflows/ci.yml` and `windows-desktop.yml`, `package.json`, `docs/commercial/ASTRA_P85_PDF_PAIR_REVIEW_20261112.md`, STATUS/HANDOFF. Hub Kmong roster sync separately verify latest remote.
7. Runtime/Production: `npm install --no-audit --no-fund && npm test && npm run build`; Electron Windows via `npm run desktop:verify`, unsigned NSIS. No Vercel, API/cloud/deploy applicable. Hosted CI Windows is not owner's physical PC. 30MiB source/output, 50 pages, bounded token and private file; no model download.
8. Originals/backup/auth: Existing STEP1 localStorage v1, STEP2 IndexedDB V2 and main/integration/old PR3/4/9 intact, no original PDF/customer data uploaded. New feature branch parent supports Git revert, no force pushes, source files read-only, owner outputs new filenames only. No credentials/PII/Font license originals collected.
9. Next priority/completion: acquire explicit owner approval before real customer PDFs/external search/model downloads/paid services/licensing/merge/publish. Real owner native Windows10/11 with consented 5–10 PDF docs, table/image/font layout/page-by-page inspection, PRO 20 and BUSINESS 30 distinct designs, local Korean LLM license/capability, support/licensing/legal signage and separate per-SKU release. Do not score 100% or claim fidelity certification from token match.
10. Updated 2026-11-12 KST. Source test SHA `3b3c6f73a11d1791076eb5a860f14f87691844b5`, browser CI #43118808792, Windows CI #43118808750 all terminal SUCCESS. Documentation SHA must be verified after writing; exact programmatical identity checked with GitHub API.

## Current handoff — remote `9e131b2` (2026-10-29)

1. Repository `hibi89/astra_pdf_redesigner`, branch `integration/astra-commercial-core`; remote HEAD `9e131b296bd17a75595769a36d9ebfc954e3c0c9`. Draft PR #9 remains open/unmerged; do not merge.
2. This continuation added STEP3 page progress and actual PDF.js abort support; multi-item manual recovery now keeps source coordinates transiently for ordering and strips them from persisted project data. It also hardened installed STEP2/3 renderer readiness checks and added browser source-navigation regression.
3. Local checks at `9e131b2`: unit tests 90/90, production build, desktop bundle check and 16 desktop static acceptance tests PASS. Windows exact-SHA #40857223514 and browser/STEP1/2 #40857223214 were still running at last check. Windows #40856599632 (`db461dc`) SUCCESS; both Windows/STEP1-2 at `52c18b0` and `2291a85` SUCCESS.
4. Current seven-stage estimate remains about 52%, below 80. Approval-gated work: persistent custom style presets require schema/migration approval; URL reference/persistent collections and STEP6 search require external-service approval; OCR/model download are explicitly excluded. Complex table/multicolumn reconstruction and real customer PDF/physical buyer-PC acceptance remain.
5. Preserve the old isolated clone `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-work-continued`: it contains uncommitted/local-only results. The newer isolated worktree is `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-remote-current`; remote code is committed and pushed. Clean only the generated new worktree when final CI/status verification is finished; never touch the original project.

## 2026-10-29 — STEP5 PDF typography proposal (verified code `c160e36`)

- Branch `integration/astra-commercial-core` code SHA `c160e3667fc249995daf1b00d8338a0dacd2b7cd`; Draft PR #9 remains open and unmerged.
- STEP5 now uses the selected PDF page's embedded median font size normalized by page width to suggest a small/medium/large editable body size. When the PDF has no selectable text (including scans), the existing pixel-density proposal is retained. OCR is not used. User can adjust the preview and apply or cancel it.
- Installed Windows acceptance verifies the actual PDF analysis UI and proposal selection, full IndexedDB V2 record equality through analysis and cancel, and the rest of the installed PDF/design/upgrade regression. Exact-SHA Windows [#40847149721](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40847149721) and Chrome/Edge [#40847149615](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40847149615) SUCCESS.
- Local `npm test` 88/88 PASS, production build PASS, `desktop:verify` 16/16 PASS, acceptance helper syntax and whitespace checks PASS. Native Electron GUI was not directly run locally; hosted Windows installed-app E2E passed.
- Roadmap remains approximately 52%, below the requested 80%. This is a small STEP5 feature increment, not a test-count uplift. STEP3 real user PDFs (5–10) and buyer PC acceptance remain unverified; STEP4 durable custom style save/reuse needs schema approval; STEP5 URL input and STEP6 search are external service work outside current approval; STEP7 OCR is excluded.
- No OCR, paid API, model download, schema change, merge, deployment or sale. Original local project and user data remain untouched. Isolated working clone retained pending explicit approval because automatic review rejected its deletion due divergent local history.

# 최신 인수인계 — STEP3/4 continuation (`602c0a4`)

- 원격 브랜치 `integration/astra-commercial-core` HEAD `602c0a410b7f2146717569b39019b152b51e2b8d`, Draft PR #9 미병합.
- Chrome+Edge [#40843605820](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40843605820), Windows installer [#40843605882](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40843605882) exact-SHA SUCCESS. Windows M09-D checks cancel/reselect, late completion after document switch, no stale URL/review, and full V2-store equality. STEP4 actual side-by-side candidate-only PDF output, apply/undo and 8 A4 presets all passed.
- Local `npm test` 87/87, build, `desktop:verify` 15/15 and whitespace/syntax checks PASS. Direct local Electron launch SKIP because Electron's binary download failed in the restricted environment; installed Windows hosted acceptance passed.
- Seven-step completion re-estimated at about 52%, below 80%. Continue from actual feature gaps; do not count tests as product completeness.
- Remaining: broader real-PDF diversity and reading-order/table handling, custom saved styles (schema change needs separate approval), URL/reference search integration (external access needs approval), and customer/physical buyer-PC acceptance. No OCR, external service, schema change, merge or deployment authorized.
- The isolated checkout `C:/Users/haein/Documents/Codex/astra_pdf_redesigner-work-continued` has local commits/worktree changes and was preserved after automatic approval review rejected its deletion because local HEAD differs from remote; do not delete until explicitly approved.

# HANDOFF — Astra PDF Redesigner
## Historical checkpoint — continuation at `b640c3f`

1. Branch `integration/astra-commercial-core`, current remote code SHA `b640c3fc1e654edccd5c4234fa31810e0105e993`; PR #9 remains Draft/open/unmerged. Original local project untouched. Current isolated clone: `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-work-continued`.
2. Current STEP3 implementation links omitted text snippets to estimated source coordinates, allows exact manual recovery, paginates long warning lists, and preserves short numeric fragments with numeric-token boundary/count checks. These fields remain transient; no project schema change. The prior `추출 원문 복원` flow remains undoable with renewed review consent. Feature commits: `df4e473`, `d3a7d17`, `4d4349e`, `484d43f`, `d4f2ecd`.
3. Local checks at latest code: `npm test` 86/86 PASS, build PASS, `desktop:verify` 15/15 PASS, targeted STEP3 structure tests 14/14 PASS, syntax and diff check PASS. Focused synthetic-PDF E2E passed Chrome and Edge for missing-text source location, exact manual recovery, consent revocation, and no premature document save. Direct full `step3-browser.mjs` remains unverified locally because `pdfimages` is unavailable.
4. Exact-SHA workflows for `d4f2ecd`: Chrome+Edge #40837315314 and Windows #40837315265 SUCCESS. The first `29b2c7d` API-created blob failed Windows syntax because transmission was truncated; corrected source is at `b640c3f`, with Chrome/Edge #40838475198 and Windows #40838475306 SUCCESS. The Windows acceptance extension includes omission location/recovery before manual correction and native PDF output. No local Windows Electron GUI run.
5. Overall 7-step estimate remains ~51%, not 80%. No completion uplift for test quantity. Authorized STEP3/4 gaps addressed in code include source block/text omission review and manual recovery, all built-in design compare/apply/undo and exported PDF audits. Remaining scoped blockers include real customer PDF acceptance and buyer physical Windows GUI/print acceptance; saved user presets require schema/migration approval. STEP5 URL/persistent reference library, STEP6 internet search/integrations, OCR/model download/external paid service, merge/deployment/sale are not authorized.
6. Local clone contains only the separate local documentation commit beyond the code commit; cleanup must target only this isolated clone after remote exact-SHA verification. The original workspace must remain untouched.

## 2026-10-29 — STEP7 Electron PDF output preflight (historical checkpoint)

1. Current base: `integration/astra-commercial-core` at `7c098fb1e923e0990ed50084b07568e7357a85d3`; isolated clone `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-work-audit`.
2. Added `desktop/pdf-output-audit.cjs`: independently opens generated bytes through bundled PDF.js and reports non-A4 pages, probable out-of-page text, rotated text with skipped geometric validation, and pages with no selectable text/raster (possibly blank or vector-only). Regular Electron export shows a continue-save/cancel warning before Save As/write. User may cancel without creating a file.
3. STEP2 output now supplies session-only markers sampled from each visible title, section, block and image caption. PDF.js checks them against actual output text; a missing marker is added to the save warning. Main IPC bounds marker count and payload. It does not store project content. The output comparer and marker builder have synthetic PDF and pure model tests.
4. Installed Windows synthetic PDF acceptance runs the same structural audit and requires the actual two-page A4 text/raster fixture to pass. Local checks on the marker follow-up: `npm test` 79/79, build PASS, `desktop:verify` 15/15, CJS syntax and diff checks PASS.
5. CI audit: SHA `7c098fb` Linux Chrome and Edge failed after their functional STEP5 assertions passed, because Chromium profile cleanup raced with an `ENOTEMPTY` directory. The cleanup now retries and logs a warning instead of failing the feature. Windows run #40829254809 was still in progress at last check. Recheck exact-SHA CI after push once, then continue regardless of its state. No OCR, network service, model download, persistence schema change, merge, or deployment. Overall estimate stays about 48%; 80% remains unmet.

## 2026-10-29 — STEP3 extraction quality and STEP5 local reference analysis (current work)

1. Branch `integration/astra-commercial-core`, isolated clone `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-work-step5`; first STEP5 commit `dab6d9ae0c4401e8e19284a3811f6d6e1a688ba6`, PDF typography extension `b0222e97bb96dd92e376bebe23c73d87081f4ab0` (pushed).
2. Added local PNG/JPEG/WebP + selected PDF page analysis, image/analysis cleanup, supported `DesignSettings` editing, A4 transient preview, apply/cancel/exact undo. Current heuristic reads pixels only. No OCR, external request, source persistence, schema change or document content edits.
3. PDF references use embedded selectable text (no OCR) to estimate median font size, largest-fragment ratio and largest-fragment alignment. STEP3 quality signals detect replacement/private-use glyphs and out-of-page text and surface page-local warnings while preserving editable text; committed at `1b178a60fec1d14beafe27b0e6a8a9eff3db91e3`.
4. Latest local checks: `npm test` 74/74 PASS, build PASS, `desktop:verify` 14/14 PASS. Dedicated `tests/step5-reference-browser.mjs` passed Chrome and Edge for image/PDF page analysis, selectable text metrics/OCR disclosure, preview/cancel, apply/undo, content invariance and browser PDF output. Broad `step2-browser.mjs` not locally completed because Poppler `pdftotext` is unavailable.
5. Exact-SHA workflows for `dab6d9ae0c4401e8e19284a3811f6d6e1a688ba6` are running (Chrome/Edge and Windows); continue work without idle CI waiting. STEP5 remains partial (no URL input, persistent reference/style library, broad quality validation). Overall ~48%, 80% unmet. Real customer PDFs and buyer physical PC acceptance remain open.

## 2026-10-29 — Latest Windows upgrade CI completion

1. Latest test code SHA `12213f89381ad2f90102f4db1e4fbb4e9a283edb`. Change only wraps STEP2 installed renderer acceptance evaluation to surface name/message/stack on rejection.
2. Exact-SHA Windows run [#40824530246](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40824530246) **SUCCESS**. STEP2 baseline document+PNG generation, PDF verification, 0.1.0→0.1.1 in-place upgrade preservation, and upgraded uninstall all passed. Prior run #40823559986 had one non-reproducing baseline-generation failure (`ASTRA desktop startup failure: {}`).
3. STEP3 installed import/source/manual-recovery/A4 output, STEP4 compare/apply/undo and eight-layout actual PDF audit, and M09-D installed cancel/reselect/stale-result protection also passed in #40824530246.
4. Local Node tests 68/68, build, desktop verify 14/14, script syntax, and diff checks passed. Actual customer PDF 5–10 sample and physical print acceptance remain open. Overall roadmap estimate stays about 45%; no OCR, storage schema change, external services, main merge, or deployment.

## 최신 인수인계 — 2026-10-29 STEP3 Electron 원본 Blob 렌더 결함

1. **브랜치/코드:** `integration/astra-commercial-core`, 기능 SHA `a9404c0743470147dc7cd9228e629787f9ae347f`, PR #9 Draft/unmerged. 별도 임시 clone만 사용했으며 main과 기존 로컬 프로젝트는 변경하지 않았다.
2. **진단과 수정:** Windows installed E2E source text location에서 canvas가 300×150 기본값으로 남고 경고가 `Failed to fetch`였다. Electron custom `astra:` renderer가 original Blob URL을 fetch하지 못한 것이 원인. STEP3 검수와 STEP2 원본 대조에 원본 Blob을 직접 PDF.js로 전달하도록 수정했으며 저장 schema에는 반영하지 않는다.
3. **검증:** 로컬 `npm test` 68/68 PASS, build PASS, desktop verify 14/14 PASS, acceptance node syntax와 diff check PASS. Local Electron smoke는 Electron binary 다운로드 `fetch failed`로 SKIP.
4. **Windows installed CI:** #40823559986에서 STEP3 source location, manual recovery marker가 든 A4 native PDF, STEP4 compare/apply/undo, eight-layout actual PDF 8/8, M09-D cancel/reselect/stale result ignore PASS. Workflow later failed in separate 0.1.0→0.1.1 baseline data-generation step with Electron startup failure `{}`. This later failure does not cover or invalidate the completed STEP3/STEP4 acceptance segment.
5. **Browser CI:** `a9404c0` #40823560131 SUCCESS; exact-SHA Chrome and Edge validations completed after Blob prop change.
6. **남은 단계:** actual user PDFs 5–10건과 physical print 검수. 전체 7단계 약 45%, 80% 미달. STEP5 미구현, STEP6 승인대기, STEP7 안정화 미완료. OCR, external services, schema change, merge/deploy 금지.

## 최신 개발 인수인계 — 2026-10-29

1. **목표와 승인 경계:** STEP3 기존 PDF 검수와 STEP4 디자인 비교/적용/취소 보강. OCR, saved-style schema/migration, 유료 API/모델 다운로드, merge/deploy는 제외. 원본 로드맵과 사용자 데이터는 보존한다.
2. **완료 기능:** STEP3 각 추출 텍스트 블록에 `원본 위치 보기`를 추가했다. 해당 블록의 PDF.js 원본 페이지를 그려 추정 좌표를 강조하고 닫기 동작을 제공한다. 검수 초안의 메모리 상태만 사용하며 DB 구조/내용·원본 PDF 바이트는 변경하지 않는다.
3. **저장소와 SHA:** `hibi89/astra_pdf_redesigner`, `integration/astra-commercial-core`, PR #9 Draft/unmerged. 기능 커밋 `9ade72efb957d4399a2d184f1aafc39472b576dd`, 원격 푸시 완료. 이번에 main, PR #3/#4, 배포는 건드리지 않았다.
4. **로컬 검증:** Windows Node 24 `npm test` 67/67 PASS, `npm run build` PASS, `npm run desktop:verify` 14/14 PASS, whitespace diff check PASS. CI에는 page-2 source anchor E2E가 추가됐다.
5. **Windows 직접 실행 결과:** 실제 Chrome E2E가 CDP WebSocket 연결 시간 초과로 앱 URL을 열기 전에 종료되어 해당 E2E는 실패/미검증이다. Electron 바이너리 다운로드는 성공했으나 `npm run desktop:smoke`가 종료 코드 1과 로그 없이 종료; 직접 Windows Electron UI 검증도 미검증이다. 코드 결함으로 분류하지 않는다.
6. **원격 CI:** exact-SHA Chrome/Edge run [#40820434613](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40820434613), Windows installer run [#40820434701](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40820434701)은 마지막 확인 당시 in progress였다. 완료 결과는 해당 run 상태를 재조회해야 하며 PASS로 선기록하지 않는다.
7. **완성률 재평가:** 원본 7단계 대비 약 44% 유지(STEP1/2 완료, STEP3/4/7 부분, STEP5 미구현, STEP6 승인대기). 이 한 가지 사용성 보강을 단계 전체 완료율 상승으로 계산하지 않는다. STEP4 저장형 스타일 재사용은 schema 승인이 필요하다.
8. **남은 작업:** STEP3 실제 텍스트 PDF 5–10건을 사용자 동의하에 로컬 수용시험; buyer physical Windows GUI/print acceptance; STEP4 저장형 스타일 라이브러리/프로젝트 호환은 저장 schema 승인이 필요; STEP5 로컬 레퍼런스 분석은 별도 기능 단위 설계 가능; STEP6 검색 연동은 외부 서비스/데이터 경계 승인 필요; STEP7 표/다단·넘침/부분수정 확대. 판매/배포는 여전히 NO-GO.
9. **임시 작업:** 개발 clone은 `C:\Users\haein\Documents\Codex\astra_pdf_redesigner-work`에 있으며 원격 푸시 확인 전에는 보존한다. 기능 커밋 외 미커밋 앱 변경 없음. CI 완료를 확인한 뒤 이 생성 clone만 정리할 수 있다.

# 최신 인수인계 — 2026-10-29 STEP3 기능 보강

1. **저장소/상태:** `hibi89/astra_pdf_redesigner`, `integration/astra-commercial-core`, PR #9 Draft/unmerged. 최신 코드 SHA `ef4eb63df686157196a96079df0680f701bedc6c`. 원래 저장소가 아닌 별도 임시 clone에서 작업했다.
2. **완성 기능:** 추출 블록·복원 이미지에서 PDF 원본 페이지 및 근사 위치로 이동, 선택 위치 자동 노출과 텍스트/이미지 대조 정보 표시. 누락 텍스트 직접 추가·수정·삭제·순서 조정, 8단계 편집 undo/redo와 명시적 원본 확인 동의 갱신, 빈 포함 블록 저장 거부. Electron 설치형 회귀가 수동 복구 문구를 IndexedDB 프로젝트의 A4 미리보기 및 실제 PDF에 확인하도록 확장했다.
3. **결함 수정:** 브라우저/Windows acceptance가 React 렌더 전 수동 블록을 읽던 테스트 race를 await하도록 보정. 원본 위치를 빠르게 바꿀 때 이전 PDF.js 렌더 취소가 완료되기 전 동일 canvas에 재진입하지 않도록 렌더를 직렬화했다.
4. **검증:** 로컬 Node 68/68 PASS, TypeScript/Vite build PASS, desktop verification 14/14 PASS, `git diff --check` (`core.whitespace=cr-at-eol`) PASS. 직접 Windows Chrome CDP 및 Electron smoke는 환경 실패로 미검증. 합성 PDF 외 실제 고객 문서/물리 인쇄 미검증.
5. **CI 정확 상태:** `a850518` #40821833788 (Chrome/Edge)·#40821833694 (Windows), `1878a6d` #40822018994·#40822018950, 최신 `ef4eb63` #40822093641·#40822093651은 마지막 조회 시 in_progress. #40821335082 browser failure는 React 렌더 대기 부족이며 고쳤다; 동일 SHA의 Windows #40821335099 success. 이전 원본 탐색 `9ade72e` browser/Windows #40820434613/#40820434701 모두 success. 최종 보고 전 최신 두 run을 재조회한다.
6. **보존·승인 경계:** 사용자 데이터, V2 저장 schema, 8개 layout, `main`은 변경하지 않았다. OCR, 모델 다운로드, 외부 서비스/비용, merge/deploy 금지. STEP4 저장형 사용자 프리셋은 저장 구조 변경 승인이 필요하다.
7. **완성률 및 잔여 작업:** 보수적 7단계 추정 약 45% (STEP3 수동 복구와 원본 위치 검수를 실제 브라우저 통합 기준으로 약 1%p 반영; Windows installed source-location timeout과 고객 PDF 미검증 때문에 80% 미달). STEP3 복잡 표·다단/장문과 실제 PDF 5–10건 수용, STEP4 저장형 프리셋 요구·schema 승인, STEP5 레퍼런스 적용, STEP6 외부 검색 승인, STEP7 통합/출시 수용이 남는다. 인증된 고객 PDF 수용 약 2–4시간(사용자 자료·피드백 대기 별도), STEP4 preset schema+UI+호환 검증 약 1–2일, STEP5 수일~수주, STEP6 승인 후 별도 범위 산정, STEP7 안정화 1–2주 이상. 판매/Production NO-GO.
8. **안전한 종료:** 임시 작업 폴더는 모든 변경을 remote exact SHA와 대조하고 clean 상태임을 확인한 뒤에만 제거한다. 원래 로컬 프로젝트는 건드리지 않는다.

## 최신 인수인계 — 2026-10-27 19:18 KST

1. **목표·승인:** 원본 최초 설계 `docs/ASTRA_ORIGINAL_ROADMAP.txt`, `docs/BLUEPRINT.md`, `REQUIREMENTS.md` 전체를 구현한다. STEP3 PDF 가져오기는 승인 상태이고 사용자는 STEP4 디자인 비교·적용·취소 개발도 승인했다. OCR은 별도 승인 전 제외하며, 저장형 사용자 스타일 스키마는 별도 승인 전 변경하지 않는다.
2. **이번 구현:** 기존 8개 디자인을 보존했다. 같은 문서 전체를 한 번에 하나씩 8개 레이아웃으로 바꿔 보는 임시 비교, 선택 디자인 적용, 직전 디자인 취소/복원을 추가했다. 기존 `DesignSettings` 필드만 사용하고 저장 schema/IndexedDB store를 추가하지 않았다. 콘텐츠·이미지·원본 PDF를 변경하지 않는다.
3. **코드·테스트 기준:** 기능/테스트 SHA `273db07ae851e8d2420da39688b5fa84641ce65d`, 브랜치 `integration/astra-commercial-core`, Draft PR #9 open/unmerged. 이 문서 커밋이 PR HEAD를 전진시키므로 실제 최신 PR HEAD는 GitHub 조회를 기준으로 한다.
4. **Chrome·Edge:** [Actions #40486509235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509235) exact-SHA SUCCESS 2/2. Node 22 `npm test` 67/67, `npm run build` 성공. 실제 비교 출력 PDF와 저장된 레이아웃 PDF가 A4/텍스트·이미지/레이아웃 기준을 통과했고, 8개 테마 A4 출력이 고유 배치를 유지했다.
5. **Windows/M09-D:** [Actions #40486509335](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40486509335) exact-SHA SUCCESS. Installed Electron 비교·적용·취소 후 디자인/본문 복원, 8개 실제 A4 PDF 8/8, M09-D 취소·대체·stale 결과 차단·V2 store 보존, NSIS 설치/제거, 0.1.0→0.1.1 STEP2 문서/PNG 유지 확인.
6. **설계 방식:** 고정 CSS 변형(A)은 빠르고 기존 데이터 호환에 부담이 없지만 조합 증가 시 중복과 유지보수 위험이 크다. 기존 `theme/accent/font/textSize` 토큰과 제한 프리셋(B)을 확장하는 편이 테스트·유지보수에 유리하므로 B 권고. 외부/유료 비용은 없다. 저장형 프리셋 라이브러리의 저장·내보내기/가져오기 구조는 승인 후 설계한다.
7. **진척/상용화:** 최초 7단계 약 44% 추정 (1·2 완료, 3·4·7 부분, 5 미구현, 6 승인대기). 실PDF 사용자 수용 및 buyer physical Windows GUI/print는 NOT VERIFIED. Sale/Production NO-GO.
8. **남은 작업 순서:** (1) 사용자 스타일 저장/재사용 요구와 스키마 옵션 승인 → (2) 승인된 토큰 프리셋 보강 및 실제 PDF 검증 → (3) STEP4 갭 매트릭스 갱신 → (4) STEP5/7 범위 내 설계 누락 보강 → (5) 보안·호환·판매 수용 검증. OCR, 외부 전송, 유료 API/모델 다운로드, merge, deployment 금지.
9. **실패 기록·데이터 보존:** `a1c0885`의 고정 초기테마 테스트 가정을 보정했고, `83045a6`에서 비교 중 테마 컨트롤 동기화 결함을 찾아 `273db07ae851e8d2420da39688b5fa84641ce65d`에서 수정·검증했다. 실패 검사를 건너뛰지 않았다. main·PR #3/#4·V2 기존 데이터·배포 설정·원본 설계는 미변경·미병합.
10. **환경·갱신:** Production 미배포. 합성 fixture만 사용; 고객 PDF는 CI/PR로 전송하지 않았다. 갱신 2026-10-27 19:18 KST; 현재 검사 근거는 code SHA 위의 두 Actions run이다.

## 과거 인수인계 스냅샷 — 2026-10-18

1. **목표·용도·확정 요구·기술**: PDF 콘텐츠와 디자인을 분리하여 새로운 스타일로 재조판하는 로컬 도구. STEP 1은 국비학원 회고록 입력→테마→실시간 A4 기준 미리보기→브라우저 PDF. React/TypeScript/Vite/CSS, 로컬 저장, 백엔드/API/CDN 없음. 확정 원본은 `REQUIREMENTS.md`, `docs/BLUEPRINT.md`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`.
2. **완료 기능·변경·결정 근거**: 4개 본문+제목/날짜/선택 작성자, 3개 분리된 테마, 6색, 3 크기, 시스템 고딕/명조, 공통 DocumentView, `window.print()`, `@page` A4, 빈 섹션 숨김, 로컬 `schemaVersion:1` 자동 복원/초기화. 외부 API와 PDF 라이브러리를 쓰지 않은 것은 STEP 1 경량·오프라인 우선 요구 때문이다. 원본 설계 PNG 2개와 원본 텍스트를 `docs/`에 변경 없이 저장함.
3. **테스트 명령·성공/실패 수·검증/미검증**: `npm test` 5/5 PASS, `npm run build` GitHub Actions PASS. `tests/browser-smoke.mjs` 실제 Chrome 검증 항목 6그룹 PASS: React 렌더, 입력·테마·복원, 초기화, 손상 저장 데이터, 긴 본문/URL, A4 PDF **15페이지**·출력 텍스트 추출·편집 UI 배제. 결과: [Actions #39128155552](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39128155552). 사용자 Windows/Edge 인쇄 및 한글 글꼴 선택 품질 미검증. CI 초기 시도는 npm 캐시/TypeScript 축소 범위 오류 및 테스트 하네스 장애로 실패했으나 코드·CI를 수정한 최종 HEAD 기준 성공.
4. **완료/진행/대기/차단·중단 지점**: STEP 1 구현과 GitHub 자동 검증 완료. 사용자 실제 회고록 PDF 육안 검수·학원 업로드 가능 여부 대기. STEP 2 블록 데이터 모델·STEP 1 비파괴 변환과 4개 신규 테스트는 구현, 나머지 STEP 2 UI·이미지·다중 문서·내보내기는 미구현. Vercel 배포 없음(로컬 제품).
5. **오류 근거·원인·시도·재시도 금지·대안**: 로컬 npm 설치는 DNS `EAI_AGAIN`으로 차단되어 GitHub Actions에서 정상 설치/빌드 검증. CI 초기 누락된 lockfile 캐시 설정 제거, `src/storage.ts` TS18046 좁히기 문제 수정, 브라우저 도구 `poppler-utils` 설치 및 CDP 새로고침 전환 재시도 처리 후 100% 최종 검사 통과. 사용자 로컬 npm DNS 장애가 있으면 패키지 레지스트리 네트워크를 확인하고 무의미한 반복 설치를 피할 것.
6. **저장소·브랜치·SHA·주요 경로**: `hibi89/astra_pdf_redesigner` `main`, 최종 테스트 검증 기능 SHA `639b5e984e8ba711674a3b3d29fc6baf881a14d1`. 주요 경로 `src/App.tsx`, `src/types.ts`, `src/storage.ts`, `src/styles.css`, `tests/`, `.github/workflows/ci.yml`, `docs/`. 이 문서 자체의 HEAD SHA는 GitHub에서 최신 조회해 확인.
7. **Production URL·Vercel 프로젝트·실행 명령·환경**: Production URL/배포 없음(미적용). `npm install` → `npm run dev` (Vite `127.0.0.1:5173`), `npm test`, `npm run build`. 검증 CI 환경 GitHub Ubuntu/Node.js 22/Chrome headless.
8. **원본 위치·백업·인증·수정 금지**: `docs/blueprints/architecture-flow.png`, `docs/blueprints/seven-step-plan.png`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`는 사용자 원본, 직접 수정 금지. 기존 원본은 Git SHA와 이력으로 복구. 실제 회고록은 해당 브라우저 로컬 `localStorage` 하나만 사용, 서버/클라우드 전송 없음. 브라우저 데이터 제거 시 작업본 삭제될 수 있어 사용자 별도 백업 필요. 비밀/토큰/ENV 없음.
9. **다음 작업 우선순위·절차·완료 기준·승인**: 사용자가 개인 PC에서 최초 npm 설치→dev 실행→짧은 실제 회고록과 장문 샘플 출력·한글 선택·페이지 나눔·학원 첨부 가능성 확인. 결과 확인 후 STEP 1 승인/수용 기록, STEP 2 상세 작업은 새 승인 후 진행.
10. **갱신 일시(KST)·확인 시점·검증 범위·문서 기준 커밋**: GitHub Actions 최종 성공 확인 시점 2026-10-18 21:39:37 KST; GitHub 원본 자료·기능 SHA `639b5e984e8ba711674a3b3d29fc6baf881a14d1` 및 [run #39128155552](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39128155552)을 검증 기준으로 한다. 인수인계 문서는 해당 확인 후 갱신했으며 최신 문서 HEAD는 GitHub 직접 재조회가 기준.

**상태 원칙**: 로컬 ZIP/구현 설명/CI Ready만으로 사용자 Windows 인쇄까지 검증됐다고 주장하지 않는다.

**최종 인수인계 보완:** Chrome 내비게이션 로드 완료 이벤트를 기다리도록 E2E를 안정화했으며, 문서만 수정된 커밋은 CI 재실행에서 제외했다. 최신 기능 SHA `639b5e984e8ba711674a3b3d29fc6baf881a14d1`, 검증 `39128155552` / 2026-10-18 21:39:37.

## 2026-10-18 22:04 KST 최신 작업 인수인계 (STEP 2 첫 단위)
1. **목표:** PDF 내용 보존·디자인 재조판(내용/디자인 별도 저장). 원래 아스트라 7단계 유지. STEP 2는 제목·문단·이미지 블록 기반 개인 문서 제작기. 확정: `REQUIREMENTS.md`.
2. **구현:** STEP 1 UI/저장 키 원형 보존. `src/step2/model.ts` 신규, 기존 회고록 내용/줄바꿈/숫자/테마를 안전하게 변환, 이동·수정·손상 데이터 검사. 문서 편집 UI는 아직 없음.
3. **테스트:** 로컬 Node 22 `npm test` 9/9 PASS. GitHub Actions `39129894290` success (GitHub Ubuntu npm 설치·테스트·빌드·Chrome 스모크). 사용자 Windows 인쇄는 여전히 수동 확인.
4. **상태:** STEP 1 자동 검증 완료, STEP 2 첫 모델 단위 완료, STEP 2 전체 진행 중. STEP 3+ 대기. 미해결: 이미지 저장/관리·UI·프로젝트 export/import.
5. **장애/대안:** 로컬 npm 패키지 레지스트리 DNS EAI_AGAIN으로 build 실행 불가. 성공한 GitHub Actions로 보완. 제약 미해결 시 반복 시도 금지.
6. **저장소/코드:** `hibi89/astra_pdf_redesigner` main. STEP 2 기능 SHA `5eb2b8d5db89f69a2a61254ddd79651d1226ad56`; 계획 `docs/STEP2_DESIGN_DECISION_2026-10-18.md`; PR #1.
7. **배포/환경:** Production/Vercel 미적용(로컬 프로그램), `npm install`, `npm test`, `npm run build`, `npm run dev` → `127.0.0.1:5173`.
8. **원본/보안:** `docs/ASTRA_ORIGINAL_ROADMAP.txt`, PNG 2장, STEP 1 v1 localStorage 원본 키는 변경·삭제 금지; 민감 데이터/토큰 없음. 이미지는 나중에 브라우저 로컬 IndexedDB에 저장.
9. **우선순위:** 블록 CRUD+편집 UI → 이미지 검증·저장 → 다중 문서 → 프로젝트 백업/가져오기 → Chrome 인쇄 E2E. 코드·기능을 완료할 때까지 원본 PDF 업로드/OCR로 범위 확장 금지.
10. **시점/검증:** 2026-10-18 22:04:29 KST GitHub Actions success 상태 재조회, 기능 SHA 확인. 문서 저장 후 최신 docs/BOOK SHA는 GitHub 재조회 필요. 미구현을 완료로 표시하지 않음.

## STEP 2 새 지침 인수인계 — 2026-10-18 22:39:17 KST (기능 브랜치, main 미병합)
1. **목표:** 사용자 확정 PDF 콘텐츠 보존·스타일 재조판. 현재 단계 STEP 2는 PDF 업로드 이전의 개인 문서 제작기. 확정 원본은 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (feature branch).
2. **구현:** `feature/step2-full-20261018`에서 V2 섹션/소제목/문단/이미지 블록 UI, 문서 목록 생성·복제·삭제/수정, 추가 컴팩트 테마, 네이티브 IndexedDB 자산·메타 저장, 변환, JSON 내보내기·가져오기 구현. STEP 1 화면은 별도 호환 버튼으로 유지.
3. **테스트:** 로컬 Node 22 단위 **14/14 PASS**; 순수 TypeScript 모듈의 별도 타입검사 PASS; JSX 구문 검사 PASS. 전체 Vite build 및 실제 Chrome STEP 2 검사 미검증. GitHub Actions #39131861115/#39132088786 runner 미배정 실패.
4. **상태:** STEP 1 main 자동 검증 완료(이전 run #39129894290). STEP 2는 브랜치 소스 구현 중 **검증 대기/부분 완료**. STEP 3 미착수.
5. **실패 및 대안:** CI 작업 약 2초 종료, runner_name 공백·steps 0, 로그 BlobNotFound. 코드 실패인지 미확인. 환경 npm 설치 EAI_AGAIN / --offline ENOTCACHED. 동일 방식 재시도 금지. 인터넷 연결된 개발환경에서 빌드+Chrome E2E 검증.
6. **저장소/SHA:** `hibi89/astra_pdf_redesigner`, main HEAD 문서 갱신 후 재조회, 기능 브랜치 `feature/step2-full-20261018` SHA `ebb5861cbc795286c1aa1d9ea1321fb46f261ffb`. `src/step2/*`, `src/Root.tsx`, `tests/step2-browser.mjs`.
7. **배포:** Production/Vercel 미적용, 로컬 React/Vite, `npm install`, `npm test`, `npm run build`, `npm run dev` → `127.0.0.1:5173`.
8. **원본/데이터/보안:** 원본 로드맵·설계 PNG GitHub에 보관, v1 `astra-pdf-redesigner:current:v1` 자동 삭제·변경 금지. 이미지 Blob은 새 IndexedDB에 저장. 비밀/외부 API 없음. 기능은 검증 전 main으로 병합 금지.
9. **다음 우선 작업:** runner 장애 근거 확인 → 빌드·E2E 수행 → 결함 최소 수정 → STEP 1 회귀·PDF 인쇄/이미지 검증 → main merge → 문서·BOOK 최신화. 사용자 개인정보 포함 문서는 자동 시험 금지.
10. **시각/검증:** 2026-10-18 22:39:17 KST, 로컬 단위/순수 타입 검사와 GitHub 두 runner 미배정 실패 확인. 실제 STEP 2 Chrome/Windows 테스트 아직 수행하지 않음.


## 최신 작업 인수인계 — 2026-10-18 23:38:59 KST (STEP 2 기능 브랜치)
1. **목표·기술:** 원본 PDF 콘텐츠 보존 후 디자인 재조판. 현재 STEP 2 개인 문서 제작기, React/TypeScript/Vite, IndexedDB/브라우저 APIs. STEP 3 PDF 가져오기는 아직 금지.
2. **완료 기능/변경:** `feature/step2-full-20261018`의 V2 편집/문서함/이미지/JSON 기능 소스를 유지. `Workspace.tsx` 이미지 블록 TypeScript 타입 분기와 미사용 import 수정, E2E 손상된 PNG CRC fixture 교체. STEP 1 UI·localStorage v1 원본 미변경. 공개 저장소에서 Actions 러너가 다시 배정됨.
3. **테스트:** 검증된 기능 SHA `caa0747a5b6967393e05b1b704fe0aa5b3f6aa24`. [CI run 39136882566](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39136882566) **success**, 단위 14 PASS/0 FAIL, `npm run build` PASS, 실제 Chrome STEP 1 회귀·A4 PDF 15p PASS, STEP 2 IndexedDB·섹션 이동·PNG 이미지·프로젝트 JSON export/import·이미지 PDF PASS. 추가 수동 항목 미검증.
4. **상태/중단:** STEP 1 main 기존 검증 상태 보존. STEP 2 기능 브랜치 통합 스모크 통과; **main 미병합**, STEP 2 전체 최종 완료 미판정. STEP 3 미착수.
5. **오류·시도·금지:** 종전 GitHub Actions 러너 미할당은 저장소 공개 상태 이후 해소. 재실행 시 TS6133/TS2339 8건 수정, 후속 E2E에서 PNG IDAT CRC 오류 검증·fixture 교체해 최종 PASS. 동일한 무의미한 runner 재시도 불필요. 로컬 npm registry DNS EAI_AGAIN 문제 별도.
6. **저장소/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner` / `feature/step2-full-20261018` 기능 SHA 위와 같음. `src/step2/Workspace.tsx`, `tests/step2-browser.mjs` 변경. `main`은 문서 업데이트뿐, STEP 2 소스 미병합.
7. **Production/환경:** Production URL/Vercel 미적용. 로컬 `npm install`, `npm test`, `npm run build`, `npm run dev`, Chrome/Edge 우선.
8. **원본/백업/보안:** 사용자 원본 `docs/ASTRA_ORIGINAL_ROADMAP.txt`, 원본 PNG 2종 및 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 보존. `astra-pdf-redesigner:current:v1` 기존 저장 데이터 삭제/수정 금지. 민감 문서 외부 전송 금지, 공개 저장소에 비밀 추가 금지.
9. **다음 1단위/완료 기준:** JPEG/WebP·이미지 레이아웃·문서 전환/저장 경쟁·실패 복구 중 위험이 높은 부분을 골라 최소 테스트와 수정·CI 검증. 실제 Windows 검수는 별도. 그 후 main 병합 판단.
10. **확인 시각/범위:** GitHub Actions run `39136882566` success, 2026-10-18 23:38:59 KST 종료·로그 검증. 기능 SHA `caa0747a5b6967393e05b1b704fe0aa5b3f6aa24`, 인수인계 문서/BOOK 최종 커밋은 별도 조회 후 확인.

## 현재 인수인계 갱신 — 2026-10-18 23:47:43 KST
1. **목표/용도/요구/기술:** 사용자의 PDF 원문 보존·새 디자인 재조판 최종 목표. STEP 2 개인 문서 제작기(React/Vite/IndexedDB); STEP 3 PDF 업로드·OCR 미착수.
2. **완료 기능/결정:** STEP 2 feature의 문서·이미지/JSON 기능에 문서 변경 작업 동시 실행 방지 추가. `src/step2/mutationGate.ts`를 통해 다른 문서 변경 시작을 거절하고 작업 중 편집 비활성화; 실패 시 재시도 가능. 기존 STEP 1·v1 localStorage 원본 미변경.
3. **테스트:** `npm test` **16/16 PASS**, `npm run build` PASS, Chrome 실제 실행에서 동일 턴의 복수 문서 전환 차단/원문·활성 문서 새로고침 유지, STEP 1 A4 PDF 15p·STEP 2 PNG/JSON/인쇄 스모크 PASS. 증거 [run 39137537886](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39137537886).
4. **상태/중단:** 저장 경쟁 방어 1단위 구현·CI 검증 완료. STEP 2 전체 수용·main 병합은 아직 대기. STEP 3 미착수.
5. **오류/원인/시도/대안:** 이전 구현은 `switchTo` 등의 비동기 동작 중 후속 변경 실행이 가능해 순서 역전 위험. 중복 요청 거부 게이트로 최소 해결, 실패 뒤 잠금 해제 단위테스트. JPEG/WebP·큰 이미지·멀티탭 및 저장 실패 주입까지 완료 주장 금지.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner` / `feature/step2-full-20261018` 기능 SHA `44d7be92f04be8ff4e1effeb9c16f271069cfe46`; main 기능은 STEP 1 유지. 주요 경로 `src/step2/mutationGate.ts`, `useWorkspace.ts`, `Workspace.tsx`, `tests/step2-mutation.test.ts`, `tests/step2-browser.mjs`.
7. **Production/환경:** 배포 미적용(로컬 프로그램); 개발 `npm install`, `npm test`, `npm run build`, `npm run dev`, `127.0.0.1:5173`.
8. **원본/백업/보안:** 기존 `docs/ASTRA_ORIGINAL_ROADMAP.txt`·PNG 2장·STEP 2 원본 지침 유지. localStorage v1·IndexedDB 사용자 문서 삭제/변경 금지, 외부 전송·토큰 없음.
9. **다음 작업/승인:** JPEG/WebP와 이미지 출력 경계, 또는 IndexedDB 실패 복구 중 **다음 한 단위**를 테스트; 기존 자동 검증 유지 후 main 병합 검토. 실 Windows/Edge 검수는 사용자 수동으로 남음.
10. **시각/검증 범위/문서 기준:** 2026-10-18 23:47:43 KST, run 39137537886 완료·로그 재조회, 기능 SHA `44d7be92f04be8ff4e1effeb9c16f271069cfe46`; 문서 HEAD·중앙 BOOK 커밋은 기록 후 재조회.

## 최신 인수인계 — 2026-10-18 23:59:02 KST (STEP 2 이미지 검증)
1. **목표·구현 범위:** 원본 콘텐츠와 디자인 분리를 목표로 하는 로컬 PDF 리디자인 앱. 현재 STEP 2 문서 제작기 이미지 검증을 수행; STEP 3 기존 PDF 가져오기 미착수.
2. **변경:** 이미지 핸들러/사용자 데이터 수정 없음. `tests/step2-browser.mjs`에 실제 Chrome Canvas JPEG(32×16 가로)·WebP(16×32 세로) 업로드, IndexedDB 새로고침, 이미지 원본 byte-for-byte JSON 내보내기, Chrome A4 PDF `pdfimages` 이미지 포함 검증 추가. 테스트는 개인 이미지·외부 API 불사용.
3. **검증:** [Actions run 39138352449](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39138352449) **success**; Node `npm test` 16/16 PASS; TypeScript/Vite 빌드 PASS; Chrome JPEG/WebP 디코딩·복원·메타·원본 바이트 일치·PDF 이미지 3종 포함 PASS; STEP 1 PDF 15페이지 및 이전 STEP 2 스모크 PASS.
4. **현재 상태:** 기능 브랜치 `feature/step2-full-20261018`의 검증 코드 SHA `fa459db3317026190c85f690e5744950ed3b4da1`; 이후 문서 커밋은 GitHub 재조회. main은 STEP 1 기존 코드 유지, STEP 2 main 병합 미진행. STEP 2 전체 최종 수용 미판정.
5. **오류/재시도/원인:** 파일 2회 다운로드가 Chrome 동작에 영향을 받아 테스트 파일 탐색이 타임아웃(`39138141905`, `39138228608`). 사용자 앱 이상으로 단정하지 않음. JSON 다운로드 앞단 Blob을 직접 확인하도록 테스트 하네스 변경 → 최종 PASS. 같은 다운로드 탐색 방식 재사용 금지.
6. **코드·저장소:** `hibi89/astra_pdf_redesigner`, `tests/step2-browser.mjs`, `src/step2/images.ts`(미변경), `src/step2/projectFile.ts`(미변경); 원래 STEP 1 v1 저장키 변경·삭제 없음.
7. **환경/배포:** 로컬 React/Vite, `npm test`, `npm run build`, `npm run dev` → 127.0.0.1:5173; Vercel/Production 없음.
8. **데이터/보안:** 원본 STEP1 회고록, 설계 PNG 2종, STEP2 지침 원본, 사용자 저장 데이터 유지; 신규 테스트 이미지는 비민감 합성 데이터만 사용, 서버로 문서·이미지 전송 안 함.
9. **다음 1단위/검증 조건:** IndexedDB 할당량·트랜잭션 실패 복구 혹은 대형 이미지/긴 캡션/페이지 분할 경계 1단위를 테스트. 사용자 Windows/Edge 실제 저장 검수는 별도. 전 항목을 완료로 주장하지 않고 main 병합은 후속 판단.
10. **갱신 및 확인:** 2026-10-18 23:59:02 KST, run `39138352449` success 및 전체 로그 재확인, 기능 SHA `fa459db3317026190c85f690e5744950ed3b4da1`. 문서 HEAD·BOOK 동기화 후 재조회 기준.


## 2026-10-19 00:10:27 KST 현재 작업 인수인계 — STEP 2 저장 실패 회복
1. **목적/기술:** 최종 PDF 원문 보존·디자인 재조판 로컬 앱. 현재 STEP 2 문서 제작기 React/Vite/IndexedDB, STEP 3 PDF 불러오기 미착수.
2. **구현·의미:** 기능 브랜치 `feature/step2-full-20261018`, `src/step2/useWorkspace.ts` 저장 재시도 성공 시 낡은 오류 안내 제거; `tests/step2-browser.mjs`에 실제 Chrome 브라우저 IndexedDB 문서 write 트랜잭션 1회 강제 실패 후 복구 시나리오 추가.
3. **실제 테스트:** [CI 39139215112](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139215112) **success**. `npm test` 16/16, `npm run build` PASS, Chrome 기존 STEP 1 PDF15p·STEP2 JPEG/WebP/PNG·JSON·다중 문서 회귀 PASS. QuotaExceededError 주입: 기존 DB 원본 보전, 편집 메모리 유지, 저장 실패 경고, 이탈 경고, 긴급 JSON export(원문·이미지), 저장 재시도·오류 안내 해제·새로고침 후 데이터 보존 모두 PASS.
4. **상태/미완료:** STEP 2 핵심 구현·자동 테스트 상당 부분 검증. 전체 완료 선언 및 main 코드 병합 **대기**; Windows/Edge 수동 인쇄·대형 이미지/긴 캡션·이미지 트랜잭션 실패·멀티탭은 미검증. STEP 3~7 미착수.
5. **발견 문제·원인·대안:** 실패한 비동기 IndexedDB 저장 이후 재시도는 이전에도 정상 동작했으나 UI 오류 메시지 유지 위험을 확인해 최소 수정. QuotaExceededError 테스트는 1회 주입이며 물리적 디스크 부족 전체 조건을 재현한 것은 아님.
6. **SHA/경로:** 검증 기능 SHA `9339adb319a78192a0dda5ae437de248e9a056ca`. `tests/step2-browser.mjs`, `src/step2/useWorkspace.ts`. 저장소 `hibi89/astra_pdf_redesigner`, 브랜치 `feature/step2-full-20261018`, main에는 기존 STEP 1 유지.
7. **실행/배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` localhost 127.0.0.1:5173. Vercel Production/로그인/API 없음.
8. **보안·원본:** 사용자 기존 `astra-pdf-redesigner:current:v1` localStorage와 STEP 1 설계 원본, 프로젝트 JSON·이미지 원본 유지. 합성 테스트 문서/이미지만 사용, 문서 데이터 외부 전송·로그 출력 금지.
9. **다음 작업/기준:** 1단위로 대형 이미지·긴 캡션·페이지 경계 검증 또는 이미지 교체 transaction rollback 주입. 남은 항목 전수검사 전 STEP 2 100% 주장 금지. main 병합은 후속 검수 후.
10. **진행률/갱신:** 2026-10-19 00:10:27 KST, STEP 2 자동 검증 기준 약 85~90%, **7단계 단순 동일비중 환산 약 26~27%**(정량 일정/난이도 반영하지 않은 참고치). CI `39139215112` success·SHA `9339adb319a78192a0dda5ae437de248e9a056ca` 로그 확인; 문서/BOOK 최종 HEAD는 저장 후 재조회.


## 2026-10-19 00:20:19 KST 현재 작업 인수인계 — 이미지 교체 트랜잭션 안전성
1. **프로젝트·목표:** Astra PDF Redesigner `p5`; 원본 PDF 콘텐츠 보존·새 디자인 재조판이 최종 목표. 현재 STEP 2 React/Vite/IndexedDB 문서 제작기, STEP 3 PDF 가져오기 미착수.
2. **구현/변경:** 기존 `src/step2/idb.ts`의 문서·자산·메타 단일 transaction을 그대로 사용. `tests/step2-browser.mjs`에 실제 Chrome 데이터 저장 실패 주입 테스트 추가. 앱 코드와 STEP 1/v1 localStorage 원본 변경 없음.
3. **검증:** [Actions run 39139965821](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39139965821) **success**, Node 16/16, TS/Vite build PASS, Chrome 기존 STEP1 15p PDF 및 STEP2 기능 회귀 PASS. 신규 테스트: image asset `put` 후 transaction `abort()` 강제 → 문서 참조/기존 이미지 바이트/자산 개수 완전 보존, 새로고침 후 확인; fault 제거 후 재교체 성공·기존 자산만 제거·고아 자산 0·복원 PASS.
4. **상태/경계:** 이미지 교체 원자성 검증 완료, STEP2 전체 약 90% 수준이라는 비공식 추정; main 기능 미병합. 전체 7단계 동등 가중 환산 약 27%, 실소요시간 추정 아님.
5. **오류·시도/우회:** 오류 재현은 한 번의 진짜 IDB 트랜잭션 중단; 기존 구현이 정상 롤백되어 앱 로직 변경 불필요. 이 통과만으로 브라우저 저장소 전체 고장/디스크 부족을 전부 검증했다고 주장하지 않음.
6. **저장소/SHA/경로:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018` 검증 코드 SHA `154ff8d98aa97da311362c1e11ea78bac9db77d9`, 테스트 `tests/step2-browser.mjs`. main 코드 STEP1 기존 유지.
7. **실행/배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` localhost 127.0.0.1:5173. Vercel/Production 없음.
8. **원본·백업·보안:** STEP1 저장 키·로드맵 PNG/TXT·사용자 문서 변경 없음. 테스트는 합성 이미지·테스트 브라우저 profile만 사용. 비밀/API 없음.
9. **다음 작업 및 수용 기준:** 대형 이미지·긴 설명 출력의 다중 페이지 PDF/텍스트·이미지 누락·겹침 검증 → 멀티탭 충돌 실제 검사 → 최종 STEP2 수용 후 main 병합 검토, 사용자 Windows Chrome/Edge 출력 별도.
10. **검증 시각:** 2026-10-19 00:20:19 KST, 기능 SHA `154ff8d98aa97da311362c1e11ea78bac9db77d9`, run `39139965821` success 로그·결과 재확인. main/feature 문서 HEAD 및 중앙 BOOK은 갱신 뒤 다시 읽는다.


## 최신 인수인계 — 2026-10-19 00:29:24 KST (STEP 2 A4 레이아웃 경계)
1. **목표·요구·스택:** 기존 PDF 원문을 보존하며 새 디자인으로 재조판하는 최종 목적. 현재 STEP 2 개인 문서 제작기(React/Vite/IndexedDB); 사용자 제공 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 원형 유지, STEP 3 PDF import 미시작.
2. **구현 내용:** `tests/step2-browser.mjs`에 고해상도 세로형 이미지(1200×2500), 선행 37줄, 짧은 캡션 및 190줄 긴 캡션의 실제 Chrome A4 PDF 회귀 테스트 추가. 앱 코드/CSS는 변경하지 않음.
3. **검증 결과:** [run 39140653462](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39140653462) **success**: 16/16 unit, TS/Vite build, STEP 1 Chrome PDF 15p·기존 STEP 2 회귀 PASS. 짧은 캡션과 이미지 동일 페이지, 긴 캡션 전/후 표지 보존, 추가 페이지 생성, PDF 전체 텍스트 좌표 A4 물리 경계 내부 PASS.
4. **완료/진행/미검증:** STEP 2 인쇄 경계 특정 시나리오 통과. 실제 멀티탭 경쟁/잠금과 사용자 Windows Chrome/Edge 인쇄·육안 검수 미검증, STEP 2 전체 수용/main 병합 아직 보류. STEP3~7 미착수.
5. **문제/제약:** Chrome A4에서는 해당 사례에 인쇄 수정 필요 없었음. `pdfimages`는 이미지 포함/페이지 검사이고 bbox는 텍스트 물리 범위 검사이므로 픽셀 수준 겹침/미관 전체 증명은 아님. 불필요한 CSS 변경 금지.
6. **브랜치/커밋/경로:** `hibi89/astra_pdf_redesigner` / `feature/step2-full-20261018`, 검증 코드 SHA `3173098c0df9d210cd8d762b28d09a36b5298f73`; `tests/step2-browser.mjs`. main에는 기존 검증된 STEP1 코드 유지.
7. **실행/배포:** `npm install`, `npm test`, `npm run build`, `npm run dev`; Chrome CI Ubuntu Node22. Production/Vercel 없음.
8. **원본·보안:** STEP1 v1 localStorage·기존 원본 PNG/TXT/STEP2 지침·사용자 IndexedDB 문서 불변. 임시 Chrome 프로필과 합성 문서만 테스트. 개인정보·문서 본문 외부 전송/로그 노출 금지.
9. **다음 1단위:** 실제 두 Chrome 탭 동시 접근시 2번째 탭 편집 잠금·1번째 탭 종료 후 재접근/저장 복구 E2E 수행, 성공 후 STEP2 병합·수동 검수 판단.
10. **기준 시각/진행률:** 2026-10-19 00:29:24 KST, 검증 run `39140653462` success/코드 SHA `3173098c0df9d210cd8d762b28d09a36b5298f73`; STEP2 **약 92%**, 전체 7단계 동일 비중 환산 **약 28%**의 비공식 추정. 비중/일정 미반영. 문서와 중앙 BOOK 최종 HEAD는 커밋 뒤 재조회.


## 최신 인수인계 — 2026-10-19 00:36:17 KST (STEP 2 멀티탭 잠금)
1. **목적/현상:** `hibi89/astra_pdf_redesigner` p5, 기존 PDF 콘텐츠 보존·디자인 재조판 최종 목표. 현재 STEP2 React/Vite/IndexedDB 문서 제작기. STEP3 PDF 업로드·리디자인 미착수.
2. **구현/변경:** 앱 코드는 수정하지 않음. 신규 `tests/step2-multitab.mjs`(Chrome DevTools Protocol 실제 두 탭 + Web Locks), `.github/workflows/ci.yml`에 `CHROME_PATH="$CHROME_BIN" node tests/step2-multitab.mjs` 추가. 이전 STEP1/2 원문·자산·localStorage 원본 무변경.
3. **검증 증거:** [Actions 39141151527](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39141151527) **success**, Node **16/16 PASS**, TS/Vite 빌드, Chrome STEP1 15p A4 및 STEP2 종전 기능 회귀 PASS. Chrome 2탭에서 독점 잠금/둘째 탭 편집 차단·경고, 소유 탭 닫으면 잠금 0, 둘째 탭 새로고침 후 잠금 재획득, 기존 원문·신규 편집 저장/재시작 보존까지 검사 PASS.
4. **상태/결정:** STEP2 주요 자동 검증 **약 95% 완료 추정**, 전체 7단계 동등 가중 **약 28~29%**. STEP2 전체 100% 수용 아님; main에는 STEP1 유지, STEP2 feature 미병합. STEP3~7 미착수.
5. **문제/대안:** 잠금 소유자 종료 시 둘째 탭은 **자동 활성화가 아닌 새로고침**으로 편집권 획득(현재 UI 안내와 일치). 크래시/OS별 브라우저/브라우저 Web Locks 미지원 조건은 미검증. 기존 설계에 수정 필요 없음.
6. **SHA/위치:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`, 기능 검증 SHA `3fe13c1097f63296d45c683f63ba0b95acd005a9`; 추가 파일 `tests/step2-multitab.mjs`, `.github/workflows/ci.yml`.
7. **운영/환경:** `npm install`, `npm test`, `npm run build`, `npm run dev` → 127.0.0.1:5173. CI Ubuntu Chrome Node22. Production URL·Vercel 미적용.
8. **원본·보안:** `docs/ASTRA_ORIGINAL_ROADMAP.txt`, 설계 PNG 2장, `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt`, 기존 사용자 IndexedDB·localStorage v1 원본 그대로. 테스트 임시 Chrome 프로필에 합성 텍스트만 사용, 유료 API/비밀/고객 데이터 없음.
9. **다음 작업:** STEP2 완료 기준을 사용자 지침과 코드/테스트/CI 근거로 항목별 점검. 누락 시 처리, 그 후 STEP2→main PR·병합 판단. 사용자 Windows Chrome/Edge PDF 저장·인쇄 미리보기/한글 폰트·육안 확인은 별도 수동 수용 기준.
10. **검증 시각:** 2026-10-19 00:36:17 KST, run `39141151527` 결론 SUCCESS 로그 확인, 테스트 기능 SHA `3fe13c1097f63296d45c683f63ba0b95acd005a9`; `STATUS.md`/본 문서/BOOK commit SHA는 갱신 후 재조회.


## 최신 작업 인수인계 — 2026-10-19 00:53:28 KST (STEP 2 원본 요구사항 최종 감사)
1. **목표/원본:** Astra PDF Redesigner p5 최종 목표는 기존 PDF 본문 그대로 보존·다른 디자인 재조판. STEP2 로컬 개인 문서 제작기 범위만 완료 검토. 원본은 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (1~18절), 상세 수용 체크리스트는 feature `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`.
2. **수정/기능:** `src/step2/Workspace.tsx` 레거시 모드 전환 전 `await w.flush()` 실행, 저장 실패 시 전환하지 않음. `src/step2/idb.ts` 유효한 existing ACTIVE 보존하며 늦은 STEP1 migration doc을 별도 추가, marker와 doc transaction 유지. `tests/browser-smoke.mjs` 초기화 대기, `tests/step2-browser.mjs` 새 전환 E2E·종료 정리 안정화. README 최신 검증 결과 반영.
3. **검증:** [Actions #39142445389](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39142445389) **SUCCESS**, SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`: Node 16/16, TS/Vite 빌드 PASS, 실제 Chrome STEP1 PDF15p·STEP2 이미지/프로젝트파일/실패복구·2탭·대형 이미지·긴 캡션·빠른 화면 전환·저장 실패 차단 PASS.
4. **완료/미완료:** 기능 브랜치 코드 CI 통과. **STEP2 전체 수용 및 main 병합 HOLD**, 이유: 유효한 STEP1 v1 기존 데이터의 cold-start browser migration, 별도 프로필 JSON import, 사용자 Windows/Edge PDF·한글 시각 수동 테스트 미완료. STEP3~7 미착수.
5. **실패/원인/대안:** 검토 도중 빠른 전환 미저장 위험과 delayed migration ACTIVE 강제 변경을 발견해 코드 수정. 중간 CI 초기화 전 disabled 버튼 클릭, 전환 후 wrong active document, mock save failure test readiness, 임시 Chrome 테스트 폴더 ENOTEMPTY 문제 수정. 마지막 run `39142445389` SUCCESS. 통과한 범위를 벗어난 성공 주장 금지.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`. 마지막 검증 코드 SHA `eba463ca4f2046a73724b29ce6ffbf572c1b3ff8`; main에는 STEP1 소스만. 상세 감사 `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`.
7. **환경:** Node22/npm, React19/TS/Vite, `npm install`, `npm test`, `npm run build`, `npm run dev` → 127.0.0.1:5173; GitHub Ubuntu Chrome CI. Production/Vercel 없음.
8. **원본/보안:** STEP1 `astra-pdf-redesigner:current:v1` localStorage 원본, 설계 PNG 2종, roadmap TXT, STEP2 원본 지침 보존. 고객 문서/이미지 외부 전송·로그 표시/비밀 없음.
9. **다음 `ㄱ`/완료 기준:** **실제 v1 데이터 선존재 독립 Chrome 프로필 cold-start migration 자동 시험**(title/author/date/4개 항목·서식 원문·디자인·marker 1회·v1 원본 불변). 그다음 새 브라우저 프로필 JSON 가져오기, Windows/Edge 수동 검수; 통과한 후 main 병합/STEP2 최종 완료 판단.
10. **기준 시간·진행률:** 2026-10-19 00:53:28 KST, CI #39142445389 success. STEP2 보수적 **약 90~95%**, 전체 7단계 **약 27~28%** (동일 비중 비공식 추정). 5%p 이상 실질 상승 시 별도 보고.


## 최신 인수인계 — 2026-10-19 01:04 KST (실제 Chrome V1 cold-start 데이터 이동)
1. **목표/원본:** Astra PDF Redesigner p5, 원본 PDF 내용 보존·디자인 교체 최종 목표. STEP2 개인 문서 제작기 기능 브랜치만 검증 중, `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` 유지. STEP3 PDF 가져오기 미착수.
2. **구현:** `tests/step2-cold-migration.mjs` 신규. 별도 신규 Chrome 사용자 프로필에 앱 실행 **전** 유효한 v1 `localStorage` 합성 회고록을 preseed, 실제 React/IndexedDB 자동 migration 테스트. `.github/workflows/ci.yml`에 연결. Chrome 테스트 종료 시 임시 프로필 정리 오류가 기능 검증 결과를 덮지 않도록 `tests/step2-browser.mjs` 및 신규 테스트 cleanup error 분리.
3. **실제 검증:** [run 39143261165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39143261165) **success**, SHA `abb3d9425e72a2708306674176346727ef0ea710`, Node 16/16, TS/Vite build, STEP1 PDF15p 및 STEP2 기존 Chrome 전 항목 PASS. 신규: 4개 원문 섹션·빈 섹션/공백·문자·작성자·날짜·디자인 보존, v2 문서 1개·독립 IDs, ACTIVE·migration true, v1 original bytes 불변, reload 후 이중 생성 방지 PASS.
4. **진행/보류:** STEP2 자동 검증과 구현 약 95% 비공식 추정. **main 병합 HOLD**: 프로필 간 JSON backup/import 실물 이식 E2E, 사용자 Windows/Edge 인쇄/한글/시각 수동 검증 남음. 저장 실패 중 원자적 migration 롤백 별도 미검증.
5. **오류/원인:** 기존 Chrome temp profile 정리 ENOTEMPTY로 CI가 기능 PASS 후 실패한 기록 #39143134124; cleanup 경고 분리 후 최종 SUCCESS #39143261165. 기능 검증과 cleanup 경고 구별, 임시 합성 데이터 테스트 서버 환경 한정.
6. **Repo/Branch/SHA/경로:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`; verified code SHA `abb3d9425e72a2708306674176346727ef0ea710`; 신규 `tests/step2-cold-migration.mjs`, `.github/workflows/ci.yml` 갱신. main은 STEP1 기능 그대로 유지.
7. **실행/배포:** Node22, `npm install`, `npm test`, `npm run build`, `npm run dev` localhost 127.0.0.1:5173. GitHub Ubuntu Chrome CI. Production/Vercel 미적용.
8. **원본·보안:** 사용자 기존 v1 `localStorage`와 v2 IndexedDB/설계 PNG·TXT/STEP2 원본 지침 보존, 고객 데이터/네트워크 전송 없음. 테스트는 임시 synthetic records만 사용.
9. **다음 `ㄱ`:** 신규 브라우저 프로필 A에서 이미지 포함 문서 JSON 내보내기 → 완전 별도 Chrome 프로필 B에서 JSON 가져오기, 새 ID·원문/이미지 bytes/디자인 복원·A4 검증. 다음 수용 사항은 사용자 Windows/Edge 출력.
10. **진행률:** 2026-10-19 01:04 KST. STEP2 약 95%, 전체 7단계 동일비중 약 28~29%(가중·시간 미반영). 중앙 `BOOK.md`/보고서 동기화 후 재확인.


## 현재 인수인계 — 2026-10-19 01:19 KST (STEP2 실물 JSON 파일의 프로필 간 이식 검증)
1. **목표/현재 단계:** 기존 PDF 원문 보존·재디자인 최종 목표. 현재 STEP2 개인 문서 제작기 검증, React/TS/Vite/IndexedDB. STEP3 실제 PDF 추출·재구성 미시작.
2. **변경:** 앱 소스는 변경하지 않음. `tests/step2-cross-profile.mjs` 새 Chrome CDP E2E 추가, `.github/workflows/ci.yml`에 실행 연결. 기능 브랜치 `feature/step2-full-20261018`.
3. **검증:** [Actions `39144399956`](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39144399956) **SUCCESS**, 검증 SHA `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`: unit 16/16, TS/Vite build, Chrome STEP1 A4 15p 및 STEP2 모든 이전 E2E PASS. 프로필 A synthetic 한글/영문 본문·디자인·PNG/WebP 저장 후 실제 `.localdoc.json` 다운로드. 분리된 B Chrome 프로필 `DOM.setFileInputFiles`로 파일 import, 기존 B 문서 유지·원문/디자인/bytes 동일·고유 ID 재발급·새로고침 유지·PDF 이미지 2개 PASS.
4. **완료/보류:** 프로필 간 이식 검증 완료. STEP2 전체 최종 수용/main 병합 **HOLD**, 원본 사용자 Windows Chrome/Edge 실제 PDF/한글/배치·키보드 수동 검수 및 migration transaction 실패 rollback 주입 남음. STEP3~7 미착수.
5. **오류·시도:** 이번 검증 최종 CI가 첫 실행부터 SUCCESS. 기존 임시 프로필 정리 지연 WARN은 지난 cold migration 테스트에서 보고된 별개 사항. 확인된 신규 앱 결함 없음.
6. **저장소/브랜치/SHA:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`; 검증 기능 코드 `17f2e65e1873b4c75dc484cc7c6e11965a29f5ff`. `tests/step2-cross-profile.mjs` 및 CI YAML, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`, `README.md` 검증 현황 최신화. main은 STEP1만.
7. **환경/배포:** Ubuntu GitHub Actions Chrome, Node22 `npm install`/`npm test`/`npm run build`/`npm run dev`, local port 4173 테스트. Windows/Edge 미실행, Production/Vercel 미적용.
8. **원본/보안:** STEP1 v1 localStorage, V2 사용자 IndexedDB, 원본 지침 및 이미지·TXT 보존. 테스트는 합성 파일/임시 Chrome 사용자 디렉터리만 사용; 실제 사용자 데이터 변경·외부 전송 없음.
9. **다음 1단위:** V1 최초 마이그레이션 중 실제 IDB transaction abort를 강제하여 marker·doc·원본 데이터 무손실/재시도 성공을 검증. 별도 사용자 Windows/Edge 인쇄·시각 수용 이후 main 병합 재판단.
10. **진행률/기준:** 2026-10-19 01:19 KST, STEP2 약 96%, 전체 7단계 동등가중 약 28~29% (기간·난도 비반영 비공식 추정). 5%p 이상 증가나 단계 완료 시 별도 알림.


## 최신 인수인계 — 2026-10-19 01:29 KST (STEP2 최초 migration 원자적 rollback)
1. **목표/범위:** Astra PDF Redesigner p5, 최종 기존 PDF 본문 보존·디자인 재조판. STEP2 React/TS/Vite/IndexedDB 개인 문서 제작기. STEP3 PDF 실제 가져오기 미착수.
2. **변경:** `tests/step2-cold-migration.mjs` 신규 fault 모드 `STEP2_INJECT_MIGRATION_ABORT=1` 및 `.github/workflows/ci.yml` 별도 실행 추가. 실제 Chrome에서 v1 선존재+초기 migration `documents+meta` IDB transaction을 `abort()`; 실패 이후 새로고침으로 재시도 검증. `tests/step2-browser.mjs` 저장 성공 뒤 버튼 활성화 대기 조건만 보강. **앱 기능 소스 변경 없음**.
3. **실제 검증:** [GitHub Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) **SUCCESS**, SHA `a5009a76499a983aa4566adabddabf862c9e839b`. 실패 직후 V2 문서 0, 완료 marker/ACTIVE 없음, V1 원본 바이트 동일, 오류 안내 PASS. 1회 재시도 시 정확한 V2 원문/서식 복원 및 marker/active 생성, 추가 reload 시 중복 문서 0 PASS. Node16/16, TS/Vite build, STEP1 Chrome PDF15p 및 STEP2 기존 PNG/JPEG/WebP/JSON·다중 탭·긴 캡션 전체 회귀 PASS.
4. **현재 완료·미완료:** STEP2 핵심 앱 기능 및 예정된 Linux Chrome E2E 항목 대부분 통과. **STEP2 최종 수용·main 기능 병합 HOLD**, 사용자 Windows Chrome/Edge A4 출력·한글 폰트·이미지 레이아웃·키보드 수동 검수 남음. STEP3~7 미착수.
5. **발견 오류·원인·대안:** 초기 CI #39144986696은 기존 화면 전환 E2E에서 save-chip 저장됨 표시 뒤 버튼 disabled 해제가 늦어지는 타이밍 실패(앱 데이터 손상 아님). 테스트에서 disabled=false 기다린 후 click하게 수정, 최종 run 성공. 브라우저 임시 프로필 cleanup warning은 테스트 데이터 영역만 관련.
6. **저장소/브랜치/SHA/위치:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018` 코드 SHA `a5009a76499a983aa4566adabddabf862c9e839b`; `tests/step2-cold-migration.mjs`, `tests/step2-browser.mjs`, `.github/workflows/ci.yml`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`. main에는 기존 STEP1 소스만.
7. **테스트 환경/배포:** GitHub Actions Ubuntu Node22+Chrome, `npm install`, `npm test`, `npm run build`, `npm run dev` localhost. Vercel/Production 미배포.
8. **원본·보안:** 사용자 v1 localStorage/v2 IndexedDB·원본 설계 파일·원본 지침 보존. 실패 주입은 합성 데이터·임시 Chrome 프로필에서만 실행; 실제 문서 변경 없음/외부 API 호출 없음.
9. **다음 1단위/완료 기준:** 사용자 Windows Chrome/Edge에서 STEP1 15p PDF/STEP2 한글·PNG/JPEG/WebP·페이지 나눔·프로필 import 수동 수용용 체크리스트 마련. 사용자 테스트 결과 확인 후 STEP2 수용/기능 main 병합 여부 결정. 수동 검증 전 완료·병합 주장 금지.
10. **진행률/시각:** 2026-10-19 01:29 KST, STEP2 약 97~98% 추정, 전체 7단계 동등비중 약 28~29% (비공식·가중/시간 미반영). CI #39145149408 success·검증 SHA `a5009a76499a983aa4566adabddabf862c9e839b` 로그 확인.


## 최신 인수인계 — 2026-10-19 01:40 KST (STEP2 Windows 수용·병합 HOLD)
1. **목표·범위:** p5 Astra PDF Redesigner, 기존 PDF 본문 보존/새 디자인 리디자인 전체 7단계 중 STEP2 개인 문서 제작기 수용 직전. STEP3~7 미착수.
2. **이번 작업:** 원본 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` §16 21항을 그대로 보존한 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md` 신규 생성. Windows Chrome/Edge의 PDF(A4·머리글/바닥글 없음), 한글 텍스트 선택, PNG/JPEG/WebP와 큰 이미지/캡션 페이지 경계, 4종 테마, 저장/복제/JSON 브라우저 이식, 키보드·좁은 화면·백엔드 없이 동작을 수동 점검할 절차/증거 양식·병합 게이트 문서화.
3. **실제 검증 기준:** 마지막 기능 검증 [Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408) SUCCESS, 기능 SHA `a5009a76499a983aa4566adabddabf862c9e839b`, Node 16/16 PASS·TypeScript/Vite 빌드·Ubuntu Chrome STEP1 15p/STEP2 이미지·저장 실패·기존 v1 migration abort·프로필간 JSON·PDF·멀티탭 회귀 PASS. **이번 단위에 새 테스트 실행 안 함**. Windows 수동 항목 **21/21 미실행**.
4. **현재 상태/판정:** STEP2 자동 근거 충분하나 OS별 실제 인쇄/한글/이미지 레이아웃 수동 수용 미완료. **STEP2 최종 완료 선언·main 코드 병합 HOLD**. README·요구사항 감사 문서에서 같은 한계 기록. STEP3 시작 금지.
5. **핵심 위험/안전:** 브라우저 프로필·origin별 IndexedDB 격리(`4178` 테스트 포트; 기본 `5173`과 별개). 기존 실제 사용자 데이터 삭제/초기화 금지, 합성 테스트 프로젝트만 사용. PDF 헤더/풋터 브라우저 설정은 앱에서 자동 강제 불가능, Chrome/Edge·OS 시스템 글꼴 차이 실제 검수 필요.
6. **저장소/브랜치/경로:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`, `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`; main은 STEP1 기능 보존. 원본 로드맵/TXT·PNG는 무변경.
7. **로컬 Windows 준비:** Node22+ Git, 새 전용 클론에 `npm install`, `npm test`, `npm run build`, `npm run dev -- --port 4178 --strictPort`; 별도 test Chrome/Edge 프로필로 `127.0.0.1:4178` 접속, PDF 저장/한글 선택/시각 증거 수집. 명령·절차는 신규 문서에 모두 있음.
8. **백업/보안·배포:** 사용자 로컬 데이터·이미지 원본 무변경. 프로젝트 JSON 미암호화, 테스트는 합성 자료만 사용. Production/Vercel 미배포. API·비밀 키 추가 없음.
9. **다음 작업·수용 조건:** 사용자 실제 Windows Chrome/Edge 실행 결과(21항 중 필수 관문·FAIL 재현·합성 PDF/스크린샷) 접수 → 결함 수정 시 CI 재검증 → feature-to-main diff 최종 리뷰·사용자 승인 후 병합 → main Actions 검증. 결과 미수령이면 PASS 주장·병합 금지.
10. **기준 시각/진척도:** 2026-10-19 01:40 KST; STEP2 **약 97~98%** 추정, 전체 7단계 단순 동등가중 **약 28~29%** 유지. 5%p 진도 상승 없음; 새 문서·README·감사/BOOK 갱신 후 GitHub 재조회 필요.


## 최신 인수인계 — 2026-10-19 02:14 KST (STEP2 병합 전 코드 감사 / CI fail-closed)
1. **목표/상태:** p5 Astra PDF Redesigner. STEP2 개인 문서 제작기 feature는 자동 검증 상당 부분 완료. 기존 STEP1 `main` 보존. STEP2 main 병합·STEP3~7 아직 시작하지 않음. 사용자는 가능한 자동 검증을 GPT가 직접 수행하고 Windows 실제 조작을 반복 요구하지 않기를 원함.
2. **이번 작업:** `main...feature/step2-full-20261018` 및 역방향 비교(기능 브랜치 63 ahead, 28 behind; main의 최신 HANDOFF/STATUS 문서 유지 필요), `src/step2/{idb,useWorkspace,model,images,projectFile,Workspace}`, `src/Root.tsx`, `.github/workflows/ci.yml` 및 E2E 스모크 정적 감사. 새 보고 `docs/STEP2_PREMERGE_CODE_CI_AUDIT_2026-10-19.md`.
3. **코드 수정:** CI에서 Chrome 없을 때 경고+성공(`exit 0`) 처리 경로를 **오류+실패(`exit 1`)**로 변경. React 앱/IndexedDB 기능 소스 변경 없음. 검증 코드 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`.
4. **실제 검증:** [Actions #39148544554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39148544554) **success**; Node 16/16 PASS, TypeScript/Vite build PASS, 로그에 `Chrome: /usr/bin/google-chrome`, STEP1 15p PDF/STEP2 이미지·JSON·동시탭·migration abort·큰 이미지/긴 캡션 등 모든 Chrome 스모크 PASS. 테스트 Chrome 임시 profile cleanup 경고 `ENOTEMPTY`는 가끔 있으나 최종 CI success.
5. **Windows 실제 제출물:** 사용자가 Windows Chrome155에서 짧은 PDF 및 편집기 화면 제출. PDF 1p A4 `594.96×841.92pt`, 맑은 고딕 embedded+Unicode, 한글 원문 추출 가능, 편집기 UI 인쇄 제외 확인. 이 PDF는 이미지 없는 1페이지라 Windows 대형 이미지/2페이지 이상·Edge 시각/글꼴·키보드까지 완료로 간주하지 않음. 실제 사용자 PDF 파일은 공개 GitHub 저장소로 옮기지 않음. 21항 전체 PASS는 아직 미확정, 일부 Chrome 부분 증거 기록.
6. **병합 판단:** HOLD. feature와 main은 diverged; main 문서 기록을 보존하며 실제 3-way merge/diff/새 CI 확인 필요. 사용자의 명시적 승인 전 main 기능 병합 금지.
7. **Repo/Paths:** `hibi89/astra_pdf_redesigner`, feature `feature/step2-full-20261018`; `docs/STEP2_PREMERGE_CODE_CI_AUDIT_2026-10-19.md`, Windows checklist `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `.github/workflows/ci.yml`, `README.md`. 기존 원본 roadmap/TXT/PNG·STEP1 v1 localStorage 삭제/수정 금지.
8. **기술/환경:** Node22, React19/TS/Vite/IndexedDB, `npm install`, `npm test`, `npm run build`, `npm run dev`. Local 127.0.0.1. No Vercel/Production, 외부 AI API 없음.
9. **다음 1단위:** 이미 Linux Chrome 자동 검사 통과한 것은 반복 검증 최소화. 남은 Windows Edge/이미지 포함 장문 수동 검수 범위를 사용자와 합의하되 사용자 PC 개입 요구 최소화; 병합 승인 후 main 최신 문서 보존하며 병합 및 main CI 검증. STEP3는 별도 사용자 지침 후.
10. **진행률/시간:** 2026-10-19 02:14 KST. STEP2 약 **97~98%**, 전체 7단계 단순 동등 비중 약 **28~29%**. 5%p 유의미한 상승 아님. 검증 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`, Actions #39148544554 성공 확인.


## 최신 인수인계 — 2026-10-19 02:24 KST (Linux Microsoft Edge 155 실제 A4 PDF/저장 E2E)
1. **목적:** Astra PDF Redesigner p5, STEP2 개인 문서 제작기 마무리. 기존 PDF 본문 보존·재디자인은 장기 목표(STEP3~7 미착수). 사용자 반복 수동테스트 최소화, 자동 가능한 것은 CI 수행.
2. **변경:** `feature/step2-full-20261018`의 `.github/workflows/ci.yml`에 Edge 필수 단계 추가. `microsoft-edge` 탐지 실패시 **exit 1**; 제품 버전 출력 및 Poppler 확인 후 Edge 실행 경로로 기존 `tests/browser-smoke.mjs`, `tests/step2-browser.mjs` 두 CDP 테스트를 실제 실행. 앱 React/IndexedDB 기능 코드는 변경하지 않음.
3. **검증:** [Actions #39149195481](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481) **SUCCESS**; 검증 소스 SHA `34352fd4e92ca43641da3b4d9de3070232276497`. Microsoft Edge `/usr/bin/microsoft-edge` **155.0.4283.45**, STEP1 A4 PDF15p/텍스트 추출/편집 UI 제외 PASS, STEP2 IndexedDB 저장, PNG/JPEG/WebP 원본 및 PDF raster, JSON 가져오기·내보내기, 긴 캡션/대형 이미지 A4, QuotaExceededError·이미지 교체 중지 복구, 레거시 화면 전환 테스트 PASS. 기존 Google Chrome 전수·Node 16/16·TS 빌드도 PASS.
4. **검증 범위/한계:** 실제 **Ubuntu Linux Edge** 자동 검증이며 사용자 **Windows Edge 실제 PDF/글꼴·시각 검수는 미완료**. 사용자가 제출한 Windows Chrome 1페이지 A4 한글 PDF 부분 증거는 존재, Windows 다페이지/이미지 및 키보드 조작 별도. Edge에서는 browser-smoke/step2-browser 두 스모크만 실행(Chrome 별도 멀티탭/프로필간 이식 스크립트의 Edge 재실행은 아님).
5. **완료/병합:** STEP2 자동 검증 중심 약 **98~99%**(비공식 추정), 7단계 전체 동일 비중 약 **28~29%**. 사용자 수용/Windows 잔여 사항 및 명시적 승인 전 **main 기능 미병합 HOLD**, STEP3 미착수.
6. **GitHub 파일/refs:** 저장소 `hibi89/astra_pdf_redesigner`, 브랜치 `feature/step2-full-20261018`; 검증 코드 `34352fd4e92ca43641da3b4d9de3070232276497`, `docs/STEP2_EDGE_CHROMIUM_CI_VALIDATION_2026-10-19.md`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`, `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `README.md`. main은 기존 STEP1 코드 보존.
7. **테스트 환경:** GitHub Ubuntu Node22 + Chrome + Microsoft Edge 155, Vite localhost 127.0.0.1:4173, npm test/build, Poppler. 타이밍 이슈와 임시 프로필 cleanup `ENOTEMPTY` WARN은 사용자 데이터 실패와 구별. Production/Vercel 미배포.
8. **데이터/보안:** 실제 사용자 v1 localStorage·v2 IndexedDB, 로드맵 원본 TXT/PNG, 원본 지침 무변경. 테스트는 합성 임시 Chrome/Edge 브라우저 프로필에서만 실행; 사용자 PDF 원본은 GitHub 공개 업로드 금지, API 키 없음.
9. **다음 1단위:** main과 feature의 병합 준비·충돌·원본 안전성 및 사용자 승인 전제 조건 재확인. Windows Edge 실제 A4/한글/사진·키보드 미검증은 남기되 자동 검사를 반복해 사용자에게 재요구하지 말 것. 명시적 병합 승인 전 main 변경 금지.
10. **기준:** 2026-10-19 02:24 KST, Actions #39149195481 SUCCESS·Edge 바이너리/버전·실제 테스트 로그 확인. STEP2 약 98~99%, 전체 28~29%, 5%p 이상 상승 아니므로 전체 진행률 변동 별도 선언 불필요.


## 최신 인수인계 — 2026-10-19 02:43 KST (STEP2 main 격리 3-way 병합 실제 통과)
1. **목표/현재:** `hibi89/astra_pdf_redesigner` p5 STEP2 개인 문서 제작기를 기존 STEP1 main에 안전하게 병합할 수 있는지 실환경 검증. 최종 기존 PDF 본문 추출/재디자인 STEP3~7은 아직 미착수. 사용자는 반복 수동검수 최소화 희망.
2. **이번 변경:** `feature/step2-full-20261018`에 `.github/workflows/step2-merge-preflight.yml` 신규: GitHub Actions `contents:read`, checkout `fetch-depth:0`, `persist-credentials:false`, `main` detached HEAD에서 실제 `git merge --no-commit --no-ff FEATURE_SHA` 수행한 뒤 **merge commit/push 없이** 검수. 앱 기능 원본 코드 수정 없음.
3. **병합 결과:** [Actions #39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) **SUCCESS**; 시험 조합 main `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a` + feature `8d9fdb1adef31875a793cce9376de3154eb08229`. diverged 73 ahead/32 behind, Git 충돌 0, `git diff --name-only --diff-filter=U` 빈 결과, staged 28개 경로, HEAD는 여전히 main/ MERGE_HEAD feature 일치.
4. **데이터·원본 불변:** main `HANDOFF.md`, `STATUS.md`, `src/App.tsx`, `src/storage.ts`, 원본 roadmap TXT, STEP1/BLUEPRINT spec, PNG 2개 및 feature STEP2 원본 지침을 병합 트리에서 원본 파일에 `cmp`로 바이트 비교 **모두 PASS**. 테스트용 합성 문서만 사용; 사용자 실제 브라우저 데이터 변경 없음.
5. **병합 트리 기능 증거:** Node16/16, TypeScript/Vite build, 실제 Chrome STEP1 A4 15p 및 STEP2 이미지/JSON/저장·2탭 Web Locks·V1 migration abort/재시도·프로필간 JSON 이식 **PASS**. 실제 Microsoft Edge 155에서 STEP1 A4·STEP2 PNG/JPEG/WebP/긴 캡션/IndexedDB 저장 오류 복구 **PASS**. 동일 feature 자체 CI #39150537297 SUCCESS.
6. **경계/승인:** **main 실제 병합 미진행 / STEP2 사용자 최종 수용 HOLD**. Windows Chrome에서 사용자가 제출한 1p A4 한글 PDF 일부 PASS; Windows Edge 사용자가 생성한 이미지/긴 문서 출력·키보드 육안 수동검수 미확인. 사용자 승인 전에 main merge 금지. Status/Handoff 갱신으로 main docs-only HEAD가 변하면 **병합 직전 최신 main+feature SHAs로 preflight 재실행 필수**.
7. **저장소/증거:** `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`에 SHA/28 files/CMP/모든 통합 테스트 기록, `.github/workflows/step2-merge-preflight.yml` 계속 feature push마다 검사. 기존 원본 `docs/ASTRA_ORIGINAL_ROADMAP.txt`, `docs/blueprints/*.png`, STEP2 지침 TXT 불변.
8. **배포/보안:** GitHub Ubuntu Node22, headless Chrome+Edge, Vite localhost. 사용자 원본·비밀/토큰 접근/외부 공개 없음. Production/Vercel 미배포. GitHub main 브랜치 기능은 STEP1 상태 유지.
9. **다음 1단위:** 실사용 Windows의 미확인 항목을 명시하며 STEP2 수용/병합 승인 판단. 사용자 명시적 승인이 있으면 최신 main/feature 재확인·preflight 재실행 → 실제 병합 및 main 전체 CI/원본 보존 검증. STEP3 시작은 이후 별도.
10. **진행률:** 2026-10-19 02:43 KST STEP2 자동·기술 관점 약 **99%** 비공식, 전체 동일 비중 7단계 **약 28~29%**, 전체 5%p 이상 상승 아님. 시험한 feature SHA `8d9fdb1adef31875a793cce9376de3154eb08229`, Actions #39150537369 최종 success 로그 확보.


## 최신 인수인계 — 2026-10-19 02:52 KST (p5 STEP2 Draft PR #2)
1. **목적:** STEP1 원본 편집기·v1 localStorage를 유지하며 STEP2 React/TS/IndexedDB/이미지·JSON/A4 제작기 브랜치를 main에 검토용 등록. STEP3 PDF 원문 추출/재디자인은 아직 미착수.
2. **결과:** [Draft PR #2](https://github.com/hibi89/astra_pdf_redesigner/pull/2) **open / draft=true / merged=false**. Head `feature/step2-full-20261018`, base `main`. 생성 후 GitHub API `mergeable=true`, `mergeable_state=clean` 확인(당시 head `d94fdd831ce53b3afb4e02eea640c93c3209cc94`, base `e9044998f6f05cb41d13e339e6e8424e37ef62bb`). PR 설명에 기능·테스트·Windows 수동 미검증·수용 체크리스트 및 승인조건 작성. **실제 merge 하지 않음**.
3. **검증:** 기존 preflight [#39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369) SUCCESS(기능 `8d9fdb1adef31875a793cce9376de3154eb08229` + main `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`), 파일 바이트 보존·Node16/16·빌드·Chrome/Edge E2E PASS. **현재 PR HEAD와 시험 SHA는 달라 최신 HEAD의 전체 preflight PASS로 단정하지 않음**. GitHub mergeable=clean은 충돌 없음 표시에 한정.
4. **사용자 부분 검수:** 실제 Windows Chrome155 1p A4 PDF 한글·폰트 임베딩·텍스트 추출·앱 UI 제외 부분 PASS. Windows Edge 실 PDF, Windows 이미지/다페이지/키보드 최종 수동 검수 미완료. 자동 가능한 항목은 모두 CI로 처리; 반복적인 사용자 조작 요구는 최소화.
5. **판정:** STEP2 main 통합 PR은 **Draft 상태 HOLD**, 사용자 명시적 main 병합 승인 전 merge 금지. 사용자 남은 수동/시각 문제 수용 여부도 별도 확인 필요.
6. **Repository/docs:** `hibi89/astra_pdf_redesigner`, `feature/step2-full-20261018`; PR #2, `docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md`, `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`, `docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md`, `README.md`. main STATUS/HANDOFF는 문서만 변경, STEP1 앱 기능은 그대로.
7. **실행/환경:** Node22 npm test/build, GitHub Actions Ubuntu Chrome+Microsoft Edge 155, 로컬 Vite, no Production/Vercel. 원본 로드맵 PNG/TXT, STEP2 지침 TXT, 사용자 localStorage/IndexedDB 그대로. 외부 API 키 없음.
8. **유의:** 현재 main doc 갱신으로 PR base SHA가 또 변할 수 있으므로, 병합 직전 최신 PR head/base 재조회→isolated preflight 재실행. 중요 자료 원본 변경/유실 막기.
9. **다음 1단위:** 사용자 별도 승인 요청 시 잔여 Windows Edge 시각 검수 수용/추가 실행 중 선택→(승인된 경우) 최신 HEAD 기준 병합 사전검사 및 main merge·새 main CI. 승인 없으면 PR Draft 유지.
10. **진척도:** 2026-10-19 02:52 KST, STEP2 기술 구현 약 **99%**, 전체 7단계 동일 가중 약 **28~29%** 비공식 추정; 실사용 최종 수용/병합 미완료. 5%p 의미 있는 상승 없음.


## 최신 인수인계 — 2026-10-19 (main Edge CDP 자동검사 복구 SUCCESS)
1. **p5 프로젝트:** `hibi89/astra_pdf_redesigner`, PR #2 STEP2 개인 문서 제작기 **main 병합 완료**, merge SHA `f1ad26320b12b07019b115f77f8cf55e62f1e7e6`.
2. **병합 직후 main 실패:** [Actions #39155133495](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39155133495) FAILURE: Node16/16/빌드/Chrome 전수 PASS, Edge STEP1 CDP `/json/version` 제한시간 초과. 로그 Edge `DevTools listening` 출력 확인, D-Bus 경고는 원인 미확정.
3. **새 지시로 복구 실행:** tests `browser-process.mjs`가 프로필별 DevToolsActivePort에 기록된 WS URL에 직접 연결/핸드셰이크(+stderr/종료 진단); 5개 브라우저 스모크 수정. CI `edge-validation`을 Chrome과 다른 Ubuntu runner로 분리. 앱 `src/**` 변경 없음.
4. **검증 성공:** main 기능/CI 코드 SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`, [Actions #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624) SUCCESS, 독립 jobs `build-and-test`, `Microsoft Edge A4 PDF and IndexedDB` 모두 success. Node 16/16, build, Chrome 장문/이미지/IndexedDB·2탭 Web Locks·V1 migration abort·JSON A→B, Edge 실 A4/이미지·장문·저장 오류/복구 전수 PASS.
5. **산출 보고:** `docs/STEP2_POSTMERGE_MAIN_CI_RECOVERY_2026-10-19.md`. 기능 코드 변경 0, CI/테스트 파일 7개 수정. main 새 docs-only HEAD가 생기면 **검증된 실행 SHA는 `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`**라고 분리 표기할 것.
6. **미완료:** 사용자 실제 Windows Edge A4/한글, Windows Chrome/Edge 2페이지 이상 장문·이미지 PDF 육안, 키보드·작은 화면/Windows간 JSON 이식 등 *NOT RUN*. 사용자는 잔여 위험을 main 병합에 대해 수용했으나 STEP2 Windows 최종 수용을 완료했다고 표시하지 말 것.
7. **다음:** STEP3 PDF import/재디자인 미착수. 사용자 별도 `ㄱ` 또는 명시 지시로 진행 방향 결정; 현재 응답에서는 새 기능 개발하지 않음. 실제 상용 사용 전 Windows 수동 체크리스트 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`를 완료해야 함.
8. **진척도:** STEP2 기술적 기능 약 99% / 전체 7단계 동일 비중 약 28~29%의 비공식 추정 유지. STEP2 전체 검증 PASS는 아님.


## 최신 인수인계 — 2026-10-19 STEP3 첫 PDF 가져오기 MVP (p5)
1. **기준:** `hibi89/astra_pdf_redesigner` 안정 main은 STEP2까지 병합된 상태, 기존 성공 CI #39157047624. 원본 로드맵 `docs/ASTRA_ORIGINAL_ROADMAP.txt` STEP3 §5를 우선한다. STEP1/2 저장 자료·앱 기능 원본 변경 금지.
2. **현재 작업:** `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) **open/draft**. main 앱 코드 미병합. STEP3 PDF 가져오기 첫 세로형 MVP 구성.
3. **소스:** `src/step3/pdf.ts` PDF.js `6.4.299` + worker bundled `?url`; `structure.ts` 좌표 기반 단일 열 읽기순서·제목/본문/캡션 추정·경고; `convert.ts` STEP2 문서 변환; `ImportPanel.tsx` 원본 Blob PDF 뷰어와 추출검수·수정·명시적 확정; `src/step2/model.ts` caption 및 출처 좌표 optional 호환; `useWorkspace.ts` 원자적 새 문서 저장; `Workspace.tsx` 통합. `pdfjs-dist` Apache-2.0.
4. **테스트:** feature 구현/검증 코드 SHA `e216866a592362342ac6dd2ca2105b71799cc8fc` 및 [Actions #39159350165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39159350165) **success**. Node **21/21 PASS**, TS/Vite build PASS, 기존 Chrome/Edge STEP1/2 회귀 + 실제 양 브라우저 STEP3 합성 PDF 업로드→원본대조·새로고침·새 A4 재출력 E2E PASS. 실패했던 첫 타입 컴파일은 PDF.js v6 TypeScript API 차이 수정 후 해결.
5. **안전:** PDF bytes 브라우저 내 처리, 외부 서버/CDN 없음; 원본 PDF 영구 DB 저장하지 않음, 확인 전 기존 문서함 변경 없음, 저장은 새 문서+ACTIVE 단일 transaction. 텍스트를 임의 재작성하지 않으며 읽기순서·줄바꿈·공백 추정 경고.
6. **아직 안 된 것:** 실제 단순 PDF 5~10개 원본/추출 비교, PDF 이미지 복원(현재 이미지 명령 감지 및 경고), 다단/표·암호/스캔 OCR, Windows 현장 테스트. 이전 STEP2 Windows Edge 실제 PDF·장문 이미지·키보드 NOT RUN 계속.
7. **보고/목표:** `docs/STEP3_PDF_IMPORT_DESIGN_2026-10-19.md` 및 `docs/STEP3_MVP_IMPLEMENTATION_AND_CI_2026-10-19.md`는 **feature**에만 존재. 이번에는 Step3 코드 `main`에 병합하지 않았으며 명시적 승인 전 Draft 유지.
8. **다음 작업:** 다양한 합성 텍스트·혼합 이미지 페이지에서 원본 대조 정확도 측정, 추출 누락 위험 신호 및 PDF 이미지 추출 경로 검증, CI 강화를 진행. 실제 사용자 PDF는 승인 없이 GitHub에 업로드/공개하지 말 것.
9. **진척도:** STEP3 약 45~50% 비공식 (첫 MVP 자동 검증 관점), 전체 동등비중 7단계 약35% 비공식. 실제 시간/품질 35% 완성이라는 뜻 아님.


## 최신 인수인계 — 2026-10-19 STEP3 이미지 복원·다페이지 검증
1. **기준:** p5 `hibi89/astra_pdf_redesigner`. main은 STEP2 안정 코드 보존. STEP3는 `feature/step3-pdf-import-20261019`, [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)에서만 구현, main merge 금지(명시적 승인 전).
2. **새 구현:** `src/step3/imageRecovery.ts` 브라우저 PDF.js 이미지 operator CTM/viewport 좌표, 일반 XObject/inline 디코딩 픽셀→PNG, 마스크/회전/그룹/반복/잘못된 좌표 미지원 경고. `pdf.ts` 이미지 복원 호출, `structure.ts` 페이지 순서·여러 열 경고 및 감지/복원/미복원 건수, `ImportPanel.tsx` 복원 PNG 미리보기·개별 포함/제외·명시 확인. `convert.ts` 새 V2 이미지 블록/Asset 변환·근사 위치, `src/step2/{model,useWorkspace}.ts` 원본 좌표(선택)·문서/PNG/active 원자 저장.
3. **CI 판정:** 구현/검증 SHA `53c56e47a10606e381d4f5593695b7ca11bc7733`, [Actions #39162038601](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39162038601) **SUCCESS**; Node26/26·build, 기존 STEP1/2 Chrome·Edge E2E/저장·멀티탭/프로필간 JSON 회귀 PASS. 실제 Chrome/Edge 합성 **2페이지** PDF 컬러 이미지 1건 감지/복원/미복원0, 원본 비교→새 V2 문서·PNG 저장→리로드→A4 PDF raster 이미지 포함/`pdftotext` 첫-끝 순서 PASS.
4. **증거:** feature `docs/STEP3_IMAGE_RECOVERY_MULTIPAGE_VALIDATION_2026-10-19.md`, `docs/STEP3_PDF_IMPORT_DESIGN_2026-10-19.md`, `docs/STEP3_MVP_IMPLEMENTATION_AND_CI_2026-10-19.md`. 중간 실패 run은 문구/TS 타입/체크박스 선택자/비동기 로딩 경합 수정과 구분, 마지막 성공 run만 최신 PASS 증거.
5. **제한:** PNG **재인코딩**, 원본 이미지 bytes 보존 아님; 이미지 마스크·회전·그룹/반복·클리핑/벡터·다단/표 문서의 완전 복원 아님. 고용량/다량 XObject 실물 성능과 정확도 미검증.
6. **추가 수용:** 실제 사용자 PDF 5~10개 대조 및 Windows Chrome/Edge 실 PDF·장문/이미지·키보드 육안 NOT RUN. STEP2 Windows 미완료 검수 별도 유지. 실제 사용자 PDF를 공개 저장소에 올리지 않음.
7. **다음 `ㄱ`:** 누락/복잡 이미지 합성 fixture 확대, 페이지 순서 모호성·오류 계측, 실문서 샘플 수용 검증 기준 강화. PR #3은 Draft 유지. STEP4 선착수 금지.
8. **진척도:** STEP3 비공식 약65~70%, 전체 단계 동등비중 약38%(이전35% 대비 +3%p). 기능/CI 검증 SHA와 문서만 갱신된 feature HEAD는 구분. STEP3 최종 전체 수용 아님.

## 2026-10-19 10:29:29 KST — STEP3 이미지 실패 경계 테스트 1단위 인수인계
1. **목표·용도·기술**: 로컬 PDF 업로드→내용 확인→재디자인 PDF, 이번은 PDF.js operator list 미지원 이미지·위치 오류의 무음 누락 방지 회귀 테스트에 한정.
2. **변경/판단**: 기능 수정 없이 `tests/step3-image-recovery.test.ts`에 3건 추가. 실제 클리핑/벡터 이미지 복원을 주장하지 않으며, 미지원/위치 오류는 검수 경고로 집계하도록 기존 구조를 검사.
3. **검증/미검증**: GitHub commit `2200836cc529f4272e78456783d36e50f6b0142c`, blob `794a361b114df268390a8163b86dbd756fcf72d6` 재조회 완료. commit workflow 조회 결과 0건, status 빈 배열. **신규 테스트 실행·빌드·브라우저 CI 미검증**. 기존 CI #39162038601 성공은 이전 SHA에만 적용.
4. **상태/중단 지점**: STEP3 기능 브랜치 Draft PR #3 유지, main 병합 금지. 테스트 반영 완료 / 실행 확인 대기 / 실제 문서·Windows 현장 검수 대기.
5. **오류/원인/재시도 금지**: 신규 코드 오류는 아직 관측되지 않음. GitHub Actions 실행 결과를 커넥터가 제공하지 않아 합격 판정 불가. 같은 조회 방식 반복만으로 합격 주장 금지. 추후 CI 런 ID 또는 사용 가능한 실행환경 확보 후 테스트.
6. **저장소/브랜치/SHA/경로**: `hibi89/astra_pdf_redesigner` / `feature/step3-pdf-import-20261019` / `2200836cc529f4272e78456783d36e50f6b0142c`; `tests/step3-image-recovery.test.ts`, 기존 `src/step3/imageRecovery.ts` 변경 없음. main 인수인계 문서만 별도 갱신.
7. **배포/환경**: Vercel/Production 미적용. Node22 `npm test` → `npm run build`, CI Chrome/Edge 스모크는 실행 확인 대기.
8. **원본/백업/보안**: 원본 Git SHA와 Git history로 복구. 브라우저 localStorage/IndexedDB, PDF/이미지 사용자 원본, 로드맵·PNG 보호. 합성 테스트만 사용; 민감 데이터·토큰 미출력.
9. **다음 확정 작업/완료 기준**: 이번 신규 커밋의 3개 Node 테스트 및 종전 회귀 전체 CI를 검증한다. 통과 근거 없으면 테스트 완료나 진행률 상승 주장하지 않는다. Windows 실사용/사용자 PDF 수용 검사는 별도.
10. **시각·검증 범위**: 2026-10-19 10:29:29 KST. 이번 검증은 소스 반영과 blob 재조회까지. 문서 자체의 최신 HEAD는 저장 후 별도 확인. STEP3 65~70%, 전체 약38%는 종전 비공식 추정 유지.

## 2026-10-19 10:48:52 KST — STEP3 신규 회귀 검증·Edge CDP 초기화 실패 최소 수정 인수인계
1. **목표/기술·요구:** 기존 PDF 콘텐츠 우선 보존→검수→재디자인 PDF 출력. 로컬 React/TypeScript/Vite+PDF.js/IndexedDB, 이번 한 단위는 STEP3 신규 이미지 누락/좌표 회귀의 실제 CI 검증.
2. **완료 기능·변경 이유:** 사용자 이전 `ㄱ`에서 추가한 이미지 마스크/반복·그룹, 페이지 밖/제로 영역, 복구된 graphics-state 3개 회귀를 검증. Edge 첫 CDP 접속이 느린 CI 환경에서 제한시간 35초를 넘은 로그 확인 후 `tests/browser-process.mjs`만 수정, **Edge만 60초 / Chrome 35초**. `src/**`, STEP1/2 사용자 파일·브라우저 저장 데이터·오리지널 로드맵 변경 없음.
3. **테스트/성공·실패:** 구 SHA `2200836cc529f4272e78456783d36e50f6b0142c` Actions [#39185454384](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39185454384) **실패(Edge CDP 최초 연결 timeout)**, Node 29/29·빌드·Chrome 전수 성공. 최신 검증 SHA **`aa63fc262d0a2db080be4be82bd91d7b4a5b3976`**, Actions [#39186875371](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39186875371) **전체 SUCCESS**, Node 29/29 PASS, 0 FAIL, TypeScript/Vite build PASS, Google Chrome STEP1/2/3 회귀 PASS, Linux Microsoft Edge 155 STEP1/2/3 PDF·이미지·저장 E2E PASS. Chrome/Edge 두 job logs 직접 확인. Windows 수동 결과 미검증.
4. **완료/대기/중단:** 단위 목표인 최신 SHA CI 검증과 Edge 초기화 복구 **완료**. STEP3 전체 65~70% 비공식, 전체 7단계 동일가중 약38% 유지. STEP3 PR #3 **Draft/open/unmerged**, main 기능 미병합. 실제 사용자 PDF 및 Windows Edge/긴 문서 육안 수용 대기.
5. **오류/원인·시도·금지:** 실패 로그 Edge `DevTools listening` 표시 후 CDP WebSocket handshake timeout `35000ms`; 이전 성공 Edge 최초 연결 ~24초, CI 변동성 확인. D-Bus 경고는 확정 원인 아님. 동일 커밋에서 실패한 Edge 전수 회귀를 새 SHA의 **60초 제한**으로 성공시키며 재검증. 임의로 이 timeout을 계속 늘리거나 CI를 우회 성공 처리하는 방식 금지. Chromium 임시 프로필 cleanup `ENOTEMPTY`는 아직 간헐적 경고이며 사용자 데이터 손상 증거 아님.
6. **저장소/브랜치/SHA·경로:** `hibi89/astra_pdf_redesigner`, `feature/step3-pdf-import-20261019`, CI 검증 기능 SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976`; `tests/browser-process.mjs`, `tests/step3-image-recovery.test.ts`, `.github/workflows/ci.yml`. main 문서 저장 후 HEAD 재조회 필요. PR #3은 Draft 유지.
7. **Production/명령/환경:** 앱 로컬, Vercel/Production **미적용**. `npm install`, `npm test`, `npm run build`, `npm run dev` (`127.0.0.1:5173`). Actions Ubuntu Node22 Chrome+Microsoft Edge155, Poppler `pdfinfo`, `pdftotext`, `pdfimages`.
8. **원본·백업·인증/보안:** STEP1 localStorage v1, STEP2 IndexedDB v2 기존 문서 및 원본 `docs/blueprints/*.png`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`, 사용자 실제 PDF 수정·업로드 금지. Git 이력과 커밋 SHA로 기능 원상복귀 가능. 합성 픽셀/텍스트만 Actions 실행; 토큰 없음.
9. **다음 작업/기준/승인:** 다음 `ㄱ`에서 **복잡 이미지(마스크·반복/그룹/클리핑) 누락 경고 fixture 1단위 강화**. 재구성 품질/배치/글꼴은 실문서 원본과 육안 대조를 별도 수행. STEP3 main 병합 전 원본 손실 평가·최신 main/feature 병합 사전 검증·사용자 승인 필요. Windows 검증이 없으면 100%/상용 수용 완료 선언 금지.
10. **갱신 KST/검증 시점/기준:** 2026-10-19 10:48:52 KST, GitHub run #39186875371 `completed/success` (updated_at 2026-10-19T01:48:25Z)와 두 job 로그 및 PR Draft/HEAD 직접 확인. 기능 검증 코드 `aa63fc262d0a2db080be4be82bd91d7b4a5b3976`. 문서 HEAD는 최종 재조회로 확인.

## 2026-10-19 11:03:17 KST — STEP3 실제 클리핑 PDF 검증 1단위 인수인계
1. **목표·용도·확정 요구·기술:** 로컬 PDF 원문 추출/검수 → 재디자인 후 A4 출력. 콘텐츠 보존 우선, PNG 원본 동등성 비보장. React/TS/Vite/PDF.js/IndexedDB. 이번은 STEP3 클리핑 그래픽 차이의 무음 누락 방지와 실제 합성 PDF 시험.
2. **완료·변경·판단 근거:** 단순 무조건 PNG 복원으로 클리핑 영역이 달라질 수 있는 기존 문제에 대해 2안 비교: (A) 클리핑 경로 직접 크롭 재현(복잡/고비용/품질 리스크), (B) `clip/eoClip` 활성 상태 추적·원본 대조 경고(저비용, 기존 이미지 유지). B 적용. `src/step3/imageRecovery.ts` 그래픽 상태에서 클리핑만 보수적으로 추적하고 `problems`에 advisory 추가(미복원 이미지 숫자는 오염하지 않음). 이 구간에서 실제 크롭/클리핑 픽셀 재현은 하지 않음.
3. **테스트 명령·성공/실패·범위:** `npm test` **31 PASS/0 FAIL/0 SKIP**(이전29 +2), `npm run build` PASS. 실제 GitHub Actions [#39187963241](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39187963241) **SUCCESS** (코드 SHA `d0444b5138c29acebbe2d80ed187165a4dacd237`, 완료 2026-10-19 02:03:17Z). Linux Chrome와 Microsoft Edge155의 STEP1/2/3 E2E, 실제 합성 PDF에서 클리핑 경고/이미지 감지/미확정 DB 불변, 기존 2페이지 이미지 PDF 저장·재인쇄 회귀 PASS. Edge job `117854290424`, Chrome/build job `117854290640`; 각 로그 `PASS STEP3 CLIPPED XOBJECT PDF` 확인. Windows 실제 장문·이미지 출력/사용자 PDF 품질은 **미검증**.
4. **완료/진행/대기/차단·중단:** STEP3의 본 1단위 기능·테스트/CI **완료**, STEP3 전체 **미완료**. `feature/step3-pdf-import-20261019` [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) **open/draft/unmerged**, main 기능 병합 보류. STEP3 약65~70%, 전체 약38% 비공식 추정 그대로.
5. **오류·실패·원인·재시도/대안:** 금회 최종 CI 실패 없음. 기존 누락: clip operator 존재해도 이미지 PNG 복원에 크롭 차이 경고가 없었음. 적용 방식은 보수적 경고이므로 실제 부분 클리핑 없음에도 경고가 뜰 수 있음. 정밀 클리핑/투명도/벡터 복원은 전혀 검증되지 않으며, 픽셀 동일성을 주장하지 말 것. 이전 Edge CDP 실패는 `tests/browser-process.mjs` Edge 60초 변경과 구분, 이번 CI Edge/Chrome 모두 PASS.
6. **저장소·브랜치·SHA·주요 경로:** `hibi89/astra_pdf_redesigner`; 기능 검증 `d0444b5138c29acebbe2d80ed187165a4dacd237`. `src/step3/imageRecovery.ts`, `tests/step3-image-recovery.test.ts`, `tests/fixtures/step3-clipped-pdf.mjs`, `tests/step3-browser.mjs`. 이전 검증 SHA `aa63fc262d0a2db080be4be82bd91d7b4a5b3976`. GitHub 연결 커미터 `hibi89` 확인. main STATUS/HANDOFF 문서 HEAD 별도로 확인.
7. **Production·Vercel·실행·환경:** Vercel/Production **미적용**(로컬 앱), `npm install`, `npm test`, `npm run build`, `npm run dev` → `http://127.0.0.1:5173`. Ubuntu GitHub Actions Node22 + Chrome + Edge155 + Poppler.
8. **원본·백업·인증·수정 금지:** STEP1 localStorage v1, STEP2 IndexedDB v2, 설계 PNG/TXT/로드맵, 실제 사용자 PDF 모두 보존·무변경. Git SHA 이력으로 기능 브랜치 수정 전 상태 복원 가능. 합성 PDF는 코드로만 생성, 실문서/토큰 외부 전송 없음. 기존 STEP1/2 기능 코드/main 배포 무변경.
9. **다음 작업 우선순위·절차·완료 기준·승인:** 다음 `ㄱ`은 STEP3 사용자 수용 준비를 위한 **새로운 PDF 품질/누락·원본-결과 대조 fixture 1단위**를 검증하고 근거 기록. 실제 사용자 PDF 5~10개와 Windows Chrome/Edge 인쇄·육안은 사용 가능한 원본/환경에서 별도 확인. main 병합은 최신 main+feature SHA 병합 사전검사 및 사용자 별도 승인 후. STEP4 선행 금지.
10. **일시·확인·문서 기준:** 2026-10-19 11:03:17 KST. GitHub CI run #39187963241 head_sha `d0444b5138c29acebbe2d80ed187165a4dacd237` / completed success, Chrome+Edge job 로그, PR Draft HEAD `d0444b5138c29acebbe2d80ed187165a4dacd237` 확인. STATUS/HANDOFF/BOOK 쓰기 후 GitHub SHA·재조회 검증. Linux E2E 증거 외 OS/실문서 미검증 구분.

## 2026-10-19 11:24:52 KST — STEP3 혼합 문서 원본 대조 E2E 최종 인수인계
1. **목표·용도·확정 요구·기술**: 로컬 PDF 업로드 → 원본 내용 보존·검수 → 테마 변경·A4 PDF 재출력. STEP3 단일 열 MVP에서 오차가 생기는 다단·표·이미지 혼합 PDF에 대해 실제 출력을 대조하는 수용 테스트 강화. React/TS/Vite, PDF.js, IndexedDB, headless Chrome/Edge, Poppler.
2. **완료·변경·결정 근거**: 2페이지 혼합 PDF fixture를 코드로 생성(2열 문장·벡터 격자 표·PNG 재구성 대상 이미지 1·13개 원본 마커). 픽셀/표 구조 동일성 평가는 재디자인과 충돌하므로 **원본/검수/재출력 13개 텍스트 식별자 정확성, raster 포함, A4, 원본 문서 불변**을 확인. 초기 다단 미경고를 발견해 `src/step3/structure.ts`에 PDF.js가 넓은 간격 텍스트를 합친 경우의 보수적 경고 휴리스틱만 보완. 기존 정상 데이터 흐름 유지.
3. **테스트 명령·성공/실패·미검증**: 첫 run [#39189111252](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189111252) **FAIL**(실제 Edge에서 다단 경고 누락). 최종 고정 기능 SHA `0c6061b40286d7a859d8505995ad253f48da9665`에서 [Actions #39189525347](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39189525347) **SUCCESS**: `npm test` **32 PASS/0 FAIL/0 SKIP**, `npm run build` PASS, Chrome STEP1/2/3 및 Linux Edge155 STEP1/2/3 브라우저/이미지/문서 E2E 모두 PASS. 각 job 실제 로그에서 다단 경고 `column= true`와 `SOURCE/REPRINT COMPARISON` 13/13 확인. Windows 환경, 실제 사용자 PDF 품질 및 벡터 표 구조는 **미검증**.
4. **완료/진행/대기·중단 지점**: 단위 테스트 구현·회귀·기능 검증 **완료**. STEP3 자체는 **미완료**, Draft PR #3 **open/draft/unmerged**. STEP3 main 기능 병합 및 Windows 장문/이미지 출력·사용자 PDF 5~10개 수용 대기. 추정 STEP3 65~70%, 7단계 전체 약38% 유지.
5. **오류·원인·시도·재시도 금지·대안**: 분리된 좌/우 텍스트가 PDF.js TextItem 하나로 결합되는 경우 이전 좌표 기반 `reconstructLines`가 다단을 놓칠 수 있는 문제(합성 PDF의 실제 Edge 검증에서 경고 미발생). 넓은 행의 문자/실제 폭 차이 2건 이상 조건으로만 경고 보강, 자동 텍스트 재배열 금지. 정상 폭넓은 텍스트도 경고할 가능성 있음. 표 선·셀 원형 복원과 다단 정밀 배치는 별도 설계/수용 단계이며 현재 정확성 증거가 없다.
6. **저장소·브랜치·SHA·주요 경로**: `hibi89/astra_pdf_redesigner` / `feature/step3-pdf-import-20261019`; 테스트 검증 SHA `0c6061b40286d7a859d8505995ad253f48da9665`; 문서만 후속 feature 커밋 `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5`. `tests/fixtures/step3-mixed-layout-pdf.mjs`, `tests/step3-browser.mjs`, `src/step3/structure.ts`, `tests/step3-structure.test.ts`. 보고 `docs/STEP3_MIXED_SOURCE_REPRINT_ACCEPTANCE_2026-10-19.md`. main 문서 HEAD는 이번 인수인계 커밋 재조회로 확인.
7. **Production·Vercel·명령·환경**: Vercel/Production **미적용**(로컬 웹앱), `npm install`, `npm test`, `npm run build`, `npm run dev` (127.0.0.1:5173). GitHub Actions Ubuntu Node22, Chrome, Linux Edge155, `pdfinfo`/`pdftotext`/`pdfimages`.
8. **원본·백업·인증·수정 금지**: 이전 기능 SHA `d0444b5138c29acebbe2d80ed187165a4dacd237` 복구 기준, Git history 보존. STEP1 v1 localStorage·STEP2 v2 IndexedDB, 원본 로드맵 및 PNG, 사용자 실제 PDF·개인정보·토큰 접근/수정/공개 금지. 새 테스트는 완전 합성 데이터만 쓰고 브라우저 격리 프로필로 검사.
9. **다음 작업 우선순위·절차·완료 기준·승인**: 다음 `ㄱ`은 PDF 실물 수용 품질을 위한 **열/표/벡터 정보의 보존 불가 경고·원본-결과 비교 측정 단위**를 하나씩 확장. 최종 사용자 실문서 5~10개는 사용자 원본을 확보한 승인된 로컬 환경에서 검수, 공개 GitHub 업로드 금지. STEP3 main 병합 전 최신 main/feature SHA 격리 병합 사전검사와 사용자 명시 승인 필요. Windows 수동 검수는 계속 NOT RUN으로 구분.
10. **갱신·확인 시각/검증 범위/기준 커밋**: 2026-10-19 11:24:52 KST; 기능 SHA `0c6061b40286d7a859d8505995ad253f48da9665`의 CI #39189525347 종료 2026-10-19T02:22:57Z, 두 job 실제 로그 검증; 문서-only feature SHA `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5` GitHub 커밋 확인(2026-10-19T02:24:52Z). 이 문서 수정 후 main SHA·중앙 BOOK SHA를 재조회해야 완료. CI 성공은 13마커·한 raster 합성 케이스에 한정, 상용 품질/Windows 수용 아님.

## 2026-10-19 13:27:43 KST — STEP3 벡터 표 구조 손실 위험 계측 1단위 인수인계
1. **확정 목표/요구/기술:** 로컬 PDF 원문 보존·확인·스타일 재구성. PDF.js/React/TS/Vite/IndexedDB. 이번은 표·도형 등 벡터 명령의 구조 손실 위험을 수치·경고로 보여주는 검사(벡터 구조 자동 재구성 아님). STEP1/2 및 사용자 원본 보존.
2. **완료 구현·선택 이유:** 원본 경로를 벡터 좌표로 완전 복원하는 고난도 방식 대신 PDF.js 경로 관련 operator **근사 건수**를 페이지별/전체 UI에 보고하여 손실 검수로 연결. `src/step3/vectorRisk.ts` 경로 관련 `constructPath` 묶음 우선/일반 stroke-fill 명령 fallback, `pdf.ts` 추출, `structure.ts` 경고 및 count, `ImportPanel.tsx` 총합·페이지별 표시. 도형/셀 개수·보존율이라고 주장하면 안 됨. UI 및 검사 외 데이터 변환·복원 알고리즘 변경 없음.
3. **실제 성공/실패·테스트 근거:** 최초 SHA `c1873cb73acd4f43a13b11d32aa735ddacfa9b1e`의 [Actions #39198865094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39198865094) **FAIL**(Node35/35·build PASS, Chrome/Edge 모두 원본 벡터 경로 0으로 E2E FAIL). 원인: PDF.js 경로의 최적화 `constructPath`를 기존 단순 stroke/fill 계수가 놓침. 수정 후 **코드 SHA `f132adbeb70ea43c38cecfb3841b36cbd773951b`**, [Actions #39199224379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39199224379) `completed/success`, Node35/35·TS/Vite·Chrome/Edge155 STEP1~3 E2E 전체 PASS. 두 job에서 `PASS STEP3 MIXED VECTOR RISK` 원본 관련 명령 **3회**, `PASS STEP3 SOURCE/REPRINT COMPARISON` 원본 13/13 텍스트·A4 raster·기존 문서 보호 확인.
4. **완료/대기/진행률/중단:** 이 **한 단위 코드·CI 완료**, STEP3 전체는 미완료. 기능 `feature/step3-pdf-import-20261019`, [PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) draft/open/unmerged, main STEP3 미병합·허가 없이 통합 금지. STEP3 비공식65~70%, 전체7단계 약38% 추정 유지. STEP4 미착수.
5. **실패 원인·재시도 전략:** 처음에는 paint command만 셌고 optimized path batches를 누락. 두번째는 `constructPath` 묶음 존재 시 묶음 수, 그렇지 않으면 paint op 수라는 **대안 방법**으로 성공. 수치가 도형·셀·선 수와 1:1 대응하지 않는 사실 명시. unsupported clipping, mask, rotate, annotations/OCR 및 표 원형 복원의 실패 가능성을 이 지표 하나로 확정 판정하지 말 것.
6. **저장소·브랜치·커밋·경로:** `hibi89/astra_pdf_redesigner`, CI 검증 `f132adbeb70ea43c38cecfb3841b36cbd773951b`; feature 보고서 docs-only 커밋 `63f43b1b94730a6a3e5d8e9232035a96157c20ae` (성공 CI 대상 아님). `src/step3/{vectorRisk,pdf,structure,ImportPanel}`, `tests/step3-vector-risk.test.ts`, `tests/step3-browser.mjs`, `docs/STEP3_VECTOR_STRUCTURE_RISK_VALIDATION_2026-10-19.md`. main STATUS/HANDOFF 최신 SHA는 저장 후 재조회.
7. **실행·CI 환경·배포:** `npm test` 35/35, `npm run build`, GitHub Actions Linux Chrome/Edge 155 headless with Poppler `pdfinfo/pdftotext/pdfimages`. Local `npm run dev` on 127.0.0.1:5173. No Vercel/Production deployment. Windows 실환경 브라우저 PDF 출력/육안 수용은 **NOT RUN**.
8. **원본·백업/인증·보안:** Git SHA `c06d74d1aedef5ccc5a263d28a76f73eed3ef4e5`는 금회 변경 전 feature HEAD. STEP1/2 저장소/사용자 실제 PDF/디자인 설계 PNG·TXT·원본 데이터 및 토큰 미변경·미출력. 합성 fixture만 테스트하고, 실제 사용자 PDF 공개 GitHub 업로드 금지. 원본 로컬 문서 무손상·검수 전 저장 방지 기존 테스트 유지.
9. **다음 `ㄱ` 작업·수용 기준·승인:** 경고 **오탐 또는 누락 위험**이 있는 합성 사례(텍스트 전용·이미지 전용·단순 장식·표 선)를 분리해 검사하고 UI 검수 항목/원본 대조 정확성 보완. 실제 사용자 PDF 5~10개는 보안이 확보된 사용자 승인 로컬 환경에서 검사. STEP3 main 병합 전 최신 main+feature 검증, Windows 실제 출력 검증과 별도 사용자 승인이 필요. 임의 본병합/STEP4 진행 금지.
10. **인수 일시·검증 범위:** 2026-10-19 13:27:43 KST. 검증 run #39199224379, head_sha `f132adbeb70ea43c38cecfb3841b36cbd773951b`, finish 2026-10-19T04:26:04Z, 두 job 결과/로그 직접 확인. docs-only SHA `63f43b1b94730a6a3e5d8e9232035a96157c20ae`. STATUS/HANDOFF와 project-book BOOK 최신 p5 행은 업데이트·재조회 필요. 완료 표기는 **경로 위험 계측 단위**, 실제 상용 PDF 표 복원 품질 아님.

## 2026-10-19 13:48:10 KST — STEP3 클립 오탐 제거·검수 4항목 인수인계
1. **제품 목표·요구·기술:** 기존 로컬 PDF 가져오기→원문·이미지·표/벡터 위험 감지→원본 대조 후 재디자인 A4. 콘텐츠 보존 우선. React/TS/Vite/PDF.js/IndexedDB, 외부 API 없음, STEP3 Draft PR #3.
2. **선택·구현:** PDF.js `constructPath`가 실제 표 선뿐 아니라 클리핑 마스크를 표현할 수 있음. 클리핑 전용 경로의 불필요한 '표/벡터 구조 위험' 오탐을 줄이되, 진짜 벡터 페인트의 경고는 유지. `src/step3/vectorRisk.ts`의 선행 `clip/eoClip` 및 후행 `clip/eoClip` 판별, 명시 페인트 있는 경우 보수적으로 집계. `src/step3/ImportPanel.tsx`의 네 부문 원본 대조 **안내** 체크리스트(항목별 확인 증빙은 아님).
3. **실패·실제 원인:** [Actions #39200328670](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200328670) `SyntaxError`(test quoting); [#39200525378](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200525378) clip-only 파일에서 벡터 1회 오탐; [#39200817859](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200817859)에서 진짜 PDF.js 명령 배열 확인: **`clip > constructPath`**. 기존 테스트 가정 `constructPath > clip`과 달랐음. 실제 PDF.js fixture 검증으로 원인 확정 후 최소 수정. 같은 추측 기반 반복 재시도 금지.
4. **자동 테스트·성공/미검증:** 최종 코드 SHA **`90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee`**, [#39200950625](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39200950625) `completed/success`, Node **38 PASS·0 FAIL·0 SKIP**, TypeScript/Vite build PASS, Chrome 및 Linux Edge 155 STEP1/2/3 브라우저 회귀 PASS. clip-only 합성 0회·이미지 경고 유지, mixed 2page synthetic raster+vector 3회, 원본↔새 A4 텍스트 13/13, 문서 저장 전 무변경/기존 문서 보존. **Windows/고객 실제 PDF·픽셀 대조 미검증**.
5. **완료·대기·정지 지점:** 이번 1단위 구현/자동 CI **완료**, STEP3 전체 기능 **미완료**, PR3 Draft/open/unmerged, main STEP3 미병합. STEP1/2 기능·로컬 사용자 원본 수정 없음. STEP3 약65~70%, 전체7단계 약38% 비공식 추정.
6. **저장소·브랜치·SHA·경로:** `hibi89/astra_pdf_redesigner`, `feature/step3-pdf-import-20261019`, 검증 코드 `90b4e7a7684bd1fb98f0c4dbe6c8678c6bc802ee`, feature 후속 문서 SHA `d1a89d8b6a96f72225208e5a9b1144e5413eaa92`. `src/step3/vectorRisk.ts`, `src/step3/ImportPanel.tsx`, `tests/step3-vector-risk.test.ts`, `tests/step3-browser.mjs`, `docs/STEP3_VECTOR_CLIP_FALSE_POSITIVE_AND_REVIEW_2026-10-19.md`. STATUS/HANDOFF 본 main 문서 HEAD는 저장 후 재조회.
7. **실행 환경·배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` on 127.0.0.1:5173. GitHub Actions Ubuntu Node22, Chrome+Edge155, Poppler PDF 점검. Vercel/Production 미적용. Windows 실사용 Edge/Chrome PDF 출력/키보드/장문 수용 **NOT RUN**.
8. **데이터/보안·원상복귀:** 사용자 PDF 업로드 없음; synthetic fixture만 Node/브라우저에서 동작. STEP1 localStorage v1·STEP2 IndexedDB v2·설계 PNG/TXT·STEP3 원본 기능·토큰 변경/노출 없음. `63f43b1b94730a6a3e5d8e9232035a96157c20ae`는 이 단위 이전 feature HEAD이며 Git SHA로 이력 비교/복구 가능.
9. **다음 한 단위·수용 기준:** clip+stroke/fill/투명도·PDF.js 최적화 조합에서 과잉 제외/누락 경계 테스트, 일반 텍스트/이미지 정상 사례 부작용 검증. 실문서 5~10개는 보호된 승인 로컬 환경에서 원본↔출력 수동 대조(문장/수치/표/이미지/순서) 별도. main 병합 전에 현재 main/feature 병합 사전 검증과 사용자 명시 승인. STEP4 무단 선행 금지.
10. **확인 시각·근거:** 2026-10-19 13:48:10 KST; run #39200950625 2026-10-19T04:46:15Z 최종 성공·코드 SHA 일치·두 job 로그 확인. 완료 판정은 **합성 PDF의 벡터 클립 오탐 단위와 UI 대조 안내**에만 적용, 실제 표/그래픽 완전 복원이나 상용 품질 인수 아님.

## 2026-10-19 14:06:12 KST — STEP3 실제 혼합 클립+페인트 경로 판정 인수인계
1. **사용자 목표·확정 범위·기술:** PDF 로컬 업로드→추출/원본 대조·수정→테마 재구성→A4 저장. 문장·숫자·이미지·표 내용 보존 우선. `pdfjs-dist 6.4.299`, React/TS/Vite, IndexedDB. 사용자 로컬 PDF 외부 업로드/자동 요약 금지, STEP3 Draft 단계.
2. **완료 구현·비교한 접근:** 단순 클립 인접 여부만으로 `constructPath`를 제거하던 방식은 동일 경로 `W S`의 실제 벡터 선을 누락. 이웃 연산자를 모두 위험으로 계산하면 클립-only 오탐 재발. 따라서 **실제 `OperatorList.argsArray[i][0]` packed terminal op**를 활용: `OPS.endPath`는 비페인팅, `OPS.stroke/fill`은 clip 동시 적용에도 그리기 위험으로 집계. 패킹 정보가 없는 경우 이전 보수적 추론 fallback. 산출 수치는 복원율/표 셀 수가 아니며 변환 출력에 벡터 선을 재구성하지 않음.
3. **실패·원인·수정·테스트:** [CI #39202071379](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202071379) 실제 PDF.js 합성 테스트 **38/39 PASS, W S 누락 FAIL**. [CI #39202172463](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202172463) 실제 실패 연산자 `clip > constructPath` 확인: `W n` `args[0]=28(endPath)`, `W S` `args[0]=20(stroke)`. 하드코딩 20/28 금지, `OPS` 상수 사용. 최근 최종 코드 SHA **`4b527401cc8bdba9218b9aba4fca5537e24c77cc`**, [#39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889) **완료·SUCCESS** Node **40/40·빌드·Chrome/Edge 155 STEP1~3 전체 PASS**. 실제 각 로그에 클립-only 0, clip+stroke 위험 양수, 2p 표 3, 13개 텍스트·이미지·A4·기존 DB 보존 확인.
4. **완료/대기/중단 지점:** 본 한 단위 기능+회귀 검증 **완료**. STEP3 전체 및 사용자 수용 **미완료**, `feature/step3-pdf-import-20261019` [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/unmerged, main STEP3 기능 미병합, STEP4 착수 금지. 진행률 비공식 STEP3 65~70%, 전체 약38% 유지.
5. **테스트 경계/위험·금지:** PDF.js의 최적화 Form XObject, transparency, 합성 clip/paint, 벡터 폰트·실표 구조, 픽셀 동일성, 다단 실제 내용 순서, Windows Chrome/Edge 수동 인쇄, 사용자 실제 PDF 5~10개 **미검증**. 검증은 합성 fixture 6종/packed terminal+브라우저 회귀까지만. 같은 누락 재발 시 추측성 명령 카운트를 늘리기보다 실제 `argsArray`와 공식 pdf.js 소스부터 확인.
6. **경로·커밋·브랜치:** `hibi89/astra_pdf_redesigner`, 기능 검증 `4b527401cc8bdba9218b9aba4fca5537e24c77cc`, 보고 docs-only SHA `90b7e995f263701e57aede91a8bf0e44b2778d80`. `src/step3/vectorRisk.ts`, `tests/step3-vector-risk.test.ts`, `tests/fixtures/step3-clipped-pdf.mjs`, `tests/step3-browser.mjs`, `docs/STEP3_MIXED_CLIP_AND_PAINT_RISK_VALIDATION_2026-10-19.md`. main STATUS/HANDOFF 문서만 별도 갱신·재조회, BOOK p5까지 동기화.
7. **환경·배포:** `npm install`, `npm test`, `npm run build`, `npm run dev` (127.0.0.1:5173). Actions Ubuntu Node22 Chrome+Edge155+Poppler. 로컬 도구, Vercel/Production 배포 없음. CI head SHA `4b527401cc8bdba9218b9aba4fca5537e24c77cc` 확인, docs commit은 CI 이후(성공 CI 범위 아님).
8. **원본/백업/보안:** STEP1 localStorage v1, STEP2 IndexedDB v2, 사용자 PDF/토큰/설계 원본 PNG·TXT 미변경. 테스트는 완전 합성 오프라인 PDF만 생성. Git 이력에서 전단계 `d1a89d8b6a96f72225208e5a9b1144e5413eaa92` 및 현 `4b527401cc8bdba9218b9aba4fca5537e24c77cc`로 비교/복원 가능. 원본 PDF 외부 공개 금지.
9. **다음 한 단위와 완료 기준/승인:** 투명도·Form XObject와 clip+paint 혼합 시 PDF.js 경고 누락/오탐을 실물 합성 PDF로 확장하거나, 실제 PDF 사용자 수용 기준을 마련. 성공 시 Node·빌드·Chrome/Edge 회귀 실제 검증 근거와 경고 한계를 기재. STEP3 main 병합/STEP4는 최신 SHA 병합 사전 검증과 사용자 명시 승인 전 금지. Windows·고객 5~10 문서 검수는 별도.
10. **최종 확인 시각:** 2026-10-19 14:06:12 KST, [Actions #39202420889](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39202420889) `completed/success` at 2026-10-19T05:04:16Z, two jobs log inspection. 이 인수인계의 완료 범위는 '동일 경로 W S 누락 방지 검증'이며 제품 완성/상용 품질이 아니다.

## 2026-10-19 14:19:35 KST — STEP3 투명도·Form XObject 검증 1단위 인수인계
1. **제품 목표/스택:** 브라우저 로컬 PDF 업로드→원본 텍스트·이미지·표/벡터 및 합성 리스크 표시→사용자 원본 대조·수정→디자인 PDF A4 재조판. React/TypeScript/Vite, PDF.js 6.4.299, IndexedDB. 원문 자동 수정/외부 업로드 금지.
2. **선택·기능:** 투명도가 포함된 Form의 원본 픽셀을 정밀 복제하는 A안은 구현/성능/품질 위험 크므로, **우선 위험 계측·검수 고지 B안** 적용. `src/step3/graphicsRisk.ts`에서 PDF.js `setGState`의 `CA/ca<1`, 비Normal BM, SMask 활성, beginGroup, Form begin 범위 합산 (투명 신호와 Form 범위 분리). `pdf.ts`/ `structure.ts` 경고 및 `ImportPanel.tsx` 총합·체크리스트. 원본 alpha를 PNG에 합성하거나 Form 변환을 1:1 재현하지 않음.
3. **검증 근거/실패:** 이번 단위 신규 실패 없음. `tests/fixtures/step3-transparency-form-pdf.mjs` 실제 1p A4 synthetic Form 내부 bitmap+vector, alpha0.4 transparency group vs alpha1 opaque form. 실제 operator probe commit `67646c0d4233df350b78c36f5e7d7de69ba3c424`, Actions [#39203296609](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203296609) **SUCCESS**; 기존 코드를 보존하고 이를 바탕으로 변경. 코드 SHA `1ebbb7958c477c309e22e24fed7255658f56b58b`, Actions [#39203639740](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39203639740) **SUCCESS**, Node **43/43 PASS**, build, Chrome/Edge155 STEP1~3 전체 PASS. 투명 Form 위험신호3/Form1, 불투명 Form 위험0/Form1. 이미지/벡터/13 marker 원본→출력·DB 기존 정상 회귀 유지.
4. **진행/대기/중단:** 이 단위 구현·자동 CI **완료**, STEP3 전체·실사용 인수 미완료. [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/unmerged, main STEP3 기능 병합 안 함, STEP4 착수 금지. 비공식 STEP3 약65~70%, 전체 7단계 약38% 유지.
5. **오류·위험·판정 경계:** PDF.js Graphics State와 XObject는 flattened operator 단계의 보수적 신호이며 투명 이벤트 수·Form 범위 수는 투명한 객체/표 셀/정확히 복원한 픽셀 수가 아님. 독립 Form/투명 그룹 합성이 새 PNG에서 유지되는지는 미검증. 출력 색·Blend/SoftMask·XObject nesting/annotation, Windows 실기, 실제 PDF 5~10개 수용 **NOT RUN**. 위험 0도 동등성/완전성 보증 금지.
6. **저장소/브랜치/SHA/경로:** `hibi89/astra_pdf_redesigner`, feature `feature/step3-pdf-import-20261019`, **CI 검증 코드 SHA `1ebbb7958c477c309e22e24fed7255658f56b58b`**, 후속 문서만 feature commit `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`. `src/step3/{graphicsRisk,pdf,structure,ImportPanel}`, `tests/fixtures/step3-transparency-form-pdf.mjs`, `tests/step3-transparency-form.test.ts`, `tests/step3-browser.mjs`, 보고 `docs/STEP3_TRANSPARENCY_FORM_RISK_VALIDATION_2026-10-19.md`.
7. **운영/환경/명령:** `npm install`, `npm test`(43/43 CI 성공), `npm run build`, `npm run dev` 로컬 127.0.0.1:5173. GitHub Actions Ubuntu Node22 Chrome+Edge155, Poppler. Vercel/Production 배포 없음. Chrome run job `117901675059`, Edge job `117901674699` 원본 로그에서 두 비교 PASS 확인.
8. **원본·보안·복구:** STEP1 localStorage v1, STEP2 IndexedDB v2·설계 원본 PNG/TXT 및 실제 사용자 PDF/민감정보·토큰 노출/수정 없음. 합성 데이터만 CI 사용. Git SHA `90b7e995f263701e57aede91a8bf0e44b2778d80`는 이 단위 전 기준; 비교/복구 가능. main 기능 파일 무변경·원본 문서 검수 전 저장 금지 회귀 유지.
9. **다음 한 단위·승인:** 중첩 Form/투명 SoftMask/Blend 실제 합성 PDF가 위험 수치를 감지하는지 확인, 필요 시 최소 코드만 수정하고 전수 회귀. 또는 고객 PDF는 사용자 동의·로컬 비공개 환경에서 실문서 5~10개와 Windows PDF/인쇄 육안 검수. 기능 main 병합 전 최신 main+feature 사전검사 및 사용자 **별도 명시 승인** 필요.
10. **갱신/검증 기준:** 2026-10-19 14:19:35 KST; #39203639740 `completed/success` at 2026-10-19T05:18:05Z head_sha `1ebbb7958c477c309e22e24fed7255658f56b58b`. 새 기능과 CI PASS만 완료 표기. feature docs-only SHA `faec84e388da0f7a6d71f71c1b8d14e18d9f3098`는 CI 이후 작성한 보고서. main STATUS/HANDOFF/BOOK.md 쓰기·재조회 후 최신 HEAD 확정 필요.

## 2026-10-19 14:48:11 KST — Windows 설치형 (Electron) 데스크톱 판매 준비 MVP 인수인계
1. **프로젝트/요구:** p5 Astra PDF Redesigner, 사용자는 크몽 고객에게 CLI 없는 Windows 설치형 프로그램을 주고 싶어 함. 현재 범위는 Electron 패키징 프로토타입이며 STEP1/2 stable main만 포함. STEP3 PDF 가져오기는 별도 Draft PR3에 존재하며 이 EXE에 미포함.
2. **구현/근거:** 브라우저 앱 Vite 정적 파일을 Electron `astra://app/` secure/standard protocol로 로드해 브라우저 설치 불필요. `desktop/main.cjs`, `desktop/bundle-path.cjs`, `desktop/verify-bundle.cjs`, `tests/desktop-shell.test.cjs`, `electron-builder.yml`, `vite.config.ts`, `package.json`, `.github/workflows/windows-desktop.yml` 변경. 외부 http(s) 거부, 번들 밖 경로 거부, `contextIsolation:true`, `sandbox:true`, `nodeIntegration:false`.
3. **자동 테스트 성공:** Windows Actions [#39205924586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586) **completed/success**, CI 실제 코드 HEAD `ab89fcb85ce2a847eba751254543983b50a59d82`; 기존 Node 16/16·신규 desktop 3/3·TS/Vite PASS. Win Runner에서 `electron . --astra-desktop-smoke`와 **패키징된 exe --astra-desktop-smoke** 모두 React 표시, IndexedDB, 로컬 저장 reload, window.print API 존재 PASS. Native Windows setup generated PASS.
4. **검증된 산출물:** `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, SHA256 `26B6C2DEC5453A1C6233E7C7BED1ACECEE077F88103C757034A8D93F4A0A8FBC`; [GitHub Actions Artifact #12165647731](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39205924586/artifacts/12165647731) (약112 MB ZIP, 보존 기한 제한). 서명 확인/SmartScreen 고객 신뢰 완료 아님. 설치/삭제를 러너에서 수행하지 않음.
5. **브랜치 상태/계획:** 독립 `feature/windows-electron-package-20261019`, 문서 후속 SHA `a6050ffe9c50e073804b16e4432db50ec35d69f7`; [Draft PR #4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) open/draft/unmerged. 기존 STEP3 [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/unmerged. 두 PR 기능 main 미병합; STEP4 미착수. main STATUS/HANDOFF만 갱신/중앙 BOOK 별도 정리. 약38% 전체 진행률은 기존 비공식 추정 그대로.
6. **데이터 보존/보안:** Electron 고정 userData 별도 디렉터리 `AstraPDFRedesigner`, 기존 브라우저 Chrome/Edge 프로필과 동일하지 않음; `.localdoc.json` export/import로 데이터 이전 가능해야 하나 실제 Windows 수동 이전 미검증. 외부 API/서버 요청 차단; 합성/테스트 자료 외 업로드 없음. 기존 STEP1 localStorage 원본·STEP2 IndexedDB 외부 변경 없음. GitHub에 고객 원본 PDF·토큰/바이너리 저장 금지.
7. **환경/명령:** 개발자는 `npm install`, `npm test`, `npm run build`, `npm run desktop:verify`, `npm run desktop:smoke`, `npm run desktop:package`; 구매자는 CLI 불필요. Node22 Windows GitHub runner, Electron 44.9.0, electron-builder26.15.3, NSIS x64.
8. **미검증/주의:** 실제 Windows 설치·제거·업데이트/데이터 유지, 긴 한글/A4/이미지 PDF 출력, 파일 저장 대화상자·JSON 파일 교차 가져오기 사용자 검수, Windows 10 일반 사용자 권한/SmartScreen, 코드 서명, 아이콘/라이선스/EULA, STEP3 PDF 가져오기/원본 동등성 **NOT RUN**. 현재 판매용 최종 소프트웨어라고 주장하지 말 것.
9. **다음 단위 기준:** 실제 사용자 환경 Windows 설치/실행/인쇄/저장/삭제 수용 우선. 로그 수집 시 사용자 문서의 내용은 기록하지 말 것. STEP3 별도 Draft 검증 후 사용자 별도 승인 전 기능 병합 금지; PR4도 최신 base SHA 병합 사전검사와 승인 필요.
10. **증거/복원:** 2026-10-19 14:48:11 KST GitHub run39205924586, SHA `ab89fcb...`; doc-only PR4 HEAD `a6050ffe...`, 안정 main 출발 `768c5e9d...`. [자세한 검증 보고](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_ELECTRON_PACKAGING_2026-10-19.md). 출시판이 아니라 시험용 Windows 설치형 MVP임.

## 2026-10-19 15:01:21 KST — Windows GUI PDF 저장 기능/패키징 인수인계 (STEP3 Draft와 격리)
1. **요청 목표:** 소비자가 CLI 없이 ASTRA를 Windows 앱으로 설치·사용. 기존 Windows NSIS 설치형 준비는 별도 feature/windows-electron-package-20261019 브랜치(안정 STEP1·2 기반)에서 이미 성공해 있었으므로 중복하지 않고 **GUI 네이티브 PDF 파일 저장**을 이번 단위로 개발.
2. **구현/사용 흐름:** 설치 EXE로 앱 실행→문서 편집→GUI PDF 파일 저장→native Windows showSaveDialog→Electron printToPDF→로컬 PDF 파일 작성. Electron preload는 단일 IPC(ast ra:save-pdf가 아닌 정확히 'astra:save-pdf')만 contextBridge에서 노출; main은 앱 webContents/Origin 검증 및 저장 실패 처리. 웹 브라우저에서는 기존 window.print() 방식, STEP2 기존 flush+이미지 디코딩/폰트 완료 후 저장.
3. **보안/선택:** NodeIntegration 비활성, sandbox·contextIsolation 유지, astra://app 표준+secure 등록/외부 네트워크 차단, renderer에 fs와 임의 파일명·원본 내용 전달 API 없음. 사용자 문서는 브라우저 LocalStorage·IndexedDB에서 별도의 Electron 프로필로 **자동 이전되지 않음**. STEP2 .localdoc.json 통해 명시적 이전 필요.
4. **검증 성공:** 검증 코드 SHA **e11076cf77946416bc59bcaa88227c8265499ab3**, Windows [Actions #39206761720](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720) completed/success. Node **19/19 PASS/FAIL0/SKIP0**, 별도 desktop unit **3/3**, TS/Vite build. Windows native Electron/패키징된 Windows EXE 양쪽에서 secure origin·React mount·IndexedDB·localStorage reload·preload IPC→printToPDF→15,257bytes 실제 파일 쓰기/읽기 PASS.
5. **산출물:** unsigned development installer ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe, SHA256 1FEB8C6801EB2870479955A5669B9405AC3117490A99954230AECB1470D3C84C; [Artifact 12165323804](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39206761720/artifacts/12165323804) ZIP 112,306,801 bytes, 7일 retention, 2026-10-26 UTC 전후 만료. 패키징된 EXE 실행 검증은 통과했으나 실제 설치 프로그램의 install/uninstall 검증은 미실시.
6. **브랜치/핵심 파일:** feature/windows-electron-package-20261019 (STEP1/2 main 기반), 코드 SHA e11076cf77946416bc59bcaa88227c8265499ab3, 기능 검증 후 문서 SHA d62f89b7ebc04eb0de3b6b2c44363c2e08996312. 변경 desktop/main.cjs, desktop/preload.cjs, src/desktopPdf.ts, src/App.tsx, src/step2/Workspace.tsx, tests/desktop-pdf.test.ts, tests/desktop-shell.test.cjs. [상세보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_DESKTOP_NATIVE_PDF_EXPORT_2026-10-19.md).
7. **실행/환경:** 개발자용 npm install; npm test (19/19); npm run build; npm run desktop:verify (3/3); npm run desktop:smoke(실제 Windows PDF 파일 쓰기); npm run desktop:package. CI Windows runner Node22 Electron44.9 electron-builder26.15.3. 사용자 설치에는 CLI 필요 없도록 설계. Production/Vercel/정식 GitHub Release 미게시.
8. **미완료/위험:** 실제 Windows 10/11 소비자 PC NSIS 설치·삭제, Windows native save dialog 수동 취소/경로/덮어쓰기, 인쇄 결과 A4/한글/이미지/긴 문서 육안, 브라우저↔Electron JSON 프로필 이식, 코드 서명·SmartScreen/로고·자동 업데이트/EULA/지원책 미검증. 시스템 파일 선택창은 자동 smoke에서 우회하고 임시 파일만 생성하므로 **원격 자동 PASS를 수동 GUI 검증 완료로 표시하지 말 것**.
9. **원본/경계:** STEP3 PDF 업로드/구조화는 독립 feature/step3-pdf-import-20261019 Draft PR #3에만 있으며 본 설치판에 **미포함**. 사용자의 원본 PDF/토큰/STEP1 localStorage, STEP2 IndexedDB를 변경하지 않았고 main 앱 기능 코드 미병합. 메인 STATUS/HANDOFF 문서 기록만 변경. STEP3 main 병합/STEP4 착수는 기존 사용자 승인 게이트 유지.
10. **다음 한 단위/완료 기준:** 소프트웨어 배포 전에 실제 Windows NSIS 설치→기본 GUI→PDF 저장 창→A4 한글·장문 검수→프로필 업그레이드 보존→삭제 검증 및 오류 대응. 별도 STEP3 합성/사용자 PDF 가져오기 통합은 사용자 승인·원본 수용 이후. 보고 기준 시간 2026-10-19 15:01:21 KST, 고정 Windows CI SHA/테스트/증거와 문서 전용 커밋을 구분.

## 2026-10-19 15:13 KST — Windows 설치형 실제 NSIS 수명주기 인수인계
1. **현재 목표/선택:** 소비자에게 CLI를 요구하지 않는 설치형 ASTRA PDF 편집기. 기존 Draft PR #4에 Electron 44.9, NSIS x64, native `savePdf()` 경로와 이전 Windows CI 성공까지 이미 있음. 이전 코드 중복 구현 없이 **NSIS 설치→설치된 EXE→제거** 단위만 추가; 실제 사용자 PC 조작은 하지 않는다.
2. **파일/변경:** `tests/windows-installer-lifecycle.ps1` 신규; 환경 `GITHUB_ACTIONS=true`와 `RUNNER_TEMP` guard, NSIS `/S`와 마지막 `/D=RUNNER_TEMP\astra-ci-nsis-PID`, 충돌 검사. 프로그램/Uninstall EXE, Desktop/Start Menu ASTRA `.lnk` 생성 검사. 설치된 EXE `--astra-desktop-smoke`가 로컬 PDF 15,257 bytes 쓰고 검증/삭제; NSIS `/S` 제거와 임시 설치 폴더·shortcut 정리, AppData\AstraPDFRedesigner 내부 CI synthetic sentinel **값 유지** 검증. finally sentinel만 삭제, userData 전체 삭제 없음. workflow에 새 스텝 추가, 정적 desktop 테스트 +1.
3. **실제 검증 결과:** 기능 SHA **`8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5`**, [Windows GitHub Actions #39208406254](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254) **completed/success** at 2026-10-19T06:13:03Z. Node19/19 PASS, desktop4/4 PASS, build PASS, Windows dev Electron+packaged EXE+**실설치된 EXE** smoke PASS. 로그: NSIS INSTALL, SHORTCUTS desktop1/start-menu1, INSTALLED EXE(15,257 bytes PDF), UNINSTALL(폴더/링크 제거·합성 marker 보존). 해당 Windows runner는 임시 격리 CI 환경이며 고객 PC 사용성 테스트와 다름.
4. **산출/배포:** unsigned `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, SHA256 `C49D217B48ECA4ABAA80296D2E03C80D0C331F8148C361D6C267DB5918A7977A`, [Actions Artifact #12165714586](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39208406254/artifacts/12165714586) ZIP 112,306,806 bytes, 7일 보존·2026-10-26T06:12:54Z 만료. 정식 Release/Production 배포 아님. 서명 안 됐으며 SmartScreen 대응 미완료.
5. **상태 및 승인 게이트:** `feature/windows-electron-package-20261019` / [Draft PR4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) open/draft/unmerged. 검증 코드 SHA `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5`, docs-only feature SHA `b13ec1feb02cda3cbea63280b25da8bfdcc8e7a5`; main 기능 STEP1/2 안정성 보존, main에는 STATUS/HANDOFF 문서만 기록. [Draft STEP3 PR3](https://github.com/hibi89/astra_pdf_redesigner/pull/3)는 별개이고 이번 설치 파일에 PDF 가져오기 기능 **미포함**. 사용자 명시 승인 없이 PR3/4 main 병합 또는 STEP4 착수 금지.
6. **보안 및 테스트 한계:** CI synthetic data만 사용, 원본 고객 PDF·계정 토큰 미사용. TEST `/S`는 설치 마법사 UI/수동 저장창 클릭 검증이 아니다. Windows 10/11 개별 환경, admin/UAC, SmartScreen, 한글/다페이지/이미지 실제 PDF 결과 비교, 사용자 기존 앱 data 업그레이드, 웹→프로필 JSON 이식, 코드 서명/EULA·업데이트·판매 수용 **NOT RUN**. AppData marker 한 파일 통과를 전체 프로필 데이터 보존으로 과장하지 않는다.
7. **실행 명령/운영:** 개발자용 `npm install`, `npm test`(19/19), `npm run build`, `npm run desktop:verify`(4/4), `npm run desktop:smoke`, `npm run desktop:package`. 실제 lifecycle은 GitHub Windows CI의 `./tests/windows-installer-lifecycle.ps1` 명령으로만 수행하도록 제한; 소유 Windows PC에 직접 실행 금지. Windows Runner Node22/Electron44.9/electron-builder26.15.3.
8. **문서·복원·검증:** 브랜치 전 docs SHA `d62f89b7ebc04eb0de3b6b2c44363c2e08996312` 와 새 코드 `8822f25bf5a7ab6fe3d4886455f853c60fd4b2a5` Git 이력 보존. [상세 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_NSIS_INSTALL_UNINSTALL_ACCEPTANCE_2026-10-19.md) feature docs-only SHA `b13ec1feb02cda3cbea63280b25da8bfdcc8e7a5` (성공 CI는 code SHA를 검증, 문서 커밋 자체는 신규 CI 없음). 메인 STATUS/HANDOFF와 중앙 BOOK p5 각각 별도 SHA 최신화 필요.
9. **다음 단위 우선:** PDF 실제 출력 파일을 열어 A4 MediaBox·텍스트·한글·이미지·2페이지가 보존됐는지 테스트 추가. 사용자 수동 윈도우 인수는 별도. 또는 silent 업그레이드 시 합성 IndexedDB 문서 보존 회귀 1단위. 현재 설치/제거 기능은 완료/프로필 업그레이드와 상용 품질은 미완료.
10. **진행률/판정:** 2026-10-19 15:13 KST 기록. 전체 로드맵 약38%는 기존 비공식 추정 유지, desktop packaging 별도 상품화 트랙. 완료 범위는 **CI runner에서 NSIS 실제 설치/실행/PDF 스모크/제거/마커 보존**, STEP3 전체와 고객 상품 출시 완료가 아님.

## 2026-10-19 15:38:16 KST — Windows 설치형 PDF 파일 원문·용지·이미지 실제 구조 인수인계
1. **목표/결과:** 설치형 GUI ASTRA (STEP1/2 기반)에 대해 NSIS 실제 설치된 EXE가 생성한 PDF를 PDF.js로 열어 구조/텍스트/이미지 수용. 코드 SHA `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`, [Windows Actions #39210319075](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075) completed/success at 2026-10-19T06:33:02Z, Node19/19·desktop5/5·빌드·NSIS 설치/제거 전체 PASS.
2. **실제 파일 검사:** 2p A4 ±2pt, 6개 한국어·숫자·라틴 식별자 각각 정확히 1회·페이지별 순서, 64×64 RGB PNG 이미지 그리기 연산 1건. 설치된 EXE Electron printToPDF가 CI RUNNER_TEMP에 생성한 파일을 `pdfjs-dist@6.4.299`로 직접 읽음. 로그 `PASS ASTRA INSTALLED PDF CONTENT: A4 x 2, Korean/numeric markers 6/6, raster draw 1` 확인.
3. **구현 파일:** `desktop/pdf-acceptance-fixture.cjs` 합성 한글/두 페이지/RGB PNG·DOM 삽입, `desktop/main.cjs` `--astra-pdf-acceptance` CI-only 출력 가드, `tests/verify-desktop-pdf.mjs` 검증기, `tests/windows-installer-lifecycle.ps1` 설치된 EXE 실행/검사 후 파일 정리, `tests/desktop-shell.test.cjs` 검증+1, `package.json`의 `pdfjs-dist`는 devDependency. STEP2 실제 `ProjectDocument` 저장/로드 경로를 수정하지 않았음.
4. **증거/문서:** [검증 보고서](https://github.com/hibi89/astra_pdf_redesigner/blob/feature/windows-electron-package-20261019/docs/WINDOWS_PDF_CONTENT_ACCEPTANCE_2026-10-19.md), 코드 검증 SHA `3ed16c56fdb5820813fb6cae6ec81b958d4991d5` / 후속 feature docs-only SHA `fa7c760332c89f36731f3176630b4997ee5185a3`. 새 unsigned NSIS SHA256 `FC91757AA962C167BA8D814A3F939ECBE3562085C45F5C32C894E4D16D0158D7`, [Artifact #12167606844](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39210319075/artifacts/12167606844), 보존 만료 2026-10-26T06:32:53Z.
5. **한계:** 이번 CI는 실제 앱 STEP2 미리보기 영역에 **일시 주입한 합성 문서**를 출력한 것으로 실제 UI/IndexedDB 합성 프로젝트 저장 후 출력, 긴 고객 문서/이미지·표·한글 육안, 수동 저장창 동작, 앱 설치 마법사 및 SmartScreen, 유상 판매 품질은 검증하지 않았다. 합성 이미지의 색상/픽셀 동일성도 판정하지 않음.
6. **보안:** GitHub Windows runner만 허용하는 `GITHUB_ACTIONS`, `RUNNER_TEMP` 디렉터리 제한, PDF 단일 파일 `wx` 쓰기 및 `finally` 정리. 고객 문서/토큰/기존 저장소 미변경. 앱 sandbox·CSP·단일 IPC 보안 제약 유지.
7. **현재 상태:** `hibi89/astra_pdf_redesigner`의 `feature/windows-electron-package-20261019` [Draft PR4](https://github.com/hibi89/astra_pdf_redesigner/pull/4) open/draft/unmerged. STEP3 기능은 `feature/step3-pdf-import-20261019` [Draft PR3](https://github.com/hibi89/astra_pdf_redesigner/pull/3) open/draft/unmerged이고 현 설치 파일 **미탑재**. main 기능 변경 금지/사용자 명시 승인 전 병합 금지. Vercel/Production 미적용.
8. **실행/복구:** 개발자용 `npm install`, `npm test`, `npm run build`, `npm run desktop:verify`, `npm run desktop:package`; Windows lifecycle은 GitHub CI의 `./tests/windows-installer-lifecycle.ps1`만 사용. Git SHA 전 단계 `b13ec1feb02cda3cbea63280b25da8bfdcc8e7a5`, 코드 테스트 `3ed16c56fdb5820813fb6cae6ec81b958d4991d5`. STATUS/HANDOFF/BOOK 문서 갱신용 main SHA는 별도 확인.
9. **다음 한 단위:** 실제 STEP2 합성 프로젝트 데이터(텍스트/그림)를 앱의 정상 저장 흐름에 적용·flush→PDF 검증으로 테스트 범위를 확장하거나 업데이트 뒤 문서 보존. 고객 실제 PDF 5~10개 및 Windows 수동 육안은 별도 보호된 환경에서 인수.
10. **완료/진도 구분:** 2026-10-19 15:38:16 KST 기록. 이 단계의 실제 Windows 파일 구조 테스트 **완료**, 고객 상용 품질/STEP3 통합·실사용 수용은 **미완료**. 로드맵 전체 약38% 비공식 추정 유지.

## 2026-10-19 16:11:22 KST — Windows STEP2 실제 편집/저장 프로젝트 PDF 인수인계
1. **목표·용도·확정 요구·기술:** 기존 PDF 콘텐츠 보존·재조판 로컬 제품. 구매자용 CLI 없는 Windows 설치형 데스크톱 트랙 STEP2에서 실제 편집 UI→IndexedDB→재로드→Electron PDF가 연결되는지 검증. React/TS/Vite/IndexedDB, Electron 44.9.0, pdfjs-dist 6.4.299, NSIS Windows. 고객 문서 외부 전송 금지.
2. **완료·변경·선택 근거:** 직접 테스트 HTML 주입 A안보다 실제 UI·DB 흐름 B안을 채택. `desktop/step2-project-acceptance.cjs` 추가, `main.cjs`에는 `--astra-step2-acceptance` CI 전용 분기만 추가. PS 설치 수명주기에서 실제 앱 UI 입력·이미지 업로드·IDB 직접 재조회·렌더러 재출력, PDF.js 식별자/페이지/이미지 검사. 사용자 데이터·정상 운영 로직 수정 없음.
3. **테스트 명령·결과·미검증:** Windows GitHub Actions [#39214047605](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605) `completed/success`, CI 검증 코드 SHA `c5113056ed4b779b245a50fd42d33a32b46d4b1b`. `npm test` **19/19**, `npm run desktop:verify` desktop **6/6**, `npm run build`, `npm run desktop:smoke`, NSIS 설치→실행→PDF 구조검사→제거 **모두 PASS**. 실제 저장 STEP2 합성 문서 **A4 3페이지, 한글·숫자 5/5, PNG raster 1, 편집 전용 문서함 이름 미출력**. 기존 A4 2p 6/6 별도 smoke PASS. 실제 고객 PDF/수동 GUI 품질은 미검증.
4. **완료/진행/대기·중단 지점:** PR4의 새 자동검증 1단위 **완료**. STEP3은 PR3 Draft/미병합, Windows 설치판은 STEP1/2 전용 PR4 Draft/미병합. main 기능 미변경. STEP4~7 및 Windows 고객 수용/서명/업그레이드는 대기. 전체 7단계 약38% 비공식 추정 유지.
5. **오류·시도·제약·대안:** 이전 합성 .paper-surface 직접 주입은 실제 DB 경로 검증이 아니므로 이번에 확장. 새 CI 시도 [#39214047605]에서는 실패 없음. Electron 테스트의 JS 이벤트 자동화는 고객의 실제 키보드/GUI SaveDialog 사용과 구별; 인쇄 페이지 시각 품질/픽셀·표 구조 동일성 미보증. 수동 검수 또는 실제 사용자 샘플은 승인받은 비공개 로컬 경로에서 진행. 새 테스트에 고객 자료 올리지 말 것.
6. **저장소·브랜치·SHA·경로:** `hibi89/astra_pdf_redesigner`, `feature/windows-electron-package-20261019`; CI SHA `c5113056ed4b779b245a50fd42d33a32b46d4b1b`, 이후 feature docs-only `883568e2f0f47186cb561c9d82bbc985a3cb4742`. 신규 `desktop/step2-project-acceptance.cjs`, 변경 `desktop/main.cjs`, `tests/windows-installer-lifecycle.ps1`, `tests/verify-desktop-pdf.mjs`, `tests/desktop-shell.test.cjs`, 보고 `docs/WINDOWS_STEP2_STORED_PROJECT_PDF_ACCEPTANCE_2026-10-19.md`. main 기준은 별도 문서 커밋 이후 HEAD 재확인.
7. **Production URL·배포·명령·환경:** Vercel/Production **미적용**, 테스트 Windows Actions Node22·Electron/NSIS. 개발 `npm install`, `npm test`, `npm run build`, `npm run desktop:verify`, `npm run desktop:package`. unsigned 설치 EXE SHA256 `60048F38227DB08C43F9BC073938AC94D1BFD94A07AF91C424654EB9B8E134E6`, [Artifact #12168803144](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39214047605/artifacts/12168803144), 112,310,427 bytes·2026-10-26T07:11:12Z 만료. 시험용만, 정식 판매/Release 아님.
8. **원본·백업·인증·수정 금지:** 설계 원본 `docs/ASTRA_ORIGINAL_ROADMAP.txt`/PNG 2장/STEP2 사용자 원본 지침·localStorage STEP1 v1·IndexedDB STEP2 v2 데이터 변경 금지. 이번 검증은 GitHub Windows 임시 프로필·합성 자료만 사용, 고객 파일·비밀·환경변수 기록/외부 전송 없음. 이전 기능 커밋 SHA로 원복 가능; 새 프로그램 출시에 서명/SmartScreen 대응 필요.
9. **다음 우선순위·절차·완료·승인:** 다음 `ㄱ`은 **실제 합성 IndexedDB STEP2 문서+PNG를 버전 업그레이드 전후 동일 Windows 프로필에서 비교 검증**하거나, 사용자 Windows에서 저장창/한글 장문 문서를 수동 검수. 기능 브랜치의 추가 테스트는 1단위씩 하고 Windows CI 성공 후 기록. PR3/PR4의 main 병합과 STEP4 착수는 최신 사전검사·사용자 별도 명시 승인 전 금지.
10. **검증 시각·범위·문서 기준:** 2026-10-19 16:11:22 KST, GitHub Actions 성공 SHA/Windows 로그의 STEP2 저장 문서 3p/5토큰/1이미지·기존 회귀 통과 확인. 문서 갱신 후 main HEAD와 중앙 BOOK p5 행 별도 재조회 필수. Linux/Windows CI 결과는 실고객 품질·상용 준비 완료가 아님.

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


## Latest handoff — 2026-10-27 16:51 KST
1. **Goal and scope:** Continue the original ASTRA roadmap without reducing requirements; current approved development scope and data-preservation rules remain authoritative. Draft PR #9 remains unmerged; main, PR #3/#4, original assets/data and deployment settings are untouched.
2. **Latest change:** Functional/test SHA `1099b794f32da3e0bc467898e12b0ee7e7e71146` strengthens STEP2 project JSON checks: exact content and all four design values export, invalid JSON makes no active-document change, valid import retains design, and deleting the imported copy leaves the original unchanged. Test-only; no product source or stored data changed.
3. **Local verification:** Node 22 `npm test` 61/61 PASS; `npm run build` PASS; `node --check tests/step2-browser.mjs` PASS; `git diff --check` PASS.
4. **Exact-SHA browser evidence:** Edge [job #122069789553](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551454/job/122069789553) SUCCESS. Logs contain `PASS STEP2: portable project JSON includes exact text and image bytes` and `PASS STEP2: JSON import, invalid import rejection, independent copy survives delete`; prior A4/PDF/STEP3 regression markers also pass.
5. **Exact-SHA Windows evidence:** [Run #40468551485](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551485) SUCCESS. Installed M09-D visible cancel/replacement/stale-result rejection and V2 preservation pass; second launch and NSIS 0.1.0→0.1.1 STEP2 document/PNG preservation pass. CI unsigned test installer only, not a consumer release.
6. **Exact-SHA browser verification:** Chrome+Edge run [#40468551454](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40468551454) completed SUCCESS 2/2 at 2026-10-27 17:04 KST. Chrome job #122069789889 logs confirm exact project JSON export/import and invalid-import/original-preservation markers, Chrome A4 text extraction, PNG/JPEG/WebP output, and prior M09-A/B/C regressions. Korean-font installation caused delay but not failure.
7. **Failures/retries:** No test failure on SHA `1099b79`. Previous unrelated harness failures and their fixes are recorded in earlier handoffs. Do not weaken assertions or count an in-progress CI step as success.
8. **Repository and deployment:** `hibi89/astra_pdf_redesigner`, PR head functional/test SHA above on `integration/astra-commercial-core`; PR remains Draft. No Vercel/Production deployment. Chrome+Edge and Windows tests use synthetic fixtures only.
9. **Release and approval gates:** Original-design matrix estimates ~43% across seven stages; STEP 5 absent, STEP 6 and OCR approval-gated, STEP 3/4/7 partial. Customer PDFs/devices, model/runtime download, paid services, branch merge and release are not authorized by this test task. Sale/public production NO-GO.
10. **Next order:** The approved M09-D Windows UI check and original-design gap matrix are complete, and exact-SHA Chrome/Edge/Windows CI is green. Await GPT-6 re-review; continue only within approved STEP2 scope and preserve all existing data. Before further local code edits, restore GitHub DNS, fetch the current PR head, and realign the local clone.
11. **Local/remote sync warning (2026-10-27 16:58 KST):** Shell `git push` and `git fetch` both failed with `Could not resolve host: github.com`. STATUS/HANDOFF/gap-matrix and PR body were nevertheless updated through the connected GitHub API; at 16:58 KST, remote PR HEAD was `836c95f6b2ca9f927070089511b66ae8e56a3d0c`. Local clone `codex/m09d-review-docs` is at docs commit `b72d0dc2bd051562775cd65bde82b1ae529ab088`, whose content is not the remote branch commit ancestry. Do not push this local ref directly. Once DNS works, fetch the remote branch and continue from the exact remote head, preserving any local-only commit before realigning.



## 2026-10-27 17:27 KST — 최신 인수인계 (STEP 3 승인 범위)

1. **목표/승인:** 원문 PDF를 브라우저 로컬에서 읽고 사용자가 대조·수정한 뒤 별도 V2 문서와 새 A4 PDF를 만드는 승인된 STEP 3 범위. OCR은 별도 승인 전까지 범위 밖.
2. **완료/보강:** 이미 있던 PDF.js 텍스트/이미지 추출, 경고, 페이지별 원문 대조, 취소/오래된 분석 무시, 승인 후 독립 문서 생성은 그대로 사용. 이번 변경은 PDF 확정 전 초안 편집 최대 8단계 Undo/Redo이며 매 수정/undo/redo마다 확인 동의를 초기화한다. 저장 데이터 구조는 바꾸지 않았다.
3. **원격 기준:** `hibi89/astra_pdf_redesigner`, `integration/astra-commercial-core`, tested code SHA `3a704921b24b83b05701c6a48c9526d8580f9a6a`; PR #9 Draft/open/unmerged to `lead/astra-commercial-20261025`. Main, PR #3, PR #4 remain untouched.
4. **검증:** 로컬 Node 62/62, TypeScript/Vite build, diff check PASS. Chrome+Edge [#40472988885](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988885) 2/2 SUCCESS with Undo/Redo marker and STEP3/M09-A/B/C checks. Windows [#40472988943](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40472988943) SUCCESS with M09-D installed UI and installed STEP3 native PDF marker. No failed checks on this SHA.
5. **M09-D:** Hosted Windows Electron UI directly exercised cancel/replacement/stale completion/URL cleanup/V2 unchanged at exact test SHA; physical buyer PC remains NOT RUN.
6. **Failures:** Current SHA had no failing tests. The preceding M09-D harness failures and fixes remain documented in earlier sections; do not repeat the invalid database-version or checkbox-selector assumptions.
7. **Original design/gap:** Seven-step estimate remains ~43%; STEP 1/2 complete, STEP 3/4/7 partial, STEP 5 unimplemented, STEP 6 approval-gated. STEP 3 remains partial because real PDF/customer PC acceptance and complex layout fidelity are unverified. The specific previously missing STEP3 review undo/redo is now implemented and exact-SHA verified.
8. **Data/safety:** No OCR/model downloads, paid API, customer PDF, external transmission, schema migration, production deployment, or merge. Existing data and refs preserved. Generated fixtures are synthetic only; unsigned Windows artifact is a CI test build.
9. **Next:** (a) collect one batch of safe, consented customer-local PDF samples and Windows buyer-PC manual results; (b) continue self-contained synthetic Step3 gaps without claiming real acceptance; (c) OCR/model/major design or merge/release only after separate owner approval. Sale remains NO-GO.
10. **Environment sync:** Direct shell fetch/push remains blocked by DNS; GitHub connector API wrote the exact tested commit. Do not push local branch `codex/m09d-review-docs` (local `b72d0dc2bd051562775cd65bde82b1ae529ab088`) because it does not descend from remote PR head. Refetch/re-align when DNS is restored.


## 최신 인수인계 — 2026-10-27 17:45 KST

1. 목표·확정 범위: 최초 STEP3 PDF 가져오기 흐름을 완성 방향으로 보강한다. OCR은 별도 승인 전까지 제외한다. 기존 STEP1/2 기능과 사용자 데이터를 보존하고 main/PR #3/#4를 변경·병합하지 않는다.
2. 이번 구현: PDF 이미지 복원에 문서 단위 누적 예산을 추가했다(이미지 복원 시도 최대 50개, 누적 시도 40MP, 성공 PNG 40MiB). 기존 이미지별 20MP/10MiB 및 페이지별 15개 제한을 유지한다. 누적 한도에 도달하면 해당 이미지와 이후 이미지를 제외하고 PDF 검수 경고/미복원 집계로 알린다. 데이터베이스·프로젝트 JSON·원본 문서 형식 변경은 없다.
3. 로컬 결과: exact code/test SHA 009966b57cc2e30397da5607b9429020c400e513; Node 24 npm test 63/63 PASS, npm run build PASS, git diff --check PASS. 첫 추가 테스트는 경계값 기대 오류로 실패했으나 수정 후 전체 통과했다. 기존 model.ts chunk 경고는 미해결이며 이번 변경과 무관하다.
4. 브라우저 exact-SHA: [Chrome+Edge #40475046652](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046652) SUCCESS 2/2. 두 브라우저의 PDF import/review/undo-redo/A4 output, malformed/encrypted/scan-only 경계, M09-A/B/C 회귀 표식을 확인했다.
5. Windows/M09-D exact-SHA: [NSIS #40475046789](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40475046789) SUCCESS. 설치형 UI에서 취소 중 대체 PDF 선택·이전 늦은 결과 무시·URL 정리·V2 불변이 통과했다. STEP3 PDF review 후 실제 native A4 출력은 2페이지/원문 marker 6개/raster 1개로 확인됐다. 설치·제거·0.1.0→0.1.1 STEP2 저장 데이터 업그레이드 보존도 성공했다.
6. 실패/재시도 기록: 로컬 첫 추가 테스트는 maxImages=2에서 한 이미지만 사용한 테스트 기대값 오류였다. 기대 테스트 상태를 고쳐 재실행했고 63/63 모두 통과했다. exact-SHA CI에서는 실패한 작업이 없다. 테스트 assertion은 완화하지 않았다.
7. 설계 대조/완료율: 원본 STEP3의 로컬 PDF 텍스트·좌표 추출, 가능한 이미지, 제목/본문/캡션 추정, 읽기 순서 경고, 원문 대조, 블록 수정·순서 변경, 새 테마 출력, 미지원 요소 경고는 코드와 합성 PDF/browser 검증을 확인했다. 손상 PDF 내부를 복구하는 기능은 원본 STEP3 요구가 아니며, M08-C는 실패를 보이고 저장 데이터/초안을 보존하는 것을 확인한다. 전체 7단계 보수 추정은 약 43%이며 STEP3 실문서 수용 때문에 부분 상태다.
8. 저장소·브랜치·PR: hibi89/astra_pdf_redesigner, integration/astra-commercial-core, 기능 검증 SHA 009966b57cc2e30397da5607b9429020c400e513; PR #9는 lead/astra-commercial-20261025 대상으로 Draft/open/unmerged. 문서 커밋 뒤 PR head가 추가로 움직일 수 있으므로 최종 head는 GitHub에서 재조회한다.
9. 배포/승인: Production 배포 없음. GitHub Windows 설치 파일은 unsigned CI 시험 산출물이다. 사용자 PC 직접 확인, OCR, 로컬 모델 다운로드, 비용 서비스, 외부 PDF 전송, 주요 설계 변경, PR 병합/배포는 수행하지 않았다.
10. 다음 순서: (a) 동의받은 단순 텍스트 PDF 5~10개를 고객 로컬에서만 비교하고 결과 수치/누락만 기록, (b) 구매자 Windows PC에서 실제 파일 선택·취소·검수·인쇄 GUI를 수동 확인, (c) 그 결과로 STEP3 gap matrix/판매 게이트 재판정. 그 밖의 자율 STEP3 버그 수정은 합성 fixture와 exact-SHA CI를 유지하며 계속할 수 있다. OCR/모델·배포/병합은 별도 승인 대기.
11. 로컬 복제 동기화: API 경유로 커밋했으며 이 실행환경의 git fetch는 이전에 GitHub DNS 문제로 실패했다. .codex-m09d-remote 체크아웃은 stale/divergent 로컬 ancestry와 미커밋 변경이 있으므로 직접 push하지 않는다. root codex/p5-windows-reliability도 기존 변경이 있으므로 건드리지 않는다. CI는 GitHub에서 exact SHA를 checkout해 수행했다.


## 최신 인수인계 보충 — 2026-10-27 17:55 KST

1. 현재 코드/테스트 검증 SHA 9ae962eb825e4baa3a8d84b650926355258c9148; integration/astra-commercial-core, PR #9는 Draft/open/unmerged이며 docs-only commit이 이어진다.
2. PDF 이미지 예산: 문서 전체 복원 시도 최대 50개, 시도 픽셀 최대 40MP, 성공 PNG bytes 최대 40MiB. 첫 누적 제한에 닿으면 exhausted 상태로 전환해 이후 페이지 이미지 객체 읽기/변환을 중단한다. 미복원 감지 수와 안전 경고는 사용자에게 계속 표시된다.
3. 추가 경계 regression: 첫 페이지 픽셀 예산을 넘은 뒤 다음 페이지에서 이미지 object API를 다시 호출하지 않는 것을 확인했다. Local npm test 64/64, production build, diff-check PASS.
4. Exact CI: Chrome+Edge [#40476342313](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342313) SUCCESS 2/2; Windows installer [#40476342230](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40476342230) SUCCESS. Exact Windows logs contain M09-D UI pass and installed STEP3 native A4 output 2 pages/6 markers/1 raster.
5. Earlier candidate 009966b had green CI, but review found the first threshold-exceeding image was skipped while later smaller images could still be processed despite the warning. Follow-up 9ae962e made exhaustion explicit, bounded failed attempts too, added the next-page no-read test, and repeated all CI. No failed check remains on final code SHA.
6. Design gap matrix now says corrupt-PDF repair is not required by original STEP3; visible rejection/data preservation is the required safe boundary. PDF import, local extraction, manual edit/review, image warnings, and A4 export synthetic regressions are verified. Overall roadmap remains ~43% and STEP3 remains partial due actual sample/customer acceptance.
7. Still unverified: consented customer-local 5–10 text-centered PDFs, buyer physical Windows PC GUI/print acceptance, complex real document visual QA. OCR stays separate/unapproved. Do not upload customer PDFs to CI/PR.
8. Preserve main, PR #3/#4, user data, original design docs, and deployment config. No OCR, model download, paid service, external PDF transfer, deployment, or branch merge occurred.
9. Next work: continue independent STEP3 gaps only when original design supports them; batch owner-side acceptance is real PDF sample comparison performed locally plus buyer-PC GUI/print review. Sale/production remains NO-GO until acceptance/release gates pass.


## 최신 STEP3 인수인계 — 2026-10-27 18:06 KST

1. **범위:** 사용자가 승인한 STEP3 PDF import. OCR은 별도 승인 전 제외. STEP1/2 기존 기능, V2 사용자 데이터, main 및 PR #3/#4를 보존한다.
2. **이번 변경:** 500,000자 누적 텍스트 한도를 PDF.js 각 유효 fragment마다 검사해 초과 즉시 예외 처리한다. 이후 페이지의 text item 배열을 추가로 만들지 않는다. makePdfDraft의 최종 검사도 유지한다. 저장 스키마/원문 문서 형식은 변하지 않는다.
3. **기능 SHA:** 4e5cdbb300153dc81e7374956030cae751148415. GitHub branch integration/astra-commercial-core; docs-only follow-up may advance PR head.
4. **로컬:** Node 24 npm test 65/65 PASS, build PASS, diff-check PASS. 500,000자 경계 허용/초과 거부 단위 테스트가 추가됐다.
5. **Chrome/Edge exact SHA:** [#40477533937](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533937) completed/success 2/2. Chrome test suite #fail 0. Browser logs show import/review/Undo-Redo/A4, corrupt/encrypted/scan-only rejection, M09-A/B/C.
6. **Windows exact SHA:** [#40477533758](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40477533758) completed/success. Logs show M09-D installed UI and STEP3 native A4 output (2 pages, 6 source markers, 1 raster), NSIS lifecycle and STEP2 upgrade preservation.
7. **원본 설계 대조:** STEP3 import/extract/coordinate/image/role/order/manual review/source compare/warning/new A4 flow is synthetic-fixture verified. Malformed PDF repair is not required by the original step; visible rejection with prior data preserved is the safe expected behavior. Total 7-step progress remains approximately 43%, STEP3 partial because real samples are not accepted.
8. **미검증:** Consented customer-local text-centered PDF samples (5–10), buyer physical Windows PC GUI/print acceptance, complex real document visual QA. No customer files were sent to CI/PR. OCR, local model download/license, cost, merge, deployment remain approval gates.
9. **다음:** Continue standalone STEP3 omissions only when requirements support them. For release acceptance, one batch of owner-side work remains: run 5–10 consented PDFs locally and a buyer-PC manual GUI/print review, then report only outcomes/defect categories. Sale remains NO-GO.
10. **동기화:** GitHub is authoritative. Local nested clone is stale/divergent and contains uncommitted changes; direct git fetch has previously failed due DNS. Do not push that local ref. Remote CI checked out exact SHA above.

## 최신 인수인계 — 2026-10-27 18:26 KST

1. **목표·승인 범위:** `hibi89/astra_pdf_redesigner`, 사용자가 승인한 STEP3 PDF 가져오기 개발. OCR은 별도 승인 전 금지. 최초 설계 원본은 `docs/ASTRA_ORIGINAL_ROADMAP.txt` 및 `docs/BLUEPRINT.md`.
2. **이번 완료 기능:** 각 텍스트 블록을 검수 화면에서 새 프로젝트에 포함/제외할 수 있다. 제외 표식은 메모리 내 검수 초안과 원본 PDF 비교 화면에 유지하고, 프로젝트 변환에서만 빠진다. 모든 텍스트를 제외하면 새 문서 저장을 막는다. 편집 시 검수 동의를 취소하고 Undo로 제외 상태를 복원한다. 사용자 저장 스키마/원문/원본 PDF는 수정하지 않았다.
3. **최종 기능·테스트 SHA:** `cc157cba4b442f44b88c3631a72686fdfe8f8af9`, 브랜치 `integration/astra-commercial-core`, Draft PR #9. 뒤따르는 문서 전용 커밋은 PR head를 변경할 수 있다.
4. **단위·빌드:** exact-SHA GitHub Ubuntu Node 22 [#40479935848](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935848): `npm test` **67/67 PASS**, `npm run build` PASS.
5. **실제 Chrome/Edge 흐름:** 동일 run SUCCESS 2/2. 브라우저가 합성 A4 PDF를 실제로 가져와 검수했으며 원본 17개 표식은 검수 초안에 유지, 선택한 헤더/푸터 4개는 출력에서 제외, 본문 표식 13개·A4·래스터 이미지 보존, 동의 취소 및 Undo를 로그로 확인했다.
6. **Windows 설치형 / M09-D:** exact-SHA Windows NSIS [#40479935852](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935852) SUCCESS. 설치형 창의 분석 중 취소, 교체 파일 선택, 이전 비동기 결과 무시, source URL 정리, V2 전체 저장 불변, STEP3 native A4 출력(2쪽/6개 표식/래스터 1개), 설치/제거와 0.1.0→0.1.1 업그레이드 보존을 확인했다. 이는 합성 파일·hosted Windows runner 증거이며 구매자 물리 PC 수용은 아니다.
7. **중간 실패와 수정:** `deff78f`는 새 fixture 표식 순서, `c067f79`는 17개 표식에 대한 기존 13개 기대값, `e0d6bbb`는 표식과 통합 텍스트 블록 개수 혼동, `b7e642e`는 수정한 테스트의 닫는 괄호 누락으로 실패했다. 각 실패는 로그에서 확인해 테스트 입력/기대값/문법을 고쳤다. 최종 `cc157cba`에서 모든 체크가 성공했다. 실패 테스트를 삭제하거나 생략하지 않았다.
8. **현재 완성도/상용화:** 7단계 기준 약 43%. 72시간 내부 기술 시연 핵심 경로는 M05 판정의 제한된 GO이며, 상용제품은 별도 기준이다. BASIC 8개 디자인은 부분, PRO 20개와 BUSINESS 30개는 미구현, 전 SKU 오프라인 생성형 윤문은 승인대기. 상품 판매/Production NO-GO.
9. **미검증·다음 순서:** 사용자 동의 실제 텍스트 PDF 5–10개를 사용자의 PC에서만 대조하고 결과/결함 종류만 공유한다. 고객 PDF를 CI/PR에 업로드하지 않는다. 이어 구매자 물리 Windows PC의 GUI·인쇄를 확인한다. OCR 승인, 유료 모델·런타임, 외부 전송, merge, 배포는 별도 승인 전 하지 않는다.
10. **보존/환경/갱신:** main, PR #3/#4, V2 사용자 데이터, 원본 설계, 배포 설정은 변경·병합되지 않았다. Production 미배포. GitHub가 기준 원격이며 로컬 clone은 stale/divergent이고 fetch는 DNS 오류였으므로 해당 ref를 push하지 않는다. 갱신 시각 2026-10-27 18:26 KST, 기능/테스트 SHA 위와 같음.

## 2026-10-27 18:40 KST — 총괄 새 운영 순서 인수인계 (최신 내용)

1. **목표/기술/확정 요구:** 사용자 지시로 MVP → 최초 설계 대비 미구현 기능 완성 → 보안/안정/호환/판매 QA의 단계 운영으로 변경. 로컬 React/TS/Vite/PDF.js/IndexedDB/Electron NSIS PDF 리디자인, 원본·사용자 데이터 보존. [실행계획](docs/commercial/MVP_TO_BLUEPRINT_COMPLETION_20261027.md).
2. **완료/결정:** 내부 기술 시연 제한 GO, 7단계 추정 약 43%. 기존 PDF→검수→A4 설치형 경로를 재구현하지 않고 STEP4 스타일 조합/비교/저장 재사용부터 설계도 갭을 줄인다. CSS 방식 vs 허용 디자인 토큰+프리셋 2안 비교, 후자 권고.
3. **검증/미검증:** 최종 기능·테스트 SHA cc157cba4b442f44b88c3631a72686fdfe8f8af9, Chrome+Edge [#40479935848](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935848) success 2/2, Windows NSIS [#40479935852](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40479935852) success, Node 67/67. 물리 구매자 PC/실 PDF·로컬 Electron visual 성공 미검증.
4. **진행/대기/차단:** PHASE2 STEP4 우선 착수; PHASE3 전체 QA 및 판매는 NO-GO. STEP5 일부 로컬 합성 참조 기능 가능 여부 검토, STEP6 외부 검색/OCR/진짜 한국어 LLM 모델 획득은 승인대기.
5. **오류/원인/대안:** Codex 로컬 미커밋 브랜치 codex/p5-windows-reliability에서 Electron 시각 테스트 종료 코드 2147483651; Windows 이벤트 로그 권한 거부로 원인 미상. hosted CI 성공과 혼동 금지; 중복 실패 반복 대신 환경 분석 가능할 때 피벗.
6. **저장소/브랜치/SHA/경로:** hibi89/astra_pdf_redesigner / integration/astra-commercial-core / Draft PR9; 새 계획 문서 커밋 5e455ce9eec372d99954f23fc24ff970b171ab33. 변경된 STATUS/HANDOFF로 HEAD가 전진하므로 최신 원격 SHA 재조회. main/PR3/PR4 보존.
7. **배포/환경:** 로컬 제품, Vercel/Production 미적용. npm test/build, Chrome/Edge 및 Windows NSIS CI. 무단 머지·배포 금지.
8. **원본/백업/비밀:** docs/ASTRA_ORIGINAL_ROADMAP.txt, docs/BLUEPRINT.md, 원본 2 PNG, STEP1 v1/STEP2 V2 및 Codex 로컬 미커밋 원본 유지. 고객 파일 CI 업로드·외부 전송 금지. Git 이력으로 복원 가능.
9. **다음 작업/완료/승인:** 실제 STEP4 코드/저장 구조 확인 → 2개 설계안 비용/안전/유지보수 비교 → 안전한 최소 사용자 동선 한 단위 구현·실PDF 출력 테스트. 주요 설계/스키마 변경 전 승인, 테스트 exact SHA 기록, 현재 43%는 품질/판매율이 아님. 사용자 실PDF 5~10개/물리 PC는 자료 동의 후 검증하되 독립 개발 계속.
10. **기록 시각/범위:** 2026-10-27 18:40 KST, Codex [보고 댓글](https://github.com/hibi89/astra_pdf_redesigner/pull/9#issuecomment-6438491093)·기능 SHA/CI 직접 확인. [GPT-6 지시](https://github.com/hibi89/astra_pdf_redesigner/pull/9#issuecomment-6438610031). 본 작업은 문서/운영 체계 갱신, 신규 기능 검증은 아직 수행하지 않음.

## 2026-10-29 — STEP3/4 continuation handoff (verified code `97a5720`)

- Functional/test SHA `97a5720d9b130d8137e9cfc068ba7b192954d3e1` is on `integration/astra-commercial-core`; Draft PR #9 remains open/unmerged. Documentation commit `6054c0e7aafe6ecf04566d882f0658818c93ca79` records this update.
- Added STEP3 cursor split and safe adjacent merge with whitespace preservation; STEP4 per-document multi-apply undo. Local unit tests 91/91, build, desktop verify 16/16 PASS. Chrome/Edge #40860736343 and Windows installer/upgrade #40860736332 SUCCESS. Windows checks include IndexedDB preservation; no local physical Windows GUI test was claimed.
- 7-step estimate ~52%, under 80%. Real customer PDF acceptance, physical buyer PC, durable custom style persistence/schema approval, and remaining STEP5/6/7 scope are outstanding. No OCR/external service/model download/schema change/merge/deploy/sale.
- Preserve the isolated workspace: local line-ending deltas and patch backups remain; do not delete them or the older isolated checkout.

## 2026-11-11 KST — ASTRA PDF 70% 잠정 기능개발 인수인계 10항
1. **목표·기술:** 기존 PDF 추출→원본 검토→A4 재조판→저장, React/TS/Vite/PDF.js/Electron/IndexedDB; 52→70% 엔지니어링 중간목표. 7단계 전체 설계완성/상용판매와 구분.
2. **완료·판단:** STEP4 휴대용 사용자 스타일 JSON·임시 비교/적용·되돌리기(+5), STEP5 로컬 이미지/PDF 추정 스타일을 동일 JSON 재사용(+4), STEP7 원본 PDF SHA/프로젝트 내용 SHA/블록 수동검토 영수증(+5), 독립 로컬 영수증 vs PDF+프로젝트 백업 검증(+4). 저장 DB 스키마 마이그레이션보다 파일 기반 방식을 선택해 기존 사용자 데이터 영향 최소화. 검토 영수증은 fidelity 인증 아님.
3. **테스트:** 기능·실행 SHA `dab6e365f5c9d57e285eaf71cb840ecc41513c6e`; Node22 `npm test` 107 PASS/0 FAIL; `npm run build` PASS; [GitHub Chrome/Edge #42957762014](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/42957762014) SUCCESS 2/2, STEP4 실제 파일 import/export·임시 preview/cancel/apply/undo→A4 PDF 및 원본 V2 보존, STEP5 참조→프리셋, STEP7 실제 합성 PDF SHA 영수증 PASS; [Windows NSIS #42957762000](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/42957762000) SUCCESS, Node107, desktop16, 설치·업그레이드/STEP2 IndexedDB 보존 PASS. 정확 실행 SHA 이후 문서만 변경.
4. **현재 상태:** 최종기능범위 **70% 잠정** (+18pp); STEP1/2 기초·BASIC8·PDF 합성 MVP 유지. 전 SKU 출시 NO-GO/RELEASE HOLD; 실 고객문서/물리PC/PRO/BUSINESS/진짜 로컬 AI/OCR/STEP6 미완/미검증.
5. **오류·원인·해결:** 스타일 파서 TypeScript unknown narrowing → 분기 분리; A4 실제 594.96×841.92pt 통과를 잘못 막은 좁은 테스트 정규식 → 1pt 허용오차; Undo 후 updatedAt를 적용 전 시각과 비교한 harness 오류 → undo 후 snapshot 비교; Windows URL.pathname 경로 오류 → fileURLToPath. CI 원본 로그에서 각각 검출·수정, 최종 동일 SHA Chrome/Edge/Windows 전부 녹색. 실패했던 harness 재사용 금지.
6. **저장소·브랜치·SHA:** `hibi89/astra_pdf_redesigner@feature/astra-p52-to-p70-20261111`은 `integration/astra-commercial-core@b80830ab3219dbcf88556d60ce2c47c2dcec7764`에서 분기. 기능 검증 SHA 위. 새 파일 `src/step4/stylePreset.ts`, `src/step3/reviewReceipt.ts`, `scripts/verify-source-review.mjs`, 브라우저/Node 테스트 및 Workspace/CI. 기능 SHA 이후 상태·설명만 변경; 최종 HEAD 별도 조회. main/integration/Draft PR #3/#4/#9 불변.
7. **배포·실행 환경:** Node22, `npm test`, `npm run build`; 별도 CLI `node scripts/verify-source-review.mjs /absolute/receipt.json /absolute/source.pdf /absolute/project.localdoc.json`; Electron NSIS hosted Windows unsigned installer 시험. Production/Vercel 해당 없음. 고객 판매·공개 릴리스 없음.
8. **원본·백업·보안:** 기존 localStorage V1/IndexedDB V2, 원본 PDF/7단계 설계/PNG 보존, Git 기반 기능·문서 SHA 복구 가능. 고객 실자료/토큰/유료 모델/외부 서버 업로드 및 원본 변경 0. 영수증은 원본/내용 해시와 수동 검토 메타데이터만; 실제 PDF 정확도 인증·승인 `false`/`NOT_GRANTED`. 실제 고객 문서는 공개 CI 업로드 금지.
9. **다음 우선순위·완료 기준:** 70→85는 고객 로컬 5~10 PDF 정확도·표/다단·한글 A4 품질, 정식 라이선스 보유 GGUF 실제 offline 추론/CPU 모델 품질, BASIC/PRO20/BUSINESS30 등급별 진짜 조판, Windows 구매자 PC/서명/엔타이틀먼트/환불 지원. 모델/고객자료/권한·생산 배포/Schema 변경·PR merge는 사용자 사전 승인. 결함시 최소 수정+전체 회귀, 출시 전 100% QC 별도.
10. **일시·증거·복원:** 2026-11-11 KST, 실제 GitHub Actions #42957762014/#42957762000 완전 성공, 107 Node/16 Desktop과 real Chrome/Edge/hosted Windows만 검증. `docs/commercial/ASTRA_P70_PORTABLE_STYLE_RECEIPT_20261111.md` 증거 기준, 문서 갱신 SHA는 재조회. 기타 실제 고객 수용·Production은 NOT VERIFIED/N/A.
