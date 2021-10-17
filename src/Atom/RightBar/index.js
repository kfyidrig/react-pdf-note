import css from './index.module.css';
import {useContext} from 'react';
import enlarge from '../../icons/enlarge.svg';
import PageAndBarContext from "../../shared/pageContext";
import reduce from '../../icons/reduce.png';

export default function RightBar(){
    const {setScale,pageScale}=useContext(PageAndBarContext);

    const handleEnlarge=()=>{
        setScale(pageScale>=0? pageScale+0.2 : 0.2);
    };
    const handleReduce=()=>{
        setScale(pageScale<=0? pageScale-0.2 : -0.2);
    };
    return <div className={css.warp}>
        <img src={enlarge} className={css.enlarge} onClick={handleEnlarge} title='放大' alt='放大'/>
        <img src={reduce} className={css.enlarge} onClick={handleReduce} title='缩小' alt='缩小'/>
    </div>
}