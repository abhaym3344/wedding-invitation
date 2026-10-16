import { util } from './util.js';
import { storage } from './storage.js';
import { request, HTTP_GET, HTTP_STATUS_OK } from '../connection/request.js';

export const session = (() => {

    /**
     * @type {ReturnType<typeof storage>|null}
     */
    let ses = null;

    /**
     * @returns {string|null}
     */
    const getToken = () => ses.get('token');

    /**
     * @param {string} token
     * @returns {void}
     */
    const setToken = (token) => ses.set('token', token);

    /**
     * @returns {void}
     */
    const logout = () => ses.unset('token');

    /**
     * @returns {boolean}
     */
    const isAdmin = () => String(getToken() ?? '.').split('.').length === 3;

    /**
     * @param {string} token
     * @returns {Promise<object>}
     */
    const guest = (token) => {
        return request(HTTP_GET, '/api/v2/config')
            .withCache(1000 * 60 * 30)
            .withForceCache()
            .token(token)
            .send()
            .then((res) => {
                if (res.code !== HTTP_STATUS_OK) {
                    throw new Error('failed to get config.');
                }

                const config = storage('config');
                for (const [k, v] of Object.entries(res.data)) {
                    config.set(k, v);
                }

                setToken(token);
                return res;
            });
    };

    /**
     * @returns {object|null}
     */
    const decode = () => {
        if (!isAdmin()) {
            return null;
        }

        try {
            return JSON.parse(util.base64Decode(getToken().split('.')[1]));
        } catch {
            return null;
        }
    };

    /**
     * @returns {boolean}
     */
    const isValid = () => {
        if (!isAdmin()) {
            return false;
        }

        return (decode()?.exp ?? 0) > (Date.now() / 1000);
    };

    /**
     * @returns {void}
     */
    const init = () => {
        ses = storage('session');
    };

    return {
        init,
        guest,
        isValid,
        logout,
        decode,
        isAdmin,
        setToken,
        getToken,
    };
})();