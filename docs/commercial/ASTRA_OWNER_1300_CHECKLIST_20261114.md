## 2026-11-14 사용자 명시 승인 — 3건 확정

- **승인 1:** 무료 로컬 OCR 후보 검토/구현 승인. 1순위 Tesseract OCR (Apache-2.0), `tesseract-ocr/tessdata_fast` 한국어 `kor.traineddata` (Apache-2.0) + 영어 `eng.traineddata`; 실제 Windows 바이너리 배포물의 개별 제3자 라이선스, SHA-256, 모델/데이터 해시 확인 및 CPU·OCR 품질 실증 전 상용 재배포 불가. 원본 PDF 자동 전송 금지. 공식 출처 https://github.com/tesseract-ocr/tesseract , https://github.com/tesseract-ocr/tessdata_fast , https://tesseract-ocr.github.io/tessdoc/Installation.html .
- **승인 2:** 무료 한국어 로컬 AI 모델 후보 검토 승인. llama.cpp upstream MIT, Qwen 공식 `Qwen/Qwen3-0.6B-GGUF` Apache-2.0 후보 (Q8_0 약 639MB). 공식 https://github.com/ggml-org/llama.cpp/blob/master/LICENSE , https://huggingface.co/Qwen/Qwen3-0.6B-GGUF , https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/blob/main/LICENSE . 0.6B는 기능·CPU 속도 검증용 후보이며 실제 한국어 윤문 품질 충족 **미검증**; 더 큰 모델·양자화 대안과 품질/속도/메모리 비교 후 최종 채택. 모델/바이너리 다운로드 및 SHA·NOTICE·제3자 종속성 검증 완료 전 상용 번들 금지.
- **승인 3:** `docs/commercial/ASTRA_P100_SCOREBOARD_20261114.md` A01–A12 배점 합계 100점 **승인 완료**. 배점 승인은 기능 인수/100% 합격 아님. 증거 점수 부분 산정은 후속 정확 기준 정의 필요. 현재 공식 수치 산정 대기, 목표100% 미달. 승인 재요청 금지.
- **승인 제외:** 유료결제·외부 고객 원본 PDF 업로드·실 라이선스 개인키 발급/보안 변경·크몽 등록/판매 GO·기능 품질 축소·라이선스 위반 번들 배포. 사용자가 PC 앞에 있을 때는 실 테스트용 허가 PDF5–10개 준비 및 OS/Node 환경 확인만 요청, 원본 파일 채팅 업로드 요구하지 않음.
- **2안 비교:** OCR A) Tesseract 별도 로컬 실행 파일(최소 변경/비용0/속도 적절/패키징 권리검토 필요) vs B) 브라우저 WASM OCR(번들 용량/CPU 부담/추가 의존성). **A 우선**. AI A) llama.cpp+Qwen 공식 GGUF(오프라인/0원/기존 controller 재사용) vs B) 클라우드 API(키·비용·고객정보 외부 전송 위험), **A 우선**. 기존 STEP7/LLM 데이터 흐름·중복 실행/타임아웃/오류복구·원본 보존 설계 후 구현.

# Astra PDF Redesigner — 2026-11-14 13:00 KST 사용자 작업 일괄 요청

**정책:** 0원, 사용자 실 PC에서만 할 수 있는 최소한의 검수만 부탁한다. 개인정보/고객 문서는 GitHub·웹에 올리지 않고 로컬 전용. 이미 존재하는 13시 통합 자동화 재사용(중복 예약 생성 금지). 직접 사용/외부 자료 다운로드/판매 승인 없이 릴리스·결제 없음.

## 사용자 수행 요청 (단계별 검증, 한 번에 안내)

1. **물리 Windows10/11 실기기**: 기존 프로젝트/원본 PDF 별도 백업 → 미서명 설치형을 *신뢰할 수 있는 로컬 사본*에서 실행(Windows SmartScreen/Defender 우회 강요 금지) → 설치/실행/인쇄/업그레이드/제거 후 데이터 보존 결과만 기록. Windows11 기기가 없으면 '미검증'으로 남긴다.
2. **서로 다른 소유·사용 허가 PDF 5~10개**: 가능하면 텍스트형, 표·이미지 혼합, 다페이지, 스캔형을 포함. `scripts/owner-batch-acceptance.mjs`와 STEP7 원본↔결과 수동 7항목(문장·숫자·이미지·표/구획·순서·페이지 누락·출력 가독성) 확인. 파일명·실제 내용·경로 대신 익명 체크 결과만 공유. 다른 사람의 비밀문서 공유 금지.
3. **무료 OCR/Tesseract·한국어 GGUF/llama.cpp**: 설치할 수 있는 공개 원본/상업 재배포 조건/다운로드 용량/CPU RAM 요구 사항을 먼저 제시한 뒤, 사용자에게 필요한 다운로드/사용권 동의를 일괄 받기. 기본값은 다운로드/모델 추론 OFF. 유료 API·구독·코드서명 구매 요구 금지.
4. **글꼴/상표/모델 상용권과 SKU 검수**: BASIC 8/PRO20/BUSINESS30 디자인 정식 작동 확인 후, 글꼴·모델·번들 라이선스/NOTICE/환불·지원 조건 및 크몽 등록 내용 최종 승인. 권리 입증 전 100%·판매 GO 금지.

## AI 담당자 작업 (13시 이전)

- 정확 SHA Linux Chrome/Edge/Windows CI 완료 확인 및 최소 회귀 보정.
- STEP6 외부 검색은 사용자가 입력한 단어만 동의 후 검색 페이지에 전달; PDF 자동 업로드 금지.
- 기존 STEP1 v1/STEP2 V2 보존하며 STEP4/5/7 및 SKU 구현 남은 항목 계속 개발·테스트.
- 변경 근거와 SHA, 미검증을 STATUS/HANDOFF/해총 크몽 원장에 최신 반영.

## P93/P94 이후 13시 추가 승인 항목
- **폰 가능:** 최종설계12영역 100점 가중치 제안([점수표](ASTRA_P100_SCOREBOARD_20261114.md))을 그대로 승인할지 결정. 미승인 시 공식 UNASSESSED 유지. 이는 배점 승인일 뿐 개별 요구 실수용/판매 GO가 아님.
- **PC 필요:** P93 22종 합성 A4 Chrome/Edge/Windows CI는 이미 확인했으므로 중복 테스트 금지. 로고·브랜드 JSON은 P94 기술 검증을 통과했으나 사용자 본인 브랜드/폰트 권리·한국어 출력은 물리 PC에서 확인 필요.
- P95 다중 PDF 큐는 현재 구현/CI 미완. 사용자에게 조작·테스트 시키지 말 것.

## 12:39 P95~P99 최신 사용자 요청 분류 (추가 중복 알림 금지)
- **폰으로 결정**: 12영역 100점 가중치 제안안을 그대로 승인 또는 보류. 개인 키·구매자 정보·원본 PDF를 채팅에 입력하지 않음. BASIC/PRO/BUSINESS 판매 정책·서명키 발급·재설치/환불·메이저버전 제한 승인 여부는 별도 명확한 GO 전 무단 활성화 금지.
- **PC에서 실제 테스트(외출 후 가능)**: 소유권 있는 상이한 5~10개 PDF의 원본·재디자인 결과 7개 항목 육안 대조, 실 Win10/11 환경/폰트/SmartScreen/인쇄/실 응답. P95/P97/P98 GitHub runner 합성 PASS는 이미 완료되어 중복 수동 디버깅 요청 금지.
- **모델/OCR/저작권**: 저작권/해시를 검증하기 전 모델 바이너리·Tesseract 명령 및 재배포/크몽 등록을 실제 완료했다고 주장하지 않음. 사용자 0원 승인 범위만 진행. P99 외부 브라우저 새 CI 결과를 13시 시점 재확인해야 실제 검증됨.

### P99 정확 코드 새 CI 최종 확인
- 기능·보안회귀 SHA `0a0dec3e` Linux Chrome/Edge 2/2 SUCCESS Node177 PASS, Windows NSIS SUCCESS Node176 PASS/desktop19 PASS. 이 결과로 합성 테스트 반복을 사용자에게 요구하지 않음.
- 실 물리 Windows10/11에서 사용자가 직접 입력한 공개 검색어로 Google/Bing 시스템 브라우저 및 네이티브 추가 확인이 열리는지만 추후 검증. 개인 PDF/이름/문서제목을 검색어로 쓰거나 외부로 전달하지 않음.

## 13시 최신 사용자 중복 요구 금지 — P100 STEP6 출처 보관 CI 통과
- 코드 `2213e8e5` Chrome/Edge Linux Node179 PASS/Windows Node178 PASS+desktop19, 원본 V2 불변 확인. 사용자에게 이 기능을 별도 수동 테스트·개발하게 요청하지 않음. 실제 이미지 저작권/출처 수용과 물리 Windows·원본 PDF5~10/모델·OCR/판매 GO만 미해결로 요청.
