import { createSlice } from "@reduxjs/toolkit";

export const getCurrentDate = () => {
  let current = new Date();
  let cDate =
    current.getFullYear() +
    "-0" +
    (current.getMonth() + 1) +
    "-" +
    current.getDate();

  let dateTime = cDate;
  return dateTime;
};

const timeEntrySlice = createSlice({
  name: "timeEntry",
  initialState: { timeEntriesData: [] },
  reducers: {
    getTime: (state, action) => {
      state.timeEntriesData = action.payload;
    },
    postTime: (state, action) => {
      state.timeEntriesData = action.payload;
    },
    deleteTime: (state, action) => {
      state.timeEntriesData = action.payload;
    },
  },
});

export const getData = () => {
  return async (dispatch) => {
    const fetchOrganizationMembers = async () => {
      const resp = await fetch(
        "https://api.productive.io/api/v2/organization_memberships/",
        {
          method: "GET",
          headers: {
            "X-Auth-Token": "c435af49-f9c3-43a6-89d6-45aa27de9559",
            "Content-Type": "application/vnd.api+json",
            "X-Organization-Id": "20463",
          },
        }
      );

      if (!resp.ok) {
        throw new Error("Something went wrong");
      }
      const data = await resp.json();
      return data.data[0].id;
    };
    const getOrganizationID = await fetchOrganizationMembers();

    const fetchOrganizationPeopleID = async () => {
      const resp = await fetch(
        `https://api.productive.io/api/v2/people/${getOrganizationID}`,
        {
          method: "GET",
          headers: {
            "X-Auth-Token": "c435af49-f9c3-43a6-89d6-45aa27de9559",
            "Content-Type": "application/vnd.api+json",
            "X-Organization-Id": "20463",
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Something went wrong");
      }

      const data = await resp.json();

      const peopleData = {
        name:
          data.data.attributes.first_name +
          " " +
          data.data.attributes.last_name,
        company: data.included[0].attributes.name,
        peopleID: data.data.id,
      };
      return peopleData;
    };

    const fetchTimeEntries = async () => {
      const resp = await fetch(
        `https://api.productive.io/api/v2/time_entries?filter[person_id]=${getOrganizationID}`,
        {
          method: "GET",
          headers: {
            "X-Auth-Token": "c435af49-f9c3-43a6-89d6-45aa27de9559",
            "Content-Type": "application/vnd.api+json",
            "X-Organization-Id": "20463",
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Something went wrong");
      }
      const data = await resp.json();
      const getServices = await fetchServices();

      const filterDateTimeEntries = data.data
        .filter((z: any) => z.attributes.date === getCurrentDate())
        .map((x) => ({
          time: x.attributes.time,
          billable_time: x.attributes.billable_time,
          note: x.attributes.note,
          date: x.attributes.date,
          id: x.id,
          serviceID: x.relationships.service.data.id,
        }));

      let filterHelper = [] as any;

      getServices.services.filter(function (newData) {
        return filterDateTimeEntries.filter(function (oldData) {
          if (newData.id === oldData.serviceID) {
            filterHelper.push({
              id: oldData.id,
              name: newData.name,
              serviceID: oldData.serviceID,
            });
          }
        });
      });

      let filterHelper2 = [] as any;

      filterDateTimeEntries.filter(function (newData) {
        return filterHelper.filter(function (oldData) {
          if (newData.id === oldData.id) {
            filterHelper2.push({
              id: newData.entryID,
              name: oldData.name,
              billable_time: newData.billable_time,
              note: newData.note,
              time: newData.time,
              date: newData.date,
              entryID: oldData.id,
            });
          }
        });
      });

      const getPeopleModel = await fetchOrganizationPeopleID();

      const timeEntriesObj = {
        serviceTimeEntriesData: filterHelper2,
        people: getPeopleModel,
      };

      return timeEntriesObj;
    };

    const fetchServices = async () => {
      const resp = await fetch("https://api.productive.io/api/v2/services/", {
        method: "GET",
        headers: {
          "X-Auth-Token": "c435af49-f9c3-43a6-89d6-45aa27de9559",
          "Content-Type": "application/vnd.api+json",
          "X-Organization-Id": "20463",
        },
      });
      if (!resp.ok) {
        throw new Error("Something went wrong");
      }
      const data = await resp.json();
      const filterServices = data.data.map((x) => ({
        name: x.attributes.name,
        id: x.id,
      }));
      const services = {
        services: filterServices,
      };
      return services;
    };
    try {
      const getTimeEntries = await fetchTimeEntries();

      dispatch(timeActions.getTime(getTimeEntries));
    } catch (error) {
      //console.log("Some error");
    }
  };
};

export const postTimeEntry = (comment) => {
  return async (dispatch) => {
    const postTimeEntryConstruction = async () => {
      const resp = await fetch(
        `https://api.productive.io/api/v2/time_entries/`,
        {
          method: "POST",
          headers: {
            "X-Auth-Token": "c435af49-f9c3-43a6-89d6-45aa27de9559",
            "Content-Type": "application/vnd.api+json",
            "X-Organization-Id": "20463",
          },
          body: JSON.stringify(comment),
        }
      );
      if (!resp.ok) {
        throw new Error("Something went wrong");
      }
      const data = await resp.json();
      return data;
    };

    try {
      const getResponseTimeEntry = await postTimeEntryConstruction();
      dispatch(timeActions.postTime(getResponseTimeEntry));
    } catch (error) {
      console.log("Some error");
    }
  };
};

export const deleteTimeEntry = (timeEntry) => {
  return async (dispatch) => {
    const deleteTimeEntryHelper = async () => {
      const resp = await fetch(
        `https://api.productive.io/api/v2/time_entries/${timeEntry}`,
        {
          method: "DELETE",
          headers: {
            "X-Auth-Token": "c435af49-f9c3-43a6-89d6-45aa27de9559",
            "Content-Type": "application/vnd.api+json",
            "X-Organization-Id": "20463",
          },
        }
      );
      if (!resp.ok) {
        throw new Error("Something went wrong");
      }
      const data = await resp.json();
      return data;
    };

    try {
      const deleteTimeEntryResponse = await deleteTimeEntryHelper();
      dispatch(timeActions.deleteTime(deleteTimeEntryResponse));
    } catch (error) {
      // console.log(error);
    }
  };
};

export const timeActions = timeEntrySlice.actions;

export default timeEntrySlice;
