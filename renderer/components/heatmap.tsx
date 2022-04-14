import Calendar from './Calendar';
import { DATE_FORMAT, initArray } from "./utils";

import css from '../styles/heatmap.module.css'
import Legend from './Legend';

type data = {
  date:String
  count:number
  id?:number
}

type Props = {
    beginDate:any
    endDate?:any
    data:data[]
}

export default function Heatmap (props: Props){

  const moment = require("moment");
  const ROW_HEADERS = ["", "Mon", "", "Wed", "", "Fri", ""]
  const COLORS = ["#eee", "#5dba6b", "#329d52", "#117c3d", "#006031", "#2BA5C3", "#197EB7", "#1E50A3", "#192B88", "#192B88", "#F58619", "#E06205", "#BD4300", "#8F2D00"  ]

  function calendar(){
    const calendar = new Calendar(props.beginDate, props.endDate)
    paddingCalendar(calendar, props.beginDate, props.endDate, props.data);
    return calendar;
  }

  function paddingCalendar(calendar, beginDate, endDate, data) {
    const stopper = moment(endDate)
    for (let cursor = moment(beginDate); cursor.isSameOrBefore(stopper); cursor.add(1, 'days')) {
      let key = cursor.format(DATE_FORMAT)
      let entry = data.find((element) => element.date == key)
      calendar.set(cursor, {
        title: `${key} : ${(entry && entry.count) || 0}`,
        count: `${(entry && entry.count) || 0}`
      })
    }
  }

  function renderHeader([monthName, colNum], i) {
    return <td
      key={ `head-${i}` }
      className={css.columnHeader}
      colSpan={ colNum }>{ monthName }</td>
  }

  function renderRow(row, i) {
    return <tr key={ `row${i}` }>
      <td className={css.rowHeader}>
        { ROW_HEADERS[i] }
      </td>
      { row.map((cell, k) => renderCell(cell, i, k)) }
    </tr>
  }

  function renderCell(cell, i, j) {
    const {title} = (cell || {});
    const {count} = (cell || {});
    let style = "level" + String(count);
    if(count >= 12){
      style = "level12";
    }

    return <td key={ `cell${i}-${j}` } title={ title } className={css[style]}> <div className={css.balloon}>{count} </div></td>
  }


  const object = calendar();

  return(
    <>
      <div className={ css.outline }>
        <table className={ css.table }>
          <tbody>
            <tr>
              <td></td>
              { object.header().map(renderHeader) }
            </tr>
            {object.rows().map(renderRow, this)}
          </tbody>
        </table>
      <Legend colors={COLORS} />
      </div>
    </>
  )

}