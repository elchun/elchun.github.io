function swapAuxCSS(href) {
    document.getElementById("aux_style").setAttribute("href", href);
}
function toFunMode() {
    console.log('here');
    swapAuxCSS("");
    if (window.sessionStorage.getItem('fish') === 'off') {
        document.getElementById('fish_on').click();
    }
    document.getElementById('profile_pic').setAttribute('src', 'resources/loaf.png');
    document.getElementById('name').innerHTML = "Ethan's Super Fun Project Site";
    // document.getElementById('name').innerHTML = "Ethan Chun ['s Super Fun Project Site]";
    document.getElementById('style_button').innerHTML = 'Professional Mode :/';
    window.sessionStorage.setItem("style_mode", "fun");
}
function toProfMode() {
    console.log('here');
    swapAuxCSS('/professional.css');
    if (window.sessionStorage.getItem('fish') === 'on') {
        document.getElementById('fish_on').click();
    }
    document.getElementById('profile_pic').setAttribute('src', 'resources/ethan_profile_1.jpg');
    document.getElementById('name').innerHTML = 'Ethan Chun';
    document.getElementById('style_button').innerHTML = 'Fun mode!';
    window.sessionStorage.setItem("style_mode", "prof");
}
var style_button = document.getElementById('style_button');
style_button.addEventListener('click', function (e) {
    console.log('Switching styles');
    var current_css = document.getElementById("aux_style").href;
    if (current_css.indexOf('prof') !== -1) {
        toFunMode();
    }
    else {
        toProfMode();
    }
});
// addEventListener("load", (e) => {
//     if (window.sessionStorage.getItem('style_mode') == 'fun') {
//         document.getElementById('aux_style').setAttribute('href', '');
//         toFunMode();
//     } else {
//         toProfMode();
//     }
//     //  if (window.sessionStorage.getItem('style_mode') == 'fun') {
//     //     toFunMode();
//     //  } else {
//     //     toProfMode();
//     //  }
// });
if (window.sessionStorage.getItem('style_mode') == 'fun') {
    // document.getElementById('aux_style').setAttribute('href', '');
    toFunMode();
    if (window.sessionStorage.getItem('fish') == 'on') {
        document.getElementById('fish_on').click();
    }
}
else if (window.sessionStorage.getItem('style_mode') == 'prof') {
    toProfMode();
}
else {
    window.sessionStorage.setItem('style_mode', 'fun');
    // window.sessionStorage.setItem('style_mode', 'prof');
    toFunMode();
    document.getElementById('fish_on').click();
    if (window.sessionStorage.getItem('fish') == 'on') {
        document.getElementById('fish_on').click();
    }
    // toProfMode();
}
