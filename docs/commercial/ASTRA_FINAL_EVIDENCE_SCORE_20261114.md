# Astra PDF Redesigner — 12영역 최종설계 증거 기반 잠정 완성률

**기준일: 2026-11-14 KST · 기능 SHA `5ed3525947f0225888963806f95d8f821ca03394` · 잠정 42/100점 (42%).**
**공식 구매자 최종 수용률: UNASSESSED. 출시: RELEASE HOLD.**

## 산정 원칙

사용자가 확정한 A01~A12 12개 영역의 100점 배점 **그대로** 사용한다. 아래 1점 단위 부분 수용 분해는 사용자 승인된 배점의 변경이 아니라 **총괄이 제안하는 잠정 검증 체크포인트**다. 각 항목은 코드 실행 및 CI·합성 브라우저 검증 증거가 있는 기능에만 부분 점수를 부여한다. 정식 판매·원본 내용 품질·실 물리 PC·구매자 최종 승인은 CI로 대신하지 않는다.

이 표의 **잠정 42%는 공식 확정 수용률과 다르며, 내부 기술 85%/95%나 출시 준비도에 전용할 수 없다.** 사용자가 부분 배점·수용기준을 확정하고 미확인 사항을 직접 검수할 때 공식 값을 산정한다.

| 영역 | 사용자 확정 배점 | 이번 회차까지 잠정 인정 | 남은 점수 | 인정한 합성/코드·출력 증거 | 반드시 남은 수용 |
|---|---:|---:|---:|---|---|
| A01 회고록 입력·저장·A4 | 4 | 3 | 1 | STEP1 필드·V1 자동 저장·Chrome/Edge A4 출력 | 사용자 실제 회고록 인쇄 |
| A02 문서·이미지·V2 | 6 | 5 | 1 | STEP2 블록·이미지·IndexedDB V2/PNG·파일 복원·NSIS 업그레이드 | 구매자 물리 PC 복원 |
| A03 기존 PDF 가져오기·원문 대조 | 14 | 8 | 6 | PDF.js 원본 추출·수동 승인·텍스트/이미지 대조·암호/손상/스캔 경고·출력 합성 회귀 | 실제 표·다단·도형·누락·의미 정확도 확인 |
| A04 8/20/30 레이아웃·브랜드·다중 PDF | 15 | 10 | 5 | BASIC8 + PRO12 + BUSINESS10 시안 출력·브랜드·PRO 수동 큐·저장 시연 | 30종 완제품 품질·브랜드 일괄 적용·구매자 수용 |
| A05 로컬 디자인 참고·적용 | 5 | 3 | 2 | 이미지·PDF 로컬 색상/타이포 분석·비파괴 스타일 적용 | 실제 레퍼런스 품질 및 복원 |
| A06 온라인 레퍼런스 | 5 | 2 | 3 | 안전한 브라우저 검색 링크·URL/권리메모 로컬 기록 | 내장 검색 결과·출처 검증·STEP5 직접 연결 |
| A07 OCR·콘텐츠 안전·STEP7 | 12 | 3 | 9 | STEP7 PDF 대조·수동 검토·출시 OCR 차단 정책/검사 | 합법 공급처의 Tesseract 실제 한국어 OCR·표/스캔 정확도 |
| A08 한국어 로컬 AI 윤문 | 14 | 0 | 14 | 제어기 골격은 존재하지만 실 모델 추론 없음(0점) | 상업 재배포 가능한 GGUF/CPU 실제 동작·품질·비교·되돌림 |
| A09 라이선스·SKU·지원 | 11 | **5** | 6 | P96 서명 검증, P107 기능 매트릭스, P108 발급/연장, P109 GUI 실행 게이트, **P110 Electron PDF IPC main-frame/URL 검사** | 판매자 실제 공개키 pin·안전 발급/재발급/환불/철회·기기 수/오프라인 운영·same-frame IPC 우회·지원 약관 |
| A10 Windows 설치·복구 | 5 | 3 | 2 | CI Windows unsigned NSIS 설치·제거·업그레이드, A4/IndexedDB·PNG 보존 | 실 Win10/11 물리 설치·서명/SmartScreen |
| A11 허가 PDF 5~10건 검수 | 7 | 0 | 7 | 합성 도구는 존재하나 실제 사용자 승인 문서 0건 | 실제 허가 PDF 5~10건 독립 대조/육안 수용 |
| A12 판매·법적·최종 승인 | 2 | 0 | 2 | 상품 등록 초안만 존재 | 저작권·재배포권·크몽 등록·최종 구매자 승인 |
| **합계** | **100** | **42** | **58** | **잠정 증거 기반 구현·검증 점수** | **공식 수용 미완** |

## 증거 및 증분
- **P109 이전 기준:** 41/100 잠정 (A09 4/11). 정확 SHA `ee7ed4eaacf44a08800b56639d2178f5df76e7d3`, [Linux/Chrome/Edge](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625251) / [Windows](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625273) / [정본 정책](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43591625548) 3/3 SUCCESS.
- **P110 +1점:** `desktop/pdf-export-ipc-guard.cjs`에서 Electron main IPC 요청의 정확한 `astra://app/index.html` 상위 프레임과 창 생존 여부 확인, `desktop/main.cjs`의 native PDF 출력 전 강제. 가짜 창·cross-frame·다른 URL·query/port·파괴된 창 거부 6회귀 테스트를 `package.json` Node/desktop CI 두 경로에 추가.
- P110 정확 기능 SHA `5ed3525947f0225888963806f95d8f821ca03394`. [Linux Chrome/Edge #43593105358](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105358) **2/2 SUCCESS**, Node **247PASS/0FAIL/0SKIP**, Chrome·Edge 실 브라우저 합성 A4/V2 회귀 PASS. [Windows NSIS #43593105373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105373) SUCCESS, Node **246PASS/0FAIL/1 OS SKIP**, desktop **65PASS/0FAIL**, 실제 Electron 내부 시연 PDF·NSIS 0.1.0→0.1.1 V2/PNG 보존 PASS. [최종설계 정책 #43593105644](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43593105644) SUCCESS. **정확 SHA 3/3 SUCCESS**, 원시 job 로그까지 확인.
- 생산 `PRODUCTION_ISSUER_JWK=null`, 지문 pin null, `ASTRA_CUSTOMER_BUILD_ENABLED=false`, native customer mode false, OCR_MANIFEST=null. 상용 활성화/실고객 배포 불허.
- 같은 권한을 가진 정상 최상위 렌더러의 JS/직접 IPC 호출이나 재포장된 앱을 강력 DRM으로 막는 기술이 아니다. **고객용 상용 보안 완료를 주장하지 않는다.**

## 후속
P111에서 판매용 Electron main-process 서명 라이선스/콘텐츠 출력 강제 설계와 소스·바이너리 테스트, 가능한 범위의 로컬 OCR/AI 실제 공급자/CPU 검증. 현재 main, Draft PR #10, 사용자 원본 PDF/STEP1 V1/STEP2 V2/8+22 시연·중앙 타상품은 변경하지 않는다.
