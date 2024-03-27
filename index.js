const express = require("express")
const cors = require("cors")
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// madilware 

app.use(cors());
app.use(express.json())

// pass taskManagement  T4YyV89FYEV5ztQX

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MongoDb_User}:${process.env.MongoDb_Password}@cluster0.jg43ilw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    const userCollation = client.db("taskManagement").collection('alluser')
    const taskCollation = client.db("taskManagement").collection('alltask')



    app.post("/alluser",async(req,res)=>{
        const newser = req.body;
        console.log(newser);
        const result = await userCollation.insertOne(newser);
        res.send(result)
    })

    app.get("/user", async (req, res) => {
      try {
        const { email } = req.query;
        const result = await userCollation.findOne({ email: email });
        if (result) {
          res.send(result);
        } else {
          res.status(404).send('User not found');
        }
      } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).send('Error retrieving user');
      }
    });
    

    app.post("/alltask",async(req,res)=>{
        const newser = req.body;
        console.log(newser);
        const result = await taskCollation.insertOne(newser);
        res.send(result)
    })

    app.get("/alltasks", async (req, res) => {
      try {
        const { email } = req.query;
        const result = await taskCollation.find({ $or: [{ email: email }, { name: email }] }).toArray();
        if (result.length > 0) {
          res.send(result);
        } else {
          res.status(404).send('Tasks not found for the given email');
        }
      } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).send('Error retrieving tasks');
      }
    });

    app.delete('/alltasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await taskCollation.deleteOne(query);
      res.send(result);
    })
    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get("/" , (req ,res)=>{
    res.send("server is running")
})

app.listen( port , ()=>{
    console.log(`surver site is runing ${port}`);
})