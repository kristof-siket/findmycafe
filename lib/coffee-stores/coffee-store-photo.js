const fetchCoffeeStorePhotoUrl = async (storeId, width, height) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FSQ_API_KEY,
    },
  };
  const url = `https://api.foursquare.com/v3/places/${storeId}/photos`;

  const response = await fetch(url, options);
  const data = await response.json();
  const photoNumber = 0;

  if (data && data[photoNumber]) {
    const { prefix, suffix } = data[photoNumber];

    return `${prefix}${width}x${height}${suffix}`;
  }

  return null;
};

export default fetchCoffeeStorePhotoUrl;
