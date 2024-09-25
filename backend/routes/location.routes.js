import express from 'express';
import axios from 'axios';

const router = express.Router();

// Route to hit Indian PINCODE endpoint and return area information
router.post('/pincode', async (req, res) => {
  try {
    // Extract the pincode from the request body
    const { pincode } = req.body;

    if (!pincode) {
      return res.status(400).json({ success: false, message: 'Pincode is required.' });
    }

    // Call the external API to get area info based on the pincode
    const areaInfoResponse = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);

    // Check if the response has valid data
    const areaInfo = areaInfoResponse.data;

    if (areaInfo && areaInfo[0].Status === 'Success') {
      const postOfficeDetails = areaInfo[0].PostOffice;

      // Parse and format the details as needed
      const formattedDetails = postOfficeDetails.map((office) => ({
        name: office.Name,
        branchType: office.BranchType,
        deliveryStatus: office.DeliveryStatus,
        district: office.District,
        state: office.State,
        country: office.Country,
      }));

      // Return the area details in the response
      return res.json({
        success: true,
        message: areaInfo[0].Message,
        postOffices: formattedDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Invalid pincode or no data found',
      });
    }
  } catch (err) {
    console.error('Error fetching area information:', err);

    // Handle errors and return a proper response
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching area information',
      error: err.message,
    });
  }
});

export default router;
