# P119 — Windows Tesseract 공급처 후보 감사

**판정:** BLOCKED · 인정 0/1점 · 잠정 완성률 61/100  
**최신 감사 코드 SHA:** [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530)  
**정확 SHA Actions:** Linux [#43651926094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926094) PASS · Windows [#43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099) PASS · 정본 정책 [#43651926332](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926332) PASS
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

## 2026-11-15 — 추가 upstream 5.5.0 후보 감사 (P119, no score)

정확 SHA [`c365ba07df29cd6228a794f0c420230d448f91ee`](https://github.com/hibi89/astra_pdf_redesigner/commit/c365ba07df29cd6228a794f0c420230d448f91ee)의 Linux [#43650366545](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366545), Windows [#43650366554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554), 정본 정책 [#43650366939](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366939)가 모두 SUCCESS했다. Windows Actions에서 official upstream release `tesseract-ocr-w64-setup-5.5.0.20241111.exe`를 검사했다. Scoop manifest [08f0339](https://github.com/anderlli0053/DEV-tools/blob/08f0339f698c7b0dab04f1b69f74deaa42dde98a/bucket/tesseract.json)의 pin `f3fc4236425b690c8be756f35793f77394ee004be0a6460a440c754d892f68bc`와 다운로드 asset SHA-256이 일치했다. Windows Authenticode는 이 후보에서도 `UnknownError`를 반환했고 동일한 Universität Mannheim signer/thumbprint `2F92CB990D57719BDCCA2D72134378614A040D9B`를 관찰했다. Timestamp signer는 Sectigo Public Time Stamping Signer R35였고 Windows는 인증서 유효기간 오류를 보고했다. 감사는 서명이 `Valid`가 아니어서 설치 전에 fail-closed 중단했으므로 이 후보의 PE closure·license inventory는 실행하지 않았다. [후보 감사 report artifact 14135377855](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554/artifacts/14135377855) SHA-256 `068625dc9be4c29db76b7b8fd8f29c20dda3d4a4c06954ee87d202e2c1abe472`에 결과를 보존했다.

따라서 5.5.0도 승인 후보가 아니다. 5.5.3의 import closure 및 실제 OCR 증거는 유지되지만 서명·bundle NOTICE/license·재배포 근거가 없어 P119/P120은 각각 BLOCKED +0이다. 제품 OCR_MANIFEST=null, RELEASE HOLD.


## 2026-11-15 — UB-Mannheim 5.4.0 Windows 후보 감사 (P119, no score)

Exact audit SHA [`b6d7909e6897578181dbd304ff12491760422530`](https://github.com/hibi89/astra_pdf_redesigner/commit/b6d7909e6897578181dbd304ff12491760422530) passed Linux [#43651926094](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926094), Windows [#43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099), and final blueprint [#43651926332](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926332). The GitHub-hosted Windows audit downloaded the official UB-Mannheim 5.4.0.20240606 release asset on an isolated runner and matched SHA-256 `c885fff6998e0608ba4bb8ab51436e1c6775c2bafc2559a19b423e18678b60c9` against the pinned Microsoft winget-pkgs manifest at signed commit `dd11564899b74d402e5fd39cb6f7b31945170286` ([manifest](https://github.com/microsoft/winget-pkgs/blob/dd11564899b74d402e5fd39cb6f7b31945170286/manifests/u/UB-Mannheim/TesseractOCR/5.4.0.20240606/UB-Mannheim.TesseractOCR.installer.yaml)).

Windows Authenticode returned `UnknownError`: “A required certificate is not within its validity period when verifying against the current system clock or the timestamp in the signed file.” Signer: Universität Mannheim, thumbprint `2F92CB990D57719BDCCA2D72134378614A040D9B`; timestamp signer: Sectigo RSA Time Stamping Signer #4. The fail-closed audit did not install the candidate; version, PE, import and license inventory are therefore unavailable. [Report artifact 14136681467](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099/artifacts/14136681467) SHA-256 `426e2c00a342e651d9414cd2f43a1597a3c4dd2825a0ed0ad59f6fb4b895eb2f`.

Linux Node: 290/290 PASS. Windows Node: 289 PASS / 0 FAIL / 1 OS-specific SKIP; desktop 86/86 PASS; new audit guard 6/6 PASS; OCR smoke PASS; installer and in-place upgrade PASS. The Windows OCR report artifact [14136970048](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099/artifacts/14136970048) SHA-256 `36413a867222dc714455dd9ca81f1804fb8a42b796fa3a4f49fe2241aced8268` repeats 9 exact / 3 errors across 12 synthetic cases, mean normalized CER 0.0486, including `2,300,000원→22300,000원`.

P119/P120 remain BLOCKED +0. Three installer candidates (5.5.3, 5.5.0 and UB-Mannheim 5.4.0) have now returned Authenticode `UnknownError`; no candidate is approved. Keep `OCR_MANIFEST=null` and `RELEASE HOLD`.


## 2026-11-15 — 추가 GitHub Windows Tesseract 공급처 검색 (no score)

Read-only GitHub repository searches used the queries `tesseract windows installer`, `tesseract OCR Windows binaries`, and `tesseract setup Windows`. Results surfaced tutorials, source mirrors, and application repositories, but no candidate with a GitHub-accessible Windows binary, exact asset hash, valid Authenticode signature, and artifact-specific dependency NOTICE/license plus redistribution evidence. This search is discovery evidence only; it does not establish that no supplier exists outside these queries.

No binary was downloaded or installed, and no product code or runtime behavior changed. P119 remains BLOCKED +0; total remains 61/100; `OCR_MANIFEST=null`; RELEASE HOLD. Product source SHA remains `b6d7909e6897578181dbd304ff12491760422530`; docs at the start of this audit were `a85dbd5e21edeaf72d4d631666183731d6dce148`. Runtime tests were not rerun because no code changed.
