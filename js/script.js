const formDOM = document.querySelector(".form");
const statusDOM = document.querySelector(".status");
const guidesDOM = document.querySelector(".guides");

class Guide{
    constructor(id,origin,destiny,recipient,dateCreate,state){
        this.id = id;
        this.origin = origin;
        this.destiny = destiny;
        this.recipient = recipient;
        this.dateCreate = dateCreate;
        this.state = state;
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
        const date = formData.get("date");
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

    });
});

/*Generar lista del localStorage*/
const generateList = () => {
    let guideRecord = JSON.parse(localStorage.getItem("guideRecord")) || [];
    guideRecord = guideRecord.map(item => new Guide(item.id, item.origin, item.destiny, item.recipient, item.dateCreate, item.state));
    return guideRecord;
}
/*Generar el registro nuevo a la lista de guías, junto de agregarlo al localStorage y actualizar la lista.*/
const createGuideRecord = (id,origin,destiny,recipient,dateCreate,state) =>{
    let guideRecord = generateList();
    if(id && origin && destiny && recipient && dateCreate && state){
        const item = guideRecord.find(p => p.id === id);
        if (item === undefined){
            guideRecord.push(new Guide(id,origin,destiny,recipient,dateCreate,state));
            localStorage.setItem("guideRecord", JSON.stringify(guideRecord));
            createGuideTable();
            updateStatus();
        }else{
            alert(`El número de guía ya está registrado en el sistema, favor de revisar.`);
        }
    }
}

/*Formateo de fecha para campo de día de actualización*/
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // formato DD/MM/YYYY
}

/*Traducción de valores de estado*/
const translateValue = (state) => {
    const translations = {
        pending:"Pendiente",
        intransit:"En Transito",
        delivered:"Entregado",
    }
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

    tableRow.setAttribute("class","guides__row");
    tdGuideButton.setAttribute("class","guides__buttons");
    buttonUpdate.setAttribute("class","guides__update");
    buttonHistorical.setAttribute("class","guides__historical");
    buttonUpdate.setAttribute("title","Actualizar registro");
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
    
    tdGuideButton.append(
        buttonUpdate,
        buttonHistorical,
    );

    buttonUpdate.append(
        pUpdate,
        imgUpdate
    );

    buttonHistorical.append(
        pHistorical,
        imgHistorical
    );
    tdID.innerText = storage.id;
    tdStatus.innerHTML = translateValue(storage.state);
    tdRecipt.innerHTML = storage.recipient.toUpperCase();
    tdOrigin.innerHTML = storage.origin.toUpperCase();
    tdDestiny.innerHTML = storage.destiny.toUpperCase();
    tdDate.innerHTML = formatDate(storage.dateCreate);
    pUpdate.innerText = "Actualizar Estado";
    imgUpdate.setAttribute("src","img/icons/update.svg");
    pHistorical.innerText = "Ver Historial";
    imgHistorical.setAttribute("src","img/icons/historical.svg");
    return tableRow;

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

updateStatus();
createGuideTable();
