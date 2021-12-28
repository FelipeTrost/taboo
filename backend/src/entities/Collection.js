const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Collection name is required"],
    unique: "",
  },
  description: String,
  keywords: [String],
  language: {
    type: String,
    required: true,
    default: "en",
    enum: {
      values: ["en", "es", "de"],
      message: "{VALUE} is not supported as a language",
    },
  },
  cards: {
    type: [
      {
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
      },
    ],
    default: undefined,
    required: [true, "Collections need cards"],
    validate: {
      validator: (arr) => arr.length >= 5 && arr.length <= 100,
      message: "Collections have to have between 5 to 100 cards",
    },
  },
});

CollectionSchema.post("save", function (error, doc, next) {
  if (error.keyPattern && error.keyPattern.name && error.code === 11000) {
    const customError = new mongoose.Error.ValidationError(
      new mongoose.Error("Validation error, name not unique")
    );

    customError.errors.name = new mongoose.Error.ValidatorError({
      path: "name",
      message: `"${error.keyValue.name}" as a Collection name is already taken`,
    });

    next(customError);
  } else {
    next(error);
  }
});

const Collection = mongoose.model("Collection", CollectionSchema);

module.exports = Collection;
