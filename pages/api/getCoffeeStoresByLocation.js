import fetchCoffeeShops from "../../lib/coffee-stores/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { lat, long, limit } = req.query;

    const coffeeStores = await fetchCoffeeShops({
      lat,
      long,
      limit,
    });

    res.status(200).json(coffeeStores);
  } catch (error) {
    console.error("There was an error in fetching coffee stores: ", error);

    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export default getCoffeeStoresByLocation;
