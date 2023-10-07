import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import style from '../../assets/global-style';
import { debounce } from './../../api/utils';

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${style['theme-color']};
  .icon-back {
    font-size: 24px;
    color: ${style['font-color-light']};
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style['theme-color']};
    color: ${style['highlight-background-color']};
    font-size: ${style['font-size-m']};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style['border-color']};
    &::placeholder {
      color: ${style['font-color-light']};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${style['background-color']};
  }
`;

export type SearchBoxProps = {
  newQuery: string;
  handleQuery: (q: string) => void;
  back: (...args: unknown[]) => void;
};

const SearchBox: FC<SearchBoxProps> = (props) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  const { newQuery } = props;
  const { handleQuery } = props;

  const handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery as (...args: unknown[]) => void, 500);
  }, [handleQuery]);

  useEffect(() => {
    queryRef.current?.focus();
  }, []);

  useEffect(() => {
    handleQueryDebounce(query);
    // eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    let curQuery = query;
    if (newQuery !== query) {
      curQuery = newQuery;
      if (queryRef.current === null) return;
      queryRef.current.value = newQuery;
    }
    setQuery(curQuery);
    // eslint-disable-next-line
  }, [newQuery]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.currentTarget.value;
    setQuery(val);
  };

  const clearQuery = () => {
    setQuery('');
    if (queryRef.current === null) return;
    queryRef.current.value = '';
    queryRef.current.focus();
  };

  const displayStyle = query ? { display: 'block' } : { display: 'none' };

  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>
        &#xe655;
      </i>
      <input
        ref={queryRef}
        className="box"
        placeholder="搜索歌曲、歌手、专辑"
        onChange={handleChange}
      />
      <i
        className="iconfont icon-delete"
        onClick={clearQuery}
        style={displayStyle}
      >
        &#xe600;
      </i>
    </SearchBoxWrapper>
  );
};

export default SearchBox;
