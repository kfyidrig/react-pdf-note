import css from './index.module.css'
import React, {useEffect, useState,useMemo,useCallback} from "react";
import {getPdfPage} from "../../shared/pdf2png";
import {addListenTarget} from "../../shared/scrollListen";

const dpi=devicePixelRatio;

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
            },200);
        });
        return ()=>{
            clearTimeout(timer);
        };
        // eslint-disable-next-line
    },[view]);
    return <canvas
        ref={canvasRef}
        style={{
            width: ~~(view.width/dpi),
            height: ~~(view.height/dpi)
        }}
    />
}

export default function PdfPage({pdfDocProxy,viewport,pageNum}){
    const [showPage,setShow]=useState(false);
    const pageRef=useMemo(()=>React.createRef(),[]);

    const handleShow=useCallback((status)=>{
        setShow(status==='show');
    },[]);

    useEffect(function () {
        if(!pageRef.current) throw new TypeError('pageRef 不存在');
        addListenTarget(pageRef.current,pageNum,handleShow);
        // eslint-disable-next-line
    },[]);

    return <div
        ref={pageRef}
        data-page={pageNum}
        className={css.wrap}
        style={{
            width: Math.floor(viewport.width/dpi),
            height: Math.floor(viewport.height/dpi)
        }}>
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