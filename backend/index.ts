import express, {Express} from "express";
import cors from "cors";

import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";

const app:Express = express();
const port:number = +process.env.PORT! || 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/comment",commentRouter);

app.get("/", (req, res) => {
  res.send("Hello, ExpressTS!");
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port : ${port}`);
});