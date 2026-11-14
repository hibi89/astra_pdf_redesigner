# Astra PDF Redesigner — 12영역 최종설계 증거 기반 잠정 완성률

**기준일: 2026-11-15 KST · P117 검증 기능 SHA `c4d96dc02fb616e44773871952343161079e293b` · 잠정 56/100점 (56%).**
**공식 구매자 최종 수용률: UNASSESSED. 출시: RELEASE HOLD.**

## 산정 원칙

사용자가 확정한 A01~A12 12개 영역의 100점 배점 **그대로** 사용한다. 아래 1점 단위 부분 수용 분해는 사용자 승인된 배점의 변경이 아니라 **총괄이 제안하는 잠정 검증 체크포인트**다. 각 항목은 코드 실행 및 CI·합성 브라우저 검증 증거가 있는 기능에만 부분 점수를 부여한다. 정식 판매·원본 내용 품질·실 물리 PC·구매자 최종 승인은 CI로 대신하지 않는다.

이 표의 **잠정 56%는 공식 확정 수용률과 다르며, 내부 기술 85%/95%나 출시 준비도에 전용할 수 없다.** 사용자가 부분 배점·수용기준을 확정하고 미확인 사항을 직접 검수할 때 공식 값을 산정한다.

| 영역 | 사용자 확정 배점 | 이번 회차까지 잠정 인정 | 남은 점수 | 인정한 합성/코드·출력 증거 | 반드시 남은 수용 |
|---|---:|---:|---:|---|---|
| A01 회고록 입력·저장·A4 | 4 | 3 | 1 | STEP1 필드·V1 자동 저장·Chrome/Edge A4 출력 | 사용자 실제 회고록 인쇄 |
| A02 문서·이미지·V2 | 6 | 5 | 1 | STEP2 블록·이미지·IndexedDB V2/PNG·파일 복원·NSIS 업그레이드 | 구매자 물리 PC 복원 |
| A03 기존 PDF 가져오기·원문 대조 | 14 | **12** | 2 | PDF.js 원본 추출·수동 승인·텍스트/이미지 대조·암호/손상/스캔 경고; **P114 Chrome/Edge 12종 위험 레이아웃·페이지별 승인 저장 게이트·원문 순서 보존; P115 Chrome/Edge 각각 15종 A4 차이 매트릭스(숫자·기호·부정·링크)와 원본 SHA/V1/V2 불변** | 실제 표·다단·도형·누락·의미 정확도 확인 |
| A04 8/20/30 레이아웃·브랜드·다중 PDF | 15 | **14** | 1 | BASIC8 + PRO12 + BUSINESS10 구조 차별성·실제 A4 PDF를 Chrome/Edge 30/30 검증; P112/P117 2~20개 문서 세션 브랜드 계획과 2/5/20개 개별 A4 출력·취소·V2 불변을 Chrome/Edge에서 확인. 배치 로고 포함·영구 저장은 미구현. | 최종 구매자 시각 품질·고객 수용 |
| A05 로컬 디자인 참고·적용 | 5 | 3 | 2 | 이미지·PDF 로컬 색상/타이포 분석·비파괴 스타일 적용 | 실제 레퍼런스 품질 및 복원 |
| A06 온라인 레퍼런스 | 5 | **4** | 1 | 안전한 브라우저 검색 링크·URL/권리메모 로컬 기록  P112 저장된 HTTPS 출처→사용자 파일 선택→STEP5 로컬 분석 직접 연결, 권리·파일 동일성 인증/내장 검색 카드 없음. | 내장 검색 결과·출처 검증·STEP5 직접 연결 |
| A07 OCR·콘텐츠 안전·STEP7 | 12 | **5** | 7 | STEP7 PDF 대조·수동 검토·출시 OCR 차단 정책/검사  P113 원본 페이지 임시 이미지·OCR 텍스트 좌우 수동 대조 체크. 별도 로컬 Tesseract 5.5.0 한국어 합성 2/3 정확(1 실패), 앱 설치형/정식 재배포 미검증. | 합법 공급처의 Tesseract 실제 한국어 OCR·표/스캔 정확도 |
| A08 한국어 로컬 AI 윤문 | 14 | **2** | 12 | 제어기 골격은 존재하지만 실 모델 추론 없음(0점)  P111 소유자 설치 로컬 Ollama 고정 주소 Qwen3 동의 기반 UI·프로세스 어댑터·Diff/되돌리기, 합성 mock 검증; Astra 실제 CPU 모델 추론/문장 품질은 미검증. | 상업 재배포 가능한 GGUF/CPU 실제 동작·품질·비교·되돌림 |
| A09 라이선스·SKU·지원 | 11 | **5** | 6 | P96 서명 검증, P107 기능 매트릭스, P108 발급/연장, P109 GUI 실행 게이트, **P110 Electron PDF IPC main-frame/URL 검사** | 판매자 실제 공개키 pin·안전 발급/재발급/환불/철회·기기 수/오프라인 운영·same-frame IPC 우회·지원 약관 |
| A10 Windows 설치·복구 | 5 | 3 | 2 | CI Windows unsigned NSIS 설치·제거·업그레이드, A4/IndexedDB·PNG 보존 | 실 Win10/11 물리 설치·서명/SmartScreen |
| A11 허가 PDF 5~10건 검수 | 7 | 0 | 7 | 합성 도구는 존재하나 실제 사용자 승인 문서 0건 | 실제 허가 PDF 5~10건 독립 대조/육안 수용 |
| A12 판매·법적·최종 승인 | 2 | 0 | 2 | 상품 등록 초안만 존재 | 저작권·재배포권·크몽 등록·최종 구매자 승인 |
| **합계** | **100** | **56** | **44** | **잠정 증거 기반 구현·검증 점수** | **공식 수용 미완** |

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
다음 실행은 **P118 로컬 레퍼런스 분석→비파괴 적용·재현성 강화**다. 이후 P119~P121 Windows Tesseract 실공급처·실한국어 인식·Electron OCR은 hosted 환경에서 실측이 불가능하면 BLOCKED/0점으로 기록하고 독립 작업을 진행한다. P122~P123은 실 Ollama/Qwen3 CPU 추론을 mock으로 대체하지 않는다. G60/G65/G70은 각 기준 점수에서 별도 증거로 판정한다. 공식 구매자 수용은 UNASSESSED, RELEASE HOLD를 유지한다.
