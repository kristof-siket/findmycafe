import { findRecordById, updateRecordById } from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.body;

    if (req.method === "PUT") {
      if (id) {
        const record = await findRecordById(id);

        if (record && record.length > 0) {
          const coffeeStore = record[0];
          const calculateVoting = parseInt(coffeeStore.voting) + 1;

          const updatedCoffeStore = await updateRecordById(
            coffeeStore.recordId,
            {
              voting: calculateVoting,
            }
          );

          res.status(200).json(updatedCoffeStore);
        } else {
          res
            .status(404)
            .json({ message: `No coffee store found with id ${id}!` });
        }
      }
    } else {
      res.status(400).json({ message: "This is a PUT endpoint!" });
    }
  } catch (error) {
    console.error("Something went wrong: ", error.message);
    res
      .status(500)
      .json({ message: `Error upvoting coffee store: ${error.message}` });
  }
};

export default favouriteCoffeeStoreById;
