# Windows STEP2 동일 프로필 재실행 보존 검증 — 2026-10-19

- 대상: PR #4 `feature/windows-electron-package-20261019`, 코드 SHA `0c627cdca0668a6f7548a1407eb8d5088faaa264`.
- Windows GitHub Actions [#39215369203](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39215369203): **completed/success**, head SHA 일치.
- Windows runner Node 기존 단위 **19/19**, desktop 단위 **6/6**, TS/Vite build, Electron smoke, NSIS 설치·바로가기·제거 **PASS**.
- 설치된 EXE 첫 프로세스: 실제 STEP2 UI 입력으로 합성 문서/PNG를 IndexedDB에 저장, 앱 내부 재로드 확인, A4 **3페이지**, 한글·숫자 식별자 **5/5**, raster draw **1** 출력 검증.
- **별도 설치 EXE 두 번째 프로세스**: 첫 프로세스와 동일한 격리 `RUNNER_TEMP/astra-step2-profile-<PID>` 프로필을 열고 저장된 STEP2 문서·이미지·캡션·자산 메타·실제 이미지 로딩 검증. 로그 `PASS ASTRA STEP2 PROFILE PRESERVED` 및 `PASS ASTRA STEP2 SECOND EXE LAUNCH`.
- 수정: `desktop/step2-project-acceptance.cjs` 검증 전용 플래그 `--astra-step2-preservation-verify`, `desktop/main.cjs` CI 전용 프로필 환경변수 `ASTRA_STEP2_PROFILE_DIR`, `tests/windows-installer-lifecycle.ps1` 별도 프로세스 재실행.
- 안전장치: `GITHUB_ACTIONS=true`, `RUNNER_TEMP` 직하위 허용 이름 검증. 사용자 로컬 프로필/고객 파일 수정 없음. 일반 제품 실행 경로 불변.
- 새 unsigned 시험용 설치 파일 `ASTRA-PDF-Redesigner-Setup-0.1.0-x64.exe`, SHA256 `AB74148E4DD30CBB7C9996790271AF4832DDD0A6896856211F53FDDB5D3E6AD2`. [Artifact #12169552072](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39215369203/artifacts/12169552072), ZIP 112310681 bytes, 2026-10-26T07:22:28Z 만료.
- **미검증/구분**: 이는 동일 버전 EXE의 별도 프로세스 재실행 검증이다. 이전 버전 → 새로운 버전 설치·스키마 마이그레이션, 실제 Windows10/11 고객 PC GUI, 실문서 픽셀/폰트/표 품질, 서명/SmartScreen/판매 검증 **아님**.
- PR3 PDF 가져오기 및 PR4 Windows 설치형은 각각 Draft/open/unmerged. 사용자 승인 전 main 기능 병합·STEP4 착수 금지. 전체 7단계 약38% 비공식 추정 유지.
- 다음 한 단위: 실제 **두 개의 상이한 빌드/버전**으로 동일 프로필의 STEP2 문서+PNG를 열어 읽기·출력 결과를 비교하는 업그레이드 보존 검사. CI 비용·호환성 검토 후 실행.
