import Airtable from "airtable";

const BASE = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appck4uleQFRjq8oJ"
);
export const COFFEE_TABLE = BASE("coffee-stores");

const getMinifiedRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

export const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

export const findRecordById = async (id) => {
  const existingCoffeeStore = await COFFEE_TABLE.select({
    filterByFormula: `id="${id}"`,
  }).firstPage();

  if (existingCoffeeStore && existingCoffeeStore.length > 0) {
    return getMinifiedRecords(existingCoffeeStore);
  } else {
    return undefined;
  }
};

export const updateRecordById = async (recordId, fields) => {
  // Destructure it for "type safety"
  const { id, name, address, neighborhood, voting, imgUrl } = fields;

  const updatedCoffeeStore = await COFFEE_TABLE.update([
    {
      id: recordId,
      fields: {
        id,
        name,
        address,
        neighborhood,
        voting,
        imgUrl,
      },
    },
  ]);

  return getMinifiedRecords(updatedCoffeeStore);
};
