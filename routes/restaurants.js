const express = require("express");
const router = express.Router();
const Restaurant = require("../models/index");
const { check, validationResult } = require("express-validator");

// GET all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve restaurants" });
  }
});

// GET one restaurant by id
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the restaurant" });
  }
});

// POST create new restaurant with validation
router.post(
  '/',
  [
    check('name').trim().notEmpty().withMessage('Name field cannot be empty'),
    check('location').trim().notEmpty().withMessage('Location field cannot be empty'),
    check('cuisine').trim().notEmpty().withMessage('Cuisine field cannot be empty'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    
    try {
      const newRestaurant = await Restaurant.create(req.body);
      return res.status(201).json(newRestaurant);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create restaurant' });
    }
  }
);


// PUT update existing restaurant by id
router.put("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      await restaurant.update(req.body);
      res.json(restaurant);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to update restaurant" });
  }
});

// DELETE restaurant by id
router.delete("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      await restaurant.destroy();
      res.json({ message: "Restaurant deleted successfully" });
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
});

module.exports = router;
