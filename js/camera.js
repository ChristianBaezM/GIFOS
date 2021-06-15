const recordButton = document.querySelector('.record');
recordButton.addEventListener( "click" , askPermission );
const steps = document.querySelectorAll('.steps span');
const timer = document.querySelector('.timer');
const cardVideo = document.querySelector('.video-card');
timer.addEventListener( "click" , repeatCapture )

const loading = document.querySelector('.loading');
const buttons = document.querySelector('.video-card .buttons');
const uploadText = document.querySelector('.upload-text');
const linkButton = document.querySelector('.link-button');
function askPermission(event) {

    const h2 = document.querySelector('.create-gif-title');
    const p = document.querySelector('.create-gif-text');
    let button = event.target.textContent

    switch(button) {
        case "COMENZAR":
        case "REPETIR CAPTURA":
            h2.innerHTML = "¿Nos das acceso <br>a tu cámara?";
            p.innerHTML = "El acceso a tu camara será válido sólo <br>por el tiempo en el que estés creando el GIFO."
            recordButton.classList.add('hide');
            timer.classList.remove('display');
            steps[0].classList.add('selected');
            useCamera();
            break
        case "GRABAR":
            recorder.startRecording();
            break;
        case "FINALIZAR":
            stopTimer();
            recordButton.textContent = "SUBIR GIFO";
            timer.textContent = "REPETIR CAPTURA"
            recorder.stopRecording( () => {

                let form = new FormData();
                let time = timeN();
                title = `My Gif ${time}` // Global to set the GIF Object title
                form.append('file', recorder.getBlob(), `${title}.gif`);
                file = form.get('file');
            })
            break;
        case "SUBIR GIFO":
            uploadGif(file);
            recordButton.classList.add('hide');
            steps[1].classList.remove('selected');
            steps[2].classList.add('selected');
            timer.classList.remove('display');
            cardVideo.classList.add('display-flex');
            loading.classList.remove('loaded'); //Change card icon
            buttons.classList.remove('flex'); //Display buttons
            uploadText.textContent = "Estamos subiendo tu GIFO";
            break;
    }
}

function useCamera () {

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
        height: { max: 480 }
        }
    })
    .then( function(stream) {

        const video = document.querySelector('video');
        video.srcObject = stream;
        video.play();

        recordButton.classList.remove('hide');
        recordButton.textContent = "GRABAR";
        steps[0].classList.remove('selected');
        steps[1].classList.add('selected');

        recorder = RecordRTC( stream , {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log('started');
                startTimer();
            },
        });
    })
}

function startTimer () {
    h = 0, m = 0, s = 0;
    timer.textContent = "00:00:00";
    timer.classList.add('display');
    recordButton.textContent = "FINALIZAR";
    timerObject = setInterval( eachSecond , 1000 );
}

function stopTimer () {
    clearInterval(timerObject);
}

function eachSecond() {

    s++;

    if (s>59){m++;s=0;}
    if (m>59){h++;m=0;}
    if (h>24){h=0;}

    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}
    if (h<10){hAux="0"+h;}else{hAux=h;}

    timer.textContent = `${hAux}:${mAux}:${sAux}`
}

function uploadGif(file) {

    let formdata = new FormData();
    formdata.append("api_key", "7lxQjsbM6jE4iDEC1vs8DoDfcKBDGFte");
    formdata.append("file", file);
    formdata.append("username", "christianbaezm");

    let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://upload.giphy.com/v1/gifs", requestOptions)
    .then(response => response.json())
    .then(result => {

        let id = result.data.id;
        loading.classList.add('loaded'); //Change card icon
        uploadText.textContent = "GIFO subido con éxito";
        linkButton.href = `https://giphy.com/gifs/${id}`
        linkButton.target = "_blank";
        fetchId( id );

    })
    .catch(error => console.log('error', error));
}

function fetchId( gif_id ) {
    
    fetch (`${url}/gifs/${gif_id}?api_key=${api_key}`)
    .then( response => response.json() )
    .then( result => {

        let gif = result.data;
        gif.title = title;
        let gifObject = createGifObject( gif , "upload");
        let value = JSON.stringify( gifObject );
        localStorage.setItem( gif.id , value );
        const downloadButton = document.querySelector(".video-card .download-button");
        configureDownload( gifObject , downloadButton );
        buttons.classList.add('flex'); //Display buttons
    } )
}

function repeatCapture( event ) {
    let content = event.target.textContent;
    if (content == "REPETIR CAPTURA") askPermission(event);
}

function timeN() {
    let time = new Date();
    return `${time.getHours()}${time.getMinutes()}${time.getSeconds()}`;
}