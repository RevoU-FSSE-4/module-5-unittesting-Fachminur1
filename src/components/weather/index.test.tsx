import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Weather from '../weather';
import '@testing-library/jest-dom/extend-expect';

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
  }[];
}

beforeAll(() => {
  global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    let url: string;

    if (typeof input === 'string') {
      url = input;
    } else {
      url = input.toString();
    }

    let data: WeatherData;

    if (url.includes('Jakarta')) {
      data = {
        name: 'Jakarta',
        sys: { country: 'ID' },
        main: { temp: 30, humidity: 70 },
        wind: { speed: 10 },
        weather: [{ description: 'Sunny' }],
      };
    } else if (url.includes('New York')) {
      data = {
        name: 'New York',
        sys: { country: 'US' },
        main: { temp: 20, humidity: 60 },
        wind: { speed: 5 },
        weather: [{ description: 'Cloudy' }],
      };
    } else {
      data = {
        name: 'Unknown',
        sys: { country: '' },
        main: { temp: 0, humidity: 0 },
        wind: { speed: 0 },
        weather: [{ description: '' }],
      };
    }

    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => data,
    } as Response);
  });
});

afterAll(() => {
  (global.fetch as jest.Mock).mockRestore();
});

describe('Weather Component', () => {
  it('renders loading state initially', () => {
    render(<Weather />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches and displays weather data on load', async () => {
    render(<Weather />);

    await waitFor(() => {
      expect(screen.getByText('Jakarta, ID')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('Sunny')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('Wind Speed')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
      expect(screen.getByText('Humidity')).toBeInTheDocument();
    });
  });

  it('fetches weather data based on user search', async () => {
    render(<Weather />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=New York&appid=e34b4c51d8c2b7bf48d5217fe52ff79e'
      );
    });

    await waitFor(() => {
      expect(screen.getByText('New York, US')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Cloudy')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Wind Speed')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('Humidity')).toBeInTheDocument();
    });
  });
});
