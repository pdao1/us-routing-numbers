const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://phung:Watacress1@phung.2yfqvwg.mongodb.net/RoutingNumbers', { useNewUrlParser: true, useUnifiedTopology: true });

const RoutingSchema = new mongoose.Schema({
  State: String,
  City: String,
  Bank: String,
	RoutingNumber: Number
});

const Routing = mongoose.model("Routing", RoutingSchema);

app.get("/api/states", async (req, res) => {
  const states = await Routing.distinct("State");
  res.json(states);
});

app.get("/api/cities", async (req, res) => {
  const { state } = req.query;
  const cities = await Routing.distinct("City", { State: state });
  res.json(cities);
});

app.get("/api/banks", async (req, res) => {
  const { state, city } = req.query;
  const banks = await Routing.distinct("Bank", { State: state, City: city });
  res.json(banks);
});

app.get("/api/routings", async (req, res) => {
  const { state, city, bank } = req.query;
  let query = {};
  if (state) query.State = state;
  if (city) query.City = city;
  if (bank) query.Bank = bank;
  
  const routings = await Routing.find(query);
  res.json(routings);
});


app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});