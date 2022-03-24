var loader = document.getElementById('preloader');

window.addEventListener('load', function(){
    this.setTimeout(loading, 2000);
});

function loading() {
    loader.style.display = 'none';
}

 