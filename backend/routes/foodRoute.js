import express from 'express';
import { listFood, addFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foodRouter = express.Router();

// image storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

foodRouter.get('/list', listFood);
foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.post('/remove', removeFood);

export default foodRouter;
