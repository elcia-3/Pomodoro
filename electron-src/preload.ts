import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld("electron", {
  dialogMsg: async (data:any) => await ipcRenderer.invoke("dialogMsg", data),
  testdb: async () => await ipcRenderer.invoke("testdb"),
  dbupdate: async () => await ipcRenderer.invoke("dbupdate"),
  getAllData: async () => await ipcRenderer.invoke("getAllData"),
});