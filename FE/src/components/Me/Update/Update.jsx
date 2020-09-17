import React, {useEffect, useState} from 'react';
import '../me.scss'
import Helper from "../../../utils/helpers/Helper";
import Link from "next/link";


function UpdateMe(props) {

    const [avt, setAvt] = useState(null);

    useEffect(() => {
        setAvt(Helper.getAvt())
    }, [])

    return (
        <div className='me_update'>
            <div className='mu_header'>
                <Link href='/me'><a><img
                    src='/images/tabme/back.svg'
                    className='mu_back'
                /></a></Link>
                <div className='mu_title'>Cập nhật thông tin</div>
            </div>
            <div className='mu_info'>
                {avt && avt !== '' ?
                    <img src={avt} className='mu_avt'/>
                    : <img src='/images/tabme/avt.svg' className='mu_avt'/>}
                <div className='mu_new-avt'>
                    <img src='/images/tabme/newavt.svg'/> Ảnh đại diện
                </div>
            </div>
            <div className='mu_form'>
                <form>
                    {/*<input/>*/}
                </form>
            </div>
        </div>
    );
}

export default UpdateMe;
