import * as fs from 'fs'
import { GetStaticProps } from 'next'
import * as path from 'path'

type Datas = {datas:Data[]}
type Data = { count: number, date: string }
type Game = { id: string, title: string }
type PageProps = { games: Game[] }

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  // JSON ファイルを読み込む
  const jsonPath = path.join(process.cwd(), 'database',  'datas.json')
  const jsonText = fs.readFileSync(jsonPath, 'utf-8')
  const games = JSON.parse(jsonText) as Game[]

  // ページコンポーネントに渡す props オブジェクトを設定する
  return {
    props: { games }
  }
}

const GamesPage: React.FC<PageProps> = ({ games }: PageProps) => {
    return(
        <>{games}</>
    )

}