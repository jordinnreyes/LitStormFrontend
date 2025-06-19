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
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Avatar.Icon
          size={40}
          icon="account"
          style={{ backgroundColor: "#facc15" }}
          color="#1f2937"
        />
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
              labelStyle={styles.labelText}
            >
              Ver perfil
            </Button>

            <Button
              mode="outlined"
              onPress={handleLogout}
              style={[styles.actionButton, styles.logoutButton]}
              labelStyle={[styles.labelText, { color: '#ef4444' }]}
            >
              Cerrar sesión
            </Button>

            <Button
              mode="contained"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              labelStyle={{ color: '#fff', fontWeight: 'bold' }}
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
    backgroundColor: '#1f2937',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 12,
    alignSelf: 'stretch',
    borderColor: '#94a3b8',
    borderWidth: 1,
  },
  logoutButton: {
    borderColor: '#ef4444',
  },
  closeButton: {
    alignSelf: 'stretch',
    backgroundColor: '#3b82f6',
    borderRadius: 30,
    paddingVertical: 6,
  },
  labelText: {
    color: '#e5e7eb',
    fontWeight: 'bold',
  },
});