import { work_icon, rest_icon } from '../components/icon'

const Clock: React.FC = () => {
    const dots = () => {
        const range = (start: number, end: number) => [...Array((end - start) + 1)].map((_, i) => start + i);
        let gauge = Math.floor(1500 / 300);

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
                        const work_color: string = "#ff4d2d"; 
                        let color: string =  work_color;

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
        let laps: string = `0${state.lap_count}`.slice(-2);

        let minute: string = `0${Math.floor(state.remain / 60)}`.slice(-2);
        let second: string = `0${state.remain % 60}`.slice(-2);

        let work_icon_color: string = state.pomo === "work" ? work_color : "#c0c0c0";
        let rest_icon_color: string = state.pomo === "rest" ? rest_color : "#c0c0c0";

        return (
            <div className="information-area">
                <p className="laps-text">{`Pomo.${laps}`}</p>
                <p className="remain-text">{`${minute}:${second}`}</p>
                <hr />
                <div className="icon-box">
                    {work_icon({ fill: work_icon_color })}
                    {rest_icon({ fill: rest_icon_color })}
                </div>
            </div>
        );
    }


    return (
        <div id="clock">
            {dots()}
        </div>
    );
}
export default Clock;