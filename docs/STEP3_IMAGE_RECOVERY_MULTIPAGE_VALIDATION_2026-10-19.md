# STEP 3 — 로컬 PDF 이미지 복원·누락 감지·다페이지 읽기 순서 검증 (2026-10-19)

> **판정:** 지원 범위 내 이미지 디코딩 → PNG 복원 → 새 IndexedDB 문서 → A4 PDF 포함 **Chrome·Edge 자동 회귀 PASS**. 사용자 실제 PDF 5~10개 대조 및 Windows 수동 수용 **NOT RUN**, STEP3 전체 완료가 아님. `main` 기능 코드는 변경하지 않음.

## 실제 증거
- 기능/테스트 검증 SHA: `53c56e47a10606e381d4f5593695b7ca11bc7733`.
- [GitHub Actions #39162038601](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/39162038601) **SUCCESS**, 두 작업 `build-and-test`, `Microsoft Edge A4 PDF and IndexedDB` 모두 성공.
- 단위 테스트 **26 PASS / 0 FAIL**; TypeScript+Vite build PASS; 기존 STEP1·STEP2 Chrome/Edge PDF·IndexedDB, Web Locks 2탭, V1 migration 강제 abort/복구, 프로젝트 JSON A→B 실제 이식 회귀 PASS.
- 실제 Chrome와 Linux Microsoft Edge 각각: **2페이지 PDF 자동 생성 + 컬러 래스터 이미지 포함** → 이미지 XObject 감지 **1건** → 브라우저 PDF.js에서 디코딩한 픽셀을 **PNG로 재구성 1건 / 미복원 0건** → 원본 PDF/이미지 미리보기 및 추출 블록 표시 → 확인 전 기존 문서함·활성 문서 유지 → 별도 문서와 이미지의 IndexedDB 원자적 저장 → 테마 변경 → 새로고침 복원 → A4 PDF 출력 **실제 `pdfimages -list`에 이미지 존재** 및 `pdftotext` 텍스트 첫/둘째 페이지 마커 읽기 순서 보존 PASS.
- Actions 검증 문구 `PASS STEP3 MULTIPAGE/IMAGE REVIEW`, `PASS STEP3 IMPORT`, `PASS STEP3 MULTIPAGE/IMAGE REPRINT`를 실제 Chrome·Edge 각각 로그에서 확인.

## 구현 방식 (PDF.js / 사용자의 로컬 브라우저)
| 파일 | 구현 |
|---|---|
| `src/step3/imageRecovery.ts` | PDF.js operator list의 `save/restore/transform` 행렬 추적, PDF viewport 기준 이미지 위치 추정, 일반 `paintImageXObject` 및 지원 가능한 inline bitmap 디코딩, PDF.js 픽셀 데이터→PNG 생성. 마스크·그룹/반복 이미지·회전·잘못된 위치·데이터 없음은 **개수와 실패 사유**로 처리. 이미지 원본 암호화/바이너리 추출이라고 주장하지 않음. |
| `src/step3/pdf.ts` | 페이지별 operator list 감지 및 `recoverPageImages` 연결, 원본 PDF bytes는 메모리 처리 후 폐기. |
| `src/step3/structure.ts` | 페이지 순서(1부터 연속 여부) 검사, 문자 정렬과 다단 의심 휴리스틱 경고, 페이지별 **감지/복원/미복원 개수**·원본 bbox 기록. |
| `src/step3/ImportPanel.tsx` | 복원 PNG 미리보기, 복원 개수·누락 개수, 이미지 개별 **새 문서 포함/제외** 선택, 미지원 그래픽과 색상·마스크·배치 차이에 대한 설명, 원본 대조 후 명시 확인. Blob URL 정리. |
| `src/step3/convert.ts` | 선택한 이미지만 새 V2 문서의 이미지 블록으로 변환, 원본 y 위치를 토대로 근사 삽입, PDF 출처 메타데이터 및 복원 PNG Blob/assetId 연결. |
| `src/step2/model.ts`, `useWorkspace.ts` | 기존 `schemaVersion=2` 유지, 이미지 블록에 출처 좌표 선택 저장, **문서+복원 이미지+활성 ID를 단일 IndexedDB 트랜잭션**에 저장. 실패 시 기존 원본 변경 금지. |
| `tests/step3-image-recovery.test.ts` | 이미지 CTM·원본 좌표, 미지원 마스크·회전, 선택한 PNG만 Asset으로 변환, 페이지 1→3 순서, 의심 다단 경고의 5가지 추가 단위 테스트. |
| `tests/step3-browser.mjs` | 텍스트만 1페이지 fixture를 **이미지 포함 2페이지 fixture**로 강화; 이미지 복원 썸네일/카운트·중간 DB 불변·저장/리로드·최종 PDF 이미지 raster + 텍스트 순서 검증. |

## 안전성 / 잔여 한계
- **원본 JPEG/PNG 파일 byte-for-byte 추출이 아님.** PDF.js에서 디코딩한 이미지 픽셀을 PNG로 다시 인코딩한다. PDF 마스크·클리핑·회전·투명도·출력 색상/폰트 등은 같다고 보장하지 않으며 원본 PDF 육안 대조를 요구한다.
- **일반 XObject·지원 가능한 inline 이미지만** 복원한다. 마스크, 이미지 반복/그룹, 기울기·회전, 모호한 오브젝트, 지원하지 않는 픽셀 데이터는 **해당 페이지의 미복원 수 + 이유**로 표시한다. PDF의 임의 그래픽·벡터 그림이나 표 전체 복원 보장 없음.
- **이미지 수·크기 제한:** 복원 1페이지당 최대 15개, 이미지 1개당 10MiB PNG / 2,000만 픽셀, 새 문서에 선택한 이미지 최대 60개 / 총 70MiB. 대형/빈번한 이미지 PDF는 경고·일부 누락 또는 가져오기 실패 가능. 실제 여러 이미지/고용량 실물 PDF 부하 검증은 미완료.
- 이미지 블록을 PDF 출처 **y 좌표 근처에 삽입**하되 기존 본문 블록 수동 재정렬을 임의로 재수정하지 않는다. 도형/캡션 연계·읽기 순서/영역 분리의 의미상 정확도를 보장하지 않는다.
- 단일 열에서 문자 순서와 2페이지 경계 보존이 테스트됐다. 정밀 다단·표·회전 문서 읽기 순서와 이미지 크롭/클리핑 차이는 미검증.
- **사용자 실제 단순 PDF 5~10개** 원본과 새 PDF를 대조하는 수용 검사 미완료, Windows Chrome/Edge 실제 육안 검사 미완료. STEP2의 이전 Windows Edge 장문/이미지 출력 육안 체크리스트 역시 미완료 유지.
- 스캔 PDF OCR, 무조건적인 PDF 완전 복원, 원본 레이아웃 동일성, 외부 AI/검색·파일 업로드는 이번 범위 아님.
- PDF 임시 원본·복원 이미지는 브라우저 로컬에서만 처리하며 업로드/로그 출력하지 않는다. 실제 사용자 PDF·텍스트를 공개 GitHub 저장소에 올리지 않는다.
- 앞선 중간 CI에서 발생한 테스트 기대문구 불일치, PDF.js `Uint8ClampedArray` 타입 불일치, 이미지 체크박스/최종 확인 선택자 혼동, reload 직후 상태 대기 경쟁은 각각 수정했으며 **성공한 #39162038601 검증 상태**만 현재 PASS로 표시한다.

## 현재 상태 / 인수
- 기능 브랜치: `feature/step3-pdf-import-20261019`; [Draft PR #3](https://github.com/hibi89/astra_pdf_redesigner/pull/3). **실제 main 병합 없음**.
- STEP3 추정 진행률: **약 65~70%** (실제 텍스트·이미지 단순 문서 자동 검증 기반 비공식); 7단계 동등비중 전체 약 **38%** (STEP1 100%, STEP2 기술적 약 99%, STEP3 약 65~70%, STEP4~7 0). 실사용 정확도·사업 품질·남은 작업 시간과는 다르다.
- **다음 작업:** 혼합 페이지·여러 이미지·벡터 마스크/오류 사례를 늘려서 누락 카운트 검증하고, 실제 PDF 5~10개 대조표 및 Windows 수동 검수 진행. PR #3 Draft 유지, 사용자 승인/추가 수용 게이트 전 `main` 병합 금지.
