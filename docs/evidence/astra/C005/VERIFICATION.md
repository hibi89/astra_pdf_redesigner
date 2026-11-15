# C005 — additional local-AI quality and 8-GiB CPU acceptance

**Status:** PARTIAL evidence run pending; blocked for completion and score credit  
**Score:** +0  
**Reason:** The available GitHub-hosted Windows runner reports 17,174,360,064 bytes of total memory (about 16 GiB), so it cannot establish an 8-GiB-class CPU profile; user-local PC tests are outside the permitted environment. A new Windows run is measuring distinct-input behavior separately while this resource-profile gate remains unmet.

## Existing evidence that is not C005 completion

- P123's prior verified report records 31 synthetic Korean cases, 10 visible proposals, 21 fail-closed outputs and resource measurements on a four-thread Ubuntu runner with 16,759,439,360 bytes of system RAM. This is useful prior evidence, but it does not establish an 8-GiB profile or Windows CPU behavior. See [P123/VERIFICATION.md](../P123/VERIFICATION.md).
- P124's exact Windows run verified the current Electron GUI and real Qwen3 in BASIC/PRO/BUSINESS, but it intentionally replayed one guarded synthetic paragraph to obtain ten fresh visible review decisions per SKU. It is repeated-interaction coverage, not 30 unique-input quality coverage. See [C001/VERIFICATION.md](../C001/VERIFICATION.md).
- The earlier first P124 attempt at `6e8b2eeb381874a12be041fa080fb545b5e1fb82` traversed the 31-case test list but failed its ten-proposal threshold and did not persist a per-case quality report. It cannot be promoted to C005 evidence.

## Current exact-SHA run — in progress

- The requirement is 30+ distinct synthetic inputs across the quality run. The earlier Windows run [43702880160](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880160) at SHA `5b323fd47d0c2cd2efb20a136102ee65b3bb7af2` is still active after roughly 100 minutes; it was exercising 31 inputs in each SKU context. Its logs and artifacts are unavailable until the job ends.
- A follow-up test at optimized feature SHA `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3`, [Windows Electron/Qwen3 run 43711160507](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160507), runs the 31-input corpus once total, distributed across BASIC, PRO, and BUSINESS. All three actual product SKU contexts still run; each case is only sent once. This run was `in_progress` at the latest check, with no artifact or terminal result yet.
- At the last completed resource audit the hosted Windows runner reported 17,174,360,064 bytes of memory (about 16 GiB), so neither run can establish the required 8-GiB-class profile.

No C005 score is claimed while the optimized run is pending or for any result on a 16-GiB-class host. No user PC was accessed, and no memory/performance result is extrapolated to an 8-GiB buyer device. The 8-GiB acceptance remains BLOCKED.


## C005 timeout/cancellation and browser regression — PASS; quality run pending

At source/test SHA `4aa4f533ea652f2f391a9b2deca15f6d7f804130`, `tests/local-model-controller.test.cjs` exercises fail-closed timeout and cancellation recovery using a synthetic stalled child process. Timeout must kill the process, delete the transient prompt, and release the controller's single-flight slot; cancellation must kill the stalled process and permit a later validated synthetic proposal. This is controller regression evidence, not a real-Qwen timeout measurement.

- Exact-SHA GitHub regression [run 43711870155](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711870155): `npm test`, production build, Chrome print/persistence smoke, and Microsoft Edge A4 PDF/IndexedDB smoke all PASS.
- Exact-SHA Windows package audit [run 43711870072](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711870072): PASS (NSIS candidate, SBOM, release-hold audit).
- Exact-SHA blueprint policy [run 43711870456](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711870456): PASS.
- Real-Qwen 31-distinct-input Windows run [43711160507](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43711160507) at code SHA `8136c6b070eceb97e4e26fbdebae7632ab6f2ed3` remains in progress; earlier 93-call run [43702880160](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880160) is also still in progress. Neither has a terminal result or artifact.
- The available Windows host profile is about 16 GiB (`17,174,360,064` bytes), so it cannot establish the required 8-GiB-class acceptance.

C005 remains +0 and BLOCKED for completion: the 8-GiB gate is unmet, and the real-Qwen distinct-input run has no terminal result. No score is inferred from the controller/browser regression, build, or package checks.
