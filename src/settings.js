import "./settings.css";
import configuration from "../configuration";
import {shell} from "electron";

const {ipcRenderer} = require('electron')

function set(el, value) {
  $(el).val(value);
  $('#' + $(el).data("target")).val(value);
}

$("input[name='backup']").prop('checked', configuration.get('backup'));
$("#maxWidth").val(configuration.get('maxWidth'));
$("#maxHeightVideo").val(configuration.get('maxHeightVideo'));
$("#maxHeight").val(configuration.get('maxHeight'));
const arg = [configuration.get('jpg'),configuration.get('webp')];
$(".settings-range").each(function (i, item) {
  set(item, arg[i]);
});
$(document).on("change", "input[name='backup']", function (e) {
  ipcRenderer.send('backup', $(e.target).prop('checked'));
});
$(document).on("input", "#maxWidth", function (e) {
  ipcRenderer.send('maxWidth', $(this).val());
});
$(document).on("input", "#maxHeightVideo", function (e) {
  ipcRenderer.send('maxHeightVideo', $(this).val());
});
$(document).on("input", "#maxHeight", function (e) {
  ipcRenderer.send('maxHeight', $(this).val());
});
$(document).on("change", '.settings-range', function (e) {
  let $self = $(this),
    value = $self.val(),
    target = $self.data("target");
  set(this, $self.val());
  ipcRenderer.send('set-quality', target, Number(value));
});
$(document).on("click", '#buy', function (e) {
  shell.openExternal("https://buy.arayofsunshine.dev");
});

