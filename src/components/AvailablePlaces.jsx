import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchPlaces } from "../http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    async function getPlace() {
      try {
        const places = await fetchPlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
        });

        setAvailablePlaces(places);
        setIsFetching(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    }
    getPlace();
  }, []);

  if (error) {
    return <Error title="An Error Occured" message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      fallbackText="No places available."
      loadingText="Loading places..."
      onSelectPlace={onSelectPlace}
    />
  );
}
