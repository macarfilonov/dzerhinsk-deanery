// ============================================================
//  script.js – ПОЛНАЯ ВЕРСИЯ (все функции, сохранение вкладок)
// ============================================================

console.log('script.js загружен');

// ========== ПОДКЛЮЧЕНИЕ FIREBASE ==========
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

// ========== НАСТРОЙКИ ИИ ==========
const AI_API_URL = '/.netlify/functions/groq-ai';

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let data = {
    temples: [],
    clergy: [],
    schedules: [],
    news: [],
    announcements: [],
    sundaySchools: [],
    teachers: [],
    aboutText: '',
    worship: {
        prayers: [],
        calendar: [],
        readings: { apostol: '', evangelie: '' },
        interpretations: [],
        sacraments: []
    },
    faq: [],
    users: [],
    opechenie: []
};
let nextId = { temple: 1, clergy: 1, schedule: 1, news: 1, announcement: 1, sundaySchool: 1, faq: 1, user: 1, opechenie: 1, teacher: 1 };
let currentLang = 'ru';
let currentUser = null;
let dataLoaded = false;
let visionMode = false;
let isDetailPage = false;
let syncInterval = null;
let currentTempleTab = 'schedule';
let currentWorshipTab = 'schedule';

// ========== ПЕРЕВОДЫ ==========
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
        'nav-opechenie': 'Окормление',
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
        'admin-opechenie': 'Управление окормлением',
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
        'manage-opechenie': 'Управление окормлением',
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
    senior: ['manage_temples', 'manage_clergy', 'manage_schedule', 'manage_news', 'manage_announcements', 'manage_sunday_schools', 'manage_about', 'manage_worship', 'manage_ai', 'manage_opechenie'],
    junior: ['manage_schedule', 'manage_news', 'manage_announcements', 'manage_ai', 'manage_opechenie'],
    editor: ['manage_news', 'manage_announcements']
};
const allPermissions = ['manage_temples', 'manage_clergy', 'manage_schedule', 'manage_news', 'manage_announcements', 'manage_sunday_schools', 'manage_about', 'manage_worship', 'manage_users', 'manage_ai', 'manage_opechenie'];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[m])); }
function t(key) { return translations[currentLang]?.[key] || key; }
function getTempleName(id) { const t = data.temples.find(t => t.id === id); return t ? t.name : '?'; }
function getTempleNames(ids) { if (!ids || !ids.length) return 'не привязан'; return ids.map(id => getTempleName(id)).join(', '); }
function getTemplePhoto(temple) { return temple?.photo?.trim() || 'placeholder.jpg'; }
function hasPermission(user, permission) { return user?.permissions?.includes('all') || user?.permissions?.includes(permission) || false; }

// ========== ЗАГРУЗКА / СОХРАНЕНИЕ ==========
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
            restoreVisionMode();
            rebuildNav();
        } catch(e) { console.warn('Ошибка загрузки из localStorage', e); initDefaultData(); }
    } else { initDefaultData(); }

    db.ref('data').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
            console.log('Получены обновления из Firebase');
            data = val.data || data;
            nextId = val.nextId || nextId;
            migrateData();
            saveToLocalStorage();
            renderCurrentPage();
            applyTranslations();
            rebuildNav();
        }
    });

    db.ref('data').once('value', (snapshot) => {
        if (!snapshot.val()) { initDefaultData(); }
    });

    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(() => {
        db.ref('data').once('value', (snapshot) => {
            const val = snapshot.val();
            if (val) {
                const newData = val.data;
                const newNextId = val.nextId;
                const currentDataStr = JSON.stringify(data);
                const newDataStr = JSON.stringify(newData);
                if (currentDataStr !== newDataStr) {
                    console.log('Обнаружены изменения через опрос, синхронизируем');
                    data = newData || data;
                    nextId = newNextId || nextId;
                    migrateData();
                    saveToLocalStorage();
                    renderCurrentPage();
                    applyTranslations();
                    rebuildNav();
                }
            }
        });
    }, 5000);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('Вкладка активна, проверяем синхронизацию');
            db.ref('data').once('value', (snapshot) => {
                const val = snapshot.val();
                if (val) {
                    const newData = val.data;
                    const newNextId = val.nextId;
                    const currentDataStr = JSON.stringify(data);
                    const newDataStr = JSON.stringify(newData);
                    if (currentDataStr !== newDataStr) {
                        console.log('Обновление из Firebase при возвращении');
                        data = newData || data;
                        nextId = newNextId || nextId;
                        migrateData();
                        saveToLocalStorage();
                        renderCurrentPage();
                        applyTranslations();
                        rebuildNav();
                    }
                }
            });
        }
    });
}

function migrateData() {
    data.users.forEach(u => { if (!u.permissions) u.permissions = rolePermissions[u.role] || rolePermissions.junior; });
    ['news','announcements','schedules','sundaySchools','faq','temples','clergy','opechenie','teachers'].forEach(k => { if (!data[k]) data[k] = []; });
    if (!data.worship) data.worship = { prayers: [], calendar: [], readings: { apostol: '', evangelie: '' }, interpretations: [], sacraments: [] };
    if (!data.aboutText) data.aboutText = '';
    if (!data.users || data.users.length === 0) data.users.push({ id: nextId.user++, username: 'Makar', password: 'Makar27.05.2014', role: 'developer', permissions: ['all'] });
    setDefaultPhotos();
}

function saveData() { saveToLocalStorage(); saveToFirebase(); }
function saveToLocalStorage() { localStorage.setItem('blago_data', JSON.stringify({ data, nextId })); localStorage.setItem('vision_mode', visionMode ? 'on' : 'off'); }
function saveToFirebase() { db.ref('data').set({ data, nextId }).then(() => console.log('Данные сохранены в Firebase')).catch(err => console.error('Ошибка сохранения в Firebase:', err)); }
function setDefaultPhotos() {
    data.temples.forEach(t => { if (!t.photo) t.photo = 'placeholder.jpg'; });
    data.clergy.forEach(c => { if (!c.photo) c.photo = 'placeholder.jpg'; });
    data.sundaySchools.forEach(s => { if (!s.photo) s.photo = 'placeholder.jpg'; });
    data.teachers.forEach(t => { if (!t.photo) t.photo = 'placeholder.jpg'; });
}

function initDefaultData() {
    data = {
        temples: [
            { id:1, name:'Храм Покрова Пресвятой Богородицы, г.\u00A0Дзержинск', photo:'pokrov-dzr.jpg', summary:'Храм Покрова Пресвятой Богородицы © Беларусь, Минская область, г.\u00A0Дзержинск.', address:'Минская область, г.\u00A0Дзержинск, ул.\u00A0Покровская, 1', phone:'', email:'', history:'Храм построен в середине XIX века.', localHistory:'Город Дзержинск (Койданово) известен с XVI века.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.132867%2C53.684692&mode=search&oid=229759500085&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:2, name:'Храм Вознесения Господня, г.\u00A0Фаниполь', photo:'voznesenie-fanipol.jpg', summary:'Храм Вознесения Господня © Беларусь, Минская область, г.\u00A0Фаниполь.', address:'Минская область, г.\u00A0Фаниполь, ул.\u00A0Школьная, 10', phone:'', email:'', history:'Храм действует с 1990-х годов.', localHistory:'Город Фаниполь – крупный железнодорожный узел.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.315962%2C53.738880&mode=search&oid=1369676511&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:3, name:'Храм святителя Николая Чудотворца, д.\u00A0Станьково', photo:'nikolay-stankovo.jpg', summary:'Храм святителя Николая Чудотворца © Беларусь, Минская область, д.\u00A0Станьково.', address:'Минская область, Дзержинский район, д.\u00A0Станьково, ул.\u00A0Центральная, 5', phone:'', email:'', history:'Храм известен с XIX века.', localHistory:'Деревня Станьково – родина поэта Я. Купалы.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.224496%2C53.630899&mode=search&oid=168232275383&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:5, name:'Храм святителя Николая Чудотворца, п.\u00A0Энергетиков', photo:'nikolay-energetikov.jpg', summary:'Храм святителя Николая Чудотворца © Беларусь, Минская область, п.\u00A0Энергетиков.', address:'Минская область, Дзержинский район, п.\u00A0Энергетиков, ул.\u00A0Школьная, 3', phone:'', email:'', history:'Храм построен в 1990-е годы.', localHistory:'Посёлок Энергетиков возник при строительстве Минской ТЭЦ-4.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.051849%2C53.583704&mode=search&oid=131806639679&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:6, name:'Храм Преображения Господня, аг.\u00A0Черкассы', photo:'preobrazhenie-cherkassy.jpg', summary:'Храм Преображения Господня © Беларусь, Минская область, аг.\u00A0Черкассы.', address:'Минская область, Дзержинский район, аг.\u00A0Черкассы, ул.\u00A0Центральная, 12', phone:'', email:'', history:'Храм построен в начале XX века.', localHistory:'Деревня Черкассы – старинное поселение.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.326526%2C53.758650&mode=search&oid=22143657705&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:7, name:'Храм Новомучеников Белорусских, г.\u00A0Дзержинск', photo:'novomucheniki-dzerzhinsk.jpg', summary:'Храм Новомучеников Белорусских © Беларусь, Минская область, г.\u00A0Дзержинск.', address:'Минская область, г.\u00A0Дзержинск, ул.\u00A0Советская, 45', phone:'', email:'', history:'Новый храм, освящён в 2010-х годах.', localHistory:'Город Дзержинск – центр благочиния.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.110903%2C53.668974&mode=search&oid=14672378090&ol=biz&z=16.84" width="100%" height="300" frameborder="0"></iframe>', isVacant:false },
            { id:8, name:'Храм святых бессребреников Космы и Дамиана, п.\u00A0Негорелое', photo:'kosma-damian.jpg', summary:'Храм святых бессребреников Космы и Дамиана © Беларусь, Минская область, п.\u00A0Негорелое. Строящийся храм.', address:'Минская область, Дзержинский район, п.\u00A0Негорелое, ул.\u00A0Вокзальная, 2', phone:'', email:'', history:'Строящийся храм.', localHistory:'Посёлок Негорелое – крупный железнодорожный узел.', mapCode:'<iframe src="https://yandex.by/map-widget/v1/?ll=27.090108%2C53.610051&mode=search&oid=119295910603&ol=biz&z=14.55" width="100%" height="300" frameborder="0"></iframe>', isVacant:false }
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
        teachers: [],
        aboutText: '',
        worship: { prayers: [], calendar: [], readings: { apostol: '', evangelie: '' }, interpretations: [], sacraments: [] },
        faq: [],
        users: [ { id:1, username:'Makar', password:'Makar27.05.2014', role:'developer', permissions:['all'] } ],
        opechenie: [
            { id: 1, name: 'Паллиативный хоспис, д.\u00A0Волковичи', responsible: '', description: '', templeId: 0 },
            { id: 2, name: 'Дзержинская районная центральная библиотека', responsible: '', description: '', templeId: 0 },
            { id: 3, name: 'ГУО Средняя школа №1 г.\u00A0Фаниполь', responsible: '', description: '', templeId: 0 },
            { id: 4, name: 'Гимназия №1 г.\u00A0Дзержинска', responsible: '', description: '', templeId: 0 },
            { id: 5, name: 'Станьковская средняя школа имени М.\u00A0Казея', responsible: '', description: '', templeId: 0 },
            { id: 6, name: 'ГУО Гричинская базовая школа', responsible: '', description: '', templeId: 0 },
            { id: 7, name: 'ГУО Заболотский учебно-педагогический комплекс детский сад – базовая школа', responsible: '', description: '', templeId: 0 },
            { id: 8, name: 'Средняя школа №4 г.\u00A0Дзержинска', responsible: '', description: '', templeId: 0 },
            { id: 9, name: 'Гимназия имени А.\u00A0И.\u00A0Гурина, г.\u00A0Фаниполь', responsible: '', description: '', templeId: 0 },
            { id: 10, name: 'Учебный центр специального назначения внутренних войск 5528', responsible: '', description: '', templeId: 0 },
            { id: 11, name: 'Войсковая часть 1463, г.\u00A0Дзержинск', responsible: '', description: '', templeId: 0 },
            { id: 12, name: 'Войсковая часть 30151, г.\u00A0Фаниполь', responsible: '', description: '', templeId: 0 }
        ]
    };
    nextId = { temple:9, clergy:9, schedule:1, news:1, announcement:1, sundaySchool:1, faq:1, user:2, opechenie:13, teacher:1 };
    setDefaultPhotos();
    saveData();
    renderCurrentPage();
    applyTranslations();
    restoreVisionMode();
    rebuildNav();
}

// ========== ПОСТРОЕНИЕ НАВИГАЦИИ ==========
function rebuildNav() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;
    const oldNav = topBar.querySelector('nav');
    if (oldNav) oldNav.remove();
    const tools = topBar.querySelector('.tools');
    if (!tools) return;

    const nav = document.createElement('nav');
    nav.id = 'mainNav';
    const links = [
        { page: 'main', text: 'Главная' },
        { page: 'temples', text: 'Храмы' },
        { page: 'clergy', text: 'Духовенство' },
        { page: 'news', text: 'Новости' },
        { page: 'announcements', text: 'Объявления' },
        { page: 'sunday-school', text: 'Воскресные школы' },
        { page: 'about', text: 'О благочинии' },
        { page: 'worship', text: 'Богослужения' },
        { page: 'opechenie', text: 'Окормление' }
    ];
    links.forEach(l => {
        const a = document.createElement('a');
        a.href = l.page === 'main' ? 'index.html' : l.page + '.html';
        a.dataset.page = l.page;
        a.textContent = l.text;
        nav.appendChild(a);
    });

    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.id = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(hamburger);

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.id = 'mobileMenu';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Закрыть меню');
    mobileMenu.appendChild(closeBtn);
    links.forEach(l => {
        const a = document.createElement('a');
        a.href = l.page === 'main' ? 'index.html' : l.page + '.html';
        a.dataset.page = l.page;
        a.textContent = l.text;
        mobileMenu.appendChild(a);
    });
    nav.appendChild(mobileMenu);

    topBar.insertBefore(nav, tools);

    const hamburgerBtn = document.getElementById('hamburger');
    const mobileMenuEl = document.getElementById('mobileMenu');
    const closeBtnEl = mobileMenuEl.querySelector('.mobile-menu-close');
    if (hamburgerBtn && mobileMenuEl) {
        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenuEl.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        };
        hamburgerBtn.addEventListener('click', toggleMenu);
        closeBtnEl.addEventListener('click', toggleMenu);
        mobileMenuEl.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', function() {
                hamburgerBtn.classList.remove('active');
                mobileMenuEl.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        document.addEventListener('click', function(e) {
            if (!mobileMenuEl.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                mobileMenuEl.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    const currentPage = document.body.dataset.page || 'main';
    nav.querySelectorAll('a[data-page]').forEach(a => {
        if (a.dataset.page === currentPage) a.classList.add('active');
    });
}

// ========== РЕНДЕРИНГ СТРАНИЦ ==========
function renderCurrentPage() {
    const container = document.getElementById('mainContent');
    if (!container) return;
    const page = document.body.dataset.page || 'main';
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const isDetail = !!id;

    if (isDetail) {
        const numId = parseInt(id);
        if (page === 'temples') {
            renderTempleDetail(container, numId);
        } else if (page === 'clergy') {
            renderClergyDetail(numId);
        } else if (page === 'sunday-school') {
            renderSundaySchoolDetail(numId);
        } else {
            container.innerHTML = '<p>Страница не найдена</p>';
        }
        updateNavActive(page);
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
        case 'opechenie': renderOpecheniePage(container); break;
        default: container.innerHTML = '<p>Страница не найдена</p>';
    }
    updateNavActive(page);
    applyTranslations();
    updateVisionUI();
}

function updateNavActive(page) {
    const nav = document.querySelector('#mainNav');
    if (nav) {
        nav.querySelectorAll('a[data-page]').forEach(a => {
            a.classList.toggle('active', a.dataset.page === page);
        });
    }
}

// ---------- ГЛАВНАЯ ----------
function renderMainPage() {
    const container = document.getElementById('mainContent');
    if (!container) return;
    let html = `
        <div class="hero-banner" onclick="window.location.href='temple-1.html'">
            <div style="text-align:center; z-index:2; position:relative;">
                <h1>Храм Покрова Пресвятой Богородицы</h1>
                <div class="sub">г.\u00A0Дзержинск</div>
            </div>
        </div>
        <h2 style="margin:1.5rem 0 0.5rem; text-align:center; font-family:'Cormorant Uncial', serif;">Наши храмы</h2>
        <div class="carousel">
            <button class="carousel-btn left" onclick="scrollCarousel(-1)">‹</button>
            <div class="carousel-track" id="carouselTrack">`;
    data.temples.forEach(t => {
        if (t.id === 1) return;
        const imgSrc = getTemplePhoto(t);
        html += `<div class="carousel-item" data-id="${t.id}"><img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(t.name)}" loading="lazy" onerror="this.style.display='none'"><div class="info" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(t.name)}</div></div>`;
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
    container.querySelectorAll('.carousel-item').forEach(el => el.addEventListener('click', function() { window.location.href = `temple-${this.dataset.id}.html`; }));
}
function scrollCarousel(direction) { const track = document.getElementById('carouselTrack'); if (track) track.scrollBy({ left: direction * 280, behavior: 'smooth' }); }

// ---------- СПИСОК ХРАМОВ ----------
function renderTemplesList(container) {
    let html = `<h2>${t('temples-title')}</h2><div class="grid">`;
    data.temples.forEach(t => {
        html += `<div class="grid-item" data-id="${t.id}" data-type="temple">
            <img src="${escapeHtml(getTemplePhoto(t))}" alt="${escapeHtml(t.name)}" loading="lazy" onerror="this.style.display='none'">
            <div class="info"><h3 style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(t.name)}</h3>${t.isVacant ? `<div class="status vacant">${t('vacant')}</div>` : ''}</div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    container.querySelectorAll('.grid-item[data-type="temple"]').forEach(el => el.addEventListener('click', function() { window.location.href = `temple-${this.dataset.id}.html`; }));
}

// ---------- ДЕТАЛЬНАЯ СТРАНИЦА ХРАМА ----------
function renderTempleDetail(container, id) {
    if (!data.temples || data.temples.length === 0) {
        setTimeout(() => renderTempleDetail(container, id), 300);
        return;
    }
    const temple = data.temples.find(t => t.id === id);
    if (!temple) {
        container.innerHTML = '<p>Храм не найден</p>';
        return;
    }
    const photoSrc = getTemplePhoto(temple);
    const phoneNumber = temple.phone || '+375291234567';
    const address = temple.address ? temple.address.replace(/ул\. /g, 'ул.\u00A0').replace(/г\. /g, 'г.\u00A0').replace(/д\. /g, 'д.\u00A0').replace(/п\. /g, 'п.\u00A0').replace(/аг\. /g, 'аг.\u00A0') : '';

    let activeTab = currentTempleTab || 'schedule';

    let html = `
        <div class="detail-back" onclick="history.back()">${t('back')}</div>
        <div class="temple-detail-hero" style="background-image: url('${escapeHtml(photoSrc)}');">
            <div class="overlay"></div>
            <div class="content">
                <h1>${escapeHtml(temple.name)}</h1>
                <div class="address">${escapeHtml(address)}</div>
                <div class="action-buttons">
                    <button class="temple-action-btn" data-tab="schedule">📅 Расписание</button>
                    <button class="temple-action-btn" data-tab="contacts">📞 Контакты</button>
                    <button class="temple-action-btn" data-tab="clergy">👥 Священнослужители</button>
                    <button class="temple-action-btn" data-tab="schools">🏫 Воскресные школы</button>
                    ${phoneNumber ? `<a href="tel:${escapeHtml(phoneNumber)}" class="temple-action-btn phone">📱 Позвонить</a>` : ''}
                </div>
            </div>
        </div>
        <div style="max-width: 800px; margin: 0 auto;">
            <div class="temple-history-buttons">
                <button class="history-btn active" data-tab="history">📜 История храма</button>
                <button class="history-btn" data-tab="local-history">🏛️ История местности</button>
            </div>
            <div id="tab-history" class="tab-content active" style="background: var(--card-bg); padding: 1rem; border-radius: 16px; box-shadow: 0 2px 8px var(--shadow); margin-bottom: 1rem;">
                <p>${escapeHtml(temple.history) || 'История не добавлена.'}</p>
            </div>
            <div id="tab-local-history" class="tab-content" style="display: none; background: var(--card-bg); padding: 1rem; border-radius: 16px; box-shadow: 0 2px 8px var(--shadow); margin-bottom: 1rem;">
                <p>${escapeHtml(temple.localHistory) || 'История местности не добавлена.'}</p>
            </div>

            <div id="templeSchedule" style="display: ${activeTab === 'schedule' ? 'block' : 'none'}; background: var(--card-bg); padding: 1rem; border-radius: 16px; margin-bottom: 1rem; box-shadow: 0 2px 8px var(--shadow);">
                <h3 style="margin-bottom: 0.5rem;">${t('schedule-title')}</h3>
                ${(data.schedules.filter(s => s.templeId === id)).length ? `<table class="schedule-table"><thead><tr><th>${t('date')}</th><th>${t('event')}</th></tr></thead><tbody>${data.schedules.filter(s => s.templeId === id).map(s => `<tr><td>${escapeHtml(s.date)}</td><td>${escapeHtml(s.event)}</td></tr>`).join('')}</tbody></table>` : `<p>${t('no-schedule')}</p>`}
            </div>
            <div id="templeContacts" style="display: ${activeTab === 'contacts' ? 'block' : 'none'}; background: var(--card-bg); padding: 1rem; border-radius: 16px; margin-bottom: 1rem; box-shadow: 0 2px 8px var(--shadow);">
                <h3 style="margin-bottom: 0.5rem;">Контакты</h3>
                ${temple.phone ? `<div><strong>📞 Телефон:</strong> <a href="tel:${escapeHtml(temple.phone)}">${escapeHtml(temple.phone)}</a></div>` : ''}
                ${temple.email ? `<div><strong>📧 Email:</strong> <a href="mailto:${escapeHtml(temple.email)}">${escapeHtml(temple.email)}</a></div>` : ''}
                ${address ? `<div><strong>📍 Адрес:</strong> ${escapeHtml(address)}</div>` : ''}
                <div style="margin-top: 0.5rem;">${temple.mapCode || '<p>Карта не добавлена.</p>'}</div>
            </div>
            <div id="templeClergy" style="display: ${activeTab === 'clergy' ? 'block' : 'none'}; background: var(--card-bg); padding: 1rem; border-radius: 16px; margin-bottom: 1rem; box-shadow: 0 2px 8px var(--shadow);">
                <h3 style="margin-bottom: 0.5rem;">${t('clergy-list')}</h3>
                ${data.clergy.filter(c => c.templeIds && c.templeIds.includes(id)).length ? `<div class="clergy-list">${data.clergy.filter(c => c.templeIds && c.templeIds.includes(id)).map(c => `<div class="clergy-card" data-id="${c.id}" style="cursor:pointer;"><img src="${escapeHtml(c.photo||'placeholder.jpg')}"><div><strong>${escapeHtml(c.name)}</strong></div><div style="font-size:0.85rem;">${escapeHtml(c.rank)}</div></div>`).join('')}</div>` : `<p>${t('no-clergy')}</p>`}
            </div>
            <div id="templeSchools" style="display: ${activeTab === 'schools' ? 'block' : 'none'}; background: var(--card-bg); padding: 1rem; border-radius: 16px; margin-bottom: 1rem; box-shadow: 0 2px 8px var(--shadow);">
                <h3 style="margin-bottom: 0.5rem;">Воскресные школы</h3>
                ${data.sundaySchools.filter(s => s.templeId === id).length ? `<div>${data.sundaySchools.filter(s => s.templeId === id).map(s => `<div style="margin-bottom:0.5rem;"><strong>${escapeHtml(s.name)}</strong> (${escapeHtml(s.type)})<br>${escapeHtml(s.description||'')}</div>`).join('')}</div>` : `<p>${t('no-sunday-schools')}</p>`}
            </div>
        </div>
    `;
    container.innerHTML = html;

    container.querySelectorAll('.temple-action-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            currentTempleTab = tab;
            ['templeSchedule', 'templeContacts', 'templeClergy', 'templeSchools'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            const targetMap = {
                'schedule': 'templeSchedule',
                'contacts': 'templeContacts',
                'clergy': 'templeClergy',
                'schools': 'templeSchools'
            };
            const targetId = targetMap[tab];
            if (targetId) {
                const el = document.getElementById(targetId);
                if (el) el.style.display = 'block';
            }
        });
    });

    const historyBtns = container.querySelectorAll('.history-btn');
    const historyTabs = {
        'history': document.getElementById('tab-history'),
        'local-history': document.getElementById('tab-local-history')
    };
    historyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            historyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            Object.keys(historyTabs).forEach(key => {
                historyTabs[key].style.display = key === tab ? 'block' : 'none';
            });
        });
    });

    container.querySelectorAll('.clergy-card').forEach(el => {
        el.addEventListener('click', function() {
            const cid = parseInt(this.dataset.id);
            window.location.href = `clergy-detail.html?id=${cid}`;
        });
    });
}

// ---------- ДУХОВЕНСТВО ----------
function renderClergyList(container) {
    let html = `<h2>${t('clergy-title')}</h2><div class="grid" id="clergyList">`;
    data.clergy.forEach(c => {
        html += `<div class="grid-item" data-id="${c.id}" data-type="clergy">
            <img src="${escapeHtml(c.photo||'placeholder.jpg')}" alt="${escapeHtml(c.name)}" loading="lazy" onerror="this.style.display='none'" style="border-radius:20px; height:400px; object-fit:cover;">
            <div class="info"><h3>${escapeHtml(c.name)}</h3><div class="status">${escapeHtml(c.rank)}</div><div style="font-size:0.8rem;color:#999;">${getTempleNames(c.templeIds)}</div></div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    container.querySelectorAll('.grid-item[data-type="clergy"]').forEach(el => el.addEventListener('click', function() { window.location.href = `clergy-detail.html?id=${this.dataset.id}`; }));
}
function renderClergyDetail(id) {
    if (!data.clergy || data.clergy.length === 0) { setTimeout(() => renderClergyDetail(id), 300); return; }
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

// ---------- РАСПИСАНИЕ ----------
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

// ---------- НОВОСТИ ----------
function renderNewsList(container) {
    let html = `<h2>${t('news-title')}</h2>`;
    html += `<div style="margin-bottom: 1rem;"><a href="https://t.me/dzrzh_blag" target="_blank" class="btn-telegram" style="background: #0088cc; color: white; padding: 0.5rem 1.2rem; border-radius: 40px; text-decoration: none; display: inline-block; font-weight: bold;">📢 Подписаться на Telegram-канал</a></div>`;
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

// ---------- ОБЪЯВЛЕНИЯ ----------
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

// ---------- ВОСКРЕСНЫЕ ШКОЛЫ (БЕЗ ФОТО) ----------
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
            <div class="info"><h3 style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(s.name)}</h3><div class="type">${escapeHtml(s.type)}</div><div style="font-size:0.85rem;color:#999;">${temple ? escapeHtml(temple.name) : 'Без привязки'}</div></div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    container.querySelectorAll('.grid-item[data-type="sunday-school"]').forEach(el => el.addEventListener('click', function() { window.location.href = `sunday-school-detail.html?id=${this.dataset.id}`; }));
}

function renderSundaySchoolDetail(id) {
    if (!data.sundaySchools || data.sundaySchools.length === 0) {
        setTimeout(() => renderSundaySchoolDetail(id), 300);
        return;
    }
    const school = data.sundaySchools.find(s => s.id === id);
    if (!school) {
        document.getElementById('mainContent').innerHTML = '<p>Школа не найдена</p>';
        return;
    }
    const container = document.getElementById('mainContent');
    const temple = data.temples.find(t => t.id === school.templeId);
    const teachers = data.teachers.filter(t => t.schoolId === id);

    let teachersHtml = '';
    if (teachers.length) {
        teachersHtml = `
            <h3 style="margin-top: 1.5rem; margin-bottom: 1rem;">👨‍🏫 Преподаватели и сотрудники</h3>
            <div class="clergy-list" style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center;">
                ${teachers.map(t => `
                    <div class="clergy-card" style="width: 220px; text-align: center; background: var(--card-bg); padding: 1rem; border-radius: 16px; border: 1px solid var(--border);">
                        <img src="${escapeHtml(t.photo||'placeholder.jpg')}" alt="${escapeHtml(t.name)}" style="width: 200px; height: 200px; border-radius: 50%; object-fit: cover; object-position: top center; margin: 0 auto 0.5rem; display: block;">
                        <div><strong>${escapeHtml(t.name)}</strong></div>
                        <div style="font-size: 0.85rem; color: var(--gold);">${escapeHtml(t.role)}</div>
                        ${t.description ? `<div style="font-size: 0.85rem; margin-top: 0.3rem; color: var(--text);">${escapeHtml(t.description)}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="detail-back" onclick="window.location.href='sunday-school.html'">${t('back')}</div>
        <div class="detail-content">
            <img src="${escapeHtml(school.photo||'placeholder.jpg')}" alt="${escapeHtml(school.name)}" style="max-width: 100%; border-radius: 16px; margin-bottom: 1rem;">
            <h2>${escapeHtml(school.name)}</h2>
            <div class="school-info">
                <p><strong>${t('sunday-school-type')}:</strong> ${escapeHtml(school.type)}</p>
                <p><strong>${t('temple')}:</strong> ${temple ? escapeHtml(temple.name) : 'Без привязки'}</p>
                <p><strong>${t('sunday-school-desc')}:</strong> ${escapeHtml(school.description) || 'Описание отсутствует.'}</p>
            </div>
            ${teachersHtml}
        </div>
    `;
}

// ---------- О БЛАГОЧИНИИ ----------
function renderAboutPage(container) {
    let html = `<h2>О благочинии</h2>
        <div class="card"><div style="white-space:pre-line;">${escapeHtml(data.aboutText || 'Информация о благочинии не добавлена.')}</div></div>`;
    container.innerHTML = html;
}

// ---------- БОГОСЛУЖЕНИЯ ----------
function renderWorshipPage(container) {
    const tabs = [
        { id: 'schedule', label: 'Расписание' },
        { id: 'prayers', label: 'Молитвослов' },
        { id: 'calendar', label: 'Календарь' },
        { id: 'interpretations', label: 'Толкования' },
        { id: 'sacraments', label: 'Подготовка к таинствам' }
    ];
    let html = `<h2>${t('nav-worship')}</h2>
        <div class="card">
            <div class="tabs worship-tabs" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">`;
    tabs.forEach((tab, idx) => {
        const isActive = (currentWorshipTab === tab.id) || (idx === 0 && !currentWorshipTab);
        html += `<button class="tab-btn worship-tab-btn ${isActive ? 'active' : ''}" data-tab="${tab.id}" style="padding:0.6rem 1.2rem; border:2px solid var(--gold); border-radius:40px; background:${isActive ? 'var(--gold)' : 'transparent'}; color:${isActive ? 'white' : 'var(--primary)'}; font-weight:600; cursor:pointer; transition:all 0.3s; font-family:inherit; font-size:0.95rem;">${tab.label}</button>`;
    });
    html += `</div><div class="worship-content" id="worshipContent">`;
    html += `<div class="worship-block ${currentWorshipTab === 'schedule' || !currentWorshipTab ? 'active' : ''}" id="worship-schedule">${getScheduleHTML()}</div>`;
    html += `<div class="worship-block ${currentWorshipTab === 'prayers' ? 'active' : ''}" id="worship-prayers">`;
    const prayers = data.worship?.prayers || [];
    if (!prayers.length) html += `<p>Молитвы не добавлены.</p>`;
    else prayers.forEach(p => html += `<div class="prayer-item"><strong>${escapeHtml(p.title)}</strong><p>${escapeHtml(p.text)}</p></div>`);
    html += `</div>`;

    html += `<div class="worship-block ${currentWorshipTab === 'calendar' ? 'active' : ''}" id="worship-calendar">
        <div class="worship-calendar-container">
            <h3>${t('calendar-title')}</h3>
            <iframe src="https://script.pravoslavie.ru/calendar.php" style="width:100%; height:600px; border:none; border-radius:16px; box-shadow:0 4px 12px var(--shadow);"></iframe>
            <div style="margin-top:1.5rem;">
                <iframe src="https://script.pravoslavie.ru/icon.php" style="width:100%; height:400px; border:none; border-radius:16px; box-shadow:0 4px 12px var(--shadow);"></iframe>
            </div>
            <p style="margin-top:0.5rem; font-size:0.85rem; color:#999;">Календарь и икона дня с сайта Православие.Ru</p>
        </div>
    </div>`;

    html += `<div class="worship-block ${currentWorshipTab === 'interpretations' ? 'active' : ''}" id="worship-interpretations">`;
    const interpretations = data.worship?.interpretations || [];
    if (!interpretations.length) html += `<p>Толкования не добавлены.</p>`;
    else interpretations.forEach(i => html += `<div class="interpretation-item"><strong>${escapeHtml(i.title)}</strong><p>${escapeHtml(i.text)}</p></div>`);
    html += `</div>`;
    html += `<div class="worship-block ${currentWorshipTab === 'sacraments' ? 'active' : ''}" id="worship-sacraments">`;
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
            currentWorshipTab = tabId;
            container.querySelectorAll('.worship-tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--primary)';
            });
            this.classList.add('active');
            this.style.background = 'var(--gold)';
            this.style.color = 'white';
            container.querySelectorAll('.worship-block').forEach(block => block.classList.remove('active'));
            const target = document.getElementById('worship-'+tabId);
            if (target) target.classList.add('active');
        });
    });

    const activeBtn = container.querySelector(`.worship-tab-btn[data-tab="${currentWorshipTab}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = 'var(--gold)';
        activeBtn.style.color = 'white';
    } else if (container.querySelector('.worship-tab-btn')) {
        const firstBtn = container.querySelector('.worship-tab-btn');
        firstBtn.classList.add('active');
        firstBtn.style.background = 'var(--gold)';
        firstBtn.style.color = 'white';
        currentWorshipTab = firstBtn.dataset.tab;
        const firstBlock = document.getElementById('worship-'+currentWorshipTab);
        if (firstBlock) firstBlock.classList.add('active');
    }
}

// ---------- FAQ ----------
function renderFaqPage(container) {
    let html = `<h2>${t('faq-title')}</h2>
        <div id="faqForm" class="card"><h3>${t('ask-question')}</h3>
            <form id="askForm">
                <input type="text" id="questionName" placeholder="${t('your-name')}" required>
                <textarea id="questionText" rows="4" placeholder="${t('your-question')}" required></textarea>
                <button type="submit">${t('send')}</button>
            </form>
            <div id="formMessage"></div>
        </div>
        <div id="faqList" class="card"><h3>${t('admin-faq')}</h3>`;
    const faq = data.faq||[];
    if (!faq.length) html += `<p>${t('no-faq')}</p>`;
    else {
        const sorted = [...faq].sort((a,b)=>new Date(b.date)-new Date(a.date));
        sorted.forEach(item => {
            html += `<div class="faq-item"><div class="question">${escapeHtml(item.question)}</div>
                ${item.answer ? `<div class="answer">${escapeHtml(item.answer)}</div>` : '<div style="color:#999;">Ожидает ответа</div>'}
                <div class="date">${escapeHtml(item.date)} | ${escapeHtml(item.name)}</div></div>`;
        });
    }
    html += `</div>`;
    if (hasPermission(currentUser, 'manage_ai')) {
        html += `
            <div class="card" id="aiBlock">
                <h2>${t('ai-chat')}</h2>
                <div class="form-group"><textarea id="aiQuestion" rows="3" placeholder="${t('ai-question')}" style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"></textarea></div>
                <button id="askAIBtn" class="btn" style="padding:0.6rem 1.5rem; background:var(--gold); color:white; border:none; border-radius:40px; cursor:pointer; font-family:inherit; font-size:1rem;">${t('send')}</button>
                <div id="aiAnswer" style="margin-top:1rem; padding:1rem; background:var(--bg); border-radius:16px; display:none;">
                    <strong>${t('ai-answer')}:</strong>
                    <div id="aiResponseContent"></div>
                </div>
            </div>
        `;
    }
    html += `<div class="card"><h2>📬 Написать в Telegram</h2>
        <form action="send.php" method="POST" id="feedbackForm" style="max-width:500px;margin:0 auto;">
            <div class="form-group"><input type="text" name="name" placeholder="Ваше имя" required style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"></div>
            <div class="form-group"><select name="theme" style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"><option value="">Выберите тему</option><option value="Предложение">📝 Предложение</option><option value="Замечание">⚠️ Замечание</option><option value="Вопрос">❓ Вопрос</option><option value="Другое">📩 Другое</option></select></div>
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

// ---------- ИИ ----------
async function askAI() {
    const questionInput = document.getElementById('aiQuestion');
    if (!questionInput) return;
    const question = questionInput.value.trim();
    if (!question) { alert('Введите вопрос'); return; }
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
            let errorMsg = `Ошибка сервера: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) errorMsg = errorData.error;
            } catch(e) {}
            throw new Error(errorMsg);
        }
        const text = await response.text();
        if (!text) throw new Error('Пустой ответ от сервера');
        let data;
        try { data = JSON.parse(text); } catch(e) { throw new Error('Некорректный JSON-ответ'); }
        const answer = data.result?.alternatives?.[0]?.message?.text || t('ai-error');
        contentDiv.textContent = answer;
    } catch (error) {
        console.error('Ошибка ИИ:', error);
        contentDiv.textContent = t('ai-error') + ': ' + error.message;
    }
}

async function adminAskAI() {
    const questionInput = document.getElementById('adminAIQuestion');
    if (!questionInput) return;
    const question = questionInput.value.trim();
    if (!question) { alert('Введите вопрос'); return; }
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
            let errorMsg = `Ошибка сервера: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) errorMsg = errorData.error;
            } catch(e) {}
            throw new Error(errorMsg);
        }
        const text = await response.text();
        if (!text) throw new Error('Пустой ответ от сервера');
        let data;
        try { data = JSON.parse(text); } catch(e) { throw new Error('Некорректный JSON-ответ'); }
        const answer = data.result?.alternatives?.[0]?.message?.text || t('ai-error');
        contentDiv.textContent = answer;
    } catch (error) {
        console.error('Ошибка ИИ:', error);
        contentDiv.textContent = t('ai-error') + ': ' + error.message;
    }
}

function renderAdminAI(container) {
    container.innerHTML = `
        <h3>🤖 ИИ-помощник</h3>
        <div class="card">
            <div class="form-group"><label>${t('ai-question')}</label><textarea id="adminAIQuestion" rows="4" style="width:100%; padding:0.6rem; border-radius:16px; border:1px solid var(--border); background:var(--bg);"></textarea></div>
            <button id="adminAskAIBtn" class="btn" style="padding:0.6rem 1.5rem; background:var(--gold); color:white; border:none; border-radius:40px; cursor:pointer; font-family:inherit; font-size:1rem;">${t('send')}</button>
            <div id="adminAIAnswer" style="margin-top:1rem; padding:1rem; background:var(--bg); border-radius:16px; display:none;">
                <strong>${t('ai-answer')}:</strong>
                <div id="adminAIResponseContent"></div>
            </div>
        </div>
    `;
    document.getElementById('adminAskAIBtn').addEventListener('click', adminAskAI);
}

// ---------- ОКОРМЛЕНИЕ ----------
function renderOpecheniePage(container) {
    let html = `<h2>Окормление</h2>`;
    if (!data.opechenie || data.opechenie.length === 0) {
        html += `<p>Нет данных об окормлении.</p>`;
    } else {
        html += `<div class="grid">`;
        data.opechenie.forEach(item => {
            const templeName = getTempleName(item.templeId);
            html += `
                <div class="grid-item">
                    <div class="info">
                        <h3>${escapeHtml(item.name)}</h3>
                        ${item.responsible ? `<div><strong>Ответственный:</strong> ${escapeHtml(item.responsible)}</div>` : ''}
                        ${item.templeId ? `<div><strong>Храм:</strong> ${escapeHtml(templeName)}</div>` : ''}
                        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
}

// ========== АДМИН-ПАНЕЛЬ ==========
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
    const hasOpecheniePerm = hasPermission(currentUser, 'manage_opechenie');
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
    if (hasOpecheniePerm) menuButtons += `<button class="admin-menu-btn" data-section="opechenie">📋 Окормление</button>`;
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
        'schedule':'manage_schedule','temples':'manage_temples','clergy':'manage_clergy',
        'news':'manage_news','announcements':'manage_announcements',
        'sunday-school':'manage_sunday_schools','about':'manage_about',
        'worship':'manage_worship','ai':'manage_ai','users':'manage_users',
        'opechenie':'manage_opechenie'
    };
    if (permMap[section] && !hasPermission(currentUser, permMap[section])) {
        content.innerHTML = '<p>Доступ запрещён.</p>'; return;
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
        case 'users': renderAdminUsers(content); break;
        case 'opechenie': renderAdminOpechenie(content); break;
        default: content.innerHTML = '<p>Неизвестный раздел.</p>';
    }
}

// ---------- ВСЕ АДМИНИСТРАТИВНЫЕ ФУНКЦИИ ----------
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
        if (target.id === 'adminAddScheduleBtn') document.getElementById('adminScheduleForm').style.display = 'block';
        if (target.id === 'adminCancelScheduleBtn') document.getElementById('adminScheduleForm').style.display = 'none';
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

function renderAdminTemples(container) {
    let html = `<h3>Управление храмами</h3>
        <button id="adminTempleAddBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить храм</button>
        <div id="adminTempleList">${renderTemplesTable()}</div>
        <div id="adminTempleForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="templeFormTitle">Добавить храм</h4>
            <input type="hidden" id="templeFormId">
            <div class="form-group"><label>Название</label><input type="text" id="templeFormName" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Краткое описание</label><textarea id="templeFormSummary" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Адрес</label><input type="text" id="templeFormAddress" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Телефон</label><input type="text" id="templeFormPhone" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Email</label><input type="text" id="templeFormEmail" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>История храма</label><textarea id="templeFormHistory" rows="3" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>История местности</label><textarea id="templeFormLocalHistory" rows="3" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Код карты (iframe)</label><textarea id="templeFormMapCode" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Фото (имя файла)</label><input type="text" id="templeFormPhoto" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label><input type="checkbox" id="templeFormVacant"> Приход вакантный</label></div>
            <button id="templeFormSaveBtn" class="btn">Сохранить</button>
            <button id="templeFormCancelBtn" class="btn btn-sm">Отмена</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminTempleAddBtn') {
            document.getElementById('templeFormTitle').textContent = 'Добавить храм';
            document.getElementById('templeFormId').value = '';
            ['Name','Summary','Address','Phone','Email','History','LocalHistory','MapCode','Photo'].forEach(f => document.getElementById('templeForm'+f).value = '');
            document.getElementById('templeFormVacant').checked = false;
            document.getElementById('adminTempleForm').style.display = 'block';
        }
        if (target.id === 'templeFormCancelBtn') document.getElementById('adminTempleForm').style.display = 'none';
        if (target.id === 'templeFormSaveBtn') {
            const id = document.getElementById('templeFormId').value;
            const temple = {
                name: document.getElementById('templeFormName').value.trim(),
                summary: document.getElementById('templeFormSummary').value.trim(),
                address: document.getElementById('templeFormAddress').value.trim(),
                phone: document.getElementById('templeFormPhone').value.trim(),
                email: document.getElementById('templeFormEmail').value.trim(),
                history: document.getElementById('templeFormHistory').value.trim(),
                localHistory: document.getElementById('templeFormLocalHistory').value.trim(),
                mapCode: document.getElementById('templeFormMapCode').value.trim(),
                photo: document.getElementById('templeFormPhoto').value.trim() || 'placeholder.jpg',
                isVacant: document.getElementById('templeFormVacant').checked
            };
            if (!temple.name) { alert('Название обязательно'); return; }
            if (id) {
                const exist = data.temples.find(t => t.id == id);
                if (exist) Object.assign(exist, temple);
            } else {
                temple.id = nextId.temple++;
                data.temples.push(temple);
            }
            saveData();
            document.getElementById('adminTempleForm').style.display = 'none';
            renderAdminTemples(container);
        }
        if (target.classList.contains('admin-temple-delete')) {
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить храм?')) return;
            data.temples = data.temples.filter(t => t.id !== id);
            saveData();
            renderAdminTemples(container);
        }
        if (target.classList.contains('admin-temple-edit')) {
            const id = parseInt(target.dataset.id);
            const t = data.temples.find(t => t.id === id);
            if (!t) return;
            document.getElementById('templeFormTitle').textContent = 'Редактировать храм';
            document.getElementById('templeFormId').value = id;
            ['Name','Summary','Address','Phone','Email','History','LocalHistory','MapCode','Photo'].forEach(f => {
                document.getElementById('templeForm'+f).value = t[f.toLowerCase()] || '';
            });
            document.getElementById('templeFormVacant').checked = t.isVacant || false;
            document.getElementById('adminTempleForm').style.display = 'block';
        }
    });
}
function renderTemplesTable() {
    if (!data.temples.length) return '<p>Нет храмов</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Адрес</th><th>Действия</th></tr></thead><tbody>`;
    data.temples.forEach(t => {
        table += `<tr><td>${escapeHtml(t.name)}</td><td>${escapeHtml(t.address||'')}</td>
            <td><button class="btn btn-sm admin-temple-edit" data-id="${t.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-temple-delete" data-id="${t.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

function renderAdminClergy(container) {
    let html = `<h3>Управление духовенством</h3>
        <button id="adminClergyAddBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить священнослужителя</button>
        <div id="adminClergyList">${renderClergyTable()}</div>
        <div id="adminClergyForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="clergyFormTitle">Добавить священнослужителя</h4>
            <input type="hidden" id="clergyFormId">
            <div class="form-group"><label>Имя</label><input type="text" id="clergyFormName" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Сан</label><input type="text" id="clergyFormRank" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Описание</label><textarea id="clergyFormDesc" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Фото (имя файла)</label><input type="text" id="clergyFormPhoto" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Храмы (ID через запятую)</label><input type="text" id="clergyFormTempleIds" style="width:100%; padding:0.4rem;" placeholder="1,2,3"></div>
            <button id="clergyFormSaveBtn" class="btn">Сохранить</button>
            <button id="clergyFormCancelBtn" class="btn btn-sm">Отмена</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminClergyAddBtn') {
            document.getElementById('clergyFormTitle').textContent = 'Добавить священнослужителя';
            document.getElementById('clergyFormId').value = '';
            ['Name','Rank','Desc','Photo','TempleIds'].forEach(f => document.getElementById('clergyForm'+f).value = '');
            document.getElementById('adminClergyForm').style.display = 'block';
        }
        if (target.id === 'clergyFormCancelBtn') document.getElementById('adminClergyForm').style.display = 'none';
        if (target.id === 'clergyFormSaveBtn') {
            const id = document.getElementById('clergyFormId').value;
            const clergy = {
                name: document.getElementById('clergyFormName').value.trim(),
                rank: document.getElementById('clergyFormRank').value.trim(),
                description: document.getElementById('clergyFormDesc').value.trim(),
                photo: document.getElementById('clergyFormPhoto').value.trim() || 'placeholder.jpg',
                templeIds: document.getElementById('clergyFormTempleIds').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
            };
            if (!clergy.name) { alert('Имя обязательно'); return; }
            if (id) {
                const exist = data.clergy.find(c => c.id == id);
                if (exist) Object.assign(exist, clergy);
            } else {
                clergy.id = nextId.clergy++;
                data.clergy.push(clergy);
            }
            saveData();
            document.getElementById('adminClergyForm').style.display = 'none';
            renderAdminClergy(container);
        }
        if (target.classList.contains('admin-clergy-delete')) {
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить?')) return;
            data.clergy = data.clergy.filter(c => c.id !== id);
            saveData();
            renderAdminClergy(container);
        }
        if (target.classList.contains('admin-clergy-edit')) {
            const id = parseInt(target.dataset.id);
            const c = data.clergy.find(c => c.id === id);
            if (!c) return;
            document.getElementById('clergyFormTitle').textContent = 'Редактировать';
            document.getElementById('clergyFormId').value = id;
            document.getElementById('clergyFormName').value = c.name;
            document.getElementById('clergyFormRank').value = c.rank;
            document.getElementById('clergyFormDesc').value = c.description||'';
            document.getElementById('clergyFormPhoto').value = c.photo||'';
            document.getElementById('clergyFormTempleIds').value = (c.templeIds||[]).join(', ');
            document.getElementById('adminClergyForm').style.display = 'block';
        }
    });
}
function renderClergyTable() {
    if (!data.clergy.length) return '<p>Нет священнослужителей</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Имя</th><th>Сан</th><th>Храмы</th><th>Действия</th></tr></thead><tbody>`;
    data.clergy.forEach(c => {
        const templeNames = (c.templeIds||[]).map(id => getTempleName(id)).join(', ');
        table += `<tr><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.rank)}</td><td>${escapeHtml(templeNames)}</td>
            <td><button class="btn btn-sm admin-clergy-edit" data-id="${c.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-clergy-delete" data-id="${c.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

function renderAdminNews(container) {
    let html = `<h3>Управление новостями</h3>
        <button id="adminNewsAddBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить новость</button>
        <div id="adminNewsList">${renderNewsTable()}</div>
        <div id="adminNewsForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="newsFormTitle">Добавить новость</h4>
            <input type="hidden" id="newsFormId">
            <div class="form-group"><label>Заголовок</label><input type="text" id="newsFormTitleInput" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Текст</label><textarea id="newsFormText" rows="4" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Дата</label><input type="date" id="newsFormDate" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Медиа (URL)</label><input type="text" id="newsFormMedia" style="width:100%; padding:0.4rem;"></div>
            <button id="newsFormSaveBtn" class="btn">Сохранить</button>
            <button id="newsFormCancelBtn" class="btn btn-sm">Отмена</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminNewsAddBtn') {
            document.getElementById('newsFormTitle').textContent = 'Добавить новость';
            document.getElementById('newsFormId').value = '';
            document.getElementById('newsFormTitleInput').value = '';
            document.getElementById('newsFormText').value = '';
            document.getElementById('newsFormDate').value = new Date().toISOString().slice(0,10);
            document.getElementById('newsFormMedia').value = '';
            document.getElementById('adminNewsForm').style.display = 'block';
        }
        if (target.id === 'newsFormCancelBtn') document.getElementById('adminNewsForm').style.display = 'none';
        if (target.id === 'newsFormSaveBtn') {
            const id = document.getElementById('newsFormId').value;
            const news = {
                title: document.getElementById('newsFormTitleInput').value.trim(),
                text: document.getElementById('newsFormText').value.trim(),
                date: document.getElementById('newsFormDate').value,
                media: document.getElementById('newsFormMedia').value.trim()
            };
            if (!news.title) { alert('Заголовок обязателен'); return; }
            if (id) {
                const exist = data.news.find(n => n.id == id);
                if (exist) Object.assign(exist, news);
            } else {
                news.id = nextId.news++;
                data.news.push(news);
            }
            saveData();
            document.getElementById('adminNewsForm').style.display = 'none';
            renderAdminNews(container);
        }
        if (target.classList.contains('admin-news-delete')) {
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить?')) return;
            data.news = data.news.filter(n => n.id !== id);
            saveData();
            renderAdminNews(container);
        }
        if (target.classList.contains('admin-news-edit')) {
            const id = parseInt(target.dataset.id);
            const n = data.news.find(n => n.id === id);
            if (!n) return;
            document.getElementById('newsFormTitle').textContent = 'Редактировать';
            document.getElementById('newsFormId').value = id;
            document.getElementById('newsFormTitleInput').value = n.title;
            document.getElementById('newsFormText').value = n.text||'';
            document.getElementById('newsFormDate').value = n.date||'';
            document.getElementById('newsFormMedia').value = n.media||'';
            document.getElementById('adminNewsForm').style.display = 'block';
        }
    });
}
function renderNewsTable() {
    if (!data.news.length) return '<p>Нет новостей</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Заголовок</th><th>Дата</th><th>Действия</th></tr></thead><tbody>`;
    data.news.forEach(n => {
        table += `<tr><td>${escapeHtml(n.title)}</td><td>${escapeHtml(n.date||'')}</td>
            <td><button class="btn btn-sm admin-news-edit" data-id="${n.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-news-delete" data-id="${n.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

function renderAdminAnnouncements(container) {
    let html = `<h3>Управление объявлениями</h3>
        <button id="adminAnnounceAddBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить объявление</button>
        <div id="adminAnnounceList">${renderAnnounceTable()}</div>
        <div id="adminAnnounceForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="announceFormTitle">Добавить объявление</h4>
            <input type="hidden" id="announceFormId">
            <div class="form-group"><label>Текст</label><textarea id="announceFormText" rows="3" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Дата</label><input type="date" id="announceFormDate" style="width:100%; padding:0.4rem;"></div>
            <button id="announceFormSaveBtn" class="btn">Сохранить</button>
            <button id="announceFormCancelBtn" class="btn btn-sm">Отмена</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAnnounceAddBtn') {
            document.getElementById('announceFormTitle').textContent = 'Добавить объявление';
            document.getElementById('announceFormId').value = '';
            document.getElementById('announceFormText').value = '';
            document.getElementById('announceFormDate').value = new Date().toISOString().slice(0,10);
            document.getElementById('adminAnnounceForm').style.display = 'block';
        }
        if (target.id === 'announceFormCancelBtn') document.getElementById('adminAnnounceForm').style.display = 'none';
        if (target.id === 'announceFormSaveBtn') {
            const id = document.getElementById('announceFormId').value;
            const announce = {
                text: document.getElementById('announceFormText').value.trim(),
                date: document.getElementById('announceFormDate').value
            };
            if (!announce.text) { alert('Текст обязателен'); return; }
            if (id) {
                const exist = data.announcements.find(a => a.id == id);
                if (exist) Object.assign(exist, announce);
            } else {
                announce.id = nextId.announcement++;
                data.announcements.push(announce);
            }
            saveData();
            document.getElementById('adminAnnounceForm').style.display = 'none';
            renderAdminAnnouncements(container);
        }
        if (target.classList.contains('admin-announce-delete')) {
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить?')) return;
            data.announcements = data.announcements.filter(a => a.id !== id);
            saveData();
            renderAdminAnnouncements(container);
        }
        if (target.classList.contains('admin-announce-edit')) {
            const id = parseInt(target.dataset.id);
            const a = data.announcements.find(a => a.id === id);
            if (!a) return;
            document.getElementById('announceFormTitle').textContent = 'Редактировать';
            document.getElementById('announceFormId').value = id;
            document.getElementById('announceFormText').value = a.text;
            document.getElementById('announceFormDate').value = a.date||'';
            document.getElementById('adminAnnounceForm').style.display = 'block';
        }
    });
}
function renderAnnounceTable() {
    if (!data.announcements.length) return '<p>Нет объявлений</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Текст</th><th>Дата</th><th>Действия</th></tr></thead><tbody>`;
    data.announcements.forEach(a => {
        table += `<tr><td>${escapeHtml(a.text)}</td><td>${escapeHtml(a.date||'')}</td>
            <td><button class="btn btn-sm admin-announce-edit" data-id="${a.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-announce-delete" data-id="${a.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

function renderAdminSundaySchools(container) {
    let html = `<h3>Управление воскресными школами</h3>
        <button id="adminSSAddBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить школу</button>
        <div id="adminSSList">${renderSSTable()}</div>
        <div id="adminSSForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="ssFormTitle">Добавить школу</h4>
            <input type="hidden" id="ssFormId">
            <div class="form-group"><label>Название</label><input type="text" id="ssFormName" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Тип (ВРШ, ВРГ, ГРПВ)</label><input type="text" id="ssFormType" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Описание</label><textarea id="ssFormDesc" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Храм (ID)</label><input type="number" id="ssFormTemple" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Фото (имя файла)</label><input type="text" id="ssFormPhoto" style="width:100%; padding:0.4rem;"></div>
            <button id="ssFormSaveBtn" class="btn">Сохранить</button>
            <button id="ssFormCancelBtn" class="btn btn-sm">Отмена</button>
        </div>
        <div style="margin-top: 2rem; border-top: 2px solid var(--border); padding-top: 1.5rem;">
            <h4>👨‍🏫 Преподаватели и сотрудники</h4>
            <button id="adminTeacherAddBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить преподавателя</button>
            <div id="adminTeacherList">${renderTeacherTable()}</div>
            <div id="adminTeacherForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
                <h4 id="teacherFormTitle">Добавить преподавателя</h4>
                <input type="hidden" id="teacherFormId">
                <div class="form-group"><label>Имя</label><input type="text" id="teacherFormName" style="width:100%; padding:0.4rem;"></div>
                <div class="form-group"><label>Роль (директор, преподаватель, воспитатель)</label><input type="text" id="teacherFormRole" style="width:100%; padding:0.4rem;" placeholder="Директор, преподаватель..."></div>
                <div class="form-group"><label>Описание</label><textarea id="teacherFormDesc" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
                <div class="form-group"><label>Фото (имя файла)</label><input type="text" id="teacherFormPhoto" style="width:100%; padding:0.4rem;"></div>
                <div class="form-group"><label>Воскресная школа (ID)</label><input type="number" id="teacherFormSchool" style="width:100%; padding:0.4rem;"></div>
                <button id="teacherFormSaveBtn" class="btn">Сохранить</button>
                <button id="teacherFormCancelBtn" class="btn btn-sm">Отмена</button>
            </div>
        </div>`;
    container.innerHTML = html;

    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminSSAddBtn') {
            document.getElementById('ssFormTitle').textContent = 'Добавить школу';
            document.getElementById('ssFormId').value = '';
            ['Name','Type','Desc','Temple','Photo'].forEach(f => document.getElementById('ssForm'+f).value = '');
            document.getElementById('adminSSForm').style.display = 'block';
        }
        if (target.id === 'ssFormCancelBtn') document.getElementById('adminSSForm').style.display = 'none';
        if (target.id === 'ssFormSaveBtn') {
            const id = document.getElementById('ssFormId').value;
            const ss = {
                name: document.getElementById('ssFormName').value.trim(),
                type: document.getElementById('ssFormType').value.trim(),
                description: document.getElementById('ssFormDesc').value.trim(),
                templeId: parseInt(document.getElementById('ssFormTemple').value) || 0,
                photo: document.getElementById('ssFormPhoto').value.trim() || 'placeholder.jpg'
            };
            if (!ss.name) { alert('Название обязательно'); return; }
            if (id) {
                const exist = data.sundaySchools.find(s => s.id == id);
                if (exist) Object.assign(exist, ss);
            } else {
                ss.id = nextId.sundaySchool++;
                data.sundaySchools.push(ss);
            }
            saveData();
            document.getElementById('adminSSForm').style.display = 'none';
            renderAdminSundaySchools(container);
        }
        if (target.classList.contains('admin-ss-delete')) {
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить школу?')) return;
            data.sundaySchools = data.sundaySchools.filter(s => s.id !== id);
            saveData();
            renderAdminSundaySchools(container);
        }
        if (target.classList.contains('admin-ss-edit')) {
            const id = parseInt(target.dataset.id);
            const s = data.sundaySchools.find(s => s.id === id);
            if (!s) return;
            document.getElementById('ssFormTitle').textContent = 'Редактировать школу';
            document.getElementById('ssFormId').value = id;
            document.getElementById('ssFormName').value = s.name;
            document.getElementById('ssFormType').value = s.type||'';
            document.getElementById('ssFormDesc').value = s.description||'';
            document.getElementById('ssFormTemple').value = s.templeId||'';
            document.getElementById('ssFormPhoto').value = s.photo||'';
            document.getElementById('adminSSForm').style.display = 'block';
        }

        if (target.id === 'adminTeacherAddBtn') {
            document.getElementById('teacherFormTitle').textContent = 'Добавить преподавателя';
            document.getElementById('teacherFormId').value = '';
            ['Name','Role','Desc','Photo','School'].forEach(f => document.getElementById('teacherForm'+f).value = '');
            document.getElementById('adminTeacherForm').style.display = 'block';
        }
        if (target.id === 'teacherFormCancelBtn') document.getElementById('adminTeacherForm').style.display = 'none';
        if (target.id === 'teacherFormSaveBtn') {
            const id = document.getElementById('teacherFormId').value;
            const teacher = {
                name: document.getElementById('teacherFormName').value.trim(),
                role: document.getElementById('teacherFormRole').value.trim(),
                description: document.getElementById('teacherFormDesc').value.trim(),
                photo: document.getElementById('teacherFormPhoto').value.trim() || 'placeholder.jpg',
                schoolId: parseInt(document.getElementById('teacherFormSchool').value) || 0
            };
            if (!teacher.name) { alert('Имя обязательно'); return; }
            if (id) {
                const exist = data.teachers.find(t => t.id == id);
                if (exist) Object.assign(exist, teacher);
            } else {
                teacher.id = nextId.teacher++;
                data.teachers.push(teacher);
            }
            saveData();
            document.getElementById('adminTeacherForm').style.display = 'none';
            renderAdminSundaySchools(container);
        }
        if (target.classList.contains('admin-teacher-delete')) {
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить преподавателя?')) return;
            data.teachers = data.teachers.filter(t => t.id !== id);
            saveData();
            renderAdminSundaySchools(container);
        }
        if (target.classList.contains('admin-teacher-edit')) {
            const id = parseInt(target.dataset.id);
            const t = data.teachers.find(t => t.id === id);
            if (!t) return;
            document.getElementById('teacherFormTitle').textContent = 'Редактировать преподавателя';
            document.getElementById('teacherFormId').value = id;
            document.getElementById('teacherFormName').value = t.name;
            document.getElementById('teacherFormRole').value = t.role||'';
            document.getElementById('teacherFormDesc').value = t.description||'';
            document.getElementById('teacherFormPhoto').value = t.photo||'';
            document.getElementById('teacherFormSchool').value = t.schoolId||'';
            document.getElementById('adminTeacherForm').style.display = 'block';
        }
    });
}
function renderSSTable() {
    if (!data.sundaySchools.length) return '<p>Нет воскресных школ</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Тип</th><th>Храм</th><th>Действия</th></tr></thead><tbody>`;
    data.sundaySchools.forEach(s => {
        const templeName = getTempleName(s.templeId);
        table += `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.type)}</td><td>${escapeHtml(templeName)}</td>
            <td><button class="btn btn-sm admin-ss-edit" data-id="${s.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-ss-delete" data-id="${s.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}
function renderTeacherTable() {
    if (!data.teachers.length) return '<p>Нет преподавателей</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Имя</th><th>Роль</th><th>Школа</th><th>Действия</th></tr></thead><tbody>`;
    data.teachers.forEach(t => {
        const school = data.sundaySchools.find(s => s.id === t.schoolId);
        const schoolName = school ? school.name : 'Без привязки';
        table += `<tr><td>${escapeHtml(t.name)}</td><td>${escapeHtml(t.role)}</td><td>${escapeHtml(schoolName)}</td>
            <td><button class="btn btn-sm admin-teacher-edit" data-id="${t.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-teacher-delete" data-id="${t.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

function renderAdminAbout(container) {
    let html = `<h3>Редактирование страницы "О благочинии"</h3>
        <div class="form-group"><label>Текст (поддерживается перенос строк)</label>
        <textarea id="adminAboutText" rows="10" style="width:100%; padding:0.6rem; border-radius:16px;">${escapeHtml(data.aboutText)}</textarea></div>
        <button id="adminAboutSaveBtn" class="btn">Сохранить</button>
        <div id="aboutMessage"></div>`;
    container.innerHTML = html;
    document.getElementById('adminAboutSaveBtn').addEventListener('click', function() {
        const newText = document.getElementById('adminAboutText').value;
        data.aboutText = newText;
        saveData();
        document.getElementById('aboutMessage').innerHTML = '<p style="color:green;">✅ Сохранено</p>';
    });
}

function renderAdminWorship(container) {
    let html = `<h3>Управление богослужениями</h3>
        <div class="card"><h4>Молитвослов</h4>
            <button id="adminWorshipPrayerAdd" class="btn btn-sm">➕ Добавить молитву</button>
            <div id="adminPrayerList">${renderPrayersTable()}</div>
        </div>
        <div class="card"><h4>Толкования</h4>
            <button id="adminWorshipInterpretAdd" class="btn btn-sm">➕ Добавить толкование</button>
            <div id="adminInterpretList">${renderInterpretationsTable()}</div>
        </div>
        <div class="card"><h4>Подготовка к таинствам</h4>
            <button id="adminWorshipSacramentAdd" class="btn btn-sm">➕ Добавить</button>
            <div id="adminSacramentList">${renderSacramentsTable()}</div>
        </div>
        <div id="adminWorshipForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="worshipFormTitle">Добавить</h4>
            <input type="hidden" id="worshipFormType">
            <input type="hidden" id="worshipFormId">
            <div class="form-group"><label>Заголовок</label><input type="text" id="worshipFormTitleInput" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Текст</label><textarea id="worshipFormText" rows="4" style="width:100%; padding:0.4rem;"></textarea></div>
            <button id="worshipFormSaveBtn" class="btn">Сохранить</button>
            <button id="worshipFormCancelBtn" class="btn btn-sm">Отмена</button>
        </div>`;
    container.innerHTML = html;
    let currentType = '';
    function openForm(type, item) {
        currentType = type;
        document.getElementById('worshipFormType').value = type;
        const title = type === 'prayer' ? 'Молитву' : type === 'interpret' ? 'Толкование' : 'Подготовку';
        document.getElementById('worshipFormTitle').textContent = item ? `Редактировать ${title}` : `Добавить ${title}`;
        document.getElementById('worshipFormId').value = item ? item.id : '';
        document.getElementById('worshipFormTitleInput').value = item ? item.title : '';
        document.getElementById('worshipFormText').value = item ? item.text : '';
        document.getElementById('adminWorshipForm').style.display = 'block';
    }
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminWorshipPrayerAdd') openForm('prayer', null);
        if (target.id === 'adminWorshipInterpretAdd') openForm('interpret', null);
        if (target.id === 'adminWorshipSacramentAdd') openForm('sacrament', null);
        if (target.id === 'worshipFormCancelBtn') document.getElementById('adminWorshipForm').style.display = 'none';
        if (target.id === 'worshipFormSaveBtn') {
            const type = document.getElementById('worshipFormType').value;
            const id = document.getElementById('worshipFormId').value;
            const title = document.getElementById('worshipFormTitleInput').value.trim();
            const text = document.getElementById('worshipFormText').value.trim();
            if (!title) { alert('Заголовок обязателен'); return; }
            const item = { title, text };
            let targetArray;
            if (type === 'prayer') targetArray = data.worship.prayers;
            else if (type === 'interpret') targetArray = data.worship.interpretations;
            else if (type === 'sacrament') targetArray = data.worship.sacraments;
            else return;
            if (id) {
                const exist = targetArray.find(i => i.id == id);
                if (exist) Object.assign(exist, item);
            } else {
                item.id = Date.now() + Math.random()*1000;
                targetArray.push(item);
            }
            saveData();
            document.getElementById('adminWorshipForm').style.display = 'none';
            renderAdminWorship(container);
        }
        if (target.classList.contains('admin-worship-delete')) {
            const type = target.dataset.type;
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить?')) return;
            let targetArray;
            if (type === 'prayer') targetArray = data.worship.prayers;
            else if (type === 'interpret') targetArray = data.worship.interpretations;
            else if (type === 'sacrament') targetArray = data.worship.sacraments;
            else return;
            data.worship[type === 'prayer' ? 'prayers' : type === 'interpret' ? 'interpretations' : 'sacraments'] = targetArray.filter(i => i.id !== id);
            saveData();
            renderAdminWorship(container);
        }
        if (target.classList.contains('admin-worship-edit')) {
            const type = target.dataset.type;
            const id = parseInt(target.dataset.id);
            let targetArray;
            if (type === 'prayer') targetArray = data.worship.prayers;
            else if (type === 'interpret') targetArray = data.worship.interpretations;
            else if (type === 'sacrament') targetArray = data.worship.sacraments;
            else return;
            const item = targetArray.find(i => i.id === id);
            if (item) openForm(type, item);
        }
    });
}
function renderPrayersTable() {
    const prayers = data.worship.prayers || [];
    if (!prayers.length) return '<p>Молитв нет</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Заголовок</th><th>Действия</th></tr></thead><tbody>`;
    prayers.forEach(p => {
        table += `<tr><td>${escapeHtml(p.title)}</td>
            <td><button class="btn btn-sm admin-worship-edit" data-type="prayer" data-id="${p.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-worship-delete" data-type="prayer" data-id="${p.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}
function renderInterpretationsTable() {
    const items = data.worship.interpretations || [];
    if (!items.length) return '<p>Толкований нет</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Заголовок</th><th>Действия</th></tr></thead><tbody>`;
    items.forEach(i => {
        table += `<tr><td>${escapeHtml(i.title)}</td>
            <td><button class="btn btn-sm admin-worship-edit" data-type="interpret" data-id="${i.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-worship-delete" data-type="interpret" data-id="${i.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}
function renderSacramentsTable() {
    const items = data.worship.sacraments || [];
    if (!items.length) return '<p>Материалов нет</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Заголовок</th><th>Действия</th></tr></thead><tbody>`;
    items.forEach(i => {
        table += `<tr><td>${escapeHtml(i.title)}</td>
            <td><button class="btn btn-sm admin-worship-edit" data-type="sacrament" data-id="${i.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-worship-delete" data-type="sacrament" data-id="${i.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

function renderAdminUsers(container) {
    let html = `<h3>${t('admin-users')}</h3>
        <button id="adminAddUserBtn" class="btn" style="margin-bottom:1rem;">➕ ${t('add-user')}</button>
        <div id="adminUserList">${renderUserTable()}</div>
        <div id="adminUserForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="userFormTitle">${t('add-user')}</h4>
            <div class="form-group"><label>${t('username')}</label><input type="text" id="userFormUsername" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>${t('password')}</label><input type="password" id="userFormPassword" style="width:100%; padding:0.4rem;" placeholder="${t('password')}"></div>
            <div class="form-group"><label>${t('role')}</label><select id="userFormRole" style="width:100%; padding:0.4rem;"><option value="developer">${t('role-developer')}</option><option value="senior">${t('role-senior')}</option><option value="junior">${t('role-junior')}</option><option value="editor">${t('role-editor')}</option></select></div>
            <div class="form-group"><label>${t('permissions')}</label><div id="userFormPermissions" style="display:flex; flex-wrap:wrap; gap:0.5rem;">${allPermissions.map(p => `<label style="display:flex; align-items:center; gap:0.3rem; cursor:pointer;"><input type="checkbox" value="${p}" class="perm-checkbox"> ${t(p)}</label>`).join('')}</div><small style="display:block; margin-top:0.3rem; color:#999;">Если выбрана роль, права будут автоматически заполнены. Можно изменить вручную.</small></div>
            <input type="hidden" id="userFormEditId" value="">
            <button id="userFormSaveBtn" class="btn">${t('save')}</button>
            <button id="userFormCancelBtn" class="btn btn-sm">${t('cancel')}</button>
        </div>`;
    container.innerHTML = html;
    document.getElementById('userFormRole').addEventListener('change', function() {
        const role = this.value;
        const perms = rolePermissions[role] || [];
        document.querySelectorAll('.perm-checkbox').forEach(cb => cb.checked = perms.includes(cb.value) || perms.includes('all'));
    });
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminAddUserBtn') {
            const form = document.getElementById('adminUserForm');
            if (!form) return;
            document.getElementById('userFormTitle').textContent = t('add-user');
            document.getElementById('userFormUsername').value = '';
            document.getElementById('userFormPassword').value = '';
            document.getElementById('userFormRole').value = 'junior';
            document.getElementById('userFormEditId').value = '';
            const perms = rolePermissions['junior'] || [];
            document.querySelectorAll('.perm-checkbox').forEach(cb => cb.checked = perms.includes(cb.value) || perms.includes('all'));
            form.style.display = 'block';
        }
        if (target.id === 'userFormCancelBtn') document.getElementById('adminUserForm').style.display = 'none';
        if (target.id === 'userFormSaveBtn') {
            const editId = document.getElementById('userFormEditId').value;
            const username = document.getElementById('userFormUsername').value.trim();
            const password = document.getElementById('userFormPassword').value.trim();
            const role = document.getElementById('userFormRole').value;
            const checkedPerms = [];
            document.querySelectorAll('.perm-checkbox:checked').forEach(cb => checkedPerms.push(cb.value));
            if (!checkedPerms.length) { alert('Выберите хотя бы одно право'); return; }
            if (!username) { alert('Введите логин'); return; }
            if (data.users.find(u => u.username === username && u.id != editId)) { alert('Пользователь с таким логином уже существует'); return; }
            if (editId) {
                const u = data.users.find(u => u.id == editId);
                if (u) { u.username = username; if (password) u.password = password; u.role = role; u.permissions = checkedPerms; }
            } else {
                if (!password) { alert('Введите пароль'); return; }
                data.users.push({ id: nextId.user++, username, password, role, permissions: checkedPerms });
            }
            saveData();
            document.getElementById('adminUserForm').style.display = 'none';
            renderAdminUsers(container);
        }
        if (target.classList.contains('admin-delete-user')) {
            const id = parseInt(target.dataset.id);
            const u = data.users.find(u => u.id === id);
            if (!u) return;
            if (u.id === currentUser.id) { alert('Нельзя удалить себя'); return; }
            if (!confirm(t('confirm-delete'))) return;
            data.users = data.users.filter(u => u.id !== id);
            saveData();
            renderAdminUsers(container);
        }
        if (target.classList.contains('admin-edit-user')) {
            const id = parseInt(target.dataset.id);
            const u = data.users.find(u => u.id === id);
            if (!u) return;
            const form = document.getElementById('adminUserForm');
            if (!form) return;
            document.getElementById('userFormTitle').textContent = t('edit-user');
            document.getElementById('userFormUsername').value = u.username;
            document.getElementById('userFormPassword').value = '';
            document.getElementById('userFormRole').value = u.role;
            document.getElementById('userFormEditId').value = u.id;
            const perms = u.permissions || [];
            document.querySelectorAll('.perm-checkbox').forEach(cb => cb.checked = perms.includes(cb.value) || perms.includes('all'));
            form.style.display = 'block';
        }
    });
}
function renderUserTable() {
    if (!data.users.length) return `<p>${t('no-users')}</p>`;
    let table = `<table class="schedule-table"><thead><tr><th>${t('username')}</th><th>${t('role')}</th><th>${t('permissions')}</th><th>${t('edit')}</th><th>${t('delete')}</th></tr></thead><tbody>`;
    data.users.forEach(u => {
        const roleLabel = t('role-'+u.role) || u.role;
        const permLabels = (u.permissions||[]).map(p => t(p)||p).join(', ');
        const isSelf = u.id === currentUser?.id;
        table += `<tr><td>${escapeHtml(u.username)} ${isSelf ? '👤' : ''}</td><td>${escapeHtml(roleLabel)}</td><td style="font-size:0.85rem;">${escapeHtml(permLabels)}</td><td><button class="btn btn-sm admin-edit-user" data-id="${u.id}">✏️</button></td><td><button class="btn btn-sm btn-danger admin-delete-user" data-id="${u.id}" ${isSelf ? 'disabled' : ''}>🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

function renderAdminOpechenie(container) {
    let html = `<h3>Управление окормлением</h3>
        <button id="adminOpechenieAddBtn" class="btn" style="margin-bottom:1rem;">➕ Добавить объект</button>
        <div id="adminOpechenieList">${renderOpechenieTable()}</div>
        <div id="adminOpechenieForm" style="display:none; margin-top:1rem; background:var(--bg); padding:1rem; border-radius:16px;">
            <h4 id="opechenieFormTitle">Добавить объект</h4>
            <input type="hidden" id="opechenieFormId">
            <div class="form-group"><label>Название</label><input type="text" id="opechenieFormName" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Ответственный</label><input type="text" id="opechenieFormResponsible" style="width:100%; padding:0.4rem;"></div>
            <div class="form-group"><label>Описание</label><textarea id="opechenieFormDesc" rows="2" style="width:100%; padding:0.4rem;"></textarea></div>
            <div class="form-group"><label>Храм (ID)</label><input type="number" id="opechenieFormTemple" style="width:100%; padding:0.4rem;"></div>
            <button id="opechenieFormSaveBtn" class="btn">Сохранить</button>
            <button id="opechenieFormCancelBtn" class="btn btn-sm">Отмена</button>
        </div>`;
    container.innerHTML = html;
    container.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id === 'adminOpechenieAddBtn') {
            document.getElementById('opechenieFormTitle').textContent = 'Добавить объект';
            document.getElementById('opechenieFormId').value = '';
            ['Name','Responsible','Desc','Temple'].forEach(f => document.getElementById('opechenieForm'+f).value = '');
            document.getElementById('adminOpechenieForm').style.display = 'block';
        }
        if (target.id === 'opechenieFormCancelBtn') document.getElementById('adminOpechenieForm').style.display = 'none';
        if (target.id === 'opechenieFormSaveBtn') {
            const id = document.getElementById('opechenieFormId').value;
            const item = {
                name: document.getElementById('opechenieFormName').value.trim(),
                responsible: document.getElementById('opechenieFormResponsible').value.trim(),
                description: document.getElementById('opechenieFormDesc').value.trim(),
                templeId: parseInt(document.getElementById('opechenieFormTemple').value) || 0
            };
            if (!item.name) { alert('Название обязательно'); return; }
            if (id) {
                const exist = data.opechenie.find(o => o.id == id);
                if (exist) Object.assign(exist, item);
            } else {
                item.id = nextId.opechenie++;
                data.opechenie.push(item);
            }
            saveData();
            document.getElementById('adminOpechenieForm').style.display = 'none';
            renderAdminOpechenie(container);
        }
        if (target.classList.contains('admin-opechenie-delete')) {
            const id = parseInt(target.dataset.id);
            if (!confirm('Удалить?')) return;
            data.opechenie = data.opechenie.filter(o => o.id !== id);
            saveData();
            renderAdminOpechenie(container);
        }
        if (target.classList.contains('admin-opechenie-edit')) {
            const id = parseInt(target.dataset.id);
            const o = data.opechenie.find(o => o.id === id);
            if (!o) return;
            document.getElementById('opechenieFormTitle').textContent = 'Редактировать';
            document.getElementById('opechenieFormId').value = id;
            document.getElementById('opechenieFormName').value = o.name;
            document.getElementById('opechenieFormResponsible').value = o.responsible||'';
            document.getElementById('opechenieFormDesc').value = o.description||'';
            document.getElementById('opechenieFormTemple').value = o.templeId||'';
            document.getElementById('adminOpechenieForm').style.display = 'block';
        }
    });
}
function renderOpechenieTable() {
    if (!data.opechenie.length) return '<p>Нет данных</p>';
    let table = `<table class="schedule-table"><thead><tr><th>Название</th><th>Ответственный</th><th>Храм</th><th>Действия</th></tr></thead><tbody>`;
    data.opechenie.forEach(o => {
        const templeName = getTempleName(o.templeId);
        table += `<tr><td>${escapeHtml(o.name)}</td><td>${escapeHtml(o.responsible)}</td><td>${escapeHtml(templeName)}</td>
            <td><button class="btn btn-sm admin-opechenie-edit" data-id="${o.id}">✏️</button>
            <button class="btn btn-sm btn-danger admin-opechenie-delete" data-id="${o.id}">🗑️</button></td></tr>`;
    });
    table += `</tbody></table>`;
    return table;
}

// ========== ПРИМЕНЕНИЕ ПЕРЕВОДОВ ==========
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
window.askAI = askAI;
window.adminAskAI = adminAskAI;
