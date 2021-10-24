const express = require('express');
const app = express();
const bodyParser = require("body-parser");

receipt_list = [
   {
       id: '0001',
       customer_id: '0001',
       date: '06/12/2020',
       total: 2492000
   },
   {
       id: '0002',
       customer_id: '0001',
       date: '15/4/2021',
       total: 540000
   }
];

app.use(express.static('public'));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.sendFile("index.html");
})

app.post('/insert-receipt-post', function (req, res) {
   // Prepare output in JSON format
   let response = {
      customer_id:req.body.customer_id,
      date: req.body.date //yyyy-mm-dd
   };
   console.log(response);
   
   //TODO: validate response
   

   //TODO: link to DB and insert new row

   //TODO: send to client successfull message
   res.send("Sent successfully! New row has been inserted!");
})

app.get('/api/receipt-list', function (req, res) {
   // TODO: handle resquest with parameter

   // TODO: get receipt_list in DB


   // Send to res
   res.json({receipt_list: receipt_list});
})



var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
})
