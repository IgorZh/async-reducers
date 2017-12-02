import { Map } from 'immutable';

const initialState = Map();

const entities = (state = initialState, action) => {
  if (action.payload && action.payload.entities) {
    return state.mergeDeep(action.payload.entities);
  }

  return state;
};

export default entities;
