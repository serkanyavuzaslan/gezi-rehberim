// Header componenti
document.addEventListener('DOMContentLoaded', function() {
    // Header HTML'ini oluştur ve giriş durumuna göre dinamik olarak oluştur
    const isLoggedIn = isAuthenticated();
    
    const headerHTML = `
    <div class="logo">
        <h2>gezi rehberim.</h2>
    </div>
    <div class="links">
        <ul>
            <li><a href="index.html" id="nav-home">Anasayfa</a></li>
            <li><a href="about.html" id="nav-about">Hakkımızda</a></li>
            <li><a href="contact.html" id="nav-contact">İletişim</a></li>
            ${isLoggedIn ? '<li id="profile-link"><a href="profile.html">Profilim</a></li>' : ''}
            <li id="mood-test-link"><a href="nereyeGitmeliyim.html">Nereye Gitmeliyim?</a></li>
            ${!isLoggedIn ? `
            <li class="auth-nav-item login"><a href="login.html" class="auth-btn login-btn">Giriş Yap</a></li>
            <li class="auth-nav-item register"><a href="register.html" class="auth-btn register-btn">Kayıt Ol</a></li>
            ` : ''}
        </ul>
    </div>
    <div class="right-nav">
        ${isLoggedIn ? `
        <div class="user-menu" id="user-menu">
            <span class="user-name" id="header-user-name"></span>
            <div class="user-avatar user-icon"><i class="fa-solid fa-user"></i></div>
            <div class="user-dropdown" id="user-dropdown">
                <a href="profile.html">Profilim</a>
                <a href="#" id="logout-link" class="logout">Çıkış Yap</a>
            </div>
        </div>
        ` : ``}
    </div>
    <i class="fa-solid fa-bars"></i>
    `;
    
    // Header elementini bul ve içeriğini değiştir
    const headerElement = document.querySelector('header.header');
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
    }
    
    // Header CSS'ini ekle
    const headerCSS = `
    <style>
        :root {
            --primary-color: #e65100;
            --hover-color: #ff7d26;
            --bg-light: #fff5eb;
            --text-color: #333;
            --border-radius: 12px;
            --box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s ease;
        }
        
        /* Header Stil */
        .header {
            padding: 1rem 5%;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
            background-color: white;
            position: sticky;
            top: 0;
            z-index: 1010;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo h2 {
            color: var(--primary-color);
            margin: 0;
            font-weight: 700;
        }

        .links ul {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 2rem;
            align-items: center;
        }

        .links a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 500;
            transition: var(--transition);
            position: relative;
            padding-bottom: 5px;
        }

        .links a:hover {
            color: var(--primary-color);
        }

        .links a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--primary-color);
            transition: width 0.3s ease;
        }

        .links a:hover::after,
        .links a.active::after {
            width: 100%;
        }

        .links a.active {
            color: var(--primary-color);
            font-weight: 600;
        }

        .right-nav {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        /* Giriş/Kayıt butonları stil */
        .auth-nav-item a {
            font-weight: 600;
        }
        
        .auth-nav-item.login a {
            color: var(--primary-color);
        }
        
        .auth-nav-item.register a {
            color: white;
            background-color: var(--primary-color);
            border-radius: var(--border-radius);
            padding: 8px 16px !important;
            display: inline-block;
            margin-top: -2px;
            line-height: 1.2;
        }
        
        .auth-nav-item.register a:hover {
            background-color: var(--hover-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(230, 81, 0, 0.2);
        }

        /* Kullanıcı menüsü stil */
        .user-menu {
            position: relative;
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 20px;
            transition: var(--transition);
        }

        .user-menu:hover {
            background-color: var(--bg-light);
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }

        .user-dropdown {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background-color: white;
            min-width: 180px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            border-radius: var(--border-radius);
            overflow: hidden;
            animation: fadeIn 0.3s ease;
            margin-top: 10px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .user-dropdown a {
            color: var(--text-color);
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            font-size: 14px;
            transition: var(--transition);
        }

        .user-dropdown a:hover {
            background-color: var(--bg-light);
            padding-left: 20px;
        }

        .user-dropdown a.logout {
            color: #e74c3c;
            border-top: 1px solid #eee;
        }

        .user-dropdown.show {
            display: block;
        }

        .user-icon {
            cursor: pointer;
            font-size: 1.1rem;
        }

        .user-name {
            margin-right: 8px;
            color: var(--primary-color);
            font-weight: 600;
        }

        .fa-bars {
            display: none;
        }

        @media (max-width: 992px) {
            .fa-bars {
                display: block;
                cursor: pointer;
            }
            
            .links {
                display: none;
            }
        }
    </style>
    `;
    
    // CSS'i head'e ekle
    if (!document.getElementById('header-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'header-styles';
        styleElement.innerHTML = headerCSS;
        document.head.appendChild(styleElement);
    }
    
    // Aktif sayfayı belirle
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html') {
        document.getElementById('nav-home').classList.add('active');
    } else if (currentPage === 'profile.html') {
        const profileLink = document.getElementById('profile-link');
        if (profileLink) {
            profileLink.querySelector('a').classList.add('active');
        }
    } else if (currentPage === 'nereyeGitmeliyim.html') {
        document.querySelector('#mood-test-link a').classList.add('active');
    } else if (currentPage === 'about.html') {
        document.getElementById('nav-about').classList.add('active');
    } else if (currentPage === 'contact.html') {
        document.getElementById('nav-contact').classList.add('active');
    }
    
    // Kullanıcı menüsünü yalnızca giriş yapmış kullanıcılar için kur
    if (isLoggedIn) {
        setupUserMenu();
    }
    
    function setupUserMenu() {
        const userMenu = document.getElementById('user-menu');
        const userDropdown = document.getElementById('user-dropdown');
        const headerUserName = document.getElementById('header-user-name');
        const userIcon = document.querySelector('.user-icon');
        
        // Menüyü açıp kapatma
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdown.classList.toggle('show');
        });
        
        // Dışarı tıklandığında menüyü kapat
        window.addEventListener('click', function(event) {
            if (!userMenu.contains(event.target)) {
                if (userDropdown.classList.contains('show')) {
                    userDropdown.classList.remove('show');
                }
            }
        });
        
        // Kullanıcı bilgilerini güncelle
        updateUserInfo();
        
        async function updateUserInfo() {
            try {
                // API'den profil bilgilerini al
                const response = await fetch('http://localhost:5123/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    // Token geçersiz veya süresi dolmuş
                    if (response.status === 401) {
                        console.log('Oturum süresi dolmuş veya geçersiz token');
                        logout(); // Çıkış fonksiyonunu çağır
                        window.location.reload();
                        return;
                    }
                    throw new Error('Profil bilgileri alınamadı');
                }
                
                const userInfo = await response.json();
                
                if (userInfo) {
                    // Kullanıcı adını göster
                    headerUserName.textContent = userInfo.firstName;
                    
                    // Avatar için baş harfleri göster
                    const initials = `${userInfo.firstName.charAt(0)}${userInfo.lastName.charAt(0)}`;
                    userIcon.innerHTML = initials;
                    userIcon.style.fontFamily = "'Montserrat', sans-serif";
                    userIcon.style.backgroundColor = "var(--primary-color)";
                    userIcon.style.color = "white";
                    userIcon.style.borderRadius = "50%";
                    userIcon.style.width = "32px";
                    userIcon.style.height = "32px";
                    userIcon.style.display = "flex";
                    userIcon.style.alignItems = "center";
                    userIcon.style.justifyContent = "center";
                    userIcon.style.fontWeight = "bold";
                    userIcon.style.fontSize = "14px";
                }
            } catch (error) {
                console.error('Kullanıcı bilgileri yüklenirken hata:', error);
            }
        }
        
        // Dropdown'daki çıkış bağlantısı işlevi
        document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
            // Sayfayı yenile
            window.location.reload();
        });
    }
}); 