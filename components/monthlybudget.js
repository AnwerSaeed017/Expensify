import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getMonthlyBudgetRealTime, addOrUpdateBudget } from '../services/expenseservice';
import { useNavigation } from '@react-navigation/native';
import { categories } from '../components/categories';
import moment from 'moment';

export default function MonthlyBudget({ userId, selectedMonth }) {
  const navigation = useNavigation();
  const [budgetData, setBudgetData] = useState([]);

  useEffect(() => {
    const currentMonth = moment().format('MMMM');
    if (currentMonth !== selectedMonth) {
      // Reset budgets if the month has changed
      resetBudgetsForNewMonth(userId, currentMonth);
    }

    const unsubscribe = getMonthlyBudgetRealTime(userId, selectedMonth, setBudgetData);
    return () => unsubscribe();
  }, [userId, selectedMonth]);

  const resetBudgetsForNewMonth = async (userId, newMonth) => {
    try {
      for (const category of categories) {
        await addOrUpdateBudget(userId, newMonth, category.name, 0);
      }
      console.log('Budgets reset for the new month');
    } catch (error) {
      console.error('Error resetting budgets:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Monthly Budget</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditBudget', { userId, selectedMonth })}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.budgetContainer}>
        {budgetData.map((budget, index) => (
          <View key={index} style={styles.budgetCard}>
            <Text style={styles.budgetText}>{budget.category}</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(budget.spentAmount / budget.totalBudget) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.budgetAmount}>
              {budget.spentAmount} PKR / {budget.totalBudget} PKR
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    textAlign: 'left',
  },
  editText: {
    fontSize: 16,
    color: '#5D5FEF',
    fontWeight: 'bold',
  },
  budgetContainer: {
    flexDirection: 'column',
  },
  budgetCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5D5FEF',
    borderRadius: 5,
  },
});
