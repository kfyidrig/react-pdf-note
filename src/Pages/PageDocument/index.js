import React, {useEffect, useState,useMemo} from "react";
import css from './index.module.css';
import LeftBar from "../../Atom/LeftBar";
import RightBar from "../../Atom/RightBar";
import NotePdf from "../../Atom/NotePdf";
import PageAndBarContext from "../../shared/pageContext";
import wrapRef from "../../shared/wrapRef";

export default function PageDocument() {
    const [wrapWidth,setWidth]=useState(0);
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
            {wrapRef.current && wrapWidth?
                <NotePdf
                    wrapRef={wrapRef}
                    pdf='https://s-cd-920-oss-assets.oss.dogecdn.com/doc1.pdf'
                />
                :
                null
            }
            <RightBar />
        </PageAndBarContext.Provider>
    </div>
}