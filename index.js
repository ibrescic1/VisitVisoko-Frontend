document.querySelector(".testtt").addEventListener("click", onClick);

function onClick() {
    alert("tesst");
}

var test ={
    godina : 2024,
    ime : "irhad",
    prezime : "brescic",
    jezici: ["html", "css", "js"]
}

addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        alert("enter");
    }
});

$("h1").click(function() {
    $(this).css("color", "red").delay(1000).queue(function(next) {
        $(this).css("color", "black");
        next();
    });
});

$(document).keydown(function(event) {
    console.log(event.key);
});

$("h1").on("click", function() {
    $(this).slideToggle({opacity: 0.5});
});