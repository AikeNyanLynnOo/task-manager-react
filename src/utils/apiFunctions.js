import { makeRequest } from "./makeRequest";

const baseURL = process.env.REACT_APP_BASE_URL;

// get all
export const getAllTasks = async () => {
  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `${baseURL}/api/tasks`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await makeRequest(config);

  return res;
};

// create new task
export const createNewTask = async ({ text, color }) => {
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseURL}/api/tasks`,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      text,
      color,
    },
  };
  const res = await makeRequest(config);

  return res;
};

// delete task
export const deleteTask = async ({ id }) => {
  let config = {
    method: "DELETE",
    maxBodyLength: Infinity,
    url: `${baseURL}/api/tasks/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await makeRequest(config);

  return res;
};

// update task
export const updateTask = async ({ id, text, completed, color }) => {
  let config = {
    method: "PATCH",
    maxBodyLength: Infinity,
    url: `${baseURL}/api/tasks/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      text,
      completed,
      color,
    },
  };
  const res = await makeRequest(config);

  return res;
};

// complete all tasks
export const completeAllTasks = async () => {
  let config = {
    method: "PATCH",
    maxBodyLength: Infinity,
    url: `${baseURL}/api/tasks/complete-all`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await makeRequest(config);

  return res;
};

// clear completed tasks
export const clearCompletedTasks = async () => {
  let config = {
    method: "DELETE",
    maxBodyLength: Infinity,
    url: `${baseURL}/api/tasks/completed`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await makeRequest(config);

  return res;
};
