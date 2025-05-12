import React, { useState } from "react";
import { DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { TCDoughnut } from "../../charts/analytics/AnalyticsCharts";
import { calcPercentage } from "../../../../utils/Utils";

const TrafficDougnut = ({ data, type }) => {
  return (
    <React.Fragment>
      {" "}
      <div className="card-title-group">
        <div className="card-title card-title-sm">
          <h6 className="title p-2">All task by completion status</h6>
        </div>
      </div>
      <div className="traffic-channel">
        <div className="traffic-channel-doughnut-ck">
          <TCDoughnut state={data} className="analytics-doughnut"></TCDoughnut>
        </div>
        {type === "all" ? (
          <div className="traffic-channel-group g-2">
            {data.data.map((item, idx) => (
              <div className="traffic-channel-data">
                <div className="title">
                  <span
                    className="dot dot-lg sq"
                    style={{ background: data.colors[idx] }}
                  ></span>
                  <span>{data.labels[idx]}</span>
                </div>
                <div className="amount">
                  {data.values[idx + 1]}{" "}
                  <small>
                    {calcPercentage(data?.values[idx + 1], data?.values[0])}%
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="traffic-channel-group g-2">
            {data.data.map((item, idx) => (
              <div className="traffic-channel-data">
                <div className="title">
                  <span
                    className="dot dot-lg sq"
                    style={{ background: data.colors[idx] }}
                  ></span>
                  <span>{data.labels[idx]}</span>
                </div>
                <div className="amount">{item} </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default TrafficDougnut;
