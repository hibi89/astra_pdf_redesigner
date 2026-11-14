# ASTRA 오프라인 한국어 모델/런타임 상용 라이선스 1차 사전점검 (2026-11-14 KST)

**판정: 사용 후보 존재 / 실제 모델 구동·재배포·한국어 품질·Windows 설치 검증 전.** 이 문서는 웹상 라이선스 표시와 공식 소스 확인만 담으며 다운로드·실행·판매 승인이 아니다.

## 확인한 공식 소스
1. `Qwen/Qwen3-0.6B-GGUF`: 공개 배포 저장소에서 **Apache-2.0**으로 표시. 공식 모델 카드 및 파일 목록 https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/tree/main .
2. 동일 모델의 기본 가중치 `Qwen/Qwen3-0.6B` Apache License 2.0 파일: https://huggingface.co/Qwen/Qwen3-0.6B/blob/main/LICENSE .
3. `ggml-org/llama.cpp`의 LICENSE: **MIT**, 저작권/조건을 복제에 포함해야 함. https://github.com/ggml-org/llama.cpp/blob/master/LICENSE .
4. 기존 Astra 설계 `docs/commercial/M03_OFFLINE_ENGINE_DECISION.md` 및 컨트롤러 `desktop/local-model-controller.cjs` 기준 CLI 방식을 유지. 서버형/유료 API가 아닌 Electron preload IPC→CLI `spawn(shell:false)`, 모델 파일 SHA 확인, 원문 프롬프트는 임시 파일, 텍스트 전송 0.

## 검증되지 않은 항목
- 최종 정확 GGUF 파일명·양자화 방식·SHA256·모델 카드의 파일별 추가 조건 및 상용 재배포 NOTICE/저작권 표시.
- 실제 Windows 배포 대상 `llama-cli.exe`가 사전 문서의 플래그들과 호환되는지, 실행 바이너리의 공급망/의존 DLL/아키텍처/보안/서명, 8GB/16GB CPU 속도 및 메모리.
- 한국어 원문 보존 20+ 골든 문단, 숫자·날짜·부정·인용·고유명사·URL·표 주변 텍스트 변질 검출, 사용자의 수동 승인/거부/되돌리기.
- 현재 `RELEASE_MANIFEST=null`로 **실제 모델 실행이 기본 차단**되므로 모델이 존재해도 현재 앱에서 정식 AI 제안으로 판매할 수 없음.
- 30/60/90천 원의 모든 등급에 같은 실제 모델·윤문 품질 제공 조건 및 용량/배포 안내.

## 실행 전 승인 및 비용
- **추가 API 과금 0원 설계 가능**하나 모델/런타임 파일 다운로드와 재배포 권한 확인은 별도 승인 범위. GitHub에는 모델 가중치·고객 PDF·사용자 개인 파일/토큰 절대 올리지 않음.
- 승인 후 파일 출처·해시·NOTICE 동봉 검증→소유자 PC 실제 로컬 추론→20+ 골든 문단 및 성능 측정→동일한 결과를 3 SKU에서 검증→상용 릴리스 심사.
- 실제 모델을 실행하지 않고 합성 `spawn` mock 테스트만으로 해당 기능을 완료했다고 평가하지 않는다.

**자료 확인:** 2026-11-14 KST. 이는 라이선스 기술 메타데이터의 1차 확인일 뿐 판매권/재배포 계약의 최종 법률 심사 아님.
