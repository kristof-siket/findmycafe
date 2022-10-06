import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import classNames from "classnames";
import fetchCoffeeShops from "../../lib/coffee-stores/coffee-stores";
import { StoreContext } from "../../store/store-context";
import { isEmpty, fetcher } from "../../utils";
import useSWR from "swr";

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeShops({});

  return {
    props: {
      coffeeStore: {
        ...coffeeStores.find((c) => {
          return c.id.toString() === params.id;
        }),
      },
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeShops({});

  return {
    paths: coffeeStores.map((c) => {
      const { id } = c;
      return {
        params: {
          id,
        },
      };
    }),
    fallback: true,
  };
}

const CoffeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [votingCount, setVotingCount] = useState(0);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleUpvoteButton = async () => {
    try {
      await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      setVotingCount(++votingCount);
    } catch (error) {
      console.error("Failed to upvote coffee store", error);
    }
  };

  const handleCreateCoffeeStore = async (coffeeStoreData, abortController) => {
    try {
      await fetch("/api/createCoffeeStore", {
        method: "POST",
        signal: abortController.signal,
        body: JSON.stringify(coffeeStoreData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        setCoffeeStore(coffeeStores.find((c) => c.id.toString() === id));
      }
    }
  }, [id, coffeeStores, initialProps.coffeeStore]);

  useEffect(() => {
    const { voting, ...rest } = coffeeStore;

    const abortController = new AbortController();
    if (voting) {
      handleCreateCoffeeStore(coffeeStore, abortController);
    } else {
      handleCreateCoffeeStore(
        {
          ...coffeeStore,
          voting: 0,
        },
        abortController
      );
    }

    return () => {
      abortController.abort();
    };
  }, [coffeeStore]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting ?? 0);
    }
  }, [data]);

  if (router.isFallback) {
    return "Loading....";
  }

  if (error) {
    <div>Something went wrong with loading the page...</div>;
  }

  const { name, address, neighbourhood, imgUrl } = coffeeStore;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>⇦ Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={classNames("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                alt="Address"
                src="/static/icons/Address.svg"
                width="24"
                height="24"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                alt="Neighbourhood"
                src="/static/icons/NearMe.svg"
                width="24"
                height="24"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              alt="Rating"
              src="/static/icons/Rating.svg"
              width="24"
              height="24"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeStore;
