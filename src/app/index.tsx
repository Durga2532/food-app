import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fetchRestaurants } from "../services/yelp";

type Restaurant = {
  id: string;
  name: string;
  image_url: string;
  rating: number;
};

export default function Index() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [query, setQuery] = useState("restaurants");

  const locationRef = useRef<{ lat: number; long: number } | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await loadRestaurants(0);
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return { latitude: 43.6532, longitude: -79.3832 }; // fallback
    }

    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    locationRef.current = { lat: latitude, long: longitude };

    return { latitude, longitude };
  };

  const loadRestaurants = async (newOffset: number) => {
    try {
      setLoading(true);

      let latitude = 43.6532;
      let longitude = -79.3832;

      if (locationRef.current && newOffset > 0) {
        latitude = locationRef.current.lat;
        longitude = locationRef.current.long;
      } else {
        const loc = await getLocation();
        latitude = loc.latitude;
        longitude = loc.longitude;
      }

      const res = await fetchRestaurants(latitude, longitude, query, newOffset);
      const items: Restaurant[] = res?.businesses ?? [];

      setRestaurants((prev) => (newOffset === 0 ? items : [...prev, ...items]));

      setOffset(newOffset);
      setIndex(0);
    } catch (e) {
      console.log("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = async () => {
    if (index < restaurants.length - 1) {
      setIndex((i) => i + 1);
    } else {
      await loadRestaurants(offset + 20);
    }
  };

  const prevCard = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const current = restaurants[index] ?? null;

  if (loading && restaurants.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search food, cafes, sushi..."
          placeholderTextColor="#888"
          style={styles.input}
        />

        <Pressable style={styles.searchBtn} onPress={() => loadRestaurants(0)}>
          <Text style={styles.searchBtnText}>Search</Text>
        </Pressable>
      </View>
      {current ? (
        <View style={styles.card}>
          {/* Favorite */}
          <Pressable
            onPress={() => toggleFavorite(current.id)}
            style={styles.favoriteBtn}
          >
            <Text style={{ fontSize: 18 }}>
              {favorites.includes(current.id) ? "💖" : "🤍"}
            </Text>
          </Pressable>

          {/* Image */}
          <Image source={{ uri: current.image_url }} style={styles.image} />

          {/* Name */}
          <Text style={styles.name} numberOfLines={1}>
            {current.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {current.rating}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable onPress={prevCard} style={styles.btnSecondary}>
              <Text style={styles.btnTextSecondary}>◀ Prev</Text>
            </Pressable>

            <Pressable onPress={nextCard} style={styles.btnPrimary}>
              <Text style={styles.btnTextPrimary}>Next ▶</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={{ color: "#666" }}>No restaurants found nearby 🍽️</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "92%",
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 16,
    position: "relative",
    overflow: "visible",

    shadowColor: "#438ce5",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
    color: "#222",
  },

  ratingBadge: {
    marginTop: 8,
    backgroundColor: "#9fe0ba",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  buttons: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
    width: "100%",
  },

  btnPrimary: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  btnSecondary: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  btnTextPrimary: {
    color: "#fff",
    fontWeight: "600",
  },

  btnTextSecondary: {
    color: "#333",
    fontWeight: "600",
  },

  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,

    shadowColor: "#438ce5",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  searchContainer: {
    width: "92%",
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  searchBtn: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  searchBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
