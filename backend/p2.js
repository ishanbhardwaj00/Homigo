// 74069165-6496-43c8-b372-4b67221961e5

// const id = 'abc3a55c-fe06-454d-939a-32440d9af741'
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config(); // Load environment variables if any (optional)

const app = express();
async function test(){
const options2 = {

        method: 'get',
        url: `https://dg-sandbox.setu.co/api/okyc/86e8f563-d4d4-4531-8cfc-9b94ff8f7b3b/initiate`,
        headers: {
          'x-client-id': '3f94a27f-fc95-45d8-bc20-d4da5f5d7331',
          'x-client-secret': 'ag9TngY8kxdxfMZwq3sFrOPoFHVyma2b',
          'x-product-instance-id': '20c6cfbb-2cc3-4e26-b2b7-4638a3b7ddac',
          'Content-Type': 'application/json',
        }
      };
  
const response2 = await axios.request(options2);
  
    // Log the second response
console.log("Response from second request:", response2.data);
    }

await test()


// async function t1() {
//     try {
//       const response = await fetch("https://dg-sandbox.setu.co/api/okyc/6b70bcd2-05f2-413c-86e0-0d943ea98f63/initiate", {
//         headers: {
//           'x-client-id': '3f94a27f-fc95-45d8-bc20-d4da5f5d7331',
//           'x-client-secret': 'ag9TngY8kxdxfMZwq3sFrOPoFHVyma2b',
//           'x-product-instance-id': '20c6cfbb-2cc3-4e26-b2b7-4638a3b7ddac',
//           'Content-Type': 'application/json',
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }}
    
//     await t1();