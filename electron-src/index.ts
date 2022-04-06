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
    width: 1200,
    height: 1000,
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



ipcMain.handle("testdb", (_event) => {
  testDbFunction();
})

ipcMain.handle("dbupdate", (_event) => {
  dbupdate();
})

ipcMain.handle("getAllData", (_event) => {
  getAllData();
})


const db = require('electron-db');
const path = require('path');
const savePath:any = path.join("./database/","");

interface POMODORODATA{
    date: string,
    count:number,
}

export const testDbFunction = () => {
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
};

export const getAllData = () : POMODORODATA[] | boolean => {
    let result : POMODORODATA[] | boolean = false;
  if(db.tableExists('Test',savePath)) {
        //テーブルが存在するならgetAll
        db.getAll( 'Test', savePath ,(success:boolean,contents:POMODORODATA[]) => {
            if(success) {
                console.log("getAll success");
                console.log(contents);
                result = contents;
            } else {
                console.log("getAll failed");
                result = false;
            }
        });
    } else {
        console.log("table is not exist");
        result = false;
    }
    return result;
}

export const dbupdate = () => {
  const currentDate = new Date();
  const today: string = ( String(currentDate.getFullYear()) + "-" + ("0" + String(currentDate.getMonth() + 1 )).slice(-2) + "-" + ("0" + String(currentDate.getDate()).slice(-2)));

  if(db.tableExists('Test',savePath)) {
    db.getRows('Test',savePath ,{date: today},(success:boolean, contents:POMODORODATA[] ) => {
      if(success) {
        console.log("getRows success");
        console.log(contents);
        if(contents.length > 0) {
          let newCount: number = contents[0].count;
          newCount++;
          db.updateRow('Test', savePath, {"date":today}, {"count": newCount },  (successupdaterow:boolean,message:string) => {
            if(successupdaterow) {
              console.log("updateTestData.updateRow success."+message);
            } else {
                console.log("updateTestData.updateRow failed."+message);
            }
          });
        } else {
        let todaysFirstPomodoro : POMODORODATA= {count:1,date:today};
        db.insertTableContent('Test',savePath,todaysFirstPomodoro,(success:boolean,message:string) => {
          if(success) {
              console.log("insertTableContent success : "+message);
          } else {
              console.log("insertTableContent failed : "+message);
          }
        });
        }
      } else {
        console.log("getRows failed");
      }
    });
  }

}