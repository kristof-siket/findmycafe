import fetchCoffeeStorePhotoUrl from "./coffee-store-photo";

const getUrlForCoffeeStores = (lat, long, category, limit) => {
  return `https://api.foursquare.com/v3/places/search?ll=${lat}%2C${long}&categories=${category}&limit=${limit}`;
};

const fetchCoffeeShops = async (props) => {
  const {
    lat = "47.67856063698687",
    long = "19.06871567905747",
    photoSize = {
      width: 260,
      height: 160,
    },
    limit = 6,
  } = props;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY,
    },
  };

  const url = getUrlForCoffeeStores(lat, long, "13032", limit);
  const response = await fetch(url, options);
  const data = await response.json();

  return await Promise.all(
    data.results?.map(async (r) => {
      const imgUrl = await fetchCoffeeStorePhotoUrl(
        r.fsq_id,
        photoSize.width,
        photoSize.height
      );
      return {
        id: r.fsq_id,
        name: r.name,
        address: r.location.formatted_address,
        neighbourhood: r.location.locality,
        imgUrl,
      };
    }) ?? []
  );
};

export default fetchCoffeeShops;
