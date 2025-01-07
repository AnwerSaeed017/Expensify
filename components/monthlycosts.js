import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getMonthlyExpensesRealTime } from '../services/expenseservice';

export default function MonthlyCosts({ userId, selectedMonth }) {
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    // Use real-time updates for monthly expenses
    const unsubscribe = getMonthlyExpensesRealTime(userId, selectedMonth, (expenses) => {
      const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      setTotalExpenses(total);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [userId, selectedMonth]);

  return (
    <View style={styles.costsContainer}>
      <Text style={styles.sectionTitle}>Monthly costs</Text>
      <View style={styles.costBox}>
        <Text style={styles.costValue}>{totalExpenses} PKR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  costsContainer: {
    marginTop: 15,
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'left',
  },
  costBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
    alignItems: 'center',
  },
  costValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
