//const passport = require('passport');
const router = require("express").Router();
const usersRoutes = require("./users.routes");
const sitesRoutes = require("./sites.routes");
const forumBoardsRoutes = require("./forumBoards.routes");
const forumPostsRoutes = require("./forumPosts.routes");
const benefitsRoutes = require("./benefits.routes");
const strategiesRoutes = require("./strategies.routes");
const hackersRoutes = require("./hackers.routes");
const greenscapesRoutes = require('./greenscapes.routes')
const projectFundMatchesRoutes = require('./projectFundMatches.routes')
const partnersRoutes = require('./partners.routes')
const fundsRoutes = require('./funds.routes')
const projectRoutes = require('./project.routes')
const sectionEditRoutes = require('./sectionEditor.routes')
const navbarSettingsRoutes = require('./navbarSettings.routes')
const pageRoutes = require('./page.routes')
const contactRoutes = require('./contacts.routes');
const statisticCalloutsRoutes = require("./statisticCallouts.routes");
const fileUploadRoutes = require("./file-upload.routes");
const proposedFundsRoutes = require('./proposedFunds.routes');
const pendingProjectRoutes = require('./pending-project.routes');
const proposedOrganizationRoutes = require('./proposedOrganization.routes')
const organizationsRoutes = require('./organizations.routes');
const mapshaperRoutes = require('./mapshaper.routes');
const mapFileLinksRoutes = require('./mapFileLinks.routes');
const logsRoutes = require('./logs.routes');
const proposalsRoutes = require('./proposals.routes');
const proposeRoutes = require('./propose.routes');

//bringing in users service for use with validateaccessrights
const userModel = require('../models/user');
const usersService = require('../services/users.service')({
    modelService: userModel
});
//these stay above router.all because this route will not apply to router.all these routes do not need to be checked
router.use('/api/propose', proposeRoutes);
router.use('/api/users', usersRoutes);
//router.all will add validate middleware to all routes, inside we check to see the method 
//and apply only on POST PUT and DELETE
router.all('/api/*', usersService.validateAccessRights('Admin'));
// register routes ///////////////////////////
router.use("/api/forumPosts", forumPostsRoutes);
router.use("/api/forumBoards", forumBoardsRoutes);
router.use("/api/benefits", benefitsRoutes);
router.use("/api/strategies", strategiesRoutes);
router.use("/api/hackers", hackersRoutes);
router.use('/api/greenscapes', greenscapesRoutes);
router.use('/api/project-fund-matches', projectFundMatchesRoutes);
router.use('/api/partners', partnersRoutes);
router.use('/api/funds', fundsRoutes);
router.use('/api/proposed-funds', proposedFundsRoutes);
router.use('/api/project', projectRoutes);
router.use('/api/sectionEditor', sectionEditRoutes);
router.use('/api/navbar/settings', navbarSettingsRoutes);
router.use('/api/page', pageRoutes);
router.use('/api/contact', contactRoutes);
router.use("/api/statisticCallouts", statisticCalloutsRoutes);
router.use("/api/fileUpload", fileUploadRoutes);
router.use('/api/pending-project', pendingProjectRoutes);
router.use('/api/proposedOrganization', proposedOrganizationRoutes)
router.use('/api/organizations', organizationsRoutes);
router.use('/api/mapshaper', mapshaperRoutes);
router.use('/api/mapFileLinks', mapFileLinksRoutes);
router.use('/api/login-data', logsRoutes);
router.use('/api/proposals', proposalsRoutes);

// Handle API 404
router.use("/api/*", function(req, res, next) {
    res.sendStatus(404);
});

router.use(sitesRoutes);

router.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
        return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.sendStatus(500);
});

module.exports = router;
