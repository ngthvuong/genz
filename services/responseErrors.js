'use strict'

const errors = {
    data: []
}

errors.add = function (error) {
    const hasMessage = this.data.some(existingError => existingError.msg === error.msg)
    if (!hasMessage) {
        this.data.push(error)
    }
    return this
}
errors.multiAdd = function (errorList) {
    errorList.forEach(error => {
        this.add(error)
    })
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