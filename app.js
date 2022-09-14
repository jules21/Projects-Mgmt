const express = require('express')
require('dotenv').config()
const port =process.env.PORT || 8000;
const {graphqlHTTP} = require('express-graphql')
const schema = require('./server/schema/schema')
const bodyParser = require('body-parser')

const app = express()

app.get('/', (req,res)=>{
    res.send("hello world from express");
})

app.use(bodyParser.json());

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}))

app.listen(port, ()=>{
    console.log(`server running on port: ${port}`);
});