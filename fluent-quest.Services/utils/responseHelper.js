
function createResponse({ fromCache = false, statusCode = 200, success = true, message = '', data = null }) {
    return {
        fromCache,
        statusCode,
        success,
        message,
        data,
    };
}

module.exports = { createResponse };
