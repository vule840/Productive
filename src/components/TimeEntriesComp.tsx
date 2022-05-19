import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getData,
  postTimeEntry,
  deleteTimeEntry,
} from "../store/TimeEntriesSlice";
import { getCurrentDate } from "../store/TimeEntriesSlice";

const TimeEntriesComp = () => {
  const renderData = useSelector(
    (state: any) => state.timeEntry.timeEntriesData
  );
  const [rerender, setRender] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setRender(false);
    dispatch<any>(getData());
  }, [rerender, dispatch]);

  const [peopleData, timeEntryData, servicesData] = renderData;
  console.log(peopleData);
  const submitHandler = (e) => {
    e.preventDefault();

    const newTimeEntry = {
      data: {
        attributes: {
          cost: 0,
          cost_default: 0,
          cost_normalized: 0,
          currency: null,
          currency_default: null,
          currency_normalized: null,
          date: getCurrentDate(),
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
              id: peopleData.data.id,
            },
          },
          service: {
            data: {
              type: "services",
              id: servicesData[0].id,
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

    dispatch<any>(deleteTimeEntry(x.id));
    setRender(true);
  };

  return (
    <div>
      <h2>Add time entry</h2>
      <form className="formTimeEntry" onSubmit={submitHandler}>
        <input placeholder="Time" id="time" type="number" />
        <input placeholder="Billable Time" id="billableTtime" type="number" />
        <input placeholder="Note" id="note" type="text" />
        <input className="button" value="Save" type="submit" />
      </form>

      <table className="timeEntryTable">
        <thead>
          <th>Time</th>
          <th>Note</th>
          <th>TimeIme</th>
          <th>Billable Time</th>
        </thead>

        <tbody>
          {timeEntryData
            ? timeEntryData.map((x) => {
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
        </tbody>
      </table>

      {/* {comments && JSON.stringify(comments[1])} */}
    </div>
  );
};

export default TimeEntriesComp;
