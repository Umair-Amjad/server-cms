const express = require("express");
const cors = require("cors");
const router = express.Router();
const date = require("date-and-time");

router.use(cors());
var con = require("../../db/Db_connection");
const PaidMail = require("../utils/PaidEmail");
const { verifyToken } = require("../Middleware/Jwt");
const SendSms = require("../utils/SendSMS");

router.get("/fee/dataget", verifyToken, (req, res) => {
  const Tokendata = { user: { id: req.userId, institute_name: req.institute } };

  const params = req.query;

  const sqlinsert = `SELECT stu.*, c.className,stu.F_phone, sec.name as secname,stu.email as Email, sec.id as sectId, FEE.balance as balance, FEE.paid as Paid FROM students stu LEFT JOIN class c ON stu.classid = c.id LEFT JOIN sections sec ON stu.sectionid = sec.id LEFT JOIN feecollection FEE ON stu.rollno=FEE.rollno AND stu.classid=FEE.classid AND stu.sectionid=FEE.sectionid WHERE stu.classid=${params.classid} AND stu.sectionid=${params.sectionid}  AND stu.status=1 AND stu.CollegeID=${Tokendata.user.id} `;
  console.log(sqlinsert)
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    // console.log(sqlinsert);
    const result2 = JSON.parse(JSON.stringify(result));
    const output = result2.reduce((acc, current) => {
      // console.log(acc);
      const {
        id,
        name,
        Paid,
        balance,
        secname,
        className,
        Balance,
        F_phone,
        discount,
        classid,
        rollno,
        email,
        sectId,
      } = current;
      const previousRecord = acc[id];
      if (typeof previousRecord === "object") {
        return {
          ...acc,
          [id]: {
            ...previousRecord,
            secname,
            className,
            sectId,
            rollno,
            F_phone,
            email,
            classid,
            discount: discount,
            Paid: previousRecord.Paid + Paid,
            Balance: previousRecord.Balance - Paid,
          },
        };
      } else {
        return {
          ...acc,
          [id]: {
            id,
            name,
            secname,
            className,
            classid,
            email,
            sectId,
            rollno,
            F_phone,
            TotalFee: Balance,
            Paid: Paid,
            discount: discount,
            Balance: Balance - discount - Paid,
          },
        };
      }
    }, {});
    res.send(output);
  });
});

router.post("/fee/collecetion", verifyToken, async (req, res) => {
  const Tokendata = { user: { id: req.userId, institute_Name: req.institute ,email:req.email} };

  const Fee = req.body;
  const RemaingFee=Fee.balance-Fee.paid
  console.log("umair",RemaingFee)
  var chars = "0123456789";
  var InvoiceLength = 8;
  var InvoiceNumber = "";
  for (var i = 0; i <= InvoiceLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    InvoiceNumber += chars.substring(randomNumber, randomNumber + 1);
  }
  // console.log(InvoiceNumber);
  const d = date.format(new Date(Fee.date), "YYYY/MM/DD");
  const sqlinsert = `INSERT INTO feecollection (rollno ,name, classid, sectionid, feetype, payduration, totalfee, balance, paid, date,InvoiceNumber,paymethod, detail,DeleteFee) VALUES ('${Fee.rollno}','${Fee.name}','${Fee.class}','${Fee.sectId}','${Fee.feetype}','${Fee.payduration}','${Fee.totalFee}','${Fee.balance}','${Fee.paid}','${d}','${InvoiceNumber}','${Fee.paymethod}','${Fee.detail}','${Fee.status}') `;
  await PaidMail({
    paid: req.body.paid,
    RollNo: req.body.rollno,
    RemaingFee: RemaingFee,
    Balance:req.body.balance,
    Date:req.body.date,
    email:req.body.email,
    Collegeemail:Tokendata.user.email,
    School:Tokendata.user.institute_Name,
    Type:req.body.feetype,
  });
  await SendSms({
    institute_Name: Tokendata.user.institute_Name,
    paid: req.body.paid,
    RemaingFee: RemaingFee,
    contactNo: req.body.F_phone,
  });
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ message: "Fee Collected Successfully" });
  });
});

router.get("/single/:rollno", verifyToken, (req, res) => {
  const Tokendata = { user: { id: req.userId, institute_name: req.institute } };

  const feeSingleDate = req.params;
  const sqlinsert = `SELECT fee.* FROM  feecollection fee LEFT JOIN students stu ON fee.rollno=stu.rollno WHERE fee.rollno=${feeSingleDate.rollno} AND fee.DeleteFee=1 AND stu.CollegeId=${Tokendata.user.id}`;
  console.log(sqlinsert);
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    // var st={status:"paid"}
    // const data={...result,...st}
    // Object.assign(result,st)
    // res.send(result["status"]=["paid"])
    res.send(result);
  });
});

router.get("/datewaise/transection", verifyToken, (req, res) => {
  const Tokendata = { user: { id: req.userId, institute_name: req.institute } };

  const dates = req.query;
  const sd = date.format(new Date(dates.startDate), "YYYY/MM/DD");
  const ed = date.format(new Date(dates.endDate), "YYYY/MM/DD");
  console.log(sd, ed);

  const sqlinsert = `SELECT fee.id,st.phone,fee.balance,fee.rollno,st.name AS name,fee.feetype,st.fname as fatherName,fee.paid,fee.InvoiceNumber,fee.paymethod,sec.name as section,cl.className as class,fee.date  FROM feecollection fee
  left join sections sec on fee.sectionid=sec.id left join class cl on fee.classid=cl.id left join students st on fee.rollno=st.rollno  WHERE date BETWEEN "${sd}" AND "${ed}" AND fee.DeleteFee=1 AND st.status=1 AND st.CollegeID=${Tokendata.user.id} group by fee.id`;
  // return
  console.log(sqlinsert);
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
router.delete("/datewaise/transection/:id", verifyToken, (req, res) => {
  const Tokendata = { user: { id: req.userId, institute_name: req.institute } };

  const ID = req.params.id;
  console.log(ID);
  const sqlinsert = ` UPDATE  feecollection SET DeleteFee=0 where id=${ID}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ message: "Fee Recipt Deleted", status: 200 });
  });
});
module.exports = router;
