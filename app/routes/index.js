const router = require("express").Router();

const commentsRoutes = require("./comments.routes");

// register routes ///////////////////////////
router.use("/api/comments", commentsRoutes);

router.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
        return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.sendStatus(500);
});
// Handle API 404
router.use("/api/*", function (req, res, next) {
    res.sendStatus(404);
});
module.exports = router;


