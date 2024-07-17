import React, { useEffect, useState } from 'react'
import axios from'axios'

export default function Home() {
    const [todo, setTodo]=useState("");
    const [data, setData] = useState([]);
    const [edit, setEdit] = useState(null)

    function insetForm(e){
        e.preventDefault();
        
        axios.post(`http://localhost:8000/todo`, {
            todo: todo
        })
            .then((res) => {
                console.log("data Added successfully")
                fetchData();
                setTodo("")
            })
    }
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        axios.get("http://localhost:8000/todo")
            .then(res => {
                console.log(res.data.reverse())
                setData(res.data)


            })
            .catch((err) => console.log("something is worng"))
    }

    const handleDelete = (id) => {


        axios.delete(`http://localhost:8000/todo/${id}`)
            .then(res => {
                console.log("data delete successfully")
                setData(data.filter((item) => item.id !== id))
            })
    }


    const handleEdit = (id) => {
        const isEdited = data.find((item) => item.id == id)
        setEdit(isEdited)
    }


    console.log(edit)

    const handleEditSave = (e) => {
        e.preventDefault();


        axios.patch(`http://localhost:8000/todo/${edit.id}`, {
            todo: edit.todo
        }).then((res) => {
            console.log(res)
            console.log("data edited successfully")
            fetchData();
            setEdit("")
        })
            .catch((error) => console.log("something is wrong"))
    }



  return (
    <div>
        <form onSubmit={insetForm}> 
            <input type="text" value={todo} onChange={(e)=>setTodo(e.target.value)} />
            <button>ADD</button>
        </form>
        <div  style={{ display: "flex", justifyContent: 'space-evenly', margin: "20px" }}>
        <div>
            {
                data.map((v,i) => {
                    return(
                    <div key={i}>
                            <h3>id : {v.id}</h3>
                            <h2>todo:  {v.todo}</h2>
                            <button onClick={() => handleDelete(v.id)} >Delete</button>
                            <button onClick={() => handleEdit(v.id)} >Edit</button>
                    </div>
                    )
                })
            }
        </div>
        <div>
        {
            edit && <div>
                <form>
                    <input value={edit.todo} onChange={(e) => setEdit({ ...edit, todo: e.target.value })} type="text" />
                    <button onClick={handleEditSave} >Save</button>
               </form>
            </div>
        }
        </div>
        </div>
    </div>
  )
}
