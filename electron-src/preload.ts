import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld("electron", {
  dialogMsg: async (data:any) => await ipcRenderer.invoke("dialogMsg", data),
  testdb: async (data:any) => await ipcRenderer.invoke("testdb", data),
  dbupdate: async (data:any) => await ipcRenderer.invoke("dbupdate", data),
  getAllData: async (data:any) => await ipcRenderer.invoke("getAllData", data),
});