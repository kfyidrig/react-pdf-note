import React,{useEffect} from "react";
import css from './index.module.css';
import LeftBar from "../../Atom/LeftBar";
import RightBar from "../../Atom/RightBar";
import NotePdf from "../../Atom/NotePdf";

export default function PageDocument() {
    const wrapRef=React.createRef();

    return <div className={css.wrap} ref={wrapRef}>
        <LeftBar />
        <NotePdf
            wrapRef={wrapRef}
            pdf='https://s-cd-920-oss-assets.oss.dogecdn.com/doc1.pdf'
        />
        <RightBar />
    </div>
}