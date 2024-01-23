import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center sticky bottom-0">
      © {new Date().getFullYear()} Chat App. All rights reserved.
    </footer>
  );
}

export default Footer;
