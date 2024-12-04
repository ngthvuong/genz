'use strict'

const service = {}

service.calCenterCoordinate = (heatMapProvinces) => {
    let maxLongitude, maxLatitude, minLongitude, minLatitude = null
    heatMapProvinces.map(async (data) => {
        if (data.value > 0) {
            if (maxLongitude === null) {
                maxLongitude = parseFloat(data.Province.longitude)
            } else {
                maxLongitude = (maxLongitude > parseFloat(data.Province.longitude)) ? maxLongitude : parseFloat(data.Province.longitude)
            }

            if (maxLatitude === null) {
                maxLatitude = parseFloat(data.Province.longitude)
            } else {
                maxLatitude = (maxLatitude > parseFloat(data.Province.latitude)) ? maxLatitude : parseFloat(data.Province.latitude)
            }

            if (minLongitude === null) {
                minLongitude = parseFloat(data.Province.longitude)
            } else {
                minLongitude = (minLongitude < parseFloat(data.Province.longitude)) ? minLongitude : parseFloat(data.Province.longitude)
            }

            if (minLatitude === null) {
                minLatitude = parseFloat(data.Province.latitude)
            } else {
                minLatitude = (minLatitude < parseFloat(data.Province.latitude)) ? minLatitude : parseFloat(data.Province.latitude)
            }
        }
    })

    const longitude = parseFloat(((maxLongitude + minLongitude) / 2).toFixed(4))
    const latitude = parseFloat(((maxLatitude + minLatitude) / 2).toFixed(4))

    return {
        longitude,
        latitude
    }
}
service.getMaxValue = (heatMapProvinces) => {
    let maxValue = 0
    heatMapProvinces.forEach(data => {
        const value = parseFloat(data.value)
        if (value > 0) {
            maxValue = (maxValue > value) ? maxValue : value
        }
    })
    return maxValue
}

service.buildPoints = (heatMapProvinces) => {
    const points = []
    const maxValue = service.getMaxValue(heatMapProvinces)

    heatMapProvinces.forEach(data => {
        if (parseFloat(data.value) > 0) {
            points.push({
                longitude: parseFloat(data.Province.longitude),
                latitude: parseFloat(data.Province.latitude),
                value: parseFloat(data.value),
                priority: parseFloat(data.value) / maxValue
            })
        }
    })

    return points
}

service.getZoom = (heatMapProvinces) => {
    return 5
}

service.buildData = (heatmap) => {
    const data = {}
    data.name = heatmap.name
    data.centerCoordinate = service.calCenterCoordinate(heatmap.HeatMapProvinces)
    data.zoom = service.getZoom(heatmap.HeatMapProvinces)

    data.points = service.buildPoints(heatmap.HeatMapProvinces)

    return data
}

module.exports = {
    buildData: service.buildData
}