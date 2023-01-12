import React, { useEffect, useState } from 'react'

const getDataLS = ()=>{
    const data = localStorage.getItem('users')
    if(data){
        return JSON.parse(data)
    }
    else
        return []
}

export default function Form() {
    // declaring usestate variables

    const [formData, setFormData] =useState({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        employeeId: ''
    })
    const [users, setUsers] = useState(getDataLS())
    const [toggle, setToggle] = useState('true')
    const [isEditItem, setIsEditItem] = useState('null')
    const [focused, setFocused] = useState("focused = false")


    const onChangeHandler = (e)=>{
        setFormData(()=>({
            ...formData,
            [e.target.name]: e.target.value
        }))
    }

    // onSubmit function 

    const submit =(e)=>{
        e.preventDefault()
        
        if(formData && !toggle){
            // replacing the existing data with the new one
            setUsers(users.map((element)=>{
                if(element.employeeId=== isEditItem){
                    return { ...element, ...formData}
                }
                return element
            }))
            setToggle(true)
            setFormData(()=>({
                ...formData,
                firstName: '',
                lastName: '',
                contact: '',
                email: '',
                employeeId: ''
            }))
            setIsEditItem('null')
            setFocused(false)
        }
        else{
            // adding new data 
        setUsers([...users, formData])
        setFormData(()=>({
            ...formData,
            firstName: '',
            lastName: '',
            contact: '',
            email: '',
            employeeId: ''
        }))}
        setFocused(false)

    } 

    // adding data in local storage
    useEffect(()=>{
        localStorage.setItem('users',JSON.stringify(users))
    },[users])

    // Editing the existing data
    const handleEdit = (id)=>{
        let newEdit = users.find((elem)=>{
            return elem.employeeId === id
        });
        setToggle(false)
        setFormData(newEdit)
        setIsEditItem(id) 
    }

    // Deleting specific row from local storage 
    const handleDelOne = (id)=>{
        const filteredUser = users.filter((ele)=>{
            return ele.employeeId!== id
        })
        setUsers(filteredUser)
    }

    // setting focused to display error message
    let handleFocus = ()=>{
        setFocused(true)
    }

    const errors = {
        firstNameError: "Please enter First name(No numbers and special characters are allowed)",
        lastNameError: "Please enter Last name(No numbers and special characters are allowed)",
        contactError: "Please enter a valid 10 digit phone number with 2digit country code, e.g. 919876543210",
        emailError: "Please enter a valid email",
        idError: "Please enter employee ID e.g. e1, e2, e54",
    }

    
  return (
    <>
    <div className='container col-md-6 col-md-offset-3 my-4 form-cont'>
        <h3 className='heading-text'>Enter Employee Details</h3>
        <form onSubmit={submit}>
            <div className="mb-1  ">
                <label className="form-label">First Name</label>
                <input type="text" autoComplete="off" required className="form-control" name='firstName' value={formData.firstName} onChange={onChangeHandler} pattern="[a-zA-Z]{1,15}" focused={focused.toString()}  />
                <span>{errors.firstNameError}</span>
                </div>
            <div className="mb-1  ">
                <label className="form-label">Last Name</label>
                <input type="text" autoComplete="off" required className="form-control" name='lastName' value={formData.lastName} onChange={onChangeHandler} pattern="[a-zA-Z]{1,15}"  focused={focused.toString()}  />
                <span>{errors.lastNameError}</span>
            </div>
            <div className="mb-1 ">
                <label className="form-label">Contact Number</label>
                <input type="text" autoComplete="off" required className="form-control" name='contact'  value={formData.contact} onChange={onChangeHandler}  pattern="\d{12}" focused={focused.toString()}  />
                <span>{errors.contactError}</span>
            </div>
            <div className="mb-1 ">
                <label className="form-label">Email address</label>
                <input type="email" autoComplete="off" required className="form-control" name='email' value={formData.email} onChange={onChangeHandler} pattern="[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+" focused={focused.toString()} />
                <span>{errors.emailError}</span>
            </div>  
            <div className="mb-1 ">
                <label className="form-label">Employee ID</label>
                <input type="text" autoComplete="off" required className="form-control" name='employeeId' value={formData.employeeId} onChange={onChangeHandler} pattern= "^e([1-9]|[1-9][0-9]|100)" focused={focused.toString()}    />
                <span>{errors.idError}</span>
            </div>
                <button type="submit" className="btn btn-outline-light my-2 submitBtn" onClick={handleFocus} >{toggle?"Add":"Save Edit"}  </button>
        </form>
    </div>
        <div className='table-responsive view-table'>
            <table className='table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Contact Number</th>
                    <th>Email</th>
                    <th>Delete</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users.map((value, index)=>{
                        return(<tr key={value.employeeId}>
                            <td>{index+1}</td>
                            <td>{value.employeeId}</td>
                            <td>{value.firstName} {value.lastName}</td>
                            <td>{value.contact}</td>
                            <td>{value.email}</td>
                            <td><button type ="button" className="btn btn-warning" onClick={() => handleEdit(value.employeeId)}>Edit</button></td>
                            <td><button type ="button" className="btn btn-danger" onClick={() => handleDelOne(value.employeeId)}>Delete</button></td>
                            
                            </tr>)
                    })
                  }
                </tbody>
            </table>
            {users.length <2 ? <div></div> : <div className="col-6 d-grid mx-auto"><button type="button" className="btn btn-danger" onClick={()=>setUsers([])}>Delete All</button></div>
            }
        </div>
        
    </>
  )
}
