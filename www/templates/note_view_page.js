function note_view_page(id){
  if (!DEFINED_USER) { settings_page(); return; }
  pageContent.innerHTML = '<div class="user_message"><div id="view_page_container"></div></div>';
  let viewPageDiv = document.getElementById('view_page_container');

  let transaction = db.transaction('TextNote', 'readonly');
  let textNote = transaction.objectStore('TextNote');
  let request = textNote.get(id);
  request.onsuccess = function() {
    if (request.result !== undefined) {
      note_view_header = '<div id="note_view_header">' + request.result.header + '</div>';
      note_view_tags = '<div id="note_view_tags"></div>';

      note_view_date = '<div class="note_view_info"><b>' + TEXT[LANGUAGE].view_note.date + ':</b> ' + request.result.date + '</div>';
      note_view_doctor = '<div class="note_view_info"><b>' + TEXT[LANGUAGE].view_note.doctor + ':</b> ' +
                         '<select id="select_doctor" class="add_note_selects"></select></div>';


      note_view_desc = (request.result.desc !== '') ?
                        '<div class="note_view_info" id="note_view_desc"><b>' + TEXT[LANGUAGE].view_note.desc + ':</b> ' + request.result.desc + '</div>' : '';
      viewPageDiv.insertAdjacentHTML('beforeEnd', note_view_header + note_view_tags + note_view_date + note_view_doctor + note_view_desc);

      select_doctor = document.getElementById('select_doctor');
      select_doctor.innerHTML = '<option disabled selected value="">' + TEXT[LANGUAGE].newnote.choose + '</option>';
      for (doc in docs){
        let opt = document.createElement('option');
        opt.value = doc;
        opt.innerHTML = docs[doc];
        select_doctor.append(opt);
      }
      if (request.result.doctor !== '') select_doctor.value = request.result.doctor;

      note_view_tags_block = document.getElementById('note_view_tags');
      symp_info = SYMPTOMS[LANGUAGE];
      if (request.result['area'] !== ''){
        print_note_tag(note_view_tags_block, symp_info[request.result['area']].value);
        if (request.result['part'] !== ''){
          print_note_tag(note_view_tags_block, symp_info[request.result['area']].parts[request.result['part']].value);
          if (request.result['symp'] !== ''){
            print_note_tag(note_view_tags_block, symp_info[request.result['area']].parts[request.result['part']].symptoms[request.result['symp']].value);
          }
        }
      }
      viewPageDiv.insertAdjacentHTML('beforeEnd', '<img class="view_page_image" id="note_view_img"/>');
      viewPageDiv.insertAdjacentHTML('beforeEnd', '<audio controls id="note_view_aud" class="view_page_audio"></audio>');

      note_active = '<div id="view_note_active">' + TEXT[LANGUAGE].view_note.active + '</div>'
      viewPageDiv.insertAdjacentHTML('beforeEnd', note_active);
      note_active_div = document.getElementById('view_note_active');
      view_note_active_checkbox = '<input type="checkbox" id="note_active_checkbox" /><label for="note_active_checkbox"></label>'
      note_active_div.insertAdjacentHTML('beforeEnd', view_note_active_checkbox);
      document.getElementById('note_active_checkbox').checked = (request.result.active == true) ? true : false;

      let delete_btn = '<button type="submit" name="Delete" class="settings_button" onclick="delete_note(' + id + ')">' + TEXT[LANGUAGE].view_note.delete + '</button>';
      let save_btn ='<button type="submit" name="Save" class="settings_button" onclick="update_note(' + id + ')">' + TEXT[LANGUAGE].view_note.save + '</button>';
      viewPageDiv.insertAdjacentHTML('beforeEnd', delete_btn + save_btn);

      files_from_note('PhotoImage', id, 'image');
      files_from_note('VoiceRecord', id, 'audio');
    }
    else{
      userMessage(TEXT[LANGUAGE].view_note.empty);
    }
  }
}

function files_from_note(collection, id, type){
  let transaction = db.transaction(collection, 'readonly');
  let fileNote = transaction.objectStore(collection);
  let request = fileNote.get(id);
  request.onsuccess = function() {
    if (request.result !== undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(request.result);
      reader.onload = function() {
        if (type === 'image'){
          let img = new Image();
          img.src = reader.result;
          img.onload = function () {
            let note_view_img = document.getElementById('note_view_img');
            note_view_img.src = img.src;
            note_view_img.style.display = 'block';
          }
        }
        if (type === 'audio'){
          let aud = new Audio();
          aud.src = reader.result;
          let source = document.createElement('source');
          source.type = 'audio/mpeg';
          source.src = aud.src;
          let note_view_aud = document.getElementById('note_view_aud');
          note_view_aud.append(source);
          note_view_aud.style.display = 'block';
        }
      }
    }
  }
}

function delete_note(id){
  let delete_confirmed = confirm(TEXT[LANGUAGE].view_note.delete_confirm);
  if (delete_confirmed) {
    let transaction = db.transaction('TextNote', 'readwrite');
    let textNote = transaction.objectStore('TextNote');
    let request = textNote.delete(id);
    request.onsuccess = function() {
      let transaction_img = db.transaction('PhotoImage', 'readwrite');
      let photoImage = transaction_img.objectStore('PhotoImage');
      let request_img = photoImage.delete(id);
      request_img.onsuccess = function() {
        let transaction_aud = db.transaction('VoiceRecord', 'readwrite');
        let voiceRecord = transaction_aud.objectStore('VoiceRecord');
        let request_aud = voiceRecord.delete(id);
        request_aud.onsuccess = function() {
          pushAlert(TEXT[LANGUAGE].view_note.delete_alert);
          main_page();
          pushHistoryState('main_page');
        }
      }
    }
  }
}

function update_note(id){
  let transaction = db.transaction('TextNote', 'readwrite');
  let textNote = transaction.objectStore('TextNote');
  let request = textNote.get(id);
  request.onsuccess = function() {
    let update = request.result;
    update.doctor = document.getElementById('select_doctor').value;
    update.active =  document.getElementById('note_active_checkbox').checked;
    let update_request = textNote.put(update);
    update_request.onsuccess = function() {
      pushAlert(TEXT[LANGUAGE].view_note.save_alert);
      main_page();
      pushHistoryState('main_page');
    }
  }
}
