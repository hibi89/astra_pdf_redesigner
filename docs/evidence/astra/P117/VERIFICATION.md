# P117 검증서 — BUSINESS 다중 문서 브랜드 반복 출력 및 SKU 우회 회귀

**상태: VERIFIED · A04 +1점 · 잠정 55→56/100**  
**저장소/브랜치:** `hibi89/astra_pdf_redesigner@feature/astra-p71-pdf-source-parity-20261112`  
**검증 기능 SHA:** `c4d96dc02fb616e44773871952343161079e293b`  
**구현 커밋:** `e57396a47c2fdb46214601795df91fca6e44f16f` · **검증 전 테스트 선택자 수정 커밋:** `c4d96dc02fb616e44773871952343161079e293b`

## 변경 내용

- `src/step2/Workspace.tsx`: BUSINESS 다중 문서 계획을 새 선택으로 **교체**하도록 수정했다. 기존 계획을 객체 병합하던 로직은 이전 대상 문서를 계속 BUSINESS 대상에 남길 수 있었다.
- `tests/brand-batch-plan.test.ts`: 2/5/20개 선택의 정확한 독립 계획과 미선택 ID 제외 검증 추가.
- `tests/sku-action-gate.test.ts`: 위조 영수증이 결합된 BUSINESS+brand-kit 상용 동작을 승인하지 않고 부수효과도 실행하지 않는 테스트 추가.
- `tests/step4-brand-batch-browser.mjs`: 실제 문서함 UI에서 21개의 합성 STEP2 V2 문서를 만들고 배치 전환·개별 PDF·취소·저장 무변경을 확인.
- `.github/workflows/ci.yml`: 위 실브라우저 회귀를 Chrome과 Edge hosted job에 추가.

## 정확 SHA GitHub Actions

각 workflow의 `head_sha`는 모두 `c4d96dc02fb616e44773871952343161079e293b`다.

| 검증 | 결과 |
|---|---|
| [Linux Chrome/Edge #43622221289](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221289) | SUCCESS · Node `271/271 PASS`, 0 FAIL, `npm run build` PASS |
| [Windows Electron/NSIS #43622221235](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221235) | SUCCESS · Node `270 PASS / 1 OS 전용 SKIP / 0 FAIL`, desktop `73/73 PASS` |
| [정본 최종설계 정책 #43622221573](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43622221573) | SUCCESS |

### Chrome 및 Edge 실제 브라우저 검증

각 브라우저에서 실제 UI를 통해 서로 다른 V2 문서 21개를 만들고 다음 대상을 순서대로 적용했다.

- 2개 대상: 문서 0–1.
- 5개 대상: 문서 2–6. 이전 2개 계획의 문서는 제외됨.
- 20개 대상: 문서 0–5 및 7–20. 이전 5개 계획 중 문서 6은 의도적 미선택 sentinel로 남겨져 이전 대상 잔류를 검출함.

각 단계에서 21개 문서를 실제 전환해 선택 대상은 BUSINESS 레이아웃·브랜드 계획을 받으며 비대상은 기본 레이아웃·브랜드 없음임을 검사했다. 앱의 개별 인쇄 동작을 각 대상에서 호출하고, 그 문서만 포함한 **개별 A4 PDF 27개/브라우저(2+5+20, Chrome+Edge 총 54개)**를 생성했다. 각 PDF에서 A4 용지, 그 문서의 고유 원문 시작 표식, 브랜드명, 다른 문서 표식 부재를 검사했다.

취소 후 21/21 문서에서 임시 레이아웃·브랜드가 사라지고 원래 테마가 복원됐다. 계획/개별 출력 전후 IndexedDB V2의 21개 문서 레코드(본문·디자인 포함)는 깊은 비교에서 동일했고 assets 저장소도 동일했다(합성 입력에는 이미지 assets 없음). 계획은 세션에만 유지되며 저장된 원문이나 디자인을 쓰지 않는다. 합성 PDF 파일은 hosted runner의 임시 디렉터리에서 검사 후 삭제되며, 고객 문서는 사용하지 않았다.

### SKU 및 Windows 설치 검증

- 결합된 `business-layout` + `brand-kit` 권한에 위조 영수증을 전달한 상용 동작 시험은 거부됐고 PDF side effect는 0회였다. `ASTRA_CUSTOMER_BUILD_ENABLED=false`는 유지되며 내부 시연 경로를 판매용 권한으로 보지 않는다.
- Windows Actions는 실제 Electron/NSIS 설치·실행·제거를 수행했다. 별도 0.1.0→0.1.1 인플레이스 NSIS 업그레이드 뒤 기존 STEP2 IndexedDB 문서와 PNG를 실행된 앱에서 다시 읽어 PASS했다.

## 실패 후보 및 판정

- 구현 커밋 `e57396a47c2fdb46214601795df91fca6e44f16f`의 [Linux run #43621810438](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43621810438)은 Chrome 브라우저 시험에서 `data-business-brand-footer`를 입력 필드 대신 미리보기의 `<footer>`에 매칭해 `Illegal invocation`으로 실패했다. 이 후보에는 점수를 주지 않았다.
- 테스트 선택자를 `input[data-business-brand-footer]`로 한정한 `c4d96dc02fb616e44773871952343161079e293b`에서 Linux, Windows, 정본 정책 3개 workflow를 모두 다시 실행해 통과했다.

## 미검증·차단 사항

로고 포함을 이용한 배치 출력, 고객용 실제 issuer pin, 판매용 서명키 발급·활성화, 영구 배치 계획, 자동 대량 파일 저장은 이 작업에서 활성화하지 않았다. 실제 구매자 문서·육안 수용, 종이 출력, 물리 Win10/11 환경은 미검증이다. 사용자 확정 A01~A12 배점, STEP1 V1, STEP2 V2, BASIC8/PRO20/BUSINESS30, 서명키·출시 차단 정책은 유지된다. 공식 구매자 최종 수용률은 **UNASSESSED**, 출시는 **RELEASE HOLD**다.

## 점수와 다음 작업

P117에서 A04는 **13→14/15**, 총점은 **55→56/100**으로 갱신한다. G55는 이미 별도 PASS이며 새 점수 게이트가 아니다. 다음 작업은 **P118**이다.
