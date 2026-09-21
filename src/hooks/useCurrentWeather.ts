import { useQuery } from '@tanstack/react-query';

type CurrentWeather = {
    current: {
        temperature_2m: number;
        weather_code: number;
    };
};

export function useCurrentWeather() {
    const latitude = 36.1593;
    const longitude = -79.8891;
    const omURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`; 

    return useQuery({
        queryKey: ['currentWeather', latitude, longitude],
        queryFn: (): Promise<CurrentWeather> => 
            fetch(omURL).then((res) => {
                if(!res.ok) throw new Error(`Error: ${res.status}`);
                return res.json();
            })
    })

}

