import { ITableModel } from './index';
import xlsx from 'node-xlsx';

class ExcelModel implements ITableModel {
    private sheets?: { name: string; data: any[][] }[] = undefined;

    static getExtensions(): string[] {
        return ['xlsx', 'xls'];
    }

    async readFile(file: string): Promise<void> {
        this.sheets = xlsx.parse(file);
    }

    getRows(sheetNum = 0): string[][] {
        const sheet = this.sheets && this.sheets[sheetNum];
        if (sheet) {
            return sheet.data;
        }
        return [];
    }
}

export default ExcelModel;
