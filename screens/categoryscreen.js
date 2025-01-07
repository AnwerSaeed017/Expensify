import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { categories } from '../components/categories';
import { useTheme } from '../components/theme';

export default function CategoryScreen({ navigation, userId, selectedMonth }) {
  const { theme } = useTheme();
    

  const handleCategoryClick = (categoryName) => {
    
    if (!userId) {
      console.error('User ID is missing.');
      return;
    }
    
    // Show an alert for navigation options
    Alert.alert(
      `Choose Action for ${categoryName}`,
      `What would you like to do for ${categoryName}?`,
      [
        {
          text: 'View Expenses',
          onPress: () => navigation.navigate('CategoryExpense', {
            categoryName,
            userId,
            selectedMonth,
          }),
        },
        {
          text: 'View Nearby Places',
          onPress: () => navigation.navigate('GoogleMapsScreen', {
            categoryName,
            userId,
            selectedMonth,
          }),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Categories</Text>
      </View>
      <View style={styles.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryTile}
            onPress={() => handleCategoryClick(item.name)} // Handle category selection
          >
            <View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={28} color="#fff" />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  categoryTile: {
    width: '48%',
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#EEE',
    borderWidth: 1,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconWrapper: {
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
