/**
 * 用户侧边栏组件
 * 用于显示用户信息和导航菜单
 */

// 用户侧边栏管理器
const UserSidebar = {
    isInitialized: false,
    userInfo: null,
    currentPage: '', // 当前页面，用于高亮菜单项

    // 初始化侧边栏
    init: function(options = {}) {
        if (this.isInitialized) return;
        
        // 设置当前页面
        this.currentPage = options.currentPage || '';
        
        // 检查是否为 emojis 子目录
        const isSubDir = window.location.pathname.includes('/emojis/');
        const basePath = isSubDir ? './' : './emojis/';
        const rootPath = isSubDir ? '../' : './';
        const assetsPath = isSubDir ? './assets/' : './emojis/assets/';
        
        // 创建侧边栏HTML
        const sidebarHTML = `
            <div class="user-sidebar-overlay" id="userSidebarOverlay" onclick="UserSidebar.close()"></div>
            <div class="user-sidebar" id="userSidebar">
                <div class="user-sidebar-header">
                    <div class="user-sidebar-logo">
                        <img src="${assetsPath}icon-logo.png" alt="Emojis Generator" />
                    </div>
                    <button class="user-sidebar-close" onclick="UserSidebar.close()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <div class="user-sidebar-info" id="userSidebarInfo">
                    <div class="user-sidebar-avatar" id="userSidebarAvatar">👤</div>
                    <div class="user-sidebar-name" id="userSidebarName">Guest</div>
                    <div class="user-sidebar-coins" id="userSidebarCoinsWrap" style="display: none;">
                        <img src="${assetsPath}coin.png" alt="coins" style="width: 20px; height: 20px;">
                        <span id="userSidebarCoins">0</span>
                    </div>
                    <div class="user-sidebar-uid" id="userSidebarUidWrap" style="display: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4L13.5 7H7V9H13.5L15 12L21 9ZM4 7V9H6V7H4ZM3 13V11H1V13H3ZM6 13V11H4V13H6Z" />
                        </svg>
                        <span>User ID</span>
                        <span id="userSidebarUid">-</span>
                    </div>
                    <div class="user-sidebar-login-hint" id="userSidebarLoginHint" style="display: block;">
                        <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 8px;">Sign in to unlock all features</p>
                    </div>
                </div>

                <div class="user-sidebar-menu">
                    <a href="${basePath}index.html" class="user-sidebar-menu-item ${this.currentPage === 'create' ? 'active' : ''}">
                        <span class="user-sidebar-menu-icon">⏰</span>
                        <span>Create</span>
                        <span class="user-sidebar-menu-arrow">›</span>
                    </a>
                    <a href="${basePath}gallery.html" class="user-sidebar-menu-item ${this.currentPage === 'gallery' ? 'active' : ''}">
                        <span class="user-sidebar-menu-icon">🖼️</span>
                        <span>Gallery</span>
                        <span class="user-sidebar-menu-arrow">›</span>
                    </a>
                    <a href="${basePath}price.html" class="user-sidebar-menu-item ${this.currentPage === 'price' ? 'active' : ''}">
                        <span class="user-sidebar-menu-icon">💰</span>
                        <span>Price</span>
                        <span class="user-sidebar-menu-arrow">›</span>
                    </a>
                    <a href="${basePath}creation.html" class="user-sidebar-menu-item ${this.currentPage === 'creation' ? 'active' : ''}">
                        <span class="user-sidebar-menu-icon">❤️</span>
                        <span>Creation</span>
                        <span class="user-sidebar-menu-arrow">›</span>
                    </a>
                    <a href="${rootPath}TermsOfService.html" class="user-sidebar-menu-item">
                        <span class="user-sidebar-menu-icon">📄</span>
                        <span>Term of Service</span>
                        <span class="user-sidebar-menu-arrow">›</span>
                    </a>
                    <a href="${rootPath}PrivacyPolicy.html" class="user-sidebar-menu-item">
                        <span class="user-sidebar-menu-icon">🔒</span>
                        <span>Privacy Policy</span>
                        <span class="user-sidebar-menu-arrow">›</span>
                    </a>
                </div>

                <div class="user-sidebar-footer">
                    <a href="#" class="user-sidebar-switch" id="userSidebarAuthBtn" onclick="UserSidebar.handleAuthClick(); return false;">
                        <span class="user-sidebar-switch-icon" id="userSidebarAuthIcon">🔐</span>
                        <span id="userSidebarAuthText">Sign In</span>
                        <span class="user-sidebar-switch-arrow">›</span>
                    </a>
                </div>
            </div>
        `;
        
        // 创建样式
        const styleHTML = `
            <style id="userSidebarStyles">
                /* 用户侧边栏样式 */
                .user-sidebar {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 350px;
                    height: 100vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    backdrop-filter: blur(20px);
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }

                .user-sidebar.active {
                    transform: translateX(0);
                }

                .user-sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .user-sidebar-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                .user-sidebar-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .user-sidebar-logo img {
                    height: 32px;
                }

                .user-sidebar-close {
                    background: transparent;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: background 0.3s ease;
                }

                .user-sidebar-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .user-sidebar-info {
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .user-sidebar-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #00ff88, #00ccff);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 12px;
                    font-size: 24px;
                    overflow: hidden;
                }

                .user-sidebar-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .user-sidebar-name {
                    color: #fff;
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .user-sidebar-coins {
                    color: #ccff02;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }

                .user-sidebar-uid {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 12px;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .user-sidebar-menu {
                    flex: 1;
                    padding: 20px 0;
                }

                .user-sidebar-menu-item {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border-left: 3px solid transparent;
                }

                .user-sidebar-menu-item:hover,
                .user-sidebar-menu-item.active {
                    color: #ccff02;
                    background: rgba(204, 255, 2, 0.1);
                    border-left-color: #ccff02;
                }

                .user-sidebar-menu-icon {
                    margin-right: 12px;
                    font-size: 18px;
                }

                .user-sidebar-menu-arrow {
                    margin-left: auto;
                    font-size: 14px;
                }

                .user-sidebar-footer {
                    padding: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .user-sidebar-switch {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .user-sidebar-switch:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .user-sidebar-switch-icon {
                    margin-right: 8px;
                }

                .user-sidebar-switch-arrow {
                    margin-left: auto;
                }

                /* 响应式样式 */
                @media (max-width: 480px) {
                    .user-sidebar {
                        width: 100%;
                    }
                }
            </style>
        `;
        
        // 将样式和HTML添加到页面
        if (!document.getElementById('userSidebarStyles')) {
            document.head.insertAdjacentHTML('beforeend', styleHTML);
        }
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);
        
        // 绑定ESC键关闭侧边栏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                UserSidebar.close();
            }
        });
        
        this.isInitialized = true;
        
        // 加载用户信息
        this.loadUserInfo();
    },

    // 加载用户信息
    loadUserInfo: function() {
        // 先从 localStorage 获取
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                this.userInfo = JSON.parse(storedUserInfo);
            } catch (e) {
                console.error('Error parsing stored user info:', e);
            }
        }
        
        // 更新 UI（无论是否登录）
        this.updateUI();
        
        // 如果已登录，从服务器获取最新信息
        if (this.isLoggedIn()) {
            this.fetchUserInfo();
        }
    },

    // 从服务器获取用户信息
    fetchUserInfo: async function() {
        try {
            if (typeof get === 'function') {
                const res = await get('/my/profile');
                if (res) {
                    // 保存用户信息
                    this.userInfo = res;
                    localStorage.setItem('userInfo', JSON.stringify(res));
                    this.updateUI();
                }
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    },

    // 更新UI显示
    updateUI: function() {
        const isLoggedIn = this.isLoggedIn();
        
        // 获取元素
        const nameEl = document.getElementById('userSidebarName');
        const coinsWrap = document.getElementById('userSidebarCoinsWrap');
        const coinsEl = document.getElementById('userSidebarCoins');
        const uidWrap = document.getElementById('userSidebarUidWrap');
        const uidEl = document.getElementById('userSidebarUid');
        const avatarEl = document.getElementById('userSidebarAvatar');
        const loginHint = document.getElementById('userSidebarLoginHint');
        const authIcon = document.getElementById('userSidebarAuthIcon');
        const authText = document.getElementById('userSidebarAuthText');
        
        if (isLoggedIn && this.userInfo) {
            const info = this.userInfo.userInfo || this.userInfo;
            
            // 显示用户信息
            if (nameEl && info.nickname) {
                nameEl.textContent = info.nickname;
            }
            
            if (coinsWrap) coinsWrap.style.display = 'flex';
            if (coinsEl && info.remain_coins !== undefined) {
                coinsEl.textContent = info.remain_coins;
            }
            
            if (uidWrap) uidWrap.style.display = 'flex';
            if (uidEl && info.uid) {
                uidEl.textContent = info.uid;
            }
            
            if (avatarEl) {
                if (info.avatar) {
                    avatarEl.innerHTML = `<img src="${info.avatar}" alt="avatar">`;
                } else {
                    avatarEl.innerHTML = '😎';
                }
            }
            
            // 隐藏登录提示
            if (loginHint) loginHint.style.display = 'none';
            
            // 显示 Log Out 按钮
            if (authIcon) authIcon.textContent = '🚪';
            if (authText) authText.textContent = 'Log Out';
            
        } else {
            // 未登录状态
            if (nameEl) nameEl.textContent = 'Guest';
            if (avatarEl) avatarEl.innerHTML = '👤';
            if (coinsWrap) coinsWrap.style.display = 'none';
            if (uidWrap) uidWrap.style.display = 'none';
            if (loginHint) loginHint.style.display = 'block';
            
            // 显示 Sign In 按钮
            if (authIcon) authIcon.textContent = '🔐';
            if (authText) authText.textContent = 'Sign In';
        }
    },
    
    // 检查是否已登录
    isLoggedIn: function() {
        const token = localStorage.getItem('token');
        return !!token;
    },
    
    // 处理登录/登出按钮点击
    handleAuthClick: function() {
        if (this.isLoggedIn()) {
            this.logout();
        } else {
            this.close();
            if (typeof LoginModal !== 'undefined') {
                LoginModal.show();
            }
        }
    },

    // 打开侧边栏
    open: function() {
        const sidebar = document.getElementById('userSidebar');
        const overlay = document.getElementById('userSidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    // 关闭侧边栏
    close: function() {
        const sidebar = document.getElementById('userSidebar');
        const overlay = document.getElementById('userSidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // 切换侧边栏显示/隐藏
    toggle: function() {
        const sidebar = document.getElementById('userSidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            this.close();
        } else {
            this.open();
        }
    },

    // 退出登录
    logout: function() {
        const self = this;
        ConfirmModal.show({
            title: 'Log Out',
            message: 'Are you sure you want to log out?',
            confirmText: 'Log Out',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: function() {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                self.close();
                Toast.success('Logged out successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        });
    },

    // 获取用户信息
    getUserInfo: function() {
        return this.userInfo;
    },

    // 刷新用户信息（重新从服务器获取）
    refreshUserInfo: function() {
        this.fetchUserInfo();
    }
};

// 兼容旧的函数调用（如果页面中有直接调用这些函数的地方）
function toggleUserSidebar() {
    UserSidebar.toggle();
}

function closeUserSidebar() {
    UserSidebar.close();
}

function openUserSidebar() {
    UserSidebar.open();
}

// 自动初始化（在 DOMContentLoaded 时）
document.addEventListener('DOMContentLoaded', function() {
    // 检测当前页面
    const pathname = window.location.pathname;
    let currentPage = '';
    
    if (pathname.includes('index.html') || pathname.endsWith('/emojis/')) {
        currentPage = 'create';
    } else if (pathname.includes('gallery.html')) {
        currentPage = 'gallery';
    } else if (pathname.includes('price.html')) {
        currentPage = 'price';
    } else if (pathname.includes('creation.html')) {
        currentPage = 'creation';
    }
    
    UserSidebar.init({ currentPage: currentPage });
});

// 导出到全局
window.UserSidebar = UserSidebar;

