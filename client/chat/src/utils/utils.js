import React from 'react';

export const formatDate =
    dt => (<span>@ {dt.getHours()} : {dt.getMinutes() < 10 ? ('0' + dt.getMinutes()) : dt.getMinutes()}</span>);

export const setElementColor = color => ({ color });
