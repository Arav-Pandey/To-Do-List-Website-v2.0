"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [newTask, setNewTask] = useState("");
  const queryClient = useQueryClient();

  // Fetch todos
  const {
    status: queryStatus,
    error,
    data: queryData,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((r) => r.json()),
  });

  // Add new todo
  const { mutate: addMutate } = useMutation({
    mutationFn: (newTask: string) =>
      fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({
          text: newTask,
        }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // Delete todo
  const { mutate: deleteMutate } = useMutation({
    mutationFn: (taskText: string) =>
      fetch("/api/todos", {
        method: "DELETE",
        body: JSON.stringify({ text: taskText }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // Update todo (toggle done)
  const { mutate: updateMutate } = useMutation({
    mutationFn: (task: { text: string; done: boolean }) =>
      fetch("/api/todos", {
        method: "PUT",
        body: JSON.stringify(task),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // Handle query states
  if (queryStatus === "pending") {
    return <p>Loading tasks...</p>;
  }
  if (queryStatus === "error") {
    return <p>{"Error loading tasks: " + error}</p>;
  }

  const tasks: { text: string; done: boolean }[] = queryData;

  return (
    <div>
      <h1 className="flex justify-center items-center mt-10 mb-3">
        To-Do list
      </h1>

      <h3 className="flex justify-center items-center mb-[15px]">
        Add any item you would like to your list and I will keep track of it.
      </h3>

      <div className="flex justify-center items-center mb-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (newTask.trim() === "") return;
            addMutate(newTask);
            setNewTask(""); // Clear the input after adding
          }}
        >
          {/* Clear All */}
          <button
            type="button"
            onClick={() => tasks.forEach((task) => deleteMutate(task.text))}
            className="border-amber-50 border w-[70px] h-[24px] text-[14px] rounded cursor-pointer inline-flex items-center justify-center text-center p-0 mr-[10px]"
          >
            Clear All
          </button>

          {/* Undo Check */}
          <button
            type="button"
            onClick={() =>
              tasks.forEach((task) =>
                updateMutate({ text: task.text, done: false })
              )
            }
            className="border-amber-50 border w-[100px] h-[24px] text-[14px] rounded cursor-pointer inline-flex items-center justify-center text-center p-0 mr-[10px]"
          >
            Undo Check
          </button>

          {/* Input */}
          <input
            className="led-input border rounded px-[10px] py-[6px] outline-none focus:ring-2 focus:ring-blue-500"
            value={newTask}
            placeholder="Enter a new task here..."
            onChange={(e) => setNewTask(e.target.value)}
          />

          {/* Mark all as done */}
          <button
            type="button"
            onClick={() =>
              tasks.forEach((task) =>
                updateMutate({ text: task.text, done: true })
              )
            }
            className="border-amber-50 border w-[130px] h-[24px] text-[14px] rounded cursor-pointer inline-flex items-center justify-center text-center p-0 ml-[10px]"
          >
            Mark all as done
          </button>
        </form>
      </div>

      {/* Todo list */}
      <div className="flex flex-col items-center">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              name={task.text}
              checked={!!task.done}
              onChange={() =>
                updateMutate({ text: task.text, done: !task.done })
              }
            />
            <span className="mx-2">{task.text}</span>
            <button
              type="button"
              className="w-[12px] h-[12px] text-[10px] rounded cursor-pointer inline-flex items-center justify-center text-center p-0"
              onClick={() => deleteMutate(task.text)}
            >
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
