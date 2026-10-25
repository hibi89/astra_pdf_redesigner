# M07-B — 8종 BASIC 실제 PDF 출력 검증 (2026-10-26 KST)

## 기준
- 코드 SHA: `ed9061b0e7878d06e9b36518df9a5fe68c4ea3a7` (`integration/astra-commercial-core`)
- Linux [Chrome+Edge workflow #40213371605](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40213371605): **SUCCESS 2/2**. Node **61 PASS / 0 FAIL**, TypeScript/Vite build PASS.
- Windows [NSIS workflow #40213371499](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40213371499): **SUCCESS**. Node 61/61, installed Electron STEP3→native A4, STEP2 IDB and PNG, NSIS installer removal and 0.1.0→0.1.1 upgrade PASS.

## 실제 출력 8종
합성 2p 원본 문서와 PNG에서 각 디자인을 실제 브라우저 `Page.printToPDF` 출력. PDF.js 및 Poppler `pdfinfo`/`pdftotext -bbox`로 검사했다.

| ID | 한국어 이름 | Chrome 제목 xMin/yMin (pt) | Edge 제목 xMin/yMin (pt) | Chrome 출력 페이지 |
|---|---|---|---|---:|
| `report` | 깔끔한 보고서 | 45.00 / 235.95 | 45.00 / 246.86 | 1 |
| `minimal` | 미니멀 노트 | 45.00 / 265.20 | 45.00 / 276.11 | 2 |
| `diary` | 학습 다이어리 | 62.75 / 253.20 | 62.75 / 264.11 | 1 |
| `compact` | 컴팩트 리포트 | 45.00 / 176.70 | 45.00 / 186.86 | 1 |
| `editorial` | 에디토리얼 | 113.03 / 343.95 | 113.03 / 354.11 | 2 |
| `ledger` | 장부형 요약 | 76.17 / 185.70 | 76.17 / 195.86 | 1 |
| `brief` | 이그제큐티브 브리프 | 120.95 / 292.20 | 120.95 / 302.36 | 1 |
| `folio` | 매거진 폴리오 | 124.36 / 322.20 | 124.36 / 333.56 | 2 |

각 파일의 **A4 페이지 크기, 3/3 원문 텍스트 표식 정확한 순서, PNG 래스터 1개 및 제목 A4 안쪽 bbox 모두 PASS**. 모든 디자인 제목의 x/y/폭 3pt 단위 서명이 서로 달랐다(색상만 다른 출력 아님). 실제 한국어 서체 차이로 Chrome/Edge 제목 y값은 서로 다르며 같은 픽셀 출력 보장은 아니다.

## 구현
- `src/types.ts`: ThemeId 8종, STEP1의 기존 3개 화면 테마 리스트는 변경하지 않음.
- `src/step2/model.ts`: V2 validation 8종 허용, 임의 문자열은 계속 거부. DB schema 변경 없음.
- `src/step2/Workspace.tsx`: 새로운 2개 라디오 선택지, 제목 eyebrow, 원본/내용 그대로 유지.
- `src/styles.css`: `brief` 삽입형 대제목 + 번호형 문단; `folio` 우측 serif 대제목 + 편집형 섹션. 인쇄와 화면 모두 반영.
- `tests/step2-model.test.ts`, `tests/step3-browser.mjs`: 8개 V2 유효성 및 정확한 8개 출력 구조 검증.

## 검증 범위와 판매 판정
- **내부 합성 BASIC 디자인 목표 8/8 DONE.** 전체 제품의 8/20/30 SKU 분기, 유료 판매 승인, 실제 고객 PDF·일반 Windows 8/16GB 컴퓨터, 깨진 이미지·복잡 표·OCR·특수 글꼴 및 완전한 내용 누락 검수는 입증하지 않았다.
- Windows installer CI는 기존 import/native A4/export/persistence를 실행했지만, 8가지 디자인을 **각각 설치판 Windows에서 출력**하지 않았다.
- 진짜 오프라인 한국어 LLM은 모델/런타임 없이 비활성 상태. 모델 다운로드·라이선스·CPU 실측은 사용자 별도 승인 전 BLOCKED. 윤문 기능 완성 및 3개 SKU 광고 금지; **판매 NO-GO**.
- `main`, 원본 PR #3/#4, 사용자 데이터/설계 원본 불변; Draft PR #9 미병합.
- **NEXT M08-A READY:** Windows NSIS 설치판에서 여덟 디자인을 직접 하나씩 출력·구조 검증하여 브라우저/설치판 차이를 줄임. 별도 실제 사용자 문서/기기 검증을 그 후 수행.
