import { createAction } from "redux-actions";
import {
  COMPANIES_UPDATE,
  COMPANIES_FETCH
} from "../constants/companyActionTypes";
import { companiesUpdate, companiesFetch } from "../endpoints";
import { createAsyncAction, normalizeHelper } from "../asyncHelpers";
import company from "../schemas/company";

export const fetchCompanies = createAsyncAction(
  COMPANIES_FETCH,
  companiesFetch,
  normalizeHelper([company])
);

export const updateCompany = createAsyncAction(
  COMPANIES_UPDATE,
  companiesUpdate,
  normalizeHelper(company)
);

export const startEditCompany = createAction("COMPANIES_START_EDIT");
