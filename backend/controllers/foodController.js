import foodModel from "../models/foodModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// add food
const addFood = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// update food
const updateFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        const updateData = {
            name: req.body.name || food.name,
            description: req.body.description || food.description,
            price: req.body.price ? Number(req.body.price) : food.price,
            category: req.body.category || food.category,
        };

        // If a new image was uploaded, delete old one and update
        if (req.file) {
            const oldImagePath = path.join(__dirname, '../uploads', food.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.log("Old image delete error:", err.message);
            });
            updateData.image = req.file.filename;
        }

        await foodModel.findByIdAndUpdate(req.body.id, updateData);
        res.json({ success: true, message: "Food Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }
        const imagePath = path.join(__dirname, '../uploads', food.image);
        fs.unlink(imagePath, (err) => {
            if (err) console.log("Image delete error:", err.message);
        });

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { listFood, addFood, updateFood, removeFood }