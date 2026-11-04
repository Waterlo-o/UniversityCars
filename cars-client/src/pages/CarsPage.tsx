import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import CarCard from '../components/CarCard';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCars(controller.signal);
        setCars(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd');
      } finally {
        setIsLoading(false);
      }
    }

    loadCars();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten samochód?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteCar(id);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Błąd podczas usuwania samochodu');
    }
  }

  const filteredCars = cars.filter((car) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      car.brand.toLowerCase().includes(term) ||
      car.model.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Lista samochodów</h2>
          <p className="subtitle">Liczba pojazdów: {cars.length}</p>
        </div>
        <Link to="/cars/new" className="btn btn-primary">
          + Dodaj samochód
        </Link>
      </div>

      <div className="filter-box">
        <input
          type="text"
          className="form-control"
          placeholder="Filtruj po marce lub modelu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSearchTerm('')}
          >
            Wyczyść
          </button>
        )}
      </div>

      {isLoading && (
        <div className="status-box loading">
          <p>Ładowanie danych o samochodach...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="status-box error">
          <p>Wystąpił błąd: {error}</p>
        </div>
      )}

      {!isLoading && !error && cars.length === 0 && (
        <div className="status-box empty">
          <p>Brak samochodów w bazie danych.</p>
          <Link to="/cars/new" className="btn btn-primary">
            Dodaj pierwszy samochód
          </Link>
        </div>
      )}

      {!isLoading && !error && cars.length > 0 && filteredCars.length === 0 && (
        <div className="status-box empty">
          <p>Brak samochodów pasujących do frazy "{searchTerm}".</p>
        </div>
      )}

      {!isLoading && !error && filteredCars.length > 0 && (
        <div className="cars-grid">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
