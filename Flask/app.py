from flask import Flask, request, jsonify, render_template
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import pandas as pd
from io import BytesIO
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import OneHotEncoder,OrdinalEncoder
from sklearn.compose import ColumnTransformer
import numpy as np
from pymongo import MongoClient
import pandas as pd
import ast

app=Flask(__name__)

def load_and_preprocess_image(file, target_size):
    # Use BytesIO to read the file object
    img = image.load_img(BytesIO(file.read()), target_size=target_size)

    # Convert image to array
    img_array = image.img_to_array(img)

    # Rescale the image
    img_array = img_array / 255.0

    # Expand dimensions to match the input shape
    img_array = np.expand_dims(img_array, axis=0)

    return img, img_array

@app.route('/img')
def img():
    return render_template('index1.html')

@app.route('/predict', methods=['POST'])
def predict():
    model = load_model('Homigo/Flask/my_model.h5')
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    # Check if the file is an image
    if file and file.filename.endswith(('png', 'jpg', 'jpeg')):
        img, img_array = load_and_preprocess_image(file, target_size=(256, 256))  # Adjust size as per model
        prediction = model.predict(img_array)
        
        # Assuming your model outputs a single value or probability, e.g., 0 for fake and 1 for real
        label = 'real' if prediction[0][0] > 0.8 else 'fake'
        
        return jsonify({'prediction': label})
    else:
        return jsonify({'error': 'Invalid file format. Please upload a PNG or JPG image.'}), 400
    

@app.route('/nn', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        mongo_uri = 'mongodb+srv://arjunvirm:Bravearcher20@cluster0.0cg5y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
        
        client = MongoClient(mongo_uri)
        db = client['test']
        collection = db['users']

        print("Connected to mongo")
        # Retrieve data from MongoDB collection
        data = list(collection.find({}))  # You can add query filters inside the find() method if needed

        # Convert MongoDB data to a Pandas DataFrame
        df = pd.json_normalize(data)

        new_df=df[df['profileCompleted']==True]
        new_df.drop(columns=['__v','_id','profileCompleted','userCred.password','userCred.refreshToken','hobbies.nature','hobbies.dietaryPreferences','metaDat.image','metaDat.bio','userDetails.fullName'],inplace=True)
        new_df['userDetails.gender'].replace('Other','Male',inplace=True)
        age_groups = []

        # Iterate over each age in the DataFrame
        for i in new_df['userDetails.dateOfBirth']:
            age=(2024-i.year)
            if age < 21:
                age_groups.append('U21')
            elif 21 <= age <= 24:
                age_groups.append('21-24')
            elif 25 <= age <= 28:
                age_groups.append('25-28')
            else:
                age_groups.append('28+')

        # Assign the age groups to a new column in the DataFrame
        new_df['age_group'] = age_groups

        rent_groups = []

        # Iterate over each rent in the DataFrame
        for rent in new_df['metaDat.monthlyRent']:
            if rent < 5000:
                rent_groups.append('0-5000')
            elif 5000 <= rent < 10000:
                rent_groups.append('5000-10000')
            elif 10000 <= rent < 15000:
                rent_groups.append('10000-15000')
            elif 15000 <= rent < 20000:
                rent_groups.append('15000-20000')
            elif 20000 <= rent < 25000:
                rent_groups.append('20000-25000')
            elif 25000 <= rent < 30000:
                rent_groups.append('25000-30000')
            elif 30000 <= rent < 35000:
                rent_groups.append('30000-35000')
            elif 35000 <= rent < 40000:
                rent_groups.append('35000-40000')
            elif 40000 <= rent < 45000:
                rent_groups.append('40000-45000')
            elif 45000 <= rent < 50000:
                rent_groups.append('45000-50000')
            elif 50000 <= rent < 55000:
                rent_groups.append('50000-55000')
            elif 55000 <= rent < 60000:
                rent_groups.append('55000-60000')
            elif 60000 <= rent < 65000:
                rent_groups.append('60000-65000')
            elif 65000 <= rent < 70000:
                rent_groups.append('65000-70000')
            elif 70000 <= rent < 75000:
                rent_groups.append('70000-75000')
            elif 75000 <= rent < 80000:
                rent_groups.append('75000-80000')
            elif 80000 <= rent < 85000:
                rent_groups.append('80000-85000')
            elif 85000 <= rent < 90000:
                rent_groups.append('85000-90000')
            elif 90000 <= rent < 95000:
                rent_groups.append('90000-95000')
            elif 95000 <= rent < 100000:
                rent_groups.append('95000-100000')
            else:
                rent_groups.append('100000+')

        # Assign the rent groups to a new column in the DataFrame
        new_df['rent_group'] = rent_groups

        def convert_interest(row):
            columns = ['Books','Movies','Gym','Travelling','Sports','Dance','Partying','Gaming','Music','Cooking','Anime']
            return [1 if col in row else 0 for col in columns]
        interest=new_df['hobbies.interests']
        binary_interest = pd.DataFrame(interest.apply(convert_interest).tolist(), columns=['Books','Movies','Gym','Travelling','Sports','Dance','Partying','Gaming','Music','Cooking','Anime'],index=new_df.index)
        new_df=pd.concat([new_df,binary_interest],axis=1)

        def convert_location(row):
            columns = ['Near Cyberhub','Near Unitech Cyberpark','Near Golf Course Ext','Near Millenium City Centre','Near Old Gurgaon','Near IMT Manesar','Near Phase II']
            return [1 if col in row else 0 for col in columns]
        location=new_df['preferences.location']
        binary_location = pd.DataFrame(location.apply(convert_location).tolist(), columns=['Near Cyberhub','Near Unitech Cyberpark','Near Golf Course Ext','Near Millenium City Centre','Near Old Gurgaon','Near IMT Manesar','Near Phase II'],index=new_df.index)
        new_df= pd.concat([new_df, binary_location], axis=1)

        input_email =ast.literal_eval(request.data.decode())['email']
        
        new_user=new_df[new_df['userCred.email']==input_email].copy()

        if new_user['userDetails.gender'].values[0]=='Male':
            new_df=new_df[new_df['userDetails.gender']=='Male']
        else:
            new_df=new_df[new_df['userDetails.gender']=='Female']

        new_df = new_df.drop(columns=['userCred.email','hobbies.interests','preferences.location','userDetails.gender','userDetails.dateOfBirth','metaDat.monthlyRent'])
        new_user=new_user.drop(columns=['userCred.email','hobbies.interests','preferences.location','userDetails.gender','userDetails.dateOfBirth','metaDat.monthlyRent'])

        transformer=ColumnTransformer(transformers=[('tnf1',OneHotEncoder(drop='first'),['hobbies.smokingPreference']),
                                        ('tnf2',OrdinalEncoder(categories=[['Have Guests Over Rarely','Have Guests Over Occasionally','Have Guests Over Often']]),['hobbies.guestPolicy']),
                                        ('tnf3',OrdinalEncoder(categories=[['Works from Home','Hybrid Work Setting','Goes To Office']]),['hobbies.workStyle']),
                                        ('tnf4',OrdinalEncoder(categories=[['Teetotaller','Social Drinker','Frequent Drinker']]),['hobbies.drinkingPreference']),
                                        ('tnf5',OneHotEncoder(drop='first'),['hobbies.workHours']),
                                        ('tnf6',OrdinalEncoder(categories=[['0-5000','5000-10000','10000-15000','15000-20000','20000-25000','25000-30000','30000-35000','35000-40000','40000-45000','45000-50000','50000-55000','55000-60000','60000-65000','65000-70000','70000-75000','75000-80000','80000-85000','85000-90000','90000-95000','95000-100000','100000+']]),['rent_group']),
                                        ('tnf7',OneHotEncoder(drop='first'),['hobbies.regionalBackground']),
                                        ('tnf8',OneHotEncoder(drop='first'),['preferences.nonVegPreferences']),
                                        ('tnf9',OrdinalEncoder(categories=[['No lease','3 months','6 months','12 months']]),['preferences.lease']),
                                        ('tnf10',OrdinalEncoder(categories=[['U21','21-24','25-28','28+']]),['age_group'])],remainder='passthrough')
        
        new_df2=transformer.fit_transform(new_df)
        new_user2=transformer.transform(new_user)

        weights = np.zeros([new_df2[0].shape[0]])
        weights[5]=1
        new_df2=new_df2+weights

        knn = NearestNeighbors(n_neighbors=new_df.shape[0])
        knn.fit(new_df2)
        distances, indices = knn.kneighbors(new_user2)

        # Retrieve the nearest profiles from the original DataFrame
        nearest_profiles = new_df.iloc[indices[0]]
        matches=pd.DataFrame(nearest_profiles[1:])

        ind=matches.index
        render_matches=df.iloc[ind]
        rm=pd.DataFrame(render_matches)

        similarities = np.exp(-0.04 * distances[0][1:])
        similarities=similarities*100
        rm['similar_score']=similarities
        rm=rm.drop(columns=['userCred.refreshToken'])
        # print(rm)
        rm['_id']=rm['_id'].astype(str)
        # print(rm['_id'])
        rm_data=rm.to_dict(orient='records')
        
        
        return rm_data

if __name__ == '__main__':
    app.run(debug=True,port=8080)