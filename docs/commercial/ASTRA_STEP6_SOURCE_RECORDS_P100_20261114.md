# STEP6 수동 레퍼런스 출처 보관함 — 기능 P100 (제품 100% 아님)

날짜 2026-11-14 KST. **공식 제품 최종완성률 `UNASSESSED` / 목표100% 미달.**

## 구현된 것
- 기능 소스 `src/step6/sourceRecords.ts`, UI `src/step6/SourceRecordsPanel.tsx` 및 디자인 스튜디오 연결. 별도 localStorage key `astra.step6.sources.v1`에 사용자 수동 입력한 참고자료 이름/원본 HTTPS URL/권리 메모만 최대20건 보관/삭제.
- 사용권 상태는 항상 `UNVERIFIED`이며 사용자 메모만으로 라이선스 권리 인증/재배포 허가가 되지 않음. 직접 출처 확인 및 권리자의 조건 검토 필요.
- 파일·이미지·고객 PDF·원문 텍스트/로고 바이트를 저장하지 않음. URL에 자동 접근/수집/다운로드 및 외부 HTTP 요청 없음. 기존 원본 V1/V2 및 디자인 미변경.
- 유효성 제한: HTTPS only, userinfo·port·fragment·사설 호스트·IP 주소 차단, 정확 키·버전·최대 크기, 중복 ID 거부; 저장 손상 시 자동 덮어쓰지 않음.
- 단위 테스트 `tests/source-records.test.ts` 및 Chrome/Edge 브라우저 `tests/step5-reference-browser.mjs`에 V2 내용·스타일 불변 회귀 추가.

## 이번 정확 코드/테스트 SHA 및 검증 상황
- `2213e8e50759836b8c24bfbe7b037536a8fd995a`; [Linux/Chrome·Edge #43553461990](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553461990), [Windows NSIS #43553462026](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462026) **3/3 SUCCESS — Linux Chrome+Edge Node179 PASS / Windows Node178 PASS+desktop19, NSIS 업그레이드 V2 데이터 보존**. [Policy #43553462320](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43553462320) SUCCESS는 증빙 게이트 정책만.
- 합성/CI에서만 STEP6 출처 메타데이터 기능 검증. 사용자 물리 PC·실 저작권 권리/고객 원본 문서 인수 미확인. 실제 제3자 디자인 출처·사용권/폰트 재배포 권리/고객 문서 수용도 미검증.

## 아직 완료되지 않은 원래 STEP6
- 외부 검색 제공처/API 허용된 검색 결과 썸네일·원본 링크·필터·즐겨찾기 컬렉션·중복 제거·한도/실패 처리·단일 검색결과→STEP5 자동 연결은 미구현.
- P99은 사용자 직접 입력 키워드의 외부 검색창 연결, 이번 P100은 수동 출처 메모만 별도 저장. **둘을 합쳐서 완성형 STEP6이라고 광고하지 않는다**.
- 외부 검색 제공 API/라이선스 확인을 통한 완성은 개인정보·권리·요금(목표0원)과 사용자 승인 범위에서 별도 설계/검증 필요. `BASIC/PRO/BUSINESS RELEASE HOLD`, 크몽 미등록.
