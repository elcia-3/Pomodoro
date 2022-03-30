import React,{ useState, useEffect } from 'react';

const MyTimer = () => {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(false);

  const countup = () => {
    setCount(count => count + 1);
  };

  useEffect(() => {
    if (timer) {
      const timerId = setInterval(countup, 1000);
      return () => clearInterval(timerId);
    }
  }, [timer]);

  return (
    <div>
      <h2>My Timer</h2>
      <div>{String(count)}</div>
      <button onClick={() => setTimer(true)}>スタート</button>
      <button onClick={() => setTimer(false)}>ストップ</button>
      <button onClick={() => setCount(0)}>リセット</button>
    </div>
  );
};

export default MyTimer;