const express= require('express')
const cors = require("cors");

const app = express();

const port =8000;

app.use(express.json());
app.use(cors());
const student=require("./controler/Studenets/Students");
const teacher=require("./controler/teachers/Teachers");
const transport=require("./controler/transport/Transport");
const room=require("./controler/class/Class")
const books = require("./controler/subjects/subject");
const attendence=require("./controler/attendence/Attendence")
const Fee = require("./controler/feeManagment/Fee");

// Routing  
app.use(`/list`, student);
app.use('/teacher',teacher);
app.use('/tranport',transport);
app.use("/class", room);
app.use("/books", books);
app.use("/attendence", attendence);
app.use("/fee", Fee);

app.get("/", (req, res) => {
  res.send("Hello!");
});



app.listen(port,()=>{
    console.log(`Server is listen at port ${port}`)
})