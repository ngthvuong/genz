'use strict'

const errors = {
    data: []
}

errors.add = function (error) {
    this.data.push(error)
    return this
}
errors.multiAdd = function (errorList) {
    this.data.push(...errorList)
    return this
}
errors.get = function () {
    const currentErrors = {
        'success': false,
        'errors': this.data
    };

    this.data = [];
    return currentErrors;
}

module.exports = errors