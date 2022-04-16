type Datas = {count: number, date: string, id:number}[]
type Data = { count: number, date: string, id:number }


export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
  dialogMsg: (data:any) => Promise<void>,
  testdb: () => Promise<void>,
  dbupdate: () => Promise<void>,
  getAllData: () => Promise<Datas>,
  onUpdateCounter: () => Promise<void>,
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}