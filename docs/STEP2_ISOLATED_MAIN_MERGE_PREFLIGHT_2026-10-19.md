# STEP 2 — 격리된 3-way 실제 병합·원본 보존·Chrome/Edge 통합 검증 (2026-10-19)

**판정: MERGE PREFLIGHT PASS. `main` 실제 병합/푸시 없음. 최종 사용자 수용/명시적 main 병합 승인은 별도.**

## 1. 시험한 정확한 코드 상태

- `main` HEAD (시험 시점): `e35e5dfe6a17d32ab1e1e1b2fe21d8bb2b52323a`
- 병합 대상 STEP2 기능 HEAD: `8d9fdb1adef31875a793cce9376de3154eb08229`
- 공통 조상: `3e3503ba0dc80903f810f8507eae35a5a2d1da41`.
- 기능 브랜치 독점 커밋 73개, `main` 독점 커밋 32개(동일 시점 compare_commits).
- 실제 GitHub Actions: [`39150537369` — isolated merge preflight SUCCESS](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369).
- 동일 feature SHA를 단독 체크아웃한 [기존 전체 CI `39150537297` — SUCCESS](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537297).
- 워크플로: `.github/workflows/step2-merge-preflight.yml`, `push` feature + `workflow_dispatch`, 권한 `contents: read`.

## 2. 실제 병합 방법과 안전장치

Actions Ubuntu 임시 runner에서 `actions/checkout@v4` `fetch-depth:0`, `persist-credentials:false`, `git fetch origin main` 후:

```sh
FEATURE_SHA="$GITHUB_SHA"
MAIN_SHA=$(git rev-parse refs/remotes/origin/main)
git switch --detach "$MAIN_SHA"
git merge --no-commit --no-ff "$FEATURE_SHA"
```

- `HEAD`가 여전히 `MAIN_SHA`인지, `.git/MERGE_HEAD`가 `FEATURE_SHA`인지 검사.
- `git diff --name-only --diff-filter=U` = 빈 결과, 병합 충돌 없음.
- 스테이징에 feature 내용 **28개 경로** 존재, STEP2 앱·E2E 테스트 코드 존재 확인.
- **merge commit 생성하지 않음**, 실제 `main`/feature ref 갱신 및 GitHub push 없음. main은 STEP1 버전 그대로.
- 시험 후 STATUS/HANDOFF 같은 `main` 문서만 추가 수정한다면 main HEAD는 바뀐다. **병합 직전 최신 SHA 조합으로 이 프리플라이트를 다시 실행**해야 완전히 같은 대상 쌍을 최종 검증한 것이다.

## 3. 원본 바이트 무결성 (실제 병합 결과에서 검사)

`cmp`로 `origin/main` 해당 파일과 병합 결과를 **바이트 단위 1:1 비교**:

| 파일 | 결과 |
|---|---|
| `HANDOFF.md`, `STATUS.md` (`main` 최신 기록) | PASS |
| `src/App.tsx`, `src/storage.ts` (STEP1 핵심 UI/저장 로직) | PASS |
| `docs/ASTRA_ORIGINAL_ROADMAP.txt` | PASS |
| `docs/STEP1_SPEC.md`, `docs/BLUEPRINT.md` | PASS |
| `docs/blueprints/architecture-flow.png` | PASS |
| `docs/blueprints/seven-step-plan.png` | PASS |
| `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt` (기능 브랜치 원문 기준) | PASS |

**확인 범위:** 파일 바이트 그대로이고 앱 저장 키·마이그레이션 로직 등의 세부 실패 검증은 아래 실제 Chrome/Edge 회귀 테스트로 추가 확인했다. 다른 OS/예상치 못한 브라우저 확장/실제 고객 데이터 전수 검증은 아니다.

## 4. 병합된 트리에서 실제 테스트

- Node 22 `npm install --no-audit --no-fund`, `npm test` **16 PASS / 0 FAIL**, `npm run build` **PASS**.
- 실제 Google Chrome: `tests/browser-smoke.mjs`, `tests/step2-browser.mjs`, `tests/step2-multitab.mjs`, `tests/step2-cold-migration.mjs` 정상/실패주입 모드, `tests/step2-cross-profile.mjs` **전부 PASS**.
- Chrome STEP1 A4 15페이지, STEP2 PNG/JPEG/WebP·이미지 A4 PDF, 원본 JSON 내보내기/독립 프로필로 가져오기·바이트 보존, IndexedDB 저장·강제 abort 롤백/재시도, 기존 V1 원본·migration marker, 실제 두 탭 Web Locks, 대형 이미지/긴 캡션 페이지 물리 경계 확인 PASS.
- 실제 Microsoft Edge 155.0.4283.45: `tests/browser-smoke.mjs` 및 `tests/step2-browser.mjs` **PASS**. STEP1 A4/텍스트 추출 및 STEP2 이미지/IndexedDB/JSON/긴 캡션/강제 저장 오류 회복.
- 로그 최종 표식: `PASS MERGED NODE22`, `PASS MERGED CHROME`, `PASS MERGED EDGE`, `PASS MERGE PREFLIGHT`.
- [preflight 성공 로그](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39150537369)에서 `MERGE_PREFLIGHT_MAIN_SHA`, `MERGE_PREFLIGHT_FEATURE_SHA`, `PASS PRESERVED_MAIN` 각 경로 및 결과를 직접 확인.
- 알려진 임시 테스트 Chrome 프로필 삭제 지연 경고 `ENOTEMPTY`는 synthetic data 정리 이슈이며 테스트 성공/앱 데이터 손상과 구별.

## 5. 최종 판단·다음 작업

- **기술적 병합 가능 판정: PASS.** 시험한 커밋 쌍에 대해 충돌 0, 원본 바이트 보존, merge tree 빌드/단위/Chrome·Edge 핵심 회귀 통과.
- **실제 main 병합: 미실행.** STEP2 최종 사용자 수용/병합 여부에 관한 명시적 승인은 별도.
- 사용자가 Windows Chrome에서 제공한 1페이지 A4 테스트 PDF의 한글·서체·텍스트 추출·편집 UI 제외는 **부분 검증**됨. Linux Edge 자동 PASS와 Windows Edge 사용자의 실제 PDF 시각 검증은 구분. Windows 긴 이미지·여러 페이지/키보드 등 일부 수동 수용 항목 미완료.
- STEP2 **자동 검증·기능 구현 약 99%**의 비공식 추정; 전체 7단계 **약 28~29%**(단계 동등비중). 이번 기술적 병합 시험으로 전체 5%p 이상 상승하지 않았음.
- 다음 1단위: 사용자 수용 범위/남은 Windows Edge 시각 검수에 대한 결정을 받고, 병합 승인 후 **최신 main+feature HEAD 재검사, 실제 main 병합 및 main CI 성공** 확인. 그 전 STEP3 미착수, main 직접 변경 금지.

**원본 `docs/ASTRA_ORIGINAL_ROADMAP.txt`, 설계 PNG, STEP2 지침 TXT, 사용자 로컬 자료는 변경하지 않았다.**
