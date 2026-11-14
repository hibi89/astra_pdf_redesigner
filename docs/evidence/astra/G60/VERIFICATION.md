# G60 — NOT PASSED / BLOCKED

**Date:** 2026-11-15 KST  
**Task-sum at review:** 61/100 after P125 VERIFIED +2.  
**Gate points:** 0; G60 is a threshold gate, not an additional score.

The gate requires supplier-approved Windows Tesseract sourcing and actual Windows/Electron OCR behavior, including real recognition and misrecognition/no-data-mutation evidence. P119 is BLOCKED because the candidate installer lacks a GitHub-published exact binary digest and the available evidence does not establish Authenticode, PE/DLL closure, exact model mapping, or bundle redistribution rights. P120 actual Tesseract kor+eng 12-corpus recognition and P121 Electron subprocess/cancel/cleanup tests were not run.

P125's signed SKU main-process regression and Windows installer workflow do not substitute for OCR. The verified task sum of 61/100 does **not** mean G60 passed. P119/P120/P121 remain BLOCKED +0; `OCR_MANIFEST=null`, official acceptance UNASSESSED, RELEASE HOLD.

**Result:** G60 NOT PASSED. Re-evaluate only when a permitted, rights/hash-verified Windows Tesseract asset and actual Windows runner acceptance are available.
