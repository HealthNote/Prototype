let settings_user_gender;

function settings_page() {
  pageContent.innerHTML = '';

  let settingsPageDiv = document.createElement('div');
  settingsPageDiv.classList.add('user_message');
  pageContent.append(settingsPageDiv);

  let settings_gender = '<div id="settings_gender"></div>';
  let settings_lang = '<div id="settings_lang"></div>';
  let controls = '<div id="settings_controls"></div>';

  settingsPageDiv.innerHTML = settings_gender + settings_lang + controls;

  let settingsGenderDiv = document.getElementById("settings_gender");
  let settingsLangDiv = document.getElementById("settings_lang");
  let controlsDiv = document.getElementById("settings_controls");

  let choose_man_gender = '<img src="img/man-icon.png" id="settings_gender_man" class="settings_gender_icon icon" onclick=choose_gender('+"\"man\""+')>';
  let choose_woman_gender = '<img src="img/woman-icon.png" id="settings_gender_woman" class="settings_gender_icon icon" onclick=choose_gender('+"\"woman\""+')>';
  let lang_icon = '<img src="img/lang-icon.png" alt="" class="settings_icon">'
  let language_selector = '<span>' + TEXT[LANGUAGE].settings.lang + ': </span><select id="language_selector"><option value="En">'
                          + TEXT[LANGUAGE].settings.opt_en + '</option><option value="Ru">' + TEXT[LANGUAGE].settings.opt_ru + '</option></select>';
  let settings_button = '<button type="button" name="Ok" class="settings_button" onclick="save_settings()" id="settings_save_button">' + TEXT[LANGUAGE].settings.ok + '</button>';

  settingsGenderDiv.innerHTML = choose_man_gender + choose_woman_gender;
  settingsLangDiv.innerHTML = lang_icon + language_selector;
  controlsDiv.innerHTML = settings_button;

  let transaction = db.transaction("InfoStore", "readonly");
  let infoStore = transaction.objectStore("InfoStore");
  let request = infoStore.get('userData');

  request.onsuccess = function() {
    if (!(request.result === undefined)){
      settings_user_gender = request.result.gender;
      let my_selector = document.getElementById("language_selector").options;
      for (i in my_selector){
        console.log()
        if (my_selector[i].value == request.result.lang) {
          my_selector[i].selected = true;
          break;
        }
      }
      let drop_db_button = '<button type="button" name="drop_db" class="settings_button" onclick="drop_database()"="">' + TEXT[LANGUAGE].settings.drop + '</button>';
      controlsDiv.innerHTML += drop_db_button;
      choose_gender(settings_user_gender);
    } else {
      settings_user_gender = 'man';
      choose_gender(settings_user_gender);
    }
  };
  request.onerror = function() {
    console.log("Search userData error", request.error);
  };
}

function choose_gender(gender) {
  settings_user_gender = gender;
  let man = document.getElementById("settings_gender_man");
  let woman = document.getElementById("settings_gender_woman");
  if (gender == 'man'){
    man.classList.add('choosen_gender');
    woman.classList.remove('choosen_gender');
  }else{
    man.classList.remove('choosen_gender');
    woman.classList.add('choosen_gender');
  }
}

function gender_doctor(){
  DOCTORS[LANGUAGE]['urogynecologist'] = TEXT[LANGUAGE].newnote.urogynecologist[GENDER];
}

function save_settings(){
  let transaction = db.transaction("InfoStore", "readwrite");
  let infoStore = transaction.objectStore("InfoStore");
  LANGUAGE = document.getElementById('language_selector').value;
  GENDER = settings_user_gender;
  let user_settings = {
    gender: GENDER,
    lang: LANGUAGE
  };

  let request = infoStore.put(user_settings, 'userData');
  request.onsuccess = function() {
    DEFINED_USER = true;
    pushAlert(TEXT[LANGUAGE].settings.save_alert);
    gender_doctor();
    main_page();
    pushHistoryState('main_page');
  };
  request.onerror = function() {
    console.log("The system has NOT updated the userData", request.error);
  };
}

function drop_database(){
  let drop_confirmed = confirm(TEXT[LANGUAGE].settings.confirm);
  if (drop_confirmed){
    db.close();
    let drop_request = indexedDB.deleteDatabase('MedicalStore');
    drop_request.onerror = function() {
      console.log("Error deleting database!");
    };
    drop_request.onsuccess = function() {
      console.log("Database deleted successfully");
      DEFINED_USER = false;
      pushAlert(TEXT[LANGUAGE].settings.dropped);
      init();
    };
  }
}
