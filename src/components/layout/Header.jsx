import React from 'react';
import { useAuth } from '../auth/AuthProvider';

export default function Header() {
  const { user, signInWithGoogle, logout } = useAuth();
  return (
    <header className="header">
      <div className="header-title">Steel Industry AI Consultant</div>
      <div className="header-right">
        {!user ? (
          <>
            <button className="header-button" onClick={signInWithGoogle}>Sign In</button>
            <button className="header-button" onClick={signInWithGoogle}>Sign Up</button>
          </>
        ) : (
          <>
          <div>
            {/* <h5>{user.displayName}</h5> */}
            <button className="header-button" onClick={logout}>Logout</button>
          </div>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="header-avatar"
                title={user.displayName}
                referrerPolicy="no-referrer"
              />
            )}
          </>
        )}
      </div>
    </header>
  );
}
