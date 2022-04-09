
import css from '../styles/clock.module.css'
import React,{ useState, useEffect } from 'react';
import * as fs from 'fs'
import { GetStaticProps } from 'next'
import * as path from 'path'
import Heatmap from '../components/heatmap'
import { work_icon, rest_icon } from '../components/icon'

type Json = {json: Datas}
type Datas = {datas:Data[]}
type Data = { count: number, date: string, id:number }


export const getStaticProps: GetStaticProps<Json> = async (context) => {
  // JSON ファイルを読み込む
  const jsonPath = path.join(process.cwd(), 'database',  'datas.json')
  const jsonText = fs.readFileSync(jsonPath, 'utf-8')
  const json = JSON.parse(jsonText) as Datas

  // ページコンポーネントに渡す props オブジェクトを設定する
  return {
    props: { json}
  }
}


const GamesPage: React.FC<Json> = ({ json }: Json) => {
    //time variable
    let [count, setCount] = useState(1500);
    let minute: string = `0${Math.floor(count / 60)}`.slice(-2);
    let second: string = `0${count % 60}`.slice(-2);
    const workTime: number = 10;
    const breakTime: number = 5;
    
    //status = 0 initialStatus; status = 1 workTime; status = 2 breakTime
    let [status, setStatus] = useState(0);


    const BeginDate = new Date();
    BeginDate.setMonth(BeginDate.getMonth() - 11);
    BeginDate.setDate(1);
    let [cliantJson, setCliantJson] = useState(json);
    let [TodaysPomodoroCount, setTodaysPomodoroCount] = useState(cliantJson.datas[cliantJson.datas.length -1] == null ? "0" : ("0" +  String(cliantJson.datas[cliantJson.datas.length -1].count)).slice(-2) );




    //notification
    const startNotification = async () => {
        console.log("start");
        await window.electron.dialogMsg("Work Time");
    };

    const finishNotification = async () => {
        console.log("start");
        await window.electron.dialogMsg("Break Time");
    };



    //audio
    function startmp3(){
        let startAudio = new Audio()
        startAudio.src = "/music/bell.mp3" 
        startAudio.volume = 0.5
        startAudio.play()
    }

    function finishmp3(){
        let finishAudio = new Audio()
        finishAudio.src = "/music/gong.mp3" 
        finishAudio.volume = 0.5
        finishAudio.play()
    }



    //DataBase
    const dialogAction = async () => {
        console.log("dialogAction");
        await window.electron.testdb();
    };

    const dbupdate = async () => {
        console.log("dbupdate");
        await window.electron.dbupdate();
    };

 


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
                if (status === 1) {
                    setTime(breakTime)
                    setStatus(2);
                    finishNotification();
                    finishmp3();
                    dbupdate();

                    const currentDate = new Date();
                    const dateChange: string = ( String(currentDate.getFullYear()) + "-" + ("0" + String(currentDate.getMonth() + 1 )).slice(-2) + "-" + ("0" + String(currentDate.getDate())).slice(-2));
                    if(cliantJson.datas[cliantJson.datas.length - 1] == null){
                        cliantJson.datas.push( {date: dateChange, count: 1 , id: 1234567})
                    }else{
                        if (dateChange == cliantJson.datas[cliantJson.datas.length -1].date){
                            cliantJson.datas[cliantJson.datas.length -1].count++;
                        }else{
                            cliantJson.datas.push( {date: dateChange, count: 1 , id: 1234567})
                        }
                    }

                    setTodaysPomodoroCount(("0" + String(cliantJson.datas[cliantJson.datas.length -1].count)).slice(-2));

                    
                } else if (status === 2) {
                    setTime(workTime)
                    setStatus(1);
                    startNotification();
                    startmp3();
                }
            }
        }
    },);


    const work_color: string = "#ff4d2d";
    const rest_color: string = "#11ad11";
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
                </div>
            </div>
        );
    }




    return (
        <>
            <Heatmap
            beginDate={(BeginDate)} // optional
            data={cliantJson.datas}
            />
 
            <div>workTime:{workTime}</div>
            <div>breakTime:{breakTime}</div>
            <div>count:{count}</div>
            <div>gauge:{gauge}</div>

            <button onClick={() => { setTime(workTime);  setStatus(1); }} >スタート</button>
            <button onClick={() => { setTime(breakTime);  setStatus(2); }} >status2 </button>
            <div className="square">
                {dots()}
                {information_area()}
            </div>
 
       </>
    )
}

export default GamesPage;