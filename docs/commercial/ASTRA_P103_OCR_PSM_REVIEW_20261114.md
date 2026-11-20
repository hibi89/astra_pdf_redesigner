# ASTRA P103 — 실제 OCR PSM 품질 비교 및 초안 출처 보강

2026-11-14 KST. P103은 개발 회차 번호이며 최종완성률이 아니다.

## P102 정확 SHA CI 검증 완료

- 기능 SHA: 5d87df4ef2f9f6b6cefd6f51f52d7f66de0d2d71
- Linux Chrome+Edge: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43568805209 — 2/2 JOB SUCCESS, npm test 189/189 PASS, 0 FAIL, 0 SKIP, TS/Vite build 및 실제 브라우저 회귀 성공.
- Windows Electron+NSIS: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43568805220 — SUCCESS, npm test 188 PASS/0 FAIL/Windows-only symlink1 SKIP; desktop 27/27 PASS, EXE/설치·제거/버전업 V2·PNG 보존 성공.
- 최종설계 정책: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43568805420 — SUCCESS (정본 준수 정책만, 전체 100% 승인 아님).
- 기존 P102 문서의 정확 SHA CI 미확인은 위 실제 Actions 로그 조회를 통해 성공으로 정정한다.

## 실 Tesseract PSM 3/6 동일 20건 비교

- Linux Tesseract 5.5.0, kor+eng, Pillow/NanumGothic. GitHub 생성기 scripts/generate-ocr-golden.py와 로컬 복사본 Git Blob 3a156177c3ecdb92b12db0760c7c88b9b1de2abd 일치, 합성 20 PNG 생성.
- 단문 위주 같은 20장에 두 PSM 모드를 각각 20회 독립 실행. 문자열 NFC+공백 제거 후 exact 일치, 사례별 Levenshtein CER 평균 측정. 실제 고객자료 사용0.
- PSM 6: 정확 15/20, 평균 사례별 CER 2.20%, 총 OCR 실행 약 3.90초, 틀린 사례 2/8/13/16/17.
- PSM 3: 정확 5/20, 평균 사례별 CER 51.28%, 총 OCR 실행 약 4.11초, 틀린 사례 15개.
- 이는 한 줄·단문 위주의 소규모 합성 이미지에 대한 결과이다. PSM 3이 표·다단에서도 항상 열등하다는 뜻 아님.

## 추가 복합 구조 6건 탐색

- 2단×13행: PSM3 13/52 표식, PSM6 26/52. 회전 2단: PSM3 15/52, PSM6 31/52.
- 16×4 표: PSM3 7/64, PSM6 0/64. 회전 표: PSM3 4/64, PSM6 0/64.
- 박스형 12행×3: PSM3 28/36, PSM6 0/36. 작은 글자·흐림 2단: PSM3 43/52, PSM6 40/52.
- 이 지표는 임의로 넣은 표식의 정확한 문자열 등장 수이지 표·문장 의미/읽기 순서 보존 증명이 아니다. 6장 생성기는 아직 GitHub에 고정되지 않은 독립 실험 코드로, 재현성 한계 명시. 사용자 고객자료 없음.
- 결론: PSM6 기본값 유지, PSM3은 명시적인 표/복합 구조 검토 옵션. 어느 쪽도 숫자·부정/표 셀 무손실 보증 금지.

## 신규 코드·검증 경계

- 화면 src/step7/LocalOcrPanel.tsx: 페이지/PSM 변경 시 이전 미승인 OCR 초안 폐기; 페이지번호/모드 출처 표시, 수동 수정 표시.
- scripts/run-ocr-golden.cjs: 기존 실행 기본 PSM6 유지, 선택 인수 3 또는 6, 출력에 pageSegmentationMode 기록.
- tests/step7-local-ocr-browser.mjs: 별도 합성 스캔 PDF의 실제 PDF.js 렌더 + 가짜 native OCR 검토 응답. 페이지·모드 변경 시 이전 초안 폐기/원문 데이터 불변/외부 네트워크0. CI Chrome·Edge 실행 경로에 추가.
- 신규 최종 개발 코드 SHA: f9672f12b2d40106bdcc244e2675c903b3c98888. 이 SHA의 Chrome·Edge/Windows CI는 이 문서 작성 시 진행 중·미확인. 이전 P102 성공을 P103 성공 증거로 이전하지 않는다.
- 실제 OCR 패키지 release manifest null, Windows 바이너리·kor/eng·의존 DLL 라이선스/재배포·고객 Win10/11·실 PDF5~10·3SKU/LLM·판매 승인은 미충족. 전체 공식 UNASSESSED/100% 미달, [작업중], RELEASE HOLD, 크몽 미등록.

## P103 신규 정확 코드 SHA 3/3 CI 최종 확인 (추가 증거)

- P103 기능 코드 SHA **f9672f12b2d40106bdcc244e2675c903b3c98888**.
- [Linux Chrome+Edge #43571908499](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908499): **2/2 jobs SUCCESS**, Node22 **189 PASS/0 FAIL/0 SKIP**, build PASS. **Chrome/Edge 각각** 실제 PDF.js 합성 스캔 페이지→bounded PNG→모의 native OCR 초안, 페이지/PSM 전환 후 이전 초안 폐기, 요청 외부전송0을 확인하는 신규 브라우저 E2E **PASS STEP7 OCR UI** 로그.
- [Windows Electron/NSIS #43571908498](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908498): **SUCCESS**, npm test **188 PASS/0 FAIL/1 Windows symlink SKIP**, desktop **27/27 PASS**, Windows 패키지/NSIS 설치·제거/0.1.0→0.1.1 기존 IndexedDB V2·PNG 보존 PASS.
- [설계 정책 #43571908709](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43571908709): **SUCCESS**, 실제 고객 최종수용 인증과 구분.
- 이번 P103의 신규 합성 UI E2E는 **모의 native OCR 응답**을 사용함. 상품 내 OCR_MANIFEST=null로 Windows Tesseract/언어팩을 활성화하거나 테스트한 것이 아님. 물리 Win10·11, 실제 고객 PDF/실 모델 한국어 추론, Windows DLL/NOTICE/재배포·상용 SKU 수용은 미완료. RELEASE HOLD 유지.
