import React from "react";

const PageAndBarContext=React.createContext({
    pageScale: 0,
    setScale: ()=>console.log('调用了默认setScale'),
});

export default PageAndBarContext;