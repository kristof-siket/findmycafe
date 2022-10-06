import { findRecordById } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) {
      res.status(400).json({
        message: "It is mandatory to provide an ID in the request query!",
      });
    } else {
      const coffeeStore = await findRecordById(id);

      if (coffeeStore) {
        res.status(200).json(coffeeStore);
      } else {
        res.status(404).json({
          message: `No coffee store found with ID ${id}!`,
        });
      }
    }
  } catch (error) {
    console.error("An error occurred when getting coffee store", error);
    res.status(500).json({
      message: "An error occurred when getting coffee store",
      error: error.message,
    });
  }
};

export default getCoffeeStoreById;
