// Плавная прокрутка для якорных ссылок
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    // Мобильное меню
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Предотвращаем всплытие события
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        const isClickInsideNav = nav.contains(e.target);
        const isClickOnToggle = mobileMenuToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Закрываем мобильное меню
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Обработчик для логотипа (возврат к верху страницы)
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Закрываем мобильное меню
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Подсветка активного пункта меню при скролле
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (window.pageYOffset >= (sectionTop - headerHeight - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за секциями
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Инициализация карусели для кейсов
    initCaseCarousel();
    
    // Инициализация карусели коротких видео
    initShortVideosCarousel();
});

// Карусель для коротких видео
function initShortVideosCarousel() {
    const videoOverlays = document.querySelectorAll('.video-overlay');
    const videoIframes = document.querySelectorAll('.video-iframe');
    
    videoOverlays.forEach((overlay, index) => {
        overlay.addEventListener('click', function() {
            const iframe = videoIframes[index];
            const dataSrc = iframe.getAttribute('data-src');
            
            // Останавливаем все другие видео
            videoIframes.forEach((otherIframe, otherIndex) => {
                if (otherIndex !== index) {
                    // Останавливаем видео, заменяя src на about:blank
                    const currentSrc = otherIframe.src;
                    if (currentSrc !== 'about:blank' && currentSrc.includes('vk.com')) {
                        otherIframe.src = 'about:blank';
                        // Показываем overlay для остановленного видео
                        const otherOverlay = videoOverlays[otherIndex];
                        otherOverlay.style.display = 'flex';
                    }
                }
            });
            
            // Загружаем выбранное видео
            if (iframe.src === 'about:blank') {
                iframe.src = dataSrc;
                overlay.style.display = 'none';
            } else {
                // Если видео уже загружено, останавливаем его
                iframe.src = 'about:blank';
                overlay.style.display = 'flex';
            }
        });
    });
}

// Карусель для кейсов на мобильных устройствах
function initCaseCarousel() {
    const caseGrid = document.querySelector('.case-grid');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!caseGrid || !indicators.length) return;
    
    // Обработчик скролла для обновления индикаторов
    caseGrid.addEventListener('scroll', function() {
        const scrollLeft = caseGrid.scrollLeft;
        const itemWidth = caseGrid.querySelector('.case-item').offsetWidth;
        const currentSlide = Math.round(scrollLeft / itemWidth);
        
        // Обновляем активный индикатор
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    });
    
    // Обработчики клика по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            const itemWidth = caseGrid.querySelector('.case-item').offsetWidth;
            const scrollPosition = itemWidth * index;
            
            caseGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    });
}



// Добавляем стили для активного пункта меню
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #007bff !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style); 