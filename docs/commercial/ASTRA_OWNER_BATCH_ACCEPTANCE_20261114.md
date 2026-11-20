# ASTRA — 소유자 로컬 PDF 5~10건 인수검수 증거 묶음 (2026-11-14 KST)

**범위:** Astra 원래 최종설계 기준 100% 달성을 위한 P88 보조 도구. 판매 승인·원문 완전 보존 인증이 아니며, 자동으로 최종완성률을 올리지 않는다.

## 방식 비교 및 채택
- A: 실고객 PDF를 CI/GitHub에 업로드하여 중앙에서 대조 — 원본 유출 위험, 공개 저장소 및 사용권과 충돌하여 **금지**.
- B: 고객 소유 Windows/로컬 PC에서 원본·출력 PDF 및 STEP7 수동 7항목 검수 JSON을 각각 생성하고, 별도 **로컬 Node CLI**로 5–10개 해시/자체점검을 결합 — 외부 API 비용 0, PDF 비전송, 유지보수 단순. **B 선택**.

## 사용법 (실제 고객 문서·경로는 개인 PC에서만)
1. Astra GUI의 '최종 PDF 원본 대조'에서 **서로 다른 원본 PDF 5~10건**의 원본/새 출력 PDF 쌍을 각각 선택하고 '두 PDF 대조하기' 실행.
2. 실제 원본/출력물을 옆에 놓고 텍스트/숫자/표/그림/페이지/한글/잘림 7개를 확인한다. 검수 완료 후 각 쌍의 '검수 결과 JSON 저장'. **다르거나 미확인이면 체크하지 않는다**.
3. 개인 PC에서 절대경로로 manifest JSON 작성 (아래 예시 한 건을 5~10개로 반복). 파일은 **절대 GitHub에 올리지 않는다**.

```json
{
  "format": "astra-owner-batch-manifest-v1",
  "cases": [
    {
      "category": "text",
      "sourcePdf": "C:\\LOCAL\\original.pdf",
      "outputPdf": "C:\\LOCAL\\redesigned.pdf",
      "reviewJson": "C:\\LOCAL\\astra-pdf-parity-review.json"
    }
  ]
}
```

4. 개발용 Node.js 22 환경에서 실행: `node scripts/owner-batch-acceptance.mjs "C:\\LOCAL\\manifest.json" "C:\\LOCAL\\acceptance.json"`. 출력 경로에 파일이 있으면 덮어쓰지 않는다. **5건 미만 입력은 실행 거부**.
5. 생성된 `acceptance.json`에는 개별 해시/페이지/점검 숫자/위험 유무만 있으며 원본 PDF 텍스트·경로·파일명은 포함되지 않는다. 하지만 **해시는 문서 간 연결 가능한 식별값이므로 사용자 동의 없이 외부 공유하지 않는다**.

## 안전·제약
- 원본 파일 30MiB / GUI PDF 분석 50페이지, 입력 JSON 64KiB, 5–10개 쌍, 파일 및 부모 심볼릭 링크 거부.
- PDF 파서 역할 아님: 기존 STEP7 PDF.js 검수 JSON의 SHA256 및 7개 자체 점검과 현재 디스크 PDF 바이트를 재검증한다. 파일 헤더 확인만으로 PDF 충실도 인증을 주장하지 않는다.
- 문제가 없을 때도 `ALL_LOCAL_SELF_REVIEWS_COMPLETE_NOT_CERTIFIED`, 문제가 있으면 `REVIEW_HOLD`, 불일치/위조/경로 문제는 `ASTRA_OWNER_BATCH_BLOCKED`. 언제나 `ownerApproval=NOT_GRANTED`, `saleReady=false`.
- 원본 PDF, 합성 이외의 실고객 자료, 모델 가중치, 절대경로 manifest는 GitHub와 CI에 업로드 금지.
- 실제 고객 PDF 육안/Windows10·11 실기기/LLM 품질 및 라이선스/PRO20·BUSINESS30/코드서명·사용권·상담·환불·크몽 등록 승인과 별개이다.

## 검증
- `node --test tests/owner-batch-acceptance.test.mjs`: 로컬 Node22.16.0 합성 5 PASS/0 FAIL (2026-11-14, 기능 브랜치 반영 전). 테스트 PDF는 형식 헤더만 포함한 합성 바이트이며 실제 PDF 화면 검증 아님.
- GitHub Actions/Windows 최신 브랜치 검증은 새 코드 커밋 후 확인한다. 이전 85% 기능 검증 SHA `0db2acb5` 결과를 새 코드의 CI 결과로 전용하지 않는다.
