// ============================================================
//  script.js – ПОЛНАЯ АДМИН-ПАНЕЛЬ
//  Все разделы работают, нет заглушек "в разработке"
//  Пароль: Makar27.05.2014
// ============================================================

console.log('✅ script.js загружен');

// ========== FIREBASE ==========
const firebaseConfig = {
    apiKey: "AIzaSyA2b1AvOjIdI3iPCF3WAYMO10K4ZpFct7E",
    authDomain: "makar-b244c.firebaseapp.com",
    databaseURL: "https://makar-b244c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "makar-b244c",
    storageBucket: "makar-b244c.firebasestorage.app",
    messagingSenderId: "987099529386",
    appId: "1:987099529386:web:53609c931fd3fb4784d0d3",
    measurementId: "G-83K5PEKCT6"
};
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ========== ИИ ==========
const AI_API_URL = '/.netlify/functions/yandex-ai';

// ========== ПЕРЕВОДЫ (добавлены ключи для админки) ==========
const translations = {
    ru: {
        'nav-main': 'Главная',
        'nav-temples': 'Храмы',
        'nav-clergy': 'Духовенство',
        'nav-news': 'Новости',
        'nav-announcements': 'Объявления',
        'nav-sunday-school': 'Воскресные школы',
        'nav-about': 'О благочинии',
        'nav-worship': 'Богослужения',
        'vision-toggle': '👁️ Версия для слабовидящих',
        'vision-toggle-off': '👁️ Обычный вид',
        'calendar-title': 'Календарь',
        'latest-news': 'Последние новости',
        'latest-announcements': 'Последние объявления',
        'all-news': 'Все новости →',
        'all-announcements': 'Все объявления →',
        'admin-title': '🛠 Администрирование',
        'admin-close': 'Закрыть',
        'login-title': 'Вход в админ-панель',
        'login-password': 'Пароль',
        'login-btn': 'Войти',
        'wrong-password': 'Неверный пароль',
        'temples-title': 'Храмы благочиния',
        'clergy-title': 'Духовенство',
        'schedule-title': 'Расписание богослужений',
        'news-title': 'Новости',
        'announcements-title': 'Объявления',
        'sunday-school-title': 'Воскресные школы',
        'faq-title': 'Вопросы и ответы',
        'ask-question': 'Задать вопрос',
        'your-name': 'Ваше имя',
        'your-question': 'Ваш вопрос',
        'send': 'Отправить',
        'question-sent': 'Ваш вопрос отправлен. Ожидайте ответа.',
        'no-faq': 'Нет вопросов',
        'admin-faq': 'Управление вопросами и ответами',
        'vacant': 'Приход вакантный',
        'back': '← Назад',
        'history': 'История храма',
        'local-history': 'История местности',
        'map': 'Карта',
        'rector': 'Настоятель',
        'clergy-list': 'Священнослужители и работники храма',
        'no-clergy': 'Нет священнослужителей',
        'select-temple': 'Выберите храм',
        'no-schedule': 'Нет запланированных богослужений',
        'date': 'Дата',
        'event': 'Событие',
        'temple': 'Храм',
        'no-news': 'Нет новостей',
        'no-announcements': 'Нет объявлений',
        'no-sunday-schools': 'Нет воскресных школ',
        'sunday-school-type': 'Тип школы',
        'sunday-school-desc': 'Описание',
        'admin-schedule': 'Управление расписанием',
        'admin-users': 'Управление пользователями',
        'add-schedule': '➕ Добавить запись',
        'schedule-date': 'Дата (ГГГГ-ММ-ДД)',
        'schedule-event': 'Событие',
        'save': 'Сохранить',
        'delete': 'Удалить',
        'edit': 'Редактировать',
        'cancel': 'Отмена',
        'confirm-delete': 'Вы уверены?',
        'saved': 'Сохранено',
        'deleted': 'Удалено',
        'error': 'Ошибка',
        'choose-temple': 'Выберите храм',
        'no-temples': 'Нет храмов',
        'no-users': 'Нет пользователей',
        'logout': 'Выйти',
        'delete-past': '🗑️ Удалить прошедшие',
        'past-deleted': 'Прошедшие записи удалены',
        'add-user': 'Добавить пользователя',
        'edit-user': 'Редактировать пользователя',
        'permissions': 'Права',
        'manage-users': 'Управление пользователями',
        'manage-temples': 'Управление храмами',
        'manage-clergy': 'Управление духовенством',
        'manage-schedule': 'Управление расписанием',
        'manage-news': 'Управление новостями',
        'manage-announcements': 'Управление объявлениями',
        'manage-sunday-schools': 'Управление воскресными школами',
        'manage-about': 'Управление страницей "О благочинии"',
        'manage-worship': 'Управление богослужениями',
        'manage-ai': 'Использование ИИ',
        'role-developer': 'Главный разработчик',
        'role-senior': 'Старший администратор',
        'role-junior': 'Младший администратор',
        'role-editor': 'Редактор',
        'username': 'Логин',
        'password': 'Пароль',
        'role': 'Роль',
        'ai-chat': '🤖 Спросить у ИИ',
        'ai-question': 'Ваш вопрос к ИИ',
        'ai-answer': 'Ответ ИИ',
        'ai-thinking': 'ИИ думает...',
        'ai-error': 'Ошибка при обращении к ИИ'
    }
};

// ========== РОЛИ И ПРАВА ==========
const rolePermissions = {
    developer: ['all'],
    senior: ['manage_temples','manage_clergy','manage_schedule','manage_news','manage_announcements','manage_sunday_schools','manage_about','manage_worship','manage_ai'],
    junior: ['manage_schedule','manage_news','manage_announcements','manage_ai'],
    editor: ['manage_news','manage_announcements']
};
const allPermissions = ['manage_temples','manage_clergy','manage_schedule','manage_news','manage_announcements','manage_sunday_schools','manage_about','manage_worship','manage_users','manage_ai'];

// ========== ДАННЫЕ ==========
let data = {
    temples: [],
    clergy: [],
    schedules: [],
    news: [],
    announcements: [],
    sundaySchools: [],
    aboutText: 'Дзержинское благочиние объединяет приходы города Дзержинска и Дзержинского района. Благочинный – протоиерей Борис Полторжицкий. В благочинии действуют 7 храмов, ведутся активная социальная и молодёжная работа, работают воскресные школы.',
    worship: { prayers: [], calendar: [], readings: { apostol: '', evangelie: '' }, interpretations: [], sacraments: [] },
    faq: [],
    users: []
};
let nextId = { temple: 1, clergy: 1, schedule: 1, news: 1, announcement: 1, sundaySchool: 1, faq: 1, user: 1 };
let currentLang = 'ru';
let currentUser = null;
let dataLoaded = false;
let visionMode = false;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[m])); }
function t(key) { return translations[currentLang]?.[key] || key; }
function getTempleName(id) { const t = data.temples.find(t => t.id === id); return t ? t.name : '?'; }
function getTempleNames(ids) { if (!ids || !ids.length) return 'не привязан'; return ids.map(id => getTempleName(id)).join(', '); }
function getTemplePhoto(temple) { return temple?.photo?.trim() || 'placeholder.jpg'; }
function hasPermission(user, permission) { return user?.permissions?.includes('all') || user?.permissions?.includes(permission) || false; }

// ========== ЗАГРУЗКА И СОХРАНЕНИЕ (без изменений) ==========
function loadData() {
    if (dataLoaded) return;
    dataLoaded = true;
    const stored = localStorage.getItem('blago_data');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            data = parsed.data || data;
            nextId = parsed.nextId || nextId;
            migrateData();
            renderCurrentPage();
            applyTranslations();
            fillTempleDropdown();
            restoreVisionMode();
        } catch(e) { console.warn('Ошибка загрузки localStorage', e); initDefaultData(); }
    } else {
        initDefaultData();
    }
    db.ref('data').on('value', snap => {
        const val = snap.val();
        if (val) {
            data = val.data || data;
            nextId = val.nextId || nextId;
            migrateData();
            saveToLocalStorage();
            renderCurrentPage();
            applyTranslations();
            fillTempleDropdown();
        }
    });
    db.ref('data').once('value', snap => {
        if (!snap.val()) initDefaultData();
    });
}

function migrateData() {
    data.users.forEach(u => { if (!u.permissions) u.permissions = rolePermissions[u.role] || rolePermissions.junior; });
    ['news','announcements','schedules','sundaySchools','faq','temples','clergy'].forEach(k => { if (!data[k]) data[k] = []; });
    if (!data.worship) data.worship = { prayers: [], calendar: [], readings: { apostol: '', evangelie: '' }, interpretations: [], sacraments: [] };
    if (!data.aboutText) data.aboutText = '';
    if (!data.users) data.users = [];
    if (data.users.length === 0) data.users.push({ id: nextId.user++, username: 'Makar', password: 'Makar27.05.2014', role: 'developer', permissions: ['all'] });
    setDefaultPhotos();
}

function saveData() { saveToLocalStorage(); saveToFirebase(); }
function saveToLocalStorage() { localStorage.setItem('blago_data', JSON.stringify({ data, nextId })); localStorage.setItem('vision_mode', visionMode ? 'on' : 'off'); }
function saveToFirebase() { db.ref('data').set({ data, nextId }).catch(err => console.error('Ошибка сохранения в Firebase:', err)); }
function setDefaultPhotos() {
    data.temples.forEach(t => { if (!t.photo) t.photo = 'placeholder.jpg'; });
    data.clergy.forEach(c => { if (!c.photo) c.photo = 'placeholder.jpg'; });
    data.sundaySchools.forEach(s => { if (!s.photo) s.photo = 'placeholder.jpg'; });
}

// ========== ИНИЦИАЛИЗАЦИЯ ДАННЫХ ==========
function initDefaultData() {
    data = {
        temples: [
            { id:1, name:'Храм Покрова Пресвятой Богородицы, г. Дзержинск', photo:'pokrov-dzr.jpg', summary:'Храм Покрова Пресвятой Богородицы © Беларусь, Минская область, г. Дзержинск.', address:'Минская область, г. Дзержинск, ул. Покровская, 1', phone:'', email:'', history:'Храм построен в середине XIX века.', localHistory:'Город Дзержинск (Койданово) известен с XVI века.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.132867%2C53.684692&mode=search&oid=229759500085&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:2, name:'Храм Вознесения Господня, г. Фаниполь', photo:'voznesenie-fanipol.jpg', summary:'Храм Вознесения Господня © Беларусь, Минская область, г. Фаниполь.', address:'Минская область, г. Фаниполь, ул. Школьная, 10', phone:'', email:'', history:'Храм действует с 1990-х годов.', localHistory:'Город Фаниполь – крупный железнодорожный узел.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.315962%2C53.738880&mode=search&oid=1369676511&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:3, name:'Храм святителя Николая Чудотворца, д. Станьково', photo:'nikolay-stankovo.jpg', summary:'Храм святителя Николая Чудотворца © Беларусь, Минская область, д. Станьково.', address:'Минская область, Дзержинский район, д. Станьково, ул. Центральная, 5', phone:'', email:'', history:'Храм известен с XIX века.', localHistory:'Деревня Станьково – родина поэта Я. Купалы.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.224496%2C53.630899&mode=search&oid=168232275383&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:5, name:'Храм святителя Николая Чудотворца, п. Энергетиков', photo:'nikolay-energetikov.jpg', summary:'Храм святителя Николая Чудотворца © Беларусь, Минская область, п. Энергетиков.', address:'Минская область, Дзержинский район, п. Энергетиков, ул. Школьная, 3', phone:'', email:'', history:'Храм построен в 1990-е годы.', localHistory:'Посёлок Энергетиков возник при строительстве Минской ТЭЦ-4.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.051849%2C53.583704&mode=search&oid=131806639679&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:6, name:'Храм Преображения Господня, д. Черкассы', photo:'preobrazhenie-cherkassy.jpg', summary:'Храм Преображения Господня © Беларусь, Минская область, аг. Черкассы.', address:'Минская область, Дзержинский район, аг. Черкассы, ул. Центральная, 12', phone:'', email:'', history:'Храм построен в начале XX века.', localHistory:'Деревня Черкассы – старинное поселение.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.326526%2C53.758650&mode=search&oid=22143657705&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:7, name:'Храм Новомучеников Белорусских, г. Дзержинск', photo:'novomucheniki-dzerzhinsk.jpg', summary:'Храм Новомучеников Белорусских © Беларусь, Минская область, г. Дзержинск.', address:'Минская область, г. Дзержинск, ул. Советская, 45', phone:'', email:'', history:'Новый храм, освящён в 2010-х годах.', localHistory:'Город Дзержинск – центр благочиния.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.110903%2C53.668974&mode=search&oid=14672378090&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:8, name:'Храм святых бессребреников Космы и Дамиана, п. Негорелое', photo:'kosma-damian.jpg', summary:'Храм святых бессребреников Космы и Дамиана © Беларусь, Минская область, п. Негорелое. Строящийся храм.', address:'Минская область, Дзержинский район, п. Негорелое, ул. Вокзальная, 2', phone:'', email:'', history:'Строящийся храм.', localHistory:'Посёлок Негорелое – крупный железнодорожный узел.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.090108%2C53.610051&mode=search&oid=119295910603&ol=biz&z=14.55" width="100%" height="300" frameborder="0"></iframe>', isVacant:false }
        ],
        clergy: [
            { id:1, name:'Полторжицкий Борис Кубович', rank:'Протоиерей', photo:'poltorzhitsky.jpg', description:'Настоятель храма Покрова Пресвятой Богородицы г. Дзержинска...', templeIds:[1,2] },
            { id:2, name:'Гончарук Кирилл Иванович', rank:'Иерей', photo:'goncharuk.jpg', description:'...', templeIds:[1] },
            { id:3, name:'Бусько Николай Олегович', rank:'Иерей', photo:'busko.jpg', description:'...', templeIds:[2] },
            { id:4, name:'Сенкевич Павел Александрович', rank:'Иерей', photo:'senkevich.jpg', description:'...', templeIds:[1] },
            { id:5, name:'Иеромонах Иоанн (Новиков)', rank:'Иеромонах', photo:'ioann-novikov.jpg', description:'...', templeIds:[5,8] },
            { id:6, name:'Микицкий Александр Петрович', rank:'Протоиерей', photo:'mikitsky.jpg', description:'...', templeIds:[3] },
            { id:7, name:'Кололо Николай Сергеевич', rank:'Иерей', photo:'kololo.jpg', description:'...', templeIds:[6] },
            { id:8, name:'Линкевич Сергий Владимирович', rank:'Протоиерей', photo:'linkevich.jpg', description:'...', templeIds:[7] }
        ],
        schedules: [],
        news: [],
        announcements: [],
        sundaySchools: [],
        aboutText: 'Дзержинское благочиние объединяет приходы города Дзержинска и Дзержинского района. Благочинный – протоиерей Борис Полторжицкий. В благочинии действуют 7 храмов, ведутся активная социальная и молодёжная работа, работают воскресные школы.',
        worship: { prayers: [], calendar: [], readings: { apostol: '', evangelie: '' }, interpretations: [], sacraments: [] },
        faq: [],
        users: [ { id:1, username:'Makar', password:'Makar27.05.2014', role:'developer', permissions:['all'] } ]
    };
    nextId = { temple:9, clergy:9, schedule:1, news:1, announcement:1, sundaySchool:1, faq:1, user:2 };
    setDefaultPhotos();
    saveData();
    renderCurrentPage();
    applyTranslations();
    fillTempleDropdown();
    restoreVisionMode();
}

// ========== РЕНДЕРИНГ СТРАНИЦ (основные функции) ==========
function renderCurrentPage() {
    const container = document.getElementById('mainContent');
    if (!container) { console.error('mainContent not found'); return; }
    const page = document.body.dataset.page || 'main';
    const urlParams = new URLSearchParams(window.location.search);
    const isDetail = urlParams.has('id');
    if (isDetail) {
        document.querySelectorAll('.top-bar nav a').forEach(a => a.classList.toggle('active', a.dataset.page === 'main'));
        updateVisionUI();
        return;
    }
    container.innerHTML = '';
    switch (page) {
        case 'main': renderMainPage(); break;
        case 'temples': renderTemplesList(container); break;
        case 'clergy': renderClergyList(container); break;
        case 'news': renderNewsList(container); break;
        case 'announcements': renderAnnouncementsList(container); break;
        case 'sunday-school': renderSundaySchoolsList(container); break;
        case 'about': renderAboutPage(container); break;
        case 'worship': renderWorshipPage(container); break;
        case 'faq': renderFaqPage(container); break;
        default: container.innerHTML = '<p>Страница не найдена</p>';
    }
    applyTranslations();
    document.querySelectorAll('.top-bar nav a').forEach(a => a.classList.toggle('active', a.dataset.page === page));
    updateVisionUI();
}

// ГЛАВНАЯ
function renderMainPage() {
    const container = document.getElementById('mainContent');
    let html = `<div class="hero-banner" onclick="window.location.href='temple-detail.html?id=1'"><div style="text-align:center;z-index:2;"><h1>Храм Покрова Пресвятой Богородицы</h1><div class="sub">г. Дзержинск</div></div></div>
    <h2 style="margin:1.5rem 0 0.5rem;text-align:center;font-family:'Cormorant Uncial',serif;">Наши храмы</h2>
    <div class="carousel"><button class="carousel-btn left" onclick="scrollCarousel(-1)">‹</button><div class="carousel-track" id="carouselTrack">`;
    data.temples.forEach(t => {
        if (t.id === 1) return;
        html += `<div class="carousel-item" data-id="${t.id}"><img src="${escapeHtml(getTemplePhoto(t))}" alt="${escapeHtml(t.name)}" loading="lazy"><div class="info">${escapeHtml(t.name)}</div></div>`;
    });
    html += `</div><button class="carousel-btn right" onclick="scrollCarousel(1)">›</button></div>`;
    // Новости
    html += `<div class="card"><h2>${t('latest-news')}</h2>`;
    const news = [...data.news].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
    if (!news.length) html += `<p>${t('no-news')}</p>`;
    else {
        news.forEach(n => {
            let media = '';
            if (n.media && n.media.startsWith('http')) {
                if (n.media.match(/\.(jpe?g|png|gif|webp)$/i)) media = `<img src="${escapeHtml(n.media)}" style="max-width:100%;max-height:200px;border-radius:8px;margin:0.5rem 0;">`;
                else if (n.media.match(/\.(mp4|webm|ogg)$/i)) media = `<video src="${escapeHtml(n.media)}" style="max-width:100%;max-height:200px;border-radius:8px;margin:0.5rem 0;" controls></video>`;
            }
            html += `<div><strong>${escapeHtml(n.title)}</strong> <span style="font-size:0.85rem;color:#999;">${escapeHtml(n.date)}</span>${media}<p>${escapeHtml(n.text)}</p></div>`;
        });
        html += `<a href="news.html" style="color:var(--gold);">${t('all-news')}</a>`;
    }
    html += `</div>`;
    // Объявления
    html += `<div class="card"><h2>${t('latest-announcements')}</h2>`;
    const ann = [...data.announcements].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
    if (!ann.length) html += `<p>${t('no-announcements')}</p>`;
    else {
        ann.forEach(a => html += `<div><p>${escapeHtml(a.text)}</p><span style="font-size:0.85rem;color:#999;">${escapeHtml(a.date)}</span></div>`);
        html += `<a href="announcements.html" style="color:var(--gold);">${t('all-announcements')}</a>`;
    }
    html += `</div>`;
    container.innerHTML = html;
    container.querySelectorAll('.carousel-item').forEach(el => el.addEventListener('click', function() { window.location.href = `temple-detail.html?id=${this.dataset.id}`; }));
}
function scrollCarousel(direction) { const track = document.getElementById('carouselTrack'); if (track) track.scrollBy({ left: direction * 280, behavior: 'smooth' }); }

// ВЫПАДАЮЩЕЕ МЕНЮ
function fillTempleDropdown() {
    document.querySelectorAll('.dropdown-content').forEach(container => {
        container.innerHTML = '';
        data.temples.forEach(t => {
            const a = document.createElement('a');
            a.textContent = t.name;
            a.href = `temple-detail.html?id=${t.id}`;
            container.appendChild(a);
        });
    });
}

// СПИСОК ХРАМОВ
function renderTemplesList(container) {
    let html = `<h2>${t('temples-title')}</h2><div class="grid">`;
    data.temples.forEach(t => {
        html += `<div class="grid-item" data-id="${t.id}" data-type="temple">
            <img src="${escapeHtml(getTemplePhoto(t))}" alt="${escapeHtml(t.name)}" loading="lazy">
            <div class="info"><h3>${escapeHtml(t.name)}</h3>${t.isVacant ? `<div class="status vacant">${t('vacant')}</div>` : ''}</div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    container.querySelectorAll('.grid-item[data-type="temple"]').forEach(el => el.addEventListener('click', function() { window.location.href = `temple-detail.html?id=${this.dataset.id}`; }));
}

// ДЕТАЛЬНАЯ СТРАНИЦА ХРАМА
function renderTempleDetail(container, id) {
    if (!data.temples || data.temples.length === 0) { setTimeout(() => renderTempleDetail(container, id), 200); return; }
    const temple = data.temples.find(t => t.id === id);
    if (!temple) { container.innerHTML = '<p>Храм не найден</p>'; return; }
    const clergyList = data.clergy.filter(c => c.templeIds && c.templeIds.includes(id));
    const scheduleList = data.schedules.filter(s => s.templeId === id);
    const photoSrc = getTemplePhoto(temple);
    let html = `<div class="detail-back" onclick="window.location.href='temples.html'">${t('back')}</div>
    <div class="detail-content">
        <img src="${escapeHtml(photoSrc)}" class="main-photo">
        <h2 class="temple-title">${escapeHtml(temple.name)}</h2>
        <div class="temple-summary"><p>${escapeHtml(temple.summary||'')}</p>${temple.address ? `<p class="address">📍 ${escapeHtml(temple.address)}</p>` : ''}</div>
        <div class="temple-actions">
            <button class="action-btn" onclick="toggleClergy()">👥 ${t('clergy-list')}</button>
            <button class="action-btn" onclick="toggleContacts()">📞 Контакты</button>
            <button class="action-btn" onclick="toggleSchedule()">📅 ${t('schedule-title')}</button>
            ${temple.phone ? `<a href="tel:${escapeHtml(temple.phone)}" class="action-btn phone-btn">📱 Позвонить</a>` : ''}
        </div>
        <div id="templeClergy" style="display:none;"><h3>${t('clergy-list')}</h3>${clergyList.length ? `<div class="clergy-list">${clergyList.map(c => `<div class="clergy-card" data-id="${c.id}"><img src="${escapeHtml(c.photo||'placeholder.jpg')}"><div><strong>${escapeHtml(c.name)}</strong></div><div style="font-size:0.85rem;">${escapeHtml(c.rank)}</div></div>`).join('')}</div>` : `<p>${t('no-clergy')}</p>`}</div>
        <div id="templeContacts" style="display:none;"><div class="temple-contacts">${temple.phone ? `<div><strong>📞 Телефон:</strong> <a href="tel:${escapeHtml(temple.phone)}">${escapeHtml(temple.phone)}</a></div>` : ''}${temple.email ? `<div><strong>📧 Email:</strong> <a href="mailto:${escapeHtml(temple.email)}">${escapeHtml(temple.email)}</a></div>` : ''}${temple.address ? `<div><strong>📍 Адрес:</strong> ${escapeHtml(temple.address)}</div>` : ''}<div class="map-container">${temple.mapCode || '<p>Карта не добавлена.</p>'}</div></div></div>
        <div id="templeSchedule" style="display:none;">${scheduleList.length ? `<table class="schedule-table"><thead><tr><th>${t('date')}</th><th>${t('event')}</th></tr></thead><tbody>${scheduleList.map(s => `<tr><td>${escapeHtml(s.date)}</td><td>${escapeHtml(s.event)}</td></tr>`).join('')}</tbody></table>` : `<p>${t('no-schedule')}</p>`}</div>
        <div class="tabs"><button class="tab-btn active" data-tab="history">${t('history')}</button><button class="tab-btn" data-tab="local-history">${t('local-history')}</button></div>
        <div id="tab-history" class="tab-content active"><p>${escapeHtml(temple.history) || 'История не добавлена.'}</p></div>
        <div id="tab-local-history" class="tab-content"><p>${escapeHtml(temple.localHistory) || 'История местности не добавлена.'}</p></div>
    </div>`;
    container.innerHTML = html;
    container.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', function() {
        const tab = this.dataset.tab;
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById('tab-'+tab)?.classList.add('active');
    }));
    container.querySelectorAll('.clergy-card').forEach(el => el.addEventListener('click', function() { window.location.href = `clergy-detail.html?id=${this.dataset.id}`; }));
    window.toggleClergy = function() { const b = document.getElementById('templeClergy'); if (b) b.style.display = b.style.display==='none'?'block':'none'; };
    window.toggleContacts = function() { const b = document.getElementById('templeContacts'); if (b) b.style.display = b.style.display==='none'?'block':'none'; };
    window.toggleSchedule = function() { const b = document.getElementById('templeSchedule'); if (b) b.style.display = b.style.display==='none'?'block':'none'; };
}

// ДУХОВЕНСТВО
function renderClergyList(container) {
    let html = `<h2>${t('clergy-title')}</h2><div class="grid" id="clergyList">`;
    data.clergy.forEach(c => {
        html += `<div class="grid-item" data-id="${c.id}" data-type="clergy">
            <img src="${escapeHtml(c.photo||'placeholder.jpg')}" alt="${escapeHtml(c.name)}" loading="lazy" style="border-radius:20px; height:400px; object-fit:cover;">
            <div class="info"><h3>${escapeHtml(c.name)}</h3><div class="status">${escapeHtml(c.rank)}</div><div style="font-size:0.8rem;color:#999;">${getTempleNames(c.templeIds)}</div></div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    container.querySelectorAll('.grid-item[data-type="clergy"]').forEach(el => el.addEventListener('click', function() { window.location.href = `clergy-detail.html?id=${this.dataset.id}`; }));
}
function renderClergyDetail(id) {
    if (!data.clergy || data.clergy.length === 0) { setTimeout(() => renderClergyDetail(id), 200); return; }
    const c = data.clergy.find(c => c.id === id);
    if (!c) { document.getElementById('mainContent').innerHTML = '<p>Священнослужитель не найден</p>'; return; }
    const container = document.getElementById('mainContent');
    container.innerHTML = `<div class="detail-back" onclick="window.location.href='clergy.html'">${t('back')}</div>
    <div class="detail-content">
        <img src="${escapeHtml(c.photo||'placeholder.jpg')}" alt="${escapeHtml(c.name)}" style="border-radius:20px; width:100%; max-width:400px; height:auto; object-fit:cover; margin:0 auto 1rem; display:block;">
        <h2>${escapeHtml(c.name)}</h2>
        <p><strong>${t('clergy-rank')}:</strong> ${escapeHtml(c.rank)}</p>
        <p><strong>${t('temple')}:</strong> ${getTempleNames(c.templeIds)}</p>
        <p><strong>${t('clergy-desc')}:</strong> ${escapeHtml(c.description) || 'Описание отсутствует.'}</p>
    </div>`;
}

// РАСПИСАНИЕ (вкладка)
function getScheduleHTML() {
    let html = `<h2>${t('schedule-title')}</h2>
        <div class="card">
            <h3>${t('select-temple')}</h3>
            <select id="scheduleTempleSelect" style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border);">
                <option value="">${t('choose-temple')}</option>`;
    data.temples.forEach(t => html += `<option value="${t.id}">${escapeHtml(t.name)}</option>`);
    html += `</select></div><div id="scheduleDisplay"></div>`;
    return html;
}
function initScheduleSelect(container) {
    const select = container.querySelector('#scheduleTempleSelect');
    if (!select) return;
    select.addEventListener('change', function() {
        const tid = parseInt(this.value);
        const display = container.querySelector('#scheduleDisplay');
        if (!tid) { display.innerHTML = `<p>${t('select-temple')}</p>`; return; }
        const schedules = data.schedules.filter(s => s.templeId === tid);
        if (!schedules.length) { display.innerHTML = `<p>${t('no-schedule')}</p>`; return; }
        let table = `<table class="schedule-table"><thead><tr><th>${t('date')}</th><th>${t('event')}</th></tr></thead><tbody>`;
        schedules.forEach(s => table += `<tr><td>${escapeHtml(s.date)}</td><td>${escapeHtml(s.event)}</td></tr>`);
        table += `</tbody></table>`;
        display.innerHTML = table;
    });
}

// НОВОСТИ
function renderNewsList(container) {
    let html = `<h2>${t('news-title')}</h2>`;
    const news = data.news||[];
    if (!news.length) html += `<p>${t('no-news')}</p>`;
    else {
        const sorted = [...news].sort((a,b)=>new Date(b.date)-new Date(a.date));
        sorted.forEach(n => {
            let media = '';
            if (n.media && n.media.startsWith('http')) {
                if (n.media.match(/\.(jpe?g|png|gif|webp)$/i)) media = `<img src="${escapeHtml(n.media)}" style="max-width:100%;max-height:300px;border-radius:8px;margin:0.5rem 0;">`;
                else if (n.media.match(/\.(mp4|webm|ogg)$/i)) media = `<video src="${escapeHtml(n.media)}" style="max-width:100%;max-height:300px;border-radius:8px;margin:0.5rem 0;" controls></video>`;
            }
            html += `<div class="card"><h3>${escapeHtml(n.title)}</h3><p style="font-size:0.85rem;color:#999;">${escapeHtml(n.date)}</p>${media}<p>${escapeHtml(n.text)}</p></div>`;
        });
    }
    container.innerHTML = html;
}

// ОБЪЯВЛЕНИЯ
function renderAnnouncementsList(container) {
    let html = `<h2>${t('announcements-title')}</h2>`;
    const ann = data.announcements||[];
    if (!ann.length) html += `<p>${t('no-announcements')}</p>`;
    else {
        const sorted = [...ann].sort((a,b)=>new Date(b.date)-new Date(a.date));
        sorted.forEach(a => html += `<div class="card"><p>${escapeHtml(a.text)}</p><p style="font-size:0.85rem;color:#999;">${escapeHtml(a.date)}</p></div>`);
    }
    container.innerHTML = html;
}

// ВОСКРЕСНЫЕ ШКОЛЫ
function renderSundaySchoolsList(container) {
    let html = `<h2>${t('sunday-school-title')}</h2>
        <div class="card"><p><strong>Важно:</strong> Ввиду изменения в законодательстве РБ в данном опросе под воскресными школами (ВШ) подразумеваются все возможные формы организации религиозного просвещения детей и взрослых на приходах Белорусского Экзархата.</p>
        <p><strong>В ВШ входят:</strong></p>
        <ul style="margin-left:1.5rem;margin-top:0.5rem;">
            <li><strong>Воскресная религиозная школа (ВРШ)</strong> - форма организации религиозного просвещения детей, подразумевающая разделение воспитанников на несколько групп по возрастному или иному критерию.</li>
            <li><strong>Воскресная религиозная группа (ВРГ)</strong> - форма организации религиозного просвещения детей без разделения их на группы (смешанная разновозрастная группа).</li>
            <li><strong>Группа религиозного просвещения взрослых (ГРПВ)</strong> - в данную категорию ВШ входят всевозможные регулярные формы религиозного просвещения взрослых: библейские (евангельские) группы, Патриаршая программа изучения Библии, катехизические беседы или курсы, лектории, приходские курсы по изучению богослужения, истории Церкви, Священного Писания и т.д., систематические встречи и беседы со священнослужителями и др., проводимые не реже 1 раза в месяц.</li>
        </ul></div>
        <div class="grid">`;
    (data.sundaySchools||[]).forEach(s => {
        const temple = data.temples.find(t => t.id === s.templeId);
        html += `<div class="grid-item" data-id="${s.id}" data-type="sunday-school">
            <img src="${escapeHtml(s.photo||'placeholder.jpg')}" alt="${escapeHtml(s.name)}" loading="lazy">
            <div class="info"><h3>${escapeHtml(s.name)}</h3><div class="type">${escapeHtml(s.type)}</div><div style="font-size:0.85rem;color:#999;">${temple ? escapeHtml(temple.name) : 'Без привязки'}</div></div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    container.querySelectorAll('.grid-item[data-type="sunday-school"]').forEach(el => el.addEventListener('click', function() { window.location.href = `sunday-school-detail.html?id=${this.dataset.id}`; }));
}
function renderSundaySchoolDetail(id) {
    const school = data.sundaySchools.find(s => s.id === id);
    if (!school) { document.getElementById('mainContent').innerHTML = '<p>Школа не найдена</p>'; return; }
    const container = document.getElementById('mainContent');
    const temple = data.temples.find(t => t.id === school.templeId);
    container.innerHTML = `<div class="detail-back" onclick="window.location.href='sunday-school.html'">${t('back')}</div>
    <div class="detail-content">
        <img src="${escapeHtml(school.photo||'placeholder.jpg')}" alt="${escapeHtml(school.name)}">
        <h2>${escapeHtml(school.name)}</h2>
        <p><strong>${t('sunday-school-type')}:</strong> ${escapeHtml(school.type)}</p>
        <p><strong>${t('temple')}:</strong> ${temple ? escapeHtml(temple.name) : 'Без привязки'}</p>
        <p><strong>${t('sunday-school-desc')}:</strong> ${escapeHtml(school.description) || 'Описание отсутствует.'}</p>
    </div>`;
}

// О БЛАГОЧИНИИ
function renderAboutPage(container) {
    container.innerHTML = `<h2>${t('nav-about')}</h2>
        <div class="card"><div style="white-space:pre-line;">${escapeHtml(data.aboutText || 'Информация о благочинии не добавлена.')}</div></div>`;
}

// БОГОСЛУЖЕНИЯ
function renderWorshipPage(container) {
    const tabs = [
        { id: 'schedule', label: 'Расписание' },
        { id: 'prayers', label: 'Молитвослов' },
        { id: 'calendar', label: 'Календарь' },
        { id: 'readings', label: 'Чтения дня' },
        { id: 'interpretations', label: 'Толкования' },
        { id: 'sacraments', label: 'Подготовка к таинствам' }
    ];
    let html = `<h2>${t('nav-worship')}</h2>
        <div class="card">
            <div class="tabs worship-tabs" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">`;
    tabs.forEach((tab, idx) => {
        html += `<button class="tab-btn worship-tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${tab.id}" style="padding:0.6rem 1.2rem; border:2px solid var(--gold); border-radius:40px; background:transparent; color:var(--primary); font-weight:600; cursor:pointer; transition:all 0.3s; font-family:inherit; font-size:0.95rem;">${tab.label}</button>`;
    });
    html += `</div><div class="worship-content" id="worshipContent">`;
    // Расписание
    html += `<div class="worship-block active" id="worship-schedule">${getScheduleHTML()}</div>`;
    // Молитвослов
    html += `<div class="worship-block" id="worship-prayers">`;
    const prayers = data.worship?.prayers || [];
    if (!prayers.length) html += `<p>Молитвы не добавлены.</p>`;
    else prayers.forEach(p => html += `<div class="prayer-item"><strong>${escapeHtml(p.title)}</strong><p>${escapeHtml(p.text)}</p></div>`);
    html += `</div>`;
    // Календарь
    html += `<div class="worship-block" id="worship-calendar">
        <div class="worship-calendar-container">
            <h3>${t('calendar-title')}</h3>
            <div>
                <script language="Javascript" src="https://script.pravoslavie.ru/calendar.php"></script>
            </div>
        </div>
    </div>`;
    // Чтения дня
    html += `<div class="worship-block" id="worship-readings">
        <h3>Чтения дня</h3>
        <p><strong>Апостол:</strong> ${escapeHtml(data.worship?.readings?.apostol || '')}</p>
        <p><strong>Евангелие:</strong> ${escapeHtml(data.worship?.readings?.evangelie || '')}</p>
    </div>`;
    // Толкования
    html += `<div class="worship-block" id="worship-interpretations">`;
    const interpretations = data.worship?.interpretations || [];
    if (!interpretations.length) html += `<p>Толкования не добавлены.</p>`;
    else interpretations.forEach(i => html += `<div class="interpretation-item"><strong>${escapeHtml(i.title)}</strong><p>${escapeHtml(i.text)}</p></div>`);
    html += `</div>`;
    // Подготовка к таинствам
    html += `<div class="worship-block" id="worship-sacraments">`;
    const sacraments = data.worship?.sacraments || [];
    if (!sacraments.length) html += `<p>Подготовка к таинствам не добавлена.</p>`;
    else sacraments.forEach(s => html += `<div class="sacrament-item"><strong>${escapeHtml(s.title)}</strong><p>${escapeHtml(s.text)}</p></div>`);
    html += `</div>`;
    html += `</div></div>`;
    container.innerHTML = html;
    initScheduleSelect(container);
    container.querySelectorAll('.worship-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            container.querySelectorAll('.worship-tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--primary)';
            });
            this.classList.add('active');
            this.style.background = 'var(--gold)';
            this.style.color = 'white';
            container.querySelectorAll('.worship-block').forEach(block => block.classList.remove('active'));
            const target = document.getElementById('worship-' + tabId);
            if (target) target.classList.add('active');
        });
        if (btn.classList.contains('active')) {
            btn.style.background = 'var(--gold)';
            btn.style.color = 'white';
        }
    });
}

// FAQ
function renderFaqPage(container) {
    let html = `<h2>${t('faq-title')}</h2>
        <div id="faqForm" class="card">
            <h3>${t('ask-question')}</h3>
            <form id="askForm">
                <input type="text" id="questionName" placeholder="${t('your-name')}" required>
                <textarea id="questionText" rows="4" placeholder="${t('your-question')}" required></textarea>
                <button type="submit">${t('send')}</button>
            </form>
            <div id="formMessage"></div>
        </div>
        <div id="faqList" class="card">
            <h3>${t('admin-faq')}</h3>`;
    const faq = data.faq||[];
    if (!faq.length) html += `<p>${t('no-faq')}</p>`;
    else {
        const sorted = [...faq].sort((a,b)=>new Date(b.date)-new Date(a.date));
        sorted.forEach(item => {
            html += `<div class="faq-item">
                <div class="question">${escapeHtml(item.question)}</div>
                ${item.answer ? `<div class="answer">${escapeHtml(item.answer)}</div>` : '<div style="color:#999;">Ожидает ответа</div>'}
                <div class="date">${escapeHtml(item.date)} | ${escapeHtml(item.name)}</div>
            </div>`;
        });
    }
    html += `</div>`;
    // Блок ИИ
    if (hasPermission(currentUser, 'manage_ai')) {
        html += `
            <div class="card" id="aiBlock">
                <h2>${t('ai-chat')}</h2>
                <div class="form-group">
                    <textarea id="aiQuestion" rows="3" placeholder="${t('ai-question')}" style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"></textarea>
                </div>
                <button id="askAIBtn" class="btn" style="padding:0.6rem 1.5rem; background:var(--gold); color:white; border:none; border-radius:40px; cursor:pointer; font-family:inherit; font-size:1rem;">${t('send')}</button>
                <div id="aiAnswer" style="margin-top:1rem; padding:1rem; background:var(--bg); border-radius:16px; display:none;">
                    <strong>${t('ai-answer')}:</strong>
                    <div id="aiResponseContent"></div>
                </div>
            </div>
        `;
    }
    // Форма обратной связи
    html += `<div class="card">
        <h2>📬 Написать в Telegram</h2>
        <p style="margin-bottom: 1rem;">Ваше сообщение будет отправлено напрямую в Telegram.</p>
        <form action="send.php" method="POST" id="feedbackForm" style="max-width: 500px; margin: 0 auto;">
            <div class="form-group"><input type="text" name="name" placeholder="Ваше имя" required style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"></div>
            <div class="form-group"><select name="theme" style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"><option value="">Выберите тему (необязательно)</option><option value="Предложение">📝 Предложение</option><option value="Замечание">⚠️ Замечание</option><option value="Вопрос">❓ Вопрос</option><option value="Другое">📩 Другое</option></select></div>
            <div class="form-group"><textarea name="message" rows="5" placeholder="Ваше сообщение..." required style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"></textarea></div>
            <button type="submit" class="btn" style="width:100%; padding:0.6rem; background:var(--gold); color:white; border:none; border-radius:40px; cursor:pointer; font-family:inherit; font-size:1rem;">📨 Отправить</button>
        </form>
        <div id="formResult" style="margin-top:1rem; text-align:center; font-weight:500;"></div>
        <p style="text-align:center; margin-top:1rem; font-size:0.85rem; color:#999;">Или напишите нам в <a href="https://t.me/ВАШ_USERNAME_BOTA" target="_blank" style="color:var(--gold);">Telegram</a></p>
    </div>`;
    container.innerHTML = html;
    document.getElementById('askForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('questionName').value.trim();
        const question = document.getElementById('questionText').value.trim();
        if (!name || !question) { alert('Заполните все поля'); return; }
        data.faq.push({ id: nextId.faq++, name, question, answer: '', date: new Date().toISOString().slice(0,10) });
        saveData();
        document.getElementById('formMessage').innerHTML = `<p style="color:green;">${t('question-sent')}</p>`;
        document.getElementById('questionName').value = '';
        document.getElementById('questionText').value = '';
        setTimeout(() => renderFaqPage(container), 1000);
    });
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const resultDiv = document.getElementById('formResult');
            resultDiv.innerHTML = '⏳ Отправка...';
            try {
                const response = await fetch('send.php', { method: 'POST', body: formData });
                const text = await response.text();
                resultDiv.innerHTML = text;
                if (text.includes('Спасибо')) this.reset();
            } catch (error) {
                resultDiv.innerHTML = '❌ Ошибка соединения. Попробуйте позже.';
            }
        });
    }
    document.getElementById('askAIBtn')?.addEventListener('click', askAI);
}

// ========== ИИ ==========
async function askAI() {
    const questionInput = document.getElementById('aiQuestion');
    if (!questionInput) return;
    const question = questionInput.value.trim();
    if (!question) {
        alert('Введите вопрос');
        return;
    }
    const answerDiv = document.getElementById('aiAnswer');
    const contentDiv = document.getElementById('aiResponseContent');
    if (!answerDiv || !contentDiv) return;
    answerDiv.style.display = 'block';
    contentDiv.textContent = t('ai-thinking');

    try {
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        if (!response.ok) {
            let errorText = `Ошибка сервера (${response.status})`;
            try {
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object') {
                    if (errorData.error) errorText = errorData.error;
                    else if (errorData.message) errorText = errorData.message;
                    else errorText = JSON.stringify(errorData);
                }
            } catch (e) {
                try {
                    const text = await response.text();
                    if (text) errorText = text.substring(0, 200);
                } catch (e2) {}
            }
            throw new Error(errorText);
        }
        const data = await response.json();
        const answer = data.result?.alternatives?.[0]?.message?.text || 'Ответ не получен';
        contentDiv.textContent = answer;
    } catch (error) {
        console.error('Ошибка ИИ:', error);
        contentDiv.textContent = t('ai-error') + ': ' + (error.message || String(error));
    }
}

async function adminAskAI() {
    const questionInput = document.getElementById('adminAIQuestion');
    if (!questionInput) return;
    const question = questionInput.value.trim();
    if (!question) {
        alert('Введите вопрос');
        return;
    }
    const answerDiv = document.getElementById('adminAIAnswer');
    const contentDiv = document.getElementById('adminAIResponseContent');
    if (!answerDiv || !contentDiv) return;
    answerDiv.style.display = 'block';
    contentDiv.textContent = t('ai-thinking');

    try {
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        if (!response.ok) {
            let errorText = `Ошибка сервера (${response.status})`;
            try {
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object') {
                    if (errorData.error) errorText = errorData.error;
                    else if (errorData.message) errorText = errorData.message;
                    else errorText = JSON.stringify(errorData);
                }
            } catch (e) {
                try {
                    const text = await response.text();
                    if (text) errorText = text.substring(0, 200);
                } catch (e2) {}
            }
            throw new Error(errorText);
        }
        const data = await response.json();
        const answer = data.result?.alternatives?.[0]?.message?.text || 'Ответ не получен';
        contentDiv.textContent = answer;
    } catch (error) {
        console.error('Ошибка ИИ:', error);
        contentDiv.textContent = t('ai-error') + ': ' + (error.message || String(error));
    }
}

// ========== ПЕРЕВОДЫ ==========
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
}

// ========== ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ ==========
function toggleVisionMode() { visionMode = !visionMode; localStorage.setItem('vision_mode', visionMode ? 'on' : 'off'); updateVisionUI(); }
function restoreVisionMode() { visionMode = localStorage.getItem('vision_mode') === 'on'; updateVisionUI(); }
function updateVisionUI() { document.body.classList.toggle('vision', visionMode); const btn = document.getElementById('visionToggle'); if (btn) btn.textContent = visionMode ? t('vision-toggle-off') : t('vision-toggle'); }

// ========== АДМИН-ПАНЕЛЬ (ВСЕ РАЗДЕЛЫ РАБОТАЮТ) ==========
let adminModal = null, adminModalContent = null;
function ensureAdminModal() {
    if (!document.getElementById('adminModal')) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'adminModal';
        modalDiv.className = 'admin-modal';
        modalDiv.innerHTML = `<div class="admin-panel">
            <div class="admin-header"><h3 data-i18n="admin-title">🛠 Администрирование</h3><button id="closeAdminBtn" class="btn btn-sm" data-i18n="admin-close">Закрыть</button></div>
            <div id="adminContent"></div>
        </div>`;
        document.body.appendChild(modalDiv);
        document.getElementById('closeAdminBtn').addEventListener('click', closeAdminModal);
        modalDiv.addEventListener('click', function(e) { if (e.target === this) closeAdminModal(); });
    }
    adminModal = document.getElementById('adminModal');
    adminModalContent = document.getElementById('adminContent');
}
function openAdminModal() { ensureAdminModal(); adminModal.classList.add('visible'); if (!currentUser) renderAdminLogin(); else renderAdminDashboard(); }
function closeAdminModal() { if (adminModal) adminModal.classList.remove('visible'); }

function renderAdminLogin() {
    adminModalContent.innerHTML = `<div class="login-form"><h3>${t('login-title')}</h3>
        <input type="text" id="adminLogin" placeholder="${t('username')}">
        <input type="password" id="adminPass" placeholder="${t('login-password')}">
        <button id="doLogin" class="btn">${t('login-btn')}</button></div>`;
    document.getElementById('doLogin').addEventListener('click', function() {
        const login = document.getElementById('adminLogin').value.trim();
        const pass = document.getElementById('adminPass').value.trim();
        const user = data.users.find(u => u.username === login && u.password === pass);
        if (user) { currentUser = user; renderAdminDashboard(); } else alert(t('wrong-password'));
    });
}

function renderAdminDashboard() {
    const hasUsersPerm = hasPermission(currentUser, 'manage_users');
    const hasTemplesPerm = hasPermission(currentUser, 'manage_temples');
    const hasClergyPerm = hasPermission(currentUser, 'manage_clergy');
    const hasSchedulePerm = hasPermission(currentUser, 'manage_schedule');
    const hasNewsPerm = hasPermission(currentUser, 'manage_news');
    const hasAnnouncementsPerm = hasPermission(currentUser, 'manage_announcements');
    const hasSundaySchoolsPerm = hasPermission(currentUser, 'manage_sunday_schools');
    const hasAboutPerm = hasPermission(currentUser, 'manage_about');
    const hasWorshipPerm = hasPermission(currentUser, 'manage_worship');
    const hasAIPerm = hasPermission(currentUser, 'manage_ai');
    let menuButtons = '';
    if (hasSchedulePerm) menuButtons += `<button class="admin-menu-btn" data-section="schedule">📅 Расписание</button>`;
    if (hasTemplesPerm) menuButtons += `<button class="admin-menu-btn" data-section="temples">⛪ Храмы</button>`;
    if (hasClergyPerm) menuButtons += `<button class="admin-menu-btn" data-section="clergy">👤 Духовенство</button>`;
    if (hasNewsPerm) menuButtons += `<button class="admin-menu-btn" data-section="news">📰 Новости</button>`;
    if (hasAnnouncementsPerm) menuButtons += `<button class="admin-menu-btn" data-section="announcements">📢 Объявления</button>`;
    if (hasSundaySchoolsPerm) menuButtons += `<button class="admin-menu-btn" data-section="sunday-school">🏫 Воскресные школы</button>`;
    if (hasAboutPerm) menuButtons += `<button class="admin-menu-btn" data-section="about">ℹ️ О благочинии</button>`;
    if (hasWorshipPerm) menuButtons += `<button class="admin-menu-btn" data-section="worship">✝️ Богослужения</button>`;
    if (hasAIPerm) menuButtons += `<button class="admin-menu-btn" data-section="ai">🤖 ИИ-помощник</button>`;
    if (hasUsersPerm) menuButtons += `<button class="admin-menu-btn" data-section="users">👥 Пользователи</button>`;
    adminModalContent.innerHTML = `<div class="admin-panel">
        <div class="admin-header"><h3>${t('admin-title')}</h3><div><span style="margin-right:1rem;">👤 ${escapeHtml(currentUser.username)} (${t('role-'+currentUser.role)||currentUser.role})</span>
        <button id="logoutAdmin" class="btn btn-sm">${t('logout')}</button>
        <button id="closeAdminBtn2" class="btn btn-sm">${t('admin-close')}</button></div></div>
        <div class="admin-menu" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem;">${menuButtons}</div>
        <div id="adminSectionContent"><p>Выберите раздел для управления.</p></div>
    </div>`;
    document.getElementById('closeAdminBtn2').addEventListener('click', closeAdminModal);
    document.getElementById('logoutAdmin').addEventListener('click', function() { currentUser = null; renderAdminLogin(); });
    document.querySelectorAll('.admin-menu-btn').forEach(btn => btn.addEventListener('click', function() { renderAdminSection(this.dataset.section); }));
}

function renderAdminSection(section) {
    const content = document.getElementById('adminSectionContent');
    if (!content) return;
    const permMap = {
        'schedule':'manage_schedule',
        'temples':'manage_temples',
        'clergy':'manage_clergy',
        'news':'manage_news',
        'announcements':'manage_announcements',
        'sunday-school':'manage_sunday_schools',
        'about':'manage_about',
        'worship':'manage_worship',
        'ai':'manage_ai',
        'users':'manage_users'
    };
    if (permMap[section] && !hasPermission(currentUser, permMap[section])) {
        content.innerHTML = '<p>Доступ запрещён. У вас нет прав на этот раздел.</p>';
        return;
    }
    switch (section) {
        case 'schedule': renderAdminSchedule(content); break;
        case 'temples': renderAdminTemples(content); break;
        case 'clergy': renderAdminClergy(content); break;
        case 'news': renderAdminNews(content); break;
        case 'announcements': renderAdminAnnouncements(content); break;
        case 'sunday-school': renderAdminSundaySchools(content); break;
        case 'about': renderAdminAbout(content); break;
        case 'worship': renderAdminWorship(content); break;
        case 'ai': renderAdminAI(content); break;
        case 'users': if (hasPermission(currentUser, 'manage_users')) renderAdminUsers(content); else content.innerHTML = '<p>Доступ запрещён.</p>'; break;
        default: content.innerHTML = '<p>Неизвестный раздел.</p>';
    }
}

// ---------- УПРАВЛЕНИЕ РАСПИСАНИЕМ ----------
function renderAdminSchedule(container) {
    let html = `<h3>${t('admin-schedule')}</h3>
        <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;">
            <button id="adminAddScheduleBtn" class="btn">${t('add-schedule')}</button>
            <button id="adminDeletePastBtn" class="btn btn-danger">${t('delete-past')}</button>
        </div>
        <div id="adminScheduleList">${renderScheduleTable()}</div>
        <div id="adminScheduleForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4>${t('add-schedule')}</h4>
            <div class="form-group"><label>${t('temple')}</label><select id="adminScheduleTemple" style="width:100%; padding:0.4rem;"><option value="">${t('choose-temple')}</option>${data.temples.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('')}</select></div>
            <div class="form-group"><label>${t('schedule-date')}</label><input type="date" id="adminScheduleDate" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>${t('schedule-event')}</label><input type="text" id="adminScheduleEvent" placeholder="${t('schedule-event')}" style="width:100%; padding:0.4rem;"></div>
            <button id="adminSaveScheduleBtn" class="btn">${t('save')}</button>
            <button id="adminCancelScheduleBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAddScheduleBtn') {
            document.getElementById('adminScheduleForm').style.display = 'block';
        }
        if (target.id === 'adminCancelScheduleBtn') {
            document.getElementById('adminScheduleForm').style.display = 'none';
        }
        if (target.id === 'adminSaveScheduleBtn') {
            const templeId = parseInt(document.getElementById('adminScheduleTemple').value);
            const date = document.getElementById('adminScheduleDate').value;
            const event = document.getElementById('adminScheduleEvent').value.trim();
            if (!templeId || !date || !event) { alert('Заполните все поля'); return; }
            data.schedules.push({ id: nextId.schedule++, templeId, date, event });
            saveData();
            document.getElementById('adminScheduleForm').style.display = 'none';
            renderAdminSchedule(container);
        }
        if (target.id === 'adminDeletePastBtn') {
            if (!confirm('Удалить все прошедшие записи?')) return;
            const today = new Date().toISOString().slice(0,10);
            data.schedules = data.schedules.filter(s => s.date >= today);
            saveData();
            alert(t('past-deleted'));
            renderAdminSchedule(container);
        }
        if (target.classList.contains('admin-delete-schedule')) {
            const id = parseInt(target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.schedules = data.schedules.filter(s => s.id !== id);
            saveData();
            renderAdminSchedule(container);
        }
    });
}
function renderScheduleTable() {
    if (!data.schedules.length) return `<p>${t('no-schedule')}</p>`;
    const sorted = [...data.schedules].sort((a,b)=>a.date.localeCompare(b.date));
    let table = `<table class="schedule-table"><thead><tr><th>${t('temple')}</th><th>${t('date')}</th><th>${t('event')}</th><th>${t('delete')}</th></tr></thead><tbody>`;
    sorted.forEach(s => {
        table += `<tr><td>${escapeHtml(getTempleName(s.templeId))}</td><td>${escapeHtml(s.date)}</td><td>${escapeHtml(s.event)}</td><td><button class="btn btn-sm btn-danger admin-delete-schedule" data-id="${s.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ---------- УПРАВЛЕНИЕ ХРАМАМИ ----------
function renderAdminTemples(container) {
    let html = `<h3>Управление храмами</h3>
        <button id="adminAddTempleBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить храм</button>
        <div id="adminTempleList">${renderTemplesAdminTable()}</div>
        <div id="adminTempleForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="templeFormTitle">Добавить храм</h4>
            <input type="hidden" id="templeFormEditId">
            <div class="form-group"><label>Название</label><input type="text" id="templeFormName" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Фото (URL)</label><input type="text" id="templeFormPhoto" style="width:100%; padding:0.4rem;" placeholder="placeholder.jpg"></div>
            <div class="form-group"><label>Краткое описание</label><textarea id="templeFormSummary" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Адрес</label><input type="text" id="templeFormAddress" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Телефон</label><input type="text" id="templeFormPhone" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Email</label><input type="text" id="templeFormEmail" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>История храма</label><textarea id="templeFormHistory" rows="3" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>История местности</label><textarea id="templeFormLocalHistory" rows="3" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Код карты (iframe)</label><textarea id="templeFormMapCode" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label><input type="checkbox" id="templeFormVacant"> Приход вакантный</label></div>
            <button id="templeFormSaveBtn" class="btn">${t('save')}</button>
            <button id="templeFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAddTempleBtn') {
            document.getElementById('templeFormTitle').textContent = 'Добавить храм';
            document.getElementById('templeFormEditId').value = '';
            ['templeFormName','templeFormPhoto','templeFormSummary','templeFormAddress','templeFormPhone','templeFormEmail','templeFormHistory','templeFormLocalHistory','templeFormMapCode'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('templeFormVacant').checked = false;
            document.getElementById('adminTempleForm').style.display = 'block';
        }
        if (target.id === 'templeFormCancelBtn') {
            document.getElementById('adminTempleForm').style.display = 'none';
        }
        if (target.id === 'templeFormSaveBtn') {
            const editId = document.getElementById('templeFormEditId').value;
            const name = document.getElementById('templeFormName').value.trim();
            if (!name) { alert('Введите название'); return; }
            const temple = {
                id: editId ? parseInt(editId) : nextId.temple++,
                name,
                photo: document.getElementById('templeFormPhoto').value.trim() || 'placeholder.jpg',
                summary: document.getElementById('templeFormSummary').value.trim(),
                address: document.getElementById('templeFormAddress').value.trim(),
                phone: document.getElementById('templeFormPhone').value.trim(),
                email: document.getElementById('templeFormEmail').value.trim(),
                history: document.getElementById('templeFormHistory').value.trim(),
                localHistory: document.getElementById('templeFormLocalHistory').value.trim(),
                mapCode: document.getElementById('templeFormMapCode').value.trim(),
                isVacant: document.getElementById('templeFormVacant').checked
            };
            if (editId) {
                const idx = data.temples.findIndex(t => t.id == editId);
                if (idx !== -1) data.temples[idx] = temple;
            } else {
                data.temples.push(temple);
            }
            saveData();
            document.getElementById('adminTempleForm').style.display = 'none';
            renderAdminTemples(container);
        }
        if (target.classList.contains('admin-delete-temple')) {
            const id = parseInt(target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.temples = data.temples.filter(t => t.id !== id);
            saveData();
            renderAdminTemples(container);
        }
        if (target.classList.contains('admin-edit-temple')) {
            const id = parseInt(target.dataset.id);
            const t = data.temples.find(t => t.id === id);
            if (!t) return;
            document.getElementById('templeFormTitle').textContent = 'Редактировать храм';
            document.getElementById('templeFormEditId').value = id;
            document.getElementById('templeFormName').value = t.name;
            document.getElementById('templeFormPhoto').value = t.photo || '';
            document.getElementById('templeFormSummary').value = t.summary || '';
            document.getElementById('templeFormAddress').value = t.address || '';
            document.getElementById('templeFormPhone').value = t.phone || '';
            document.getElementById('templeFormEmail').value = t.email || '';
            document.getElementById('templeFormHistory').value = t.history || '';
            document.getElementById('templeFormLocalHistory').value = t.localHistory || '';
            document.getElementById('templeFormMapCode').value = t.mapCode || '';
            document.getElementById('templeFormVacant').checked = t.isVacant || false;
            document.getElementById('adminTempleForm').style.display = 'block';
        }
    });
}
function renderTemplesAdminTable() {
    if (!data.temples.length) return `<p>Нет храмов</p>`;
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Действия</th></tr></thead><tbody>`;
    data.temples.forEach(t => {
        table += `<tr><td>${escapeHtml(t.name)}</td><td><button class="btn btn-sm admin-edit-temple" data-id="${t.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-temple" data-id="${t.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ---------- УПРАВЛЕНИЕ ДУХОВЕНСТВОМ ----------
function renderAdminClergy(container) {
    let html = `<h3>Управление духовенством</h3>
        <button id="adminAddClergyBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить священнослужителя</button>
        <div id="adminClergyList">${renderClergyAdminTable()}</div>
        <div id="adminClergyForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="clergyFormTitle">Добавить священнослужителя</h4>
            <input type="hidden" id="clergyFormEditId">
            <div class="form-group"><label>Имя</label><input type="text" id="clergyFormName" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Сан</label><input type="text" id="clergyFormRank" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Фото (URL)</label><input type="text" id="clergyFormPhoto" style="width:100%; padding:0.4rem;" placeholder="placeholder.jpg"></div>
            <div class="form-group"><label>Описание</label><textarea id="clergyFormDesc" rows="3" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Принадлежит храмам (ID через запятую)</label><input type="text" id="clergyFormTempleIds" style="width:100%; padding:0.4rem;" placeholder="1,2,5"></div>
            <button id="clergyFormSaveBtn" class="btn">${t('save')}</button>
            <button id="clergyFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAddClergyBtn') {
            document.getElementById('clergyFormTitle').textContent = 'Добавить священнослужителя';
            document.getElementById('clergyFormEditId').value = '';
            ['clergyFormName','clergyFormRank','clergyFormPhoto','clergyFormDesc','clergyFormTempleIds'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('adminClergyForm').style.display = 'block';
        }
        if (target.id === 'clergyFormCancelBtn') {
            document.getElementById('adminClergyForm').style.display = 'none';
        }
        if (target.id === 'clergyFormSaveBtn') {
            const editId = document.getElementById('clergyFormEditId').value;
            const name = document.getElementById('clergyFormName').value.trim();
            if (!name) { alert('Введите имя'); return; }
            const templeIds = document.getElementById('clergyFormTempleIds').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const clergy = {
                id: editId ? parseInt(editId) : nextId.clergy++,
                name,
                rank: document.getElementById('clergyFormRank').value.trim(),
                photo: document.getElementById('clergyFormPhoto').value.trim() || 'placeholder.jpg',
                description: document.getElementById('clergyFormDesc').value.trim(),
                templeIds: templeIds
            };
            if (editId) {
                const idx = data.clergy.findIndex(c => c.id == editId);
                if (idx !== -1) data.clergy[idx] = clergy;
            } else {
                data.clergy.push(clergy);
            }
            saveData();
            document.getElementById('adminClergyForm').style.display = 'none';
            renderAdminClergy(container);
        }
        if (target.classList.contains('admin-delete-clergy')) {
            const id = parseInt(target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.clergy = data.clergy.filter(c => c.id !== id);
            saveData();
            renderAdminClergy(container);
        }
        if (target.classList.contains('admin-edit-clergy')) {
            const id = parseInt(target.dataset.id);
            const c = data.clergy.find(c => c.id === id);
            if (!c) return;
            document.getElementById('clergyFormTitle').textContent = 'Редактировать священнослужителя';
            document.getElementById('clergyFormEditId').value = id;
            document.getElementById('clergyFormName').value = c.name;
            document.getElementById('clergyFormRank').value = c.rank || '';
            document.getElementById('clergyFormPhoto').value = c.photo || '';
            document.getElementById('clergyFormDesc').value = c.description || '';
            document.getElementById('clergyFormTempleIds').value = (c.templeIds || []).join(', ');
            document.getElementById('adminClergyForm').style.display = 'block';
        }
    });
}
function renderClergyAdminTable() {
    if (!data.clergy.length) return `<p>Нет священнослужителей</p>`;
    let table = `<table class="schedule-table"><thead><tr><th>Имя</th><th>Сан</th><th>Действия</th></tr></thead><tbody>`;
    data.clergy.forEach(c => {
        table += `<tr><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.rank)}</td><td><button class="btn btn-sm admin-edit-clergy" data-id="${c.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-clergy" data-id="${c.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ---------- УПРАВЛЕНИЕ НОВОСТЯМИ ----------
function renderAdminNews(container) {
    let html = `<h3>Управление новостями</h3>
        <button id="adminAddNewsBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить новость</button>
        <div id="adminNewsList">${renderNewsAdminTable()}</div>
        <div id="adminNewsForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="newsFormTitle">Добавить новость</h4>
            <input type="hidden" id="newsFormEditId">
            <div class="form-group"><label>Заголовок</label><input type="text" id="newsFormTitleInput" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Текст</label><textarea id="newsFormText" rows="4" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Дата (ГГГГ-ММ-ДД)</label><input type="date" id="newsFormDate" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Медиа (URL фото/видео)</label><input type="text" id="newsFormMedia" style="width:100%; padding:0.4rem;" placeholder="http://..."></div>
            <button id="newsFormSaveBtn" class="btn">${t('save')}</button>
            <button id="newsFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAddNewsBtn') {
            document.getElementById('newsFormTitle').textContent = 'Добавить новость';
            document.getElementById('newsFormEditId').value = '';
            ['newsFormTitleInput','newsFormText','newsFormDate','newsFormMedia'].forEach(id => document.getElementById(id).value = '');
            if (!document.getElementById('newsFormDate').value) {
                document.getElementById('newsFormDate').value = new Date().toISOString().slice(0,10);
            }
            document.getElementById('adminNewsForm').style.display = 'block';
        }
        if (target.id === 'newsFormCancelBtn') {
            document.getElementById('adminNewsForm').style.display = 'none';
        }
        if (target.id === 'newsFormSaveBtn') {
            const editId = document.getElementById('newsFormEditId').value;
            const title = document.getElementById('newsFormTitleInput').value.trim();
            const text = document.getElementById('newsFormText').value.trim();
            if (!title || !text) { alert('Заполните заголовок и текст'); return; }
            const news = {
                id: editId ? parseInt(editId) : nextId.news++,
                title,
                text,
                date: document.getElementById('newsFormDate').value || new Date().toISOString().slice(0,10),
                media: document.getElementById('newsFormMedia').value.trim()
            };
            if (editId) {
                const idx = data.news.findIndex(n => n.id == editId);
                if (idx !== -1) data.news[idx] = news;
            } else {
                data.news.push(news);
            }
            saveData();
            document.getElementById('adminNewsForm').style.display = 'none';
            renderAdminNews(container);
        }
        if (target.classList.contains('admin-delete-news')) {
            const id = parseInt(target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.news = data.news.filter(n => n.id !== id);
            saveData();
            renderAdminNews(container);
        }
        if (target.classList.contains('admin-edit-news')) {
            const id = parseInt(target.dataset.id);
            const n = data.news.find(n => n.id === id);
            if (!n) return;
            document.getElementById('newsFormTitle').textContent = 'Редактировать новость';
            document.getElementById('newsFormEditId').value = id;
            document.getElementById('newsFormTitleInput').value = n.title;
            document.getElementById('newsFormText').value = n.text;
            document.getElementById('newsFormDate').value = n.date || '';
            document.getElementById('newsFormMedia').value = n.media || '';
            document.getElementById('adminNewsForm').style.display = 'block';
        }
    });
}
function renderNewsAdminTable() {
    if (!data.news.length) return `<p>Нет новостей</p>`;
    let table = `<table class="schedule-table"><thead><tr><th>Заголовок</th><th>Дата</th><th>Действия</th></tr></thead><tbody>`;
    data.news.forEach(n => {
        table += `<tr><td>${escapeHtml(n.title)}</td><td>${escapeHtml(n.date)}</td><td><button class="btn btn-sm admin-edit-news" data-id="${n.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-news" data-id="${n.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ---------- УПРАВЛЕНИЕ ОБЪЯВЛЕНИЯМИ ----------
function renderAdminAnnouncements(container) {
    let html = `<h3>Управление объявлениями</h3>
        <button id="adminAddAnnouncementBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить объявление</button>
        <div id="adminAnnouncementList">${renderAnnouncementsAdminTable()}</div>
        <div id="adminAnnouncementForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="announcementFormTitle">Добавить объявление</h4>
            <input type="hidden" id="announcementFormEditId">
            <div class="form-group"><label>Текст</label><textarea id="announcementFormText" rows="4" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Дата (ГГГГ-ММ-ДД)</label><input type="date" id="announcementFormDate" style="width:100%; padding:0.4rem;"></div>
            <button id="announcementFormSaveBtn" class="btn">${t('save')}</button>
            <button id="announcementFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAddAnnouncementBtn') {
            document.getElementById('announcementFormTitle').textContent = 'Добавить объявление';
            document.getElementById('announcementFormEditId').value = '';
            document.getElementById('announcementFormText').value = '';
            document.getElementById('announcementFormDate').value = new Date().toISOString().slice(0,10);
            document.getElementById('adminAnnouncementForm').style.display = 'block';
        }
        if (target.id === 'announcementFormCancelBtn') {
            document.getElementById('adminAnnouncementForm').style.display = 'none';
        }
        if (target.id === 'announcementFormSaveBtn') {
            const editId = document.getElementById('announcementFormEditId').value;
            const text = document.getElementById('announcementFormText').value.trim();
            if (!text) { alert('Введите текст'); return; }
            const ann = {
                id: editId ? parseInt(editId) : nextId.announcement++,
                text,
                date: document.getElementById('announcementFormDate').value || new Date().toISOString().slice(0,10)
            };
            if (editId) {
                const idx = data.announcements.findIndex(a => a.id == editId);
                if (idx !== -1) data.announcements[idx] = ann;
            } else {
                data.announcements.push(ann);
            }
            saveData();
            document.getElementById('adminAnnouncementForm').style.display = 'none';
            renderAdminAnnouncements(container);
        }
        if (target.classList.contains('admin-delete-announcement')) {
            const id = parseInt(target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.announcements = data.announcements.filter(a => a.id !== id);
            saveData();
            renderAdminAnnouncements(container);
        }
        if (target.classList.contains('admin-edit-announcement')) {
            const id = parseInt(target.dataset.id);
            const a = data.announcements.find(a => a.id === id);
            if (!a) return;
            document.getElementById('announcementFormTitle').textContent = 'Редактировать объявление';
            document.getElementById('announcementFormEditId').value = id;
            document.getElementById('announcementFormText').value = a.text;
            document.getElementById('announcementFormDate').value = a.date || '';
            document.getElementById('adminAnnouncementForm').style.display = 'block';
        }
    });
}
function renderAnnouncementsAdminTable() {
    if (!data.announcements.length) return `<p>Нет объявлений</p>`;
    let table = `<table class="schedule-table"><thead><tr><th>Текст</th><th>Дата</th><th>Действия</th></tr></thead><tbody>`;
    data.announcements.forEach(a => {
        table += `<tr><td>${escapeHtml(a.text)}</td><td>${escapeHtml(a.date)}</td><td><button class="btn btn-sm admin-edit-announcement" data-id="${a.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-announcement" data-id="${a.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ---------- УПРАВЛЕНИЕ ВОСКРЕСНЫМИ ШКОЛАМИ ----------
function renderAdminSundaySchools(container) {
    let html = `<h3>Управление воскресными школами</h3>
        <button id="adminAddSundaySchoolBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить школу</button>
        <div id="adminSundaySchoolList">${renderSundaySchoolsAdminTable()}</div>
        <div id="adminSundaySchoolForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="sundaySchoolFormTitle">Добавить школу</h4>
            <input type="hidden" id="sundaySchoolFormEditId">
            <div class="form-group"><label>Название</label><input type="text" id="sundaySchoolFormName" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Тип (ВРШ, ВРГ, ГРПВ)</label><input type="text" id="sundaySchoolFormType" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Фото (URL)</label><input type="text" id="sundaySchoolFormPhoto" style="width:100%; padding:0.4rem;" placeholder="placeholder.jpg"></div>
            <div class="form-group"><label>Описание</label><textarea id="sundaySchoolFormDesc" rows="3" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>ID храма (привязка)</label><input type="number" id="sundaySchoolFormTempleId" style="width:100%; padding:0.4rem;"></div>
            <button id="sundaySchoolFormSaveBtn" class="btn">${t('save')}</button>
            <button id="sundaySchoolFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAddSundaySchoolBtn') {
            document.getElementById('sundaySchoolFormTitle').textContent = 'Добавить школу';
            document.getElementById('sundaySchoolFormEditId').value = '';
            ['sundaySchoolFormName','sundaySchoolFormType','sundaySchoolFormPhoto','sundaySchoolFormDesc','sundaySchoolFormTempleId'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('adminSundaySchoolForm').style.display = 'block';
        }
        if (target.id === 'sundaySchoolFormCancelBtn') {
            document.getElementById('adminSundaySchoolForm').style.display = 'none';
        }
        if (target.id === 'sundaySchoolFormSaveBtn') {
            const editId = document.getElementById('sundaySchoolFormEditId').value;
            const name = document.getElementById('sundaySchoolFormName').value.trim();
            if (!name) { alert('Введите название'); return; }
            const school = {
                id: editId ? parseInt(editId) : nextId.sundaySchool++,
                name,
                type: document.getElementById('sundaySchoolFormType').value.trim(),
                photo: document.getElementById('sundaySchoolFormPhoto').value.trim() || 'placeholder.jpg',
                description: document.getElementById('sundaySchoolFormDesc').value.trim(),
                templeId: parseInt(document.getElementById('sundaySchoolFormTempleId').value) || null
            };
            if (editId) {
                const idx = data.sundaySchools.findIndex(s => s.id == editId);
                if (idx !== -1) data.sundaySchools[idx] = school;
            } else {
                data.sundaySchools.push(school);
            }
            saveData();
            document.getElementById('adminSundaySchoolForm').style.display = 'none';
            renderAdminSundaySchools(container);
        }
        if (target.classList.contains('admin-delete-sunday-school')) {
            const id = parseInt(target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.sundaySchools = data.sundaySchools.filter(s => s.id !== id);
            saveData();
            renderAdminSundaySchools(container);
        }
        if (target.classList.contains('admin-edit-sunday-school')) {
            const id = parseInt(target.dataset.id);
            const s = data.sundaySchools.find(s => s.id === id);
            if (!s) return;
            document.getElementById('sundaySchoolFormTitle').textContent = 'Редактировать школу';
            document.getElementById('sundaySchoolFormEditId').value = id;
            document.getElementById('sundaySchoolFormName').value = s.name;
            document.getElementById('sundaySchoolFormType').value = s.type || '';
            document.getElementById('sundaySchoolFormPhoto').value = s.photo || '';
            document.getElementById('sundaySchoolFormDesc').value = s.description || '';
            document.getElementById('sundaySchoolFormTempleId').value = s.templeId || '';
            document.getElementById('adminSundaySchoolForm').style.display = 'block';
        }
    });
}
function renderSundaySchoolsAdminTable() {
    if (!data.sundaySchools.length) return `<p>Нет воскресных школ</p>`;
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Тип</th><th>Действия</th></tr></thead><tbody>`;
    data.sundaySchools.forEach(s => {
        table += `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.type)}</td><td><button class="btn btn-sm admin-edit-sunday-school" data-id="${s.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-sunday-school" data-id="${s.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ---------- УПРАВЛЕНИЕ СТРАНИЦЕЙ "О БЛАГОЧИНИИ" ----------
function renderAdminAbout(container) {
    let html = `<h3>Управление страницей "О благочинии"</h3>
        <div class="form-group">
            <label>Текст страницы</label>
            <textarea id="aboutTextArea" rows="10" style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);">${escapeHtml(data.aboutText)}</textarea>
        </div>
        <button id="aboutSaveBtn" class="btn">${t('save')}</button>
        <div id="aboutMessage" style="margin-top:0.5rem;"></div>`;
    container.innerHTML = html;
    document.getElementById('aboutSaveBtn').addEventListener('click', function() {
        const text = document.getElementById('aboutTextArea').value;
        data.aboutText = text;
        saveData();
        document.getElementById('aboutMessage').innerHTML = '<span style="color:green;">✅ Сохранено</span>';
        setTimeout(() => document.getElementById('aboutMessage').innerHTML = '', 2000);
    });
}

// ---------- УПРАВЛЕНИЕ БОГОСЛУЖЕНИЯМИ ----------
function renderAdminWorship(container) {
    const w = data.worship || { prayers: [], calendar: [], readings: { apostol: '', evangelie: '' }, interpretations: [], sacraments: [] };
    let html = `<h3>Управление богослужениями</h3>
        <div style="display:flex; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
            <button id="adminAddPrayerBtn" class="btn">➕ Молитва</button>
            <button id="adminAddInterpretationBtn" class="btn">➕ Толкование</button>
            <button id="adminAddSacramentBtn" class="btn">➕ Таинство</button>
        </div>
        <div class="form-group"><label>Апостол (чтение дня)</label><input type="text" id="worshipApostol" value="${escapeHtml(w.readings.apostol)}" style="width:100%; padding:0.4rem;"></div>
        <div class="form-group"><label>Евангелие (чтение дня)</label><input type="text" id="worshipEvangelie" value="${escapeHtml(w.readings.evangelie)}" style="width:100%; padding:0.4rem;"></div>
        <button id="worshipReadingsSaveBtn" class="btn">Сохранить чтения</button>
        <hr style="margin:1rem 0;">
        <h4>Молитвы</h4>
        <div id="adminPrayersList">${renderPrayersList()}</div>
        <div id="adminPrayerForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="prayerFormTitle">Добавить молитву</h4>
            <input type="hidden" id="prayerFormEditId">
            <div class="form-group"><label>Название</label><input type="text" id="prayerFormTitleInput" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Текст</label><textarea id="prayerFormText" rows="4" style="width:100%; padding:0.4rem;"></textarea></div>
            <button id="prayerFormSaveBtn" class="btn">${t('save')}</button>
            <button id="prayerFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>
        <hr style="margin:1rem 0;">
        <h4>Толкования</h4>
        <div id="adminInterpretationsList">${renderInterpretationsList()}</div>
        <div id="adminInterpretationForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="interpretationFormTitle">Добавить толкование</h4>
            <input type="hidden" id="interpretationFormEditId">
            <div class="form-group"><label>Название</label><input type="text" id="interpretationFormTitleInput" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Текст</label><textarea id="interpretationFormText" rows="4" style="width:100%; padding:0.4rem;"></textarea></div>
            <button id="interpretationFormSaveBtn" class="btn">${t('save')}</button>
            <button id="interpretationFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>
        <hr style="margin:1rem 0;">
        <h4>Подготовка к таинствам</h4>
        <div id="adminSacramentsList">${renderSacramentsList()}</div>
        <div id="adminSacramentForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="sacramentFormTitle">Добавить запись</h4>
            <input type="hidden" id="sacramentFormEditId">
            <div class="form-group"><label>Название</label><input type="text" id="sacramentFormTitleInput" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Текст</label><textarea id="sacramentFormText" rows="4" style="width:100%; padding:0.4rem;"></textarea></div>
            <button id="sacramentFormSaveBtn" class="btn">${t('save')}</button>
            <button id="sacramentFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;

    // Чтения дня
    document.getElementById('worshipReadingsSaveBtn').addEventListener('click', function() {
        data.worship.readings.apostol = document.getElementById('worshipApostol').value;
        data.worship.readings.evangelie = document.getElementById('worshipEvangelie').value;
        saveData();
        alert('Чтения сохранены');
    });

    // Молитвы
    document.getElementById('adminAddPrayerBtn').addEventListener('click', function() {
        document.getElementById('prayerFormTitle').textContent = 'Добавить молитву';
        document.getElementById('prayerFormEditId').value = '';
        document.getElementById('prayerFormTitleInput').value = '';
        document.getElementById('prayerFormText').value = '';
        document.getElementById('adminPrayerForm').style.display = 'block';
    });
    document.getElementById('prayerFormCancelBtn').addEventListener('click', function() {
        document.getElementById('adminPrayerForm').style.display = 'none';
    });
    document.getElementById('prayerFormSaveBtn').addEventListener('click', function() {
        const editId = document.getElementById('prayerFormEditId').value;
        const title = document.getElementById('prayerFormTitleInput').value.trim();
        const text = document.getElementById('prayerFormText').value.trim();
        if (!title || !text) { alert('Заполните все поля'); return; }
        const item = { id: editId ? parseInt(editId) : Date.now(), title, text };
        if (editId) {
            const idx = data.worship.prayers.findIndex(p => p.id == editId);
            if (idx !== -1) data.worship.prayers[idx] = item;
        } else {
            data.worship.prayers.push(item);
        }
        saveData();
        document.getElementById('adminPrayerForm').style.display = 'none';
        renderAdminWorship(container);
    });
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('admin-delete-prayer')) {
            const id = parseInt(e.target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.worship.prayers = data.worship.prayers.filter(p => p.id !== id);
            saveData();
            renderAdminWorship(container);
        }
        if (e.target.classList.contains('admin-edit-prayer')) {
            const id = parseInt(e.target.dataset.id);
            const p = data.worship.prayers.find(p => p.id === id);
            if (!p) return;
            document.getElementById('prayerFormTitle').textContent = 'Редактировать молитву';
            document.getElementById('prayerFormEditId').value = id;
            document.getElementById('prayerFormTitleInput').value = p.title;
            document.getElementById('prayerFormText').value = p.text;
            document.getElementById('adminPrayerForm').style.display = 'block';
        }
    });

    // Толкования
    document.getElementById('adminAddInterpretationBtn').addEventListener('click', function() {
        document.getElementById('interpretationFormTitle').textContent = 'Добавить толкование';
        document.getElementById('interpretationFormEditId').value = '';
        document.getElementById('interpretationFormTitleInput').value = '';
        document.getElementById('interpretationFormText').value = '';
        document.getElementById('adminInterpretationForm').style.display = 'block';
    });
    document.getElementById('interpretationFormCancelBtn').addEventListener('click', function() {
        document.getElementById('adminInterpretationForm').style.display = 'none';
    });
    document.getElementById('interpretationFormSaveBtn').addEventListener('click', function() {
        const editId = document.getElementById('interpretationFormEditId').value;
        const title = document.getElementById('interpretationFormTitleInput').value.trim();
        const text = document.getElementById('interpretationFormText').value.trim();
        if (!title || !text) { alert('Заполните все поля'); return; }
        const item = { id: editId ? parseInt(editId) : Date.now(), title, text };
        if (editId) {
            const idx = data.worship.interpretations.findIndex(i => i.id == editId);
            if (idx !== -1) data.worship.interpretations[idx] = item;
        } else {
            data.worship.interpretations.push(item);
        }
        saveData();
        document.getElementById('adminInterpretationForm').style.display = 'none';
        renderAdminWorship(container);
    });
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('admin-delete-interpretation')) {
            const id = parseInt(e.target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.worship.interpretations = data.worship.interpretations.filter(i => i.id !== id);
            saveData();
            renderAdminWorship(container);
        }
        if (e.target.classList.contains('admin-edit-interpretation')) {
            const id = parseInt(e.target.dataset.id);
            const i = data.worship.interpretations.find(i => i.id === id);
            if (!i) return;
            document.getElementById('interpretationFormTitle').textContent = 'Редактировать толкование';
            document.getElementById('interpretationFormEditId').value = id;
            document.getElementById('interpretationFormTitleInput').value = i.title;
            document.getElementById('interpretationFormText').value = i.text;
            document.getElementById('adminInterpretationForm').style.display = 'block';
        }
    });

    // Таинства
    document.getElementById('adminAddSacramentBtn').addEventListener('click', function() {
        document.getElementById('sacramentFormTitle').textContent = 'Добавить запись';
        document.getElementById('sacramentFormEditId').value = '';
        document.getElementById('sacramentFormTitleInput').value = '';
        document.getElementById('sacramentFormText').value = '';
        document.getElementById('adminSacramentForm').style.display = 'block';
    });
    document.getElementById('sacramentFormCancelBtn').addEventListener('click', function() {
        document.getElementById('adminSacramentForm').style.display = 'none';
    });
    document.getElementById('sacramentFormSaveBtn').addEventListener('click', function() {
        const editId = document.getElementById('sacramentFormEditId').value;
        const title = document.getElementById('sacramentFormTitleInput').value.trim();
        const text = document.getElementById('sacramentFormText').value.trim();
        if (!title || !text) { alert('Заполните все поля'); return; }
        const item = { id: editId ? parseInt(editId) : Date.now(), title, text };
        if (editId) {
            const idx = data.worship.sacraments.findIndex(s => s.id == editId);
            if (idx !== -1) data.worship.sacraments[idx] = item;
        } else {
            data.worship.sacraments.push(item);
        }
        saveData();
        document.getElementById('adminSacramentForm').style.display = 'none';
        renderAdminWorship(container);
    });
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('admin-delete-sacrament')) {
            const id = parseInt(e.target.dataset.id);
            if (!confirm(t('confirm-delete'))) return;
            data.worship.sacraments = data.worship.sacraments.filter(s => s.id !== id);
            saveData();
            renderAdminWorship(container);
        }
        if (e.target.classList.contains('admin-edit-sacrament')) {
            const id = parseInt(e.target.dataset.id);
            const s = data.worship.sacraments.find(s => s.id === id);
            if (!s) return;
            document.getElementById('sacramentFormTitle').textContent = 'Редактировать запись';
            document.getElementById('sacramentFormEditId').value = id;
            document.getElementById('sacramentFormTitleInput').value = s.title;
            document.getElementById('sacramentFormText').value = s.text;
            document.getElementById('adminSacramentForm').style.display = 'block';
        }
    });
}
function renderPrayersList() {
    if (!data.worship.prayers.length) return '<p>Нет молитв</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Действия</th></tr></thead><tbody>`;
    data.worship.prayers.forEach(p => {
        table += `<tr><td>${escapeHtml(p.title)}</td><td><button class="btn btn-sm admin-edit-prayer" data-id="${p.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-prayer" data-id="${p.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}
function renderInterpretationsList() {
    if (!data.worship.interpretations.length) return '<p>Нет толкований</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Действия</th></tr></thead><tbody>`;
    data.worship.interpretations.forEach(i => {
        table += `<tr><td>${escapeHtml(i.title)}</td><td><button class="btn btn-sm admin-edit-interpretation" data-id="${i.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-interpretation" data-id="${i.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}
function renderSacramentsList() {
    if (!data.worship.sacraments.length) return '<p>Нет записей</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Действия</th></tr></thead><tbody>`;
    data.worship.sacraments.forEach(s => {
        table += `<tr><td>${escapeHtml(s.title)}</td><td><button class="btn btn-sm admin-edit-sacrament" data-id="${s.id}">✏️</button> <button class="btn btn-sm btn-danger admin-delete-sacrament" data-id="${s.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ---------- УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ----------
// Функции renderAdminUsers, renderUserTable, renderAdminAI уже были ранее – они остаются без изменений.

// ========== ТРИГГЕРЫ И СТАРТ ==========
let clickCount = 0, clickTimer = null;
function initAdminTrigger() { document.getElementById('secretAdminTrigger')?.addEventListener('click', function(e) { e.preventDefault(); clickCount++; clearTimeout(clickTimer); clickTimer = setTimeout(() => clickCount = 0, 2000); if (clickCount >= 5) { clickCount = 0; clearTimeout(clickTimer); openAdminModal(); } }); }
function initVisionToggle() { document.getElementById('visionToggle')?.addEventListener('click', toggleVisionMode); }
function initBackToTop() { const btn = document.getElementById('backToTop'); if (btn) { window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 300)); btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); } }

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    loadData();
    initAdminTrigger();
    initVisionToggle();
    initBackToTop();
    restoreVisionMode();
});

// ========== ЭКСПОРТ ==========
window.renderTempleDetail = renderTempleDetail;
window.renderClergyDetail = renderClergyDetail;
window.renderSundaySchoolDetail = renderSundaySchoolDetail;
window.renderCurrentPage = renderCurrentPage;
window.t = t;
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.scrollCarousel = scrollCarousel;
window.fillTempleDropdown = fillTempleDropdown;
window.askAI = askAI;
window.adminAskAI = adminAskAI;
