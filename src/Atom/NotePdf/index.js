import css from './index.module.css';
import {useEffect, useMemo, useState} from 'react'
import {handleDoc} from "../../shared/pdf2png";
import PdfPage from "../PdfPage";
import {initScrollListener} from "../../shared/scrollListen";

const store={
    pdf: null,
    wrapWidth: 0
}

export default function NotePdf({pdf, wrapRef}){

    const [pdfDocProxy,setPdf]=useState(null);
    const [pdfPageTask,setPdfPage]=useState([]);

    useEffect(function () {
        if(!wrapRef.current) throw TypeError('NotePad父容器为空');
        store.wrapWidth=wrapRef.current.clientWidth - 280;
        initScrollListener(wrapRef.current);
    },[wrapRef]);

    useEffect(function () {
        if(store.pdf){

        } else {
            store.pdf=pdf;
            handleDoc(pdf).then(res=>{
                console.info('文档初始化成功');
                store.pdf=null;
                setPdf(res);
            });
        }
    },[pdf]);

    useEffect(function () {
        if(pdfDocProxy) setPdfPage(
            Array.from(new Array(pdfDocProxy.numPages), (item,index)=> false));
    },[pdfDocProxy]);

    return <div className={css.warp}>
        {pdfPageTask.map((page,pageNum)=>{
            return <PdfPage
                key={`${pageNum}${pdf}`}
                pageNum={pageNum+1}
                pdfDocProxy={pdfDocProxy}
                wrapWidth={store.wrapWidth}
            />
        })}
    </div>
}