"use strict";

const jsonschema = require("jsonschema");
const shipmentSchema = require("../schemas/shipmentSchema.json");

const express = require("express");
const router = new express.Router();

const {BadRequestError} = require("../expressError");

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body, shipmentSchema);

  if (!result.valid) {
    let errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  }

  const { productId, name, addr, zipcode } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zipcode });
  return res.json({ shipped: shipId });
});


module.exports = router;