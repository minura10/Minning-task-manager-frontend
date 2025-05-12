import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import KanbanBoard from "./KanbanBoard";
import { Modal } from "reactstrap";
import {
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  Button,
  Icon,
  Block,
} from "../../../components/Component";
import { KanbanBoardForm, KanbanTaskForm } from "./KanbanForms";

import { useGetProjectQuery } from "../../../Services/ProjectService";
import { useGetStaffQuery } from "../../../Services/UserService";

const Kanban = () => {
  const { projectId } = useParams();
  const [columns, setColumns] = useState();
  const [smBtn, setSmBtn] = useState(false);
  const [boardModal, setBoardModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [labelsSet, setLabelsSet] = useState([]);

  //service calls
  const { data: taskInfo } = useGetProjectQuery({
    report_id: projectId,
  });
  const { data: stuffList } = useGetStaffQuery();

  useEffect(() => {
    if (taskInfo) {
      arrangeData();
    }
  }, [taskInfo, stuffList, users, labelsSet]);

  const arrangeData = () => {
    const columnsData = {
      task: {},
      columns: {},
      columnOrder: [],
    };

    setUsers(taskInfo.assigned_users);
    setLabelsSet(taskInfo?.labels);

    taskInfo?.lists.forEach((list) => {
      const columnId = list._id;
      const column = {
        id: columnId,
        text: list.title,
        theme: "light",
        tasks: [],
      };

      //column order
      columnsData.columnOrder.push(columnId);

      //columns
      columnsData.columns[columnId] = column;

      list.tasks?.forEach((task) => {
        const taskId = task._id;
        const kanbanTask = {
          id: taskId,
          title: task.title,
          desc: task.description,
          members: task.members,
          comments: task.comments,
          tags: task.labels,
          labels: taskInfo.labels,
          task_deadline: task.task_deadline,
          report_id: taskInfo._id,
          list_id: list._id,
          users: taskInfo.assigned_users,
        };

        column.tasks.push(taskId);

        columnsData.task[taskId] = kanbanTask;
      });
    });

    setColumns(columnsData);
  };

  const toggleBoardModal = () => {
    setBoardModal(!boardModal);
  };

  const toggleTaskModal = () => {
    setTaskModal(!taskModal);
  };

  return (
    <>
      <Head title="Kanban Board"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Kanban Board</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#toggle"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setSmBtn(!smBtn);
                  }}
                  className="btn btn-icon btn-trigger toggle-expand me-n1"
                >
                  <Icon name="menu-alt-r"></Icon>
                </a>
                <div
                  className={`toggle-expand-content ${smBtn ? "expanded" : ""}`}
                >
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button
                        color="light"
                        outline
                        className="btn-white"
                        onClick={() => toggleTaskModal()}
                      >
                        <Icon name="plus" />
                        <span>Add Task</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <div className="nk-kanban">
            <KanbanBoard columns={columns} reportId={projectId} />
          </div>
        </Block>

        <Modal size="lg" isOpen={boardModal} toggle={toggleBoardModal}>
          <KanbanBoardForm toggle={toggleBoardModal} data={columns} />
        </Modal>

        <Modal size="lg" isOpen={taskModal} toggle={toggleTaskModal}>
          <KanbanTaskForm
            toggle={toggleTaskModal}
            list={taskInfo?.lists}
            users={users}
            stuffList={stuffList}
            labelsSet={labelsSet}
            report_id={taskInfo?._id}
          />
        </Modal>
        <ToastContainer />
      </Content>
    </>
  );
};

export default Kanban;
