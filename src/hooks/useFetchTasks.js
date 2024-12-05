import { useState, useEffect } from "react";
import { getAllTasks } from "../utils/apiFunctions";

export const useFetchTasks = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch tasks and update state
  const getTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status, statusText, data } = await getAllTasks();
      if (data) {
        setTodos(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    getTasks();
  }, []);

  return { todos, loading, error, getTasks, setTodos };
};

export default useFetchTasks;
