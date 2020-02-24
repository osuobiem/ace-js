const User = require("./app/controllers/UserController");
const app = require("express")();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/users", (req, res) => {
  User.get()
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

app.get("/users/:id/delete", (req, res) => {
  User.delete(req.params.id)
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

app.post("/users/new", (req, res) => {
  User.create(req.body)
    .then(resp => {
      res.send(resp);
    })
    .catch(err => {
      res.send(err);
    });
});

app.post("/users/:id/update", (req, res) => {
  User.update(req.body, req.params.id)
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
