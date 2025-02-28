export class ResponsePagination<T> {
    data: T;
    meta: {
        page: number;
        pages: number;
        per_page: number;
        total: number;
    };

    constructor(data: T, meta: { page: number; pages: number; per_page: number; total: number }) {
        this.data = data;
        this.meta = meta;
    }
}
