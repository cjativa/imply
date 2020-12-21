const checkForNestedCollisions = require('./collision');

/** Class responsible for simplfying a filter where logical and as much as possible.
 * Exposes one public method for simplifying the provided filter
 */
class Simplifier {

    /** (Public method) Simplifies the provided filter
     * @param filter {object} - The filter to be simplified
     * @returns filter {object} - The simplified filter
     */
    static simplifyFilter(filter) {

        let simplifiedFilter;

        // Simply the filter depending on its type
        switch (filter.type) {

            case 'in':
                simplifiedFilter = Simplifier.simplifyInFilter(filter);
                break;


            case 'and':
                simplifiedFilter = Simplifier.simplifyAndFilter(filter);
                break;

            case 'is':
                simplifiedFilter = Simplifier.simplifyIsFilter(filter);
                break;
        }

        return simplifiedFilter;
    };

    /** (Private method) Simplifies the provided "in" type filter
     * @param filter {object} - The filter
     * @returns filter {object} - The simplified filter
     */
    static simplifyInFilter(filter) {

        // Having no values matches none
        if (filter.values.length == 0) {
            return {
                type: 'false'
            }
        }

        // At this point, we have at least 1 value, let's filter out duplicates and empty values
        filter.values = filter.values.reduce((acc, currentVal) => {

            // Check if the values list already has this value
            const valueIsDuplicate = acc.some((accVal) => accVal === currentVal);

            // Ensure no duplicates nor empty elements
            if (currentVal && currentVal.length > 0 && !valueIsDuplicate) {
                acc.push(currentVal);
            }

            return acc;
        }, []);

        // Having one value in the "values" list is essentially an "is" filter
        if (filter.values.length == 1) {
            return {
                type: 'is',
                attribute: filter.attribute,
                value: filter.values[0]
            }
        }

        return filter;
    };

    /** (Private method) Simplifies the provided "is" type filter
     * @param filter {object} - The filter
     * @returns filter {object} - The simplified filter
     */
    static simplifyIsFilter(filter) {
        return filter;
    };

    /** (Private method) Simplifies the provided "and" type filter
     * @param filter {object} - The filter
     * @returns filter {object} - The simplified filter
     */
    static simplifyAndFilter(filter) {

        // Attempt to resolve any collisions involved with the nested filters
        filter = checkForNestedCollisions(filter);

        // After resolving collisions, let's simplify any remaining filters
        if (filter.hasOwnProperty('filters')) {
            filter.filters = filter.filters.map((nestedFilter) => {
                return Simplifier.simplifyFilter(nestedFilter);
            });
        }

        return filter;
    };
};

module.exports = Simplifier;