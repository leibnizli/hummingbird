function Pie (){
    this.pie = null;
    this.progressFill = null;
    this.percentEl = null;
    this.lastPercent = -1;
};
Pie.prototype = {
    _ensureElements: function() {
        // Always try to get elements if they don't exist
        if (!this.pie) {
            this.pie = document.querySelector('.pie');
            if (!this.pie) {
                console.warn('Pie element not found in DOM');
            }
        }
        if (!this.progressFill) {
            this.progressFill = document.querySelector('.pie-progress-fill');
            if (!this.progressFill) {
                console.warn('Pie progress fill element not found in DOM');
            }
        }
        if (!this.percentEl) {
            this.percentEl = document.querySelector('.pie-percent');
            if (!this.percentEl) {
                console.warn('Pie percent element not found in DOM');
            }
        }
    },
    set: function(percent) {
        // Skip if same as last update
        if (this.lastPercent === percent) {
            return;
        }
        
        // Always re-check elements in case DOM was updated
        this._ensureElements();
        
        // If elements still not found, retry after a short delay
        if (!this.pie || !this.progressFill || !this.percentEl) {
            console.warn('Pie elements not ready, retrying...');
            setTimeout(() => {
                this.set(percent);
            }, 50);
            return;
        }
        
        const deg = 360 * (percent / 100);
        
        if (this.pie && percent > 50) {
            this.pie.classList.add('gt-50');
        }
        
        if (this.progressFill) {
            this.progressFill.style.transform = `rotate(${deg}deg)`;
        }
        
        if (this.percentEl) {
            this.percentEl.innerHTML = percent + '%';
        }
        
        this.lastPercent = percent;
    }
}
module.exports = Pie;