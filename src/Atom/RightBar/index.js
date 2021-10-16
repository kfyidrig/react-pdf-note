import css from './index.module.css';
import {useContext} from 'react';
import PageAndBarContext from "../../shared/pageContext";

export default function RightBar(){
    const {setScale,pageScale}=useContext(PageAndBarContext);
    return <div className={css.warp}>
        <p onClick={()=>{
            setScale(pageScale+0.5)
        }
        }>+</p>
    </div>
}