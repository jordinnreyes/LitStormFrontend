import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const imageSource = require('../assets/images/Imagosinfondo.png');

  return (
    <LinearGradient
      colors={['#1C3A94', '#373737']}
      style={styles.container}
    >
      <Text style={styles.title}>LitStorm</Text>

      {imageSource && (
<View style={{
  backgroundColor: 'white',
  borderRadius: 70,
  padding: 10,
  marginBottom: 35,
}}>
  <Image
    source={imageSource}
    style={{ width: 220, height: 170 }}
    resizeMode="contain"
  />
</View>

      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#1C3A94' }]}
        onPress={() => router.push('/Login')}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#F5B800' }]}
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
    fontSize: 54,
    fontWeight: 'bold',
    marginBottom: 35,
    color: '#F5B800',
    textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 3,
  },
  image: {
    width: 270,
    height: 200,
    marginBottom: 35,
    shadowColor: '#F5B800',
    shadowOpacity: 0.9,
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
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, 

  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

