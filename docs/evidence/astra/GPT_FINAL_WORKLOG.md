# Astra GPT final QA worklog — G001–G004, 2026-11-15 KST

1. **목표/용도/요구/기술**: 최종 A01~A12 100점 기반 G001 OCR 공급망, G002 한국어 원본/출력 검수, G003 Codex C001 독립 검수, G004 비공개 실제 수용 절차. Node 22/GitHub-hosted Actions; GitHub-only. Codex UI/Electron 구현 전용 파일을 수정하지 않음.
2. **완료/변경/결정**: G001 독립 P119 메타데이터 fail-closed 검수, G002 source/import/output 합성 숫자·부정·표·해시 검사, G003 Codex P124 pinned SHA read-only 구조 리뷰, G004 익명 수용 요약 validator 및 로컬 5~10 PDF/Win10/11 체크리스트. P119는 서명/저작권 문제로 실제 공급자 여전히 BLOCKED. Codex PR #13 F01 SKU 테스트 전용 라벨/권한 미증명, F02 test harness 배포 가능성; 직접 수정하지 않고 PR 검수 의견 제출.
3. **실행 테스트/검증**: GPT exact-SHA `24939be58c6fcd3396697bd93aa58a082b4d7a48`; [G001–G004 independent Actions 43683920991](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683920991): **52 PASS, 0 FAIL, 0 SKIP**; same SHA pinned Codex `6e8b2eeb381874a12be041fa080fb545b5e1fb82` checkout static reviewer SUCCESS, original OCR release gate PASS; [policy 43683921084](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683921084) SUCCESS. **실제 Codex P124** [Windows 43683050524](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683050524) FAIL at 10 real proposals per BASIC SKU; production-only NSIS step SKIP. G002/G004 synthetic code tests만 PASS이며 고객 PDF/물리 Windows는 NOT VERIFIED. 새 문서 커밋 후 exact SHA 재확인 필요.
4. **상태/중단점**: G001 분류코드 완료, 공급 승인 BLOCKED. G002/G003/G004 독립 코드·문서 준비 완료, 고객 실제 수용 대기. G005 통합 브랜치 PR #12 리뷰/통합 미완. P119/P120/P121/P126 BLOCKED. P124 failed +0. 최종설계 **64/100 잠정(변경 없음)**, 공식 `UNASSESSED`, `RELEASE HOLD`.
5. **오류/원인/시도/재시도 금지/대안**: OCR 세 설치파일은 Authenticode UnknownError 및 exact-bundle license/NOTICE 부족; 같은 파일 무변경 재검사 금지. 대안 신뢰 공급자/재현 빌드/고객 선택 설치 검토. Codex P124 `healthy` 10개 유효 제안 threshold 미충족, 원인 분포는 artifact 미확인. 코드/데이터 검토 없이 동일 9분 CI 반복 금지; 먼저 개별 제안 거부 사유를 **원문 없는 집계**로 분류하고 수정을 확정할 것.
6. **저장소/브랜치/SHA/경로**: `hibi89/astra_pdf_redesigner`, GPT `gpt/astra-final-qa-ocr-20261115`, Codex `codex/astra-final-ai-sku-20261115@6e8b2eeb...`, integration `integration/astra-final-blueprint-100-20261115@bfef5474...`. GPT 52 PASS SHA `24939be58c6fcd3396697bd93aa58a082b4d7a48`. 신규 테스트/도구 `tests/gpt-final-qa-*`, `tools/gpt-final-qa-*`, `.github/workflows/gpt-final-qa.yml`, `docs/evidence/astra/G001–G004`; GPT PR #12 / Codex PR #13 모두 Draft.
7. **Production/환경**: 상품 출시 없음, Vercel **미적용**, Windows 테스트는 GitHub-hosted Windows runner만(물리 구매자 PC 아님), Node 22. 테스트 명령은 `node --test tests/gpt-final-qa-p119-gate.test.cjs tests/gpt-final-qa-text-fidelity.test.cjs tests/gpt-final-qa-p124-review.test.cjs tests/gpt-final-qa-owner-acceptance.test.cjs tests/ocr-supply-chain-preflight.test.cjs tests/ocr-release-hold-gate.test.cjs`; exact CI workflow가 authoritative.
8. **원본/백업/보안**: 원본 PDF/PNG/로드맵/STEP1 localStorage V1/STEP2 IndexedDB V2/기존 코드/설계는 미수정·기존 SHA 백업 역할. `OCR_MANIFEST=null`, production issuer/JWK/핀 null, customer flag disabled. 테스트용 JSON은 합성/익명, 실제 PDF 내용·파일명·해시·키 외부 업로드 금지. 판매용 번들·설치·구독·허가 변경 없음.
9. **다음 우선순위/절차/승인**: (1) GPT PR #12 additive 파일 및 exact-SHA 52-test 독립 검수→integration branch PR만 선택적 반영; STATUS/HANDOFF 갱신. (2) Codex #13 실제 실패 원인 수정 SHA 확인 후 독립 재검수; F01/F02 교정 요구. (3) G002 실제 PDF.js 기반 출력 및 위치 검사 고도화. (4) 실제 허가 PDF 5~10건·물리 Win10/11·실판매/법적 승인 마지막에 오너 수용. 원본 변경/상용 배포·고객 실데이터 업로드/유료 사용 전 승인.
10. **갱신 KST/확인 범위/기준 SHA**: 2026-11-15 KST; GitHub GPT 독립 52/52 PASS와 Codex latest exact `6e8b2eeb...` FAIL 확인. 이 worklog 자체가 제품 100% 근거가 아니며 G005 통합 전 `STATUS.md`/`HANDOFF.md` 공통 파일은 변경하지 않았음.

## 근거 문서
- [G001 supplier provenance](G001/VERIFICATION.md)
- [G002 source/output text guard](G002/VERIFICATION.md)
- [G003 Codex code review and failed run](G003/VERIFICATION.md)
- [G004 private buyer acceptance protocol](G004/ACCEPTANCE_PROTOCOL.md)
- [G004 anonymous *unexecuted* template](G004/OWNER_ANONYMOUS_TEMPLATE.json)
