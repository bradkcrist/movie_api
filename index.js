const express = require("express");
morgan = require("morgan");
const uuid = require("uuid");
const bodyParser = require("body-parser");
(fs = require("fs")), (path = require("path"));

const app = express();
app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "User1",
    favoriteMovie: [],
  },
  {
    id: 2,
    name: "User2",
    favoriteMovie: [],
  },
];

let movies = [
  {
    Title: "Hobbit",
    Plot: "A hobbit named Bilbo Baggins joins a crew of dwarves to reclaim there home on the Lonley Mountains.",
    Director: {
      Name: "Peter Jackson",
      Birth: "October 31 1961",
    },
    Genre: {
      Name: "Fantasy",
    },
  },
];

//Create
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("need user name");
  }
});

//Update
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user");
  }
});

//Create
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovie.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("no such movie");
  }
});

//Delete
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovie = user.filter(title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("failed to remove movie");
  }
});

//Delete
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user = users.filter(user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send(" failed to remove user");
  }
});

//Read
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//Read
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movies);
  } else {
    res.status(400).send("No movie");
  }
});

//Read
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No genre");
  }
});

//Read
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName);

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("No Director");
  }
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Code broke!");
});

app.listen(8080);
console.log("Your app is running on Port 8080.");
