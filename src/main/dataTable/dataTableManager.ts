import path from 'path';
import { CsvModel, ExcelModel } from './models';
import CommonUtils from '../commonUtils';

const Models = [CsvModel, ExcelModel];

type ITableData = {
    chart: any[];
    fields: string[];
    rows: number;
    data: string[][];
    name: string;
};

class DataTableManager {
    private _tables: { [hash: string]: { name: string; data: ITableData } } = {};

    // TODO: otherTypes 추가
    async makeTableInfo(file: string): Promise<{ id: string; name: string } | undefined> {
        try {
            const { name, table } = this._createTable(file);
            await table.readFile(file);
            const rows = table.getRows();
            const hashId = CommonUtils.createFileId();
            const result: ITableData = {
                chart: [],
                fields: rows.shift() || [],
                rows: rows.length,
                data: rows,
                name,
            };

            this._tables[hashId] = { name, data: result };
            return { id: hashId, name };
        } catch (e) {
            console.warn('getTable error', e);
        }
    }

    getTable(hashId: string): ITableData | undefined {
        return this._tables[hashId]?.data;
    }

    private _createTable(file: string) {
        const ext = path.extname(file);
        const Model = Models.find((model) => model.getExtensions().includes(ext.replace('.', '')));
        if (!Model) {
            throw new Error(`invalid type: ${ext}`);
        }
        return {
            name: path.basename(file),
            table: new Model(),
        };
    }
}

export default new DataTableManager();
