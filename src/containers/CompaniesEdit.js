import React, { Component } from "react";
import { Map } from "immutable";
import { connect } from "react-redux";
import * as actions from "../actions/companies";

export class CompaniesEdit extends Component {
  render() {
    console.log("render edit");
    const { company } = this.props;

    return (
      <div>
        {company && (
          <form>
            <input value={company.get("name")} />
            <button type="submit">save</button>
          </form>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const companyUpdate = state.getIn(["companies", "edit"]);
  const allCompanies = state.getIn(["entities", "company"]);

  const company = allCompanies
    ? allCompanies.get(companyUpdate.get("data"))
    : Map();

  return { company };
};

const mapDispatchToProps = {
  ...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesEdit);
