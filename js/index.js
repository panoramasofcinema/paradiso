
// REQUEST THE MAIN INDEX
let url = "https://panoramas-of-cinema.s3.eu-central-1.amazonaws.com/indexes/paradiso_index.json";
fetch(url)
    .then(function (index) {
        return index.json();
    })
    .then(function (data) {
        console.log("Movies in Paradiso: " + data.index.length)
        appendData(data.index.sort());
    })
    .catch(function (err) {
        window.alert("Something went wrong.");
    });

function appendData(data) {
    var mainContainer = document.getElementById("movie_list");

    for (var i = 0; i < data.length; i++) {
        var li = document.createElement("li");
        mainContainer.appendChild(li);

        li.classList.add("li_element");
        moviename = data[i].split('_').join(' ').toUpperCase();
        li.innerHTML =
            '<span class="list_element item" id=' + data[i] + '">' + moviename + '</span>';
        // on click 1
        li.setAttribute("onclick", "clickMovie()");
        // on click 2
        li.addEventListener("click", function () {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
            document.querySelector('.active').scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'smooth'
            });
        });
    }

    // RANDOM SELECT ONE MOVIE AND MOVE THE ROLODEX
    var listlist = document.querySelectorAll('li');
    var listrnd = Math.floor(Math.random() * listlist.length);
    listlist[listrnd].classList.add("active");
    document.querySelector('.active').scrollIntoView({
        block: 'center',
        inline: 'center'
    });

    // REQUEST THE VIDEO TO PLAY
    thisFrame = Math.floor(Math.random() * 80000);
    var act = document.querySelector('.active').innerText;
    const srtAct = act.replaceAll(' ', '_').toLowerCase();
    let movs_url = 'https://clips.panoramasofcinema.ch/clip?movie=' + srtAct + '&frame=' + (10000 + thisFrame);
    fetch(movs_url)
        .then(function (play) {
            return play.json();
        })
        .then(function (data) {
            if (data.play.length == 0) {
                window.alert("No videos here.");
            } else {
                playVideo(data.play, srtAct);
            }
        })
        .catch(function (err) {
            window.alert("Something went wrong.");
        });
}

function clickMovie(e) {
    // DELETE VIDEO TAG
    var vid_backg = document.getElementById("myVideo");
    vid_backg.remove();

    // CREATE VIDEO TAG
    var newvid = document.createElement('video');
    newvid.setAttribute("id", "myVideo");
    newvid.setAttribute("muted", "");
    newvid.setAttribute("loop", "");
    newvid.setAttribute("playsinline", "");
    newvid.setAttribute("autoplay", "");
    document.body.insertAdjacentElement('afterbegin', newvid);

    // REQUEST NEW VID
    e = e || window.event;
    var movname = e.srcElement.innerText;
    thisFrame = Math.floor(Math.random() * 80000);
    const srtAct = movname.replaceAll(' ', '_').toLowerCase();
    let movs_url = 'https://clips.panoramasofcinema.ch/clip?movie=' + srtAct + '&frame=' + (10000 + thisFrame);

    fetch(movs_url)
        .then(function (play) {
            return play.json();
        })
        .then(function (data) {
            if (data.play.length == 0) {
                window.alert("No videos here.");
            } else {
                playVideo(data.play, srtAct);
                document.getElementById("myVideo").muted = true;
            }
        })
        .catch(function (err) {
            window.alert("Something went wrong.");
        });
}

function playVideo(data, act) {
    var vid_backg = document.getElementById("myVideo");
    var vidsource = document.createElement("source");
    vidsource.setAttribute("src", data);
    vid_backg.appendChild(vidsource);

    // & DOWNLOAD LINK
    document.getElementById("movie_link").setAttribute('data-movie', act);
}

function getLink() {
    // CLOSE MODAL
    var modal = document.getElementById("terms-modal");
    modal.style.display = "none";

    var thisMov = document.getElementById("movie_link").dataset.movie;
    // REQUEST LINK
    fetch("https://clips.panoramasofcinema.ch/link?movie=" + thisMov)
        .then(function (index) {
            return index.json();
        })
        .then(function (data) {
            window.open(data.link, '_blank');
        })
        .catch(function (err) {
            window.alert("Something went wrong.");
        });
}

function terms() {
    var modal = document.getElementById("terms-modal");
    modal.style.display = "block";
}