'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Plus, Trash2, Loader } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [error, setError] = useState('');

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/todos/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.status}`);
      }

      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch todos';
      console.error('Error fetching todos:', err);
      setError(errorMsg);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/todos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo: ${response.status}`);
      }

      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create todo';
      console.error('Error creating todo:', err);
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTodo = async (id: number, currentCompleted: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !currentCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update todo: ${response.status}`);
      }

      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      console.error('Error updating todo:', err);
      alert('Failed to update todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete todo: ${response.status}`);
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      alert('Failed to delete todo');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen  from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className=" from-indigo-600 via-purple-600 to-pink-600 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">✓ Todo Manager</h1>
              <p className="text-indigo-100 font-medium">Django REST Framework + Next.js</p>
            </div>
            <Link
              href="/"
              className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              ← Home
            </Link>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-semibold">Error: {error}</p>
            <p className="text-sm">Make sure Django backend is running on http://localhost:8000</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Todo Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 style={{ color: '#1f2937' }} className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Plus size={24} className="text-indigo-600" />
                <span>Add New Todo</span>
              </h2>

              <form onSubmit={handleCreateTodo} className="space-y-4">
                <div>
                  <label style={{ color: '#1f2937' }} className="block text-sm font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition placeholder-gray-500"
                  />
                </div>

                <div>
                  <label style={{ color: '#1f2937' }} className="block text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    rows={3}
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition resize-none placeholder-gray-500"
                  />
                </div>

                <div>
                  <label style={{ color: '#1f2937' }} className="block text-sm font-semibold mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition placeholder-gray-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full from-indigo-600 to-purple-600 text-black py-2 px-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Todo
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Todo List */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    filter === f
                      ? ' from-indigo-600 to-purple-600 text-white'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-500'
                  }`}
                >
                  <span style={{ color: filter === f ? '#ffffff' : '#1f2937' }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            {/* Todo Items */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={32} className="animate-spin text-indigo-600" />
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p style={{ color: '#1f2937' }} className="text-xl font-medium">
                  {filter === 'all' && 'No todos yet. Create one to get started!'}
                  {filter === 'completed' && 'No completed todos yet.'}
                  {filter === 'pending' && 'All caught up! No pending todos.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`bg-white rounded-xl shadow-md p-5 transition transform hover:shadow-lg hover:scale-105 ${
                      todo.completed ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleTodo(todo.id, todo.completed)}
                        className="mt-1 text-indigo-600 hover:text-purple-600 transition flex shrink-0"
                      >
                        {todo.completed ? (
                          <CheckCircle2 size={24} className="text-green-500" />
                        ) : (
                          <Circle size={24} className="text-gray-300" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <h3
                            style={{ color: todo.completed ? '#9ca3af' : '#1f2937' }}
                            className={`text-lg font-semibold ${
                              todo.completed ? 'line-through' : ''
                            }`}
                          >
                            {todo.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                              todo.priority
                            )}`}
                          >
                            <span style={{ color: 'inherit' }}>{todo.priority}</span>
                          </span>
                        </div>
                        {todo.description && (
                          <p style={{ color: '#1f2937' }} className="text-sm mt-2 font-medium">
                            {todo.description}
                          </p>
                        )}
                        <p style={{ color: '#6b7280' }} className="text-xs mt-2 font-medium">
                          {new Date(todo.created_at).toLocaleDateString()} at{' '}
                          {new Date(todo.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 transition flex shrink-0 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
