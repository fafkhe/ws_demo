import {
  allCurrency,
  createCurrency,
  editCurrency,
} from "../controller/currency.controller";
import catchAsync from "../catchAsync";
import {
  allRate,
  createRate,
  editRate,
  singleRateByCur,
} from "../controller/rate.controller";

export default (app) => {
  app.get("/", (_, res) => res.send("Hello World!"));
  app.post("/currency/create", catchAsync(createCurrency));
  app.post("/currency/:id", catchAsync(editCurrency));
  app.get("/currency/all", catchAsync(allCurrency));

  app.post("/rate/create", catchAsync(createRate));
  app.post("/rate/single/cur", catchAsync(singleRateByCur));
  app.get("/rate/all", catchAsync(allRate));
  app.post("/rate/edit/:id", catchAsync(editRate));
};
