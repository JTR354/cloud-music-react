import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import Home from '../application/Home';
import Rank from '../application/Rank';
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
    errorElement: <h1>404</h1>,
    children: [
      {
        index: true,
        element: <Navigate to="/recommend" />,
      },
      {
        path: '/recommend',
        Component: Recommend,
      },
      {
        path: '/singers',
        Component: Singers,
      },
      {
        path: 'rank',
        Component: Rank,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
