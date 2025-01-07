import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addExpense } from '../services/expenseservice';
import { categories } from '../components/categories';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';


export default function AddForm({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [receiptUri, setReceiptUri] = useState(null);
  
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Function to handle image selection (either from camera or gallery)
  const selectImage = () => {
    Alert.alert(
      "Select an option",
      "Choose a method to upload a receipt",
      [
        { text: "Camera", onPress: () => launchCamera() },
        { text: "Gallery", onPress: () => launchImageLibrary() },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  // Function to launch the camera
  const launchCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        setReceiptUri(result.uri);
      }
    } else {
      Alert.alert("Permission Denied", "Camera access is required to take a photo.");
    }
  };

  // Function to launch the image library (gallery)
  const launchImageLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      // Check if the result is not canceled and contains a URI
      if (!result.canceled && result.uri) {
        console.log("Received Library URI:", result.uri);
        setReceiptUri(result.uri);  // Set the URI in state
      } else {
        console.log("Image selection was canceled or there is no URI.");
        Alert.alert("Error", "No image selected.");
      }
    } else {
      Alert.alert("Permission Denied", "Gallery access is required to select an image.");
    }
  };

  const handleAddExpense = async () => {
    if (!userId) {
      Alert.alert("Authentication Error", "User is not logged in.");
      return;
    }
    if (!name || !amount || !selectedCategory) {
      Alert.alert("Validation Error", "Please enter a name, amount, and select a category.");
      return;
    }

    // Log the receipt URI before saving
    console.log("Receipt URI before saving:", receiptUri);

    try {
      const budgetRef = doc(
        FIRESTORE_DB,
        'budgets',
        `${userId}_${moment().format('MMMM')}_${selectedCategory}`
      );
      const budgetSnapshot = await getDoc(budgetRef);

      if (!budgetSnapshot.exists()) {
        Alert.alert(
          "Budget Missing",
          `Please set a budget for the "${selectedCategory}" category before adding expenses.`,
          [
            { text: "Set Budget", onPress: () => navigation.navigate("EditBudget", { userId, selectedMonth: moment().format('MMMM') }) },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }
    } catch (error) {
      console.error("Error checking budget:", error);
      Alert.alert("Error", "Please set monthly budget for the categories before adding expenses.");
      navigation.goBack();
      return;
    }

    const expense = {
      name,
      amount: parseFloat(amount),
      category: selectedCategory,
      userId,
      createdAt: new Date(),
      receipt: receiptUri || null,  // Ensure receipt is either a valid URI or null
    };

    try {
      // Log the receipt URI when saving the expense
      if (receiptUri) {
        console.log("Saving expense with receipt URI:", expense.receipt);
      } else {
        console.log("Saving expense without receipt URI.");
      }

      await addExpense(expense);
      Alert.alert("Success", "Expense added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding expense:", error);
      Alert.alert("Error", "There was an error adding the expense. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Add new expense</Text>
      </View>

      <TextInput
        placeholder="Expense Name"
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Enter Amount (PKR)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.textInput}
      />

      <Text style={styles.label}>Category</Text>
      <ScrollView contentContainerStyle={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryButton, { backgroundColor: selectedCategory === category.name ? category.color : '#F7F7F7' }]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: category.color }]}>
              <Ionicons
                name={category.icon}
                size={28}
                color={selectedCategory === category.name ? '#FFF' : '#FFF'}
              />
            </View>
            <Text style={[styles.categoryText, { color: selectedCategory === category.name ? '#FFF' : '#333' }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      
      {/* {/* <TouchableOpacity onPress={selectImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>Add Receipt (Camera or Gallery)</Text>
      </TouchableOpacity>

      
      {receiptUri && <Image source={{ uri: receiptUri }} style={styles.receiptImage} />} */}

      <TouchableOpacity style={styles.saveButton} onPress={handleAddExpense}>
        <Text style={styles.saveButtonText}>Add Expense</Text>
      </TouchableOpacity> 
    </View>
  );
}

// Styles for the updated Add Expense Form
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topBar: {
    backgroundColor: '#5D5FEF',
    width: '100%',
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  topBarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  textInput: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 10,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  categoryButton: {
    width: '95%',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: '#EEE',
    borderWidth: 1,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginRight: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  saveButton: {
    backgroundColor: '#5D5FEF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  imagePickerButton: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  imagePickerText: {
    color: '#FFF',
    fontSize: 16,
  },
  receiptImage: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
});
