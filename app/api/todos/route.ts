import { NextResponse } from "next/server";
import fs from 'fs'
import path from 'path'

export async function GET() {
    const todo = {
        id: 1,
        title: "Hello World",
        completed: false,
    };

    return NextResponse.json(todo);
}

export async function POST(request: Request) {
    const filePath = path.join(process.cwd(), "todos.json");
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
            id: Date.now(),
            title: body.title || "Untitled",
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