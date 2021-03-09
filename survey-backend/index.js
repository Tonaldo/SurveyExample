
import app from "./app.js";

const PORT =  "8080";

 app.listen(parseInt(PORT, 10), '127.0.0.1', () => {
  console.log(`Survey server is running (port: ${PORT}`);
  console.log("  Press CTRL-C to stop\n");
});

