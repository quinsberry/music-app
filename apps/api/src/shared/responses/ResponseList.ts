export class ResponseList<T> {
    data: T[];

    constructor(data: T[]) {
        this.data = data;
    }
}
