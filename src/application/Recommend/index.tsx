import { useDispatch, useSelector } from 'react-redux';

import RecommendList from '../../components/list';
import Slider from '../../components/slider';
import type { RootState } from '../../store';
import { decrement, increment } from './slice';

export default function Counter() {
  const count = useSelector((state: RootState) => {
    return state.counter.value;
  });
  const dispatch = useDispatch();

  const bannerList = [1, 2, 3, 4].map(() => {
    return {
      imageUrl:
        'http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg',
    };
  });

  const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => {
    return {
      id: 1,
      picUrl:
        'https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg',
      playCount: 17171122,
      name: '朴树、许巍、李健、郑钧、老狼、赵雷',
    };
  });
  return (
    <div>
      <Slider bannerList={bannerList} />
      <RecommendList recommendList={recommendList}></RecommendList>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => {
            return dispatch(increment());
          }}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => {
            return dispatch(decrement());
          }}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
