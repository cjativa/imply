function checkForNestedCollisions(filter) {

    // Separate the "is" and "in" nested filters
    const nestedIsFilters = filter.filters.filter((fil) => fil.type === 'is');
    const nestedInFilters = filter.filters.filter((fil) => fil.type === 'in');

    // Get the values for each attribute
    // This assumes that the attribute for an "is" filter would not be used as an
    // attribute for an "in" filter, if both types of filters happened to be provided
    const attributeValues = [...nestedIsFilters, ...nestedInFilters].reduce((acc, fil) => {

        // Store this attribute
        if (acc.hasOwnProperty(fil.attribute) == false) {
            acc[fil.attribute] = [];
        }

        // Determine the name of the values for, per the filter type
        const valueKeyField = (fil.type === 'is')
            ? 'value'
            : 'values';

        // Store the values for the attribute
        acc[fil.attribute].push(fil[valueKeyField]);


        return acc;
    }, {});

    // Now, let's try to resolve any collisions that might exist
    for (const [attribute, value] of Object.entries(attributeValues)) {

        // If we have more than one value for an attribute, we'll need to resolve it
        if (value.length > 1) {

            // Determine which type of filter this was for
            const filterType = (Array.isArray(value[0]))
                ? 'in'
                : 'is'
                ;

            // For "is" filters, we can resolve the issue if, after removing duplicates, there's 1 value
            if (filterType === 'is') {

                // We were able to resolve the duplicates
                if ([...new Set(value)] == 1) {
                    return [...new Set(value)];
                }

                // There was no resolve the duplicates
                return {
                    type: 'false'
                }
            }

            // For "in" filters, we can resolve the issue if, there's overlap between the two value list
            if (filterType === 'in') {

                // The values that are common to both lists
                const sharedValues = [];

                value[0].forEach((a) => {
                    if (value[1].includes(a)) {
                        sharedValues.push(a);
                    }
                });

                // Our values were able to be consolidated down to an "is"
                if (sharedValues.length > 0) {
                    return {
                        type: 'is',
                        attribute,
                        value: sharedValues.pop()
                    };
                }

                // Otherwise, no resolving the multiple "in" lists
                return {
                    type: 'false'
                }
            }
        }

        // Otherwise, there was no need for a resolution
        return filter;
    }
};

module.exports = checkForNestedCollisions;