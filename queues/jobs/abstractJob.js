'use strict'
const Bull = require("bull")

class AbstractJob {

    constructor() {
        this.redisURL = process.env.REDIS_URL
        this.instance = null
        this.promise = null
    }

    async getQueue() {
        if (this.promise === null) {
            this.promise = new Promise((resolve, reject) => {
                this.instance = new Bull(this.name, { redis: this.redisURL })
                this.instance.process(this.process)
                resolve(this.instance)
            })
        }
        return this.promise
    }

}

module.exports = AbstractJob