import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import { categories } from '../components/categories';
import { addOrUpdateBudget, getMonthlyBudget } from '../services/expenseservice';

export default function EditBudget({ route, navigation }) {
  const { userId, selectedMonth } = route.params;
  const [budgets, setBudgets] = useState({});
  const [isBudgetEditable, setIsBudgetEditable] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const budgetData = await getMonthlyBudget(userId, selectedMonth);

        // If budgets exist for the month, prevent editing
        if (budgetData.length > 0) {
          setIsBudgetEditable(false);
          // Map existing budgets to a readable format
          const budgetMap = {};
          budgetData.forEach((budget) => {
            budgetMap[budget.category] = budget.totalBudget.toString();
          });
          setBudgets(budgetMap);
        } else {
          // Initialize empty budgets for all categories if no budgets exist
          const budgetMap = {};
          categories.forEach((category) => {
            budgetMap[category.name] = '';
          });
          setBudgets(budgetMap);
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    fetchBudgets();
  }, [userId, selectedMonth]);

  // Handle budget updates
  const handleBudgetChange = (category, value) => {
    setBudgets({ ...budgets, [category]: value });
  };

  const handleSubmit = async () => {
    try {
      // Ensure all categories have a budget
      const missingCategories = categories.filter((category) => !budgets[category.name]);
      if (missingCategories.length > 0) {
        Alert.alert(
          "Missing Budgets",
          "Please enter budgets for all categories before saving."
        );
        return;
      }

      // Save budgets for all categories
      for (const category of categories) {
        await addOrUpdateBudget(
          userId,
          selectedMonth,
          category.name,
          parseFloat(budgets[category.name])
        );
      }
      Alert.alert("Success", "Budgets have been saved successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "There was an error saving the budgets.");
      console.error('Error updating budgets:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isBudgetEditable
          ? `Set Monthly Budget for ${selectedMonth}`
          : `Budgets for ${selectedMonth} are Locked. You can set budgets once in a month.`}
      </Text>
      {categories.map((category) => (
        <View key={category.name} style={styles.inputContainer}>
          <Text style={styles.label}>{category.name}</Text>
          {isBudgetEditable ? (
            <TextInput
              value={budgets[category.name] || ''}
              onChangeText={(value) => handleBudgetChange(category.name, value)}
              placeholder="Enter budget amount"
              keyboardType="numeric"
              style={styles.textInput}
            />
          ) : (
            <Text style={styles.readOnlyText}>{budgets[category.name] || '0.00'} PKR</Text>
          )}
        </View>
      ))}
      {isBudgetEditable && (
        <Button title="Save Budget" onPress={handleSubmit} color="#5D5FEF" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#FFF',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#555',
    padding: 10,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
  },
});
