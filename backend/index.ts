import express, {Express} from "express";
import cors from "cors";
const app:Express = express();
const port: number = +process.env.PORT! || 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, ExpressTS!");
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port : ${port}`);
});