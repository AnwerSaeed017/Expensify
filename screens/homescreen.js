import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import MonthlyCosts from '../components/monthlycosts';
import TopSpending from '../components/topspending';
import MonthlyBudget from '../components/monthlybudget';
import AddExpenseButton from '../components/addexpensebutton';
import moment from 'moment';
import { getCurrentUserId } from '../services/authservice';
import { useTheme } from '../components/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const selectedMonth = moment().format('MMMM');
  const currentMonthIndex = moment().month(); 
  const scrollViewRef = useRef(null);
  const { theme } = useTheme();
  useEffect(() => {
    const user = getCurrentUserId();
    if (user) {
      setUserId(user);
    } else {
      navigation.replace('Login');
    }
  }, [navigation]);

  useEffect(() => {
    if (scrollViewRef.current) {
      const offsetX = currentMonthIndex * 80;
      scrollViewRef.current.scrollTo({ x: offsetX, animated: true });
    }
  }, [scrollViewRef]);

  const renderMonthSelector = () => (
    <ScrollView
      horizontal
      contentContainerStyle={styles.monthSelector}
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
    >
      {moment.months().map((month, index) => (
        <View
          key={index}
          style={[styles.month, index === currentMonthIndex ? styles.activeMonth : styles.inactiveMonth]}
        >
          <Text style={[styles.monthText, index === currentMonthIndex ? styles.activeMonthText : styles.inactiveMonthText]}>
            {month}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {userId && (
        <>
          <View style={styles.monthContainer}>
            {renderMonthSelector()}
          </View>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <MonthlyCosts userId={userId} selectedMonth={selectedMonth} />
            <TopSpending userId={userId} selectedMonth={selectedMonth} />
            <MonthlyBudget userId={userId} selectedMonth={selectedMonth} />
          </ScrollView>
          <AddExpenseButton navigation={navigation} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  monthContainer: {
    backgroundColor: '#5D5FEF',
    paddingTop: 40, // Background color starts from top but month bar is lowered
    paddingBottom: 10, // Space below the month bar
  },
  contentContainer: {
    marginTop: 20, // Remove extra gap between month bar and other content
  },
  monthSelector: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  month: {
    marginHorizontal: 12,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeMonth: {
    backgroundColor: '#FFF',
  },
  inactiveMonth: {
    backgroundColor: 'transparent',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeMonthText: {
    color: '#6200EE',
  },
  inactiveMonthText: {
    color: '#FFF',
  },
});
