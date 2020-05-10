const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const app = express();

app.set("view engine", "ejs");

//const config = require("./config/key");

mongoose.connect(
  "mongodb+srv://@zia-123-6nro8.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useCreateIndex: true },
  (req, res) => {
    console.log("db is connected");
  }
);

var laptopSchema = new mongoose.Schema({
  title: String,
  cpu: String,
  ram: String,
  storage: String,
  screen: String,
  price: Number,
  description: String,
  imageFile: String,
});

var Laptop = mongoose.model("Laptop", laptopSchema);

app.use(express.static("public"));

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("Home");
});

app.get("/list", (req, res) => {
  Laptop.find({}, (error, laptop) => {
    console.log(laptop);
    if (error) {
      console.log("There was an error retrieving all the laptop");
      console.log(error);
    } else {
      res.render("list", {
        laptopList: laptop,
      });
    }
  });
});

app.get("/addlaptop", (req, res) => {
  res.render("addlaptop");
});

app.post("/addlaptop", (req, res) => {
  var data = req.body;

  var imageFile = req.files.imageFile;

  imageFile.mv("public/laptops/thumbnails/" + imageFile.name, function (error) {
    if (error) {
      console.log("Couldn't upload the image file");
    } else {
      console.log("image file successsfully upload");
    }
  });

  Laptop.create(
    {
      title: data.title,
      cpu: data.cpu,
      ram: data.ram,
      storage: data.storage,
      screen: data.screen,
      price: data.price,
      description: data.description,
      imageFile: imageFile.name,
    },
    (error, data) => {
      if (error) {
        console.log("There was an error adding this game to the database");
        console.log(error);
      } else {
        console.log("Game added to the database");
        console.log(data);
      }
    }
  );
  res.redirect("/list");
});

//Delete a laptop

app.get("/laptops/delete/:id", (req, res) => {
  var id = req.params.id;
  Laptop.findByIdAndDelete(id, (err) => {
    if (err) {
      console.log("error deleting the game");
    } else {
      console.log("Deleted game from database" + id);
      res.redirect("/list");
    }
  });
});

//Edit a laptop

app.get("/laptops/edit/:id", (req, res) => {
  var id = req.params.id;
  Laptop.findById(id, (error, laptop) => {
    if (error) {
      console.log("could find game with that id:");
    } else {
      res.render("edit", {
        title: laptop.title,
        cpu: laptop.cpu,
        ram: laptop.ram,
        storage: laptop.storage,
        screen: laptop.screen,
        price: laptop.price,
        description: laptop.description,
        id: id,
      });
    }
  });
});

app.post("/update/:id", (req, res) => {
  var id = req.params.id;
  Laptop.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      cpu: req.body.cpu,
      ram: req.body.ram,
      storage: req.body.storage,
      screen: req.body.screen,
      price: req.body.price,
      description: req.body.description,
    },
    (error, updateLaptop) => {
      if (error) {
        console.log("Couldn't update game");
        console.log(error);
      } else {
        res.redirect("/list");
        console.log("Updated Laptop data" + updateLaptop);
      }
    }
  );
});

//details Page

app.get("/:id", (req, res) => {
  var id = req.params.id;
  Laptop.findById(id, (error, foundLaptop) => {
    if (error) {
      console.log("Could'nt find the game with that id.");
    } else {
      console.log(foundLaptop);
      res.render("details", {
        laptopList: foundLaptop,
      });
    }
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
