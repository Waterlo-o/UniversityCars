import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { FuelTypeLabels, BodyTypeLabels } from '../models/Car';
import { getCarById, deleteCar } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const favoriteCarIds = useCarUiStore((state) =>
    user ? state.favoriteCarIdsByUser[user.id] ?? [] : [],
  );
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  const isAdmin = user?.roles.includes('Admin') ?? false;

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
      if (user) {
        removeFavorite(user.id, car.id);
      }
      navigate('/cars');
    } catch (caughtError) {
      alert(
        caughtError instanceof Error
          ? caughtError.message
          : 'Błąd podczas usuwania',
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
              onClick={() => {
                if (user) {
                  toggleFavorite(user.id, car.id);
                }
              }}
            >
              {isFavorite ? 'Ulubiony' : 'Ulubione'}
            </button>
            <Link to={`/cars/${car.id}/edit`} className="btn btn-secondary">
              Edytuj
            </Link>
            {isAdmin && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Usuń
              </button>
            )}
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

        {car.features && car.features.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Wyposażenie</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {car.features.map((feature) => (
                <span
                  key={feature.id}
                  className="badge"
                  style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.4rem 0.8rem', borderRadius: '4px' }}
                >
                  {feature.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {car.photos && car.photos.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Zdjęcia pojazdu</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
              {car.photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    position: 'relative',
                    border: photo.isMain ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={photo.url}
                    alt="Zdjęcie samochodu"
                    style={{ width: '200px', height: '140px', objectFit: 'cover', display: 'block' }}
                  />
                  {photo.isMain && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        background: '#2563eb',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}
                    >
                      Główne
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="details-footer">
          <Link to="/cars" className="btn btn-outline">
            &larr; Wróć do listy samochodów
          </Link>
        </div>
      </div>
    </div>
  );
}
