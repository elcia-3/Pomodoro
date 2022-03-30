import css from '../public/styles/clock.module.css'
import React,{ useState, useEffect } from 'react';

export default function clock() {
    let [count, setCount] = useState(0);
    let minute: string = `0${Math.floor(count / 60)}`.slice(-2);
    let second: string = `0${count % 60}`.slice(-2);
    const workTime: number = 1500;
    const breakTime: number = 300;
    
    //status = 0 initialStatus; status = 1 workTime; status = 2 breakTime
    let [status, setStatus] = useState(0);
        

    function setTime(time){
        setCount(time);
    }

    function countdown(){
        setCount(count - 1);
    }

    useEffect(() => {
        if (count >= 0 && (status === 1 || status === 2 )) {
            const timerId = setInterval(countdown, 1000);
            return () => clearInterval(timerId);
        }
        if (count <= 0) {
            if (status === 1) {
                setTime(breakTime)
                setStatus(2);
            } else if (status === 2) {
                setTime(workTime)
                setStatus(1);
            }
       }
    }, );


    return (
        <>
            <button onClick={() => { setTime(workTime);  setStatus(1); }} >スタート</button>
            <div className={css.time}>
                {minute}:{second}
            </div>
        </>
    )
}