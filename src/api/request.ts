import { axiosInstance } from './config';
export const getBannerRequest = () => {
  return axiosInstance.get<unknown, { banners: [] }>('/banner');
};

export const getRecommendListRequest = () => {
  return axiosInstance.get<unknown, { result: [] }>('/personalized');
};
