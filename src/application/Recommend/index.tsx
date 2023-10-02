import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getBannerRequest, getRecommendListRequest } from '../../api/request';
import Loading from '../../baseUI/loading';
import Scroll from '../../baseUI/scroll';
import RecommendList from '../../components/list';
import Slider from '../../components/slider';
import type { RootState } from '../../store';
import { updateBranchList, updateRecommendList } from './slice';
import { Content } from './style';

const Recommend = () => {
  console.info(Recommend.name);
  const { bannerList, recommendList } = useSelector((state: RootState) => {
    return state.recommend;
  });
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(
    !bannerList.length || !recommendList.length
  );

  useEffect(() => {
    let count = 0;
    function end() {
      count++;
      if (count >= 2) {
        setLoading(false);
      }
    }
    !bannerList.length &&
      getBannerRequest().then((res) => {
        dispatch(updateBranchList(res?.banners));
        end();
      });
    !recommendList.length &&
      getRecommendListRequest().then((res) => {
        dispatch(updateRecommendList(res?.result));
        end();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content>
      {loading && <Loading />}
      <Scroll>
        <div>
          <div className="before"></div>
          <Slider bannerList={bannerList} />
          <RecommendList recommendList={recommendList}></RecommendList>
        </div>
      </Scroll>
    </Content>
  );
};

export default Recommend;
