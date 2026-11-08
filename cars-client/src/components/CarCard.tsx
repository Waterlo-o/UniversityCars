import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { FuelTypeLabels, BodyTypeLabels } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  const isFavorite = useCarUiStore((state) =>
    state.favoriteCarIds.includes(car.id)
  );

  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  return (
    <div className="car-card">
      <div className="car-card-header">
        <h3>
          {car.brand} {car.model}
        </h3>
        <span className="badge">
          {BodyTypeLabels[car.bodyType] ?? 'Inny'}
        </span>
      </div>

      <div className="car-card-body">
        <p><strong>Paliwo:</strong> {FuelTypeLabels[car.fuelType] ?? car.fuelType}</p>
        <p><strong>Pojemność silnika:</strong> {car.engineCapacity} cm³</p>
        <p><strong>Liczba drzwi:</strong> {car.doorsNumber}</p>
        <p><strong>Średnie spalanie:</strong> {car.averageFuelConsumption} l/100km</p>
      </div>

      <div className="car-card-actions">
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
        <Link to={`/cars/${car.id}`} className="btn btn-outline">
          Szczegóły
        </Link>
        <Link to={`/cars/${car.id}/edit`} className="btn btn-secondary">
          Edytuj
        </Link>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(car.id)}
        >
          Usuń
        </button>
      </div>
    </div>
  );
}
