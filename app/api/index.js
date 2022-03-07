import axios from 'axios';

const axiosServer = axios.create({
  baseURL: `http://localhost:8080/https://faker-companies.dk-dev.leadbook.com/api/v1`,
});

export default {
  async getCompanies(filterPayload) {
    let query = '';
    if (filterPayload.company_location.value) {
      query += `company_location=${filterPayload.company_location.value}&`;
    }
    if (filterPayload.company_industry.value) {
      query += `company_industry=${filterPayload.company_industry.value}&`;
    }
    const url = `companies/?${query}format=json`;
    const { data } = await axiosServer({
      method: 'GET',
      url,
    });
    return {
      count: data.count,
      results: data.results,
    };
  },
  async getCompanyLocations() {
    const url = `companies/?format=json`;
    const { data } = await axiosServer({
      method: 'GET',
      url,
    });
    let companyLocations = [
      ...new Set(data.results.map(a => a.company_location)),
    ];
    companyLocations = companyLocations.map(a => ({
      label: a,
      value: a,
    }));
    return companyLocations;
  },
  async getIndustries() {
    const url = 'industries/?format=json';
    const { data } = await axiosServer({
      method: 'GET',
      url,
    });
    return data;
  },
};
