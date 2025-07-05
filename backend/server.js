import express, { response } from 'express';
import cors from 'cors';



// app config
const app = express();
const PORT = 4000

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});