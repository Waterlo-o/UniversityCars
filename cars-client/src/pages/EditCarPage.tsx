import { useEffect, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import axios from 'axios';
import type { NewCar } from '../models/Car';
import { FuelTypeLabels, BodyTypeLabels } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewCar>({
    brand: '',
    model: '',
    doorsNumber: 5,
    luggageCapacity: 450,
    engineCapacity: 1600,
    fuelType: 0,
    productionDate: '',
    averageFuelConsumption: 6.0,
    bodyType: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

        const normalizedDate = data.productionDate
          ? data.productionDate.split('T')[0]
          : '';

        setFormData({
          brand: data.brand,
          model: data.model,
          doorsNumber: data.doorsNumber,
          luggageCapacity: data.luggageCapacity,
          engineCapacity: data.engineCapacity,
          fuelType: data.fuelType,
          productionDate: normalizedDate,
          averageFuelConsumption: data.averageFuelConsumption,
          bodyType: data.bodyType,
        });
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
          return;
        }
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Nie udało się pobrać danych'
        );
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

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === 'number'
          ? Number(value)
          : name === 'fuelType' || name === 'bodyType'
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) return;

    if (!formData.brand.trim() || !formData.model.trim()) {
      setError('Marka i model są wymagane');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await updateCar(id, formData);
      navigate(`/cars/${id}`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Błąd podczas aktualizacji'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="status-box loading">
          <p>Ładowanie danych do edycji...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container form-page-container">
      <div className="form-card">
        <h2>Edycja samochodu</h2>
        <p className="subtitle">ID: {id}</p>

        {error && (
          <div className="status-box error">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Marka:</label>
              <input
                id="brand"
                name="brand"
                type="text"
                className="form-control"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model:</label>
              <input
                id="model"
                name="model"
                type="text"
                className="form-control"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="doorsNumber">Liczba drzwi (2-5):</label>
              <input
                id="doorsNumber"
                name="doorsNumber"
                type="number"
                min="2"
                max="5"
                className="form-control"
                value={formData.doorsNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="luggageCapacity">Pojemność bagażnika (l):</label>
              <input
                id="luggageCapacity"
                name="luggageCapacity"
                type="number"
                min="0"
                className="form-control"
                value={formData.luggageCapacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="engineCapacity">Pojemność silnika (cm³):</label>
              <input
                id="engineCapacity"
                name="engineCapacity"
                type="number"
                min="1"
                className="form-control"
                value={formData.engineCapacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="averageFuelConsumption">Średnie spalanie (l/100km):</label>
              <input
                id="averageFuelConsumption"
                name="averageFuelConsumption"
                type="number"
                step="0.1"
                min="0.1"
                className="form-control"
                value={formData.averageFuelConsumption}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fuelType">Rodzaj paliwa:</label>
              <select
                id="fuelType"
                name="fuelType"
                className="form-control"
                value={formData.fuelType}
                onChange={handleChange}
              >
                {Object.entries(FuelTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bodyType">Typ nadwozia:</label>
              <select
                id="bodyType"
                name="bodyType"
                className="form-control"
                value={formData.bodyType}
                onChange={handleChange}
              >
                {Object.entries(BodyTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productionDate">Data produkcji:</label>
            <input
              id="productionDate"
              name="productionDate"
              type="date"
              className="form-control"
              value={formData.productionDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <Link to={`/cars/${id}`} className="btn btn-outline">
              Anuluj
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
