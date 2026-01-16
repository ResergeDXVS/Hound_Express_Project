const formDOM = document.querySelector(".form");
const statusDOM = document.querySelector(".status");
const guidesDOM = document.querySelector(".guides");
const historicalDOM = document.querySelector(".historical");
const historicalCross = historicalDOM.querySelector("#historical__cross");
const mainDOM = document.querySelector(".main");
const bodyDOM = document.querySelector("body");
class Guide{
    constructor(id,origin,destiny,recipient,dateCreate,state){
        this.id = id;
        this.origin = origin.toUpperCase();
        this.destiny = destiny.toUpperCase();
        this.recipient = recipient.toUpperCase();
        this.dateCreate = dateCreate;
        this.state = state;
    }
    updateStatus(newStatus,date=new Date()){
        const historical = new GuideHistorical(this.id,newStatus,date);
        const listHistorical = generateHistoricalList();
        listHistorical.push(historical);
        localStorage.setItem("guideHistorical", JSON.stringify(listHistorical));
        console.log("SDADSAD"+date);
        return date;
    }

    getNewStatus(){
        let newStatus;
        console.log("Estado anterior: "+this.state);
        if (this.state==="pending"){
            newStatus = "intransit";
        }else if (this.state ==="intransit"){
            newStatus = "delivered";
        }
        if (newStatus !== undefined){
            console.log("Estado nuevo: "+newStatus);
            let date = this.updateStatus(newStatus);
            console.log(date);
            return {newStatus, date};
        }else{
            alert("No se puede actualizar una guia que ya está Entregado.")
        }

    }
}

class GuideHistorical{
    constructor(guide_id, new_status,datetime){
        this.guide_id = guide_id;
        this.new_status = new_status;
        this.datetime = datetime;
    }

}

/* Funciones para obtener los datos del formulario*/
const formButton = formDOM.querySelector("#submit");

(() => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

/*Evento para obtener y manejar los datos*/
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form__structure");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // evita envío automático

        const formData = new FormData(form);

        // Ejemplo: obtener valores individuales
        const idGuide = formData.get("id_guide");
        const origin = formData.get("origin");
        const destination = formData.get("destination");
        const recipient = formData.get("recipient");
        const date = formData.get("datetime");
        const state = formData.get("state");

        console.log("Número de guía:", idGuide);
        console.log("Origen:", origin);
        console.log("Destino:", destination);
        console.log("Destinatario:", recipient);
        console.log("Fecha:", date);
        console.log("Estado:", state);

        // Si quieres todos los valores en un objeto:
        createGuideRecord(
            idGuide,
            origin,
            destination,
            recipient,
            date,
            state
        );
        cleanForm();
    });
});

/*Generar lista del localStorage*/
const generateList = () => {
    let guideRecord = JSON.parse(localStorage.getItem("guideRecord")) || [];
    guideRecord = guideRecord.map(item => new Guide(item.id, item.origin, item.destiny, item.recipient, item.dateCreate, item.state));
    return guideRecord;
}

const generateHistoricalList = () => {
    let guideHistoricalRecord = JSON.parse(localStorage.getItem("guideHistorical")) || [];
    guideHistoricalRecord = guideHistoricalRecord.map(item => new GuideHistorical(item.guide_id, item.new_status, item.datetime));
    return guideHistoricalRecord;
}
/*Generar el registro nuevo a la lista de guías, junto de agregarlo al localStorage y actualizar la lista.*/
const createGuideRecord = (id,origin,destiny,recipient,dateCreate,state) =>{
    let guideRecord = generateList();
    if(id && origin && destiny && recipient && dateCreate && state){
        const item = guideRecord.find(p => p.id === id);
        if (item === undefined){
            const guide = new Guide(id,origin,destiny,recipient,dateCreate,state)
            guideRecord.push(guide);
            localStorage.setItem("guideRecord", JSON.stringify(guideRecord));
            guide.updateStatus(state,dateCreate);
            createGuideTable();
            updateStatus();
        }else{
            alert(`El número de guía ya está registrado en el sistema, favor de revisar.`);
        }
    }
}

/*Formateo de fecha para campo de día de actualización*/
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};



/*Traducción de valores de estado*/
const translateValue = (state) => {
    const translations = {
        pending:"Pendiente",
        intransit:"En Transito",
        delivered:"Entregado",
    }
    console.log(state);
    return translations[state].toUpperCase() || state.toUpperCase();
}

/*Creación de estructura de fila de registro de tabla de guías*/
const createGuideStructure = (storage) => {
    const tableRow = document.createElement("tr");
    const tdID = document.createElement("td");
    const tdStatus = document.createElement("td");
    const tdRecipt = document.createElement("td");
    const tdOrigin = document.createElement("td");
    const tdDestiny = document.createElement("td");
    const tdDate = document.createElement("td");
    const tdGuideButton = document.createElement("td");
    const buttonUpdate = document.createElement("button");
    
    const pUpdate = document.createElement("p");
    const imgUpdate = document.createElement("img");
    const buttonHistorical = document.createElement("button");
    const pHistorical = document.createElement("p");
    const imgHistorical = document.createElement("img");

    if(storage.state !== "delivered"){
        tdGuideButton.append(
            buttonUpdate,
            buttonHistorical,
        );
        
    }else{
        tdGuideButton.append(
            buttonHistorical
        );
    }

    tableRow.setAttribute("class","guides__row");
    tdGuideButton.setAttribute("class","guides__buttons");
    
    buttonHistorical.setAttribute("class","guides__historical");
    buttonHistorical.setAttribute("title","Historial de registro");

    
    tableRow.append(
        tdID,
        tdStatus,
        tdRecipt,
        tdOrigin,
        tdDestiny,
        tdDate,
        tdGuideButton
    );
    
    
    if(storage.state !== 'delivered'){
        buttonUpdate.append(
            pUpdate,
            imgUpdate
        );
        buttonUpdate.addEventListener("click", (event) =>{
            const list = generateList();
            const index = list.findIndex(p => p.id === storage.id);
            const buttonUpdate = event.target.parentNode.firstElementChild;
            let guideRecord = new Guide(storage.id,storage.origin,storage.destiny,storage.recipient,storage.dateCreate,storage.state);
            const result = guideRecord.getNewStatus();
            tdStatus.innerHTML = translateValue(result.newStatus);
            tdDate.innerHTML = formatDateTime(result.date);
            guideRecord.state = result.newStatus;
            guideRecord.dateCreate = result.date;
            list[index]=guideRecord;
            localStorage.setItem("guideRecord", JSON.stringify(list));
            createGuideTable();
        })
    }
    
    buttonHistorical.append(
        pHistorical,
        imgHistorical
    );
    buttonHistorical.addEventListener("click", (event) =>{
        createTableHistorical(storage.id);
        historicalDOM.classList.add("historical--show");
        mainDOM.classList.add("main--wait");
        bodyDOM.classList.add("body--wait");

    })
    tdID.innerText = storage.id;
    tdStatus.innerHTML = translateValue(storage.state);
    tdRecipt.innerHTML = storage.recipient.toUpperCase();
    tdOrigin.innerHTML = storage.origin.toUpperCase();
    tdDestiny.innerHTML = storage.destiny.toUpperCase();
    tdDate.innerHTML = formatDateTime(storage.dateCreate);
    pUpdate.innerText = "Actualizar Estado";
    imgUpdate.setAttribute("src","img/icons/update.svg");
    pHistorical.innerText = "Ver Historial";
    imgHistorical.setAttribute("src","img/icons/historical.svg");
    return tableRow;

}

const createTableHistorical = (id) => {
    const title = document.querySelector(".historical__title").firstElementChild;
    title.innerText = id;
    const list = generateHistoricalList();
    console.log(list);
    let data = list.filter(p => p.guide_id === id);
    const tbody = document.querySelector(".historical__tbody");
    console.log(tbody);
    tbody.innerHTML = "";
    data.forEach(line => {
        const tr = document.createElement("tr");
        const tdStatus = document.createElement("td");
        const tdDate = document.createElement("td");
        tdStatus.innerText = translateValue(line.new_status);
        tdDate.innerText = formatDateTime(line.datetime);
        tr.append(tdStatus);
        tr.append(tdDate);
        tbody.append(tr);
    })

}

/*Crear registros de toda la tabla dependiendo del localStorage*/
const createGuideTable = () => {
    let guideRecord = generateList();
    const tbody = document.querySelector(".guides__tbody");
    tbody.innerHTML = "";
    if (guideRecord.length > 0){
        guideRecord.forEach(element => {
            console.log(element);
            tbody.appendChild(createGuideStructure(element));
        });
    }
}

/*Actualizar datos de estado para la seccuión del estado general de las guías*/
const updateStatus = () => {
    
    const total = statusDOM.querySelector("#guides__total").getElementsByTagName("b")[0];
    console.log(total);
    const transit = statusDOM.querySelector("#guides__transit").getElementsByTagName("b")[0];
    const delivered = statusDOM.querySelector("#guides__delivered").getElementsByTagName("b")[0];
    let guideRecord = generateList();

    const item__total = guideRecord.length;
    const item__transit = guideRecord.filter(n => n.state === "intransit").length;
    const item__delivered = guideRecord.filter(n => n.state === "delivered").length;
    total.innerText = item__total;
    transit.innerText = item__transit;
    delivered.innerText = item__delivered;    

}

const cleanForm = () => {
    const idGuide = formDOM.querySelector("#id_guide");
    const origin = formDOM.querySelector("#origin");
    const destination = formDOM.querySelector("#destination");
    const recipient = formDOM.querySelector("#recipient");
    const date = formDOM.querySelector("#datetime");
    const state = formDOM.querySelector("#state");
    const form = formDOM.querySelector("#form__structure");


    idGuide.value = "";
    origin.value = "";
    destination.value = "";
    recipient.value = "";
    date.value = "";
    state.value = "";

    form.classList.remove("was-validated");
    form.querySelectorAll(".is-invalid, .is-valid").forEach(input => {
        input.classList.remove("is-invalid", "is-valid");
    });


}

historicalCross.addEventListener("click", ()=>{
    historicalDOM.classList.remove("historical--show");
    mainDOM.classList.remove("main--wait");
    bodyDOM.classList.remove("body--wait");
})

updateStatus();
createGuideTable();
