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
        console.log('Database is connected');
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
