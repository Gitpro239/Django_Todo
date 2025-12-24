import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for todos
const todos: Array<{
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Title is required and must be a string',
        },
        { status: 400 }
      );
    }

    if (body.title.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title cannot be empty',
        },
        { status: 400 }
      );
    }

    // Create new todo
    const newTodo = {
      id: Date.now().toString(),
      title: body.title.trim(),
      description: body.description ? String(body.description).trim() : '',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    return NextResponse.json(
      {
        success: true,
        message: 'Todo created successfully',
        data: newTodo,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid JSON format',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create todo',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
