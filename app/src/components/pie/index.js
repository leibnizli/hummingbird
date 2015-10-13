function Pie (){};
Pie.prototype = {
    set:function(percent){
        var $pie = $('.pie'),
            deg = 360 * (percent / 100);
        if (percent > 50) {
            $pie.addClass('gt-50');
        }
        $('.pie-progress-fill').css('transform', 'rotate(' + deg + 'deg)');
        $('.pie-percent').html(percent + '%');
    }
}
module.exports = Pie;