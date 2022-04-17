import React,{ useState, useEffect } from 'react';
import { work_icon, rest_icon, stop_icon } from '../components/icon'
import css from '../styles/index.module.css'
import Heatmap from '../components/heatmap'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';


type Datas = {count: number, date: string, id:number}[]

const Element: React.FC<Datas> = () => {
    const BeginDate = new Date();
    let [cliantJson, setCliantJson] = useState<Datas>(null);
    BeginDate.setMonth(BeginDate.getMonth() - 11);
    BeginDate.setDate(1);
    let [TodaysPomodoroCount, setTodaysPomodoroCount] = useState("00");
     useEffect(() => {
        window.electron.getAllData().then(result =>{
            setCliantJson(result);
            if( result[result.length - 1] !== undefined){
                setTodaysPomodoroCount(result[result.length - 1].count === undefined ? "0" : ("0" +  String(result[result.length - 1].count)).slice(-2) );
            }
        }) 
    }, []);


    function jsonNullCheck(){
       if(cliantJson == null){
           return;
       }else
       {
            return(
                <Heatmap
                beginDate={(BeginDate)} // optional
                data={cliantJson}
                />
           )
       }
    }


    //time variable
    let [count, setCount] = useState(1500);
    let minute: string = `0${Math.floor(count / 60)}`.slice(-2);
    let second: string = `0${count % 60}`.slice(-2);
    const workTime: number = 1500;
    const breakTime: number = 300;
    
    //status = 0 initialStatus; status = 1 workTime; status = 2 breakTime
    let [status, setStatus] = useState(0);
    let [stopCount, setStopCount] = useState(null);



    //notification
    const startNotification = async () => {
        await window.electron.dialogMsg("Work Time");
    };

    const finishNotification = async () => {
        await window.electron.dialogMsg("Break Time");
    };

    const stopCountNotification = async () => {
        await window.electron.dialogMsg("Stop Pomodoro");
    };


    //audio
    const [volume, setVolume] = React.useState(50);
    const handleChange = (event, newValue) => {
        setVolume(newValue);
    };

    function startmp3(){
        let startAudio = new Audio()
        startAudio.src = "./music/bell.mp3" 
        startAudio.volume = volume/100;
        startAudio.play()
    }

    function finishmp3(){
        let finishAudio = new Audio()
        finishAudio.src = "./music/gong.mp3" 
        finishAudio.volume = volume/100
        finishAudio.play()
    }

    function stopmp3(){
        let stopAudio = new Audio()
        stopAudio.src = "./music/jingle.mp3" 
        stopAudio.volume = volume/100
        stopAudio.play()
    }
 


    //DataBase
    const dbupdate = async () => {
        console.log("dbupdate");
        await window.electron.dbupdate();
    };

    function addPomodoroCount(){
        dbupdate();
        const currentDate = new Date();
        const dateChange: string = ( String(currentDate.getFullYear()) + "-" + ("0" + String(currentDate.getMonth() + 1 )).slice(-2) + "-" + ("0" + String(currentDate.getDate())).slice(-2));
        if(cliantJson[cliantJson.length - 1] == null){
            cliantJson.push( {date: dateChange, count: 1 , id: 1234567})
        }else{
            if (dateChange == cliantJson[cliantJson.length -1].date){
                cliantJson[cliantJson.length -1].count++;
            }else{
                cliantJson.push( {date: dateChange, count: 1 , id: 1234567})
            }
        }
        setTodaysPomodoroCount(("0" + String(cliantJson[cliantJson.length -1].count)).slice(-2));
    }
 
 


    //Timer
    function setTime(time){
        setCount(time);
    }

    function countdown(){
        setCount(count - 1);
    }



    useEffect(() => {
        if(status !== 0){
            if (count >= 0 && (status === 1 || status === 2 )) {
                const timerId = setInterval(countdown, 1000);
                return () => clearInterval(timerId);
            }
            if (count <= 0) {
                if(stopCount == true){
                    setTime(workTime)
                    setStatus(0);
                    setStopCount(null);
                    stopCountNotification();
                    stopmp3();
                    if (status === 1) {
                        addPomodoroCount();
                    }
                }else{
                    if (status === 1) {
                        setTime(breakTime)
                        setStatus(2);
                        finishNotification();
                        finishmp3();
                        addPomodoroCount();
                    } else if (status === 2) {
                        setTime(workTime)
                        setStatus(1);
                        startNotification();
                        startmp3();
                    }
                }
           }
        }
    },);


    function StatusManagement(){
        switch(status){
            case 0:
                setTime(workTime);  
                setStatus(1); 
                break;
            case 1:
            case 2:
                stopCount === null ? setStopCount(true) : setStopCount(null);
                break;
        }
    }

    const work_color: string = "#ff4d2d";
    const rest_color: string = "#11ad11";
    const stop_color: string = "#214098";
    let gauge = Math.floor( count / (status === 1 ? workTime/25 : breakTime/25));

    const dots = () => {
        const range = (start: number, end: number) => [...Array((end - start) + 1)].map((_, i) => start + i);
       return (
            <>
                {
                    range(0, 24).map((num) => {
                        let angle = Math.PI / 12.5;
                        let x: number = Math.sin(angle * num);
                        let y: number = -Math.cos(angle * num);
                        let left: string = `calc(50% + calc(45% * ${x}))`;
                        let top: string = `calc(50% + calc(45% * ${y}))`;
                        let light: boolean = num <= gauge;
                        let color: string = status === 2 ? rest_color : work_color;

                        if (light) {
                            return (
                                <>
                                    <div
                                        key={`dot_${num}`}
                                        className={num % 5 == 0 ? "dot big" : "dot"}
                                        style={{ left: left, top: top, backgroundColor: color }}>
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <div
                                    key={`dot_${num}`}
                                    className={num % 5 == 0 ? "dot big" : "dot"}
                                    style={{ left: left, top: top }}>
                                </div>
                            )
                        }
                    })
                }
            </>
        )
    }


    const information_area = () => {
        let work_icon_color: string = status === 1 ? work_color : "#c0c0c0";
        let rest_icon_color: string = status === 2 ? rest_color : "#c0c0c0";
        let stop_icon_color: string = stopCount === true ? stop_color : "#c0c0c0";

        return (
            <div className="information-area">
                <p className="laps-text">Pomo.{TodaysPomodoroCount}</p>
                <p className="remain-text">
                    {minute}:{second}
                </p>
                <hr />
                <div className="icon-box">
                    {work_icon({ fill: work_icon_color })}
                    {rest_icon({ fill: rest_icon_color })}
                    {stop_icon({ fill: stop_icon_color })}
                </div>
            </div>
        );
    }
    return (
        <>
          <div className={css.content}>

           <div className={css.calndar} onClick={() => { StatusManagement(); }}>
            <div className="square">
                {dots()}
                {information_area()}
              </div>
           </div>
            <Box sx={{ width: 200 }}>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <VolumeDown />
                <Slider aria-label="Volume" value={volume} onChange={handleChange} />
                <VolumeUp />
            </Stack>
            </Box>
            {jsonNullCheck()}
         </div>
       </>
    )
}

export default Element;