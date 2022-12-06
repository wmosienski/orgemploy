export class SomethingWentWrong extends Error {
    constructor(message: string) {
        super(message);
    }
}
