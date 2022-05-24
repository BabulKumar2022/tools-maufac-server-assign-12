const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
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
       

        app.get('/service', async(req, res) =>{
            const query ={};
            const cursor = serviceCollection.find(query);
            const services =await cursor.toArray();
            res.send(services);
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
