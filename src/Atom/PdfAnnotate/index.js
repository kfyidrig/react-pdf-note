import React, {useState, useMemo, useCallback} from "react";
import css from './index.module.css';
import TopBar from "../TopBar";
import PageAnnotate from "../PageHandler";
import PageAndBarContext from "../../shared/pageContext";
import {initScrollListener} from "../../shared/scrollListen";

export default function PdfAnnotate({pdf}) {
    const [docWidth,setDocWidth]=useState({
        wrapWidth: 0,
        userScale: 0,
        zoomValue: 0
    });
    const measuredRef=useCallback(node => {
        if (node !== null) {
            initScrollListener(node);
            const {width}=node.getBoundingClientRect();
            setDocWidth({
                wrapWidth: width,
                userScale: Math.floor(width<600?width-16:width*0.7)
            });
        }
    }, []);

    const providerValue=useMemo(()=>{
        return {
            docWidth,
            setDocWidth,
            pdfUrl: pdf,

        }
    },[docWidth,pdf]);

    return <div className={css.wrap} ref={measuredRef}>
        <PageAndBarContext.Provider value={providerValue}>
            {docWidth.userScale ? <PageAnnotate /> : null}
            <TopBar />
        </PageAndBarContext.Provider>
    </div>
}