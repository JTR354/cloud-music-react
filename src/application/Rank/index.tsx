import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import { getRankListRequest } from '../../api/request';
import { filterIndex } from '../../api/utils';
import Loading from '../../baseUI/loading';
import Scroll from '../../baseUI/scroll';
import { RootState } from '../../store';
import RankList from './RankList';
import { changeRankList, RankItem } from './slice';
import { Container } from './style';

const Rank = () => {
  // console.log(Rank.name);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const { rankList } = useSelector((state: RootState) => {
    return state.rank;
  });

  useEffect(() => {
    if (rankList.length) return;
    setLoading(true);

    getRankListRequest()
      .then((data) => {
        const list = data?.list || [];
        dispatch(changeRankList(list));
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 榜单数据未加载出来之前都给隐藏
  const displayStyle = loading ? { display: 'none' } : { display: '' };
  const globalStartIndex = filterIndex(rankList);
  const officialList = rankList.slice(0, globalStartIndex);
  const globalList = rankList.slice(globalStartIndex);

  const navigate = useNavigate();

  const enterDetail = (item: RankItem) => {
    navigate(`/rank/${item.id}`);
  };

  return (
    <>
      <Container>
        <Scroll>
          <div>
            <h1 className="official" style={displayStyle}>
              官方榜
            </h1>
            <RankList list={officialList} onClick={enterDetail} />
            <h1 className="global" style={displayStyle}>
              全球榜
            </h1>
            <RankList list={globalList} global={true} onClick={enterDetail} />
            <Loading show={loading}></Loading>
          </div>
        </Scroll>
        <Outlet />
      </Container>
    </>
  );
};

export default Rank;
