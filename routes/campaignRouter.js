'use strict'
const campaignStore = require("../storage/campaignStore")

const express = require('express')
const createCampaignValid = require('../validations/campaign/createCampaignValid')
const editCampaignValid = require('../validations/campaign/editCampaignValid')
const createContributionValid = require('../validations/campaign/createContributionValid')
const createDistributionValid = require('../validations/campaign/createDistributionValid')
const editContributionValid = require('../validations/campaign/editContributionValid')
const editDistributionValid = require('../validations/campaign/editDistributionValid')


const controller = require('../controllers/campaignController')

const router = express.Router()

router.use(controller.share)
router.use(require('../middlewares/auth').isLogged())
const permission = require("../middlewares/permission")
router.use(permission.check("campaign", "all"))

router.get('/', controller.showList)
router.get('/create', controller.create)
router.get('/edit/:id', controller.showEdit)

router.post('/create',
    campaignStore.handlerCache(),
    createCampaignValid,
    controller.createCampaign
)
router.post('/edit/:id',
    campaignStore.handlerCache(),
    editCampaignValid,
    controller.editCampaign
)
router.delete('/delete/:id', controller.deleteCampaign)
router.post('/finished/:id', controller.changeCampaignFinishedStatus)


router.get('/:campaignID/contributions', controller.showContributions)
router.get('/:campaignID/distributions', controller.showDistributions)

router.post('/:campaignID/contributions/load', controller.loadContributions)
router.post('/:campaignID/distributions/load', controller.loadDistributions)

router.get('/:campaignID/contributions/create', controller.showCreateContribution)
router.get('/:campaignID/distributions/create', controller.showCreateDistribution)

router.post('/:campaignID/contributions/create', createContributionValid, controller.createContribution)
router.post('/:campaignID/distributions/create', createDistributionValid, controller.createDistribution)

router.get('/:campaignID/contributions/edit/:id', controller.showEditContribution)
router.get('/:campaignID/distributions/edit/:id', controller.showEditDistribution)

router.post('/:campaignID/contributions/edit/:id', editContributionValid, controller.editContribution)
router.post('/:campaignID/distributions/edit/:id', editDistributionValid, controller.editDistribution)

router.delete('/:campaignID/contributions/delete/:id', controller.deleteContribution)
router.delete('/:campaignID/distributions/delete/:id', controller.deleteDistribution)


module.exports = router
