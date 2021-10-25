import {useEffect,useState} from 'react'
import css from "./index.module.css";

export default function TaskProgress({loadingTask}){

    const [progress,setProgress]=useState({
        loaded: 0,
        total: 100,
        toMbSize: null
    });

    useEffect(function () {
        loadingTask.onProgress=setProgress;
        return ()=> {
            loadingTask.onProgress = null;
        };
    },[loadingTask]);

    const percentage=`${Math.floor((progress.loaded/progress.total)*100)}%`;

    return <div className={css.progressWrap}>
        <div
            className={css.progressBar}
            style={{
                backgroundImage: `linear-gradient(to right,#16a085 0%,#16a085 ${percentage},#ecf0f1 ${percentage},#ecf0f1 100%)`
            }}
        />
        <p className={css.progressTip}>
            PDF加载中，目前 {percentage} (总共 {(progress.total / 1048576).toFixed(1)} MB)
        </p>
    </div>
};