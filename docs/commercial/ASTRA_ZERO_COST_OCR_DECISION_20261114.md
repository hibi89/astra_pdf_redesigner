# ASTRA STEP7 OCR 0원 사전설계·승인 경계 (2026-11-14 KST)

**현재 상태: 설계/외부 라이선스 1차 확인만 완료. OCR 실행·모델/언어팩 다운로드·Windows 번들링은 0회.** 기존 7단계 최초 최종설계의 STEP7 OCR 지원은 100% 완성에 필요하나, 이전 승인 문서에서 OCR은 별도 승인 범위였다.

## 2개 기술안 비용·성능·유지보수 비교

| 설계 | 데이터 흐름 | 무료/성능 | 장점 | 위험 | 선택 |
|---|---|---|---|---|---|
| A: Windows용 native Tesseract 5 CLI + `kor` 언어팩 | Electron PDF.js 로컬 PDF 선택/암호·범위 검증 → 선택한 스캔 페이지에 한해 로컬 캔버스 PNG → 보호된 Electron main IPC → 서명/해시 검사한 Tesseract `spawn(shell:false)` → OCR 결과는 **검토 전용 초안** | 외부 API 과금 0, 사용자 CPU 및 추가 프로그램/언어팩 설치 공간·처리시간 사용 | 기존 Electron 샌드박스·현행 임시파일/실행 취소 패턴 재사용, 네트워크 서버 불필요, 한글 데이터 확보 가능 | Windows 바이너리 빌드 출처·의존 DLL/Leptonica 라이선스, 타임아웃·메모리·원문 누락·설치/업데이트, 고객 PC 수용 필요 | **우선 검토** |
| B: Tesseract.js + 패키지에 포함한 WASM/kor | 브라우저의 PDF.js canvas → 완전 로컬 WASM worker + `traineddata` → 검토 초안 | 외부 API 과금 0, 별도 native CLI 설치 불필요, 실제 속도/메모리 미측정 | 브라우저/OS 종속성 적을 가능성 | 기본 설정 외부 CDN fetch 금지, worker/core/lang 자산 전부 pin·번들 필요, Vite/Electron CSP 및 RAM·WebWorker 취소 복잡 | 대체안 |

A를 우선하는 이유: 기존 `desktop/local-model-controller.cjs`와 유사한 좁은 파일·IPC 경계를 사용할 수 있고, native CLI 검증과 Windows NSIS 부정 테스트가 이미 구축되어 있어 추가 유지비/품질 위험이 상대적으로 작다. **A도 실제 바이너리 라이선스·CPU 성능을 테스트하기 전 상용 정답으로 확정하지 않는다**.

## 공식 라이선스·자산 근거
- Tesseract 엔진 코드 Apache-2.0: https://github.com/tesseract-ocr/tesseract/blob/main/LICENSE . 본체가 의존하는 Leptonica 등 **별도 구성요소의 라이선스 확인 필수**: https://github.com/tesseract-ocr/tesseract .
- 한국어 `kor.traineddata` 공식 tessdata_fast 파일 약 **1.6 MB**: https://github.com/tesseract-ocr/tessdata_fast/blob/main/kor.traineddata . tessdata 저장소 언어 데이터 Apache-2.0 표기: https://github.com/tesseract-ocr/tessdata .
- 실 Windows 번들/Tesseract 릴리스 바이너리 공급처·명세·DLL/NOTICE·모델 SHA256을 정확하게 확보할 때까지 **재배포 가능 최종 승인 아님**.

## 구현 시 필수 경계
1. 기본 OFF, 명시적 소유자 동의 후 **그 PDF 안의 스캔/비선택텍스트 페이지에만** OCR 제안. URL·클라우드·API 키·외부 모델 추론은 사용하지 않는다. 이미 PDF.js로 가져온 텍스트/이미지/숫자 블록·원본 바이트는 수정하지 않는다.
2. OCR 텍스트/좌표와 원본 페이지번호를 **미승인 별도 초안**으로 표시, 숫자·부호·원문·표/다단/회전/한글·알파벳 혼합을 수동 대조하기 전 IndexedDB V2 저장 차단. 실패·취소 시 기존 문서·STEP1/2 데이터 불변.
3. 페이지·해상도·픽셀·임시파일 크기·총 시간·동시작업 상한, 경로 traversal/symlink 방어, 해시 고정, stdout 로그·진단에 고객 내용 포함 금지, 최종 임시 PNG·텍스트 안전 삭제. 앱 사용을 이유로 외부 트래픽 발생 금지.
4. 20개 이상 합성 한글 이미지·기호/돈/날짜·다단·표·회전·혼합 텍스트 사례. **인지 실패/미지원은 REVIEW_HOLD**이고 텍스트 100% 추출을 홍보하거나 자동 수락하지 않는다.
5. Windows 10/11 실제 고객 PC/CPU·메모리, 한글 폰트 및 A4 PDF, 설치·업그레이드·분리/복구, Tesseract/Leptonica/언어팩 LICENSE·NOTICE 완전성 수용 전 출시 NO-GO.

## 1시 일괄 확인을 위한 승인 선택
- **권고:** 실고객 원본을 외부로 보내지 않는 0원 **로컬 OCR 실험의 코드 개발**, 사용자가 직접 승인한 무료 Tesseract 엔진+한국어 언어팩의 파일 다운로드·권리/해시 검토, 독립 테스트, 패키지 분리. 단 사용자 파일 업로드·원본 DB 마이그레이션·실고객 문서 자동 처리·유료 구매·판매 배포는 여전히 별도 승인.
- 범위를 늦추면: OCR 연결 대신 다른 사용자가 이미 입력한 문단 수동 복원과 미지원 경고를 유지하고, 최종 100%/SKU 출시는 HOLD.

**2026-11-14 KST 결론:** 정식 OCR **NOT_IMPLEMENTED**, 실행 검증 0, 비용 발생 0, 사용자 추가 승인 전 다운로드 0. 이 설계 문서만으로 STEP7 완료나 상용 사용권을 주장하지 않는다.
