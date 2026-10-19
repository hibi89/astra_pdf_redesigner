# Windows NSIS 0.1.0 → 0.1.1 실제 덮어 설치 STEP2 데이터 보존 — 2026-10-19

- 기능 코드 기준 SHA `5b5a833dd9611f9dd0d90af803c6ce7b0735cc0d` / PR #4 Draft, 미병합.
- GitHub Actions Windows [#39216361190](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39216361190), **completed/success**; 최종 버전 전환 테스트와 아티팩트 업로드 모두 성공.
- `npm test` 19/19 PASS; `desktop:test` 6/6 PASS; React TS/Vite build·Electron 실행·기존 NSIS 설치/바로가기/제거·STEP2 실제 문서→PNG→A4 PDF 검증 모두 PASS.
- 별개로 Windows runner에서 먼저 **0.1.0** NSIS 설치 파일 생성 후 실제로 설치. STEP2 UI에서 합성 문서/PNG와 캡션을 IndexedDB에 저장하고, 이를 PDF로 출력해 PDF.js 검사(A4 3쪽, 한글·숫자 식별자 5/5, 이미지 draw 1) PASS.
- `tests/prepare-upgrade-candidate.cjs`가 **CI 작업 디렉터리 내에서만** 패키지 버전 번호를 **0.1.1**로 임시 변경. 원본 Git `package.json`은 0.1.0 그대로이고 코드/저장 스키마 동일. 두 번째 실제 NSIS 설치 파일을 생성하여 **동일 설치 디렉터리에 덮어 설치**.
- 업그레이드된 EXE를 별도 프로세스로 실행하여 **동일 CI 임시 프로필**의 IndexedDB 문서·PNG 자산, 캡션·이미지 로딩을 확인하고 NSIS 제거 성공. 로그 `PASS ASTRA UPGRADE BASELINE 0.1.0`, `PASS ASTRA NSIS VERSION UPGRADE 0.1.0 -> 0.1.1`, `PASS ASTRA UPGRADE UNINSTALL` 확인.
- CI 0.1.1 **테스트 전용 unsigned 설치 파일** SHA256 `EBDD0945CCF242CA126A109DA20772D3854DB0A292E5A39BBE28977F83F559FA`. [Artifact #12169723064](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39216361190/artifacts/12169723064), ZIP 112310642 bytes, 2026-10-26T07:33:22Z 만료.
- **정확한 범위:** 서로 다른 **버전 번호를 가진 별도 설치 패키지 두 개**를 실제 설치·덮어 설치했지만, 새 버전의 소스 코드와 IndexedDB 스키마는 이전 버전과 동일함. **실제 구버전 기능 코드 → 변경된 신버전 코드/스키마 마이그레이션 검증 아님**. 일반 사용자 Windows 10/11 수동 실행, 서명/SmartScreen, 실제 고객문서 글꼴·표·인쇄시각품질/판매 준비 미검증.
- 안전: `GITHUB_ACTIONS=true`, Windows runner 임시 설치/프로필 폴더 제한. 실제 고객 파일 및 릴리스 태그·main 프로그램 소스는 변경 없음.
- PR3 PDF import / PR4 Windows desktop Draft/open/unmerged. main 기능 병합·STEP4 진입은 별도 사용자 승인 전 금지. 전체 7단계 비공식 약38% 유지.
- 다음 작업: 변경된 실제 앱 코드/스키마 전후 데이터 백업·복원·마이그레이션 영향 분석(구버전 재현 가능성 확인), 또는 사용자 승인 대기 중 Windows 10/11 수동 인수 시나리오 설계. 새 기능 추가·병합은 금지.
