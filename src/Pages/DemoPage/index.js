// import React, {useEffect, useState,useCallback} from "react";
import css from './index.module.css';
import PdfAnnotate from "../../Atom/PdfAnnotate";

export default function PageDocument() {

    return <div className={css.wrap}>
        <PdfAnnotate pdf='https://s-cd-920-oss-assets.oss.dogecdn.com/doc3.pdf'/>
    </div>
}