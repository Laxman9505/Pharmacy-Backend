"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTooLargeError = exports.ServerError = exports.NotAuthorized = exports.BadRequestError = exports.JoiRequestValidationError = exports.CustomError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class CustomError extends Error {
    constructor(message) {
        super(message);
    }
    serializeError() {
        var _a;
        return {
            message: (_a = this.message) !== null && _a !== void 0 ? _a : "Something Went Wrong",
            status: this.status,
            statusCode: this.statusCode,
        };
    }
}
exports.CustomError = CustomError;
class JoiRequestValidationError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
        this.status = "error";
    }
}
exports.JoiRequestValidationError = JoiRequestValidationError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
        this.status = "error";
    }
}
exports.BadRequestError = BadRequestError;
class NotAuthorized extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.UNAUTHORIZED;
        this.status = "error";
    }
}
exports.NotAuthorized = NotAuthorized;
class ServerError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.SERVICE_UNAVAILABLE;
        this.status = "error";
    }
}
exports.ServerError = ServerError;
class FileTooLargeError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.default.REQUEST_TOO_LONG;
        this.status = "error";
    }
}
exports.FileTooLargeError = FileTooLargeError;
