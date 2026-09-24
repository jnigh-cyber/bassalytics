import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import { describeWeatherCodes } from '../lib/describeweathercodes';
import { cToF } from '../lib/units';
import { useUnitStore } from '../stores/useUnitStore';

export default function Index() {
  const { data, isPending, error } = useCurrentWeather();
  const unit = useUnitStore((u) => u.unit);
  const toggleUnit = useUnitStore((t) => t.toggleUnit);

  if (isPending) return <ActivityIndicator />;

  if (error) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>No data.</Text>;

  const temperature =
    unit === 'F' ? cToF(data.current.tempC) : data.current.tempC;

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleUnit}>
        <Text>
          {Math.round(temperature)}°{unit}
        </Text>
      </Pressable>
      <Text>{describeWeatherCodes(data.current.weatherCode)}</Text>
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
