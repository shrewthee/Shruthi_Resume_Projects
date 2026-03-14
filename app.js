
// const getData = async () => {
//     const response = await fetch("https://api.sampleapis.com/coffee/hot");
//     const data = await response.json();
//     console.log("REST Output:" + data); // json data
//     const outputs = [];

//     data.map(item => {

//         var row = "<div class='row' style='padding:20px'>  <div class='col-md-3'>   <img src='" + item.image + "' alt= '" + item.title + "' class='image-size d-block mx-auto img-fluid' > </div> <div class='col-md-9'> <p>" + item.title + " </p><p>" + item.description + "</p> </div></div>";
//         outputs.push(row)
//     }
//     );
//     $('#center-3-component').html(outputs)

// }


const getAccordionData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ed89a27d429248af8a83cccc4e2627b7");
    const bData = await response.json();
    console.log("REST Shruthi Output:" + bData);

    var output = []

       for (let i = 0; i < 5; i++) {
            console.log("First five items: (" + i + ")" + bData.articles[i].title);
            if (bData.articles[i].title !== "[Removed]")
            {

                let headerid = 'heading' + i;
                let collapseid = 'collapse' +i;
                let collapseidhash = '#collapse' +i;
                output.push (`
                       
                          <div class="accordion-item">
                              <h2 class="accordion-header" id=${headerid}>
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target=${collapseidhash} aria-expanded="true" aria-controls=${collapseid}>
                                  Accordion Item #1
                                </button>
                              </h2>
                              <div id=${collapseid} class="accordion-collapse collapse show" aria-labelledby=${headerid} data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                  <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                </div>
                              </div>
                            </div>

                  `)


            }

      }


    $('#accordion-data').html(output);
}


const getQuickLinksData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ed89a27d429248af8a83cccc4e2627b7");
    const bData = await response.json();
    console.log("REST Shruthi Output:" + bData);

    var output = []

       for (let i = 0; i < 10; i++) {
            console.log("First five items: (" + i + ")" + bData.articles[i].title);
            if (bData.articles[i].title !== "[Removed]")
            {
                output.push (`
                    <a href=${bData.articles[i].url} target="_blank">
                    <li class="list-group-item">${bData.articles[i].title}</li>
                    </a>
                  `)
            }

      }


    $('#quicklinks-data').html(output);
}

const getCardData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ed89a27d429248af8a83cccc4e2627b7");
    const bData = await response.json();
    console.log("REST Shruthi Output:" + bData);

    var output = []

    output.push(`
          <div class="card" style="width: 18rem;">
                    <img src=${bData.articles[0].urlToImage} class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${bData.articles[0].title}</h5>
                      <p class="card-text">${bData.articles[0].description}</p>
                      <a href=${bData.articles[0].url} class="btn btn-primary">Go to the article</a>
                    </div>
                  </div>
    
    `)

    $('#card-data').html(output);
}

const getCarouselData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ed89a27d429248af8a83cccc4e2627b7");
    const bData = await response.json();
    console.log("REST Shruthi Output:" + bData);

    var output = []

    output.push(`
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="true">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
          <div class="row">
            <div class="col-md-5">
                <img src="./images/image_1.avif" class="d-block w-100 img-fluid" alt="...">
            </div>
            <div class="col-md-7">
                <p>${bData.articles[0].title} </p>
                <p>${bData.articles[0].description}</p>
            </div>
           </div>
          </div>
          <div class="carousel-item">
          <div class="row">
             <div class="col-md-5">
              <img src="./images/image_2.avif" class="d-block w-100 img-fluid" alt="...">
            </div>
            <div class="col-md-7">
                <p>${bData.articles[1].title} </p>
                <p>${bData.articles[1].description}</p>
            </div>
            </div>
          </div>
          <div class="carousel-item">
          <div class="row">
             <div class="col-md-5">
                <img src="./images/image_3.avif" class="d-block w-100 img-fluid" alt="...">
            </div>
            <div class="col-md-7">
                <p>${bData.articles[2].title} </p>
                <p>${bData.articles[2].description}</p>
            </div>
          </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    
    `)


    $('#carousel-data').html(output);
}


const getBusinessData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ed89a27d429248af8a83cccc4e2627b7");
    const bData = await response.json();
    console.log("REST Shruthi Output:" + bData);

    var output2 = []
    bData.articles.map(item => {

        output2.push(
            `
            <div class = "row mt-4">
                <div class = "col-md-9"> 
                    <div class = "row"> 
                    <a href = ${item.url}><p style = "font-size:16px;">${item.title}</p></a>
                    </div>
                    <div class = "row"> 
                        <p class = "author-style"> ${item.author}</p>
                    </div>
                    <div class = "row"> 
                        <p>${item.description}</p>
                    </div>
                </div>

                <div class = "col-md-3">
                    <img class = "img-fluid" src = ${item.urlToImage}/>
                </div>

            </div>
            `
        )
    })

    $('#left-col-data').html(output2);
}

const getLatestTeslaData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=ed89a27d429248af8a83cccc4e2627b7");
    const iData = await response.json();
    console.log("REST Shruthi Output:" + iData); // json data

    var output1 = []
    iData.articles.map(item => {


        console.log(item.urlToImage);
        output1.push(`
            <div class="row mt-4">
                <div class="col-md-3"> <img class="img-fluid" src=${item.urlToImage} />
                </div>
                <div class="col-md-9"> 
                    <div class="row">
                    <a href=${item.url}><p style="font-size:16px">${item.title}</p></a>
                    </div>
                    <div class="row">
                    <p class="author-style">${item.author}</p>
                    </div>
                    <div class="row">
                    <p>${item.description}</p>
                    </div>
            
                </div>
            
            </div>`

        )
    });

    $('#right-column-data').html(output1);

}

const getNewsData = async () => {
    const response = await fetch("https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=ed89a27d429248af8a83cccc4e2627b7");
    const data = await response.json();
    console.log("REST Output:" + data); // json data

    var output = []
    data.articles.map(item => {
        console.log(item.title);
        output.push('<a target="_blank" href="' + item.url + '" > <li class="list-group-item">' + item.title + '</li> </a>')
    });

    $('#list-content').html(output);

}


function myFunction() {

    let emailValue = $('#exampleInputEmail1').val();
    //document.getElementById("exampleInputEmail1").value
    if (emailValue) {
        alert("Your Email address is: " + emailValue);
    }
}


$(document).ready(function () {

    //getNewsData();
    // getLatestTeslaData();
    // getBusinessData();
    getQuickLinksData();
    getCarouselData();
    getCardData();
    getAccordionData();
});




