import { FIRESTORE_DB } from '../firebaseConfig';
import { collection, addDoc, getDoc, doc, deleteDoc, query, where, setDoc, Timestamp, onSnapshot, increment, getDocs } from 'firebase/firestore';
import moment from 'moment';
    


export const addExpense = async (expense) => {
  try {
    // Step 1: Add the expense to the 'expenses' collection
    await addDoc(collection(FIRESTORE_DB, 'expenses'), { ...expense, createdAt: Timestamp.fromDate(expense.createdAt), receipt:expense.receipt||null });
    console.log('Expense added successfully!');

    // Step 2: Update the spentAmount in the corresponding budget document
    const budgetRef = doc(FIRESTORE_DB, 'budgets', `${expense.userId}_${moment(expense.createdAt).format('MMMM')}_${expense.category}`);
    
    // Fetch the existing budget document
    const budgetSnapshot = await getDoc(budgetRef);
    
    // Check if the budget document exists, and calculate the updated spent amount
    const existingSpentAmount = budgetSnapshot.exists() ? budgetSnapshot.data().spentAmount : 0;

    // Update the budget document with the new spent amount
    await setDoc(budgetRef, { spentAmount: existingSpentAmount + expense.amount }, { merge: true });
    console.log(`Budget for category "${expense.category}" updated successfully!`);
  } catch (error) {
    console.error('Error adding expense or updating budget:', error);
    throw error;
  }
};



export const getMonthlyExpensesRealTime = (userId, selectedMonth, setExpenses) => {
  const startOfMonth = moment(selectedMonth, 'MMMM').startOf('month').toDate();
  const endOfMonth = moment(selectedMonth, 'MMMM').endOf('month').toDate();

  // Firestore query with date range and user ID filters
  const q = query(
    collection(FIRESTORE_DB, 'expenses'),
    where('userId', '==', userId),
    where('createdAt', '>=', Timestamp.fromDate(startOfMonth)),
    where('createdAt', '<=', Timestamp.fromDate(endOfMonth))
  );

  // Listen for real-time updates
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const expenseList = [];
    querySnapshot.forEach((doc) => {
      expenseList.push({ id: doc.id, ...doc.data() });
    });
    setExpenses(expenseList);
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
};


export const getMonthlyBudgetRealTime = (userId, selectedMonth, setBudgets) => {
  const q = query(
    collection(FIRESTORE_DB, 'budgets'),
    where('userId', '==', userId),
    where('month', '==', selectedMonth)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const budgetList = [];
    querySnapshot.forEach((doc) => {
      budgetList.push({ id: doc.id, ...doc.data() });
    });
    setBudgets(budgetList);
  });

  return unsubscribe; // Return the unsubscribe function for cleanup
};

export const getMonthlyBudget = async (userId, selectedMonth) => {
  const budgetList = [];
  try {
    const q = query(
      collection(FIRESTORE_DB, 'budgets'),
      where('userId', '==', userId),
      where('month', '==', selectedMonth)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      budgetList.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error('Error fetching budget:', error);
    throw error;
  }
  return budgetList;
};

export const addOrUpdateBudget = async (userId, selectedMonth, category, totalBudget) => {
  try {
    const budgetRef = doc(FIRESTORE_DB, 'budgets', `${userId}_${selectedMonth}_${category}`);
    await setDoc(budgetRef, { userId, month: selectedMonth, category, totalBudget, spentAmount: 0 }, { merge: true });
    console.log('Budget set successfully!');
  } catch (error) {
    console.error('Error setting budget:', error);
    throw error;
  }
};


export const getExpensesByCategory = async (userId, selectedMonth) => {
  const categoryTotals = {};
  try {
    const expenses = await getMonthlyExpenses(userId, selectedMonth); // Uses updated getMonthlyExpenses
    expenses.forEach((expense) => {
      const category = expense.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });
    return Object.keys(categoryTotals).map((category) => ({
      name: category,
      amount: categoryTotals[category],
      color: getCategoryColor(category),
    }));
  } catch (error) {
    console.error('Error fetching category expenses:', error);
    throw error;
  }
};



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


 