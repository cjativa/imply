/** Custom error class for providing context on general malformed filter */
class MalformedFilterError {
    constructor(detailedMessage) {
        this.errorMessage = `Malformed filter error - ${detailedMessage}`;
    }
};

module.exports = {
    MalformedFilterError
}