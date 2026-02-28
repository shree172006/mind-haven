// functions/index.js

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true }); // Allows your frontend to call this API
const admin = require("firebase-admin");

// Initialize the admin SDK (will use service account set up by Firebase tooling)
admin.initializeApp();

// Import our custom logic
const security = require("./security");
const scoring = require("./scoringLogic");

// Create an HTTPS API Endpoint that returns a score as before
exports.processAssessment = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if (request.method !== "POST") {
            return response.status(405).send({ error: "Method Not Allowed" });
        }

        try {
            const validAnswers = security.validateAnswers(request.body);
            const result = scoring.calculateResult(validAnswers);
            return response.status(200).send({ success: true, data: result });
        } catch (error) {
            console.error("Assessment Error:", error.message);
            return response.status(400).send({ success: false, error: error.message });
        }
    });
});

// New endpoint to save completed result objects to Firestore
exports.saveAssessment = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if (request.method !== "POST") {
            return response.status(405).send({ error: "Method Not Allowed" });
        }

        const data = request.body;
        // Basic sanity check
        if (!data || typeof data !== 'object' || !data.timestamp) {
            return response.status(400).send({ success: false, error: 'Invalid result object' });
        }

        admin.firestore().collection('results').add(data)
            .then(docRef => {
                return response.status(200).send({ success: true, id: docRef.id });
            })
            .catch(err => {
                console.error('Firestore write error', err);
                return response.status(500).send({ success: false, error: err.message });
            });
    });
});