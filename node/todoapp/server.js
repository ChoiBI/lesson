const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set('view engine', 'ejs');

//신버전이라 바뀜
var db;
MongoClient.connect(
  "mongodb+srv://qldnjs23:style12121@cluster0.am3ri5e.mongodb.net/?retryWrites=true&w=majority"
)

  .then(function (client) {
    app.post("/add", function (req, res) {
      res.send("전송완료");
      db = client.db("todoapp");
      db.collection("post").insertOne({ title: req.body.title, pw: req.body.pw },function (에러, 결과) {
          console.log("저장완료");
        }
      );

      console.log(req.body.title);
      console.log(req.body.pw);
    });

    app.listen(8080, function () {
      console.log("연결완료");
    });
  })
  .catch(function (err) {
    console.log(err);
  });

app.get("/beauty", function (req, res) {
  res.send("beauty page");
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.get("/list", function (req, res) {
    res.render(__dirname + "/list.ejs")
})
