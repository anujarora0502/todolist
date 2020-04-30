const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname+"/date.js");
const items =["Buy Food","Cook Food","Eat Food"];
const workItems=[];
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {


  res.render("list", {
    listTitle: day.getDate(),
    newItem: items
  });

});

app.post("/",function(req,res){
  const item = req.body.newItem;
if(req.body.list=="WorkList"){
  workItems.push(item);
  res.redirect("/work");
}else{
  items.push(item);
  res.redirect("/");
}
});

app.get("/work",function(req,res){
  res.render("list",{listTitle: "WorkList",newItem: workItems});
});
app.post("/work",function(req,res){
  const item= req.body.newItem;
  workItems.push(item);


  res.redirect("/work");
});

app.get("/about",function(req,res){
  res.render("about");
});
app.listen(3000, function() {

  console.log("The server is running at port 3000");
});
