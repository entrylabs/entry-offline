import { ITableModel } from './index';
import csv from 'async-csv';
import fs from 'fs-extra';

class CsvModel implements ITableModel {
    private rows: string[][] = [];

    static getExtensions(): string[] {
        return ['csv'];
    }

    async readFile(file: string): Promise<void> {
        const csvString = await fs.readFile(file, 'utf8');
        this.rows = await csv.parse(csvString);
    }

    getRows(): string[][] {
        return this.rows;
    }
}

export default CsvModel;
