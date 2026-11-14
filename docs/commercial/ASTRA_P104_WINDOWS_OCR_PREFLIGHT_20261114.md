# ASTRA P104 — Windows OCR 공급망 사전 검증과 출시 HOLD 게이트

갱신: 2026-11-14 KST. P104는 개발 회차이며 최종 제품 완성률이 아니다. 무료 로컬 OCR 개발 승인 범위 내 작업. **정식 판매·OEM 설치·바이너리 자동 다운로드·외부 파일 전송 승인 없음**.

## 두 경로 비교 및 확정

| 방식 | UX | 네트워크/API 비용 | 개발·보안 및 유지보수 | 결론 |
|---|---|---|---|---|
| A. 공급처·DLL·언어팩 전부 SHA-256와 법적 증빙 확인 후 오프라인 번들 | 가장 좋음 | 0원 | DLL 종속성·PE x64·NOTICE·서명·실 Windows 시험 필요 | 최종 목표, 공급망 증빙 전 HOLD |
| B. 사용자 로컬 별도 설치 + 신뢰 경로·해시 검증 | 설치 필요 | 0원 | 설치 안내·DLL 버전 차이·지원 부담 크며 PATH 자동실행 위험 | 사용자가 명시적으로 선택할 때만 대안 |

선택 A는 사전검증 도구만 준비한다. 정식 자산 미확보 상태에서 앱 활성화, 다운로드, NSIS 포함을 하지 않는다.

## 근거

- Tesseract 공식 문서: 최신 **공식** Windows 설치파일 없음. https://github.com/tesseract-ocr/tessdoc/blob/main/Downloads.md
- UB Mannheim 5.5.3 (2026-07-24) Windows 배포자는 **별도 제3자 빌드**. 설치 경로에 기존 파일이 있는 경우 제거 시 폴더 전체 삭제 위험 경고: https://github.com/UB-Mannheim/tesseract/wiki
- Tesseract 엔진 Apache-2.0: https://github.com/tesseract-ocr/tesseract
- kor/eng 학습데이터 후보 tessdata_fast와 Apache-2.0 라이선스: https://github.com/tesseract-ocr/tessdata_fast
- Leptonica 및 libpng/libtiff/jpeg/zlib/그밖의 포함 DLL은 각자의 라이선스, 빌드 버전, 재배포 의무 확인이 별도로 필요하다. 한 저장소의 Apache-2.0 표기는 모든 동봉 DLL의 권리 보증이 아니다.

## 구현

1. `desktop/ocr-supply-chain-preflight.cjs`: 오프라인, **파일을 실행하지 않는** 사전 감사. 외부 JSON 명세(schemaVersion 1/windows-x64)에 공급처 HTTPS URL·기재된 원본 설치파일 SHA-256 및 매 파일의 SHA-256·바이트 크기·역할·각 라이선스 ID/증빙 URL을 필수로 등록. 실제 설치파일의 서명·출처나 URL을 인터넷으로 조회·검증하지는 못한다.
2. `astra-local-ocr/bin/tesseract.exe`, 같은 bin의 모든 DLL, tessdata/kor.traineddata, tessdata/eng.traineddata, licenses/*.txt 및 THIRD-PARTY-NOTICES.txt가 있어야 함. 미등록 파일·다른 디렉터리/확장자·중복 경로(Windows 대소문자 무시)·심볼릭 링크/하드링크·상위경로 이탈·파일 크기·SHA 변조를 즉시 거부. exe/dll DOS/PE 헤더와 AMD64 0x8664·PE32+ 0x20b 확인. 파일 상한 192개·총 512 MiB·단일 256 MiB, Manifest 256 KiB.
3. **감사 성공의 반환값도 `status:review-required`**이며 `legalRedistributionApproved:false`, `installerSignatureVerified:false`, `dllRuntimeDependencyClosureVerified:false`, `productOcrEnabled:false`로 고정. 임의 JSON의 라이선스 문자열·HTTPS 링크·해시를 실제 법적 재배포권이나 설치파일 공급처 신뢰 보증으로 간주하지 않음. DLL 실제 import/런타임 종속성 분석과 Authenticode/공급처 패키지 서명 검증은 향후 독립 검증 단계.
4. `desktop/ocr-release-hold-gate.cjs`: `OCR_MANIFEST=null`이어야 하고, electron-builder.yml에 새 `extraResources/extraFiles`가 없으며, 실제 패키징 대상 desktop/dist에 .exe/.dll/.traineddata/.so/.dylib 또는 `astra-local-ocr` 폴더가 존재하면 **빌드 자체를 중지**. 기존 Electron 정상 번들·사용자 데이터에 대한 수정 없음. 고의로 공급망 검증·출시 승인을 거쳐 구조 변경하기 전까지 해제 금지.
5. `npm test` / `npm run desktop:test`에 공급망 거부/차단 합성 테스트 15+6개 연결, `npm run build`의 `prebuild` 단계 및 Windows NSIS 0.1.0/0.1.1 빌드 각각에 RELEASE HOLD 검사 추가. Electron 파일 포함 목록도 dist/**, desktop/**, package.json 세 항목만 허용하며 추가 파일 glob은 우회로로 간주해 차단.

## 실 사용 명령(소유자가 실제 공급망 검증을 맡게 된 미래 단계에만)

```text
npm run ocr:preflight -- <구별된 assets 폴더> <외부 manifest.json>
npm run ocr:release-gate
```

`ocr:preflight`는 인자 없이 실행하면 실패한다. 네트워크/서명 검증·설치파일 추출·DLL 수집·LICENSE 텍스트 생성·실 Tesseract 실행은 하지 않는다. 현재 저장소에는 실제 Windows OCR 자산·최종 패키지 서명/동의서 없음. Windows 공급자 설정을 추정하거나 자동 다운로드하지 않는다.

## 입력 manifest 최상위 구조

```json
{
  "schemaVersion": 1,
  "purpose": "astra-offline-ocr-asset-audit",
  "platform": "windows-x64",
  "origin": {
    "distributor": "확인된 배포자",
    "version": "검증한 정확 버전",
    "installerUrl": "https://공식적으로-확인한-배포주소",
    "installerSha256": "설치파일의 실제 측정 SHA-256"
  },
  "files": [
    {
      "path": "bin/tesseract.exe",
      "kind": "engine",
      "bytes": 12345,
      "sha256": "실제 측정 SHA-256",
      "licenseId": "tesseract-apache",
      "sourceUrl": "https://github.com/tesseract-ocr/tesseract"
    }
  ],
  "licenses": [
    {
      "id": "tesseract-apache",
      "spdx": "Apache-2.0",
      "file": "licenses/TESSERACT-LICENSE.txt",
      "sourceUrl": "https://github.com/tesseract-ocr/tesseract"
    }
  ]
}
```

위 JSON은 **구조 개요이며 실행 가능한 완전 manifest가 아니다**. 실제 검증에는 모든 DLL/두 언어팩/개별 라이선스 2종 이상/THIRD-PARTY-NOTICES.txt의 정해진 경로·크기·SHA·각 파일 라이선스 ID가 필요하다. 자동 생성된 가짜 권리·SHA는 사용할 수 없다. 테스트는 실제 OCR 바이너리 없이 합성 PE 바이트와 가짜 한영 모델로만 진행한다.

## 완료·보류 기준

- 소스+회귀 테스트 개발은 GitHub 개발 브랜치에서 수행. **최종 기능 코드 SHA e2fd0797990ce94e7f7a68720ece3617f9d114db; 이 SHA의 실제 Linux/Windows CI 결과는 정확 Actions 확인 후 별도 기록.**
- OCR 실 런타임에서는 `OCR_MANIFEST=null` 유지. 공급망 도구만 PASS해도 화면 OCR 기능 활성화/판매/서명은 금지.
- 실 Windows EXE/DLL 및 설치파일의 인증서 서명·해시·원본 버전/소스·SBOM·LICENSE·NOTICE 검토, 테스트 머신의 모든 종속 DLL 로딩, kor/eng 실제 인식, 동의된 고객 PDF, 실제 Windows10/11 및 별도 출시 승인은 미완.
- 공식 12영역 최종 점수 UNASSESSED/100% 미달, [작업중], RELEASE HOLD, 크몽 미등록. STEP1 V1/STEP2 V2 및 원본 변경 0. Vercel 미적용.
