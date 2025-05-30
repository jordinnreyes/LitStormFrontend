import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
const router = useRouter();


let imageSource;
try {
  imageSource = require('../../assets/images/home.jpg');
} catch (error) {
  console.error("Error cargando imagen:", error);
}

  return (
    <LinearGradient
      colors={['#007AFF', '#8A2BE2']} // azul a violeta
      style={styles.container}
    >
      <Text style={styles.title}>Litstorm</Text>


    {/* Imagen entre el título y los botones */}
    {imageSource && (
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
      />
    )}


      <TouchableOpacity style={styles.button} onPress={() => router.push('/Login')}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#34C759' }]} onPress={() => router.push('/Register')}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>


    </LinearGradient>
   
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 60,
    color: '#FFF000',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 20,
    width: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 40,
    borderRadius: 12
  },
});
