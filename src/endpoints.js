import { v4 } from "uuid";

const fakeDatabase = {
  companies: [
    {
      id: v4(),
      name: "microsoft"
    },
    {
      id: v4(),
      name: "facebook"
    },
    {
      id: v4(),
      name: "google"
    }
  ]
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const companiesFetch = () =>
  delay(500).then(() => fakeDatabase.companies);

export const companiesAdd = name =>
  delay(500).then(() => {
    const company = { uuid: v4(), name };
    fakeDatabase.companies.push(company);
    return company;
  });

export const companiesUpdate = company => delay(500).then(() => company);
