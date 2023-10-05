// 大家按照这个目录层级新建文件

import { RankItem } from '../application/Rank/slice';
import { RankTypes } from './config';

//src/api/utils.js
export const getCount = (count: number | undefined = 0) => {
  if (count < 0) return;
  if (count < 10000) {
    return count;
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万';
  } else {
    return Math.floor(count / 10000000) / 10 + '亿';
  }
};

// 防抖函数
export const debounce = (
  func: ((...args: unknown[]) => void) | null,
  delay: number
) => {
  if (func == null) return () => {};
  let timer: number | undefined;
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const newLocal: unknown = this;
  return function (...args: unknown[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(newLocal, args);
      clearTimeout(timer);
    }, delay);
  };
};

//处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = (rankList: RankItem[]) => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1;
    }
  }
};

//找出排行榜的编号
export const filterIdx = (name: string) => {
  for (const key in RankTypes) {
    if (RankTypes[key] === name) return key;
  }
  return null;
};

//处理歌手列表拼接歌手名字
export const getName = (list: { name: string }[]) => {
  let str = '';
  list.map((item, index) => {
    str += index === 0 ? item.name : '/' + item.name;
    return item;
  });
  return str;
};

//判断一个对象是否为空
export const isEmptyObject = (obj: unknown) =>
  !obj || Object.keys(obj).length === 0;
