import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { alphaTypes, categoryTypes } from '../../api/config';
import {
  getHotSingerListRequest,
  getSingerListRequest,
} from '../../api/request';
import Horizon from '../../baseUI/horizon-item';
import Loading from '../../baseUI/loading';
import { RootState } from '../../store';
import SignerList from './singer-list';
import {
  changeEnterLoading,
  changePageCount,
  changePullDownLoading,
  changePullUpLoading,
  changeSingerList,
} from './slice';
import { NavContainer } from './style';

const Singers = () => {
  // console.log(Singers.name);
  const [category, setCategory] = useState('');
  const [alpha, setAlpha] = useState('');

  const {
    singerList,
    pageCount,
    pullDownLoading,
    pullUpLoading,
    enterLoading,
  } = useSelector((state: RootState) => {
    return state.singers;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeEnterLoading(true));
    getHotSingerListRequest(0)
      .then((res) => {
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        console.log(data);
        dispatch(changePullDownLoading(false));
      })
      .catch(() => {
        console.log('热门歌手数据获取失败');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateAlpha = (val: string) => {
    setAlpha(val);
    dispatch(changePageCount(0));
    dispatch(changeEnterLoading(true));
    getSingerListRequest(category, val, pageCount)
      .then((res) => {
        dispatch(changeSingerList(res.artists));
        dispatch(changeEnterLoading(false));
      })
      .catch(() => {
        console.log('歌手数据获取失败');
      });
  };

  const handleUpdateCategory = (val: string) => {
    setCategory(val);
    dispatch(changePageCount(0));
    dispatch(changeEnterLoading(true));
    getSingerListRequest(val, alpha, pageCount)
      .then((res) => {
        dispatch(changeSingerList(res.artists));
        dispatch(changeEnterLoading(false));
      })
      .catch(() => {
        console.log('歌手数据获取失败');
      });
  };

  const pullDown = () => {
    console.log(pullDown.name);
    dispatch(changePullDownLoading(true));
    dispatch(changePageCount(0));
    if (category === '' && alpha === '') {
      getHotSingerListRequest(0)
        .then((res) => {
          const data = [...singerList, ...res.artists];
          dispatch(changeSingerList(data));
          dispatch(changePullDownLoading(false));
        })
        .catch(() => {
          console.log('热门歌手数据获取失败');
        });
    } else {
      getSingerListRequest(category, alpha, pageCount)
        .then((res) => {
          const data = [...singerList, ...res.artists];
          dispatch(changeSingerList(data));
          dispatch(changePullDownLoading(false));
        })
        .catch(() => {
          console.log('歌手数据获取失败');
        });
    }
  };
  // 滑到最底部刷新部分的处理
  const pullUp = () => {
    console.log(pullUp.name);
    const count = pageCount + 1;
    dispatch(changePullUpLoading(true));
    dispatch(changePageCount(count));
    if (category === '') {
      getHotSingerListRequest(count)
        .then((res) => {
          const data = [...singerList, ...res.artists];
          dispatch(changeSingerList(data));
          dispatch(changePullUpLoading(false));
        })
        .catch(() => {
          console.log('热门歌手数据获取失败');
        });
    } else {
      getSingerListRequest(category, alpha, count)
        .then((res) => {
          const data = [...singerList, ...res.artists];
          dispatch(changeSingerList(data));
          dispatch(changePullUpLoading(false));
        })
        .catch(() => {
          console.log('歌手数据获取失败');
        });
    }
  };
  console.log(enterLoading, 123);

  return (
    <div>
      <NavContainer>
        <Horizon
          list={categoryTypes}
          title={'分类 (默认热门):'}
          handleClick={handleUpdateCategory}
          oldVal={category}
        ></Horizon>
        <Horizon
          list={alphaTypes}
          title={'首字母:'}
          handleClick={(val) => {
            return handleUpdateAlpha(val);
          }}
          oldVal={alpha}
        ></Horizon>
      </NavContainer>
      <SignerList
        pullDown={pullDown}
        pullUp={pullUp}
        pullUpLoading={pullDownLoading}
        pullDownLoading={pullUpLoading}
        singerList={singerList}
      >
        <Loading show={enterLoading} />
      </SignerList>
    </div>
  );
};

export default Singers;
