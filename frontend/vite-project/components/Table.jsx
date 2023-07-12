import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Form from './Form';
export default function Table({records, fetchAgain, setFetchAgain, orderBy,setOrderBy}) {

  const[selectAll,setSelectAll] = useState(false);
  const[selectedItems,setSelectedItems] = useState([]);
  const[showUpdateForm,setShowUpdateForm] = useState(false);

  const[showEdit,setShowEdit] = useState(false)
  const [showDelete,setShowDelete] = useState(false)

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked)
    
    const newSelectedItems = checked? records.map((record)=>record.rollno) : [] ;
    setSelectedItems(newSelectedItems);
  }

  const handleSelectOne = (e,rollno) => {
    const checked = e.target.checked;
    if(checked){
      setSelectedItems((prevSelectedItems)=>[...prevSelectedItems,rollno]);
    }
    else{
      setSelectedItems((prevSelectedItems)=>prevSelectedItems.filter((item)=> item !== rollno));
    }
  }
  
  const handleEdit = ()=>{
    setShowUpdateForm(!showUpdateForm)
  }
  const handleDelete = ()=>{
    try{
      axios.post('http://localhost:5000/delete',selectedItems)
      .then((res)=>{console.log(res);})
      setSelectedItems([])
      setSelectAll(false)
      setFetchAgain(!fetchAgain);
    }
    catch(error){
      console.log("Error deleting data");
    }
  }

  const handleOrderBy = (e) => {
    setOrderBy(e.target.value);
    setFetchAgain(!fetchAgain);
  }


  useEffect(()=>{

    if(selectedItems.length>=1){
      setShowDelete(true);
      if(selectedItems.length==1){
        setShowEdit(true);
      }
      else{
        setShowEdit(false);
        setShowUpdateForm(false);
      }
    }
    else{
      setShowDelete(false);
      setShowEdit(false);
      setShowUpdateForm(false);
    }
  },[selectedItems])

  useEffect(()=>{
    if(showUpdateForm) setSelectedItems([]);
  },[fetchAgain])

  return (
    
    <div className='Table'>

        {showEdit && <button onClick={handleEdit}>Edit</button>}
        {showDelete && <button onClick = {handleDelete}>Delete</button>}
        <label htmlFor="OrderBy">Order By : </label>
        <select id = 'OrderBy'  value = {orderBy} onChange={handleOrderBy}>
          <option value = 'rollno'>Roll No</option>
          <option value='firstname'>First Name</option>
          <option value='lastname'>Last Name</option>
          <option value='address'>Address</option>
          <option value='department'>Department</option>
          <option value='age'>Age</option>
        </select>
        <table>
          <thead>
            <tr>
            <th>Roll No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Department</th>
            <th>Age</th>
            <th><input type = "checkbox" id = 'SelectAll' name = 'SelectAll' checked={selectAll} onChange={handleSelectAll}/></th>
            </tr>
          </thead>
          <tbody>
            {records.map((record)=>(
              <tr key = {record.rollno}>
                <td>{record.rollno}</td>
                <td>{record.firstname}</td>
                <td>{record.lastname}</td>
                <td>{record.address}</td>
                <td>{record.department}</td>
                <td>{record.age}</td>
                <td>
                  <input 
                    type = 'checkbox' 
                    id ={record.rollno} 
                    name = 'SelectOne'
                    checked ={selectedItems.includes(record.rollno)}
                    onChange={(e)=>{
                      handleSelectOne(e,record.rollno);
                    }} 
                     />
                  </td>
              </tr>
              ))}
          </tbody>
        </table>
        {showUpdateForm && <Form fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain} update = {selectedItems}></Form>}            
        
        
    </div>
  )
}
