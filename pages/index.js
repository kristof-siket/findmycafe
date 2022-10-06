import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import Banner from "../components/banner";
import Card from "../components/card";
import useTrackLocation, {
  LocatingStateType,
} from "../hooks/use-track-location";
import fetchCoffeeShops from "../lib/coffee-stores/coffee-stores";
import styles from "../styles/home.module.css";
import { ActionTypes, StoreContext } from "../store/store-context";

export async function getStaticProps(context) {
  // Here it is not recommended to replace it with a call to API (serverless function)
  // This function is called on build time + calling the same "server" from itself is quite meaningless
  const coffeeStores = await fetchCoffeeShops({
    photoSize: {
      width: 260,
      height: 160,
    },
  });

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { coffeeStores } = props;

  const { statusText, locationError, handleTrackLocation } = useTrackLocation();

  const loading = useMemo(
    () => statusText === LocatingStateType.LOCATING,
    [statusText]
  );

  const [coffeeStoreError, setCoffeStoresError] = useState(null);

  const {
    state: { coffeeStores: userCoffeeStores, lat, long },
    dispatch,
  } = useContext(StoreContext);

  useEffect(() => {
    if (lat && long) {
      fetch(
        `/api/getCoffeeStoresByLocation?lat=${lat}&long=${long}&limit=${30}`
      )
        .then((res) => {
          res.json().then((coffeeStores) => {
            dispatch({
              type: ActionTypes.SET_COFFEE_STORES,
              payload: {
                coffeeStores,
              },
            });

            setCoffeStoresError("");
          });
        })
        .catch((err) => {
          setCoffeStoresError(err.message);
        });
    }
  }, [lat, long, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={loading ? "Locating..." : "View stores nearby"}
          isLoading={loading}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationError && `Something went wrong: ${locationError}`}
        {coffeeStoreError && `Something went wrong: ${coffeeStoreError}`}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero.png"
            width={700}
            height={400}
            alt="Woman drinking coffee"
          />
        </div>

        {userCoffeeStores?.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Your location stores</h2>
            <div className={styles.cardLayout}>
              {userCoffeeStores.map((store) => {
                return (
                  <Card
                    key={`${store.name}_${store.id}`}
                    name={store.name}
                    imgUrl={
                      store.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    href={`/coffee-store/${store.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {coffeeStores?.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Budapest stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store) => {
                return (
                  <Card
                    key={`${store.name}_${store.id}`}
                    name={store.name}
                    imgUrl={
                      store.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    href={`/coffee-store/${store.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
