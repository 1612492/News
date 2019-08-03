// When the user scrolls the page, execute myFunction 
window.onscroll = function() {stickyNav()};

// Get the navbar
var navbar = document.getElementById("main-menu");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

function stickyNav() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

function expandNav() {
    var x = document.getElementById("nav-menu-container");
    var y = document.getElementById("search");

    if (x.className === "nav-menu" && y.className ==="search") {
        x.className += "-mobile";
        y.className += "-mobile";
    } else {
        x.className = "nav-menu";
        y.className ="search"
    }
}
