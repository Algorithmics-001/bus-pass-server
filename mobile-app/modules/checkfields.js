function checkMissingFields(query, requiredFields) {
    const missingFields = [];
    requiredFields.forEach(field => {
        if (!query[field]) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        return {
            status: false,
            message: `Missing fields: ${missingFields.join(', ')}`
        };
    } else {
        return {
            status: true
        };
    }
}

// Middleware function to attach checkFields to the request object
function attachCheckFields(req, res, next) {
    req.checkFields = (requiredFields) => {
        return checkMissingFields(req.body, requiredFields);
    };
    next();
}

module.exports = { checkMissingFields, attachCheckFields };
