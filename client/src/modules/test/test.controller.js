const TestController = {};

const ENV = import.meta.env;

const host = ENV.VITE_API_HOST || 'localhost';
const port = ENV.VITE_API_PORT || '8081';
const base = (ENV.VITE_API_BASE || 'adj-api').replace(/^\/+|\/+$/g, '');
const API_URL = `http://${host}:${port}/${base}`;

TestController.callToAPI = async () => {
    try {
        const res = await fetch(`${API_URL}/test`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        const text = await res.text();
        try {
            const json = JSON.parse(text);
            return json;
        } catch (e) {
            return text;
        }
    } catch (err) {
        throw err;
    }
}

export default TestController;