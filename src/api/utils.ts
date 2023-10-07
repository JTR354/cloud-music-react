// 大家按照这个目录层级新建文件

import { RankItem } from '../application/Rank/slice';

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

//找出排行榜的编号
//处理数据，找出第一个没有歌名的排行榜的索引
export const filterIndex = (rankList: RankItem[]) => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1;
    }
  }
};

//处理歌手列表拼接歌手名字
export const getName = (list: { name: string }[] = []) => {
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

// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
export type hackCSSStyleType = { [key: string | number]: unknown };
const elementStyle = document.createElement('div')
  .style as unknown as hackCSSStyleType;
const vendor = (() => {
  // 首先通过 transition 属性判断是何种浏览器
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'Transform',
  } as const;
  type transNamesKey = keyof typeof transformNames;
  let key: transNamesKey;
  for (key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle(style: string) {
  if (vendor === false) {
    return false;
  }
  if (vendor === 'standard') {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

//拼接出歌曲的url链接
export const getSongUrl = (id: string | number = 0) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};

//转换歌曲播放时间
export const formatPlayTime = (interval: number) => {
  interval = interval | 0; // |0表示向下取整
  const minute = (interval / 60) | 0;
  const second = (interval % 60).toString().padStart(2, '0');
  return `${minute}:${second}`;
};

function getRandomInt(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 随机算法
export function shuffle(arr = []) {
  const new_arr: { id?: unknown }[] = [];
  arr.forEach((item) => {
    new_arr.push(item);
  });
  for (let i = 0; i < new_arr.length; i++) {
    const j = getRandomInt(0, i);
    const t = new_arr[i];
    new_arr[i] = new_arr[j];
    new_arr[j] = t;
  }
  return new_arr;
}

// 找到当前的歌曲索引
export const findIndex = (song: { id?: unknown }, list: { id?: unknown }[]) => {
  return list.findIndex((item) => {
    return song.id === item.id;
  });
};
