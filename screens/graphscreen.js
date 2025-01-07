import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMonthlyExpensesRealTime } from '../services/expenseservice'; 
import { categories, getCategoryColor } from '../components/categories'; 
import { useTheme } from '../components/theme';

const { width } = Dimensions.get('window'); // Get screen width

export default function GraphScreen({ route }) {
  const { userId, selectedMonth } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { theme } = useTheme();
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(false);

  useEffect(() => {
      setIsDarkThemeEnabled(theme.backgroundColor === '#333');
  }, [theme]);

  useEffect(() => {
    if (!userId || !selectedMonth) {
      console.error("userId or selectedMonth is undefined");
      return;
    }

    // Fetch expenses in real-time for the selected month
    const unsubscribe = getMonthlyExpensesRealTime(userId, selectedMonth, (fetchedExpenses) => {
      setExpenses(fetchedExpenses);

      // Calculate total expenses
      const total = fetchedExpenses.reduce((acc, expense) => acc + expense.amount, 0);
      setTotalExpenses(total);
    });

    return () => unsubscribe(); 
  }, [userId, selectedMonth]);

  // Group expenses by category and calculate totals
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (acc[expense.category]) {
      acc[expense.category] += expense.amount;
    } else {
      acc[expense.category] = expense.amount;
    }
    return acc;
  }, {});

  // Prepare data for the pie chart and legend
  const chartData = Object.keys(groupedExpenses).map((category) => {
    const amount = groupedExpenses[category];
    return {
      name: category,
      amount: amount,
      color: getCategoryColor(category),
      percentage: ((amount / totalExpenses) * 100).toFixed(2), // Calculate percentage
    };
  });

  const getCategoryDetails = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? { icon: category.icon, color: category.color } : { icon: 'help-outline', color: '#333' };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Purple Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Graph Reports</Text>
      </View>

      {/* Total centered below the top bar */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>{totalExpenses} PKR</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pie Chart and Legend */}
        <View style={styles.chartSection}>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={chartData}
              width={width * 0.5} // Use 50% width for pie chart
              height={200}
              chartConfig={{
                backgroundColor: '#fff',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="40" 
              hasLegend={false}
            />
          </View>

          {/* Legend with Percentage Values */}
          <View style={styles.legendContainer}>
            {chartData.map((data, index) => (
              <View key={index} style={styles.legendItem}>
                <Ionicons name="ellipse" size={14} color={data.color} style={{ marginRight: 8 }} />
                <Text style={styles.legendText}>
                  {data.name} ({data.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* List of Categories and Expenses */}
        <View style={styles.expensesList}>
          {chartData.map((data, index) => {
            const { icon, color } = getCategoryDetails(data.name);
            return (
              <View key={index} style={styles.expenseItem}>
                <View style={[styles.iconWrapper, { backgroundColor: color }]}>
                  <Ionicons name={icon} size={28} color="#fff" />
                </View>
                <View style={styles.expenseDetails}>
                  <Text style={styles.categoryName}>{data.name}</Text>
                  <Text style={styles.amount}>{data.amount} PKR</Text>
                </View>
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
    flex: 1,
    backgroundColor: '#fff',
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
  totalContainer: {
    alignItems: 'center',
    marginTop: 20, // Adjust spacing from the top bar
    marginBottom: 20, // Spacing before the pie chart
  },
  totalText: {
    fontSize: 20,
    color: '#000',
  },
  totalAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    padding: 20,
  },
  chartSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pieChartContainer: {
    width: '55%',
    alignItems: 'center',
  },
  legendContainer: {
    width: '45%',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  expensesList: {
    marginTop: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  expenseDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
