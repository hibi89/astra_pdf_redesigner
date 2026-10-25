# ASTRA M02 — 실제 앱 화면 vs 상품 목업 비교 (2026-10-25 KST)

**증거 기준:** 초기 상품 홍보 그림은 GitHub에 원본 이미지가 없어 **정확한 픽셀 대조 불가**. 아래는 원래 작성된 목업 설명과 **실제 Chromium screenshot**의 기능/레이아웃 비교이며, 컨셉 이미지를 실물로 오인하지 않는다.

## 검증된 구현
- GitHub 소스 커밋 `0bf61af6b94f31de376330951aeb93e552d006b0`에 실제 3영역 `studio-layout`을 구현: 좌측 PDF 불러오기/원문 검수/문서 블록, 중앙 A4 `ProjectPreview`, 우측 디자인 테마·폰트·색상·글자 크기. 좁은 창에서는 2열/1열로 순차 재배치.
- HTML/CSS만 바꿔서 조작 없이 실제 PDF는 그대로인 '가짜 2템플릿'이 되지 않도록, **보고서형/미니멀형**의 별도 재조판 CSS와 실제 Chrome `Page.printToPDF` x2 + `pdftotext -bbox` 자동 검증 추가.
- [Linux Chrome/Edge #40200531977](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200531977) **SUCCESS**; 실제 Windows NSIS [#40200531992](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200531992) **SUCCESS**. 같은 원문 표식은 두 디자인 모두 포함되었고 제목 Y 위치는 `246.861318pt`(보고서형) / `276.111317pt`(미니멀형)으로 **29.25pt 차이**. 출력은 A4, 한글·이미지 회귀 통과.
- **첫 실제 앱 캡처:** [GitHub Actions #40200531977](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200531977) 아티팩트 `astra-m02-studio-chrome-synthetic`; 합성 테스트 파일을 가져온 **실제 브라우저 화면**이며 홍보용 목업이 아니다. 가로 1600px에서 좌/중/우 영역 시각 확인. 최초 Linux 스크린샷에서 한글 글리프가 네모로 보이는 CI 폰트 문제 발견; `383d2a63`에서 Noto CJK CI 설치 및 세 영역 실제 좌표 검사 추가함. [업데이트 Linux #40200891875](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40200891875)는 별도 검증 필요.

## 기능별 실제 대조

| ID | 목업 약속 | 실제 앱 / 근거 | 판정 |
|---|---|---|---|
| V01 | 즉시 PDF 열기 | PDF.js 파일 선택·텍스트/이미지/경고 추출 및 수동 승인 동작. 드래그앤드롭 별도 미구현 | PARTIAL |
| V02 | 좌측 문서·중앙 A4·우측 스타일 | 실제 컴포넌트 3개와 브라우저 캡처로 배치 확인. 최신 좌표 자동검사 준비 | IMPLEMENTED / latest layout CI pending |
| V03 | 원본 PDF와 새 결과를 대조 | 가져오기 검수 중 원본 PDF iframe 제공. **확정 직후 Blob URL 폐기되어 결과 A4와 지속 병렬대조 불가** | GAP |
| V04 | 두 가지 실제 다른 조판 | 보고서형 색상 영역/섹션 격자 vs 미니멀형 큰 제목·여백; 실제 PDF 제목 위치 29.25pt 차이, 동일 원문 표식 검증 | VERIFIED (2 layouts) |
| V05 | PDF 원클릭 저장 | Windows 설치 EXE에서 native save와 PDF 파싱 CI 확인 (M01) | VERIFIED (synthetic) |
| V06 | 로컬 선택 AI 윤문 | 모델·UI 미구현 | NOT IMPLEMENTED |
| V07 | 프리미엄 UI | 3영역, 카드·스텝 바와 A4 캔버스 구현. 900~1250px 촘촘한 화면 및 실한글 시각 검수 필요 | PARTIAL |
| V08 | 로컬 원본 보존 | 독립 IDB 문서, 명시적 승인, 외부 URL 차단 기존 테스트. 전체 고객 파일 케이스는 미검증 | PARTIAL |

## 다음 개선 Top 5 — 실제 화면/코드 갭 우선순위
1. **P0:** 가져오기 승인 직후에도 **활성 문서에 한해** 원본 PDF와 중앙 결과를 나란히 볼 수 있게 세션 원본 유지·문서 전환/닫기 시 정리. 기존 원본 PDF를 IDB에 무단 영속 저장하지 않는다.
2. **P0:** 원본 블록/페이지와 재조판 블록 간 조작 가능한 링크, 누락 검수 UX (현재 단순 원본 텍스트·좌표 수동 대조).
3. **P1:** 고객 Windows 한글·긴 문서/고해상도 이미지의 실제 UI A4 시각 검사. Linux runner 폰트 보정 및 screenshot artifact가 사용자 PC 검증을 대체하지 않음.
4. **P1:** 900~1250px 화면에서 중앙 결과폭/스크롤·왼쪽 긴 검수 패널의 사용성 개선, 드래그 파일 선택·명확한 작업 단계 전환.
5. **P1:** M03에서 선택형 오프라인 AI 윤문과 전/후 Diff·승인/되돌리기 구현; AI 작동 전에는 상품 광고/판매 금지.

## 지켜야 할 선
- 3만원/6만원/9만원 세 요금제 및 전 등급 동일 AI 윤문은 **목표이지 출시 검증이 아님**.
- 최초 콘셉트 목업의 원본 이미지 자체가 저장소에 없으므로 정밀한 이미지 비교는 NOT VERIFIED. 실제 Chromium 화면 증거만 인정.
- 이 문서는 **M02 1차 반복의 갭 분석**, 원본 비교 지속 UX가 해결되지 않아 M02는 PARTIAL이며 다음 READY는 위 1번.

## VERIFIED M02 Source-Comparison Closing Note (2026-10-25 23:25 KST)
- Earlier table row V03 and gap #1 are **superseded for in-session MVP**: active imported document now keeps the uploaded original PDF in a left-side iframe beside center redesigned A4 after explicit approval. Correct doc ID association, original byte SHA-256 equality, closing/revoking after switch and no stale original on returning were tested in real Chrome.
- [Final Linux Chrome/Edge #40201817319](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40201817319): SUCCESS; [Windows installed NSIS #40201817273](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/40201817273): SUCCESS. Real screenshot only with synthetic fixture: download `astra-m02-studio-chrome-synthetic` from Linux workflow artifacts. This is an actual running app, **not** a generated concept image.
- **Remaining gap #1 becomes** original PDF session disappears on app restart by design; a user must choose the original again. Storing original bytes persistently is NOT authorized. Block anchor synchronized scrolling/highlights are later UX work and not falsely marked complete.
- M02 core 3-pane+report/minimal A4 print+source vs result is DONE. M03 local optional AI, deeper per-block alignment, responsive polish, customer sample proof and sellable QA remain separate.
