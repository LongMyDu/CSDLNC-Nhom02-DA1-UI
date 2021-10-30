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

Array.prototype.pushValues = function(arr) {
   this.push.apply(this, arr);
};

function NoneEmpty(arr) {
   for(var i = 0; i < arr.length; i++) {
     if(arr[i].product_id === '' || arr[i].product_price === '' || arr[i].product_number === '') return false;
   }
   return true;
}
 
 function checkCustomerID(customer_id) {
   return new Promise((resolve, reject) => {
      var sqlQuery = `SELECT * FROM KhachHang KH WHERE KH.MaKH = '${customer_id}'`;
      const connection = new sql.Request();
      connection.query(sqlQuery, (err, result) => {
         if (err) return reject(err);
         if (result.recordset.length === 0) {
            return reject("Cannot insert! Wrong customer's ID!");
         }
         return resolve(true);
      }
     );
   }).catch(err => {
      console.log("Error from check customer id: ", customer_id);
   });
 }

 
 function checkProductID(product) {
   return new Promise((resolve, reject) => {
      var sqlQuery = `SELECT * FROM SanPham SP WHERE SP.MaSP = '${product.product_id}'`
      const request = new sql.Request();
      request.query(sqlQuery, (err, result) => {
         if (err) return reject(err);
         if (result.recordset.length === 0) {
            return reject("Cannot insert! Wrong product's ID!");
         }
         return resolve(true);
         }
      );
   }).catch(err => {
      console.log("Error from check product id: ", product.product_id);
   });
 }

app.post('/insert-receipt-post', async function (req, res) {
   // Prepare output in JSON format
   let response = {
      customer_id:req.body.customer_id,
      date: req.body.date,                      //yyyy-mm-dd
      product_detail_list: JSON.parse(req.body.product_detail_list)
   };
   
   //TODO: validate response
   //let isValid = true;

   // Get customer ID and date
   var customer_id = response.customer_id;
   var date = response.date;

   // Get all products
   // product_detail_list[i] % 3 === 0: MaSP
   // product_detail_list[i] % 3 === 1: SoLuong
   // product_detail_list[i] % 3 === 2: Gia
   var product_detail_list = response.product_detail_list;

   // Case 1: Insufficient information
   if (customer_id === '' || date === '' || !NoneEmpty(product_detail_list)) {
      res.send("Cannot insert! Some information is missing!");
      return;
   } 

   // Case 2: Wrong date (inputDate > today)
   // Note: Wrong date format has already been checked via the front-end
   var inputDate = new Date(date);
   var today = new Date();
   if (inputDate.setHours(0,0,0,0) > today.setHours(0,0,0,0)) {
      res.send("Cannot insert! Invalid date!");
      return;
   }

   // Case 3: Wrong customer_id
   // var sqlQuery = `SELECT * FROM KhachHang KH
   //                WHERE KH.MaKH = ${customer_id}`
   // const request = new sql.Request();
   // request.query(sqlQuery, (err, result) => {
   //    if (err) res.status(500).send(err);
   //    if (result.recordset.length === 0) {
   //       res.send("Cannot insert! Wrong customer's ID!");
   //       isValid = false;
   //    }
   // });
   let isValid = await checkCustomerID(customer_id);
   if (isValid !== true) return;

   // Case 4: Wrong product_id
   for (let i = 0; i < product_detail_list.length; i++) {
      isValid = await checkProductID(product_detail_list[i]);
      if (isValid !== true) return;
   }

   /*
   //TODO: link to DB and insert new row into table HoaDon and CT_HoaDon
   // Select the last row in table HoaDon
   var sqlQuery_select = `SELECT TOP 1 MaHD FROM HoaDon ORDER BY MaHD DESC`
   //const request = new sql.Request();
   request.query(sqlQuery_select, (err, result) => {
      if (err) res.status(500).send(err);
      // Create a new receipt ID
      var new_receipt_id = (parseInt(Object.values(result.recordset[0]), 10) + 1).toString();

      // Check if the database is full
      if (new_receipt_id.length > 6) {
         res.send("Cannot insert! Database is full");
         isValid = false;
      }

      // If all conditions are met, insert into HoaDon
      if (isValid === true) {
         new_receipt_id = ((6 - new_receipt_id.length) * '0') + new_receipt_id;
         var sqlQuery_insert = `INSERT INTO HoaDon VALUES (${new_receipt_id},${customer_id}, ${date}, NULL)`
         //const request = new sql.Request();
         request.query(sqlQuery_insert, (err, result) => {
            if (err) res.status(500).send(err);
         });
         // Insert into CT_HoaDon
         for (let i = 0; i < product_detail_list.length; i=i+3) {
            var sqlQuery_insert2 = `INSERT INTO CT_HoaDon VALUES (${new_receipt_id}, ${product_detail_list[i]}, ${product_detail_list[i+1]}, 
                                                          ${product_detail_list[i+2]},0, NULL)`
            //const request = new sql.Request();
            request.query(sqlQuery_insert2, (err, result) => {
               if (err) res.status(500).send(err);
            });
         }
         console.log(response);
         console.log(isValid);
         // Send to client successfull message
         res.send("Insert sucessfully!")
      }
   });*/
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

