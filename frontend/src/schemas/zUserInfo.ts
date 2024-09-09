import { z } from 'zod'

export const userDetailsSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(['Male', 'Female', 'Other']),
})

export const hobbiesSchema = z.object({
  nature: z.enum(['introvert', 'extrovert', 'ambivert']),
  dietaryPreferences: z.enum(['Vegetarian', 'Non-Vegetarian', 'Vegan']),
  workStyle: z.enum(['Works From Home', 'Goes To Office', 'Hybrid']),
  workHours: z.enum(['Daytime Shift', 'Nighttime Shift', 'Flexible']),
  smokingPreference: z.enum(['Smoker', 'Non-Smoker']),
  drinkingPreference: z.enum(['Drinker', 'Non-Drinker', 'Social Drinker']),
  guestPolicy: z.enum([
    'No Guests',
    'Have Guests Over Rarely',
    'Have Guests Over Often',
  ]),
  regionalBackground: z.string(),
  interests: z.array(z.string()),
})

export const preferencesSchema = z.object({
  locationPreferences: z.array(z.string()),
  nonVegPreference: z.enum([
    'Yes, I’m comfortable with it',
    'No, I’m not comfortable with it',
  ]),
  lease: z.string(),
})

export const userSchema = z.object({
  verified: z.boolean(),
  registered: z.boolean(),
  userDetails: userDetailsSchema,
  hobbies: hobbiesSchema,
  preferences: preferencesSchema,
})
