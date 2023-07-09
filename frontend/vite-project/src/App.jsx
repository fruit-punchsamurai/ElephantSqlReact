import { useState, useEffect } from 'react'
import '/css/App.css'
import Form from '/components/Form.jsx'
import Table from '/components/Table.jsx'
import axios from 'axios'


function App() {
  const [showTable,setShowTable] = useState(false);
  const [tableData,setTableData] = useState([])
  const [submitted,setSubmitted] = useState(false);
  useEffect(()=>{
   
      fetchData();
      console.log(showTable);
    
  },[showTable,submitted])

  const fetchData = async ()=>{
    try{
      const response = await axios.get('http://localhost:5000/tabledata');
      setTableData(response.data);
    }catch(error){
      console.log('Error fetching data :',error);
    }
  }


  const handleClick =  async ()=>{
    setShowTable(!showTable);
    }
  
  return (
    <div className='App'>
      <div className = 'Form'>
        <Form submitted = {submitted} setSubmitted = {setSubmitted}/>
      </div>
      <div className='ButtonContainer'>
        <button onClick = {handleClick}>
          {showTable?'Close Table':'Show Table'}
        </button>
      </div>
      <div className='TableContainer'>
        {showTable && 
        <div className='Table'>
          <Table records = {tableData}/>
        </div>
        }
      </div>
    </div>
  )
}

export default App



