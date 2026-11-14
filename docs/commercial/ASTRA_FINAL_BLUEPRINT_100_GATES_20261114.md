# ASTRA 최종설계 100% 요구·증거·중단점 (2026-11-14 KST)

**정본:** `docs/ASTRA_ORIGINAL_ROADMAP.txt` + `docs/BLUEPRINT.md` + `REQUIREMENTS.md` + `docs/commercial/PRODUCT_SPEC_V1.md` + 본래 가격·지원 정책. 사용자 요구 전체 100%가 분모이며, 과거 **85% 엔지니어링 추정은 최종완성률이 아니다**. 사용자 승인 가중치·정확 SHA별 통과 증거가 모두 확보될 때까지 공식 완성률 `UNASSESSED`, 100% **미달**, `RELEASE HOLD`.

## 현재 확인한 구현 경로와 남은 100% 구성요소

| 범위 | 기존 구현·증거 | 남은 구현·수용 조건 | 상태 |
|---|---|---|---|
| STEP1 회고록 | `src/App.tsx`, localStorage v1, 기존 Chromium/Windows 합성 CI | 기존 저장/인쇄 비회귀 | 기존 검증 |
| STEP2 개인 문서 | `src/step2/*`, IndexedDB V2, 섹션/이미지/복원/인쇄, 이전 CI | 실고객 Windows 문서·출력 검증과 업그레이드 비회귀 | 이전 합성 검증 |
| STEP3 PDF 업로드·원문 대조 | `src/step3/*`, 원본 PDF 참조/원문좌표/승인·취소·위험 경고 | 사용자 승인 서로 다른 PDF 5–10개 실기기 원본/출력 수동 대조, 복잡 콘텐츠 누락 수용 | 부분·실증 필요 |
| STEP4 디자인 조합 | `src/step4/stylePreset.ts`, 8개 디자인 비교/적용·취소, 스타일 JSON export/import, Windows8/8 합성 A4 | PRO20/BUSINESS30 실제 구조적으로 독립된 디자인, 안전한 로컬 지속 저장·스타일 라이브러리·배치/서식 엔진 | 부분 |
| STEP5 레퍼런스 스타일 | `src/step5/referenceAnalysis.ts`, 로컬 이미지/PDF 분석·제안·되돌림 | 원본에 충실한 실제 레퍼런스 기반 인수, 저장형 레퍼런스·스타일 호환성, 사용자 라이선스 | 부분 |
| STEP6 인터넷 레퍼런스 탐색 | 제품 로드맵에 포함, 실제 앱 내 구현 증거 없음 | 사용자 명시적 검색 동의/외부 전송 경계/저작권·출처·썸네일·원본URL, 로컬 PDF 비전송, 탐색↔STEP5 연결 | 미구현·별도 승인 |
| STEP7 OCR·통합 안정화 | `src/step7/*`/Electron, SHA/토큰/그림/벡터/A4 검토, Windows NSIS 자동 회귀 | OCR/스캔 실제 인식과 인식 출처/수정, 표·다단 보존 범위, 실고객/보안/성능/장애/기기 수용 | 부분·OCR 승인 대기 |
| 상용 AI 윤문 공통 | `src/humanize/rules.ts`, `desktop/local-model-controller.cjs` SHA/IPC·검증 안전 골격, `RELEASE_MANIFEST=null` | 실제 서명/해시 확인된 `llama.cpp` + 허가된 GGUF, 20+ 한국어 골든 문단, 숫자·부정문·인용/고유명사 보존, Windows 8/16GB CPU 실측, 모든 SKU 동일 AI | 실제 모델 **미연동**, 승인 대기 |
| 3 SKU·라이선싱 | 상품 설계 `PRODUCT_SPEC_V1.md`, `PRICING_LICENSING_SUPPORT.md` | BASIC 8/PRO20/BUSINESS30 기능 차등, 라이선스 entitlement, 재설치·환불·지원, 저작권 NOTICE, 실제 판매 승인 | NO-GO |
| Windows 판매물 | 이전 exact functional `0db2acb5`의 합성 CI Windows/NSIS 설치·업그레이드 PASS | 물리 소유자 Windows10·11, SmartScreen/코드서명 정책, 로컬 GGUF 설치, EXE/ZIP SHA·무결성·라이선스 | 출시 보류 |
| P88 소유자 배치검수 | `scripts/owner-batch-acceptance.mjs`, `tests/owner-batch-acceptance.test.mjs` Node22 로컬 합성 5/5 PASS | 실제 서로 다른 5~10건 입력 및 7개 검수, 새 기능 SHA `fb3b0221` 전체 GitHub CI | 합성 단위 통과/고객 미검증 |
| 크몽 상품화 | `docs/commercial/ASTRA_KMONG_LISTING_DRAFT_20261114.md`, 1개 상품·3단계 기존 가격 유지 | 등급별 실제 납품 기능·사용권·환불·스크린샷·마켓 심사, 판매 사용자 승인. **등록완료 이력 증거 전에는 등록완료 금지** | 초안·미등록 |

## 현재 승인 경계
- 이미 승인된 작업: 기존 데이터/기능 보존 상태에서 STEP1–5/검수 도구 보완, 합성 자동회귀, 문서/상품 초안, 무료 공개 라이선스 조사.
- 추가 명시 승인 전 하지 않는 작업: OCR/인터넷 검색 외부 호출의 사용자 PDF·사내 자료 전송, 로컬 기존 저장 스키마 마이그레이션, 모델 가중치·추론 실행 파일 무단 다운로드/재배포, 코드 서명 구매, 크몽 상품 실제 발행, Draft PR/main 병합/Production 배포. 목표 100% 자체가 기존 승인 경계를 무효화하지 않는다.
- 무료 공개 자료의 라이선스 **표시**는 실제 재배포 패키지의 권리 점검 및 NOTICE 충족을 보증하지 않는다.

## 완료 판정 요건
1. 원래 최종설계에 있는 범위를 제거하지 않고 REQ마다 구현 파일 및 재현 테스트와 사용자 승인 기준에 연결.
2. 최신 소스 정확 SHA의 Node/TypeScript/Chromium Chrome·Edge/Windows Electron·NSIS/데이터 업그레이드 검증.
3. 5–10개 실제 허가된 고객 PDF, 실제 Windows10·11 설치·작업·인쇄·원문 검수, 모델 CPU 품질/라이선스 증거.
4. 상용 배포물 내용·가격·기술/모델 고지·소유자 최종 승인 후 상품 등록. `Ready`나 unit PASS만으로 100%·판매 GO 금지.
5. 증거 부족 시 `UNASSESSED`와 개별 `미검증`으로 기록하며, 임의 가중치나 계산된 엔지니어링 추정으로 최종 점수 대체하지 않는다.

**2026-11-14 KST 검증 기준:** 실소스 GitHub 파일·기능 `fb3b02217c6c4223df49c2141e9373f08317a66c`; P88 source/test Git Blob SHA 각각 `3c6a4fcd...`, `e14d18f8...` 로컬 테스트 동일성 확인. 최종설계 정책 게이트 #43541356536 SUCCESS, Linux/Windows 신규 CI는 최초 작성 시 진행 중. 이전 `0db2acb5` CI는 기록 보존하되 새 코드 성공 증명 아님.
