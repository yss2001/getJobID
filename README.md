# FRONT END:
The App.js file acts as an anchor to travel around. Data is passed around through props. If sign in is successful, then the userID is sent to App.js, which 
then branches off to Profile Page. Clicking the tabs at the top acts as a navigation system in a similar method.

In Profile, the few textboxes are provided for editing, which are saved upon clicking the update button. In Dashboard, a search box sends the string to the 
server, where the json data is filtered by an 'includes' method. The other filters act on the data already received by the front end. The listings itself are
shown in a table. The data also is formatted at the server with information such as whether the user applied for it or not. In Applications, a request to
the server is made to search and retrieve the applications as long as job is not deleted. In this request itself the total number of active applications
that the user has made is updated in the database. If accepted into a job, the user is given a chance to rate him only once.

Company's Employee page is similiar to the application page, with rating option available only once. In Create Listing page, a form with a few required fields
is presented, which upon submission is pushed into the database by the server. In the Active Listings page, as long as a job is not deleted or all vacancies
have been filled, it is visible. A few editable textboxes are present, and edit button pushes these changes. A button will redirect to a tabular form of all
applications to that job, with a reject or accept option.

# BACK END:
For registration, a hashed password is stored using bcrypt. The same is used for comparing sign in attempts.

Both requests for profile are trivial - edit requests just have a 'put' endpoint to update database.
A request for viewing user applications are also trivial - when the listing is rated, however, the calculation is done in the backend and appropriate fields
in the listing document are updated. The same applies for Employee details request from the company side.
A request for dashboard is filtered through the search string. Additional database collections are checked before sending the final data to check whether the
user had applied to a particular job already.
Upon hitting Apply, the SOP is also received in a POST api, where a simple insert to the collection is done.

When company creates a listing, the backend assigns it a new listID for bookkeeping and then inserts. This is simply the length of total listings. When a listing is deleted, all the listIDs of others are also decreased, if applicable.

Since listings and applications are two different collections, they are linked with userID and listID in the backend when the company views the active applications for the job. Looping through the records, the relevant documents are made into json and shown to the recruiter. When he hits Reject, the status in the document is changed and the active applications of the user decreased. When accepted, number of vacancies decrease, and the user is given the status of an employee.