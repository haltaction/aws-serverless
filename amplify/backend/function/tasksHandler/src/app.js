const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});

function id () {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

app.get('/tasks', function(req, res) {
  const params = {
    TableName: process.env.STORAGE_FORMTABLE_NAME || 'tasks-dev'
  };
  docClient.scan(params, function(err, data) {
    if (err) res.json({ err });
    else res.json({ data })
  })
});

app.post('/tasks', function(req, res) {
  const params = {
    TableName : process.env.STORAGE_FORMTABLE_NAME || 'tasks-dev',
    Item: {
      id: id(),
      name: req.body.name
    }
  };
  docClient.put(params, function(err, data) {
    if (err) res.json({ err });
    else res.json({ success: 'Created successfully!', data })
  })
});

app.delete('/tasks/:id', function(req, res) {
  const params = {
    TableName : process.env.STORAGE_FORMTABLE_NAME || 'tasks-dev',
    Key: {
      id: req.params.id
    }
  };
  docClient.delete(params, function(err, data) {
    if (err) res.json({ err });
    else res.json({ success: 'Deleted successfully!', data })
  })
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
