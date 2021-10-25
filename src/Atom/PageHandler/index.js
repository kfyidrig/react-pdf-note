import css from './index.module.css';
import {useEffect, useMemo, useState,useContext} from 'react';
import {handleDoc, handlePage} from "../../shared/pdf2png";
import PdfPage from "../PdfPage";
import PageAndBarContext from "../../shared/pageContext";
import TaskProgress from "../TaskProgress";

export default function PageAnnotate(){
    const {pageScale,pdfUrl}=useContext(PageAndBarContext);

    // 在pdf文档链接变化时加载pdfDocTask
    const pdfDocTask=useMemo(()=> {
        if(!pdfUrl){

        }
        return handleDoc(pdfUrl);
    },[pdfUrl]);

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
            const viewport = page.getViewport({scale: 1.0});
            const scale=(1280/(viewport.width)).toFixed(1);
            pdfStore.firstPage=page;
            pdfStore.viewport=page.getViewport({
                scale: + scale
            });
            setPdfStore({...pdfStore});
        }
        const getPage=async proxy=>{
            const {numPages}=proxy;
            if(numPages<1) throw new RangeError(`pdf文档页数为${numPages}`);
            pdfStore.pdfProxy?.destroy();
            pdfStore.pdfProxy?.cleanup();
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

    return <div className={css.warp}>
        {pdfDocTask && !(pdfStore.pdfProxy)?
            <TaskProgress loadingTask={pdfDocTask} />
            :
            Array.from(new Array(pdfStore.pdfProxy.numPages),(item,index)=>{
                const pageNum=index+1;
                return <PdfPage
                    key={`${pageNum}${pdfUrl}`}
                    pdfStore={pdfStore}
                    pageNum={pageNum}
                />
            })
        }
    </div>
}