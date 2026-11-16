import { Outlet } from 'react-router';
import Navigation from '../components/Navigation';

export default function RootLayout() {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-brand">Cars Application</div>
          <Navigation />
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
