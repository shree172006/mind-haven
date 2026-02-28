// public/js/interactive.js
// Provides a lightweight 3D tilt effect for cards on the site.

document.addEventListener('DOMContentLoaded', () => {
    const wrappers = document.querySelectorAll('.info-card, .tool-card');

    wrappers.forEach(wrapper => {
        // If .info-card contains a child .card-content we want to rotate that, otherwise rotate the wrapper itself
        const card = wrapper.querySelector('.card-content') || wrapper;

        wrapper.addEventListener('mousemove', e => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const rotateY = ((x - midX) / midX) * 10; // max 10deg
            const rotateX = -((y - midY) / midY) * 10;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        wrapper.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0)';
        });
    });
});
