/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useEffect, useState } from 'react';
import { Select, Table, Row, Col, Button } from 'antd';
import './homepage.css';
import api from '../../api';

const columns = [
  {
    title: 'Name',
    dataIndex: 'company_name',
  },
  {
    title: 'Email',
    dataIndex: 'company_email',
  },
  {
    title: 'Founded On',
    dataIndex: 'founded_on',
  },
  {
    title: 'Industry',
    dataIndex: 'company_industry',
  },
  {
    title: 'Location',
    dataIndex: 'company_location',
  },
  {
    title: 'Type',
    dataIndex: 'company_type',
  },
];

export default function HomePage() {
  const filterInitialPayload = {
    company_location: {
      value: null,
      label: null,
    },
    company_industry: {
      value: null,
      label: null,
    },
  };
  const [tableData, setTableData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [industriesOptions, setIndustriesOptions] = useState([]);
  const [filterPayload, setFilterPayload] = useState(filterInitialPayload);

  const getCompanies = async () => {
    const data = await api.getCompanies(filterPayload);
    setTableData(data.results);
    setDataCount(data.count);
  };

  const getIndustries = async () => {
    const data = await api.getIndustries();
    const industries = Object.keys(data).map(key => ({
      label: data[key],
      value: key,
    }));
    setIndustriesOptions(industries);
  };

  const getCompanyLocations = async () => {
    const data = await api.getCompanyLocations();
    setLocations(data);
  };

  const industryChanged = payload => {
    setFilterPayload({
      ...filterPayload,
      company_industry: {
        value: payload.value,
        label: payload.label,
      },
    });
  };

  const locationChanged = payload => {
    setFilterPayload({
      ...filterPayload,
      company_location: {
        value: payload.value,
        label: payload.label,
      },
    });
  };

  const clearAllFilters = async () => {
    setFilterPayload(filterInitialPayload);
  };

  useEffect(() => {
    (async () => {
      await getCompanies();
    })();
  }, [filterPayload]);

  useEffect(() => {
    (async () => {
      await getCompanyLocations();
      await getIndustries();
    })();
  }, []);

  return (
    <div>
      <Row>
        <div className="title-wrapper">
          <span>Build A List</span>
          <span> {dataCount} Companies Found</span>
        </div>
      </Row>
      <Row>
        <Col span="4" className="grey-border">
          <div className="pad-20">
            <div>
              <span className="sidebar-label">Location</span>
              <Select
                labelInValue
                size="middle"
                value={filterPayload.company_location.value}
                options={locations}
                onChange={locationChanged}
                placeholder="Select Location"
              />
            </div>
            <div>
              <span className="sidebar-label">Industry</span>
              <Select
                labelInValue
                size="middle"
                value={filterPayload.company_industry.value}
                options={industriesOptions}
                onChange={industryChanged}
                placeholder="Select Industry"
              />
            </div>
          </div>
        </Col>
        <Col span="20" className="grey-border">
          <div>
            <span className="mar-10">Included</span>
            {filterPayload.company_industry.value ? (
              <Button
                onClick={() => industryChanged({ value: null, label: null })}
                className="mar-10"
                type="primary"
              >
                {filterPayload.company_industry.label} X
              </Button>
            ) : (
              ''
            )}
            {filterPayload.company_location.value ? (
              <Button
                onClick={() => locationChanged({ value: null, label: null })}
                className="mar-10"
                type="primary"
              >
                {filterPayload.company_location.label} X
              </Button>
            ) : (
              ''
            )}

            <Button onClick={clearAllFilters} className="mar-10" type="primary">
              Clear All Filters
            </Button>
          </div>
          <div className="pad-20">
            <Table
              columns={columns}
              dataSource={tableData}
              rowSelection={{
                type: 'checkbox',
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
