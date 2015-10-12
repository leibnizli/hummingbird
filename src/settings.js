var ipc = require('ipc');

function set(el, value) {
    $(el).val(value);
    $('#' + $(el).data("target")).val(value);

}
ipc.on('settings-quality', function(arg1, arg2) {
    var arg = arguments;
    $(".settings-range").each(function(i, item) {
        set(item, arg[i]);
    });
    $("#settings").show();
});
$(document).on("change", '.settings-range', function(e) {
    var $self = $(this),
        value = $self.val(),
        target = $self.data("target");
    set(this, $self.val());
    ipc.sendSync('set-configuration', target, Number(value));
});
