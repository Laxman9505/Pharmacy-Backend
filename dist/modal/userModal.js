"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the User schema
const UserSchema = new mongoose_1.Schema({
    FullName: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    ConfirmPassword: { type: String, required: true },
    PhoneNumber: { type: String, required: true },
    UserImage: { type: String },
    PreviousPasswords: [{ type: String }],
    PasswordLastChanged: { type: Date, default: Date.now },
    PasswordExpiryDays: { type: Number, default: 90 },
    FailedLoginAttempts: { type: Number, default: 0 },
    LastFailedLogin: { type: Date },
    LockoutEndTime: { type: Date }, // Timestamp indicating when the lockout ends
});
// Middleware to hash password before saving
UserSchema.pre("save", function (next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("Password")) {
            user.PasswordLastChanged = Date.now();
            // Add the current password to the list of previous passwords
            (_a = user.PreviousPasswords) === null || _a === void 0 ? void 0 : _a.push(user.Password);
        }
        next();
    });
});
const userModel = mongoose_1.default.model("Users", UserSchema);
exports.default = userModel;
