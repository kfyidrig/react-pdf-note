import css from './index.module.css';
import {useEffect, useMemo, useState,useContext} from 'react';
import {handleDoc, handlePage} from "../../shared/pdf2png";
import PdfPage from "../PdfPage";
import {initScrollListener} from "../../shared/scrollListen";
import PageAndBarContext from "../../shared/pageContext";

const store={
    pdf: null,
    wrapWidth: 0
}

const PdfProgress=({loadingTask})=>{

    const [progress,setProgress]=useState({
        loaded: 0,
        total: 100,
        toMbSize: null
    });

    useEffect(function () {
        loadingTask.onProgress=setProgress;
        return ()=> {
            loadingTask.onProgress = null;
        };
    },[loadingTask]);

    const percentage=`${Math.floor((progress.loaded/progress.total)*100)}%`;

    return <div className={css.progressWrap}>
        <div
            className={css.progressBar}
            style={{
                backgroundImage: `linear-gradient(to right,#16a085 0%,#16a085 ${percentage},#ecf0f1 ${percentage},#ecf0f1 100%)`
            }}
        />
        <p className={css.progressTip}>
            PDF加载中，目前 {percentage} (总共 {(progress.total / 1048576).toFixed(1)} MB)
        </p>
    </div>
};

export default function NotePdf({pdf, wrapRef}){
    const {pageScale}=useContext(PageAndBarContext);
    const wrapWidth=wrapRef.current.clientWidth;

    // 在pdf文档链接变化时加载pdfDocTask
    const pdfDocTask=useMemo(()=>handleDoc(pdf),[pdf]);

    // 储存加载完成后的pdf的代理对象和viewport
    const [pdfStore,setPdfStore]=useState({
        pdfProxy: null,
        viewport: null,
        firstPage:null
    });

    /**
     * @Description: 获取加载成功的pdfDocTask信息储存在pdfStore中
     * @author Liu Can
     * @email 313720186@qq.com
     * @date 2021/10/16
     * @param {object} proxy
     * @return void
    */
    useEffect(function () {
        const getViewport=page=>{
            const width=wrapWidth>500 ? wrapWidth-240 : 500;
            const viewport = page.getViewport({scale: 1.0});
            const scale=(devicePixelRatio * width/(viewport.width)).toFixed(1);
            pdfStore.firstPage=page;
            pdfStore.viewport=page.getViewport({
                scale: + scale
            });
            setPdfStore({...pdfStore});
        }
        const getPage=async proxy=>{
            const {numPages}=proxy;
            if(numPages<1) throw new RangeError(`pdf文档页数为${numPages}`);
            pdfStore.pdfProxy=proxy;
            handlePage(proxy,1).then(getViewport);
        }
        pdfDocTask.promise.then(getPage);
        // eslint-disable-next-line
    },[pdfDocTask]);

    useEffect(function () {
        if(pdfStore.viewport){
            const lastScale=pageScale + pdfStore.viewport.scale;
            setPdfStore({
                ...pdfStore,
                viewport: pdfStore.firstPage.getViewport({
                    scale: lastScale
                })
            });
        }
        // eslint-disable-next-line
    },[pageScale]);

    // 初始化监听器，在另一个线程中监听父容器滚动
    useEffect(function () {
        if(!wrapRef.current) throw TypeError('NotePad父容器为空');
        store.wrapWidth=wrapWidth - 240;
        initScrollListener(wrapRef.current);
    },[wrapRef,wrapWidth]);

    return <div className={css.warp}>
        {pdfDocTask && !(pdfStore.pdfProxy)?
            <PdfProgress loadingTask={pdfDocTask} />
            :
            Array.from(new Array(pdfStore.pdfProxy.numPages),(item,index)=>{
                const pageNum=index+1;
                return <PdfPage
                    key={`${pageNum}${pdf}`}
                    pdfStore={pdfStore}
                    pageNum={pageNum}
                />
            })
        }
    </div>
}