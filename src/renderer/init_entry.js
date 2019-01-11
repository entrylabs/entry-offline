import root from 'window-or-global';
import EntryStatic from './resources/static.js';
import { EntryStatic as EntryStaticMini } from './bower_components/entry-js/extern/util/static_mini';
import _ from 'lodash';
import jquery from 'jquery';
import { BigNumber } from 'bignumber.js';

// EntryStatic
root.EntryStatic = EntryStaticMini;

// lodash
root._ = _;

// jquery
// eslint-disable-next-line no-multi-assign, id-length
root.$ = root.jQuery = jquery;

// bigNumber
root.BigNumber = BigNumber;

// entry-lms dummy
root.entrylms = {
    alert: (text) => {
        alert(text);
    },
    confirm: (text) => {
        const isConfirm = confirm(text);
        const defer = new root.$.Deferred();
        return defer.resolve(isConfirm);
    },
};
