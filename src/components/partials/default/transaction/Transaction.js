import React, { useEffect, useState } from "react";
import Icon from "../../../icon/Icon";
import moment from "moment";
import {
  CardTitle,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Progress,
} from "reactstrap";
import {
  DataTableBody,
  DataTableHead,
  DataTableItem,
  DataTableRow,
} from "../../../table/DataTable";
import { Link } from "react-router-dom";
import { calcPercentage } from "../../../../utils/Utils";

const TransactionTable = ({ tableData }) => {
  const tableRow = tableData?.map(
    (
      {
        title,
        deadline,
        status,
        totalTasks,
        totalActiveTasks,
        totalCompletedTasks,
      },
      idx
    ) => ({
      title: title,
      due_date: deadline,
      status: status,
      active: totalActiveTasks,
      total: totalTasks,
      completed: totalCompletedTasks,
      no: idx + 1,
    })
  );

  const [data, setData] = useState(tableRow);
  const [trans, setTrans] = useState("");

  useEffect(() => {
    setData(tableRow);
  }, [tableData]);

  useEffect(() => {
    let filteredData;
    if (trans === "open") {
      filteredData = tableRow.filter((item) => item.status === "open");
    } else if (trans === "ongoing") {
      filteredData = tableRow.filter((item) => item.status === "ongoing");
    } else if (trans === "closed") {
      filteredData = tableRow.filter((item) => item.status === "closed");
    } else {
      filteredData = tableRow;
    }
    setData(filteredData);
  }, [trans]);

  return (
    <React.Fragment>
      <div className="card-inner">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title">
              <span className="me-2">Projects</span>{" "}
            </h6>
          </CardTitle>
          <div className="card-tools">
            <ul className="card-tools-nav">
              <li
                className={trans === "open" ? "active" : ""}
                onClick={() => setTrans("open")}
              >
                <a
                  href="#paid"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Open</span>
                </a>
              </li>
              <li
                className={trans === "ongoing" ? "active" : ""}
                onClick={() => setTrans("ongoing")}
              >
                <a
                  href="#pending"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Ongoing</span>
                </a>
              </li>
              <li
                className={trans === "closed" ? "active" : ""}
                onClick={() => setTrans("closed")}
              >
                <a
                  href="#paid"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Closed</span>
                </a>
              </li>
              <li
                className={trans === "" ? "active" : ""}
                onClick={() => setTrans("")}
              >
                <a
                  href="#all"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>All</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <DataTableBody className="border-top" bodyclass="nk-tb-orders">
        <DataTableHead>
          <DataTableRow size="sm">
            <span>Title</span>
          </DataTableRow>

          <DataTableRow size="lg">
            <span>Total Tasks</span>
          </DataTableRow>

          <DataTableRow size="lg">
            <span>Active Tasks</span>
          </DataTableRow>
          <DataTableRow size="lg">
            <span>Completed Tasks</span>
          </DataTableRow>

          <DataTableRow size="lg">
            <span>Status</span>
          </DataTableRow>
          <DataTableRow size="md">
            <span>Deadline</span>
          </DataTableRow>
          <DataTableRow size="lg">
            <span>Progress</span>
          </DataTableRow>
        </DataTableHead>
        {data?.map((item, idx) => {
          return (
            <DataTableItem key={idx}>
              <DataTableRow size="sm">
                <span className="tb-lead">{item.title}</span>
              </DataTableRow>

              <DataTableRow size="sm">
                <span className="tb-lead">{item.total}</span>
              </DataTableRow>
              <DataTableRow size="sm">
                <span className="tb-lead">{item.active}</span>
              </DataTableRow>
              <DataTableRow size="sm">
                <span className="tb-lead">{item.completed}</span>
              </DataTableRow>

              <DataTableRow size="md">
                <Badge
                  className="badge-dim"
                  color={
                    item.status === "open"
                      ? "success"
                      : item.status === "ongoing"
                      ? "warning"
                      : item.status === "closed" && "light"
                  }
                >
                  <span>
                    {item.status === "open"
                      ? "Open"
                      : item.status === "ongoing"
                      ? "OnGoing"
                      : "Closed"}
                  </span>
                </Badge>
              </DataTableRow>

              <DataTableRow size="md">
                <span className="tb-lead">
                  {moment(item.due_date).format("DD/MM/YYYY")}
                </span>
              </DataTableRow>
              <DataTableRow size="sm">
                <span className="tb-lead">
                  <Progress
                    className="progress-pill progress-md bg-light"
                    value={calcPercentage(item.completed, item.total)}
                    style={{ height: "14px" }}
                  >
                    {calcPercentage(item.completed, item.total)}%
                  </Progress>
                </span>
              </DataTableRow>
            </DataTableItem>
          );
        })}
      </DataTableBody>
    </React.Fragment>
  );
};
export default TransactionTable;
