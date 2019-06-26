import React, { ReactElement, ReactNode } from 'react';
import Theme from '../../themes/default';

const ButtonGroup = Theme.header.buttonGroup;

export default (props: { children: ReactNode }): ReactElement => (
    <ButtonGroup className={'group_box'}>{props.children}</ButtonGroup>)
