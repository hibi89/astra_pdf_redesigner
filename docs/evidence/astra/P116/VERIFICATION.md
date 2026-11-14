# P116 검증서 — BASIC 8 / PRO 12 / BUSINESS 10 실제 A4 조판 회귀

**상태: VERIFIED · A04 +1점 · 누적 잠정 54→55/100**  
**저장소/브랜치:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`  
**검증 기능 SHA:** `b03583f12c5eb212dd0207fb539593ec7c2b8df3`  
**변경 파일:** `tests/step4-style-preset-browser.mjs`  
제품 컴포넌트와 레이아웃 데이터는 수정하지 않았다. 기존 30개 후보를 실제 PDF로 전수 검증하는 회귀를 추가했다. 데이터와 이미지는 전부 테스트 내 합성 자산이다.

## 검증 결과

| 환경 | 정확 SHA Actions | PASS / FAIL / SKIP |
|---|---|---|
| Ubuntu 26.04, Node 22, Chrome + Edge | [Linux #43618379958](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379958) | npm test 269/269, build PASS, Chrome 매트릭스 PASS, Edge 매트릭스 PASS |
| Windows hosted runner, Electron/NSIS | [Windows #43618379926](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618379926) | npm test 268 PASS / 0 FAIL / 1 Windows 전용 SKIP; desktop 73/73 PASS; 설치·실행·제거·0.1.0→0.1.1 업그레이드 PASS |
| Final blueprint evidence policy | [정본 정책 #43618380099](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618380099) | PASS |

각 워크플로의 `head_sha`는 모두 `b03583f12c5eb212dd0207fb539593ec7c2b8df3`다. 최종 Linux job 로그는 Chrome와 Edge 각각 `PASS P116 LAYOUT MATRIX`를 남긴다.

## 30개 PDF 결과

- BASIC: `report`, `minimal`, `diary`, `compact`, `editorial`, `ledger`, `brief`, `folio` — **8/8**.
- PRO: `pro-*` 12개 — **12/12**. BUSINESS: `business-*` 10개 — **10/10**.
- Chrome와 Edge 각각 30개 실제 `Page.printToPDF` 파일을 생성했다. 전부 A4이며 긴 테스트 본문은 2페이지 이상이었다.
- 시그니처는 팔레트 색상 없이 용지 여백·선행·제목 정렬/크기/여백/테두리·섹션 여백/패딩·본문 글자 크기와 PDF 글자 상자의 실제 좌표를 결합한다. 결과 **30/30 구조 시그니처가 서로 달랐다**.
- 모든 출력에서 `P116_TEXT_BEGIN`, 40개 고유 `P116_ROW_01..40`, `P116_TEXT_END`가 각각 정확히 한 번 존재했다. PDF 추출 결과는 원문과 공백을 제외한 문자 순서가 일치했고, 모든 페이지를 A4 미디어 박스 안에서 확인했다.
- 브라우저 Range 줄 사각형은 가로 잘림·줄 겹침 0. PDF 텍스트 상자도 페이지 경계 안, 같은 기준선의 ASCII 단어 상자 중첩 0.
- 각 PDF에 원본 합성 PNG가 임베드됐고, V2의 전체 문서·에셋 저장소와 PNG 원본 base64 바이트가 매트릭스 전후 동일했다. 텍스트 원문은 브라우저 DOM 및 V2에서 공백까지 exact equality로도 검사했다.

## 시도 이력과 판정 한계

- 이전 후보 `254e8c2b39488c0e2caad733b88fb2abfe04f31f`의 Linux [#43618017819](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43618017819)는 `pdftotext`가 일부 단어 사이 공백을 붙여 내보내는 추출기 동작 때문에 실패했다. 다음 정확 SHA에서 공백 제거 후 전체 문자 순서 비교와 개별 표식 검사를 병행했고 통과했다. 이 실패 후보는 **0점**이다.
- 테스트 원문은 합성 ASCII 본문이며, Poppler의 CJK PDF 텍스트 매핑/추출 정확도와 한국어 텍스트 레이어는 수용하지 않았다. 실제 구매자 시각 품질, 고객 원본, 종이 출력, 물리 Win10/11은 미검증이다. 이 검증은 실제 구매자 최종 수용이 아니다.
- 결과물 PDF는 Actions 임시 작업 디렉터리에서 검사하고 폐기한다. 합성 파일을 제품 저장소나 고객 파일로 대체하지 않았다.

## 점수와 다음 작업

P116에서 A04를 **12→13/15**로, 잠정 총점을 **54→55/100**으로 갱신한다. 사용자 확정 A01~A12 배점은 불변이며, G55는 별도 통과 게이트로 적용했다. 공식 구매자 최종 수용률은 **UNASSESSED**, 출시는 **RELEASE HOLD**, 고객 빌드·OCR 출시 차단은 유지한다. 다음 작업은 **P117**.
