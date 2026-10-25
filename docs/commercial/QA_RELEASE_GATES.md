# 상용 Astra 품질 검증·판매 GO/NO-GO

2026-10-25 | 이 문서는 테스트 완료 보고서가 아니라 **통과해야 할 조건**이다.

> **일정 개정:** 2026-10-25 사용자 지시에 따라 **3일 내부 MVP → 이후 심화 검수 → 유료판매** 순서로 변경. 아래 Gate 0~5는 **판매 전 최종 게이트**이며 **72시간 내부 MVP 완료 조건이 아님**. 단, 원본 불변·데이터 미전송·원문 미승인 변경 금지·최소 import/export smoke는 MVP 도중 필수. 상세 [MVP 계획](EXECUTION_PLAN.md).


## 테스트 0: 증거와 샘플 출처
- 30개 이상 테스트 픽스처 목표(한글·영문 단락, 긴 URL, 다페이지, 2종 이미지, 간단 표, 다단, 스캔, 암호, 벡터/마스크, 폰트 누락, 엑셀 PDF, PowerPoint PDF, 결합문서, 중복 텍스트·회전, 혼합 파일).
- 실제 동의받은 사용자 PDF 5~10개를 **고객 로컬 PC에서만** 테스트. 공개 CI·PR에 미업로드. 고객 문서 결과도 프라이빗 처리.
- '지원됨 / 경고 후 수동 조정 / 미지원(거부)' 분류표 제공, 수용 범위를 상품 설명에 그대로 사용.

## Gate 1 — 원문 정확성 (P0 BLOCKER)
- 지원 텍스트 중심 PDF 샘플에 대해 **수치·금액·단위·날짜·부정·문장 핵심 누락·중복 0건 허용**. 자동으로 완전 검증 못 하는 텍스트는 고객 검수 필요 표시.
- 고객이 수정 승인 안 한 문장은 변경 0. SOURCE 해시 불변, user edit/rewrite source anchor 연결.
- 이미지 카운트 및 실제 PDF raster 존재 검증; 클리핑/벡터/마스크는 100% 복원이라고 주장하지 않고 별도 경고/검수.
- 미지원 블록을 '성공'으로 표시하는 false-pass 0 목표. 누락을 알고도 조용히 출력하면 NO-GO.

## Gate 2 — 실PDF/스타일 (P0 BLOCKER)
- 8 BASIC 템플릿은 A4 실제 PDF가 서로 다른 조판으로 출력돼야 하며, 이미지·장문·한글 폰트 텍스트 선택 및 최종 줄까지 비교.
- 원문 페이지 수/화면 픽셀 동일 요구는 아님. 원본/결과 비교 UI가 같은 블록 위치로 이동.
- 텍스트 overflow, 이미지 가림, 문단 잘림 0, 대체 폰트 표시·오탈자 자동변경 0.
- PRO 20/BUSINESS 30은 실제 기능이 있는 경우에만 광고/가격 공개.

## Gate 3 — 로컬 윤문 (P0 BLOCKER)
- 실파일 오프라인, **외부 AI API 호출 0**. 모델 패키지 없는 경우 '정밀 윤문 미설치'를 분명히 표시하고 안전한 규칙 검사만 제공.
- 충분한 한국어 golden samples (제안 100문단 이상)로 전후 Diff, 사실/수치/이름·부정/서법/인용·법률/표 예외. 적어도 critical 의미변경이 UI에서 승인 없이 적용되는 건수 0.
- 누락/환각/결과 지연·취소·OOM/종료 시 원문 보존 및 실행 오류 고지.
- CPU-only Windows 낮은 사양(8GB/16GB), 설치 패키지 크기·추론시간·메모리 실측. 검증 전 권장사양/성능 약속 금지.

## Gate 4 — 데이터 무결성·보안
- 기존 STEP1 localStorage v1, STEP2 IndexedDB v2, 프로젝트 JSON export/import, 이미지 데이터 보존.
- 읽는 중 취소/디스크 풀/파일 쓰기 취소/충돌/OS 재시작/장문 등 유실 0, 원본 never overwrite.
- Electron contextIsolation/sandbox/IPC whitelist, 외부 HTTP 차단, 인젝션·파일경로 격리, 악성 PDF/과대 이미지 메모리 제한.
- Windows NSIS 재설치/두 버전 업그레이드에서 **실제 새 스키마 사용 데이터** 보존 테스트 (기존 PR4 버전번호만 다른 동일 코드 검증과 구별).
- 설치·제거·시작메뉴·바탕화면·저장창·파일명·한글 폰트 검수. SmartScreen/서명 정책 명확 고지.

## Gate 5 — 상품·계약
- 외부 저작권: `im-not-ai` MIT 원저작권/고지 포함; PDF.js/Electron/Node/모델/런타임 라이선스·상업적 재배포 허용 근거 보관.
- Windows installer and model package downloaded from official location; SHA256 checksum. 바이너리·서명/악성코드 검사.
- Basic/Pro/Business 30/60/90 기능·라이선스 범위·파일 크기/페이지·모델 설치 요구·PC 사양·업데이트/환불/지원정책 일치. 구매자 onboarding 포함.
- 실제 앱 화면과 실제 파일을 사용한 판매 이미지. 컨셉 이미지를 실제 작동 화면으로 속이지 않는다.

## P0 테스트 명령 예시 (실제 사용 전 확인)
```sh
npm install
npm test
npm run build
# feature Windows PR4에서만 확인된 scripts:
npm run desktop:verify
npm run desktop:package
```
- 상용화 브랜치에 기능이 없을 때 예시 명령을 PASS라고 쓰지 않는다. Windows CI/사용자 GUI는 별개.

## 출시 판정
- BASIC: Gate1~5와 BASIC 8개 템플릿·로컬 윤문이 **실제 통과한 뒤** 판매. PRO/BUSINESS는 별도 사용성/템플릿/배치·브랜딩 조건을 통과한 후 공개.
- 의도된 제약의 매뉴얼 고지가 불가하거나 핵심 사용성 실패 시 **NO-GO**.
- 개인 사양 문제를 모델없이 규칙 검사로만 대체했다면 **'정밀 AI 윤문 포함' 광고 금지** 또는 설치·요건 해결 후 출시.
