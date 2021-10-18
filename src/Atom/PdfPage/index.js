import css from './index.module.css'
import React, {useEffect, useState,useMemo,useCallback} from "react";
import {handlePage} from "../../shared/pdf2png";
import {addListenTarget} from "../../shared/scrollListen";

const dpi=devicePixelRatio;

function NoteAndCanvas({pageNum,view,proxy}){
    const canvasRef=React.createRef();

    useEffect(function () {
        handlePage(proxy,pageNum).then(page=>{
            const canvas=canvasRef.current;
            canvas.width=(view.width);
            canvas.height=(view.height);
            const context=canvas.getContext('2d');
            page.render({
                viewport: view,
                canvasContext: context
            })
        });
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

export default function PdfPage({pdfStore,pageNum}){

    // eslint-disable-next-line
    let updatedFlag=true;

    if(!pdfStore?.viewport || !pdfStore.pdfProxy) {
        throw new TypeError('PdfPage组件缺少参数');
    }

    const {viewport,pdfProxy}=pdfStore;
    const [showPage,setShow]=useState(false);
    const pageRef=useMemo(()=>React.createRef(),[]);

    const handleShow=useCallback((status)=>{
        console.log(status,pageNum)
        if(!updatedFlag) return;
        // eslint-disable-next-line
        updatedFlag=false;
        setShow(status==='show');
    },[pageNum]);

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
                proxy={pdfProxy}
                pageNum={pageNum}
                view={viewport}
            />
            :
            null
        }
    </div>
}