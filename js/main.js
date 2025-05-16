/**
 * main.js - الملف الرئيسي لموقع Matador
 * يحتوي على الوظائف المشتركة والتهيئة الأساسية
 */

document.addEventListener('DOMContentLoaded', function() {
    // تحديث قائمة التنقل بناءً على حالة تسجيل الدخول
    updateNavMenu();
    
    // عرض الألعاب المميزة في الصفحة الرئيسية
    if (document.getElementById('featured-games-container')) {
        displayFeaturedGames();
    }
});

// تحديث قائمة التنقل
function updateNavMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    
    const isLoggedIn = window.db.isLoggedIn();
    const currentUser = window.db.getCurrentUser();
    
    if (isLoggedIn) {
        // إزالة روابط تسجيل الدخول وإنشاء الحساب
        navMenu.innerHTML = `
            <li><a href="index.html">الرئيسية</a></li>
            <li><a href="store.html">المتجر</a></li>
            ${currentUser.isAdmin ? '<li><a href="admin.html">لوحة التحكم</a></li>' : ''}
            <li><a href="#" id="logout-btn">تسجيل الخروج</a></li>
        `;
        
        // إضافة مستمع حدث لزر تسجيل الخروج
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const result = window.db.logoutUser();
                if (result.success) {
                    alert(result.message);
                    window.location.href = 'index.html';
                }
            });
        }
    }
}

// عرض الألعاب المميزة في الصفحة الرئيسية
function displayFeaturedGames() {
    const featuredGamesContainer = document.getElementById('featured-games-container');
    const games = window.db.getAllGames();
    
    // اختيار 4 ألعاب عشوائية للعرض
    const featuredGames = games.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // إضافة الألعاب
    featuredGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.imageUrl}" alt="${game.name}">
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>${game.description.substring(0, 100)}${game.description.length > 100 ? '...' : ''}</p>
                <span class="price">${game.price} $</span>
                <a href="game-details.html?id=${game.id}" class="btn">عرض التفاصيل</a>
            </div>
        `;
        featuredGamesContainer.appendChild(gameCard);
    });
}
