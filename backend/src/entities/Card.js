const mongoose = require("mongoose");

module.exports = mongoose.model("Card", CardSchema());

function CardSchema() {
  return new mongoose.Schema({
    word: { type: String, required: [true, "Every card needs a name"] },
    prohibited: {
      type: [String],
      default: undefined,
      required: true,
      validate: {
        validator: (arr) => arr.length >= 4 && arr.length <= 7,
        message: "You should have between 4 to 7 prohibited words",
      },
    },
  });
}
