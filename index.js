const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5426;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b5qg8rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const spotsDB = client.db("spotsDB");
    const spotsCollection = spotsDB.collection("spotsCollection");
    const countrySpotCollection = spotsDB.collection("countrySpotCollection");
    // CREATE OF CRUD
    app.post("/spots", async (req, res) => {
      const data = req.body;
      console.log(data);
      const dbResponse = await spotsCollection.insertOne(data);
      const cDetails = {
        cName: data?.cName,
        url: data?.url,
        description: data?.description,
      };
      console.log(cDetails);
      const CdbResponse = await countrySpotCollection.insertOne(cDetails);
      res.send(dbResponse);
    });
    // READ OF CRUD
    app.get("/spots", async (req, res) => {
      const dbResponse = await spotsCollection.find().toArray();
      res.send(dbResponse);
    });
    // READ-ONE OF CRUD
    app.get("/spots/:id", async (req, res) => {
      const id = new ObjectId(req.params.id);
      const dbResponse = await spotsCollection.findOne(id);
      res.send(dbResponse);
    });
    // READ-MY-LIST OF CRUD
    app.get("/myList/:mail", async (req, res) => {
      const mail = req.params.mail;
      // console.log(mail);
      const query = { email: mail };
      console.log(query);
      const dbResponse = await spotsCollection.find(query).toArray();
      res.send(dbResponse);
    });
    app.get("/myList", async(req, res) =>{
      const email = req.query.email;
      console.log(email);
      const result = await spotsCollection.find({email:email}).toArray();
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
