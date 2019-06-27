import { Theme } from '../../../types/theme';
import { merge, get } from 'lodash';
import defaultTheme from '../themes/default';
import { StyledComponent } from 'styled-components';

/**
 * 기본 엔트리 컴포넌트에 css 컴포넌트를 덮어쓰기한다.
 * 주로 헤더, 워크스페이스 css 를 수정할 수 있다.
 */
class ThemeSelector {
    constructor(
        private theme: Theme = defaultTheme,
        private currentThemeName: string = 'default',
    ) {
    };

    async overrideTheme(themeName: string = 'default'): Promise<void> {
        try {
            if (themeName === this.currentThemeName) {
                return;
            }

            const partialTheme = await import(`../themes/${themeName}`);
            this.currentThemeName = themeName;
            this.theme = merge(this.theme, partialTheme!.default);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * lodash.get 을 사용해 theme object depth 를 탐색하므로
     * 그와 동일한 방식으로 값을 가져와야 한다.
     * @param componentItem
     * @generic C HTMLElement 이름. ex) div, input ...
     * @generic O object | any styled-component 자체에서 커스텀 프로퍼티를 사용한 경우 정의.
     */
    public getThemeComponent<C extends keyof JSX.IntrinsicElements, O extends object = {}>(componentItem: string | string[]): StyledComponent<C, any, O> {
        return get(this.theme, componentItem);
    }
}

export default new ThemeSelector();
