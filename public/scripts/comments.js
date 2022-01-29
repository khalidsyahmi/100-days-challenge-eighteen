//getElements
const loadCommentsElement = document.getElementById("load-comments"); //get btn dataset
const commentSection = document.getElementById("comments"); //get comment section
const commentForm = document.querySelector("#comments-form form"); // form only
const commentTitle = document.getElementById("title");
const commentText = document.getElementById("text");

// functions //

//don't forget the parameter from the get request
function createComment(comments) {
  // creates ol
  const commentOrderedList = document.createElement("ol");

  for (const comment of comments) {
    const commentList = document.createElement("li");
    //new HTML structure
    commentList.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>
    `;
    commentOrderedList.appendChild(commentList); //attach li to ol
  }

  return commentOrderedList;
}

//this is an Ajax driven request
async function showComment() {
  // extract btn for the dataset
  //letsavoid Uppercase data attributes here
  const postID = loadCommentsElement.dataset.postid; //no promises

  //connection error
  try {
    //send get route request via fetch()
    const response = await fetch(`/posts/${postID}/comments`); //is promise
    //technical error
    if (!response.ok) {
      alert("cannot fetch comments");
      return;
    } else {
      const jsonData = await response.json(); //is promise //decode json to js
      //console.log(jsonData);

      //falsy
      //also try truthy handling
      if (!jsonData || jsonData.length === 0) {
        commentSection.firstElementChild.textContent =
          "There are still no comments available! Go ahead and add new comment";
      } else {
        //pass data to the created JS to HTML element
        const createdComment = createComment(jsonData);
        //wipe everything in the comment section tag
        commentSection.innerHTML = "";
        //finally update the blank comment section with the appended createdComment()
        commentSection.appendChild(createdComment);
      }
    }
  } catch (err) {
    alert("Connection to comments is lost");
  }
}

//extract form data using JavaScript
//the POST request
async function saveComment(event) {
  event.preventDefault();
  const formID = commentForm.dataset.formid;

  //value from input
  const enteredTitle = commentTitle.value;
  const enteredText = commentText.value;

  const commentAttribute = { title: enteredTitle, text: enteredText };

  //try catch //response didn't rach server
  //connection error
  try {
    //encode into saveComment()
    const fetchComment = await fetch(`/posts/${formID}/comments`, {
      method: "POST",
      body: JSON.stringify(commentAttribute),
      headers: {
        "Content-Type": "application/json",
      },
    }); //fetch() modified into post request

    //technical error
    if (fetchComment.ok) {
      //pre-launch showComment function here
      showComment();
    } else {
      alert("Could not send new comment. server crashed!");
    }
  } catch (err) {
    alert("could not create comment. Connection is lost!");
  }
}

//listeners
loadCommentsElement.addEventListener("click", showComment);
commentForm.addEventListener("submit", saveComment);
