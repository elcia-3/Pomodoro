// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, Notification } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
      pathname: join(__dirname, '../renderer/out/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  if (isDev) {
    // 開発者ツール
    mainWindow.webContents.openDevTools();
  }
  //delete menu bar
  mainWindow.setMenu(null);

  mainWindow.loadURL(url)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.handle("dialogMsg", (_event,_data) => {
  const NOTIFICATION_TITLE = 'Pomodoro'
  const NOTIFICATION_BODY = _data
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY, silent:  true }).show()
})



ipcMain.handle("testdb", (_event,_data) => {
    testDbFunction();
})

const db = require('electron-db');
const path = require('path');

interface TEST_DATA{
    name: string,
    date: string,
}

export const testDbFunction = () => {
    const savePath:any = path.join("./database/","");
    if(!db.tableExists('Test',savePath)) {
        db.createTable('Test',savePath,(success:boolean,msg:string) => {
            if(success) {
                console.log(msg);
            } else {
                console.log("failed to createTable. "+msg);
            }
        });
    } else {
        console.log("already create Test table");
    }
    //テストデータの挿入
    const current_date = new Date();
    const str_now_time = ('0' + current_date.getHours()).slice(-2) + ":" + ('0' + current_date.getMinutes()).slice(-2);
    let test_data : TEST_DATA= {name:"MSK",date:str_now_time};
    db.insertTableContent('Test',savePath,test_data,(success:boolean,message:string) => {
        if(success) {
            console.log("insertTableContent success : "+message);
        } else {
            console.log("insertTableContent failed : "+message);
        }
    });
    //テスト読み込み
    db.getAll('Test',savePath,(success:boolean,data:any)=> {
        if(success) {
            console.log("getAll success");
            console.log(data);
        } else {
            console.log("getAll failed");
        }
    });
};