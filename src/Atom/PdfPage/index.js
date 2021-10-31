import css from './index.module.css'
import React, {useEffect, useState, useCallback, useRef} from "react";
import {getPdfPage} from "../../shared/pdf2png";
import {addListenTarget, removeTarget} from "../../shared/scrollListen";

function NoteAndCanvas({pageNum,view,proxy}){
    const canvasRef=React.createRef();

    useEffect(function () {
        const renderToCanvas=page=>{
            page.cleanupAfterRender=true;
            const canvas=canvasRef.current;
            if(!canvas){
                console.warn(`渲染${pageNum}时画布为空`);
                return;
            }
            canvas.width=(view.width);
            canvas.height=(view.height);
            const context=canvas.getContext('2d');
            page.render({
                viewport: view,
                canvasContext: context
            });
        }
        let timer=null;
        getPdfPage(proxy,pageNum).then(page=>{
             timer=setTimeout(()=>{
                renderToCanvas(page);
            },230);
        });
        return ()=>{
            clearTimeout(timer);
        };
        // eslint-disable-next-line
    },[view]);
    return <canvas
        className={css.pdfCanvas}
        ref={canvasRef}
    />
}

export default function PdfPage({pdfDocProxy,viewport,pageNum,docSize}){
    const [showPage,setShow]=useState(false);
    const pageRef=useRef();

    const handleShow=useCallback((state)=>{
        setShow(state==='show');
    },[]);

    useEffect(function () {
        const element=pageRef.current;
        if(!element) throw new TypeError('pageRef 不存在');
        addListenTarget(element,pageNum,handleShow);
        return ()=>{
            removeTarget(element);
        }
        // eslint-disable-next-line
    },[]);

    return <div
        ref={pageRef}
        data-page={pageNum}
        className={css.wrap}
        style={docSize}>
        {showPage?
            <NoteAndCanvas
                proxy={pdfDocProxy}
                pageNum={pageNum}
                view={viewport}
            />
            :
            null
        }
    </div>
}