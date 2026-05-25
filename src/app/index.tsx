import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Restaurant = {
  id: string;
  name: string;
  image_url: string;
  rating: number;
};

export default function Index() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // TODO: replace with real location + Yelp API
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      // MOCK DATA FIRST (replace later with Yelp API)
      const mock: Restaurant[] = [
        {
          id: "1",
          name: "Pizza Place",
          image_url: "https://source.unsplash.com/600x400/?pizza",
          rating: 4.5,
        },
        {
          id: "2",
          name: "Burger House",
          image_url: "https://source.unsplash.com/600x400/?burger",
          rating: 4.2,
        },
        {
          id: "3",
          name: "Sushi Spot",
          image_url: "https://source.unsplash.com/600x400/?sushi",
          rating: 4.8,
        },
      ];

      setRestaurants(mock);
      setIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (index < restaurants.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevCard = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const current = restaurants[index];

  return (
    <View style={styles.container}>
      {current ? (
        <View style={styles.card}>
          <Image source={{ uri: current.image_url }} style={styles.image} />

          <Text style={styles.name}>{current.name}</Text>
          <Text style={styles.rating}>⭐ {current.rating}</Text>

          <View style={styles.buttons}>
            <Pressable onPress={prevCard} style={styles.button}>
              <Text>Prev</Text>
            </Pressable>

            <Pressable onPress={nextCard} style={styles.button}>
              <Text>Next</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text>No restaurants found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  rating: {
    marginTop: 4,
    fontSize: 16,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 16,
    gap: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
});
