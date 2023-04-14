const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

var con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");
const upload = require("../multer/multer");

router.get("/teachers/api", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  // res.send('result2');
  const sqlinsert = `SELECT
    teac.*,
    CASE WHEN teac.Role = 1 THEN 'Teacher' WHEN teac.Role = 2 THEN 'Staff' WHEN teac.Role = 3 THEN 'Accounts' ELSE "Other's" END AS Roles,
    CASE WHEN teac.marital_status = 1 THEN 'Single' WHEN teac.marital_status = 2 THEN 'Married' WHEN teac.marital_status = 3 THEN 'Widow' ELSE "Other's" END AS 'maritalStatus'
FROM
    teachers teac
WHERE
  teac.activation_status=1 AND teac.CollegeID=${data.user.id}`;
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.post("/addupdate",upload.single("photo"), (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };
  console.log("boody",req.body)
  const { filename } = req.file;

// console.log(filename)
// return

  if (req.body.id !== "") {
    const sqlinsert = `UPDATE teachers SET staff_id="${req.body.staffid}",avatar="${filename}", Role=${req.body.role},first_name="${req.body.firstName}", gender="${req.body.gender}",father_name='${req.body.fname}',mother_name='${req.body.motherName}' ,qualification='${req.body.qualification}',work_experience='${req.body.workExperince}',work_shift='${req.body.workShift}',epf_no='${req.body.epfNo}',dob="${req.body.dob}",date_of_joining=${req.body.joningDate},contract="${req.body.contractType}",CNIC_No=${req.body.CNIC},location='${req.body.location}',payscall='${req.body.payScal}',phone="${req.body.phone}",email="${req.body.email}",basic_salery=${req.body.baiscSalery},zipCode=${req.body.zipcode},address1="${req.body.address1}",address2="${req.body.address2}",Per_address="${req.body.permanentAddress}" WHERE id="${req.body.id}"`;
    // res.send(sqlinsert)
    // return
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } else {
    const teachers = req.body;
    const sqlinsert = `INSERT INTO teachers (id,staff_id,Role,avatar,first_name,father_name,mother_name,email,gender,dob,date_of_joining,phone,marital_status,CNIC_No,qualification,work_experience,address1,address2,Per_address,epf_No,basic_salery,work_shift,contract,location,payscall,zipCode,activation_status,CollegeID) VALUES (NULL,${teachers.staffid},${teachers.role},"${filename}",'${teachers.firstName}','${teachers.fname}','${teachers.motherName}','${teachers.email}','${teachers.gender}','${teachers.dob}','${teachers.joningDate}',${teachers.phone},${teachers.maritalStatus},${teachers.CNIC},'${teachers.qualification}','${teachers.workExperince}','${teachers.address1}','${teachers.address2}','${teachers.permanentAddress}','${teachers.epfNo}',${teachers.baiscSalery},'${teachers.workShift}','${teachers.contractType}','${teachers.location}','${teachers.payScal}',${teachers.zipcode},1,${data.user.id})`;
    console.log("add", sqlinsert);

    con.query(sqlinsert, (err, result) => {
      // console.log("result", result);

      res.send({ message: "Teacher Record Successfully Added" });
      console.log("err", err);
    });
  }
});

router.put("/delete", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const Id = req.body.data.id;
  console.log(Id);
  const sqlinsert = `UPDATE teachers SET activation_status=0  WHERE id IN  (${Id})`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
module.exports = router;
