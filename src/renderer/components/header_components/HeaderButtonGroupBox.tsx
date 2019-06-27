import React, { ReactElement, ReactNode } from 'react';
import ThemeSelector from '../../helper/themeSelector';

export default (props: { children: ReactNode }): ReactElement => {
    const ButtonGroup = ThemeSelector.getThemeComponent<'div'>('header.buttonGroup');
    return <ButtonGroup className={'group_box'}>{props.children}</ButtonGroup>;
}
