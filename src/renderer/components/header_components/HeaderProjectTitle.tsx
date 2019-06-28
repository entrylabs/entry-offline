import React, { ReactElement } from 'react';
import ThemeSelector from '../../helper/themeSelector';

interface IProps {
    value: string;
    onBlur: (changed: string) => void;
}

const WorkspaceTitle = ({ value, onBlur }: IProps): ReactElement => {
    const Title = ThemeSelector.getThemeComponent<'input', {}>('header.projectTitle');
    return <Title
        className={'srch_box'}
        defaultValue={value}
        key={value}
        onBlur={(e) => onBlur(e.target.value)}
    />;
};
export default WorkspaceTitle;
