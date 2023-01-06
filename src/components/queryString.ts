class QueryString {
    params: Map<string, string>;
    constructor() {
        this.params = new Map();
    }
    add(key: string, value: string) {
        console.log('query add');
        this.params.set(key, value);
        let pathname = '';
        this.params.delete('');
        this.params.forEach((item, index) => {
            if (pathname.length === 0) {
                pathname += `?${index}=${item}`;
            } else {
                pathname += `&${index}=${item}`;
            }
        });
        window.history.pushState({}, '', `${pathname}`);
    }
    load(): Map<string, string> {
        console.log('query load');
        const query = window.location.search.substring(1).split('&');
        const params: Map<string, string> = new Map();
        if (query) {
            query.forEach((item) => {
                const [key, val] = item.split('=');
                params.set(key, val);
            });
        }
        this.params = params;
        return params;
    }
}

export default QueryString;
