const express=require("express");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const path=require("path");
const dbPath=path.join(__dirname,"todoApplication.db");
const app=express();
app.use(express.json());
let db=null;


const initializeDbAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(3000,()=>{
            console.log("Server Running at http://localhost:3000/todos/");

        });
    }catch(error){
        console.log(`DB Error:${error.message}`);
    }
};

initializeDbAndServer();


const convertApplicationDBObjectToResponseObject=(dbObject)=>{
    return{
        todoId:dbObject.id,
        todoToDo:dbObject.todo,
        todoPriority:dbObject.priority,
        todoStatus:dbObject.status,
    };
};


const hasPriorityAndStatusProperties = (requestQuery) => {
 return (
  requestQuery.priority !== undefined && requestQuery.status !== undefined
 );
};

const hasPriorityProperty = (requestQuery) => {
 return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
 return requestQuery.status !== undefined;
};



 let data = null;
 let getToDosQuery = "";
 const { search_q = "", priority, status } = request.query;


 switch (true) {
  case hasPriorityAndStatusProperties(request.query): //if this is true then below query is taken in the code
   getToDosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND priority = '${priority}';`;
   break;
  case hasPriorityProperty(request.query):
   getToDosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND priority = '${priority}';`;
   break;
  case hasStatusProperty(request.query):
   getToDosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}';`;
   break;
  default:
   getToDosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%';`;
 }


 data = await database.all(getToDosQuery);

 response.send(data);
});


//Api2

app.GET("/todos/:todoId/",async(request,response)=>{

const {todoId}=request.params;
const getApplicationDetails=`SELECT * FROM todo
WHERE id='${todoId}';`;

const initialTodoDetails=await db.get(getApplicationDetails);
response.send(convertApplicationDBObjectToResponseObject(initialTodoDetails));


    
});

//Api3

app.post("/todos/",async(request,response)=>{
    const newApplicationDetails=request.body;

    const {todoId,todoToDo,todoPriority,todoStatus}=newApplicationDetails;
    const postNewDetailsQuery=`INSERT INTO
    todo(id,todo,priority,status)
    VALUES ('${todoId}','${todoToDo}','${todoPriority}','${todoStatus}');`;

    const dbResponse=await db.run(postNewDetailsQuery);
    const newApp=dbResponse.lastID;
    response.send("Todo Successfully Added");



});

//api 4



app.put("/todos/:todoId/",async(request,response)=>{
    const {todoId}=request.params;
    let updateColumn="";
   const {
  todo = todo.todo,
  status =todo.status,
  priority = todo.priority,
 } = request.body;

switch(true){
    case status!==undefined:
        updateColumn="Status";
    break;

    case priority!==undefined:
        updateColumn="Priority";
    break;
    case todo!==undefined:
        updateColumn="Todo";
    break;
}
    const updateDetailsQuery=`UPDATE todo
    SET
    id='${todoId}',
    todo='${todoToDo},
    priority='${todoPriority}',
    status='${todoStatus}'
    WHERE
    id='${todoId};`;
    const updateQuery=await db.run(updateDetailsQuery);
    const updateDetails=updateQuery.lastID;
    response.send("Todo Updated");
});



app.delete("/todos/:todoId/",async(request,response)=>{
    const {todoId}=request.params;
    const deleteDetailsQuery=`DELETE FROM todo WHERE id='${todoId}';`;
    await db.run(deleteDetailsQuery);
    response.send("Todo Deleted");
});



module.exports=app;


