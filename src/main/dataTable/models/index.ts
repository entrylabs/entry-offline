export { default as CsvModel } from './csvModel';
export { default as ExcelModel } from './excelModel';

export interface ITableModel {
    readFile(file: string): Promise<void>;
    getRows(): string[][];
    // public abstract async write(): Promise<any>;
}
