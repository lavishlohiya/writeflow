require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 1002;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));