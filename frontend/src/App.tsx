import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Gallery from './components/Gallery';
import LoginModal from './components/LoginModal';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';

export default function App() {
  const { token, isOwner, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app">
      <div className="home">
        <Navbar />
        <HeroSection />
      </div>
      <main>
        <Gallery isOwner={isOwner} token={token} />
      </main>
      {showLogin && (
        <LoginModal onLogin={login} onClose={() => setShowLogin(false)} />
      )}

      <div className="header__actions">
          {isOwner ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={() => setShowLogin(true)}>Owner login</button>
          )}
        </div>
    </div>
  );
}