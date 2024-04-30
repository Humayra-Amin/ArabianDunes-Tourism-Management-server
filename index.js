const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors({
  origin: ["https://tourism-a10-server-fmvukcray-humayra-amins-projects.vercel.app", "https://tourism-a10-client.web.app", "https://tourism-a10-client.firebaseapp.com", "http://localhost:5000", "http://localhost:5173", "https://tourism-a10-server.vercel.app"]
}));
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

    app.get('/tours', async (req, res) => {
      const cursor = tourismCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/tours/:_id', async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) }
      const result = await tourismCollection.findOne(query);
      res.send(result);
    })

    app.post('/tours', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await tourismCollection.insertOne(newSpot);
      res.send(result);
    })

    app.get('/myTour/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = tourismCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });

    app.put('/tours/:_id', async (req, res) => {
      const _id = req.params._id;
      const filter = { _id: new ObjectId(_id) }
      const options = { upsert: true };
      const updatedSpot = req.body;
      const tours = {
        $set: {
          tourists_spot_name: updatedSpot.tourists_spot_name,
          average_cost: updatedSpot.average_cost,
          seasonality: updatedSpot.seasonality,
          travel_time: updatedSpot.travel_time,
          totalVisitorsPerYear: updatedSpot.totalVisitorsPerYear,
          image: updatedSpot.image,
          name: updatedSpot.name,
          email: updatedSpot.email,
          short_description: updatedSpot.short_description,
          country_Name: updatedSpot.country_Name
        }
      }
      const result = await tourismCollection.updateOne(filter, tours, options);
      res.send(result);
    })

    app.delete('/tours/:_id', async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) }
      const result = await tourismCollection.deleteOne(query);
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