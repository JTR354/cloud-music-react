import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import Album from '../application/Album';
import Home from '../application/Home';
import Rank from '../application/Rank';
import Recommend from '../application/Recommend';
import Search from '../application/Search';
import Singer from '../application/Singer';
import Singers from '../application/Singers';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
    children: [
      {
        index: true,
        element: <Navigate to="/recommend" />,
      },
      {
        path: '/recommend',
        Component: Recommend,
        children: [
          {
            path: ':id',
            Component: Album,
          },
        ],
      },
      {
        path: '/singers',
        Component: Singers,
        children: [
          {
            path: '/singers/:id',
            Component: Singer,
          },
        ],
      },
      {
        path: '/rank',
        Component: Rank,
        children: [
          {
            path: '/rank/:id',
            Component: Album,
          },
        ],
      },
      {
        path: '/search',
        Component: Search,
      },
      {
        path: '/album/:id',
        Component: Album,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
