const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9jkswbp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const tourismCollection = client.db('TourismDB').collection('tour');

    app.get('/tours', async(req, res) => {
      const cursor = tourismCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/tours/:_id', async(req, res) => {
      const _id = req.params._id;
      const query = {_id: new ObjectId(_id)}
      const result = await tourismCollection.findOne(query);
      res.send(result);
    })

    app.post('/tours', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await tourismCollection.insertOne(newSpot);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Tourism Server Started')
})

app.listen(port, () => {
  console.log(`Tourism server started on http://localhost: ${port}`)
})