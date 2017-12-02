import { handleActions } from "redux-actions";
import { Map } from "immutable";
import { startEditCompany } from "../actions/companies";
import { combineReducers } from "redux-immutable";
import { createSelector } from "reselect";
import {
  createAsyncReducer,
  listInitialAsyncState,
  initialAsyncState
} from "../asyncHelpers";
import {
  COMPANIES_UPDATE,
  COMPANIES_FETCH
} from "../constants/companyActionTypes";

const list = handleActions(
  createAsyncReducer(COMPANIES_FETCH),
  listInitialAsyncState
);
const edit = handleActions(
  {
    ...createAsyncReducer(COMPANIES_UPDATE),
    [startEditCompany]: (state, { payload }) => state.set("data", payload)
  },
  initialAsyncState
);

const listSelector = state => state.getIn(["companies", "list"]);
const editSelector = state => state.getIn(["companies", "edit"]);
const allCompanies = state => state.getIn(["entities", "company"]);
export const companiesSelector = createSelector(
  [listSelector, allCompanies],
  (items, allCompanies) => items.get("data").map(id => allCompanies.get(id))
);
export const editCompaniesSelector = createSelector(
  [editSelector, allCompanies],
  (item, allCompanies) => allCompanies && allCompanies.get(item.get("data"))
);
export const editIsLoading = state =>
  state.getIn(["companies", "edit", "isLoading"]);
export default combineReducers({ list, edit });
// export default handleActions(
//   {
//     ...createAsyncReducer(COMPANIES_FETCH, "list"),
//     ...createAsyncReducer(COMPANIES_UPDATE, "update"),
//     [startEditCompany]: (state, { payload }) =>
//       state.setIn(["update", "data"], payload)
//   },
//   Map({
//     list: listInitialAsyncState,
//     update: initialAsyncState
//   })
// );
