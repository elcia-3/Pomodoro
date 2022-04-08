import * as fs from 'fs'
import { GetStaticProps } from 'next'
import * as path from 'path'

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
    return(
        <>
            <div>u.gg</div>
            {json.datas[0].id}
        </>
    )
  // ...
}

export default GamesPage;