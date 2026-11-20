# P118 — 로컬 레퍼런스 분석·비파괴 적용·재현성 검증

**판정: VERIFIED, +1점.** A05는 3→4/5점, 누적 잠정 완성률은 56→57/100이다. 공식 구매자 수용률은 **UNASSESSED**, 판매 상태는 **RELEASE HOLD**로 유지한다. A01~A12 확정 배점은 바꾸지 않았다.

## 구현 및 변경

현재 로컬 레퍼런스 분석은 이미지의 색상·여백·시각 밀도를 제안하고, 선택 가능한 PDF 텍스트의 글자 크기 힌트를 표시한다. 폰트·저작권·스캔 이미지의 글자를 판정하지 않으며 PDF 스캔에 OCR을 적용하지 않는다. 기존 STEP5 미리보기·수정·적용·취소·Undo·프리셋 흐름을 제품 코드 변경 없이 더 넓은 회귀로 검증했다.

- tests/step5-reference-browser.mjs: PNG/JPEG/WebP 8종 합성 이미지, 2페이지 selectable-text PDF, 입력 파일 SHA-256, 전체 IndexedDB 저장소·asset SHA, 프리셋·미리보기·적용/취소·Undo·손상 PDF 거부 검사.
- tests/step5-reference-analysis.test.ts: 픽셀 경계값, 투명 픽셀, 잘못된 크기·버퍼, PDF 텍스트 중간값·정렬·본문 크기 제안 단위 테스트.
- 제품 소스는 변경하지 않았다. STEP1 V1, STEP2 V2, 프로젝트 문서·이미지 바이트는 보존됐다.

## 정확 SHA와 GitHub Actions

검증 기능 SHA: 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02.

- [Linux Chrome/Edge #43633902801](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902801) — SUCCESS, head SHA 일치. Node 테스트 276/276 PASS, build PASS. Chrome·Edge에서 8개 이미지 행렬, PDF 양 페이지, 정상 적용/취소·Undo, 손상 PDF fail-closed PASS.
- [Windows Electron/NSIS #43633902770](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633902770) — SUCCESS, head SHA 일치. Node 275 PASS / 1 OS 전용 SKIP / 0 FAIL; desktop 73/73 PASS. 설치·실행·제거와 0.1.0→0.1.1 업그레이드 후 STEP2 문서·PNG 복원 PASS.
- [정본 정책 게이트 #43633903290](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43633903290) — SUCCESS, head SHA 일치.

세 run의 head_sha는 모두 420da8fdf1fdda21a3196e40ac84d6ca5f7d3e02다.

## 수용 결과

Chrome과 Edge 각각에서 스캔형, 벡터형, 넓은 여백, 고밀도, 큰 페이지 여백, 한글 픽셀, 투명 PNG, 저대비 합성 레퍼런스의 예상 여백·밀도 범위와 테마·강조 색상을 확인했다. 해당 이미지 입력은 PNG/JPEG/WebP 실제 MIME 경로를 사용했다. 레퍼런스 원본의 SHA-256·크기·MIME이 분석 전후 일치했다.

두 페이지 synthetic PDF의 selectable text metrics 및 비 OCR 고지를 확인했다. PDF 각 페이지 분석 중 STEP2 전체 documents/assets/meta 저장소와 asset SHA-256, active document ID가 변하지 않았다. 기존 저장 상태에서 디자인을 적용해 PDF를 만들고 Undo한 뒤 content/design 복원이 완료됐다. 프리셋 내보내기에는 원본 이미지/PDF 데이터나 PDF 텍스트가 포함되지 않았다.

%PDF- 서명을 갖지만 구조가 손상된 입력은 오류 안내를 표시하고 분석/적용 미리보기를 만들지 않았다. 이때 전체 V2 저장소와 source file SHA-256이 유지됐다. unit suite 전체와 두 브라우저에서 확인했다.

## 시도 이력·한계·다음 작업

최초 후보 e2a7c04e693dea194b30aa11c4ee7cb20819739d의 [Linux #43624942512](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43624942512)은 테스트 루프에서 브라우저 DOM을 Node 문맥에서 직접 참조해 실패했다(ReferenceError: document is not defined), 0점 처리했다. CDP 브라우저 평가로 수정했고, JPEG/WebP 범위까지 포함한 최종 SHA에서 Linux·Windows·정책 workflow를 모두 다시 통과했다.

검증 범위는 합성 레퍼런스·GitHub-hosted 브라우저/Electron 동작이다. 실제 구매자 레퍼런스의 시각 품질, 폰트 식별·권리, 원본 저작물 사용권, 고객 PDF 적합성, 물리 Win10/11은 검증하지 않았다. 한글 사례는 픽셀 밀도 대상이며 한글 OCR/텍스트 의미 인식 증거가 아니다.

**다음 작업: P119** — Windows Tesseract 공급처·해시·DLL·LICENSE 감사 재현. 실제 OCR 공급처/재배포권이 미확인되면 0점과 OCR_MANIFEST=null·RELEASE HOLD를 유지한다.
