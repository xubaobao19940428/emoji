// 纯JavaScript版本的HTTP请求库
// 配置常量
const CONFIG = {
    API_URL: 'https://api.lovepal.net/v1', // 请根据实际情况修改
    SECRET_KEY: 'eac091c790ba144807037553a0517ff9', // 请根据实际情况修改
    TIMEOUT: 20000,
    VERSION: '1.0.0'
};

// 工具函数
const utils = {
    // 生成随机字符串
    randomString: function(length) {
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // 获取时区
    getTimeZone: function() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },

    // 简单的Alert替代
    showAlert: function(message) {
        console.error('API Error:', message);
        // 可以替换为您的自定义弹窗组件
        if (window.alert) {
            alert(message);
        }
    },

    // MD5函数（需要先引入md5.js）
    md5: function(str) {
        // 使用外部md5库，确保在HTML中先引入md5.js
        if (typeof window.md5 === 'function') {
            return window.md5(str);
        } else {
            console.error('MD5 library not found. Please include md5.js before request.js');
            // 降级到简单hash
            let hash = 0;
            if (str.length === 0) return hash.toString(16).padStart(32, '0');
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16).padStart(32, '0');
        }
    }
};

// HTTP请求类
class HttpClient {
    constructor() {
        this.baseURL = CONFIG.API_URL;
        this.timeout = CONFIG.TIMEOUT;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'x-app-version': CONFIG.VERSION,
            'x-app-timezone': utils.getTimeZone(),
            'x-app-id':1,
            'x-app-domain':location.host
        };
    }

    // 处理请求参数和签名
    processRequest(url, options = {}) {
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = utils.randomString(16);
        const token = localStorage.getItem('token') || '';

        // 处理URL参数
        const urlParams = {};
        let baseUrl = url;
        if (url.includes('?')) {
            const urlParts = url.split('?');
            baseUrl = urlParts[0];
            const queryString = urlParts[1];
            const params = new URLSearchParams(queryString);
            params.forEach((value, key) => {
                urlParams[key] = value;
            });
        }

        // 合并所有参数
        const allParams = {
            ...urlParams,
            ...(options.params || {}),
            ...(options.data || {}),
            timestamp,
            nonce
        };

        // 按字典序排序
        const sortedParams = Object.keys(allParams).sort().reduce((acc, key) => {
            acc[key] = allParams[key];
            return acc;
        }, {});

        // 生成完整路径
        const fullPath = this.baseURL + baseUrl;

        // 生成查询字符串
        const queryString = Object.entries(sortedParams)
            .map(([key, value]) => {
                const encodedKey = encodeURIComponent(key).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
                const encodedValue = encodeURIComponent(String(value)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
                return `${encodedKey}=${encodedValue}`;
            })
            .join('&');

        // 生成签名
        const encodedFullPath = fullPath.replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
        const sign = utils.md5(encodedFullPath + queryString + CONFIG.SECRET_KEY);

        // 设置请求头
        const headers = {
            ...this.defaultHeaders,
            'x-app-id': '1',
            'x-app-domain': location.host
        };

        if (token) {
            headers['authorization'] = token;
        }

        // 构建最终URL
        const finalUrl = this.baseURL + baseUrl + '?' + new URLSearchParams({
            ...urlParams,
            ...(options.params || {}),
            timestamp,
            nonce,
            sign
        }).toString();

        return {
            url: finalUrl,
            headers,
            body: options.data ? JSON.stringify(options.data) : null
        };
    }

    // 通用请求方法
    async request(url, options = {}) {
        const { url: finalUrl, headers, body } = this.processRequest(url, options);

        const fetchOptions = {
            method: options.method || 'GET',
            headers,
            body,
            signal: AbortSignal.timeout(this.timeout)
        };

        try {
            const response = await fetch(finalUrl, fetchOptions);
            
            // 检查响应类型
            const contentType = response.headers.get('content-type') || '';
            
            // 如果是CSV等文件类型，返回blob
            if (contentType.includes('text/csv') || contentType.includes('application/csv')) {
                return response;
            }

            const data = await response.json();

            if (!data.error) {
                return data.data;
            }

            // 处理错误
            const ignoreList = ['RESTRICTED_MODE', 'THIS_REGION_NOT_OPEN_YET', 'NOT_LOGINED', 'COINS_NOT_ENOUGH', 'PARTNER_NOT_FOUND', 'DOMAIN_NOT_CONFIGURED'];
            if (!ignoreList.includes(data.msg) && !data.msg.toLowerCase().includes('trials')) {
                utils.showAlert(data.msg || 'network error');
            }

            throw new Error(data.msg || 'network error');

        } catch (error) {
            console.error('Request failed:', error);
            utils.showAlert(error.message || 'network error');
            throw error;
        }
    }

    // GET请求
    get(url, params = {}) {
        return this.request(url, { method: 'GET', params });
    }

    // POST请求
    post(url, data = {}) {
        return this.request(url, { method: 'POST', data });
    }

    // PUT请求
    put(url, data = {}) {
        return this.request(url, { method: 'PUT', data });
    }

    // DELETE请求
    delete(url) {
        return this.request(url, { method: 'DELETE' });
    }

    // 下载文件
    async download(url, params = {}, filename = 'download.csv') {
        try {
            const response = await this.request(url, { 
                method: 'GET', 
                params,
                responseType: 'blob'
            });

            // 从响应头获取文件名
            const contentDisposition = response.headers.get('content-disposition');
            let serverFilename = '';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    serverFilename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            const finalFilename = serverFilename || filename;
            const blob = await response.blob();
            
            // 创建下载链接
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = finalFilename;
            document.body.appendChild(link);
            link.click();
            
            // 清理
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            
            console.log('Download success');
        } catch (error) {
            console.error('Download failed:', error);
            throw error;
        }
    }
}

// 创建全局实例
const httpClient = new HttpClient();

// 导出方法（兼容原有调用方式）
window.httpClient = httpClient;
window.get = (url, params) => httpClient.get(url, params);
window.post = (url, data) => httpClient.post(url, data);
window.put = (url, data) => httpClient.put(url, data);
window.del = (url) => httpClient.delete(url);
window.download = (url, params, filename) => httpClient.download(url, params, filename);
