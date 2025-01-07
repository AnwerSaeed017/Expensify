import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddExpenseButton({ navigation }) {
  return (
    <TouchableOpacity 
      style={styles.addButton} 
      onPress={() => navigation.navigate('AddExpense')}
    >
      <Ionicons name="add" size={36} color="#FFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#5D5FEF', // Soft purple for consistency with the theme
    borderRadius: 50,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
