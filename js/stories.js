// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();

}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup");
  let starFill = "";
  let deleteIcon = "";
  let editIcon = "";
  const hostName = story.getHostName();


  if (currentUser && currentUser.favorites.some((obj) => obj.storyId === story.storyId)) {
    starFill = "fas";
  };

  if (currentUser && currentUser.ownStories.some((obj) => obj.storyId === story.storyId) && currNavTab === "myStories") {
    deleteIcon = `<i class="fas fa-trash-alt"></i>`;
    editIcon = `<i class="fas fa-edit"></i>`;
  };


  return $(`
      <li id="${story.storyId}">
      ${deleteIcon}
          <i class="far ${starFill} fa-star"></i> 
            <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            ${editIcon}
            <small class="story-user">posted by ${story.username}</small>
            </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(evt) {
  evt.preventDefault();

  let author = $("#author").val();
  let title = $("#title").val();
  let url = $("#story-url").val();

  let newStory = {
    author,
    title,
    url
  };

  await storyList.addStory(currentUser, newStory);

  currNavTab = "";

  putStoriesOnPage();

  $storyForm.hide();

  evt.target.reset();
}

$storyForm.on("submit", submitNewStory);

function putOwnStoriesOnPage() {
  console.debug("putOwnStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them

  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);

    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


function toggleStoryFav(evt) {
  let $favIcon = $(evt.target);
  $favIcon.toggleClass("fas");

  let favStoryId = $favIcon.parent().attr("id");

  if ($favIcon.hasClass("fas")) {
    currentUser.addNewFavorite(favStoryId);

  }
  else {
    currentUser.deleteFavorite(favStoryId);
  }
}

$("#all-stories-list").on("click", ".fa-star", toggleStoryFav);

function deleteStory(evt) {
  let $deleteIcon = $(evt.target);
  let storyId = $deleteIcon.parent().attr("id");
  
  currentUser.deleteUserStory(storyId);
  currentUser.ownStories = currentUser.ownStories.filter((story) => story.storyId !== storyId);
  currentUser.favorites = currentUser.favorites.filter((story) => story.storyId !== storyId);
  storyList.stories = storyList.stories.filter((story) => story.storyId !== storyId);
  
  putOwnStoriesOnPage();
}

$("#all-stories-list").on("click", ".fa-trash-alt", deleteStory);

function editStory(evt) {
  const $editIcon = $(evt.target);
  const story = $editIcon.parent();
  const storyId = $editIcon.parent().attr("id");

  const editStory = currentUser.ownStories.find((story)=> story.storyId === storyId);
  storyList.editStory(currentUser, editStory)

  
}

$("#all-stories-list").on("click", ".fa-edit", editStory);
