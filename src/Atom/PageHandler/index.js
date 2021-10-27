import css from './index.module.css';
import {useEffect, useMemo, useState, useContext, useCallback, useRef} from 'react';
import {getPdfDoc, getViewport} from "../../shared/pdf2png";
import PdfPage from "../PdfPage";
import PageAndBarContext from "../../shared/pageContext";
import TaskProgress from "../TaskProgress";
import {removeAllTarget} from "../../shared/scrollListen";

export default function PageAnnotate(){
    const statusRef=useRef({
        completeFlag: false
    });

    const {pdfUrl}=useContext(PageAndBarContext);

    // 在pdf文档链接变化时加载pdfDocTask
    const pdfDocLoadingTask=useMemo(()=>{
        statusRef.current.completeFlag=false;
        removeAllTarget();
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

    useEffect(function () {
        if(pdfDocProxy) getViewport(pdfDocProxy,1280).then(view=>{
            statusRef.current.completeFlag=true;
            setViewport(view);
        });
    },[pdfDocProxy]);

    const {completeFlag}=statusRef.current;

    if(!completeFlag) return <div className={css.warp}>
        <TaskProgress loadingTask={pdfDocLoadingTask} />
    </div>

    return <div className={css.warp}>
        {Array.from(new Array(pdfDocProxy.numPages), (item, index) => {
            const pageNum = index + 1;
            return <PdfPage
                key={`${pageNum}${pdfUrl}`}
                pdfDocProxy={pdfDocProxy}
                viewport={viewport}
                pageNum={pageNum}
            />
        })}
    </div>
}