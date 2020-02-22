const Controller = require("./trials/TrialController");
const app = require("express")();
const http = require("http").createServer(app);

let obj = new Controller();

// Start application server
http.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
