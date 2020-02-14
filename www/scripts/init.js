"use strict";

let indexedDB;
let IDBTransaction;
let openRequest;
let db;

let LANGUAGE = 'En';
let TEXT = {};
let DOCTORS = {};
let SYMPTOMS = {};
let GENDER;
let DEFINED_USER = false;
let DISEASE = {};
let MODEL = {};

let pageContent = document.getElementById('page_content');

function init(){
  console.log('Connecting to indexedDB...');
  indexedDB = window.indexedDB;
  IDBTransaction = window.IDBTransaction;
  openRequest = indexedDB.open('MedicalStore', 1);

  openRequest.onupgradeneeded = function() {
    console.log("System creates tables.");
    db = openRequest.result;
    let dbInfoStore = db.createObjectStore('InfoStore');
    let dbTextNote = db.createObjectStore('TextNote', { keyPath: 'id', autoIncrement: true });
    let dbVoiceRecord = db.createObjectStore('VoiceRecord');
    let dbPhotoImage = db.createObjectStore('PhotoImage');
    DEFINED_USER = false;
    dbInfoStore.transaction.oncomplete = function() {
      completeDB();
    }
  };

  openRequest.onerror = function() {
    console.error("Error", openRequest.error);
    userMessage('Error while working with database!');
  };

  openRequest.onsuccess = function() {
    console.log("The connection is successful!");
    if (!db) db = openRequest.result;
    let transaction = db.transaction("InfoStore", "readonly");
    let userInfo = transaction.objectStore("InfoStore");
    let getAppText = userInfo.get('textData');
    getAppText.onsuccess = function() {
      TEXT = getAppText.result;
      let getDoctors = userInfo.get('doctorsData');
      getDoctors.onsuccess = function() {
        DOCTORS = getDoctors.result;
        let getSymptoms = userInfo.get('symptomsData');
        getSymptoms.onsuccess = function() {
          SYMPTOMS = getSymptoms.result;
          let request = userInfo.get('userData');
          request.onsuccess = function() {
            upload_neural_data(userInfo);
            if (request.result === undefined){
              initHistory('settings_page');
              settings_page();
            } else {
              DEFINED_USER = true;
              LANGUAGE = request.result.lang;
              GENDER = request.result.gender;
              initHistory('main_page');
              main_page();
            }
          }
        }
      }
    }
  }
}

function upload_neural_data(userInfo){
  let getDisease = userInfo.get('diseaseData');
  getDisease.onsuccess = function() {
    DISEASE = getDisease.result;
    let getModel = userInfo.get('modelData');
    getModel.onsuccess = function() {
      MODEL = getModel.result;
    }
  }
}
