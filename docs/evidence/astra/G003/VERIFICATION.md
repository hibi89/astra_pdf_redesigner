# G003 — Codex C001/P124 독립 코드 검수 (2026-11-15 KST)

## 범위·SHA
- 리뷰어 브랜치: `gpt/astra-final-qa-ocr-20261115`.
- **고정 검수 대상**: Codex `codex/astra-final-ai-sku-20261115@6e8b2eeb381874a12be041fa080fb545b5e1fb82`, Draft [PR #13](https://github.com/hibi89/astra_pdf_redesigner/pull/13).
- 통합 대상: `integration/astra-final-blueprint-100-20261115@bfef5474f7032b34eb945b38adc2c3d995c2a049`.
- 리뷰는 **코드 정적 감사**와 독립 GitHub Actions 읽기전용 checkout만 수행. Codex 파일 수정이나 브랜치/통합 병합 없음.

## 판정 및 재현
**REVIEW REQUIRED**, C001/P124 완료 승인 **보류 +0**. 12영역 잠정 64/100, 공식 UNASSESSED, RELEASE HOLD 유지. 참고: Codex P124 Windows 실모델 Actions [#43683050524](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683050524)는 본 정적 검수 시점 **in_progress**; 성공·실 모델 30개 제안·설치 후보 성공을 단정하지 않았다. Codex 기본 Linux React/browser CI [#43683050533](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683050533) SUCCESS, policy [#43683050935](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683050935) SUCCESS는 구분.

독립 리뷰 코드 `tools/gpt-final-qa-p124-review.cjs`와 6개 합성 정적 감사 회귀 `tests/gpt-final-qa-p124-review.test.cjs` 구현. GPT exact-SHA `d9a67d912cb1801cc105a986e95484affcad914d`의 [QA run #43683705344](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683705344) **44 PASS / 0 FAIL / 0 SKIP**, 기존 OCR release-hold PASS, **G003 read-only pinned Codex checkout job SUCCESS**; [final policy #43683705531](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43683705531) SUCCESS.

## 실제 코드에 근거한 변경 필요 사항

### G003-F01 · 테스트 전용 SKU 선택기 ≠ 판매용 SKU 권한 E2E
`tests/fixtures/p124-electron-qwen3.jsx:92-113`는 합성 UI `useState('BASIC')`와 `<select data-p124-sku>`로 라벨만 바꾸고 `LocalModelReview disabled={false}`를 직접 호출한다. 판매용 `Workspace.tsx`의 `CommercialLicensePanel`, `runSkuGatedAction`, 실제 문서별 SKU/권한 흐름을 통한 호출을 재현하지 않는다. 따라서 이 테스트는 **공통 LocalModelReview 컴포넌트를 Windows Electron preload+IPC 아래서 3개 라벨로 시연**한 증거이지, 3개 실제 SKU의 전체 사용자 GUI/Entitlement E2E 검증이 아니다.

**Codex 조치 요청:** 실제 Workspace/CommercialLicensePanel에서 BASIC/PRO/BUSINESS 권한(임시 서명 키만 사용)별 로컬 추론·승인/거절/Undo/출력·저장 검증을 별도로 추가하거나 기존 증거를 범위에 맞게 좁혀 서술. 프로덕션 issuer·customer flag 활성화 금지.

### G003-F02 · 시험용 Electron 소스가 릴리스 파일 선택 규칙에 포함
`desktop/main.cjs:27`은 `p124-electron-qwen3-acceptance.cjs`를 정적으로 로드한다. `electron-builder.yml`은 `desktop/**` 전체를 배포 입력으로 지정한다. `.github/workflows/p124-windows-qwen3-electron.yml`이 `dist/tests/fixtures/p124-electron-qwen3.html` 유입만 검사하므로 **시험용 JS 모듈이 app.asar에 포함될 가능성**은 별도 검수 없이 해소되지 않는다.

**Codex 조치 요청:** 설치 후보의 실제 ASAR contents 검사 또는 승인된 안전한 exclusion 구조로 시험 전용 JS와 test payload가 고객 번들에 포함되지 않음을 실증. 단순 Vite HTML 부재는 desktop JS 제외 근거가 아님. 이 문제는 제품 OCR/모델 출시 여부와 별개.

### G003-F03 · 인수 범위
`desktop/p124-electron-qwen3-acceptance.cjs:185-247`는 고정 합성 문단에 대한 실제 모델 생성 제안 최소 10건/SKU, 명시 승인·Undo·거부·취소, 마지막 출력 PDF 원문 텍스트 동등을 검사하도록 설계됐다. **코드 존재와 실행 성공은 다르다**. 실제 고객 문서 5~10개·30종 디자인 육안·물리 Win10/11·상용 모델/폰트/OCR 재배포·법적 출시 수용은 별도. 기존 회사 고객 문서나 원본 PDF 업로드 지시 금지.

## 긍정 설계 확인 / 미검증 분리
- 실제 코드에 GitHub release 모델 파트 SHA와 결합 SHA·Windows Ollama SHA pin, localhost `127.0.0.1`·`OLLAMA_NO_CLOUD=1`, 명시동의·실패 시 원문 차단, CI 전용 독립 프로필, 제품 fixture HTML 제외 검사 존재.
- 실제 `healthy`, `missing`, `tampered` 실행은 **Codex exact-SHA job 결론과 report artifact** 확인 후 별도 검증한다.
- 제품 교차 변경은 owner 승인/독립 PR 통합 절차를 따른다. 승인 전 신규 점수 +0, PR #13 검수 대기.

### 다음
1. Codex가 F01/F02 수정 후 새 SHA 제출하면 독립 CODE/Windows CI 비교 및 G003 재검증. 체크아웃 SHA pin을 최신 검증된 SHA로 재조정하며 전체 시험 녹색 전 가점 없음.
2. Codex가 실행 중일 동안 G004의 비공개 원본 PDF 5~10건/물리 Windows 10/11 수용 프로토콜·익명 요약 도구를 별도 개발.
