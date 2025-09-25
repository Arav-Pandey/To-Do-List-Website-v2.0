import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "todos.json");

export async function GET() {
  let todos: { text: string, done: boolean}[] = [];
  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    todos = JSON.parse(fileData);
  } catch {
    todos = [];
  }

  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ensure file exists (create if missing)
    let todos: any[] = [];
    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      todos = JSON.parse(fileData);
    } catch {
      todos = [];
    }

    // Create new todo object
    const newTodo = {
      text: body.text || "Untitled",
      completed: false,
    };

    // Append and save
    todos.push(newTodo);
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));

    return NextResponse.json({ message: "Todo added", todo: newTodo });
  } catch (error) {
    console.error("Error saving todo:", error);
    return NextResponse.json({ error: "Failed to save todo" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json(); // expect something like { text: "todo text" }

    let todos: { text: string; completed: boolean }[] = [];
    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      todos = JSON.parse(fileData);
    } catch {
      todos = [];
    }

    // Filter out the todo by text
    const updatedTodos = todos.filter((todo) => todo.text !== body.text);

    // Save updated list
    fs.writeFileSync(filePath, JSON.stringify(updatedTodos, null, 2));

    return NextResponse.json({
      message: "Todo deleted",
      deleted: body.text,
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
  
}
export async function PUT(request: Request) {
  try {
    const body = await request.json(); 
    // Expecting { text: "todo text", done: true/false }

    let todos: { text: string; done: boolean }[] = [];
    try {
      const fileData = fs.readFileSync(filePath, "utf-8");
      todos = JSON.parse(fileData);
    } catch {
      todos = [];
    }

    // Find and update the todo
    let updated = false;
    const updatedTodos = todos.map((todo) => {
      if (todo.text === body.text) {
        updated = true;
        return { ...todo, done: body.done }; // update the "done" field
      }
      return todo;
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    // Save updated list
    fs.writeFileSync(filePath, JSON.stringify(updatedTodos, null, 2));

    return NextResponse.json({
      message: "Todo updated",
      updatedTodo: body.text,
      done: body.done,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

