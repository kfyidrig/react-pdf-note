import css from './index.module.css';
import {useEffect, useMemo, useState, useContext, useCallback, useRef,} from 'react';
import {getPdfDoc, getViewport} from "../../shared/pdf2png";
import PdfPage from "../PdfPage";
import PageAndBarContext from "../../shared/pageContext";
import TaskProgress from "../TaskProgress";
import pageContext from "../../shared/pageContext";
import scrollAnchor from "../../shared/scrollAnchor";
import scaleCheck from "../../shared/scaleCheck";

export default function PageAnnotate(){
    const statusRef=useRef({
        completeFlag: false,
        wrapRef: null,
        viewTask: 0,
        lastDocSize: null
    });

    const {pdfUrl,setDocWidth}=useContext(PageAndBarContext);

    // 将本组件的div存放在statusRef
    const handleRef=useCallback(node=>{
        if(node){
            statusRef.current.wrapRef=node;
            // 处理鼠标滚轮缩放
            node.addEventListener('wheel',event=>{
                const {ctrlKey,deltaY}=event;
                if(ctrlKey){
                    event.preventDefault();
                    event.stopPropagation();
                    if(scaleCheck(docWidth.userScale-deltaY)){
                        docWidth.userScale-=deltaY
                        setDocWidth({...docWidth});
                    }
                }
            });
        }
        // eslint-disable-next-line
    },[]);

    // 在pdf文档链接变化时加载pdfDocTask
    const pdfDocLoadingTask=useMemo(()=>{
        statusRef.current.completeFlag=false;
        return getPdfDoc(pdfUrl);
    },[pdfUrl]);

    // 储存每个链接对应的pdf文档代理
    const [pdfDocProxy,setProxy]=useState(null);

    /**
     * @Description: 更新pdfDocProxy指定值，并销毁之前实例
     * @author Liu Can
     * @email 313720186@qq.com
     * @date 2021/10/27
     * @param {pdfDocProxy} proxy
     * @return void
    */
    const handleNewProxy=useCallback(proxy=>{
        if(pdfDocProxy){
            pdfDocProxy.destroy();
            pdfDocProxy.cleanup();
        }
        setProxy(proxy);
        // eslint-disable-next-line
    },[]);

    // 在pdfDocLoadingTask更新后及时创建pdfDocProxy对象
    useEffect(function () {
        pdfDocLoadingTask.promise.then(handleNewProxy);
        // eslint-disable-next-line
    },[pdfDocLoadingTask]);

    // 储存pdfDocProxy对应的viewport，将每个页面视为一样大
    const [viewport,setViewport]=useState(null);

    const handleNewView=useCallback((proxy,width)=>{
        getViewport(proxy,width ).then(view=>{
            statusRef.current.completeFlag=true;
            setViewport(view);
        });
    },[]);

    // 初次加载完pdf和用户缩放时渲染计算viewpoint
    const {docWidth}=useContext(pageContext);
    useEffect(function () {
        if(pdfDocProxy && docWidth.userScale){
            clearTimeout(statusRef.current.viewTask);
            statusRef.current.viewTask=setTimeout(
                handleNewView.bind(null,pdfDocProxy,docWidth.userScale),
                300
            );
        }
        // eslint-disable-next-line
    },[pdfDocProxy,docWidth]);

    // 计算文档页面实际大小
    const {completeFlag}=statusRef.current;

    const docSize=useMemo(()=>{
        if(viewport) return {
            width: Math.floor(docWidth.userScale / devicePixelRatio),
            height: Math.floor(viewport.height * docWidth.userScale / viewport.width / devicePixelRatio)
        }
        return null;
        // eslint-disable-next-line
    },[docWidth,completeFlag]);

    // 在页面缩放时保持当前页面仍然在可视窗口
    useEffect(function () {
        if(docSize){
            scrollAnchor(
                statusRef.current.wrapRef,
                {
                    width: Math.floor(viewport.width /devicePixelRatio),
                    height: Math.floor(viewport.height / devicePixelRatio)
                },
                docSize
            );
        }
        // eslint-disable-next-line
    },[docSize]);

    if(!completeFlag) return <div className={css.warp}>
        <TaskProgress loadingTask={pdfDocLoadingTask} />
    </div>

    return <div
        className={css.warp}
        ref={handleRef}

    >
        {Array.from(new Array(pdfDocProxy.numPages), (item, index) => {
            const pageNum = index + 1;
            return <PdfPage
                key={`${pageNum}${pdfUrl}`}
                pdfDocProxy={pdfDocProxy}
                viewport={viewport}
                pageNum={pageNum}
                docSize={docSize}
            />
        })}
    </div>
}