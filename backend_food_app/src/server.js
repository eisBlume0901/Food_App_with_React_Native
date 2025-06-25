import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { userFavoritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());


app.get("/api/health/", (req, res) => {
    res.status(200).json({
        success: true
    })
});

app.post("/api/favorites", async (req, res) => {

    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title) {
            return res.status(400).json({ error: "Missing required fields"});
        }

        const newFavorite = await db
        .insert(userFavoritesTable)
        .values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        })
        .returning();

        return res.status(201).json({
            success: true,
            message: "Added to your favorites successfully!",
        })
    } 
    catch (error) {
        console.log("Error adding to favorites:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while adding to favorites",
        })
    }
});

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
});

