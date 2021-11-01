// import React, {useEffect, useState,useCallback} from "react";
import css from './index.module.css';
import PdfLoadTask from "../../Atom/PdfLoadTask";

export default function PageDocument() {

    return <div className={css.wrap}>
        {/*<PdfLoadTask pdfUrl='./pdfs/doc1.pdf'/>*/}
        <PdfLoadTask pdfUrl='https://s-cd-920-oss-assets.oss.dogecdn.com/doc3.pdf'/>
    </div>
}