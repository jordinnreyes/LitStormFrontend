// app/PerfilUsuario.tsx
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Card, Text } from 'react-native-paper';
import { fetchUserProfile } from '../apis/apiGetProfileRole';

export default function PerfilUsuario() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const perfil = await fetchUserProfile(token);
        setUser(perfil);
      }
      setLoading(false);
    };

    cargarUsuario();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!user) return <Text style={{ color: '#fff', textAlign: 'center', marginTop: 30 }}>No se pudo cargar el perfil</Text>;

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.background}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title={`${user.nombre} ${user.apellido}`}
            subtitle={user.email}
            titleStyle={{ color: '#fff', fontWeight: 'bold' }}
            subtitleStyle={{ color: '#e5e7eb' }}
            left={() => <Avatar.Text label={user.nombre[0]} style={{ backgroundColor: '#10b981' }} />}
            leftStyle={{ marginRight: 35 }}
          />
          <Card.Content>
            <Text style={styles.label}>Rol:</Text>
            <Text style={styles.value}>👤 {user.role}</Text>
          </Card.Content>
        </Card>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e3c72',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    paddingVertical: 20,
    elevation: 4,
    
  },
  label: {
    color: '#FFDC64',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
    
  },
  value: {
    fontSize: 18,
    color: '#f3f4f6',
    fontWeight: 'bold',
    
  },
});
