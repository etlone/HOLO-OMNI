import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-elements';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function VirtualGuideScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your personal health guide. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const mockAIResponse = async (userMessage: string) => {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    let response = "I understand you're asking about ";
    if (userMessage.toLowerCase().includes('exercise')) {
      response += "exercise. Based on your recent activity data, I recommend incorporating more cardio exercises. Would you like a personalized workout plan?";
    } else if (userMessage.toLowerCase().includes('diet')) {
      response += "diet. Looking at your nutrition logs, you might benefit from increasing your protein intake. Shall we discuss some healthy meal options?";
    } else if (userMessage.toLowerCase().includes('sleep')) {
      response += "sleep. Your sleep patterns show some irregularity. Let's work on establishing a better sleep routine.";
    } else {
      response = "I'm here to help with any health-related questions. Feel free to ask about exercise, diet, sleep, or general wellness!";
    }
    return response;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    const aiResponse = await mockAIResponse(inputText);
    const aiMessage: Message = {
      id: messages.length + 2,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            {message.sender === 'ai' && (
              <Avatar
                rounded
                icon={{ name: 'robot', type: 'material-community' }}
                containerStyle={styles.avatar}
              />
            )}
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask your health guide..."
          multiline
        />
        <Button
          icon={{ name: 'send', color: 'white' }}
          onPress={sendMessage}
          containerStyle={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    backgroundColor: '#6200ee',
    marginRight: 8,
  },
  messageContent: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
  },
});
