/*--------------------------------- WEEK 13 ---------------------------------------------------*/
/*-------- ADDING A PARAGRAPH TO OUR FOOTER ELEMENT --------------------*/

//CREATE A VARIABLE TO STORE MY NAME
const author = "Arturo Mena";

//GETTING THE CURRENT DATE FROM THE SYSTEM AND STORE THE YEAR IN ANOTHER VARIABLE
const today = new Date();
const thisYear = today.getFullYear();

//GET THE FOOTER ELEMENT
const footer = document.querySelector('footer');

//CREATE A NEW PARAGRAPH
const copyright = document.createElement('p');

//ADDING MY NAME, UTFCODE FOR COPYRIGHT SYMBOL, AND THE YEAR TO THE PARAGRAPH I JUST CREATED
copyright.innerHTML =  author + ' \u00A9 ' + thisYear;

//ADDING THE NEW PARAGRAPH TO THE FOOTER
footer.appendChild(copyright);

/*--------------------------------- WEEK 13 ---------------------------------------------------*/
/*-------- FETCHING DATA FROM OPEN METEO -------------------------------*/

fetch("https://api.open-meteo.com/v1/forecast?latitude=42.35&longitude=71.05&hourly=temperature_2m&timezone=America%2FNew_York")
    //HANDLING THE RESPONSE
    .then(response =>{
        if(!response.ok){ //IF THERE IS A PROBLEM FETCHING THE INFO THEN THROW AN ERROR
            throw new Error(`Request for information about weather failed: ${response.status}`);
        }
        return response.json(); //PARSING JSON RESPONSE INTO A JS OBJECT
    })
    //HANDLING THE PARSED DATA
    .then(data => {
        //UNCOMENT FOR DEBUGGING PURSOSES ONLY: SEEING WHAT DATA LOOKS LIKE
        //console.log(data.latitude);
        const weatherSection = document.getElementById('weather');
        let paragraphs=[];
        for (let i=0; i<6; i++){
            paragraphs[i]=document.createElement('p');
        }
        paragraphs[0].innerHTML="City: Boston";
        paragraphs[1].innerHTML=`Latitude: ${data.latitude}`;
        paragraphs[2].innerHTML=`Longitude: ${data.longitude}`;
        paragraphs[3].innerHTML=`Time Zone: ${data.timezone_abbreviation} (${data.timezone})`;
        paragraphs[4].innerHTML=`Data (Hourly): ${data.hourly.time}`;
        paragraphs[5].innerHTML=`Data (Temperature): ${data.hourly.temperature_2m}`;
        for (let i=0; i<6; i++){
            weatherSection.append(paragraphs[i]);
        }
    })
    //HANDLING ERRORS WHILE FETCHING DATA FROM GITHUB
    .catch(error => console.error(error));