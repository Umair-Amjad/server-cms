const express = require("express");
const cors = require("cors");
const router = express.Router();
const date = require("date-and-time");

router.use(cors());

var con = require("../../db/Db_connection");

router.get("/fee/dataget", (req, res) => {
  // [
  //   {
  //     id: 8,
  //     name: "Junaid",
  //     lname: "Ali",
  //     fname: "Tilawat khan",
  //     faccupation: "unknow",
  //     dob: "1995-12-31",
  //     rollno: 2,
  //     gender: "male",
  //     sectionid: "3",
  //     religion: "Cristion",
  //     addid: "12",
  //     admissiondate: "2022-09-27",
  //     phone: "0312 0914180",
  //     email: "uamjad508@gmail.com",
  //     address: "swabi main road, 12",
  //     classid: "8",
  //     Balance: 50000,
  //     className: "two",
  //     secname: "Section C",
  //     balance: 30000,
  //     Paid: 20000,
  //   },
  //   {
  //     id: 8,
  //     name: "Junaid",
  //     lname: "Ali",
  //     fname: "Tilawat khan",
  //     faccupation: "unknow",
  //     dob: "1995-12-31",
  //     rollno: 2,
  //     gender: "male",
  //     sectionid: "3",
  //     religion: "Cristion",
  //     addid: "12",
  //     admissiondate: "2022-09-27",
  //     phone: "0312 0914180",
  //     email: "uamjad508@gmail.com",
  //     address: "swabi main road, 12",
  //     classid: "8",
  //     Balance: 50000,
  //     className: "two",
  //     secname: "Section C",
  //     balance: 30000,
  //     Paid: 20000,
  //   },
  // ]
  const params = req.query;

  const sqlinsert = `SELECT
    stu.*,
    c.className,
    sec.name as secname,
    sec.id as sectId,
   FEE.balance as balance,
    FEE.paid as Paid
FROM
    students stu

LEFT JOIN class c ON stu.classid = c.id
LEFT JOIN sections sec ON stu.sectionid = sec.id
LEFT JOIN feecollection FEE ON stu.rollno=FEE.rollno
WHERE
  stu.classid=${params.classid} AND stu.sectionid=${params.sectionid}    
 `;
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.parse(JSON.stringify(result));

    const output = result2.reduce((acc, current) => {
      const {
        id,
        name,
        Paid,
        balance,
        secname,
        className,
        Balance,
        lname,
        classid,
        rollno,
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
            classid,
            lname,
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
            sectId,
            rollno,
            lname,
            TotalFee: Balance,
            Paid: Paid,
            Balance: Balance - Paid,
          },
        };
      }
    }, {});
    res.send(output);
  });
  return;
  const data = [
    //   ({
    //     id: "1",
    //     name: "Maya Mahardhani",
    //     payment_amount: 100,
    //     sku: "ST001802027",
    //     seq: "1",
    //   },
    //   {
    //     id: "1",
    //     name: "Maya Mahardhani",
    //     payment_amount: 50,
    //     sku: "ST000703044",
    //     seq: "2",
    //   }
    //  )
    {
      id: 8,
      name: "Junaid",
      rollno: 2,
      classid: "8",
      Balance: 50000,
      className: "two",
      secname: "Section C",
      balance: 50000,
      Paid: 20000,
    },
    {
      id: 8,
      name: "Junaid",
      rollno: 2,
      classid: "8",
      Balance: 30000,
      className: "two",
      secname: "Section C",
      balance: 30000,
      Paid: 1000,
    },
    {
      id: 8,
      name: "Junaid",
      rollno: 2,
      classid: "8",
      Balance: 29000,
      className: "two",
      secname: "Section C",
      balance: 29000,
      Paid: 1000,
    },
    {
      id: 8,
      name: "Junaid",
      rollno: 2,
      classid: "8",
      Balance: 28000,
      className: "two",
      secname: "Section C",
      balance: 28000,
      Paid: 10000,
    },
  ];
  const output2 = data.reduce((acc, current) => {
    const { id, name, Paid, balance, Balance } = current;
    const previousRecord = acc[id];
    if (typeof previousRecord === "object") {
      return {
        ...acc,
        [id]: {
          ...previousRecord,
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
          TotalFee: Balance,
          Paid: Paid,
          Balance: Balance - Paid,
        },
      };
    }
  }, {});
  res.send(output2);
  return;
});

router.post("/fee/collecetion", (req, res) => {
  const Fee = req.body;
  // console.log(Fee) 
  const d = date.format(new Date(Fee.date), "YYYY/MM/DD");
  const sqlinsert = `INSERT INTO feecollection (rollno ,name, classid, sectionid, feetype, payduration, totalfee, balance, paid, date,paymethod, detail) VALUES ('${Fee.rollno}','${Fee.name}','${Fee.class}','${Fee.sectId}','${Fee.feetype}','${Fee.payduration}','${Fee.totalFee}','${Fee.balance}','${Fee.paid}','${d}','${Fee.paymethod}','${Fee.detail}')`;

  con.query(sqlinsert, (err, result) => {
    console.log("result", result);
    if (err) throw err;
    res.send({ message: "Fee Collected Successfully" });
  });
});

router.get("/single/:rollno", (req, res) => {
  const feeSingleDate = req.params;
  console.log(feeSingleDate);
  const sqlinsert = `SELECT * FROM  feecollection WHERE rollno=${feeSingleDate.rollno}`;

  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    // var st={status:"paid"}
    // const data={...result,...st}
    // Object.assign(result,st)
    // res.send(result["status"]=["paid"])
    res.send(result);
  });
});



router.get("/datewaise/transection",(req,res)=>{
  const dates=req.query;
  const sd = date.format(new Date(dates.startDate), "YYYY/MM/DD");
  const ed = date.format(new Date(dates.endDate), "YYYY/MM/DD");
  console.log(sd, ed);

  const sqlinsert = `SELECT fee.rollno,fee.name,fee.paid,sec.name as section,cl.className as class FROM feecollection fee
  left join sections sec on fee.sectionid=sec.id
  left join class cl on fee.classid=cl.id

  
  WHERE date BETWEEN "${sd}" AND "${ed}"`;
  // res.send(sqlinsert);
  // return
  con.query(sqlinsert,(err,result)=>{
    if(err) throw err
    res.send(result)
  })
})




module.exports = router;
