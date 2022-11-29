const express = require("express");
const app = express();
const path=require('path')
const port = 3000;
const Birds=require('./Birds')




// const route=require('./route')
// app.use('/birds',Birds)
// function logOriginalUrl(req, res, next) {
//   console.log("Request URL:", req.originalUrl);
//   next();
// }

// function logMethod(req, res, next) {
//   console.log("Request Type:", req.method);
//   next();
// }

// const logStuff = [logOriginalUrl, logMethod];
// app.get("/user/:id", logStuff, (req, res, next) => {
//   res.send("User Info");
// });

// app.get(
//   "/user/:id",
//   (req, res, next) => {
//     // if the user ID is 0, skip to the next route
//     if (req.params.id === "0") next("route");
//     // otherwise pass the control to the next middleware function in this stack
//     else next();
//   },
//   (req, res, next) => {
//     // send a regular response
//     res.send("regular");
//   }
// );

// // handler for the /user/:id path, which sends a special response
// app.get("/user/:id", (req, res, next) => {
//   res.send("special");
// });

// app.use(
//   "/user/:id",
//   (req, res, next) => {
//     console.log("Request URL:", req.originalUrl);
//     next();
//   },
//   (req, res, next) => {
//     console.log("Request Type:", req.method);
//     next();
//   }
// );

// const abc=function(req,res,next){
// console.log("ID",req.params.id)
// next()
// };
// const cd=function(req,res){
//   res.send("User Info")
// }
// app.get("/user/:id",[abc,cd])
// app.get(
//   "/users/:id",
//   (req, res, next) => {
//     if(req.params.id==0){

//       console.log("Id:", req.params.id);
//       next('route');

//     }else next()
//     // console.log("ID:", req.params.id);
//   },
//   (req, res, next) => {
//     res.send("User Info");
//   }
// );
// handler for the /user/:id path, which prints the user ID
// app.get("/users/:id", (req, res, next) => {
//   res.send(req.params.id);
//   console.log("umair")
// });
// app.use((req, res, next) => {
//   console.log("Time:", Date.now());
//   next();
// });
// app.get("/user/:id", (req, res, next) => {
//   res.send("USER"+req.params.id);
// });
// app
//   .route("/book")
//   .get((req, res) => {
//     res.send("Get a random book");
//   })
//   .post((req, res) => {
//     res.send("Add a book");
//   })
//   .put((req, res) => {
//     res.send("Update the book");
//   });
// app.use('route',route)
// app.all("/secret/b", (req, res, next) => {
//   console.log("Accessing the secret section ...");
//   res.send("my name is umair")
//   next(); // pass control to the next handler
// });
// app.get("/", (req, res) => {
//   res.send("Hello World!");

//   console.log("hello pakistan");
// });

// app.get("/home/:name/books/:id",(req,res)=>{
//   res.send("hello "+req.params.name+" you book id is " +req.params.id)
// })

// app.get(
//   "/example/b",
//   (req, res, next) => {
//     console.log("the response will be sent by the next function ...");
//     // res.send("hello khan")
//     next();
//   },
//   (req, res) => {
//     res.send("Hello from B!");
//   }
// );
// const cb0 = function (req, res, next) {
//   console.log('CB0')
//   // console.log(5+5)
//   next()
// }

// const cb1 = function (req, res, next) {
//   console.log('CB1')
//   next()
// }

// const cb2 = function (req, res) {
//   res.send('Hello from C!')
// }

// app.get('/example/c', [cb0, cb1, cb2])
// app.get("/ab?cd", (req, res) => {
//   res.send("ab?cd");
//   console.log("hello");
// });
// app.get("/ab+cd", (req, res) => {
//   res.send("ab+cd");
//   console.log("hello");
// });
// app.get("/about", (req, res) => {
//   // res.send("Hello About!");
//   res.json({
//     "name": {
//       "firstname": "umait",
//       "lastname": "amjad",
//     },
//   })
  // res.status(500)  
  // res.sendFile(path.join(__dirname,'public.html'))
// });

// app.use('/static',express.static(path.join(__dirname,'public')))

// app.all("/secret", (req, res, next) => {
//   console.log("Accessing the secret section ...");
//   res.send("my name is umair")
//   next(); // pass control to the next handler
// });

// app.get("/random.text", (req, res) => {
//   res.send("random.text");
// });
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:3000/:${port}`);
});
