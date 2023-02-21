export type CalculatorValue = {
    values?: Array<number | string | number[] | string[]>;
};

export type CalculatorResultResponse = Array<number | string | number[] | string[]>

export interface ICalculatorResponse {
    value?: ICalculatorResponseValue[];
    values?: Array<number | string | number[] | string[]>;
}

export interface ICalculatorResponseValue {
    id: string,
    name: string
}

export type CalculatorResponse = ICalculatorResponse;

export type CalculatorParams = {
    document_id: string;
    sheet_id?: string;
    cells?: string;
}