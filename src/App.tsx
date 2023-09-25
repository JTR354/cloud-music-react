import { useState } from 'react';

import { GlobalStyle } from './style';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <GlobalStyle />
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            return setCount((count) => {
              return count + 1;
            });
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <a href="#"> 123 link</a>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <i className="iconfont">&#xe62b;</i>
    </>
  );
}

export default App;
