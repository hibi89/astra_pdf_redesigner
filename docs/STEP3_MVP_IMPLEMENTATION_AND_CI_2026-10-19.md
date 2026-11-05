# STEP 3 PDF 가져오기 — MVP 구현 및 실제 Chrome·Edge 검증 (2026-10-19)

> **판정: 첫 번째 세로형 MVP 자동 검증 PASS / STEP 3 최종 수용 및 실제 사용자 문서 검수 NOT DONE / main 미병합.**
>
> 기준 브랜치: `feature/step3-pdf-import-20261019`. 검증된 코드 SHA `e216866a592362342ac6dd2ca2105b71799cc8fc`, [GitHub Actions #39159350165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39159350165) SUCCESS (Chrome/Edge 두 job).

## 1. 구현 항목

| 영역 | 코드 | 결과 |
|---|---|---|
| 업로드 검증 | `src/step3/pdf.ts` | `.pdf` 파일, `%PDF-` 매직헤더, 30MiB / 50페이지 제한. 로컬 File만 읽음. 암호 PDF 거부·명시 경고 |
| PDF.js 추출 | `src/step3/pdf.ts` | Mozilla `pdfjs-dist 6.4.299` 고정, 동일 패키지 내 worker 번들. `TextItem` 문자열·변환된 좌표·글자 크기 추출, 선택 불가능한 빈 PDF 거부 |
| 읽기 순서·분류 | `src/step3/structure.ts` | 단일 열 기준 y/x 정렬·추정 줄/문단 그룹, 제목·본문·캡션 추정, 원본 페이지/좌표 기록 |
| 위험 표시 | `src/step3/structure.ts`, `pdf.ts` | 빈 페이지, 넓은 열 간격, 이미지 PDF 연산자 감지 시 복원 불가 위험·수동 확인 경고. 완전 복원 주장 금지 |
| 원본 대조 | `src/step3/ImportPanel.tsx` | 임시 Blob URL 원본 PDF 뷰어, 추출 텍스트, 원본 페이지 번호/좌표, 블록 타입 변경, 순서 ↑↓, 문장 수동 수정·명시 확인 체크박스 |
| 기존 편집기 연동 | `src/step3/convert.ts`, `src/step2/{model,useWorkspace,Workspace}.tsx` | 신규 문서를 IndexedDB 단일 transaction으로 추가. **확정 전 쓰기 0**. 기존 V1/STEP2 원본·활성 문서 보호, 선택 출처 `origin` 저장, 캡션 종류 추가, STEP2 테마/재출력 재사용 |
| 데이터 호환 | `src/step2/model.ts` | 기존 `schemaVersion=2` 유지. origin은 선택 필드이며 유효성 검사, 기존 문서는 그대로 로드 |
| 라이선스 | `package.json`, 원본 npm 패키지 | `pdfjs-dist:6.4.299`, **Apache-2.0**. PyMuPDF/로컬 Python 서버/OCR 미도입 |

## 2. 실제 자동 테스트 증거

- 첫 실행 [Actions #39159179631](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39159179631): 단위 **21/21 PASS**, Edge 전체 E2E PASS였으나 TypeScript 빌드에서 PDF.js v6 API 타입 차이 3건으로 **전체 실패**. 오류 수정으로 성공 처리하지 않음.
- 수정 커밋 후 [Actions #39159350165](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39159350165) **SUCCESS**, 정확히 `e216866a592362342ac6dd2ca2105b71799cc8fc`.
- `build-and-test`: **21 PASS / 0 FAIL**, `npm run build` PASS, Chrome STEP1 A4 15p·STEP2 이미지/저장·2탭 Web Locks·V1 migration abort/재시도·cross-profile JSON 원본 이미지 이식 PASS.
- **실제 Chrome STEP3 E2E**: Chrome CDP `Page.printToPDF`로 문자가 선택 가능한 합성 PDF 생성 → file input에 실제 PDF bytes 투입 → PDF.js 텍스트·좌표 추출 및 Blob URL 원본 대조 확인 → 확정 전 기존 문서함 count·활성 원본 불변 확인 → 명시적 확인 체크박스 후 새 문서 생성 → STEP2 테마 적용·새로고침 저장 복원 → A4 PDF 출력의 텍스트 시작/끝 마커 보존 **PASS**.
- **실제 Linux Microsoft Edge STEP3 E2E**도 별도 Ubuntu runner에서 동일 흐름 **PASS**.
- OCR/스캔 거부, 이미지 존재와 멀티컬럼 경고, source bbox 유효성, 한글/숫자/특수문자 보존 등 순수 함수 단위 테스트 5건 추가.
- `main`의 테스트·코드를 수정하거나 병합하지 않았다.

## 3. 미구현·미검증 (STEP 3을 완료 처리하지 않는 이유)

- [ ] **사용자 실제 간단한 PDF 5~10개**를 대상으로 원본 텍스트·읽기순서·이미지·문단 단위 수동 검수(원본 로드맵의 완료 기준). synthetic CI 자료로 대체할 수 없음.
- [ ] PDF 안 이미지 원본을 실제 `ImageAsset`으로 추출·복원하는 기능. 현재 이미지 존재 위험 **감지+경고**까지만 구현. 필요 시 안전한 이미지 추출·재삽입 방식을 검증.
- [ ] **선택 불가능한 스캔 PDF OCR**: STEP 3 범위 제외. 수동 원본 확인 필요.
- [ ] 복잡한 표·다단·회전 텍스트의 정확한 읽기 순서와 구조 보존. 실제 지원을 약속하지 않음.
- [ ] PDF 원문과 새로운 블록 문자·줄바꿈의 정밀 대조, 표·도형·캡션 누락 탐지 확장.
- [ ] Windows Chrome/Edge 실제 PDF 업로드·원본 뷰어·수정·새 A4 저장 실사용 검증. Linux CI 성공만 확인.
- [ ] STEP2에서 미완료였던 Windows Edge 실물 PDF·장문/이미지 육안·키보드/작은 창 검수도 별도 미완료 유지.
- [ ] 최신 feature에서의 PR/병합 검증 및 `main` 병합 승인. **main은 STEP2 안정 버전 그대로 둔다.**

## 4. 다음 개발 단위

1. 동일 PDF에서 원본 대비 추출 텍스트 누락·읽기 순서의 **검증 가능한 검사 지표/도구** 추가 (합성 다페이지·PDF 이미지 감지·스캔 혼합 문서).
2. 지원 가능한 PDF 이미지 추출 방식을 조사·검증하고, 고위험/미지원 이미지는 자동 복원했다고 선언하지 않도록 사용자 승인/경고 강화.
3. 실제 사용자 PDF 5~10개를 로컬 파일로 준비한 뒤 **원본/추출 대조표** 기록(저장소에는 원본 PDF·민감 텍스트 미게시).
4. STEP3 PR은 Draft로 보관하며 명시적 승인·회귀 및 실제 파일 검증 전에는 `main`에 병합하지 않는다.

## 5. 진척도(비공식)
- STEP1 **100%**, STEP2 구현·자동검증 **약 99%**(Windows 실물 육안 미완료), STEP3 **약 45~50%**(세로형 MVP 구현 및 자동 검증, 이미지/실문서 검수 미완료), STEP4~7 **0%**.
- 전체 7단계 동등비중 단순 추정 **약 35%**. 실제 남은 작업시간이나 상품 품질을 나타내지 않는다.


## 2026-10-19 후속 STEP3 이미지 복원·다페이지 스모크 추가

앞선 §3의 “PDF 안 이미지 원본을 실제 ImageAsset으로 추출·복원하는 기능 미구현”은 **최초 텍스트 중심 MVP 당시 상태**를 기록한 것이다. 후속 코드에서는 일반 PDF.js 디코딩 이미지에 한해 **PNG 재구성→ImageAsset→별도 V2 문서 저장**을 구현했으며, original encoded image byte preservation이나 모든 유형의 이미지 복원은 아니다.

- 확인된 기능 SHA `53c56e47a10606e381d4f5593695b7ca11bc7733`; [Actions #39162038601](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39162038601) **SUCCESS**, Chrome·Edge **양쪽 성공**, Node **26/26**, TypeScript build PASS.
- 2페이지 PDF+컬러 이미지(Chrome/Edge 각각 합성)를 PDF.js로 읽어 이미지 1건 감지/PNG 1건 복원/미복원0, 원본 비교 UI·사용자 이미지 포함 선택·확정 전 DB 불변, 별도 문서 원자 저장·새로고침·실제 A4 PDF 이미지 embedded/텍스트 페이지 마커 순서 PASS.
- 마스크/기울기/그룹·반복 XObject, 회전/복잡표/다단/OCR/페이지 클립 등의 미지원은 경고·미복원 항목이다. 사용자 실제 PDF 5~10개, Windows 육안 검수 **NOT RUN**.
- 상세 [STEP3 이미지·다페이지 검증](STEP3_IMAGE_RECOVERY_MULTIPAGE_VALIDATION_2026-10-19.md).
- 비공식 추정 STEP3 약 **65~70%**, 7단계 전체 약 **38%**(동등 비중). STEP3 전체 수용·main 병합 승인 아님.
