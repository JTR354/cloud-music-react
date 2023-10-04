import { RankItem } from '../application/Rank/slice';
import type { SingerState } from '../application/Singers/slice';
import { axiosInstance } from './config';
export const getBannerRequest = () => {
  return axiosInstance.get<unknown, { banners: [] }>('/banner');
};

export const getRecommendListRequest = () => {
  return axiosInstance.get<unknown, { result: [] }>('/personalized');
};

type SingerResult = { artists: Pick<SingerState, 'singerList'>['singerList'] };
export const getHotSingerListRequest = (count: number) => {
  return axiosInstance.get<unknown, SingerResult>(
    `/top/artists?offset=${count}`
  );
};

export const getSingerListRequest = (
  category: string,
  alpha: string,
  count: Pick<SingerState, 'pageCount'>['pageCount']
) => {
  return axiosInstance.get<unknown, SingerResult>(
    `/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`
  );
};

export const getRankListRequest = () => {
  return axiosInstance.get<unknown, { list: RankItem[] }>(`/toplist/detail`);
};
