import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

async function run() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not set in environment");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  try {
    // Ensure basic scalar fields exist
    const updates: Array<Promise<any>> = [];

    updates.push(
      User.updateMany(
        { phoneNumber: { $exists: false } },
        { $set: { phoneNumber: "" } },
      ),
    );
    updates.push(
      User.updateMany(
        { jobTitle: { $exists: false } },
        { $set: { jobTitle: "" } },
      ),
    );
    updates.push(
      User.updateMany(
        { location: { $exists: false } },
        { $set: { location: "" } },
      ),
    );
    updates.push(
      User.updateMany(
        { website: { $exists: false } },
        { $set: { website: "" } },
      ),
    );
    updates.push(
      User.updateMany({ bio: { $exists: false } }, { $set: { bio: "" } }),
    );
    updates.push(
      User.updateMany(
        { profilePhoto: { $exists: false } },
        { $set: { profilePhoto: "" } },
      ),
    );
    updates.push(
      User.updateMany({ points: { $exists: false } }, { $set: { points: 0 } }),
    );
    updates.push(
      User.updateMany({ badges: { $exists: false } }, { $set: { badges: [] } }),
    );

    // Ensure `name` exists using firstName/lastName when possible
    updates.push(
      User.updateMany({ name: { $exists: false } }, [
        {
          $set: {
            name: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ["$firstName", false] },
                    { $ifNull: ["$lastName", false] },
                  ],
                },
                { $concat: ["$firstName", " ", "$lastName"] },
                { $ifNull: ["$firstName", ""] },
              ],
            },
          },
        },
      ]),
    );

    const results = await Promise.all(updates);
    console.log("Migration results:");
    results.forEach((r, i) => console.log(i + 1, JSON.stringify(r)));

    console.log(
      "Backfill complete. You may want to restart the backend server.",
    );
  } catch (err) {
    console.error("Error during backfill:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
