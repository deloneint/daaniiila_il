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

    // 3D-карусель коротких видео (шортс)
    const cards = Array.from(document.querySelectorAll('.shorts-card'));
    // Привязываем каждому блоку его индекс (data-card-idx)
    cards.forEach((card, i) => card.dataset.cardIdx = i);
    const prevBtn = document.querySelector('.shorts-prev');
    const nextBtn = document.querySelector('.shorts-next');
    let activeIndex = 2; // по центру

    // Ссылки и названия видео
    const shortsData = [
        {
            src: 'https://rutube.ru/play/embed/b0ae58629b8fd488850ca783f6a35994',
            title: 'Отсчет до конкурса "Мисс РГУ 2025"'
        },
        {
            src: 'https://rutube.ru/play/embed/9a01bbde1d56006735087b2885f75f45',
            title: 'Альбом памяти'
        },
        {
            src: 'https://rutube.ru/play/embed/b1428913423ee90c7995148761ca2674',
            title: 'Объявление о начала конкурса "Мистер РГУ 2025"'
        },
        {
            src: 'https://rutube.ru/play/embed/8f158153dc6d86fad096963591e3120e',
            title: 'Итоги 2023 года'
        },
        {
            src: 'https://rutube.ru/play/embed/c1fb3f828ca13d2a4f0f518ac16f8f4d',
            title: 'Отсчет до конкурса "Мистер РГУ 2025"'
        }
    ];

    function updateCarousel() {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'left1', 'left2', 'right1', 'right2');
            card.style.zIndex = 1;
            card.style.opacity = 0.7;
            card.style.pointerEvents = 'none';
            card.onclick = null;
            // Очищаем контейнер
            const container = card.querySelector('.shorts-video-container');
            container.innerHTML = '';
        });
        // Индексы по кругу
        const n = cards.length;
        const get = idx => cards[(idx + n) % n];
        get(activeIndex).classList.add('active');
        get(activeIndex).style.zIndex = 10;
        get(activeIndex).style.opacity = 1;
        get(activeIndex).style.pointerEvents = 'auto';
        get(activeIndex - 1).classList.add('left1');
        get(activeIndex - 2).classList.add('left2');
        get(activeIndex + 1).classList.add('right1');
        get(activeIndex + 2).classList.add('right2');
        // Вставляем iframe только в центральную карточку
        const centerCard = get(activeIndex);
        const centerContainer = centerCard.querySelector('.shorts-video-container');
        const centerIdx = parseInt(centerCard.dataset.cardIdx, 10);
        const iframe = document.createElement('iframe');
        iframe.className = 'shorts-iframe';
        iframe.src = shortsData[centerIdx].src;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('allowfullscreen', '');
        centerContainer.appendChild(iframe);
        // В боковые карточки — постер-изображение с иконкой play
        [activeIndex-2, activeIndex-1, activeIndex+1, activeIndex+2].forEach(offset => {
            const card = get(offset);
            if (!card.classList.contains('active')) {
                const container = card.querySelector('.shorts-video-container');
                const cardIdx = parseInt(card.dataset.cardIdx, 10);
                const posterImg = document.createElement('img');
                posterImg.src = `images/cards/${cardIdx+1}.PNG.webp`;
                posterImg.alt = shortsData[cardIdx].title;
                posterImg.className = 'shorts-poster-img';
                const poster = document.createElement('div');
                poster.className = 'shorts-poster';
                poster.appendChild(posterImg);
                // Иконка play поверх
                const playIcon = document.createElement('span');
                playIcon.className = 'play-icon';
                playIcon.textContent = '▶';
                poster.appendChild(playIcon);
                container.appendChild(poster);
                // Назначаем обработчик по индексу
                if (cardIdx === ((activeIndex - 1 + n) % n)) {
                    poster.onclick = () => { prevBtn.click(); };
                } else if (cardIdx === ((activeIndex + 1) % n)) {
                    poster.onclick = () => { nextBtn.click(); };
                }
            }
        });
        // Клик по боковым карточкам
        get(activeIndex - 1).onclick = () => { prevBtn.click(); };
        get(activeIndex + 1).onclick = () => { nextBtn.click(); };
    }

    prevBtn.addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });
    nextBtn.addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % cards.length;
        updateCarousel();
    });
    // Свайп для мобильных
    let startX = null;
    document.querySelector('.shorts-carousel').addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });
    document.querySelector('.shorts-carousel').addEventListener('touchend', e => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 40) prevBtn.click();
        if (dx < -40) nextBtn.click();
        startX = null;
    });
    updateCarousel();
});

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