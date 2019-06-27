import React from 'react';
import styled from 'styled-components';
import { Dropdown } from "@entrylabs/tool/component";

/**
 * 이 컴포넌트는 엔트리라인의 가이드가 없기 때문에 기존 sass 를 뜯어오기만 한다.
 */
const assetPath = '../src/renderer/resources/images/gnb/';

const DropdownText = styled.a<{on: boolean}>`
        position: relative;
        //margin-left: 10px;
        display: block;
        margin-top: 8px;
        margin-right: 14px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        letter-spacing: -0.6px;
        line-height: 15px;
        cursor: pointer;

        &:after {
            font-size: 0;
            position: absolute;
            right: -12px;
            top: 40%;
            width: 6px;
            height: 4px;
            content: '';
            background: ${(props) => {
                const url = props.on
                    ? `${assetPath}btn_workspace_arr_on.png`
                    : `${assetPath}btn_workspace_arr.png`;
                    return `url(${url}) no-repeat;`;
            }};
            background-size: 6px auto;
        }
`;

type DropdownItemTuple = [string, string];
interface IProps {
    items: DropdownItemTuple[];
    animate?: boolean;
    onSelect: ([key, value]: DropdownItemTuple) => void;
}

interface IState {
    on: boolean;
}

class HeaderDropdownText extends React.Component<IProps, IState> {
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
            <div style={{display: 'inline-block'}}>
                <DropdownText
                    ref={this.dom}
                    onClick={this.clickHandler}
                    on={this.state.on}
                >
                    <span>{this.props.children}</span>
                </DropdownText>
                {this.makeDropdown()}
            </div>
        );
    }
}

export default HeaderDropdownText
