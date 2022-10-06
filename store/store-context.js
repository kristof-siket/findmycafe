import { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const ActionTypes = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LAT_LONG: {
      return {
        ...state,
        lat: action.payload.lat,
        long: action.payload.long,
      };
    }
    case ActionTypes.SET_COFFEE_STORES: {
      return {
        ...state,
        coffeeStores: action.payload.coffeeStores,
      };
    }

    default:
      throw new Error("Unhandled action typ: ".action.type);
  }
};

const StoreContextProvider = ({ children }) => {
  const initialState = {
    lat: "",
    long: "",
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
