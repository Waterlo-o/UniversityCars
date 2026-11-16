import { NavLink, useNavigate } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Navigation() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const favoriteCount = useCarUiStore((state) =>
    user ? (state.favoriteCarIdsByUser[user.id] ?? []).length : 0,
  );

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        Strona główna
      </NavLink>

      {user && (
        <>
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
        </>
      )}

      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        O aplikacji
      </NavLink>

      {user ? (
        <>
          <span className="favorite-counter">
            Ulubione: {favoriteCount}
          </span>
          <span className="user-info">
            {user.userName} ({user.roles.join(', ')})
          </span>
          <button
            type="button"
            className="nav-button"
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Logowanie
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Rejestracja
          </NavLink>
        </>
      )}
    </nav>
  );
}
