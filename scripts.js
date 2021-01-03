const form = document.getElementById("form")
const colors = document.getElementById("colors")
const allColors = document.querySelectorAll(".form__color")
const date = document.getElementById("date")
const list = document.getElementById("list")
const error = document.getElementById("error")

let currentColor = ""
let currentDate = new Date()
let selectDate = ""

const tasks = []

//VALIDACIONES
const validateForm = () =>{
    if(!form.task.value){
        error.innerHTML = "Por favor, introduce una tarea."
        return false
    }

    if(currentColor === ""){
        error.innerHTML = "No has introducido ningun color."
        return false
    }

    if(selectDate === ""){
        error.innerHTML = "No has introducido ninguna fecha."
        return false
    }else{
        if(selectDate<currentDate){
            error.innerHTML = "La fecha introducida es anterior a la actual."
            return false
        }
    }
    return true
}

//AÑADIR CLASE active A COLOR SELECCIONADO
const selectedColor = (target) =>{
    allColors.forEach((colorElement) =>{
        colorElement.classList.remove("active")
    })
    target.classList.add("active")
}

//CALCULAR TIEMPO RESTANTE HASTA QUE TASK SE COMPLETE
const timeRest = (date) =>{
    const diference = new Date(date).getTime() - new Date().getTime()
    const secondsOnTime = 1000
    const minutesOnTime = secondsOnTime * 60
    const hoursOnTime = minutesOnTime * 60
    const daysOnTime = hoursOnTime * 24
    
    const days = Math.floor(diference / daysOnTime)
    const hours = Math.floor((diference % daysOnTime) / hoursOnTime)
    const minutes = Math.floor((diference % hoursOnTime) / minutesOnTime)
    const seconds = Math.floor((diference % minutesOnTime) / secondsOnTime)
    return {days, hours, minutes, seconds}

}

//ESCRIBIR TASK EN DOM RECIBIENDO OBJETO{task: date: id: color:}
const writeTaskLS = (obj) =>{
            const firstDate = new Date(obj.date).getTime() - new Date().getTime()

            const taskElement = document.createElement("li")
            taskElement.textContent = `${obj.task}`
            taskElement.classList.add("tasks__task", obj.color)
            taskElement.id = obj.id
            
            const timeElement = document.createElement("span")
            
            setInterval(()=>{
                //const days = timeRest(obj.date).days ... //DESTRUCTURING
                const {days,hours,minutes,seconds} = timeRest(obj.date)
                timeElement.textContent = `D${days} H${hours} M${minutes} S${seconds}`
            }, 1000)

            timeElement.textContent = `D${new Date(firstDate).getDate()-1} H${new Date(firstDate).getHours()-1} M${new Date(firstDate).getMinutes()} S${new Date(firstDate).getSeconds()}`
            
            taskElement.append(timeElement)
            list.append(taskElement)
            
            const removeElement = document.createElement("span")
            removeElement.textContent = "x"
            removeElement.classList.add("remove")
            taskElement.append(removeElement)

            selectDate = ""
            error.innerHTML = ""
}

//GUARDAR TASK EN LOCALSTORAGE
const saveInfo = (task) =>{
    tasks.length = 0

    let taskls = JSON.parse(localStorage.getItem("tasks"))
    if(taskls && taskls.length > 0){
        for (const task of taskls) {
            tasks.push(task)
        }
    }
    tasks.push(task)
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

//BORRAR TAREAS AL PULSAR EN LA "X" TANTO DOM COMO LOCALSTORAGE
list.addEventListener("click", (e)=>{
    if(e.target.textContent === "x"){
        e.target.parentElement.remove()

        const tasksTest = []
        
        for (const task of JSON.parse(localStorage.getItem("tasks"))) {
            tasksTest.push(task)

            if(task.id == e.target.parentElement.id){
                tasksTest.pop(task)

            }
        }
        localStorage.clear()
        localStorage.setItem("tasks", JSON.stringify(tasksTest))
    }
})

//ASIGNAR CLASE EN FUNCION DEL COLOR QUE SE CLICKE
colors.addEventListener("click", (e) =>{
    if(e.target.dataset.color !== undefined){
        currentColor = e.target.dataset.color
        selectedColor(e.target)
    }
})

//USUARIO ASIGNA FECHA A selectDate
date.addEventListener("change", (e)=>{
    selectDate = new Date(e.target.value)
})

//ENVIAR FORMULARIO
form.addEventListener("submit", (e)=>{
    e.preventDefault()

    if(validateForm()){
        const taskObject = {
            id: new Date().getTime(),
            task: form.task.value,
            color: currentColor,
            date: selectDate
        }

        writeTaskLS(taskObject)
        saveInfo(taskObject)

        e.target.submit.blur() //quitar foco submit
        form.reset()
    }
})

//CARGAR LA INFO DE LOCALSTORAGE
window.addEventListener("load", (e)=>{
    const arrayLS = JSON.parse(localStorage.getItem("tasks"))

    //RECORREMOS LOCALSTORAGE Y ESCRIBIMOS LAS TAREAS EN EL DOM
    const runLocalStorage = (infoLS) =>{
        for (const obj of infoLS) {
           writeTaskLS(obj)
        }
    }

    //COMPROBAMOS SI HAY DATOS EN LOCALSTORAGE
    if(arrayLS != null){
        if(arrayLS.length == 0){
            localStorage.clear()
        }else{
            runLocalStorage(arrayLS)
        }
    }
})