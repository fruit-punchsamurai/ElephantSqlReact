import React,{useState} from "react";
import axios from "axios";





export default function Form({fetchAgain,setFetchAgain, update}){
    const[formData,setFormData] = useState({
        rollno:'',
        fname:'',
        lname:'',
        address:'',
        department:'',
        age:''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = update?'http://localhost:5000/update':'http://localhost:5000/submit';
        const data = update?{...formData,oldrollno:update[0]}:formData;
        try{
            axios.post(url,data)
            .then(res=>{
                console.log(res);
            })
            setFormData({
                rollno:'',
                fname:'',
                lname:'',
                address:'',
                department:'',
                age:''
            })
            setFetchAgain(!fetchAgain);
        }
        catch(error){
            console.log(error);
        }
        
      }
   
    return(
        <div className= {update?"updateForm":"Form"}>
            <form onSubmit={handleSubmit}>
                <label htmlFor = "rollno">{update?'New ':''}Roll No: </label><br />
                <input type = "number" id = "rollno" placeholder=" " name="rollno" onChange = {handleChange} value = {formData.rollno} required></input><br />
               
                <label htmlFor = "fname">{update?'New ':''}First Name: </label><br />
                <input type = "text" id = "fname" placeholder=" " name="fname" onChange = {handleChange} value = {formData.fname} maxLength={30} required></input><br />
                
                <label htmlFor = "lname">{update?'New ':''}Last Name: </label><br />
                <input type = "text" id = "lname" placeholder=" " name="lname" onChange = {handleChange} value = {formData.lname}maxLength={30} required ></input><br />
           
                <label htmlFor = "address">{update?'New ':''}Address: </label><br />
                <input type = "text" id = "address" placeholder=" " name="address" onChange = {handleChange} value = {formData.address} maxLength={30} required></input><br />
               
                <label htmlFor = "department">{update?'New ':''}Department: </label><br />
                <input type = "text" id = "department" placeholder=" " name="department" onChange = {handleChange} value = {formData.department} maxLength={30} required></input><br />
                
                <label htmlFor = "age">{update?'New ':''}Age: </label><br />
                <input type = "number" id = "age" placeholder=" " name="age" onChange = {handleChange} value = {formData.age} maxLength={30} required></input><br />

                <br />
                <div className="submit-form">
                    <button type = "submit">Submit</button>
                </div>
                
            </form>
        </div>
    )
}



