import { createAction } from "redux-actions";
import { normalize, denormalize } from "normalizr";
import { Map, List, fromJS } from "immutable";
import { identity } from "lodash";

const normalizeHelper = entity => data => normalize(data, entity);

const generateAsyncActionTypes = constant => ({
  requestName: `${constant}_REQUEST`,
  successName: `${constant}_SUCCESS`,
  failName: `${constant}_FAIL`
});

const toSuccess = constant => `${constant}_SUCCESS`;
const toFail = constant => `${constant}_FAIL`;
const toRequest = constant => `${constant}_REQUEST`;

const createAsyncAction = (constant, request, after = identity) => (
  ...args
) => {
  const { requestName, successName, failName } = generateAsyncActionTypes(
    constant
  );

  const pendingType = createAction(requestName);
  const completeType = createAction(successName);
  const errorType = createAction(failName);

  return async dispatch => {
    dispatch(pendingType());

    try {
      const response = await request(...args);
      const payload = await after(response, dispatch);
      dispatch(completeType(payload));
      return payload;
    } catch (error) {
      if (error.response) {
        dispatch(errorType(error.response.data));
        return error.response.data;
      }
      dispatch(errorType(error));
      return error;
    }
  };
};

const initialAsyncState = Map({ loading: false, data: null, error: "" });
const listInitialAsyncState = Map({ loading: false, data: List(), error: "" });

const _createAsyncReducerRoot = asyncType => {
  const { requestName, successName, failName } = generateAsyncActionTypes(
    asyncType
  );

  return {
    [requestName]: state => state.merge({ loading: true }),
    [successName]: (state, action) =>
      state.merge({
        loading: false,
        data: action.payload && fromJS(action.payload.result)
      }),
    [failName]: (state, { payload }) =>
      state.merge({
        loading: false,
        error: payload
      })
  };
};

const _createAsyncReducerNode = (asyncType, node) => {
  const { requestName, successName, failName } = generateAsyncActionTypes(
    asyncType
  );

  return {
    [requestName]: state =>
      state.mergeDeep({
        [node]: {
          loading: true
        }
      }),
    [successName]: (state, { payload }) =>
      state.mergeDeep({
        [node]: {
          loading: false,
          data: payload && payload.result
        }
      }),
    [failName]: (state, { payload }) =>
      state.mergeDeep({
        [node]: {
          loading: false,
          error: payload
        }
      })
  };
};

const createAsyncReducer = (asyncType, node) => {
  if (node) {
    return _createAsyncReducerNode(asyncType, node);
  }

  return _createAsyncReducerRoot(asyncType);
};

const entitiesSelectorList = schema => (state, list) => {
  const allEntities = state.get("entities");
  const allList = allEntities.get(schema.key);

  if (!list || !list.get("data")) {
    return List();
  }

  const data = list.get("data").map(id => allList.get(id.toString()));
  return schema ? denormalize(data, [schema], allEntities) : data;
};

const entitiesSelectorItem = schema => (state, id) => {
  const allEntities = state.get("entities");
  const allList = allEntities.get(schema.key);

  if (!id || !id.get("data")) {
    return Map();
  }

  const data = allList ? allList.get(id.get("data").toString()) : allList;
  return schema ? denormalize(data, schema, allEntities) : data;
};

const isLoadingHelper = list => list.some(item => item.get("loading"));

export {
  isLoadingHelper,
  normalizeHelper,
  generateAsyncActionTypes,
  createAsyncAction,
  initialAsyncState,
  listInitialAsyncState,
  createAsyncReducer,
  entitiesSelectorList,
  entitiesSelectorItem,
  toSuccess,
  toRequest,
  toFail
};
