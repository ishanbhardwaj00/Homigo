// utils/otpGenerator.js
import OTP from "../models/otp.model";  // Ensure the OTP model is imported

// Function to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit OTP
};

// Function to generate OTP expiry (5 minutes from now)
function generateOTPExpiry() {
    const now = new Date();
    return new Date(now.getTime() + 5 * 60000); // 5 minutes later
}

// Function to create or update OTP and its expiry for a particular email
async function updateOTPForUser(email, otp, otpExpiry) {
    try {
        // Update or create OTP document for the specified email
        await OTP.findOneAndUpdate(
            { email },  // Find the document by email
            { 
                value: otp,      // Set the new OTP (field name should be 'value')
                expiry: otpExpiry  // Set the new expiry time
            },
            { new: true, upsert: true }  // Create a new document if one doesn't exist
        );

        console.log(`OTP for ${email} is ${otp} and will expire at ${otpExpiry}`);
    } catch (error) {
        console.error("Error updating OTP for user:", error);
    }
}

// Export the necessary functions
export { generateOTP, generateOTPExpiry, updateOTPForUser };
