import React, { ReactNode } from 'react';
import ThemeSelector from '../../helper/themeSelector';

export default ({ children }: { children: ReactNode }) =>{
    const HeaderWrapper = ThemeSelector.getThemeComponent<'div'>('header.wrapper');
    return <HeaderWrapper className={'common_gnb'}>{children}</HeaderWrapper>;
}
