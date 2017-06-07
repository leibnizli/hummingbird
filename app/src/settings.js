const {ipcRenderer} = require('electron')

function set(el, value) {
    $(el).val(value);
    $('#' + $(el).data("target")).val(value);

}
ipcRenderer.on('settings-quality', function(e, arg1, arg2) {
    var arg = arguments;
    $(".settings-range").each(function(i, item) {
        set(item, arg[i+1]);
    });
    $("#settings").show();
});
$(document).on("change", '.settings-range', function(e) {
    var $self = $(this),
        value = $self.val(),
        target = $self.data("target");
    set(this, $self.val());
    ipcRenderer.send('set-configuration', target, Number(value));
});
