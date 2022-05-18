import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchData, postTimeEntry } from "../store/TodoSlice";

// import { RootStateOrAny } from "../store/index";
const TodoComp = () => {
  // const showTodo = useSelector((state: any) => state.todo.data);
  const comments = useSelector((state: any) => state.todo.comments);
  const showTodos = useSelector((state: any) => state.todo.todos);
  const [tasks, setTasks] = useState<any>({});
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch<any>(fetchData());
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const newComment = {};
    dispatch<any>(postTimeEntry(newComment));
  };

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
      <p>{JSON.stringify(comments)}</p>
      {showTodos}

      {/* {tasks ? Object.values(tasks).map((z: any) => <p>{z.text}</p>) : ""} */}
    </div>
  );
};

export default TodoComp;
