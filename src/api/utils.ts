// 大家按照这个目录层级新建文件
//src/api/utils.js
export const getCount = (count: number) => {
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
