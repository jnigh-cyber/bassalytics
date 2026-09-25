import { useQuery } from '@tanstack/react-query';

type CurrentWeather = {
  current: {
    tempC: number;
    weatherCode: number;
  };
};

export function useCurrentWeather() {
  return useQuery({
    queryKey: ['currentWeather'],
    queryFn: async (): Promise<CurrentWeather> => {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/api/weather`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    },
  });
}
