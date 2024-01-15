import "./settings.css";
const {ipcRenderer} = require('electron')

function set(el, value) {
  $(el).val(value);
  $('#' + $(el).data("target")).val(value);

}
ipcRenderer.on('set-quality', function(e, arg1, arg2) {
  const arg = arguments;
  $(".settings-range").each(function(i, item) {
    set(item, arg[i+1]);
  });
  $("#settings").show();
});
ipcRenderer.on('backup', function(e, arg1) {
  $("input[name='backup']").prop('checked', arg1)
  $("#settings").show();
});
$(document).on("change", "input[name='backup']", function(e) {
  ipcRenderer.send('backup', $(e.target).prop('checked'));
});
$(document).on("change", '.settings-range', function(e) {
  let $self = $(this),
    value = $self.val(),
    target = $self.data("target");
  set(this, $self.val());
  ipcRenderer.send('set-quality', target, Number(value));
});

