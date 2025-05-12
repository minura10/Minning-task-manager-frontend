import React, { useState, useEffect, useCallback, useReducer } from "react";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Card } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
  ReactDataTable,
  BarChartExample,
} from "../../../components/Component";
import {
  useGetCategoriesQuery,
  useGetRoomsQuery,
} from "../../../Services/RoomService";
import { ToastContainer, toast } from "react-toastify";
import { TCDoughnut } from "../../../components/partials/charts/analytics/AnalyticsCharts";
import { ColorPallet } from "../Rooms/ColorPallet";
import { BarChart } from "../../../components/partials/charts/default/Charts";
import { barChartData } from "../../components/charts/ChartData";

import { useTheme } from "../../../layout/provider/Theme";
import classNames from "classnames";

const autoSizeStrategy = {
  type: "fitCellContents",
};

const CategoryPage = () => {
  const [sm, updateSm] = useState(false);

  const theme = useTheme();

  const [resetPagination, setResetPagination] = useState(false);

  const [filter, setFilter] = useState({
    projectName: "",
    category: [],
    documentTitle: [],
  });
  const [randomKey, setRandomKey] = useState(1);

  //service
  const { data: roomsInfo, isLoading } = useGetCategoriesQuery();
  const [filterData, setFilterData] = useState(roomsInfo);
  const [documentTitlesDatas, setDocumentTitlesDatas] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  const projectNamesData = [
    ...new Set(roomsInfo?.map((room) => room.ProjectName)),
  ];

  const categoriesData = [...new Set(roomsInfo?.map((room) => room.Category))];

  useEffect(() => {
    if (roomsInfo) {
      setFilterData(roomsInfo);
    }
  }, [roomsInfo]);

  useEffect(() => {
    if (roomsInfo) {
      const filterDocument = roomsInfo.filter(
        (item) => item.ProjectName === filter.projectName.value
      );
      const documentTitleData = [
        ...new Set(filterDocument.map((room) => room.DocumentTitle)),
      ];
      setDocumentTitlesDatas(documentTitleData);
    }
  }, [filter.projectName, roomsInfo]);

  const projectNames = projectNamesData?.map((item) => ({
    label: item,
    value: item,
  }));

  const categories = categoriesData?.map((item) => ({
    label: item,
    value: item,
  }));

  const documentTitles = documentTitlesDatas?.map((item) => ({
    label: item,
    value: item,
  }));

  const defaultColDef = {
    flex: 1,
    filter: true,
    sortable: true,
    resizable: true,
  };

  useEffect(() => {
    if (filterData?.length > 0) {
      const sampleRow = filterData[0];
      const generatedColDefs = Object.keys(sampleRow).map((key) => {
        let colDef = {
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          field: key,
        };

        if (typeof sampleRow[key] === "number") {
          colDef.valueFormatter = (params) =>
            isNaN(params.value) ? params.value : params.value.toFixed(2);
        }

        return colDef;
      });
      setColDefs(generatedColDefs);
    }
  }, [filterData]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);

    if (
      newFilter.category?.length === 0 &&
      newFilter.documentTitle?.length === 0
    ) {
      setFilterData(roomsInfo);
    } else {
      console.log("filer", newFilter);
      const filteredData = roomsInfo?.filter((room) => {
        if (
          newFilter.documentTitle.length > 0 &&
          !newFilter.documentTitle.some(
            (title) => room.DocumentTitle === title.value
          )
        ) {
          return false;
        }
        if (
          newFilter.category.length > 0 &&
          !newFilter.category.some(
            (category) => room.Category === category.value
          )
        ) {
          return false;
        }
        return true;
      });
      setFilterData(filteredData);
    }

    setResetPagination(!resetPagination);
    setRandomKey(Math.floor(Math.random() * 1000));
  };

  const getSumOfArea = (groupBy) => {
    let colorIndex = 0;

    const result = Object.entries(
      filterData?.reduce((acc, current) => {
        const key = current[groupBy];
        acc[key] = acc[key] || { sum: 0, titles: [], categories: [] };
        const areaValue = parseFloat(
          current.Inst_Area.replace(/[^0-9\.]+/g, "")
        ); // Extract numeric value
        acc[key].sum += areaValue;
        acc[key].titles.push(current.DocumentTitle);
        acc[key].categories.push(current.Category);
        return acc;
      }, {})
    ).map(([key, value]) => {
      const color = ColorPallet[colorIndex++ % ColorPallet.length];
      return {
        label: key,
        sum: value.sum,
        titles: value.titles,
        categories: value.categories,
        color,
      };
    });

    return result;
  };

  return (
    <>
      <Head title="User List - Compact"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${
                    sm ? "active" : ""
                  }`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div
                  className="toggle-expand-content"
                  style={{ display: sm ? "block" : "none" }}
                >
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-group" style={{ width: "200px" }}>
                        <label className="form-label">Project Name</label>
                        <RSelect
                          options={projectNames}
                          value={filter.projectName}
                          onChange={(e) =>
                            setFilter({
                              projectName: e,
                              category: [],
                              documentTitle: [],
                            })
                          }
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form-group" style={{ width: "400px" }}>
                        <label className="form-label">Document Title</label>
                        <RSelect
                          options={documentTitles}
                          value={filter.documentTitle}
                          isMulti
                          onChange={(e) =>
                            handleFilterChange({
                              ...filter,
                              documentTitle: e,
                            })
                          }
                        />
                      </div>
                    </li>
                    <li>
                      <div className="form-group" style={{ width: "150px" }}>
                        <label className="form-label">Category</label>
                        <RSelect
                          options={categories}
                          value={filter.category}
                          isMulti
                          onChange={(e) =>
                            handleFilterChange({ ...filter, category: e })
                          }
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        {filterData?.length > 0 && (
          <Block>
            <Row className="g-gs">
              <Col lg="7" xxl="6">
                <Card className="card-bordered h-100 p-2">
                  <>
                    <div className="card-title-group">
                      <h6 className="title">Sum of Area by Category (m²)</h6>
                    </div>

                    <div className="traffic-channel-doughnut-ck">
                      <TCDoughnut
                        state={{
                          labels: getSumOfArea("Category").map(
                            (item) => item.label
                          ),
                          colors: getSumOfArea("Category").map(
                            (item) => item.color
                          ),
                          data: getSumOfArea("Category").map(
                            (item) => item.sum
                          ),
                        }}
                        className="analytics-doughnut"
                      />
                    </div>
                    <div className="g-2">
                      {getSumOfArea("Category").map((item, idx) => (
                        <div className="traffic-channel-data">
                          <div className="title">
                            <span
                              className="dot dot-lg sq"
                              style={{ background: item.color }}
                            ></span>
                            <span>{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                </Card>
              </Col>
              <Col lg="7" xxl="6">
                <Card className="card-bordered h-100 p-2">
                  <>
                    <div className="card-title-group">
                      <h6 className="title">
                        Sum of Area by DocumentTitle (m²)
                      </h6>
                    </div>
                    <div className="traffic-channel-doughnut-ck">
                      <TCDoughnut
                        state={{
                          labels: getSumOfArea("DocumentTitle").map(
                            (item) => item.label
                          ),
                          colors: getSumOfArea("DocumentTitle").map(
                            (item) => item.color
                          ),
                          data: getSumOfArea("DocumentTitle").map(
                            (item) => item.sum
                          ),
                        }}
                        className="analytics-doughnut"
                      />
                    </div>
                    <div className="g-2">
                      {getSumOfArea("DocumentTitle").map((item, idx) => (
                        <div className="traffic-channel-data">
                          <div className="title">
                            <span
                              className="dot dot-lg sq"
                              style={{ background: item.color }}
                            ></span>
                            <span>{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                </Card>
              </Col>
            </Row>
          </Block>
        )}

        <Block>
          {isLoading ? (
            <p>Loading...</p>
          ) : filterData?.length > 0 ? (
            <div
              className={classNames(
                theme?.skin === "dark"
                  ? "ag-theme-quartz-dark"
                  : "ag-theme-quartz"
              )}
              style={{ height: 500 }}
            >
              <AgGridReact
                key={randomKey}
                rowData={filterData}
                columnDefs={colDefs}
                onGridReady={onGridReady}
                sideBar={true}
                autoSizeStrategy={autoSizeStrategy}
                defaultColDef={defaultColDef}
              />
            </div>
          ) : (
            <p>No data found</p>
          )}
        </Block>
      </Content>
      <ToastContainer />
    </>
  );
};
export default CategoryPage;
