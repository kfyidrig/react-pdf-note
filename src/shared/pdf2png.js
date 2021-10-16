import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist/legacy/build/pdf.js';

// Some PDFs need external cmaps.
const CMAP_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/cmaps/";
const CMAP_PACKED = true;
const WORKER= "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/legacy/build/pdf.worker.min.js";
GlobalWorkerOptions.workerSrc=WORKER;

const handlePage=async (doc,pageNum)=> {
    return doc.getPage(pageNum);
}

const handleDoc= document=>{
  const loadingTask = getDocument({
    url:document,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    fontExtraProperties: true,
  });
  return loadingTask;
}

export {
    handleDoc,
    handlePage
};