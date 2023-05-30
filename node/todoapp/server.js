const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");
require('dotenv').config();

var db;

app.listen(process.env.PORT, function () {
  console.log("연결완료");
});

MongoClient.connect(
  process.env.DB_URL
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
        .then(function (result) {
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


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());


app.get('/login', function (req, res) {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/fail'
}), function (req, res) {
  res.redirect("/mypage");
});

app.get('/mypage', loginCheck, function(req,res){
  res.render('mypage.ejs', {user: req.user.id})
})

function loginCheck(req,res,next) {
  if (req.user) {
    next()
  } else {
    res.send("로그인안했는디요")
  }
}

app.get('/search', function(req, res) {
  var 검색조건 = [
    {
      $search: {
        index: 'titleSearch',
        text: {
          query: req.query.value,
          path: "title"
        }
      }
    }
  ]
  db.collection('post').aggregate(검색조건).toArray().then(function(result){
    console.log('검색완료');
    res.render('list.ejs', {post: result});
  });
});


passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function(입력아이디, 입력비번, done) {
  console.log(입력아이디, 입력비번);
  db.collection('login').findOne({id: 입력아이디}).then(function(result,err){
    if (err) return done(err)

    if (!result) return done(null, false, {message: '없는 아이디임'})
    if (입력비번 == result.pw) {
      return done(null, result)
    } else {
      return done(null, false, {message: '비번틀림'})
    }

  })
}))


passport.serializeUser(function(user, done){
  done(null, user.id)
});

passport.deserializeUser(function(id, done){
  db.collection('login').findOne({id: id}).then(function(result, err){
    done(null, result)
  })
  
}); 

