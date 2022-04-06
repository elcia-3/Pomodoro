import { useState,useEffect } from 'react'
import Router from 'next/router'
const IndexPage = () => {

 const dialogAction = async () => {
    console.log("testdb");
    await window.electron.testdb();
  };

 const dbupdate = async () => {
    console.log("testdb");
    await window.electron.dbupdate();
  };

 const getAllData = async () => {
    console.log("testdb");
    await window.electron.getAllData();
  };





  return (
      <>
        <h1>登録ページ</h1>
      <button id="test_button" type="button" onClick={dialogAction}>
        dialogAction
      </button>

      <button id="test1" type="button" onClick={getAllData}>
        getAllData
      </button>



      <button id="test1" type="button" onClick={dbupdate}>
        dbupdate
      </button>




      </>
  )
}
export default IndexPage