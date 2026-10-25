# Astra PDF Redesigner — STEP 1 회고록 PDF 제작기

> **LATEST M06-B (2026-10-26):** app code `b20484c3c7302af2ce214878422031ce041e6e44` validated [Chrome+Edge #40209887602](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40209887602) SUCCESS (60/60 tests, real stage keyboard, PDF drop, 900/1100/1600px), [Windows NSIS #40209887559](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40209887559) SUCCESS (installed PDF/upgrade, not direct Windows drop-click). Internal PDF core ready for controlled demo, **NO commercial sale**: offline LLM not shipped, 8/20/30 designs/SKU & buyer devices not verified. NEXT READY M07-A additional BASIC print layouts; actual LLM binary acquisition approval-gated. See `docs/commercial/M06_B_STUDIO_UX_20261026.md`.

> **LATEST M05 VERIFIED — 2026-10-26 KST:** Actual 1600×1000 Chrome screenshot from [#40205522431](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40205522431) reviewed; app SHA `31b499182ade86717a82ff4e8960401a96ab4c0f` Linux Chrome/Edge SUCCESS (58/58 unit), Windows NSIS [#40205522595](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40205522595) SUCCESS. **Restricted internal PDF→2 designs→new A4 demo GO; commercial sale NO-GO**. M01/M02/M03-A/M03-B0/M04/M05 scoped work complete; real local LLM, page/block click verification, true 8/20/30 SKU features, buyer PDF/Windows tests remain unverified. **NEXT ONE READY M06-A:** click source origin page/coordinate from editable block, navigation/highlight and explicit completeness-review state with synthetic browser tests. Actual model acquisition M03-B1 remains approval-gated. Report `docs/commercial/M05_MVP_REVIEW_20261026.md`; main/PR3/PR4 unchanged, Draft PR9. **Older M01/M03/M04 NEXT lines below are historical.**

국비학원 제출용 회고록을 입력하고 3가지 디자인 중 하나로 꾸며, 브라우저의 인쇄 기능으로 PDF를 저장하는 **개인용 로컬 웹앱**입니다. 내용 수정·요약·교정은 수행하지 않습니다.

## 실행

사전 준비: Node.js 22 이상, npm, Chrome 또는 Edge.

```bash
npm install
npm run dev
```

터미널에 표시되는 `http://127.0.0.1:5173` 주소를 엽니다. 인터넷 연결은 **최초 의존성 설치 때** 필요할 수 있으며, 설치 후 앱의 기본 기능은 외부 서버나 API를 사용하지 않습니다. 빌드 검증: `npm run build`, 데이터 검증: `npm test`.

## PDF 저장

1. 회고록 제목·작성일·본문을 입력하고 테마/색상/크기/폰트를 선택합니다.
2. 오른쪽 A4 폭 미리보기에서 내용과 스타일을 확인합니다. 긴 문서의 정확한 페이지 나눔은 여기서 제공하지 않습니다.
3. **PDF 저장 / 인쇄** 버튼 → 인쇄 대상을 **PDF로 저장** → A4 용지를 선택합니다.
4. 인쇄 창에서 **머리글과 바닥글을 해제**하고 배경 그래픽 설정을 확인합니다. 이 옵션은 앱에서 강제 변경할 수 없습니다.
5. PDF를 열어 한글 텍스트 선택 가능 여부, 여러 페이지의 마지막 문단, 페이지 나눔을 확인합니다.

## 저장과 데이터 주의

입력 내용과 디자인 설정이 사용 중인 브라우저의 `localStorage`에 단일 작업본으로 자동 저장됩니다(`schemaVersion: 1`). 서버 전송은 없으며 계정/클라우드 백업·다중 문서 관리는 없습니다. **브라우저 사이트 데이터 삭제, 시크릿 창 종료, 다른 브라우저/주소 이용 시 자료가 사라지거나 공유되지 않습니다.** 중요한 원문은 별도로 백업하세요. 저장 실패 시 앱에서 경고합니다. 예시 불러오기·초기화는 기존 내용이 있으면 확인합니다.

## 기술 및 제한사항

React / TypeScript / Vite / CSS, 기본 로컬 개발 주소 `127.0.0.1`만 바인딩. PDF 라이브러리, 외부 폰트/CDN, AI API, 백엔드 없음. 브라우저 시스템 글꼴을 사용해 OS별 출력이 다를 수 있습니다. STEP 1에는 기존 PDF 가져오기, OCR, 이미지 업로드, 표 편집, 설치형 앱, 인터넷 레퍼런스 기능이 없습니다. 원본 설계와 이후 단계는 [설계도](docs/BLUEPRINT.md) 참조.

## 수동 인쇄 확인 항목

- [ ] 짧은 회고록: 문서만 출력되고 편집기/UI가 없음
- [ ] 짧은 회고록: 한글이 정상 렌더링되고 글자 선택 가능
- [ ] 긴 회고록(여러 페이지): 끝 문단까지 누락/잘림 없음
- [ ] 긴 URL·공백 없는 문장: 오른쪽 넘침 없음
- [ ] 빈 섹션 및 작성자: 미리보기/인쇄 양쪽에서 숨김
- [ ] Chrome / Edge 인쇄 옵션과 페이지 나눔 확인


## STEP 2 기능 브랜치 검증 현황 (2026-10-19, **Linux Chrome 통합검증 성공 / 최종 수용 전**)

작업 브랜치 `feature/step2-full-20261018`에서 문서함, 섹션·블록 편집, PNG/JPEG/WebP 이미지, IndexedDB 자동 저장, 여러 문서 관리, `.localdoc.json` 내보내기/가져오기, 컴팩트 리포트 테마 소스를 구현했습니다. 이 기능 브랜치는 Ubuntu Node 22에서 **단위 테스트 16/16, TypeScript/Vite 빌드, 실제 Chrome·Microsoft Edge 통합검증**을 완료했습니다([Actions #39149195481](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481)). Chrome·Edge 실행파일이 없으면 해당 필수 브라우저 검사를 건너뛰지 않고 실패 처리합니다. 기존 STEP 1 저장 데이터의 cold-start 마이그레이션, 최초 마이그레이션 실패 시 원자적 롤백·재시도, 서로 다른 Chrome 프로필 간 `.localdoc.json` 이식과 이미지 원본 보존·A4 PDF 포함 여부도 자동 검증했습니다. **사용자가 제출한 Windows Chrome 1페이지 A4 PDF의 한글/서체·텍스트 추출·편집 UI 제외는 부분 확인했습니다. Windows Edge 실제 PDF 및 큰 이미지·긴 문서의 Windows 시각·키보드 검수는 남아 있습니다.** STEP 2 기능은 아직 `main`에 병합하지 않았습니다. 자세한 검증 내역은 [STEP 2 검증 기록](docs/STEP2_IMPLEMENTATION_STATUS_2026-10-18.md)을 보세요.

소스 동작 예상 흐름: `npm install` → `npm test` → `npm run build` → `npm run dev`. 프로젝트 가져오기는 **현재 문서를 덮어쓰지 않고 새 문서로 추가**합니다. 100MiB 이하 `.localdoc.json` 파일의 이미지 데이터는 파일에 포함되며, **암호화되지 않으므로 별도 보안 저장**하세요. Web Locks 지원 브라우저에서는 한 탭만 편집하도록 제한합니다. Windows/Edge 인쇄 품질은 별도 검증이 필요합니다.

이미지 개별 파일은 10MiB·2,000만 픽셀 이하이며 PNG/JPEG/WebP만 사용합니다. 원본 이미지의 방향·화질은 변경하지 않습니다. 문서함은 IndexedDB(origin/브라우저 프로필 단위)에 저장되므로 브라우저 사이트 데이터를 지우면 소실될 수 있습니다. STEP 1의 `localStorage` 원본은 자동 삭제하지 않습니다.


최종 요구사항별 검수와 보류 사유는 [STEP 2 요구사항 감사](docs/STEP2_FINAL_REQUIREMENTS_AUDIT_2026-10-19.md)에 기록했습니다. 빠른 화면 전환 전에 미저장 V2 문서를 먼저 저장하도록 보강했고, STEP 1 데이터가 나중에 발견되어도 기존 활성 V2 문서를 임의로 바꾸지 않습니다. 저장 실패 시 화면 전환은 취소됩니다.


추가 증거: [Chrome 프로필 A→B 실물 JSON 파일 이식 Actions #39144399956](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39144399956). 서로 다른 Chrome 사용자 데이터 디렉터리에서 테스트했고, 가져오기는 B의 기존 문서를 덮어쓰지 않고 독립 ID로 추가하는 것을 확인했습니다.


[STEP2 최초 마이그레이션 중 강제 트랜잭션 중단·복구 검증 Actions #39145149408](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39145149408): 실패 직후 v2 문서·완료 표시·활성 문서 쓰기가 모두 취소되고 STEP1 원본이 보존되며, 이후 재시도·새로고침에서도 중복 생성이 없는지 확인했습니다. 기능 브랜치의 STEP2 코드는 아직 `main`에 병합하지 않았습니다.


## Windows Chrome/Edge 최종 수동 수용 (부분 확인, 전체 미완료)

STEP 2 병합·완료 전 필요한 **원본 지침 §16의 21개 수동 검사**, 테스트용 별도 프로필 실행 명령, 실제 Windows A4 PDF/한글·이미지 확인 항목, 증거 양식 및 **main 병합 승인 게이트**는 [Windows STEP 2 수용 체크리스트](docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md)에 있습니다. 원본 21개 항목의 **완전 수용은 아직 미완료**지만 제출된 Windows Chrome 짧은 PDF의 A4·한글·출력 UI 제외는 확인했습니다. STEP2 기능 브랜치는 `main`에 **미병합**입니다. 기존 사용자 브라우저 프로필/문서는 직접 검증용으로 변경하거나 삭제하지 마세요.

## STEP 2 병합 전 코드·CI 점검

[병합 전 코드·CI 점검 보고서](docs/STEP2_PREMERGE_CODE_CI_AUDIT_2026-10-19.md): `main`과 기능 브랜치 비교, 원본 STEP1 보호, Chrome 누락 시 CI 실패 처리, Windows Chrome 사용자 제공 단일 A4 PDF 부분 검증과 Edge/장문/이미지 수동 검수의 미완료 범위를 기록했습니다. `main` 병합과 STEP3 시작은 아직 보류 상태입니다.


## GitHub Actions — 실제 Microsoft Edge 테스트

[Microsoft Edge 155 STEP1·STEP2 A4 PDF 및 IndexedDB 회귀 성공](docs/STEP2_EDGE_CHROMIUM_CI_VALIDATION_2026-10-19.md): [Actions #39149195481](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39149195481)에서 실제 `/usr/bin/microsoft-edge`, `Microsoft Edge 155.0.4283.45`를 실행했습니다. STEP1 A4 15페이지, STEP2 이미지 PNG/JPEG/WebP, 긴 캡션 여러 페이지, IndexedDB 저장 실패/복구와 JSON 백업이 **Linux Edge에서 PASS**했습니다. **Windows Edge 수동 인쇄·폰트·시각 확인을 대신하지는 않습니다.**


## 실제 main 병합 사전검사 — **테스트 성공 / 실제 병합은 미실행**

[격리된 3-way 병합·원본 보존·Chrome/Edge 통합 검수 보고서](docs/STEP2_ISOLATED_MAIN_MERGE_PREFLIGHT_2026-10-19.md) / [GitHub Actions #39150537369](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369).

`main`(시험 당시 `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`)을 별도 Actions runner의 **detached HEAD**로 체크아웃해 STEP2 기능 커밋 `8d9fdb1adef31875a793cce9376de3154eb08229`을 `git merge --no-commit --no-ff`로 병합 시험한 결과 **충돌 0**, STEP1 기존 App/storage, main의 최신 STATUS/HANDOFF, 로드맵/PNG 및 STEP2 지침 원본 바이트 그대로 보존 PASS, 병합한 트리에서 Node16/16·빌드·Chrome 전체 E2E·Edge A4/저장 E2E **PASS**. 메인 브랜치에 실제 merge commit/푸시는 하지 않았습니다. 최종 사용자 수용·승인 및 병합 시점 최신 HEAD 재검증은 별도입니다.


## STEP 2 병합 후 CI 상태 (2026-10-19)

PR #2는 `main`에 병합되었으며 merge SHA는 `f1ad26320b12b07019b115f77f8cf55e62f1e7e6`입니다. 초기 `main` CI에서 Edge CDP 연결 실패가 발생했으나, 브라우저 WebSocket 직접 연결과 독립 Edge runner로 복구한 코드 SHA `a54c10a89e486cf4ab0f922f9ee6aa83fffe013a`의 [Actions #39157047624](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39157047624)는 **Chrome·Edge 포함 전체 SUCCESS**입니다. [상세 복구 보고서](docs/STEP2_POSTMERGE_MAIN_CI_RECOVERY_2026-10-19.md) 및 [Windows 수동 검수표](docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md)를 참고하세요. **Windows Edge 실제 PDF와 Windows 장문/이미지 PDF 육안 수용 검수는 미완료**이며, STEP 3은 아직 미착수입니다.
