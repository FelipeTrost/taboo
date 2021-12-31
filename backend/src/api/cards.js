const express = require("express");
const router = express.Router();

const Card = require("../entities/Card");
const Collection = require("../entities/Collection");

router.get("/", async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: await Card.find(req.query),
    });
  } catch (error) {
    console.error(error);

    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const collection = new Collection(req.body);
    await collection.save();

    res.json({ success: true, message: collection });
  } catch (error) {
    console.error(error);

    // for mongoose related errors
    if (error.errors) {
      res.json({
        success: false,
        message: Object.keys(error.errors)
          .map((key) => error.errors[key].message)
          .join(","),
      });
    } else {
      next(error);
    }
  }
});

const limit = 10;
router.get("/search", async (req, res, next) => {
  try {
    const searchParams = {
      $or: [
        { description: { $regex: req.query.query } },
        { name: { $regex: req.query.query } },
        { keywords: { $regex: req.query.query } },
      ],
    };

    // pagination
    // pages start at 0
    const totalDocuments = await Collection.count(searchParams);
    const { page } = req.query;
    const skip = (page || 0) * limit;
    const numPages = Math.ceil(totalDocuments / limit);

    console.log("pagecount", await Collection.countDocuments(), page);
    const collections = await Collection.find(searchParams)
      .limit(limit)
      .skip(skip);

    res.json({
      success: true,
      message: { collections, numPages },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
