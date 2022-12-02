import styled from 'styled-components';
import style from '../../assets/global-style';

export const ListWrapper = styled.div`
	max-width: 100%;
	.title {
		font-weight: 700;
		padding-left: 6px;
		font-size: 14px;
		line-height: 60px;
	}
`;

export const List = styled.div`
	/* width: 100%; */
	display: flex;
	flex-flow: row wrap;
	/* justify-content: space-around; */
	/* justify-content: space-between; */
	padding: 0 6px;
	gap: 6px;
`;

export const ListItem = styled.div`
	position: relative;
	max-width: 33.33333333%;
	flex: 1 1 32%;

	.img_wrapper {
		.decorate {
			position: absolute;
			top: 0;
			width: 100%;
			height: 35px;
			border-radius: 3px;
			/**
      这个标签的样式，它的作用就是给图片上的图标和文字提供一个遮罩，
      因为在字体颜色是白色，在面对白色图片背景的时候，文字会看不清或者看不到，
      因此提供一个阴影来衬托出文字，这个细节很容易被忽略，希望大家也能注意一下。 
      */
			background: linear-gradient(hsla(0, 0%, 43%, 0.4), hsla(0, 0%, 100%, 0));
		}
		position: relative;
		height: 0;
		padding-bottom: 100%;
		.play_count {
			position: absolute;
			right: 2px;
			top: 2px;
			font-size: ${style['font-size-s']};
			line-height: 15px;
			color: ${style['font-color-light']};
			.play {
				vertical-align: top;
			}
		}
		img {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 3px;
		}
	}
	.desc {
		overflow: hidden;
		margin-top: 2px;
		padding: 0 2px;
		height: 50px;
		text-align: left;
		font-size: ${style['font-size-s']};
		line-height: 1.4;
		color: ${style['font-color-desc']};
	}
`;
