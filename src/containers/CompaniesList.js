import React, { Component } from "react";
import PropTypes from "prop-types";
import { List } from "immutable";
import { connect } from "react-redux";
import { companiesSelector, editIsLoading } from "../reducers/companies";
import * as actions from "../actions/companies";

export class CompaniesList extends Component {
  componentDidMount = () => {
    const { fetchCompanies } = this.props;

    fetchCompanies();
  };

  render() {
    console.log("render list");
    const { companies, startEditCompany } = this.props;
    return (
      <div>
        {companies.map(company => (
          <div key={company.get("id")}>
            {company.get("name")}
            <button onClick={() => startEditCompany(company.get("id"))}>
              Edit
            </button>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  // const companiesList = state.getIn(["companies", "list"]);
  // const allCompanies = state.getIn(["entities", "company"]);

  // const companies = allCompanies
  //   ? companiesList.get("data").map(id => allCompanies.get(id))
  //   : List();

  const companies = companiesSelector(state);
  const company = editIsLoading(state);
  return { companies, company };
};

const mapDispatchToProps = {
  ...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesList);
