const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());


//User: TourTrip
//pass: ft8Sji2uBWyPdU6c

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3nl2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try {
        await client.connect();
        console.log('connected to database');

        const database = client.db('tour&trip');
        const packageCollection = database.collection('packages');
        const orderCollection = database.collection('orders');
        const hotelCollection = database.collection('hotels');
        const transportCollection = database.collection('transports');

        //GET API (Packages)
        app.get('/packages', async (req, res) => {
            const cursor = await packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        //GET API (transports)
        app.get('/transports', async (req, res) => {
            const cursor = await transportCollection.find({});
            const tr = await cursor.toArray();
            res.send(tr);
        })

        //GET API (hotels)
        app.get('/hotels', async (req, res) => {
            const cursor = await hotelCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        })

        //GET Single Package (To place order)
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const packages = await packageCollection.findOne(query);
            res.json(packages);
        })



        //POST API (Packages)
        app.post('/packages', async (req, res) => {
            const package = req.body;

            console.log('hit the post api', package);

            const result = await packageCollection.insertOne(package);
            console.log(result);
            res.json(result);

        });

        //POST API (Hotels)
        app.post('/hotels', async (req, res) => {
            const hotel = req.body;

            console.log('hit the post api', hotel);

            const result = await hotelCollection.insertOne(hotel);
            console.log(result);
            res.json(result);

        });

        //POST API (Transports)
        app.post('/transports', async (req, res) => {
            const transport = req.body;

            console.log('hit the post api', transport);

            const result = await transportCollection.insertOne(transport);
            console.log(result);
            res.json(result);

        });

        //GET API (Orders)
        app.get('/orders', async (req, res) => {
            const cursor = await orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //GET API (My Order by email)
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const orders = await orderCollection.find(query).toArray();
            res.json(orders);
        })


        //POST API (Orders)
        app.post('/orders', async (req, res) => {
            const order = req.body;

            console.log('hit the post api', order);

            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);

        });

        //DELETE API (delete order)
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log('delete order', id);
            res.json(1);
        })

        //UPDATE API (update order status)
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateOrder.status
                }
            }
            console.log('hitting update', id);
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
            console.log(result);
            // const filter = {_id: ObjectId(id)};

        })



    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running the server');
})

app.listen(port, () => {
    console.log('Running from port', port);
})