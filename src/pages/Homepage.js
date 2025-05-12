import React, { useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import ActiveSubscription from "../components/partials/default/active-subscription/ActiveSubscription";
import AvgSubscription from "../components/partials/default/avg-subscription/AvgSubscription";
import TransactionTable from "../components/partials/default/transaction/Transaction";
import TrafficDougnut from "../components/partials/analytics/traffic-dougnut/TrafficDoughnut";
import { Card } from "reactstrap";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Row,
  Col,
  PreviewAltCard,
  BlockBetween,
} from "../components/Component";
import {
  useGetActiveTasksCountQuery,
  useGetSummaryQuery,
  useGetTasksHistoryQuery,
} from "../Services/ProjectService";

const Homepage = () => {
  const { data: projectsInfo } = useGetSummaryQuery();
  const { data: activeTaskInfo } = useGetActiveTasksCountQuery();
  const { data: historyInfo } = useGetTasksHistoryQuery();

  return (
    <>
      <Head title="Homepage"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Overview
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Welcome to DashLite Dashboard</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="g-gs">
            <Col xxl="12">
              <Row className="g-gs">
                <Col lg="6" xxl="12">
                  <Row className="g-gs">
                    <Col sm="6" lg="12" xxl="3">
                      <PreviewAltCard>
                        <AvgSubscription
                          title={"Total Projects"}
                          count={projectsInfo?.length}
                          text="Total active projects"
                        />
                      </PreviewAltCard>
                    </Col>
                    <Col sm="6" lg="12" xxl="3">
                      <PreviewAltCard>
                        <AvgSubscription
                          title={"Completed Tasks"}
                          count={
                            activeTaskInfo?.totalTasks -
                            activeTaskInfo?.totalActiveTasks
                          }
                          text="Total completed tasks"
                        />
                      </PreviewAltCard>
                    </Col>
                    <Col sm="6" lg="12" xxl="3">
                      <PreviewAltCard>
                        <AvgSubscription
                          title={"Incomplete Tasks"}
                          count={activeTaskInfo?.totalActiveTasks}
                          text="Total active tasks"
                        />
                      </PreviewAltCard>
                    </Col>
                    <Col sm="6" lg="12" xxl="3">
                      <PreviewAltCard>
                        <ActiveSubscription
                          title="Total Tasks"
                          count={activeTaskInfo?.totalTasks}
                          text="Total tasks"
                        />
                      </PreviewAltCard>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col lg="7" xxl="6">
              <Card className="card-bordered h-100">
                <TrafficDougnut
                  type="all"
                  data={{
                    values: [
                      activeTaskInfo?.totalTasks,

                      activeTaskInfo?.totalTasks -
                        activeTaskInfo?.totalActiveTasks,
                      activeTaskInfo?.totalActiveTasks,
                    ],
                    labels: ["Completed Tasks", "Incomplete Tasks"],
                    colors: ["#ffa9ce", "#b8acff"],
                    data: [
                      activeTaskInfo?.totalTasks -
                        activeTaskInfo?.totalActiveTasks,
                      activeTaskInfo?.totalActiveTasks,
                    ],
                  }}
                />
              </Card>
            </Col>
            <Col lg="7" xxl="6">
              <Card className="card-bordered h-100">
                <TrafficDougnut
                  type="status"
                  data={{
                    labels: ["Todo", "In Progress", "In Review", "Completed"],
                    colors: ["#ffa9ce", "#b8acff", "#33FFE6", "#FF5733"],
                    data: [
                      historyInfo?.ToDo,
                      historyInfo?.InProgress,
                      historyInfo?.InReview,
                      historyInfo?.Completed,
                    ],
                  }}
                />
              </Card>
            </Col>

            <Col xxl="12">
              <Card className="card-bordered card-full">
                <TransactionTable tableData={projectsInfo} />
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};
export default Homepage;
