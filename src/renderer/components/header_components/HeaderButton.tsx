import React, { ReactNode } from 'react';
import ThemeSelector from '../../helper/themeSelector';

const HeaderButton = ThemeSelector.getThemeComponent<'div', {icon: string, disabled: boolean}>('header.button');

interface IProps {
    enabledIcon: string;
    disabledIcon: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}

export default ({ onClick, enabledIcon, disabledIcon, disabled, children }: IProps) => {
    return <HeaderButton
        icon={disabled ? disabledIcon : enabledIcon}
        onClick={onClick}
        disabled={disabled}
    >
        <span style={{display: enabledIcon ? 'block' : 'none'}}>{children}</span>
    </HeaderButton>
}
