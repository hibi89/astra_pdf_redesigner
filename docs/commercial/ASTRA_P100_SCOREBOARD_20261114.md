# Astra PDF Redesigner — 최종완성률 추적표 / 100% 전체 설계

> **P111~P113 2026-11-14 잠정 최종설계 50/100점:** 기존 42 + A04 BUSINESS 2~20문서 세션 일괄 브랜드 +2, A06 출처→로컬 STEP5 파일 분석 연결 +2, A07 원본 이미지와 OCR 초안 수동 대조 및 Tesseract 별도 합성 공급자 실측2/3 +2, A08 Qwen3 로컬 Ollama 옵트인/전후 Diff/취소·되돌림(mock API 검증) +2. 정확 기능 SHA `26aff40d6de524c2430f8a6b325d906cea67f7e1`, Linux [#43595956953](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956953) + Windows [#43595956932](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595956932) + 정책 [#43595957159](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43595957159) **3/3 SUCCESS**. 12영역 공식 수용은 여전히 **UNASSESSED**, 상용 RELEASE HOLD, 점수 추적 [상세표](ASTRA_FINAL_EVIDENCE_SCORE_20261114.md) 참조. 실고객 Win10/11, 모델 실제 CPU 추론/Astra UI, OCR Windows 재배포·성능·PDF5~10 미확인.

> P95~P99 최신 개발/검증: `STATUS.md`, `HANDOFF.md` 상단. P95 PRO 수동 다중 PDF Chrome/Edge/Win 성공, P96 offline signed license verifier 모듈 CI 성공, P97 PRO 저장형 레이아웃 라이브러리 수정 후 CI 성공, P98 BUSINESS 브랜드 라이브러리 CI 성공, P99 안전 외부검색 2026-11-14 Linux/Win 3/3 CI 통과 (실 물리PC 팝업 미검증). 12영역 100점 배점은 2026-11-14 사용자 승인으로 확정. 기능별 부분점수는 별도 증거 기반 검증 후 산정; 100% 미달.

> **P110 점수 추적 (2026-11-14 KST): 총괄 잠정 최종설계 42/100점=42% (P109 41→P110 +1%p).** 공식 사용자/구매자 최종 수용 점수는 여전히 **UNASSESSED**이며, 승인된 12개 가중치는 불변. 배점별 증거와 58점 미충족을 `docs/commercial/ASTRA_FINAL_EVIDENCE_SCORE_20261114.md`에서 참조. 정확 코드 SHA `5ed3525947f0225888963806f95d8f821ca03394`: Linux [#43593105358](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105358), Windows [#43593105373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105373), 정책 [#43593105644](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105644) 3/3 SUCCESS. 상용/실고객 출시 RELEASE HOLD.

**갱신:** 2026-11-14 KST. **12영역 100점 가중치 사용자 승인 완료. 현재 공식 증거 점수: `산정 대기` (0% 아님), 목표: 100%.** 과거 내부 기술 지표 `85% (잠정·구 범위)`를 별도 보존. 실제 제품/고객 수용/판매 진척률과 혼동 금지. 기준 정본: `REQUIREMENTS.md`, `docs/ASTRA_ORIGINAL_ROADMAP.txt`, `docs/BLUEPRINT.md`, `docs/commercial/PRODUCT_SPEC_V1.md`.

> **P109 (2026-11-14) A09 SKU GUI 실행 경로 추적:** 기능 SHA `ee7ed4eaacf44a08800b56639d2178f5df76e7d3`. 오프라인 서명 영수증 확인 패널 + 상용 고객 실행 경로의 BASIC/PRO/BUSINESS 레이아웃 선택·PDF 저장, PRO 배치 PDF 최종 저장/보관함, BUSINESS 브랜드 키트 저장·적용에 P107 검증기를 호출. 5개 신규 합성 회귀 PASS. Linux Node241/241, Windows Node240PASS/1 OS SKIP+desktop59 PASS, Chrome/Edge/Win NSIS 정확 SHA [3개 Actions](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625251) **3/3 SUCCESS**. 실제 판매자 issuer pin null, 고객용 build flag=false, 기존 내부 시안은 개발용으로만 유지. 고객 바이너리/IPC 직접 출력 우회·환불/장치/실 사용자 수용 미완. **공식 UNASSESSED, RELEASE HOLD, 상용 완료 아님.**

> **P108 (2026-11-14) A09 코드 추적 업데이트:** 기능 SHA 0bf9c7bb125b25b3441117a6e54ba53ac05cba67; 기존 P96/P107에 더해 src/commercial/offlineLicenseIssuer.ts 신규 오프라인 서명 발급·연장 정책과 tests/offline-license-issuer.test.ts 합성8건. 정식 판매자 개인키·public JWK pin=없음, 발급 GUI·상용 license 유통·기기 인증·취소/환불 및 UI/수출 기능 잠금 미완. **A09 11점 최종 수용 아님, 공식 12영역 UNASSESSED/100% 미달.** 정확 SHA CI 3개 run의 전체 판정은 STATUS 최상단을 따름.


## 정확 SHA 증거
- **P94 기능 SHA:** `39acc84f48bf1edda4b2687e896dc833ab398e92`. Linux [#43549158873](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43549158873) **Chrome/Edge 2/2 SUCCESS**, Node **165/165 PASS**, TS/Vite build PASS, 고급 22/22 A4 출력 및 P94 브랜드 키트 브라우저 회귀 PASS.
- **Windows [#43549158855](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43549158855) SUCCESS**: Node **164 PASS/0 FAIL/1 SKIP**, desktop **16 PASS**, NSIS 설치·제거·업그레이드 후 기존 V2 유지. [최종설계 정책 #43549159013](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43549159013) SUCCESS(증빙 준수 정책만).
- **P93 별도 기능 SHA:** `ffd7a3dd08648d24671f199e316dc3067c4687d9`, Linux [#43548967975](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43548967975), Windows [#43548967995](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43548967995) 각 SUCCESS. 실제 브라우저에서 **22개 후보 모두 A4 출력/PDFInfo 형식 점검 PASS**, 기존 저장 V2 불변.
- GitHub-hosted runner와 합성 문서만 검증. 실제 고객 Windows PC 및 허가된 고유 PDF 5~10건의 소유자 육안 합격이 아님.

## 12개 최종 요구 영역과 현재 수용 장벽

| ID | 최종 범위/수용 | 코드·증거 | 검증·보류 상태 | 확정 배점(사용자 승인) |
|---|---|---|---|---:|
| A01 | STEP1 회고록 입력·저장·A4 | `src/App.tsx`; P94 브라우저/Windows CI | 합성 기술 PASS·고객 검수 대기 | 4 |
| A02 | STEP2 섹션/이미지/문서 영구저장·복원 | `src/step2/*`; P94 IndexedDB/NSIS | 합성 기술 PASS·실 PC 대기 | 6 |
| A03 | STEP3 PDF 업로드·원문 대조·확정 | `src/step3/*`; 기존 브라우저 E2E | 실 문서 5~10개 육안·표/이미지 누락 판단 대기 | 14 |
| A04 | STEP4 8/20/30 고유 조판·스타일·브랜드/배치 | P93 22/22 A4; P95 PDF 개별 인수; P97 PRO 24시안 로컬 저장; P98 BUSINESS 12브랜드 텍스트/로고 시험 | P95/P97/P98 합성·Chrome/Edge·Win PASS, 영구 30종 정식 SKU 사용권·BUSINESS 일괄 적용·고객 PDF 수용 미완 | 15 |
| A05 | STEP5 로컬 레퍼런스 분석/적용·복원 | `src/step5/referenceAnalysis.ts` | 합성 검증·실고객 원본 디자인 수용 대기 | 5 |
| A06 | STEP6 인터넷 레퍼런스 탐색/STEP5 연결 | P99 `desktop/approved-search-link.cjs` 안전 외부 Google/Bing 검색+윈도우 확인; P100 `src/step6/sourceRecords.ts` 수동 URL·권리메모 로컬 보관 | P99 Chrome/Edge Node177/Win176·desktop19 PASS; P100 Chrome/Edge Node179/Win Node178+desktop19 CI 3/3 SUCCESS. 원래 앱내 검색 카드·자동수집·출처 확인/STEP5 직접 선택 연결·실 사용자 웹팝업 미완 | 5 |
| A07 | STEP7 실제 OCR/콘텐츠 안전/통합 | `src/step7/*`; 구조·토큰·PDF 대조 | 실제 OCR 미연동·표/다단 수용·실 PDF 미완 | 12 |
| A08 | BASIC/PRO/BUSINESS 공통 진짜 로컬 한국어 LLM 윤문 | `desktop/local-model-controller.cjs` 안전 골격 | 실제 GGUF/llama.cpp·CPU·품질·권리 미검증, `RELEASE_MANIFEST=null` | 14 |
| A09 | SKU 차등·라이선스·설치/지원/환불 | `src/commercial/offlineLicense.ts`, P96 ECDSA P-256 3SKU 검증 Node170 + Win169 PASS | 공개키 pin·상용 개인키·GUI entitlement 잠금/활성화·재발급·기기수·약관 미구현, 실제 판매 불가 | 11 |
| A10 | Win10·Win11 설치·보안·인쇄·복구 | Windows CI NSIS 업그레이드 | GitHub runner PASS, 실제 물리 PC/서명·SmartScreen 미수용 | 5 |
| A11 | 5~10개 허가된 PDF 수동 비교·고객 승인 | `scripts/owner-batch-acceptance.mjs` | 합성 검수 도구 PASS, 실제 건수 0·수동 승인 없음 | 7 |
| A12 | 크몽 등록·자료·구매자/법적 최종 승인 | `ASTRA_KMONG_LISTING_DRAFT_20261114.md` | 초안만 존재, 실 등록 0/SALE HOLD | 2 |
| **합계** | **전체 최종설계 범위** | | **100% 미달** | **100 (확정)** |

**중요 (2026-11-14 사용자 승인):** 마지막 열 A01~A12 배점 4+6+14+15+5+5+12+14+11+5+7+2=100점 **확정**. 그러나 배점 승인 자체는 검수 합격/판매 승인이 아니다. 각 항목의 세부 증거/부분점수 수용 규칙이 아직 정의되지 않았으므로, 임의로 0점·85점·100점을 공식 완성률로 발표하지 않는다. **공식 수치 `산정 대기`, 목표100%, 달성 아님.** 기술 CI 합격/물리PC 미검증/법적권리 미승인을 분리해 후속 수용 점수 산정한다.

## P95 시도/실패/전환
- 시도: PRO 여러 PDF 순차 대기 → 파일별 추출/수동 승인/저장 큐를 기존 `ImportPanel.tsx`에 소규모 통합.
- 실패 근거: GitHub 읽기 소스가 CRLF이고 두 차례 자동 패치에서 UI 대상 문자열 앵커를 단일하게 찾지 못해 **커밋 전 중단**. 기존 코드·고객 데이터 영향 없음. 실제 기능 테스트 실패가 아니다.
- 전환: 현재 ImportPanel 강제 수정 금지; 향후 독립 `BatchImportPanel` 분리·스토리북/브라우저 소스 실제 확인 후 소규모 통합. 승인 없는 일괄 자동저장 금지. 완성 주장 금지.

## 사용자 개입과 출시 게이트
2026-11-14 사용자 채팅에서 A01–A12 **배점 승인 완료**. 동일 승인 재요청 금지. 실제 소유 PDF 5~10개·Windows 실물 설치/인쇄·AI/OCR 0원 실모델 설치와 권리·브랜드/폰트 재배포·최종 판매 승인은 별도 조건. 사용자 자료는 GitHub/클라우드로 전송하지 않는다.

**릴리스 상태:** [작업중], BASIC/PRO/BUSINESS RELEASE HOLD, 크몽 미등록, main/Draft PR10·사용자 V1/V2·원본 PDF 불변, Production/Vercel 미적용.
