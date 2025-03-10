function Pie (){};
Pie.prototype = {
    set: function(percent) {
        const pie = document.querySelector('.pie');
        const progressFill = document.querySelector('.pie-progress-fill');
        const percentEl = document.querySelector('.pie-percent');
        const deg = 360 * (percent / 100);
        
        if (percent > 50) {
            pie.classList.add('gt-50');
        }
        
        if (progressFill) {
            progressFill.style.transform = `rotate(${deg}deg)`;
        }
        
        if (percentEl) {
            percentEl.innerHTML = percent + '%';
        }
    }
}
module.exports = Pie;