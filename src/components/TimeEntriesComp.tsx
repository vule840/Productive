import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getData,
  postTimeEntry,
  deleteTimeEntry,
} from "../store/TimeEntriesSlice";
import { getCurrentDate } from "../store/TimeEntriesSlice";

const TimeEntriesComp = () => {
  const timeEntriesData = useSelector(
    (state: any) => state.timeEntry.timeEntriesData
  );
  const [rerender, setRender] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setRender(false);
    dispatch<any>(getData());
  }, [rerender, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();

    const newTimeEntry = {
      data: {
        attributes: {
          date: getCurrentDate(),
          time: Number(e.currentTarget.elements[0].value),
          billable_time: Number(e.currentTarget.elements[1].value),
          note: e.currentTarget.elements[2].value,
        },
        relationships: {
          person: {
            data: {
              type: "people",
              id: timeEntriesData.people.peopleID,
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

    dispatch<any>(postTimeEntry(newTimeEntry));
    setRender(true);
  };

  const deleteTimeEntryHandler = (e, x) => {
    e.preventDefault();

    dispatch<any>(deleteTimeEntry(x.entryID));
    setRender(true);
  };

  return (
    <div>
      <h2>Productive time tracker</h2>
      <form className="formTimeEntry" onSubmit={submitHandler}>
        <input placeholder="Time" id="time" type="number" />
        <input placeholder="Billable Time" id="billableTtime" type="number" />
        <input placeholder="Note" id="note" type="text" />
        <input className="button" value="Save" type="submit" />
      </form>

      <table className="timeEntryTable">
        <thead>
          <th>Name</th>
          <th>Company</th>
          <th>Note</th>
          <th>Name of service</th>
          <th>Dateime</th>
          <th>Billable time</th>
          <th>Date</th>
        </thead>

        <tbody>
          {timeEntriesData.serviceTimeEntriesData
            ? timeEntriesData.serviceTimeEntriesData.map((x) => {
                return (
                  <tr key={Math.random()}>
                    <td>{timeEntriesData.people.name}</td>
                    <td>{timeEntriesData.people.company}</td>
                    <td>{x.note}</td>
                    <td>{x.name}</td>
                    <td>{x.time}</td>
                    <td>{x.billable_time}</td>
                    <td>{x.date}</td>
                    <td
                      className="timeEntryTable--remove"
                      onClick={(e) => deleteTimeEntryHandler(e, x)}
                    >
                      X
                    </td>
                  </tr>
                );
              })
            : "Pending"}
        </tbody>
      </table>
    </div>
  );
};

export default TimeEntriesComp;
