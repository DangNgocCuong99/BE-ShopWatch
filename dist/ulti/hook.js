"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.errorReturn = exports.dataReturn = void 0;
const dataReturn = (data, message) => {
    return {
        status: true,
        data: data,
        message: message
    };
};
exports.dataReturn = dataReturn;
const errorReturn = (message) => {
    return {
        status: false,
        message: message
    };
};
exports.errorReturn = errorReturn;
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=hook.js.map