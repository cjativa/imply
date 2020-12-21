const { MalformedFilterError } = require('./malformedFilters');

/** The types of filter the simplify function supports */
const expectedFilterTypes = ['false', 'is', 'in', 'and'];

/** Class responsible for performing end-to-end validation on the provided filter.
* Exposes a single public method for performing validation, and utilizes private methods for
* filter-type specific validation
*/
class Validator {

    /** (Public method) Performs validation on the provided filter. 
     * Throws a MalformedFilterError when the provided filter is malformed
     * @param filter {any} - The filter to be validated
     * @throws MalformedFilterError
     */
    static validateFilter(filter) {

        // Filters must be provided as an object i.e. "{ ... }"
        const filterIsObject = typeof filter === 'object';

        // Raise an error if the filter's not an object
        if (!filterIsObject) {
            throw new MalformedFilterError('Filter must be an object');
        }

        // Even the most basic filter must provide "type"
        if (!filter.hasOwnProperty('type')) {
            throw new MalformedFilterError('Filter must include "type" parameter');
        }

        // Ensure the filter type matches our expected filter types
        const filterTypeIsExpected = expectedFilterTypes.some((filterType) => filterType === filter.type);

        // Raise error if it's not an expected fitler type
        if (!filterTypeIsExpected) {
            throw new MalformedFilterError('Filter type must be one of "false", "is", "in", or "and"');
        }

        // By this point, we can handle filter-type specific errors
        Validator.__validateSpecificFilters(filter);
    };

    /** (Private method) Performs filter-type specific validation on the provided filter
     * @param filter {any} - The filter to be validated. Must have "type" being one of
     * - in
     * - and
     * - false
     * - is
     */
    static __validateSpecificFilters(filter) {

        // Specific validation for "is" and "in" filters
        if (filter.type === 'is' || filter.type === 'in') {

            // "is" and "in" type filters both must provide the "attribute" field
            if (!filter.hasOwnProperty('attribute')) {
                throw new MalformedFilterError('Filters of type "is" or "in" must provide the "attribute" field');
            }

            // "is" type filter must provide the "value" field"
            if (filter.type === 'is' && !filter.hasOwnProperty('value')) {
                throw new MalformedFilterError('Filters of type "is" must provide the "value" field');
            }

            // "in" type filter must provide the "value" field"
            if (filter.type === 'in' && !filter.hasOwnProperty('values')) {
                throw new MalformedFilterError('Filters of type "in" must provide the "values" field');
            }

            // Values must be a list for the "in" filter
            if (filter.type === 'in' && !Array.isArray(filter.values)) {
                throw new MalformedFilterError('Filters of type "in" must provide the "values" field as a list');
            }
        }

        // For "and" type filters, we'll want to validate each of the sub-filters
        if (filter.type === 'and') {

            // The "and" filter must provide sub-filters
            if (!filter.hasOwnProperty('filters') || filter.filters.length == 0) {
                throw new MalformedFilterError('Filters of type "and" must provide a non-empty list of sub-filters in the "filters" field');
            }

            // Run the whole validation process for each sub-filter
            filter.filters.forEach(this.validateFilter);
        }

    };
}

module.exports = Validator;