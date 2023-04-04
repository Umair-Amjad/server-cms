const express = require("express");
const router = express.Router();
const cors = require("cors");
router.use(cors());

var con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");

router.get("/session",verifyToken, (req, res) => {
  const sqlinsert = `SELECT * FROM sessions WHERE 1 `;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/StudentData",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const allStudent = req.query;
  const sqlinsert = `SELECT st.*,cl.className,sec.name as section FROM students st LEFT JOIN class cl ON st.classid=cl.id LEFT JOIN sections sec ON st.sectionid=sec.id WHERE classid=${allStudent.classid} AND sectionid=${allStudent.sectionid} AND st.status=1 AND st.CollegeID=${data.user.id}`;
  console.log(sqlinsert)
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post("/student-insert",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const StudentPromotionCopy = req.body;
  StudentPromotionCopy.studentDatacopy.forEach((element) => {
    console.log(element);
    if (element.pass_Fail == 1) {
      const sqlinsert = `UPDATE students SET status=0 WHERE id="${element.Student_id}" AND CollegeID=${data.user.id}`;
      // res.send(sqlinsert)
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
      });
    }
    if (element.pass_Fail == 1) {
      console.log("khan")
      const sqlinsert = `INSERT INTO students (id,name,studentCNIC,fname,faccupation,fdesignation,FatherMonthly_income,Relation_with_father,f_Email,father_CNIC,F_phone,dob,rollno,gender,sectionid,religion,addid,admissiondate,phone,email,address1,address2,zipcode,permanent_adress,classid,Balance,CollegeID,status) VALUES (NULL,'${element.student_name}',${element.studentCNIC},'${element.father_name}','${element.faccupation}','${element.fdesignation}',${element.FatherMonthly_income},'${element.Relation_with_father}','${element.f_Email}',${element.father_CNIC},${element.F_phone},'${element.dob}',${element.rollno},'${element.gender}',${StudentPromotionCopy.sectionid},'${element.religion}',${element.addmissionid},'${element.addmissionDate}',${element.phone},'${element.email}','${element.address1}','${element.address2}',${element.zipcode},'${element.permanent_adress}',${StudentPromotionCopy.classid},${element.balance},${data.user.id},1)`;
      con.query(sqlinsert, (error, result) => {
        if (error) throw error;
        // console.log("resu", result);
        // res.send("record successfully inserted");
        // console.log(error);
      });
    }
  });
  res.send("result");

});
module.exports = router;
