const User = require("./app/controllers/UserController");
const app = require("express")();
const http = require("http").createServer(app);

app.get("/users", (req, res) => {
  User.get()
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

// Start application server
http.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
app;
