import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-pink-500 to-yellow-400">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Todo App
          </h1>
          <p className="text-2xl text-white/90 drop-shadow-md">
            Manage your tasks efficiently with a modern interface
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/todo"
            className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:scale-105 transition transform shadow-xl hover:shadow-2xl"
          >
            Go to Todo Manager
          </Link>
          
        </div>
      </div>
    </div>
  );
}
