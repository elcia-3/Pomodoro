/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, contextBridge } from 'electron'



contextBridge.exposeInMainWorld("electron", {
  // レンダラー → メイン
  dialogMsg: async (data:any) => await ipcRenderer.invoke("dialogMsg", data),
});