var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;
// check connection
db.once('open',function(){
console.log('Connected to MongoDB');
});

// check for DB errors
db.on('error',function(err){
  console.log(err);
});

// init app
var app = express();

// Bring in Models
var Article = require('./models/articles');
//load view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');
// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

// Home route
app.get('/', function(req, res){
  Article.find({}, function(err,articles){
    if(err){
      console.log(err);
    }
    else{
    res.render("index",{
      title:'Articles',
      articles: articles,
    });
  }
  });
});


// Get single article
app.get('/article/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    res.render("article",{
      article:article
    });
  });
});
// ADD route
app.get('/articles/add', function(req,res){
  res.render("add_article",{
    title:'Add articles'
  });
});
// Add submit POST Route
app.post('/articles/add',function(req,res){
  var article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body  = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else{
      res.redirect('/');
    }
  })
});

// start server
app.listen(3000, function(){
console.log("PORT IS UP AND RUNNING ON PORT 3000..")
})
