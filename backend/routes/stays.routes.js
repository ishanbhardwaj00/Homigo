import express from 'express'

const router = express.Router()

router.get('/stays', async (req, res) => {
    try {
        // Assuming the request contains a JSON body with rentPreference and location
        const { rentPreference, location } = req.body;

        // Check if token exists (you can add JWT verification logic here)
        // const token = req.headers['authorization']; // Example of how to get token from headers
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Send the data to the Flask endpoint at localhost:8080/eco
        const flaskResponse = await axios.post('http://localhost:8080/eco', {
            rentPreference,
            location
        },);

        // Respond back to the client with Flask's response
        return res.status(200).json({
            success: true,
            data: flaskResponse.data
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;