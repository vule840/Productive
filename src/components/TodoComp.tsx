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
  // console.log(comments[0].data.id);
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
          date: "2022-05-19",
          created_at: null,
          time: Number(e.currentTarget.elements[0].value),
          billable_time: Number(e.currentTarget.elements[1].value),
          note: e.currentTarget.elements[2].value,
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
              id: comments[0].data.id,
            },
          },
          service: {
            data: {
              type: "services",
              id: comments[2][0].id,
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
        <label htmlFor="time">Time</label>
        <input id="time" type="number" />
        <label htmlFor="time">Billable time</label>
        <input id="billableTtime" type="number" />
        <label htmlFor="note">Note</label>
        <input id="note" type="text" />
        {/* <input type="number" /> */}
        <input value="Submit todo" type="submit" />
      </form>

      {comments[1]
        ? comments[1].map((x) => {
            return (
              <tr key={x.id}>
                <td>{x.id}</td>
                <td>{x.attributes.note}</td>
                <td>{x.attributes.time}</td>
                <td>{x.attributes.billable_time}</td>
                <td onClick={(e) => deleteTimeEntryHandler(e, x)}>X</td>
              </tr>
            );
          })
        : "Pending"}

      {/* {comments && JSON.stringify(comments[1])} */}

      {/* {tasks ? Object.values(tasks).map((z: any) => <p>{z.text}</p>) : ""} */}
    </div>
  );
};

export default TodoComp;
