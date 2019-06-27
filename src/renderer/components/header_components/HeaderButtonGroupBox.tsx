import React, { ReactElement, ReactNode } from 'react';
import ThemeSelector from '../../helper/themeSelector';

const ButtonGroup = ThemeSelector.getThemeComponent<'div'>('header.buttonGroup');

export default (props: { children: ReactNode }): ReactElement => (
    <ButtonGroup className={'group_box'}>{props.children}</ButtonGroup>)
