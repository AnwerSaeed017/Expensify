import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMonthlyExpensesRealTime } from '../services/expenseservice';
import { categories } from '../components/categories';

export default function TopSpending({ userId, selectedMonth }) {
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const unsubscribe = getMonthlyExpensesRealTime(userId, selectedMonth, (expenses) => {
      const categoryTotals = {};
      expenses.forEach((expense) => {
        const category = expense.category || 'Other';
        categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
      });

      const sortedExpenses = Object.keys(categoryTotals)
        .map((category) => ({
          name: category,
          amount: categoryTotals[category],
          color: getCategoryColor(category),
        }))
        .sort((a, b) => b.amount - a.amount);

      setTopCategories(sortedExpenses);
    });

    return () => unsubscribe();
  }, [userId, selectedMonth]);

  const getCategoryColor = (category) => {
    const colors = {
      Utilities: '#4CAF50',
      Grocery: '#03DAC6',
      Travel: '#FFC107',
      Bills: '#6200EE',
      Entertainment: '#FF5722',
      Food: '#FF9800',
      Medicine: '#FF4500',
      Clothes: '#1E90FF',
      Other: '#9E9E9E',
    };
    return colors[category] || colors['Other'];
  };

  const getCategoryDetails = (name) => {
    const category = categories.find((cat) => cat.name === name);
    return category ? { icon: category.icon, color: category.color } : { icon: 'help-outline', color: '#333' };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Spending</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryGrid}>
          {topCategories.map((category, index) => {
            const { icon, color } = getCategoryDetails(category.name);
            return (
              <View key={index} style={styles.categoryWrapper}>
                <TouchableOpacity style={[styles.categoryBox, { backgroundColor: color }]}>
                  <Ionicons name={icon} size={28} color="#fff" />
                </TouchableOpacity>
                {category.name && <Text style={styles.categoryText}>{category.name}</Text>}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    textAlign: 'left',
  },
  categoryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryWrapper: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
