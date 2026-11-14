# P122 — 로컬 Ollama 동의·오래된 응답·의미 변경 방어

**판정:** VERIFIED · +2점 · A08 2→4/14 · 잠정 총점 57→59/100  
**정확 검증 기능 SHA:** `d2a84d03ac8c791e74470e756cb6417a356776c3`  
**공식 사용자/구매자 수용:** UNASSESSED · **출시:** RELEASE HOLD  
**G55:** PASS 유지 · **G60:** 미도달(59점)

## 변경 내용

- `desktop/local-model-controller.cjs`: 기존 URL/숫자·날짜/통화/인용/부정 체크를 보강했다. 명시적 이름/회사명, 직함 결합 이름, 대문자 영문 식별자, 부정문 전체, Markdown/tab 표 행은 바뀌면 제안 거부한다. 이는 보수적인 문자열 규칙이며 의미 보존 보증이 아니다.
- `src/humanize/LocalModelReview.tsx`와 `src/step2/Workspace.tsx`: 현재 문서·섹션·블록 ID를 `sourceScope`로 묶는다. 문구 또는 scope가 바뀌면 in-flight 요청을 취소하고 generation을 무효화한다. 화면은 같은 문구의 다른 블록에 이전 제안을 보여주거나 승인하지 않는다. 승인 및 Undo도 같은 scope에서만 가능하다.
- `tests/local-model-controller.test.cjs`: 30개 synthetic golden 문단(정상/변조 각 15, 이름·표·숫자·날짜·금액·부정·URL·인용)을 평가한다.
- `tests/owner-ollama-controller.test.cjs`: main/preload 인자 순서, trusted sender 검사, 사용자 동의 필수성, 고정 `127.0.0.1:11434` / `qwen3:4b-instruct`, redirect 거부를 회귀 검증한다.
- `tests/local-model-review-browser.mjs` 및 synthetic harness: 실제 Chrome/Edge에서 동의 전 호출 0, auto-apply 0, 동일 문구 cross-scope 및 변경 문구 stale 응답 폐기, 수동 승인·Undo, 예외/취소 후 원문 유지, 외부 요청 0을 검증한다. 이 경로는 mock이며 실제 모델을 실행하지 않는다.

## 정확 SHA GitHub Actions

- Linux [#43638127671](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127671) — SUCCESS, head SHA `d2a84d03ac8c791e74470e756cb6417a356776c3`. Node 278/278 PASS, build PASS. Chrome 및 Edge에서 P122 synthetic review UI E2E PASS; 30-case golden PASS.
- Windows [#43638127695](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638127695) — SUCCESS, 같은 head SHA. Node 277 PASS / 1 Windows 전용 SKIP / 0 FAIL; desktop:verify 74/74 PASS; P106 synthetic Authenticode evidence PASS; Electron smoke 및 unsigned NSIS 설치·기동·제거·0.1.0→0.1.1 업그레이드 후 STEP2 문서·PNG 보존 PASS.
- Final blueprint [#43638128095](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43638128095) — SUCCESS, 같은 head SHA.

## 실패 후보와 제한

최초 P122 후보 `45affeef40c96cb4991fadd6da6c706fa84afd41`의 Linux [#43637402373](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43637402373)은 테스트 regex escaping 오류 3건으로 실패했으며 0점이다. 정규식/test fixture를 수정하고 문서·블록 scope까지 포함한 최종 SHA에서 세 필수 Actions를 모두 통과했다.

P122는 동의·표시·취소·안전 검수 경계를 검증했다. 실제 Qwen3 CPU 추론, 실제 문장 품질/의미 정확도, 모델 라이선스/hash·성능은 검증하지 않았으며 P123/P124 점수로 미리 계산하지 않는다. 고위험 문장은 보수적으로 거부하며 사용자 직접 검토가 남는다.
