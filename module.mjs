// @ts-check
import { module } from "@prisma/composer";
import discoverCoffeeStoresService from "./service.mjs";

export default module("findmycafe", ({ provision }) => {
  provision(discoverCoffeeStoresService, { id: "discovercoffeestores" });
});
