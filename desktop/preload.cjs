'use strict';
// Expose exactly one bounded, application-owned operation. Never expose
// Node.js, Electron internals, file paths, arbitrary IPC or the filesystem.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('astraDesktop',Object.freeze({
  savePdf:(expectedTextMarkers,expectedRasterImages,licenseContext)=>ipcRenderer.invoke('astra:save-pdf',expectedTextMarkers,expectedRasterImages,licenseContext),
  localModelStatus:()=>ipcRenderer.invoke('astra:local-model-status'),
  localModelPropose:(text,explicitConsent)=>ipcRenderer.invoke('astra:local-model-propose',text,explicitConsent),
  localModelCancel:()=>ipcRenderer.invoke('astra:local-model-cancel'),
  localOcrStatus:()=>ipcRenderer.invoke('astra:local-ocr-status'),
  localOcrRecognizePng:(bytes,layoutMode)=>ipcRenderer.invoke('astra:local-ocr-recognize',bytes,layoutMode),
  localOcrCancel:()=>ipcRenderer.invoke('astra:local-ocr-cancel'),
}));
