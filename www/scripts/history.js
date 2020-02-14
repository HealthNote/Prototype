function pushHistoryState(page, id = '-1'){
  if (DEFINED_USER && (history.state === null || history.state.page !== page)) {
    history.pushState({ page, id }, null, '#' + page);
  }
}

function initHistory(page){
  let id = '-1';
  history.replaceState({ page, id }, null, '#' + page);
}

document.getElementById('app_logo').addEventListener('click', function(e) {
  pushHistoryState('main_page');
  main_page();
}, false);
document.getElementById('add_icon').addEventListener('click', function(e) {
  pushHistoryState('add_note_page');
  add_note_page();
}, false);
document.getElementById('gear_icon').addEventListener('click', function(e) {
  pushHistoryState('settings_page');
  settings_page();
}, false);
function analysis_to_history(){
  pushHistoryState('open_analysis');
  open_analysis();
};

function note_list_add_listener(){
  let all_notes = document.getElementsByClassName('note_box');
  for (var i = 0; i < all_notes.length; i++) {
    let current_note = all_notes[i];
    let current_id = current_note.getAttribute("data-id");
    current_note.addEventListener('click', function(e) {
      pushHistoryState('note_view_page', current_id);
      note_view_page(parseInt(current_id));
    }, false);
  }
}

window.addEventListener('popstate', e => {
  if (e.state === null) return;
  switch (e.state.page) {
    case 'main_page':
      main_page();
      break;
    case 'add_note_page':
      add_note_page();
      break;
    case 'settings_page':
      settings_page();
      break;
    case 'open_analysis':
      open_analysis();
      break;
    case 'note_view_page':
      note_view_page(parseInt(e.state.id));
      break;
  };
});
