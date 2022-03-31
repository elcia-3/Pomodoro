import { useState, useEffect } from "react";


export default function Home() {
  // 初回のイベント
  useEffect(() => {
    console.log("useEffect");
  }, []);

  // ボタンイベント
  const dialogAction = async (event) => {
    console.log("dialogAction");
    await window.electron.dialogMsg("テストだよ");
  };

  return (
    <div className="main">
      <h1 id="test">
        右クリックサンプル
      </h1>

      <button id="test_button" type="button" onClick={dialogAction}>
        TEST
      </button>

      <style jsx>{`
        h1 {
          font-size: 20px;
        }
      `}</style>
      <style jsx global>{`
        body {
          background-color: white;
        }
      `}</style>
    </div>
  );
}