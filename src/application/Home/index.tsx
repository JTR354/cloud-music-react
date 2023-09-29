import { useCallback } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { Tab, TabItem, Top } from './style';
const Home = () => {
  console.log(Home.name);
  const active = useCallback(
    ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) => {
      return isPending ? 'pending' : isActive ? 'selected' : '';
    },
    []
  );
  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span className="iconfont search">&#xe62b;</span>
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
