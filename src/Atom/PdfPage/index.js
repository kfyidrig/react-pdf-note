import css from './index.module.css'
import React, {useEffect, useState,useCallback} from "react";
import {handlePage} from "../../shared/pdf2png";
import {addListenTarget} from "../../shared/scrollListen";

const dpi=devicePixelRatio;

function NoteAndCanvas({pdfPage,view}){
    const canvasRef=React.createRef();
    useEffect(function () {
        const canvas=canvasRef.current;
        canvas.width=(view.width);
        canvas.height=(view.height);
        const context=canvas.getContext('2d');
        pdfPage.render({
            viewport: view,
            canvasContext: context
        })
    },[canvasRef,view,pdfPage]);
    return <canvas
        ref={canvasRef}
        style={{
            width: ~~(view.width/dpi),
            height: ~~(view.height/dpi)
        }}
    />
}

export default function PdfPage({pageNum,pdfDocProxy,wrapWidth}){
    const pageRef=React.createRef();
    const [showPage,setShow]=useState(false);
    const [pdfScale,setScale]=useState(0);
    const [pdfPage,setPdfPage]=useState(null);
    const [viewport,setViewport]=useState(null);

    const handleShow=useCallback((status)=>{
        console.info(status,pageNum);
        setShow(status==='show');
    },[pageNum]);

    useEffect(function () {
        if(showPage) handlePage(pdfDocProxy,pageNum).then(setPdfPage);
    },[pdfDocProxy,pageNum,showPage]);

    useEffect(function () {
        if(pdfPage){
            const viewport = pdfPage.getViewport({scale: 1.0});
            const scale=(~~( (dpi * wrapWidth/(viewport.width)) * 10))/10;
            setScale(scale);
        }
    },[wrapWidth,pdfPage]);

    useEffect(function () {
        if(pdfScale){
            console.log(pdfScale)
            setViewport(pdfPage.getViewport({
                scale: pdfScale
            }));
        }
    },[pdfScale,pdfPage]);

    useEffect(function () {
        if(!pageRef.current) throw new TypeError('pageRef 不存在');
        addListenTarget(pageRef.current,pageNum,handleShow);
    },[handleShow, pageNum, pageRef]);

    return <div
        className={css.wrap}
        data-page={`${pageNum}`}
        ref={pageRef}
        style={{
            width: viewport?Math.floor(viewport.width/dpi) : 0,
            height: viewport?Math.floor(viewport.height/dpi) : 0 || '1000px'
        }}>
        {showPage && viewport?
            <NoteAndCanvas
                view={viewport}
                pdfPage={pdfPage}
                pageNum={pageNum}
            />
            :
            null
        }
    </div>
}