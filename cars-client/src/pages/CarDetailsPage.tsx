import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { FuelTypeLabels, BodyTypeLabels } from '../models/Car';
import { getCarById, deleteCar } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();

    async function loadCar() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCarById(id!, controller.signal);
        setCar(data);
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
          return;
        }

        if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError('Nie udalo sie pobrac szczegolow.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadCar();

    return () => {
      controller.abort();
    };
  }, [id]);

  async function handleDelete() {
    if (!car) return;

    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten samochód?');
    if (!confirmed) return;

    try {
      await deleteCar(car.id);
      removeFavorite(car.id);
      navigate('/cars');
    } catch (caughtError) {
      alert(
        caughtError instanceof Error
          ? caughtError.message
          : 'Błąd podczas usuwania'
      );
    }
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="status-box loading">
          <p>Ładowanie szczegółów samochodu...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="page-container">
        <div className="status-box error">
          <p>{error ?? 'Nie znaleziono samochodu'}</p>
          <Link to="/cars" className="btn btn-primary">
            Wróć do listy samochodów
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favoriteCarIds.includes(car.id);
  const formattedDate = car.productionDate
    ? new Date(car.productionDate).toLocaleDateString('pl-PL')
    : '-';

  return (
    <div className="page-container">
      <div className="details-card">
        <div className="details-header">
          <div>
            <h2>
              {car.brand} {car.model}
            </h2>
            <span className="badge">
              {BodyTypeLabels[car.bodyType] ?? 'Inny'}
            </span>
          </div>

          <div className="details-actions">
            <button
              type="button"
              className={
                isFavorite
                  ? 'btn favorite-button active-favorite'
                  : 'btn favorite-button'
              }
              onClick={() => toggleFavorite(car.id)}
            >
              {isFavorite ? 'Ulubiony' : 'Ulubione'}
            </button>
            <Link to={`/cars/${car.id}/edit`} className="btn btn-secondary">
              Edytuj
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Usuń
            </button>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Identyfikator:</span>
            <span className="detail-value">{car.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Marka:</span>
            <span className="detail-value">{car.brand}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Model:</span>
            <span className="detail-value">{car.model}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Liczba drzwi:</span>
            <span className="detail-value">{car.doorsNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pojemność bagażnika:</span>
            <span className="detail-value">{car.luggageCapacity} l</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pojemność silnika:</span>
            <span className="detail-value">{car.engineCapacity} cm³</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Rodzaj paliwa:</span>
            <span className="detail-value">
              {FuelTypeLabels[car.fuelType] ?? car.fuelType}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Data produkcji:</span>
            <span className="detail-value">{formattedDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Średnie spalanie:</span>
            <span className="detail-value">{car.averageFuelConsumption} l/100km</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Typ nadwozia:</span>
            <span className="detail-value">
              {BodyTypeLabels[car.bodyType] ?? car.bodyType}
            </span>
          </div>
        </div>

        <div className="details-footer">
          <Link to="/cars" className="btn btn-outline">
            &larr; Wróć do listy samochodów
          </Link>
        </div>
      </div>
    </div>
  );
}
