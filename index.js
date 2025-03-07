import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error", err.stack));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// Helper function to ensure currentUserId is valid
async function ensureCurrentUserIdIsValid() {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [currentUserId]);
  if (result.rows.length === 0) {
    console.log(`User with ID ${currentUserId} not found. Falling back to a valid user.`);
    
    // Fallback to the first available user
    const fallbackResult = await db.query("SELECT id FROM users LIMIT 1");
    currentUserId = fallbackResult.rows[0]?.id || 2;  // Default to ID 2 if no users exist
  }
}

// Function to get the current user based on `currentUserId`
async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [currentUserId]);
  if (result.rows.length > 0) {
    return result.rows[0]; // Return the current user
  } else {
    console.log("User not found with ID:", currentUserId);
    return null; // Return null if no user is found
  }
}

async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries2 JOIN users ON users.id = user_id WHERE user_id = $1;", 
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  await ensureCurrentUserIdIsValid(); // Ensure the current user ID is valid
  
  // Get the list of countries visited by the current user
  const countries = await checkVisisted();

  // Fetch the current user from the database
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    // Handle the case where no user is found (maybe show a message or set a default)
    res.render("error.ejs", { message: "User not found!" });
    return;
  }

  // Fetch all users from the database to display in the app (you can use this in the dropdown or list)
  const allUsersResult = await db.query("SELECT * FROM users");

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: allUsersResult.rows,  // Use the users fetched from the database
    color: currentUser.color,
  });
});

// Adds the countries for a specific user
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser();

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries2 (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

// Resets the countries for a specific user
app.post("/reset", async (req, res) => {
  const currentUser = await getCurrentUser();  // Assuming you have a method to get the current user

  try {
    // Delete all entries for the current user
    await db.query(
      "DELETE FROM visited_countries2 WHERE user_id = $1",
      [currentUserId]  // Use the current user's ID
    );
    res.redirect("/");  // Redirect to the homepage or wherever you want
  } catch (err) {
    console.log(err);
  }
});

// ADD NEW USER
app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

// When adding a new user, make sure to update currentUserId after insertion
app.post("/new", async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  const result = await db.query(
    "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
    [name, color]
  );

  currentUserId = result.rows[0].id; // Set currentUserId to the new user's ID
  res.redirect("/");
});

// When removing a user, update currentUserId to fallback to a valid user:
app.post('/remove', async (req, res) => {
  const userToRemove = req.body.country.trim();  // Use 'country' instead of 'user' here

  if (!userToRemove) {
    return res.redirect("/");  // Make sure to redirect if no input is provided
  }

  // Delete the user from the database based on the name entered
  await db.query("DELETE FROM users WHERE name = $1;", [userToRemove]);

  // Update currentUserId to fallback to a valid user (e.g., the first user)
  const fallbackUser = await db.query("SELECT id FROM users LIMIT 1");
  currentUserId = fallbackUser.rows[0]?.id || 2; // Fallback to user with id = 2 if no users are found

  res.redirect('/'); // Redirect after removal
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

