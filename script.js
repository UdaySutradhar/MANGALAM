document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Product Bar ---
    const stickyBar = document.getElementById('stickyBar');
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        // Show bar when scrolling past the top of the hero section
        if (window.scrollY > 150) {
            stickyBar.classList.add('visible');
        } else {
            stickyBar.classList.remove('visible');
        }
    });

    // --- 2. FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.style.display = 'none');
            
            // Open clicked if it wasn't already open
            if (!isActive) {
                header.classList.add('active');
                content.style.display = 'block';
            }
        });
    });

    // --- 3. Hero Gallery & Thumbnails ---
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    let currentIndex = 0;

    function updateMainImage(index) {
        // In a real app, you would swap the src: mainImage.src = thumbnails[index].querySelector('img').src;
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnails[index].classList.add('active');
        currentIndex = index;
    }

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateMainImage(index));
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        let newIndex = currentIndex === 0 ? thumbnails.length - 1 : currentIndex - 1;
        updateMainImage(newIndex);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        let newIndex = currentIndex === thumbnails.length - 1 ? 0 : currentIndex + 1;
        updateMainImage(newIndex);
    });

    // --- 4. E-Commerce Side-by-Side Zoom ---
    const zoomContainer = document.getElementById('zoomContainer');
    const zoomLens = document.getElementById('zoomLens');
    const zoomResult = document.getElementById('zoomResult');
    const zoomHint = document.querySelector('.zoom-hint');

    zoomContainer.addEventListener('mouseenter', () => {
        if(window.innerWidth > 1024) { // Only enable on desktop
            zoomLens.style.display = 'block';
            zoomResult.style.display = 'block';
            zoomHint.style.display = 'none'; // Hide the magnifying glass hint
            
            // Set high-res image to result background
            zoomResult.style.backgroundImage = `url('${mainImage.src}')`;
        }
    });

    zoomContainer.addEventListener('mouseleave', () => {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
        zoomHint.style.display = 'flex'; // Show hint again
    });

    zoomContainer.addEventListener('mousemove', moveLens);

    function moveLens(e) {
        if(window.innerWidth <= 1024) return;

        const imgRect = mainImage.getBoundingClientRect();
        
        // Calculate cursor position relative to image
        let x = e.clientX - imgRect.left;
        let y = e.clientY - imgRect.top;

        // Position lens center on cursor
        let lensX = x - (zoomLens.offsetWidth / 2);
        let lensY = y - (zoomLens.offsetHeight / 2);

        // Prevent lens from leaving image boundaries
        if (lensX > imgRect.width - zoomLens.offsetWidth) lensX = imgRect.width - zoomLens.offsetWidth;
        if (lensX < 0) lensX = 0;
        if (lensY > imgRect.height - zoomLens.offsetHeight) lensY = imgRect.height - zoomLens.offsetHeight;
        if (lensY < 0) lensY = 0;

        zoomLens.style.left = lensX + 'px';
        zoomLens.style.top = lensY + 'px';

        // Move background in the result pane based on ratio
        let ratioX = zoomResult.offsetWidth / zoomLens.offsetWidth;
        let ratioY = zoomResult.offsetHeight / zoomLens.offsetHeight;

        zoomResult.style.backgroundSize = `${imgRect.width * ratioX}px ${imgRect.height * ratioY}px`;
        zoomResult.style.backgroundPosition = `-${lensX * ratioX}px -${lensY * ratioY}px`;
    }
});