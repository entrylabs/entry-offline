import React from 'react';
import styled from 'styled-components';

const assetPath = '../src/renderer/resources/images/gnb/';

const HeaderLogo = styled.h1`
    float: left;
    width: 88px;
    height: 18px;
    background: url(${assetPath}logo_gnb.png) no-repeat;
    background-size: 88px auto;
`;

export default () => (<HeaderLogo className={'logo logo_gnb'} />);
