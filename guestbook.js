const express = require("express");
const app = express();
const fs = require("fs");
const port = process.env.PORT | 8080;

app.set("view engine", "ejs");

app.locals.pretty = true;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/ajaxmessage", function (req, res) {
  res.sendFile(__dirname + "/ajaxmessage.html");
});

app.post("/ajaxmessage", function (req, res) {
  console.log(req.body);

  const data = require("./JSONguestinfo.json");

  data.push({
    Username: req.body.username,
    Country: req.body.country,
    Message: req.body.message,
  });

  const jsonStr = JSON.stringify(data);

  fs.writeFile("JSONguestinfo.json", jsonStr, (err) => {
    if (err) throw err;
  });

  var newdata = require("./JSONguestinfo.json");
  res.render("ajaxjson", {JSONdata: newdata} );
});

//serve a form to the user
app.get("/newmessage", function (req, res) {
  res.sendFile(__dirname + "/newmessage.html");
});
//route for form sending the POST data
app.post("/newmessage", function (req, res) {
  console.log(req.body);
  //load the existing data from a file
  var data = require("./JSONguestinfo.json");
  //Create a new JSON object and add it to the existing data variable (push to end of array, unshift to start of array)
  data.push({
    Username: req.body.username,
    Country: req.body.country,
    Message: req.body.message,
  });

  //convert the JSON object to a string format
  var jsonStr = JSON.stringify(data);

  //write data to a file
  fs.writeFile("JSONguestinfo.json", jsonStr, (err) => {
    if (err) throw err;
   // console.log("It's saved!");
   
  });

  //res.send("Thank you for your entry!");
  res.redirect("/guestbook");
});
//route for viewing the json data
app.get("/guestbook", function (req, res) {
  var data = require("./JSONguestinfo.json");
  /*  var results = '<table id="contents" border="1"> ';

  for (var i = 0; i < data.length; i++) {
    results +=
      "<tr>" +
      "<td class='user'>" +
      data[i].Username +
      "</td>" +
      "<td class='country'>" +
      data[i].Country +
      "</td>" +
      "<td class='message'>" +
      data[i].Message +
      "</td>" +
      "</tr>";
  }  */
  res.render("json", { JSONdata: data });
  //res.send(results);
});

app.get("*", function (req, res) {
  res.send("Cant find the requested page", 404);
});

//app.use(express.static('./public/demosite'));

app.listen(8080, function () {
  console.log("Example app listening to port", port);
});
