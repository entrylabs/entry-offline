import styled from 'styled-components';
import { Theme } from '../../../../../types/theme';


const assetPath = '../src/renderer/resources/images/gnb/';
const Theme: Theme = {
    header: {
        wrapper: styled.div`
            position: relative;
            min-width: 1024px;
            padding: 8px 8px 3px;
            background-color: #4f80ff;
            z-index: 300;
            &:after {
                display: block;
                clear: both;
                content: '';
            }
        `,
        logo: styled.h1`
            float: left;
            width: 88px;
            height: 18px;
            background: url(${assetPath}logo_gnb.png) no-repeat;
            background-size: 88px auto;
        `,
        projectTitle: styled.input`
            width: 164px;
            border-radius: 4px;
            border: 0;
            box-sizing: content-box;
            background-color: #fff;
            padding: 6px 6px 4px;
            font-size: 12px;
            font-weight: 600;
            color: #2c313d;
            letter-spacing: -0.4px;
            line-height: 14px;
            float: left;
            margin-left: 16px;
        `,
        buttonGroup: styled.div`
            float: right;
            & > div {
                vertical-align: top;
                margin-left: 10px;
            }
            span {
                margin-top: 5px;
            }
            & > hr:first-child {
                display: none;
            }
            hr {
                margin-left: 13px;
                margin-right: 3px;
                display: inline-block;
                width: 1px;
                border: none;
                border-left: 1px solid #fff;
                height: 16px;
            }
        `,
        dropdownButton: {
            wrapper: styled.div`
                display: inline-block;
                position: relative;
                font-size: 0;
            `,
            anchor: styled.a<{ on: boolean, icon: string }>`
                margin-top: 0;
                display: block;
                position: relative;
                overflow: hidden;
                width: 48px;
                height: 32px;
                border-radius: 16px;
                border-style: solid;
                border-width: 1px;
                border-color: #9ab6ff;
                background-color: #6e97ff;
                cursor: pointer;
                &:before {
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    width: 18px;
                    height: 18px;
                    margin-top: -9px;
                    content: '';
                    background: ${(props) => `url(${assetPath}btn_workspace_${props.icon}) no-repeat;`};
                    background-size: 18px auto;
                }
                &:after {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    width: 6px;
                    height: 4px;
                    margin-top: -2px;
                    content: '';
                    background: ${(props) => {
                        const url = props.on
                            ? `${assetPath}btn_workspace_arr_on.png`
                            : `${assetPath}btn_workspace_arr.png`;
                        return `url(${url}) no-repeat;`;
                    }};
                    background-size: 6px auto;
                }
            `,
        },
        button: styled.div<{ disabled: boolean, icon: string }>`
            display: inline-block;
            height: 32px;
            color: #fff;
            font-size: 12px;
            padding: 5px 13px;
            ${({ icon }) => {
                const url = `${assetPath}btn_workspace_${icon}`;
                return `
                    background: url(${url}) no-repeat;
                    background-size: 32px auto;
                    width: 32px;
                `;
            }}
            ${({ disabled }) => disabled ? 'cursor: pointer;' : 'cursor: default;'} 
        `,
    },
};

export default Theme;
