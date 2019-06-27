import React, { ReactNode } from 'react';
import Theme from '../../themes/default';

const HeaderButton = Theme.header.button;

interface IProps {
    enabledIcon: string;
    disabledIcon: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}

export default ({ onClick, enabledIcon, disabledIcon, disabled, children }: IProps) => {
    console.log(enabledIcon, disabledIcon, disabled);
    return <HeaderButton
        icon={disabled ? disabledIcon : enabledIcon}
        onClick={onClick}
        disabled={disabled}
    >
        <span style={{display: enabledIcon ? 'block' : 'none'}}>{children}</span>
    </HeaderButton>
}
