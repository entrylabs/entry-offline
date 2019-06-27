import React from 'react';
import ThemeSelector from '../../helper/themeSelector';


export default () => {
    const HeaderLogo = ThemeSelector.getThemeComponent<'div'>('header.logo');
    return <HeaderLogo className={'logo logo_gnb'}/>;
};
