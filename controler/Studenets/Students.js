const express = require("express");
const cors = require("cors");
const router = express.Router();

router.use(cors());

var con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");
const upload = require("../multer/multer");
const AsyncError = require("../Middleware/AsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
//Student API
router.get(
  "/search",
  verifyToken,
  AsyncError(async (req, res, next) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    try {
      // res.send("hello")
      const sqlinsert = `SELECT stu.*,stu.student_image, sec.name as section ,cl.className as class ,
    CASE
  WHEN stu.status=1 THEN 'active'
  WHEN stu.status=2 THEN 'notactive'
END as "status"
  FROM students  stu LEFT JOIN sections sec ON stu.sectionid=sec.id LEFT JOIN class cl ON stu.classid=cl.id WHERE stu.status=1 AND stu.CollegeID=${data.user.id}`;
      con.query(sqlinsert, (err, result) => {
        const result2 = JSON.stringify(result);
        console.log(result2);
        res.status(200).send(result2);
        // res.send(result2);
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);
router.get(
  "/list",
  verifyToken,
  AsyncError(async (req, res, next) => {
    const { yearid=new Date().getFullYear() } = req.query;
    const data = { user: { id: req.userId, institute_name: req.institute } };
    try {
      // res.send("hello")
      const sqlinsert = `SELECT stu.*,stu.student_image, sec.name as section ,cl.className as class ,
    CASE
  WHEN stu.status=1 THEN 'active'
  WHEN stu.status=2 THEN 'notactive'
END as "status"
 
  FROM students  stu LEFT JOIN sections sec ON stu.sectionid=sec.id LEFT JOIN class cl ON stu.classid=cl.id WHERE YEAR(stu.admissiondate)='${yearid}' AND stu.status=1 AND stu.CollegeID=${data.user.id}`;
      con.query(sqlinsert, (err, result) => {
        console.log(sqlinsert);
        const result2 = JSON.stringify(result);
        res.send(result2);
      });
    } catch (err) {
      return next(new ErrorHandler(err, 500));
    }
  })
);

router.get(
  "/total",
  verifyToken,
  AsyncError(async (req, res, next) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    try {
      const obj = {
        studentCount: 0,
        teacherCount: 0,
        transportCount: 0,
        totalPaid: 0,
        totalBalance: 0,
      };
      const sqlinsert = `SELECT count(*) as total FROM students WHERE status=1 AND CollegeID=${data.user.id}`;
      con.query(sqlinsert, (err, result) => {
        obj.studentCount = result[0].total;
        const sqlinsert2 = `SELECT count(*) as total1 FROM teachers WHERE activation_status=1 AND CollegeID=${data.user.id}`;
        con.query(sqlinsert2, (err, result) => {
          obj.teacherCount = result[0].total1;
          const sqlinsert3 = `SELECT count(*) as total2 FROM transport WHERE status=1 AND CollegeID=${data.user.id}`;
          con.query(sqlinsert3, (err, result) => {
            obj.transportCount = result[0].total2;
            const sqlinsert4 = `SELECT SUM(Balance) as Balance FROM students WHERE status=1 AND CollegeID=${data.user.id}`;
            con.query(sqlinsert4, (err, result) => {
              obj.totalBalance = result[0].Balance;
              const sqlinsert5 = `SELECT SUM(fee.paid) as PaidBalance FROM feecollection fee LEFT JOIN students st ON fee.rollno=st.rollno WHERE fee.DeleteFee=1 AND st.CollegeID=${data.user.id}`;
              con.query(sqlinsert5, (err, result) => {
                obj.totalPaid = result[0].PaidBalance;
                res.send(obj);
              });
            });
          });
        });
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

router.post(
  "/addupdate",
  verifyToken,
  upload.single("photo"),
  AsyncError(async (req, res, next) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    const { filename } = req.file;
    const admission = req.body;
    try {
      const file = req.file;
      if (!file) {
        return next(new ErrorHandler("No file uploaded.", 404));
      }
      var chars = "0123456789";
      var InvoiceLength = 8;
      var InvoiceNumber = "";
      for (var i = 0; i <= InvoiceLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        InvoiceNumber += chars.substring(randomNumber, randomNumber + 1);
      }
      // return
      if (admission.id !== "") {
        const sqlinsert = `UPDATE students SET name="${admission.firstName}",fname="${admission.fname}",student_image='${filename}',studentCNIC=${admission.studentCNIC},faccupation="${admission.foccupation}",dob="${admission.dob}",father_CNIC=${admission.fatherCNIC},gender='${admission.gender}',rollno=${admission.rollno},gender="${admission.gender}",sectionid=${admission.sectionid},religion="${admission.religion}",admissiondate="${admission.admissiondate}",phone=${admission.phone},email="${admission.email}",address1="${admission.address1}",address2="${admission.address2}",permanent_adress='${admission.permanentAddress}',discount=${admission.discount},classid=${admission.classid},Balance=${admission.balance} WHERE id="${admission.id}"`;
        // res.send(sqlinsert)
        con.query(sqlinsert, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      } else {
        const sqlinsert = `INSERT INTO students (id,name,student_image,studentCNIC,fname,faccupation,fdesignation,FatherMonthly_income,Relation_with_father,f_Email,father_CNIC,F_phone,dob,rollno,gender,sectionid,religion,addid,admissiondate,phone,email,address1,address2,zipcode,discount,permanent_adress,classid,Balance,CollegeID,status) VALUES (NULL,'${admission.firstName}','${filename}',${admission.studentCNIC},'${admission.fname}','${admission.foccupation}','${admission.designation}',${admission.monthlyIncome},'${admission.relation}','${admission.f_Email}',${admission.fatherCNIC},${admission.fatherPhoneNumer},'${admission.dob}',${admission.rollno},'${admission.gender}',${admission.sectionid},'${admission.religion}',${InvoiceNumber},'${admission.admissiondate}',${admission.phone},'${admission.email}','${admission.address1}','${admission.address2}',${admission.zipcode},${admission.discount},'${admission.permanentAddress}',${admission.classid},${admission.balance},${data.user.id},1)`;

        con.query(sqlinsert, (error, result) => {
          if (error) throw error;
          res.status(200).send("record successfully inserted");
        });
      }
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

router.get(
  "/Collection",
  verifyToken,
  AsyncError(async (req, res, next) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    try {
      const sqlinsert = `SELECT gender, count(*) as total FROM students WHERE status=1 AND CollegeID=${data.user.id} GROUP By gender`;
      con.query(sqlinsert, (er, result) => {
        const result2 = JSON.stringify(result);
        res.send(result2);
      });
    } catch (err) {
      return next(new ErrorHandler(er.message, 500));
    }
  })
);

router.get(
  "/Collection/graph",
  verifyToken,
  AsyncError(async (req, res, next) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    try {
      const id = req.query;
      console.log(id.yearid);
      const sqlinsert = `SELECT
  SUM(paid) AS montlyPaidGrapgh,
  YEAR(DATE) AS YEAR,
  MONTH(DATE) AS month
FROM
    feecollection
     LEFT JOIN students st ON feecollection.rollno=st.rollno
  WHERE YEAR(DATE) =${id.yearid} AND DeleteFee=1 AND st.CollegeID=${data.user.id}
  
GROUP BY
    YEAR(DATE),
    MONTH(DATE)
  ORDER BY
      YEAR(DATE),
    MONTH(DATE) `;

      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
        console.log(sqlinsert);
        //  return;
        const result2 = JSON.stringify(result);
        res.send(result2);
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

router.get(
  "/Collection/graphs",
  verifyToken,
  AsyncError(async (req, res, next) => {
    const id = req.query;
    try {
      const sqlinsert = `SELECT
  SUM(paid) AS montlyPaidGrapgh,
  YEAR(DATE) AS YEAR,
  MONTH(DATE) AS month
  FROM
  feecollection
  WHERE YEAR(DATE) =${id.yearid}
  GROUP BY
  YEAR(DATE),
  MONTH(DATE)
  ORDER BY
  YEAR(DATE),
  MONTH(DATE) `;
      con.query(sqlinsert, (er, result) => {
        const result2 = JSON.stringify(result);
        res.send(result2);
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

router.get(
  "/studentTransection/:rollno",
  verifyToken,
  AsyncError(async (req, res, next) => {
    //we need to check sum of fee at one column this is error check it leter
    const data = { user: { id: req.userId, institute_name: req.institute } };
    try {
      const Report = req.params.rollno;
      const sqlinsert = `SELECT fee.*,st.Balance,st.discount,st.id as StudentID ,SUM(fee.paid)as paid FROM feecollection fee LEFT JOIN students st ON fee.rollno=st.rollno WHERE fee.rollno=${Report} AND  CollegeID=${data.user.id} `;
      console.log(sqlinsert);
      con.query(sqlinsert, (err, result) => {
        if (err) throw new Error();
        res.send(result);
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);
router.put(
  "/del",
  verifyToken,
  AsyncError(async (req, res, next) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    try {
      const Id = req.body.data.id;
      const sqlinsert = `UPDATE students SET status=0  WHERE id IN (${Id})  AND  CollegeID=${data.user.id}`;
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  })
);
module.exports = router;
