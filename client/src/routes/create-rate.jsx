import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [allCurrencies, setAllCurrencies] = useState([])
  const [originId, setOriginId] = useState('choose')
  const [destId, setDestId] = useState('choose')
  const [amount, setAmount] = useState(0)

  const [displaySubmit, setDisplaySubmit] = useState(false)
  const [warningMsg, setWarningMsg] = useState('')

  const loadCurrencies = async () => {
    const res = await fetch(`${domain}/currency/all?limit=200`)
    const { currencies, count } = await res.json()
    setAllCurrencies(currencies)
  }

  useEffect(() => {
    loadCurrencies()
  }, [])
  
  useEffect(() => {
    setLoading(true)
    checkIfSubmitable()
  }, [destId, originId])

  const checkIfSubmitable = async () => {
  
    if (originId == 'choose' || destId == 'choose') {
      setWarningMsg('please choose some currencies')
      setLoading(false)
      return setDisplaySubmit(false)
    }
    if (originId == destId) {
      setWarningMsg('please choose different currencies')
      setLoading(false)
      return setDisplaySubmit(false)
    }

    const res = await fetch(`${domain}/rate/single/cur`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: originId,
        to: destId
      })
    })
    console.log(res)
    const data = await res.json()
    console.log(data)
    if (data.result == null) {
      setWarningMsg('')
      setDisplaySubmit(true)
      setLoading(false)
      return
    } else {
      setWarningMsg('this rate already exists, u can edit it in the rates table')
      setLoading(false)
      setDisplaySubmit(false)
      return
    }

  }

  const createRate = async () => {

    const x = Number(amount)
    console.log(x)
    if (isNaN(x)) return 

    const res = await fetch(`${domain}/rate/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Number(originId),
        to: Number(destId),
        amount: x
      })
    })
    const msg = await res.text()
    if (msg === 'ok') {
      toast("Successfully Created this rate!", {
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
      navigate('/')
    }
  }

  return (
    <div>
      {
        loading && 
        <div style={{width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, background: '#000', opacity: .7, zIndex: 5}} ></div>
      }
      <label> Origin </label>

      <select
        value={originId}
        onChange={e => setOriginId(e.target.value)}
      >
        <option value='choose'>
          choose
        </option>
        {
          allCurrencies.map(item => {
            return (
              <option key={item.id} value={item.id} >
                {item.title}
              </option>
            )
          })
        }
      </select>
      <label> Dest </label>

      <select
        value={destId}
        onChange={e => setDestId(e.target.value)}
      >
        <option value='choose'>
          choose
        </option>
        {
          allCurrencies.map(item => {
            return (
              <option key={item.id} value={item.id} >
                {item.title}
              </option>
            )
          })
        }
      </select>
      <label> amount </label>
      <input type="number"  value={amount} onChange={(e) => setAmount(e.target.value)} />

      <br />
      {
        !displaySubmit
          ?
          <>
            <h3 style={{ color: 'red' }} > u cant submit </h3>
            {
              warningMsg && <h4> {warningMsg} </h4>
            }
            
          </>
          :
          <button onClick={() => {
            setLoading(true)
            createRate()
          }}  > submit </button>
      }
    </div>
  )
}