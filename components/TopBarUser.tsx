// components/TopBarUser.tsx
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

export default function TopBarUser() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();

  const handleVerPerfil = () => {
    setModalVisible(false);
    router.push('/PerfilUsuario');
  };

    const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
    setModalVisible(false);
    router.replace('/'); // Redirige al inicio o login
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Avatar.Icon size={40} icon="account" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Button
              mode="outlined"
              onPress={handleVerPerfil}
              style={styles.actionButton}
            >
              Ver perfil
            </Button>

<Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
              Cerrar sesión
            </Button>
            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  logoutButton: { marginBottom: 12, alignSelf: 'stretch', borderColor: 'red', borderWidth: 1 },
  closeButton: {
    alignSelf: 'stretch',
  },
});
