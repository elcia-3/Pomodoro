import * as fs from 'fs'
import { GetServerSideProps, GetStaticProps } from 'next'
import * as path from 'path'
import Heatmap from '../components/heatmap'
import Clock from '../components/Clock'


type Json = {json: Datas}
type Datas = {datas:Data[]}
type Data = { count: number, date: string, id:number }


export const getStaticProps: GetServerSideProps<Json> = async (context) => {
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
    const BeginDate = new Date();
    BeginDate.setMonth(BeginDate.getMonth() - 11);
    BeginDate.setDate(1);
    const EndDate = new Date();


    return(
        <>
            <Clock></Clock>
            <Heatmap
            beginDate={(BeginDate)} // optional
            endDate={EndDate}   // optional
            data={json.datas}
            />
        </>
    )
  // ...
}

export default GamesPage;