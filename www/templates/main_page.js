let user_notes;
let notes_options = {}

function main_page(){
  if (!DEFINED_USER) { settings_page(); return; }
  pageContent.innerHTML = '';
  let transaction = db.transaction("TextNote", "readonly");
  let textNote = transaction.objectStore("TextNote");
  let request = textNote.getAll();
  request.onsuccess = function() {
    if (request.result.length !== 0) {
      pageContent.innerHTML = '<div id="all_notes"></div>'
      user_notes = request.result;
      notes_options = {
        search_text: '',
        filter_list: [],
        choosen_filter: '',
        active: true
      }
      for (i in user_notes){
        if ((!notes_options.filter_list.includes(user_notes[i].doctor)) && (user_notes[i].doctor !== '')) notes_options.filter_list.push(user_notes[i].doctor);
      }
      print_tool_bar();
      render_notes();
    } else {
      userMessage(TEXT[LANGUAGE].main.empty);
    }
  }
}

function note_tags(note_info){
  let all_notes = document.getElementsByClassName('note_box');
  let note_body = undefined;
  for (var i = 0; i < all_notes.length; i++) {
    if (parseInt(all_notes[i].getAttribute("data-id")) === parseInt(note_info.id)) note_body = all_notes[i];
  }
  if (note_body === undefined) return;
  symp_info = SYMPTOMS[LANGUAGE];
  docs = DOCTORS[LANGUAGE];
  if (note_info['doctor'] !== ''){
    print_note_tag(note_body, docs[note_info['doctor']]);
  }
  if (note_info['area'] !== ''){
    print_note_tag(note_body, symp_info[note_info['area']].value);
    if (note_info['part'] !== ''){
      print_note_tag(note_body, symp_info[note_info['area']].parts[note_info['part']].value);
      if (note_info['symp'] !== ''){
        print_note_tag(note_body, symp_info[note_info['area']].parts[note_info['part']].symptoms[note_info['symp']].value);
      }
    }
  }
  print_note_tag(note_body, note_info['date']);
}

function print_note_tag(note_body, text){
  let tagDiv = '<div class="main_page_note_tags">' + text + '</div>'
  note_body.insertAdjacentHTML('beforeEnd', tagDiv);
}

function render_notes(){
  let all_notes = document.getElementById('all_notes');
  clear_prev_notes();
  let notes_to_render = cut_notes();
  if (notes_to_render.length === 0){
    let note_box = '<div class="note_box">' + TEXT[LANGUAGE].main.empty + '</div>';
    all_notes.insertAdjacentHTML('afterBegin', note_box);
  }
  else{
    for (i in notes_to_render){
      let note_info = notes_to_render[i];
      let not_box_header = '<div class="main_page_note_header">' + note_info.header + '</div>';
      let note_box = '<div class="note_box" data-id="' + note_info.id + '">' + not_box_header + '</div>';
      all_notes.insertAdjacentHTML('afterBegin', note_box);
      note_tags(note_info);
    }
    note_list_add_listener();
  }
}

function cut_notes(){
  let notes_active = [], notes_filter = [], notes_search = [];
  if (!notes_options.active) notes_active = user_notes;
  else {
    for (i in user_notes){
      if (user_notes[i].active) notes_active.push(user_notes[i]);
    }
  }
  if (notes_options.choosen_filter === '') notes_filter = notes_active;
  else {
    for (i in notes_active){
      if (notes_active[i].doctor === notes_options.choosen_filter) notes_filter.push(notes_active[i]);
    }
  }
  if (notes_options.search_text === '') notes_search = notes_filter;
  else {
    for (i in notes_filter){
      if ((notes_filter[i].header.toLowerCase()).includes(notes_options.search_text.toLowerCase())) notes_search.push(notes_filter[i]);
    }
  }
  return notes_search;
}

function clear_prev_notes(){
  let prev_notes = document.getElementsByClassName('note_box');
  while(prev_notes[0]){
    prev_notes[0].parentNode.removeChild(prev_notes[0]);
  }
}

function print_tool_bar(){
  pageContent.innerHTML += '<div class="tool_bar" id="tool_bar" onclick=""><div id="hidden_tool_bar"></div></div>';
  let tool_bar = document.getElementById('tool_bar');
  let tool_filter = '<div class="tool_bar_options" onclick="open_filter()"><div class="tool_bar_text">' +
                    TEXT[LANGUAGE].main.filter + '</div><img src="img/filter-icon.png" class="tool_bar_icon"></div>'
  let tool_search = '<div class="tool_bar_options" onclick="open_search()"><div class="tool_bar_text">' +
                    TEXT[LANGUAGE].main.search + '</div><img src="img/search-icon.png" class="tool_bar_icon"></div>'
  let tool_active = '<div class="tool_bar_options" onclick="open_active()"><div class="tool_bar_text">' +
                    TEXT[LANGUAGE].main.display + '</div><img src="img/active-icon.png" class="tool_bar_icon"></div>'
  let tool_analysis = '<div class="tool_bar_options" id="tool_analysis" onclick="analysis_to_history()"><div class="tool_bar_text">' +
                    TEXT[LANGUAGE].main.analysis + '</div><img src="img/analysis-icon.png" class="tool_bar_icon"></div>'
  tool_bar.innerHTML += tool_filter + tool_search + tool_active + tool_analysis;
}

function open_filter(){
  hidden_tool_bar = document.getElementById('hidden_tool_bar');
  hidden_tool_bar.innerHTML = '<select id="note_filter_select" onchange="process_filter()"></select>'
  hidden_tool_bar.style.opacity = 1;
  note_filter_select = document.getElementById('note_filter_select');
  note_filter_select.innerHTML = '<option selected value="">' + TEXT[LANGUAGE].newnote.choose + '</option>';
  for (i in notes_options.filter_list){
    let opt = document.createElement('option');
    opt.value = notes_options.filter_list[i];
    opt.innerHTML = docs[notes_options.filter_list[i]];
    note_filter_select.append(opt);
  }
  document.getElementById('note_filter_select').value = notes_options.choosen_filter;
  document.getElementById('note_filter_select').focus();
}
function process_filter() {
  notes_options.choosen_filter = document.getElementById('note_filter_select').value;
  render_notes();
}
function open_search(){
  hidden_tool_bar = document.getElementById('hidden_tool_bar');
  hidden_tool_bar.innerHTML = '<input type="text" id="note_search_input" oninput="process_search()">';
  hidden_tool_bar.style.opacity = 1;
  document.getElementById('note_search_input').value = notes_options.search_text;
  document.getElementById('note_search_input').focus();
}
function process_search() {
  notes_options.search_text = document.getElementById('note_search_input').value;
  render_notes();
}
function open_active(){
  hidden_tool_bar = document.getElementById('hidden_tool_bar');
  hidden_tool_bar.innerHTML = '<div id="view_note_active">' + TEXT[LANGUAGE].main.only_actual +
                              '<input type="checkbox" id="note_active_checkbox" onchange="process_active()"><label for="note_active_checkbox"></label></div>';
  document.getElementById('note_active_checkbox').checked = notes_options.active;
  hidden_tool_bar.style.opacity = 1;

}
function process_active() {
  notes_options.active = document.getElementById('note_active_checkbox').checked;
  console.log(notes_options);
  render_notes();
}
function open_analysis(){
  let features = make_features_list();
  number_of_dis_sypms = features.filter(function(i) { return (i === 1); }).length;
  let neuralDiv, adviceDiv, warningDiv;
  if (number_of_dis_sypms >= 3){
    let result_doctors = neural_network(features);
    let uniq_doc_check = []
    let doc_block = '';
    for (let i = 0; i < result_doctors.length; i++){
      if (!uniq_doc_check.includes(result_doctors[i].label)){
        doc_block += '<br><b>' + DOCTORS[LANGUAGE][result_doctors[i].label] + '</b>';
        uniq_doc_check.push(result_doctors[i].label);
      }
    }
    adviceDiv = '<div id="neural_advice">' + TEXT[LANGUAGE].main.advice + doc_block + '</div>'
  }else{
    adviceDiv = '<div id="neural_advice">' + TEXT[LANGUAGE].main.insufficiently + '</div>'
  }

  neuralDiv = '<div id="neural_desc">' + TEXT[LANGUAGE].main.neural + '</div>';
  warningDiv = '<div id="neural_warning">*' + TEXT[LANGUAGE].main.warning + '</div>'
  userMessage(neuralDiv + adviceDiv + warningDiv);
}

function make_features_list() {
  let features = [];
  let counter = 0;
  for (let i in DISEASE.symptoms) {
    features[counter] = 0;
    for (let j in user_notes) {
      let cond1 = DISEASE.symptoms[i].part.includes(user_notes[j].part);
      let cond2 = DISEASE.symptoms[i].symptom.includes(user_notes[j].symp);
      let cond3 = (user_notes[j].part !== '');
      let cond4 = (user_notes[j].symp !== '');
      let cond5 = (DISEASE.symptoms[i].part == '');
      if (cond4 && cond3 && cond2 && (cond1 || cond5)) features[counter] = 1;
    }
    counter++;
  }
  return features;
}
