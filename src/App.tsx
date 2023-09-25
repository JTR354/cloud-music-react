import { useState } from 'react';
import styled from 'styled-components';

import { IconStyle } from './assets/iconfont/iconfont';
import { GlobalStyle } from './style';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

const IconSearch = styled.div`
  font-family: 'iconfont';
  &::before {
    content: '\\e619';
  }
`;

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <GlobalStyle />
      <IconStyle />
      <h1>Vite + React</h1>
      <IconSearch />
      {/* <i className="iconfont">&#xe619;</i> */}
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
