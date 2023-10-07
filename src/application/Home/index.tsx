import { useCallback } from 'react';
import type { NavLinkProps } from 'react-router-dom';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import Player from '../Player';
import { Tab, TabItem, Top } from './style';
type ActiveType = Parameters<
  Exclude<NavLinkProps['className'], undefined | string>
>[0];
const Home = () => {
  console.log(Home.name);
  const active = useCallback(({ isActive, isPending }: ActiveType) => {
    return isPending ? 'pending' : isActive ? 'selected' : '';
  }, []);
  const navigate = useNavigate();
  return (
    <div>
      <Player />
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span
          className="iconfont search"
          onClick={() => {
            navigate('/search');
          }}
        >
          &#xe62b;
        </span>
      </Top>
      <Tab>
        <NavLink to="/recommend" className={active}>
          <TabItem>
            <span> 推荐 </span>
          </TabItem>
        </NavLink>
        <NavLink to="/singers" className={active}>
          <TabItem>
            <span> 歌手 </span>
          </TabItem>
        </NavLink>
        <NavLink to="/rank" className={active}>
          <TabItem>
            <span> 排行榜 </span>
          </TabItem>
        </NavLink>
      </Tab>
      <Outlet />
    </div>
  );
};

export default Home;
