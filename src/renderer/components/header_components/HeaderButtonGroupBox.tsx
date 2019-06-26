import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

const ButtonGroup = styled.div`
        float: right;
`;

export default (props: {children: ReactNode}): ReactElement => (<ButtonGroup className={'group_box'}>{props.children}</ButtonGroup>)
