import styled from 'styled-components';
import { Theme } from '../../../types/theme';


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
        `,
    },
};

export default Theme;
