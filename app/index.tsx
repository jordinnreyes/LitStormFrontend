import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const imageSource = require('../assets/images/home.jpg');

  return (
    <LinearGradient
      colors={['#1e3c72', '#2a5298']}
      style={styles.container}
    >
      <Text style={styles.title}>LitStorm</Text>

      {imageSource && (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#3b82f6' }]}
        onPress={() => router.push('/Login')}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#10b981' }]}
        onPress={() => router.push('/Register')}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#FFDC64',
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 180,
    marginBottom: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginBottom: 20,
    width: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

