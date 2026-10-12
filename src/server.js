import "dotenv/config.js";
import dns from "dns";
dns.setServers(["8.8.8.8"], ["1.1.1.1"]);
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
