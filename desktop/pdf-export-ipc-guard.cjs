'use strict';
// P110/P125: Electron native PDF save is limited to the exact top-level trusted app frame.
// P125 separately verifies the signed SKU in main before a customer-build side effect.
const APP_DOCUMENT='astra://app/index.html';
function deny(){throw Error('Blocked untrusted PDF export request');}
function assertTrustedPdfSaveRequest(event,mainWindow){
 if(!mainWindow||typeof mainWindow.isDestroyed!=='function'||mainWindow.isDestroyed())deny();
 const contents=mainWindow.webContents;
 if(!contents||typeof contents.isDestroyed!=='function'||contents.isDestroyed())deny();
 if(!event||event.sender!==contents||!event.senderFrame||!contents.mainFrame||
    event.senderFrame!==contents.mainFrame)deny();
 if(event.senderFrame.url!==APP_DOCUMENT||contents.getURL()!==APP_DOCUMENT)deny();
}
module.exports={APP_DOCUMENT,assertTrustedPdfSaveRequest};
