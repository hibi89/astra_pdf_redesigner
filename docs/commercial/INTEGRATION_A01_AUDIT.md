# A01 — PR3 / PR4 / main 통합 위험 실사 (2026-10-25 KST)

> 상태: **DONE = 원격 변경파일·코드/의존성 비교까지만 완료.** git 3-way merge, npm install/test/build, browser/Windows CI **NOT RUN**. 추후 실제 통합 결과와 혼동 금지.

## 1. 원격 기준
| 원본 | SHA | 당시 상태 |
|---|---|---|
| main | `2d1b29595f78653d5d53464e7dad747d61c35fc2` | STEP1/2 사용중, 보호 |
| PR3 `feature/step3-pdf-import-20261019` | `faec84e388da0f7a6d71f71c1b8d14e18d9f3098` | open/draft/unmerged |
| PR4 `feature/windows-electron-package-20261019` | `057ccef81b97dd741c46002c28292bfdf544362f` | open/draft/unmerged |
| Lead 상품설계 첫 커밋 | `c0ef9882bf02e22d0ae3b4340cacfb681bf02399` | 9개 기획문서만 추가 |

GitHub compare 기반: main...PR3 = diverged(ahead 53 / behind 20), main...PR4 = diverged(ahead21 / behind7), PR3...PR4 = diverged(ahead34 / behind53). ahead/behind 기준 방향·최신 커밋 기반 값이며 실제 merge 성공 보증이 아니다.

## 2. 확인된 변경파일·통합 위험
| 위험 | main→PR3 | main→PR4 | A02에서 할 일 |
|---|---|---|---|
| **package.json 충돌 후보 — P0** | `pdfjs-dist:6.4.299` runtime dependency 추가 | Electron 44.9, builder26.15.3, `pdfjs-dist:6.4.299` devDependency, main entry/scripts 변경 | desktop packaged production에서 pdfjs PDF worker 동작 검증. 전용 런타임 dependency 위치 결정·lockfile 관리 |
| **Workspace 중복 변경 — P0** | `src/step2/Workspace.tsx` import UI 추가, `model.ts`, `useWorkspace.ts` 변형 | `src/step2/Workspace.tsx` native PDF export 경로 개입 | 같은 버튼/저장 상태에서 import+export 모두 유지. 컴포넌트 diff/테스트 |
| **PDF.js worker / asar — P0** | `?url` 번들 worker와 `import('pdfjs-dist')` | Electron `astra://app` 보안 프로토콜·`dist/` 번들 자원 접근 제한 | Electron packaged `astra://app` 에서 실제 PDF 가져오기 테스트. worker src 로드·CSP/URL·asar 경로 체크 |
| **Desktop App export 차이 — P0** | browser `window.print` 기본 경로 | `src/desktopPdf.ts`와 secure IPC `savePdf` | Electron에서 imported STEP3 문서가 native SaveDialog→printToPDF까지 이어지는지 확인 |
| **CI 충돌 후보 — P1** | `.github/workflows/ci.yml`과 Browser step3 E2E 확장 | `windows-desktop.yml` 신규, Vite config 변경 | Linux Chrome/Edge + Windows NSIS 통합, 테스트 누락/건너뛰기 금지 |
| **DB/백업 호환 — P0** | 이미지 PNG 원자 추가·ContentBlock origin 메타 확장 | 실제 STEP2 v2 userData 유지/NSIS 업그레이드 | STEP1 v1, STEP2 v2, import v2 경로 + Windows userData 로컬 캐시 데이터 loss 0; schema 변환 실변경 시험 |
| **문서 역사 덮어쓰기 — P1** | 구 REQUIREMENTS/AGENTS/STATUS/HANDOFF 일부 상충 | 구 README/STATUS/HANDOFF 추가 | 원본/역사 문서 직접 재작성 대신 `docs/commercial` 최신 SSOT 추가. 기능 통합에서 문서 충돌 우회 |
| **외부통신·자식 프로세스 — P0 후속** | 브라우저 PDF local | Electron 네트워크 차단·nodeIntegration false | 향후 local LLM sidecar는 preload 최소 IPC·네트워크 0·취소/종료 안전. 기존 보안 약화 금지 |

겹치는 경로는 **통합 충돌 후보**이지 실제 `git merge`에서 conflict 마커가 발생했음을 뜻하지 않는다.

## 3. A안 / B안 비교와 결정
- A안 **STEP3 콘텐츠 흐름 우선 + PR4 desktop shell의 대상 파일만 선별 통합**: PDF 데이터 모델·원문 보존 경로를 먼저 고정, 이후 Electron secure protocol에 실제 import/export 결합. 장점 콘텐츠 변경 추적 용이, 단점 package/Workspace/IPC 수동 접합 필요.
- B안 **PR4 desktop 패키징 우선 + PR3 전체 기능 포팅**: 설치 수명주기 회귀를 먼저 확보, 단점 STEP3 browser PDF worker와 importer 상태·Vite 빌드 경로 충돌 시 원인 추적 어려움.
- **잠정 선택: A안.** 실제 `npm test`/build/Windows packaged import 증거가 나오면 B안으로 변경 가능. PR3/4 본체 commit·merge 불가.

## 4. A02 통합 수용 작업 목록
1. `integration/astra-commercial-core` HEAD에서 기존 9+감사 문서 보존; PR3 코드 변경만 분리해 선택 적용(업스트림 역사 문서 덮지 않음).
2. `package.json`에 PDF.js runtime/desktop dev deps, Electron `main` field/scripts를 함께 보유. 빌드 자원/권한·잠금파일 명시.
3. PDF.js PDF 1~2페이지 합성 샘플 import→block compare→명시적 승인→IDB 저장→Electron PDF native export 전체 연결.
4. STEP1/2 localStorage/IDB cold migration·image JSON 백업/복구/멀티탭 회귀 보존.
5. Node 테스트/tsc+Vite build/Chrome & Edge E2E/Windows NSIS 설치·재실행·A4 PDF 검증; **실제로 돌린 환경의 로그·SHA만 PASS 기록**.
6. 보안: `http(s)` outbound 0, PDF worker `astra:` 접근, untrusted PDF 문구 XSS, 파일 덮어쓰기 안전, import 취소 시 DB 변화 0.
7. 기능 합격해도 고객 실제 PDF/서명/SmartScreen/OS GUI는 여전히 NOT RUN; `main` 병합 금지.

## 5. 실행·보고
- 실제 시작 브랜치: `integration/astra-commercial-core` (총괄 기획 첫 커밋에서 출발했으며 **코드 미통합**).
- PDF 품질 전담 브랜치: `feature/astra-pdf-fidelity-20261025` (PR3 원본 SHA에서 파생, **아직 변경 없음**).
- 다음 작업: `A02` READY, `D01` 병렬 가능. `A02` 완료 전 'PDF 설치형 작동' 제품 완성 주장 금지.
