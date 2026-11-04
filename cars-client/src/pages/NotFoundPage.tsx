import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1>404</h1>
        <h2>Strona nie została odnaleziona</h2>
        <p>Podany adres URL nie istnieje w aplikacji.</p>
        <Link to="/" className="btn btn-primary">
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
}
