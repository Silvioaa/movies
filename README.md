This is a simple web application I created to help myself learn Javascript and Object Oriented Programming (OOP).

The application consumes the [Open Movie Database (OMDB) API](http://www.omdbapi.com/) and it can be used to:

* Search for movies, series, episodes and/or games by typing one or more keywords in a search bar.
* Show detailed information about any search result.
* Share a search or detail page's URL by handling the browser's history.

For this webapp I chose not to use third-party libraries such as JQuery or Bootstrap, or frameworks like Angular or React. I think that helped me to consolidate my knowledge on web programming fundamentals, and I also believe it will help me to better understand the value those libraries and frameworks provide. I will learn about those other third-party tools in future projects.

The webapp has two screens, the search screen and the detail screen. These views are created once, and then hidden and shown as the user navigates through them. This also happens when the user uses the browser's back and forward buttons, saving time and bandwidth. 

For example, on the detail screen, the user can go back to the search screen either by the webapp's back button, or the browser's back button. Either way, the detail page is hidden and the search results are shown again. When the user wants to see another search result detail, the detail page is populated with that item's information, and shown again.

The app is organized along the lines of the MVC pattern:
* The model has a single class, `OMDB`. It satisfies the information requests from the rest of the app. The fact that this repository class does this by querying the OMDB API is an implementation detail the rest of the app is not aware of. 

* The view classes are `SearchBarController`, `Pagination`, `Results` and `Detail`, which respectively encapsulate the search bar, the pagination bars, the search results view and the detail view. 
Each of these classes create the part of the UI they encapsulate, and listen to their related UI events, so the events can be delegated to the `UIController` class.

* The controller consists of the `UiController`, which coordinates the work of all the other objects and the application overall. It does so by listening to all the events provided by the other objects, and delegating work to them. 

It also controls the popstate event listener, that either starts the process of creating a search screen, a detail screen or an empty screen, depending on the parameters of the new url. Also, it includes several methods that in turn are used to manage the functions included in the other objects.



