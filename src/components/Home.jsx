import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Chat App
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome to Chat App! Please login or register to start chatting.
          </p>
          <div className="flex justify-between mt-4">
            <Link
              to="/login" // Assuming you have a route for the login page
              className="text-blue-700 dark:text-blue-500 hover:underline focus:outline-none"
            >
              Login
            </Link>
            <Link
              to="/register" // Assuming you have a route for the register page
              className="text-blue-700 dark:text-blue-500 hover:underline focus:outline-none"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home