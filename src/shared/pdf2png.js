import {getDocument,GlobalWorkerOptions,PDFWorker} from 'pdfjs-dist/legacy/build/pdf.js';

console.log('加载pdfjs')

// Some PDFs need external cmaps.
const CMAP_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/cmaps/";
const CMAP_PACKED = true;
const WORKER_URL= "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/legacy/build/pdf.worker.min.js";
GlobalWorkerOptions.workerSrc=WORKER_URL;

// 创建一个worker防止pdf.js每次自动创建
const fetchWorker=new PDFWorker();

const handlePage=async (doc,pageNum)=> {
    return doc.getPage(pageNum);
}

const handleDoc= document=>
    getDocument({
        url: document,
        worker: fetchWorker,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        fontExtraProperties: true,
    })

export {
    handleDoc,
    handlePage
};