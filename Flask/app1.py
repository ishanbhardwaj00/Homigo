from flask import Flask, request, render_template
import pandas as pd
import ast
import re
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import OneHotEncoder,OrdinalEncoder
from sklearn.compose import ColumnTransformer
import numpy as np

app=Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            with open('output.csv', 'rb') as f:
                df=pd.read_csv('output.csv')
            df=df[df['profileCompleted']==True]
            df.drop(columns=['__v','profileCompleted'],inplace=True)

            rows = []
            for i in df['userCred']:
                json_string = i.replace("'", '"')
                dict1=ast.literal_eval(json_string)
                li=[]
                for key, value in dict1.items():
                    li.append(value)
                    break
                rows.append(li)
            df1 = pd.DataFrame(rows, columns=['Email'])

            rows = []
            for i in df['hobbies']:
                json_string = i.replace("'", '"')
                dict1=ast.literal_eval(json_string)
                li=[]
                for key, value in dict1.items():
                    li.append(value)
                rows.append(li)
            cols=(list(dict1.keys()))
            df2 = pd.DataFrame(rows, columns=cols)

            rows = []
            for i in df['preferences']:
                json_string = i.replace("'", '"')
                dict1=ast.literal_eval(json_string)
                li=[]
                for key, value in dict1.items():
                    li.append(value)
                rows.append(li)
            cols=(list(dict1.keys()))
            df3 = pd.DataFrame(rows, columns=cols)

            rows = []
            pattern = r"monthlyRent\':\s*(\d+)"
            for i in df['metaDat']:
                match=re.search(pattern,i)
                ans=int(match.group(1))
                rows.append(ans)
            df4 = pd.DataFrame(rows, columns=['monthlyrent'])

            rows = []
            gender_pattern = r"'gender':\s*'(\w+)'"
            dob_pattern = r"datetime\.datetime\((\d{4}),"
            for i in df['userDetails']:
                gender_match = re.search(gender_pattern, i)
                dob_match = re.search(dob_pattern, i)
                gender = gender_match.group(1)
                age = 2024-int(dob_match.group(1))
                rows.append([gender,age])
            df5 = pd.DataFrame(rows, columns=['Gender','age'])
            new_df = pd.concat([df1,df2,df3,df4,df5],axis=1)
            new_df['Gender'].replace('Other','Male',inplace=True)


            age_groups = []
            # Iterate over each age in the DataFrame
            for age in new_df['age']:
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
            for rent in new_df['monthlyrent']:
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
            interest=new_df['interests']
            binary_interest = pd.DataFrame(interest.apply(convert_interest).tolist(), columns=['Books','Movies','Gym','Travelling','Sports','Dance','Partying','Gaming','Music','Cooking','Anime'],index=new_df.index)
            new_df=pd.concat([new_df,binary_interest],axis=1)

            def convert_location(row):
                columns = ['Near Cyberhub','Near Unitech Cyberpark','Near Golf Course Ext','Near Millenium City Centre','Near Old Gurgaon','Near IMT Manesar','Near Phase II']
                return [1 if col in row else 0 for col in columns]
            location=new_df['location']
            binary_location = pd.DataFrame(location.apply(convert_location).tolist(), columns=['Near Cyberhub','Near Unitech Cyberpark','Near Golf Course Ext','Near Millenium City Centre','Near Old Gurgaon','Near IMT Manesar','Near Phase II'],index=new_df.index)
            new_df= pd.concat([new_df, binary_location], axis=1)

            input_email =(request.form['email'])
            new_user=new_df[new_df['Email']==input_email].copy()

            if new_user['Gender'].values[0]=='Male':
                new_df=new_df[new_df['Gender']=='Male']
            else:
                new_df=new_df[new_df['Gender']=='Female']

            new_df = new_df.drop(columns=['Email', 'nature', 'dietaryPreferences','interests','location','monthlyrent','Gender','age'])
            new_user = new_user.drop(columns=['Email', 'nature', 'dietaryPreferences','interests','location','monthlyrent','Gender','age'])

            transformer=ColumnTransformer(transformers=[('tnf1',OrdinalEncoder(categories=[['Non-Smoker','Smoker']]),['smokingPreference']),
                                            ('tnf2',OrdinalEncoder(categories=[['Have Guests Over Rarely','Have Guests Over Occasionally','Have Guests Over Often']]),['guestPolicy']),
                                            ('tnf3',OrdinalEncoder(categories=[['Works From Home','Hybrid Work Setting','Goes To Office']]),['workStyle']),
                                            ('tnfhobbies4',OrdinalEncoder(categories=[['Teetotaller','Social Drinker','Frequent Drinker']]),['drinkingPreference']),
                                            ('tnf5',OneHotEncoder(drop='first'),['workHours']),
                                            ('tnf6',OrdinalEncoder(categories=[['0-5000','5000-10000','10000-15000','15000-20000','20000-25000','25000-30000','30000-35000','35000-40000','40000-45000','45000-50000','50000-55000','55000-60000','60000-65000','65000-70000','70000-75000','75000-80000','80000-85000','85000-90000','90000-95000','95000-100000','100000+']]),['rent_group']),
                                            ('tnf7',OneHotEncoder(drop='first'),['regionalBackground']),
                                            ('tnf8',OneHotEncoder(drop='first'),['nonVegPreferences']),
                                            ('tnf9',OrdinalEncoder(categories=[['No lease','3 months','6 months','12 months']]),['lease']),
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

            neighbors_list = nearest_profiles.to_dict(orient='records')
            return rm.to_json()

        except Exception as e:
            return render_template('index.html', error=str(e))
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)