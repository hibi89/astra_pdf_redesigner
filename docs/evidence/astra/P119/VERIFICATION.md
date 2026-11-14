# P119 — Windows Tesseract 공급처 후보 감사

**판정:** BLOCKED · 인정 0/1점 · 잠정 완성률 61/100  
**최신 감사 코드 SHA:** [`0f82c8f0764cd00460abe3b27f97b497ce61ceb5`](https://github.com/hibi89/astra_pdf_redesigner/commit/0f82c8f0764cd00460abe3b27f97b497ce61ceb5)  
**정확 SHA Actions:** Linux [#43647106432](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106432) PASS · Windows [#43647106409](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409) PASS · 정본 정책 [#43647106804](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106804) PASS  
**공식 수용:** UNASSESSED · **출시:** RELEASE HOLD · **OCR_MANIFEST:** null

## 공급 후보 감사 결과

- UB-Mannheim Tesseract v5.4.0.20240606 Windows installer는 GitHub Release metadata에 SHA-256 digest가 없어 이 후보를 승인하지 않았다.
- Upstream Tesseract v5.5.3 Windows installer는 GitHub Release asset digest `bee9e3434bd94fd65387d9be28cd467a41f61b1275383b55b0f59a1331270ae4`를 Windows runner에서 재계산해 일치시켰다. 이 asset은 일회성 GitHub-hosted Windows runner에서만 다운로드·설치했으며 저장소에 커밋하거나 제품에 번들하지 않았다.
- Windows Authenticode 검증은 `UnknownError`를 반환했다. 서명 주체는 `CN=Universität Mannheim, O=Universität Mannheim, S=Baden-Württemberg, C=DE`, thumbprint `2F92CB990D57719BDCCA2D72134378614A040D9B`이며, Windows가 서명 인증서 또는 timestamp가 유효 기간 내에 있지 않다고 보고했다.
- 설치 결과에서 73개 최상위 PE 항목을 관찰했다. 정적 감사기가 56개 PE 파일의 import 그래프를 따라 direct import 286개(시스템 DLL 157, 번들 dependency 129), delay import 0개를 분류했고, 모든 import closure가 닫혔다. 감사 수정은 공급자 신뢰나 서명 승인으로 간주하지 않는다.
- 설치물에 보인 고지 파일은 `doc/AUTHORS`, `doc/LICENSE`였다. 모든 dependency의 정확한 버전, 해당 license/NOTICE 매핑 및 이 특정 bundle의 재배포 권리는 아직 입증되지 않았다.
- eng/kor 언어 데이터는 `tesseract-ocr/tessdata_best` commit `e12c65a915945e4c28e237a9b52bc4a8f39a0cec`에 고정했다. eng SHA-256 `8280aed0782fe27257a68ea10fe7ef324ca0f8d85bd2fd145d1c2b560bcb66ba`, kor SHA-256 `f888d4038348a0c3d25151e7f452bda0d74ca275b18cab146798bcbb94084fff`.

## 실제 OCR 실행과 범위

동일 Windows run은 합성 kor+eng 입력 12개를 실제 Tesseract 5.5.3으로 처리했다: 9개 exact, 3개 오인식/누락, 평균 공백 정규화 CER 0.0486. 상세 수치와 PE inventory는 [Actions OCR report artifact 14134094222](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43647106409/artifacts/14134094222) (SHA-256 `d3466b486c91b2e24edb638104e7bc5ffeb8a11c9e889f641ebcc5e726ecc193`)에 보존했다. 고객 PDF, 외부 추론 API, 제품 번들, production OCR은 사용하지 않았다.

## 판정 이유

자산 byte hash와 static import closure가 확인됐지만 Authenticode는 유효하지 않은 상태로 판정됐고, dependency license/NOTICE 및 이 installer bundle의 재배포권 mapping도 끝나지 않았다. 따라서 P119는 **BLOCKED +0**이다. `OCR_MANIFEST=null`, OCR 비활성, RELEASE HOLD를 유지한다. P120의 12개 sample OCR은 실행 가능성 근거일 뿐 공급 승인이나 앱 acceptance가 아니다. 상세 후보별 원장은 [SUPPLIER_CANDIDATE_AUDIT.json](SUPPLIER_CANDIDATE_AUDIT.json)에 있다.
