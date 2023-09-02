const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

var con = require("../../db/Db_connection");
const { verifyToken } = require("../Middleware/Jwt");

router.get("/subjects", verifyToken,(req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  console.log(data)
  const sqlinsert = `SELECT * FROM subjects WHERE status=1 AND  CollegeID=${data.user.id}`;
  console.log(sqlinsert)
  // return
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.post("/api/subjects",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const book = req.body;
  console.log(book)
  // return
  const sqlinsert = `SELECT COUNT (*) as total FROM subjects WHERE subjectName='${book.subjectName} AND  CollegeID=${data.user.id}'`;
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.parse(JSON.stringify(result))[0];

    if (result2.total > 0) {
      res.send({ message: "Already Exist", status: 400 });
    } else if (book.id !== "" && book.id !== null) {
      const sqlinsert = `UPDATE subjects SET subjectName="${book.subjectName}" , subjectType="${book.subjectType}" , subjectCode="${book.subjectCode}" WHERE id="${book.id}"`;
      //  return res.send(sqlinsert)
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
        res.send({ message: "Books Updated", status: 200 });
      });
    } else {
      // const subject = req.body;
      const sqlinsert = `INSERT INTO subjects ( subjectName, subjectType, subjectCode,status,CollegeID) VALUES ( '${book.subjectName}', '${book.subjectType}', '${book.subjectCode}',1, ${data.user.id})`;

      con.query(sqlinsert, (err, result) => {
        res.send({ message: "Book Added", stutus: 200 });
      });
    }
  });
});

router.get("/subjectgroup_List",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const sqlinsert =
    `SELECT sG.*, cl.className as class, ses.year as year FROM subjectgroup sG LEFT JOIN class cl ON sG.classid=cl.id LEFT JOIN sessions ses ON sG.yearid=ses.id WHERE sG.status=1 AND sG.CollegeID=${data.user.id}`;

  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.parse(JSON.stringify(result));

    const output = result2.reduce((acc, item) => {
      const element = acc.find(
        (elem) => elem.classid == item.classid && elem.name == item.name
      ); ;
      if (element) {
        element.subject.push(item.subject);
      } else {
        acc.push({
          id: item.id,
          name: item.name,
          yearid: item.yearid,
          class: item.class,
          year: item.year,
          classid: item.classid,
          subjectCode: item.subjectCode,
          subject: [item.subject],
        });
      }
      return acc;
    }, []);
    res.send(output);

    // res.send(result2)
    // return
    //  const result3 = result2.reduce((acc, item) => {
    //    acc[`clssid${item.classid}`] = acc[`clssid${item.classid}`] || [];
    //    acc[`clssid${item.classid}`].push(item);
    //    return acc;
    //  }, {});
    //  console.log(result3);
    // const data = [
    //   {
    //     id: 22,
    //     name: "ten",
    //     yearid: 4,
    //     classid: "9",
    //     subject: " math",
    //     subjectCode: "33",
    //     class: "nur",
    //     sess: "2024",
    //   },
    //   {
    //     id: 21,
    //     name: "ten",
    //     yearid: 4,
    //     classid: "9",
    //     subject: " computer",
    //     subjectCode: "33",
    //     class: "nur",
    //     sess: "2024",
    //   },
    //   {
    //     id: 20,
    //     name: "nine",
    //     yearid: 4,
    //     classid: "15",
    //     subject: "math",
    //     subjectCode: "1",
    //     class: "metric",
    //     sess: "2024",
    //   },
    //   {
    //     id: 19,
    //     name: "nine",
    //     yearid: 4,
    //     classid: "15",
    //     subject: "urdu",
    //     subjectCode: "1",
    //     class: "metric",
    //     sess: "2024",
    //   },
    // ];

    // arr = [];
    // const result3 = data.reduce((acc, item) => {
    //   acc[`clssid${item.classid}`] = acc[`clssid${item.classid}`] || [];
    //   acc[`clssid${item.classid}`].push(item);
    //   return acc;
    // }, {});
    // console.log(result3)

    // console.log(arr)
    // data.forEach((ele,i)=>{
    //   if(ele.classid.includes(ele.classid)){

    //     arr.push(ele)
    //   }else{
    //     return ele
    //   }
    // })
    // console.log(",,,s",arr)
    // let sameClass = [];
    // data.forEach((ele)=>{
    //   // console.log(ele)
    //   if (sameClass.includes(ele.classid)) {
    //    var d=sameClass.push(ele.classid);
    //   }
    //   console.log(d);

    //   })
    // console.log(d);

    // console.log(item)
    //  if (element) {
    //    element.subject = Array.isArray(element.subject)
    //      ? element.subject.push(item.subject)
    //      : [element.subject, item.subject];
    //  } else {
    //    acc.push(item);

    //  }

    return;
    const result3 = result2.reduce((acc, current) => {
      // console.log("curr",current,"acc",acc)
      const { id, name, yearid, classid, subject, subjectCode } = current;
      const previousRecord = acc[subjectCode];
      if (typeof previousRecord === "object") {
        return {
          ...acc,
          [id]: {
            ...previousRecord,
            [`class${classid}`]: classid,
            subjects: [`${previousRecord.subjects}`, `${subject}`],
          },
        };
      } else {
        return {
          ...acc,
          [id]: {
            id,
            name,
            subject,
            classid,
            yearid,
            subjectCode,
            [`class${classid}`]: classid,
            subjects: `${subject}`,
          },
        };
      }
    }, {});

    res.send(result3);

    return;
    const data = [
      {
        id: "1",
        name: "Maya Mahardhani",
        subject: "english",
        classid: "7",
        yearid: "1",
        subjectCode: "22",
      },
      {
        id: "1",
        name: "Maya Mahardhani",
        subject: "urdu",
        classid: "1",
        subjectCode: "22",
      },
      {
        id: "2",
        name: "Tara Debu Batara",
        subject: "maths",
        classid: "ST005101001",
        subjectCode: "1",
      },
      {
        id: "3",
        name: "Nikita Gigir",
        subject: "phy",
        classid: "ST004403030",
        subjectCode: "1",
      },
      {
        id: "4",
        name: "Nikita Gigir",
        subject: "science",
        classid: "30",
        subjectCode: "1",
      },
      {
        id: "4",
        name: "Nikita Gigir",
        subject: "chemistry",
        classid: "30",
        subjectCode: "1",
      },
    ];
    const datas = data.reduce((acc, current) => {
      const { id, name, subject, classid, subjectCode } = current;
      const previousRecord = acc[id];
      if (typeof previousRecord === "object") {
        return {
          ...acc,
          [id]: {
            ...previousRecord,
            [`classid_${subjectCode}`]: subjectCode,
            total_amount: [`${previousRecord.total_amount}`, `${subject}`],
          },
        };
      } else {
        return {
          ...acc,
          [id]: {
            id,
            name,
            subject,
            classid,
            subjectCode,
            [`classid_${subjectCode}`]: subjectCode,
            total_amount: [subject],
          },
        };
      }
    }, {});

    res.send(datas);
  });
});

router.delete("/del/subject/:id", (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const ID = req.params.id;

  const sqlinsert = `DELETE FROM subjects WHERE id=${ID}`;
  // res.send(sqlinsert)
  //   return
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ message: "Subject Deleted", status: 200 });
  });
});

router.post("/subjectGroup",verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  if (req.body.id !== "") {
    const sqlinsert = `DELETE FROM subjectgroup WHERE classid=${req.body.classid} AND name='${req.body.name}' AND CollegeID=${data.user.id}`;
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
    });
    const subject = req.body;
    subject.subject.forEach((element) => {
      const sqlinsert = `INSERT INTO subjectgroup ( name,yearid,classid,subject,subjectCode,status,CollegeID) VALUES ( '${subject.name}',  '${subject.yearid}','${subject.classid}','${element}','${subject.subjectCode}',1,${data.user.id})`;
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
      });
    });
    res.send({ message: "Subject Assign To Class", stutus: 200 });
    // });

  } else {
    const subject = req.body;
    subject.subject.forEach((element) => {
      const sqlinsert = `INSERT INTO subjectgroup ( name,yearid,classid,subject,subjectCode,status,CollegeID) VALUES ( '${subject.name}',  '${subject.yearid}','${subject.classid}','${element}','${subject.subjectCode}',1,${data.user.id})`;
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
      });
    });
    res.send({ message: "Subject Assign To Class", stutus: 200 });
    // const sqlinsert = `INSERT INTO subjects ( name,  yearid,class,subject) VALUES ( '${subject.name}',  '${subject.yearid}','${subject.class}','${subject.subject}')`;

    // con.query(sqlinsert, (err, result) => {
    //   res.send({ message: "Subject Assign To Class", stutus: 200 });
  }

  // });
});
// it should change for temporary delete
router.delete("/subjectGrouped/delete/:classid", (req, res) => {
  const sqlinsert = `DELETE FROM subjectgroup WHERE classid=${req.params.classid}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ result, message: "Delete successfully", status: 200 });
  });
});
module.exports = router;
