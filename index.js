const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
// const jwt = require('jsonwebtoken');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@cluster0.5qr4q.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        // console.log('Database is connected');
        const serviceCollection = client.db('tool_trade').collection('electric_tools');
        const bookingCollection = client.db('tool_trade').collection('bookings');
        const userCollection = client.db('tool_trade').collection('users');




// product collection insert
app.post("/allProduct",  async (req, res) => {
  const product = req.body;
  const result = await serviceCollection.insertOne(product);
  res.send(result);
});




        //admin auth
        app.get('/admin/:email', async(req, res)=>{
          const email =req.params.email;
          const user = await userCollection.findOne({email:email});
          const isAdmin = user.role === 'admin';
          res.send({admin: isAdmin});
        })



       //update for admin user
        app.put('/user/admin/:email', async(req, res)=>{
          const email = req.params.email;
          const filter = {email:email};
          const updateDoc ={
            $set: {role: 'admin'},
          }
          const result = await userCollection.updateOne(filter, updateDoc);
          res.send(result);
        })
     
        //update/insert user
       app.put('/user/:email', async(req, res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email:email};
        const options = {upsert: true};
        const updateDoc ={
          $set: user,
        }
        const result = await userCollection.updateOne(filter, updateDoc, options);
      // const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
        res.send(result);
        // res.send(result, token);
      })  
    // from db to server to UI 
      app.get('/service', async(req, res) =>{
          const query ={};
          const cursor = serviceCollection.find(query);
          const services =await cursor.toArray();
          res.send(services);
      })
   //from db to server to ui Dashboard  
    app.get('/booking', async(req, res)=>{
      const email = req.query.email;
      const query = {buyer: email};
      const bookings =await bookingCollection.find(query).toArray();
      res.send(bookings);
    })


  //from db(user collection) to server to ui Dashboard
  app.get('/user', async(req, res)=>{
    const users = await userCollection.find().toArray();
    res.send(users);
  })




    //from modal to db
    app.post('/booking', async(req, res)=>{
      const booking = req.body;
      const result =await bookingCollection.insertOne(booking);
      return  res.send({success: true, result});
    })


    }
    finally{ 

    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello, Tools Server is running");
});

app.listen(port, () => {
  console.log(`Tools-Trade app listening on port ${port}`);
});
