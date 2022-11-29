// const express=require("express")
// const router = express.Router();

// router.route("/book").get((req, res) => {
//     res.send("Get a random book");
//   })
//   .post((req, res) => {
//     res.send("Add a book");
//   })
//   .put((req, res) => {
//     res.send("Update the book");
//   });
// module.export=router


// const express = require("express");
// const app = express();
// const router = express.Router();

// // predicate the router with a check and bail out when needed
// router.use((req, res, next) => {
//   if (!req.headers["x-auth"]) return next("router");
//   next();
// });

// router.get("/user/:id", (req, res) => {
//   res.send("hello, user!");
// });

// // use the router and 401 anything falling through
// app.use("/admin", router, (req, res) => {
//   res.sendStatus(401);
// });





const express = require('express')
const app = express()
const router = express.Router()
const port=3000


const cookieParser = require("cookie-parser");

// load the cookie-parsing middleware
app.use(cookieParser());
// // a middleware function with no mount path. This code is executed for every request to the router
// router.use((req, res, next) => {
//   console.log('Time:', Date.now())
//   next()
// })
app.get('/',(res,req)=>{
  console.log("name");
})
// // a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
// router.use('/user/:id', (req, res, next) => {
//   console.log('Request URL:', req.originalUrl)
//   next()
// }, (req, res, next) => {
//   console.log('Request Type:', req.method)
//   next()
// })

// a middleware sub-stack that handles GET requests to the /user/:id path
// router.get('/user/:id', (req, res, next) => {
//   // if the user ID is 0, skip to the next router
//   if (req.params.id === '0') next('route')
//   // otherwise pass control to the next middleware function in this stack
//   else next()
// }, (req, res, next) => {
//   // render a regular page
//   res.send('regular')
// })

// // handler for the /user/:id path, which renders a special page
// router.get('/user/:id', (req, res, next) => {
//   console.log(req.params.id)
//   res.send('special')
// })

// // mount the router on the app
// app.use("/", router);

// predicate the router with a check and bail out when needed
// router.use((req, res, next) => {
//   if (!req.headers['x-auth']) return next('router')
//   next()
// })

// router.get('/user/:id', (req, res) => {
//   res.send('hello, user!')
// })

// use the router and 401 anything falling through
// app.use('/admin', router, (req, res) => {
//   res.sendStatus(401)
// })

app.listen(port, () => {
  console.log(`Example app listening on http://localhost/:${port}`);
});