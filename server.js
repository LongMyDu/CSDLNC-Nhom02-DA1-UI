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


app.use(express.static('dist'));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function (req, res) {
   res.sendFile(__dirname + "/index.html");
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
   });
 }

 function generateReceiptID(new_receipt_id) {
    return new Promise((resolve, reject) => {
      // Select the last row in table HoaDon
      var sqlQuery = `SELECT TOP 1 MaHD FROM HoaDon ORDER BY MaHD DESC`
      const request = new sql.Request();
      request.query(sqlQuery, (err, result) => {
         if (err) res.status(500).send(err);
         // Create a new receipt ID
         new_receipt_id.value = (parseInt(Object.values(result.recordset[0]), 10) + 1).toString();
         // Check if the database is full
         if (new_receipt_id.length > 6) {
            return reject("Cannot insert! Database is full");
         }
         return resolve(true);
      });
    }).catch(err => {      
    });
 }

 function insertIntoHoaDon(new_receipt_id, customer_id, date) {
    return new Promise((resolve, reject) => {
      var sqlQuery = `INSERT INTO HoaDon VALUES ('${new_receipt_id.value}','${customer_id}', '${date}', NULL)`
      const request = new sql.Request();
      request.query(sqlQuery, (err, result) => {
         if (err) return reject("Connection failed!");
         //console.log(sqlQuery);
      });
      return resolve(true);
    }).catch (err => {
    });
 }

 function insertIntoCT_HoaDon(new_receipt_id, product_detail_list) {
    return new Promise((resolve, reject) => {
      var sqlQueries = ``;
      for (let i = 0; i < product_detail_list.length; i++) {
         sqlQueries += `INSERT INTO CT_HoaDon VALUES ('${new_receipt_id.value}', '${product_detail_list[i].product_id}', 
                        ${product_detail_list[i].product_number}, ${product_detail_list[i].product_price}, 0, NULL);`
      }
      const request = new sql.Request();
      request.query(sqlQueries, (err, result) => {
         if (err) return reject("Connection failed!");
         //console.log(sqlQueries);
      });
      return resolve(true);
    }).catch(err => {
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
   let isValid = await checkCustomerID(customer_id);
   if (isValid !== true) {
      res.send(`Error from checking customer id: ${customer_id}`);
      return;
   }
   // Case 4: Wrong product_id
   for (let i = 0; i < product_detail_list.length; i++) {
      isValid = await checkProductID(product_detail_list[i]);
      if (isValid !== true) {
         res.send(`Error from checking product id: ${product_detail_list[i].product_id}`);
         return;
      } 
   }

   // Case 5: Duplicate product_id
   for (let i = 0; i < product_detail_list.length - 1; i++) {
      for (let j = i+1; j < product_detail_list.length; j++) {
         if (product_detail_list[i].product_id === product_detail_list[j].product_id) {
            res.send(`Duplicate product id: ${product_detail_list[i].product_id}`);
            return;
         }
      }
   }

   //TODO: link to DB and insert new row into table HoaDon and CT_HoaDon
   new_receipt_id = {}
   isValid = await generateReceiptID(new_receipt_id);
   if (isValid !== true) {
      res.send("Database is full!");
      return;
   }

   new_receipt_id.value = ('0'.repeat(6 - new_receipt_id.value.length)) + new_receipt_id.value;
   isValid = await insertIntoHoaDon(new_receipt_id, customer_id, date);
   if (isValid !== true) {
      res.send("Connection failed when inserting your receipt!");
      return;
   }
   isValid = await insertIntoCT_HoaDon(new_receipt_id, product_detail_list);
   if (isValid !== true) {
      res.send(`Connection failed when inserting into CT_HoaDon!`);
      return;
   }
   res.send("Insert successfully!");
})


app.get('/api/receipt-list', function (req, res) {
   // If there is no parameters then get all HoaDon
   var sqlQuery = 'SELECT * FROM HoaDon'
   // TODO: handle resquest with parameters
   if (Object.keys(req.query).length > 1) {
      var sqlQuery = `SELECT * FROM HoaDon
      WHERE YEAR(NgayLap) = ${req.query.year} AND MONTH(NgayLap) = ${req.query.month}`
   }

   // TODO: get receipt_list in DB
   const request = new sql.Request();
   request.query(sqlQuery, (err, result) => {
      if (err) res.status(500).send(err);
      var totalItems = result.recordset.length;
      var page = req.query.page;
      
      const total_receipt_list = result.recordset.map(elm => ({ id: elm.MaHD, customer_id: elm.MaKH, date: elm.NgayLap.toLocaleDateString(), total: elm.TongTien}));
      
      const receipt_list = total_receipt_list.slice(10*(page-1), 10*page-1);
      // Send to res
      res.json({totalItems: totalItems,receipt_list: receipt_list});
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

