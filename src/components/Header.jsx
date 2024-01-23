import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-10">
      <h1 className="text-2xl font-bold">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-white hover:underline ${isActive ? "text-orange-700" : "text-gray-700"}`
          }
        >
          Chat App
        </NavLink>
      </h1>
    </header>
  );
}

export default Header;