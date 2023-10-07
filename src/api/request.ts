import { AlbumType } from '../application/Album/slice';
import { PlayerState } from '../application/Player/slice';
import { RankItem } from '../application/Rank/slice';
import { SearchState } from '../application/Search/slice';
import { SingerItemState } from '../application/Singer/slice';
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

export const getAlbumDetailRequest = (id: string | undefined) => {
  return axiosInstance.get<unknown, { playlist: AlbumType }>(
    `/playlist/detail?id=${id}`
  );
};

export const getSingerInfoRequest = (id: string) => {
  return axiosInstance.get<
    unknown,
    {
      artist: Pick<SingerItemState, 'artist'>['artist'];
      hotSongs: Pick<SingerItemState, 'songs'>['songs'];
    }
  >(`/artists?id=${id}`);
};

export const getLyricRequest = (id: number | string = '') => {
  return axiosInstance.get<unknown, { lrc: { lyric: string } }>(
    `/lyric?id=${id}`
  );
};

export const getSuggestListRequest = (query: string = '') => {
  return axiosInstance.get<unknown, { result: SearchState['suggestList'] }>(
    `/search/suggest?keywords=${query}`
  );
};

export const getResultSongsListRequest = (query: string = '') => {
  return axiosInstance.get<
    unknown,
    { result: { songs: SearchState['songsList'] } }
  >(`/search?keywords=${query}`);
};

export const getSongDetailRequest = (id: string = '') => {
  return axiosInstance.get<unknown, { songs: PlayerState['currentSong'][] }>(
    `/song/detail?ids=${id}`
  );
};

export const getHotKeyWordsRequest = () => {
  return axiosInstance.get<
    unknown,
    { result: { hots: SearchState['hotList'] } }
  >(`/search/hot`);
};
