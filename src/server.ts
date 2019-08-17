import {app} from './';
const port = process.env.PORT || 8080;

// start the Express server
app.listen(port, () => {

  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }` );
});
