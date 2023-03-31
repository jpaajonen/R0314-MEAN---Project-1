//loading all the dependencies
const express = require("express");
const app = express();
const fs = require("fs");
const port = process.env.PORT | 8080;

app.set("view engine", "ejs");

app.locals.pretty = true;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//defining the different routes
//root loads index.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
//ajaxmessage loads ajaxmessage.html
app.get("/ajaxmessage", function (req, res) {
  res.sendFile(__dirname + "/public/ajaxmessage.html");
});
//manipulating JSON, first the current data is passed to a variable
app.post("/ajaxmessage", function (req, res) {
  const data = require("./JSONguestinfo.json");
//new data is pushed to the JSON variable
  data.push({
    Username: req.body.username,
    Country: req.body.country,
    Message: req.body.message,
  });
//JSON objects are stringified 
  const jsonStr = JSON.stringify(data);
//the stringified data is written to the original file
  fs.writeFile("JSONguestinfo.json", jsonStr, (err) => {
    if (err) throw err;
  });
//the updated JSON data is passed to a variable for ejs use
  var newdata = require("./JSONguestinfo.json");
//the variable is ejs'd to ajaxjson.ejs  
  res.render("ajaxjson", {JSONdata: newdata} );
});

//newmessage serves the newmessage.html form
app.get("/newmessage", function (req, res) {
  res.sendFile(__dirname + "/public/newmessage.html");
});
//route for form sending the POST data
app.post("/newmessage", function (req, res) {
//  console.log(req.body);
  
  var data = require("./JSONguestinfo.json");

  data.push({
    Username: req.body.username,
    Country: req.body.country,
    Message: req.body.message,
  });

  var jsonStr = JSON.stringify(data);

  fs.writeFile("JSONguestinfo.json", jsonStr, (err) => {
    if (err) throw err;  
  });
//redirect the user to the guestbook after submitting entry
  res.redirect("/guestbook");
});
//route for viewing the json data
app.get("/guestbook", function (req, res) {
  var data = require("./JSONguestinfo.json");
//ejs is used to style the JSON data
  res.render("json", { JSONdata: data });
});
//error message for routes that aren't defined
app.get("*", function (req, res) {
  res.send("Cant find the requested page", 404);
});

app.listen(port, function () {
  console.log("App listening to port", port);
});
