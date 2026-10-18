# STEP 2 병합 전 코드·CI 검수 보고 (2026-10-19)

> **판정: 코드/CI 점검 PASS (지적사항 1건 수정). 전체 STEP 2 사용자 수용 및 main 병합은 HOLD.** GitHub 기능 브랜치의 최신 코드를 확인했다. 본 점검 중 main 병합·STEP3 개발·사용자 데이터 변경은 수행하지 않았다.

## 1. 점검 범위와 기준

- 저장소 `hibi89/astra_pdf_redesigner`, 기능 브랜치 `feature/step2-full-20261018`, 기존 `main` 유지.
- 비교 기준 `main` HEAD `929b809c9a042800e22f1e809843b995b69b8313` vs 기능 브랜치의 코드 수정 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`.
- `main...feature` 비교 결과 63 커밋 앞섬/28 커밋 뒤짐(`diverged`), `feature...main`의 주된 변경 파일은 `HANDOFF.md`, `STATUS.md` 두 개. 기능 브랜치는 React/TypeScript 문서 편집기, IndexedDB, 이미지·JSON 처리, CI와 Chrome 회귀 검사 파일을 추가/변경한다.
- 파일 비교만으로는 **실제 3-way merge 충돌 없음/merge 성공을 확정할 수 없다**. main의 최신 인수인계·상태 기록을 병합 과정에서 반드시 보존하고, 병합 전후 diff·Actions를 재확인해야 한다.
- 원본 로드맵·설계 이미지와 `docs/ASTRA_STEP2_ORIGINAL_INSTRUCTIONS.txt`는 수정하지 않았다. STEP2에서 새로운 상용/외부 API 의존성을 추가하지 않았으며 `package.json` 스크립트: `dev`, `test`, `build`, `preview` (lint 스크립트 없음).

## 2. 코드 주요 영역 점검

| 영역 | 코드/증거 | 결론 |
|---|---|---|
| STEP 1 호환 | `src/Root.tsx`에서 기존 STEP1 UI와 STEP2 UI 모드 분리, v1 `localStorage` 원본 보존, Chrome STEP1 15p PDF 스모크 | 자동 검증 PASS |
| 데이터 모델/수정 | `src/step2/model.ts` schemaVersion2, 섹션/블록 UUID·원문, `src/step2/useWorkspace.ts` debounce/flush 및 문서 전환 게이트 | 자동 검증 PASS |
| IndexedDB 안전 | `src/step2/idb.ts` 트랜잭션과 migration marker/ACTIVE 원자 기록, 실패/재시도 및 이미지 교체 atomic abort 실브라우저 주입 | 자동 검증 PASS |
| 이미지/JSON | `src/step2/images.ts` PNG/JPEG/WebP 검증, `src/step2/projectFile.ts` Base64 포함 JSON export/import, 서로 다른 Chrome 프로필 간 실제 파일 이식 | 자동 검증 PASS |
| 브라우저 인쇄 | `src/step2/Workspace.tsx` 인쇄 전 flush·이미지 decode·`document.fonts.ready`, CSS @print A4 및 긴 캡션 페이지/이미지 raster 검사 | Linux Chrome PASS |
| 멀티탭 | Web Locks 기반 동일 origin 편집권 단독 유지, 실제 Chrome 2탭 소유권 교체·저장 | 자동 검증 PASS |
| 사용자 Windows Chrome PDF | 사용자가 공유한 단일 PDF 분석: 1페이지 A4 `594.96 x 841.92 pts`, Windows Chrome 155/Skia, Embedded `MalgunGothic`/`MalgunGothicBold` Unicode 매핑, 한글 제목/본문 `pdftotext` 추출, 문서 UI 없음 | **짧은 문서 부분 검증 PASS** |
| Windows Edge·긴 사용자 PDF·시각/키보드 | Edge 실제 PDF 없음; Windows 실 사용자 환경에서 가로/세로 큰 이미지·긴 캡션 2페이지 이상 확인 기록 없음 | **미검증** |

사용자가 대화에 제출한 PDF 원본은 **GitHub로 업로드하지 않았다**. 파일명과 형식 정보 외 실제 PDF 바이트는 점검 보고에 포함하지 않는다. 21개 수동 항목의 **전체 수용**은 아직 아니다. Chrome PDF의 한글 복사/선택 동작은 `pdftotext` 및 embedded Unicode font로 기술적 가능성을 확인했으며, 사용자 뷰어에서 직접 선택·복사한 결과는 수령하지 않았다.

## 3. 이번에 발견해 수정한 CI 신뢰성 문제

### 문제
기존 `.github/workflows/ci.yml`은 Chrome 실행파일이 없으면:

```sh
echo "::warning::Chrome unavailable; browser checks not executed"
exit 0
```

으로 종료해 **실제 Chrome/PDF 검사를 수행하지 않았는데도 CI 전체가 success로 보일 가능성**이 있었다. 브라우저 테스트가 필수라는 완료 기준과 맞지 않는다.

### 변경
- feature 코드 SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`
- Chrome 미설치시 `::error::Chrome unavailable; required browser/PDF regression tests cannot run`을 남기고 **`exit 1`로 실패**하게 수정.
- CI 테스트 경로에는 STEP1 PDF 15p, STEP2 이미지·IndexedDB 실패/복구·긴 캡션·멀티탭·cold migration·실제 JSON 프로필간 가져오기 전수가 유지됨.

### 실행 결과
- [Actions #39148544554](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39148544554) **SUCCESS** (SHA `6708ce28ebe7781e7f282443ab20295e139e4ad3`).
- Node `npm test`: **16/16 PASS**, `npm run build`: PASS.
- 브라우저 실행 로그: `Chrome: /usr/bin/google-chrome`; STEP1 Chrome A4 15페이지와 전체 STEP2 저장·이미지·JSON·인쇄·2탭·v1 migration 강제 abort·프로필 A→B JSON 이식 스모크 모두 **실제 Chrome에서 PASS**.
- 비기능성 알려진 경고: 테스트 전용 임시 Chrome 프로필 폴더 정리에 `ENOTEMPTY` 경고가 간헐적으로 발생. 테스트 데이터는 ephemeral runner의 합성 데이터이며 앱 저장실패로 간주하지 않는다.
- 이번 코드 변경은 CI YAML 1개만. React 앱/사용자 저장소 로직, 기존 STEP1 원본 데이터는 변경하지 않았다.

## 4. 병합 전 남은 게이트

1. **검수 결과 분리:** 사용자의 Windows Chrome 단일 PDF 일부 검증은 반영. Windows Edge 실제 PDF, 큰 이미지와 긴 캡션의 Windows 2페이지 이상 시각/선택 검증, 작은 창·키보드 입력 등 미확인은 PASS로 올리지 말 것. 원본 §16 체크리스트는 `docs/STEP2_WINDOWS_ACCEPTANCE_AND_MERGE_GATE_2026-10-19.md`.
2. **Git 분기 처리:** `main`의 최신 `HANDOFF.md`/`STATUS.md` 내용을 누락하지 않도록 병합 계획 수립. 실제 merge 충돌 여부와 merge 결과 GitHub Actions는 병합 시점에만 확정.
3. **수용/승인:** 사용자 명시적 병합 승인 전에는 `main` 코드를 병합하지 않는다. Windows/Edge 제한을 수용할지 추가 수동 검증할지는 별도 결정.
4. **STEP 3:** PDF 기존 파일 가져오기 단계는 STEP2 최종 수용 후 착수. 현재 미착수.

## 5. 현재 진행률/다음 단위

- STEP2 기능 구현·Linux Chrome 자동 검증 **약 97~98%** (비공식 추정); 전체 7단계를 동일 비중으로 단순 환산 **약 28~29%**. CI 검증 강화·문서 검수로 유의미한 5%p 상승 없음.
- **다음**: 사용자가 제출한 실제 Windows Chrome PDF의 부분 PASS를 수용표와 연결하고, 남은 Edge·큰 이미지/장문·키보드 항목에 대한 최소 승인 범위를 확인. 결함이 없고 명시적 승인 시 main 병합 후 새 main Actions를 검증한다. 새로운 기능 개발이나 main 병합은 현재 작업에서 하지 않는다.
