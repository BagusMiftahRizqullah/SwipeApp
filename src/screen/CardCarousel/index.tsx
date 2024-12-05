import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Image,ScrollView  } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler,PanGestureHandler } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = height * 0.5;
const SPACING = 20;

const CardCarousel = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const scale = new Animated.Value(1);
  const translateY = new Animated.Value(0); // Y translation for fullscreen effect
  const scrollX = new Animated.Value(0); // Scroll position
  const [dataMovie, setDataMovie] = useState([]);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const getData =async()=>{
    fetch('https://api.themoviedb.org/3/movie/popular',{
      method: 'GET',
      headers:  {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzQyNjVmZWMzYWZjNjk4YWI2NDQwNTY1NmVlOTgwOCIsIm5iZiI6MTczMzM4MzUxMC41NDIsInN1YiI6IjY3NTE1NTU2MzdmMTg1NjIwMjA4NjAxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IRwt-OF8KKuppWryoeJ7hgsr5FwVOlxuqfQRLiI0DNo`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json =>{ 
      console.log(json)
      setDataMovie(json.results)

    })
  }
  

  useEffect(() => {
    getData();
  }, []);
  
  const openCard = (item) => {
    startGlow(); // Start glowing animation
    setExpandedCard(item);
    // Animate to fullscreen
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,  // Scale up to full size
        // duration: 1500,  // Slow opening duration (1.5 seconds)
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -200,  // Move the image upwards
        duration: 1500,  // Same duration as scale for synchronization
        useNativeDriver: true,
      }),
    ]).start(() => setIsFullScreen(true));
   
  };

  const closeCard = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.5,  // Scale back to smaller size
        duration: 1500,  // Slow closing duration
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,  // Reset vertical translation
        duration: 1500,  // Same duration as scale for synchronization
        useNativeDriver: true,
      }),
    ]).start(() => setIsFullScreen(false));  // Hide the fullscreen after animation
  };

  const startGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1, // Glow intensity
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0, // Reset glow
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };


  const glowStyle = (cardId) => {
    const isSelected = cardId === expandedCard?.id;

    return {
      shadowColor: '#FFD700', // Golden glow
      shadowOpacity: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8], // Dynamic shadow opacity
      }),
      shadowRadius: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 20], // Dynamic shadow radius
      }),
      shadowOffset: { width: 0, height: 0 }, // Centered shadow
      elevation: isSelected ? 20 : 5, // Elevate the selected card
    };
  };

  const renderCard = ({ item, index }) => {
    // Animate scale based on scroll position
    const cardScale = scrollX.interpolate({
      inputRange: [
        (index - 1) * (CARD_WIDTH + SPACING),
        index * (CARD_WIDTH + SPACING),
        (index + 1) * (CARD_WIDTH + SPACING),
      ],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    return (
      <GestureHandlerRootView style={{
        justifyContent: 'center',
      }}>
        <View style={{
          alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={()=>openCard(item)}
          >
            <Animated.View style={[glowStyle(item.id), styles.card, { borderWidth: 3, borderColor: item.id === expandedCard?.id ? '#FFD700' : '#fff' , transform: [{ scale: cardScale }] }]}>
            <Image source={
              { uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}` 
                
              }} style={styles.image} />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.cardText}> 
            {item.title}
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  };

  console.log("isFullScreen", isFullScreen)
  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        style={{ flex: 1 }}
        data={dataMovie}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={renderCard}
      />
     {isFullScreen && (
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity onPress={closeCard} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Animated.Image
            source={
              { 
               uri: `https://image.tmdb.org/t/p/w500${expandedCard.backdrop_path}`
               }
            }
            style={[
              styles.fullscreenImage,
              { 
                transform: [{ scale: scale }],  
              }
            ]}
          />
          <Animated.View style={[
            styles.textFullScreen,
          ]} >
            <Text style={{
              fontSize: 23,
              fontWeight: 'bold',
              color: '#000000',
            }}>
              {expandedCard?.title}
            </Text>
            <ScrollView>
              <Text style={{
                marginTop: 10,
                fontSize: 15,
                fontWeight: 'bold',
                color: '#000000',
                textAlign: 'justify',
              }}>
                {expandedCard?.overview}
              </Text>
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: '#fff',
    alignSelf: 'center',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 5,
  },
  cardText: {
    color: '#000000',
    fontSize: 23,
    fontWeight: 'bold',
  },
  closeButton: {
    zIndex: 1000,
    position: 'absolute',
    top: 50,
    right: 30,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  textFullScreen: {
    position: 'absolute',
    borderRadius: 10,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    alignItems: 'center',
    backgroundColor:'#fff',
    height: '20%',
    flexDirection: 'column',
  }
});

export default CardCarousel;
