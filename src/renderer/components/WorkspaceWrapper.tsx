import React, { ReactNode } from 'react';
import Theme from '../themes/default';

const WorkspaceWrapper = Theme.workspace;
export default (props: { children: ReactNode }) => (WorkspaceWrapper ?
    <WorkspaceWrapper>{props.children}</WorkspaceWrapper> : props.children)
