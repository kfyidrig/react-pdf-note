// Run `gulp dist-install` to generate 'pdfjs-dist' npm package files.
import {getDocument,SVGGraphics,GlobalWorkerOptions} from 'pdfjs-dist/legacy/build/pdf.js';

// Some PDFs need external cmaps.
const CMAP_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/cmaps/";
const CMAP_PACKED = true;
const WORKER= "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/legacy/build/pdf.worker.min.js";
GlobalWorkerOptions.workerSrc=WORKER;

// Will be using promises to load document, pages and misc data instead of
// callback.

export default function pdf2svg(data,progress) {
  const loadingTask = getDocument({
    data,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    fontExtraProperties: true,
  });
  const handlePdf=async (doc)=>{
      const numPages = doc.numPages;
      console.log("PDF已加载，开始转换SVG/PNG");

      for(let pageNum=1;pageNum<=numPages;pageNum++){
          await doc.getPage(pageNum).then(page=>{
              const viewport = page.getViewport({ scale: 1.0 });
              console.log("Page: "+pageNum+", Size: " + viewport.width + "x" + viewport.height);
              return page.getOperatorList().then(opList=>{
                  const svgGfx = new SVGGraphics(page.commonObjs, page.objs);
                  return svgGfx.getSVG(opList, viewport).then(function (svg) {
                      progress?.(svg.outerHTML,pageNum);
                      return null;
                  });
              });
          })
      }
  }
  loadingTask.promise.then(handlePdf);
  // loadingTask.promise
  //     .then(function (doc) {
  //       const numPages = doc.numPages;
  //       console.log("PDF已加载，开始转换SVG/PNG");
  //
  //       let lastPromise = Promise.resolve(); // will be used to chain promises
  //       const loadPage = function (pageNum) {
  //         return doc.getPage(pageNum).then(function (page) {
  //           console.log("Page " + pageNum);
  //           const viewport = page.getViewport({ scale: 1.0 });
  //           console.log("Size: " + viewport.width + "x" + viewport.height);
  //           console.log();
  //
  //           return page.getOperatorList().then(function (opList) {
  //             const svgGfx = new SVGGraphics(page.commonObjs, page.objs);
  //             svgGfx.embedFonts = true;
  //             return svgGfx.getSVG(opList, viewport).then(function (svg) {
  //               result.push(svg);
  //             });
  //           });
  //         });
  //       };
  //
  //       for (let i = 1; i <= numPages; i++) {
  //         lastPromise = lastPromise.then(loadPage.bind(null, i));
  //       }
  //       return lastPromise;
  //     }).then(()=>{
  //         return Promise.resolve(result);
  //     })
}