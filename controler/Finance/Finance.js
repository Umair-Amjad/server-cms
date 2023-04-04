const express = require("express");
const router = express.Router();
const cors = require("cors");
const date = require("date-and-time");
router.use(cors());

var con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");

router.post("/expresneList",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const expenseData = req.body;
  console.log(expenseData);
  // return;
// checck teacher salery in payroll.jsx
  const d = date.format(new Date(expenseData.date), "YYYY/MM/DD");
  if (expenseData.id !== "") {
    const sqlinsert = `UPDATE expenselist set date='${d}',name='${expenseData.name}',payMethod=${expenseData.paymethod},expenseHead='${expenseData.expenseHead}',description='${expenseData.description}',amount=${expenseData.amount} WHERE id=${expenseData.id}`;

    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      res.send("result");
    });
  } else {
    const sqlinsert2 = `INSERT INTO expenselist (id,date,name,payMethod,expenseHead,description,amount,status,CollegeID) VALUES(null,'${d}','${expenseData.name}','${expenseData.paymethod}','${expenseData.expenseHead}','${expenseData.description}','${expenseData.amount}',1,${data.user.id})`;
    con.query(sqlinsert2, (err, result) => {
      if (err) throw err;
      res.send("record successfully inserted");
    });
  }
});

router.get("/expesnseListData", verifyToken, (req, res) => {
  // console.log(req.body)
  // return
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert = `SELECT ex.*,teach.first_name AS teacherName,
  CASE
  WHEN ex.payMethod=1 THEN 'Bank'
  WHEN ex.payMethod=2 THEN 'Cash'
END as "cash", CASE
  WHEN ex.payMethod=1 THEN 'Bank'
  WHEN ex.payMethod=2 THEN 'Cash In Hand'
END as "account"
  FROM expenselist ex LEFT JOIN teachers teach ON  ex.name=teach.id where ex.status=1 AND ex.CollegeID=${data.user.id} GROUP BY ex.id`;
  con.query(sqlinsert, (err, result) => {
    res.send([...result])
//     const sqlinsert2 = `SELECT ex.*,  CASE
//   WHEN ex.payMethod=1 THEN 'Bank'
//   WHEN ex.payMethod=2 THEN 'Cash'
// END as "cash", CASE
//   WHEN ex.payMethod=1 THEN 'Bank'
//   WHEN ex.payMethod=2 THEN 'Cash In Hand'
// END as "account" from expenselist ex where status=1 GROUP BY ex.id`;
//     con.query(sqlinsert2, (err, result2) => {
//       res.send([...result, ...result2]);
//     });
    // res.send("hello")
  });
});
router.put("/expenseListDelete/:id", verifyToken, (req, res) => {
  const expenseData = req.params.id;
  console.log(expenseData)
  // return
  const sqlinsert = `UPDATE expenselist SET status=0 WHERE id=${expenseData}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.status(200).send({ message: "Data   Delete" });
  });
});


// salery list
router.get("/saleryList/:id",verifyToken,(req,res)=>{
  const ID=req.params.id
  const sqlinsert = `SELECT ex.*,teach.basic_salery as netSalery,DAY(ex.date) as Day,MONTHNAME(EX.date) as month,YEAR(ex.date) as year, teach.first_name AS teacherName,
  CASE
  WHEN ex.payMethod=1 THEN 'Bank'
  WHEN ex.payMethod=2 THEN 'Cash'
END as "cash", CASE
  WHEN ex.payMethod=1 THEN 'Bank'
  WHEN ex.payMethod=2 THEN 'Cash In Hand'
END as "account"
  FROM expenselist ex LEFT JOIN teachers teach ON  ex.name=teach.id where status=1 AND name=${ID}
  `;
  console.log(sqlinsert)
  con.query(sqlinsert,(err,result)=>{
    if(err) throw new Error("Something went wront")
    res.send([...result])
  })
})
// INCOME lIST API'S

router.get("/incomeList", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert = `SELECT inc.*,  CASE
  WHEN inc.payMethod=1 THEN 'Cash'
  WHEN inc.payMethod=2 THEN 'Bank'
END as "cash", CASE
  WHEN inc.payMethod=1 THEN 'Cash in hand'
  WHEN inc.payMethod=2 THEN 'Bank'
END as "account" from incomelist inc  WHERE status=1 AND CollegeID=${data.user.id}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.status(200).send(result);
  });
});
router.put("/incomeListDelete/:id", verifyToken, (req, res) => {
  const expenseData = req.params.id;
  // console.log(expenseData)
  // return
  const sqlinsert = `UPDATE  incomelist SET status=0 WHERE id=${expenseData}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.status(200).send({ message: "Data   Delete" });
  });
});

router.post("/incomePost", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const incomePost = req.body;
  // console.log(incomePost);
  // return;
  const d = date.format(new Date(incomePost.date), "YYYY/MM/DD");
  if (incomePost.id !== "") {
    const sqlinsert = `UPDATE incomelist set date='${d}',name='${incomePost.name}',payMethod=${incomePost.paymethod},expenseHead='${incomePost.expenseHead}',description='${incomePost.description}',amount=${incomePost.amount} WHERE id=${incomePost.id}`;

    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } else {
    const sqlinsert2 = `INSERT INTO incomelist (id,date,name,payMethod,expenseHead,description,amount,showStatus,CollegeID,status) VALUES(null,'${d}','${incomePost.name}','${incomePost.paymethod}','${incomePost.expenseHead}','${incomePost.description}','${incomePost.amount}',2,${data.user.id},1)`;
    con.query(sqlinsert2, (err, result) => {
      if (err) throw err;
      res.status(200).send("record successfully inserted");
    });
  }
});

// income statment

router.get("/income/statement", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const dateWiseReport = req.query;

  const sd = date.format(new Date(dateWiseReport.startDate), "YYYY/MM/DD");
  const ed = date.format(new Date(dateWiseReport.endDate), "YYYY/MM/DD");
  // console.log(dateWiseReport)
  // return
  const sqlinsert = `SELECT ex.*,teach.first_name AS teacherName FROM expenselist ex LEFT JOIN teachers teach ON  ex.name=teach.id  where  date BETWEEN "${sd}" AND "${ed}"  AND ex.status=1 AND ex.CollegeID=${data.user.id}`;
  console.log(sqlinsert);
  con.query(sqlinsert, (err, result) => {
    const sqlinsert2 = `SELECT * FROM incomelist  where  date BETWEEN "${sd}" AND "${ed}" AND status=1 AND CollegeID=${data.user.id}`;
    con.query(sqlinsert2, (err, result2) => {
      if(err) throw err;
      res.send([...result, ...result2]);
    });
  });
});
module.exports = router;
