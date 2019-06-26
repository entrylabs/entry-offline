import React from 'react';
import styled from 'styled-components';

const assetPath = '../src/renderer/resources/theme/line/';

const HeaderLogo = styled.h1`
    float: left;
    position: relative;
    display: inline-block;
    width: 113px;
    height: 20px;
    background: url(${assetPath}ic_line_entry_gnb.png) no-repeat 0 0;
    background-size: 113px auto;
    vertical-align: top;
    z-index: 10;
`;

export default HeaderLogo;
