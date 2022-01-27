//getElements
const loadCommentsElement = document.getElementById("load-comments"); //get btn dataset
const commentSection = document.getElementById("comments"); //get comment section
const commentForm = document.querySelector("#comments-form form");
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
  //send get route request via fetch()
  const postData = await fetch(`/posts/${postID}/comments`); //is promise
  const jsonData = await postData.json(); //is promise //decode json to js
  console.log(jsonData);

  //pass data to the created JS to HTML element
  const createdComment = createComment(jsonData);
  //wipe everything in the comment section tag
  commentSection.innerHTML = "";
  //finally update the blank comment section with the appended createdComment()
  commentSection.appendChild(createdComment);
}

function saveComment(event) {
  event.preventDefault();
  const formID = commentForm.dataset.formid;

  //value from input
  const enteredTitle = commentTitle.value;
  const enteredText = commentText.value;

  const commentAttribute = { title: enteredTitle, text: enteredText };

  fetch(`/posts/${formID}/comments`, {
    method: "POST",
    body: JSON.stringify(commentAttribute),
    headers: {
      "Content-Type": "application/json",
    },
  }); //fetch() modified into post request
}

//listeners
loadCommentsElement.addEventListener("click", showComment);
commentForm.addEventListener("submit", saveComment);
