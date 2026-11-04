import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-brand">Cars Application</div>
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Strona główna
            </NavLink>
            <NavLink
              to="/cars"
              end
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Samochody
            </NavLink>
            <NavLink
              to="/cars/new"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Dodaj samochód
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
