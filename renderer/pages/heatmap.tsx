import HeatMap from '@uiw/react-heat-map';
import '@uiw/react-heat-map/dist.css'
import '@uiw/react-tooltip/dist.css'

import HeatCalendar from 'react-heat-calendar';
import Heatmap from '../components/heatmap'

const value = [
  { date: '2016/01/11', count:2 },
  ...[...Array(17)].map((_, idx) => ({ date: `2016/02/${idx + 10}`, count: idx, })),
  { date: '2016/04/12', count:2 },
  { date: '2016/05/01', count:5 },
  { date: '2016/05/02', count:5 },
  { date: '2016/05/03', count:1 },
  { date: '2016/05/04', count:11 },
  { date: '2016/05/08', count:32 },
];

const Demo = () => {

 const getAllData = async () => {
    console.log("testdb");
    await window.electron.getAllData();
  };

  const data = getAllData();

  return (

    <>

<Heatmap
  beginDate={new Date('2022-01-01')} // optional
  endDate={new Date('2022-12-31')}   // optional
  data={data.Test}
/>





<Heatmap
  beginDate={new Date('2016-01-01')} // optional
  endDate={new Date('2016-12-31')}   // optional
  data={[
    { date: '2016-10-01', count: 1 },
    { date: '2016-10-02', count: 2 },
    { date: '2016-10-03', count: 3 },
    { date: '2016-10-04', count: 4 },
    { date: '2016-10-05', count: 5 },
    { date: '2016-10-06', count: 6 },
    { date: '2016-10-07', count: 7 },
    { date: '2016-10-08', count: 8 },
    { date: '2016-10-09', count: 9 },
    { date: '2016-12-10', count: 10 },
    { date: '2016-12-03', count: 11 },
    { date: '2016-12-04', count: 12 },
    // ...and so on
  ]}
/>

    </>
  )
};



export default Demo;