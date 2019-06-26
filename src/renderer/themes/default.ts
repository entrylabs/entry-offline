import styled, { StyledComponentBase } from 'styled-components';

interface Theme {
    header: {
        logo: StyledComponentBase<'h1', any>,
        projectTitle: StyledComponentBase<'input', any, {}, never>,
        buttonGroup: StyledComponentBase<'div', any, {}, never>,
    }
}

const assetPath = '../src/renderer/resources/images/gnb/';
const Theme: Theme = {
    header: {
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
        `,
    },
};

export default Theme;
