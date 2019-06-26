import { StyledComponentBase } from 'styled-components';

export interface Theme {
    header: {
        wrapper: StyledComponentBase<'div', any, {}, never>,
        logo: StyledComponentBase<'h1', any>,
        projectTitle: StyledComponentBase<'input', any, {}, never>,
        buttonGroup: StyledComponentBase<'div', any, {}, never>,
        dropdownButton: {
            wrapper: StyledComponentBase<'div', any, {}, never>,
            anchor: StyledComponentBase<'a', any, {on: boolean, icon: string}, never>,
        }
    }
    workspace?: StyledComponentBase<'div', any, {}, never>,
}
