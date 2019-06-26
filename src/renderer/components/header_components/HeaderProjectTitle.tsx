import React, { ReactElement } from 'react';
import styled from 'styled-components';

const Title = styled.input`
    width: 164px;
    border-radius: 4px;
    border: 0;
    box-sizing: content-box;
    background-color: #fff;
    padding: 6px 6px 4px;
    font-size: 12px;
    font-weight: 600;
    color: #2c313d;
    letter-spacing: -0.4px;
    line-height: 14px;
    float: left;
    margin-left: 16px;
`;

interface IProps {
    value: string;
    onBlur: (changed: string) => void;
}

const WorkspaceTitle = ({ value, onBlur }: IProps): ReactElement => (
    <Title
        className={'srch_box'}
        defaultValue={value}
        onBlur={(e) => onBlur(e.target.value)}
    />
);
export default WorkspaceTitle;
