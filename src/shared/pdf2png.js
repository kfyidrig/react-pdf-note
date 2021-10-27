import {getDocument,GlobalWorkerOptions,PDFWorker} from 'pdfjs-dist/legacy/build/pdf.js';

// Some PDFs need external cmaps.
const CMAP_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/cmaps/";
const CMAP_PACKED = true;
const WORKER_URL= "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/legacy/build/pdf.worker.min.js";
GlobalWorkerOptions.workerSrc=WORKER_URL;

// 创建一个worker防止pdf.js每次自动创建
const fetchWorker=new PDFWorker();

const getPdfDoc= document=>
    getDocument({
        url: document,
        worker: fetchWorker,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        fontExtraProperties: true,
    });

const getPdfPage=(pdfDocumentProxy,pageNum)=>{
    const {numPages}=pdfDocumentProxy;
    if(numPages<1) throw new RangeError(`pdf文档页数为${numPages}`);
    else if(pageNum<1 || pageNum>numPages) throw new RangeError(`加载第${pageNum}页，超出当前pdf文档页数范围`);
    return pdfDocumentProxy.getPage(pageNum);
}

const getViewport=(pdfDocumentProxy,idealWidth)=>{
    return getPdfPage(pdfDocumentProxy,1).then(page=>{
        const viewport = page.getViewport({scale: 1.0});
        const scale=idealWidth/(viewport.width);
        return page.getViewport({
            scale
        });
    });
};

export {
    getPdfDoc,
    getPdfPage,
    getViewport
};