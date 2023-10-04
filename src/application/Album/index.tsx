import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import Header from '../../baseUI/header';
import { Container } from './style';
const Album = () => {
  const { id } = useParams();
  const [showStatus, setShowStatus] = useState(true);
  const nodeRef = useRef(null);

  const handleBack = () => {
    setShowStatus(false);
  };

  const navigate = useNavigate();

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => {
        navigate('..', { relative: 'path' });
      }}
    >
      <Container ref={nodeRef}>
        <Header title={'返回'} handleClick={handleBack}></Header>
        {id}
        {Album.name}
      </Container>
    </CSSTransition>
  );
};

export default Album;
