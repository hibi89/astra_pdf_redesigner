'use strict';
// Expose exactly one bounded, application-owned operation. Never expose
// Node.js, Electron internals, file paths, arbitrary IPC or the filesystem.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('astraDesktop',Object.freeze({
  savePdf:()=>ipcRenderer.invoke('astra:save-pdf'),
}));
