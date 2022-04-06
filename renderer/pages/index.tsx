import Clock from '../components/Clock'
import Link from 'next/link'
import { BrowserWindow } from 'electron';

export default function test() {
 return (
    <>
      <Clock></Clock>

     <div>
     <Link href="/Notification">
      <a>通知テスト</a>
     </Link>
     </div>
     <div>
     <Link href="/db">
      <a>dbTest</a>
     </Link>
     </div>
     <div>
     <Link href="/heatmap">
      <a>heatmaptest</a>
     </Link>
     </div>





   </>
  )
}