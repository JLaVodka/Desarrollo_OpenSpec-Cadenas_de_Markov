import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

const responseBody = {
  initial_state: [1, 0, 0],
  steps: [1, 3, 5, 10],
  predictions: [
    { steps: 1, probabilities: [0.75, 0.25, 0] },
    { steps: 3, probabilities: [0.489375, 0.371875, 0.13875] },
    { steps: 5, probabilities: [0.3988734375, 0.3945296875, 0.206596875] },
    { steps: 10, probabilities: [0.35746622, 0.40273584, 0.23979794] },
  ],
};

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Enemy Behavior Predictor', () => {
  it('shows the default transition matrix and the Markov diagram', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Enemy Behavior Predictor' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Patrullando a Patrullando' })).toHaveValue(75);
    expect(screen.getByRole('spinbutton', { name: 'Atacando a Persiguiendo' })).toHaveValue(30);
    expect(screen.getByRole('img', { name: /Diagrama de transiciones/ })).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('allows editing values and blocks an invalid row with a clear message', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Patrullando a Patrullando' }), { target: { value: '70' } });
    fireEvent.click(screen.getByRole('button', { name: /Calcular predicción/ }));
    expect(screen.getByRole('alert')).toHaveTextContent(/fila 1 debe sumar 100%/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('updates the diagram from the matrix used by a successful calculation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => responseBody }));
    render(<App />);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Patrullando a Patrullando' }), { target: { value: '70' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Patrullando a Persiguiendo' }), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /Calcular predicción/ }));
    await screen.findByRole('heading', { name: 'Resultados numéricos' });
    const diagram = screen.getByRole('img', { name: /Diagrama de transiciones/ });
    expect(diagram).toHaveTextContent('30%');
    expect(diagram).not.toHaveTextContent('25%');
  });

  it('sends the valid matrix and renders returned results and grouped chart', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => responseBody });
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Calcular predicción/ }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Resultados numéricos' })).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8000/api/predict', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ matrix: [[0.75, 0.25, 0], [0.1, 0.6, 0.3], [0.2, 0.3, 0.5]] }),
    }));
    expect(screen.getByRole('row', { name: /10 pasos/ })).toHaveTextContent('35.75%');
    expect(screen.getByRole('img', { name: /barras agrupadas/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Evolución de probabilidades' })).toBeInTheDocument();
  });

  it('keeps the last successful result visible after an API error', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => responseBody })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ detail: 'Matriz inválida' }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Calcular predicción/ }));
    await screen.findByRole('heading', { name: 'Resultados numéricos' });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Patrullando a Patrullando' }), { target: { value: '70' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Patrullando a Persiguiendo' }), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /Calcular predicción/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Matriz inválida');
    expect(screen.getByRole('status')).toHaveTextContent(/último cálculo exitoso/i);
    expect(screen.getByRole('row', { name: /10 pasos/ })).toHaveTextContent('35.75%');
  });
});
