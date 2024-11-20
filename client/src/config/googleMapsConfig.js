import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"]; // Remove 'marker' and 'maps' as they're not valid libraries

export const useGoogleMapsScript = () => {
  return useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
    version: "weekly",
  });
};
