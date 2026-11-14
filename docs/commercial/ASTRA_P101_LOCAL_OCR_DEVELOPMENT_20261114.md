# Astra P101 — 무료 로컬 OCR 코드 연결 및 검증 경계 (2026-11-14 KST)

P101은 개발 회차 번호이며 최종 완성률이나 인증 수치가 아니다. 공식 최종설계 A01~A12는 100점 배점 승인, 항목별 증거 점수 산정 대기, RELEASE HOLD.

## 이번 코드 변경

- desktop/local-ocr-controller.cjs: 기본 OCR_MANIFEST=null; 사전 승인·SHA256 고정된 Tesseract 실행파일 및 kor/eng 언어팩 모두 확인할 때만 실행. 미포함은 unavailable, 무단 다운로드 및 프로세스 실행 금지.
- 입력: Electron 검증된 앱 origin의 IPC로 단일 페이지 PNG Uint8Array만 전송. 8MiB 및 8MP, PNG signature/IHDR 확인. shell:false, 고객 텍스트 명령행 제외. 0700 임시 디렉터리/0600 PNG, stdout 128KiB/20초 타임아웃, 동시실행 거절·취소·삭제.
- 출력: status=review, reviewOnly=true, approved=false, externalTransfer=false, OCR 문자열은 검수 초안. STEP1 localStorage·STEP2 IndexedDB V2·원본 PDF 자동 변경 없음.
- desktop/main.cjs, preload.cjs, src/desktopPdf.ts: status/recognizePng/cancel IPC 브리지와 astra://app 신뢰 검사.
- src/step7/LocalOcrPanel.tsx, src/Root.tsx: 사용자가 PDF 선택 후 지정 페이지를 PDF.js 캔버스 최대 8MP PNG로 변환해 미승인 편집 초안으로 표시. 기존 STEP7 PDF 대조와 독립. 엔진 없으면 비활성.
- tests/local-ocr-controller.test.cjs, tests/step7-pdf-review-browser.mjs, desktop/main.cjs smoke: 합성 해시·자원 상한·취소·임시파일 삭제 및 Chrome/Edge의 미설치 차단·Windows Electron 호출 확인. npm test/desktop:test 필수 명령에 추가.

## 설계 두 안

1. A (선택): 오프라인 Tesseract CLI + SHA 고정 로컬 실행파일 + 최소 Electron IPC. 외부 API 사용료 0, 원본 보존, 실패 시 명시 비활성. 다만 native 설치/권리/성능 검증 필요.
2. B (대안): Tesseract.js WASM과 한글 언어팩을 완전 오프라인 번들. 플랫폼 공유성이 있으나 worker·CSP·메모리·패키징 테스트 및 자산 검증 비용 증가.

## 검증과 제약

- 브랜치 feature/astra-p71-pdf-source-parity-20261112. 신규 기능/테스트 코드는 fe4270d8부터 deeb1ed9까지 비파괴적 커밋. 테스트 예정: npm test, npm run build, npm run desktop:verify, Windows desktop:smoke 및 desktop:package.
- 이 문서 작성 시 신규 정확 기능 SHA의 Linux/Chrome/Edge/Windows CI는 검증 대기. 소스 푸시를 PASS로 주장하지 않는다.
- Tesseract 실행파일/kor·eng 언어팩 정식 고정 manifest, 바이너리 SHA/NOTICE/라이선스, 한국어 숫자·표/다단 20종 실 OCR, Win10/11 CPU/기억장치, 실제 허가 PDF 5~10건 검수는 미완.
- STEP1~6/P100 기존 코드 및 사용자 원본 보존. 출시·크몽/서명/라이선스 권한·고객자료 클라우드 전송 승인과 무관한 코드 개발이며 RELEASE HOLD 유지.
- 2026-11-14 사용자 무료 로컬 OCR 코드 개발 승인 내 범위. 스캔 OCR이 정확하다는 보증 없음.

## 다음 실행

1. GitHub 최신 SHA에서 Node/빌드/Chrome/Edge/Windows NSIS 검증, 실패 근거 확인→최소 수정. 테스트를 제외하거나 성공처럼 표시하지 않음.
2. 정식 Tesseract 버전·DLL·kor/eng 언어팩 출처와 저작권/NOTICE 및 SHA256 pin 확보 후 실 오프라인 OCR 골든 20종 수행. 전까지 UI disabled.
3. OCR 초안을 원본 페이지·좌표/수정/승인과 연동하고 취소/실패/복구 테스트. 실 고객 PDF·물리 Windows·상품 3등급/AI/판매 승인과 별도 수용.

## 2026-11-14 KST — 재현용 Linux 실제 OCR 20종 후속 검증

- 재현 코드: scripts/generate-ocr-golden.py, scripts/run-ocr-golden.cjs. 로컬 NanumGothic/Pillow로 합성 PNG 20장 생성→각 PNG SHA를 manifest에 기록→Linux Tesseract 5.5.0 + kor/eng를 전용 임시 폴더에 복사해 정확한 SHA manifest로 코어 실행. 추출한 고객 내용/텍스트는 로그·보고서에 출력하지 않음.
- 환경: Python 3 Pillow, Node 22.16, Linux Tesseract 5.5.0/Leptonica1.84.1. synthetic generation 원본 20 vs 재생성 20 PNG SHA **20/20 일치**; 단위 OCR controller+eligibility **7/7 PASS**, TS strict PASS. 원격 파일 및 로컬 실행본 Git Blob SHA 6종 동일: ebfce5b8, f7b448e0, 11bdc938, a26b1e0e, 3a156177, 9b0405d1.
- 실제 gold 실행 결과: OCR status=review 20/20; 공백 제거·NFC 기준 문자열 완전일치 **15/20**, 불일치 **5/20**(사례 2,8,13,16,17), 평균 사례별 CER **2.2%**, 약 4.1~4.3초/20장 (현재 Linux 환경). 숫자 2,300,000→22300,000 및 A-101→4-101, 부정 관련 불가→물가 오인식 발견. 의미 정확·텍스트 충실도 인증 아님.
- 개발 회차 중 최초 runner의 정규식 이중 escaping 오류는 e81afaaf에서 교정, 실제 Node runner로 전체20종 재실행 PASS; 사용자 원본/정식 Windows OCR 배포자산/제품 OCR_MANIFEST(null) 변경 0.
- 완성 판단: 실제 Linux 오프라인 CLI 독립실행은 확인되었지만, Windows 상용 바이너리와 DLL/사용권/언어팩 재배포, 실제 고객 PDF/Windows10·11, 최종 React·Chrome/Edge·Windows NSIS CI 등은 여전히 **미검증**. 골든 정확률75%는 전체 제품 최종완성률이 아니다. 수동 검수·RELEASE HOLD 유지.
