var ref = new Firebase("https://commenting-system-33924.firebaseio.com/");

// Thanks to https://gist.github.com/hurjas/2660489#file-timestamp-js-L26
function timeStamp() {
    var now = new Date();
    var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    var time = [now.getHours(), now.getMinutes()];
    var suffix = (time[0] < 12) ? "AM" : "PM";
    time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }

    return date.join("/") + ", " + time.join(":") + " " + suffix;
}

function postComment() {
    var name = document.getElementById("name").value,
        comment = document.getElementById("comment").value,
        time = timeStamp();

    if (name && comment) {
        ref.push({
            name: name,
            comment: comment,
            time: time
        });
    }

    document.getElementById("name").value = '';
    document.getElementById("comment").value = '';

    event.preventDefault(); // prevents default actions
}

ref.on("child_added", function (snapshot) {
    var myUserID = null;

    var comment = snapshot.val();

    var name = comment.name;
    var timeStamp = comment.time;
    var comment = comment.comment;

    //comment.time = timeStamp(); //jQuery.timeago(new Date(comment.time));
    var newDiv = $("<div/>").addClass("comment").attr("id", snapshot.key()).prependTo("#comments");
    newDiv.html('<hr><h4>' + name + ' says<span class="timestamp">' + timeStamp + '</span></h4><p>' + comment + '</p>')
    //newDiv.html(Mustache.to_html($('#template').html(), comment));
    // If the comment owner is logged in, he can view the remove the comment option.
    $(".editCom").hide();
    $(".oCom[userid='" + myUserID + "']").children(".editCom").show();
    if (myUserID === null) {
        $(".comReply").hide();
    } else {
        $(".comReply").show();
    }
    //$("#" + snapshot.key() + " p").replaceWith("<p>" + body.replace(/\n/g, "<br>") + "</p>");
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Reloads MathJax

    //addComment(comment.name, comment.comment, comment.time);
    //MathJax.Hub.Queue(["Typeset", MathJax.Hub]); // Reloads MathJax
});

function addComment(name, comment, timeStamp) {
    var comments = document.getElementById("comments");
    comments.innerHTML = "<hr><h4>" + name + " says<span class='timestamp'>" + timeStamp + "</span></h4><p>" + comment + "</p>" + comments.innerHTML;
}