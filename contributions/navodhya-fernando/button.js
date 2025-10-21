class NaviiButton {
    constructor(element) {
        this.element = element;
        this.clickCount = 0;
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.element.addEventListener('click', (e) => this.handleClick(e));
        this.element.addEventListener('mouseenter', () => this.addRippleEffect());
    }

    handleClick(event) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.clickCount++;
        
        this.element.style.setProperty('--click-count', this.clickCount);
        
        this.createClickParticles(event);
        
        setTimeout(() => {
            this.isProcessing = false;
        }, 600);

        console.log(`Navii's button activated! Click #${this.clickCount}`);
    }

    createClickParticles(event) {
        const rect = this.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--angle', Math.random() * 360 + 'deg');
            
            this.element.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    addRippleEffect() {
        if (!this.element.querySelector('.ripple')) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.element.appendChild(ripple);
        }
    }

    reset() {
        this.clickCount = 0;
        this.element.style.setProperty('--click-count', 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.navii-pulse-button');
    buttons.forEach(button => new NaviiButton(button));
});