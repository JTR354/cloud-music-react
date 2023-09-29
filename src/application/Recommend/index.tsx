import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { decrement, increment } from './slice';

export default function Counter() {
  const count = useSelector((state: RootState) => {
    return state.counter.value;
  });
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => {
            return dispatch(increment());
          }}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => {
            return dispatch(decrement());
          }}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
