# G001 — P119 Windows OCR 공급망 독립 검수 (2026-11-15 KST)

**담당 브랜치:** `gpt/astra-final-qa-ocr-20261115`  
**현재 판정:** **P119 BLOCKED / +0점**. 전체 A01~A12 잠정 **64/100 유지**. **OCR_MANIFEST=null**, 공식 구매자 수용 **UNASSESSED**, **RELEASE HOLD**.

## 1. 원본 증거와 이전 실패 원인

- `docs/evidence/astra/P119/VERIFICATION.md`: 실제 Windows Actions 증거의 출처. 이번 G001은 역사적 관측 자료를 정규화하며 **새 공급자 파일을 다운로드하거나 실행하지 않았다**.
- **Tesseract 5.5.3**: installer SHA-256 `bee9e3434bd94fd65387d9be28cd467a41f61b1275383b55b0f59a1331270ae4` 확인. Authenticode `UnknownError`, Universität Mannheim thumbprint `2F92CB990D57719BDCCA2D72134378614A040D9B`. PE static import closure 조사 56파일/286 imports, **실행 시 DLL 닫힘·정확 DLL별 NOTICE/권리 증명은 아님**. [Windows run 43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099).
- **Tesseract 5.5.0**: SHA-256 `f3fc4236425b690c8be756f35793f77394ee004be0a6460a440c754d892f68bc` matched pinned [GitHub manifest](https://github.com/anderlli0053/DEV-tools/blob/08f0339f698c7b0dab04f1b69f74deaa42dde98a/bucket/tesseract.json); Authenticode `UnknownError`. Fail-closed 중단으로 DLL 및 라이선스 inventory 미실시. [Windows run 43650366554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43650366554).
- **UB-Mannheim 5.4.0**: SHA-256 `c885fff6998e0608ba4bb8ab51436e1c6775c2bafc2559a19b423e18678b60c9` matched pinned [Microsoft winget manifest](https://github.com/microsoft/winget-pkgs/blob/dd11564899b74d402e5fd39cb6f7b31945170286/manifests/u/UB-Mannheim/TesseractOCR/5.4.0.20240606/UB-Mannheim.TesseractOCR.installer.yaml); Authenticode `UnknownError`; 설치/PE/license 검사 중단. [Windows run 43651926099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43651926099).
- `tessdata_best` pinned commit `e12c65a915945e4c28e237a9b52bc4a8f39a0cec` 및 eng/kor SHA 기록이 있더라도 **개별 DLL 재배포 및 installer 전체 법적 권리 검증을 대신하지 않는다**.
- 기존 P120 실제 OCR 12건 중 9건 exact, 3건 오류. `2,300,000원`이 `22300,000원`으로 오인식된 고위험 사례가 있다. 단순 엔진 동작이 구매자 정확도를 의미하지 않는다.

## 2. 본 브랜치의 신규 독립 코드

- `tools/gpt-final-qa-p119-gate.cjs` — 후보별 설치파일 SHA, 독립 해시 핀, Authenticode 유효 상태, DLL runtime closure, DLL별 버전·라이선스/NOTICE, 재배포권 및 kor/eng 출처 메타데이터 검수.
- `docs/evidence/astra/G001/SUPPLIER_EVIDENCE_MATRIX.json` — 이전 세 후보 관측의 별도 정규화 기록. **신규 실측이 아니다**.
- `tests/gpt-final-qa-p119-gate.test.cjs` — 3개 미승인 후보, 위조 완비 주장, 서명/해시/라이선스 부족, 중복 ID/경로 안전성, OCR 비활성 회귀.
- 검증기에서 모든 assertion이 녹색이더라도 결과는 `INDEPENDENT_REVIEW_REQUIRED`까지만 허용하며, `supplierApproved=false`, `installerExecutionPermitted=false`, `productOcrEnabled=false`, `scoreDelta=0`를 강제한다. **JSON 자체는 암호학적·법적 증명 수단이 아니다.**
- 기존 `desktop/ocr-release-hold-gate.cjs`, `desktop/ocr-supply-chain-preflight.cjs`, Electron/React 파일, STATUS/HANDOFF, 원본 PDF·V1·V2 저장 모델은 수정하지 않았다.

## 3. 공급 전략 선택지

| 공급 방식 | 개발/운영 비용 | 안전성·품질 | 한계·결론 |
|---|---|---|---|
| A. 서명된 신뢰 가능 Windows 공급자 선정 | 초기 공수 낮음, 공급자 의존 높음 | 정상 서명+SHA+전 종속 저작권 증빙 확보 시 유리 | **현재 적격 후보 없음**. 과거 동일 3개 installer 재시도 중단 |
| B. Tesseract/Leptonica/종속 DLL pinned 소스 빌드·SBOM 제공 후 제품 서명 | 무료 CI 재현 빌드는 가능하나 정기 보안 패치·빌드/서명 공수 큼 | 공급망 통제력 높지만 바이너리 서명·재배포/NOTICE 법적 확인 여전히 필요 | **장기 통합 권장 검토안**; 사용자 서명/출시 승인 게이트 필요 |
| C. 구매자가 직접 설치하는 기존 로컬 OCR runtime 탐지·검증 | 앱 번들 비용 낮음, 고객 설치/지원 비용 증가 | 고객 PDF 외부 전송 없이 로컬 처리 가능; 엔진/경로/서명 검증 필요 | **우선 독립 프로토타입 검토안**. 제3자 바이너리 번들을 피하지만 품질/신뢰·판매 승인 요건 대체 불가 |

**추천:** 이미 검증 실패가 누적된 A의 동일 후보 재시도를 중단하고, C의 비번들 읽기전용 runtime 발견·검증 프로토콜을 별도 Codex 승인 작업으로 전달한다. B는 상용 OCR 핵심이 유지될 경우 후속 투자/서명 정책 승인 후 진행. 이번 단계에서 실고객 PDF·판매자 키·패키지·OCR_MANIFEST 변경 없음.

## 4. 통과 기준 / 미검증

P119을 APPROVED로 변경하려면 **실제 취득한 정확 asset**의 독립 SHA와 Windows `Get-AuthenticodeSignature=Valid` 또는 명시 승인된 대체 신뢰경로, 전체 native DLL runtime closure, 각 DLL/eng/kor 정확 버전·license/NOTICE 및 redistribution 근거, 제품별 코드 검수와 owner 승인 모두 필요. **현재 모두 충족되지 않음**.

독립 Node 테스트, GitHub workflow SHA/결과는 추가 실행 후 별도 기록한다. 이번 문서 작성 시점 신규 기능 E2E·서명·물리 Windows 구매자 검증은 **NOT RUN / NOT VERIFIED**. 제품 P119/P120/P121 및 P126은 계속 차단. **다음 READY:** G002 합성 PDF 원본/출력·숫자·표 검증기.
