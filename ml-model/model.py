import numpy as np
import joblib


with open('./data.sav', 'rb') as f:
    data_dict = joblib.load(f)

lmodel =  joblib.load("./model.sav")


def predict_disease(symptoms):
    input_data = [0] * len(data_dict["symptom_index"])

    for symptom in symptoms:
        index = data_dict["symptom_index"][symptom]
        input_data[index] = 1
    input_data = np.array(input_data).reshape(1,-1)

    nb_prediction = data_dict["predictions_classes"][lmodel.predict(input_data)[0]]

    return nb_prediction


# print(predict_disease(['Itching', 'Skin Rash', 'Nodal Skin Eruptions']))
# print(predict_disease(['Continuous Sneezing', 'Knee Pain', 'Stiff Neck']))
