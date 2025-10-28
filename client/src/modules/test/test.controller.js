const TestController = {};

const ENV = import.meta.env;

const host = ENV.VITE_API_HOST || 'localhost';
const port = ENV.VITE_API_PORT || '8081';
const base = (ENV.VITE_API_BASE || 'adj-api').replace(/^\/+|\/+$/g, ''); // trim slashes
const API_URL = `http://${host}:${port}/${base}`;

TestController.callToAPI = async () => {
    try {
        const res = await fetch(`${API_URL}/test`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        // handle non-JSON responses gracefully
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            console.log(json);
            return json;
        } catch (e) {
            console.warn('Response is not JSON:', text);
            return text;
        }
    } catch (err) {
        console.error('Error calling API:', err);
        throw err;
    }
}

export default TestController;