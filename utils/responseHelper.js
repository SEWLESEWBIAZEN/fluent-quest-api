
function createResponse({ statusCode = 200, success = true, message = '', data = null }) {
    return {
        statusCode,
        success,
        message,
        data,
    };
}

module.exports = { createResponse };
