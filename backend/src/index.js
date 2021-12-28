const app = require("./app");
const mongoose = require("mongoose");
const Collection = require("./entities/Collection");

const port = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);

    app.listen(port, () => {
      /* eslint-disable no-console */
      console.log(`Listening: http://localhost:${port}`);
      /* eslint-enable no-console */
    });
  } catch (error) {
    console.error(error);
    console.error(Object.keys(error.errors));
  }
})();
