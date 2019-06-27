import React, { ReactElement } from 'react';
import ThemeSelector from '../../helper/themeSelector';

const Title = ThemeSelector.getThemeComponent<'input', {}>('header.projectTitle');

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
