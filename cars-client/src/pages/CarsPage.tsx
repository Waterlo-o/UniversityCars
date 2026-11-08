import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import CarCard from '../components/CarCard';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore(
    (state) => state.setShowFavoritesOnly
  );
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setIsLoading(true);
        setError(null);

        const loadedCars = await getCars(controller.signal);
        setCars(loadedCars);
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
          return;
        }

        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError('Wystapil nieznany blad.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
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
      removeFavorite(id);
      setCars((currentCars) => currentCars.filter((car) => car.id !== id));
    } catch (caughtError) {
      alert(
        caughtError instanceof Error
          ? caughtError.message
          : 'Błąd podczas usuwania samochodu'
      );
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesFavorite =
      !showFavoritesOnly || favoriteCarIds.includes(car.id);

    return matchesSearch && matchesFavorite;
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

      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Szukaj po marce lub modelu..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <label className="favorite-filter">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Tylko ulubione
        </label>
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

      {!isLoading && !error && cars.length > 0 && visibleCars.length === 0 && (
        <div className="status-box empty">
          <p>Brak samochodów spełniających wybrane kryteria.</p>
        </div>
      )}

      {!isLoading && !error && visibleCars.length > 0 && (
        <div className="cars-grid">
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
