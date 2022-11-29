const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

var con = require("../../db/Db_connection");

router.get("/subjects", (req, res) => {
  const sqlinsert = "SELECT * FROM subjects WHERE 1";
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.post("/api/subjects", (req, res) => {
  const book = req.body;
  const sqlinsert = `SELECT COUNT (*) as total FROM subjects WHERE subjectName='${book.subjectName}'`;
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.parse(JSON.stringify(result))[0];

    if (result2.total > 0) {
      res.send({ message: "Already Exist", status: 400 });
    } else if (book.id !== "") {
      const sqlinsert = `UPDATE subjects SET subjectName="${book.subjectName}" , subjectType="${book.subjectType}" , subjectCode="${book.subjectCode}" WHERE id="${book.id}"`;
      //  return res.send(sqlinsert)
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
        res.send({ message: "Books Updated", status: 200 });
      });
    } else {
      // const subject = req.body;
      const sqlinsert = `INSERT INTO subjects ( subjectName, subjectType, subjectCode) VALUES ( '${book.subjectName}', '${book.subjectType}', '${book.subjectCode}')`;

      con.query(sqlinsert, (err, result) => {
        res.send({ message: "Book Added", stutus: 200 });
      });
    }
    //   }else if(req.body.id !== ""){
    //       const sqlinsert = `UPDATE subjects SET subjectName="${req.body.subjectName}" , subjectType="${req.body.subjectType}" , subjectCode="${req.body.subjectCode}" WHERE id="${req.body.id}"`;
    //       //  return res.send(sqlinsert)
    //       con.query(sqlinsert, (err, result) => {
    //         if (err) throw err;
    //         res.send({ message: "Books Updated", status: 200 });
    //       });
    //   }
    // else {
    //       const subject = req.body;
    //       const sqlinsert = `INSERT INTO subjects ( subjectName, subjectType, subjectCode) VALUES ( '${subject.subjectName}', '${subject.subjectType}', '${subject.subjectCode}')`;

    //       con.query(sqlinsert, (err, result) => {
    //         res.send({ message: "Book Added", stutus: 200 });
    //       });
    //     }
  });
});

router.get("/subjectgroup_List", (req, res) => {
  const sqlinsert =
    "SELECT sG.*, cl.className as class, ses.year as year FROM subjectgroup sG LEFT JOIN class cl ON sG.classid=cl.id LEFT JOIN sessions ses ON sG.yearid=ses.id";

  // `SELECT sG.name,sessions.year as ses,sG.subjectCode,class.className ,  GROUP_CONCAT(subject) AS subjects FROM subjectgroup sG JOIN class ON sG.classid=class.id JOIN sessions ON sG.yearid=sessions.id WHERE sG.classid=9`
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.parse(JSON.stringify(result));

    const output = result2.reduce((acc, item) => {
      const element = acc.find((elem) => elem.classid == item.classid);
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
  const ID = req.params.id;

  const sqlinsert = `DELETE FROM subjects WHERE id=${ID}`;
  // res.send(sqlinsert)
  //   return
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ message: "Subject Deleted", status: 200 });
  });
});

router.post("/subjectGroup", (req, res) => {
  if (req.body.id !== "") {
    const sqlinsert = `DELETE FROM subjectgroup WHERE classid=${req.body.classid}`;
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
    });

    const subject = req.body;

    subject.subject.forEach((element) => {
      const sqlinsert = `INSERT INTO subjectgroup ( name,yearid,classid,subject,subjectCode) VALUES ( '${subject.name}',  '${subject.yearid}','${subject.classid}','${element}','${subject.subjectCode}')`;
      con.query(sqlinsert, (err, result) => {
        if (err) throw err;
      });
    });

    res.send({ message: "Subject Assign To Class", stutus: 200 });
    // });

  } else {
    const subject = req.body;


    subject.subject.forEach((element) => {
      const sqlinsert = `INSERT INTO subjectgroup ( name,yearid,classid,subject,subjectCode) VALUES ( '${subject.name}',  '${subject.yearid}','${subject.classid}','${element}','${subject.subjectCode}')`;
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

router.delete("/subjectGrouped/delete/:classid", (req, res) => {
  const sqlinsert = `DELETE FROM subjectgroup WHERE classid=${req.params.classid}`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send({ result, message: "Delete successfully", status: 200 });
  });
});
module.exports = router;
