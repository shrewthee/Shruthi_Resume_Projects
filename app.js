
const getData = async () => {
    const response = await fetch("https://api.sampleapis.com/coffee/hot");
    const data = await response.json();
    console.log("REST Output:" + data); // json data
    const outputs = [];

    data.map(item => {

        var row = "<div class='row' style='padding:20px'>  <div class='col-md-3'>   <img src='" + item.image + "' alt= '" + item.title + "' class='image-size d-block mx-auto img-fluid' > </div> <div class='col-md-9'> <p>" + item.title + " </p><p>" + item.description + "</p> </div></div>";
        outputs.push(row)

        //  console.log("Title:" + item.title);
        //  console.log("Descrption:" + item.description);

        //  console.log("Ingrdedients");
        //  item.ingredients.forEach(element => {
        //     console.log( element);

        //  });

    }
    );


    // $('#center-3-component').html("<h1 class='display-6'>Coffee Menu</h1> <hr> " + outputs )
    $('#center-3-component').html(outputs )

}





function myFunction() {

    let emailValue = $('#exampleInputEmail1').val();
    //document.getElementById("exampleInputEmail1").value
    if (emailValue) {
        alert("Your Email address is: " + emailValue);
    }
}


$(document).ready(function () {

    getData();


});




