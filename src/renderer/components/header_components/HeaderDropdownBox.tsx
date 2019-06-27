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
        box-sizing: content-box;
        min-width: 46px;
        height: 14px;
        padding: 6px 24px 6px 8px;
        margin-top: 1px;
        background-color: #6e97ff;
        border: 1px solid #9ab6ff;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        letter-spacing: -0.6px;
        line-height: 14px;
        cursor: pointer;

        &:after {
            font-size: 0;
            position: absolute;
            right: 8px;
            top: 40%;
            width: 8px;
            height: 6px;
            content: '';
            background: ${(props) => {
                const url = props.on
                    ? `${assetPath}btn_workspace_arr_on.png`
                    : `${assetPath}btn_workspace_arr.png`;
                return `url(${url}) no-repeat;`;
            }};
            background-size: 8px auto;
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
                    {this.props.children}
                </DropdownText>
                {this.makeDropdown()}
            </div>
        );
    }
}

export default HeaderDropdownText
