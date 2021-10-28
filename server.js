const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const sql = require("mssql");

const config = {
   user: 'sa',
   password: 'svcntt',
   server: 'localhost', 
   database: 'DB_QLHD',
   trustServerCertificate: true,
};


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
   // If there is no parameters then get all HoaDon
   var sqlQuery = 'SELECT * FROM HoaDon'
   // TODO: handle resquest with parameter
   if (Object.keys(req.query).length !== 0) {
      var sqlQuery = `SELECT * FROM HoaDon
      WHERE YEAR(NgayLap) = ${req.query.year} AND MONTH(NgayLap) = ${req.query.month}`
   }

   // TODO: get receipt_list in DB
   const request = new sql.Request();
   request.query(sqlQuery, (err, result) => {
      if (err) res.status(500).send(err);
      //console.log(result.recordset);
      const receipt_list = result.recordset.map(elm => ({ id: elm.MaHD, customer_id: elm.MaKH, date: elm.NgayLap.toLocaleDateString(), total: elm.TongTien}));
      // Send to res
      res.json({receipt_list: receipt_list});
   });
})


sql.connect(config, err => {
   if (err) {
      console.log('Failed to open a SQL Database connection.', err.stack);
      process.exit(1);
   }
   var server = app.listen(8080, function () {
      var host = server.address().address;
      var port = server.address().port;
      
      console.log("Example app listening at http://%s:%s", host, port);
   });
});

