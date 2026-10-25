# ASTRA 상용화 전체 작업표 (WBS / 우선순위·작업시간·완료조건)

기준일: 2026-10-25 KST | 목표: BASIC 3만 / PRO 6만 / BUSINESS 9만 | **코드 실구현 미착수인 신규 상용화 범위는 모두 TODO**.

## 작업 방식과 추정
- 각 task는 단일 개발/검증 브랜치 + 실제 증거 + 총괄 검수 후 DONE. 선행 작업을 허용하나 의존성/품질 게이트 우회 불가.
- 코드 자산이 있으므로 '7단계 다시 개발'이 아니라 **기존 1/2 + PR3 + PR4 재사용/통합 후 상용화 추가**.
- 아래 시간은 작업자 1인 기준 **불확실성이 큰 초기 순수 작업량**이고 실제 달력 시간·완료 약속이 아니다. 실제 PDF 구조·UI/PC 성능에 따라 증감.
- 차단 시 같은 방법 1~2회 초과 반복하지 말고 원인/대안과 함께 BLOCKED 기록 후 다른 READY를 수행. 사용자 실제 민감 문서는 public GitHub/CI에 업로드 금지.

## A — 인수·통합 설계 (12~25h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| A01 | P0 READY | PR3·PR4·main 3자 tree/API/의존성/데이터 변경 비교와 안전한 통합 후보 브랜치 설계 | 충돌표, 최소 3개 위험, 테스트 매트릭스, SHA 기록 |
| A02 | P0 WAIT(A01) | 독립 통합 브랜치 구성, pdfjs + Electron 공존 컴파일/기능 smoke | 신규 코드 브랜치에서 npm test/build + Windows CI; main/PR3/4 불변 |
| A03 | P0 WAIT(A02) | 기존 STEP1/2 localStorage/IndexedDB/JSON non-destructive regression baseline | 합성 이관/충돌/롤백/복원 수용 통과 |

## B — PDF 추출 정확도·원본 보존 (30~60h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| B01 | P0 WAIT(A02) | 입력 지원범위/스캔·암호·표·다단·벡터/마스크 detection/capability matrix | 실패 문서 재현 fixture 및 BLOCK/WARN 분기 |
| B02 | P0 WAIT(B01) | 원본 바이트·해시·page/bbox·이미지 자산 연결 및 비교 뷰 | 원본 vs 추출 상세 diff + immutable 저장 |
| B03 | P0 WAIT(B02) | 누락/중복·수치/금액/고유명사 검수 게이트 + 원본 역참조 | false-pass 0 목표/경고 표기, 단위 테스트 |
| B04 | P0 WAIT(B03) | 30개 범주별 로컬 합성/공개 테스트 PDF와 승인된 고객 샘플 5~10개 검수 | fixture별 가능/불가/수작업·재현 증거 |

## C — 디자인 엔진·상용 UI (35~70h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| C01 | P0 WAIT(A02) | 4-step guided studio shell, 원문/결과 병렬·드래그 업로드·검수 상태/Undo | Chrome/Edge 키보드/스크린샷 비교 E2E |
| C02 | P0 WAIT(B02,C01) | style tokens/layout primitives, 한글 폰트 fallback·A4 pagination | A4/다페이지·한글/이미지·긴 글 no clipping |
| C03 | P0 WAIT(C02) | BASIC 구별 가능한 템플릿 8종 + 검수 PDF | 각각 레이아웃 차이/샘플 파일 실출력 확인 |
| C04 | P1 WAIT(C03) | PRO 추가 12종 (총20) + 선택·미리보기·저장 preset | 저장/재오픈/대조 테스트 |
| C05 | P1 WAIT(C04) | BUSINESS 추가10종(총30)·반복 문서 매핑 | 실제 결과 검수, 단순 색상 변형 미계수 |

## D — im-not-ai / 로컬 AI / 안전 윤문 (25~55h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| D01 | P0 READY | upstream MIT/버전/패턴·스크립트 사용범위 및 한국어 golden corpus 작성 | 저작권 고지·체크리스트, 탐지 오류/예외 |
| D02 | P0 WAIT(D01) | offline deterministic checker/formatter·숫자/인용/양태 guards | Node 단위 fixture diff parity 및 회귀 |
| D03 | P0 WAIT(D02) | 1.5B~4B 경량 모델 2~3개 한국어·CPU/RAM/라이선스 비교 | 재현 가능한 모델 ID·hash·측정시간·quality score |
| D04 | P0 WAIT(D03) | optional local inference process + cancellation + Windows packaging | offline/no API test, CPU-only smoke, failure fallback |
| D05 | P0 WAIT(D04,C01) | 윤문 전후 diff/제안/승인/복원/히스토리·검수 UI | 수치/의미 위험 자동 반영 0; 세 SKU 동일 engine |

## E — 상품 등급별 추가 효용 (25~55h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| E01 | P1 WAIT(C03,D05) | BASIC 기능 세트 명세/정상 설치/누락 없는 PDF 저장 | 기본 고객 여정 E2E |
| E02 | P1 WAIT(C04) | PRO 배치 대기열(순차·취소·재시도), 커스텀 프리셋, 비교 | 수십 페이지·여러 문서 격리·오류 복구 |
| E03 | P1 WAIT(C05,E02) | BUSINESS 로고/색/표지/머리·꼬리말/brand kit | 서로 다른 문서에 동일 스타일 일괄 적용 |
| E04 | P1 WAIT(E01) | 가격/등급 entitlement, 오프라인 검증 가능한 구매 증빙 방식 | basic/pro/business 권한 테스트 + 원문 전송 0 |

## F — Windows 배포·업그레이드·보안 (20~45h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| F01 | P0 WAIT(A02,D04) | Electron+pdfjs+sidecar 보안 분리, native save dialog, 미설치 모델 안내 | 권한/외부 통신 차단·파일 쓰기 취소/오류 |
| F02 | P0 WAIT(F01) | NSIS 빌드/설치·재시작·제거/STEP1→2→신규 프로젝트 migration | Windows runner + 실제 개인 PC 검증 구분 |
| F03 | P0 WAIT(F02) | 코드/모델 저작권 3rd-party notices, 해시, 보안·SmartScreen 대처 | 저작권/모델 상업 사용/서명 요건 확인 |
| F04 | P0 WAIT(F03) | 장애 수집 방식(고객 콘텐츠 제외), 복구·언인스톨·업데이트 설명 | UI로 복구/백업/지원 재현 가능 |

## G — 품질·고객 인수 (20~40h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| G01 | P0 WAIT(B04,C03,D05,F02) | 고객 사용경로 5-10 PDF, 표/한글/긴 글 수동 원문·PDF 비교 | 체크리스트 서명, unsupported 경고 검증 |
| G02 | P0 WAIT(G01) | 저사양 Windows CPU/RAM 최소/권장 실제 측정, 모델 크기·시간 | 환경별 pass/timeout/memory footprint |
| G03 | P0 WAIT(G02,E04) | 실제 신규 사용자 3명 설치/첫 작업/윤문·수정 회복/불만 조사 | 베타 로그(민감 원문 제외), bug closure |
| G04 | P0 WAIT(G03) | 결함 차단 재평가/보안 라이선스 검수·최종 Go/No-Go | 판매 승인 체크리스트 |

## H — 크몽 판매·운영 (10~20h)
| ID | 우선 | 작업 | 완료증거 |
|---|---|---|---|
| H01 | P1 WAIT(G04) | 실제 스크린샷/실제 PDF 비포애프터, 사용영상, 상품 상세글 | 이미지와 프로그램 출력 대응; 허위 claim 0 |
| H02 | P1 WAIT(H01) | 30/60/90 3옵션 업로드, 라이선스·모델 안내·고객지원 FAQ | 실제 구매/수동 전달/복구 동선 1회 검증 |
| H03 | P1 WAIT(H02) | 판매 후 버그 triage·버전 업데이트·초기 고객 지표 | 첫 피드백 보고·재발 방지 |

## 의존성·선행전략
```text
A01 -> A02 -> A03 -----------------------+
           -> B01 -> B02 -> B03 -> B04  |
           -> C01 -> C02 -> C03 -> C04 -> C05
D01 -> D02 -> D03 -> D04 -> D05          |
                      +-------> F01 -> F02 -> F03 -> F04
                                  E01/E02/E03/E04
                  B04+C03+D05+F02 -> G01 -> G02 -> G03 -> G04 -> H01 -> H02 -> H03
```
- **품질 우선 병렬성**: D01은 즉시 가능, C01은 A02 이후. 스타일 추가(C04/05)와 비핵심 브랜드 작업(E03)은 C03 품질이 검증될 때만.
- 우선순위: **지원 문서 fidelity > Windows 실행 > 안전 윤문 > UI 진짜 조판 > 템플릿 수 > 배치/브랜딩 > 판매 자료**.
- 최초 **BASIC 30,000원** 사용성 검증이 통과할 때 PRO/BUSINESS 기능을 확장. 3개 등급은 동시에 출시하지 않아도 되지만 출시 시 각 상품 설명과 실제 기능 일치해야 한다.
- 상용화 완료율은 Task 완료 증거가 생기면 총괄이 갱신한다. **계획서 작성만으로 코드 진행률을 올리지 않는다.**

## 시간/위험 공개
- 총 추정 순수 인력: **약 177~370시간** (A 12~25, B30~60, C35~70, D25~55, E25~55, F20~45, G20~40, H10~20). 전담 1인 기준의 가정, 수주·달력 기간 보장 아님.
- 스캔·고난도 레이아웃·8GB 로컬 추론·Windows 코드서명 비용/요건·모델 적합성은 **핵심 불확실성**. 범위가 다르면 출시 SKU의 지원 기능을 낮추거나 개발량을 재산정한다.
- 본 날짜에 실제 신규 상용화 코드/테스트 **NOT RUN**. 기존 완료 코드 자산은 위의 전체 시간 추정에 재사용 전제.
