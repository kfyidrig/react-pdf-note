import React, {useEffect, useState,useMemo} from "react";
import css from './index.module.css';
import LeftBar from "../../Atom/LeftBar";
import RightBar from "../../Atom/RightBar";
import NotePdf from "../../Atom/NotePdf";
import PageAndBarContext from "../../shared/pageContext";
import wrapRef from "../../shared/wrapRef";

export default function PdfDoc({pdfs}) {
    if(Array.isArray(pdfs)){
        throw new TypeError('pdfs属性应该是数组');
    } else if(pdfs.length<1){
        throw new RangeError('pdfs数组长度至少应该大于0');
    }
    const [currentPdf,setWidth]=useState(pdfs[0]);
    const [pageScale,setScale]=useState(0);

    const providerValue=useMemo(()=>{
        return {
            pageScale,
            setScale,
        }
    },[setScale,pageScale]);

    useEffect(function () {
        // 用异步去获取宽度，解决chrome获取宽度为0
        setTimeout(()=>{
            if(!wrapRef.current.offsetWidth){
                throw new RangeError('wrapRef宽度为0');
            }
            setWidth(wrapRef.current.offsetWidth);
        },100);
    },[]);

    return <div className={css.wrap} ref={wrapRef}>
        <PageAndBarContext.Provider value={providerValue}>
            <LeftBar  />
            {wrapRef.current?
                <NotePdf
                    wrapRef={wrapRef}
                    pdf={currentPdf}
                />
                :
                null
            }
            <RightBar />
        </PageAndBarContext.Provider>
    </div>
}