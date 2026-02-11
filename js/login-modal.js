/**
 * 登录弹窗组件
 * 用于检查用户登录状态并显示登录弹窗
 */

// Toast 通知组件
const Toast = {
    container: null,
    
    init: function() {
        if (this.container) return;
        
        // 创建 Toast 容器
        this.container = document.createElement('div');
        this.container.id = 'toastContainer';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    },
    
    show: function(message, type = 'info', duration = 3000) {
        this.init();
        
        const toast = document.createElement('div');
        
        // 根据类型设置图标和颜色
        let icon, bgColor, borderColor;
        switch(type) {
            case 'success':
                icon = '✓';
                bgColor = 'rgba(0, 200, 83, 0.95)';
                borderColor = 'rgba(0, 255, 100, 0.3)';
                break;
            case 'error':
                icon = '✕';
                bgColor = 'rgba(220, 53, 69, 0.95)';
                borderColor = 'rgba(255, 100, 100, 0.3)';
                break;
            case 'warning':
                icon = '⚠';
                bgColor = 'rgba(255, 170, 0, 0.95)';
                borderColor = 'rgba(255, 200, 100, 0.3)';
                break;
            default:
                icon = 'ℹ';
                bgColor = 'rgba(26, 26, 46, 0.95)';
                borderColor = 'rgba(255, 255, 255, 0.2)';
        }
        
        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 24px;
            background: ${bgColor};
            border: 1px solid ${borderColor};
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            pointer-events: auto;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 400px;
            text-align: center;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 18px; min-width: 24px;">${icon}</span>
            <span>${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        // 触发动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
        
        // 自动移除
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    },
    
    success: function(message, duration) {
        this.show(message, 'success', duration);
    },
    
    error: function(message, duration) {
        this.show(message, 'error', duration);
    },
    
    warning: function(message, duration) {
        this.show(message, 'warning', duration);
    },
    
    info: function(message, duration) {
        this.show(message, 'info', duration);
    }
};

// 导出 Toast 到全局
window.Toast = Toast;

// 确认弹窗组件
const ConfirmModal = {
    overlay: null,
    
    show: function(options = {}) {
        const {
            title = '确认',
            message = '确定要执行此操作吗？',
            confirmText = '确定',
            cancelText = '取消',
            type = 'warning', // warning, danger, info
            onConfirm = () => {},
            onCancel = () => {}
        } = options;
        
        // 移除已存在的弹窗
        this.close();
        
        // 根据类型设置颜色
        let iconColor, confirmBtnBg;
        switch(type) {
            case 'danger':
                iconColor = '#dc3545';
                confirmBtnBg = 'linear-gradient(90deg, #dc3545, #c82333)';
                break;
            case 'info':
                iconColor = '#00ccff';
                confirmBtnBg = 'linear-gradient(90deg, #00ccff, #0099cc)';
                break;
            default: // warning
                iconColor = '#ffaa00';
                confirmBtnBg = 'linear-gradient(90deg, #ffaa00, #ff8800)';
        }
        
        // 创建弹窗
        this.overlay = document.createElement('div');
        this.overlay.id = 'confirmModalOverlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        this.overlay.innerHTML = `
            <div class="confirm-modal" style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 32px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <div style="
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 32px;
                ">
                    <span style="color: ${iconColor};">⚠</span>
                </div>
                <h3 style="
                    color: #fff;
                    font-size: 20px;
                    font-weight: 700;
                    margin: 0 0 12px;
                ">${title}</h3>
                <p style="
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 0 0 28px;
                ">${message}</p>
                <div style="
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                ">
                    <button id="confirmModalCancel" style="
                        flex: 1;
                        padding: 12px 24px;
                        border-radius: 50px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        background: rgba(255, 255, 255, 0.1);
                        color: #fff;
                        transition: all 0.3s ease;
                    ">${cancelText}</button>
                    <button id="confirmModalConfirm" style="
                        flex: 1;
                        padding: 12px 24px;
                        border-radius: 50px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        border: none;
                        background: ${confirmBtnBg};
                        color: #fff;
                        transition: all 0.3s ease;
                    ">${confirmText}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        document.body.style.overflow = 'hidden';
        
        // 触发动画
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
            this.overlay.querySelector('.confirm-modal').style.transform = 'scale(1)';
        });
        
        // 绑定事件
        const self = this;
        
        document.getElementById('confirmModalCancel').onclick = function() {
            self.close();
            onCancel();
        };
        
        document.getElementById('confirmModalConfirm').onclick = function() {
            self.close();
            onConfirm();
        };
        
        // 点击遮罩关闭
        this.overlay.onclick = function(e) {
            if (e.target === self.overlay) {
                self.close();
                onCancel();
            }
        };
        
        // ESC 键关闭
        this.escHandler = function(e) {
            if (e.key === 'Escape') {
                self.close();
                onCancel();
            }
        };
        document.addEventListener('keydown', this.escHandler);
        
        // 按钮 hover 效果
        const cancelBtn = document.getElementById('confirmModalCancel');
        const confirmBtn = document.getElementById('confirmModalConfirm');
        
        cancelBtn.onmouseenter = function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        };
        cancelBtn.onmouseleave = function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        };
        
        confirmBtn.onmouseenter = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        };
        confirmBtn.onmouseleave = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
    },
    
    close: function() {
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            const modal = this.overlay.querySelector('.confirm-modal');
            if (modal) {
                modal.style.transform = 'scale(0.9)';
            }
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                this.overlay = null;
            }, 300);
            document.body.style.overflow = '';
        }
        if (this.escHandler) {
            document.removeEventListener('keydown', this.escHandler);
        }
    },
    
    // 快捷方法
    confirm: function(message, onConfirm, onCancel) {
        this.show({
            title: '确认',
            message: message,
            type: 'warning',
            onConfirm: onConfirm,
            onCancel: onCancel
        });
    },
    
    danger: function(message, onConfirm, onCancel) {
        this.show({
            title: '警告',
            message: message,
            type: 'danger',
            confirmText: '确定',
            onConfirm: onConfirm,
            onCancel: onCancel
        });
    }
};

// 导出 ConfirmModal 到全局
window.ConfirmModal = ConfirmModal;

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDMANHS0SIuYvLfwP8RXsP_w7dPywtZ2ug",
    authDomain: "lovepal-54526.firebaseapp.com",
    projectId: "lovepal-54526",
    storageBucket: "lovepal-54526.firebasestorage.app",
    messagingSenderId: "887041235638",
    appId: "1:887041235638:web:0865fcd137a1c9fdf7e417",
    measurementId: "G-624ZV5CT8E"
};

// Firebase 初始化状态
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;

// 初始化 Firebase
function initFirebase() {
    if (firebaseApp) return;
    
    try {
        // 检查 Firebase SDK 是否已加载
        if (typeof firebase !== 'undefined') {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            firebaseAuth = firebase.auth();
            googleProvider = new firebase.auth.GoogleAuthProvider();
            
            // 添加额外的 scope（可选）
            googleProvider.addScope('email');
            googleProvider.addScope('profile');
            
            console.log('Firebase initialized successfully');
        } else {
            console.error('Firebase SDK not loaded');
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// 登录弹窗管理器
const LoginModal = {
    isInitialized: false,

    // 初始化弹窗
    init: function() {
        if (this.isInitialized) return;
        
        // 创建弹窗HTML
        const modalHTML = `
            <div class="login-modal-overlay" id="loginModalOverlay">
                <div class="login-modal">
                    <button class="login-modal-close" onclick="LoginModal.close()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <div class="login-modal-content">
                        <!-- 左侧信息区 -->
                        <div class="login-modal-left">
                            <div class="login-modal-badge">
                                <span class="badge-icon">🏆</span>
                                <span class="badge-text">#1</span>
                            </div>
                            <div class="login-modal-title">Generate Emoji</div>
                            <div class="login-modal-rating">
                                <span class="stars">★★★★★</span>
                            </div>
                            <div class="login-modal-users">10M+ users</div>
                            
                            <div class="login-modal-powered">
                                <span class="powered-label">Powered By</span>
                                <div class="powered-logos">
                                    <div class="powered-item">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                                        </svg>
                                        <span>Open Generator</span>
                                    </div>
                                    <div class="powered-item">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                        </svg>
                                        <span>Anthropic</span>
                                    </div>
                                    <div class="powered-item">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        <span>Google</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 评价卡片 -->
                            <div class="login-modal-reviews">
                                <div class="review-label">Trusted by Millions</div>
                                <div class="review-cards">
                                    <div class="review-card">
                                        <div class="review-stars">★★★★★</div>
                                        <div class="review-title">Perfect Generator Tool</div>
                                        <div class="review-text">It's a great time-saver to create unique emojis instantly.</div>
                                        <div class="review-author">
                                            <div class="author-avatar">👩</div>
                                            <div class="author-info">
                                                <span class="author-name">Sophia Brown</span>
                                                <span class="author-role">Designer</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="review-card">
                                        <div class="review-stars">★★★★★</div>
                                        <div class="review-title">Loving the Generator</div>
                                        <div class="review-text">So personalized and so fast! I'm loving how this Generator App responds.</div>
                                        <div class="review-author">
                                            <div class="author-avatar">👨</div>
                                            <div class="author-info">
                                                <span class="author-name">Liam Smith</span>
                                                <span class="author-role">Developer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 右侧登录区 -->
                        <div class="login-modal-right">
                            <h2 class="login-title">Join Millions of Happy Users</h2>
                            
                            <button class="login-btn login-btn-google" onclick="LoginModal.loginWithGoogle()">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span>Continue with Google</span>
                            </button>
                            
                            <div class="login-divider">
                                <span>or</span>
                            </div>
                            
                            <div class="login-email-form">
                                <input type="email" class="login-input" id="loginEmail" placeholder="Enter your email">
                                <input type="password" class="login-input" id="loginPassword" placeholder="Enter your password">
                                <button class="login-btn login-btn-email" onclick="LoginModal.loginWithEmail()">
                                    Continue with Email
                                </button>
                            </div>
                            
                            <p class="login-terms">
                                By proceeding, you agree to our <a href="/TermsOfService.html">Terms of Service</a> and read our <a href="/PrivacyPolicy.html">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 创建样式
        const styleHTML = `
            <style id="loginModalStyles">
                .login-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .login-modal-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .login-modal {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    border-radius: 24px;
                    max-width: 900px;
                    width: 90%;
                    max-height: 90vh;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transform: scale(0.9) translateY(20px);
                    transition: transform 0.3s ease;
                }
                
                .login-modal-overlay.active .login-modal {
                    transform: scale(1) translateY(0);
                }
                
                .login-modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #fff;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 10;
                }
                
                .login-modal-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: rotate(90deg);
                }
                
                .login-modal-content {
                    display: flex;
                    min-height: 500px;
                    max-height: 80vh;
                    overflow: hidden;
                }
                
                /* 左侧信息区 */
                .login-modal-left {
                    flex: 1;
                    padding: 40px;
                    background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(204, 255, 2, 0.05) 100%);
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .login-modal-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(45deg, #ffd700, #ffaa00);
                    color: #000;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 14px;
                    margin-bottom: 12px;
                }
                
                .badge-icon {
                    font-size: 16px;
                }
                
                .login-modal-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #fff;
                    margin-bottom: 8px;
                    background: linear-gradient(90deg, #00ff88 0%, #00ccff 50%, #ccff02 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .login-modal-rating {
                    margin-bottom: 4px;
                }
                
                .login-modal-rating .stars {
                    color: #ffd700;
                    font-size: 18px;
                    letter-spacing: 2px;
                }
                
                .login-modal-users {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 24px;
                }
                
                .login-modal-powered {
                    text-align: center;
                    margin-bottom: 24px;
                }
                
                .powered-label {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 12px;
                    display: block;
                }
                
                .powered-logos {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .powered-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .powered-item svg {
                    opacity: 0.8;
                }
                
                /* 评价区域 */
                .login-modal-reviews {
                    width: 100%;
                }
                
                .review-label {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 16px;
                    text-align: center;
                }
                
                .review-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .review-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 16px;
                }
                
                .review-stars {
                    color: #ffd700;
                    font-size: 12px;
                    margin-bottom: 8px;
                    letter-spacing: 1px;
                }
                
                .review-title {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 700;
                    margin-bottom: 6px;
                }
                
                .review-text {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 12px;
                    line-height: 1.5;
                    margin-bottom: 12px;
                }
                
                .review-author {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .author-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #00ff88, #00ccff);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                
                .author-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .author-name {
                    color: #fff;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .author-role {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 10px;
                }
                
                /* 右侧登录区 */
                .login-modal-right {
                    flex: 1;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    overflow-y: auto;
                }
                
                .login-title {
                    color: #fff;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 32px;
                    text-align: center;
                }
                
                .login-btn {
                    width: 100%;
                    padding: 14px 24px;
                    border-radius: 50px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    transition: all 0.3s ease;
                    margin-bottom: 12px;
                    border: none;
                }
                
                .login-btn-google {
                    background: #fff;
                    color: #333;
                }
                
                .login-btn-google:hover {
                    background: #f5f5f5;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
                }
                
                .login-divider {
                    display: flex;
                    align-items: center;
                    margin: 20px 0;
                }
                
                .login-divider::before,
                .login-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .login-divider span {
                    color: rgba(255, 255, 255, 0.5);
                    padding: 0 16px;
                    font-size: 14px;
                }
                
                .login-email-form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .login-input {
                    width: 100%;
                    padding: 14px 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50px;
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                    font-size: 15px;
                    outline: none;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }
                
                .login-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }
                
                .login-input:focus {
                    border-color: #00ff88;
                    background: rgba(0, 255, 136, 0.05);
                }
                
                .login-btn-email {
                    background: linear-gradient(90deg, #00ff88 0%, #00ccff 50%, #ccff02 100%);
                    color: #000;
                }
                
                .login-btn-email:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
                }
                
                .login-terms {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 12px;
                    text-align: center;
                    margin-top: 24px;
                    line-height: 1.6;
                }
                
                .login-terms a {
                    color: #00ff88;
                    text-decoration: none;
                }
                
                .login-terms a:hover {
                    text-decoration: underline;
                }
                
                /* 响应式设计 */
                @media (max-width: 768px) {
                    .login-modal-content {
                        flex-direction: column;
                    }
                    
                    .login-modal-left {
                        display: none;
                    }
                    
                    .login-modal-right {
                        padding: 40px 24px;
                    }
                    
                    .login-modal {
                        max-width: 400px;
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                    
                    .login-title {
                        font-size: 22px;
                        margin-bottom: 28px;
                    }
                    
                    .login-modal-close {
                        top: 12px;
                        right: 12px;
                        width: 36px;
                        height: 36px;
                    }
                }
                
                @media (max-width: 480px) {
                    .login-modal {
                        width: 95%;
                        border-radius: 20px;
                    }
                    
                    .login-modal-right {
                        padding: 32px 20px;
                    }
                    
                    .login-title {
                        font-size: 20px;
                        margin-bottom: 24px;
                    }
                    
                    .login-btn {
                        padding: 12px 20px;
                        font-size: 14px;
                    }
                    
                    .login-input {
                        padding: 12px 16px;
                        font-size: 14px;
                    }
                    
                    .login-terms {
                        font-size: 11px;
                        margin-top: 20px;
                    }
                }
            </style>
        `;
        
        // 添加到页面
        document.head.insertAdjacentHTML('beforeend', styleHTML);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 添加ESC键关闭功能
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
        
        // 点击遮罩层关闭
        document.getElementById('loginModalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'loginModalOverlay') {
                this.close();
            }
        });
        
        this.isInitialized = true;
    },
    
    // 显示弹窗
    show: function() {
        this.init();
        const overlay = document.getElementById('loginModalOverlay');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    // 关闭弹窗
    close: function() {
        const overlay = document.getElementById('loginModalOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    // 检查是否已登录
    isLoggedIn: function() {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');
        return !!(token && userInfo);
    },
    
    // 需要登录时的检查函数
    requireLogin: function(callback) {
        if (this.isLoggedIn()) {
            if (callback && typeof callback === 'function') {
                callback();
            }
            return true;
        } else {
            this.show();
            return false;
        }
    },
    
    // Google登录
    loginWithGoogle: async function() {
        console.log('Google login clicked');
        
        // 确保 Firebase 已初始化
        initFirebase();
        
        if (!firebaseAuth || !googleProvider) {
            Toast.error('Firebase 未正确初始化，请刷新页面重试');
            return;
        }
        
        try {
            // 显示加载状态
            const googleBtn = document.querySelector('.login-btn-google');
            if (googleBtn) {
                googleBtn.disabled = true;
                googleBtn.innerHTML = '<span>登录中...</span>';
            }
            
            // 使用弹窗方式登录
            const result = await firebaseAuth.signInWithPopup(googleProvider);
            
            // 获取用户信息和 accessToken
            const resultUser = result.user;
            console.log('Google login successful', resultUser);
            
            // 调用后端接口进行验证（使用 accessToken 作为 id_token）
            const response = await post('/sso/authenticate', {
                id_token: resultUser._delegate.accessToken,
                platform: 'google'
            });
            
            // 处理响应
            const loginResponse = response;
            loginResponse.userInfo = loginResponse.user_info;
            
            // 保存登录信息到 localStorage
            localStorage.setItem('token', loginResponse.token);
            localStorage.setItem('userInfo', JSON.stringify(loginResponse.userInfo));
            
            // 关闭弹窗
            this.close();
            
            // 刷新页面
            window.location.reload();
            
        } catch (error) {
            console.error('Google login failed', error);
            
            // 恢复按钮状态
            const googleBtn = document.querySelector('.login-btn-google');
            if (googleBtn) {
                googleBtn.disabled = false;
                googleBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                `;
            }
            
            // 处理不同类型的错误
            if (error.code === 'auth/popup-closed-by-user') {
                Toast.warning('登录已取消');
            } else if (error.code === 'auth/popup-blocked') {
                Toast.error('弹窗被阻止，请允许弹窗后重试');
            } else if (error.code === 'auth/network-request-failed') {
                Toast.error('网络错误，请检查网络连接');
            } else {
                Toast.error('登录失败，请重试');
            }
        }
    },
    
    // 邮箱登录/注册
    loginWithEmail: async function() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.error('Please enter a valid email address');
            return;
        }
        
        // 密码验证：至少8位，包含字母和数字
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            Toast.error('Password must be at least 8 characters and contain both letters and numbers');
            return;
        }
        
        try {
            // 显示加载状态
            const emailBtn = document.querySelector('.login-btn-email');
            if (emailBtn) {
                emailBtn.disabled = true;
                emailBtn.innerHTML = '<span>Loading...</span>';
            }
            
            // 调用后端接口进行邮箱登录/注册
            const response = await post('/sso/login', {
                email: email,
                password: password
            });
            
            // 处理响应
            const loginResponse = response;
            loginResponse.userInfo = loginResponse.user_info;
            
            // 保存登录信息到 localStorage
            localStorage.setItem('token', loginResponse.token);
            localStorage.setItem('userInfo', JSON.stringify(loginResponse.userInfo));
            
            // 关闭弹窗
            this.close();
            
            // 刷新页面
            window.location.reload();
            
        } catch (error) {
            console.error('Email login failed', error);
            
            // 恢复按钮状态
            const emailBtn = document.querySelector('.login-btn-email');
            if (emailBtn) {
                emailBtn.disabled = false;
                emailBtn.innerHTML = 'Continue with Email';
            }
            
            Toast.error('Login failed, please check your email and password');
        }
    }
};

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    LoginModal.init();
    
    // 延迟初始化 Firebase，确保 SDK 已加载
    setTimeout(() => {
        initFirebase();
    }, 100);
});

// 导出到全局
window.LoginModal = LoginModal;
window.initFirebase = initFirebase;

