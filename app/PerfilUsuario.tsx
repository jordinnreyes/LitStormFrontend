// app/PerfilUsuario.tsx
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';
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

  if (loading) return <ActivityIndicator style={{ marginTop: 30 }} />;

  if (!user) return <Text>No se pudo cargar el perfil</Text>;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={`${user.nombre} ${user.apellido}`} subtitle={user.email} />
        <Card.Content>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>{user.role}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16 },
});
