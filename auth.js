/**
 * Gezi Rehberim Uygulaması - Kimlik Doğrulama İşlemleri
 */

// API'nin base URL'i
const baseUrl = 'http://localhost:5123';

// Token kontrolü
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Token yoksa giriş sayfasına yönlendir
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Kullanıcı giriş yapmış mı kontrolü
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
}

// Oturum kapatma
function logout() {
    localStorage.removeItem('token');
    
    // Header.js içinde tanımlanan setupUserMenu fonksiyonunu çağırmaya çalış
    try {
        // Sayfayı yenile - bu şekilde header güncellenecektir
        window.location.reload();
    } catch (e) {
        console.error("Oturum kapatılırken bir hata oluştu:", e);
    }
}

// API istekleri için yardımcı fonksiyon
async function apiRequest(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, options);
        
        // Token süresi dolmuşsa
        if (response.status === 401) {
            logout();
            return null;
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Bir hata oluştu');
        }
        
        // Boş cevap kontrolü (DELETE işlemleri için)
        if (response.status === 204) {
            return { success: true };
        }
        
        return await response.json();
    } catch (error) {
        console.error('API isteği hatası:', error);
        throw error;
    }
}

// Kullanıcı bilgilerini getir
async function getUserInfo() {
    if (!isAuthenticated()) return null;
    
    try {
        return await apiRequest('/api/Auth/userinfo');
    } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
        return null;
    }
}

// Kimlik doğrulama gerektirmeyen sayfalar
const publicPages = ['index.html', 'login.html', 'register.html', 'nereyeGitmeliyim.html', 'about.html', 'contact.html', ''];

// Sayfalar arası geçişte kimlik doğrulama kontrolü
document.addEventListener('DOMContentLoaded', function() {
    // Sayfanın dosya adını al (boşsa index sayfasındayız demektir)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Giriş ve kayıt sayfalarında oturum açıksa ana sayfaya yönlendir
    if ((currentPage === 'login.html' || currentPage === 'register.html') && isAuthenticated()) {
        window.location.href = 'profile.html';
        return;
    }
    
    // Kimlik doğrulama gerektiren sayfalarda kontrol
    if (!publicPages.includes(currentPage)) {
        checkAuth();
    }
    
    // Çıkış butonu varsa event listenerı ekle
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}); 