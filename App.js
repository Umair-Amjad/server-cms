require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cool=require("cool-ascii-faces")
const cors = require("cors");
const app = express();
const PORT = process.env.PORT ||8000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const errorMiddleware = require("./controler/Middleware/ErrorHandler");
const student = require("./controler/Studenets/Students");
const StudentPromtions = require("./controler/Studenets/StudentPromtion");
const teacher = require("./controler/teachers/Teachers");
const transport = require("./controler/transport/Transport");
const room = require("./controler/class/Class");
const books = require("./controler/subjects/subject");
const attendence = require("./controler/attendence/Attendence");
const Fee = require("./controler/feeManagment/Fee");
const Exams = require("./controler/Exams/Exams");
const Finance = require("./controler/Finance/Finance");
const Auth = require("./controler/auth/Auth");

// Routing
app.use("/list", student);
app.use("/promtion", StudentPromtions);
app.use("/books", books);
app.use("/teacher", teacher);
app.use("/fee", Fee);
app.use("/tranport", transport);
app.use("/class", room);
app.use("/attendence", attendence);
app.use("/exams", Exams);
app.use("/finance", Finance);
app.use("/register", Auth);
app.use("/uploads", express.static("./uploads"));
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/cool", (req, res) => {
  res.send(cool());
});

// app.use((err, req, res, next) => {
//   // console.log(err);
//   err.statusCode = err.statusCode || 404;
//   err.message = err.message || "Internal Server Error";
//   res.status(err.statusCode).json({
//     message: err.message,
//   });
// });

// app.use(errorMiddleware)

// app.use((req, res, next) => {
//   const error = new Error("Not found");
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });
const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is listen at port ${PORT}`);
    });
  } catch {
    console.log("server error");
  }
};

start();
