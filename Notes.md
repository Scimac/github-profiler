## Project outcomes

### Setting up routes, using react router library

#### Reading local json data
we can read data using fetch api.
```
fetch('./data.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
```

- If your JSON file is hosted externally or located inside the public folder of the project, we can use the fetch() API to access it. This method will not work for JSON files located inside the src folder.

- We have been able to read a local JSON file. But unfortunately, when we run this in a browser, we might get a CORS error.
  Another method we can use aside from making an HTTP request is the import statement. This method has a few complications.We can read this JSON data in JavaScript using the import statement this way:

```
<!---./index.js-->
import data from './data.json';
console.log(data);
```
