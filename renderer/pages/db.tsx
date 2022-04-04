import { useState,useEffect } from 'react'
import Router from 'next/router'
const IndexPage = () => {

 const dialogAction = async () => {
    console.log("testdb");
    await window.electron.testdb("テストだよ");
  };


  return (
      <>
        <h1>登録ページ</h1>
      <button id="test_button" type="button" onClick={dialogAction}>
        TEST
      </button>


      </>
  )
}
export default IndexPage