import Clock from '../components/Clock'
import Link from 'next/link'
import { BrowserWindow } from 'electron';

export default function test() {
 return (
    <>
      <Clock></Clock>

     <Link href="/Notification">
      <a>通知テスト</a>
     </Link>

   </>
  )
}