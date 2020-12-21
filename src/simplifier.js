const resolveNestedCollisions = require('./collision');

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
                simplifiedFilter = Simplifier.__simplifyInFilter(filter);
                break;


            case 'and':
                simplifiedFilter = Simplifier.__simplifyAndFilter(filter);
                break;

            case 'is':
                simplifiedFilter = Simplifier.__simplifyIsFilter(filter);
                break;
        }

        return simplifiedFilter;
    };

    /** (Private method) Simplifies the provided "in" type filter
     * @param filter {object} - The filter
     * @returns filter {object} - The simplified filter
     */
    static __simplifyInFilter(filter) {

        // We need to have at least 1 "good" value, let's filter out duplicates and empty values
        filter.values = filter.values.reduce((acc, currentVal) => {

            // Check if the values list already has this value
            const valueIsDuplicate = acc.some((accVal) => accVal === currentVal);

            // Ensure no duplicates nor empty elements
            if (currentVal && currentVal.length > 0 && !valueIsDuplicate) {
                acc.push(currentVal);
            }

            return acc;
        }, []);

        // Having no values matches none
        if (filter.values.length == 0) {
            return { type: 'false' }
        }

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
    static __simplifyIsFilter(filter) {

        // Likely nothing should match an empty string
        if (filter.value.trim() === '') {
            return {
                type: 'false'
            }
        }

        return filter;
    };

    /** (Private method) Simplifies the provided "and" type filter
     * @param filter {object} - The filter
     * @returns filter {object} - The simplified filter
     */
    static __simplifyAndFilter(filter) {

        // Flatten nested-filters where possible
        if (filter.hasOwnProperty('filters')) {

            // Flatten the nested sub-filters
            filter.filters = filter.filters
                .reduce((acc, val) => {

                    // Filters in a nested "and" have to be flattened
                    if (val.type === 'and') { acc.push(...val.filters); }

                    // Others can be added as-is
                    else { acc.push(val); }

                    return acc;
                }, [])

            // Simplify any filters as needed
            filter.filters = filter.filters.map((nestedFilter) => {
                return Simplifier.simplifyFilter(nestedFilter);
            });
        }

        // Attempt to resolve any collisions involved with the nested filters
        filter = resolveNestedCollisions(filter);

        return filter;
    };
};

module.exports = Simplifier;