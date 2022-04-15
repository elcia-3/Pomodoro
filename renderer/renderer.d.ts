export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
  dialogMsg: (data:any) => Promise<void>,
  testdb: () => Promise<void>,
  dbupdate: () => Promise<void>,
  getAllData: () => Promise<void>,
  onUpdateCounter: () => Promise<void>,
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}