const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.POST || 5000;

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
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

async function run() {
  try {
    await client.connect();
    const eventCollection = client.db("strongBeliever").collection("event");
    console.log("DB Connected");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Strong Believer Server Running");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
