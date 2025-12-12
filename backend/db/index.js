import mongoose from "mongoose";
import "dotenv/config";

const { DATABASE_URL, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

// Detectar si es MongoDB local (Docker) o Atlas (Cloud)
// Si DATABASE_URL incluye un puerto (ej: mongo:27017), es local
// Si no incluye puerto (ej: cluster.mongodb.net), es Atlas
const isLocalMongo = DATABASE_URL.includes(':27017');

let connectionString;
if (isLocalMongo) {
    // MongoDB local (Docker)
    connectionString = `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_URL}/${DATABASE_NAME}?authSource=admin`;
    console.log(`Connecting to local MongoDB at: ${DATABASE_URL}`);
    console.log(`Full connection string (hidden password): mongodb://${DATABASE_USER}:****@${DATABASE_URL}/${DATABASE_NAME}`);
} else {
    // MongoDB Atlas (Cloud)
    connectionString = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_URL}/${DATABASE_NAME}?retryWrites=true&w=majority`;
    console.log(`Connecting to MongoDB Atlas at: ${DATABASE_URL}`);
    console.log(`Full connection string (hidden password): mongodb+srv://${DATABASE_USER}:****@${DATABASE_URL}/${DATABASE_NAME}`);
}

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    const dbType = isLocalMongo ? 'Local MongoDB' : 'MongoDB Atlas';
    console.log(`✅ Successfully connected to ${dbType}: ${DATABASE_NAME}`);
})
.catch((err) => {
    console.error("❌ MongoDB connection error:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("\nPossible causes:");
    console.error("1. Check your credentials (user/password)");
    console.error("2. Check if your IP is whitelisted in MongoDB Atlas");
    console.error("3. Check if the database cluster is active");
    console.error("\nFull error:", err);
});

const db = mongoose.connection;
db.on("error", (err) => {
    console.error("Database connection error:", err);
});
db.once("open", function () {
    console.log(`You are now connected to: ${DATABASE_NAME}`);
});
