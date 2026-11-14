'use strict';
// P110: Electron-native PDF save IPC may be reached only from the exact
// top-level trusted window. Customer release is still on HOLD: this is not DRM.
const APP_DOCUMENT='astra://app/index.html';
const CUSTOMER_NATIVE_PDF_MODE=false;
function deny(){throw Error('Blocked untrusted PDF export request');}
function assertTrustedPdfSaveRequest(event,mainWindow){
 if(CUSTOMER_NATIVE_PDF_MODE)deny(); // Any future customer build must first add independent main-process entitlement verification.
 if(!mainWindow||typeof mainWindow.isDestroyed!=='function'||mainWindow.isDestroyed())deny();
 const contents=mainWindow.webContents;
 if(!contents||typeof contents.isDestroyed!=='function'||contents.isDestroyed())deny();
 if(!event||event.sender!==contents||!event.senderFrame||!contents.mainFrame||
    event.senderFrame!==contents.mainFrame)deny();
 // A custom-scheme host prefix match is not enough; no subframe, query, fragment,
 // alternate path, port, or other origin may authorize the native file write.
 if(event.senderFrame.url!==APP_DOCUMENT||contents.getURL()!==APP_DOCUMENT)deny();
}
module.exports={APP_DOCUMENT,CUSTOMER_NATIVE_PDF_MODE,assertTrustedPdfSaveRequest};
