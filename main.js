import createServer from "./server.js";

const app = createServer();

const port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log("Server is listening on port 8080");
});
