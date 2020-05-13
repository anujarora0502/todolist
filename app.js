const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const app = express();

const _ = require("lodash");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://admin-anuj:anuj0502@cluster0-nzabb.mongodb.net/todolistDB",{useUnifiedTopology:true,useNewUrlParser:true})

const itemSchema = new mongoose.Schema({
  name : String
});

const listSchema = new mongoose.Schema({
  name: String,
  items : [itemSchema]
});

const List = mongoose.model("List",listSchema);

const Item = mongoose.model("item",itemSchema);

const item1 = new Item({
  name : "Welcome to your todolist!"
});
const item2 = new Item({
  name : "Hit the + button to add more items"
});
const item3 = new Item({
  name : "<-- Hit this to delete an item"
});

const defaultArray = [item1,item2,item3];





app.get("/", function(req, res) {
  Item.find({},function(err,items){
    if(items.length === 0){
      Item.insertMany(defaultArray,err=>{
        if(err){
          console.log(err);
        }else{
          console.log("Success");
        }
        res.redirect("/");
      });

    }
    if(err){
      console.log(err);
    }else{
      res.render("list", {
        listTitle: "Today",
        newItem: items
      });
    }
  });



});

app.post("/",function(req,res){
  const item = req.body.newItem;
  const listName = req.body.list;

  const newElement = new Item({
    name : item
  });

  if(listName == "Today"){
    newElement.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName},(err, foundList)=>{
       foundList.items.push(newElement);
       foundList.save();
       res.redirect("/"+listName);
    });
  }


});

app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName},(err,lists)=>{
    if(err){
      console.log(err);
    }else if(lists){
      res.render("list", {
        listTitle: lists.name,
        newItem: lists.items
      });
    }else{
      const list = new List({
        name: customListName,
        items : defaultArray
      }) ;
      list.save();
      res.redirect("/"+customListName);
    }
  });

});

app.get("/about",function(req,res){
  res.render("about");
});

app.post("/delete",function(req,res){
const listName = req.body.listName;
if(listName === "Today"){
  Item.findByIdAndRemove(req.body.checkbox,err=>{
   if(err){
    console.log(err);
  }else{
    res.redirect("/");
  }
  });


}else{
  List.findOneAndUpdate({name : listName},{$pull : {items :{_id : req.body.checkbox }}}, (err, foundList)=>{
    if(!err){
      res.redirect("/"+listName);
    }
  })
}


});

app.listen(3000, function() {

  console.log("The server is running at port 3000");
});
