import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import { describeWeatherCodes } from '../lib/describeweathercodes'
import { cToF } from '../lib/units'
 
export default function Index() {

  const { data, isPending, error } = useCurrentWeather();

  if(isPending) return <ActivityIndicator />

  if(error) return <Text>Error: {error.message}</Text>

  if(!data) return <Text>No data.</Text>

  return (
    <View style={styles.container}>
      <Text>{data.current.temperature_2m}°</Text>
      <Text>{describeWeatherCodes(data.current.weather_code)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
