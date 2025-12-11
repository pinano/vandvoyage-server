import mongoose from "mongoose";
import "dotenv/config";

const { DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

const connectionString = `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_URL}/${DATABASE_NAME}?authSource=admin`;

console.log(`Connecting to database at: ${DATABASE_URL}`); // Un log para ver si falla la URL

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "database connection error:"));
db.once("open", function () {
    console.log(`You are now connected to: ${DATABASE_NAME}`);
});
