# ASTRA P102 — Windows Tesseract 공급망 / OCR 한글 출력·레이아웃·임시파일 보강 (2026-11-14 KST)

**개발 회차 P102 ≠ 공식 제품완성률.** 최종 12영역 100점 사용자 승인, 공식 증거 점수 산정 대기, 상용 RELEASE HOLD.

## 공식 근거 (2026-11-14 조회)

- Tesseract OCR 문서 https://github.com/tesseract-ocr/tessdoc/blob/main/Downloads.md : 최신 Windows용 **공식** 설치 프로그램은 제공되지 않음. UB Mannheim는 **제3자 배포처**.
- UB Mannheim 공식 저장소 wiki https://github.com/UB-Mannheim/tesseract/wiki : 2026-07-24 빌드 tesseract-ocr-w64-setup-5.5.3.20260724.exe가 목록에 있으나, ASTRA에서 해당 설치파일을 다운로드/실행/검증/포장한 것은 아니다. 설치 프로그램을 기존 폴더에 설치하면 제거 시 전체 폴더를 지울 수 있다고 경고한다. ASTRA 고객 PC의 기존 폴더를 변경하는 방식은 금지.
- 엔진 https://github.com/tesseract-ocr/tesseract : Apache-2.0; 의존 Leptonica는 BSD-2-Clause 계열. 관련 libpng/libtiff/libjpeg/zlib 및 Windows DLL 별도 버전·저작권/NOTICE 점검 필요.
- 한글/영문 언어팩 https://github.com/tesseract-ocr/tessdata_fast : Apache-2.0 저장소 후보. 실제 분리된 릴리스 bytes와 고정 SHA-256를 확인해야 함.
- UB Mannheim 설치파일 **실측 SHA-256: 미확인**. 포함 DLL 목록/각 SHA/서명/직접 재배포 허락·실제 Win10/11 실행: 미확인. 특정 다운로드가 공식 바이너리인 것처럼 홍보하지 않음.

## 두 방식 비교

A. ASTRA 설치파일에 허가된 Tesseract 실행파일 + kor/eng + 의존 DLL을 각각 허가/해시 고정해 오프라인 번들: 사용자 경험 최상, 외부 API 0원, 그러나 공급망 감사/NOTICE/EXE 서명/배포물 크기 비용 높음. **최종 상용 목표**이나 현재 보류.
B. 검증된 Windows Tesseract를 사용자가 따로 설치하도록 안내: 제품 번들 내 3자 재배포 부담 감소, 외부 API 0원. 그러나 고객 설치·언어팩·경로·DLL 장애와 지원 비용 커지고 실행파일을 무검증 PATH에서 발견해 실행하면 보안 저하. 사용자 사전 승인 없는 자동 설치·경로 탐색은 금지.

**현 단계 결정:** 현재 ASTRA OCR_MANIFEST=null 유지, GUI 비활성. A형 공급망 증빙 완료 후 정확 파일 SHA manifest+Windows 로컬 시험으로 활성화하는 방향. 출시/구매/무단 다운로드 승인 아님.

## 이번 실제 GitHub 코드

- Git SHA 848bbdfe: native stdout UTF-8 한글이 chunk 경계에서 깨지지 않도록 bounded Buffer 수집 후 한 번만 디코딩.
- Git SHA 3c99a9e3: 한국어 멀티바이트 중간 분할 재현 회귀 테스트.
- Git SHA 507adf5e: native CLI page segmentation을 숫자 3(복합 페이지), 6(일반 단락)만 허용하도록 제한.
- Git SHA 2ac6c4a8: 임의 PSM 문자/CLI 주입 거부 및 두 모드 호출 테스트.
- Git SHA 8bff4e0a / 4097322a / c5710e46: main/preload/TS bridge를 통해 허용 모드 전달.
- Git SHA d21579e2: STEP7 OCR 페이지 UI에 명시적 PSM 선택·불확실성 안내.
- Git SHA b1f5012e: 임시 PNG 삭제 Windows 재시도 및 정리 실패 성공 응답 금지.
- Git SHA 1f64ef97: 임시 파일 정리 실패 synthetic injection 회귀.
- Git SHA 5d87df4e: PDF.js 페이지의 무한대/비정상 크기 차단, 캔버스 최대 한 변 4096px / 전체 8MP 제한.

## 확인 범위 및 불변 상태

- **실제 확인한 것:** GitHub 원격 파일 다섯 개와 package.json 연결의 정적 검토 11항 일치. 기존 P101 독립 Linux 7/7 및 합성 골든 20건 중 15 정확/5 오인식은 과거 별도 SHA 증거. **본 P102 새 코드의 전체 npm test/TypeScript build/Chrome/Edge/Windows Electron·NSIS 정확 SHA 결과는 미확인**. 추가 단위 테스트는 등록했으나 실행 성공 검증 전 PASS로 쓰지 않음.
- 원본 사용자 PDF·localStorage V1·IndexedDB V2·main·Draft PR10·서명/배포·크몽 상품 게시·외부 고객자료 업로드 변경 없음.
- 제품의 실제 OCR 실행파일/언어팩/Windows DLL 미번들, 한국어 실기기 품질 미검증. 공식 UNASSESSED / 100% 미달 / [작업중] / RELEASE HOLD / 크몽 등록0.

## 다음 순서

1. 해당 exact SHA의 GitHub Linux build/test/Chrome+Edge 및 Windows Electron/NSIS 실제 로그 확인 후 실패 수정.
2. Windows DLL 전부 정확 해시와 라이선스를 검증하는 독립 배포 preflight(아직 미구현), 공식 언어팩/SBOM/NOTICE, 재배포 승인 전 binary package 보류.
3. PSM3/6에 대한 난이도 높은 20종 한국어 숫자·부정문·표/다단 합성 골든 품질 비교. 잘못된 숫자·부정은 항상 수동 검토.
4. 동의된 실 PDF 5~10개와 물리 Windows10/11 GUI/인쇄·라이선스 수용은 판매 GO 전 별도 검증.
