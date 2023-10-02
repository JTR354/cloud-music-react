import { useState } from 'react';

import { alphaTypes, categoryTypes } from '../../api/config';
import Horizon from '../../baseUI/horizon-item';
import { NavContainer } from './style';

const Singers = () => {
  console.log(Singers.name);
  const [category, setCategory] = useState('');
  const [alpha, setAlpha] = useState('');

  const handleUpdateAlpha = (val: string) => {
    setAlpha(val);
  };

  const handleUpdateCategory = (val: string) => {
    setCategory(val);
  };
  return (
    <NavContainer>
      <Horizon
        list={categoryTypes}
        title={'分类 (默认热门):'}
        handleClick={handleUpdateCategory}
        oldVal={category}
      ></Horizon>
      <Horizon
        list={alphaTypes}
        title={'首字母:'}
        handleClick={(val) => {
          return handleUpdateAlpha(val);
        }}
        oldVal={alpha}
      ></Horizon>
    </NavContainer>
  );
};

export default Singers;
