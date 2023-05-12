const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");

var db;

app.listen(8000, function () {
  console.log("연결완료");
});

MongoClient.connect(
  "mongodb+srv://qldnjs23:style12121@cluster0.am3ri5e.mongodb.net/?retryWrites=true&w=majority"
)
  .then(function (client) {
    db = client.db("todoapp"); // db 변수에 DB 연결 객체 할당
    console.log("DB 연결 완료");
  })

  .catch(function (err) {
    console.log(err);
  });

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

var allPosts;
app.post("/add", function (req, res) {
  db.collection("counter")
    .findOne({ name: "게시물갯수" })
    .then(function (result) {
      allPosts = result.totalPost;

      db.collection("post")
        .insertOne({
          _id: allPosts + 1,
          title: req.body.title,
          pw: req.body.pw,
        })
        .then(function (result) {
          console.log(result.allPosts);
          console.log(req.body.title);
          console.log(req.body.pw);
          console.log("저장완료");
        });
      db.collection("counter")
        .updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } })
        .then(function (err, result) {
          if (err) {
            return console.log(err);
          }
          console.log("업데이트완료");
        });
      res.redirect("/list");
    });
});

app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray()
    .then(function (result) {
      res.render("list.ejs", { post: result });
    });
});

app.delete("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = parseInt(req.body._id);
  db.collection("post")
    .deleteOne(req.body)
    .then(function (result) {
      res.status("200").send({ message: "성공했습니다." });
    });
  db.collection("counter")
    .updateOne({ name: "게시물갯수" }, { $inc: { totalPost: -1 } })
    .then(function (result) {
      console.log("삭제완료");
    });
});

app.get("/edit/:id", function (req, res) {
  db.collection("post")
    .findOne({ _id: parseInt(req.params.id) })
    .then(function (result) {
      console.log(parseInt(req.params.id));
      res.render("edit.ejs", { data: result });
    });
});

app.post("/edit/:id", function (req, res) {
  db.collection("post")
    .updateOne(
      { _id: parseInt(req.params.id) },
      { $set: { title: req.body.title, pw: req.body.pw } }
    )
    .then(function (result) {
      console.log(parseInt(req.params.id));
      console.log(req.body.pw);
      res.redirect("/list");
    });
});

app.get("/detail/:id", function (req, res) {
  db.collection("post")
    .findOne({ _id: parseInt(req.params.id) })
    .then(function (result) {
      console.log(result);
      res.render("detail.ejs", { data: result });
    });
});
