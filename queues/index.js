'use strict'

const jobs = [
    require("./jobs/checkPendingPaymentJob")
]

jobs.queues = {}

jobs.execQueues = () => {
    for (const job of jobs) {
        if (!jobs.queues[job.name]) {
            jobs.queues[job.name] = job
        }
    }
    return jobs.queues
}

module.exports = jobs.execQueues()
