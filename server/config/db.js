const mongoose = require("mongoose");
const connectDB = async () => {
  const dbURI = process.env.DATABASE;
  if (!dbURI) {
    console.error("❌ DATABASE URI not found in .env file");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Database Connection Failed");
    console.error("Reason:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
