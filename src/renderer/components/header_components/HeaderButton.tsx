import React from 'react';
import Theme from '../../themes/default';

const HeaderButton = Theme.header.button;

interface IProps {
    enabledIcon: string;
    disabledIcon: string;
    disabled: boolean;
}

export default ({ enabledIcon, disabledIcon, disabled }: IProps) => {
    console.log(enabledIcon, disabledIcon, disabled);
    return <HeaderButton
        icon={disabled ? disabledIcon : enabledIcon}
        disabled={disabled}
    />
}
