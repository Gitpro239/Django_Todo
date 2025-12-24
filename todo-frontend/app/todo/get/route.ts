import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for todos (in production, use a database)
const todos: Array<{
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}> = [
  {
    id: '1',
    title: 'Learn Next.js',
    description: 'Master Next.js fundamentals',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Build Todo App',
    description: 'Create a full-stack todo application',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const completed = searchParams.get('completed');

    let filteredTodos = todos;

    if (completed !== null) {
      const completedBool = completed === 'true';
      filteredTodos = todos.filter((todo) => todo.completed === completedBool);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Todos retrieved successfully',
        data: filteredTodos,
        count: filteredTodos.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve todos',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
