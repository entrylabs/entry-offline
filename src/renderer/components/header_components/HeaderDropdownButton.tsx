import React from 'react';
import { Dropdown } from '@entrylabs/tool/component';
import Theme from '../../themes/default';

const DropdownButton = Theme.header.dropdownButton;
const { wrapper: Wrapper, anchor: AnchorButton } = DropdownButton;

type DropdownItemTuple = [string, string];

interface IProps {
    icon: string;
    title?: string;
    items: DropdownItemTuple[];
    onSelect: ([key, value]: DropdownItemTuple) => void;
    animate?: boolean;
}

interface IState {
    on: boolean;
}

class DropdownIconButton extends React.Component<IProps, IState> {
    dom: React.RefObject<HTMLAnchorElement>;

    constructor(props: Readonly<IProps>) {
        super(props);
        this.dom = React.createRef();
        this.state = {
            on: false,
        };
    }

    makeDropdown() {
        if (!this.state.on) {
            return null;
        }
        const { animate = false, items = [] } = this.props;
        return (
            <Dropdown
                autoWidth
                animation={animate}
                items={items}
                positionDom={this.dom.current}
                onSelectDropdown={(item: any) => {
                    this.setState(
                        {
                            on: !this.state.on,
                        },
                        () => {
                            this.props.onSelect(item);
                        },
                    );
                }}
                outsideExcludeDom={[this.dom.current]}
                onOutsideClick={() => {
                    this.setState(
                        {
                            on: !this.state.on,
                        },
                    );
                }}
            />
        );
    }

    clickHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        this.setState(
            {
                on: !this.state.on,
            },
        );
    };

    render() {
        return (
            <Wrapper>
                <AnchorButton
                    title={this.props.title}
                    ref={this.dom}
                    onClick={this.clickHandler}
                    on={this.state.on}
                    icon={this.props.icon}
                />
                {this.makeDropdown()}
            </Wrapper>
        );
    }
}

export default DropdownIconButton;
