# C005 — additional local-AI quality and 8-GiB CPU acceptance

**Status:** BLOCKED for completion and score credit  
**Score:** +0  
**Reason:** The available GitHub-hosted Windows runner reports 17,174,360,064 bytes of total memory (about 16 GiB), so it cannot establish an 8-GiB-class CPU profile; user-local PC tests are outside the permitted environment. A new Windows run is measuring distinct-input behavior separately while this resource-profile gate remains unmet.

## Existing evidence that is not C005 completion

- P123's prior verified report records 31 synthetic Korean cases, 10 visible proposals, 21 fail-closed outputs and resource measurements on a four-thread Ubuntu runner with 16,759,439,360 bytes of system RAM. This is useful prior evidence, but it does not establish an 8-GiB profile or Windows CPU behavior. See [P123/VERIFICATION.md](../P123/VERIFICATION.md).
- P124's exact Windows run verified the current Electron GUI and real Qwen3 in BASIC/PRO/BUSINESS, but it intentionally replayed one guarded synthetic paragraph to obtain ten fresh visible review decisions per SKU. It is repeated-interaction coverage, not 30 unique-input quality coverage. See [C001/VERIFICATION.md](../C001/VERIFICATION.md).
- The earlier first P124 attempt at `6e8b2eeb381874a12be041fa080fb545b5e1fb82` traversed the 31-case test list but failed its ten-proposal threshold and did not persist a per-case quality report. It cannot be promoted to C005 evidence.

## Current exact-SHA run — in progress

- Windows Electron/Qwen3 run [43702880160](https://github.com/hibi89/astra_pdf_redesigner/actions/runs/43702880160) targets code/test SHA `5b323fd47d0c2cd2efb20a136102ee65b3bb7af2`.
- At 2026-11-15 11:42 UTC (about 90 minutes after the job began), GitHub still reports the P124/C005 real-model step `in_progress`; no artifacts or terminal result are available. The GitHub job-log endpoint returned 404 while the job is active, so per-input progress is unavailable.
- The run exercises all 31 distinct synthetic inputs in each of BASIC, PRO, and BUSINESS (93 unique-input real inference calls), through the product Electron Workspace. Its evidence may address unique-input coverage, but cannot establish an 8-GiB-class runner profile.

No C005 score is claimed while this run is pending or for any result on a 16-GiB-class host. No user PC was accessed, and no memory/performance result is extrapolated to an 8-GiB buyer device. The 8-GiB acceptance remains BLOCKED.
