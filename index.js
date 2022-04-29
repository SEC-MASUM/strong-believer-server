const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Database Connection String
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cdy4b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const eventCollection = client.db("strongBeliever").collection("event");
    const registeredEventCollection = client
      .db("strongBeliever")
      .collection("registeredEvent");

    console.log("DB Connected");

    // POST Register as a Volunteer
    app.post("/registeredEvent", async (req, res) => {
      const regEvent = req.body;
      const result = registeredEventCollection.insertOne(regEvent);
      res.send({ success: true, message: "Registration successful" });
    });

    // GET Registered Event
    app.get("/registeredEvent", async (req, res) => {
      const email = req.query.email;
      // console.log(email);
      const query = { email: email };
      const cursor = registeredEventCollection.find({});
      const result = await cursor.toArray();
      // console.log(result);
      res.send(result);
    });

    // EVENT API : create new event
    // http://localhost:5000/addEvent
    app.post("/addEvent", async (req, res) => {
      const newEvent = req.body;
      const result = await eventCollection.insertOne(newEvent);
      res.send({ success: true, message: "New event is added successfully" });
    });
    // GET EVENT : get all event
    // http://localhost:5000/event
    app.get("/event", async (req, res) => {
      const result = await eventCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Strong Believer Server Running");
});

app.get("/believer", (req, res) => {
  res.send("You will find here believers!!!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
