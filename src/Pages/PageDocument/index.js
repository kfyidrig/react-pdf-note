import React, {useEffect, useState} from "react";
import css from './index.module.css';
import LeftBar from "../../Atom/LeftBar";
import RightBar from "../../Atom/RightBar";
import NotePdf from "../../Atom/NotePdf";

const wrapRef=React.createRef();

export default function PageDocument() {
    const [wrapWidth,setWidth]=useState(0);
    useEffect(function () {
        setWidth(wrapRef.current.clientWidth);
    },[]);

    return <div className={css.wrap} ref={wrapRef}>
        <LeftBar />
        {wrapWidth?
            <NotePdf
                wrapRef={wrapRef}
                pdf='https://s-cd-920-oss-assets.oss.dogecdn.com/doc1.pdf'
            />
            :
            null
        }
        <RightBar />
    </div>
}