'use strict'

const slug = {}

slug.textToSlug = (input) => {
    return input
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();
}

module.exports = slug