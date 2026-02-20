// functions/index.js

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true }); // Allows your frontend to call this API

// Import our custom logic
const security = require("./security");
const scoring = require("./scoringLogic");

// Create an HTTPS API Endpoint
exports.processAssessment = functions.https.onRequest((request, response) => {
    // Wrap everything in CORS so the browser doesn't block it
    cors(request, response, () => {
        
        // Only allow POST requests
        if (request.method !== "POST") {
            return response.status(405).send({ error: "Method Not Allowed" });
        }

        try {
            // 1. Validate the incoming data (Security)
            const validAnswers = security.validateAnswers(request.body);

            // 2. Calculate the score (Logic)
            const result = scoring.calculateResult(validAnswers);

            // 3. Send the secure result back to the frontend
            return response.status(200).send({ success: true, data: result });

        } catch (error) {
            // If validation fails, safely send an error without crashing the server
            console.error("Assessment Error:", error.message);
            return response.status(400).send({ success: false, error: error.message });
        }
    });
});