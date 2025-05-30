// components/HeaderButton.js
import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomHeaderButton = (props) => (
    <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={23}
        color="#fff"
    />
);

export default CustomHeaderButton;
