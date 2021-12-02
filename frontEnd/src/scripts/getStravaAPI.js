import React, { useEffect, useState }  from "react";

function FetchAPI (){

const apiGet =()=>{
    fetch('https://www.strava.com/api/v3/athlete')
    .then((response)=>response.json())
    .then((json)=>console.log(json))
}
return(
<div> 

    <button className="waveButton" onClick={apiGet}>Fetch API</button>
</div>

)
    
}
export default FetchAPI