/**
 * Uniform Response Utility
 * Standardizes API responses across the application
 */

/**
 * Success Response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object|Array} data - Data to send (optional)
 * @param {number} statusCode - HTTP status code (default 200)
 */
exports.success = (res, message, data = null, statusCode = 200) => {
    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
        // Add count if data is an array
        if (Array.isArray(data)) {
            response.count = data.length;
        }
    }

    return res.status(statusCode).json(response);
};

/**
 * Error Response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {Object|Array} errors - Detailed errors (optional)
 */
exports.error = (res, message, statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors !== null) {
        response.errors = errors;
    }

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development' && message instanceof Error) {
        response.dev_error = message.message;
        response.stack = message.stack;
        response.message = 'Internal Server Error';
    }

    return res.status(statusCode).json(response);
};

/**
 * Paginated Response
 * @param {Object} res - Express response object
 * @param {Array} data - Paginated data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} totalItems - Total records in DB
 */
exports.paginated = (res, data, page, limit, totalItems) => {
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
        success: true,
        data,
        pagination: {
            totalItems,
            totalPages,
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    });
};
