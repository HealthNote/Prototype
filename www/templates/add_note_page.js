let select_body_area;
let select_area_part;
let select_symptom;
let symp_info;
let selected_photo;
let selected_voice;

function add_note_page(){
  if (!DEFINED_USER) { settings_page(); return; }
  selected_photo = undefined;
  selected_voice = undefined;
  userMessage('<form id="new_note_form"></form>');
  let new_note_form = document.getElementById('new_note_form');

  let page_name = '<div id="add_note_page_name">' + TEXT[LANGUAGE].newnote.page + '</div>'
  let header_input = '<input type="text" id="add_note_header_input" required placeholder="' + TEXT[LANGUAGE].newnote.header + '" class="add_note_selects">'
  let sba_select = '<select id="select_body_area" class="add_note_selects"></select>';
  let sap_select = '<select id="select_area_part" class="add_note_selects hidden"></select>';
  let ss_select = '<select id="select_symptom" class="add_note_selects hidden"></select>';
  let desc_textarea = '<textarea id="add_note_desc_textarea" placeholder="' + TEXT[LANGUAGE].newnote.description + '"></textarea>'
  let fu_container = '<div id="file_uploader_container"></div>';
  let doctor_select = '<div id="doc_select_block" class="hidden">' + TEXT[LANGUAGE].newnote.doctor + '</div><select id="select_doctor" class="add_note_selects"></select>';
  let save_btn ='<button type="submit" name="Save" class="settings_button" onclick="">' + TEXT[LANGUAGE].newnote.save + '</button>';
  let img_prev_block = '<div class="hidden" id="new_note_img_prev_block"></div>';
  let aud_prev_block = '<div id="new_note_aud_prev_block" class="hidden"></div>';
  let add_select = page_name + header_input + sba_select + sap_select + ss_select + desc_textarea + fu_container + img_prev_block + aud_prev_block + doctor_select + save_btn;
  new_note_form.innerHTML = add_select;

  document.getElementById('new_note_img_prev_block').innerHTML = '<img class="view_page_image" id="new_note_img_prev" src=""/>' +
    '<div class="add_note_small_btn" onclick="drop_img_prev()">' + TEXT[LANGUAGE].newnote.delete + '</div>';
  document.getElementById('new_note_aud_prev_block').innerHTML = '<audio controls id="new_note_aud_prev" class="view_page_audio"></audio>' +
    '<div class="add_note_small_btn" onclick="drop_aud_prev()">' + TEXT[LANGUAGE].newnote.delete + '</div>';

  select_body_area = document.getElementById('select_body_area');
  select_area_part = document.getElementById('select_area_part');
  select_symptom = document.getElementById('select_symptom');
  select_doctor = document.getElementById('select_doctor');
  file_uploader_container = document.getElementById('file_uploader_container');

  symp_info = SYMPTOMS[LANGUAGE];
  docs = DOCTORS[LANGUAGE];

  let photo_upload_img = '<img src="img/camera-icon.png" id="photo_upload_img" class="new_note_icon icon" onclick="">';
  let voice_upload_img = '<img src="img/micro-icon.png" id="voice_upload_img" class="new_note_icon icon" onclick="">';
  let album_upload_img = '<img src="img/album-icon.png" id="album_upload_img" class="new_note_icon icon" onclick="">';
  let image_upload_input = '<input type="file" name="image" class="new_note_hidden_input" id="new_note_hidden_image_input">'
  file_uploader_container.innerHTML = '<div class="new_note_upload_button_div">' + photo_upload_img + '</div>';
  file_uploader_container.innerHTML += '<div class="new_note_upload_button_div">' + image_upload_input + album_upload_img + '</div>';
  file_uploader_container.innerHTML += '<div class="new_note_upload_button_div">' + voice_upload_img + '</div>';
  select_body_area.innerHTML = '<option disabled selected value="">' + TEXT[LANGUAGE].newnote.area + '</option>';

  for (area in symp_info){
    let opt = document.createElement('option');
    opt.value = area;
    opt.innerHTML = symp_info[area].value;
    select_body_area.append(opt);
  }
  select_doctor.innerHTML = '<option disabled selected value="">' + TEXT[LANGUAGE].newnote.choose + '</option>';
  for (doc in docs){
    let opt = document.createElement('option');
    opt.value = doc;
    opt.innerHTML = docs[doc];
    select_doctor.append(opt);
  }

  select_body_area.addEventListener("change", changeAreaOption);
  select_area_part.addEventListener("change", changePartOption);
  select_symptom.addEventListener("change", changeSympOption);
  new_note_form.addEventListener("submit", saveNewNote);

  document.addEventListener('deviceready', function() {
    document.getElementById('photo_upload_img').addEventListener('click', cameraShot);
    document.getElementById('voice_upload_img').addEventListener('click', voiceRec);
  });
  document.getElementById('new_note_hidden_image_input').addEventListener('change', function(event) { defineFile(event.target.files[0]); });
}

function changeAreaOption(){
  current_area = symp_info[select_body_area.value].parts;
  select_area_part.innerHTML = '<option disabled selected value="">' + TEXT[LANGUAGE].newnote.part + '</option>';
  for (part in current_area){
    let opt = document.createElement('option');
    opt.value = part;
    opt.innerHTML = current_area[part].value;
    select_area_part.append(opt);
  }
  select_area_part.style.display = 'block';
  select_symptom.innerHTML = '<option disabled selected value="">' + TEXT[LANGUAGE].newnote.symp + '</option>';
  document.getElementById('doc_select_block').style.display = 'none';
  document.getElementById('select_doctor').value = '';
}

function changePartOption(){
  current_part = symp_info[select_body_area.value].parts[select_area_part.value].symptoms;
  select_symptom.innerHTML = '<option disabled selected value="">' + TEXT[LANGUAGE].newnote.symp + '</option>';
  for (symp in current_part){
    var opt = document.createElement('option');
    opt.value = symp;
    opt.innerHTML = current_part[symp].value;
    select_symptom.append(opt);
  }
  select_symptom.style.display = 'block';
  document.getElementById('doc_select_block').style.display = 'none';
  document.getElementById('select_doctor').value = '';
}

function changeSympOption(){
  document.getElementById('doc_select_block').style.display = 'block';
  let doctor = symp_info[select_body_area.value].parts[select_area_part.value].symptoms[select_symptom.value].doctor;
  document.getElementById('select_doctor').value = doctor;
}

function saveNewNote(){
  event.preventDefault();
  let date = new Date();
  date_small = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + (date.getHours() + 1) + ':' + (date.getMinutes() + 1);
  let result = {
    header: document.getElementById('add_note_header_input').value,
    area: document.getElementById('select_body_area').value,
    part: document.getElementById('select_area_part').value,
    symp: document.getElementById('select_symptom').value,
    desc: document.getElementById('add_note_desc_textarea').value,
    doctor: document.getElementById('select_doctor').value,
    date: date_small,
    active: true
  }
  let transaction = db.transaction('TextNote', 'readwrite');
  let textNote = transaction.objectStore('TextNote');
  let request = textNote.put(result);
  request.onsuccess = function() {
    uploadFile(selected_photo, 'PhotoImage', request.result);
    uploadFile(selected_voice, 'VoiceRecord', request.result);
    pushAlert(TEXT[LANGUAGE].newnote.save_alert);
    main_page();
    pushHistoryState('main_page');
  }
}

function defineFile(file){
  switch (file.type.split('/')[0]) {
    case 'image':
      getDataURI(file, 'image');
      break;
    case 'audio':
      getDataURI(file, 'audio');
      break;
    default:
      pushAlert(TEXT[LANGUAGE].newnote.file_alert);
  }
}

function cameraShot(){
  navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL,
    encodingType: Camera.EncodingType.JPEG,
  });
  function onCameraSuccess(imageData) {
    selected_photo = 'data:image/jpeg;base64,' + imageData;
    updateImgPrev();
  }
  function onCameraFail(message) {
    pushAlert(message);
  }
}

function voiceRec(){
  let captureSuccess = function(mediaFiles) {
    mediaFiles[0].end = mediaFiles[0].size;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(mediaFiles[0]);
    fileReader.onload = function () {
      selected_voice = fileReader.result;
      updateAudPrev();
    }
  };

  let captureError = function(error) {
      pushAlert('Voice record error');
  };

  navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:1});
}

function getDataURI(file, type){
  if (file !== undefined){
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = function () {
      if (type == 'audio') {
        selected_voice = fileReader.result;
        updateAudPrev();
      }
      if (type == 'image') {
        selected_photo = fileReader.result;
        updateImgPrev();
      }
    }
  }
}

function uploadFile(dataURI, collection, id){
  if (dataURI !== undefined) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab]);
    let transaction = db.transaction(collection, 'readwrite');
    let photoImage = transaction.objectStore(collection);
    let request = photoImage.put(blob, id);
  }
}

function updateImgPrev(){
  prev_img = document.getElementById('new_note_img_prev');
  prev_img.src = selected_photo;
  prev_img.style.display = 'block';
  document.getElementById('new_note_img_prev_block').style.display = 'block';
}

function updateAudPrev(){
  prev_aud = document.getElementById('new_note_aud_prev');
  prev_aud.src = selected_voice;
  let source = document.createElement('source');
  source.type = 'audio/*';
  source.src = prev_aud.src;
  prev_aud.style.display = 'block';
  document.getElementById('new_note_aud_prev_block').style.display = 'block';
}
function drop_img_prev(){
  document.getElementById('new_note_img_prev_block').style.display = 'none';
  selected_photo = undefined;
}
function drop_aud_prev(){
  selected_voice = undefined;
  document.getElementById('new_note_aud_prev_block').style.display = 'none';
}
