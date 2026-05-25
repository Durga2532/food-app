const API_KEY = "itoMaM6DJBtqD54BHSZQY9WdWR5xI_CnpZdxa3SG5i7N0M37VK1HklDDF4ifYh8SI-P2kI_mRj5KRSF4_FhTUAkEw322L8L8RY6bF1UB8jFx3TOR0-wW6Tk0KftNXXYx";

type YelpResponse = {
  businesses?: any[];
  error?: {
    description?: string;
  };
};

export async function fetchRestaurants(
  lat: number,
  long: number,
  term = "restaurants",
  offset = 0,
  limit = 20,
) {
  try {
    const url =
      `https://api.yelp.com/v3/businesses/search` +
      `?term=${encodeURIComponent(term)}` +
      `&latitude=${lat}` +
      `&longitude=${long}` +
      `&limit=${limit}` +
      `&offset=${offset}`;

    console.log("Fetching Yelp:", url);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    });

    const data: YelpResponse = await res.json();

    if (!res.ok) {
      console.log("Yelp API Error:", data);

      throw new Error(
        data?.error?.description || "Failed to fetch Yelp data",
      );
    }

    return {
      businesses: data.businesses ?? [],
    };
  } catch (error) {
    console.log("fetchRestaurants error:", error);

    return {
      businesses: [],
    };
  }
}