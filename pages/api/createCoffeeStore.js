import {
  getMinifiedRecords,
  COFFEE_TABLE,
  findRecordById,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  const { id, name, imgUrl, address, neighbourhood, voting } = req.body;

  if (req.method === "POST") {
    try {
      if (id) {
        const coffeeStore = await findRecordById(id);

        if (coffeeStore) {
          res.status(200).json(coffeeStore);
        } else {
          if (name) {
            const createRecords = await COFFEE_TABLE.create([
              {
                fields: {
                  id,
                  name,
                  imgUrl,
                  address,
                  neighbourhood,
                  voting,
                },
              },
            ]);

            res.status(200).json(getMinifiedRecords(createRecords));
          } else {
            res.status(400).json({
              message: "Id and name are mandatory!",
            });
          }
        }
      } else {
        res.status(400).json({
          message: "Please, provide an 'id' for the request!",
        });
      }
    } catch (err) {
      console.error("Failed to create / retrieve coffee store: ", err);
      res.status(500).json({
        error: err.message,
      });
    }
  } else {
    res.status(400).json({
      message: "This is a POST endpoint.",
    });
  }
};

export default createCoffeeStore;
