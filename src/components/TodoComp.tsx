import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getData, postTimeEntry, deleteTimeEntry } from "../store/TodoSlice";

// import { RootStateOrAny } from "../store/index";
const TodoComp = () => {
  // const showTodo = useSelector((state: any) => state.todo.data);
  const comments = useSelector((state: any) => state.todo.comments);
  const showTodos = useSelector((state: any) => state.todo.todos);
  const [tasks, setTasks] = useState<any>({});
  const [rerender, setRender] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setRender(false);
    dispatch<any>(getData());
  }, [rerender, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    const newComment = {
      data: {
        attributes: {
          cost: 0,
          cost_default: 0,
          cost_normalized: 0,
          currency: null,
          currency_default: null,
          currency_normalized: null,
          date: "2022-05-18",
          created_at: null,
          time: 40,
          billable_time: 50,
          note: "Im posting from postman to if it works",
          approved: false,
          approved_at: null,
          rejected: false,
          rejected_at: null,
          rejected_reason: null,
          timer_started_at: null,
          timer_stopped_at: null,
          started_at: null,
          track_method_id: null,
          updated_at: null,
          invoiced: false,
          calendar_event_id: null,
          overhead: false,
          jira_issue_id: null,
          jira_worklog_id: null,
          jira_organization: null,
        },
        relationships: {
          person: {
            data: {
              type: "people",
              id: "270746",
            },
          },
          service: {
            data: {
              type: "services",
              id: "1678923",
            },
          },
        },
        type: "time-entries",
      },
    };

    dispatch<any>(postTimeEntry(newComment));
    setRender(true);
  };

  const deleteTimeEntryHandler = (e, x) => {
    e.preventDefault();

    dispatch<any>(deleteTimeEntry(x.id));
    setRender(true);
  };

  // const removeTodoHandler = (x: any) => {
  //   dispatch(todoActions.removeTodo(x.id));
  //   console.log(x);
  // };
  // const removeTodoHandler = (x: any) => {
  //   dispatch(todoActions.removeTodo(x.id));
  //   console.log(x);
  // };

  return (
    <div>
      <h2>TodoComp</h2>
      <form onSubmit={submitHandler}>
        {/* <input type="text" /> */}
        <input value="Submit todo" type="submit" />
      </form>
      <div>
        {/* {comments &&
          comments.map((x) => {
            return (
              <table>
                <tr key={x.id}>
                  <td>{x.attributes.note}</td>
                  <td>{x.attributes.time}</td>
                  <td>{x.attributes.billable_time}</td>
                  <td onClick={(e) => deleteTimeEntryHandler(e, x)}>X</td>
                </tr>
              </table>
            );
          })} */}
        {comments && JSON.stringify(comments)}
      </div>

      {/* {tasks ? Object.values(tasks).map((z: any) => <p>{z.text}</p>) : ""} */}
    </div>
  );
};

export default TodoComp;
