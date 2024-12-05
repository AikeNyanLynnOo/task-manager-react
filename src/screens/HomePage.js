import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaCircle,
  FaCheckCircle,
  FaCheckDouble,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import dayjs from "dayjs";
import { useFetchTasks } from "../hooks/useFetchTasks";
import {
  clearCompletedTasks,
  completeAllTasks,
  createNewTask,
  deleteTask,
  updateTask,
} from "../utils/apiFunctions";
import { getRandomColor } from "../utils/getRandomColor";

const HomePage = () => {
  const [todoText, setTodoText] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editableText, setEditableText] = useState("");

  const [filter, setFilter] = useState(localStorage.getItem("filter") || "all");

  const inputRef = useRef(null);

  const { todos, loading, error, getTasks, setTodos } = useFetchTasks();

  const remainingTasks = useMemo(() => {
    const remain = todos.filter((todo) => !todo.completed);
    console.log("remain>>", remain);
    return remain.length;
  }, [todos]);

  const hasCompletedTasks = useMemo(() => {
    const hasCompleted =
      (todos && todos.some((todo) => todo.completed)) || false;
    return hasCompleted;
  }, [todos]);

  // useEffect(() => {

  //   localStorage.setItem("todos", JSON.stringify(todos));
  //   const hasCompleted = todos.some((todo) => todo.completed);

  // }, [todos]);

  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  const updateTodosState = (type, payload) => {
    setTodos((prevTodos) => {
      switch (type) {
        case "add":
          return [...prevTodos, payload];
        case "delete":
          return prevTodos.filter((todo) => todo._id !== payload.id);
        case "update":
          return prevTodos.map((todo) =>
            todo._id === payload.id ? { ...todo, ...payload.updates } : todo
          );
        case "completeAll":
          return prevTodos.map((todo) => ({ ...todo, completed: true }));
        case "clearCompleted":
          return prevTodos.filter((todo) => !todo.completed);
        default:
          return prevTodos;
      }
    });
  };

  const addTodo = async () => {
    if (todoText.trim() !== "") {
      try {
        const { data } = await createNewTask({
          text: todoText,
          completed: false,
          color: getRandomColor(),
        });
        console.log("Created>>", data);
        updateTodosState("add", data);
        setTodoText("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTask({
        id,
      });
      updateTodosState("delete", {
        id,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTodo = async (index) => {
    setEditIndex(index);
    setEditableText(todos[index].text);
  };

  const saveEditedTodo = async (task) => {
    if (editableText.trim() !== "") {
      try {
        const { data } = await updateTask({
          id: task._id,
          text: editableText,
          completed: task.completed,
          color: getRandomColor(),
        });
        console.log("Updated>>", data);
        updateTodosState("update", {
          id: task._id,
          updates: {
            ...data,
          },
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
    setEditIndex(null);
  };

  const toggleComplete = async (task) => {
    try {
      const { data } = await updateTask({
        id: task._id,
        text: task.text,
        completed: !task.completed,
        color: task.color,
      });
      console.log("Toggled>>", data);
      updateTodosState("update", {
        id: task._id,
        updates: {
          ...data,
        },
      });
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const toggleSelectAll = async () => {
    try {
      await completeAllTasks();
      updateTodosState("completeAll");
    } catch (error) {
      console.error("Error toggling all tasks:", error);
    }
  };

  //handle enter key event for task input
  const handleInputKeyPress = (task, event) => {
    if (event.key === "Enter") {
      saveEditedTodo(task);
    }
  };

  const clearCompleted = async () => {
    try {
      await clearCompletedTasks();
      updateTodosState("clearCompleted");
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
    }
  };

  return (
    <div
      className="h-screen pt-16 px-4"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="md:w-1/2 mx-auto">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">TaskManager</h1>
          <p className="font-bold">{dayjs().format("DD.MM.YYYY (ddd)")}</p>
        </div>
      </div>
      <div className="md:w-4/5 lg:w-1/2 mx-auto shadow-lg">
        <div className="flex items-center bg-white border-2">
          {todos.length > 0 && (
            <FaCheckDouble
              color="black"
              className={`ml-5 ${
                todos.every((todo) => todo.completed) ? "text-blue-500" : ""
              }`}
              onClick={toggleSelectAll}
            />
          )}
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="What needs to be done?"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            className="pl-5 border-2 flex-1 py-4 outline-none border-none"
          />
        </div>

        {todos.length > 0 && (
          <ul
            className="h-[25rem] overflow-y-scroll scrollbar-hide bg-white"
            style={{ scrollbarWidth: "none" }}
          >
            {todos
              .filter((todo) => {
                if (filter === "completed") {
                  return todo.completed;
                } else if (filter === "remaining") {
                  return !todo.completed;
                }
                return true;
              })
              .map(({ _id, text, completed, color }, index) => (
                <li key={index}>
                  <div className="flex flex-row items-center justify-between bg-white py-4 pr-4 group border-2">
                    <div className="flex flex-1 items-center">
                      <button
                        onClick={() =>
                          toggleComplete({
                            _id,
                            text,
                            completed,
                            color,
                          })
                        }
                        className="pr-4 flex items-center"
                      >
                        <span
                          style={{ backgroundColor: color }}
                          className="w-1 mr-4"
                        >
                          &nbsp;
                        </span>
                        {completed ? (
                          <FaCheckCircle size={20} color="#9dbb32" />
                        ) : (
                          <FaCircle size={20} color="#9dbb32" />
                        )}
                      </button>
                      {editIndex === index ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editableText}
                          onChange={(e) => setEditableText(e.target.value)}
                          onBlur={() =>
                            saveEditedTodo({
                              _id,
                              text,
                              completed,
                              color,
                            })
                          }
                          onKeyPress={(e) =>
                            handleInputKeyPress(
                              {
                                _id,
                                text,
                                completed,
                                color,
                              },
                              e
                            )
                          }
                          autoFocus
                          className="outline-none flex-1"
                        />
                      ) : completed ? (
                        <s>{text}</s>
                      ) : (
                        <span>{text}</span>
                      )}
                    </div>

                    <div
                      className={`flex space-x-4 py-1 px-2 rounded-md group-hover:opacity-100 group-hover:visible opacity-0 invisible transition-opacity ease-in-out duration-300`}
                    >
                      <FaEdit onClick={() => editTodo(index)} />
                      <FaTimes onClick={() => deleteTodo(_id)} />
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
        {todos.length > 0 && (
          <div className="bg-lightblue flex flex-col md:flex-row items-center justify-between py-4 px-8">
            <p>
              <span className="font-bold">{remainingTasks}</span> items left
            </p>
            <div className="flex-grow flex justify-center mb-2 md:mb-0">
              <button
                className={`mx-2 ${
                  filter === "all" ? "text-blue-500 underline" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`mx-2 ${
                  filter === "completed" ? "text-blue-500 underline" : ""
                }`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
              <button
                className={`mx-2 ${
                  filter === "remaining" ? "text-blue-500 underline" : ""
                }`}
                onClick={() => setFilter("remaining")}
              >
                Remaining
              </button>
            </div>
            <div className="w-full md:w-32">
              {hasCompletedTasks && (
                <button className="w-full md:ml-auto" onClick={clearCompleted}>
                  Clear Completed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
