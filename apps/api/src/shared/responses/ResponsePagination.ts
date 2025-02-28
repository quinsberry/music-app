export class ResponsePagination<T> {
    data: T;
    meta: {
        page: number;
        pages: number;
        per_page: number;
        total: number;
    };

    constructor(data: T, meta: { total: number; skip: number; take: number }) {
        this.data = data;
        this.meta = {
            page: Math.floor(meta.skip / meta.take) + 1,
            pages: Math.ceil(meta.total / meta.take),
            per_page: meta.take,
            total: meta.total,
        };
    }
}
