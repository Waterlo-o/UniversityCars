import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
  const favoriteCount = useCarUiStore(
    (state) => state.favoriteCarIds.length
  );

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
            <span className="favorite-counter">
              Ulubione: {favoriteCount}
            </span>
          </nav>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
