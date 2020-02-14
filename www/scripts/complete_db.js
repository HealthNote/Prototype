function completeDB(){
  let scriptsDiv = document.getElementById('all_scripts');
  let transaction = db.transaction("InfoStore", "readwrite");
  let infoStore = transaction.objectStore("InfoStore");

  let text = { En: en_text, Ru: ru_text };
  let symptoms = { En: en_symptoms, Ru: ru_symptoms };
  let doctors = { En: en_doctors, Ru: ru_doctors };

  // Neutal Network
  let model = {
    weights_hidden: neural_model.weights_hidden,
    bias_hidden: neural_model.bias_hidden,
    weights_out: neural_model.weights_out,
    bias_out: neural_model.bias_out,
  }
  let diseaseInfo = {
    symptoms: symptoms_for_disease,
    doctor: disease
  }

  let request_text = infoStore.put(text, 'textData');
  request_text.onsuccess = function() {
    console.log("The system has updated the", request_text.result);
    let request_symptoms = infoStore.put(symptoms, 'symptomsData');
    request_symptoms.onsuccess = function() {
      console.log("The system has updated the", request_symptoms.result);
      let request_doctors = infoStore.put(doctors, 'doctorsData');
      request_doctors.onsuccess = function() {
        console.log("The system has updated the", request_doctors.result);

        //Neural Network
        let request_model = infoStore.put(model, 'modelData');
        request_model.onsuccess = function() {
          console.log("The system has updated the", request_model.result);
          let request_disease = infoStore.put(diseaseInfo, 'diseaseData');
          request_disease.onsuccess = function() {
            console.log("The system has updated the", request_disease.result);
          }
        }

      }
    }
  };

}
