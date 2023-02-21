export class Result<T, E> {
    private isSuccess: boolean;
    private isFailure: boolean
    public error: E;
    private _value: T;

    private constructor(isSuccess: boolean, error?: E, value?: T) {
        if (isSuccess && error) {
            throw new Error(`InvalidOperation: A result cannot be successful and contain an error`);
        }
        if (!isSuccess && !error) {
            throw new Error(`InvalidOperation: A failing result needs to contain an error message`);
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;

        Object.freeze(this);
    }

    public getValue(): T {
        if (!this.isSuccess) {
            throw new Error(`Cant retrieve the value from a failed result.`)
        }

        return this._value;
    }

    public isOk(): boolean {
        return this.isSuccess;
    }

    public isError(): boolean {
        return this.isFailure;
    }

    public isErrorOf(type): boolean {
        return this.isFailure && this.error.constructor === type;
    }

    public static ok<U>(value?: U): Result<U,null> {
        return new Result<U, null>(true, null, value);
    }

    public static fail<E>(error: E): Result<null,E> {
        return new Result<null,E>(false, error);
    }

}