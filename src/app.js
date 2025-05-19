const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");

//TODO: Create your GET Request Route Below:

app.get("/restaurants", async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve restaurants" });
    }
  });
//part2
  app.get("/restaurants/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const restaurant = await Restaurant.findByPk(id);
      if (restaurant) {
        res.json(restaurant);
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve the restaurant" });
    }
  });

//part3
app.post("/restaurants", async (req, res) => {
    try {
      const newRestaurant = await Restaurant.create(req.body);
      res.status(201).json(newRestaurant);
    } catch (error) {
      res.status(400).json({ error: "Failed to create restaurant" });
    }
  });

  app.put("/restaurants/:id", async (req, res) => {
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
  
  app.delete("/restaurants/:id", async (req, res) => {
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
module.exports = app;