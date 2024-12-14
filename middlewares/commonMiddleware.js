'use strict'

const middleware = {}

middleware.setShareVariables = () => {
    return async (req, res, next) => {
        res.locals.appName = process.env.APP_NAME
        res.locals.searchUrl = "/report"
        res.locals.searchPlaceHolder = "Tìm kiếm chiến dịch"

        res.locals.heatMapData = await middleware.getHeatMap()
        next()
    }
}

middleware.getHeatMap = async () => {
    const models = require("../models")
    const heatMap = await models.HeatMap.findOne({
        where: {
            status: 'enable'
        },
        include: [
            {
                model: models.HeatMapProvince,
                include: [
                    {
                        model: models.Province,
                    }
                ]
            }
        ],
        order: [['createdAt', 'desc']]
    })
    let heatMapData = null
    if (heatMap) {
        const heatMapService = require("../services/heatMapService")
        heatMapData = heatMapService.buildData(heatMap)   
    }

    return JSON.stringify(heatMapData)
}

module.exports = middleware