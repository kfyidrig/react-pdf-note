import React from "react";

export default React.createContext({
    pageScale: 0,
    setScale: ()=>console.log('调用了默认setScale'),
    pdfUrl: null,
    setPdfUrl: ()=>console.log('调用了默认setPdfUrl')
});