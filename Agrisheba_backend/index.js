// Import required modules
const express = require('express')
const cors = require('cors')

// Create an Express application
const app = express();

// Define the port (use the environment variable PORT if available, otherwise use 5000)
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://sagorcse:1cOEfGcaGqiT1ETi@cluster0.qsd8ljo.mongodb.net/?retryWrites=true&w=majority";

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
    const database = client.db("usersDB");

    const usersCollection = database.collection("Users");
    const ordercollection = client.db("bristodb").collection("orders");
    
    app.post('/orders',async(req,res)=>{

      const item=req.body;
      console.log(item);
      const result =await cartcollection.insertOne(item);
    
      res.send(result);

    })
    app.delete('/orders/:id',async(req,res)=>{
     const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await cartcollection.deleteOne(query);
      res.send(result);
    })

    app.get('/orders/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const allOrder = await ordercollection.find().toArray();
      const result = allOrder.filter(order => order.email == id)
      res.send(result)
    })
    
    app.get('/users',async(req,res)=>{

      const cursor=usersCollection.find()
      const result=await cursor.toArray();
      res.send(result);
    })
    app.get('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const query ={_id:new ObjectId(id)}
      const  user=await usersCollection.findOne(query)
      res.send(user)


    })
    app.post('/users',async(req ,res )=>{
      const user=req.body;
      //console.log('new user',user)
      const result = await usersCollection.insertOne(user);
      console.log(result)
      res.send(result)


    });
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.send(result)
  })


    /*app.delete('/users/:id',(req,res)=>{
      const id=req.params.id;
      console.log("please delete",id)


    });*/
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


     


// Define a route for the root path '/'
app.get('/', (req, res) => {
    res.send("Server is running");
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
