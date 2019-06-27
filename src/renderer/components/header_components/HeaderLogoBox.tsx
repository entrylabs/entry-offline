import React from 'react';
import ThemeSelector from '../../helper/themeSelector';

const HeaderLogo = ThemeSelector.getThemeComponent<'div'>('header.logo');
export default () => (<HeaderLogo className={'logo logo_gnb'} />);
