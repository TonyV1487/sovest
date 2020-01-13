$(document).ready(function () {

  initGraph();
  $("#init").hide();

  let closeAnfStock = [];
  let closeJwnStock = [];
  let closeEbayStock = [];
  var date = [];

  // Pull API key from .env
  $.ajax({
    url: "/api/iex",
    method: "GET"
  }).then(function (response) {
    var iexcloudKeyInit = response.apiKeySandbox;
    console.log(iexcloudKeyInit);

    var queryUrl = `https://sandbox.iexapis.com/stable/stock/market/batch?symbols=anf,jwn,ebay&types=chart&range=1m&last=5&token=${iexcloudKeyInit}`;
    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(function (response) {
      let ANF = response.ANF.chart;
      let JWN = response.JWN.chart;
      let EBAY = response.EBAY.chart;

      for (let i = 0; i < ANF.length; i++) {
        closeAnfStock.push(ANF[i].close);
        date.push(ANF[i].label);
      }

      for (let i = 0; i < JWN.length; i++) {
        closeJwnStock.push(JWN[i].close);
      }
      for (let i = 0; i < EBAY.length; i++) {
        closeEbayStock.push(EBAY[i].close);
      }

      $.ajax({
        url: "/api/influcencerposts/kellyinthecity",
        method: "GET"
      }).then(function (dbResponse) {
        console.log(dbResponse);
        //console.log(dbResponse.igPostArray[0].inf_name);
      })

      var ctx = document.getElementById("myChart").getContext("2d");
      // console.log(data);
      var myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: date,
          datasets: [
            {
              label: "Abercrombie",
              fill: false,
              data: closeAnfStock,
              backgroundColor: ["rgba(255, 159, 64, 0.2)"],
              borderColor: ["rgba(103,130, 91,1)"],
              borderWidth: 3
            },
            {
              label: "Nordstrom",
              fill: false,
              data: closeJwnStock,
              backgroundColor: ["rgba(255, 159, 64, 0.2)"],
              borderColor: ["rgba(133,144,101,1)"],
              borderWidth: 3
            },
            {
              label: "Ebay",
              fill: false,
              data: closeEbayStock,
              backgroundColor: ["rgba(255, 159, 64, 0.2)"],
              borderColor: ["rgba( 50,118,101,1)"],
              borderWidth: 3
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                  // instead of beginAtZero we can define ints for 'min' and 'max' values
                }
              }
            ]
          }
        }
      });
    });
  });

  $("#cards").hide();

  //call influencers table SELECT *
  $("#inflBtn").on("click", function (event) {
    $("#cards").toggle();
  });

  //enter an influencer into the db
  $("#addBtn").on("click", function (event) {
    let newInfl = {
      inf_name: $("#nameInput")
        .val()
        .trim(),
      ig_handle: $("#handleInput")
        .val()
        .trim()
    };

    $.ajax("/api/influencers", {
      type: "POST",
      data: newInfl
    }).then(function () {
      $('#nameInput').val('');
      $("#handleInput").val('');
    });
  });

  $("#init").on("click", function (event) {

    location.reload();
  });

});



function initGraph() {

  $(".js-hook").on("click", function (event) {
    $("#init").show();

    var getCode = $(this).attr("data-code");
    console.log(getCode)
    var closeStock = [];
    var date = [];
    var getColor = '';

    // Pull API key from .env
    $.ajax({
      url: "/api/iex",
      method: "GET"
    }).then(function (response) {
      iexcloudKey = response.apiKey;

      var queryUrl = `https://cloud.iexapis.com/stable/stock/${getCode}/chart?token=${iexcloudKey}`;

      $.ajax({
        url: queryUrl,
        method: "GET"
      }).then(function (response) {
        for (var i = 0; i < response.length; i++) {
          //   console.log(response[i].close);
          closeStock.push(response[i].close);
          date.push(response[i].label);
        }

        if (getCode === "ANF"){
          getColor = ["rgba(103,130, 91,1)"]
          console.log(getColor)
        }
        if (getCode === "JWN"){
          getColor = ["rgba(133,144,101,1)"]
          console.log(getColor)

        }
        if (getCode === "EBAY"){
          getColor = ["rgba( 50,118,101,1)"]
          console.log(getColor)
        }

        var ctx = document.getElementById("myChart").getContext("2d");
        //console.log(data);
        console.log(closeStock);
        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: date,
            datasets: [
              {
                label: getCode,
                fill: false,
                data: closeStock,
                backgroundColor: ["rgba(255, 159, 64, 0.2)"],
                borderColor: getColor,
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                    // instead of beginAtZero we can define ints for 'min' and 'max' values
                  }
                }
              ]
            }
          }
        });
      });
    });
  });
}