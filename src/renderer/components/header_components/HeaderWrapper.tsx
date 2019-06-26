import React, { ReactNode } from 'react';
import Theme from '../../themes/default';

const HeaderWrapper = Theme.header.wrapper;
export default ({ children }: { children: ReactNode }) =>
    <HeaderWrapper className={'common_gnb'}>{children}</HeaderWrapper>;
