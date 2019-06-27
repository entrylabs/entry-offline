import React, { ReactNode } from 'react';
import ThemeSelector from '../helper/themeSelector';

export default (props: { children: ReactNode }) => {
    const WorkspaceWrapper = ThemeSelector.getThemeComponent<'div', any>('workspace');
    if (WorkspaceWrapper) {
        return <WorkspaceWrapper>{props.children}</WorkspaceWrapper>;
    } else {
        return props.children;
    }
}
