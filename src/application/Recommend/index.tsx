import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getBannerRequest, getRecommendListRequest } from '../../api/request';
import RecommendList from '../../components/list';
import Scroll from '../../components/scroll';
import Slider from '../../components/slider';
import type { RootState } from '../../store';
import { updateBranchList, updateRecommendList } from './slice';
import { Content } from './style';

export default function Counter() {
  const { bannerList, recommendList } = useSelector((state: RootState) => {
    return state.recommend;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    !bannerList.length &&
      getBannerRequest().then((res) => {
        dispatch(updateBranchList(res?.banners || []));
      });
    !recommendList.length &&
      getRecommendListRequest().then((res) => {
        dispatch(updateRecommendList(res?.result || []));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content>
      <Scroll>
        <Slider bannerList={bannerList} />
        <RecommendList recommendList={recommendList}></RecommendList>
      </Scroll>
    </Content>
  );
}
