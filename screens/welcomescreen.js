import React, { useState, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Updated color palette for softer tones
const slides = [
  {
    id: 0,
    title: 'Welcome to Expensify',
    description: 'Discover a seamless way to manage your expenses and achieve financial freedom. Begin your journey with Expensify today!',
    backgroundColor: '#FFEBB7', // Light Pastel Yellow for Welcome Slide
  },
  {
    id: 1,
    title: 'Track Your Savings',
    description: 'Start your financial journey by tracking your savings. Set goals, monitor your progress, and watch your savings grow over time.',
    backgroundColor: '#B3E5FC', // Soft Blue for Savings Slide
    image: require('../assets/tracksavings.jpg'),
  },
  {
    id: 2,
    title: 'Visualize Your Expenses',
    description: 'Gain insights into your spending habits with our interactive pie charts. See where your money is going and make informed decisions to manage your expenses effectively.',
    backgroundColor: '#C8E6C9', // Soft Green for Expenses Slide
    image: require('../assets/visualizeexpenses.jpg'),
  },
  {
    id: 3,
    title: 'Stay on Top of Financial Goals',
    description: 'Keep track of your financial goals with our intuitive progress bars. Set milestones, track your achievements, and stay motivated on your path to financial success.',
    backgroundColor: '#FFCDD2', // Soft Pink for Goals Slide
    image: require('../assets/financialgoals.jpg'),
  },
];

export default function WelcomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex });
    } else {
      navigation.navigate('Login');
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex });
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      {item.image && <Image source={item.image} style={styles.image} />}
      <Text style={[styles.title, { color: activeIndex === 0 ? '#333' : '#37474F' }]}>{item.title}</Text>
      <Text style={[styles.description, { color: '#666666' }]}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: slides[activeIndex].backgroundColor }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      />

      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor:
                activeIndex === 0 ? 'rgba(255,255,255,0.2)' : `${slides[activeIndex].backgroundColor}`,
            },
          ]}
          onPress={handlePrevious}
          disabled={activeIndex === 0}
        >
          <Text style={[styles.buttonText, { color: activeIndex === 0 ? '#FFF' : '#37474F' }]}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: `${slides[activeIndex].backgroundColor}` },
          ]}
          onPress={handleNext}
        >
          <Text style={[styles.buttonText, { color: '#37474F' }]}>
            {activeIndex === slides.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
  },
  navButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#37474F',
  },
  inactiveDot: {
    backgroundColor: 'rgba(55, 71, 79, 0.5)',
  },
});
