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
            name: 'FIFA 2025',
            description: 'أحدث إصدار من لعبة كرة القدم الشهيرة مع تحديثات جديدة وفرق عالمية',
            price: 59.99,
            category: 'رياضة',
            imageUrl: 'images/fifa2025.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Call of Duty: Modern Warfare',
            description: 'لعبة أكشن من منظور الشخص الأول مع قصة مشوقة وأسلحة متطورة',
            price: 69.99,
            category: 'أكشن',
            imageUrl: 'images/cod.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Minecraft',
            description: 'عالم مفتوح للبناء والاستكشاف مع إمكانيات لا حدود لها',
            price: 29.99,
            category: 'مغامرات',
            imageUrl: 'images/minecraft.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Age of Empires IV',
            description: 'لعبة استراتيجية تاريخية تتيح لك بناء حضارتك وقيادة جيوشك للنصر',
            price: 49.99,
            category: 'استراتيجية',
            imageUrl: 'images/aoe.jpg',
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
