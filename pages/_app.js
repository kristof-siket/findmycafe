import "../styles/globals.css";
import StoreContextProvider from "../store/store-context";

function MyApp({ Component, pageProps }) {
  return (
    <StoreContextProvider>
      <Component {...pageProps} />
    </StoreContextProvider>
  );
}

export default MyApp;
