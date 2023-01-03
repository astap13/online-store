import { IQueryParams } from '../types';

class QueryString {
    params: IQueryParams;
    constructor() {
        this.params = {};
    }
    add(key: string, value: string) {
        console.log('query add');
        const href = window.location.href;
        if (window.location.search.length < 2) {
            window.history.pushState({}, '', `${href}?${key}=${value}`);
        } else {
            window.history.pushState({}, '', `${href}&${key}=${value}`);
        }
    }
    load(): IQueryParams {
        console.log('query load');
        const query = window.location.search.substring(1).split('&');
        const params: IQueryParams = {};
        query.forEach((item) => {
            const [key, val] = item.split('=');
            params[key] = val;
        });
        this.params = params;
        console.log(params);
        return params;
    }
}

export default QueryString;
