import { useEffect, useState } from "react"
import './currency.css'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const EditModal = ({ closeModal, selectedCurrency }) => {
  const [text, setText] = useState('')
  const navigate = useNavigate();

  const submitEdit = async () => {
    const res = await fetch(`${domain}/currency/${selectedCurrency.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: text
      })
    })
    const msg = await res.text()
    if (msg == 'ok') {
      toast("Successfully Edited this currency!", {
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
      navigate(0)
    }
  }

  return (
    <div>
      <div
        className='currency_editmodal_backdrop'
        onClick={() => closeModal()}
      >
      </div>
      <div className="currency_editmodal" >
        <h2>edit currency </h2>
        <br />
        <br />
        <input type='text' defaultValue={selectedCurrency.title} onChange={(e) => setText(e.target.value)} />
        <button style={{marginLeft: 8}} onClick={submitEdit} >click me</button>
      </div>
    </div>
  )
}

export default () => {

  const [data, setData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(null)

  const loadCurrencies = async page => {
    const res = await fetch(`${domain}/currency/all?limit=200`)
    const {currencies} = await res.json()

    console.log('***************************')
    console.log(currencies)
    console.log('***************************')

    setData(currencies)

  }

  useEffect(() => {
    loadCurrencies()
  }, [])

  const closeModal = () => {
    setSelectedCurrency(null)
    setEditModalOpen(false)
  }

  return (
    <div className="currency_container" >
      
      {
        editModalOpen && <EditModal closeModal={closeModal} selectedCurrency={selectedCurrency} />
      }

      {
        data.map(item => {
          console.log(item)
          return (
            <div
              className="currency_container_item" key={item.id}
              onClick={() => {
                setSelectedCurrency(item)
                setEditModalOpen(true)
              }}
            >
              {item.title}
            </div>
          )
        })
      }
    
    </div>
  )
}