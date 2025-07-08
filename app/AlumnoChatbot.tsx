import { ChatMessage, enviarMensajeAlChatBot } from '@/apis/apiQuizz';
import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    TextInput as RNTextInput,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function AlumnoChatbot() {
  const [input, setInput] = useState('');
  const [mensajes, setMensajes] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente del curso de Comunicación. ¿En qué te puedo ayudar?',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const enviar = async () => {
    if (!input.trim()) return;

    const nuevoMensaje: ChatMessage = { role: 'user', content: input };
    const actualizados = [...mensajes, nuevoMensaje];
    setMensajes(actualizados);
    setInput('');
    setLoading(true);

    try {
      const respuesta = await enviarMensajeAlChatBot(actualizados);
      setMensajes([...actualizados, respuesta]);
    } catch (err) {
      setMensajes([
        ...actualizados,
        { role: 'assistant', content: '❌ Ocurrió un error. Intenta más tarde.' },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80:80}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {mensajes.map((msg, index) => (
            <Card key={index} style={msg.role === 'user' ? styles.userCard : styles.botCard}>
              <Card.Content>
                <Text style={[styles.messageText, msg.role === 'user' && styles.userText]}>
  {msg.content}
</Text>
              </Card.Content>
            </Card>
          ))}

          {loading && (
  <Card style={styles.botCard}>
    <Card.Content>
      <Text style={styles.messageText}>...</Text>
    </Card.Content>
  </Card>
)}
</ScrollView>

        <View style={styles.inputContainer}>
          <RNTextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#ccc"
            value={input}
            onChangeText={setInput}
          />
          <Button
            mode="contained"
            onPress={enviar}
            disabled={loading}
            style={styles.sendButton}
          >
            Enviar
          </Button>
        </View>

        
      </KeyboardAvoidingView>



    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#0f172a',
  },
  chatContainer: {
    flex: 1,
    marginTop: 8,
  },
  userCard: {
    marginBottom: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#1e40af',
    maxWidth: '85%',
    borderRadius: 12,
  },
  botCard: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#e5e7eb',
    maxWidth: '85%',
    borderRadius: 12,
  },
  messageText: {
    fontSize: 15,
    color: '#000000',
  },
  userText: {
    color: '#ffffff', // texto blanco solo para usuario
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: Platform.OS === 'android' ? 7 : 10,
    paddingTop: 8,
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#f3f4f6',
    color: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  sendButton: {
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: '#1e40af',
  },
});
