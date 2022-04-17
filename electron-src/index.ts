// Native
import { join } from 'path'
import { format } from 'url'
const electron = require('electron')

// Packages
import { BrowserWindow, app, ipcMain, Notification } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  var fs = require('fs');
  var info_path = path.join(app.getPath("userData"), "bounds-info.json");
  var bounds_info : any;
  try {
      bounds_info = JSON.parse(fs.readFileSync(info_path, 'utf8'));
  }
  catch(e) {
      bounds_info = {width: 740, height: 907}; 
  }


  const mainWindow = new BrowserWindow(setWindow())
  mainWindow.on('resize', WindowResize);
  mainWindow.on('close', function() {
    fs.writeFileSync(info_path, JSON.stringify(mainWindow.getBounds()));
    console.log(bounds_info)
  });


  let currentWindowSize = mainWindow.getSize();
  let NextWindowSize =  mainWindow.getSize();

  const Screen = electron.screen

  function WindowResize() {
    NextWindowSize =  mainWindow.getSize();

    const currentDisplay = Screen.getDisplayNearestPoint(Screen.getCursorScreenPoint());
    const size = currentDisplay.size;
    console.log(size.width);
    console.log(size.height);
    if(NextWindowSize[1] < size.height - 100 ){
      if((currentWindowSize[0] < NextWindowSize[0]) || (currentWindowSize[0] > NextWindowSize[0])){
          mainWindow.setSize(NextWindowSize[0],NextWindowSize[0] + 210 ) ;
      }else{
          mainWindow.setSize(NextWindowSize[1] - 210 ,NextWindowSize[1]) ;
      }
    }
    currentWindowSize = mainWindow.getSize();
  }

  function setWindow(){
    return{
      x: bounds_info.x,
      y: bounds_info.y,
      width: bounds_info.width,
      height: bounds_info.height,
      minWidth:740,
      minHeight:907,
      icon: 'images/icon.png',
      title: "Pomodoro",
      useContentSize: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, 'preload.js'),
      },
    }
  }

  testDbFunction();

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
      pathname: join(__dirname, '../renderer/out/index.html'),
      protocol: 'file:',
      slashes: true,
    });
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
  return getAllData();
})



const db = require('electron-db');
const path = require('path');
const savePath:any = path.join("./","");

interface POMODORODATA{
  date: string,
  count:number,
}

export const testDbFunction = () => {
  if(!db.tableExists('PomodoroHistory',savePath)) {
    db.createTable('PomodoroHistory',savePath,(success:boolean,msg:string) => {
      if(success) {
        console.log(msg);
      } else {
        console.log("failed to createTable. "+msg);
      }
    });
  } else {
    console.log("already create PomodoroHistory table");
  }
};

export const getAllData = () : POMODORODATA[] | boolean => {
  let result : POMODORODATA[] | boolean = false;
  if(db.tableExists('PomodoroHistory',savePath)) {
    db.getAll( 'PomodoroHistory', savePath ,(success:boolean,contents:POMODORODATA[]) => {
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
  const today: string = ( String(currentDate.getFullYear()) + "-" + ("0" + String(currentDate.getMonth() + 1 )).slice(-2) + "-" + ("0" + String(currentDate.getDate())).slice(-2));
  if(db.tableExists('PomodoroHistory',savePath)) {
    db.getRows('PomodoroHistory',savePath ,{date: today},(success:boolean, contents:POMODORODATA[] ) => {
      if(success) {
        console.log("getRows success");
        console.log(contents);
        if(contents.length > 0) {
          let newCount: number = contents[0].count;
          newCount++;
          db.updateRow('PomodoroHistory', savePath, {"date":today}, {"count": newCount },  (successupdaterow:boolean,message:string) => {
            if(successupdaterow) {
              console.log("updatePomodoroHistoryData.updateRow success."+message);
            } else {
              console.log("updatePomodoroHistoryData.updateRow failed."+message);
            }
          });
        } else {
        let todaysFirstPomodoro : POMODORODATA= {count:1,date:today};
        db.insertTableContent('PomodoroHistory',savePath,todaysFirstPomodoro,(success:boolean,message:string) => {
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