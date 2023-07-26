const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

const con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");
const upload = require("../multer/multer");

// student complains

router.get("/complaints", (req, res) => {
  // const sqlinsert = `SELECT comp.*,st.name, CASE WHEN comp.category=1 then 'Academic Issues' WHEN comp.category=2 then 'Behavior Issues' WHEN comp.category=3 then 'Harassment or Bullying' WHEN comp.category=4 then 'Safety Issues' END as 'complainCategory', CASE WHEN comp.compaintstatus=1 Then 'Pending' WHEN comp.compaintstatus=0 Then 'Completed' END as 'status' from complaints comp LEFT JOIN students st on comp.complained_against=st.id where comp.CollegeID=1`;
  const sqlinsert = `SELECT comp.*,st.name,GROUP_CONCAT(st.name SEPARATOR ', ') AS concatenated_values, CASE WHEN comp.category=1 then 'Academic Issues' WHEN comp.category=2 then 'Behavior Issues' WHEN comp.category=3 then 'Harassment or Bullying' WHEN comp.category=4 then 'Safety Issues' END as 'complainCategory', CASE WHEN comp.compaintstatus=1 Then 'Pending' WHEN comp.compaintstatus=0 Then 'Completed' END as 'status' from complaints comp LEFT JOIN students st on comp.complained_against=st.id where comp.CollegeID=1  GROUP BY complaint_no `;
  con.query(sqlinsert, (err, result) => {
    // res.send(result);
    // const data = [
    //   { id: 1, value: "A" },
    //   { id: 1, value: "B" },
    //   { id: 2, value: "C" },
    //   { id: 2, value: "D" },
    // ];

    // const concatenatedData = {};

    // data.forEach((obj) => {
    //   if (!concatenatedData[obj.id]) {
    //     concatenatedData[obj.id] = obj.value;
    //   } else {
    //     concatenatedData[obj.id] += ", " + obj.value;
    //   }
    // });

    // console.log(concatenatedData);
    res.status(200).send(result);
  });
});

router.post("/complaits", verifyToken, upload.single("photo"), (req, res) => {
  const TokenID = { user: { id: req.userId, institute_name: req.institute } };
  console.log(req.body);
  const data = JSON.parse(req.body.ComplaintAgaint);
  const data2 = data.id.split(",");

  console.log("umair");
  const { filename } = req.file;

  console.log(req.file);
  const file = req.file;
  // if (!file) {
  //   return res.json("No file uploaded.");
  // }
  data2.forEach((element) => {
    console.log(element);
    const sqlinsert = `INSERT INTO complaints (id, complaint_no, image, title, description, date, complain_by, complained_against,category,compaintstatus, CollegeID) VALUES (NULL, '${req.body.ComplaintNo}', '${filename}', '${req.body.names}', '${req.body.description}', '${req.body.date}', '${req.body.Complaintby}', '${element}', ${req.body.category},'1', '${TokenID.user.id}')`;
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      // res.setHeader("Content-Type", "text/plain");
      res.status(200).send(result);
    });
  });
});



router.put("/complaints-resove",(req,res)=>{
  const ID=req.body.cNumber
  console.log(ID)
  const sqlinsert = `UPDATE complaints SET compaintstatus=0 WHERE complaint_no IN (${ID})`;
  console.log(sqlinsert)
  con.query(sqlinsert,(err,result)=>{
    if(err) throw err;
    res.status(200).send("thnand")
  })
});

//Teacher complains


module.exports = router;
