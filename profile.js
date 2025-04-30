// Profil sayfası için JavaScript kodu
document.addEventListener('DOMContentLoaded', async function() {
    // Oturum kontrolü
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // DOM elementleri
    const userFullname = document.getElementById('user-fullname');
    const userUsername = document.getElementById('user-username');
    const userEmail = document.getElementById('user-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const loadingIndicator = document.getElementById('loading-indicator');
    const noVisitsMessage = document.getElementById('no-visits-message');
    const provincesList = document.getElementById('provinces-list');

    try {
        // Kullanıcı profil bilgilerini al
        const profileData = await fetchProfileData();
        
        // Profil bilgilerini göster
        displayProfileData(profileData);
    } catch (error) {
        console.error('Profil bilgileri alınamadı:', error);
        showError('Profil bilgileri alınamadı. Lütfen daha sonra tekrar deneyiniz.');
    }

    // Profil bilgilerini almak için API isteği
    async function fetchProfileData() {
        try {
            return await apiRequest('/api/user/profile');
        } catch (error) {
            throw error;
        }
    }

    // Profil bilgilerini görüntüle
    function displayProfileData(profileData) {
        // Yükleme göstergesini gizle
        loadingIndicator.style.display = 'none';
        
        // Kullanıcı bilgilerini göster
        userFullname.textContent = `${profileData.firstName} ${profileData.lastName}`;
        userUsername.textContent = `@${profileData.username}`;
        userEmail.textContent = profileData.email;
        
        // Avatar için baş harfleri al
        profileAvatar.textContent = getInitials(profileData.firstName, profileData.lastName);
        
        // Header kullanıcı adını da güncelle
        const headerUserName = document.getElementById('header-user-name');
        if (headerUserName) {
            headerUserName.textContent = profileData.firstName;
        }
        
        // API verilerini kontrol et
        console.log('Profil verisi:', profileData);
        if (profileData.visitedProvinces && profileData.visitedProvinces.length > 0) {
            console.log('İlk il örneği:', profileData.visitedProvinces[0]);
            if (profileData.visitedProvinces[0].placesVisited && profileData.visitedProvinces[0].placesVisited.length > 0) {
                console.log('İlk ziyaret edilen yer örneği:', profileData.visitedProvinces[0].placesVisited[0]);
            }
        }
        
        // Gezilen illeri göster
        displayVisitedProvinces(profileData.visitedProvinces);
    }
    
    // İsim ve soyisimin baş harflerini al
    function getInitials(firstName, lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    }
    
    // Ziyaret edilen illeri görüntüle
    function displayVisitedProvinces(visitedProvinces) {
        if (!visitedProvinces || visitedProvinces.length === 0) {
            // Hiç ziyaret edilmiş il yoksa mesaj göster
            noVisitsMessage.style.display = 'block';
            return;
        }
        
        // İller listesini göster
        provincesList.style.display = 'grid';
        provincesList.innerHTML = ''; // Önceki içeriği temizle
        
        // İlleri alfabetik olarak sırala
        const sortedProvinces = [...visitedProvinces].sort((a, b) => 
            a.provinceName.localeCompare(b.provinceName, 'tr')
        );
        
        // Her il için bir kart oluştur
        sortedProvinces.forEach(province => {
            const provinceCard = document.createElement('div');
            provinceCard.className = 'province-card';
            
            const provinceHeader = document.createElement('div');
            provinceHeader.className = 'province-header';
            provinceHeader.innerHTML = `
                <h3 class="province-name">${province.provinceName}</h3>
                <span class="province-count">${province.placesVisited.length} yer</span>
            `;
            
            const provinceBody = document.createElement('div');
            provinceBody.className = 'province-body';
            
            if (province.placesVisited.length === 0) {
                provinceBody.innerHTML = '<p class="empty-state">Bu ilde henüz ziyaret edilen yer bulunmuyor.</p>';
            } else {
                // Ziyaret edilen yerleri listele
                province.placesVisited.forEach(place => {
                    // ID değerlerini kontrol et
                    console.log(`İl ${province.provinceName} için ID değerleri:`, {
                        il_id: province.provinceId || province.id,
                        yer_id: place.id || place.placeVisitedId
                    });
                    
                    const placeItem = document.createElement('div');
                    placeItem.className = 'place-item';
                    placeItem.innerHTML = `
                        <div class="place-content">
                            <h4 class="place-name">${place.name}</h4>
                            <p class="place-description">${place.description || 'Açıklama yok'}</p>
                        </div>
                        <button class="delete-place-btn" data-province-id="${province.provinceId || province.id}" data-place-id="${place.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    provinceBody.appendChild(placeItem);
                });
            }
            
            provinceCard.appendChild(provinceHeader);
            provinceCard.appendChild(provinceBody);
            provincesList.appendChild(provinceCard);
        });

        // Silme butonlarına event listener ekle
        document.querySelectorAll('.delete-place-btn').forEach(button => {
            button.addEventListener('click', handlePlaceDelete);
        });
    }

    // Ziyaret edilen yeri silme işlemi
    async function handlePlaceDelete(event) {
        const button = event.currentTarget;
        const provinceId = button.getAttribute('data-province-id');
        const placeId = button.getAttribute('data-place-id');
        const placeItem = button.closest('.place-item');
        const placeName = placeItem.querySelector('.place-name').textContent;

        console.log('Silme işlemi için ID değerleri:', {provinceId, placeId});
        
        if (!placeId || placeId === 'undefined') {
            showNotification('Hata', 'Geçersiz yer kimliği. Sayfayı yenileyip tekrar deneyin.', 'error');
            return;
        }

        if (confirm(`"${placeName}" adlı yeri silmek istediğinize emin misiniz?`)) {
            try {
                // Silme işlemi için loading göster
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;

                // DELETE isteği gönder
                await apiRequest(`/api/Province/${provinceId}/PlaceVisited/${placeId}`, 'DELETE');
                
                // UI'dan öğeyi kaldır
                const provinceCard = placeItem.closest('.province-card');
                placeItem.remove();
                
                // İldeki yer sayısını güncelle
                const countElement = provinceCard.querySelector('.province-count');
                const currentCount = parseInt(countElement.textContent);
                countElement.textContent = `${currentCount - 1} yer`;
                
                // Eğer ilde hiç yer kalmadıysa empty state göster
                const provinceBody = provinceCard.querySelector('.province-body');
                if (provinceBody.children.length === 0) {
                    provinceBody.innerHTML = '<p class="empty-state">Bu ilde henüz ziyaret edilen yer bulunmuyor.</p>';
                }

                // Başarı mesajı göster
                showNotification('Başarılı', 'Ziyaret edilen yer başarıyla silindi.', 'success');
            } catch (error) {
                console.error('Yer silinemedi:', error);
                // Hatayı göster
                showNotification('Hata', 'Ziyaret edilen yer silinemedi: ' + (error.message || 'Bilinmeyen hata'), 'error');
                
                // Butonu normale döndür
                button.innerHTML = '<i class="fas fa-trash"></i>';
                button.disabled = false;
            }
        }
    }

    // Bildirim gösterme fonksiyonu
    function showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <h4>${title}</h4>
                <button class="close-notification">&times;</button>
            </div>
            <p>${message}</p>
        `;
        
        document.body.appendChild(notification);
        
        // Otomatik kapanma
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Manuel kapatma
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Hata mesajını görüntüle
    function showError(message) {
        loadingIndicator.style.display = 'none';
        
        const errorAlert = document.createElement('div');
        errorAlert.className = 'error-message';
        errorAlert.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Hata</h3>
            <p>${message}</p>
        `;
        errorAlert.style.textAlign = 'center';
        errorAlert.style.padding = '2rem';
        errorAlert.style.color = '#e74c3c';
        
        const container = document.getElementById('visited-provinces-container');
        container.innerHTML = '';
        container.appendChild(errorAlert);
    }
}); 