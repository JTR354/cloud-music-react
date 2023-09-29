import { Provider } from 'react-redux';

import { IconStyle } from './assets/iconfont/iconfont';
import Router from './routes';
import { store } from './store';
import { GlobalStyle } from './style';

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <IconStyle />
      <Router />
    </Provider>
  );
}

export default App;
