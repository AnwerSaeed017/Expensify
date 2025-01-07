import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMonthlyExpensesRealTime } from '../services/expenseservice';
import { getCategoryColor } from '../components/categories';
import moment from 'moment'; // For date formatting

export default function CategoryExpenseScreen({ route }) {
  const { categoryName, userId, selectedMonth } = route.params;
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!userId || !selectedMonth) {
      console.error('Missing userId or selectedMonth');
      return;
    }

    const unsubscribe = getMonthlyExpensesRealTime(userId, selectedMonth, (fetchedExpenses) => {
      const categoryExpenses = fetchedExpenses.filter(
        (expense) => expense.category === categoryName
      );
      setExpenses(categoryExpenses);
    });

    return () => unsubscribe();
  }, [categoryName, userId, selectedMonth]);

  const categoryColor = getCategoryColor(categoryName);

  return (
    <View style={styles.container}>
      {/* Top Bar with Dynamic Color */}
      <View style={[styles.topBar, { backgroundColor: categoryColor }]}>
        <Text style={styles.topBarText}>{categoryName} Expenses</Text>
      </View>

      {expenses.length === 0 ? (
        <Text style={styles.noExpensesText}>No expenses found for this category.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.expenseItem}>
              {/* Serial Number */}
              <View style={styles.serialNumberContainer}>
                <Text style={styles.serialNumber}>#{index + 1}</Text>
              </View>

              {/* Expense Details */}
              <View style={styles.expenseDetails}>
                <Ionicons name="cart-outline" size={20} color={categoryColor} style={styles.icon} />
                <View>
                  <Text style={styles.expenseName}>{item.name}</Text>
                  <Text style={styles.expenseDate}>
                    {moment(item.createdAt.toDate()).format('D MMMM')} {/* Format Firestore date */}
                  </Text>
                </View>
              </View>

              {/* Expense Amount */}
              <Text style={styles.expenseAmount}>{item.amount} PKR</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topBar: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  topBarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noExpensesText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  serialNumberContainer: {
    width: 30,
    alignItems: 'center',
  },
  serialNumber: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  expenseDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  expenseName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
