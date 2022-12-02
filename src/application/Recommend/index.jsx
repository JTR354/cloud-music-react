import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { forceCheck } from 'react-lazyload';

import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';

import Slider from '../../components/slider';
import RecommendList from '../../components/list';

import * as actionTypes from './store/actionCreators';
import { Content } from './style';

function Recommend(props) {
	const { bannerList, recommendList, enterLoading } = useSelector((state) => ({
		// 不要在这里将数据 toJS
		// 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
		bannerList: state.getIn(['recommend', 'bannerList']),
		recommendList: state.getIn(['recommend', 'recommendList']),
		enterLoading: state.getIn(['recommend', 'enterLoading'])
	}));

	const dispatch = useDispatch();

	useEffect(() => {
		function getBannerDataDispatch() {
			if (bannerList.size) return;
			dispatch(actionTypes.getBannerList());
		}
		function getRecommendListDataDispatch() {
			if (recommendList.size) return;
			dispatch(actionTypes.getRecommendList());
		}
		getBannerDataDispatch();
		getRecommendListDataDispatch();
		//eslint-disable-next-line
	}, []);

	const bannerListJS = bannerList ? bannerList.toJS() : [];
	const recommendListJS = recommendList ? recommendList.toJS() : [];

	return (
		<Content>
			<Scroll className="list" onScroll={forceCheck}>
				<div>
					<Slider bannerList={bannerListJS}></Slider>
					<RecommendList recommendList={recommendListJS}></RecommendList>
				</div>
			</Scroll>
			{enterLoading && <Loading></Loading>}
		</Content>
	);
}

// // 映射 Redux 全局的 state 到组件的 props 上
// const mapStateToProps = (state) => ({
// 	// 不要在这里将数据 toJS
// 	// 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
// 	bannerList: state.getIn(['recommend', 'bannerList']),
// 	recommendList: state.getIn(['recommend', 'recommendList'])
// });
// // 映射 dispatch 到 props 上
// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		getBannerDataDispatch() {
// 			dispatch(actionTypes.getBannerList());
// 		},
// 		getRecommendListDataDispatch() {
// 			dispatch(actionTypes.getRecommendList());
// 		}
// 	};
// };

// 将 ui 组件包装成容器组件
// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(React.memo(Recommend));

export default React.memo(Recommend);
