import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import User from '../backend/models/auth.js';
import mongoose from 'mongoose'

dotenv.config(); // Load environment variables if any (optional)

const app = express();
app.use(express.json());

const cli_id = '3f94a27f-fc95-45d8-bc20-d4da5f5d7331'
const cli_sec = 'ag9TngY8kxdxfMZwq3sFrOPoFHVyma2b'
const prod_id = '20c6cfbb-2cc3-4e26-b2b7-4638a3b7ddac'
// const captha = '2GAD0'
const adhr_num = 123456
const otp = 123456
const shareCode=1234
app.get('/test-axios', async (req, res) => {
    try {
      // First request to get the `id`
      const options1 = {
        method: 'post',
        url: 'https://dg-sandbox.setu.co/api/okyc',
        headers: {
          'x-client-id': cli_id,
          'x-client-secret': cli_sec,
          'x-product-instance-id': prod_id,
        },
        data: { redirectURL: 'https://setu.co' }
      };
  
      const response1 = await axios.request(options1);
  
      // Extract the `id` from the first response
      const st_id1 = response1.data.id;
      console.log("ID from first request:", id);
  
      // Now make the second request using the extracted `id`
      const options2 = {
        method: 'get',
        url: `https://dg-sandbox.setu.co/api/okyc/${st_id1}/initiate`,
        headers: {
          'x-client-id': cli_id,
          'x-client-secret': cli_sec,
          'x-product-instance-id': prod_id,
          'Content-Type': 'application/json',
        }
      };
  
      const response2 = await axios.request(options2);
  
      // Log the second response
      console.log("Response from second request:", response2.data);

      const reqId = response2.data.id

      const captha_img = response2.data.captchaImage


  
      // Send the combined result to the client
      res.json({ 
        firstRequest: response1.data, 
        requestId: reqId, 

        captha_image: captha_img 
        });



  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while making the requests');
    }



  });
  

app.get('/', (req,res) => {
    res.send("Work in progress")
})

mongoose.connect('mongodb+srv://arjunvirm:Bravearcher20@cluster0.0cg5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.error('MongoDB connection error:', err));


// POST route to create a new user
app.post('/api/users/login', async (req, res) => {
  try {
      // Create a new user instance using the request body
      const newUser = new User({
          userCred: {
              email: req.body.userCred.email,
              password: req.body.userCred.password,
          },
          userDet: {
              gender: req.body.userDet.gender,
              fullName: req.body.userDet.fullName,
              dateOfBirth: new Date(req.body.userDet.dateOfBirth),
          },
          metaDat: {
              image: req.body.metaDat.image,
              bio: req.body.metaDat.bio,
              monthlyRent: req.body.metaDat.monthlyRent,
          }
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      res.status(201).json(savedUser); // Send the saved user back in the response

  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



