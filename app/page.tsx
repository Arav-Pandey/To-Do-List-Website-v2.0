"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  // const [tasks, setTasks] = useState<{ text: string; done: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");
  const queryClient = useQueryClient();
  const { status, error, data } = useQuery({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("/api/todos").then((r) => {
        return r.json();
      }),
  });

  // Example tasks
  const exampleTasks = [
    { text: "Example task #1", done: false },
    { text: "Example task #2", done: false },
  ];
  if (status === "pending") {
    return <p>Loading tasks...</p>;
  }
  if (status === "error") {
    return <p>Error loading tasks...</p>;
  }
  const tasks: { text: string; done: boolean }[] = data;
  const displayTasks = tasks.length === 0 ? exampleTasks : tasks;

  return (
    <div>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        To-Do list
      </h1>
      <h3
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        Add any item you would like to your list and I will keep track of it.
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (newTask.trim() === "") return; // optional: ignore empty tasks
            //setTasks([...tasks, { text: newTask, done: false }]);
            setNewTask(""); // Clear the input after adding the task
          }}
        >
          <button
            type="button"
            //onClick={() => setTasks([])}
            style={{
              width: "70px",
              height: "24px",
              fontSize: "14px",
              borderRadius: "4px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center", // Center the text
              padding: 0, // Remove extra padding
              display: "inline-block", // Ensure proper centering
              marginRight: "10px",
            }}
          >
            {" "}
            Clear All
          </button>

          <button
            type="button"
            // onClick={() =>
            //   setTasks(tasks.map((task) => ({ ...task, done: false })))
            // }
            style={{
              width: "100px",
              height: "24px",
              fontSize: "14px",
              borderRadius: "4px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center", // Center the text
              padding: 0, // Remove extra padding
              display: "inline-block", // Ensure proper centering
              marginRight: "10px", // Add margin for spacing
            }}
          >
            {" "}
            Undo Check
          </button>

          <input
            className="led-input"
            value={newTask}
            placeholder="Enter a new task here..."
            onChange={(e) => setNewTask(e.target.value)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "6px 10px",
              outline: "none",
            }}
          />
          <button
            type="button"
            // onClick={() =>
            //   // setTasks(tasks.map((task) => ({ ...task, done: true })))
            // }
            style={{
              width: "130px",
              height: "24px",
              fontSize: "14px",
              borderRadius: "4px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center", // Center the text
              padding: 0, // Remove extra padding
              display: "inline-block", // Ensure proper centering
              marginLeft: "10px",
            }}
          >
            Mark all as done
          </button>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {displayTasks.map((task, index) => (
          <div key={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name={task.text}
                checked={task.done}
                disabled={tasks.length === 0} // Disable for example tasks
                onChange={() => {
                  if (tasks.length === 0) return; // Prevent toggling example tasks
                  // setTasks(
                  //   tasks.map((t, i) =>
                  //     i === index ? { ...t, done: !t.done } : t
                  //   )
                  // );
                }}
              />
              <span style={{ margin: "0 8px" }}>{task.text}</span>
              <button
                type="button"
                // onClick={() => {
                //   setTasks(tasks.filter((_, i) => i !== index));
                // }}
                style={{
                  width: "12px",
                  height: "12px",
                  fontSize: "10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center", // Center the text
                  padding: 0, // Remove extra padding
                  display: "flex", // Ensure proper centering
                }}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
