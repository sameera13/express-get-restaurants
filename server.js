const db = require("./db/connection");
const app = require("./src/app");

// TODO: Create your GET Request Route Below:

const port = 3000;

app.listen(port, async () => {
  await db.sync();
  console.log(`Listening at http://localhost:${port}/restaurants`);
});
