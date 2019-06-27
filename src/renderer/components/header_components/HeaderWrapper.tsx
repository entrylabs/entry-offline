import React, { ReactNode } from 'react';
import ThemeSelector from '../../helper/themeSelector';

const HeaderWrapper = ThemeSelector.getThemeComponent<'div'>('header.wrapper');

export default ({ children }: { children: ReactNode }) =>
    <HeaderWrapper className={'common_gnb'}>{children}</HeaderWrapper>;
