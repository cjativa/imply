const validator = require('./validations');
const cloneFunction = require('./clone');
const Simplifier = require('./simplifier');

function simplify(filter) {

    // Let's apply our validations to the filter - prior to simplifying it
    validator.validateFilter(filter);

    // The filter was valid. Let's clone the existing filter so as to not modify directly
    const filterCopy = cloneFunction(filter);

    // The simplified filter
    const simplifiedFilter = Simplifier.simplifyFilter(filterCopy);

    return simplifiedFilter;
};



module.exports = simplify;
