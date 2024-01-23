import React from 'react'
import { Link, useRouteError } from "react-router-dom";

function RouteError() {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
        <p className="text-gray-700 mb-4"><b>{error.statusText || error.message}</b></p>
        <img
          src="/error.jpg"
          alt="Error Illustration"
          className="w-24 h-24 mx-auto mb-4"
        />
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full inline-block"
        >
          Go back to home
        </Link>
      </div>
    </div>
  );
}

export default RouteError