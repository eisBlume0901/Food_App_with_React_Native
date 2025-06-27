import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { userFavoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import { job } from "./config/cron.js";

const app = express();
const PORT = ENV.PORT;

if (ENV.NODE_ENV == "production") {
    job.start();
}

app.use(express.json());

app.get("/api/fallback", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "This is a fallback route. The server is running smoothly!"
    })
});

app.get("/api/favorites/:userId", async (req, res) => {
    try {

        const { userId } = req.params;

        const userFavorites = await db
        .select()
        .from(userFavoritesTable)
        .where( eq(userFavoritesTable.userId, userId) );

        return res.status(200).json({
            success: true,
            favorites: userFavorites,
            message: "Fetched your favorites successfully!"
        })


    } catch(error) {
        console.log("Error fetching favorites:", error);
        res.status(500).json({
            success: false,
            message: "Oops! Something went wrong while fetching your favorites",
        })
    }
})

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
            message: "Oops! Something went wrong while adding to favorites",
        })
    }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params;

        const favorite = await db
        .delete(userFavoritesTable)
        .where
        (
            and
            ( 
                eq(userFavoritesTable.userId, userId), 
                eq(userFavoritesTable.recipeId, parseInt(recipeId))
            )
        );

        return res.status(200).json({
            success: true,
            message: "Deleted a favorite successfully!"
        })

    } catch(error) {
        console.log("Error removing a favorite:", error);
        res.status(500).json({
            success: false,
            message: "Oops! Something went wrong while removing a favorite",
        });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
});

