import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

const ButtonGroup = styled.div`
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 10;
    padding: 5px;
    & > div {
        vertical-align: top;
        margin-left: 10px;
    }
    span {
        margin-top: 5px;
    }
    & > hr:first-child {
        display: none;
    }
    hr {
        margin-left: 13px;
        margin-right: 3px;
        display: inline-block;
        width: 1px;
        border: none;
        border-left: 1px solid #fff;
        height: 16px;
    }
`;

export default (props: {children: ReactNode}): ReactElement => (<ButtonGroup>{props.children}</ButtonGroup>)
