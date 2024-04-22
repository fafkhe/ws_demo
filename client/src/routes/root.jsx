import { useEffect, useState } from "react";
import "./root.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EditRateBox({ rate }) {
  const navigate = useNavigate();

  const [newRate, setNewRate] = useState(rate?.amount || 0);

  useEffect(() => {
    setNewRate(rate?.amount);
  }, [rate]);

  const updateRateAmount = async () => {
    console.log(
      `trying to update rate with id ${rate.id} to new amount ${newRate}`
    );

    const res = await fetch(`${domain}/rate/edit/${rate.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(newRate),
      }),
    });

    const msg = await res.text();
    if (msg == "ok") {
      toast("Successfully Updated!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        type: "success",
      });
      navigate(0);
    }
  };

  return (
    <div className="root_ratemodal_editrate">
      <input
        type="number"
        value={newRate}
        onChange={(e) => setNewRate(Number(e.target.value))}
      />
      <button onClick={() => updateRateAmount()}> submit </button>
    </div>
  );
}

function RootModal({ rate, closeModal }) {
  return (
    <>
      <div
        className="root_ratemodal_backdrop"
        onClick={() => closeModal()}
      ></div>
      <div className="root_ratemodal">
        <div className="root_ratemodal_details">
          <div> {rate?.origin?.title} </div>
          <div> {rate?.dest?.title} </div>
          <div> {rate.amount} </div>
          <div> {rate.amount} </div>
          <div>
            {rate.lastAmount == rate.amount ? (
              <div style={{ width: 50, textAlign: "center", margin: "0 auto" }}>
                -
              </div>
            ) : rate.lastAmount < rate.amount ? (
              <div className="arrow-up center"></div>
            ) : (
              <div className="arrow-down center"></div>
            )}
          </div>
        </div>
        <EditRateBox rate={rate} />
      </div>
    </>
  );
}

function RateTable({ rates, setSelectedRate, setRateModalOpen }) {
  return (
    <div
      style={{
        width: "60%",
        margin: "20px auto",
        paddingTop: 20,
        paddingBottom: 20,
      }}
    >
      <div className="root_table">
        <div className="root_table_header">
          <div> No. </div>
          <div> From </div>
          <div> To </div>
          <div> Amount </div>
          <div> state </div>
        </div>
        <div className="root_table_body">
          {rates.map((rate, index) => {
            rate.lastAmount = rate.amount;
            return (
              <div
                className="root_table_body_row"
                key={rate.id}
                onClick={() => {
                  setSelectedRate(rate);
                  setRateModalOpen(true);
                }}
              >
                <div> {index + 1} </div>
                <div> {rate?.origin?.title} </div>
                <div> {rate?.dest?.title} </div>
                <div> {rate.amount} </div>
                <div>
                  {rate.lastAmount == rate.amount ? (
                    <div
                      style={{
                        width: 50,
                        textAlign: "center",
                        margin: "0 auto",
                      }}
                    >
                      -
                    </div>
                  ) : rate.lastAmount < rate.amount ? (
                    <div className="arrow-up center"></div>
                  ) : (
                    <div className="arrow-down center"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Root() {
  const [isLoaded, setLoaded] = useState(false);
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [rateModalOpen, setRateModalOpen] = useState(false);

  const loadRates = async () => {
    const res = await fetch(`${domain}/rate/all?limit=100`);
    const data = await res.json();
    setLoaded(true);
    setRates(data.result);
  };

  const editRates = (newRate) => {
    console.log("new rate is : ", newRate);
    // const arr = [...rates];
    // const p = arr.findIndex((item) => {
    //   return item.id == newRate.id;
    // });
    // // console.log(arr);
    // // console.log(p);
    // // console.log("#####");
    // arr[p].amount = newRate.amount;
    // arr[p].lastAmount = newRate.lastAmount;
    // setRates(arr);
  };

  const connectToWS = () => {
    const webSocket = new WebSocket("ws://localhost:443/");
    webSocket.onmessage = (event) => {
      try {
        const x = JSON.parse(event.data);
        if (x.msg === "editRate") {
          editRates(structuredClone(x.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
  };

  useEffect(() => {
    loadRates();
    connectToWS();
  }, []);

  const closeModal = () => {
    setRateModalOpen(false);
    setSelectedRate(null);
  };

  return (
    <>
      {console.log(rates)}
      {rateModalOpen && (
        <RootModal closeModal={closeModal} rate={selectedRate} />
      )}

      {isLoaded ? (
        <RateTable
          rates={rates}
          setSelectedRate={setSelectedRate}
          setRateModalOpen={setRateModalOpen}
        />
      ) : (
        <h1> loading </h1>
      )}
    </>
  );
}

export default Root;
