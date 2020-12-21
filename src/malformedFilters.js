/** Custom error class for providing context on general malformed filter */
class MalformedFilterError extends Error {
    constructor(detailedMessage) {
        super(`Malformed filter error - ${detailedMessage}`);
    }
};

module.exports = {
    MalformedFilterError
}