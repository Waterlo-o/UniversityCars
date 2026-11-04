import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-card">
        <h1>System Zarządzania Samochodami</h1>
        <p>
          Aplikacja kliencka do przeglądania, dodawania, edycji i usuwania danych o
          samochodach.
        </p>
        <div className="hero-actions">
          <Link to="/cars" className="btn btn-primary">
            Przeglądaj samochody
          </Link>
          <Link to="/cars/new" className="btn btn-secondary">
            Dodaj nowy samochód
          </Link>
        </div>
      </div>
    </div>
  );
}
