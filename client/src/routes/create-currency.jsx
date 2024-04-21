
import { useState } from 'react';
import './create-currency.css'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


export default () => {

  const [currencyName, setCurrencyName] = useState("")
  const navigate = useNavigate();

  const createCurrency = async () => {

    const res = await fetch(`${domain}/currency/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currencyName
      })
    })
    const msg = await res.text()
    if (msg == 'ok') {
      toast("Successfully Created this currency!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        type: "success"
      });
      navigate('/currency')
    }

  }

  return (
    <div className='cc' >
      <input
        type='text'
        placeholder='currency name'
        style={{ padding: '4px 8px', borderRadius: 8 }} 
        value={currencyName}
        onChange={e => setCurrencyName(e.target.value)}
      />
      <button
        style={{ padding: '4px 8px', marginLeft: 8, borderRadius: 8 }}
        onClick={() => createCurrency()}
      > submit </button>
    </div>
  )
}