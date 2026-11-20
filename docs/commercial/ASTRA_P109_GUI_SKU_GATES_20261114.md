# Astra P109 — SKU GUI·PDF 실행 경로 접근 제어

기준: 2026-11-14 KST. **기능 SHA: ee7ed4eaacf44a08800b56639d2178f5df76e7d3.**
공식 최종설계 12영역 사용자 배점 100점은 승인되었으나, 항목별 수용 점수는 UNASSESSED. RELEASE HOLD.

## 설계 비교·채택
- A. 기존 내부 개발 시안을 유지하고, 고객용 상용 실행 경로에서만 코드 고정 발급자 공개키와 P96/P107 서명 검증을 매번 수행한다. 별도 서버·과금 없이 현재 기능 회귀를 보존한다. **채택.**
- B. 브라우저 저장값·화면 등급 선택만으로 PRO/BUSINESS 버튼을 활성화한다. 개발은 빠르나 위조 가능하며 보안상 불허.
- 보완: client-side 라이선스는 임의 수정된 바이너리·브라우저 print/IPC 직접 호출에 대한 강력한 DRM이 아니다. Electron 메인 IPC 및 정식 배포 채널 보호/철회·장치 정책은 후속 작업.

## 구현 범위
- `src/commercial/skuActionGate.ts`: 모든 기능 캡 배열 검증, 라이선스 재검증 후에만 고객용 실행 함수 호출. BASIC/PRO/BUSINESS 레이아웃별 PDF 출력, BUSINESS 브랜드 동시 권한 검사. 거짓·중복 기능 및 유효하지 않은 레이아웃은 즉시 거부.
- `src/commercial/CommercialLicensePanel.tsx`: 사용자 서명 영수증을 **메모리에서만** 받아 P107 상용 공개키 pin으로 권한 검사, 기능별 결과 표시. 고객 PDF·영수증을 서버/IndexedDB/localStorage에 저장하지 않음.
- `src/step2/Workspace.tsx`: 레이아웃 선택, 고급 preset 가져오기/내보내기, 브랜드 적용/로고·브랜드 파일 가져오기/내보내기, 라이브러리 복원 및 PDF 출력 직전 권한 검사.
- `src/step3/BatchImportPanel.tsx`: 파일 선택·다음 파일 이동·실제 문서 저장 직전 batch-pdf 재검사. BASIC 단일 PDF에는 base-layout 적용.
- `src/step4/ProLayoutLibrary.tsx`, `BusinessBrandLibrary.tsx`: 별도 로컬 보관함 저장·삭제 직전 SKU 검사.
- `tests/sku-action-gate.test.ts`: 5개 합성 회귀. 모든 6개 상용 기능은 판매자 pin이 없는 상태에서 side effect 0으로 거부. 기존 개발용 preview 동작 보존. 기존 `tests/sku-access.test.ts`의 실 WebCrypto 서명·위조·만료 회귀도 유지.

## 출시 차단 경계
- `ASTRA_CUSTOMER_BUILD_ENABLED=false`로 소스 고정. 기존 개발 시안은 정상적으로 유지하며 **상용 발급자 검증을 우회해 실제 고객용 제품을 활성화하지 않음.**
- `PRODUCTION_ISSUER_JWK=null`, `PRODUCTION_ISSUER_THUMBPRINT_SHA256=null`: 고객용 실행 경로는 기본 거부.
- 실제 판매자 비밀키/배포용 공개키/환불 철회/장치 수 인증/법적 라이선스/고객 승인 없이 상용 플래그를 활성화할 수 없다.
- 실제 Win10/11 구매자 PC, 허가 PDF 5~10건, 판매자 라이선스 운영, 고객 PDF 원본 대조, OS 인쇄·Electron IPC 직접 호출 우회 방어 미검증.
- 기존 원본 PDF, STEP1 localStorage V1, STEP2 IndexedDB V2, 디자인 8+22, `main`/Draft PR #10, OCR_MANIFEST=null 보존.

## 재현 명령
`npm test`, `npm run build`, `npm run desktop:test`, `npm run ocr:release-gate`, Chrome/Edge PDF·IndexedDB 회귀, Windows NSIS 설치·제거·업그레이드 회귀.

정확 SHA Workflow:
- Linux Chrome/Edge: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625251
- Windows Electron/NSIS: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625273
- 사용자 최종설계 정책: https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625548

검증 결론은 STATUS.md 최신 상단의 최종 GitHub workflow+raw job log 확인을 따른다. **코드 반영 ≠ 고객용 판매 수용**.

## 다음 작업 P110
Electron main IPC의 PDF 저장 기능에 고객용 신뢰경계 강제, 고객용 빌드와 시험용 개발 앱 분리, 직접 호출/출력 우회·반복 권한 체크 실제 E2E, 오프라인 환불·철회 및 키 교체 정책. 비용·비밀·권한·실배포 변경은 별도 승인 후 진행.
