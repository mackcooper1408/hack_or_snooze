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
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <i class="far fa-star"></i> 
        <a href="${story.url}" target="a_blank" class="story-link">
       ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
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

  console.log("current list of stories, ", storyList.stories);
  console.debug("addStory");

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
    let $starIcon = $story.children().first();
    console.log($starIcon);

    $starIcon.toggleClass("fas");
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


function toggleStoryFav(evt) {
  let $favIcon = $(evt.target);
 console.log("fav star clicked!");
  $favIcon.toggleClass("fas");

  let favStoryId = $favIcon.parent().attr("id");

  if ($favIcon.hasClass("fas")) {
    currentUser.addNewFavorite(currentUser.loginToken, currentUser.username, favStoryId);
  }
  else {
    currentUser.deleteFavorite(currentUser.loginToken, currentUser.username, favStoryId);
  }
}


https://hack-or-snooze-v3.herokuapp.com/users/hueter/favorites/32d336da-98cd-4010-bb39-1d789b9bef50

$("#all-stories-list").on("click", ".fa-star", toggleStoryFav);