'use strict'

const controller = {}

const models = require("../models")
const errors = require("../services/responseErrors")
const { Op } = require('sequelize')

controller.share = (req, res, next) => {
    res.locals.searchUrl = "/heatmap/manage/list"
    next()
}

controller.showManageList = async (req, res) => {

    const keyword = req.query.keyword ? req.query.keyword.trim() : ""
    const page = req.query.page ? parseInt(req.query.page.trim()) : 1
    const limit = 10
    const offset = (page - 1) * limit

    const query = new URLSearchParams(req.query)
    let path = req.path == "/" ? req.path : ""

    if (page < 1) {
        query.delete("page")
        return res.redirect(`${req.baseUrl}${path}?${query.toString()}`)
    }

    const optionCount = {
        where: {
            name: {
                [Op.iLike]: `%${keyword}%`
            },
        },
    }

    const totalRows = await models.HeatMap.count(optionCount)

    const options = {
        ...optionCount,
        order: [['createdAt', 'DESC']],
        limit,
        offset
    }

    const heatMaps = await models.HeatMap.findAll(options)

    const pagination = {
        page,
        limit,
        totalRows,
        queryParams: req.query
    }

    const maxPage = parseFloat(totalRows) ? Math.ceil(parseFloat(totalRows) / limit) : 1
    if (page > maxPage) {
        query.set("page", maxPage)
        return res.redirect(`${req.baseUrl}${path}?${query.toString()}`)
    }

    return res.render("heatmap/manageShowList", {
        heatMaps,
        pagination,
        keyword
    })
}

controller.create = async (req, res) => {
    const provinces = await models.Province.findAll()

    return res.render("heatmap/manageCreate", {
        provinces
    })
}

controller.insert = async (req, res) => {
    try {
        const { name, unit, heatmap } = req.body

        await models.HeatMap.update(
            {
                status: 'disable'
            },
            {
                where: {}
            }
        )

        const heatMap = await models.HeatMap.create({
            name,
            unit,
            status: 'enable'
        })

        const provinceLength = heatmap.code.length
        const heatMapPoints = []
        for (let i = 0; i < provinceLength; i++) {
            if (heatmap.value[i] !== "") {
                heatMapPoints.push({
                    heatMapID: heatMap.id,
                    provinceCode: heatmap.code[i],
                    value: heatmap.value[i]
                })
            }
        }
        await models.HeatMapProvince.bulkCreate(heatMapPoints)

        return res.json({ success: true, nextUrl: "/heatmap/manage/list" })
    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }

}

controller.edit = async (req, res) => {
    const { id } = req.params
    const heatmap = await models.HeatMap.findOne({
        where: { id },
        include: [
            {
                model: models.HeatMapProvince,
                include: [
                    {
                        model: models.Province
                    }
                ]
            }
        ]
    })

    if (!heatmap) {
        return res.redirect("/")
    }

    const provinces = await models.Province.findAll()

    return res.render("heatmap/manageEdit", {
        provinces,
        heatmap: JSON.stringify(heatmap)
    })
}

controller.update = async (req, res) => {
    try {
        const { name, unit, status, heatmap } = req.body
        const { id } = req.params

        const targetHeatMap = await models.HeatMap.findOne({
            where: { id }
        })
        if (!targetHeatMap) {
            throw new Error("Bản đồ này không tồn tại")
        }
        targetHeatMap.name = name
        targetHeatMap.unit = unit
        if (status) {

            await models.HeatMap.update(
                {
                    status: 'disable'
                },
                {
                    where: {}
                }
            )

            targetHeatMap.status = 'enable'
        }

        await targetHeatMap.save()

        const provinceLength = heatmap.code.length
        const newHeatMapPoints = []
        for (let i = 0; i < provinceLength; i++) {
            if (heatmap.value[i] !== "") {
                const point = await models.HeatMapProvince.findOne({
                    where: {
                        heatMapID: id,
                        provinceCode: heatmap.code[i]
                    }
                })
                if (!point) {
                    newHeatMapPoints.push({
                        heatMapID: id,
                        provinceCode: heatmap.code[i],
                        value: heatmap.value[i]
                    })
                } else {
                    point.value = heatmap.value[i]
                    await point.save()
                }

            } else {
                await models.HeatMapProvince.destroy({
                    where: {
                        heatMapID: id,
                        provinceCode: heatmap.code[i]
                    }
                })
            }
        }
        if (newHeatMapPoints) {
            await models.HeatMapProvince.bulkCreate(newHeatMapPoints)
        }

        return res.json({ success: true, nextUrl: "/heatmap/manage/list" })
    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}

controller.delete = async (req, res) => {
    try {
        const { id } = req.params

        const targetHeatMap = await models.HeatMap.findOne({
            where: { id }
        })
        if (!targetHeatMap) {
            throw new Error("Bản đồ này không tồn tại")
        }

        await models.HeatMapProvince.destroy({
            where: {
                heatMapID: id
            }
        })

        await targetHeatMap.destroy()

        return res.json({ success: true, nextUrl: "/heatmap/manage/list" })
    } catch (error) {
        console.log(error)
        errors.add({ msg: error.message })
        return res.json(errors.get())
    }
}


module.exports = controller