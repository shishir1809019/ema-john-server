const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l24ae.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 8000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProduct', (req, res) => {
      const products = req.body
      productsCollection.insertOne(products)
      .then(result => {
          console.log(result)
          console.log(result.insertedCount)
          res.send(result.insertedCount)
      })
  })
  app.post('/addOrder', (req, res) => {
      const order = req.body
      ordersCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/', (req, res) => {
    res.send('Its working')
  })

  app.get('/products', (req,res) => {
    productsCollection.find({}).limit(20)
    .toArray((err,documents) => {
      res.send(documents)
    })
  })
  app.get('/product/:key', (req,res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err,documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })


});


app.listen(process.env.PORT || port)