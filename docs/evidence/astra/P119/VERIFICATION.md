# P119 — Windows Tesseract 공급처 후보 감사

**판정:** BLOCKED · 인정 0/1점 · 잠정 완성률 57/100 유지  
**감사일:** 2026-11-15 KST · **코드 검증 SHA:** `420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02`  
**공식 수용:** UNASSESSED · **출시:** RELEASE HOLD · **OCR_MANIFEST:** null

## 범위와 실행

기존 공급망 사전검사기, PE import 감사기, Windows Authenticode 합성 회귀를 확인했다. P119 요구에 따라 저장소에는 Tesseract 설치 파일이나 언어 데이터, 고객 PDF를 넣지 않았다. GitHub 공개 API와 저장소 파일 메타데이터만 조사했다. 전체 후보별 값은 [SUPPLIER_CANDIDATE_AUDIT.json](SUPPLIER_CANDIDATE_AUDIT.json)에 보존했다.

## 확인된 공개 근거

- [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract)는 upstream [tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)의 fork이며 Apache-2.0로 표시된다. Windows 설치 후보는 [v5.4.0.20240606](https://github.com/UB-Mannheim/tesseract/releases/tag/v5.4.0.20240606), 2024-06-08 공개, `tesseract-ocr-w64-setup-5.4.0.20240606.exe`, 50,175,248 bytes다. GitHub Release API의 `digest`는 `null`; 정확 바이너리 SHA-256은 공개되지 않았다.
- upstream Tesseract의 [5.5.4 release](https://github.com/tesseract-ocr/tesseract/releases/tag/5.5.4)는 2026-10-28 공개됐고 release binary asset이 없다. 이는 UB-Mannheim 후보의 버전·공급 경로를 별도로 검증해야 한다는 뜻이며, 승인 또는 거부의 보안 판정으로 사용하지 않았다.
- [tessdata_best](https://github.com/tesseract-ocr/tessdata_best) README와 repo metadata는 Apache-2.0을 표시한다. main commit `e12c65a915945e4c28e237a9b52bc4a8f39a0cec`에서 eng 모델 15,400,601 bytes / Git blob SHA-1 `176dc3220de7db34d3b3aecbfa42043a6038348b`, kor 모델 12,528,128 bytes / Git blob SHA-1 `c82615b5228c9981c33a0985b32224d97b7fb43a`를 확인했다. 이 값은 Git blob SHA-1이며 파일 SHA-256이 아니다.
- [Leptonica license text](https://github.com/DanBloomberg/leptonica/blob/master/leptonica-license.txt)는 소스 트리에 있으나 repo license metadata는 `NOASSERTION`이다. 후보 설치 파일 안의 Leptonica 버전, DLL 구성, 해당 바이너리의 고지 포함 여부는 연결되지 않았다.

## 왜 차단했는가

GitHub release metadata만으로 설치 파일의 Authenticode 서명, x64 PE 헤더, direct/delay-load DLL import 폐쇄, 설치 묶음과 kor/eng 파일의 정확한 대응, 필수 third-party NOTICE, 해당 묶음의 재배포권을 입증할 수 없다. P119는 별도 다운로드/동봉 없이 후보 근거를 정리하도록 하므로 이 감사를 위해 설치 파일을 내려받지 않았다. 공급처와 재배포권이 확인되지 않은 상태라 P119 점수는 0점이며, 기존 `OCR_MANIFEST=null` 및 RELEASE HOLD를 유지한다.

## 테스트 및 정확 SHA

- P118 기능 SHA `420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02`에서 Linux [#43633902801](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902801) SUCCESS: Node 276/276, build PASS. 전체 test suite에는 synthetic OCR supply preflight/release-hold/PE 검사가 포함된다.
- 같은 SHA에서 Windows [#43633902770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902770) SUCCESS: Node 275 PASS / 1 Windows 전용 SKIP / 0 FAIL, desktop 73/73, synthetic Authenticode 회귀 PASS, NSIS lifecycle PASS.
- 같은 SHA의 final blueprint policy [#43633903290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633903290) SUCCESS.
- 위 테스트는 synthetic fail-closed 경계만 검증하며, 실제 공급자 바이너리나 OCR 실행을 검증하지 않는다. 이 P119 변경은 GitHub 문서/증거만 추가했으므로 기능 점수는 증가하지 않는다.

## 결과

P119 BLOCKED / +0. A07은 5/12, 총점은 57/100이다. 실제 Windows Tesseract 서명·hash·PE/DLL closure·candidate bundle redistribution은 미검증. P120/P121은 P119 실자산 승인 의존성이 충족되지 않아 BLOCKED. 다음 독립 작업은 P122다.
