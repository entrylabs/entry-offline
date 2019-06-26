import { StyledComponentBase } from 'styled-components';

export interface Theme {
    header: {
        wrapper: StyledComponentBase<'div', any, {}, never>,
        logo: StyledComponentBase<'h1', any>,
        projectTitle: StyledComponentBase<'input', any, {}, never>,
        buttonGroup: StyledComponentBase<'div', any, {}, never>,
    }
    workspace?: StyledComponentBase<'div', any, {}, never>,
}
