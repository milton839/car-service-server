const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cf5ms.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000;

const app = express()
app.use(cors());
app.use(express.json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("carService839").collection("services");
  const reviewsCollection = client.db("carService839").collection("reviews");
  const ordersCollection = client.db("carService839").collection("orders");
  const adminCollection = client.db("carService839").collection("admin");


  app.post('/addService', (req, res) =>{
    const service = req.body;
    serviceCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addReview', (req, res) =>{
    const review = req.body;
    reviewsCollection.insertOne(review)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addOrder/', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addAdmin/', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })

  app.get('/services',(req,res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/reviews',(req,res) => {
    reviewsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/orders',(req,res) => {
    ordersCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/ordersByEmail',(req,res) => {
    ordersCollection.find({email:req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.delete('/deleteService/:id',(req,res) => {
    const id = ObjectID(req.params.id);
    serviceCollection.findOneAndDelete({_id:id})
    .then(result => {
        res.send(result.value);
        
    })
  })

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })