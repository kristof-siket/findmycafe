import { useContext, useState } from "react";
import { ActionTypes, StoreContext } from "../store/store-context";

export const LocatingStateType = {
  LOCATING: "LOCATING",
  LOCATED: "LOCATED",
  LOCATION_FAILED: "LOCATION_FAILED",
  UNLOCATED: "UNLOCATED",
};

const useTrackLocation = () => {
  const [statusText, setStatusText] = useState(LocatingStateType.UNLOCATED);
  const [locationError, setLocationError] = useState("");

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const { latitude, longitude } = position.coords;

    dispatch({
      type: ActionTypes.SET_LAT_LONG,
      payload: {
        lat: latitude,
        long: longitude,
      },
    });

    setLocationError("");
    setStatusText(LocatingStateType.LOCATED);
  };

  const error = () => {
    setLocationError("Unable to retreive your location");
    setStatusText(LocatingStateType.LOCATION_FAILED);
  };

  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
    } else {
      setStatusText(LocatingStateType.LOCATING);
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    handleTrackLocation,
    // lat,
    // long,
    statusText,
    locationError,
  };
};

export default useTrackLocation;
