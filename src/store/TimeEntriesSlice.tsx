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
        "https://api.productive.io/api/v2/people/" + getOrganizationID,
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
      return data;
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

      return data.data.filter(
        (z: any) => z.attributes.date === getCurrentDate()
      );
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
      const filterFrontEnd = data.data.filter(
        (x) => x.attributes.name === "Frontend development"
      );
      return filterFrontEnd;
    };
    try {
      const getPeopleModel = await fetchOrganizationPeopleID();
      console.log(getPeopleModel);
      const getTimeEntries = await fetchTimeEntries();
      console.log(getTimeEntries);
      const getServices = await fetchServices();
      console.log(getServices);
      const allResults = await Promise.all([
        getPeopleModel,
        getTimeEntries,
        getServices,
      ]);

      dispatch(timeActions.getTime(allResults));
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
      console.log("Some error");
    }
  };
};

export const timeActions = timeEntrySlice.actions;

export default timeEntrySlice;
