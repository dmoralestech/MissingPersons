# API

## Environmen variables

|  Name  | Type | Description |
|---|---|---|
| PORT | number | The port number the api will run on |
| NODE_ENV | string | THe environment to run in development, test, production |
| DATABASE | string | The url to the mongodb |
| JWTPASSWORD | string | The password to use for the JWT token |
        
         
        
        
## Installations      
 
if you get this error, 
 
```
 { Error: Cannot find module '../build/Release/bson'
```

execute the following...

```bash
npm config set python python2.7
npm cache clean
rm -rf node_modules
npm install node-gyp -g 
# npm install mongodb --mongodb:native -g
npm install
```
