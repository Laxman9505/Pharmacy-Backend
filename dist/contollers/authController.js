"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOTP = exports.login = exports.onBoardUser = exports.sendOtpCodeToEmailOnBoarding = exports.sendOTPFor2fa = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = __importDefault(require("lodash"));
const otpModal_1 = __importDefault(require("../modal/otpModal"));
const userModal_1 = __importDefault(require("../modal/userModal"));
const transporter_1 = __importDefault(require("../utils/transporter"));
// Send OTP code to user's email during registration
function sendOTPFor2fa(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        yield transporter_1.default.sendMail({
            from: process.env.GOOGLE_USER_ID,
            to: email,
            subject: "2FA Verification",
            html: `<!DOCTYPE html>
<html>
<head>
  <title>OTP Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    h1 {
      color: #333;
      margin-top: 0;
    }
    p {
      margin-bottom: 20px;
    }
    .otp {
      background-color: #007bff;
      color: #fff;
      padding: 10px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>POS System</h1>
    <p>Dear User,</p>
    <p>Your One-Time Password (OTP) for login is:</p>
    <div class="otp">${otpCode}</div>
    <p>Please enter this OTP to complete your login process.</p>
    <div class="footer">
      <p>Thank you!</p>
    </div>
  </div>
</body>
</html>
`,
        });
        // Save the OTP in the database
        const otpData = {
            email: email,
            otp: otpCode,
            createdAt: new Date(),
        };
        yield otpModal_1.default.create(otpData);
    });
}
exports.sendOTPFor2fa = sendOTPFor2fa;
function sendOtpCodeToEmailOnBoarding(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Email } = req.body;
        try {
            // Generate a random 6-digit OTP code
            const otpCode = Math.floor(100000 + Math.random() * 900000);
            // Send the OTP code to the user's email
            yield transporter_1.default.sendMail({
                from: process.env.GOOGLE_USER_ID,
                to: Email,
                subject: "Registration OTP",
                html: `<!DOCTYPE html>
<html>
<head>
  <title>OTP Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    h1 {
      color: #333;
      margin-top: 0;
    }
    p {
      margin-bottom: 20px;
    }
    .otp {
      background-color: #007bff;
      color: #fff;
      padding: 10px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>POS System</h1>
    <p>Dear User,</p>
    <p>Your One-Time Password (OTP) for registration is:</p>
    <div class="otp">${otpCode}</div>
    <p>Please enter this OTP to complete your registration process.</p>
    <div class="footer">
      <p>Thank you!</p>
    </div>
  </div>
</body>
</html>
`,
            });
            // Save the OTP in the database
            const otpData = {
                email: Email,
                otp: otpCode,
                createdAt: new Date(),
            };
            yield otpModal_1.default.create(otpData);
            // Return a success response
            return res.status(200).json({ message: "OTP code sent successfully" });
        }
        catch (error) {
            console.error("Failed to send OTP code:", error);
            return res.status(500).json({ message: "Something Went Wrong !" });
        }
    });
}
exports.sendOtpCodeToEmailOnBoarding = sendOtpCodeToEmailOnBoarding;
// Onboard a user
function onBoardUser(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // Validate the request body
        console.log("Request body", req.body.Request);
        console.log("file", req.file);
        const userData = JSON.parse(req.body.Request);
        const { Password, ConfirmPassword } = userData;
        // Password length check
        if (Password.length < 8 || Password.length > 12) {
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ message: "Password must be between 8 to 12 characters." });
        }
        // Password complexity check
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])[\w!@#\$%\^&\*]+$/;
        if (!passwordRegex.test(Password)) {
            return res.status(400).json({
                message: "Password must include uppercase letters, lowercase letters, numbers, and special characters.",
            });
        }
        const commonPasswords = ["password", "123456", "qwerty"];
        if (commonPasswords.includes(Password.toLowerCase())) {
            return res.status(400).json({
                message: "Common passwords are not allowed. Choose a more unique password.",
            });
        }
        // ConfirmPassword check
        if (Password !== ConfirmPassword) {
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ message: "Passwords do not match." });
        }
        if (!req.file) {
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ message: "No file uploaded" });
        }
        try {
            // Retrieve the user data from the database
            const existingUser = yield userModal_1.default.findOne({ Email: userData.Email });
            // Check against the password history
            if (existingUser &&
                ((_a = existingUser.PreviousPasswords) === null || _a === void 0 ? void 0 : _a.includes(userData.Password))) {
                return res
                    .status(http_status_codes_1.default.BAD_REQUEST)
                    .json({ message: "Cannot reuse recent passwords." });
            }
            // Retrieve the OTP data from the database
            // const otpData = await OtpModel.findOne({ email: userData.Email });
            // Validate the OTP code (compare with the user-provided OTP code)
            // && otpData.otp == userData.OTP
            if (true) {
                // Create a new user document
                const user = new userModal_1.default({
                    FullName: userData.FullName,
                    Password: yield bcrypt_1.default.hash(userData.Password, 10),
                    Email: userData.Email,
                    ConfirmPassword: yield bcrypt_1.default.hash(userData.ConfirmPassword, 10),
                    PhoneNumber: userData.PhoneNumber,
                    CountryId: userData.CountryId,
                    CityId: userData.CityId,
                    UserImage: req.file.filename,
                });
                // Save the user to the database
                yield user.save();
                // Returning json web token
                const payload = {
                    userId: user._id,
                    fullName: user.FullName,
                    email: user.Email,
                };
                const token = jsonwebtoken_1.default.sign(payload, process.env.SIGNATURE || "", {
                    expiresIn: "1d",
                });
                // await OtpModel.findByIdAndDelete(otpData._id);
                // Return a success response
                return res.status(http_status_codes_1.default.CREATED).json({ token, user });
            }
            else {
            }
        }
        catch (error) {
            // throw new Error("Something Went Wrong !!");
            console.log("error", error);
            return res
                .status(http_status_codes_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    });
}
exports.onBoardUser = onBoardUser;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Email, Password } = req.body;
        const foundUser = yield userModal_1.default.findOne({ Email });
        if (!foundUser) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                status: "error",
                message: "Inavalid Credentials !",
                statusCode: http_status_codes_1.default.BAD_REQUEST,
            });
        }
        const isValidPassword = yield bcrypt_1.default.compare(Password, foundUser.Password);
        // Helper function to handle failed login attempts
        function handleFailedLogin(user) {
            return __awaiter(this, void 0, void 0, function* () {
                // Increment failed login attempts and update timestamp
                user.FailedLoginAttempts += 1;
                user.LastFailedLogin = new Date();
                yield user.save();
                // Check if account should be locked
                const maxFailedAttempts = 3; // Set your desired maximum failed attempts
                if (user.FailedLoginAttempts >= maxFailedAttempts) {
                    const lockoutDurationMinutes = 30; // Set your desired lockout duration in minutes
                    const lockoutEndTime = new Date();
                    lockoutEndTime.setMinutes(lockoutEndTime.getMinutes() + lockoutDurationMinutes);
                    user.LockoutEndTime = lockoutEndTime;
                    yield user.save();
                    return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                        status: "error",
                        message: `Account locked due to too many failed login attempts. Please try again after ${lockoutDurationMinutes} minutes.`,
                        statusCode: http_status_codes_1.default.UNAUTHORIZED,
                    });
                }
                // Return failed login response
                return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                    status: "error",
                    message: "Invalid Credentials!",
                    statusCode: http_status_codes_1.default.UNAUTHORIZED,
                });
            });
        }
        if (!isValidPassword) {
            return handleFailedLogin(foundUser);
        }
        // // Check if the account is locked
        // if (foundUser.LockoutEndTime && foundUser.LockoutEndTime > new Date()) {
        //   const remainingLockoutTimeMs =
        //     foundUser.LockoutEndTime?.getTime() - new Date().getTime();
        //   const remainingLockoutTimeMinutes = remainingLockoutTimeMs
        //     ? Math.ceil(remainingLockoutTimeMs / (60 * 1000))
        //     : 0;
        //   return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        //     status: "error",
        //     message: `Account locked due to too many failed login attempts. Please try again after ${remainingLockoutTimeMinutes} minutes.`,
        //     statusCode: HTTP_STATUS.UNAUTHORIZED,
        //   });
        // }
        // Check for password expiry
        const currentDate = new Date();
        const passwordLastChanged = foundUser.PasswordLastChanged
            ? new Date(foundUser.PasswordLastChanged)
            : new Date(0);
        const passwordExpiryDays = foundUser.PasswordExpiryDays || 0; // Default to 90 days
        // const passwordExpiryDays = 2 / (24 * 60); // Default to 90 days
        // Calculate the difference in days
        // Calculate the difference in days
        const daysSincePasswordChange = (currentDate.getTime() - passwordLastChanged.getTime()) /
            (24 * 60 * 60 * 1000);
        // Check if password needs to be changed
        if (daysSincePasswordChange > passwordExpiryDays) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                status: "error",
                message: "Password expired. Please reset your password.",
                statusCode: http_status_codes_1.default.BAD_REQUEST,
            });
        }
        // Reset failed login attempts if login is successful
        foundUser.FailedLoginAttempts = 0;
        yield foundUser.save();
        yield sendOTPFor2fa(Email);
        return res.status(http_status_codes_1.default.OK).json({
            status: "success",
            message: "OTP sent to your email for 2FA verification.",
            statusCode: http_status_codes_1.default.OK,
        });
        // const payload = {
        //   userId: foundUser._id,
        //   fullName: foundUser.FullName,
        //   email: foundUser.Email,
        // };
        // const token = jwt.sign(payload, process.env.SIGNATURE || "", {
        //   expiresIn: "1d",
        // });
        // const trimmedUser = _.omit(foundUser, [
        //   "_v",
        //   "_id",
        //   "Password",
        //   "ConfirmPassword",
        // ]);
        // return res.status(HTTP_STATUS.OK).json({ token, user: trimmedUser });
    });
}
exports.login = login;
function validateOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Email, OTP } = req.body;
        // Find the user by email
        const foundUser = yield userModal_1.default.findOne({ Email });
        if (!foundUser) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                status: "error",
                message: "Invalid Email!",
                statusCode: http_status_codes_1.default.BAD_REQUEST,
            });
        }
        // Find the OTP in the database
        const otpData = yield otpModal_1.default.findOne({ email: Email, otp: OTP });
        if (!otpData) {
            return res.status(http_status_codes_1.default.UNAUTHORIZED).json({
                status: "error",
                message: "Invalid OTP!",
                statusCode: http_status_codes_1.default.UNAUTHORIZED,
            });
        }
        // Clear the OTP after successful verification
        yield otpModal_1.default.deleteOne({ email: Email, otp: OTP });
        const payload = {
            userId: foundUser._id,
            fullName: foundUser.FullName,
            email: foundUser.Email,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SIGNATURE || "", {
            expiresIn: "1d",
        });
        const trimmedUser = lodash_1.default.omit(foundUser, [
            "_v",
            "_id",
            "Password",
            "ConfirmPassword",
        ]);
        return res.status(http_status_codes_1.default.OK).json({ token, user: trimmedUser });
    });
}
exports.validateOTP = validateOTP;
