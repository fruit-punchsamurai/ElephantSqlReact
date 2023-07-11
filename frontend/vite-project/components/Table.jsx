import React, { useState } from 'react'

export default function Table({records}) {
  
  return (
    
    <div className='Table'>
        <table>
          <thead>
            <tr>
            <th>Roll No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Department</th>
            <th>Age</th>
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
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}
