import React from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const paragraphs = [
  {
    title: "About Expensify",
    content: "Welcome to Expensify, your go-to solution for effortless expense tracking and budget management.",
    icon: 'information-circle-sharp'
  },
  {
    title: "Key Features:",
    content: [
      {
        label: "Easy Expense Tracking",
        description: "Record your daily expenses quickly and hassle-free.",
        icon: 'wallet-sharp'
      },
      {
        label: "Smart Budgets",
        description: "Set up monthly budgets for various spending categories.",
        icon: 'pie-chart-sharp'
      },
      {
        label: "Clear Visuals",
        description: "Gain insights with a simple pie chart that illustrates your spending distribution.",
        icon: 'analytics-sharp'
      },
      {
        label: "Upload Profile Picture",
        description: "You can upload and update your profile picture from the settings screen.",
        icon: 'person-circle-sharp'
      },
      {
        label: "Category-Specific Locations on Google Maps",
        description: "View places related to specific categories (e.g., restaurants, pharmacies) on Google Maps.",
        icon: 'map-sharp'
      },
      {
        label: "Real-Time Expense Tracking",
        description: "Track your expenses in real-time, categorized for better insights.",
        icon: 'time-sharp'
      }
    ]
  },
  {
    title: "Why Expensify:",
    content: "Tracking your expenses shouldn't be complicated. Expensify keeps it simple, focusing on what truly matters - helping you stay on top of your finances.",
    icon: 'help-circle-sharp'
  },
  {
    title: "Goal:",
    content: "Expensify has the goal of simplifying expense management, allowing you to make informed financial decisions without the fuss.",
    icon: 'rocket-sharp'
  },
];

const AboutScreen = ({ navigation }) => {
  const renderContent = (content, parentIcon) => {
    // If content is an array (for features list)
    if (Array.isArray(content)) {
      return content.map((feature, index) => (
        <View key={index} style={styles.featureContainer}>
          <View style={styles.featureHeader}>
            <Ionicons 
              name={feature.icon || 'checkmark-circle-outline'} 
              size={24} 
              color="#4A90E2" 
              style={styles.featureIcon}
            />
            <Text style={styles.featureLabel}>{feature.label}</Text>
          </View>
          <Text style={styles.textContent}>{feature.description}</Text>
        </View>
      ));
    }
    
    // If content is a string
    return (
      <View style={styles.contentWithIcon}>
        <Ionicons 
          name={parentIcon || 'information-circle-outline'} 
          size={24} 
          color="#4A90E2" 
          style={styles.sectionIcon}
        />
        <Text style={styles.textContent}>{content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F4F8', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Header */}
          <View style={styles.topBar}>
            <Text style={styles.topBarText}>About</Text>
            {/* <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <Ionicons name="close" size={30} color="#333" />
            </TouchableOpacity> */}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {paragraphs.map((item, index) => (
              <View key={index} style={styles.paragraphContainer}>
                <Text style={styles.title}>{item.title}</Text>
                {renderContent(item.content, item.icon)}
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  gradientBackground: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  backButton: {
    padding: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  paragraphContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    paddingBottom: 5,
  },
  contentWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 10,
  },
  textContent: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
    flex: 1,
  },
  featureContainer: {
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2980B9',
  },
});

export default AboutScreen;