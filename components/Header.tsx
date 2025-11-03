import React from 'react';
// FIX: Import firebase to use v8/compat User type.
import firebase from 'firebase/app';
// FIX: The User type is not available as a modular import, switching to v8 compat type.
// import { User } from 'firebase/auth';

interface HeaderProps {
  // FIX: Use firebase.auth.User type from v8/compat SDK.
  user: firebase.auth.User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 max-w-2xl flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Property Inspection</h1>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 hidden sm:block">{user.email}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;