const express = require('express')
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.1tedy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    // Getting the data from database
    const TaskCollection = client.db("todoCollection").collection("Task");


    app.post('/addtask', async (req, res)=>{
        const newTask = req.body; 
        const result = await TaskCollection.insertOne(newTask); 
        res.send(result); 
    }); 

    app.get('/seetask/:email', async (req, res)=>{
        const email = req.params.email; 
        const emailObject = {email: email}; 
        const result = await TaskCollection.find(emailObject).toArray(); 
        res.send(result); 
    })


    // Delete a particuller user 
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await TaskCollection.deleteOne(query);
      res.send(result);
    })
   


  }
  finally {

  }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Todo app is running. ')
})

app.listen(port, () => {
  console.log('Listening to the port for todo app', port)
})