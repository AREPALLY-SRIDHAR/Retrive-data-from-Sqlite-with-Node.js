const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let database = null;

const install = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`error=========${error.message}`);
    process.exit(1);
  }
};

install();

const convert = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const getQuery = `SELECT * FROM movie`;
  const array = await database.all(getQuery);
  response.send(array.map((each) => ({ movieName: each.movie_name })));
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  try {
    const postQuery = `
    INSERT INTO 
       movie ( director_id, movie_name, lead_actor) 
    VALUES
      (${directorId},'${movieName}','${leadActor}');`;
    await database.run(postQuery);
    response.send("Movie Added Successfully");
  } catch (error) {
    console.log(`======${error.message}`);
  }
});

module.exports = app;
