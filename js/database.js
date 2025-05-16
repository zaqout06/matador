/**
 * database.js - ملف قاعدة البيانات لموقع Matador
 * يستخدم localStorage لتخزين بيانات المستخدمين والألعاب
 */

// تهيئة قاعدة البيانات إذا لم تكن موجودة
function initDatabase() {
    // تهيئة جدول المستخدمين
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    // تهيئة جدول الألعاب
    if (!localStorage.getItem('games')) {
        localStorage.setItem('games', JSON.stringify([]));
    }
    
    // تهيئة المستخدم المسؤول (صاحب المتجر) إذا لم يكن موجوداً
    const users = JSON.parse(localStorage.getItem('users'));
    const adminExists = users.some(user => user.isAdmin);
    
    if (!adminExists && users.length === 0) {
        // إنشاء حساب المسؤول الافتراضي
        const adminUser = {
            id: generateId(),
            name: 'مدير المتجر',
            email: 'admin@matador.com',
            phone: '+970597929091',
            password: hashPassword('admin123'),
            isAdmin: true,
            createdAt: new Date().toISOString()
        };
        
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // إضافة بعض الألعاب الافتراضية
        addSampleGames();
    }
}

// إضافة ألعاب نموذجية للعرض
function addSampleGames() {
    const sampleGames = [
        {
            id: generateId(),
            name: 'جستس',
            description: 'بحبه ',
            price: 99,
            category: 'رياضة',
            imageUrl: 'https://scontent.fjrs4-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=H2DqUOt9CTcQ7kNvwH9nIrx&_nc_oc=AdlFSf9pHqGzzHmK67DOOBDM4f9GBrZOxYq_HW6BUXhAZt10re1BJpoTNyRouJwL2s4&_nc_zt=24&_nc_ht=scontent.fjrs4-1.fna&oh=00_AfKPhxvS4pw0E7vKEqmiXgssUCnOy94rL9AaZ7nAg5asGg&oe=684EFABA',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'abubaker',
            description: 'بحبه ',
            price: 99,
            category: 'أكشن',
            imageUrl: 'https://scontent.fjrs4-1.fna.fbcdn.net/v/t39.30808-1/426613353_1079199510015366_421182586223000925_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=dGHJQNw1x_cQ7kNvwGSXkFe&_nc_oc=AdmdXL-WPS6GqbAZArx79Zu9KyvkfNqWP_2bNZXTCP7VOAnl2LqHzf-j7CSZjMAohcc&_nc_zt=24&_nc_ht=scontent.fjrs4-1.fna&_nc_gid=_nOHlTEds5amlMggApkoow&oh=00_AfIMjx98md6gc86MgpW_sEjK0Rfy0pMDZkrb66Fo29mIKQ&oe=682D5C86',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'زوقوت',
            description: 'بموووووووت فيه ',
            price: 99,
            category: 'مغامرات',
            imageUrl: 'https://scontent.fjrs4-1.fna.fbcdn.net/v/t39.30808-6/495611242_3095159737313503_768992776859744980_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=nasZ9HBhzPEQ7kNvwEyUigz&_nc_oc=Adlvy86pQgmhBKYiMfIEldHb2a9oEh_wgpNTwYv5PVbWs_8UzEVpKhLR5QQ7VKZP6f8&_nc_zt=23&_nc_ht=scontent.fjrs4-1.fna&_nc_gid=9BUUAfy3mQASnATCBKTbYQ&oh=00_AfKbZUfep6SmAwUoLZuMZ849UzcoP9bgz-Gso2wdiCufEw&oe=682D4884',
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('games', JSON.stringify(sampleGames));
}

// توليد معرف فريد
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// تشفير كلمة المرور (تبسيط - في الإنتاج يجب استخدام تقنيات تشفير أكثر أماناً)
function hashPassword(password) {
    // هذه طريقة مبسطة للتشفير - في الإنتاج يجب استخدام bcrypt أو تقنيات أخرى
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // تحويل إلى 32bit integer
    }
    return hash.toString(16);
}

// إضافة مستخدم جديد
function registerUser(name, email, phone, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    // التحقق من عدم وجود البريد الإلكتروني مسبقاً
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
    }
    
    // التحقق من عدم وجود رقم الهاتف مسبقاً
    const phoneExists = users.some(user => user.phone === phone);
    if (phoneExists) {
        return { success: false, message: 'رقم الهاتف مستخدم بالفعل' };
    }
    
    // إنشاء المستخدم الجديد
    const newUser = {
        id: generateId(),
        name,
        email,
        phone,
        password: hashPassword(password),
        isAdmin: false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'تم إنشاء الحساب بنجاح', userId: newUser.id };
}

// تسجيل الدخول
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const hashedPassword = hashPassword(password);
    
    const user = users.find(user => user.email === email && user.password === hashedPassword);
    
    if (user) {
        // تخزين معلومات المستخدم في الجلسة
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
        return { success: true, message: 'تم تسجيل الدخول بنجاح', user: sessionUser };
    } else {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
}

// تسجيل الخروج
function logoutUser() {
    sessionStorage.removeItem('currentUser');
    return { success: true, message: 'تم تسجيل الخروج بنجاح' };
}

// الحصول على المستخدم الحالي
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// التحقق من حالة تسجيل الدخول
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// التحقق من صلاحيات المسؤول
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.isAdmin;
}

// إضافة لعبة جديدة (للمسؤول فقط)
function addGame(name, description, price, category, imageUrl) {
    if (!isAdmin()) {
        return { success: false, message: 'غير مصرح لك بإضافة ألعاب' };
    }
    
    const games = JSON.parse(localStorage.getItem('games'));
    
    const newGame = {
        id: generateId(),
        name,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
        createdAt: new Date().toISOString()
    };
    
    games.push(newGame);
    localStorage.setItem('games', JSON.stringify(games));
    
    return { success: true, message: 'تمت إضافة اللعبة بنجاح', gameId: newGame.id };
}

// تعديل لعبة (للمسؤول فقط)
function updateGame(gameId, updates) {
    if (!isAdmin()) {
        return { success: false, message: 'غير مصرح لك بتعديل الألعاب' };
    }
    
    const games = JSON.parse(localStorage.getItem('games'));
    const gameIndex = games.findIndex(game => game.id === gameId);
    
    if (gameIndex === -1) {
        return { success: false, message: 'اللعبة غير موجودة' };
    }
    
    // تحديث بيانات اللعبة
    games[gameIndex] = { ...games[gameIndex], ...updates };
    
    localStorage.setItem('games', JSON.stringify(games));
    
    return { success: true, message: 'تم تحديث اللعبة بنجاح' };
}

// حذف لعبة (للمسؤول فقط)
function deleteGame(gameId) {
    if (!isAdmin()) {
        return { success: false, message: 'غير مصرح لك بحذف الألعاب' };
    }
    
    const games = JSON.parse(localStorage.getItem('games'));
    const updatedGames = games.filter(game => game.id !== gameId);
    
    if (games.length === updatedGames.length) {
        return { success: false, message: 'اللعبة غير موجودة' };
    }
    
    localStorage.setItem('games', JSON.stringify(updatedGames));
    
    return { success: true, message: 'تم حذف اللعبة بنجاح' };
}

// الحصول على جميع الألعاب
function getAllGames() {
    return JSON.parse(localStorage.getItem('games'));
}

// الحصول على لعبة بواسطة المعرف
function getGameById(gameId) {
    const games = JSON.parse(localStorage.getItem('games'));
    return games.find(game => game.id === gameId);
}

// البحث عن الألعاب
function searchGames(query, category = '') {
    const games = JSON.parse(localStorage.getItem('games'));
    
    return games.filter(game => {
        const matchesQuery = query ? 
            game.name.toLowerCase().includes(query.toLowerCase()) || 
            game.description.toLowerCase().includes(query.toLowerCase()) : 
            true;
            
        const matchesCategory = category ? game.category === category : true;
        
        return matchesQuery && matchesCategory;
    });
}

// تهيئة قاعدة البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initDatabase);

// تصدير الدوال للاستخدام في ملفات أخرى
window.db = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    isLoggedIn,
    isAdmin,
    addGame,
    updateGame,
    deleteGame,
    getAllGames,
    getGameById,
    searchGames
};
